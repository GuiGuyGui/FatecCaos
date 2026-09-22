extends Node

signal server_created
signal joined_server
signal player_connected(peer_id: int, player_info: Dictionary)
signal player_disconnected(peer_id: int)
signal connection_failed
signal server_disconnected

const DEFAULT_PORT: int = 7777
const MAX_PLAYERS: int = 10

var peer: MultiplayerPeer = null
var players: Dictionary = {} # peer_id: int -> player_info: Dictionary

var connected_players: Array:
	get:
		return players.keys()

var local_player_info: Dictionary = {
	"name": "Jogador 1",
	"hair": 0,
	"torso": 0,
	"accessory": "",
	"primary_weapon": "handgun",
	"secondary_weapon": ""
}

var current_room_code: String = ""
var is_multiplayer_session: bool = false

func is_multiplayer_active() -> bool:
	return is_multiplayer_session and multiplayer.has_multiplayer_peer() and multiplayer.multiplayer_peer != null

func _ready() -> void:
	multiplayer.peer_connected.connect(_on_peer_connected)
	multiplayer.peer_disconnected.connect(_on_peer_disconnected)
	multiplayer.connected_to_server.connect(_on_connected_to_server)
	multiplayer.connection_failed.connect(_on_connection_failed)
	multiplayer.server_disconnected.connect(_on_server_disconnected)

func _update_local_player_info() -> void:
	if FileAccess.file_exists("user://profile.json"):
		var f = FileAccess.open("user://profile.json", FileAccess.READ)
		if f:
			var res = JSON.parse_string(f.get_as_text())
			if typeof(res) == TYPE_DICTIONARY:
				local_player_info["hair"] = res.get("hair", 0)
				local_player_info["torso"] = res.get("torso", 0)
			f.close()
			
	if is_instance_valid(PlayerStatsManager):
		local_player_info["accessory"] = PlayerStatsManager.equipped_accessory
		local_player_info["primary_weapon"] = PlayerStatsManager.starting_primary
		local_player_info["secondary_weapon"] = PlayerStatsManager.starting_secondary

func host_game(port: int = DEFAULT_PORT, max_players: int = MAX_PLAYERS, player_name: String = "Host") -> String:
	_update_local_player_info()
	local_player_info["name"] = player_name
	
	if OS.has_feature("web"):
		var ws_peer = WebSocketMultiplayerPeer.new()
		var err = ws_peer.create_server(port)
		if err != OK:
			push_error("Failed to create WebSocket server: " + str(err))
			return ""
		peer = ws_peer
	else:
		var enet_peer = ENetMultiplayerPeer.new()
		var err = enet_peer.create_server(port, max_players)
		if err != OK:
			push_error("Failed to create ENet server: " + str(err))
			return ""
		peer = enet_peer
		
	multiplayer.multiplayer_peer = peer
	current_room_code = _generate_room_code()
	players.clear()
	players[1] = local_player_info
	is_multiplayer_session = true
	server_created.emit()
	return current_room_code

func join_game(address: String = "127.0.0.1", port: int = DEFAULT_PORT, player_name: String = "Client") -> bool:
	_update_local_player_info()
	local_player_info["name"] = player_name
	
	if OS.has_feature("web"):
		var ws_peer = WebSocketMultiplayerPeer.new()
		var target_url = "ws://" + address + ":" + str(port)
		if address.begins_with("ws://") or address.begins_with("wss://"):
			target_url = address
		var err = ws_peer.create_client(target_url)
		if err != OK:
			push_error("Failed to create WebSocket client: " + str(err))
			return false
		peer = ws_peer
	else:
		var enet_peer = ENetMultiplayerPeer.new()
		var err = enet_peer.create_client(address, port)
		if err != OK:
			push_error("Failed to create ENet client: " + str(err))
			return false
		peer = enet_peer
		
	multiplayer.multiplayer_peer = peer
	players.clear()
	is_multiplayer_session = true
	return true

func close_connection() -> void:
	if peer:
		peer.close()
		multiplayer.multiplayer_peer = null
		peer = null
	players.clear()
	is_multiplayer_session = false
	current_room_code = ""

func _generate_room_code() -> String:
	var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
	var code = "ZKW-"
	for i in range(4):
		code += chars[randi() % chars.length()]
	return code

func _on_peer_connected(id: int) -> void:
	# Send our local player info to the newly connected peer
	_register_player.rpc_id(id, local_player_info)

func _on_peer_disconnected(id: int) -> void:
	players.erase(id)
	player_disconnected.emit(id)

func _on_connected_to_server() -> void:
	var my_id = multiplayer.get_unique_id()
	players[my_id] = local_player_info
	joined_server.emit()

func _on_connection_failed() -> void:
	multiplayer.multiplayer_peer = null
	peer = null
	is_multiplayer_session = false
	connection_failed.emit()

func _on_server_disconnected() -> void:
	multiplayer.multiplayer_peer = null
	peer = null
	players.clear()
	is_multiplayer_session = false
	server_disconnected.emit()

@rpc("any_peer", "reliable")
func _register_player(info: Dictionary) -> void:
	var sender_id = multiplayer.get_remote_sender_id()
	if sender_id == 0:
		sender_id = 1
	players[sender_id] = info
	player_connected.emit(sender_id, info)
	
	if multiplayer.is_server():
		# Share the full roster with all connected peers
		for pid in players:
			if pid != sender_id:
				_register_player.rpc_id(sender_id, players[pid])
				_register_player.rpc_id(pid, info)

func start_network_game(map_scene_path: String = "res://scenes/maps/map_polivalente.tscn") -> void:
	if multiplayer.is_server():
		_rpc_load_map.rpc(map_scene_path)

@rpc("call_local", "reliable")
func _rpc_load_map(map_scene_path: String) -> void:
	get_tree().change_scene_to_file(map_scene_path)

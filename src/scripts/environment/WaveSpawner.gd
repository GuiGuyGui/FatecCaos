extends Node2D
class_name WaveSpawner

@export var zombie_scene: PackedScene = preload("res://scenes/enemies/zombie.tscn")
@export var boss_scene: PackedScene = preload("res://scenes/enemies/boss_zombie.tscn")
var spawn_doors: Array[Node2D] = []
var is_spawning: bool = false
var is_infinite_horde: bool = false

func _ready() -> void:
	add_to_group("wave_spawners")
	GameManager.wave_started.connect(_on_wave_started)
	GameManager.endless_horde_triggered.connect(start_infinite_horde)
	
	_setup_network_players()
	
	# Find all zombie doors in scene
	var bg_tiles = get_parent().get_node_or_null("BackgroundTiles")
	if bg_tiles:
		for child in bg_tiles.get_children():
			if "ZombieDoor" in child.name or "Door" in child.name:
				spawn_doors.append(child)
	
	# Only Server/Host initiates waves
	if not multiplayer.has_multiplayer_peer() or multiplayer.is_server():
		await get_tree().create_timer(1.0).timeout
		GameManager.start_next_wave()

func _setup_network_players() -> void:
	if not multiplayer.has_multiplayer_peer() or NetworkManager.players.size() <= 1:
		var default_p = get_parent().get_node_or_null("Player")
		if default_p and default_p.has_method("setup_multiplayer"):
			default_p.setup_multiplayer(1, NetworkManager.local_player_info)
		return
		
	var default_player = get_parent().get_node_or_null("Player")
	var base_pos = Vector2(0, -10)
	if default_player:
		base_pos = default_player.global_position
		default_player.queue_free()
		
	var player_scene = preload("res://scenes/player/player.tscn")
	var idx = 0
	var total_players = NetworkManager.players.size()
	var start_offset = -((total_players - 1) * 32.0) / 2.0
	for peer_id in NetworkManager.players:
		var p_info = NetworkManager.players[peer_id]
		var p_instance = player_scene.instantiate()
		p_instance.name = "Player_" + str(peer_id)
		p_instance.global_position = base_pos + Vector2(start_offset + idx * 32.0, 0.0)
		get_parent().add_child(p_instance)
		p_instance.setup_multiplayer(peer_id, p_info)
		idx += 1

func _on_wave_started(wave_num: int) -> void:
	_spawn_wave(wave_num)

func _spawn_wave(wave_num: int) -> void:
	if is_infinite_horde or GameManager.is_endless_horde:
		return
	is_spawning = true
	var is_boss_wave = (wave_num % 5 == 0)
	
	# 5 seconds grace preparation period before enemies start spawning
	await get_tree().create_timer(5.0).timeout
	if not is_inside_tree() or not GameManager.wave_in_progress or is_infinite_horde:
		is_spawning = false
		return
	
	# If boss wave, spawn Boss Tank first outside camera view
	if is_boss_wave:
		_spawn_boss(wave_num)

	var total_to_spawn = GameManager.zombies_to_spawn
	if is_boss_wave:
		total_to_spawn = max(1, total_to_spawn - 1)
	
	for i in range(total_to_spawn):
		if not is_inside_tree() or not GameManager.wave_in_progress or is_infinite_horde:
			break
		await get_tree().create_timer(randf_range(1.0, 2.0)).timeout
		_spawn_single_zombie(wave_num)
	
	is_spawning = false
	GameManager._check_wave_completion()

func _get_living_players() -> Array[Player]:
	var list: Array[Player] = []
	var players = get_tree().get_nodes_in_group("players")
	for p in players:
		if p is Player and not p.is_dead:
			list.append(p)
	return list

func _is_outside_all_players_fov(pos: Vector2, living_players: Array[Player]) -> bool:
	const FOV_HALF_X: float = 380.0
	const FOV_HALF_Y: float = 210.0
	
	for p in living_players:
		var dx = abs(pos.x - p.global_position.x)
		var dy = abs(pos.y - p.global_position.y)
		# If within view area on same level/camera frame, it's visible
		if dx < FOV_HALF_X and dy < FOV_HALF_Y:
			return false
	return true

func _get_valid_spawn_pos() -> Vector2:
	var living_players = _get_living_players()
	if living_players.is_empty():
		return Vector2(0, 319.0)
		
	var candidates: Array[Vector2] = []
	
	const MAP_MIN_X: float = -1200.0
	const MAP_MAX_X: float = 1200.0
	
	# Floor heights in multi-floor layouts (Escola Polivalente):
	var floor_heights = [319.0, 160.0, 0.0, -150.0, -320.0, -490.0, -660.0, -830.0, -1000.0, -1200.0, -1400.0, -1600.0]
	
	for p in living_players:
		var p_pos = p.global_position
		
		# 1. Off-screen Left & Right on player's current floor level
		for i in range(3):
			var dist_x = randf_range(440.0, 750.0)
			candidates.append(Vector2(clamp(p_pos.x - dist_x, MAP_MIN_X, MAP_MAX_X), p_pos.y))
			candidates.append(Vector2(clamp(p_pos.x + dist_x, MAP_MIN_X, MAP_MAX_X), p_pos.y))
			
		# 2. Spawns from other floors above/below
		for fh in floor_heights:
			if abs(fh - p_pos.y) > 75.0:
				var fx = clamp(p_pos.x + randf_range(-400.0, 400.0), MAP_MIN_X, MAP_MAX_X)
				candidates.append(Vector2(fx, fh))

	# 3. Behind closed security doors
	var all_doors = get_tree().get_nodes_in_group("doors")
	for d in all_doors:
		if is_instance_valid(d) and d is Door and not d.is_open:
			var door_x = d.global_position.x
			var door_y = d.global_position.y
			for p in living_players:
				var spawn_side_x = door_x + (95.0 if door_x > p.global_position.x else -95.0)
				candidates.append(Vector2(clamp(spawn_side_x, MAP_MIN_X, MAP_MAX_X), door_y))

	# 4. Barricades / Windows
	var barricades = get_tree().get_nodes_in_group("barricades")
	for b in barricades:
		if is_instance_valid(b):
			candidates.append(b.global_position)
			
	# Filter only candidates that are strictly outside ALL players' FOV
	var valid_candidates: Array[Vector2] = []
	for cand in candidates:
		if _is_outside_all_players_fov(cand, living_players):
			valid_candidates.append(cand)
			
	if valid_candidates.size() > 0:
		return valid_candidates[randi() % valid_candidates.size()]
		
	# Fallback: Pick another floor height far from the first player
	var p0 = living_players[0]
	var far_floor = 319.0 if p0.global_position.y < 100.0 else -320.0
	return Vector2(clamp(p0.global_position.x + (520.0 if randf() < 0.5 else -520.0), MAP_MIN_X, MAP_MAX_X), far_floor)

func _spawn_boss(wave_num: int) -> void:
	var boss = boss_scene.instantiate()
	boss.global_position = _get_valid_spawn_pos()
	boss.modulate.a = 0.0
	get_parent().add_child(boss)
	boss.setup_boss(wave_num)
	var tw = boss.create_tween()
	tw.tween_property(boss, "modulate:a", 1.0, 0.4)

func _spawn_single_zombie(wave_num: int) -> void:
	var z = zombie_scene.instantiate()
	
	# Determine zombie type based on wave progression
	var roll = randf()
	var type = "civil"
	
	# Waves 1 to 5: Only 2 basic normal zombie types (Civilian Walkers & Crawlers)
	if wave_num <= 5:
		if roll < 0.25:
			type = "crawler"
		else:
			type = "civil"
	else:
		# Wave 6+: Special variations unlock progressively
		if wave_num >= 9 and roll < 0.12:
			type = "mummy"
		elif wave_num >= 8 and roll < 0.22:
			type = "fat"
		elif wave_num >= 8 and roll < 0.32:
			type = "hillbilly"
		elif wave_num >= 7 and roll < 0.44:
			type = "swat"
		elif wave_num >= 6 and roll < 0.58:
			type = "rover" # Cão Zumbi
		elif wave_num >= 6 and roll < 0.72:
			type = "crazy" # Zumbi Corredor
		elif wave_num >= 6 and roll < 0.82:
			type = "cop"   # Zumbi Policial
		elif wave_num >= 6 and roll < 0.90:
			type = "doctor"
		elif roll < 0.96:
			type = "crawler"
		else:
			type = "civil"

	z.global_position = _get_valid_spawn_pos()
	z.modulate.a = 0.0
	get_parent().add_child(z)
	z.setup(type, wave_num)
	var tw = z.create_tween()
	tw.tween_property(z, "modulate:a", 1.0, 0.3)

func start_infinite_horde() -> void:
	if is_infinite_horde:
		return
	is_infinite_horde = true
	is_spawning = false
	
	# Smash all security doors across the hospital immediately
	var all_doors = get_tree().get_nodes_in_group("doors")
	for d in all_doors:
		if is_instance_valid(d) and d.has_method("force_smash_door"):
			d.force_smash_door()
			
	_run_infinite_horde_loop()

func _run_infinite_horde_loop() -> void:
	# Initial massive swarm erupting from ground floor
	for i in range(16):
		if not is_inside_tree() or GameManager.is_game_won:
			break
		_spawn_ground_floor_runner(GameManager.current_wave + 3)
		await get_tree().create_timer(0.15).timeout
	
	var boss_timer = 0.0
	while is_infinite_horde and is_inside_tree() and not GameManager.is_game_won:
		await get_tree().create_timer(randf_range(0.3, 0.65)).timeout
		if GameManager.is_game_won:
			break
		_spawn_ground_floor_runner(GameManager.current_wave + 4)
		
		boss_timer += 0.5
		if boss_timer >= 20.0:
			boss_timer = 0.0
			_spawn_boss(GameManager.current_wave + 5)

func _spawn_ground_floor_runner(wave_num: int) -> void:
	if GameManager.is_game_won:
		return
	var z = zombie_scene.instantiate()
	
	# Hospital map ground floor boundaries: -720 to 480
	var spawn_x = randf_range(-720.0, 480.0)
	var spawn_y = 0.0 # Floor 1 / Ground level
	
	z.global_position = Vector2(spawn_x, spawn_y)
	z.modulate.a = 0.0
	get_parent().add_child(z)
	
	# Fast, lethal and aggressive zombie types that rush up the building
	var aggressive_types = ["crazy", "crazy", "cop", "rover", "swat", "hillbilly"]
	z.setup(aggressive_types.pick_random(), wave_num)
	
	var tw = z.create_tween()
	tw.tween_property(z, "modulate:a", 1.0, 0.2)

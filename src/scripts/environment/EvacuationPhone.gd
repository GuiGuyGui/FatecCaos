extends Node2D
class_name EvacuationPhone

var is_activated: bool = false
var player_in_range: Player = null

@onready var sprite: Sprite2D = $Sprite2D
@onready var prompt_label: Label = $PromptLabel
@onready var interact_area: Area2D = $InteractArea
@onready var beacon_light: PointLight2D = get_node_or_null("PointLight2D")

func _ready() -> void:
	add_to_group("evacuation_phones")
	if prompt_label:
		prompt_label.visible = false
	
	if interact_area:
		interact_area.body_entered.connect(_on_body_entered)
		interact_area.body_exited.connect(_on_body_exited)

	# Gentle floating bob animation
	var tw = create_tween().set_loops()
	tw.tween_property(sprite, "position:y", -4.0, 0.8).set_trans(Tween.TRANS_SINE)
	tw.tween_property(sprite, "position:y", 4.0, 0.8).set_trans(Tween.TRANS_SINE)

func _on_body_entered(body: Node2D) -> void:
	if is_activated:
		return
	if body is Player:
		player_in_range = body
		if prompt_label:
			prompt_label.text = "[E] Chamar Resgate de Emergência (Sobreviva 60s)"
			prompt_label.modulate = Color(1.0, 0.3, 0.3)
			prompt_label.visible = true

func _on_body_exited(body: Node2D) -> void:
	if body == player_in_range:
		player_in_range = null
		if prompt_label:
			prompt_label.visible = false

func _process(_delta: float) -> void:
	if is_activated or not player_in_range or player_in_range.is_dead:
		return
	
	if Input.is_action_just_pressed("interact"):
		_activate_sos_call()

@rpc("any_peer", "call_local", "reliable")
func net_activate_sos() -> void:
	_activate_sos_call_local()

func _activate_sos_call() -> void:
	if NetworkManager.is_multiplayer_active():
		net_activate_sos.rpc()
	else:
		_activate_sos_call_local()

func _activate_sos_call_local() -> void:
	is_activated = true
	if prompt_label:
		prompt_label.text = "🚨 SINAL SOS TRANSMITIDO! RESGATE A CAMINHO!"
		prompt_label.modulate = Color(1.0, 0.8, 0.2)
	
	# Audio cues: Radio beeps, phone siren, dramatic chord
	SoundManager.play_sound("snd_warning", 0.0, 2.0)
	SoundManager.play_sound("snd_P_round4", 0.0, 2.5)
	
	# Visual flare
	if sprite:
		var tw = create_tween()
		tw.tween_property(sprite, "scale", Vector2(1.8, 1.8), 0.15)
		tw.tween_property(sprite, "scale", Vector2(1.0, 1.0), 0.2)
		tw.parallel().tween_property(sprite, "modulate", Color(2.5, 0.5, 0.5, 1.0), 0.3)
	
	# Trigger endless horde in GameManager and WaveSpawner
	GameManager.trigger_endless_horde()
	
	# Shake camera of local player
	var players = get_tree().get_nodes_in_group("players")
	for p in players:
		if p is Player and p.has_method("_shake_camera"):
			p._shake_camera(14.0)

extends StaticBody2D
class_name Door

@export var door_name: String = "Porta de Seguranca"
@export var required_round: int = 1
@export var auto_scale_round_by_distance: bool = true

@export var enable_periodic_close: bool = true
@export var auto_close_min_time: float = 20.0
@export var auto_close_max_time: float = 50.0

@export var base_sequence_length: int = 4
@export var terminal_offset: Vector2 = Vector2(-36, -28)

var is_open: bool = false
var is_hacking: bool = false
var time_remaining: float = 0.0
var warning_beeps_played: int = 0
var player_in_range: Player = null
var default_sprite_pos: Vector2
var times_hacked: int = 0
var door_health: float = 60.0
var max_door_health: float = 60.0

@onready var sprite: Sprite2D = $Sprite2D
@onready var collision: CollisionShape2D = $CollisionShape2D
@onready var interact_area: Area2D = $InteractArea
@onready var prompt_label: Label = $PromptLabel
@onready var terminal_sprite: Sprite2D = get_node_or_null("TerminalSprite")
@onready var status_light: Sprite2D = get_node_or_null("TerminalSprite/StatusLight")
@onready var terminal_sprite_right: Sprite2D = get_node_or_null("TerminalSpriteRight")
@onready var status_light_right: Sprite2D = get_node_or_null("TerminalSpriteRight/StatusLightRight")

var minigame_scene = preload("res://scenes/ui/stratagem_minigame.tscn")
var active_minigame: StratagemMinigame = null

func _ready() -> void:
	add_to_group("doors")
	default_sprite_pos = sprite.position
	prompt_label.visible = false
	prompt_label.position = Vector2(-90, -76)
	interact_area.body_entered.connect(_on_body_entered)
	interact_area.body_exited.connect(_on_body_exited)
	GameManager.wave_started.connect(_on_wave_started)
	
	if auto_scale_round_by_distance:
		call_deferred("_calculate_round_by_distance")
	else:
		_update_visuals()

func _on_wave_started(_wave_num: int) -> void:
	_update_visuals()
	_update_prompt()

func _calculate_round_by_distance() -> void:
	var y_pos = global_position.y
	
	# Polivalente / Multi-floor Map Heights (1st Floor at Y=319, Roof at Y=-1795)
	if y_pos >= 200.0:
		# 1º Andar (Térreo) - Acessível imediatamente
		required_round = 1
		base_sequence_length = 3
	elif y_pos >= 50.0:
		# 2º Andar - Requer Onda 2
		required_round = 2
		base_sequence_length = 3
	elif y_pos >= -100.0:
		# 3º Andar - Requer Onda 3
		required_round = 3
		base_sequence_length = 4
	elif y_pos >= -250.0:
		# 4º Andar - Requer Onda 4
		required_round = 4
		base_sequence_length = 4
	elif y_pos >= -420.0:
		# 5º Andar - Requer Onda 5
		required_round = 5
		base_sequence_length = 5
	elif y_pos >= -600.0:
		# 6º Andar - Requer Onda 6
		required_round = 6
		base_sequence_length = 5
	elif y_pos >= -750.0:
		# 7º Andar - Requer Onda 7
		required_round = 7
		base_sequence_length = 6
	elif y_pos >= -920.0:
		# 8º Andar - Requer Onda 8
		required_round = 8
		base_sequence_length = 6
	elif y_pos >= -1100.0:
		# 9º Andar - Requer Onda 9
		required_round = 9
		base_sequence_length = 7
	elif y_pos >= -1300.0:
		# 10º Andar - Requer Onda 10
		required_round = 10
		base_sequence_length = 7
	elif y_pos >= -1500.0:
		# 11º Andar - Requer Onda 12
		required_round = 12
		base_sequence_length = 8
	elif y_pos >= -1700.0:
		# 12º Andar / Telhado Base - Requer Onda 14
		required_round = 14
		base_sequence_length = 8
	else:
		# Telhado Topo / Antena - Requer Onda 16
		required_round = 16
		base_sequence_length = 9
		
	_update_visuals()

func _on_body_entered(body: Node2D) -> void:
	if body is Player:
		player_in_range = body
		_update_prompt()
		prompt_label.visible = true

func _on_body_exited(body: Node2D) -> void:
	if body == player_in_range:
		player_in_range = null
		prompt_label.visible = false
		if active_minigame and is_instance_valid(active_minigame):
			active_minigame.cancel_puzzle()

func _process(delta: float) -> void:
	if is_open:
		if enable_periodic_close:
			time_remaining -= delta
			
			# Warning beeps in last 5 seconds
			if time_remaining <= 5.0 and time_remaining > 0.0:
				var current_second = int(ceil(time_remaining))
				if current_second != warning_beeps_played:
					warning_beeps_played = current_second
					SoundManager.play_sound("snd_warning", 0.05, -3.0)
					if prompt_label.visible:
						prompt_label.modulate = Color(1.0, 0.3, 0.3)
			
			if time_remaining <= 0.0:
				_close_door()
				
		_update_prompt()
		return

	if player_in_range and not is_hacking:
		if Input.is_action_just_pressed("interact"):
			_try_interact()

func _update_visuals() -> void:
	var color = Color(0.2, 0.8, 1.0, 1.0)
	if is_open:
		color = Color(0.2, 1.0, 0.3, 1.0) # Green (Open)
	elif GameManager.current_round < required_round:
		color = Color(1.0, 0.2, 0.2, 1.0) # Red (Wave locked)
	else:
		color = Color(0.2, 0.8, 1.0, 1.0) # Blue (Ready to hack)
		
	if is_instance_valid(status_light):
		status_light.modulate = color
	if is_instance_valid(status_light_right):
		status_light_right.modulate = color

func _update_prompt() -> void:
	if not player_in_range:
		prompt_label.visible = false
		return
		
	prompt_label.visible = true
	_update_visuals()
	
	if is_open:
		prompt_label.modulate = Color(0.3, 1.0, 0.4)
		if enable_periodic_close:
			prompt_label.text = door_name + " [ABERTA: " + str(int(ceil(time_remaining))) + "s]"
		else:
			prompt_label.text = door_name + " [ABERTA]"
	elif GameManager.current_round < required_round:
		prompt_label.modulate = Color(1.0, 0.4, 0.4)
		prompt_label.text = "BLOQUEADO [Requer Onda " + str(required_round) + "]"
	else:
		prompt_label.modulate = Color(0.3, 0.85, 1.0)
		var current_level = times_hacked + 1
		prompt_label.text = "[E] Hackear Terminal Nv." + str(current_level)

func _try_interact() -> void:
	if GameManager.current_round < required_round:
		SoundManager.play_sound("snd_button", 0.05, -4.0)
		_shake_prompt()
		return
		
	_start_stratagem_hack()

func _shake_prompt() -> void:
	var orig_pos = prompt_label.position
	var tween = create_tween()
	tween.tween_property(prompt_label, "position:x", orig_pos.x - 4.0, 0.04)
	tween.tween_property(prompt_label, "position:x", orig_pos.x + 4.0, 0.04)
	tween.tween_property(prompt_label, "position:x", orig_pos.x, 0.04)

func _start_stratagem_hack() -> void:
	if is_hacking or is_open:
		return
		
	is_hacking = true
	prompt_label.visible = false
	
	if not active_minigame or not is_instance_valid(active_minigame):
		active_minigame = minigame_scene.instantiate()
		add_child(active_minigame)
		active_minigame.sequence_completed.connect(_on_hack_completed)
		active_minigame.minigame_cancelled.connect(_on_hack_cancelled)
		
	# Escalating difficulty: base + times_hacked + round/3
	var current_level = times_hacked + 1
	var dynamic_length = clamp(base_sequence_length + times_hacked + int(GameManager.current_round / 3), 3, 10)
	active_minigame.start_puzzle(self, dynamic_length, "TERMINAL DE SEGURANCA [NV. " + str(current_level) + "]", current_level)

func _on_hack_completed() -> void:
	is_hacking = false
	times_hacked += 1
	_open_door()

func _on_hack_cancelled() -> void:
	is_hacking = false
	_update_prompt()

@rpc("any_peer", "call_local", "reliable")
func net_open_door() -> void:
	_open_door_local()

@rpc("any_peer", "call_local", "reliable")
func net_close_door() -> void:
	_close_door_local()

@rpc("any_peer", "call_local", "reliable")
func net_smash_door() -> void:
	_force_smash_door_local()

@rpc("any_peer", "call_local", "reliable")
func net_breach_door() -> void:
	_breach_door_by_zombies_local()

func _open_door() -> void:
	if NetworkManager.is_multiplayer_active():
		net_open_door.rpc()
	else:
		_open_door_local()

func _open_door_local() -> void:
	is_open = true
	# Random duration between min and max close time
	time_remaining = randf_range(auto_close_min_time, auto_close_max_time)
	warning_beeps_played = 0
	SoundManager.play_sound("snd_open_door", 0.05, 0.0)
	ObjectivesManager.report_progress("open_door", 1)
	
	var tween = create_tween().set_parallel(true)
	tween.tween_property(sprite, "position:y", default_sprite_pos.y - 64.0, 0.5).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.tween_property(sprite, "modulate:a", 0.15, 0.5)
	
	collision.set_deferred("disabled", true)
	_update_visuals()
	_update_prompt()
	
	# Chance of zombie ambush (only host or single player spawns)
	if not NetworkManager.is_multiplayer_active() or multiplayer.is_server():
		if randf() < 0.6:
			_trigger_door_ambush()

func take_damage_from_zombie(amount: float) -> void:
	if is_open:
		return
	
	door_health -= amount
	SoundManager.play_sound_2d("snd_P_melee1", global_position, 0.15, -1.0)
	
	# Shake effect when zombie attacks the door
	var tw = create_tween()
	tw.tween_property(sprite, "position:x", default_sprite_pos.x + randf_range(-3.0, 3.0), 0.04)
	tw.tween_property(sprite, "position:x", default_sprite_pos.x, 0.04)
	
	# Red hit flash
	sprite.modulate = Color(2.0, 0.4, 0.4, 1.0)
	var tw_color = create_tween()
	tw_color.tween_property(sprite, "modulate", Color(1.0, 1.0, 1.0, 1.0), 0.12)
	
	if door_health <= 0.0:
		door_health = max_door_health
		if NetworkManager.is_multiplayer_active():
			net_breach_door.rpc()
		else:
			_breach_door_by_zombies_local()

func _breach_door_by_zombies_local() -> void:
	if is_open:
		return
	is_open = true
	is_hacking = false
	door_health = max_door_health
	# Zombie breach: Opens briefly (2.5s) for zombies to pass through, then immediately closes and locks shut
	time_remaining = 2.5
	enable_periodic_close = true
	warning_beeps_played = 0
	SoundManager.play_sound("snd_open_door", 0.05, 1.2)
	SoundManager.play_sound("snd_warning", 0.0, 1.5)
	
	var tween = create_tween().set_parallel(true)
	tween.tween_property(sprite, "position:y", default_sprite_pos.y - 64.0, 0.25).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.tween_property(sprite, "modulate:a", 0.15, 0.25)
	
	collision.set_deferred("disabled", true)
	_update_visuals()
	_update_prompt()

func force_smash_door() -> void:
	if NetworkManager.is_multiplayer_active():
		net_smash_door.rpc()
	else:
		_force_smash_door_local()

func _force_smash_door_local() -> void:
	if is_open:
		return
	is_open = true
	is_hacking = false
	enable_periodic_close = false
	SoundManager.play_sound("snd_open_door", 0.05, 1.2)
	
	var tween = create_tween().set_parallel(true)
	tween.tween_property(sprite, "position:y", default_sprite_pos.y - 64.0, 0.2).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.tween_property(sprite, "modulate:a", 0.1, 0.2)
	
	collision.set_deferred("disabled", true)
	_update_visuals()
	if prompt_label:
		prompt_label.visible = false

func _close_door() -> void:
	if NetworkManager.is_multiplayer_active():
		net_close_door.rpc()
	else:
		_close_door_local()

func _close_door_local() -> void:
	is_open = false
	is_hacking = false
	SoundManager.play_sound("snd_open_door", 0.05, -2.0)
	
	var tween = create_tween().set_parallel(true)
	tween.tween_property(sprite, "position:y", default_sprite_pos.y, 0.5).set_trans(Tween.TRANS_BOUNCE).set_ease(Tween.EASE_OUT)
	tween.tween_property(sprite, "modulate:a", 1.0, 0.3)
	
	collision.set_deferred("disabled", false)
	_update_visuals()
	_update_prompt()

func _trigger_door_ambush() -> void:
	await get_tree().create_timer(0.35).timeout
	SoundManager.play_sound("snd_warning", 0.0, 1.4)
	
	var zombie_scene = preload("res://scenes/enemies/zombie.tscn")
	var ambush_count = randi_range(2, 4)
	for i in range(ambush_count):
		await get_tree().create_timer(0.2).timeout
		var z = zombie_scene.instantiate()
		var types = ["crazy", "rover", "cop", "civil"]
		var chosen_type = types.pick_random()
		z.global_position = global_position + Vector2(randf_range(-12, 12), -10.0)
		get_parent().add_child(z)
		z.setup(chosen_type, GameManager.current_wave)
		
		GameManager.zombies_remaining += 1
		GameManager.kills_stats_changed.emit(GameManager.total_kills, GameManager.headshot_kills, GameManager.current_wave, GameManager.zombies_remaining)

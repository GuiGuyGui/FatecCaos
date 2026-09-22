extends Node2D
class_name SpecialArmoryTerminal

@export var terminal_name: String = "Terminal Bélico Especial"
@export var challenge_sequence_length: int = 20
@export var cost: int = 0
@export var special_weapon_pool: Array[String] = [
	"raygun",
	"rpg",
	"heavygun",
	"flamethrower",
	"awp",
	"m60",
	"aug",
	"auto_shotgun",
	"katana",
	"crossbow"
]

var players_used: Dictionary = {}
var is_broken: bool = false
var is_hacking: bool = false
var is_dispensing: bool = false
var player_in_range: Player = null
var anim_timer: float = 0.0

@onready var sprite: Sprite2D = $Sprite2D
@onready var interact_area: Area2D = $InteractArea
@onready var prompt_label: Label = $PromptLabel
@onready var glow_light: PointLight2D = get_node_or_null("GlowLight")
@onready var holo_projector: Node2D = get_node_or_null("HoloProjector")
@onready var holo_icon: Sprite2D = get_node_or_null("HoloProjector/HoloIcon")
@onready var holo_glow: PointLight2D = get_node_or_null("HoloProjector/HoloGlow")
@onready var weapon_dispense_icon: Sprite2D = get_node_or_null("WeaponDispenseIcon")
@onready var spark_particles: CPUParticles2D = get_node_or_null("SparkParticles")

var minigame_scene = preload("res://scenes/ui/stratagem_minigame.tscn")
var active_minigame: StratagemMinigame = null

const TEX_ACTIVE = preload("res://assets/sprites/environment/armory_terminal_active.png")
const TEX_BROKEN = preload("res://assets/sprites/environment/armory_terminal_broken.png")

func _ready() -> void:
	add_to_group("armory_terminals")
	sprite.texture = TEX_ACTIVE
	prompt_label.visible = false
	if weapon_dispense_icon:
		weapon_dispense_icon.visible = false
	if spark_particles:
		spark_particles.emitting = false
		
	# Random preview icon for holo projector
	if holo_icon and not special_weapon_pool.is_empty():
		var preview_id = special_weapon_pool.pick_random()
		var w_data = WeaponDatabase.get_weapon(preview_id)
		var ico_path = w_data.get("icon_path", "")
		if ico_path != "" and ResourceLoader.exists(ico_path):
			holo_icon.texture = load(ico_path)
		
	interact_area.body_entered.connect(_on_body_entered)
	interact_area.body_exited.connect(_on_body_exited)
	_update_prompt()

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
	anim_timer += delta
	
	# Idle Holographic & Light Animation
	if not is_broken:
		if glow_light:
			glow_light.energy = 1.0 + sin(anim_timer * 3.0) * 0.35
		if holo_projector:
			holo_projector.position.y = -76.0 + sin(anim_timer * 2.5) * 4.0
			if holo_icon:
				holo_icon.modulate = Color(0.4, 1.0, 1.0, 0.75 + sin(anim_timer * 4.0) * 0.2)
	else:
		if glow_light:
			glow_light.energy = 0.4 + sin(anim_timer * 6.0) * 0.2
		if holo_projector:
			holo_projector.visible = false
			
	if not player_in_range or is_hacking or is_dispensing:
		return
		
	if Input.is_action_just_pressed("interact"):
		_try_interact()

func _update_prompt() -> void:
	if not player_in_range:
		prompt_label.visible = false
		return
		
	prompt_label.visible = true
	
	if is_broken:
		prompt_label.modulate = Color(1.0, 0.3, 0.3)
		prompt_label.text = "TERMINAL OFFLINE [DANIFICADO]"
	elif players_used.has(player_in_range.get_instance_id()):
		prompt_label.modulate = Color(1.0, 0.6, 0.2)
		prompt_label.text = "VOCE JA RESGATOU SUA ARMA"
	elif cost > 0:
		prompt_label.modulate = Color(0.3, 0.9, 1.0)
		prompt_label.text = "[E] " + terminal_name + " [DESAFIO 20 SETAS] ($ " + str(cost) + ")"
	else:
		prompt_label.modulate = Color(0.3, 0.9, 1.0)
		prompt_label.text = "[E] " + terminal_name + " [DESAFIO 20 SETAS]"

func _try_interact() -> void:
	if is_broken:
		SoundManager.play_sound("snd_button", 0.05, -5.0)
		_shake_prompt()
		return
		
	var pid = player_in_range.get_instance_id()
	if players_used.has(pid):
		SoundManager.play_sound("snd_button", 0.05, -5.0)
		_shake_prompt()
		return
		
	if cost > 0:
		if GameManager.money < cost:
			SoundManager.play_sound("snd_button", 0.05, -6.0)
			_shake_prompt()
			return
			
	_start_stratagem_challenge()

func _shake_prompt() -> void:
	var orig_pos = prompt_label.position
	var tween = create_tween()
	tween.tween_property(prompt_label, "position:x", orig_pos.x - 4.0, 0.04)
	tween.tween_property(prompt_label, "position:x", orig_pos.x + 4.0, 0.04)
	tween.tween_property(prompt_label, "position:x", orig_pos.x, 0.04)

func _start_stratagem_challenge() -> void:
	if is_hacking or is_broken:
		return
		
	is_hacking = true
	prompt_label.visible = false
	
	if not active_minigame or not is_instance_valid(active_minigame):
		active_minigame = minigame_scene.instantiate()
		add_child(active_minigame)
		active_minigame.sequence_completed.connect(_on_hack_completed)
		active_minigame.minigame_cancelled.connect(_on_hack_cancelled)
		
	active_minigame.start_puzzle(self, challenge_sequence_length, "ARMORY - DESAFIO DE 20 COMANDOS")

func _on_hack_completed() -> void:
	is_hacking = false
	if cost > 0:
		GameManager.add_money(-cost)
	_dispense_special_weapon(player_in_range)

func _on_hack_cancelled() -> void:
	is_hacking = false
	_update_prompt()

func _dispense_special_weapon(player: Player) -> void:
	is_dispensing = true
	if is_instance_valid(player):
		players_used[player.get_instance_id()] = true
	_update_prompt()
	
	SoundManager.play_sound("snd_buy", 0.05, 0.0)
	SoundManager.play_sound("snd_upgrade", 0.05, 1.5)
	
	if special_weapon_pool.is_empty():
		special_weapon_pool = ["raygun", "rpg", "heavygun", "flamethrower", "awp", "m60", "aug", "auto_shotgun"]
		
	var rolled_id = special_weapon_pool.pick_random()
	var wpn_data = WeaponDatabase.get_weapon(rolled_id)
	
	# Animate Holographic Weapon Rise
	if weapon_dispense_icon:
		var ico_path = wpn_data.get("icon_path", "")
		if ico_path != "" and ResourceLoader.exists(ico_path):
			weapon_dispense_icon.texture = load(ico_path)
		weapon_dispense_icon.visible = true
		weapon_dispense_icon.position = Vector2(0, -36)
		weapon_dispense_icon.modulate = Color(1.8, 1.8, 2.0, 0.0)
		weapon_dispense_icon.scale = Vector2(0.5, 0.5)
		
		var tw = create_tween().set_parallel(true)
		tw.tween_property(weapon_dispense_icon, "position:y", -85.0, 0.7).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tw.tween_property(weapon_dispense_icon, "modulate", Color(1.0, 1.0, 1.0, 1.0), 0.35)
		tw.tween_property(weapon_dispense_icon, "scale", Vector2(1.3, 1.3), 0.7)
		await tw.finished
		
		var tw_fade = create_tween()
		tw_fade.tween_property(weapon_dispense_icon, "modulate:a", 0.0, 0.3)
		await tw_fade.finished
		weapon_dispense_icon.visible = false

	# Equip to player
	if is_instance_valid(player):
		if player.has_method("acquire_weapon"):
			player.acquire_weapon(rolled_id)
		else:
			player._equip_weapon(rolled_id)
			
	SoundManager.play_sound("snd_powerup", 0.05, 1.0)
	is_dispensing = false
	
	# Check if all players in session have used it
	var players = get_tree().get_nodes_in_group("players")
	if players.is_empty():
		var p_single = get_tree().get_first_node_in_group("player")
		if p_single:
			players.append(p_single)
			
	var all_used = true
	for p in players:
		if is_instance_valid(p) and not players_used.has(p.get_instance_id()):
			all_used = false
			break
			
	if all_used:
		_break_terminal()
	else:
		_update_prompt()

func _break_terminal() -> void:
	is_broken = true
	sprite.texture = TEX_BROKEN
	
	SoundManager.play_sound("snd_warning", 0.0, -1.0)
	SoundManager.play_sound("snd_metal_hit1", 0.0, -4.0)
	
	if glow_light:
		glow_light.color = Color(1.0, 0.2, 0.1, 0.8)
		glow_light.energy = 0.6
		
	if holo_projector:
		holo_projector.visible = false
		
	if spark_particles:
		spark_particles.emitting = true
		
	# Shake effect
	var orig_pos = sprite.position
	var tween = create_tween()
	tween.tween_property(sprite, "position:x", orig_pos.x - 5.0, 0.05)
	tween.tween_property(sprite, "position:x", orig_pos.x + 5.0, 0.05)
	tween.tween_property(sprite, "position:x", orig_pos.x, 0.05)
	
	_update_prompt()

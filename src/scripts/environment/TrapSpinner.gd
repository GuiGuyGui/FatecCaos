extends Node2D
class_name TrapSpinner

@export var cost: int = 1000
@export var active_duration: float = 20.0
@export var cooldown_time: float = 15.0
@export var damage_per_hit: float = 250.0

var is_active: bool = false
var is_on_cooldown: bool = false
var player_in_range: Player = null

@onready var sprite: Sprite2D = $Sprite2D
@onready var damage_area: Area2D = $DamageArea
@onready var interact_area: Area2D = $InteractArea
@onready var prompt_label: Label = $PromptLabel

var spin_frames: Array[Texture2D] = []
var anim_timer: float = 0.0

func _ready() -> void:
	prompt_label.visible = false
	for i in range(7):
		var p = "res://assets/sprites/general/spr_spinner_trap/spr_spinner_trap_" + str(i) + ".png"
		if ResourceLoader.exists(p):
			spin_frames.append(load(p))
	
	if spin_frames.size() > 0:
		sprite.texture = spin_frames[0]
	
	interact_area.body_entered.connect(_on_body_entered)
	interact_area.body_exited.connect(_on_body_exited)

func _on_body_entered(body: Node2D) -> void:
	if body is Player:
		player_in_range = body
		_update_prompt()
		prompt_label.visible = true

func _on_body_exited(body: Node2D) -> void:
	if body == player_in_range:
		player_in_range = null
		prompt_label.visible = false

func _process(delta: float) -> void:
	if is_active:
		anim_timer += delta * 24.0
		if spin_frames.size() > 0:
			sprite.texture = spin_frames[int(anim_timer) % spin_frames.size()]
		
		# Slice zombies
		for body in damage_area.get_overlapping_bodies():
			if body is Zombie and not body.is_dead:
				SoundManager.play_sound_2d("snd_blade", global_position, 0.1, 1.0)
				body.take_damage_hit(damage_per_hit, Vector2(randf_range(-100, 100), -120), false, "trap")
				ObjectivesManager.report_progress("trap_kills", 1)
			elif body is BossZombie and not body.is_dead:
				body.take_damage_hit(damage_per_hit * 0.4 * delta, Vector2.ZERO, false, "trap")
	
	if player_in_range and Input.is_action_just_pressed("interact") and not is_active and not is_on_cooldown:
		_try_activate()

func _update_prompt() -> void:
	if not player_in_range:
		return
	if is_active:
		prompt_label.text = "ARMADILHA ATIVA"
	elif is_on_cooldown:
		prompt_label.text = "RECARREGANDO..."
	else:
		prompt_label.text = "[E] Ativar Armadilha de Lâminas ($ " + str(cost) + ")"

func _try_activate() -> void:
	if GameManager.spend_money(cost):
		is_active = true
		_update_prompt()
		SoundManager.play_sound_2d("snd_P_sawnguts", global_position, 0.05, 2.0)
		SoundManager.play_sound_2d("chainsaw_cut", global_position, 0.05, 0.0)
		
		await get_tree().create_timer(active_duration).timeout
		is_active = false
		is_on_cooldown = true
		_update_prompt()
		if spin_frames.size() > 0:
			sprite.texture = spin_frames[0]
		
		await get_tree().create_timer(cooldown_time).timeout
		is_on_cooldown = false
		_update_prompt()
	else:
		SoundManager.play_sound("snd_button", 0.1, -6.0)

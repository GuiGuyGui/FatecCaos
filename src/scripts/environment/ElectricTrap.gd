extends Node2D
class_name ElectricTrap

# ElectricTrap - High-Voltage Hallway Barrier
# Zaps and vaporizes any zombie that enters while active.

@export var cost: int = 750
@export var duration: float = 25.0
@export var cooldown: float = 30.0

var is_active: bool = false
var is_on_cooldown: bool = false
var player_in_range: Player = null

@onready var interact_area: Area2D = $InteractArea
@onready var damage_area: Area2D = $DamageArea
@onready var prompt_label: Label = $PromptLabel
@onready var spark_particles: CPUParticles2D = $CPUParticles2D
@onready var light_glow: PointLight2D = $PointLight2D

func _ready() -> void:
	prompt_label.visible = false
	spark_particles.emitting = false
	if light_glow:
		light_glow.enabled = false
	
	interact_area.body_entered.connect(_on_body_entered)
	interact_area.body_exited.connect(_on_body_exited)

func _update_prompt() -> void:
	if not GameManager.is_power_on:
		prompt_label.text = "[REQUER ENERGIA CENTRAL]"
		prompt_label.modulate = Color(1.0, 0.3, 0.3)
	elif is_active:
		prompt_label.text = "[⚡ ARMADILHA ATIVADA ⚡]"
		prompt_label.modulate = Color(0.3, 0.9, 1.0)
	elif is_on_cooldown:
		prompt_label.text = "[⏳ RESFRIANDO SISTEMA...]"
		prompt_label.modulate = Color(0.7, 0.7, 0.7)
	else:
		prompt_label.text = "[E] Ativar Barreira Elétrica ($" + str(cost) + ")"
		prompt_label.modulate = Color(0.2, 0.8, 1.0)

func _on_body_entered(body: Node2D) -> void:
	if body is Player:
		player_in_range = body
		_update_prompt()
		prompt_label.visible = true

func _on_body_exited(body: Node2D) -> void:
	if body == player_in_range:
		player_in_range = null
		prompt_label.visible = false

func _process(_delta: float) -> void:
	if not player_in_range or is_active or is_on_cooldown or not GameManager.is_power_on:
		return
	
	if Input.is_action_just_pressed("interact"):
		if GameManager.spend_money(cost):
			_activate_trap()
		else:
			SoundManager.play_sound("snd_empty")

func _activate_trap() -> void:
	is_active = true
	_update_prompt()
	spark_particles.emitting = true
	if light_glow:
		light_glow.enabled = true
	
	SoundManager.play_sound("snd_warning", 0.0, 1.3)
	
	# Periodic electric zap loop
	var zap_timer = 0.0
	while zap_timer < duration:
		await get_tree().create_timer(0.2).timeout
		zap_timer += 0.2
		_zap_zombies_in_area()
	
	# Deactivate and enter cooldown
	is_active = false
	spark_particles.emitting = false
	if light_glow:
		light_glow.enabled = false
	
	is_on_cooldown = true
	_update_prompt()
	
	await get_tree().create_timer(cooldown).timeout
	is_on_cooldown = false
	_update_prompt()

func _zap_zombies_in_area() -> void:
	if not is_instance_valid(damage_area):
		return
	
	var bodies = damage_area.get_overlapping_bodies()
	for b in bodies:
		if b is Zombie and not b.is_dead:
			SoundManager.play_sound("snd_boss", 0.1, 3.0)
			b.take_damage_hit(400.0, Vector2(randf_range(-100, 100), -200), false, "trap")
			ObjectivesManager.report_progress("trap_kills", 1)

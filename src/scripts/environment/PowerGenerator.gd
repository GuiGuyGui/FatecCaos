extends Node2D
class_name PowerGenerator

# PowerGenerator - Master Facility Power Switch
# Turns on lights, enables perk machines & electric traps, and fulfills tactical mission.

var is_turned_on: bool = false
var player_in_range: Player = null

@onready var interact_area: Area2D = $InteractArea
@onready var prompt_label: Label = $PromptLabel
@onready var light_indicator: PointLight2D = $PointLight2D
@onready var status_sprite: Sprite2D = $Sprite2D

func _ready() -> void:
	prompt_label.visible = false
	_update_visuals()
	
	interact_area.body_entered.connect(_on_body_entered)
	interact_area.body_exited.connect(_on_body_exited)

func _update_visuals() -> void:
	if is_turned_on:
		prompt_label.text = "[⚡ ENERGIA ATIVA]"
		prompt_label.modulate = Color(0.2, 1.0, 0.3)
		if light_indicator:
			light_indicator.color = Color(0.2, 1.0, 0.4)
			light_indicator.energy = 1.8
		if status_sprite:
			status_sprite.modulate = Color(0.8, 1.0, 0.8)
	else:
		prompt_label.text = "[E] Ligar Energia Central (Grátis)"
		prompt_label.modulate = Color(1.0, 0.9, 0.3)
		if light_indicator:
			light_indicator.color = Color(1.0, 0.2, 0.2)
			light_indicator.energy = 0.8
		if status_sprite:
			status_sprite.modulate = Color(0.9, 0.7, 0.7)

func _on_body_entered(body: Node2D) -> void:
	if body is Player:
		player_in_range = body
		prompt_label.visible = true

func _on_body_exited(body: Node2D) -> void:
	if body == player_in_range:
		player_in_range = null
		prompt_label.visible = false

func _process(_delta: float) -> void:
	if not player_in_range or is_turned_on:
		return
	
	if Input.is_action_just_pressed("interact"):
		_turn_on_power()

func _turn_on_power() -> void:
	is_turned_on = true
	SoundManager.play_sound("snd_warning", 0.0, 1.2)
	SoundManager.play_sound("snd_P_loveit", 0.0, 1.8)
	
	# Shake camera lightly
	if player_in_range and is_instance_valid(player_in_range):
		player_in_range._shake_camera(4.0)
	
	_update_visuals()
	
	# Notify GameManager & Objectives
	GameManager.is_power_on = true
	if GameManager.has_signal("power_turned_on"):
		GameManager.power_turned_on.emit()
	
	ObjectivesManager.report_progress("turn_on_power", 1)

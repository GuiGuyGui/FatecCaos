extends AnimatableBody2D
class_name Elevator

@export var move_distance: float = 120.0
@export var move_speed: float = 60.0
@export var is_automatic: bool = true
@export var wait_time: float = 3.0

var start_pos: Vector2
var target_pos: Vector2
var moving_to_target: bool = true
var is_waiting: bool = false

@onready var sprite: Sprite2D = $Sprite2D
@onready var interact_area: Area2D = $InteractArea

func _ready() -> void:
	start_pos = position
	target_pos = start_pos + Vector2(0, -move_distance)
	if interact_area:
		interact_area.body_entered.connect(_on_body_entered)

func _physics_process(delta: float) -> void:
	if is_waiting:
		return

	var dest = target_pos if moving_to_target else start_pos
	position = position.move_toward(dest, move_speed * delta)

	if position.distance_to(dest) < 1.0:
		_on_reach_destination()

func _on_reach_destination() -> void:
	is_waiting = true
	SoundManager.play_sound_2d("snd_metal_hit1", global_position, 0.05, -6.0)
	await get_tree().create_timer(wait_time).timeout
	moving_to_target = not moving_to_target
	is_waiting = false

func _on_body_entered(body: Node2D) -> void:
	if not is_automatic and body is Player and not is_waiting:
		moving_to_target = not moving_to_target

extends CharacterBody2D
class_name FlyingHead

var spin_speed: float = 0.0
var bounces: int = 0
const GRAVITY: float = 750.0

@onready var sprite: Sprite2D = $Sprite2D

func _ready() -> void:
	spin_speed = randf_range(-15.0, 15.0)
	# Random head frame
	var head_idx = randi() % 3
	var tex = load("res://assets/sprites/effects/spr_bloody_head/spr_bloody_head_" + str(head_idx) + ".png")
	if tex:
		sprite.texture = tex
	# Delete after 20 seconds
	await get_tree().create_timer(20.0).timeout
	queue_free()

func _physics_process(delta: float) -> void:
	if bounces < 3:
		velocity.y += GRAVITY * delta
		rotation += spin_speed * delta

		var collision = move_and_collide(velocity * delta)
		if collision:
			bounces += 1
			velocity = velocity.bounce(collision.get_normal()) * 0.45
			spin_speed *= 0.5
			# Spawn blood splat on ground impact
			_spawn_blood_impact(global_position)
	else:
		velocity = Vector2.ZERO

func _spawn_blood_impact(pos: Vector2) -> void:
	var parts = CPUParticles2D.new()
	parts.emitting = true
	parts.one_shot = true
	parts.amount = 10
	parts.lifetime = 0.35
	parts.color = Color(0.85, 0.05, 0.05, 1.0)
	parts.direction = Vector2(0, -1)
	parts.spread = 60.0
	parts.initial_velocity_min = 40.0
	parts.initial_velocity_max = 90.0
	parts.gravity = Vector2(0, 480)
	parts.scale_amount_min = 1.5
	parts.scale_amount_max = 2.8
	parts.global_position = pos
	get_tree().current_scene.add_child(parts)
	get_tree().create_timer(0.4).timeout.connect(parts.queue_free)

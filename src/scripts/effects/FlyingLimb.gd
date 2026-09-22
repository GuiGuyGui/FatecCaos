extends CharacterBody2D
class_name FlyingLimb

var spin_speed: float = 0.0
var bounces: int = 0
const GRAVITY: float = 750.0

@onready var sprite: Sprite2D = $Sprite2D

var limb_sprites = [
	"res://assets/sprites/characters/spr_civil_zombie1_torso/spr_civil_zombie1_torso_0.png",
	"res://assets/sprites/characters/spr_civil_zombie1_pants/spr_civil_zombie1_pants_0.png",
	"res://assets/sprites/characters/spr_zombie_split_torso/spr_zombie_split_torso_0.png",
	"res://assets/sprites/characters/spr_zombie_split_pants/spr_zombie_split_pants_0.png"
]

func _ready() -> void:
	spin_speed = randf_range(-18.0, 18.0)
	var chosen = limb_sprites[randi() % limb_sprites.size()]
	if ResourceLoader.exists(chosen):
		sprite.texture = load(chosen)
	
	# Fade and delete after 15 seconds
	await get_tree().create_timer(15.0).timeout
	var tween = create_tween()
	tween.tween_property(self, "modulate:a", 0.0, 2.0)
	tween.tween_callback(queue_free)

func _physics_process(delta: float) -> void:
	if bounces < 3:
		velocity.y += GRAVITY * delta
		rotation += spin_speed * delta

		var collision = move_and_collide(velocity * delta)
		if collision:
			bounces += 1
			velocity = velocity.bounce(collision.get_normal()) * 0.4
			spin_speed *= 0.5
			_spawn_blood_impact(global_position)
	else:
		velocity = Vector2.ZERO

func _spawn_blood_impact(pos: Vector2) -> void:
	var parts = CPUParticles2D.new()
	parts.emitting = true
	parts.one_shot = true
	parts.amount = 8
	parts.lifetime = 0.35
	parts.color = Color(0.85, 0.05, 0.05, 1.0)
	parts.direction = Vector2(0, -1)
	parts.spread = 50.0
	parts.initial_velocity_min = 35.0
	parts.initial_velocity_max = 80.0
	parts.gravity = Vector2(0, 480)
	parts.scale_amount_min = 1.4
	parts.scale_amount_max = 2.5
	parts.global_position = pos
	get_tree().current_scene.add_child(parts)
	get_tree().create_timer(0.4).timeout.connect(parts.queue_free)

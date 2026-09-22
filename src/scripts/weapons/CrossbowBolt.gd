extends Area2D
class_name CrossbowBolt

var direction: Vector2 = Vector2.RIGHT
var speed: float = 1800.0
var damage: float = 220.0
var knockback: float = 350.0
var lifetime: float = 2.0
var pierce_count: int = 3

@onready var sprite: Sprite2D = $Sprite2D

func _ready() -> void:
	rotation = direction.angle()
	body_entered.connect(_on_body_entered)
	area_entered.connect(_on_area_entered)
	await get_tree().create_timer(lifetime).timeout
	queue_free()

func _physics_process(delta: float) -> void:
	position += direction * speed * delta

func _on_body_entered(body: Node2D) -> void:
	if body.has_method("take_damage_hit"):
		var rel_y = global_position.y - body.global_position.y
		if rel_y < -10.0 and body.has_method("take_headshot"):
			body.take_headshot(damage * 1.5, direction * knockback)
		else:
			body.take_damage_hit(damage, direction * knockback, global_position)
		
		pierce_count -= 1
		if pierce_count <= 0:
			queue_free()
	elif body is TileMap or body is StaticBody2D:
		SoundManager.play_sound_2d("snd_bullet_hit_ground", global_position, 0.1, -4.0)
		queue_free()

func _on_area_entered(area: Area2D) -> void:
	if area.has_method("take_headshot"):
		area.take_headshot(damage * 1.5, direction * knockback)
		pierce_count -= 1
		if pierce_count <= 0:
			queue_free()

extends Area2D
class_name FlameParticle

var direction: Vector2 = Vector2.RIGHT
var speed: float = 400.0
var damage_per_sec: float = 85.0
var knockback: float = 40.0
var lifetime: float = 0.55
var timer: float = 0.0

@onready var sprite: Sprite2D = $Sprite2D
var frames: Array[Texture2D] = []

func _ready() -> void:
	rotation = direction.angle()
	for i in range(8):
		var path = "res://assets/sprites/weapons/spr_flame/spr_flame_" + str(i) + ".png"
		if ResourceLoader.exists(path):
			frames.append(load(path))
	
	body_entered.connect(_on_body_entered)
	area_entered.connect(_on_area_entered)
	
	# Fade and grow
	var tween = create_tween()
	tween.tween_property(self, "scale", Vector2(1.8, 1.8), lifetime)
	tween.parallel().tween_property(self, "modulate:a", 0.0, lifetime)
	tween.tween_callback(queue_free)

func _physics_process(delta: float) -> void:
	position += direction * speed * delta
	timer += delta
	if frames.size() > 0:
		var frame_idx = int((timer / lifetime) * frames.size()) % frames.size()
		sprite.texture = frames[frame_idx]

func _on_body_entered(body: Node2D) -> void:
	if body.has_method("take_damage_hit"):
		body.take_damage_hit(damage_per_sec * 0.2, direction * knockback, global_position)
	elif body is TileMap or body is StaticBody2D:
		speed *= 0.3

func _on_area_entered(area: Area2D) -> void:
	if area.has_method("take_headshot"):
		area.take_headshot(damage_per_sec * 0.2, direction * knockback)

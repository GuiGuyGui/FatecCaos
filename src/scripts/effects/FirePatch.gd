extends Area2D
class_name FirePatch

@export var damage_per_sec: float = 65.0
@export var duration: float = 8.0
var elapsed: float = 0.0

@onready var sprite: Sprite2D = $Sprite2D
var flame_frames: Array[Texture2D] = []
var anim_timer: float = 0.0

func _ready() -> void:
	collision_layer = 0
	collision_mask = 2 # Detects zombies and players
	
	for i in range(8):
		var p = "res://assets/sprites/weapons/spr_flame/spr_flame_" + str(i) + ".png"
		if ResourceLoader.exists(p):
			flame_frames.append(load(p))
	
	SoundManager.play_sound_2d("snd_flamethower", global_position, 0.1, -4.0)

func _physics_process(delta: float) -> void:
	elapsed += delta
	anim_timer += delta * 12.0
	if flame_frames.size() > 0:
		sprite.texture = flame_frames[int(anim_timer) % flame_frames.size()]
	
	# Damage overlapping bodies
	for body in get_overlapping_bodies():
		if body is Zombie and not body.is_dead:
			body.take_damage_hit(damage_per_sec * delta, Vector2.ZERO, body.global_position)
		elif body is BossZombie and not body.is_dead:
			body.take_damage_hit(damage_per_sec * 0.5 * delta, Vector2.ZERO, body.global_position)
	
	if elapsed >= duration:
		var tween = create_tween()
		tween.tween_property(self, "modulate:a", 0.0, 0.5)
		tween.tween_callback(queue_free)

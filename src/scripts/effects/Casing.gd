extends RigidBody2D
class_name Casing

@export var shell_type: int = 0
@onready var sprite: Sprite2D = $Sprite2D

var has_bounced_sound: bool = false

func _ready() -> void:
	contact_monitor = true
	max_contacts_reported = 2
	body_entered.connect(_on_body_entered)
	
	var tex_path = "res://assets/sprites/weapons/spr_shell/spr_shell_" + str(shell_type % 3) + ".png"
	if ResourceLoader.exists(tex_path):
		sprite.texture = load(tex_path)
	
	# Auto remove after 5 seconds
	await get_tree().create_timer(4.5).timeout
	var tween = create_tween()
	tween.tween_property(self, "modulate:a", 0.0, 0.5)
	tween.tween_callback(queue_free)

func _on_body_entered(_body: Node) -> void:
	if not has_bounced_sound:
		has_bounced_sound = true
		SoundManager.play_sound_2d("snd_shotgunshell_drop", global_position, 0.15, -12.0)

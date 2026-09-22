extends RigidBody2D
class_name Molotov

var fire_patch_scene = preload("res://scenes/effects/fire_patch.tscn")
var has_exploded: bool = false

func _ready() -> void:
	contact_monitor = true
	max_contacts_reported = 2
	body_entered.connect(_on_body_entered)

func _on_body_entered(_body: Node) -> void:
	if has_exploded:
		return
	_explode()

func _explode() -> void:
	has_exploded = true
	SoundManager.play_sound_2d("snd_molotow", global_position, 0.1, 2.0)
	
	# Spawn persistent fire patch
	var fp = fire_patch_scene.instantiate()
	fp.global_position = global_position
	get_tree().current_scene.call_deferred("add_child", fp)
	
	# Small explosion sound / camera shake
	var players = get_tree().get_nodes_in_group("players")
	for p in players:
		if p is Player and p.is_local_player:
			p._shake_camera(2.5)
	
	queue_free()

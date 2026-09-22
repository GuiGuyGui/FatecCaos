extends Area2D
class_name ComponentScrapDrop

var lifetime: float = 30.0

@onready var sprite: Sprite2D = $Sprite2D

func _ready() -> void:
	collision_layer = 0
	collision_mask = 2 # Player collision layer
	body_entered.connect(_on_body_entered)
	
	# Floating bob animation
	var tween = create_tween().set_loops()
	tween.tween_property(sprite, "position:y", -4.0, 0.5).set_trans(Tween.TRANS_SINE)
	tween.tween_property(sprite, "position:y", 0.0, 0.5).set_trans(Tween.TRANS_SINE)
	
	# Despawn blinking
	_start_despawn_timer()

func _start_despawn_timer() -> void:
	await get_tree().create_timer(lifetime - 5.0).timeout
	var blink_tween = create_tween().set_loops(10)
	blink_tween.tween_property(sprite, "modulate:a", 0.3, 0.25)
	blink_tween.tween_property(sprite, "modulate:a", 1.0, 0.25)
	await get_tree().create_timer(5.0).timeout
	queue_free()

func _on_body_entered(body: Node2D) -> void:
	if body is Player:
		SoundManager.play_sound("snd_winchester_tick", 0.1, 2.0)
		SoundManager.play_sound("snd_bounce", 0.1, 4.0)
		PlayerStatsManager.add_scrap(1)
		
		# Popup text +1 Peça
		var damage_number_scene = preload("res://scenes/effects/damage_number.tscn")
		var dn = damage_number_scene.instantiate()
		dn.global_position = global_position + Vector2(0, -15)
		get_tree().current_scene.add_child(dn)
		dn.setup("+1 PEÇA DE COMPONENTE", Color(0.2, 1.0, 0.8), false)
		
		queue_free()

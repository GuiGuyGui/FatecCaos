extends Area2D
class_name MoneyDrop

@export var value: int = 50

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	# Disappear after 30 seconds if not collected
	await get_tree().create_timer(30.0).timeout
	queue_free()

func _on_body_entered(body: Node2D) -> void:
	if body is Player:
		GameManager.add_money(value)
		SoundManager.play_sound("snd_buy", 0.1, -2.0)
		queue_free()

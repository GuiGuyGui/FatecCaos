extends Node2D
class_name DamageNumber

@onready var label: Label = $Label

func setup(text: String, color: Color = Color.WHITE, is_crit: bool = false) -> void:
	if not label:
		label = $Label
	label.add_theme_color_override("font_color", color)
	
	var target_scale = Vector2(1.3, 1.3) if is_crit else Vector2(1.0, 1.0)
	scale = Vector2(0.5, 0.5)
	
	var tween = create_tween()
	tween.tween_property(self, "scale", target_scale, 0.15).set_trans(Tween.TRANS_BACK)
	tween.parallel().tween_property(self, "position:y", position.y - 25.0, 0.6)
	tween.tween_property(self, "modulate:a", 0.0, 0.3)
	tween.tween_callback(queue_free)

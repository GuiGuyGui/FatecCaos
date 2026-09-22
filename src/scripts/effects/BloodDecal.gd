extends Sprite2D
class_name BloodDecal

func _ready() -> void:
	# Randomize blood frame and orientation
	var blood_idx = randi() % 3
	var tex = load("res://assets/sprites/effects/spr_floor_blood/spr_floor_blood_" + str(blood_idx) + ".png")
	if tex:
		texture = tex
	rotation = randf_range(0, TAU) if not is_on_floor() else 0.0
	scale = Vector2(randf_range(0.8, 1.2), randf_range(0.8, 1.2))

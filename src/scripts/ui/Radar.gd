extends Control
class_name Radar

@export var radar_range: float = 650.0
@export var radar_radius_px: float = 45.0

var sweep_angle: float = 0.0

func _process(delta: float) -> void:
	sweep_angle += delta * 3.0
	if sweep_angle > TAU:
		sweep_angle -= TAU
	queue_redraw()

func _draw() -> void:
	var center = size * 0.5
	
	# Radar background circle
	draw_circle(center, radar_radius_px, Color(0.04, 0.08, 0.06, 0.75))
	draw_arc(center, radar_radius_px, 0, TAU, 32, Color(0.1, 0.8, 0.3, 0.8), 1.5)
	draw_arc(center, radar_radius_px * 0.5, 0, TAU, 24, Color(0.1, 0.8, 0.3, 0.3), 1.0)
	
	# Crosshairs
	draw_line(center - Vector2(radar_radius_px, 0), center + Vector2(radar_radius_px, 0), Color(0.1, 0.8, 0.3, 0.25), 1.0)
	draw_line(center - Vector2(0, radar_radius_px), center + Vector2(0, radar_radius_px), Color(0.1, 0.8, 0.3, 0.25), 1.0)
	
	# Sweep beam
	var sweep_vec = Vector2.RIGHT.rotated(sweep_angle) * radar_radius_px
	draw_line(center, center + sweep_vec, Color(0.2, 1.0, 0.4, 0.6), 1.2)
	
	var players = get_tree().get_nodes_in_group("players")
	var local_player: Player = null
	for p in players:
		if p is Player and p.is_local_player and not p.is_dead:
			local_player = p
			break
	
	if not local_player:
		return
	
	var player_pos = local_player.global_position
	
	# Draw player (green triangle/dot at center)
	draw_circle(center, 3.0, Color(0.2, 1.0, 0.3, 1.0))
	
	# Draw Mystery Box
	var boxes = get_tree().get_nodes_in_group("mystery_box")
	for b in boxes:
		if is_instance_valid(b) and b is Node2D:
			var rel = (b.global_position - player_pos)
			if rel.length() <= radar_range:
				var blip = center + (rel / radar_range) * radar_radius_px
				draw_circle(blip, 3.5, Color(1.0, 0.85, 0.1, 1.0))
	
	# Draw Perk Machines
	var perks = get_tree().get_nodes_in_group("perk_machines")
	for pm in perks:
		if is_instance_valid(pm) and pm is Node2D:
			var rel = (pm.global_position - player_pos)
			if rel.length() <= radar_range:
				var blip = center + (rel / radar_range) * radar_radius_px
				draw_circle(blip, 3.0, Color(0.1, 0.8, 1.0, 0.9))
	
	# Draw Zombies (red blips)
	var zombies = get_tree().get_nodes_in_group("zombies")
	for z in zombies:
		if is_instance_valid(z) and z is Node2D and not z.get("is_dead"):
			var rel = (z.global_position - player_pos)
			if rel.length() <= radar_range:
				var blip = center + (rel / radar_range) * radar_radius_px
				var is_boss = z is BossZombie
				var col = Color(1.0, 0.2, 0.2, 0.9) if not is_boss else Color(1.0, 0.1, 0.8, 1.0)
				draw_circle(blip, 3.5 if is_boss else 2.2, col)

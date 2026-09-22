extends RigidBody2D
class_name Grenade

@export var damage: float = 350.0
@export var explosion_radius: float = 150.0
@export var fuse_time: float = 2.0

var has_exploded: bool = false

@onready var sprite: Sprite2D = $Sprite2D
@onready var explosion_area: Area2D = $ExplosionArea

func _ready() -> void:
	contact_monitor = true
	max_contacts_reported = 3
	body_entered.connect(_on_body_bounce)
	
	# Fuse timer
	await get_tree().create_timer(fuse_time).timeout
	_explode()

func _on_body_bounce(_body: Node) -> void:
	SoundManager.play_sound_2d("snd_metal_hit1", global_position, 0.1, -4.0)

func _explode() -> void:
	if has_exploded:
		return
	has_exploded = true
	
	SoundManager.play_sound_2d("snd_P_bw_bigbadaboom", global_position, 0.1, 0.0)
	
	# 1. Damage and dismember nearby zombies
	var zombies = get_tree().get_nodes_in_group("zombies")
	for z in zombies:
		if is_instance_valid(z) and z is Zombie and not z.is_dead:
			var d = global_position.distance_to(z.global_position)
			if d <= explosion_radius:
				var dmg = damage * (1.0 - (d / explosion_radius) * 0.4)
				var dir = (z.global_position - global_position).normalized()
				z.take_headshot(dmg, dir * 500.0, "explosive")
	
	# 2. MASSIVE LETHAL DAMAGE TO PLAYER (Almost always fatal)
	var players = get_tree().get_nodes_in_group("players")
	if players.is_empty():
		var p_single = get_tree().get_first_node_in_group("player")
		if p_single:
			players.append(p_single)
			
	for p in players:
		if is_instance_valid(p) and p is Player and not p.is_dead:
			var dist = global_position.distance_to(p.global_position)
			if dist <= explosion_radius:
				var prox_factor = 1.0 - (dist / explosion_radius)
				# 90 to 180 damage (Player has 100 max HP -> instant kill in center, near lethal on edge)
				var player_dmg = lerp(90.0, 180.0, prox_factor)
				var knockback_dir = (p.global_position - global_position).normalized()
				p.velocity += knockback_dir * 600.0
				p.take_damage(player_dmg)
				p._shake_camera(12.0)
				SoundManager.play_sound("snd_warning", 0.0, 2.0)

	queue_free()

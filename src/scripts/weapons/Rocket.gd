extends Area2D
class_name Rocket

var direction: Vector2 = Vector2.RIGHT
var speed: float = 750.0
var damage: float = 600.0
var explosion_radius: float = 160.0
var knockback: float = 700.0
var lifetime: float = 3.0
var has_exploded: bool = false

@onready var sprite: Sprite2D = $Sprite2D

func _ready() -> void:
	rotation = direction.angle()
	body_entered.connect(_on_body_entered)
	area_entered.connect(_on_area_entered)
	await get_tree().create_timer(lifetime).timeout
	_explode()

func _physics_process(delta: float) -> void:
	if has_exploded:
		return
	position += direction * speed * delta
	speed += 400.0 * delta

func _on_body_entered(_body: Node2D) -> void:
	_explode()

func _on_area_entered(_area: Area2D) -> void:
	_explode()

func _explode() -> void:
	if has_exploded:
		return
	has_exploded = true
	
	SoundManager.play_sound_2d("snd_P_bw_bigbadaboom", global_position, 0.1, 2.0)
	
	# 1. Damage all zombies in AoE radius
	var zombies = get_tree().get_nodes_in_group("zombies")
	for z in zombies:
		if is_instance_valid(z) and not z.is_dead:
			var d = global_position.distance_to(z.global_position)
			if d <= explosion_radius:
				var dmg = damage * (1.0 - (d / explosion_radius) * 0.4)
				var dir = (z.global_position - global_position).normalized()
				if z.has_method("take_headshot"):
					z.take_headshot(dmg, dir * knockback, "explosive")
				elif z.has_method("take_damage_hit"):
					z.take_damage_hit(dmg, dir * knockback, z.global_position, "explosive")

	# 2. MASSIVE LETHAL DAMAGE TO PLAYER (Instant kill on direct hit / close blast)
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
				var player_dmg = lerp(95.0, 220.0, prox_factor)
				var knockback_dir = (p.global_position - global_position).normalized()
				p.velocity += knockback_dir * 750.0
				p.take_damage(player_dmg)
				p._shake_camera(14.0)

	queue_free()

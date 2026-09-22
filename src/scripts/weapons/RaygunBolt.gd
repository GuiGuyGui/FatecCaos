extends Area2D
class_name RaygunBolt

var direction: Vector2 = Vector2.RIGHT
var speed: float = 1600.0
var damage: float = 280.0
var knockback: float = 250.0
var lifetime: float = 1.2
var _is_destroyed: bool = false

@onready var sprite: Sprite2D = $Sprite2D
@onready var light: PointLight2D = $PointLight2D

func _ready() -> void:
	rotation = direction.angle()
	_cleanup_timer()

func _cleanup_timer() -> void:
	await get_tree().create_timer(lifetime).timeout
	if is_instance_valid(self) and not _is_destroyed:
		queue_free()

func _physics_process(delta: float) -> void:
	if _is_destroyed:
		return

	var step_vec = direction * speed * delta
	var start_pos = global_position
	var end_pos = start_pos + step_vec

	var exclude_rids = [get_rid()]
	var players = get_tree().get_nodes_in_group("players")
	for p in players:
		if is_instance_valid(p) and p is CollisionObject2D:
			exclude_rids.append(p.get_rid())

	var space_state = get_world_2d().direct_space_state
	var query = PhysicsRayQueryParameters2D.create(start_pos, end_pos)
	query.collision_mask = collision_mask
	query.collide_with_areas = false
	query.collide_with_bodies = true
	query.exclude = exclude_rids

	var result = space_state.intersect_ray(query)
	if result:
		if result.collider is Player or (result.collider is Node and result.collider.is_in_group("players")):
			global_position = end_pos
		else:
			global_position = result.position
			_explode(result.collider, result.position)
	else:
		global_position = end_pos

func _explode(target: Object, hit_point: Vector2) -> void:
	if _is_destroyed:
		return
	_is_destroyed = true
	
	SoundManager.play_sound_2d("snd_spaceshot", hit_point, 0.1, 2.0)
	
	# AoE green plasma splash damage
	var radius = 55.0
	var zombies = get_tree().get_nodes_in_group("zombies")
	for z in zombies:
		if is_instance_valid(z) and not z.get("is_dead"):
			var d = hit_point.distance_to(z.global_position)
			if d <= radius:
				var falloff = 1.0 - (d / radius) * 0.4
				var hit_force = (z.global_position - hit_point).normalized() * knockback
				if z.has_method("take_damage_hit"):
					z.take_damage_hit(damage * falloff, hit_force, z.global_position + Vector2(0, -25))
				elif z.has_method("take_damage"):
					z.take_damage(damage * falloff)
	
	var players = get_tree().get_nodes_in_group("players")
	for p in players:
		if p is Player and p.is_local_player:
			p._shake_camera(3.5)
	
	queue_free()

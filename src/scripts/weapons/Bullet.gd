extends Area2D
class_name Bullet

var direction: Vector2 = Vector2.RIGHT
var speed: float = 1600.0
var damage: float = 25.0
var knockback: float = 100.0
var lifetime: float = 2.0
var _is_destroyed: bool = false
var shooter: Node2D = null

@onready var trail: Line2D = get_node_or_null("TracerTrail")
@onready var sprite: Sprite2D = get_node_or_null("Sprite2D")
var trail_points: Array[Vector2] = []
const MAX_TRAIL_LENGTH: int = 8

func _ready() -> void:
	rotation = direction.angle()
	z_index = 30
	if sprite:
		sprite.z_index = 31
	if trail:
		trail.z_index = 30
		trail.clear_points()
		trail.add_point(global_position)
		trail.add_point(global_position - direction * 20.0)
	
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

	# Build dynamic exclusion list including all players
	var exclude_rids = [get_rid()]
	if is_instance_valid(shooter) and shooter is CollisionObject2D:
		exclude_rids.append(shooter.get_rid())
	var players = get_tree().get_nodes_in_group("players")
	for p in players:
		if is_instance_valid(p) and p is CollisionObject2D:
			exclude_rids.append(p.get_rid())

	# Swept raycast continuous collision detection
	var space_state = get_world_2d().direct_space_state
	var query = PhysicsRayQueryParameters2D.create(start_pos, end_pos)
	query.collision_mask = collision_mask
	query.collide_with_areas = false
	query.collide_with_bodies = true
	query.exclude = exclude_rids

	var result = space_state.intersect_ray(query)
	if result:
		var col = result.collider
		# Check if collider is a Player (ignore friendly fire / own body)
		if col is Player or (col is Node and col.is_in_group("players")):
			global_position = end_pos
		# Check if collider is a one-way platform (bullets penetrate jump-through floors)
		elif col is StaticBody2D and (col.name.begins_with("Platform_") or _is_one_way_collider(col)):
			global_position = end_pos
		else:
			global_position = result.position
			_handle_hit(col, result.position)
	else:
		global_position = end_pos

	_update_trail()

func _is_one_way_collider(body: StaticBody2D) -> bool:
	for child in body.get_children():
		if child is CollisionShape2D and child.one_way_collision:
			return true
	return false

func _update_trail() -> void:
	if not trail:
		return
	trail_points.push_front(global_position)
	if trail_points.size() > MAX_TRAIL_LENGTH:
		trail_points.pop_back()
	
	trail.clear_points()
	for pt in trail_points:
		trail.add_point(pt)

func _handle_hit(target: Object, hit_point: Vector2) -> void:
	if _is_destroyed or not is_instance_valid(target):
		return
	
	# Skip if target is a Player
	if target is Player or (target is Node and target.is_in_group("players")):
		return

	# Skip one-way platforms
	if target is StaticBody2D and (target.name.begins_with("Platform_") or _is_one_way_collider(target)):
		return

	_is_destroyed = true

	# If hit enemy (Zombie or BossZombie)
	if target.has_method("take_damage_hit"):
		var effective_dmg = damage
		if GameManager.is_fire_bullets:
			effective_dmg *= 1.6
			SoundManager.play_sound_2d("snd_pop", hit_point, 0.1, 1.0)
		
		var rel_y = hit_point.y - target.global_position.y
		# Head zone calculation: top of zombie
		if not (target is BossZombie) and rel_y <= -38.0 and target.has_method("take_headshot"):
			target.take_headshot(effective_dmg, direction * knockback * 1.5)
		elif target is BossZombie and rel_y <= -42.0 and target.has_method("take_headshot"):
			target.take_headshot(effective_dmg * 1.8, direction * knockback * 1.2)
		else:
			target.take_damage_hit(effective_dmg, direction * knockback, hit_point)
		queue_free()
		return
	elif target.has_method("take_damage"):
		target.take_damage(damage)
		queue_free()
		return
	elif target is TileMap or target is StaticBody2D or target is TileMapLayer:
		SoundManager.play_sound_2d("snd_bullet_hit_ground", hit_point, 0.1, -6.0)
		queue_free()
		return

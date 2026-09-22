extends Area2D
class_name SpecialProjectile

@export var weapon_id: String = ""
@export var direction: Vector2 = Vector2.RIGHT
@export var speed: float = 1400.0
@export var damage: float = 150.0
@export var knockback: float = 200.0
@export var lifetime: float = 2.5
@export var pierce_count: int = 1
@export var aoe_radius: float = 0.0
@export var is_homing: bool = false
@export var homing_turn_speed: float = 8.0
@export var pass_walls: bool = false
@export var effect_type: String = "none" # "cryo", "arc", "void", "incinerator", "pulse", "disruptor", "plasma", "neutron"
@export var bullet_texture_path: String = ""

var _current_pierce: int = 0
var _is_destroyed: bool = false
var _hit_entities: Array[Node] = []
var _target_enemy: Node2D = null

@onready var sprite: Sprite2D = $Sprite2D
@onready var trail: Line2D = get_node_or_null("TracerTrail")
var trail_points: Array[Vector2] = []
const MAX_TRAIL_LENGTH: int = 8

func _ready() -> void:
	rotation = direction.angle()
	if bullet_texture_path != "" and ResourceLoader.exists(bullet_texture_path):
		if sprite:
			sprite.texture = load(bullet_texture_path)
			sprite.rotation = 0
			var tex_size = sprite.texture.get_size()
			if tex_size.x > 32 or tex_size.y > 32:
				var max_dim = max(tex_size.x, tex_size.y)
				sprite.scale = Vector2.ONE * (28.0 / max_dim)
	
	if trail:
		trail.clear_points()
		trail.add_point(global_position)
		_setup_trail_color()

	body_entered.connect(_on_body_entered)
	area_entered.connect(_on_area_entered)
	
	_cleanup_timer()

func _setup_trail_color() -> void:
	if not trail:
		return
	match effect_type:
		"cryo":
			trail.default_color = Color(0.3, 0.85, 1.0, 0.8)
		"arc":
			trail.default_color = Color(0.4, 0.7, 1.0, 0.9)
		"void":
			trail.default_color = Color(0.7, 0.2, 0.9, 0.85)
		"incinerator":
			trail.default_color = Color(1.0, 0.45, 0.1, 0.85)
		"pulse":
			trail.default_color = Color(0.2, 1.0, 0.8, 0.85)
		"disruptor":
			trail.default_color = Color(1.0, 0.2, 0.5, 0.85)
		"plasma", "nova":
			trail.default_color = Color(0.2, 0.9, 1.0, 0.9)
		"neutron":
			trail.default_color = Color(0.4, 1.0, 0.3, 0.85)
		"phantom":
			trail.default_color = Color(0.6, 0.3, 1.0, 0.75)
		_:
			trail.default_color = Color(1.0, 0.85, 0.3, 0.8)

func _cleanup_timer() -> void:
	await get_tree().create_timer(lifetime).timeout
	if is_instance_valid(self) and not _is_destroyed:
		_destroy()

func _physics_process(delta: float) -> void:
	if _is_destroyed:
		return

	if is_homing:
		_update_homing(delta)

	var step_vec = direction * speed * delta
	var start_pos = global_position
	var end_pos = start_pos + step_vec

	if not pass_walls:
		var space_state = get_world_2d().direct_space_state
		var query = PhysicsRayQueryParameters2D.create(start_pos, end_pos)
		query.collision_mask = 1
		query.collide_with_areas = false
		query.collide_with_bodies = true
		
		var result = space_state.intersect_ray(query)
		if result:
			global_position = result.position
			_on_impact(result.collider, result.position)
			return
		else:
			global_position = end_pos
	else:
		global_position = end_pos

	rotation = direction.angle()
	_update_trail()

func _is_zombie_alive(z: Node) -> bool:
	if not is_instance_valid(z):
		return false
	if "is_dead" in z and z.is_dead:
		return false
	return true

func _update_homing(delta: float) -> void:
	if not _is_zombie_alive(_target_enemy):
		var zombies = get_tree().get_nodes_in_group("zombies")
		var closest_dist = 400.0
		_target_enemy = null
		for z in zombies:
			if _is_zombie_alive(z) and z is Node2D:
				var d = global_position.distance_to(z.global_position)
				if d < closest_dist:
					closest_dist = d
					_target_enemy = z
					
	if is_instance_valid(_target_enemy):
		var target_dir = (_get_enemy_pos() - global_position).normalized()
		direction = direction.slerp(target_dir, homing_turn_speed * delta).normalized()

func _get_enemy_pos() -> Vector2:
	if is_instance_valid(_target_enemy):
		return _target_enemy.global_position
	return global_position + direction * 100.0

func _update_trail() -> void:
	if not trail:
		return
	trail_points.push_front(global_position)
	if trail_points.size() > MAX_TRAIL_LENGTH:
		trail_points.pop_back()
	
	trail.clear_points()
	for pt in trail_points:
		trail.add_point(pt)

func _on_body_entered(body: Node2D) -> void:
	if _is_destroyed or not is_instance_valid(body):
		return
	if body is Player or body.is_in_group("players"):
		return
	if body in _hit_entities:
		return
	_on_impact(body, global_position)

func _on_area_entered(area: Area2D) -> void:
	if _is_destroyed or not is_instance_valid(area):
		return
	var parent = area.get_parent()
	if parent and parent.has_method("take_damage_hit") and not (parent in _hit_entities):
		_on_impact(parent, global_position)

func _on_impact(target: Object, hit_pos: Vector2) -> void:
	if _is_destroyed:
		return

	if target is Node:
		_hit_entities.append(target)

	if aoe_radius > 0.0:
		_trigger_aoe_blast(hit_pos)
		_destroy()
		return

	if target and target.has_method("take_damage_hit"):
		var effective_dmg = damage
		if GameManager.is_fire_bullets:
			effective_dmg *= 1.5
		
		_apply_special_effects(target, hit_pos)
		
		var rel_y = hit_pos.y - target.global_position.y
		if not (target is BossZombie) and rel_y <= -38.0 and target.has_method("take_headshot"):
			target.take_headshot(effective_dmg * 1.5, direction * knockback * 1.5)
		else:
			target.take_damage_hit(effective_dmg, direction * knockback, hit_pos)

	_current_pierce += 1
	if _current_pierce >= pierce_count and not (target is TileMap or (target is StaticBody2D and pass_walls)):
		_destroy()

func _apply_special_effects(target: Object, hit_pos: Vector2) -> void:
	match effect_type:
		"cryo":
			if "speed_modifier" in target:
				target.speed_modifier = 0.35
				_reset_speed_delayed(target, 3.5)
			SoundManager.play_sound_2d("snd_pop", hit_pos, 0.1, 1.4)
		"arc":
			_trigger_chain_lightning(target, 4, damage * 0.75)
		"void":
			_trigger_gravity_pull(hit_pos, 140.0, 350.0)
		"pulse":
			if "stun_timer" in target:
				target.stun_timer = 1.8
		"incinerator":
			_spawn_burning_ground(hit_pos)

func _reset_speed_delayed(target: Object, delay: float) -> void:
	await get_tree().create_timer(delay).timeout
	if is_instance_valid(target) and "speed_modifier" in target:
		target.speed_modifier = 1.0

func _trigger_chain_lightning(initial_target: Node, max_chains: int, chain_dmg: float) -> void:
	var hit_chain = [initial_target]
	var current_node = initial_target
	var zombies = get_tree().get_nodes_in_group("zombies")
	
	for c in range(max_chains):
		var next_target: Node2D = null
		var min_d = 160.0
		for z in zombies:
			if _is_zombie_alive(z) and not (z in hit_chain) and z is Node2D:
				var d = current_node.global_position.distance_to(z.global_position)
				if d < min_d:
					min_d = d
					next_target = z
		
		if next_target:
			hit_chain.append(next_target)
			_draw_lightning_segment(current_node.global_position, next_target.global_position)
			next_target.take_damage_hit(chain_dmg, Vector2.ZERO, next_target.global_position)
			current_node = next_target
		else:
			break

func _draw_lightning_segment(from_pos: Vector2, to_pos: Vector2) -> void:
	var l = Line2D.new()
	l.width = 2.5
	l.default_color = Color(0.4, 0.8, 1.0, 0.9)
	l.add_point(from_pos)
	var mid = (from_pos + to_pos) / 2.0 + Vector2(randf_range(-12, 12), randf_range(-12, 12))
	l.add_point(mid)
	l.add_point(to_pos)
	l.z_index = 10
	get_tree().current_scene.add_child(l)
	
	var tween = get_tree().create_tween()
	tween.tween_property(l, "modulate:a", 0.0, 0.15)
	await tween.finished
	l.queue_free()

func _trigger_gravity_pull(center_pos: Vector2, radius: float, pull_strength: float) -> void:
	var zombies = get_tree().get_nodes_in_group("zombies")
	for z in zombies:
		if _is_zombie_alive(z) and z is Node2D:
			var d = center_pos.distance_to(z.global_position)
			if d <= radius:
				var pull_dir = (center_pos - z.global_position).normalized()
				if "velocity" in z:
					z.velocity += pull_dir * pull_strength
				z.take_damage_hit(damage * 0.5, pull_dir * pull_strength * 0.5, center_pos)

func _spawn_burning_ground(pos: Vector2) -> void:
	var burn_area = Area2D.new()
	burn_area.global_position = pos
	var col = CollisionShape2D.new()
	var shape = CircleShape2D.new()
	shape.radius = 45.0
	col.shape = shape
	burn_area.add_child(col)
	burn_area.collision_layer = 0
	burn_area.collision_mask = 2
	get_tree().current_scene.add_child(burn_area)
	
	var timer = 0.0
	while timer < 4.0 and is_instance_valid(burn_area):
		await get_tree().create_timer(0.4).timeout
		timer += 0.4
		if not is_instance_valid(burn_area):
			break
		var bodies = burn_area.get_overlapping_bodies()
		for b in bodies:
			if is_instance_valid(b) and b.has_method("take_damage_hit"):
				b.take_damage_hit(damage * 0.4, Vector2.ZERO, b.global_position)
	if is_instance_valid(burn_area):
		burn_area.queue_free()

func _trigger_aoe_blast(blast_pos: Vector2) -> void:
	SoundManager.play_sound_2d("snd_P_bw_bigbadaboom", blast_pos, 0.1, 2.0)
	var zombies = get_tree().get_nodes_in_group("zombies")
	for z in zombies:
		if _is_zombie_alive(z) and z is Node2D:
			var d = blast_pos.distance_to(z.global_position)
			if d <= aoe_radius:
				var factor = 1.0 - (d / aoe_radius) * 0.5
				var dmg = damage * factor
				var dir = (z.global_position - blast_pos).normalized()
				if z.has_method("take_headshot"):
					z.take_headshot(dmg, dir * knockback, "explosive")
				elif z.has_method("take_damage_hit"):
					z.take_damage_hit(dmg, dir * knockback, z.global_position, "explosive")

func _destroy() -> void:
	_is_destroyed = true
	queue_free()

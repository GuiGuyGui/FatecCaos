extends CharacterBody2D
class_name Zombie

@export var zombie_type: String = "civil" # civil, crazy, fat, crawler, cop, swat, doctor, rover, hillbilly, mummy, split_crawler
@export var max_health: float = 45.0
var health: float = 45.0
var speed: float = 70.0
var damage: float = 20.0
var is_dead: bool = false
var is_headshot: bool = false
var is_dismembered_legs: bool = false

var leg_health: float = 40.0
var can_be_severed: bool = false
var attack_cooldown_timer: float = 0.0

const GRAVITY: float = 850.0

@onready var visuals: Node2D = $Visuals
@onready var sprite: Sprite2D = $Visuals/Sprite2D
@onready var blood_overlay: Sprite2D = $Visuals/BloodOverlay
@onready var head_area: Area2D = $HeadArea
@onready var collision_shape: CollisionShape2D = $CollisionShape2D

var target_player: Player = null
var money_scene = preload("res://scenes/environment/money_drop.tscn")
var flying_head_scene = preload("res://scenes/effects/flying_head.tscn")
var flying_limb_scene = preload("res://scenes/effects/flying_limb.tscn")
var powerup_scene = preload("res://scenes/environment/power_up_drop.tscn")

var walk_frames: Array[Texture2D] = []
var die_frames: Array[Texture2D] = []
var die_headless_frames: Array[Texture2D] = []
var blood_frames: Array[Texture2D] = []

var anim_timer: float = 0.0
var bleed_drip_timer: float = 0.0
var origin_offset: Vector2 = Vector2(-25, -63)
var wave_number: int = 1

var burning_timer: float = 0.0
var burn_tick_timer: float = 0.0
var fire_particles: CPUParticles2D = null

var nav_target_x: float = 0.0
var has_nav_target: bool = false
var repath_timer: float = 0.0
var drop_timer: float = 0.0
var jump_cooldown: float = 0.0

func _ready() -> void:
	# Load 12 progressive blood staining overlay textures
	for i in range(12):
		var p = "res://assets/sprites/characters/spr_player_blood/spr_player_blood_" + str(i) + ".png"
		if ResourceLoader.exists(p):
			blood_frames.append(load(p))

	_setup_fire_particles()
	_setup_zombie_type()
	_apply_wave_scaling()

func _setup_fire_particles() -> void:
	fire_particles = CPUParticles2D.new()
	fire_particles.emitting = false
	fire_particles.amount = 14
	fire_particles.lifetime = 0.35
	fire_particles.color = Color(1.0, 0.45, 0.1, 0.9)
	fire_particles.spread = 180.0
	fire_particles.gravity = Vector2(0, -90)
	fire_particles.initial_velocity_min = 20.0
	fire_particles.initial_velocity_max = 50.0
	fire_particles.scale_amount_min = 2.0
	fire_particles.scale_amount_max = 4.0
	fire_particles.position = Vector2(0, -25)
	add_child(fire_particles)

func setup(type: String, wave_num: int = 1) -> void:
	zombie_type = type
	wave_number = wave_num
	_setup_zombie_type()
	_apply_wave_scaling()

func _apply_wave_scaling() -> void:
	var base_hp = 75.0
	if zombie_type == "crazy": base_hp = 60.0
	elif zombie_type == "cop": base_hp = 135.0
	elif zombie_type == "swat": base_hp = 175.0
	elif zombie_type == "doctor": base_hp = 90.0
	elif zombie_type == "hillbilly": base_hp = 105.0
	elif zombie_type == "rover": base_hp = 65.0
	elif zombie_type == "crawler": base_hp = 45.0
	elif zombie_type == "mummy": base_hp = 125.0
	elif zombie_type == "fat": base_hp = 260.0
	
	# Massive progressive exponential health scaling curve:
	# Waves 1 to 9: +35% health per wave
	# Waves 10+: +15% compounding exponential health per wave
	if wave_number <= 9:
		max_health = base_hp + (wave_number - 1) * (base_hp * 0.35)
	else:
		var wave9_hp = base_hp + 8.0 * (base_hp * 0.35)
		max_health = wave9_hp * pow(1.15, wave_number - 9)
		
	health = max_health
	damage = 20.0 + (wave_number - 1) * 3.0
	speed = speed * min(1.65, 1.0 + (wave_number - 1) * 0.04)
	leg_health = max(45.0, max_health * 0.45)

func _load_frames(folder_path: String, file_prefix: String, max_count: int = 16) -> Array[Texture2D]:
	var frames: Array[Texture2D] = []
	for i in range(max_count):
		var p = folder_path + "/" + file_prefix + "_" + str(i) + ".png"
		if ResourceLoader.exists(p):
			frames.append(load(p))
	return frames

func _set_collision_capsule(height: float, radius: float = 9.0) -> void:
	var shape = CapsuleShape2D.new()
	shape.radius = radius
	shape.height = height
	collision_shape.shape = shape
	collision_shape.position = Vector2(0, -height / 2.0)

func _setup_zombie_type() -> void:
	if zombie_type == null or zombie_type == "":
		zombie_type = "civil"
	walk_frames.clear()
	die_frames.clear()
	die_headless_frames.clear()
	can_be_severed = false

	if zombie_type == "crazy":
		speed = randf_range(120.0, 145.0)
		max_health = 35.0
		damage = 15.0
		origin_offset = Vector2(-35, -63)
		_set_collision_capsule(50.0, 9.0)
		head_area.position = Vector2(0, -38)
		walk_frames = _load_frames("res://assets/sprites/enemies/spr_crazy_zombie", "spr_crazy_zombie", 10)
		die_frames = _load_frames("res://assets/sprites/enemies/spr_crazy_zombie_die", "spr_crazy_zombie_die", 10)
		die_headless_frames = _load_frames("res://assets/sprites/enemies/spr_crazy_zombie_headless_die", "spr_crazy_zombie_headless_die", 10)
	elif zombie_type == "cop":
		speed = randf_range(65.0, 85.0)
		max_health = 70.0
		damage = 22.0
		origin_offset = Vector2(-16, -64)
		_set_collision_capsule(58.0, 9.0)
		head_area.position = Vector2(0, -49)
		walk_frames = _load_frames("res://assets/sprites/enemies/spr_cop_zombie", "spr_cop_zombie", 12)
		die_frames = _load_frames("res://assets/sprites/enemies/spr_cop_die", "spr_cop_die", 10)
		die_headless_frames = _load_frames("res://assets/sprites/enemies/spr_cop_die_headless", "spr_cop_die_headless", 10)
	elif zombie_type == "swat":
		speed = randf_range(65.0, 80.0)
		max_health = 90.0
		damage = 25.0
		origin_offset = Vector2(-16, -64)
		_set_collision_capsule(58.0, 9.0)
		head_area.position = Vector2(0, -49)
		walk_frames = _load_frames("res://assets/sprites/enemies/spr_swat_zombie", "spr_swat_zombie", 12)
		die_frames = _load_frames("res://assets/sprites/enemies/spr_swat_zombie_die", "spr_swat_zombie_die", 12)
		die_headless_frames = _load_frames("res://assets/sprites/enemies/spr_cop_die_headless", "spr_cop_die_headless", 10)
	elif zombie_type == "doctor":
		speed = randf_range(95.0, 115.0)
		max_health = 55.0
		damage = 18.0
		origin_offset = Vector2(-36, -56)
		_set_collision_capsule(54.0, 9.0)
		head_area.position = Vector2(0, -46)
		walk_frames = _load_frames("res://assets/sprites/enemies/spr_zombie_doctor", "spr_zombie_doctor", 10)
		die_frames = _load_frames("res://assets/sprites/general/spr_doc_die", "spr_doc_die", 10)
		die_headless_frames = _load_frames("res://assets/sprites/general/spr_doc_die_headless", "spr_doc_die_headless", 10)
	elif zombie_type == "hillbilly":
		speed = randf_range(70.0, 90.0)
		max_health = 60.0
		damage = 24.0
		origin_offset = Vector2(-16, -64)
		_set_collision_capsule(58.0, 9.0)
		head_area.position = Vector2(0, -49)
		walk_frames = _load_frames("res://assets/sprites/enemies/spr_hillbilly_zombie", "spr_hillbilly_zombie", 12)
		die_frames = _load_frames("res://assets/sprites/general/spr_hillbilly_die", "spr_hillbilly_die", 10)
		die_headless_frames = _load_frames("res://assets/sprites/general/spr_hillbilly_die_headles", "spr_hillbilly_die_headles", 10)
	elif zombie_type == "rover":
		speed = randf_range(100.0, 118.0) # Reduced speed for quadruped white zombie
		max_health = 35.0
		damage = 16.0
		origin_offset = Vector2(-32, -63)
		_set_collision_capsule(34.0, 9.0)
		head_area.position = Vector2(10, -22)
		walk_frames = _load_frames("res://assets/sprites/enemies/spr_zombie_rover", "spr_zombie_rover", 16)
		die_frames = _load_frames("res://assets/sprites/enemies/spr_zombie_rover_die", "spr_zombie_rover_die", 10)
	elif zombie_type == "crawler":
		speed = randf_range(35.0, 50.0)
		max_health = 25.0
		damage = 12.0
		origin_offset = Vector2(-26, -64)
		_set_collision_capsule(22.0, 8.0)
		head_area.position = Vector2(0, -14)
		walk_frames = _load_frames("res://assets/sprites/enemies/spr_zombie_crawler", "spr_zombie_crawler", 6)
		die_frames = _load_frames("res://assets/sprites/general/spr_crawler_die", "spr_crawler_die", 8)
		die_headless_frames = _load_frames("res://assets/sprites/general/spr_crawler_die_headless", "spr_crawler_die_headless", 8)
	elif zombie_type == "mummy":
		speed = randf_range(60.0, 80.0)
		max_health = 65.0
		damage = 22.0
		origin_offset = Vector2(-32, -64)
		_set_collision_capsule(58.0, 9.0)
		head_area.position = Vector2(0, -49)
		walk_frames = _load_frames("res://assets/sprites/enemies/spr_zombie_mummy", "spr_zombie_mummy", 12)
		die_frames = _load_frames("res://assets/sprites/general/spr_mummy_die", "spr_mummy_die", 10)
		die_headless_frames = _load_frames("res://assets/sprites/general/spr_headles_mummy_die", "spr_headles_mummy_die", 10)
	elif zombie_type == "fat":
		speed = randf_range(40.0, 55.0)
		max_health = 130.0
		damage = 35.0
		origin_offset = Vector2(-26, -64)
		_set_collision_capsule(58.0, 11.0)
		head_area.position = Vector2(0, -49)
		walk_frames = _load_frames("res://assets/sprites/enemies/spr_fat_zombie", "spr_fat_zombie", 12)
		die_frames = _load_frames("res://assets/sprites/enemies/spr_civil_zombie1_die", "spr_civil_zombie1_die", 10)
		die_headless_frames = _load_frames("res://assets/sprites/enemies/spr_civil_zombie1_die_headless", "spr_civil_zombie1_die_headless", 10)
	else: # civil
		can_be_severed = true
		speed = randf_range(60.0, 85.0)
		max_health = 45.0
		damage = 20.0
		origin_offset = Vector2(-25, -63)
		_set_collision_capsule(58.0, 9.0)
		head_area.position = Vector2(0, -49)
		walk_frames = _load_frames("res://assets/sprites/enemies/spr_civil_zombie1", "spr_civil_zombie1", 12)
		die_frames = _load_frames("res://assets/sprites/enemies/spr_civil_zombie1_die", "spr_civil_zombie1_die", 10)
		die_headless_frames = _load_frames("res://assets/sprites/enemies/spr_civil_zombie1_die_headless", "spr_civil_zombie1_die_headless", 10)

	sprite.centered = false
	sprite.offset = origin_offset
	if walk_frames.size() > 0:
		sprite.texture = walk_frames[0]

func _physics_process(delta: float) -> void:
	if is_dead:
		if fire_particles:
			fire_particles.emitting = false
		# If zombie died in mid-air, apply gravity until body lands firmly on the floor
		if not is_on_floor():
			velocity.y += GRAVITY * delta
			velocity.x = move_toward(velocity.x, 0.0, 300.0 * delta)
			move_and_slide()
		return

	if not is_on_floor():
		velocity.y += GRAVITY * delta

	if attack_cooldown_timer > 0.0:
		attack_cooldown_timer -= delta

	# Burning damage over time
	if burning_timer > 0.0:
		burning_timer -= delta
		burn_tick_timer += delta
		if fire_particles:
			fire_particles.emitting = true
		if burn_tick_timer >= 0.4:
			burn_tick_timer = 0.0
			health -= 8.0
			_update_blood_overlay()
			_spawn_damage_number(8.0, false)
			if health <= 0:
				die(false, Vector2.ZERO, "torso", "fire")
				return
	else:
		if fire_particles:
			fire_particles.emitting = false

	# Freeze Power-Up visual tint & slowdown
	var cur_speed = speed
	if GameManager.is_freeze:
		cur_speed = speed * 0.25
		sprite.self_modulate = Color(0.35, 0.65, 1.4, 1.0)
	elif burning_timer > 0.0:
		sprite.self_modulate = Color(1.4, 0.6, 0.3, 1.0)
	else:
		sprite.self_modulate = Color.WHITE

	if jump_cooldown > 0.0:
		jump_cooldown -= delta
	if drop_timer > 0.0:
		drop_timer -= delta

	# Periodic blood dripping if zombie is critically wounded
	if health < max_health * 0.45:
		bleed_drip_timer += delta
		if bleed_drip_timer >= randf_range(1.5, 2.8):
			bleed_drip_timer = 0.0
			_spawn_bleed_drip()

	repath_timer -= delta
	if repath_timer <= 0.0:
		repath_timer = 0.25
		_update_navigation_goal()

	if target_player and is_instance_valid(target_player):
		var target_x = target_player.global_position.x
		if has_nav_target:
			target_x = nav_target_x

		var dx = target_x - global_position.x
		var dir_x = sign(dx) if abs(dx) > 10.0 else 0.0
		velocity.x = dir_x * cur_speed
		if dir_x != 0:
			visuals.scale.x = 1.0 if dir_x > 0 else -1.0
		
		# Smart jumping: Jump over obstacles, walls, or jump up to platforms
		if is_on_floor() and not is_dismembered_legs and jump_cooldown <= 0.0:
			if is_on_wall():
				velocity.y = -380.0
				jump_cooldown = 0.4
			elif target_player.global_position.y < global_position.y - 30.0:
				# Near ascent point or ladder/jumppad/gap
				if abs(target_x - global_position.x) < 45.0 or (has_nav_target and abs(nav_target_x - global_position.x) < 50.0):
					velocity.y = randf_range(-400.0, -460.0)
					jump_cooldown = 0.5
				elif randf() < 0.04:
					velocity.y = randf_range(-340.0, -390.0)
					jump_cooldown = 0.6

		# Dropping down one-way platforms if player is on lower floor (only on upper floors)
		if target_player.global_position.y > global_position.y + 50.0 and drop_timer <= 0.0 and is_on_floor() and global_position.y < 310.0:
			drop_timer = 1.2
			_drop_through_platform()

		# Proximity melee bite/claw attack
		var dist_to_player = global_position.distance_to(target_player.global_position)
		var dy = abs(target_player.global_position.y - global_position.y)
		if dist_to_player <= 36.0 and dy <= 38.0 and attack_cooldown_timer <= 0.0:
			attack_cooldown_timer = 0.75
			_perform_melee_attack(target_player)
		else:
			_check_and_attack_doors(dir_x)
	else:
		velocity.x = 0

	move_and_slide()
	
	# Safety clamp: Guarantee zombie never falls out of the map below ground level (y=319.0)
	if global_position.y > 2000.0:
		global_position.y = 2000.0
		velocity.y = min(velocity.y, 0.0)
		
	_update_animation(delta)

func _drop_through_platform() -> void:
	if global_position.y < 310.0:
		global_position.y += 6.0
		velocity.y = 80.0

func _update_navigation_goal() -> void:
	if not target_player or not is_instance_valid(target_player) or target_player.is_dead:
		_find_closest_player()
		if not target_player:
			has_nav_target = false
			return

	var dy = target_player.global_position.y - global_position.y
	
	# If player is on same floor (dy between -45 and 45), target player directly
	if abs(dy) <= 45.0:
		has_nav_target = false
		return
		
	# If player is higher up (dy < -45):
	if dy < -45.0:
		var best_x = target_player.global_position.x
		var min_dist = 999999.0
		var found_connector = false
		
		# Check jump pads on this floor level (within vertical 50px)
		var pads = get_tree().get_nodes_in_group("jump_pads")
		for pad in pads:
			if is_instance_valid(pad):
				var pad_dy = abs(pad.global_position.y - global_position.y)
				if pad_dy <= 55.0:
					var dist = abs(pad.global_position.x - global_position.x)
					if dist < min_dist:
						min_dist = dist
						best_x = pad.global_position.x
						found_connector = true
		
		# If no jump pad on this floor level, check floor connector coordinates
		if not found_connector:
			var cur_y = global_position.y
			if cur_y >= -60.0:
				best_x = 219.0 # Jump pad / floor gap to 2F
			elif cur_y >= -190.0:
				best_x = -296.0 if abs(-296.0 - global_position.x) < abs(220.0 - global_position.x) else 220.0 # to 3F
			elif cur_y >= -330.0:
				best_x = 348.0 if abs(348.0 - global_position.x) < abs(-296.0 - global_position.x) else -296.0 # to 4F
			elif cur_y >= -480.0:
				best_x = -137.0 # to Roof
				
		nav_target_x = best_x
		has_nav_target = true
	else:
		# Player is below, move directly or towards gap
		has_nav_target = false

func _check_and_attack_doors(dir_x: float) -> void:
	if is_dead or attack_cooldown_timer > 0.0:
		return
		
	var doors = get_tree().get_nodes_in_group("doors")
	for d in doors:
		if is_instance_valid(d) and d is Door and not d.is_open:
			var dx = d.global_position.x - global_position.x
			var dy = abs(d.global_position.y - global_position.y)
			# Door is on same floor (dy <= 45.0) and within 36px in movement direction
			if dy <= 45.0 and abs(dx) <= 36.0 and (dir_x == 0 or sign(dx) == sign(dir_x)):
				velocity.x = 0
				attack_cooldown_timer = 0.65
				_perform_door_attack(d)
				break

func _perform_door_attack(door: Door) -> void:
	if not door or door.is_open:
		return
	
	if visuals:
		var tw = create_tween()
		var orig_x = visuals.position.x
		tw.tween_property(visuals, "position:x", orig_x + (visuals.scale.x * 6.0), 0.08)
		tw.tween_property(visuals, "position:x", orig_x, 0.1)
		
	door.take_damage_from_zombie(damage)

func _perform_melee_attack(player: Player) -> void:
	if not player or player.is_dead:
		return
	var bite_snds = ["snd_zombie_bite", "snd_gore_splatter", "snd_blade"]
	SoundManager.play_sound_2d(bite_snds[randi() % bite_snds.size()], global_position, 0.1, -1.0)
	
	player.take_damage(damage)
	
	# Push player back slightly
	var push_x = sign(player.global_position.x - global_position.x)
	if push_x == 0: push_x = 1.0
	player.velocity.x += push_x * 160.0
	player.velocity.y = min(player.velocity.y, -60.0)
	player._shake_camera(3.5)

func _update_animation(delta: float) -> void:
	if walk_frames.size() > 0 and abs(velocity.x) > 5.0:
		anim_timer += delta * (speed / 60.0) * 11.0
		var frame_idx = int(anim_timer) % walk_frames.size()
		sprite.texture = walk_frames[frame_idx]
	elif walk_frames.size() > 0:
		sprite.texture = walk_frames[0]

func _find_closest_player() -> void:
	var players = get_tree().get_nodes_in_group("players")
	var living_players: Array[Player] = []
	for p in players:
		if p is Player and not p.is_dead:
			living_players.append(p)
			
	if living_players.is_empty():
		target_player = null
		return
		
	if living_players.size() == 1:
		target_player = living_players[0]
		return
		
	var best_player: Player = null
	var best_score: float = -999999.0
	
	for p in living_players:
		var dist_to_zombie = global_position.distance_to(p.global_position)
		
		# Calculate isolation from other players (nearest teammate distance & count in group)
		var min_teammate_dist = 999999.0
		var teammates_nearby = 0
		for other in living_players:
			if other != p:
				var d_team = p.global_position.distance_to(other.global_position)
				if d_team < min_teammate_dist:
					min_teammate_dist = d_team
				if d_team < 240.0:
					teammates_nearby += 1
					
		# Scoring:
		# 1. Base distance (closer is better)
		var score = -dist_to_zombie
		# 2. Strong hunting bonus for isolated/solo players
		var isolation_bonus = min(min_teammate_dist * 1.8, 700.0)
		score += isolation_bonus
		# 3. Penalty for groups sticking together
		score -= (teammates_nearby * 220.0)
		# 4. Standing targets preferred over downed
		if p.is_downed:
			score -= 150.0
			
		if score > best_score:
			best_score = score
			best_player = p
			
	target_player = best_player

func _update_blood_overlay() -> void:
	if not blood_overlay or is_dead:
		return
	
	var hp_ratio = clamp(health / max_health, 0.0, 1.0)
	if hp_ratio >= 0.98 or blood_frames.is_empty():
		blood_overlay.visible = false
		sprite.modulate = Color.WHITE
	else:
		blood_overlay.visible = true
		blood_overlay.offset = sprite.offset
		var blood_idx = int((1.0 - hp_ratio) * (blood_frames.size() - 1))
		blood_idx = clamp(blood_idx, 0, blood_frames.size() - 1)
		blood_overlay.texture = blood_frames[blood_idx]
		
		# Progressive grime & blood stain on skin/clothes
		var stain = 1.0 - hp_ratio
		var grimy_red = Color(1.0, 1.0 - stain * 0.35, 1.0 - stain * 0.35, 1.0)
		sprite.modulate = grimy_red

func _spawn_blood_spurt(pos: Vector2) -> void:
	var parts = CPUParticles2D.new()
	parts.emitting = true
	parts.one_shot = true
	parts.explosiveness = 0.9
	parts.amount = 14
	parts.lifetime = 0.35
	parts.color = Color(0.72, 0.04, 0.04, 1.0)
	parts.direction = Vector2(randf_range(-1.0, 1.0), randf_range(-1.0, 0.2)).normalized()
	parts.spread = 45.0
	parts.initial_velocity_min = 60.0
	parts.initial_velocity_max = 140.0
	parts.gravity = Vector2(0, 480)
	parts.scale_amount_min = 1.8
	parts.scale_amount_max = 3.5
	parts.global_position = pos
	get_tree().current_scene.add_child(parts)
	get_tree().create_timer(0.45).timeout.connect(parts.queue_free)

func _spawn_bleed_drip() -> void:
	if is_dead:
		return
	if randf() < 0.6:
		_spawn_blood_spurt(global_position + Vector2(randf_range(-6, 6), -10.0))

func ignite_fire(duration: float = 3.5) -> void:
	if is_dead:
		return
	burning_timer = max(burning_timer, duration)
	if fire_particles:
		fire_particles.emitting = true

func take_damage_hit(amount: float, knockback_force: Vector2, hit_pos: Vector2, kill_type: String = "bullet") -> void:
	if is_dead:
		return
	if GameManager.is_insta_kill:
		amount = 9999.0
	elif GameManager.is_fire_bullets:
		ignite_fire(3.5)
	
	# Hit-Zone detection relative to zombie feet (feet at 0, head at -38 to -60)
	var rel_y = hit_pos.y - global_position.y
	
	# Head zone (y <= -38 for humanoid zombies)
	if rel_y <= -38.0 and zombie_type != "rover" and zombie_type != "crawler" and zombie_type != "split_crawler":
		take_headshot(amount, knockback_force, kill_type)
		return

	# Leg zone (y > -15) -> takes several shots before being severed in half
	var was_leg_hit = (rel_y > -15.0)
	if was_leg_hit and can_be_severed and not is_dismembered_legs:
		leg_health -= amount
		if leg_health <= 0 and (health - amount > 0):
			_sever_legs(knockback_force)

	health -= amount
	velocity += knockback_force * 0.4
	
	# Visual hit flash
	if visuals:
		visuals.modulate = Color(2.4, 0.35, 0.35, 1.0)
		var tw = create_tween()
		tw.tween_property(visuals, "modulate", Color(1.0, 1.0, 1.0, 1.0), 0.12)
	
	_update_blood_overlay()
	_spawn_blood_spurt(hit_pos)
	_spawn_blood(hit_pos)
	_spawn_damage_number(amount, false)
	SoundManager.play_sound_2d("snd_bullet_hit_ground", global_position, 0.1, -4.0)
	
	if health <= 0:
		die(false, knockback_force, "legs" if was_leg_hit else "torso", kill_type)

func take_headshot(amount: float, knockback_force: Vector2, kill_type: String = "bullet") -> void:
	if is_dead:
		return
	if GameManager.is_fire_bullets:
		ignite_fire(3.5)
	
	# Lethal precision headshots:
	var final_dmg: float
	if zombie_type == "fat":
		final_dmg = max(amount * 3.5, 135.0)
	elif zombie_type == "rover":
		final_dmg = max(amount * 2.5, 45.0)
	else:
		final_dmg = max(amount * 4.0, max_health + 20.0)

	if GameManager.is_insta_kill:
		final_dmg = 9999.0

	health -= final_dmg
	velocity += knockback_force * 0.8
	var head_y = -14 if (zombie_type == "crawler" or zombie_type == "split_crawler") else -48
	var head_pos = global_position + Vector2(0, head_y)
	
	if visuals:
		visuals.modulate = Color(2.8, 0.4, 0.4, 1.0)
		var tw = create_tween()
		tw.tween_property(visuals, "modulate", Color(1.0, 1.0, 1.0, 1.0), 0.12)

	_update_blood_overlay()
	_spawn_blood_spurt(head_pos)
	_spawn_blood(head_pos)
	_spawn_damage_number(final_dmg, true)
	if health <= 0:
		die(true, knockback_force, "head", kill_type)

func _sever_legs(force: Vector2) -> void:
	is_dismembered_legs = true
	SoundManager.play_sound_2d("snd_gore_splatter", global_position, 0.1, 2.0)
	SoundManager.play_sound_2d("snd_blade", global_position, 0.1, 0.0)

	# Eject severed lower body limbs
	var limb = flying_limb_scene.instantiate()
	limb.global_position = global_position + Vector2(0, -5)
	limb.velocity = Vector2(randf_range(-80, 80) + force.x * 0.25, randf_range(-160, -260))
	get_tree().current_scene.call_deferred("add_child", limb)
	
	_spawn_blood(global_position + Vector2(0, -2))

	# Convert to authentic split upper-body crawler (spr_zombie_split)
	zombie_type = "split_crawler"
	speed = randf_range(30.0, 42.0)
	origin_offset = Vector2(-48, -64)
	_set_collision_capsule(22.0, 8.0)
	head_area.position = Vector2(0, -14)
	sprite.offset = origin_offset
	if blood_overlay:
		blood_overlay.offset = origin_offset
	
	walk_frames = _load_frames("res://assets/sprites/enemies/spr_zombie_split", "spr_zombie_split", 7)
	die_frames = _load_frames("res://assets/sprites/general/spr_crawler_die", "spr_crawler_die", 5)
	die_headless_frames = _load_frames("res://assets/sprites/general/spr_crawler_die_headless", "spr_crawler_die_headless", 5)
	_update_blood_overlay()

func _spawn_damage_number(_amount: float, _is_crit: bool) -> void:
	# Disabled to prevent text/numbers lingering on screen
	pass

func _spawn_blood(pos: Vector2) -> void:
	_spawn_blood_spurt(pos)

func _spawn_death_blood_spurt(pos: Vector2, extra_force: Vector2 = Vector2.ZERO) -> void:
	var parts = CPUParticles2D.new()
	parts.emitting = true
	parts.one_shot = true
	parts.amount = 26
	parts.lifetime = 0.45
	parts.color = Color(0.85, 0.05, 0.05, 1.0)
	parts.direction = Vector2(0, -1) + extra_force.normalized() * 0.4
	parts.spread = 65.0
	parts.initial_velocity_min = 90.0
	parts.initial_velocity_max = 220.0
	parts.gravity = Vector2(0, 520)
	parts.scale_amount_min = 2.0
	parts.scale_amount_max = 4.0
	parts.global_position = pos
	get_tree().current_scene.add_child(parts)
	get_tree().create_timer(0.5).timeout.connect(parts.queue_free)

func die(headshot: bool, force: Vector2 = Vector2.ZERO, hit_zone: String = "torso", kill_type: String = "bullet") -> void:
	is_dead = true
	is_headshot = headshot
	collision_layer = 0
	collision_mask = 1 # Keep floor collision so body lands on the ground
	if blood_overlay:
		blood_overlay.visible = false
	if not is_on_floor():
		velocity.y = max(velocity.y, 80.0) + randf_range(20.0, 60.0)
		velocity.x = force.x * 0.2
	else:
		velocity = Vector2.ZERO

	# Flying blood burst on death
	var burst_pos = global_position + Vector2(0, -45 if headshot else -25)
	_spawn_death_blood_spurt(burst_pos, force)

	var pts = 100 if headshot else 50
	var cash = 60 if headshot else 30
	var xp_awarded = 40.0 if headshot else 25.0
	if zombie_type == "fat":
		xp_awarded *= 2.0
	elif zombie_type == "crazy":
		xp_awarded *= 1.5

	GameManager.zombie_killed(pts, cash, headshot, kill_type)

	# Play random zombie death sound
	var die_snd_idx = (randi() % 6) + 1
	SoundManager.play_sound_2d("snd_zombie_dies_" + str(die_snd_idx), global_position, 0.1, -1.0)

	var players = get_tree().get_nodes_in_group("players")
	for p in players:
		if p is Player and p.has_method("add_xp"):
			p.add_xp(xp_awarded)

	# 1. Headshot Decapitation
	if headshot or hit_zone == "head":
		var head = flying_head_scene.instantiate()
		var head_y = -14 if (zombie_type == "crawler" or zombie_type == "split_crawler") else -48
		head.global_position = global_position + Vector2(0, head_y)
		head.velocity = Vector2(randf_range(-100, 100) + force.x * 0.3, randf_range(-220, -320))
		get_tree().current_scene.add_child(head)
		SoundManager.play_sound_2d("snd_boss", global_position, 0.2, -2.0)
	
	# 2. Torso / Limb Severing
	elif hit_zone == "legs":
		if randf() < 0.6:
			var limb = flying_limb_scene.instantiate()
			limb.global_position = global_position + Vector2(0, -8)
			limb.velocity = Vector2(randf_range(-100, 100) + force.x * 0.25, randf_range(-140, -220))
			get_tree().current_scene.call_deferred("add_child", limb)
	elif hit_zone == "torso" or force.length() > 300.0:
		if randf() < 0.4:
			var limb = flying_limb_scene.instantiate()
			limb.global_position = global_position + Vector2(0, -25)
			limb.velocity = Vector2(randf_range(-120, 120) + force.x * 0.3, randf_range(-180, -280))
			get_tree().current_scene.call_deferred("add_child", limb)

	# Drop physical money with 50% chance
	if randf() < 0.5:
		var m = money_scene.instantiate()
		m.global_position = global_position + Vector2(randf_range(-10, 10), -10)
		get_tree().current_scene.call_deferred("add_child", m)

	# Drop component scrap piece with 18% chance
	if randf() < 0.18:
		var scrap_scene = preload("res://scenes/environment/component_scrap_drop.tscn")
		var sc = scrap_scene.instantiate()
		sc.global_position = global_position + Vector2(randf_range(-12, 12), -12)
		get_tree().current_scene.call_deferred("add_child", sc)

	# 6% chance for Power-Up drop (Double Points, Insta-Kill, Max Ammo, Nuke)
	if randf() < 0.06:
		var pu = powerup_scene.instantiate()
		pu.global_position = global_position + Vector2(0, -15)
		get_tree().current_scene.call_deferred("add_child", pu)

	# Play dismemberment / death collapsing animation frames
	var frames_to_play = die_headless_frames if (headshot and die_headless_frames.size() > 0) else die_frames
	if frames_to_play.size() > 0:
		for frame_tex in frames_to_play:
			sprite.texture = frame_tex
			await get_tree().create_timer(0.05).timeout

	# Quick fade out corpse so nothing stays on screen
	var tween = create_tween()
	tween.tween_property(self, "modulate:a", 0.0, 0.4)
	tween.tween_callback(queue_free)

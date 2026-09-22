extends CharacterBody2D
class_name BossZombie

signal health_updated(current_hp: float, max_hp: float)
signal boss_defeated

@export var max_health: float = 2500.0
var health: float = 2500.0
var speed: float = 65.0
var damage: float = 45.0
var is_dead: bool = false
var wave_number: int = 5
const GRAVITY: float = 850.0

@onready var visuals: Node2D = $Visuals
@onready var sprite: Sprite2D = $Visuals/Sprite2D
@onready var blood_overlay: Sprite2D = $Visuals/BloodOverlay
@onready var slam_area: Area2D = $SlamArea

var target_player: Player = null
var money_scene = preload("res://scenes/environment/money_drop.tscn")
var powerup_scene = preload("res://scenes/environment/power_up_drop.tscn")

var walk_frames: Array[Texture2D] = []
var die_frames: Array[Texture2D] = []
var blood_frames: Array[Texture2D] = []

var anim_timer: float = 0.0
var bleed_drip_timer: float = 0.0
var slam_cooldown: float = 5.5
var slam_timer: float = 0.0
var is_slamming: bool = false
var melee_cooldown_timer: float = 0.0

var burning_timer: float = 0.0
var burn_tick_timer: float = 0.0
var fire_particles: CPUParticles2D = null

func _ready() -> void:
	add_to_group("bosses")
	add_to_group("zombies")
	
	_setup_fire_particles()
	
	# Load blood frames
	for i in range(12):
		var p = "res://assets/sprites/characters/spr_player_blood/spr_player_blood_" + str(i) + ".png"
		if ResourceLoader.exists(p):
			blood_frames.append(load(p))

	# Load walk frames
	for i in range(9):
		var p = "res://assets/sprites/enemies/spr_tank/spr_tank_" + str(i) + ".png"
		if ResourceLoader.exists(p):
			walk_frames.append(load(p))
	
	# Load death frames
	for i in range(13):
		var p = "res://assets/sprites/enemies/spr_tank_die/spr_tank_die_" + str(i) + ".png"
		if ResourceLoader.exists(p):
			die_frames.append(load(p))

	sprite.centered = false
	sprite.offset = Vector2(-34, -66)
	if blood_overlay:
		blood_overlay.centered = false
		blood_overlay.offset = Vector2(-34, -66)
	if walk_frames.size() > 0:
		sprite.texture = walk_frames[0]

	health = max_health
	health_updated.emit(health, max_health)

func _setup_fire_particles() -> void:
	fire_particles = CPUParticles2D.new()
	fire_particles.emitting = false
	fire_particles.amount = 20
	fire_particles.lifetime = 0.4
	fire_particles.color = Color(1.0, 0.45, 0.1, 0.9)
	fire_particles.spread = 180.0
	fire_particles.gravity = Vector2(0, -90)
	fire_particles.initial_velocity_min = 25.0
	fire_particles.initial_velocity_max = 65.0
	fire_particles.scale_amount_min = 2.5
	fire_particles.scale_amount_max = 5.0
	fire_particles.position = Vector2(0, -35)
	add_child(fire_particles)

	# Spawn sound and boss music
	SoundManager.play_sound("snd_tank_scream", 0.0, 3.0)
	SoundManager.play_music("snd_boss")
	
	# Player voice line
	await get_tree().create_timer(1.2).timeout
	SoundManager.play_sound("snd_P_tank_bigger", 0.0, 2.0)

func setup_boss(wave_num: int) -> void:
	wave_number = wave_num
	# Massive exponential boss health curve: 3500 + wave*950 + wave^1.55*200
	max_health = 3500.0 + (wave_num * 950.0) + pow(wave_num, 1.55) * 200.0
	health = max_health
	damage = 50.0 + wave_num * 5.0
	speed = clamp(68.0 + wave_num * 2.5, 68.0, 125.0)
	slam_cooldown = max(2.8, 5.5 - wave_num * 0.25)
	health_updated.emit(health, max_health)

func _physics_process(delta: float) -> void:
	if is_dead:
		if fire_particles:
			fire_particles.emitting = false
		if not is_on_floor():
			velocity.y += GRAVITY * delta
			velocity.x = move_toward(velocity.x, 0.0, 250.0 * delta)
			move_and_slide()
		return

	if is_slamming:
		return

	if not is_on_floor():
		velocity.y += GRAVITY * delta

	if not target_player or not is_instance_valid(target_player) or target_player.is_dead:
		_find_closest_player()

	slam_timer += delta
	if melee_cooldown_timer > 0.0:
		melee_cooldown_timer -= delta

	# Burning damage over time
	if burning_timer > 0.0:
		burning_timer -= delta
		burn_tick_timer += delta
		if fire_particles:
			fire_particles.emitting = true
		if burn_tick_timer >= 0.4:
			burn_tick_timer = 0.0
			health -= 25.0
			_update_blood_overlay()
			_spawn_damage_number(25.0, false)
			health_updated.emit(health, max_health)
			if health <= 0:
				die()
				return
	else:
		if fire_particles:
			fire_particles.emitting = false

	# Freeze Power-Up visual tint & slowdown
	var cur_speed = speed
	if GameManager.is_freeze:
		cur_speed = speed * 0.3
		sprite.self_modulate = Color(0.35, 0.65, 1.4, 1.0)
	elif burning_timer > 0.0:
		sprite.self_modulate = Color(1.4, 0.6, 0.3, 1.0)
	else:
		sprite.self_modulate = Color.WHITE

	# Periodic blood dripping if boss is heavily wounded
	if health < max_health * 0.5:
		bleed_drip_timer += delta
		if bleed_drip_timer >= randf_range(1.2, 2.5):
			bleed_drip_timer = 0.0
			_spawn_bleed_drip()

	if target_player and is_instance_valid(target_player):
		var dist_to_player = global_position.distance_to(target_player.global_position)
		var dy = abs(target_player.global_position.y - global_position.y)
		var dir_x = sign(target_player.global_position.x - global_position.x)
		velocity.x = dir_x * cur_speed
		if dir_x != 0:
			visuals.scale.x = 1.0 if dir_x > 0 else -1.0

		if is_on_floor():
			if is_on_wall():
				velocity.y = -380.0
			elif target_player.global_position.y < global_position.y - 30.0:
				if abs(target_player.global_position.x - global_position.x) < 140.0 or randf() < 0.04:
					velocity.y = randf_range(-380.0, -440.0)
			elif target_player.global_position.y > global_position.y + 50.0 and randf() < 0.02 and global_position.y < 310.0:
				global_position.y += 6.0
				velocity.y = 80.0
		
		# Ground Slam attack if close and off cooldown
		if dist_to_player < 100.0 and slam_timer >= slam_cooldown:
			_perform_ground_slam()
		elif dist_to_player <= 50.0 and dy <= 48.0 and melee_cooldown_timer <= 0.0:
			melee_cooldown_timer = 0.9
			_perform_melee_hit(target_player)
	else:
		velocity.x = 0

	move_and_slide()
	
	# Safety clamp: Guarantee boss never falls out of the map below ground level (y=0)
	if global_position.y > 2000.0:
		global_position.y = 2000.0
		velocity.y = min(velocity.y, 0.0)
		
	_update_animation(delta)

func _perform_melee_hit(player: Player) -> void:
	if not player or player.is_dead:
		return
	SoundManager.play_sound_2d("snd_blade", global_position, 0.1, -2.0)
	player.take_damage(damage)
	var push_x = sign(player.global_position.x - global_position.x)
	if push_x == 0: push_x = 1.0
	player.velocity.x += push_x * 280.0
	player.velocity.y = -140.0
	player._shake_camera(6.0)

func _update_animation(delta: float) -> void:
	if walk_frames.size() > 0 and abs(velocity.x) > 5.0:
		anim_timer += delta * 10.0
		var frame_idx = int(anim_timer) % walk_frames.size()
		sprite.texture = walk_frames[frame_idx]
	elif walk_frames.size() > 0:
		sprite.texture = walk_frames[0]

func _perform_ground_slam() -> void:
	is_slamming = true
	slam_timer = 0.0
	velocity.x = 0.0
	
	# Roar & windup jump
	SoundManager.play_sound_2d("snd_tank_scream", global_position, 0.1, 1.5)
	velocity.y = -260.0
	await get_tree().create_timer(0.45).timeout
	
	# Heavy slam down
	SoundManager.play_sound_2d("snd_P_bw_bigbadaboom", global_position, 0.1, 1.0)
	SoundManager.play_sound_2d("snd_gore_splatter", global_position, 0.1, 2.0)
	
	# Massive Ground shockwave
	var slam_dmg = 45.0 + wave_number * 5.0
	var players = get_tree().get_nodes_in_group("players")
	for p in players:
		if p is Player and not p.is_dead:
			var dist = global_position.distance_to(p.global_position)
			if dist <= 160.0:
				var push_dir = (p.global_position - global_position).normalized()
				if push_dir.length() < 0.1: push_dir = Vector2(1, -1).normalized()
				p.velocity += push_dir * 520.0 + Vector2(0, -220.0)
				p.take_damage(slam_dmg)
			if p.is_local_player:
				p._shake_camera(10.0)

	# Scorch / blood decals on ground
	_spawn_blood(global_position + Vector2(0, -2))
	_spawn_blood(global_position + Vector2(-30, -2))
	_spawn_blood(global_position + Vector2(30, -2))
	
	await get_tree().create_timer(0.5).timeout
	is_slamming = false

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
		# 1. Base distance
		var score = -dist_to_zombie
		# 2. Strong hunting bonus for isolated/solo players
		var isolation_bonus = min(min_teammate_dist * 1.8, 700.0)
		score += isolation_bonus
		# 3. Group penalty
		score -= (teammates_nearby * 220.0)
		# 4. Standing preferred over downed
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
		
		# Progressive grime & blood stain on skin
		var stain = 1.0 - hp_ratio
		var grimy_red = Color(1.0, 1.0 - stain * 0.35, 1.0 - stain * 0.35, 1.0)
		sprite.modulate = grimy_red

func _spawn_blood_spurt(pos: Vector2) -> void:
	var parts = CPUParticles2D.new()
	parts.emitting = true
	parts.one_shot = true
	parts.explosiveness = 0.9
	parts.amount = 18
	parts.lifetime = 0.38
	parts.color = Color(0.72, 0.04, 0.04, 1.0)
	parts.direction = Vector2(randf_range(-1.0, 1.0), randf_range(-1.0, 0.2)).normalized()
	parts.spread = 50.0
	parts.initial_velocity_min = 70.0
	parts.initial_velocity_max = 160.0
	parts.gravity = Vector2(0, 500)
	parts.scale_amount_min = 2.0
	parts.scale_amount_max = 4.0
	parts.global_position = pos
	get_tree().current_scene.add_child(parts)
	get_tree().create_timer(0.5).timeout.connect(parts.queue_free)

func _spawn_bleed_drip() -> void:
	if is_dead:
		return
	if randf() < 0.65:
		var blood_idx = randi() % 3
		var path = "res://assets/sprites/effects/spr_floor_blood/spr_floor_blood_" + str(blood_idx) + ".png"
		if ResourceLoader.exists(path):
			var decal = Sprite2D.new()
			decal.texture = load(path)
			decal.global_position = global_position + Vector2(randf_range(-10, 10), -2.0)
			decal.scale = Vector2(0.8, 0.8)
			decal.z_index = -5
			get_tree().current_scene.add_child(decal)

func ignite_fire(duration: float = 3.5) -> void:
	if is_dead:
		return
	burning_timer = max(burning_timer, duration)
	if fire_particles:
		fire_particles.emitting = true

func take_damage_hit(amount: float, knockback_force: Vector2, hit_pos: Vector2) -> void:
	if is_dead:
		return
	if GameManager.is_insta_kill:
		amount = 9999.0
	elif GameManager.is_fire_bullets:
		ignite_fire(3.5)
	else:
		# Heavy boss armor: takes 35% reduced damage from body shots
		amount = amount * 0.65
		
	health -= amount
	velocity += knockback_force * 0.05
	
	if visuals:
		visuals.modulate = Color(2.4, 0.35, 0.35, 1.0)
		var tw = create_tween()
		tw.tween_property(visuals, "modulate", Color(1.0, 1.0, 1.0, 1.0), 0.12)

	_update_blood_overlay()
	_spawn_blood_spurt(hit_pos)
	_spawn_blood(hit_pos)
	_spawn_damage_number(amount, false)
	health_updated.emit(health, max_health)
	SoundManager.play_sound_2d("snd_bullet_hit_ground", global_position, 0.1, -2.0)
	if health <= 0:
		die()

func take_headshot(amount: float, knockback_force: Vector2) -> void:
	if is_dead:
		return
	if GameManager.is_fire_bullets:
		ignite_fire(3.5)
	var final_dmg = amount * 1.6
	if GameManager.is_insta_kill:
		final_dmg = 9999.0
	health -= final_dmg
	velocity += knockback_force * 0.10
	var head_pos = global_position + Vector2(0, -35)
	
	if visuals:
		visuals.modulate = Color(2.8, 0.4, 0.4, 1.0)
		var tw = create_tween()
		tw.tween_property(visuals, "modulate", Color(1.0, 1.0, 1.0, 1.0), 0.12)

	_update_blood_overlay()
	_spawn_blood_spurt(head_pos)
	_spawn_blood(head_pos)
	_spawn_damage_number(final_dmg, true)
	health_updated.emit(health, max_health)
	SoundManager.play_sound_2d("snd_boss", global_position, 0.2, 0.0)
	if health <= 0:
		die()

func _spawn_damage_number(_amount: float, _is_crit: bool) -> void:
	# Disabled to prevent text/numbers lingering on screen
	pass

func _spawn_blood(pos: Vector2) -> void:
	_spawn_blood_spurt(pos)

func die() -> void:
	is_dead = true
	collision_layer = 0
	collision_mask = 1 # Keep floor collision so body lands on the ground
	if blood_overlay:
		blood_overlay.visible = false
	if not is_on_floor():
		velocity.y = max(velocity.y, 100.0)
	else:
		velocity = Vector2.ZERO
	
	# Massive death blood burst
	var parts = CPUParticles2D.new()
	parts.emitting = true
	parts.one_shot = true
	parts.amount = 40
	parts.lifetime = 0.55
	parts.color = Color(0.85, 0.05, 0.05, 1.0)
	parts.direction = Vector2(0, -1)
	parts.spread = 80.0
	parts.initial_velocity_min = 100.0
	parts.initial_velocity_max = 260.0
	parts.gravity = Vector2(0, 520)
	parts.scale_amount_min = 2.5
	parts.scale_amount_max = 5.0
	parts.global_position = global_position + Vector2(0, -35)
	get_tree().current_scene.add_child(parts)
	get_tree().create_timer(0.6).timeout.connect(parts.queue_free)

	boss_defeated.emit()
	AchievementsManager.unlock("boss_slayer")

	# Big points and money
	GameManager.zombie_killed(500, 1500, false, "boss")

	var players = get_tree().get_nodes_in_group("players")
	for p in players:
		if p is Player and p.has_method("add_xp"):
			p.add_xp(350.0)

	# Guaranteed Power-Up drop
	var pu = powerup_scene.instantiate()
	pu.global_position = global_position + Vector2(0, -25)
	get_tree().current_scene.call_deferred("add_child", pu)

	# Several money bags
	for i in range(5):
		var m = money_scene.instantiate()
		m.global_position = global_position + Vector2(randf_range(-30, 30), randf_range(-15, -5))
		get_tree().current_scene.call_deferred("add_child", m)

	SoundManager.play_sound("snd_tank_scream", 0.0, 2.0)

	# Play full 13-frame death collapse animation
	if die_frames.size() > 0:
		for frame_tex in die_frames:
			sprite.texture = frame_tex
			await get_tree().create_timer(0.06).timeout

	# Fade out corpse
	var tween = create_tween()
	tween.tween_property(self, "modulate:a", 0.0, 0.5)
	tween.tween_callback(queue_free)

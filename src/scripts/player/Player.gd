extends CharacterBody2D
class_name Player

@export var is_local_player: bool = true
var peer_id: int = 1
var player_name: String = "Jogador"

var target_network_pos: Vector2 = Vector2.ZERO
var target_arm_rotation: float = 0.0
var target_facing_right: bool = true
var target_frame_idx: int = 0
var target_moving: bool = false
var network_sync_timer: float = 0.0

@onready var name_tag: Label = get_node_or_null("NameTag")

const SPEED: float = 160.0
const JUMP_VELOCITY: float = -340.0
const GRAVITY: float = 850.0

var max_health: float = 100.0
var health: float = 100.0
var level: int = 1
var xp: float = 0.0
var xp_to_next: float = 100.0
var is_dead: bool = false
var is_downed: bool = false
var bleedout_timer: float = 40.0
const MAX_BLEEDOUT_TIME: float = 40.0
var revive_progress: float = 0.0
const REVIVE_TIME: float = 2.5
var downed_tag: Label = null


var speed_multiplier: float = 1.0
var reload_multiplier: float = 1.0
var fire_rate_multiplier: float = 1.0
var perks: Array[String] = []

signal xp_changed(current_xp: float, max_xp: float, current_lvl: int)
signal level_up(new_lvl: int)
signal perks_updated(perks_array: Array)

var weapon_slots: Array[String] = ["handgun", "", ""]
var weapon_ammo: Dictionary = {}
var upgraded_weapons: Dictionary = {}
var current_slot: int = 1

var primary_weapon: String:
	get:
		return weapon_slots[0] if weapon_slots.size() > 0 else "handgun"
	set(val):
		if weapon_slots.size() > 0:
			weapon_slots[0] = val

var secondary_weapon: String:
	get:
		return weapon_slots[1] if weapon_slots.size() > 1 else ""
	set(val):
		if weapon_slots.size() > 1:
			weapon_slots[1] = val

var current_weapon_data: Dictionary
var current_mag: int = 12
var current_reserve: int = 48
var can_shoot: bool = true
var is_reloading: bool = false

var body_walk_frames: Array[Texture2D] = []
var pants_walk_frames: Array[Texture2D] = []
var body_walk_back_frames: Array[Texture2D] = []
var pants_walk_back_frames: Array[Texture2D] = []
var player_blood_frames: Array[Texture2D] = []
var body_stand_texture: Texture2D
var pants_stand_texture: Texture2D
var body_jump_texture: Texture2D
var pants_jump_texture: Texture2D

var anim_timer: float = 0.0
var current_frame_idx: int = 0
const ANIM_FPS: float = 14.0

@onready var arm_pivot: Node2D = $ArmPivot
@onready var weapon_sprite: Sprite2D = $ArmPivot/WeaponSprite
@onready var muzzle_point: Marker2D = $ArmPivot/WeaponSprite/MuzzlePoint
@onready var visuals: Node2D = $Visuals
@onready var body_sprite: Sprite2D = $Visuals/BodySprite
@onready var legs_sprite: Sprite2D = $Visuals/LegsSprite
@onready var torso_sprite: Sprite2D = $Visuals/TorsoSprite
@onready var head_sprite: Sprite2D = $Visuals/HeadSprite
@onready var accessory_sprite: Sprite2D = get_node_or_null("Visuals/AccessorySprite")
@onready var blood_overlay_sprite: Sprite2D = get_node_or_null("Visuals/BloodOverlaySprite")
@onready var camera: Camera2D = $Camera2D

var bullet_scene = preload("res://scenes/weapons/bullet.tscn")
var rocket_scene = preload("res://scenes/weapons/rocket.tscn")
var crossbow_bolt_scene = preload("res://scenes/weapons/crossbow_bolt.tscn")
var flame_particle_scene = preload("res://scenes/weapons/flame_particle.tscn")
var grenade_scene = preload("res://scenes/weapons/grenade.tscn")
var molotov_scene = preload("res://scenes/weapons/molotov.tscn")
var landmine_scene = preload("res://scenes/weapons/landmine.tscn")
var casing_scene = preload("res://scenes/effects/casing.tscn")
var raygun_bolt_scene = preload("res://scenes/weapons/raygun_bolt.tscn")
var special_projectile_scene = preload("res://scenes/weapons/special_projectile.tscn")

var grenades_count: int = 3
var molotov_count: int = 2
var landmines_count: int = 2
var hurt_sound_timer: float = 0.0

var flashlight: PointLight2D = null
var flashlight_enabled: bool = true
var flashlight_toggle_cooldown: float = 0.0

var shield_visual: Node2D = null
var speed_particles: CPUParticles2D = null
var fire_weapon_particles: CPUParticles2D = null
var infinite_ammo_particles: CPUParticles2D = null


func _unhandled_input(event: InputEvent) -> void:
	if not is_local_player or is_dead:
		return
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
			_try_shoot()
		elif event.button_index == MOUSE_BUTTON_WHEEL_UP and event.pressed:
			_cycle_weapon_slot(false)
		elif event.button_index == MOUSE_BUTTON_WHEEL_DOWN and event.pressed:
			_cycle_weapon_slot(true)

func _ready() -> void:
	body_stand_texture = load("res://assets/sprites/characters/spr_player_stand/spr_player_stand.png")
	pants_stand_texture = load("res://assets/sprites/characters/spr_player_pants_stand/spr_player_pants_stand.png")
	body_jump_texture = load("res://assets/sprites/characters/spr_player_jump/spr_player_jump.png")
	pants_jump_texture = load("res://assets/sprites/characters/spr_player_pants_jump/spr_player_pants_jump.png")

	_setup_flashlight()
	_setup_powerup_visuals()

	for i in range(9):
		var bp = "res://assets/sprites/characters/spr_player_walk/spr_player_walk_" + str(i) + ".png"
		var pp = "res://assets/sprites/characters/spr_player_pants_walk/spr_player_pants_walk_" + str(i) + ".png"
		if ResourceLoader.exists(bp):
			body_walk_frames.append(load(bp))
		if ResourceLoader.exists(pp):
			pants_walk_frames.append(load(pp))

		var bpb = "res://assets/sprites/characters/spr_player_walk_back/spr_player_walk_back_" + str(i) + ".png"
		var ppb = "res://assets/sprites/characters/spr_player_pants_walk_back/spr_player_pants_walk_back_" + str(i) + ".png"
		if ResourceLoader.exists(bpb):
			body_walk_back_frames.append(load(bpb))
		if ResourceLoader.exists(ppb):
			pants_walk_back_frames.append(load(ppb))

	for i in range(12):
		var blp = "res://assets/sprites/characters/spr_player_blood/spr_player_blood_" + str(i) + ".png"
		if ResourceLoader.exists(blp):
			player_blood_frames.append(load(blp))
	
	_update_blood_overlay()
	
	if is_local_player:
		camera.make_current()
		Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
		weapon_slots = ["handgun", "", ""]
		current_slot = 1
		var h_data = WeaponDatabase.get_weapon("handgun")
		var h_mag = h_data.get("mag_size", 12)
		var h_res = int(h_data.get("reserve_max", 96) * 0.5)
		weapon_ammo["handgun"] = {"mag": h_mag, "reserve": h_res}
		_load_customization()
		_apply_stats_bonuses()

	_equip_weapon(weapon_slots[0])

func setup_multiplayer(id: int, p_info: Dictionary) -> void:
	peer_id = id
	player_name = p_info.get("name", "Jogador " + str(id))
	set_multiplayer_authority(id)
	is_local_player = (id == multiplayer.get_unique_id() or not multiplayer.has_multiplayer_peer() and id == 1)
	
	if name_tag:
		name_tag.text = player_name
		name_tag.visible = not is_local_player
		
	weapon_slots = ["handgun", "", ""]
	current_slot = 1
	var h_data = WeaponDatabase.get_weapon("handgun")
	var h_mag = h_data.get("mag_size", 12)
	var h_res = int(h_data.get("reserve_max", 96) * 0.5)
	weapon_ammo["handgun"] = {"mag": h_mag, "reserve": h_res}

	if is_local_player:
		if camera:
			camera.make_current()
			camera.enabled = true
		Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
		_load_customization()
		_apply_stats_bonuses()
	else:
		if camera:
			camera.enabled = false
		_apply_remote_customization(p_info)
		
	_equip_weapon(weapon_slots[0])

func _apply_remote_customization(p_info: Dictionary) -> void:
	var hair_idx = p_info.get("hair", 0)
	var torso_idx = p_info.get("torso", 0)
	var hp = "res://assets/sprites/characters/spr_hair/spr_hair_" + str(hair_idx) + ".png"
	if ResourceLoader.exists(hp) and head_sprite:
		head_sprite.texture = load(hp)
	var tp = "res://assets/sprites/characters/spr_player_torso/spr_player_torso_" + str(torso_idx) + ".png"
	if ResourceLoader.exists(tp) and torso_sprite:
		torso_sprite.texture = load(tp)
		
	var acc_id = p_info.get("accessory", "")
	if accessory_sprite:
		if acc_id != "" and PlayerStatsManager.craftable_accessories.has(acc_id):
			var acc = PlayerStatsManager.craftable_accessories[acc_id]
			var sp = acc.get("sprite", "")
			if sp != "" and ResourceLoader.exists(sp):
				accessory_sprite.texture = load(sp)
				accessory_sprite.visible = true
			else:
				accessory_sprite.visible = false
		else:
			accessory_sprite.visible = false

@rpc("any_peer", "unreliable")
func sync_player_state(pos: Vector2, vel: Vector2, arm_rot: float, facing: bool, frame_idx: int, is_moving: bool) -> void:
	if not is_local_player:
		target_network_pos = pos
		velocity = vel
		target_arm_rotation = arm_rot
		target_facing_right = facing
		target_frame_idx = frame_idx
		target_moving = is_moving

func _apply_stats_bonuses() -> void:
	max_health = 100.0 + PlayerStatsManager.get_health_bonus()
	health = max_health
	speed_multiplier = 1.0 + PlayerStatsManager.get_speed_bonus()
	reload_multiplier = max(0.4, 1.0 - PlayerStatsManager.get_reload_bonus())
	grenades_count = 3 + PlayerStatsManager.get_extra_grenades()
	landmines_count = 2 + PlayerStatsManager.get_extra_mines()

func _load_customization() -> void:
	if FileAccess.file_exists("user://profile.json"):
		var file = FileAccess.open("user://profile.json", FileAccess.READ)
		if file:
			var res = JSON.parse_string(file.get_as_text())
			if typeof(res) == TYPE_DICTIONARY:
				var hair_idx = res.get("hair", 0)
				var torso_idx = res.get("torso", 0)
				var hp = "res://assets/sprites/characters/spr_hair/spr_hair_" + str(hair_idx) + ".png"
				if ResourceLoader.exists(hp) and head_sprite:
					head_sprite.texture = load(hp)
				var tp = "res://assets/sprites/characters/spr_player_torso/spr_player_torso_" + str(torso_idx) + ".png"
				if ResourceLoader.exists(tp) and torso_sprite:
					torso_sprite.texture = load(tp)
			file.close()

	if accessory_sprite:
		if PlayerStatsManager.equipped_accessory != "" and PlayerStatsManager.craftable_accessories.has(PlayerStatsManager.equipped_accessory):
			var acc = PlayerStatsManager.craftable_accessories[PlayerStatsManager.equipped_accessory]
			var sp = acc.get("sprite", "")
			if sp != "" and ResourceLoader.exists(sp):
				accessory_sprite.texture = load(sp)
				accessory_sprite.visible = true
			else:
				accessory_sprite.visible = false
		else:
			accessory_sprite.visible = false

func _physics_process(delta: float) -> void:
	if is_dead:
		if not is_on_floor():
			velocity.y += GRAVITY * delta
			velocity.x = move_toward(velocity.x, 0, 200.0 * delta)
			move_and_slide()
		return

	# ==================== DOWNED STATE (MULTIPLAYER BLEEDOUT & CRAWL) ====================
	if is_downed:
		if not is_on_floor():
			velocity.y += GRAVITY * delta

		bleedout_timer -= delta
		_update_downed_ui()

		if is_local_player:
			var crawl_dir := Input.get_axis("move_left", "move_right")
			if crawl_dir != 0:
				velocity.x = crawl_dir * 35.0
			else:
				velocity.x = move_toward(velocity.x, 0, 100.0 * delta)
			
			move_and_slide()

			# Can still aim and shoot with handgun while downed
			var is_shooting = Input.is_action_pressed("shoot") or Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT)
			var is_shoot_just = Input.is_action_just_pressed("shoot") or (Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT) and can_shoot)
			if is_shoot_just or (is_shooting and current_weapon_data.get("type") == "auto"):
				_try_shoot()

			var mouse_pos = get_global_mouse_position()
			var aim_vec = mouse_pos - arm_pivot.global_position
			var aim_angle = aim_vec.angle()
			arm_pivot.rotation = aim_angle

		if bleedout_timer <= 0.0:
			die()
		return

	# ==================== REVIVING TEAMMATES CHECK ====================
	if is_local_player and not is_downed and not is_dead:
		_check_reviving_teammates(delta)

	if hurt_sound_timer > 0:
		hurt_sound_timer -= delta

	# Passive Health Regeneration
	var regen = PlayerStatsManager.get_health_regen_bonus()
	if perks.has("quick_revive"):
		regen += 3.5
	if regen > 0.0 and health < max_health:
		health = min(max_health, health + regen * delta)
		_update_blood_overlay()

	if is_local_player:
		if not is_on_floor():
			velocity.y += GRAVITY * delta

		var jump_pressed = Input.is_action_just_pressed("jump")
		if jump_pressed and is_on_floor():
			if Input.is_action_pressed("crouch") or Input.is_action_pressed("move_down") or Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN):
				position.y += 6.0
			else:
				var jump_vel = JUMP_VELOCITY * (1.0 + PlayerStatsManager.get_jump_height_bonus())
				velocity.y = jump_vel
				SoundManager.play_sound("snd_bounce", 0.1, -4.0)

		var direction := Input.get_axis("move_left", "move_right")
		var cur_speed = SPEED * speed_multiplier
		if GameManager.is_speed_boost:
			cur_speed *= 1.5
		if direction != 0:
			velocity.x = direction * cur_speed
		else:
			velocity.x = move_toward(velocity.x, 0, cur_speed * 8.0 * delta)

		move_and_slide()
		
		# Ground safety clamp
		if global_position.y > 2000.0:
			global_position.y = 2000.0
			velocity.y = min(velocity.y, 0.0)

		var mouse_pos = get_global_mouse_position()
		var aim_vec = mouse_pos - arm_pivot.global_position
		var aim_angle = aim_vec.angle()

		arm_pivot.rotation = aim_angle

		var facing_right = mouse_pos.x >= global_position.x
		visuals.scale.x = 1.0 if facing_right else -1.0
		arm_pivot.scale.y = 1.0 if facing_right else -1.0

		if shield_visual:
			shield_visual.visible = GameManager.is_invulnerable
			if GameManager.is_invulnerable:
				shield_visual.rotation += delta * 4.0
		if speed_particles:
			speed_particles.emitting = GameManager.is_speed_boost and abs(velocity.x) > 10.0
		if fire_weapon_particles:
			fire_weapon_particles.emitting = GameManager.is_fire_bullets
		if infinite_ammo_particles:
			infinite_ammo_particles.emitting = GameManager.is_infinite_ammo

		_update_legs_animation(delta, direction, facing_right)

		# Multiplayer 30Hz state sync
		network_sync_timer += delta
		if network_sync_timer >= 0.033 and multiplayer.has_multiplayer_peer():
			network_sync_timer = 0.0
			rpc("sync_player_state", global_position, velocity, arm_pivot.rotation, facing_right, current_frame_idx, direction != 0)

		var is_auto = current_weapon_data.get("type", "single") == "auto"
		var is_shooting = Input.is_action_pressed("shoot") or Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT)
		var is_shoot_just = Input.is_action_just_pressed("shoot") or (Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT) and can_shoot)
		if is_shooting and is_auto:
			_try_shoot()
		elif is_shoot_just:
			_try_shoot()

		if Input.is_action_just_pressed("reload"):
			_reload()

		if (Input.is_action_just_pressed("slot_1") or Input.is_key_pressed(KEY_1)) and current_slot != 1:
			_switch_to_slot(1)
		elif (Input.is_action_just_pressed("slot_2") or Input.is_key_pressed(KEY_2)) and current_slot != 2 and weapon_slots.size() > 1 and weapon_slots[1] != "":
			_switch_to_slot(2)
		elif (Input.is_action_just_pressed("slot_3") or Input.is_key_pressed(KEY_3)) and current_slot != 3 and weapon_slots.size() > 2 and weapon_slots[2] != "":
			_switch_to_slot(3)
		elif Input.is_action_just_pressed("slot_cycle") or Input.is_key_pressed(KEY_Q):
			_cycle_weapon_slot(true)

		if flashlight_toggle_cooldown > 0:
			flashlight_toggle_cooldown -= delta

		if (Input.is_key_pressed(KEY_T) or Input.is_action_just_pressed("toggle_flashlight")) and flashlight_toggle_cooldown <= 0:
			flashlight_toggle_cooldown = 0.3
			flashlight_enabled = !flashlight_enabled
			if flashlight:
				flashlight.enabled = flashlight_enabled
			SoundManager.play_sound("snd_winchester_tick", 0.05, 3.0)

		# Grenade (G), Molotov (F) & Landmine (B)
		if Input.is_action_just_pressed("throw_grenade") and grenades_count > 0:
			_throw_grenade(mouse_pos)
		elif (Input.is_key_pressed(KEY_F) or Input.is_action_just_pressed("throw_molotov")) and molotov_count > 0:
			_throw_molotov(mouse_pos)
		elif (Input.is_key_pressed(KEY_B) or Input.is_action_just_pressed("place_landmine")) and landmines_count > 0:
			_place_landmine()

		if Input.is_action_just_pressed("melee"):
			_melee_attack(facing_right)
	else:
		# Remote peer interpolation
		if not is_on_floor():
			velocity.y += GRAVITY * delta
		global_position = global_position.lerp(target_network_pos, min(1.0, 22.0 * delta))
		arm_pivot.rotation = lerp_angle(arm_pivot.rotation, target_arm_rotation, min(1.0, 22.0 * delta))
		visuals.scale.x = 1.0 if target_facing_right else -1.0
		arm_pivot.scale.y = 1.0 if target_facing_right else -1.0
		_update_remote_legs_animation(delta)
		move_and_slide()

func _setup_powerup_visuals() -> void:
	# 1. Invulnerability Energy Shield
	shield_visual = Node2D.new()
	shield_visual.name = "ShieldAura"
	shield_visual.visible = false
	
	var shield_line = Line2D.new()
	shield_line.width = 3.0
	shield_line.default_color = Color(0.2, 0.9, 1.0, 0.85)
	var points: PackedVector2Array = []
	for i in range(25):
		var angle = (float(i) / 24.0) * TAU
		points.append(Vector2(cos(angle), sin(angle)) * 24.0)
	shield_line.points = points
	shield_visual.add_child(shield_line)
	shield_visual.position = Vector2(0, -22)
	add_child(shield_visual)
	
	# Shield pulse animation
	var tw = shield_visual.create_tween().set_loops()
	tw.tween_property(shield_visual, "scale", Vector2(1.15, 1.15), 0.45)
	tw.tween_property(shield_visual, "scale", Vector2(0.95, 0.95), 0.45)

	# 2. Speed Boost Trail Particles
	speed_particles = CPUParticles2D.new()
	speed_particles.name = "SpeedParticles"
	speed_particles.emitting = false
	speed_particles.amount = 16
	speed_particles.lifetime = 0.3
	speed_particles.color = Color(1.0, 0.9, 0.2, 0.7)
	speed_particles.direction = Vector2(0, 1)
	speed_particles.spread = 180.0
	speed_particles.gravity = Vector2(0, 0)
	speed_particles.initial_velocity_min = 20.0
	speed_particles.initial_velocity_max = 60.0
	speed_particles.scale_amount_min = 2.0
	speed_particles.scale_amount_max = 3.5
	speed_particles.position = Vector2(0, -5)
	add_child(speed_particles)

	# 3. Fire Bullets Weapon Muzzle Flames
	fire_weapon_particles = CPUParticles2D.new()
	fire_weapon_particles.name = "FireWeaponParticles"
	fire_weapon_particles.emitting = false
	fire_weapon_particles.amount = 12
	fire_weapon_particles.lifetime = 0.25
	fire_weapon_particles.color = Color(1.0, 0.45, 0.1, 0.85)
	fire_weapon_particles.spread = 45.0
	fire_weapon_particles.gravity = Vector2(0, -80)
	fire_weapon_particles.initial_velocity_min = 30.0
	fire_weapon_particles.initial_velocity_max = 80.0
	fire_weapon_particles.scale_amount_min = 2.0
	fire_weapon_particles.scale_amount_max = 4.0
	muzzle_point.add_child(fire_weapon_particles)

	# 4. Infinite Ammo Sparkle
	infinite_ammo_particles = CPUParticles2D.new()
	infinite_ammo_particles.name = "InfiniteAmmoParticles"
	infinite_ammo_particles.emitting = false
	infinite_ammo_particles.amount = 10
	infinite_ammo_particles.lifetime = 0.35
	infinite_ammo_particles.color = Color(1.0, 0.85, 0.2, 0.9)
	infinite_ammo_particles.spread = 180.0
	infinite_ammo_particles.gravity = Vector2(0, -50)
	infinite_ammo_particles.initial_velocity_min = 15.0
	infinite_ammo_particles.initial_velocity_max = 45.0
	infinite_ammo_particles.scale_amount_min = 1.5
	infinite_ammo_particles.scale_amount_max = 3.0
	weapon_sprite.add_child(infinite_ammo_particles)

func _setup_flashlight() -> void:
	flashlight = PointLight2D.new()
	flashlight.name = "Flashlight"
	flashlight.color = Color(1.0, 0.96, 0.82, 0.9)
	flashlight.energy = 1.15
	flashlight.texture_scale = 1.8
	
	# Create smooth radial falloff texture
	var grad = Gradient.new()
	grad.offsets = [0.0, 0.6, 1.0]
	grad.colors = [Color(1, 1, 1, 1), Color(1, 1, 1, 0.35), Color(1, 1, 1, 0)]
	var grad_tex = GradientTexture2D.new()
	grad_tex.gradient = grad
	grad_tex.fill = GradientTexture2D.FILL_RADIAL
	grad_tex.fill_from = Vector2(0.5, 0.5)
	grad_tex.fill_to = Vector2(1.0, 0.5)
	grad_tex.width = 256
	grad_tex.height = 256
	
	flashlight.texture = grad_tex
	flashlight.position = Vector2(40, 0)
	arm_pivot.add_child(flashlight)

func _place_landmine() -> void:
	landmines_count -= 1
	var lm = landmine_scene.instantiate()
	lm.global_position = global_position
	get_tree().current_scene.add_child(lm)
	SoundManager.play_sound("snd_pop", 0.1, 1.5)

func _melee_attack(facing_right: bool) -> void:
	SoundManager.play_sound("snd_katana_swing", 0.05, 0.0)
	var forward_dir = Vector2.RIGHT if facing_right else Vector2.LEFT
	var attack_center = global_position + forward_dir * 25.0 + Vector2(0, -18.0)
	var melee_dmg = 70.0 * (1.0 + PlayerStatsManager.get_melee_bonus())
	var reach = 38.0 * (1.0 + PlayerStatsManager.get_melee_range_bonus())
	
	var hit_anyone = false
	var zombies = get_tree().get_nodes_in_group("zombies")
	for z in zombies:
		if is_instance_valid(z) and z is Zombie and not z.is_dead:
			var d = attack_center.distance_to(z.global_position + Vector2(0, -15.0))
			if d <= reach:
				var is_exec = randf() < PlayerStatsManager.get_executioner_crit_chance()
				if is_exec:
					z.die(true, forward_dir * 450.0, "head", "melee")
				else:
					z.take_headshot(melee_dmg, forward_dir * 350.0, "melee")
				hit_anyone = true
				
				var steal = PlayerStatsManager.get_melee_lifesteal()
				if steal > 0.0:
					health = min(max_health, health + steal)
	
	if hit_anyone:
		SoundManager.play_sound("snd_blade", 0.1, 0.0)
		_shake_camera(2.5)

func _throw_grenade(target_pos: Vector2) -> void:
	grenades_count -= 1
	var g = grenade_scene.instantiate()
	g.global_position = arm_pivot.global_position
	var throw_dir = (target_pos - arm_pivot.global_position).normalized()
	g.linear_velocity = throw_dir * 550.0 + Vector2(0, -120.0)
	g.angular_velocity = randf_range(-15.0, 15.0)
	get_tree().current_scene.add_child(g)
	SoundManager.play_sound("snd_pop", 0.1, 2.0)

func _throw_molotov(target_pos: Vector2) -> void:
	molotov_count -= 1
	var m = molotov_scene.instantiate()
	m.global_position = arm_pivot.global_position
	var throw_dir = (target_pos - arm_pivot.global_position).normalized()
	m.linear_velocity = throw_dir * 500.0 + Vector2(0, -110.0)
	m.angular_velocity = randf_range(-10.0, 10.0)
	get_tree().current_scene.add_child(m)
	SoundManager.play_sound("snd_pop", 0.1, 2.0)
	AchievementsManager.unlock("fire_starter")

func _update_legs_animation(delta: float, direction: float, facing_right: bool) -> void:
	if not is_on_floor():
		body_sprite.texture = body_jump_texture
		legs_sprite.texture = pants_jump_texture
	elif abs(velocity.x) > 10.0:
		anim_timer += delta * (abs(velocity.x) / SPEED) * ANIM_FPS
		
		# Check if moving in same direction as aim (Forward) or opposite (Backpedaling)
		var is_moving_forward = (facing_right and direction > 0.0) or (!facing_right and direction < 0.0)
		
		if is_moving_forward:
			if body_walk_frames.size() > 0:
				current_frame_idx = int(anim_timer) % body_walk_frames.size()
				body_sprite.texture = body_walk_frames[current_frame_idx]
			if pants_walk_frames.size() > 0:
				legs_sprite.texture = pants_walk_frames[current_frame_idx % pants_walk_frames.size()]
		else:
			# Walking backwards / recuando mirando à frente
			if body_walk_back_frames.size() > 0:
				current_frame_idx = int(anim_timer) % body_walk_back_frames.size()
				body_sprite.texture = body_walk_back_frames[current_frame_idx]
			elif body_walk_frames.size() > 0:
				# Fallback to reverse frame index if back frames not loaded
				current_frame_idx = (body_walk_frames.size() - 1) - (int(anim_timer) % body_walk_frames.size())
				body_sprite.texture = body_walk_frames[current_frame_idx]
			
			if pants_walk_back_frames.size() > 0:
				legs_sprite.texture = pants_walk_back_frames[current_frame_idx % pants_walk_back_frames.size()]
			elif pants_walk_frames.size() > 0:
				legs_sprite.texture = pants_walk_frames[current_frame_idx % pants_walk_frames.size()]
	else:
		body_sprite.texture = body_stand_texture
		legs_sprite.texture = pants_stand_texture
		anim_timer = 0.0

func _equip_weapon(weapon_id: String) -> void:
	if weapon_id == "":
		return
		
	current_weapon_data = WeaponDatabase.get_weapon(weapon_id).duplicate(true)
	if not current_weapon_data.has("id"):
		current_weapon_data["id"] = weapon_id
	
	# Apply Workbench Upgrades
	var dmg_lvl = PlayerStatsManager.get_weapon_upgrade_level(weapon_id, "damage")
	var fr_lvl = PlayerStatsManager.get_weapon_upgrade_level(weapon_id, "fire_rate")
	var mag_lvl = PlayerStatsManager.get_weapon_upgrade_level(weapon_id, "mag")
	var acc_lvl = PlayerStatsManager.get_weapon_upgrade_level(weapon_id, "accuracy")

	if dmg_lvl > 0:
		current_weapon_data["damage"] = current_weapon_data.get("damage", 20.0) * (1.0 + dmg_lvl * 0.08)
	if fr_lvl > 0:
		current_weapon_data["fire_rate"] = current_weapon_data.get("fire_rate", 0.2) * max(0.4, (1.0 - fr_lvl * 0.06))
	if mag_lvl > 0:
		current_weapon_data["mag_size"] = int(current_weapon_data.get("mag_size", 12) * (1.0 + mag_lvl * 0.15))
		current_weapon_data["reserve_max"] = int(current_weapon_data.get("reserve_max", 96) * (1.0 + mag_lvl * 0.15))
	if acc_lvl > 0:
		current_weapon_data["spread_deg"] = current_weapon_data.get("spread_deg", 4.0) * max(0.2, (1.0 - acc_lvl * 0.15))

	# Apply Player Global Attributes
	current_weapon_data["damage"] = current_weapon_data.get("damage", 20.0) * (1.0 + PlayerStatsManager.get_bullet_damage_bonus())
	current_weapon_data["bullet_speed"] = current_weapon_data.get("bullet_speed", 900.0) * (1.0 + PlayerStatsManager.get_bullet_velocity_bonus())
	current_weapon_data["spread_deg"] = current_weapon_data.get("spread_deg", 4.0) * max(0.2, (1.0 - PlayerStatsManager.get_hipfire_accuracy_bonus()))
	current_weapon_data["reserve_max"] = int(current_weapon_data.get("reserve_max", 96) * (1.0 + PlayerStatsManager.get_ammo_bonus()))

	# Apply In-Match Pack-a-Punch Upgrade
	if upgraded_weapons.get(weapon_id, false):
		current_weapon_data["damage"] = current_weapon_data.get("damage", 20.0) * 1.6
		current_weapon_data["mag_size"] = int(current_weapon_data.get("mag_size", 12) * 1.5)
		current_weapon_data["reserve_max"] = int(current_weapon_data.get("reserve_max", 96) * 1.5)
		current_weapon_data["fire_rate"] = current_weapon_data.get("fire_rate", 0.2) * 0.8
		current_weapon_data["reload_time"] = current_weapon_data.get("reload_time", 1.5) * 0.8
		current_weapon_data["is_upgraded"] = true
		if not current_weapon_data.get("name", "").ends_with("[★ UPGRADED]"):
			current_weapon_data["name"] += " [★ UPGRADED]"

	var max_mag = current_weapon_data.get("mag_size", 12)
	var max_res = current_weapon_data.get("reserve_max", 96)

	if weapon_ammo.has(weapon_id):
		current_mag = clamp(weapon_ammo[weapon_id].get("mag", max_mag), 0, max_mag)
		current_reserve = clamp(weapon_ammo[weapon_id].get("reserve", int(max_res * 0.5)), 0, max_res)
	else:
		current_mag = max_mag
		current_reserve = int(max_res * 0.5)
		weapon_ammo[weapon_id] = {"mag": current_mag, "reserve": current_reserve}

	is_reloading = false
	can_shoot = true
	
	var tex_path = current_weapon_data.get("texture_path", "")
	var up_tex = tex_path.replace(".png", "_upgrade.png") if tex_path != "" else ""
	if upgraded_weapons.get(weapon_id, false) and up_tex != "" and ResourceLoader.exists(up_tex):
		weapon_sprite.texture = load(up_tex)
		weapon_sprite.modulate = Color.WHITE
	elif tex_path != "" and ResourceLoader.exists(tex_path):
		weapon_sprite.texture = load(tex_path)
		if upgraded_weapons.get(weapon_id, false):
			weapon_sprite.modulate = Color(0.4, 1.2, 1.5, 1.0)
		else:
			weapon_sprite.modulate = Color.WHITE
	
	weapon_sprite.centered = false
	var ox = current_weapon_data.get("origin_x", 2)
	var oy = current_weapon_data.get("origin_y", 11)
	weapon_sprite.offset = Vector2(-ox, -oy)
	
	var mx = current_weapon_data.get("muzzle_x", 35)
	var my = current_weapon_data.get("muzzle_y", 0)
	muzzle_point.position = Vector2(mx, my)

func _save_current_ammo() -> void:
	if current_weapon_data.has("id"):
		var cur_id = current_weapon_data.get("id", "")
		if cur_id != "":
			weapon_ammo[cur_id] = {"mag": current_mag, "reserve": current_reserve}

func _switch_to_slot(slot_idx: int) -> void:
	if slot_idx < 1 or slot_idx > weapon_slots.size():
		return
	if weapon_slots[slot_idx - 1] == "":
		return
		
	_save_current_ammo()
	current_slot = slot_idx
	_equip_weapon(weapon_slots[current_slot - 1])
	SoundManager.play_sound("snd_P_bw_guns", 0.05, 1.0)
	
	if multiplayer.has_multiplayer_peer() and multiplayer.get_peers().size() > 0:
		rpc("net_switch_weapon", weapon_slots[current_slot - 1], current_slot)

func _cycle_weapon_slot(forward: bool = true) -> void:
	var occupied: Array[int] = []
	for i in range(weapon_slots.size()):
		if weapon_slots[i] != "":
			occupied.append(i + 1)
			
	if occupied.size() <= 1:
		return
		
	var cur_idx = occupied.find(current_slot)
	if cur_idx == -1:
		cur_idx = 0
		
	if forward:
		cur_idx = (cur_idx + 1) % occupied.size()
	else:
		cur_idx = (cur_idx - 1 + occupied.size()) % occupied.size()
		
	_switch_to_slot(occupied[cur_idx])

func acquire_weapon(wpn_id: String) -> void:
	var wpn_data = WeaponDatabase.get_weapon(wpn_id)
	if wpn_data.is_empty():
		return
		
	var w_mag = wpn_data.get("mag_size", 12)
	var w_res_max = wpn_data.get("reserve_max", 96)
	var w_init_res = int(w_res_max * 0.5)
	
	# 1. If already owned in one of the slots, refill ammo up to max reserve
	for i in range(weapon_slots.size()):
		if weapon_slots[i] == wpn_id:
			if not weapon_ammo.has(wpn_id):
				weapon_ammo[wpn_id] = {"mag": w_mag, "reserve": w_res_max}
			else:
				weapon_ammo[wpn_id]["reserve"] = min(weapon_ammo[wpn_id]["reserve"] + w_res_max, w_res_max)
			_switch_to_slot(i + 1)
			return
			
	# 2. If not owned, check for first empty slot
	var empty_idx = -1
	for i in range(weapon_slots.size()):
		if weapon_slots[i] == "":
			empty_idx = i
			break
			
	_save_current_ammo()
	if empty_idx != -1:
		weapon_slots[empty_idx] = wpn_id
		weapon_ammo[wpn_id] = {"mag": w_mag, "reserve": w_init_res}
		current_slot = empty_idx + 1
		_equip_weapon(wpn_id)
	else:
		# Replace currently active slot
		weapon_slots[current_slot - 1] = wpn_id
		weapon_ammo[wpn_id] = {"mag": w_mag, "reserve": w_init_res}
		_equip_weapon(wpn_id)
		
	if multiplayer.has_multiplayer_peer() and multiplayer.get_peers().size() > 0:
		rpc("net_switch_weapon", weapon_slots[current_slot - 1], current_slot)

func has_weapon_in_slots(wpn_id: String) -> bool:
	return weapon_slots.has(wpn_id)

func refill_ammo_for_weapon(wpn_id: String) -> void:
	var wpn_data = WeaponDatabase.get_weapon(wpn_id)
	var w_res_max = wpn_data.get("reserve_max", 96)
	if not weapon_ammo.has(wpn_id):
		weapon_ammo[wpn_id] = {"mag": wpn_data.get("mag_size", 12), "reserve": w_res_max}
	else:
		weapon_ammo[wpn_id]["reserve"] = w_res_max
		
	if weapon_slots[current_slot - 1] == wpn_id:
		current_reserve = w_res_max

func refill_all_ammo() -> void:
	for w in weapon_slots:
		if w != "":
			var w_data = WeaponDatabase.get_weapon(w)
			var w_mag = w_data.get("mag_size", 12)
			var w_res = w_data.get("reserve_max", 96)
			weapon_ammo[w] = {"mag": w_mag, "reserve": w_res}
	if current_weapon_data.has("id"):
		current_mag = current_weapon_data.get("mag_size", 12)
		current_reserve = current_weapon_data.get("reserve_max", 96)
	grenades_count = 3
	molotov_count = 2
	landmines_count = 2

func _update_remote_legs_animation(delta: float) -> void:
	if not is_on_floor():
		body_sprite.texture = body_jump_texture
		legs_sprite.texture = pants_jump_texture
	elif target_moving or abs(velocity.x) > 10.0:
		anim_timer += delta * ANIM_FPS
		if body_walk_frames.size() > 0:
			var idx = int(anim_timer) % body_walk_frames.size()
			body_sprite.texture = body_walk_frames[idx]
		if pants_walk_frames.size() > 0:
			var idx = int(anim_timer) % pants_walk_frames.size()
			legs_sprite.texture = pants_walk_frames[idx]
	else:
		body_sprite.texture = body_stand_texture
		legs_sprite.texture = pants_stand_texture
		anim_timer = 0.0

@rpc("any_peer", "call_local", "reliable")
func net_switch_weapon(weapon_id: String, slot_idx: int) -> void:
	current_slot = slot_idx
	if slot_idx >= 1 and slot_idx <= weapon_slots.size():
		weapon_slots[slot_idx - 1] = weapon_id
	_equip_weapon(weapon_id)

func _try_shoot() -> void:
	if not can_shoot or is_reloading:
		return
	if current_mag <= 0:
		_reload()
		return

	can_shoot = false
	if not GameManager.is_infinite_ammo:
		current_mag -= 1
		_save_current_ammo()

	var mouse_pos = get_global_mouse_position()
	var spawn_pos = arm_pivot.global_position + Vector2.RIGHT.rotated(arm_pivot.rotation) * 25.0
	if muzzle_point and is_instance_valid(muzzle_point):
		spawn_pos = muzzle_point.global_position
		
	var base_dir = (mouse_pos - spawn_pos).normalized()
	if spawn_pos.distance_to(mouse_pos) < 5.0:
		base_dir = Vector2.RIGHT.rotated(arm_pivot.rotation)

	var wpn_id = current_weapon_data.get("id", "handgun")
	
	# Spawn local bullet immediately
	_spawn_projectile_direct(wpn_id, spawn_pos, base_dir)

	# Broadcast to other peers if multiplayer
	if multiplayer.has_multiplayer_peer() and multiplayer.get_peers().size() > 0:
		rpc("net_shoot", wpn_id, spawn_pos, base_dir)

	if is_local_player and camera:
		var rec = current_weapon_data.get("recoil_camera", 1.5) * max(0.2, 1.0 - PlayerStatsManager.get_recoil_control_bonus())
		_shake_camera(rec)

	var effective_fr = current_weapon_data.get("fire_rate", 0.2) * fire_rate_multiplier * max(0.4, 1.0 - PlayerStatsManager.get_fire_rate_bonus())
	if GameManager.is_speed_boost:
		effective_fr *= 0.6
	await get_tree().create_timer(effective_fr).timeout
	can_shoot = true

@rpc("any_peer", "call_local", "reliable")
func net_shoot(wpn_id: String, spawn_pos: Vector2, base_dir: Vector2) -> void:
	_spawn_projectile_direct(wpn_id, spawn_pos, base_dir)

func _spawn_projectile_direct(wpn_id: String, spawn_pos: Vector2, base_dir: Vector2) -> void:
	var wpn_data = WeaponDatabase.get_weapon(wpn_id)
	if wpn_data.is_empty():
		wpn_data = current_weapon_data
		
	var snd = wpn_data.get("shoot_sound", "snd_handgun")
	if snd != "":
		SoundManager.play_sound(snd, 0.08, 0.0)

	var root = get_tree().current_scene if get_tree().current_scene else get_parent()
	var proj_type = wpn_data.get("projectile", "bullet")
	if proj_type == "rocket":
		var r = rocket_scene.instantiate()
		r.shooter = self
		root.add_child(r)
		r.global_position = spawn_pos
		r.direction = base_dir
		r.damage = wpn_data.get("damage", 120.0)
		r.speed = wpn_data.get("bullet_speed", 550.0)
		r.knockback = wpn_data.get("knockback", 300.0)
	elif proj_type == "arrow":
		var a = crossbow_bolt_scene.instantiate()
		a.shooter = self
		root.add_child(a)
		a.global_position = spawn_pos
		a.direction = base_dir
		a.damage = wpn_data.get("damage", 85.0)
		a.speed = wpn_data.get("bullet_speed", 750.0)
		a.knockback = wpn_data.get("knockback", 200.0)
	elif proj_type == "flame":
		var f = flame_particle_scene.instantiate()
		f.shooter = self
		root.add_child(f)
		f.global_position = spawn_pos
		var spread = deg_to_rad(randf_range(-wpn_data.get("spread_deg", 8.0), wpn_data.get("spread_deg", 8.0)))
		f.direction = base_dir.rotated(spread)
		f.damage_per_sec = wpn_data.get("damage", 40.0)
		f.speed = wpn_data.get("bullet_speed", 400.0)
	elif proj_type == "raygun_bolt":
		var rb = raygun_bolt_scene.instantiate()
		rb.shooter = self
		root.add_child(rb)
		rb.global_position = spawn_pos
		rb.direction = base_dir
		rb.damage = wpn_data.get("damage", 150.0)
		rb.speed = wpn_data.get("bullet_speed", 800.0)
		rb.knockback = wpn_data.get("knockback", 250.0)
	else:
		# Standard bullet / shotgun pellets
		var pellets = wpn_data.get("pellets", 1)
		var spread_deg = wpn_data.get("spread_deg", 0.0)
		for i in range(pellets):
			var b = bullet_scene.instantiate()
			b.shooter = self
			root.add_child(b)
			b.global_position = spawn_pos
			var spread = deg_to_rad(randf_range(-spread_deg, spread_deg))
			b.direction = base_dir.rotated(spread)
			b.damage = wpn_data.get("damage", 25.0)
			b.speed = wpn_data.get("bullet_speed", 1500.0)
			b.knockback = wpn_data.get("knockback", 100.0)

		# Spawn spent brass casing right at player's weapon position on current floor
		if casing_scene:
			var cs = casing_scene.instantiate()
			root.add_child(cs)
			cs.global_position = spawn_pos + Vector2(0, -2)
			var eject_dir = Vector2.UP.rotated(randf_range(-0.6, 0.6))
			if visuals.scale.x < 0:
				eject_dir.x *= -1.0
			cs.linear_velocity = eject_dir * randf_range(160, 240) + Vector2(0, -60)
			cs.angular_velocity = randf_range(-20, 20)


	if is_local_player and camera:
		var rec = current_weapon_data.get("recoil_camera", 1.5) * max(0.2, 1.0 - PlayerStatsManager.get_recoil_control_bonus())
		_shake_camera(rec)

	var effective_fr = current_weapon_data.fire_rate * fire_rate_multiplier * max(0.4, 1.0 - PlayerStatsManager.get_fire_rate_bonus())
	if GameManager.is_speed_boost:
		effective_fr *= 0.6
	await get_tree().create_timer(effective_fr).timeout
	can_shoot = true

func add_xp(amount: float) -> void:
	xp += amount
	while xp >= xp_to_next:
		xp -= xp_to_next
		level += 1
		xp_to_next = int(xp_to_next * 1.4)
		max_health += 15.0
		health = max_health
		SoundManager.play_sound("snd_level_up", 0.0, 0.0)
		level_up.emit(level)
	xp_changed.emit(xp, xp_to_next, level)

func add_perk(perk_id: String) -> void:
	if perks.has(perk_id):
		return
	perks.append(perk_id)
	if perk_id == "juggernog":
		max_health += 100.0
		health = min(health + 100.0, max_health)
	elif perk_id == "speed_cola":
		reload_multiplier = max(0.25, reload_multiplier * 0.5)
	elif perk_id == "staminup":
		speed_multiplier *= 1.35
	elif perk_id == "double_tap":
		fire_rate_multiplier *= 0.65
	perks_updated.emit(perks)
	if perks.size() >= 4:
		AchievementsManager.unlock("perk_addict")

func _reload() -> void:
	if is_reloading or current_mag >= current_weapon_data.mag_size or current_reserve <= 0:
		return
	is_reloading = true
	var rel_snd = current_weapon_data.get("reload_sound", "snd_reload1")
	if rel_snd != "":
		SoundManager.play_sound(rel_snd)

	await get_tree().create_timer(current_weapon_data.reload_time * reload_multiplier).timeout
	var needed = current_weapon_data.mag_size - current_mag
	var to_load = min(needed, current_reserve)
	current_mag += to_load
	current_reserve -= to_load
	_save_current_ammo()
	is_reloading = false

var last_stand_ready: bool = true

func take_damage(amount: float) -> void:
	if is_dead:
		return

	# Invulnerability Power-Up
	if GameManager.is_invulnerable:
		SoundManager.play_sound("snd_bounce", 0.05, 1.0)
		if visuals:
			visuals.modulate = Color(0.5, 2.0, 2.5, 1.0)
			var tw = create_tween()
			tw.tween_property(visuals, "modulate", Color(1.0, 1.0, 1.0, 1.0), 0.15)
		return

	# 1. Dodge Chance
	if randf() < PlayerStatsManager.get_dodge_chance():
		# Dodged completely!
		SoundManager.play_sound("snd_katana_swing", 0.1, 3.0)
		return

	# 2. Damage Reduction & Bleed Resistance (capped to max 75% reduction so player always takes damage)
	var dr = min(0.75, PlayerStatsManager.get_damage_reduction_bonus() + PlayerStatsManager.get_bleed_resistance_bonus())
	var final_dmg = max(1.0, amount * (1.0 - dr))

	health -= final_dmg
	_update_blood_overlay()
	_spawn_player_blood_spurt()

	# Visual hit flash
	if visuals:
		visuals.modulate = Color(2.5, 0.3, 0.3, 1.0)
		var tw = create_tween()
		tw.tween_property(visuals, "modulate", Color(1.0, 1.0, 1.0, 1.0), 0.2)

	# 3. Last Stand Emergency Heal
	if health <= max_health * 0.2 and last_stand_ready and PlayerStatsManager.get_last_stand_heal_bonus() > 0.0:
		last_stand_ready = false
		health = min(max_health, health + PlayerStatsManager.get_last_stand_heal_bonus())
		_update_blood_overlay()
		SoundManager.play_sound("snd_level_up", 0.1, 3.0)
		get_tree().create_timer(45.0).timeout.connect(func(): last_stand_ready = true)
	
	if hurt_sound_timer <= 0:
		hurt_sound_timer = 0.35
		var hurt_idx = (randi() % 3) + 1
		SoundManager.play_sound("snd_hurt" + str(hurt_idx), 0.1, 1.0)
		SoundManager.play_sound("snd_zombie_bite", 0.1, -2.0)
	
	if health <= 0:
		if perks.has("quick_revive"):
			perks.erase("quick_revive")
			perks_updated.emit(perks)
			health = max_health * 0.6
			_update_blood_overlay()
			SoundManager.play_sound("snd_revive1", 0.0, 1.5)
			if visuals:
				var tw = create_tween()
				tw.tween_property(visuals, "modulate", Color(0.3, 2.5, 0.6, 1.0), 0.2)
				tw.tween_property(visuals, "modulate", Color.WHITE, 0.4)
			return
		health = 0
		var all_players = get_tree().get_nodes_in_group("players")
		var is_multiplayer_session = (NetworkManager.is_multiplayer_active() and NetworkManager.players.size() > 1) or all_players.size() > 1
		if is_multiplayer_session and not is_downed:
			enter_downed_state()
		else:
			die()

func _update_blood_overlay() -> void:
	if not blood_overlay_sprite:
		return
	
	var hp_ratio = clamp(health / max_health, 0.0, 1.0)
	if hp_ratio >= 0.96 or player_blood_frames.is_empty():
		blood_overlay_sprite.visible = false
	else:
		blood_overlay_sprite.visible = true
		var blood_idx = int((1.0 - hp_ratio) * (player_blood_frames.size() - 1))
		blood_idx = clamp(blood_idx, 0, player_blood_frames.size() - 1)
		blood_overlay_sprite.texture = player_blood_frames[blood_idx]

func _spawn_player_blood_spurt() -> void:
	var parts = CPUParticles2D.new()
	parts.emitting = true
	parts.one_shot = true
	parts.explosiveness = 0.92
	parts.amount = 18
	parts.lifetime = 0.4
	parts.color = Color(0.75, 0.05, 0.05, 1.0)
	parts.direction = Vector2(randf_range(-1.0, 1.0), -0.8).normalized()
	parts.spread = 50.0
	parts.initial_velocity_min = 70.0
	parts.initial_velocity_max = 150.0
	parts.gravity = Vector2(0, 520)
	parts.scale_amount_min = 2.0
	parts.scale_amount_max = 4.0
	parts.global_position = global_position + Vector2(0, -22.0)
	get_tree().current_scene.add_child(parts)
	
	get_tree().create_timer(0.55).timeout.connect(parts.queue_free)
	
	# Drop floor blood decal
	if randf() < 0.5:
		var blood_idx = randi() % 3
		var path = "res://assets/sprites/effects/spr_floor_blood/spr_floor_blood_" + str(blood_idx) + ".png"
		if ResourceLoader.exists(path):
			var decal = Sprite2D.new()
			decal.texture = load(path)
			decal.global_position = global_position + Vector2(randf_range(-8, 8), -2.0)
			decal.z_index = -5
			get_tree().current_scene.add_child(decal)

func die() -> void:
	if is_dead:
		return
	is_dead = true
	
	# Stop motion immediately
	velocity.x = 0
	
	# Hide aim / weapon
	if arm_pivot:
		arm_pivot.visible = false
	if flashlight:
		flashlight.enabled = false
	if blood_overlay_sprite:
		blood_overlay_sprite.visible = false
		
	# Death collapse: fall immediately flat to the ground
	if visuals:
		visuals.z_index = -8
		var fall_direction = -1.0 if visuals.scale.x < 0 else 1.0
		var tween = create_tween().set_parallel(true)
		tween.tween_property(visuals, "rotation_degrees", fall_direction * 90.0, 0.15).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
		tween.tween_property(visuals, "position:y", 10.0, 0.15).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
		
	# Spawn large floor blood pool under corpse
	var blood_idx = randi() % 3
	var path = "res://assets/sprites/effects/spr_floor_blood/spr_floor_blood_" + str(blood_idx) + ".png"
	if ResourceLoader.exists(path):
		var decal = Sprite2D.new()
		decal.texture = load(path)
		decal.global_position = global_position + Vector2(0, 0)
		decal.scale = Vector2(1.5, 1.5)
		decal.z_index = -9
		get_tree().current_scene.call_deferred("add_child", decal)
		
	# Play death sounds
	SoundManager.play_sound("snd_die", 0.0, 0.0)
	SoundManager.play_sound("snd_bear_die", 0.0, 0.0)
	SoundManager.play_sound("snd_blade", 0.1, -4.0)
	
	# Camera death impact shake
	_shake_camera(8.0)
	
	GameManager.player_died.emit(multiplayer.get_unique_id())

func _shake_camera(intensity: float) -> void:
	var tween = create_tween()
	var offset = Vector2(randf_range(-intensity, intensity), randf_range(-intensity, intensity))
	camera.offset = offset
	tween.tween_property(camera, "offset", Vector2.ZERO, 0.08)

# ==================== DOWNED & REVIVE SYSTEM ====================

func enter_downed_state() -> void:
	if is_downed or is_dead:
		return
	is_downed = true
	health = 0
	bleedout_timer = MAX_BLEEDOUT_TIME
	revive_progress = 0.0
	
	SoundManager.play_sound("snd_hurt1", 0.0, 1.0)
	SoundManager.play_sound("snd_blade", 0.1, -2.0)

	# Crawling posture
	if visuals:
		visuals.rotation_degrees = 75.0 * (1.0 if visuals.scale.x >= 0 else -1.0)
		visuals.position.y = -10.0
	
	_save_current_ammo()
	_equip_weapon("handgun")
	_create_downed_ui()

	if multiplayer.has_multiplayer_peer():
		rpc("net_set_downed", true)

	_check_team_wipe()

@rpc("any_peer", "call_local", "reliable")
func net_set_downed(downed: bool) -> void:
	is_downed = downed
	if downed:
		if visuals:
			visuals.rotation_degrees = 75.0 * (1.0 if visuals.scale.x >= 0 else -1.0)
			visuals.position.y = -10.0
		_create_downed_ui()
	else:
		if visuals:
			visuals.rotation_degrees = 0.0
			visuals.position.y = -39.0
		if downed_tag:
			downed_tag.visible = false

func revive_player() -> void:
	if not is_downed or is_dead:
		return
	is_downed = false
	health = max_health * 0.5
	revive_progress = 0.0
	
	if visuals:
		visuals.rotation_degrees = 0.0
		visuals.position.y = -39.0

	if downed_tag:
		downed_tag.visible = false

	var cur_wpn = weapon_slots[current_slot - 1] if current_slot >= 1 and current_slot <= weapon_slots.size() and weapon_slots[current_slot - 1] != "" else "handgun"
	_equip_weapon(cur_wpn)
	_update_blood_overlay()
	SoundManager.play_sound("snd_revive1", 0.0, 1.5)
	
	if visuals:
		var tw = create_tween()
		tw.tween_property(visuals, "modulate", Color(0.4, 2.5, 0.8, 1.0), 0.25)
		tw.tween_property(visuals, "modulate", Color.WHITE, 0.3)

	if multiplayer.has_multiplayer_peer():
		rpc("net_set_downed", false)

func _create_downed_ui() -> void:
	if not downed_tag:
		downed_tag = Label.new()
		downed_tag.name = "DownedTag"
		downed_tag.z_index = 80
		downed_tag.set_anchors_preset(Control.PRESET_CENTER)
		downed_tag.position = Vector2(-75, -80)
		downed_tag.size = Vector2(150, 24)
		downed_tag.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		downed_tag.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		downed_tag.add_theme_color_override("font_color", Color(1.0, 0.25, 0.25, 1.0))
		downed_tag.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 1))
		downed_tag.add_theme_constants_override("shadow_offset_x", 1)
		downed_tag.add_theme_constants_override("shadow_offset_y", 1)
		downed_tag.add_theme_font_size_override("font_size", 10)
		add_child(downed_tag)
	downed_tag.visible = true

func _update_downed_ui() -> void:
	if downed_tag and is_downed:
		var seconds = int(ceil(max(0.0, bleedout_timer)))
		if revive_progress > 0.0:
			var pct = int((revive_progress / REVIVE_TIME) * 100)
			downed_tag.text = "[REANIMANDO... " + str(pct) + "%]"
			downed_tag.add_theme_color_override("font_color", Color(0.3, 1.0, 0.5, 1.0))
		else:
			downed_tag.text = "[!] AJUDA NECESSARIA (" + str(seconds) + "s)"
			downed_tag.add_theme_color_override("font_color", Color(1.0, 0.3, 0.3, 1.0))

func _check_reviving_teammates(delta: float) -> void:
	var players = get_tree().get_nodes_in_group("players")
	var target_downed: Player = null
	for p in players:
		if p is Player and p != self and p.is_downed and not p.is_dead:
			if global_position.distance_to(p.global_position) <= 55.0:
				target_downed = p
				break
				
	if target_downed:
		if Input.is_action_pressed("interact") or Input.is_key_pressed(KEY_E):
			target_downed.revive_progress += delta
			if target_downed.revive_progress >= REVIVE_TIME:
				target_downed.revive_player()
				GameManager.add_money(250)
				GameManager.add_score(500)
				SoundManager.play_sound("snd_level_up", 0.0, 2.0)
		else:
			target_downed.revive_progress = max(0.0, target_downed.revive_progress - delta * 1.5)
	
func _check_team_wipe() -> void:
	var players = get_tree().get_nodes_in_group("players")
	var anyone_alive = false
	for p in players:
		if p is Player and not p.is_dead and not p.is_downed:
			anyone_alive = true
			break
			
	if not anyone_alive:
		# Team wipe: Everyone is downed or dead -> Trigger Game Over!
		GameManager.player_died.emit(multiplayer.get_unique_id())

extends Area2D
class_name Landmine

@export var damage: float = 400.0
@export var blast_radius: float = 110.0
var is_armed: bool = false
var has_detonated: bool = false

@onready var sprite: Sprite2D = $Sprite2D
var mine_frames: Array[Texture2D] = []
var anim_timer: float = 0.0

var flying_limb_scene = preload("res://scenes/effects/flying_limb.tscn")

func _ready() -> void:
	collision_layer = 0
	collision_mask = 3 # Detects zombies, boss, and players
	
	for i in range(4):
		var p = "res://assets/sprites/weapons/spr_landmine/spr_landmine_" + str(i) + ".png"
		if ResourceLoader.exists(p):
			mine_frames.append(load(p))
	
	if mine_frames.size() > 0:
		sprite.texture = mine_frames[0]
	
	SoundManager.play_sound_2d("snd_winchester_tick", global_position, 0.1, 0.0)
	
	# Arm after 0.8 seconds
	await get_tree().create_timer(0.8).timeout
	is_armed = true
	body_entered.connect(_on_body_entered)

func _physics_process(delta: float) -> void:
	if is_armed and not has_detonated and mine_frames.size() > 0:
		anim_timer += delta * 6.0
		sprite.texture = mine_frames[int(anim_timer) % mine_frames.size()]

func _on_body_entered(body: Node2D) -> void:
	if not is_armed or has_detonated:
		return
	if (body is Zombie and not body.is_dead) or (body is BossZombie and not body.is_dead) or (body is Player and not body.is_dead):
		_detonate()

func _detonate() -> void:
	has_detonated = true
	SoundManager.play_sound_2d("snd_xplode", global_position, 0.1, 4.0)
	
	var zombies = get_tree().get_nodes_in_group("zombies")
	for z in zombies:
		if is_instance_valid(z) and not z.get("is_dead"):
			var d = global_position.distance_to(z.global_position)
			if d <= blast_radius:
				var falloff = 1.0 - (d / blast_radius) * 0.4
				var push_force = (z.global_position - global_position).normalized() * 450.0
				if z.has_method("take_damage_hit"):
					z.take_damage_hit(damage * falloff, push_force, z.global_position + Vector2(0, -20), "explosive")
				elif z.has_method("take_damage"):
					z.take_damage(damage * falloff)
	
	# Massive player damage
	var players = get_tree().get_nodes_in_group("players")
	if players.is_empty():
		var p_single = get_tree().get_first_node_in_group("player")
		if p_single:
			players.append(p_single)
			
	for p in players:
		if is_instance_valid(p) and p is Player and not p.is_dead:
			var d = global_position.distance_to(p.global_position)
			if d <= blast_radius:
				var prox = 1.0 - (d / blast_radius)
				var p_dmg = lerp(85.0, 190.0, prox) # lethal at close range
				p.velocity += (p.global_position - global_position).normalized() * 550.0
				p.take_damage(p_dmg)
				p._shake_camera(12.0)
	
	# Spawn flying severed limbs
	for i in range(3):
		var limb = flying_limb_scene.instantiate()
		limb.global_position = global_position + Vector2(randf_range(-15, 15), -10)
		limb.velocity = Vector2(randf_range(-160, 160), randf_range(-220, -320))
		get_tree().current_scene.call_deferred("add_child", limb)
	
	queue_free()

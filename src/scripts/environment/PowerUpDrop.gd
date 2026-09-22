extends Area2D
class_name PowerUpDrop

@export var powerup_type: String = ""
var lifetime: float = 22.0

@onready var sprite: Sprite2D = $Sprite2D

var powerup_types = [
	"nuke", "max_ammo", "double_points", "insta_kill",
	"invulnerability", "infinite_ammo", "freeze", "carpenter",
	"speed_boost", "fire_bullets"
]

var powerup_icons = {
	"nuke": "res://assets/sprites/general/spr_powerups/spr_powerups_0.png",
	"max_ammo": "res://assets/sprites/general/spr_powerups/spr_powerups_1.png",
	"double_points": "res://assets/sprites/general/spr_powerups/spr_powerups_2.png",
	"insta_kill": "res://assets/sprites/general/spr_powerups/spr_powerups_3.png",
	"invulnerability": "res://assets/sprites/general/spr_powerups/spr_powerups_4.png",
	"infinite_ammo": "res://assets/sprites/general/spr_powerups/spr_powerups_5.png",
	"freeze": "res://assets/sprites/general/spr_powerups/spr_powerups_6.png",
	"carpenter": "res://assets/sprites/general/spr_powerups/spr_powerups_7.png",
	"speed_boost": "res://assets/sprites/general/spr_powerups/spr_powerups_8.png",
	"fire_bullets": "res://assets/sprites/general/spr_powerups/spr_powerups_9.png"
}

func _ready() -> void:
	if powerup_type == "":
		powerup_type = powerup_types[randi() % powerup_types.size()]
	
	var ico = powerup_icons.get(powerup_type, "")
	if ico != "" and ResourceLoader.exists(ico):
		sprite.texture = load(ico)

	body_entered.connect(_on_body_entered)
	
	# Floating bob tween
	var tween = create_tween().set_loops()
	tween.tween_property(sprite, "position:y", -6.0, 0.6).set_trans(Tween.TRANS_SINE)
	tween.tween_property(sprite, "position:y", 0.0, 0.6).set_trans(Tween.TRANS_SINE)
	
	# Blink before despawn
	_start_despawn_timer()

func _physics_process(_delta: float) -> void:
	for body in get_overlapping_bodies():
		if body is Player and not body.is_dead:
			_apply_powerup(body)
			queue_free()
			return

func _start_despawn_timer() -> void:
	await get_tree().create_timer(lifetime - 5.0).timeout
	if not is_instance_valid(sprite):
		return
	# Blink animation
	var blink_tween = create_tween().set_loops(10)
	blink_tween.tween_property(sprite, "modulate:a", 0.3, 0.25)
	blink_tween.tween_property(sprite, "modulate:a", 1.0, 0.25)
	await get_tree().create_timer(5.0).timeout
	if is_instance_valid(self):
		queue_free()

func _on_body_entered(body: Node2D) -> void:
	if body is Player and not body.is_dead:
		_apply_powerup(body)
		queue_free()

func _spawn_pickup_text(text: String, color: Color) -> void:
	var damage_number_scene = preload("res://scenes/effects/damage_number.tscn")
	var dn = damage_number_scene.instantiate()
	dn.global_position = global_position + Vector2(0, -20)
	get_tree().current_scene.add_child(dn)
	dn.setup(text, color, true)

func _apply_powerup(player: Player) -> void:
	SoundManager.play_sound("snd_level_up", 0.1, 2.0)
	
	if powerup_type == "double_points":
		GameManager.activate_double_points(30.0)
		SoundManager.play_sound("snd_P_bd_entertained")
		_spawn_pickup_text("+ 2X PONTOS!", Color(1.0, 0.85, 0.1))
	elif powerup_type == "insta_kill":
		GameManager.activate_insta_kill(30.0)
		SoundManager.play_sound("snd_P_bw_lead")
		_spawn_pickup_text("+ INSTA-KILL!", Color(1.0, 0.2, 0.2))
	elif powerup_type == "invulnerability":
		GameManager.activate_invulnerability(25.0)
		SoundManager.play_sound("snd_P_loveit")
		_spawn_pickup_text("+ INVULNERABILIDADE!", Color(0.2, 0.9, 1.0))
	elif powerup_type == "infinite_ammo":
		GameManager.activate_infinite_ammo(25.0)
		SoundManager.play_sound("snd_P_bw_guns")
		_spawn_pickup_text("+ MUNIÇÃO INFINITA!", Color(1.0, 0.8, 0.2))
	elif powerup_type == "freeze":
		GameManager.activate_freeze(15.0)
		SoundManager.play_sound("snd_P_p_doom")
		_spawn_pickup_text("+ CONGELAMENTO!", Color(0.4, 0.8, 1.0))
	elif powerup_type == "fire_bullets":
		GameManager.activate_fire_bullets(25.0)
		SoundManager.play_sound("snd_P_bw_bigbadaboom")
		_spawn_pickup_text("+ TIRO DE FOGO!", Color(1.0, 0.4, 0.1))
	elif powerup_type == "speed_boost":
		GameManager.activate_speed_boost(25.0)
		SoundManager.play_sound("snd_P_bd_havinfun")
		_spawn_pickup_text("+ SUPER VELOCIDADE!", Color(0.3, 1.0, 0.4))
	elif powerup_type == "max_ammo":
		GameManager.activate_max_ammo()
		_spawn_pickup_text("+ MUNIÇÃO MÁXIMA!", Color(0.2, 1.0, 0.8))
	elif powerup_type == "nuke":
		GameManager.activate_nuke()
		_spawn_pickup_text("☢ BOMBA NUCLEAR! ☢", Color(1.0, 0.9, 0.1))
	elif powerup_type == "carpenter":
		GameManager.activate_carpenter()
		_spawn_pickup_text("+ CARPINTEIRO!", Color(0.9, 0.7, 0.4))

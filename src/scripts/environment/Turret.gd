extends StaticBody2D
class_name Turret

@export var cost: int = 1200
@export var active_duration: float = 30.0
@export var cooldown_time: float = 15.0
@export var damage: float = 32.0
@export var fire_rate: float = 0.1
@export var range_radius: float = 380.0

var is_active: bool = false
var is_on_cooldown: bool = false
var can_shoot: bool = true
var player_in_range: Player = null
var target_zombie: Node2D = null

@onready var barrel_pivot: Node2D = $BarrelPivot
@onready var muzzle: Marker2D = $BarrelPivot/Muzzle
@onready var sprite: Sprite2D = $Sprite2D
@onready var interact_area: Area2D = $InteractArea
@onready var prompt_label: Label = $PromptLabel

var bullet_scene = preload("res://scenes/weapons/bullet.tscn")

func _ready() -> void:
	prompt_label.visible = false
	interact_area.body_entered.connect(_on_body_entered)
	interact_area.body_exited.connect(_on_body_exited)

func _on_body_entered(body: Node2D) -> void:
	if body is Player:
		player_in_range = body
		_update_prompt()
		prompt_label.visible = true

func _on_body_exited(body: Node2D) -> void:
	if body == player_in_range:
		player_in_range = null
		prompt_label.visible = false

func _process(_delta: float) -> void:
	if player_in_range and Input.is_action_just_pressed("interact") and not is_active and not is_on_cooldown:
		_try_activate()

func _physics_process(_delta: float) -> void:
	if not is_active:
		return

	_find_target()
	if target_zombie and is_instance_valid(target_zombie) and not target_zombie.get("is_dead"):
		var aim_vec = target_zombie.global_position + Vector2(0, -15) - barrel_pivot.global_position
		barrel_pivot.rotation = aim_vec.angle()
		if can_shoot:
			_shoot()

func _update_prompt() -> void:
	if not player_in_range:
		return
	if is_active:
		prompt_label.text = "TORRETA ATIVA!"
	elif is_on_cooldown:
		prompt_label.text = "RECARREGANDO..."
	else:
		prompt_label.text = "[E] Ativar Torreta Automática ($ " + str(cost) + ")"

func _try_activate() -> void:
	if GameManager.spend_money(cost):
		is_active = true
		_update_prompt()
		SoundManager.play_sound_2d("snd_winchester_tick", global_position, 0.1, 0.0)
		SoundManager.play_sound_2d("snd_buy", global_position, 0.1, 0.0)
		
		await get_tree().create_timer(active_duration).timeout
		is_active = false
		is_on_cooldown = true
		_update_prompt()
		SoundManager.play_sound_2d("snd_pop", global_position, 0.1, -4.0)
		
		await get_tree().create_timer(cooldown_time).timeout
		is_on_cooldown = false
		_update_prompt()
	else:
		SoundManager.play_sound("snd_button", 0.1, -6.0)

func _find_target() -> void:
	var zombies = get_tree().get_nodes_in_group("zombies")
	var closest_dist = range_radius
	target_zombie = null
	for z in zombies:
		if is_instance_valid(z) and not z.get("is_dead"):
			var d = global_position.distance_to(z.global_position)
			if d < closest_dist:
				closest_dist = d
				target_zombie = z

func _shoot() -> void:
	can_shoot = false
	SoundManager.play_sound_2d("snd_uzi", global_position, 0.08, 1.5)
	
	var b = bullet_scene.instantiate()
	b.global_position = muzzle.global_position
	var spread = deg_to_rad(randf_range(-2.0, 2.0))
	b.direction = Vector2.RIGHT.rotated(barrel_pivot.rotation + spread)
	b.damage = damage
	b.speed = 1400.0
	b.knockback = 70.0
	get_tree().current_scene.add_child(b)
	
	await get_tree().create_timer(fire_rate).timeout
	can_shoot = true

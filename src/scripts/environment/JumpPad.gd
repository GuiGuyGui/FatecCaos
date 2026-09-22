@tool
extends Node2D
class_name JumpPad

@export var cost: int = 500
@export var is_unlocked: bool = false:
	set(val):
		is_unlocked = val
		_update_visuals()

@export var launch_velocity_y: float = -620.0
@export var launch_velocity_x: float = 0.0

var player_in_range: Player = null
var bounce_cooldown: float = 0.0

@onready var sprite: Sprite2D = get_node_or_null("Sprite2D")
@onready var prompt_label: Label = get_node_or_null("PromptLabel")
@onready var trigger_area: Area2D = get_node_or_null("TriggerArea")
@onready var interact_area: Area2D = get_node_or_null("InteractArea")

var tex_idle = preload("res://assets/sprites/general/spr_jumper/spr_jumper_0.png")
var tex_bounce = preload("res://assets/sprites/general/spr_jumper/spr_jumper_1.png")

func _ready() -> void:
	add_to_group("jump_pads")
	_update_visuals()
	
	if not Engine.is_editor_hint():
		if prompt_label:
			prompt_label.visible = false
		if trigger_area:
			trigger_area.body_entered.connect(_on_trigger_body_entered)
		if interact_area:
			interact_area.body_entered.connect(_on_interact_body_entered)
			interact_area.body_exited.connect(_on_interact_body_exited)

func _update_visuals() -> void:
	if not sprite:
		sprite = get_node_or_null("Sprite2D")
	if sprite and tex_idle:
		sprite.texture = tex_idle
		if is_unlocked:
			sprite.modulate = Color(1.0, 1.0, 1.0, 1.0)
		else:
			sprite.modulate = Color(0.7, 0.7, 0.7, 0.85)

func _on_interact_body_entered(body: Node2D) -> void:
	if Engine.is_editor_hint():
		return
	if body is Player:
		player_in_range = body
		_update_prompt()
		if prompt_label:
			prompt_label.visible = true

func _on_interact_body_exited(body: Node2D) -> void:
	if Engine.is_editor_hint():
		return
	if body == player_in_range:
		player_in_range = null
		if prompt_label:
			prompt_label.visible = false

func _on_trigger_body_entered(body: Node2D) -> void:
	if Engine.is_editor_hint() or (not is_unlocked and not GameManager.is_endless_horde):
		return
	
	# Zombies launch automatically when stepping on the jump pad
	if bounce_cooldown <= 0.0:
		if body is Zombie and not body.is_dead:
			_launch_body(body)

func _launch_body(body: CharacterBody2D) -> void:
	bounce_cooldown = 0.2
	body.velocity.y = launch_velocity_y
	if launch_velocity_x != 0.0:
		body.velocity.x = launch_velocity_x
	
	SoundManager.play_sound_2d("snd_bounce", global_position, 0.1, 2.0)
	
	# Visual spring bounce animation
	if sprite and tex_bounce:
		sprite.texture = tex_bounce
		var tw = create_tween()
		tw.tween_property(sprite, "scale", Vector2(1.3, 0.7), 0.08)
		tw.tween_property(sprite, "scale", Vector2(1.0, 1.0), 0.15)
		tw.tween_callback(func():
			if sprite and tex_idle:
				sprite.texture = tex_idle
		)

	# Spawn jump dust / cloud effect
	_spawn_jump_cloud()

func _spawn_jump_cloud() -> void:
	var cloud_path = "res://assets/sprites/general/spr_jumpcloud/spr_jumpcloud.png"
	if ResourceLoader.exists(cloud_path):
		var sp = Sprite2D.new()
		sp.texture = load(cloud_path)
		sp.global_position = global_position + Vector2(0, -5)
		sp.scale = Vector2(0.8, 0.8)
		get_tree().current_scene.add_child(sp)
		var tw = sp.create_tween()
		tw.tween_property(sp, "scale", Vector2(1.4, 1.4), 0.3)
		tw.parallel().tween_property(sp, "modulate:a", 0.0, 0.3)
		tw.tween_callback(sp.queue_free)

func _process(delta: float) -> void:
	if Engine.is_editor_hint():
		return
	
	if bounce_cooldown > 0.0:
		bounce_cooldown -= delta
	
	if player_in_range and not player_in_range.is_dead:
		if Input.is_action_just_pressed("interact"):
			if not is_unlocked:
				_try_unlock()
			else:
				_launch_body(player_in_range)

func _update_prompt() -> void:
	if prompt_label:
		if not is_unlocked:
			prompt_label.modulate = Color(0.2, 1.0, 0.4)
			prompt_label.text = "[E] Comprar Plataforma de Pulo ($ " + str(cost) + ")"
		else:
			prompt_label.modulate = Color(0.3, 0.85, 1.0)
			prompt_label.text = "[E] Super Pulo"
		prompt_label.visible = (player_in_range != null)

func _try_unlock() -> void:
	if GameManager.money >= cost:
		GameManager.add_money(-cost)
		is_unlocked = true
		SoundManager.play_sound("snd_buy", 0.05, 0.0)
		SoundManager.play_sound("snd_level_up", 0.1, 1.0)
		_update_visuals()
		_update_prompt()
	else:
		SoundManager.play_sound("snd_button", 0.1, -6.0)

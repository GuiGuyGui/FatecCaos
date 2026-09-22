@tool
extends Node2D
class_name AmmoTerminal

@export var cost: int = 400
@export var terminal_name: String = "Comprar Munição"

var player_in_range: Player = null
var anim_timer: float = 0.0

@onready var sprite: Sprite2D = get_node_or_null("Sprite2D")
@onready var prompt_label: Label = get_node_or_null("PromptLabel")
@onready var interact_area: Area2D = get_node_or_null("InteractArea")
@onready var screen_light: PointLight2D = get_node_or_null("ScreenLight")

func _ready() -> void:
	if not Engine.is_editor_hint():
		if prompt_label:
			prompt_label.visible = false
		if interact_area:
			interact_area.body_entered.connect(_on_body_entered)
			interact_area.body_exited.connect(_on_body_exited)

func _on_body_entered(body: Node2D) -> void:
	if Engine.is_editor_hint():
		return
	if body is Player:
		player_in_range = body
		_update_prompt()
		if prompt_label:
			prompt_label.visible = true

func _on_body_exited(body: Node2D) -> void:
	if Engine.is_editor_hint():
		return
	if body == player_in_range:
		player_in_range = null
		if prompt_label:
			prompt_label.visible = false

func _process(delta: float) -> void:
	if not Engine.is_editor_hint():
		anim_timer += delta
		if screen_light:
			# Subtle pulsing green glow on terminal screen
			screen_light.energy = 0.8 + sin(anim_timer * 3.0) * 0.25
			
	if Engine.is_editor_hint():
		return
	if not player_in_range:
		return
	if Input.is_action_just_pressed("interact"):
		_try_buy_ammo()

func _update_prompt() -> void:
	if prompt_label:
		prompt_label.text = "[E] " + terminal_name + " ($ " + str(cost) + ")"

func _try_buy_ammo() -> void:
	if not player_in_range:
		return
		
	if GameManager.money >= cost:
		GameManager.add_money(-cost)
		
		# Refill all equipped weapons and gear for player
		if player_in_range.has_method("refill_all_ammo"):
			player_in_range.refill_all_ammo()
		else:
			player_in_range.current_mag = player_in_range.current_weapon_data.mag_size
			player_in_range.current_reserve = player_in_range.current_weapon_data.reserve_max
			
		SoundManager.play_sound("snd_buy", 0.05, 0.0)
		SoundManager.play_sound("snd_BG_reload", 0.0, 1.2)
		
		# Pulse green flash on screen
		if sprite:
			var tw = create_tween()
			tw.tween_property(sprite, "modulate", Color(1.4, 2.5, 1.4, 1.0), 0.1)
			tw.tween_property(sprite, "modulate", Color.WHITE, 0.25)
			
		_update_prompt()
	else:
		SoundManager.play_sound("snd_button", 0.1, -6.0)

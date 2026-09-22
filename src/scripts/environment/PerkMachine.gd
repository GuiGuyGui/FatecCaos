@tool
extends Node2D
class_name PerkMachine

@export var perk_type: String = "juggernog": # juggernog, speed_cola, staminup, double_tap, quick_revive
	set(val):
		perk_type = val
		_update_visuals()

@export var cost: int = 2500
@export var perk_name: String = "Juggernog (+Vida)"

var player_in_range: Player = null
var bought_players: Array = []

@onready var sprite: Sprite2D = get_node_or_null("Sprite2D")
@onready var prompt_label: Label = get_node_or_null("PromptLabel")
@onready var interact_area: Area2D = get_node_or_null("InteractArea")

func _ready() -> void:
	_update_visuals()
	
	if not Engine.is_editor_hint():
		if prompt_label:
			prompt_label.visible = false
		if interact_area:
			interact_area.body_entered.connect(_on_body_entered)
			interact_area.body_exited.connect(_on_body_exited)

func _update_visuals() -> void:
	if not sprite:
		sprite = get_node_or_null("Sprite2D")
	if not sprite:
		return
		
	var frame_idx = 0
	if perk_type == "juggernog":
		cost = 2500
		perk_name = "Juggernog (+Vida Máxima)"
		frame_idx = 0
	elif perk_type == "speed_cola":
		cost = 2000
		perk_name = "Speed Cola (Recarga Rápida)"
		frame_idx = 1
	elif perk_type == "staminup":
		cost = 1500
		perk_name = "Stamin-Up (Velocidade)"
		frame_idx = 2
	elif perk_type == "double_tap":
		cost = 2000
		perk_name = "Double Tap (Cadência +35%)"
		frame_idx = 3
	elif perk_type == "quick_revive":
		cost = 1500
		perk_name = "Quick Revive (Regeneração)"
		frame_idx = 4

	var tex_path = "res://assets/sprites/environment/spr_OK_fridge/spr_OK_fridge_" + str(frame_idx) + ".png"
	if ResourceLoader.exists(tex_path):
		sprite.texture = load(tex_path)

func _on_body_entered(body: Node2D) -> void:
	if Engine.is_editor_hint():
		return
	if body is Player:
		player_in_range = body
		_update_prompt()
		prompt_label.visible = true

func _on_body_exited(body: Node2D) -> void:
	if body == player_in_range:
		player_in_range = null
		prompt_label.visible = false

func _process(_delta: float) -> void:
	if not player_in_range:
		return
	if Input.is_action_just_pressed("interact"):
		_try_buy()

func _update_prompt() -> void:
	if player_in_range in bought_players:
		prompt_label.text = perk_name + " [Adquirido]"
	else:
		prompt_label.text = "[E] " + perk_name + " ($ " + str(cost) + ")"

func _try_buy() -> void:
	if player_in_range in bought_players:
		SoundManager.play_sound("snd_button", 0.1, -4.0)
		return

	if GameManager.money >= cost:
		GameManager.add_money(-cost)
		bought_players.append(player_in_range)
		player_in_range.add_perk(perk_type)
		SoundManager.play_sound("snd_level_up", 0.1, 0.0)
		_update_prompt()
	else:
		SoundManager.play_sound("snd_button", 0.1, -6.0)

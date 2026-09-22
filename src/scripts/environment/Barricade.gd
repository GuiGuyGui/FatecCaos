extends Node2D
class_name Barricade

@export var max_planks: int = 6
var current_planks: int = 6
var player_in_range: Player = null
var is_rebuilding: bool = false

@onready var sprite: Sprite2D = $Sprite2D
@onready var interact_area: Area2D = $InteractArea
@onready var prompt_label: Label = $PromptLabel

var plank_frames: Array[Texture2D] = []

func _ready() -> void:
	add_to_group("barricades")
	prompt_label.visible = false
	for i in range(7):
		var p = "res://assets/sprites/environment/spr_barricade/spr_barricade_" + str(i) + ".png"
		if ResourceLoader.exists(p):
			plank_frames.append(load(p))
	
	_update_visuals()
	interact_area.body_entered.connect(_on_body_entered)
	interact_area.body_exited.connect(_on_body_exited)

func repair_full() -> void:
	current_planks = max_planks
	_update_visuals()
	_update_prompt()

func _on_body_entered(body: Node2D) -> void:
	if body is Player:
		player_in_range = body
		_update_prompt()
		prompt_label.visible = (current_planks < max_planks)

func _on_body_exited(body: Node2D) -> void:
	if body == player_in_range:
		player_in_range = null
		prompt_label.visible = false

func _process(_delta: float) -> void:
	if not player_in_range or current_planks >= max_planks:
		return
	
	if Input.is_action_pressed("interact") and not is_rebuilding:
		_rebuild_plank()

func _rebuild_plank() -> void:
	is_rebuilding = true
	SoundManager.play_sound("snd_build", 0.08, 0.0)
	current_planks = min(current_planks + 1, max_planks)
	var rep_bonus = PlayerStatsManager.get_repair_bonus()
	var earned_cash = 10 + rep_bonus
	var earned_score = 10 + rep_bonus
	GameManager.add_money(earned_cash)
	GameManager.add_score(earned_score)
	PlayerStatsManager.add_career_cash(earned_cash)
	if player_in_range and is_instance_valid(player_in_range):
		var xp_mult = PlayerStatsManager.get_xp_multiplier()
		player_in_range.add_xp((5.0 + rep_bonus) * xp_mult)
	ObjectivesManager.report_progress("repair_barricades", 1)
	_update_visuals()
	_update_prompt()
	await get_tree().create_timer(0.4).timeout
	is_rebuilding = false

func damage_plank() -> void:
	if current_planks > 0:
		current_planks -= 1
		SoundManager.play_sound("snd_blade", 0.1, -2.0)
		_update_visuals()

func _update_visuals() -> void:
	if plank_frames.size() > 0:
		var idx = clamp(current_planks, 0, plank_frames.size() - 1)
		sprite.texture = plank_frames[idx]

func _update_prompt() -> void:
	if current_planks < max_planks:
		prompt_label.text = "[E] Reparar Barricada (+$10)"
		prompt_label.visible = true
	else:
		prompt_label.visible = false

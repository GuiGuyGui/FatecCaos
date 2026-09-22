extends Node2D
class_name UpgradeMachine

@export var cost: int = 5000
var player_in_range: Player = null

@onready var prompt_label: Label = $PromptLabel
@onready var interact_area: Area2D = $InteractArea

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
	if not player_in_range:
		return
	if Input.is_action_just_pressed("interact"):
		_try_upgrade()

func _update_prompt() -> void:
	if not player_in_range:
		return
	var cur_w = player_in_range.current_weapon_data
	if cur_w.get("is_upgraded", false):
		prompt_label.text = cur_w.get("name", "") + " [UPGRADE MÁXIMO]"
	else:
		prompt_label.text = "[E] Aprimorar Arma ($ " + str(cost) + ")"

func _try_upgrade() -> void:
	if not player_in_range:
		return
	var cur_id = player_in_range.current_weapon_data.get("id", "")
	if cur_id == "" or player_in_range.upgraded_weapons.get(cur_id, false):
		SoundManager.play_sound("snd_button", 0.1, -4.0)
		return

	if GameManager.money >= cost:
		GameManager.add_money(-cost)
		
		# Register weapon as upgraded in match & re-equip
		player_in_range.upgraded_weapons[cur_id] = true
		player_in_range._equip_weapon(cur_id)
		
		# Refill upgraded mag and reserve
		player_in_range.current_mag = player_in_range.current_weapon_data.mag_size
		player_in_range.current_reserve = player_in_range.current_weapon_data.reserve_max
		if player_in_range.has_method("_save_current_ammo"):
			player_in_range._save_current_ammo()
		
		SoundManager.play_sound("snd_level_up", 0.1, 0.0)
		SoundManager.play_sound("snd_upgrade", 0.05, 1.2)
		AchievementsManager.unlock("pack_a_punch")
		ObjectivesManager.report_progress("upgrade_weapon", 1)
		_update_prompt()
	else:
		SoundManager.play_sound("snd_button", 0.1, -6.0)

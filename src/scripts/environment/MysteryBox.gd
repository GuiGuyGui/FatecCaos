extends Node2D
class_name MysteryBox

@export var cost: int = 950
var is_spinning: bool = false
var player_in_range: Player = null
var current_rolled_weapon: String = ""
var can_take_weapon: bool = false

var available_weapons = [
	"desert_eagle", "shotgun", "db_shotgun", "auto_shotgun",
	"mp5k", "machinegun", "ak47", "famas", "rifle", "awp", "heavygun", "chainsaw",
	"rpg", "flamethrower", "crossbow", "m60", "aug", "katana"
]

@onready var box_sprite: Sprite2D = $BoxSprite
@onready var weapon_preview: Sprite2D = $WeaponPreview
@onready var prompt_label: Label = $PromptLabel
@onready var interact_area: Area2D = $InteractArea

func _ready() -> void:
	prompt_label.visible = false
	weapon_preview.visible = false
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

var box_anim_timer: float = 0.0

func _process(delta: float) -> void:
	if can_take_weapon and weapon_preview and weapon_preview.visible:
		box_anim_timer += delta
		weapon_preview.position.y = -28.0 + sin(box_anim_timer * 3.2) * 4.0
		weapon_preview.scale.x = cos(box_anim_timer * 2.5)

	if not player_in_range:
		return

	if Input.is_action_just_pressed("interact"):
		if can_take_weapon:
			_take_weapon()
		elif not is_spinning:
			_try_spin()

func get_effective_cost() -> int:
	var discount = PlayerStatsManager.get_mystery_box_discount()
	return int(cost * max(0.5, 1.0 - discount))

func _update_prompt() -> void:
	if can_take_weapon:
		var w_name = WeaponDatabase.get_weapon(current_rolled_weapon).get("name", "Arma")
		prompt_label.text = "[E] Pegar " + w_name
	elif is_spinning:
		prompt_label.text = "Sorteando..."
	else:
		prompt_label.text = "[E] Caixa Misteriosa ($ " + str(get_effective_cost()) + ")"

@rpc("any_peer", "call_local", "reliable")
func net_spin_box(target_weapon: String) -> void:
	_perform_box_spin(target_weapon)

func _try_spin() -> void:
	var eff_cost = get_effective_cost()
	if GameManager.money < eff_cost:
		SoundManager.play_sound("snd_button", 0.1, -6.0)
		return

	GameManager.add_money(-eff_cost)
	ObjectivesManager.report_progress("mystery_box", 1)
	
	var chosen_weapon = available_weapons[randi() % available_weapons.size()]
	if NetworkManager.is_multiplayer_active():
		net_spin_box.rpc(chosen_weapon)
	else:
		_perform_box_spin(chosen_weapon)

func _perform_box_spin(target_weapon: String) -> void:
	is_spinning = true
	can_take_weapon = false
	_update_prompt()
	SoundManager.play_sound("snd_pop", 0.1, 0.0)

	weapon_preview.visible = true
	weapon_preview.position = Vector2(0, -28)

	var spin_count = 14
	for i in range(spin_count):
		var rand_id = available_weapons[randi() % available_weapons.size()]
		var data = WeaponDatabase.get_weapon(rand_id)
		var ico_path = data.get("icon_path", "")
		if ico_path != "" and ResourceLoader.exists(ico_path):
			weapon_preview.texture = load(ico_path)
		SoundManager.play_sound("snd_button", 0.05, 4.0)
		await get_tree().create_timer(0.08 + (i * 0.01)).timeout

	current_rolled_weapon = target_weapon
	var final_data = WeaponDatabase.get_weapon(current_rolled_weapon)
	var final_ico_path = final_data.get("icon_path", "")
	if final_ico_path != "" and ResourceLoader.exists(final_ico_path):
		weapon_preview.texture = load(final_ico_path)

	SoundManager.play_sound("snd_level_up", 0.1, 0.0)
	is_spinning = false
	can_take_weapon = true
	_update_prompt()

	# Give 8 seconds to pick up before it disappears
	await get_tree().create_timer(8.0).timeout
	if can_take_weapon:
		can_take_weapon = false
		weapon_preview.visible = false
		_update_prompt()

@rpc("any_peer", "call_local", "reliable")
func net_weapon_taken() -> void:
	can_take_weapon = false
	weapon_preview.visible = false
	_update_prompt()

func _take_weapon() -> void:
	if not player_in_range or not can_take_weapon:
		return
	
	if player_in_range.has_method("acquire_weapon"):
		player_in_range.acquire_weapon(current_rolled_weapon)
	else:
		player_in_range._equip_weapon(current_rolled_weapon)

	SoundManager.play_sound("snd_buy", 0.05, 0.0)
	
	if NetworkManager.is_multiplayer_active():
		net_weapon_taken.rpc()
	else:
		net_weapon_taken()

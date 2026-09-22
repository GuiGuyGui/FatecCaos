@tool
extends Node2D
class_name WeaponWallBuy

@export var weapon_id: String = "shotgun":
	set(val):
		weapon_id = val
		_update_sprite()

@export var cost: int = 1200
@export var ammo_cost: int = 600

var player_in_range: Player = null
var weapon_data: Dictionary
var anim_timer: float = 0.0

@onready var icon_sprite: Sprite2D = get_node_or_null("IconSprite")
@onready var prompt_label: Label = get_node_or_null("PromptLabel")
@onready var interact_area: Area2D = get_node_or_null("InteractArea")

func _ready() -> void:
	_update_sprite()
	# Randomize phase so not all weapons float and spin in identical sync
	anim_timer = randf_range(0.0, 6.28)
	
	if not Engine.is_editor_hint():
		if prompt_label:
			prompt_label.visible = false
		if is_instance_valid(WeaponDatabase):
			weapon_data = WeaponDatabase.get_weapon(weapon_id)
			cost = weapon_data.get("cost", cost)
			ammo_cost = int(cost * 0.5)
		if interact_area:
			interact_area.body_entered.connect(_on_body_entered)
			interact_area.body_exited.connect(_on_body_exited)

func _update_sprite() -> void:
	if not icon_sprite:
		icon_sprite = get_node_or_null("IconSprite")
	if not icon_sprite:
		return
		
	var ico_map = {
		"handgun": "res://assets/sprites/weapons/spr_handgun_ico/spr_handgun_ico.png",
		"desert_eagle": "res://assets/sprites/ui/spr_desert_ico/spr_desert_ico.png",
		"shotgun": "res://assets/sprites/weapons/spr_shotgun_ico/spr_shotgun_ico.png",
		"db_shotgun": "res://assets/sprites/ui/spr_db_ico/spr_db_ico.png",
		"auto_shotgun": "res://assets/sprites/weapons/spr_auto_shotgun_ico/spr_auto_shotgun_ico.png",
		"mp5k": "res://assets/sprites/weapons/spr_mp5k_ico/spr_mp5k_ico.png",
		"machinegun": "res://assets/sprites/ui/spr_mp_ico/spr_mp_ico.png",
		"ak47": "res://assets/sprites/weapons/spr_ak_ico/spr_ak_ico.png",
		"famas": "res://assets/sprites/weapons/spr_famas_ico/spr_famas_ico.png",
		"aug": "res://assets/sprites/ui/spr_AUG_ico/spr_AUG_ico.png",
		"rifle": "res://assets/sprites/weapons/spr_rifle_ico/spr_rifle_ico.png",
		"awp": "res://assets/sprites/weapons/spr_awp_ico/spr_awp_ico.png",
		"m60": "res://assets/sprites/ui/spr_m60_ico/spr_m60_ico.png",
		"heavygun": "res://assets/sprites/weapons/spr_heavygun_ico/spr_heavygun_ico.png",
		"chainsaw": "res://assets/sprites/ui/spr_saw_ico/spr_saw_ico.png",
		"katana": "res://assets/sprites/ui/spr_katana_ico/spr_katana_ico.png",
		"crossbow": "res://assets/sprites/ui/spr_crossbow_ico/spr_crossbow_ico.png",
		"rpg": "res://assets/sprites/ui/spr_rpg_ico/spr_rpg_ico.png",
		"flamethrower": "res://assets/sprites/weapons/spr_flamer_ico/spr_flamer_ico.png",
		"raygun": "res://assets/sprites/weapons/spr_handgun_ico/spr_handgun_ico.png"
	}
	
	var ico_path = ico_map.get(weapon_id, "")
	if ico_path != "" and ResourceLoader.exists(ico_path):
		icon_sprite.texture = load(ico_path)

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
		if icon_sprite:
			# Floating gently up and down
			icon_sprite.position.y = sin(anim_timer * 2.8) * 5.0
			# 3D spinning / perspective flip effect
			icon_sprite.scale.x = cos(anim_timer * 2.2)
			# Subtle luminous pulse
			var glow = 0.85 + (sin(anim_timer * 3.5) * 0.15)
			icon_sprite.modulate = Color(1.1, 1.1, 1.25, glow)
			
	if Engine.is_editor_hint():
		return
	if not player_in_range:
		return
	if Input.is_action_just_pressed("interact"):
		_try_buy()

func _has_weapon() -> bool:
	if not player_in_range:
		return false
	if player_in_range.has_method("has_weapon_in_slots"):
		return player_in_range.has_weapon_in_slots(weapon_id)
	return player_in_range.primary_weapon == weapon_id or player_in_range.secondary_weapon == weapon_id

func _update_prompt() -> void:
	if _has_weapon():
		prompt_label.text = "[E] Comprar Munição ($ " + str(ammo_cost) + ")"
	else:
		prompt_label.text = "[E] " + weapon_data.get("name", "Arma") + " ($ " + str(cost) + ")"

func _try_buy() -> void:
	if _has_weapon():
		# Refill ammo
		if GameManager.money >= ammo_cost:
			GameManager.add_money(-ammo_cost)
			if player_in_range.has_method("refill_ammo_for_weapon"):
				player_in_range.refill_ammo_for_weapon(weapon_id)
			else:
				player_in_range.current_reserve = weapon_data.reserve_max
			SoundManager.play_sound("snd_buy", 0.05, 0.0)
			_update_prompt()
		else:
			SoundManager.play_sound("snd_button", 0.1, -6.0)
	else:
		# Buy new weapon
		if GameManager.money >= cost:
			GameManager.add_money(-cost)
			if player_in_range.has_method("acquire_weapon"):
				player_in_range.acquire_weapon(weapon_id)
			else:
				player_in_range._equip_weapon(weapon_id)
			
			SoundManager.play_sound("snd_buy", 0.05, 0.0)
			_update_prompt()
		else:
			SoundManager.play_sound("snd_button", 0.1, -6.0)

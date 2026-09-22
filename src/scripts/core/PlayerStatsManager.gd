extends Node

signal career_cash_changed(new_amount: int)
signal scrap_changed(new_amount: int)
signal stats_updated

var career_cash: int = 5000
var scrap_components: int = 25

var starting_primary: String = "handgun"
var starting_secondary: String = ""

var unlocked_weapons: Dictionary = {
	"handgun": true
}

var weapon_prices: Dictionary = {
	"handgun": 0,
	"shotgun": 1500,
	"desert_eagle": 1500,
	"db_shotgun": 2000,
	"auto_shotgun": 3500,
	"mp5k": 2500,
	"machinegun": 3000,
	"ak47": 4000,
	"famas": 4200,
	"rifle": 3800,
	"awp": 5000,
	"heavygun": 6500,
	"rpg": 7500,
	"flamethrower": 6000,
	"crossbow": 4500,
	"raygun": 10000
}

var craftable_accessories: Dictionary = {
	"kevlar_helmet": {"name": "🪖 Capacete Kevlar", "desc": "+10% Resistência a dano geral", "cost_scraps": 10, "icon": "🪖", "sprite": "res://assets/sprites/characters/spr_hair/spr_hair_1.png"},
	"gas_mask": {"name": "🎭 Máscara de Gás", "desc": "Imune a fumaça e fogo residual", "cost_scraps": 12, "icon": "🎭", "sprite": "res://assets/sprites/characters/spr_hair/spr_hair_5.png"},
	"sheriff_hat": {"name": "🤠 Chapéu do Xerife", "desc": "+15% Dano com Pistolas e Snipers", "cost_scraps": 8, "icon": "🤠", "sprite": "res://assets/sprites/characters/spr_hair/spr_hair_12.png"},
	"night_vision": {"name": "🕶️ Visão Noturna", "desc": "+50% Raio e alcance da lanterna", "cost_scraps": 15, "icon": "🕶️", "sprite": "res://assets/sprites/characters/spr_hair/spr_hair_18.png"},
	"ammo_backpack": {"name": "🎒 Mochila Tática", "desc": "+25% Capacidade de reserva de munição", "cost_scraps": 14, "icon": "🎒", "sprite": "res://assets/sprites/characters/spr_hair/spr_hair_22.png"},
	"steel_gloves": {"name": "🥊 Luvas de Aço", "desc": "+30% Dano no ataque corpo a corpo", "cost_scraps": 10, "icon": "🥊", "sprite": "res://assets/sprites/characters/spr_hair/spr_hair_26.png"},
	"tactical_vest": {"name": "🦺 Colete Pesado", "desc": "+30 HP Máximo base", "cost_scraps": 18, "icon": "🦺", "sprite": "res://assets/sprites/characters/spr_hair/spr_hair_30.png"},
	"legendary_crown": {"name": "👑 Coroa de Ouro", "desc": "+20% Dinheiro e XP ganhos nas partidas", "cost_scraps": 25, "icon": "👑", "sprite": "res://assets/sprites/characters/spr_hair/spr_hair_35.png"}
}

var unlocked_accessories: Dictionary = {}
var equipped_accessory: String = ""

var player_attributes: Dictionary = {
	# 1. Sobrevivência
	"health": {"lvl": 0, "max": 10, "name": "💖 Vitalidade Titânica", "desc": "+15 HP Máximo por nível", "base_cost": 300, "cost_step": 150},
	"health_regen": {"lvl": 0, "max": 10, "name": "💉 Regeneração Celular", "desc": "Regenera +1.0 HP/s passivamente", "base_cost": 400, "cost_step": 200},
	"damage_reduction": {"lvl": 0, "max": 10, "name": "🛡️ Blindagem Corpórea", "desc": "Reduz 3% de todo dano recebido", "base_cost": 450, "cost_step": 250},
	"bleed_resistance": {"lvl": 0, "max": 10, "name": "🧬 Pele Impenetrável", "desc": "+6% Resistência a mordidas de zumbis", "base_cost": 350, "cost_step": 180},
	"last_stand_heal": {"lvl": 0, "max": 5, "name": "❤️ Instinto de Sobrevivência", "desc": "Cura 25 HP ao ficar abaixo de 20% de vida", "base_cost": 800, "cost_step": 400},

	# 2. Mobilidade
	"speed": {"lvl": 0, "max": 10, "name": "⚡ Velocidade de Corrida", "desc": "+4% Velocidade de movimento por nível", "base_cost": 350, "cost_step": 200},
	"jump_height": {"lvl": 0, "max": 10, "name": "🦘 Impulso Atlético", "desc": "+5% Altura de pulo por nível", "base_cost": 300, "cost_step": 150},
	"dodge_chance": {"lvl": 0, "max": 10, "name": "🥋 Reflexos de Esquiva", "desc": "3% Chance de desviar completamente de golpes", "base_cost": 500, "cost_step": 300},
	"stamina_efficiency": {"lvl": 0, "max": 5, "name": "👟 Fôlego Inabalável", "desc": "Imune a lentidão de neve e ataques", "base_cost": 600, "cost_step": 350},
	"slide_mobility": {"lvl": 0, "max": 5, "name": "💨 Manobra Rápida", "desc": "+10% Aceleração ao mudar de direção", "base_cost": 400, "cost_step": 200},

	# 3. Maestria Balística
	"bullet_damage": {"lvl": 0, "max": 10, "name": "💥 Poder de Parada", "desc": "+6% Dano de todas as armas de fogo", "base_cost": 500, "cost_step": 250},
	"crit_multiplier": {"lvl": 0, "max": 10, "name": "🎯 Impacto Devastador", "desc": "+15% Dano crítico extra em Headshots", "base_cost": 600, "cost_step": 300},
	"fire_rate": {"lvl": 0, "max": 10, "name": "🔥 Dedo no Gatilho", "desc": "+5% Cadência de disparo em todas as armas", "base_cost": 550, "cost_step": 280},
	"reload": {"lvl": 0, "max": 10, "name": "🧤 Mãos Ágeis (Recarga)", "desc": "+6% Velocidade ao recarregar pentes", "base_cost": 450, "cost_step": 220},
	"recoil_control": {"lvl": 0, "max": 10, "name": "🦾 Empunhadura Firme", "desc": "-12% Recuo e tremor de câmera ao atirar", "base_cost": 350, "cost_step": 180},
	"bullet_velocity": {"lvl": 0, "max": 5, "name": "🚀 Alta Velocidade Balística", "desc": "+10% Velocidade dos projéteis", "base_cost": 400, "cost_step": 200},
	"hipfire_accuracy": {"lvl": 0, "max": 10, "name": "🔦 Mira Laser Integrada", "desc": "-12% Espalhamento (Spread) dos tiros", "base_cost": 400, "cost_step": 200},

	# 4. Combate Físico / Melee
	"melee": {"lvl": 0, "max": 10, "name": "🗡️ Força Corpo a Corpo", "desc": "+20% Dano na Faca / Katana por nível", "base_cost": 300, "cost_step": 150},
	"melee_range": {"lvl": 0, "max": 5, "name": "⚔️ Alcance do Golpe", "desc": "+10% Raio de alcance do golpe corpo a corpo", "base_cost": 400, "cost_step": 200},
	"melee_lifesteal": {"lvl": 0, "max": 5, "name": "🩸 Drenagem Sanguínea", "desc": "Cura +6 HP por cada abate corpo a corpo", "base_cost": 700, "cost_step": 350},
	"executioner_crit": {"lvl": 0, "max": 5, "name": "💀 Golpe Decapitador", "desc": "+10% Chance de decapitação instantânea melee", "base_cost": 650, "cost_step": 300},

	# 5. Equipamentos & Explosivos
	"explosive_damage": {"lvl": 0, "max": 10, "name": "💣 Carga de Demolição", "desc": "+12% Dano de Granadas, Molotovs e Minas", "base_cost": 450, "cost_step": 220},
	"explosive_radius": {"lvl": 0, "max": 5, "name": "🌐 Raio de Fragmentação", "desc": "+10% Área de efeito das explosões", "base_cost": 500, "cost_step": 250},
	"fire_burn_duration": {"lvl": 0, "max": 5, "name": "🔥 Chamas Eternas", "desc": "+1.5s Duração do fogo do Molotov no chão", "base_cost": 400, "cost_step": 200},
	"extra_grenades": {"lvl": 0, "max": 5, "name": "🎒 Cinturão de Granadas", "desc": "Inicia partidas com +1 Granada extra", "base_cost": 500, "cost_step": 300},
	"extra_mines": {"lvl": 0, "max": 5, "name": "💥 Engenheiro de Minas", "desc": "Inicia partidas com +1 Mina extra", "base_cost": 500, "cost_step": 300},

	# 6. Economia, Perks & Suporte
	"greed": {"lvl": 0, "max": 10, "name": "💰 Caçador de Recompensas", "desc": "+6% Dinheiro extra ganho por abate", "base_cost": 450, "cost_step": 250},
	"xp_multiplier": {"lvl": 0, "max": 10, "name": "⭐ Aprendiz Rápido", "desc": "+10% XP ganho por abate e ações", "base_cost": 400, "cost_step": 200},
	"perk_potency": {"lvl": 0, "max": 5, "name": "🥤 Metabolismo de Perks", "desc": "+15% Eficácia em todos os refrigerantes de Perks", "base_cost": 750, "cost_step": 350},
	"repair_efficiency": {"lvl": 0, "max": 5, "name": "🔨 Mestre Carpinteiro", "desc": "+$10 Dinheiro e +10 XP extras ao reparar barricadas", "base_cost": 350, "cost_step": 180},
	"mystery_box_luck": {"lvl": 0, "max": 5, "name": "🎲 Sorte Misteriosa", "desc": "-10% Custo da Caixa Misteriosa por nível", "base_cost": 600, "cost_step": 300},
	"ammo": {"lvl": 0, "max": 10, "name": "📦 Capacidade de Munição", "desc": "+10% Munição reserva máxima em todas as armas", "base_cost": 400, "cost_step": 200}
}

var weapon_upgrades: Dictionary = {}

func _ready() -> void:
	_load_stats()

func _load_stats() -> void:
	if FileAccess.file_exists("user://player_stats.json"):
		var f = FileAccess.open("user://player_stats.json", FileAccess.READ)
		if f:
			var res = JSON.parse_string(f.get_as_text())
			if typeof(res) == TYPE_DICTIONARY:
				career_cash = res.get("career_cash", 5000)
				scrap_components = res.get("scrap_components", 25)
				starting_primary = res.get("starting_primary", "handgun")
				starting_secondary = res.get("starting_secondary", "")
				unlocked_weapons = res.get("unlocked_weapons", {"handgun": true})
				if starting_secondary != "" and not unlocked_weapons.get(starting_secondary, false):
					starting_secondary = ""
				unlocked_accessories = res.get("unlocked_accessories", {})
				equipped_accessory = res.get("equipped_accessory", "")
				var attrs = res.get("player_attributes", {})
				for k in attrs:
					if player_attributes.has(k):
						player_attributes[k]["lvl"] = attrs[k]
				weapon_upgrades = res.get("weapon_upgrades", {})
			f.close()

func save_stats() -> void:
	var attrs_data = {}
	for k in player_attributes:
		attrs_data[k] = player_attributes[k]["lvl"]
	
	var data = {
		"career_cash": career_cash,
		"scrap_components": scrap_components,
		"starting_primary": starting_primary,
		"starting_secondary": starting_secondary,
		"unlocked_weapons": unlocked_weapons,
		"unlocked_accessories": unlocked_accessories,
		"equipped_accessory": equipped_accessory,
		"player_attributes": attrs_data,
		"weapon_upgrades": weapon_upgrades
	}
	var f = FileAccess.open("user://player_stats.json", FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(data, "\t"))
		f.close()
	stats_updated.emit()

func add_career_cash(amount: int) -> void:
	career_cash += amount
	career_cash_changed.emit(career_cash)
	save_stats()

func add_scrap(amount: int = 1) -> void:
	scrap_components += amount
	scrap_changed.emit(scrap_components)
	save_stats()

func craft_accessory(acc_id: String) -> bool:
	if not craftable_accessories.has(acc_id):
		return false
	var cost = craftable_accessories[acc_id]["cost_scraps"]
	if scrap_components >= cost and not unlocked_accessories.get(acc_id, false):
		scrap_components -= cost
		unlocked_accessories[acc_id] = true
		equipped_accessory = acc_id
		scrap_changed.emit(scrap_components)
		save_stats()
		SoundManager.play_sound("snd_build", 0.08, 2.0)
		return true
	SoundManager.play_sound("snd_button", 0.1, -6.0)
	return false

func toggle_equip_accessory(acc_id: String) -> void:
	if equipped_accessory == acc_id:
		equipped_accessory = ""
	else:
		equipped_accessory = acc_id
	save_stats()
	SoundManager.play_sound("snd_button", 0.05, 2.0)

func buy_weapon(wpn_id: String) -> bool:
	if unlocked_weapons.get(wpn_id, false):
		return true
	var price = weapon_prices.get(wpn_id, 3000)
	if career_cash >= price:
		career_cash -= price
		unlocked_weapons[wpn_id] = true
		career_cash_changed.emit(career_cash)
		save_stats()
		SoundManager.play_sound("snd_buy", 0.05, 0.0)
		return true
	SoundManager.play_sound("snd_button", 0.1, -6.0)
	return false

func set_starting_loadout(wpn_id: String, is_primary: bool) -> void:
	if not unlocked_weapons.get(wpn_id, false):
		return
	if is_primary:
		starting_primary = wpn_id
	else:
		starting_secondary = wpn_id
	save_stats()
	SoundManager.play_sound("snd_button", 0.05, 3.0)

func get_attribute_cost(attr_id: String) -> int:
	if not player_attributes.has(attr_id):
		return 999999
	var def = player_attributes[attr_id]
	var lvl = def["lvl"]
	return def["base_cost"] + (lvl * def["cost_step"])

func upgrade_attribute(attr_id: String) -> bool:
	if not player_attributes.has(attr_id):
		return false
	var def = player_attributes[attr_id]
	if def["lvl"] >= def["max"]:
		return false
	
	var cost = get_attribute_cost(attr_id)
	if career_cash >= cost:
		career_cash -= cost
		def["lvl"] += 1
		career_cash_changed.emit(career_cash)
		save_stats()
		SoundManager.play_sound("snd_buy", 0.05, 0.0)
		return true
	
	SoundManager.play_sound("snd_button", 0.1, -6.0)
	return false

# Specific Getters for Gameplay Systems
func get_health_bonus() -> float:
	var b = float(player_attributes.get("health", {}).get("lvl", 0) * 15.0)
	if equipped_accessory == "tactical_vest":
		b += 30.0
	return b

func get_health_regen_bonus() -> float:
	return float(player_attributes.get("health_regen", {}).get("lvl", 0) * 1.0)

func get_damage_reduction_bonus() -> float:
	var b = float(player_attributes.get("damage_reduction", {}).get("lvl", 0) * 0.03)
	if equipped_accessory == "kevlar_helmet":
		b += 0.10
	return b

func get_bleed_resistance_bonus() -> float:
	return float(player_attributes.get("bleed_resistance", {}).get("lvl", 0) * 0.06)

func get_last_stand_heal_bonus() -> float:
	return float(player_attributes.get("last_stand_heal", {}).get("lvl", 0) * 25.0)

func get_speed_bonus() -> float:
	return float(player_attributes.get("speed", {}).get("lvl", 0) * 0.04)

func get_jump_height_bonus() -> float:
	return float(player_attributes.get("jump_height", {}).get("lvl", 0) * 0.05)

func get_dodge_chance() -> float:
	return float(player_attributes.get("dodge_chance", {}).get("lvl", 0) * 0.03)

func get_bullet_damage_bonus() -> float:
	return float(player_attributes.get("bullet_damage", {}).get("lvl", 0) * 0.06)

func get_crit_multiplier_bonus() -> float:
	return float(player_attributes.get("crit_multiplier", {}).get("lvl", 0) * 0.15)

func get_fire_rate_bonus() -> float:
	return float(player_attributes.get("fire_rate", {}).get("lvl", 0) * 0.05)

func get_reload_bonus() -> float:
	return float(player_attributes.get("reload", {}).get("lvl", 0) * 0.06)

func get_recoil_control_bonus() -> float:
	return float(player_attributes.get("recoil_control", {}).get("lvl", 0) * 0.12)

func get_bullet_velocity_bonus() -> float:
	return float(player_attributes.get("bullet_velocity", {}).get("lvl", 0) * 0.10)

func get_hipfire_accuracy_bonus() -> float:
	return float(player_attributes.get("hipfire_accuracy", {}).get("lvl", 0) * 0.12)

func get_melee_bonus() -> float:
	var b = float(player_attributes.get("melee", {}).get("lvl", 0) * 0.20)
	if equipped_accessory == "steel_gloves":
		b += 0.30
	return b

func get_melee_range_bonus() -> float:
	return float(player_attributes.get("melee_range", {}).get("lvl", 0) * 0.10)

func get_melee_lifesteal() -> float:
	return float(player_attributes.get("melee_lifesteal", {}).get("lvl", 0) * 6.0)

func get_executioner_crit_chance() -> float:
	return float(player_attributes.get("executioner_crit", {}).get("lvl", 0) * 0.10)

func get_explosive_damage_bonus() -> float:
	return float(player_attributes.get("explosive_damage", {}).get("lvl", 0) * 0.12)

func get_explosive_radius_bonus() -> float:
	return float(player_attributes.get("explosive_radius", {}).get("lvl", 0) * 0.10)

func get_fire_burn_duration_bonus() -> float:
	return float(player_attributes.get("fire_burn_duration", {}).get("lvl", 0) * 1.5)

func get_extra_grenades() -> int:
	return int(player_attributes.get("extra_grenades", {}).get("lvl", 0))

func get_extra_mines() -> int:
	return int(player_attributes.get("extra_mines", {}).get("lvl", 0))

func get_greed_bonus() -> float:
	var b = float(player_attributes.get("greed", {}).get("lvl", 0) * 0.06)
	if equipped_accessory == "legendary_crown":
		b += 0.20
	return b

func get_xp_multiplier() -> float:
	var b = float(1.0 + (player_attributes.get("xp_multiplier", {}).get("lvl", 0) * 0.10))
	if equipped_accessory == "legendary_crown":
		b += 0.20
	return b

func get_perk_potency() -> float:
	return float(1.0 + (player_attributes.get("perk_potency", {}).get("lvl", 0) * 0.15))

func get_repair_bonus() -> int:
	return int(player_attributes.get("repair_efficiency", {}).get("lvl", 0) * 10)

func get_mystery_box_discount() -> float:
	return float(player_attributes.get("mystery_box_luck", {}).get("lvl", 0) * 0.10)

func get_ammo_bonus() -> float:
	var b = float(player_attributes.get("ammo", {}).get("lvl", 0) * 0.10)
	if equipped_accessory == "ammo_backpack":
		b += 0.25
	return b

# Weapon Upgrades
func get_weapon_upgrade_level(weapon_id: String, stat: String) -> int:
	if not weapon_upgrades.has(weapon_id):
		return 0
	return weapon_upgrades[weapon_id].get(stat, 0)

func get_weapon_upgrade_cost(weapon_id: String, stat: String) -> int:
	var lvl = get_weapon_upgrade_level(weapon_id, stat)
	return 350 + (lvl * 250)

func upgrade_weapon_stat(weapon_id: String, stat: String) -> bool:
	var lvl = get_weapon_upgrade_level(weapon_id, stat)
	if lvl >= 5:
		return false
	
	var cost = get_weapon_upgrade_cost(weapon_id, stat)
	if career_cash >= cost:
		career_cash -= cost
		if not weapon_upgrades.has(weapon_id):
			weapon_upgrades[weapon_id] = {}
		weapon_upgrades[weapon_id][stat] = lvl + 1
		career_cash_changed.emit(career_cash)
		save_stats()
		SoundManager.play_sound("snd_buy", 0.05, 0.0)
		return true
	
	SoundManager.play_sound("snd_button", 0.1, -6.0)
	return false

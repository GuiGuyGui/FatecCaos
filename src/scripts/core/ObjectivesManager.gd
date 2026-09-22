extends Node

# ObjectivesManager - Tactical In-Game Mission & Quests Controller
# Provides rotating objectives with real-time HUD progress, sound announcements, and cash/XP payouts.

signal objective_updated(obj_data: Dictionary)
signal objective_completed(obj_data: Dictionary)

var objectives_pool: Array[Dictionary] = [
	{
		"id": "turn_on_power",
		"icon": "⚡",
		"title": "Restaurar Energia Central",
		"description": "Ligue a força geral no Gerador de Energia",
		"target": 1,
		"current": 0,
		"reward_cash": 500,
		"reward_xp": 100
	},
	{
		"id": "open_door",
		"icon": "🚪",
		"title": "Explorar o Hospital",
		"description": "Abra uma porta trancada do mapa",
		"target": 1,
		"current": 0,
		"reward_cash": 400,
		"reward_xp": 80
	},
	{
		"id": "headshots",
		"icon": "🎯",
		"title": "Precisão Mortal",
		"description": "Elimine 10 Zumbis com Tiro na Cabeça",
		"target": 10,
		"current": 0,
		"reward_cash": 600,
		"reward_xp": 150
	},
	{
		"id": "repair_barricades",
		"icon": "🔨",
		"title": "Engenheiro de Campo",
		"description": "Conserte 5 Tábuas de Barricada nas janelas",
		"target": 5,
		"current": 0,
		"reward_cash": 450,
		"reward_xp": 120
	},
	{
		"id": "mystery_box",
		"icon": "📦",
		"title": "Giro da Sorte",
		"description": "Compre uma arma na Caixa Misteriosa",
		"target": 1,
		"current": 0,
		"reward_cash": 500,
		"reward_xp": 100
	},
	{
		"id": "kill_boss",
		"icon": "👹",
		"title": "Caçador de Titãs",
		"description": "Derrote o Boss Tank da Onda 5",
		"target": 1,
		"current": 0,
		"reward_cash": 1500,
		"reward_xp": 350
	},
	{
		"id": "trap_kills",
		"icon": "⚡",
		"title": "Armadilhas Mortais",
		"description": "Elimine 5 Zumbis usando as armadilhas do mapa",
		"target": 5,
		"current": 0,
		"reward_cash": 700,
		"reward_xp": 180
	},
	{
		"id": "upgrade_weapon",
		"icon": "🛠️",
		"title": "Poder de Fogo Máximo",
		"description": "Aprimore uma arma na Máquina de Melhorias",
		"target": 1,
		"current": 0,
		"reward_cash": 1000,
		"reward_xp": 250
	},
	{
		"id": "explosive_kills",
		"icon": "💣",
		"title": "Demolição Pesada",
		"description": "Elimine 10 Zumbis com granadas ou lança-foguetes",
		"target": 10,
		"current": 0,
		"reward_cash": 800,
		"reward_xp": 200
	}
]

var active_objective: Dictionary = {}
var current_objective_index: int = 0
var completed_count: int = 0

func _ready() -> void:
	reset_objectives()

func reset_objectives() -> void:
	current_objective_index = 0
	completed_count = 0
	_setup_current_objective()

func _setup_current_objective() -> void:
	if current_objective_index < objectives_pool.size():
		active_objective = objectives_pool[current_objective_index].duplicate(true)
		active_objective["current"] = 0
		active_objective["is_completed"] = false
		objective_updated.emit(active_objective)
	else:
		# Rotating dynamic random missions when main quest chain finishes
		var rand_obj = objectives_pool[randi() % objectives_pool.size()].duplicate(true)
		rand_obj["current"] = 0
		rand_obj["is_completed"] = false
		rand_obj["target"] = int(rand_obj["target"] * 1.5)
		rand_obj["reward_cash"] = int(rand_obj["reward_cash"] * 1.5)
		active_objective = rand_obj
		objective_updated.emit(active_objective)

func report_progress(obj_id: String, amount: int = 1) -> void:
	if active_objective.is_empty() or active_objective.get("is_completed", false):
		return
	
	if active_objective.get("id", "") == obj_id:
		active_objective["current"] = min(active_objective["target"], active_objective["current"] + amount)
		objective_updated.emit(active_objective)
		
		if active_objective["current"] >= active_objective["target"]:
			_complete_objective()

func _complete_objective() -> void:
	active_objective["is_completed"] = true
	completed_count += 1
	
	var reward_cash = active_objective.get("reward_cash", 500)
	var reward_xp = active_objective.get("reward_xp", 100)
	
	GameManager.add_money(reward_cash)
	PlayerStatsManager.add_career_cash(reward_cash)
	
	# Award XP to current player
	var players = get_tree().get_nodes_in_group("players")
	for p in players:
		if p is Player and is_instance_valid(p):
			var xp_mult = PlayerStatsManager.get_xp_multiplier()
			p.add_xp(reward_xp * xp_mult)
	
	SoundManager.play_sound("snd_level_up", 0.1, 2.0)
	var fanfare_voices = ["snd_P_loveit", "snd_P_legendary", "snd_P_bd_entertained"]
	SoundManager.play_sound(fanfare_voices[randi() % fanfare_voices.size()], 0.0, 1.8)
	
	objective_completed.emit(active_objective)
	
	# Wait 4.5s and start the next tactical objective
	await get_tree().create_timer(4.5).timeout
	current_objective_index += 1
	_setup_current_objective()

func get_active_objective() -> Dictionary:
	return active_objective

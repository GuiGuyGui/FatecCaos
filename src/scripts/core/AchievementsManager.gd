extends Node

signal achievement_unlocked(title: String, description: String, icon_name: String)

var unlocked_achievements: Dictionary = {}

var achievements_def: Dictionary = {
	"first_blood": {
		"title": "Primeiro Sangue",
		"desc": "Elimine seu primeiro zumbi.",
		"icon": "💀"
	},
	"headshot_sniper": {
		"title": "Sniper de Elite",
		"desc": "Elimine 25 zumbis com Headshots precisos.",
		"icon": "🎯"
	},
	"wave_survivor": {
		"title": "Sobrevivente Implacável",
		"desc": "Sobreviva até a Rodada 10.",
		"icon": "🛡️"
	},
	"pack_a_punch": {
		"title": "Mestre do Arsenal",
		"desc": "Aprimore uma arma na Máquina de Upgrade.",
		"icon": "★"
	},
	"perk_addict": {
		"title": "Doador de Sangue",
		"desc": "Beba 4 refrigerantes de Perks na mesma partida.",
		"icon": "🥤"
	},
	"fire_starter": {
		"title": "Chuva de Fogo",
		"desc": "Arremesse um Coquetel Molotov na horda.",
		"icon": "🔥"
	},
	"boss_slayer": {
		"title": "Matador de Titãs",
		"desc": "Derrote o Tank Boss.",
		"icon": "👑"
	}
}

func _ready() -> void:
	_load_achievements()

func _load_achievements() -> void:
	if FileAccess.file_exists("user://achievements.json"):
		var f = FileAccess.open("user://achievements.json", FileAccess.READ)
		if f:
			var res = JSON.parse_string(f.get_as_text())
			if typeof(res) == TYPE_DICTIONARY:
				unlocked_achievements = res
			f.close()

func _save_achievements() -> void:
	var f = FileAccess.open("user://achievements.json", FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(unlocked_achievements, "\t"))
		f.close()

func unlock(achievement_id: String) -> void:
	if unlocked_achievements.has(achievement_id) and unlocked_achievements[achievement_id]:
		return
	
	if achievements_def.has(achievement_id):
		unlocked_achievements[achievement_id] = true
		_save_achievements()
		var def = achievements_def[achievement_id]
		achievement_unlocked.emit(def["title"], def["desc"], def["icon"])
		SoundManager.play_sound("snd_P_legendary", 0.0, 2.0)

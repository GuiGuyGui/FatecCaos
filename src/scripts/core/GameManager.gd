extends Node

signal wave_started(wave_number: int)
signal round_started(round_number: int)
signal wave_completed(wave_number: int)
signal money_changed(new_money: int)
signal score_changed(new_score: int)
signal player_died(player_id: int)
signal game_over
signal powerup_status_changed(powerup_name: String, is_active: bool)
signal combo_updated(combo_count: int, combo_title: String, bonus_score: int, bonus_cash: int)
signal combo_ended
signal kills_stats_changed(total_kills: int, headshots: int, wave: int, remaining: int)
signal power_turned_on
signal endless_horde_triggered
signal sos_timer_updated(time_left: float)
signal game_won

var is_endless_horde: bool = false
var is_sos_active: bool = false
var sos_time_left: float = 60.0
var is_game_won: bool = false
var current_wave: int = 1
var current_round: int:
	get:
		return current_wave
	set(val):
		current_wave = val

var wave_in_progress: bool = false
var zombies_remaining: int = 0
var zombies_to_spawn: int = 0
var money: int = 500
var score: int = 0

# Match Statistics
var total_kills: int = 0
var headshot_kills: int = 0
var melee_kills: int = 0
var explosive_kills: int = 0
var boss_kills: int = 0
var total_shots_fired: int = 0
var total_shots_hit: int = 0
var total_cash_earned: int = 0
var current_combo: int = 0
var highest_combo: int = 0
var combo_timer: float = 0.0
const COMBO_WINDOW: float = 3.2

# Lifetime Career Records
var high_score: int = 0
var highest_wave: int = 1
var lifetime_kills: int = 0
var lifetime_headshots: int = 0
var lifetime_melee_kills: int = 0
var lifetime_explosive_kills: int = 0
var lifetime_boss_kills: int = 0
var lifetime_highest_combo: int = 0

var active_players: Dictionary = {}

var is_double_points: bool = false
var is_insta_kill: bool = false
var is_invulnerable: bool = false
var is_infinite_ammo: bool = false
var is_freeze: bool = false
var is_fire_bullets: bool = false
var is_speed_boost: bool = false
var is_power_on: bool = false

func _ready() -> void:
	_load_persistent_stats()

func _process(delta: float) -> void:
	if combo_timer > 0.0:
		combo_timer -= delta
		if combo_timer <= 0.0:
			if current_combo >= 2:
				combo_ended.emit()
			current_combo = 0

	if is_sos_active and not is_game_won:
		sos_time_left -= delta
		sos_timer_updated.emit(sos_time_left)
		if sos_time_left <= 0.0:
			sos_time_left = 0.0
			win_game()

func reset_game() -> void:
	current_wave = 1
	wave_in_progress = false
	zombies_remaining = 0
	zombies_to_spawn = 0
	money = 500
	score = 0
	is_endless_horde = false
	is_sos_active = false
	sos_time_left = 60.0
	is_game_won = false
	total_kills = 0
	headshot_kills = 0
	melee_kills = 0
	explosive_kills = 0
	boss_kills = 0
	total_shots_fired = 0
	total_shots_hit = 0
	total_cash_earned = 500
	current_combo = 0
	highest_combo = 0
	combo_timer = 0.0
	is_double_points = false
	is_insta_kill = false
	is_invulnerable = false
	is_infinite_ammo = false
	is_freeze = false
	is_fire_bullets = false
	is_speed_boost = false
	is_power_on = false
	active_players.clear()
	if is_instance_valid(ObjectivesManager):
		ObjectivesManager.reset_objectives()

func _load_persistent_stats() -> void:
	if FileAccess.file_exists("user://stats.json"):
		var f = FileAccess.open("user://stats.json", FileAccess.READ)
		if f:
			var res = JSON.parse_string(f.get_as_text())
			if typeof(res) == TYPE_DICTIONARY:
				high_score = res.get("high_score", 0)
				highest_wave = res.get("highest_wave", 1)
				lifetime_kills = res.get("lifetime_kills", 0)
				lifetime_headshots = res.get("lifetime_headshots", 0)
				lifetime_melee_kills = res.get("lifetime_melee_kills", 0)
				lifetime_explosive_kills = res.get("lifetime_explosive_kills", 0)
				lifetime_boss_kills = res.get("lifetime_boss_kills", 0)
				lifetime_highest_combo = res.get("lifetime_highest_combo", 0)
			f.close()

func save_persistent_stats() -> void:
	if score > high_score:
		high_score = score
	if current_wave > highest_wave:
		highest_wave = current_wave
	if highest_combo > lifetime_highest_combo:
		lifetime_highest_combo = highest_combo

	lifetime_kills += total_kills
	lifetime_headshots += headshot_kills
	lifetime_melee_kills += melee_kills
	lifetime_explosive_kills += explosive_kills
	lifetime_boss_kills += boss_kills
	
	var data = {
		"high_score": high_score,
		"highest_wave": highest_wave,
		"lifetime_kills": lifetime_kills,
		"lifetime_headshots": lifetime_headshots,
		"lifetime_melee_kills": lifetime_melee_kills,
		"lifetime_explosive_kills": lifetime_explosive_kills,
		"lifetime_boss_kills": lifetime_boss_kills,
		"lifetime_highest_combo": lifetime_highest_combo
	}
	var f = FileAccess.open("user://stats.json", FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(data, "\t"))
		f.close()

func activate_double_points(duration: float = 30.0) -> void:
	is_double_points = true
	powerup_status_changed.emit("double_points", true)
	await get_tree().create_timer(duration).timeout
	is_double_points = false
	powerup_status_changed.emit("double_points", false)

func activate_insta_kill(duration: float = 30.0) -> void:
	is_insta_kill = true
	powerup_status_changed.emit("insta_kill", true)
	await get_tree().create_timer(duration).timeout
	is_insta_kill = false
	powerup_status_changed.emit("insta_kill", false)

func activate_invulnerability(duration: float = 25.0) -> void:
	is_invulnerable = true
	powerup_status_changed.emit("invulnerability", true)
	await get_tree().create_timer(duration).timeout
	is_invulnerable = false
	powerup_status_changed.emit("invulnerability", false)

func activate_infinite_ammo(duration: float = 25.0) -> void:
	is_infinite_ammo = true
	powerup_status_changed.emit("infinite_ammo", true)
	await get_tree().create_timer(duration).timeout
	is_infinite_ammo = false
	powerup_status_changed.emit("infinite_ammo", false)

func activate_freeze(duration: float = 15.0) -> void:
	is_freeze = true
	powerup_status_changed.emit("freeze", true)
	await get_tree().create_timer(duration).timeout
	is_freeze = false
	powerup_status_changed.emit("freeze", false)

func activate_fire_bullets(duration: float = 25.0) -> void:
	is_fire_bullets = true
	powerup_status_changed.emit("fire_bullets", true)
	await get_tree().create_timer(duration).timeout
	is_fire_bullets = false
	powerup_status_changed.emit("fire_bullets", false)

func activate_speed_boost(duration: float = 25.0) -> void:
	is_speed_boost = true
	powerup_status_changed.emit("speed_boost", true)
	await get_tree().create_timer(duration).timeout
	is_speed_boost = false
	powerup_status_changed.emit("speed_boost", false)

func activate_nuke() -> void:
	add_money(400)
	SoundManager.play_sound("snd_P_bw_bigbadaboom", 0.0, 1.5)
	
	# Full-screen white explosion flash
	var flash_layer = CanvasLayer.new()
	flash_layer.layer = 100
	var flash_rect = ColorRect.new()
	flash_rect.color = Color(1.0, 1.0, 1.0, 0.9)
	flash_rect.set_anchors_preset(Control.PRESET_FULL_RECT)
	flash_layer.add_child(flash_rect)
	get_tree().current_scene.add_child(flash_layer)
	
	var tw = flash_rect.create_tween()
	tw.tween_property(flash_rect, "modulate:a", 0.0, 0.75)
	tw.tween_callback(flash_layer.queue_free)

	var players = get_tree().get_nodes_in_group("players")
	for p in players:
		if p is Player and p.is_local_player:
			p._shake_camera(12.0)
			
	var zombies = get_tree().get_nodes_in_group("zombies")
	for z in zombies:
		if is_instance_valid(z) and not z.get("is_dead"):
			if z is BossZombie:
				z.take_damage_hit(2000.0, Vector2.ZERO, z.global_position)
			elif z is Zombie:
				z.die(true, Vector2(randf_range(-100, 100), -200), "torso", "explosive")

func activate_max_ammo() -> void:
	SoundManager.play_sound("snd_BG_reload", 0.0, 1.0)
	SoundManager.play_sound("snd_P_bw_guns", 0.0, 1.5)
	var players = get_tree().get_nodes_in_group("players")
	for p in players:
		if p is Player:
			p.refill_all_ammo()

func activate_carpenter() -> void:
	add_money(200)
	SoundManager.play_sound("snd_button", 0.0, 2.0)
	var barricades = get_tree().get_nodes_in_group("barricades")
	for b in barricades:
		if is_instance_valid(b) and b.has_method("repair"):
			while b.current_planks < b.max_planks:
				b.repair()

func add_money(amount: int) -> void:
	money += amount
	if amount > 0:
		total_cash_earned += amount
	money_changed.emit(money)

func spend_money(amount: int) -> bool:
	if money >= amount:
		money -= amount
		money_changed.emit(money)
		SoundManager.play_sound("snd_buy")
		return true
	return false

func add_score(amount: int) -> void:
	score += amount
	if score > high_score:
		high_score = score
	score_changed.emit(score)

func start_next_wave() -> void:
	wave_in_progress = true
	# Analyze active player count (supports up to 10 players)
	var player_count = 1
	var players = get_tree().get_nodes_in_group("players")
	if players.size() > 0:
		player_count = players.size()
	elif NetworkManager.is_multiplayer_active():
		player_count = max(1, NetworkManager.players.size())

	# Progressive formula scaling per wave and strictly per player:
	# Wave 1: 15 per player (15 for 1p, 30 for 2p, 45 for 3p, up to 10 players)
	# Wave 2+: increases progressively each wave (+4.5 base + exponential curve)
	var zombies_per_player = 15 + int((current_wave - 1) * 4.5 + pow(current_wave - 1, 1.22) * 1.8)
	zombies_to_spawn = zombies_per_player * player_count
	
	# Boss wave scaling & Audio
	if current_wave % 5 == 0:
		var boss_count = max(1, int(ceil(player_count / 3.0)))
		zombies_to_spawn += boss_count
		SoundManager.play_sound("snd_tank_scream", 0.0, 3.0)
		SoundManager.play_music("snd_boss")
	else:
		SoundManager.play_sound("snd_warning", 0.0, 1.2)
		var v_idx = ((current_wave - 1) % 4) + 1
		await get_tree().create_timer(0.6).timeout
		SoundManager.play_sound("snd_P_round" + str(v_idx), 0.0, 2.0)

	zombies_remaining = zombies_to_spawn
	wave_started.emit(current_wave)
	round_started.emit(current_wave)
	kills_stats_changed.emit(total_kills, headshot_kills, current_wave, zombies_remaining)

func zombie_killed(points: int = 50, cash: int = 30, was_headshot: bool = false, kill_type: String = "bullet") -> void:
	if is_double_points:
		points *= 2
		cash *= 2
	var greed_mult = 1.0 + PlayerStatsManager.get_greed_bonus()
	var final_cash = int(cash * greed_mult)
	add_score(points)
	add_money(final_cash)
	PlayerStatsManager.add_career_cash(final_cash)
	
	total_kills += 1
	if was_headshot:
		headshot_kills += 1
		ObjectivesManager.report_progress("headshots", 1)
	if kill_type == "melee":
		melee_kills += 1
	elif kill_type == "explosive":
		explosive_kills += 1
		ObjectivesManager.report_progress("explosive_kills", 1)
	elif kill_type == "boss":
		boss_kills += 1
		ObjectivesManager.report_progress("kill_boss", 1)

	# Combo multi-kill system
	current_combo += 1
	combo_timer = COMBO_WINDOW
	if current_combo > highest_combo:
		highest_combo = current_combo

	var bonus_score = 0
	var bonus_cash = 0
	var combo_title = ""

	if current_combo == 2:
		combo_title = "DOUBLE KILL!"
		bonus_score = 50
		bonus_cash = 15
	elif current_combo == 3:
		combo_title = "TRIPLE KILL!"
		bonus_score = 100
		bonus_cash = 30
	elif current_combo == 5:
		combo_title = "MULTI KILL!"
		bonus_score = 200
		bonus_cash = 60
	elif current_combo == 8:
		combo_title = "ULTRA KILL!"
		bonus_score = 350
		bonus_cash = 100
		SoundManager.play_sound("snd_P_loveit", 0.0, 1.5)
	elif current_combo == 12:
		combo_title = "MONSTER KILL!"
		bonus_score = 500
		bonus_cash = 180
		SoundManager.play_sound("snd_P_legendary", 0.0, 2.0)
	elif current_combo == 16:
		combo_title = "LUDICROUS KILL!"
		bonus_score = 800
		bonus_cash = 300
		SoundManager.play_sound("snd_P_p_doom", 0.0, 2.0)
	elif current_combo >= 20 and current_combo % 5 == 0:
		combo_title = "HOLY SHIT! (" + str(current_combo) + "x)"
		bonus_score = 1200
		bonus_cash = 500
		SoundManager.play_sound("snd_P_holyshit", 0.0, 3.0)

	if combo_title != "":
		add_score(bonus_score)
		add_money(bonus_cash)
		combo_updated.emit(current_combo, combo_title, bonus_score, bonus_cash)

	# Achievement checks
	if total_kills >= 1:
		AchievementsManager.unlock("first_blood")
	if headshot_kills >= 25:
		AchievementsManager.unlock("headshot_sniper")
	if current_wave >= 10:
		AchievementsManager.unlock("wave_survivor")

	zombies_remaining = max(0, zombies_remaining - 1)
	kills_stats_changed.emit(total_kills, headshot_kills, current_wave, zombies_remaining)

	_check_wave_completion()

func trigger_endless_horde() -> void:
	if is_endless_horde:
		return
	is_endless_horde = true
	is_sos_active = true
	sos_time_left = 60.0
	wave_in_progress = true
	zombies_to_spawn = 999999
	zombies_remaining = 999999
	endless_horde_triggered.emit()
	SoundManager.play_music("snd_boss", 0.0)
	
	# Smash all security doors across the building so the horde rushes freely
	var all_doors = get_tree().get_nodes_in_group("doors")
	for d in all_doors:
		if is_instance_valid(d) and d.has_method("force_smash_door"):
			d.force_smash_door()
	
	var spawners = get_tree().get_nodes_in_group("wave_spawners")
	for s in spawners:
		if s.has_method("start_infinite_horde"):
			s.start_infinite_horde()

func win_game() -> void:
	if is_game_won:
		return
	is_game_won = true
	is_sos_active = false
	is_endless_horde = false
	wave_in_progress = false
	save_persistent_stats()
	AchievementsManager.unlock("wave_survivor")
	SoundManager.play_sound("snd_P_round4", 0.0, 2.0)
	game_won.emit()

func are_all_enemies_dead() -> bool:
	var zombies = get_tree().get_nodes_in_group("zombies")
	for z in zombies:
		if is_instance_valid(z) and not z.is_queued_for_deletion():
			if "is_dead" in z and not z.is_dead:
				return false
	var bosses = get_tree().get_nodes_in_group("bosses")
	for b in bosses:
		if is_instance_valid(b) and not b.is_queued_for_deletion():
			if "is_dead" in b and not b.is_dead:
				return false
	return true

func _check_wave_completion() -> void:
	if is_endless_horde:
		return
	if not wave_in_progress:
		return
	if zombies_remaining > 0:
		return
	if not are_all_enemies_dead():
		return
		
	wave_in_progress = false
	wave_completed.emit(current_wave)
	current_wave += 1
	
	var bd_voices = ["snd_P_bd_entertained", "snd_P_bd_havinfun", "snd_P_bd_nice_day"]
	SoundManager.play_sound(bd_voices[randi() % bd_voices.size()], 0.0, 1.5)
	
	await get_tree().create_timer(7.0).timeout
	start_next_wave()

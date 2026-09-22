extends CanvasLayer

# Top-Left HUD
@onready var hp_bar: ProgressBar = $TopLeft/HealthBar
@onready var lvl_label: Label = $TopLeft/HealthBar/LvlLabel
@onready var xp_bar: ProgressBar = $TopLeft/XPBar
@onready var kills_label: Label = get_node_or_null("TopLeft/StatsHBox/KillsPanel/KillsLabel")
@onready var headshots_label: Label = get_node_or_null("TopLeft/StatsHBox/HeadshotPanel/HeadshotsLabel")
@onready var remaining_zombies_label: Label = get_node_or_null("TopLeft/StatsHBox/WaveZombiesPanel/RemainingZombiesLabel")

# Top-Center Boss Bar & Level Up
@onready var boss_container: VBoxContainer = $TopCenter/BossContainer
@onready var boss_health_bar: ProgressBar = $TopCenter/BossContainer/BossHealthBar
@onready var level_up_banner: Label = $LevelUpBanner

# Multi-Kill Combo
@onready var combo_container: VBoxContainer = get_node_or_null("ComboContainer")
@onready var combo_title_label: Label = get_node_or_null("ComboContainer/ComboTitleLabel")
@onready var combo_bonus_label: Label = get_node_or_null("ComboContainer/ComboBonusLabel")
@onready var combo_timer_bar: ProgressBar = get_node_or_null("ComboContainer/ComboTimerBar")

# Center Round Banner Announcement
@onready var round_banner: VBoxContainer = get_node_or_null("RoundAnnouncementBanner")
@onready var round_banner_title: Label = get_node_or_null("RoundAnnouncementBanner/Title")
@onready var round_banner_subtitle: Label = get_node_or_null("RoundAnnouncementBanner/Subtitle")

# Bottom Bar
@onready var perks_row: HBoxContainer = get_node_or_null("BottomBar/PerksRow")
@onready var active_powerups_row: HBoxContainer = get_node_or_null("BottomBar/ActivePowerUps")
@onready var grenade_label: Label = get_node_or_null("BottomBar/EquipmentPanel/EquipmentHBox/GrenadeLabel")
@onready var molotov_label: Label = get_node_or_null("BottomBar/EquipmentPanel/EquipmentHBox/MolotovLabel")
@onready var landmine_label: Label = get_node_or_null("BottomBar/EquipmentPanel/EquipmentHBox/LandmineLabel")
@onready var flashlight_label: Label = get_node_or_null("BottomBar/EquipmentPanel/EquipmentHBox/FlashlightLabel")

# Top-Right HUD
@onready var round_label: Label = $TopRight/HudPanel/RoundLabel
@onready var money_label: Label = $TopRight/HudPanel/MoneyLabel
@onready var ammo_dots_label: Label = $TopRight/HudPanel/AmmoDotsLabel
@onready var ammo_num_label: Label = $TopRight/HudPanel/AmmoNumLabel

# Right-side slots
@onready var slot1_box: Panel = get_node_or_null("RightSlots/WeaponsRow/Slot1")
@onready var slot2_box: Panel = get_node_or_null("RightSlots/WeaponsRow/Slot2")
@onready var slot3_box: Panel = get_node_or_null("RightSlots/WeaponsRow/Slot3")
@onready var slot1_icon: TextureRect = get_node_or_null("RightSlots/WeaponsRow/Slot1/Icon")
@onready var slot2_icon: TextureRect = get_node_or_null("RightSlots/WeaponsRow/Slot2/Icon")
@onready var slot3_icon: TextureRect = get_node_or_null("RightSlots/WeaponsRow/Slot3/Icon")

# Custom Crosshair
@onready var crosshair: Sprite2D = get_node_or_null("CustomCrosshair")

# Tactical Objectives Widget
@onready var objective_panel: Panel = get_node_or_null("ObjectivesWidget")
@onready var objective_title: Label = get_node_or_null("ObjectivesWidget/VBox/Title")
@onready var objective_reward: Label = get_node_or_null("ObjectivesWidget/VBox/HeaderHBox/RewardLabel")
@onready var objective_progress_bar: ProgressBar = get_node_or_null("ObjectivesWidget/VBox/ProgressHBox/ProgressBar")
@onready var objective_count_label: Label = get_node_or_null("ObjectivesWidget/VBox/ProgressHBox/CountLabel")

var local_player: Player = null
var active_boss: BossZombie = null

var perk_icon_map: Dictionary = {
	"juggernog": "res://assets/sprites/general/spr_perks/spr_perks_0.png",
	"speed_cola": "res://assets/sprites/general/spr_perks/spr_perks_1.png",
	"staminup": "res://assets/sprites/general/spr_perks/spr_perks_2.png",
	"double_tap": "res://assets/sprites/general/spr_perks/spr_perks_3.png",
	"quick_revive": "res://assets/sprites/general/spr_perks/spr_perks_4.png"
}

var powerup_icon_map: Dictionary = {
	"nuke": "res://assets/sprites/general/spr_powerups/spr_powerups_0.png",
	"max_ammo": "res://assets/sprites/general/spr_powerups/spr_powerups_1.png",
	"double_points": "res://assets/sprites/general/spr_powerups/spr_powerups_2.png",
	"insta_kill": "res://assets/sprites/general/spr_powerups/spr_powerups_3.png",
	"invulnerability": "res://assets/sprites/general/spr_powerups/spr_powerups_4.png",
	"infinite_ammo": "res://assets/sprites/general/spr_powerups/spr_powerups_5.png",
	"freeze": "res://assets/sprites/general/spr_powerups/spr_powerups_6.png",
	"carpenter": "res://assets/sprites/general/spr_powerups/spr_powerups_7.png",
	"speed_boost": "res://assets/sprites/general/spr_powerups/spr_powerups_8.png",
	"fire_bullets": "res://assets/sprites/general/spr_powerups/spr_powerups_9.png"
}

func _ready() -> void:
	GameManager.money_changed.connect(_on_money_changed)
	GameManager.wave_started.connect(_on_wave_started)
	GameManager.wave_completed.connect(_on_wave_completed)
	GameManager.powerup_status_changed.connect(_on_powerup_status_changed)
	GameManager.combo_updated.connect(_on_combo_updated)
	GameManager.combo_ended.connect(_on_combo_ended)
	GameManager.kills_stats_changed.connect(_on_kills_stats_changed)
	GameManager.endless_horde_triggered.connect(_on_endless_horde_triggered)
	GameManager.sos_timer_updated.connect(_on_sos_timer_updated)
	GameManager.game_won.connect(_on_game_won)
	AchievementsManager.achievement_unlocked.connect(_on_achievement_unlocked)
	
	if is_instance_valid(ObjectivesManager):
		ObjectivesManager.objective_updated.connect(_on_objective_updated)
		ObjectivesManager.objective_completed.connect(_on_objective_completed)
		_on_objective_updated(ObjectivesManager.get_active_objective())
	
	_on_money_changed(GameManager.money)
	_on_wave_started(GameManager.current_wave)
	_on_kills_stats_changed(GameManager.total_kills, GameManager.headshot_kills, GameManager.current_wave, GameManager.zombies_remaining)
	
	if combo_container:
		combo_container.visible = false

func _process(_delta: float) -> void:
	if crosshair and is_instance_valid(crosshair):
		crosshair.global_position = crosshair.get_global_mouse_position()

	# Update Combo Timer Bar smoothly
	if combo_container and combo_container.visible and combo_timer_bar:
		combo_timer_bar.value = GameManager.combo_timer

	if not local_player or not is_instance_valid(local_player):
		var players = get_tree().get_nodes_in_group("players")
		for p in players:
			if p is Player and p.is_local_player:
				local_player = p
				_connect_player(local_player)
				break

	if local_player and is_instance_valid(local_player):
		if hp_bar:
			hp_bar.max_value = local_player.max_health
			hp_bar.value = local_player.health
		if xp_bar:
			xp_bar.max_value = local_player.xp_to_next
			xp_bar.value = local_player.xp
		if lvl_label:
			lvl_label.text = "LVL: " + str(local_player.level)
		
		# Ammo display
		if ammo_dots_label:
			var dots = ""
			for i in range(min(10, local_player.current_mag)):
				dots += "•"
			ammo_dots_label.text = dots
		if ammo_num_label:
			ammo_num_label.text = str(local_player.current_mag) + " / " + str(local_player.current_reserve)

		# Equipment counters
		if grenade_label:
			grenade_label.text = "💣 [G] " + str(local_player.grenades_count)
		if molotov_label:
			molotov_label.text = "🔥 [F] " + str(local_player.molotov_count)
		if landmine_label:
			landmine_label.text = "💥 [B] " + str(local_player.landmines_count)
		if flashlight_label:
			flashlight_label.text = "🔦 [T] " + ("ON" if local_player.flashlight_enabled else "OFF")

		# Slot highlight & dynamic icon update for 3 slots
		var slots_boxes = [slot1_box, slot2_box, slot3_box]
		var slots_icons = [slot1_icon, slot2_icon, slot3_icon]
		for i in range(3):
			var s_box = slots_boxes[i]
			var s_ico = slots_icons[i]
			if s_box:
				if local_player.current_slot == (i + 1):
					s_box.modulate = Color(0.3, 1.0, 1.0, 1.0)
				else:
					s_box.modulate = Color(0.6, 0.6, 0.6, 0.7)
			if s_ico:
				var w_id = local_player.weapon_slots[i] if i < local_player.weapon_slots.size() else ""
				if w_id != "":
					var w_data = WeaponDatabase.get_weapon(w_id)
					var ico_path = w_data.get("icon_path", "")
					if ico_path != "" and ResourceLoader.exists(ico_path):
						s_ico.texture = load(ico_path)
						s_ico.visible = true
						s_ico.modulate.a = 1.0
					else:
						s_ico.visible = false
				else:
					s_ico.texture = null
					s_ico.visible = false

	_check_boss_status()

func _connect_player(player: Player) -> void:
	if not player.level_up.is_connected(_on_player_level_up):
		player.level_up.connect(_on_player_level_up)
	if not player.perks_updated.is_connected(_on_perks_updated):
		player.perks_updated.connect(_on_perks_updated)
	_on_perks_updated(player.perks)

func _on_perks_updated(perks_list: Array) -> void:
	if not perks_row:
		return
	for child in perks_row.get_children():
		child.queue_free()
	
	for perk_id in perks_list:
		var tex_path = perk_icon_map.get(perk_id, "")
		if tex_path != "" and ResourceLoader.exists(tex_path):
			var tr = TextureRect.new()
			tr.texture = load(tex_path)
			tr.custom_minimum_size = Vector2(18, 18)
			tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
			tr.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
			perks_row.add_child(tr)

func _on_player_level_up(new_lvl: int) -> void:
	if level_up_banner:
		level_up_banner.text = "★ LEVEL " + str(new_lvl) + "! ★"
		level_up_banner.visible = true
		level_up_banner.modulate.a = 1.0
		var tween = create_tween()
		tween.tween_property(level_up_banner, "scale", Vector2(1.2, 1.2), 0.2)
		tween.tween_property(level_up_banner, "scale", Vector2(1.0, 1.0), 0.2)
		tween.tween_interval(2.0)
		tween.tween_property(level_up_banner, "modulate:a", 0.0, 0.5)
		tween.tween_callback(func(): level_up_banner.visible = false)

func _on_kills_stats_changed(k: int, h: int, _wave: int, rem: int) -> void:
	if kills_label:
		kills_label.text = "💀 " + str(k)
	if headshots_label:
		headshots_label.text = "🎯 " + str(h)
	if remaining_zombies_label:
		remaining_zombies_label.text = "🧟 " + str(rem)

func _on_combo_updated(combo_count: int, combo_title: String, bonus_score: int, bonus_cash: int) -> void:
	if not combo_container:
		return
	combo_container.visible = true
	if combo_title_label:
		combo_title_label.text = combo_title
	if combo_bonus_label:
		combo_bonus_label.text = "+$" + str(bonus_cash) + " (+" + str(bonus_score) + " PTS)"
	if combo_timer_bar:
		combo_timer_bar.max_value = GameManager.COMBO_WINDOW
		combo_timer_bar.value = GameManager.COMBO_WINDOW

	# Punch scale effect
	var tw = create_tween()
	combo_container.scale = Vector2(1.25, 1.25)
	tw.tween_property(combo_container, "scale", Vector2(1.0, 1.0), 0.15)

func _on_combo_ended() -> void:
	if combo_container:
		var tw = create_tween()
		tw.tween_property(combo_container, "modulate:a", 0.0, 0.3)
		tw.tween_callback(func():
			combo_container.visible = false
			combo_container.modulate.a = 1.0
		)

func _check_boss_status() -> void:
	if not active_boss or not is_instance_valid(active_boss) or active_boss.is_dead:
		var bosses = get_tree().get_nodes_in_group("bosses")
		for b in bosses:
			if is_instance_valid(b) and b is BossZombie and not b.is_dead:
				active_boss = b
				boss_container.visible = true
				break
		if not active_boss or not is_instance_valid(active_boss) or active_boss.is_dead:
			if boss_container:
				boss_container.visible = false
			return

	if active_boss and is_instance_valid(active_boss):
		boss_container.visible = true
		boss_health_bar.max_value = active_boss.max_health
		boss_health_bar.value = active_boss.health

func _on_money_changed(val: int) -> void:
	if money_label:
		money_label.text = str(val)

func _on_endless_horde_triggered() -> void:
	if round_label:
		round_label.text = "HORDA INFINITA"
		round_label.modulate = Color(1.0, 0.2, 0.2)
	if remaining_zombies_label:
		remaining_zombies_label.text = "ZUMBIS: ∞"
		remaining_zombies_label.modulate = Color(1.0, 0.3, 0.3)
		
	if round_banner:
		round_banner.visible = true
		round_banner.modulate.a = 1.0
		round_banner.scale = Vector2(2.2, 2.2)
		if round_banner_title:
			round_banner_title.text = "🚨 ALERTA: HORDA INFINITA ATIVADA! 🚨"
			round_banner_title.add_theme_color_override("font_color", Color(1.0, 0.1, 0.1, 1.0))
		if round_banner_subtitle:
			round_banner_subtitle.text = "⚠️ Zumbis subindo de todos os andares para te eliminar! SOBREVIVA!"
			round_banner_subtitle.add_theme_color_override("font_color", Color(1.0, 0.8, 0.2, 1.0))
		
		var tween = create_tween().set_parallel(false)
		tween.tween_property(round_banner, "scale", Vector2(1.0, 1.0), 0.3).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tween.tween_interval(4.5)
		tween.tween_property(round_banner, "modulate:a", 0.0, 0.8)
		tween.tween_callback(func(): round_banner.visible = false)

var sos_container: PanelContainer = null
var sos_timer_label: Label = null
var sos_last_sec: int = -1

func _create_sos_widget() -> void:
	if sos_container and is_instance_valid(sos_container):
		return
	
	sos_container = PanelContainer.new()
	sos_container.custom_minimum_size = Vector2(260, 50)
	var vp_size = get_viewport().get_visible_rect().size if get_viewport() else Vector2(640, 360)
	sos_container.position = Vector2(vp_size.x * 0.5 - 130, 10)
	
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.08, 0.04, 0.04, 0.92)
	style.border_color = Color(1.0, 0.2, 0.2, 1.0)
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_right = 6
	style.corner_radius_bottom_left = 6
	sos_container.add_theme_stylebox_override("panel", style)
	
	var vbox = VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 2)
	
	sos_timer_label = Label.new()
	sos_timer_label.text = "🚁 RESGATE EM: 60s"
	sos_timer_label.add_theme_color_override("font_color", Color(1.0, 0.85, 0.2))
	sos_timer_label.add_theme_font_size_override("font_size", 14)
	sos_timer_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	
	var sub_label = Label.new()
	sub_label.text = "Sobreviva ao ataque maciço até a evacuação!"
	sub_label.add_theme_color_override("font_color", Color(0.9, 0.4, 0.4))
	sub_label.add_theme_font_size_override("font_size", 9)
	sub_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	
	vbox.add_child(sos_timer_label)
	vbox.add_child(sub_label)
	sos_container.add_child(vbox)
	add_child(sos_container)

func _on_sos_timer_updated(time_left: float) -> void:
	if not sos_container or not is_instance_valid(sos_container):
		_create_sos_widget()
	
	if sos_container:
		sos_container.visible = true
	
	var sec = int(ceil(time_left))
	if sos_timer_label:
		if sec <= 10:
			sos_timer_label.text = "🚨 RESGATE IMINENTE: " + str(sec) + "s 🚨"
			sos_timer_label.add_theme_color_override("font_color", Color(1.0, 0.2, 0.2))
			if sec != sos_last_sec:
				sos_last_sec = sec
				SoundManager.play_sound("snd_warning", 0.0, 1.2)
		else:
			sos_timer_label.text = "🚁 RESGATE EM: " + str(sec) + "s"
			sos_timer_label.add_theme_color_override("font_color", Color(1.0, 0.85, 0.2))

func _on_game_won() -> void:
	if sos_container and is_instance_valid(sos_container):
		sos_container.visible = false
		
	if round_banner:
		round_banner.visible = true
		round_banner.modulate.a = 1.0
		round_banner.scale = Vector2(2.4, 2.4)
		
		if round_banner_title:
			round_banner_title.text = "🏆 HELICÓPTERO DE RESGATE CHEGOU! 🚁"
			round_banner_title.add_theme_color_override("font_color", Color(0.2, 1.0, 0.4, 1.0))
		if round_banner_subtitle:
			round_banner_subtitle.text = "⭐ VOCÊ SOBREVIVEU À HORDA E ESCAPOU COM VIDA!"
			round_banner_subtitle.add_theme_color_override("font_color", Color(1.0, 0.9, 0.2, 1.0))
		
		var tween = create_tween().set_parallel(false)
		tween.tween_property(round_banner, "scale", Vector2(1.0, 1.0), 0.35).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tween.tween_interval(5.0)

func _on_wave_started(val: int) -> void:
	if GameManager.is_endless_horde:
		return
	if round_label:
		round_label.text = "ROUND " + str(val)

	if round_banner:
		round_banner.visible = true
		round_banner.modulate.a = 1.0
		round_banner.scale = Vector2(2.0, 2.0)
		
		if val % 5 == 0:
			if round_banner_title:
				round_banner_title.text = "👹 BOSS ROUND " + str(val) + " 👹"
				round_banner_title.add_theme_color_override("font_color", Color(1.0, 0.1, 0.1, 1.0))
			if round_banner_subtitle:
				round_banner_subtitle.text = "⚠️ O CHEFE MACACO TANK INVADIU A ÁREA! DESTRUA O BOSS!"
				round_banner_subtitle.add_theme_color_override("font_color", Color(1.0, 0.5, 0.1, 1.0))
		else:
			if round_banner_title:
				round_banner_title.text = "⚔️ ROUND " + str(val) + " ⚔️"
				round_banner_title.add_theme_color_override("font_color", Color(1.0, 0.25, 0.25, 1.0))
			if round_banner_subtitle:
				round_banner_subtitle.text = "🧟 " + str(GameManager.zombies_to_spawn) + " Zumbis se aproximando..."
				round_banner_subtitle.add_theme_color_override("font_color", Color(1.0, 0.85, 0.3, 1.0))
		
		var tween = create_tween().set_parallel(false)
		tween.tween_property(round_banner, "scale", Vector2(1.0, 1.0), 0.25).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tween.tween_interval(2.2)
		tween.tween_property(round_banner, "modulate:a", 0.0, 0.5)
		tween.tween_callback(func(): round_banner.visible = false)

func _on_wave_completed(val: int) -> void:
	if round_banner:
		round_banner.visible = true
		round_banner.modulate.a = 1.0
		round_banner.scale = Vector2(1.5, 1.5)
		
		if round_banner_title:
			round_banner_title.text = "✅ ROUND " + str(val) + " CONCLUÍDO!"
			round_banner_title.add_theme_color_override("font_color", Color(0.2, 1.0, 0.4, 1.0))
		if round_banner_subtitle:
			round_banner_subtitle.text = "⏱️ Próxima onda em 7s... Reabasteça e faça melhorias!"
			round_banner_subtitle.add_theme_color_override("font_color", Color(1.0, 0.9, 0.3, 1.0))
		
		var tween = create_tween().set_parallel(false)
		tween.tween_property(round_banner, "scale", Vector2(1.0, 1.0), 0.2).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tween.tween_interval(3.8)
		tween.tween_property(round_banner, "modulate:a", 0.0, 0.6)
		tween.tween_callback(func(): round_banner.visible = false)

func _on_powerup_status_changed(p_name: String, is_active: bool) -> void:
	if not active_powerups_row:
		return
	var node_name = "PU_" + p_name
	var existing = active_powerups_row.get_node_or_null(node_name)
	
	if is_active:
		if not existing:
			var tex_path = powerup_icon_map.get(p_name, "")
			if tex_path != "" and ResourceLoader.exists(tex_path):
				var tr = TextureRect.new()
				tr.name = node_name
				tr.texture = load(tex_path)
				tr.custom_minimum_size = Vector2(28, 28)
				tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
				tr.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
				
				# Gentle pulsating effect
				var tween = tr.create_tween().set_loops()
				tween.tween_property(tr, "scale", Vector2(1.15, 1.15), 0.5)
				tween.tween_property(tr, "scale", Vector2(1.0, 1.0), 0.5)
				
				active_powerups_row.add_child(tr)
	else:
		if existing:
			existing.queue_free()

func _on_achievement_unlocked(title: String, desc: String, icon: String) -> void:
	var toast = PanelContainer.new()
	toast.custom_minimum_size = Vector2(240, 45)
	var vp_size = get_viewport().get_visible_rect().size if get_viewport() else Vector2(640, 360)
	toast.position = Vector2(vp_size.x * 0.5 - 120, -50)
	
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.08, 0.1, 0.12, 0.95)
	style.border_color = Color(1.0, 0.8, 0.2, 1.0)
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_right = 6
	style.corner_radius_bottom_left = 6
	toast.add_theme_stylebox_override("panel", style)
	
	var vbox = VBoxContainer.new()
	var l_title = Label.new()
	l_title.text = icon + " CONQUISTA: " + title
	l_title.add_theme_color_override("font_color", Color(1.0, 0.85, 0.2))
	l_title.add_theme_font_size_override("font_size", 10)
	l_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	
	var l_desc = Label.new()
	l_desc.text = desc
	l_desc.add_theme_font_size_override("font_size", 9)
	l_desc.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	
	vbox.add_child(l_title)
	vbox.add_child(l_desc)
	toast.add_child(vbox)
	add_child(toast)
	
	# Slide in, pause, slide out
	var tw = create_tween()
	tw.tween_property(toast, "position:y", 15.0, 0.4).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tw.tween_interval(3.5)
	tw.tween_property(toast, "position:y", -60.0, 0.4).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_IN)
	tw.tween_callback(toast.queue_free)

func _on_objective_updated(obj_data: Dictionary) -> void:
	if not objective_panel or obj_data.is_empty():
		return
	if objective_title:
		objective_title.text = obj_data.get("icon", "🎯") + " " + obj_data.get("title", "")
	if objective_reward:
		objective_reward.text = "+$" + str(obj_data.get("reward_cash", 500))
	var target = max(1, obj_data.get("target", 1))
	var current = obj_data.get("current", 0)
	if objective_progress_bar:
		objective_progress_bar.max_value = target
		objective_progress_bar.value = current
	if objective_count_label:
		objective_count_label.text = str(current) + "/" + str(target)
	
	objective_panel.modulate = Color(1, 1, 1, 1)

func _on_objective_completed(obj_data: Dictionary) -> void:
	if not objective_panel:
		return
	if objective_title:
		objective_title.text = "🏆 OBJETIVO CONCLUÍDO!"
	if objective_count_label:
		objective_count_label.text = "COMPLETO"
	
	# Celebratory gold pulse tween
	var tween = create_tween().set_parallel(true)
	tween.tween_property(objective_panel, "scale", Vector2(1.08, 1.08), 0.25).set_trans(Tween.TRANS_BACK)
	tween.tween_property(objective_panel, "modulate", Color(1.5, 1.3, 0.4, 1.0), 0.25)
	
	await get_tree().create_timer(1.2).timeout
	if is_instance_valid(objective_panel):
		var reset_tween = create_tween().set_parallel(true)
		reset_tween.tween_property(objective_panel, "scale", Vector2(1.0, 1.0), 0.3)
		reset_tween.tween_property(objective_panel, "modulate", Color(1, 1, 1, 1), 0.3)

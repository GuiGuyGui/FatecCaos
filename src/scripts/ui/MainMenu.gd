extends Control
class_name MainMenu

# Panels
@onready var main_panel: Control = $MainPanel
@onready var lobby_panel: Control = $LobbyPanel
@onready var achievements_panel: Control = get_node_or_null("AchievementsPanel")
@onready var workbench_panel: Control = get_node_or_null("WorkbenchPanel")

# Main Panel Buttons & Map Selector
@onready var singleplayer_btn: Button = $MainPanel/MenuButtons/SingleplayerBtn
@onready var host_btn: Button = $MainPanel/MenuButtons/HostBtn
@onready var join_btn: Button = $MainPanel/MenuButtons/JoinBtn
@onready var workbench_btn: Button = get_node_or_null("MainPanel/MenuButtons/WorkbenchBtn")
@onready var achievements_btn: Button = get_node_or_null("MainPanel/MenuButtons/AchievementsBtn")
@onready var achievements_list: VBoxContainer = get_node_or_null("AchievementsPanel/ScrollContainer/AchievementsList")
@onready var back_achievements_btn: Button = get_node_or_null("AchievementsPanel/BackAchievementsBtn")
@onready var code_input: LineEdit = $MainPanel/JoinBox/CodeInput
@onready var join_confirm_btn: Button = $MainPanel/JoinBox/JoinConfirmBtn
@onready var join_box: Control = $MainPanel/JoinBox

# Player Hub / Workbench Header & Currency
@onready var career_cash_label: Label = get_node_or_null("WorkbenchPanel/HeaderBox/CurrenciesRow/CareerCashLabel")
@onready var scrap_label: Label = get_node_or_null("WorkbenchPanel/HeaderBox/CurrenciesRow/ScrapLabel")
@onready var player_tab_btn: Button = get_node_or_null("WorkbenchPanel/HeaderBox/TabButtons/PlayerTabBtn")
@onready var weaponry_tab_btn: Button = get_node_or_null("WorkbenchPanel/HeaderBox/TabButtons/WeaponryTabBtn")
@onready var weapon_tab_btn: Button = get_node_or_null("WorkbenchPanel/HeaderBox/TabButtons/WeaponTabBtn")
@onready var accessories_tab_btn: Button = get_node_or_null("WorkbenchPanel/HeaderBox/TabButtons/AccessoriesTabBtn")
@onready var appearance_tab_btn: Button = get_node_or_null("WorkbenchPanel/HeaderBox/TabButtons/AppearanceTabBtn")
@onready var stats_tab_btn: Button = get_node_or_null("WorkbenchPanel/HeaderBox/TabButtons/StatsTabBtn")
@onready var back_workbench_btn: Button = get_node_or_null("WorkbenchPanel/BackWorkbenchBtn")

# Hub Views
@onready var player_stats_view: ScrollContainer = get_node_or_null("WorkbenchPanel/PlayerStatsView")
@onready var attributes_list: VBoxContainer = get_node_or_null("WorkbenchPanel/PlayerStatsView/AttributesList")

@onready var weaponry_view: ScrollContainer = get_node_or_null("WorkbenchPanel/WeaponryView")
@onready var weaponry_list: VBoxContainer = get_node_or_null("WorkbenchPanel/WeaponryView/WeaponryList")

@onready var weapon_stats_view: Control = get_node_or_null("WorkbenchPanel/WeaponStatsView")
@onready var prev_wpn_btn: Button = get_node_or_null("WorkbenchPanel/WeaponStatsView/WeaponSelectorRow/PrevWpnBtn")
@onready var next_wpn_btn: Button = get_node_or_null("WorkbenchPanel/WeaponStatsView/WeaponSelectorRow/NextWpnBtn")
@onready var wpn_name_label: Label = get_node_or_null("WorkbenchPanel/WeaponStatsView/WeaponSelectorRow/WpnNameLabel")
@onready var wpn_icon: TextureRect = get_node_or_null("WorkbenchPanel/WeaponStatsView/WpnIcon")
@onready var wpn_upgrades_vbox: VBoxContainer = get_node_or_null("WorkbenchPanel/WeaponStatsView/WpnUpgradesVBox")

@onready var accessories_view: ScrollContainer = get_node_or_null("WorkbenchPanel/AccessoriesView")
@onready var accessories_list: VBoxContainer = get_node_or_null("WorkbenchPanel/AccessoriesView/AccessoriesList")

@onready var stats_view: ScrollContainer = get_node_or_null("WorkbenchPanel/StatsView")
@onready var stats_list: VBoxContainer = get_node_or_null("WorkbenchPanel/StatsView/StatsList")

@onready var appearance_view: Control = get_node_or_null("WorkbenchPanel/AppearanceView")
@onready var preview_body: Sprite2D = get_node_or_null("WorkbenchPanel/AppearanceView/PreviewBox/Body")
@onready var preview_pants: Sprite2D = get_node_or_null("WorkbenchPanel/AppearanceView/PreviewBox/Pants")
@onready var preview_torso: Sprite2D = get_node_or_null("WorkbenchPanel/AppearanceView/PreviewBox/Torso")
@onready var preview_hair: Sprite2D = get_node_or_null("WorkbenchPanel/AppearanceView/PreviewBox/Hair")
@onready var preview_accessory: Sprite2D = get_node_or_null("WorkbenchPanel/AppearanceView/PreviewBox/Accessory")
@onready var torso_prev_btn: Button = get_node_or_null("WorkbenchPanel/AppearanceView/ControlsVBox/TorsoControls/TorsoPrevBtn")
@onready var torso_next_btn: Button = get_node_or_null("WorkbenchPanel/AppearanceView/ControlsVBox/TorsoControls/TorsoNextBtn")
@onready var torso_label: Label = get_node_or_null("WorkbenchPanel/AppearanceView/ControlsVBox/TorsoControls/TorsoLabel")
@onready var hair_prev_btn: Button = get_node_or_null("WorkbenchPanel/AppearanceView/ControlsVBox/HairControls/PrevBtn")
@onready var hair_next_btn: Button = get_node_or_null("WorkbenchPanel/AppearanceView/ControlsVBox/HairControls/NextBtn")
@onready var hair_label: Label = get_node_or_null("WorkbenchPanel/AppearanceView/ControlsVBox/HairControls/Label")
@onready var equipped_acc_label: Label = get_node_or_null("WorkbenchPanel/AppearanceView/ControlsVBox/EquippedAccessoryLabel")

# Map Selector
@onready var map_prev_btn: Button = $MainPanel/MapSelector/PrevMapBtn
@onready var map_next_btn: Button = $MainPanel/MapSelector/NextMapBtn
@onready var map_label: Label = $MainPanel/MapSelector/MapLabel

# Lobby Panel
@onready var room_code_label: Label = $LobbyPanel/RoomCodeLabel
@onready var players_list: VBoxContainer = $LobbyPanel/PlayersList
@onready var start_game_btn: Button = $LobbyPanel/StartGameBtn
@onready var leave_lobby_btn: Button = $LobbyPanel/LeaveLobbyBtn

var selected_hair_idx: int = 0
var selected_torso_idx: int = 0
const MAX_HAIR: int = 46
const MAX_TORSO: int = 46

var workbench_weapon_ids = ["handgun", "desert_eagle", "shotgun", "db_shotgun", "auto_shotgun", "mp5k", "machinegun", "ak47", "famas", "rifle", "awp", "heavygun", "rpg", "flamethrower", "crossbow", "raygun"]
var cur_bench_wpn_idx: int = 0

var maps = [
	{"name": "🏫 Polivalente", "path": "res://scenes/maps/map_polivalente.tscn"}
]
var selected_map_idx: int = 0
var current_hub_tab: int = 0 # 0: attrs, 1: weaponry, 2: workbench, 3: accessories, 4: appearance

func _ready() -> void:
	SoundManager.play_music("snd_menu", 0.0)
	_load_profile()
	
	main_panel.visible = true
	lobby_panel.visible = false
	if achievements_panel:
		achievements_panel.visible = false
	if workbench_panel:
		workbench_panel.visible = false
	join_box.visible = false
	
	singleplayer_btn.pressed.connect(_on_singleplayer_pressed)
	host_btn.pressed.connect(_on_host_pressed)
	join_btn.pressed.connect(_on_join_pressed)
	
	if workbench_btn:
		workbench_btn.pressed.connect(_on_workbench_pressed)
	if achievements_btn:
		achievements_btn.pressed.connect(_on_achievements_pressed)
	if back_achievements_btn:
		back_achievements_btn.pressed.connect(_on_back_achievements)
	if back_workbench_btn:
		back_workbench_btn.pressed.connect(_on_back_workbench)

	# Hub Tab navigation
	if player_tab_btn:
		player_tab_btn.pressed.connect(func(): _switch_hub_tab(0))
	if weaponry_tab_btn:
		weaponry_tab_btn.pressed.connect(func(): _switch_hub_tab(1))
	if weapon_tab_btn:
		weapon_tab_btn.pressed.connect(func(): _switch_hub_tab(2))
	if accessories_tab_btn:
		accessories_tab_btn.pressed.connect(func(): _switch_hub_tab(3))
	if appearance_tab_btn:
		appearance_tab_btn.pressed.connect(func(): _switch_hub_tab(4))
	if stats_tab_btn:
		stats_tab_btn.pressed.connect(func(): _switch_hub_tab(5))

	if prev_wpn_btn:
		prev_wpn_btn.pressed.connect(_on_prev_bench_wpn)
	if next_wpn_btn:
		next_wpn_btn.pressed.connect(_on_next_bench_wpn)
	join_confirm_btn.pressed.connect(_on_join_confirm_pressed)
	
	map_prev_btn.pressed.connect(_on_map_prev)
	map_next_btn.pressed.connect(_on_map_next)
	
	start_game_btn.pressed.connect(_on_start_game_pressed)
	leave_lobby_btn.pressed.connect(_on_leave_lobby_pressed)
	
	if hair_prev_btn:
		hair_prev_btn.pressed.connect(_on_hair_prev)
	if hair_next_btn:
		hair_next_btn.pressed.connect(_on_hair_next)
	if torso_prev_btn:
		torso_prev_btn.pressed.connect(_on_torso_prev)
	if torso_next_btn:
		torso_next_btn.pressed.connect(_on_torso_next)
	
	NetworkManager.player_connected.connect(_on_network_player_update)
	NetworkManager.player_disconnected.connect(_on_network_player_update)
	
	_update_appearance_preview()
	_update_map_label()

func _update_map_label() -> void:
	map_label.text = maps[selected_map_idx]["name"]

func _on_map_prev() -> void:
	SoundManager.play_sound("snd_button", 0.05, 2.0)
	selected_map_idx = (selected_map_idx - 1 + maps.size()) % maps.size()
	_update_map_label()

func _on_map_next() -> void:
	SoundManager.play_sound("snd_button", 0.05, 2.0)
	selected_map_idx = (selected_map_idx + 1) % maps.size()
	_update_map_label()

func _on_singleplayer_pressed() -> void:
	SoundManager.play_sound("snd_button", 0.05, 0.0)
	get_tree().change_scene_to_file(maps[selected_map_idx]["path"])

func _on_host_pressed() -> void:
	SoundManager.play_sound("snd_button", 0.05, 0.0)
	var code = NetworkManager.host_game(7777, 10)
	main_panel.visible = false
	lobby_panel.visible = true
	room_code_label.text = "CÓDIGO DA SALA: " + code
	start_game_btn.visible = true
	_refresh_player_list()

func _on_join_pressed() -> void:
	SoundManager.play_sound("snd_button", 0.05, 0.0)
	join_box.visible = not join_box.visible

func _on_join_confirm_pressed() -> void:
	var code = code_input.text.strip_edges().to_upper()
	if code == "":
		return
	SoundManager.play_sound("snd_button", 0.05, 0.0)
	
	var ip = "127.0.0.1"
	var port = 7777
	if "." in code:
		ip = code
	
	var success = NetworkManager.join_game(ip, port)
	if success:
		main_panel.visible = false
		lobby_panel.visible = true
		room_code_label.text = "SALA: " + code
		start_game_btn.visible = false
		_refresh_player_list()

func _refresh_player_list() -> void:
	for c in players_list.get_children():
		c.queue_free()
	
	var host_lbl = Label.new()
	host_lbl.text = "• Jogador 1 (Host - Você) [PRONTO]"
	host_lbl.add_theme_color_override("font_color", Color(0.2, 1.0, 0.4, 1.0))
	players_list.add_child(host_lbl)
	
	for p_id in NetworkManager.connected_players:
		if p_id != multiplayer.get_unique_id():
			var p_lbl = Label.new()
			p_lbl.text = "• Jogador " + str(p_id) + " [CONECTADO]"
			p_lbl.add_theme_color_override("font_color", Color(1.0, 0.85, 0.2, 1.0))
			players_list.add_child(p_lbl)

func _on_network_player_update(_id: int) -> void:
	_refresh_player_list()

func _on_start_game_pressed() -> void:
	SoundManager.play_sound("snd_button", 0.05, 0.0)
	NetworkManager.start_network_game(maps[selected_map_idx]["path"])

func _on_leave_lobby_pressed() -> void:
	SoundManager.play_sound("snd_button", 0.05, 0.0)
	NetworkManager.close_connection()
	lobby_panel.visible = false
	main_panel.visible = true

func _on_achievements_pressed() -> void:
	SoundManager.play_sound("snd_button", 0.05, 0.0)
	main_panel.visible = false
	if achievements_panel:
		achievements_panel.visible = true
		_populate_achievements_list()

func _on_back_achievements() -> void:
	SoundManager.play_sound("snd_button", 0.05, 0.0)
	if achievements_panel:
		achievements_panel.visible = false
	main_panel.visible = true

func _populate_achievements_list() -> void:
	if not achievements_list:
		return
	for c in achievements_list.get_children():
		c.queue_free()

	for a_id in AchievementsManager.achievements_def:
		var def = AchievementsManager.achievements_def[a_id]
		var is_unlocked = AchievementsManager.unlocked_achievements.get(a_id, false)
		
		var panel = PanelContainer.new()
		var style = StyleBoxFlat.new()
		style.bg_color = Color(0.12, 0.14, 0.18, 0.9) if is_unlocked else Color(0.06, 0.06, 0.08, 0.8)
		style.border_color = Color(1.0, 0.85, 0.2, 1.0) if is_unlocked else Color(0.3, 0.3, 0.35, 0.6)
		style.border_width_left = 1
		style.border_width_top = 1
		style.border_width_right = 1
		style.border_width_bottom = 1
		style.corner_radius_top_left = 4
		style.corner_radius_top_right = 4
		style.corner_radius_bottom_right = 4
		style.corner_radius_bottom_left = 4
		panel.add_theme_stylebox_override("panel", style)
		
		var hbox = HBoxContainer.new()
		hbox.add_theme_constant_override("separation", 8)
		
		var icon_lbl = Label.new()
		icon_lbl.text = def["icon"] if is_unlocked else "🔒"
		icon_lbl.add_theme_font_size_override("font_size", 18)
		icon_lbl.custom_minimum_size = Vector2(28, 0)
		icon_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		icon_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		hbox.add_child(icon_lbl)
		
		var vbox = VBoxContainer.new()
		vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		
		var title_lbl = Label.new()
		title_lbl.text = def["title"]
		title_lbl.add_theme_color_override("font_color", Color(1.0, 0.9, 0.3, 1.0) if is_unlocked else Color(0.6, 0.6, 0.6, 0.9))
		title_lbl.add_theme_font_size_override("font_size", 11)
		
		var desc_lbl = Label.new()
		desc_lbl.text = def["desc"]
		desc_lbl.add_theme_color_override("font_color", Color(0.85, 0.85, 0.85, 1.0) if is_unlocked else Color(0.45, 0.45, 0.45, 0.7))
		desc_lbl.add_theme_font_size_override("font_size", 9)
		
		vbox.add_child(title_lbl)
		vbox.add_child(desc_lbl)
		hbox.add_child(vbox)
		
		var status_lbl = Label.new()
		status_lbl.text = "DESBLOQUEADO" if is_unlocked else "BLOQUEADO"
		status_lbl.add_theme_color_override("font_color", Color(0.3, 1.0, 0.4, 1.0) if is_unlocked else Color(0.5, 0.5, 0.5, 0.6))
		status_lbl.add_theme_font_size_override("font_size", 8)
		status_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		hbox.add_child(status_lbl)
		
		panel.add_child(hbox)
		achievements_list.add_child(panel)

# ==================== PLAYER HUB & WORKBENCH ====================

func _on_workbench_pressed() -> void:
	SoundManager.play_sound("snd_button", 0.05, 0.0)
	main_panel.visible = false
	if workbench_panel:
		workbench_panel.visible = true
		_update_hub_currencies()
		_switch_hub_tab(0)

func _on_back_workbench() -> void:
	SoundManager.play_sound("snd_button", 0.05, 0.0)
	_save_profile()
	PlayerStatsManager.save_stats()
	if workbench_panel:
		workbench_panel.visible = false
	main_panel.visible = true

func _update_hub_currencies() -> void:
	if career_cash_label:
		career_cash_label.text = "💰 DINHEIRO: $ " + str(PlayerStatsManager.career_cash)
	if scrap_label:
		scrap_label.text = "⚙️ SUCATAS: " + str(PlayerStatsManager.scrap_components)

func _switch_hub_tab(tab_idx: int) -> void:
	current_hub_tab = tab_idx
	SoundManager.play_sound("snd_button", 0.05, 2.0)
	
	if player_stats_view:
		player_stats_view.visible = (tab_idx == 0)
	if weaponry_view:
		weaponry_view.visible = (tab_idx == 1)
	if weapon_stats_view:
		weapon_stats_view.visible = (tab_idx == 2)
	if accessories_view:
		accessories_view.visible = (tab_idx == 3)
	if appearance_view:
		appearance_view.visible = (tab_idx == 4)
	if stats_view:
		stats_view.visible = (tab_idx == 5)

	match tab_idx:
		0:
			_populate_player_attributes()
		1:
			_populate_weaponry()
		2:
			_populate_weapon_workbench()
		3:
			_populate_accessories()
		4:
			_populate_appearance()
		5:
			_populate_career_stats()

# --- TAB 5: CAREER STATS ---
func _populate_career_stats() -> void:
	if not stats_list:
		return
	for c in stats_list.get_children():
		c.queue_free()

	_update_hub_currencies()

	var stats_data = [
		{"icon": "💀", "title": "Total de Zumbis Eliminados", "val": str(GameManager.lifetime_kills) + " mortes"},
		{"icon": "🎯", "title": "Tiros na Cabeça (Headshots)", "val": str(GameManager.lifetime_headshots)},
		{"icon": "🗡️", "title": "Abates Corpo a Corpo (Melee)", "val": str(GameManager.lifetime_melee_kills)},
		{"icon": "💣", "title": "Abates por Explosivos (Granadas/Minas/RPG)", "val": str(GameManager.lifetime_explosive_kills)},
		{"icon": "👹", "title": "Chefões Tank Boss Derrotados", "val": str(GameManager.lifetime_boss_kills)},
		{"icon": "⚡", "title": "Maior Combo Multi-Kill Histórico", "val": str(GameManager.lifetime_highest_combo) + "x Multi-Kill"},
		{"icon": "🏆", "title": "Maior Round Sobrevivido", "val": "Round " + str(GameManager.highest_wave)},
		{"icon": "👑", "title": "Recorde Histórico de Pontos", "val": str(GameManager.high_score) + " pts"},
		{"icon": "💰", "title": "Dinheiro de Carreira Disponível", "val": "$ " + str(PlayerStatsManager.career_cash)},
		{"icon": "⚙️", "title": "Componentes de Sucata Disponíveis", "val": str(PlayerStatsManager.scrap_components) + " sucatas"}
	]

	for st in stats_data:
		var panel = PanelContainer.new()
		var style = StyleBoxFlat.new()
		style.bg_color = Color(0.08, 0.1, 0.14, 0.85)
		style.border_color = Color(0.3, 0.5, 0.8, 0.6)
		style.border_width_left = 1
		style.border_width_top = 1
		style.border_width_right = 1
		style.border_width_bottom = 1
		style.corner_radius_top_left = 4
		style.corner_radius_top_right = 4
		style.corner_radius_bottom_right = 4
		style.corner_radius_bottom_left = 4
		panel.add_theme_stylebox_override("panel", style)

		var hbox = HBoxContainer.new()
		hbox.add_theme_constant_override("separation", 10)

		var ico_lbl = Label.new()
		ico_lbl.text = st["icon"]
		ico_lbl.custom_minimum_size = Vector2(25, 0)
		ico_lbl.add_theme_font_size_override("font_size", 14)
		ico_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		ico_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		hbox.add_child(ico_lbl)

		var title_lbl = Label.new()
		title_lbl.text = st["title"]
		title_lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		title_lbl.add_theme_color_override("font_color", Color(0.9, 0.9, 0.9, 1.0))
		title_lbl.add_theme_font_size_override("font_size", 10)
		hbox.add_child(title_lbl)

		var val_lbl = Label.new()
		val_lbl.text = st["val"]
		val_lbl.add_theme_color_override("font_color", Color(1.0, 0.85, 0.2, 1.0))
		val_lbl.add_theme_font_size_override("font_size", 10)
		hbox.add_child(val_lbl)

		panel.add_child(hbox)
		stats_list.add_child(panel)

# --- TAB 0: ATTRIBUTES & PERKS ---
func _populate_player_attributes() -> void:
	if not attributes_list:
		return
	for c in attributes_list.get_children():
		c.queue_free()

	_update_hub_currencies()

	for attr_id in PlayerStatsManager.player_attributes:
		var def = PlayerStatsManager.player_attributes[attr_id]
		var lvl = def["lvl"]
		var max_lvl = def["max"]
		var cost = PlayerStatsManager.get_attribute_cost(attr_id)
		
		var panel = PanelContainer.new()
		var style = StyleBoxFlat.new()
		style.bg_color = Color(0.08, 0.1, 0.14, 0.85)
		style.border_color = Color(0.2, 0.6, 0.9, 0.6)
		style.border_width_left = 1
		style.border_width_top = 1
		style.border_width_right = 1
		style.border_width_bottom = 1
		style.corner_radius_top_left = 4
		style.corner_radius_top_right = 4
		style.corner_radius_bottom_right = 4
		style.corner_radius_bottom_left = 4
		panel.add_theme_stylebox_override("panel", style)
		
		var hbox = HBoxContainer.new()
		hbox.add_theme_constant_override("separation", 10)
		
		var vbox = VBoxContainer.new()
		vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		
		var title_lbl = Label.new()
		title_lbl.text = def["name"] + " [Nível " + str(lvl) + "/" + str(max_lvl) + "]"
		title_lbl.add_theme_color_override("font_color", Color(1.0, 0.9, 0.3, 1.0))
		title_lbl.add_theme_font_size_override("font_size", 11)
		
		var desc_lbl = Label.new()
		desc_lbl.text = def["desc"]
		desc_lbl.add_theme_color_override("font_color", Color(0.8, 0.8, 0.8, 1.0))
		desc_lbl.add_theme_font_size_override("font_size", 9)
		
		vbox.add_child(title_lbl)
		vbox.add_child(desc_lbl)
		hbox.add_child(vbox)
		
		if lvl < max_lvl:
			var btn = Button.new()
			btn.text = "UPGRADE ($" + str(cost) + ")"
			btn.custom_minimum_size = Vector2(110, 24)
			btn.add_theme_font_size_override("font_size", 10)
			btn.pressed.connect(func():
				if PlayerStatsManager.upgrade_attribute(attr_id):
					_populate_player_attributes()
			)
			hbox.add_child(btn)
		else:
			var max_lbl = Label.new()
			max_lbl.text = "★ MÁXIMO"
			max_lbl.add_theme_color_override("font_color", Color(0.3, 1.0, 0.4, 1.0))
			max_lbl.add_theme_font_size_override("font_size", 10)
			hbox.add_child(max_lbl)
		
		panel.add_child(hbox)
		attributes_list.add_child(panel)

# --- TAB 1: WEAPONRY (ARSENAL) ---
func _populate_weaponry() -> void:
	if not weaponry_list:
		return
	for c in weaponry_list.get_children():
		c.queue_free()

	_update_hub_currencies()

	for wpn_id in workbench_weapon_ids:
		var wpn = WeaponDatabase.get_weapon(wpn_id)
		var is_unlocked = PlayerStatsManager.unlocked_weapons.get(wpn_id, false)
		var price = PlayerStatsManager.weapon_prices.get(wpn_id, 3000)
		var is_prim = (PlayerStatsManager.starting_primary == wpn_id)
		var is_sec = (PlayerStatsManager.starting_secondary == wpn_id)

		var panel = PanelContainer.new()
		var style = StyleBoxFlat.new()
		style.bg_color = Color(0.1, 0.12, 0.16, 0.9) if is_unlocked else Color(0.06, 0.06, 0.08, 0.8)
		style.border_color = Color(0.3, 0.8, 0.4, 0.8) if (is_prim or is_sec) else Color(0.3, 0.3, 0.4, 0.6)
		style.border_width_left = 1
		style.border_width_top = 1
		style.border_width_right = 1
		style.border_width_bottom = 1
		style.corner_radius_top_left = 4
		style.corner_radius_top_right = 4
		style.corner_radius_bottom_right = 4
		style.corner_radius_bottom_left = 4
		panel.add_theme_stylebox_override("panel", style)

		var hbox = HBoxContainer.new()
		hbox.add_theme_constant_override("separation", 8)

		var icon = TextureRect.new()
		icon.custom_minimum_size = Vector2(40, 30)
		icon.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		icon.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		var ico_p = wpn.get("icon_path", "")
		if ico_p != "" and ResourceLoader.exists(ico_p):
			icon.texture = load(ico_p)
		hbox.add_child(icon)

		var vbox = VBoxContainer.new()
		vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL

		var name_lbl = Label.new()
		var badge = ""
		if is_prim: badge = " [★ PRIMÁRIA]"
		elif is_sec: badge = " [★ SECUNDÁRIA]"
		name_lbl.text = wpn.get("name", wpn_id) + badge
		name_lbl.add_theme_color_override("font_color", Color(1.0, 0.9, 0.3, 1.0) if is_unlocked else Color(0.6, 0.6, 0.6, 0.9))
		name_lbl.add_theme_font_size_override("font_size", 11)

		var stats_lbl = Label.new()
		stats_lbl.text = "Dano: " + str(int(wpn.get("damage", 20))) + " | Pente: " + str(wpn.get("mag_size", 12)) + " | Cadência: " + str(wpn.get("fire_rate", 0.2)) + "s"
		stats_lbl.add_theme_color_override("font_color", Color(0.8, 0.8, 0.8, 1.0))
		stats_lbl.add_theme_font_size_override("font_size", 9)

		vbox.add_child(name_lbl)
		vbox.add_child(stats_lbl)
		hbox.add_child(vbox)

		if not is_unlocked:
			var buy_btn = Button.new()
			buy_btn.text = "COMPRAR ($" + str(price) + ")"
			buy_btn.custom_minimum_size = Vector2(110, 24)
			buy_btn.add_theme_font_size_override("font_size", 9)
			buy_btn.pressed.connect(func():
				if PlayerStatsManager.buy_weapon(wpn_id):
					_populate_weaponry()
			)
			hbox.add_child(buy_btn)
		else:
			var prim_btn = Button.new()
			prim_btn.text = "✓ PRIMÁRIA" if is_prim else "EQUIPAR 1"
			prim_btn.custom_minimum_size = Vector2(75, 24)
			prim_btn.add_theme_font_size_override("font_size", 9)
			prim_btn.pressed.connect(func():
				PlayerStatsManager.set_starting_loadout(wpn_id, true)
				_populate_weaponry()
			)
			hbox.add_child(prim_btn)

			var sec_btn = Button.new()
			sec_btn.text = "✓ SECUNDÁRIA" if is_sec else "EQUIPAR 2"
			sec_btn.custom_minimum_size = Vector2(85, 24)
			sec_btn.add_theme_font_size_override("font_size", 9)
			sec_btn.pressed.connect(func():
				PlayerStatsManager.set_starting_loadout(wpn_id, false)
				_populate_weaponry()
			)
			hbox.add_child(sec_btn)

		panel.add_child(hbox)
		weaponry_list.add_child(panel)

# --- TAB 2: WORKBENCH (BANCADA) ---
func _on_prev_bench_wpn() -> void:
	SoundManager.play_sound("snd_button", 0.05, 2.0)
	cur_bench_wpn_idx = (cur_bench_wpn_idx - 1 + workbench_weapon_ids.size()) % workbench_weapon_ids.size()
	_populate_weapon_workbench()

func _on_next_bench_wpn() -> void:
	SoundManager.play_sound("snd_button", 0.05, 2.0)
	cur_bench_wpn_idx = (cur_bench_wpn_idx + 1) % workbench_weapon_ids.size()
	_populate_weapon_workbench()

func _populate_weapon_workbench() -> void:
	_update_hub_currencies()
	var wpn_id = workbench_weapon_ids[cur_bench_wpn_idx]
	var wpn_data = WeaponDatabase.get_weapon(wpn_id)
	
	if wpn_name_label:
		wpn_name_label.text = wpn_data.get("name", wpn_id)
	
	if wpn_icon:
		var ico_path = wpn_data.get("icon_path", "")
		if ico_path != "" and ResourceLoader.exists(ico_path):
			wpn_icon.texture = load(ico_path)
	
	if not wpn_upgrades_vbox:
		return
	for c in wpn_upgrades_vbox.get_children():
		c.queue_free()

	var stats = [
		{"id": "damage", "name": "💥 Dano", "desc": "+8% Dano por nível"},
		{"id": "fire_rate", "name": "⚡ Cadência", "desc": "+6% Velocidade de tiro por nível"},
		{"id": "mag", "name": "📦 Capacidade", "desc": "+15% Pente e Reserva por nível"},
		{"id": "accuracy", "name": "🎯 Precisão", "desc": "-15% Recuo e Dispersão por nível"}
	]

	for st in stats:
		var s_id = st["id"]
		var lvl = PlayerStatsManager.get_weapon_upgrade_level(wpn_id, s_id)
		var cost = PlayerStatsManager.get_weapon_upgrade_cost(wpn_id, s_id)
		
		var row = HBoxContainer.new()
		row.add_theme_constant_override("separation", 8)
		
		var lbl = Label.new()
		lbl.text = st["name"] + " (Nv. " + str(lvl) + "/5)"
		lbl.custom_minimum_size = Vector2(130, 0)
		lbl.add_theme_font_size_override("font_size", 10)
		lbl.add_theme_color_override("font_color", Color(1.0, 0.9, 0.4, 1.0))
		row.add_child(lbl)
		
		if lvl < 5:
			var up_btn = Button.new()
			up_btn.text = "MELHORAR ($" + str(cost) + ")"
			up_btn.custom_minimum_size = Vector2(100, 20)
			up_btn.add_theme_font_size_override("font_size", 9)
			up_btn.pressed.connect(func():
				if PlayerStatsManager.upgrade_weapon_stat(wpn_id, s_id):
					_populate_weapon_workbench()
			)
			row.add_child(up_btn)
		else:
			var max_l = Label.new()
			max_l.text = "★ MÁXIMO"
			max_l.add_theme_color_override("font_color", Color(0.3, 1.0, 0.4, 1.0))
			max_l.add_theme_font_size_override("font_size", 9)
			row.add_child(max_l)
		
		wpn_upgrades_vbox.add_child(row)

# --- TAB 3: ACCESSORIES (CRAFTING COM SUCATAS) ---
func _populate_accessories() -> void:
	if not accessories_list:
		return
	for c in accessories_list.get_children():
		c.queue_free()

	_update_hub_currencies()

	for acc_id in PlayerStatsManager.craftable_accessories:
		var acc = PlayerStatsManager.craftable_accessories[acc_id]
		var is_unlocked = PlayerStatsManager.unlocked_accessories.get(acc_id, false)
		var is_equipped = (PlayerStatsManager.equipped_accessory == acc_id)
		var scrap_cost = acc.get("cost_scraps", 10)

		var panel = PanelContainer.new()
		var style = StyleBoxFlat.new()
		style.bg_color = Color(0.12, 0.1, 0.16, 0.9) if is_unlocked else Color(0.06, 0.06, 0.08, 0.8)
		style.border_color = Color(1.0, 0.85, 0.2, 0.9) if is_equipped else Color(0.4, 0.3, 0.5, 0.6)
		style.border_width_left = 1
		style.border_width_top = 1
		style.border_width_right = 1
		style.border_width_bottom = 1
		style.corner_radius_top_left = 4
		style.corner_radius_top_right = 4
		style.corner_radius_bottom_right = 4
		style.corner_radius_bottom_left = 4
		panel.add_theme_stylebox_override("panel", style)

		var hbox = HBoxContainer.new()
		hbox.add_theme_constant_override("separation", 10)

		var icon_lbl = Label.new()
		icon_lbl.text = acc.get("icon", "🎒")
		icon_lbl.add_theme_font_size_override("font_size", 16)
		icon_lbl.custom_minimum_size = Vector2(25, 0)
		icon_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		icon_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		hbox.add_child(icon_lbl)

		var vbox = VBoxContainer.new()
		vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL

		var name_lbl = Label.new()
		name_lbl.text = acc.get("name", acc_id) + (" [★ EQUIPADO]" if is_equipped else "")
		name_lbl.add_theme_color_override("font_color", Color(1.0, 0.85, 0.2, 1.0) if is_equipped else Color(0.9, 0.9, 0.9, 1.0))
		name_lbl.add_theme_font_size_override("font_size", 11)

		var desc_lbl = Label.new()
		desc_lbl.text = acc.get("desc", "")
		desc_lbl.add_theme_color_override("font_color", Color(0.75, 0.75, 0.75, 1.0))
		desc_lbl.add_theme_font_size_override("font_size", 9)

		vbox.add_child(name_lbl)
		vbox.add_child(desc_lbl)
		hbox.add_child(vbox)

		if not is_unlocked:
			var craft_btn = Button.new()
			craft_btn.text = "FORJAR (" + str(scrap_cost) + " ⚙️)"
			craft_btn.custom_minimum_size = Vector2(100, 24)
			craft_btn.add_theme_font_size_override("font_size", 9)
			craft_btn.pressed.connect(func():
				if PlayerStatsManager.craft_accessory(acc_id):
					_populate_accessories()
			)
			hbox.add_child(craft_btn)
		else:
			var equip_btn = Button.new()
			equip_btn.text = "DESEQUIPAR" if is_equipped else "EQUIPAR"
			equip_btn.custom_minimum_size = Vector2(90, 24)
			equip_btn.add_theme_font_size_override("font_size", 9)
			equip_btn.pressed.connect(func():
				PlayerStatsManager.toggle_equip_accessory(acc_id)
				_populate_accessories()
			)
			hbox.add_child(equip_btn)

		panel.add_child(hbox)
		accessories_list.add_child(panel)

# --- TAB 4: APARÊNCIA / CUSTOMIZAÇÃO ---
func _populate_appearance() -> void:
	_update_hub_currencies()
	_update_appearance_preview()

func _on_hair_prev() -> void:
	SoundManager.play_sound("snd_button", 0.05, 2.0)
	selected_hair_idx = (selected_hair_idx - 1 + (MAX_HAIR + 1)) % (MAX_HAIR + 1)
	_update_appearance_preview()

func _on_hair_next() -> void:
	SoundManager.play_sound("snd_button", 0.05, 2.0)
	selected_hair_idx = (selected_hair_idx + 1) % (MAX_HAIR + 1)
	_update_appearance_preview()

func _on_torso_prev() -> void:
	SoundManager.play_sound("snd_button", 0.05, 2.0)
	selected_torso_idx = (selected_torso_idx - 1 + (MAX_TORSO + 1)) % (MAX_TORSO + 1)
	_update_appearance_preview()

func _on_torso_next() -> void:
	SoundManager.play_sound("snd_button", 0.05, 2.0)
	selected_torso_idx = (selected_torso_idx + 1) % (MAX_TORSO + 1)
	_update_appearance_preview()

func _update_appearance_preview() -> void:
	if hair_label:
		hair_label.text = "CABELO / CHAPÉU: #" + str(selected_hair_idx)
	if torso_label:
		torso_label.text = "CAMISA / TORSO: #" + str(selected_torso_idx)
	
	if preview_hair:
		var hair_path = "res://assets/sprites/characters/spr_hair/spr_hair_" + str(selected_hair_idx) + ".png"
		if ResourceLoader.exists(hair_path):
			preview_hair.texture = load(hair_path)

	if preview_torso:
		var torso_path = "res://assets/sprites/characters/spr_player_torso/spr_player_torso_" + str(selected_torso_idx) + ".png"
		if ResourceLoader.exists(torso_path):
			preview_torso.texture = load(torso_path)

	if preview_accessory:
		if PlayerStatsManager.equipped_accessory != "" and PlayerStatsManager.craftable_accessories.has(PlayerStatsManager.equipped_accessory):
			var acc = PlayerStatsManager.craftable_accessories[PlayerStatsManager.equipped_accessory]
			var sp = acc.get("sprite", "")
			if sp != "" and ResourceLoader.exists(sp):
				preview_accessory.texture = load(sp)
				preview_accessory.visible = true
		else:
			preview_accessory.visible = false

	if equipped_acc_label:
		if PlayerStatsManager.equipped_accessory != "" and PlayerStatsManager.craftable_accessories.has(PlayerStatsManager.equipped_accessory):
			var acc = PlayerStatsManager.craftable_accessories[PlayerStatsManager.equipped_accessory]
			equipped_acc_label.text = "ACESSÓRIO ATUAL: " + acc.get("name", "")
		else:
			equipped_acc_label.text = "ACESSÓRIO ATUAL: NENHUM"

	_save_profile()

func _save_profile() -> void:
	var file = FileAccess.open("user://profile.json", FileAccess.WRITE)
	if file:
		var data = {
			"hair": selected_hair_idx,
			"torso": selected_torso_idx
		}
		file.store_string(JSON.stringify(data))
		file.close()

func _load_profile() -> void:
	if FileAccess.file_exists("user://profile.json"):
		var file = FileAccess.open("user://profile.json", FileAccess.READ)
		if file:
			var res = JSON.parse_string(file.get_as_text())
			if typeof(res) == TYPE_DICTIONARY:
				selected_hair_idx = res.get("hair", 0)
				selected_torso_idx = res.get("torso", 0)
			file.close()

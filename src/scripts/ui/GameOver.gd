extends CanvasLayer
class_name GameOverScreen

@onready var panel: Control = $Panel
@onready var rounds_label: Label = get_node_or_null("Panel/StatsBox/RoundsLabel")
@onready var kills_label: Label = get_node_or_null("Panel/StatsBox/KillsLabel")
@onready var headshots_label: Label = get_node_or_null("Panel/StatsBox/HeadshotsLabel")
@onready var melee_kills_label: Label = get_node_or_null("Panel/StatsBox/MeleeKillsLabel")
@onready var explosive_kills_label: Label = get_node_or_null("Panel/StatsBox/ExplosiveKillsLabel")
@onready var combo_label: Label = get_node_or_null("Panel/StatsBox/ComboLabel")
@onready var cash_label: Label = get_node_or_null("Panel/StatsBox/CashLabel")
@onready var score_label: Label = get_node_or_null("Panel/StatsBox/ScoreLabel")
@onready var high_score_label: Label = get_node_or_null("Panel/StatsBox/HighScoreLabel")
@onready var retry_btn: Button = get_node_or_null("Panel/ButtonRow/RetryBtn")
@onready var menu_btn: Button = get_node_or_null("Panel/ButtonRow/MenuBtn")

func _ready() -> void:
	visible = false
	GameManager.player_died.connect(_on_player_died)
	GameManager.game_won.connect(_on_game_won)
	if retry_btn:
		retry_btn.pressed.connect(_on_retry_pressed)
	if menu_btn:
		menu_btn.pressed.connect(_on_menu_pressed)

func _on_game_won() -> void:
	GameManager.save_persistent_stats()
	await get_tree().create_timer(1.2).timeout
	visible = true
	Engine.time_scale = 0.5
	
	if has_node("Panel/Title"):
		var title = $Panel/Title
		title.text = "🚁 RESGATE CONCLUÍDO - VITÓRIA! 🏆"
		title.add_theme_color_override("font_color", Color(0.2, 1.0, 0.4, 1.0))
		
	if panel:
		var panel_style = panel.get_theme_stylebox("panel")
		if panel_style is StyleBoxFlat:
			panel_style.border_color = Color(0.2, 1.0, 0.4, 1.0)
		
	if rounds_label:
		rounds_label.text = "🚁 MISSÃO CUMPRIDA: RESGATADO COM SUCESSO!"
	if kills_label:
		kills_label.text = "💀 ZUMBIS ELIMINADOS: " + str(GameManager.total_kills)
	if headshots_label:
		headshots_label.text = "🎯 TIROS NA CABEÇA (HEADSHOTS): " + str(GameManager.headshot_kills)
	if melee_kills_label:
		melee_kills_label.text = "🗡️ ABATES CORPO A CORPO: " + str(GameManager.melee_kills)
	if explosive_kills_label:
		explosive_kills_label.text = "💣 ABATES POR EXPLOSIVOS: " + str(GameManager.explosive_kills)
	if combo_label:
		combo_label.text = "⚡ MAIOR COMBO MULTI-KILL: " + str(GameManager.highest_combo) + "x"
	if cash_label:
		cash_label.text = "💰 DINHEIRO GANHO: $ " + str(GameManager.total_cash_earned)
	if score_label:
		score_label.text = "⭐ PONTUAÇÃO FINAL: " + str(GameManager.score)
	if high_score_label:
		high_score_label.text = "👑 RECORDE PESSOAL: " + str(GameManager.high_score)

func _on_player_died(_id: int) -> void:
	GameManager.save_persistent_stats()
	
	# Show game over screen with slow-mo effect
	await get_tree().create_timer(1.0).timeout
	visible = true
	Engine.time_scale = 0.5
	
	if rounds_label:
		rounds_label.text = "🏆 ROUNDS SOBREVIVIDOS: " + str(GameManager.current_wave)
	if kills_label:
		kills_label.text = "💀 ZUMBIS ELIMINADOS: " + str(GameManager.total_kills)
	if headshots_label:
		headshots_label.text = "🎯 TIROS NA CABEÇA (HEADSHOTS): " + str(GameManager.headshot_kills)
	if melee_kills_label:
		melee_kills_label.text = "🗡️ ABATES CORPO A CORPO: " + str(GameManager.melee_kills)
	if explosive_kills_label:
		explosive_kills_label.text = "💣 ABATES POR EXPLOSIVOS: " + str(GameManager.explosive_kills)
	if combo_label:
		combo_label.text = "⚡ MAIOR COMBO MULTI-KILL: " + str(GameManager.highest_combo) + "x"
	if cash_label:
		cash_label.text = "💰 DINHEIRO GANHO: $ " + str(GameManager.total_cash_earned)
	if score_label:
		score_label.text = "⭐ PONTUAÇÃO FINAL: " + str(GameManager.score)
	if high_score_label:
		high_score_label.text = "👑 RECORDE PESSOAL: " + str(GameManager.high_score)
	
	SoundManager.play_sound("snd_die", 0.0, 0.0)

func _on_retry_pressed() -> void:
	Engine.time_scale = 1.0
	GameManager.reset_game()
	get_tree().reload_current_scene()

func _on_menu_pressed() -> void:
	Engine.time_scale = 1.0
	GameManager.reset_game()
	get_tree().change_scene_to_file("res://scenes/ui/main_menu.tscn")

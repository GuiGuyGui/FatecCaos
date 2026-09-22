extends CanvasLayer
class_name PauseMenu

@onready var panel: Control = $Panel
@onready var resume_btn: Button = $Panel/ButtonBox/ResumeBtn
@onready var restart_btn: Button = $Panel/ButtonBox/RestartBtn
@onready var menu_btn: Button = $Panel/ButtonBox/MenuBtn

@onready var music_slider: HSlider = get_node_or_null("Panel/SettingsBox/MusicSlider")
@onready var sfx_slider: HSlider = get_node_or_null("Panel/SettingsBox/SfxSlider")
@onready var music_label: Label = get_node_or_null("Panel/SettingsBox/MusicLabel")
@onready var sfx_label: Label = get_node_or_null("Panel/SettingsBox/SfxLabel")
@onready var fullscreen_check: CheckBox = get_node_or_null("Panel/SettingsBox/FullscreenCheck")

func _ready() -> void:
	visible = false
	resume_btn.pressed.connect(_on_resume)
	restart_btn.pressed.connect(_on_restart)
	menu_btn.pressed.connect(_on_menu)

	if music_slider:
		music_slider.value = SoundManager.music_volume
		music_slider.value_changed.connect(_on_music_volume_changed)
	if sfx_slider:
		sfx_slider.value = SoundManager.sfx_volume
		sfx_slider.value_changed.connect(_on_sfx_volume_changed)
	if fullscreen_check:
		fullscreen_check.button_pressed = (DisplayServer.window_get_mode() == DisplayServer.WINDOW_MODE_FULLSCREEN)
		fullscreen_check.toggled.connect(_on_fullscreen_toggled)

func _on_music_volume_changed(val: float) -> void:
	SoundManager.set_music_volume(val)
	if music_label:
		music_label.text = "MÚSICA: " + str(int(val * 100)) + "%"

func _on_sfx_volume_changed(val: float) -> void:
	SoundManager.set_sfx_volume(val)
	if sfx_label:
		sfx_label.text = "EFEITOS SONOROS: " + str(int(val * 100)) + "%"

func _on_fullscreen_toggled(is_fullscreen: bool) -> void:
	if is_fullscreen:
		DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN)
	else:
		DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_WINDOWED)

func _input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_cancel") or (event is InputEventKey and event.pressed and event.keycode == KEY_ESCAPE):
		_toggle_pause()

func _toggle_pause() -> void:
	visible = not visible
	get_tree().paused = visible
	if visible:
		SoundManager.play_sound("snd_button", 0.05, 0.0)

func _on_resume() -> void:
	SoundManager.play_sound("snd_button", 0.05, 0.0)
	visible = false
	get_tree().paused = false

func _on_restart() -> void:
	SoundManager.play_sound("snd_button", 0.05, 0.0)
	get_tree().paused = false
	GameManager.reset_game()
	get_tree().reload_current_scene()

func _on_menu() -> void:
	SoundManager.play_sound("snd_button", 0.05, 0.0)
	get_tree().paused = false
	GameManager.reset_game()
	get_tree().change_scene_to_file("res://scenes/ui/main_menu.tscn")

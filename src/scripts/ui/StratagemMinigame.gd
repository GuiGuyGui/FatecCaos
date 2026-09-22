extends CanvasLayer
class_name StratagemMinigame

signal sequence_completed
signal minigame_cancelled

const ARROW_TEXTURES = {
	"up": preload("res://assets/sprites/ui/stratagem/arrow_up.png"),
	"down": preload("res://assets/sprites/ui/stratagem/arrow_down.png"),
	"left": preload("res://assets/sprites/ui/stratagem/arrow_left.png"),
	"right": preload("res://assets/sprites/ui/stratagem/arrow_right.png")
}

@onready var panel_root: Control = $Control
@onready var terminal_rect: TextureRect = $Control/TerminalConsole
@onready var display_screen: Panel = $Control/TerminalConsole/DisplayScreen
@onready var arrows_container: HBoxContainer = $Control/TerminalConsole/DisplayScreen/ArrowsContainer
@onready var status_label: Label = $Control/TerminalConsole/DisplayScreen/StatusLabel
@onready var hint_label: Label = $Control/TerminalConsole/HintLabel

var sequence: Array[String] = []
var all_arrow_nodes: Array[TextureRect] = []
var current_index: int = 0
var target_door: Node2D = null
var max_distance: float = 80.0
var is_active: bool = false
var is_completing: bool = false

func _ready() -> void:
	panel_root.visible = false
	set_process_unhandled_input(false)

func start_puzzle(door: Node2D, length: int = 4, title_or_level: Variant = "", level: int = 1) -> void:
	target_door = door
	is_active = true
	is_completing = false
	current_index = 0
	sequence.clear()
	
	var custom_title: String = ""
	var hack_level: int = level
	if title_or_level is int:
		hack_level = title_or_level
	elif title_or_level is String:
		custom_title = title_or_level
	
	var possible_directions = ["up", "down", "left", "right"]
	for i in range(length):
		sequence.append(possible_directions.pick_random())
		
	_build_ui(custom_title, hack_level)
	panel_root.visible = true
	set_process_unhandled_input(true)
	
	# Entrance animation
	panel_root.modulate.a = 0.0
	panel_root.scale = Vector2(0.85, 0.85)
	panel_root.pivot_offset = panel_root.size / 2.0
	var tween = create_tween().set_parallel(true)
	tween.tween_property(panel_root, "modulate:a", 1.0, 0.2)
	tween.tween_property(panel_root, "scale", Vector2.ONE, 0.2).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	
	SoundManager.play_sound("snd_button", 0.05, 2.0)

func _build_ui(custom_title: String = "", hack_level: int = 1) -> void:
	for child in arrows_container.get_children():
		child.queue_free()
		
	all_arrow_nodes.clear()
	var count = sequence.size()
	
	if count <= 8:
		# Single row
		var computed_size = clamp((210.0 / float(count)) - 4.0, 22.0, 40.0)
		var separation = clamp(int(computed_size * 0.15), 2, 8)
		arrows_container.set("theme_override_constants/separation", separation)
		
		for i in range(count):
			var dir = sequence[i]
			var tex_rect = TextureRect.new()
			tex_rect.texture = ARROW_TEXTURES[dir]
			tex_rect.custom_minimum_size = Vector2(computed_size, computed_size)
			tex_rect.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
			tex_rect.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
			tex_rect.modulate = Color(0.4, 0.5, 0.6, 0.7)
			arrows_container.add_child(tex_rect)
			all_arrow_nodes.append(tex_rect)
	else:
		# Multi-row layout (for 20 arrows: 2 rows of 10)
		var vbox = VBoxContainer.new()
		vbox.alignment = BoxContainer.ALIGNMENT_CENTER
		vbox.add_theme_constant_override("separation", 4)
		arrows_container.add_child(vbox)
		
		var per_row = int(ceil(float(count) / 2.0))
		var computed_size = clamp((210.0 / float(per_row)) - 3.0, 16.0, 22.0)
		
		var row1 = HBoxContainer.new()
		row1.alignment = BoxContainer.ALIGNMENT_CENTER
		row1.add_theme_constant_override("separation", 3)
		vbox.add_child(row1)
		
		var row2 = HBoxContainer.new()
		row2.alignment = BoxContainer.ALIGNMENT_CENTER
		row2.add_theme_constant_override("separation", 3)
		vbox.add_child(row2)
		
		for i in range(count):
			var dir = sequence[i]
			var tex_rect = TextureRect.new()
			tex_rect.texture = ARROW_TEXTURES[dir]
			tex_rect.custom_minimum_size = Vector2(computed_size, computed_size)
			tex_rect.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
			tex_rect.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
			tex_rect.modulate = Color(0.4, 0.5, 0.6, 0.7)
			if i < per_row:
				row1.add_child(tex_rect)
			else:
				row2.add_child(tex_rect)
			all_arrow_nodes.append(tex_rect)
		
	if custom_title != "":
		status_label.text = custom_title
	else:
		status_label.text = "TERMINAL DE SEGURANCA [NV. " + str(hack_level) + "]"
		
	status_label.modulate = Color(0.3, 0.85, 1.0)
	hint_label.text = "[SETAS DO TECLADO] | [ESC / E] Cancelar"
	_highlight_current()

func _highlight_current() -> void:
	for i in range(all_arrow_nodes.size()):
		var child = all_arrow_nodes[i] as TextureRect
		if i < current_index:
			# Completed
			child.modulate = Color(0.2, 1.0, 0.3, 1.0) # Bright green
		elif i == current_index:
			# Current active
			child.modulate = Color(1.0, 0.9, 0.2, 1.0) # Glowing yellow
			var pulse = create_tween()
			pulse.tween_property(child, "scale", Vector2(1.2, 1.2), 0.08)
			pulse.tween_property(child, "scale", Vector2.ONE, 0.08)
		else:
			# Pending
			child.modulate = Color(0.3, 0.4, 0.5, 0.6)

func _process(_delta: float) -> void:
	if not is_active:
		return
		
	# Check if player moved away
	if target_door and is_instance_valid(target_door):
		var player = get_tree().get_first_node_in_group("player")
		if player and is_instance_valid(player):
			var dist = player.global_position.distance_to(target_door.global_position)
			if dist > max_distance:
				cancel_puzzle()

func _unhandled_input(event: InputEvent) -> void:
	if not is_active or is_completing:
		return
		
	if event.is_action_pressed("ui_cancel") or (event is InputEventKey and event.pressed and event.keycode == KEY_E):
		get_viewport().set_input_as_handled()
		cancel_puzzle()
		return
		
	var input_dir = ""
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_UP:
			input_dir = "up"
		elif event.keycode == KEY_DOWN:
			input_dir = "down"
		elif event.keycode == KEY_LEFT:
			input_dir = "left"
		elif event.keycode == KEY_RIGHT:
			input_dir = "right"
		
	if input_dir != "":
		get_viewport().set_input_as_handled()
		_handle_direction_input(input_dir)

func _handle_direction_input(dir: String) -> void:
	if current_index >= sequence.size():
		return
		
	var expected = sequence[current_index]
	if dir == expected:
		# Correct input
		current_index += 1
		SoundManager.play_sound("snd_button", 0.08, 1.0 + (current_index % 10) * 0.15)
		_highlight_current()
		
		if current_index >= sequence.size():
			_on_success()
	else:
		# Wrong input
		_on_failure()

func _on_success() -> void:
	is_completing = true
	status_label.text = "ACESSO CONCEDIDO!"
	status_label.modulate = Color(0.2, 1.0, 0.3)
	SoundManager.play_sound("snd_upgrade", 0.0, 3.0)
	
	var tween = create_tween()
	tween.tween_property(panel_root, "scale", Vector2(1.08, 1.08), 0.15)
	tween.tween_property(panel_root, "scale", Vector2.ONE, 0.15)
	
	await get_tree().create_timer(0.35).timeout
	close_puzzle()
	sequence_completed.emit()

func _on_failure() -> void:
	current_index = 0
	status_label.text = "SEQUENCIA INCORRETA!"
	status_label.modulate = Color(1.0, 0.2, 0.2)
	SoundManager.play_sound("snd_warning", 0.0, -2.0)
	
	for child in all_arrow_nodes:
		child.modulate = Color(1.0, 0.2, 0.2)
		
	# Shake effect
	var orig_pos = terminal_rect.position
	var tween = create_tween()
	tween.tween_property(terminal_rect, "position:x", orig_pos.x - 8.0, 0.04)
	tween.tween_property(terminal_rect, "position:x", orig_pos.x + 8.0, 0.04)
	tween.tween_property(terminal_rect, "position:x", orig_pos.x, 0.04)
	
	await get_tree().create_timer(0.25).timeout
	if is_active and not is_completing:
		_highlight_current()
		status_label.text = "TENTE NOVAMENTE"
		status_label.modulate = Color(0.3, 0.85, 1.0)

func cancel_puzzle() -> void:
	if not is_active or is_completing:
		return
	close_puzzle()
	minigame_cancelled.emit()

func close_puzzle() -> void:
	is_active = false
	set_process_unhandled_input(false)
	var tween = create_tween()
	tween.tween_property(panel_root, "modulate:a", 0.0, 0.15)
	await tween.finished
	panel_root.visible = false

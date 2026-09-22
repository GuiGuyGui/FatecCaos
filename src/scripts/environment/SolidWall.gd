@tool
extends StaticBody2D
class_name SolidWall

@export var wall_size: Vector2 = Vector2(32, 200):
	set(val):
		wall_size = val
		_update_wall()

@export var border_color: Color = Color(1.0, 0.55, 0.1, 0.9): # Laranja industrial em destaque
	set(val):
		border_color = val
		_update_wall()

@export var fill_color: Color = Color(0.12, 0.14, 0.18, 1.0):
	set(val):
		fill_color = val
		_update_wall()

@export var use_texture: bool = true:
	set(val):
		use_texture = val
		_update_wall()

var collision_node: CollisionShape2D
var fill_rect: ColorRect
var texture_rect: TextureRect
var border_lines: ReferenceRect

func _ready() -> void:
	collision_layer = 1
	collision_mask = 0
	_ensure_nodes()
	_update_wall()

func _ensure_nodes() -> void:
	if not collision_node:
		collision_node = get_node_or_null("CollisionShape2D")
		if not collision_node and not Engine.is_editor_hint():
			collision_node = CollisionShape2D.new()
			collision_node.name = "CollisionShape2D"
			add_child(collision_node)
			
	if collision_node and not (collision_node.shape is RectangleShape2D):
		collision_node.shape = RectangleShape2D.new()
	
	if collision_node:
		collision_node.one_way_collision = false

	if not fill_rect:
		fill_rect = get_node_or_null("FillColor")
		if not fill_rect and not Engine.is_editor_hint():
			fill_rect = ColorRect.new()
			fill_rect.name = "FillColor"
			add_child(fill_rect)

	if not texture_rect:
		texture_rect = get_node_or_null("WallTexture")
		if not texture_rect and not Engine.is_editor_hint():
			texture_rect = TextureRect.new()
			texture_rect.name = "WallTexture"
			texture_rect.stretch_mode = TextureRect.STRETCH_TILE
			texture_rect.texture = preload("res://assets/sprites/tiles_clean/hospital_brick.png")
			add_child(texture_rect)

	if not border_lines:
		border_lines = get_node_or_null("HighlightBorder")
		if not border_lines and not Engine.is_editor_hint():
			border_lines = ReferenceRect.new()
			border_lines.name = "HighlightBorder"
			border_lines.border_width = 2.0
			border_lines.editor_only = false
			add_child(border_lines)

func _update_wall() -> void:
	if not collision_node:
		_ensure_nodes()
		
	var half_w = wall_size.x / 2.0
	var half_h = wall_size.y / 2.0
	
	if collision_node and collision_node.shape is RectangleShape2D:
		collision_node.shape.size = wall_size
		collision_node.one_way_collision = false
		
	if fill_rect:
		fill_rect.offset_left = -half_w
		fill_rect.offset_top = -half_h
		fill_rect.offset_right = half_w
		fill_rect.offset_bottom = half_h
		fill_rect.color = fill_color
		fill_rect.z_index = -1
		
	if texture_rect:
		texture_rect.offset_left = -half_w
		texture_rect.offset_top = -half_h
		texture_rect.offset_right = half_w
		texture_rect.offset_bottom = half_h
		texture_rect.visible = use_texture
		texture_rect.z_index = 0
		
	if border_lines:
		border_lines.offset_left = -half_w
		border_lines.offset_top = -half_h
		border_lines.offset_right = half_w
		border_lines.offset_bottom = half_h
		border_lines.border_color = border_color
		border_lines.z_index = 1

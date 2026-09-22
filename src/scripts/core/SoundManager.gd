extends Node

var sound_cache: Dictionary = {}
var music_player: AudioStreamPlayer

var music_volume: float = 0.8
var sfx_volume: float = 1.0

func _ready() -> void:
	music_player = AudioStreamPlayer.new()
	music_player.bus = "Master"
	add_child(music_player)

func set_music_volume(val: float) -> void:
	music_volume = clamp(val, 0.0, 1.0)
	if music_player:
		music_player.volume_db = linear_to_db(music_volume)

func set_sfx_volume(val: float) -> void:
	sfx_volume = clamp(val, 0.0, 1.0)

func play_sound(sound_name: String, pitch_range: float = 0.05, volume_db: float = 0.0) -> void:
	if sfx_volume <= 0.001:
		return
	var path = "res://assets/audio/sounds/" + sound_name + ".wav"
	var stream = _get_sound(path)
	if stream:
		var player = AudioStreamPlayer.new()
		player.stream = stream
		player.volume_db = volume_db + linear_to_db(sfx_volume)
		if pitch_range > 0:
			player.pitch_scale = randf_range(1.0 - pitch_range, 1.0 + pitch_range)
		add_child(player)
		player.play()
		player.finished.connect(player.queue_free)

func play_sound_2d(sound_name: String, global_pos: Vector2, pitch_range: float = 0.05, volume_db: float = 0.0) -> void:
	if sfx_volume <= 0.001:
		return
	var path = "res://assets/audio/sounds/" + sound_name + ".wav"
	var stream = _get_sound(path)
	if stream:
		var player = AudioStreamPlayer2D.new()
		player.stream = stream
		player.global_position = global_pos
		player.volume_db = volume_db + linear_to_db(sfx_volume)
		player.max_distance = 800.0
		if pitch_range > 0:
			player.pitch_scale = randf_range(1.0 - pitch_range, 1.0 + pitch_range)
		get_tree().current_scene.add_child(player)
		player.play()
		player.finished.connect(player.queue_free)

func play_music(music_name: String, volume_db: float = -6.0) -> void:
	var path = "res://assets/audio/music/" + music_name + ".ogg"
	if ResourceLoader.exists(path):
		var stream = load(path)
		music_player.stream = stream
		music_player.volume_db = volume_db + linear_to_db(music_volume)
		music_player.play()

func stop_music() -> void:
	music_player.stop()

func _get_sound(path: String) -> AudioStream:
	if sound_cache.has(path):
		return sound_cache[path]
	if ResourceLoader.exists(path):
		var s = load(path)
		sound_cache[path] = s
		return s
	return null

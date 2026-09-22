extends Node2D

func _ready() -> void:
	var out = []
	out.append("--- TEST SHOOTING IN MAP POLIVALENTE ---")
	var map_scene = load("res://scenes/maps/map_polivalente.tscn")
	var map = map_scene.instantiate()
	add_child(map)
	
	var player = map.get_node_or_null("Player")
	if not player:
		out.append("ERROR: Player node not found in map_polivalente!")
		var f = FileAccess.open("C:/Users/Guilherme/Desktop/Zombie.Kill.of.the.Week.Reborn.v1.4.0.1/shoot_test_output.txt", FileAccess.WRITE)
		f.store_string("\n".join(out))
		f.close()
		get_tree().quit(1)
		return
		
	out.append("Player found: " + str(player.name))
	out.append("is_local_player: " + str(player.is_local_player))
	out.append("can_shoot: " + str(player.can_shoot))
	out.append("is_reloading: " + str(player.is_reloading))
	out.append("current_mag: " + str(player.current_mag))
	out.append("primary_weapon: " + str(player.primary_weapon))
	out.append("current_weapon_data: " + str(player.current_weapon_data))
	
	out.append("\nAttempting _try_shoot()...")
	player._try_shoot()
	
	var bullets = []
	for c in map.get_children():
		if c is Area2D and c.name.begins_with("Bullet"):
			bullets.append(c)
	for c in get_tree().current_scene.get_children():
		if c is Area2D and c.name.begins_with("Bullet"):
			bullets.append(c)
			
	out.append("Bullets spawned: " + str(bullets.size()))
	out.append("TEST COMPLETE SUCCESS")
	
	var f = FileAccess.open("C:/Users/Guilherme/Desktop/Zombie.Kill.of.the.Week.Reborn.v1.4.0.1/shoot_test_output.txt", FileAccess.WRITE)
	f.store_string("\n".join(out))
	f.close()
	get_tree().quit(0)

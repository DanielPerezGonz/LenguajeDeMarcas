let game_data;

let current_room = 0;
let items_picked = [];

function game (data)
{
	game_data = data;
				
	document.getElementById("terminal").innerHTML = "<p><strong>¡Bienvenidos a ENTIerrame!</strong> El juego de terror definitivo.</p>";
	document.getElementById("terminal").innerHTML += "<p>Te encuentras en "+game_data.rooms[current_room].name+". ¿Qué quieres hacer?</p>";
}

function terminal_out (info)
{
	let terminal = document.getElementById("terminal");

	terminal.innerHTML += info;

	terminal.scrollTop = terminal.scrollHeight;
}

function parseCommand (command)
{
	console.log("El comando ", command);
	switch (command){
		case "ver":
			terminal_out("<p>"+game_data.rooms[current_room].description+"</p>");
			break;

		case "ir":
			let doors = "";
			let doors_num = game_data.rooms[current_room].doors.length;
			for (let i = 0; i < doors_num; i++){
				if (i < doors_num - 1){
					doors += game_data.rooms[current_room].doors[i]+", ";
				}
				else{
					doors += game_data.rooms[current_room].doors[i];
				}
			}
			terminal_out("<p>Puedes ir a: "+doors+"</p>");
			break;
		case "coger":
			terminal_out("<p>"+game_data.rooms[current_room].items+"</p>");
			break;
		case "inventario":
			let items = "";
			if (game_data.inventory.length <= 0){
				terminal_out("<p>No tienes ningun objeto</p>")
			}
			else{
				for(let i = 0; i < game_data.inventory.length; i++){
					if (i < game_data.inventory.length - 1){
						items += game_data.inventory[i].id+", ";
					}
					else{
						items += game_data.inventory[i].id;
					}
				}
				terminal_out("<p>"+items+"</p>");
			}
			break;
		default:
			terminal_out("<p><strong>Error</strong>: "+command+" commando no encontrado</p>");
			break;
	}
}



function getRoomNumber (room)
{
	for (let i = 0; i < game_data.rooms.length; i++){
		if (game_data.rooms[i].id == room){
			return i;
		}
	}

	return -1;
}

function getItemNumber (item)
{
	for (let i = 0; i < game_data.rooms[current_room].items.length; i++){
		console.log(game_data.rooms[current_room].items[i]);
		if (game_data.rooms[current_room].items[i] == item){
			for(let o = 0; o < game_data.items.length; o++){
				if (game_data.items[o].id == item){
					return o;
				}
			}
		}
	}

	return -1;
}

function getDoorNumber (door)
{
	for (let i = 0; i < game_data.doors.length; i++){
		if (game_data.doors[i].id == door){
			return i;
		}
	}

	return -1;
}

function parseInstruction (instruction)
{

	console.log("La instrucción ", instruction);

	switch (instruction[0]){
		case "ir":
			let door_num = getDoorNumber(instruction[1]);
			if (door_num < 0){
				console.log("Puerta errónea");
				return;
			}
			if (game_data.doors[door_num].id == "salida"){
				terminal_out("<p>Enorabuena, has salido de este infierno! Ya no tendras que abrir el visual</p>");
				location.reload();
				return;
			}
			
			console.log("Door Num: ",door_num);

			let room_num = getRoomNumber(game_data.doors[door_num].rooms[0]);
			if (room_num < 0){
				console.log("Habitación errónea");
				terminal_out("<p>Esta habitacion no existe, creo, espero que no sea el codigo porque me mato :D</p>");
				return;
			}
			console.log("Current room: ", current_room);
			console.log("Room Num: ", room_num);
						
			if (room_num == current_room){
				console.log("la habitacion: ", game_data.doors[door_num].rooms[1], ", ", game_data.rooms[2].id);
				current_room = getRoomNumber(game_data.doors[door_num].rooms[1]);
			}
			else{
				current_room = room_num;
			}

			console.log("Current Num: ", current_room);

			break;


		case "coger":
			let item_num = getItemNumber(instruction[1]);
			if (item_num < 0){
				console.log("Item erróneo");
				return;
			}

			if (game_data.items[item_num].pickable == false){
				console.log("Item no se puede coger");
				terminal_out("<p>No puedes coger esto, no es open source</p>");
				return;
			}
						
			
			else{
				game_data.inventory.push({"id": game_data.items[item_num].id});
				for (let i = 0; i < game_data.rooms[current_room].items.length; i++){
					if (game_data.rooms[current_room].items[i] == instruction[1]){
						game_data.rooms[current_room].items.splice(i,1);
					}
				}
			}
			console.log("Item nuevo del inventario: ", game_data.inventory[0].id)


			break;

			case "inventario":
				let inventoryItem_num = -1;
				for (let i = 0; i < game_data.items.length; i++){
					if (game_data.items[i].id == instruction[1]){
						inventoryItem_num = i;
					}
				}
				if (inventoryItem_num < 0){
					console.log("Item erróneo");
					return;
				}

				terminal_out(game_data.items[inventoryItem_num].description);
				break;


		default:
			terminal_out("<p><strong>Error</strong>: "+instruction[0]+" commando no encontrado</p>");
			break;
	}
}

function readAction ()
{
	let instruction = document.getElementById("commands").value;
	let instruction_trim = instruction.trim();
				
	let data = instruction_trim.split(" ");

	if (data.length == 0 || instruction_trim == ""){
		terminal_out("<p><strong>Error</strong>: escribe una instrucción</p>");
		return;
	}

	if (data.length == 1){
		parseCommand(data[0]);
	}
	else{
		parseInstruction(data);
	}

}

fetch("https://danielperezgonz.github.io/game.json").then(response => response.json()).then(data => game(data));
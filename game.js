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
				if (i < door_num - 1){
					doors += game_data.rooms[current_room].doors[i]+", ";
				}
			}
			terminal_out("<p>Puedes ir a: "+doors+"</p>");
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
		case "ver":

			break;

		case "ir":
			let door_num = getDoorNumber(instruction[1]);
			if (door_num < 0){
				console.log("Puerta errónea");
				return;
			}

			console.log("Door Num: ",door_num);

			let room_num = getRoomNumber(game_data.doors[door_num].rooms[0]);
			if (room_num < 0){
				console.log("Habitación errónea");
				return;
			}

			console.log("Room Num: ", room_num);
						
			if (room_num == current_room){
				current_room = getRoomNumber(game_data.doors[door_num].rooms[1]);
			}
			else{
				current_room = room_num;
			}

			break;

		case "coger":

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
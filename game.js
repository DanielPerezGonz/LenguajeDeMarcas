{
	"rooms":[
		{"id":"parking", 
		"name":"Parking de Enti", 
		"description":"El Parking que no puedes usar",
		"items":["piedra","bicicleta"]
		"doors":["principal","salida"]}
	]
	"items":[
		{"id":"piedra", "name":"Pedrusco musgoso", "description":"Es una piedra sucia","pickable":true},
		{"id":"bicicleta", "name":"Bicicleta mugrosa", "description":"Algun alumno la abandono","pickable":false}
	]
	"doors":[
		{"id":"principal", "description":"Puerta de entrada a ENTI","rooms":["parking","hall"]},
		{"id":"salida","description":"La salvacion"}
	]
	
}
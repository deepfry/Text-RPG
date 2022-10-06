var commandInput = $('input.command');
var statusMessage = $('.statusMessage')

var actions = [
	"touch",
	"look",
]

var objects = [
	"tree",
	"door",
]

var statusCodes = {
	error:{"color":"red"},
	info:{"color":"deepskyblue"}
}

function updateStatus(message, code){
	statusMessage.html(message);
	statusMessage.prop("style","");
	if (code != undefined && code in statusCodes){
		statusMessage.css(statusCodes[code])
	}
}

var Chara = {
	currentRoom: 1,
	travel : function(d){
		//if the destination exists, go there
		if(Object.keys(Map.locations).includes(d.toString())) {
			Chara.currentRoom = [d];
			updateStatus(`You are now in ${Map.locations[Chara.currentRoom].name}`)
			return
		}
		//else
		console.log('Room does not exist')
	}
}

var Map = {
	locations : {
		1 : {
			name : 'Room 1',
			destinations : {
				N:2,
				E:3,
				S:4,
				W:5
			},
			actions : {
				observe : function(){
					updateStatus(`You observe ${Map.locations[1].name}.`)
				},
				interact : function(){
					updateStatus(`You interact with ${Map.locations[1].name}.`)
				},
				move : function(){
					updateStatus(`You move into ${Map.locations[1].name}.`)
				}
			},
			objects : {
				door : {
					id : 'R1D1',
					type : 'door',
					status : {open:false, locked: true}
				},
				tree : {
					type : 'decor',
					status : undefined,
					message : function(w){ return `It does nothing.`}
				},
				key : {
					id : 'R1D1',
					type : 'item',
					status : {
						acquired:false,
						use:function(){
							if(Chara.currentRoom != 1){
								updateStatus('This key is not meant for this room.');
							}
						}
					}
				}
			}
		},
		2 : {
			name : 'Room 2',
			destinations : {
				S:1
			}
		},
		3 : {
			name : 'Room 3',
			destinations : {
				W:1
			}
		},
		4 : {
			name : 'Room 4',
			destinations : {
				N:1
			}
		},
		5 : {
			name : 'Room 5',
			destinations : {
				E:1
			}
		},
	},
}

var validResponses = {
	look: function() { updateStatus("You see a door in the distace. There is also a nearby tree.")},
	touch: {
		tree: function(){ updateStatus("You touch the tree. It touches you back.")},
	}
}

function getValidActionsAsString() {
	return actions.join(" | ").toUpperCase();
}
function getValidObjectsAsString() {
	return objects.join(" | ").toUpperCase();
}

var Validate = {
	action : function(x){
		let theAction = x.split(" ").filter(e => actions.includes(e));
		if (theAction.length == 0){
			//no valid action has been input
			updateStatus(`Perhaps try looking around?`)//${getValidActionsAsString()}
			return false;
		}
		if (theAction.length > 1){
			//input too many actions
			updateStatus("Your actions are too many & your mind fumbles under the pressure.")
			return false;
		}
		return theAction[0];
	},
	object : function(x){
		let theObject = x.split(" ").filter(e => objects.includes(e));
		if (theObject.length == 0){
			//no valid object has been input
			updateStatus(`That object doesn't seem to be in the room...<br>Perhaps one try looking around?`)//${getValidObjectsAsString()}
			return false;
		}
		if (theObject.length > 1){
			//input too many actions
			updateStatus("Thinking about too many objects at once causes your mind to fumble.")
			return false;
		}
		return theObject[0];
	}
}

function tryExecuteCommand(a,o){
	var theCommand = validResponses[a];
	if(o){
		theCommand = validResponses[a][o];
	}
	return typeof theCommand == "function" ? theCommand() : updateStatus("Invalid Command","error")
}

function parseCommand(c) {
	let object = Validate.object(c);
	let action = Validate.action(c);
	if (action){
		tryExecuteCommand(action, object);
	}
	console.log("end parse");
}

commandInput.keypress(function(e){
	// console.log(e.which);
	if (e.which == 13) {
		let command = commandInput.val().trim().toLowerCase();
		parseCommand(command)
		console.log(`Input: ${command}`);
	}
})

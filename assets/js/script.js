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

function getValidActionsAsString() {
	return actions.join(" | ").toUpperCase();
}
function getValidObjectsAsString() {
	return objects.join(" | ").toUpperCase();
}

function containsAction(x) {
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
}
function containsObject(x) {
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

var validResponses = {
	look: function() { updateStatus("You see a door in the distace. There is also a nearby tree.")},
	touch: {
		tree: function(){ updateStatus("You touch the tree. It touches you back.")},
	}
}

function tryExecuteCommand(a,o){
	var theCommand;
	if(o){
		theCommand = validResponses[a][o];
	}
	theCommand = validResponses[a];
	return typeof theCommand == "function" ? theCommand() : updateStatus("Invalid Command","error")
}

function parseCommand(c) {
	let object = containsObject(c);
	let action = containsAction(c);
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

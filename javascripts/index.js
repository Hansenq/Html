// JavaScript source code


// Read in CAH phrases, and store them in array
var cahPhrases = [];
var cahPrompts = [];
var cahPromptsPointer = 0;

// Device identification information
//var devNum;		// ie. Player _
var time = (new Date()).getTime();
var isJudge = false;
var pickedCard = false;
var hand = [];

// Useful constants
var url = 'https://wpcah.firebaseio.com';

// Executes on initialization (opening app)
var masterFB = new Firebase(url);

// Adds this child to the online firebase, in order of players there
var players = new Firebase(url + '/players');
var playerRef = players.child('connected').push(time);
playerRef.onDisconnect().remove();
// Make players wait until a round changes

var judgePlayer = new Firebase(url + '/players/judge');
judgePlayer.on('child_changed', function(snapshot) {
	if (snapshot.val() === time) {
		isJudge = true;
	}
});

var temp = 0;
function getTotNumPlayers() {
	players.once('connected', function (snapshot) {
		temp = snapshot.numChildren();
	});
	return temp;
}

function changeToJudge() {
	// Hide buttons
}

function changeFromJudge() {
	// Display buttons
}


// Rooms contain the question, participating players, and all of the users!
// Watches round for a creation of a new round!
var rounds = new Firebase(url + '/round');
var currRound;
rounds.on('child_added', function (snapshot) {
	if (isJudge) {
		changeToJudge();
	} else {
		pickedCard = false;
		currRound = snapshot.val();
		startRound(currRound.questionPhrase);
	}
	// Display questionPhrase on the main page
	// Allow user to press buttons?
});
// When someone new picks their word
// For the judge: displays responses
// For the player: does nothing
var responses = [];
currRound.on('child_added', function (snapshot) {
	if (isJudge) {
		responses[responses.length] = snapshot.val();
	}
});


// When it presses 
$('button').click(function () {
	if (!isJudge) {
		currRound.child('responses').push(RESPONSE);
	} else {
		pickedCard = true;
	}
});


// callback function when some button is pressed
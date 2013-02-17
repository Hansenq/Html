// JavaScript source code

// Useful constants
var url = 'https://wpcah.firebaseio.com';

// Executes on initialization (opening app)
var masterFB = new Firebase(url);
masterFB.push("hi!");
masterFB.push("hi!");

// Read in CAH phrases, and store them in array
var cahPhrases = [];
cahPhrases[0] = "Hello!";
var cahPrompts = [];
cahPrompts[0] = "World!";

// Device identification information
//var devNum;		// ie. Player _
var time = (new Date()).getTime();
var isJudge = false;
var pickedCard = false;
var hand = [];
for (var i = 0; i < 7; i++) {
	hand[i] = cahPhrases[Math.floor(Math.random * cahPhrases.length)];
}



masterFB.on('gameStarted', function (snapshot) {
	if (snapshot.val() == true) {
		var html = '
		<button id="btn1" class="answer">TEXT OF FIRST</button>
		<p></p>
		<button id="btn2" class="answer">TEXT OF FIRST</button>
		<p></p>
		<button id="btn3" class="answer">TEXT OF FIRST</button>
		<p></p>
		<button id="btn4" class="answer">TEXT OF FIRST</button>
		<p></p>
		<button id="btn5" class="answer">TEXT OF FIRST</button>
		<p></p>
		<button id="btn6" class="answer">TEXT OF FIRST</button>
		<p></p>
		<button id="btn7" class="answer">TEXT OF FIRST</button>';
		$('.main-area').html(html);
		for (var i = 1; i <= hand.length; i++) {
			$('button .btn' + i).html(hand[i - 1]);
		}
		$('button .answer').on('click', function() {
			if (!isJudge) {
				currRound.child('responses').push(this.val());
				$('button #' + id).html(cahPhrases[Math.floor(Math.random() * cahPhrases.length)]);
				pickedCard = true;
			}
		});
	}
});

// Adds this child to the online firebase, in order of players there
var players = new Firebase(url + '/players');
var playerRef = players.child('connected').push(time);
playerRef.onDisconnect().remove();
// Make players wait until a round changes

var judgePlayer = new Firebase(url + '/players/judge');
judgePlayer.on('child_changed', function(snapshot) {
	if (snapshot.val() == time) {
		isJudge = true;
		alert('You have become the judge for this round!');
	}
});

var temp = 0;
function getTotNumPlayers() {
	players.once('connected', function (snapshot) {
		temp = snapshot.numChildren();
	});
	return temp;
}

var tempString;
function getRandPlayer() {
	players.once('connected', function (snapshot) {
		var randNum = Math.random * snapshot.numChildren();
		snapshot.forEach(function (snapshot) {
			tempString = snapshot.val();
		});
	});
	return tempString;
}

function changeToJudge() {
	$('.main-area').empty();
}

function changeFromJudge() {
	var html = '
	<button id="btn1" class="answer">TEXT OF FIRST</button>
	<p></p>
	<button id="btn2" class="answer">TEXT OF FIRST</button>
	<p></p>
	<button id="btn3" class="answer">TEXT OF FIRST</button>
	<p></p>
	<button id="btn4" class="answer">TEXT OF FIRST</button>
	<p></p>
	<button id="btn5" class="answer">TEXT OF FIRST</button>
	<p></p>
	<button id="btn6" class="answer">TEXT OF FIRST</button>
	<p></p>
	<button id="btn7" class="answer">TEXT OF FIRST</button>';
	$('.main-area').html(html);
	for (var i = 1; i <= hand.length; i++) {
		$('button .btn' + i).html(hand[i - 1]);
	}
	$('button .answer').on('click', function() {
		if (!isJudge) {
			currRound.child('responses').push(this.val());
			$('button #' + id).html(cahPhrases[Math.floor(Math.random() * cahPhrases.length)]);
			pickedCard = true;
		}
	});
	isJudge = false;
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
	}
	$('.page-title p').html(currRound.questionPhrase);
});
// When someone new picks their word
// For the judge: displays responses
// For the player: does nothing
var responses = [];
currRound.on('child_added', function (snapshot) {
	if (isJudge) {
		responses[responses.length] = snapshot.val();
		if (responses.length == currRound.numPlayers) {
			for (var i = 1; i <= responses.length; i++) {
				$('.main-area').append('<button id="resp' + i + 
					'" class="response">' + responses[i - 1] + 
					'</button><br>'
					);
				$('.main-area button .response').on('click', function() {
					alert('You have picked: ' + this.val() + "!");
					changeFromJudge();
					judgePlayer.set(getRandPlayer());
					rounds.push({
						numPlayers: getTotNumPlayers(),
						questionPhrase: cahPrompts[Math.floor(Math.random() * cahPrompts)]
					});
				}
			}
		}
	}
});


// When it presses 
$('.main-area button .answer').click(function () {
	if (!isJudge) {
		var id = this.id;
		currRound.child('responses').push(this.val());
		$('button #' + id).html(cahPhrases[Math.floor(Math.random() * cahPhrases.length)]);
		pickedCard = true;
	}
});


if (getTotNumPlayers() == 2 && gameStarted == false) {
	judgePlayer.set(getRandPlayer());
	masterFB.set({
		gameStarted: true
	});
	rounds.push({
		numPlayers: getTotNumPlayers(),
		questionPhrase: cahPrompts[Math.floor(Math.random() * cahPrompts)]
	});
}
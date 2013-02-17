// JavaScript source code

// Useful constants
var url = 'https://wpcah.firebaseio.com';

// Executes on initialization (opening app)
var masterFB = new Firebase(url);

// Read in CAH phrases, and store them in array
var cahPhrases = [];
cahPhrases[0] = "A caress of the inner thigh.";
cahPhrases[1] = "Sexy pillow fights.";
cahPhrases[2] = "Another goddamn vampire movie.";
cahPhrases[3] = "Dead parents.";
cahPhrases[4] = "Throwing a virgin into a volcano.";
cahPhrases[5] = "Italians.";
cahPhrases[6] = "YOU MUST CONSTRUCT ADDITIONAL PYLONS.";
cahPhrases[7] = "German dungeon porn.";
cahPhrases[8] = "Heteronormativity.";
cahPhrases[9] = "Firing a rifle into the air while balls deep in a squealing hog.";
cahPhrases[10] = "The Three-Fifths Compromise.";
cahPhrases[11] = "Mouth herpes.";
cahPhrases[12] = "Michelle Obama's arms.";
cahPhrases[13] = "Parting the Red Sea.";
cahPhrases[14] = "White people.";
cahPhrases[15] = "Waiting 'til marriage";
cahPhrases[16] = "Third base.";
cahPhrases[17] = "Spectacular abs.";
cahPhrases[18] = "Child abuse.";
cahPhrases[19] = "Expecting a burp and vomiting on the floor.";
cahPhrases[20] = "The clitoris.";
cahPhrases[21] = "Being rich.";
cahPhrases[22] = "72 virgins.";
cahPhrases[23] = "Racially-biased SAT questions.";
cahPhrases[24] = "Puppies!";
cahPhrases[25] = "Sperm whales.";
cahPhrases[26] = "Natural male enhancement.";
var cahPrompts = [];
cahPrompts[0] = "I got 99 problems but ______ ain't one.";
cahPrompts[1] = "White people like ______.";
cahPrompts[2] = "A romantic, candlelit dinner would be incomplete without ______.";
cahPrompts[3] = "What don't you want to find in your Chinese food?";
cahPrompts[4] = "Daddy, why is mommy crying?";
cahPrompts[5] = "What helps Obama unwind?";
cahPrompts[6] = "What did the U.S. airdrop to the children of Afghanistan?";
cahPrompts[7] = "______. It's a trap!";
cahPrompts[8] = "While the United States raced the Soviet Union to the moon, the Mexican government funneled millions of pesos into research on ______.";

// Device identification information
//var devNum;		// ie. Player _
var time = (new Date()).getTime();
var isJudge = false;
var pickedCard = false;
var hand = [];
for (var i = 0; i < 7; i++) {
	hand[i] = cahPhrases[Math.floor(Math.random() * cahPhrases.length)];
}



masterFB.child('gameStarted').on('value', function (snapshot) {
	console.log(snapshot.val());
	if (snapshot.val() == true) {
		if (isJudge) {

		} else {
			var html = '';
			for (var i = 1; i <= hand.length; i++) {
				html += '<button class="btn' + i + '" id="' + hand[i - 1] + '"><div>' + hand[i - 1] + '</div></button><p></p>';
			}
			$('.main-area').html(html);
			for (var i = 1; i <= hand.length; i++) {
				$('.btn' + i).on('click', function() {
					console.log('Button click!');
					rounds.child(currRoundId).child('responses').push(this.id);
					$('.btn' + i + ' div').text(cahPhrases[Math.floor(Math.random() * cahPhrases.length)]);
					pickedCard = true;
				});
			}
		}
	}
});

// Adds this child to the online firebase, in order of players there
var players = new Firebase(url + '/players');
var playerRef = players.child('connected').push(time);
playerRef.onDisconnect().remove();
// Make players wait until a round changes

var judgePlayer = new Firebase(url + '/players/judge');
judgePlayer.on('child_changed', function (snapshot) {
	console.log(snapshot.val());
	if (snapshot.val() == time) {
		isJudge = true;
		alert('You have become the judge for this round!');
	}
});

var numPlayers = 0;

players.child('connected').once('value', function (snapshot) {
	numPlayers = snapshot.numChildren();
	console.log(numPlayers);
});

players.child('connected').on('child_added', function (snapshot) {
	numPlayers++;
});

players.child('connected').on('child_removed', function (snapshot) {
	numPlayers--;
});

var randPlayer = time;

players.child('connected').on('child_added', function (snapshot) {
	numPlayers++;
	var randNum = Math.random * numPlayers;
	snapshot.forEach(function (snapshot) {
		randPlayer = snapshot.val();
	});
});

players.child('connected').on('child_removed', function (snapshot) {
	numPlayers--;
	var randNum = Math.random * numPlayers;
	snapshot.forEach(function (snapshot) {
		randPlayer = snapshot.val();
	});
});

function changeToJudge() {
	$('.main-area').empty();
	$('.main-area').append('<p>Please wait until all participants submit an answer before clicking!');
}

function changeFromJudge() {
	var html = '';
	for (var i = 1; i <= hand.length; i++) {
		html += '<button class="btn' + i + '" id="' + hand[i - 1] + '"><div>' + hand[i - 1] + '</div></button><p></p>';
	}
	$('.main-area').html(html);
	for (var i = 1; i <= hand.length; i++) {
		$('.btn' + i).on('click', function() {
			$('.btn' + i + ' div').text(cahPhrases[Math.floor(Math.random() * cahPhrases.length)]);
			rounds.child(currRoundId).child('responses').push(this.id);
			pickedCard = true;
		});
	}
	isJudge = false;
}


// Rooms contain the question, participating players, and all of the users!
// Watches round for a creation of a new round!
var rounds = new Firebase(url + '/round');
var currRound = null;
var currentRoundId;
var i = 1;
rounds.on('child_added', function (snapshot) {
	if (isJudge) {
		i = 1;
		changeToJudge();
		currRoundId = snapshot.name();
		currRound = rounds.child(currRoundId).child('responses').on('child_added', function (snapshot) {
			var resp = snapshot.val();
			if (isJudge) {
				$('.main-area').append('<button class="resp' + i + 
					'" id="' + resp + '">' + resp + 
					'</button><br>'
					);
				$('.resp' + i).on('click', function() {
					alert('You have picked: ' + this.id + "!");
					changeFromJudge();
					judgePlayer.set(randPlayer);
					rounds.push({
						numPlayers: numPlayers,
						questionPhrase: cahPrompts[Math.floor(Math.random() * cahPrompts.length)]
					});
				});
				i++;
			}
		});
	} else {
		pickedCard = false;
		if (currRound != null) {
			rounds.child(currRoundId).off();
		}
		currRoundId = snapshot.name();
		currRound = rounds.child(currRoundId).on('child_added', function (snapshot) {
		});
	}
	rounds.child(currRoundId).child('questionPhrase').once('value', function (snapshot) {
		$('#prompt p.prompt').html(snapshot.val());
	});
});

// When someone new picks their word
// For the judge: displays responses
// For the player: does nothing
var responses = [];

var gameStarted = false;
setTimeout(function () {
	console.log('after timeout' + numPlayers);
	if (numPlayers == 1 && gameStarted == false) {
		players.child('judge').set(randPlayer);
	}
	judgePlayer.once('value', function (snapshot) {
		console.log(snapshot.val() + ' ' + time);
		console.log(snapshot.val() == time);
		if (snapshot.val() == time) {	
			isJudge = true;
			alert('You have become the judge for this round!');
		}
	});
	if (numPlayers == 2 && gameStarted == false) {
		masterFB.update({
			gameStarted: true
		});
		rounds.push({
			numPlayers: numPlayers,
			questionPhrase: cahPrompts[Math.floor(Math.random() * cahPrompts.length)]
		});
	}
}, 2000);

$(document).ready(function (){ 
	$('.next-q').on('click', function () {
		for (var i = 0; i < 7; i++) {
			hand[i] = cahPhrases[Math.floor(Math.random() * cahPhrases.length)];
		}
		$('.main-area').empty();
		var html = '';
		for (var j = 1; j <= hand.length; j++) {
			html += '<button class="btn' + j + '" id="' + hand[j - 1] + '"><div>' + hand[j - 1] + '</div></button><p></p>';
		}
		$('.main-area').html(html);
		$('#prompt p.prompt').html(cahPrompts[Math.floor(Math.random() * cahPrompts.length)]);
	});
});
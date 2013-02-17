// JavaScript source code


// Read in CAH phrases, and store them in array
var cahPhrases = [];
var cahPrompts = [];
var cahPromptsPointer = 0;



// Executes on initialization (opening app)


var firebase = new Firebase('https://wpcah.firebaseio.com');

// Testing whether or not firebase works! remove once working
firebase.push({
    name: 'Hello world!',
    text: 'lorem ipsum!'
});



/*firebase.push({
	name: deviceName,
	guid: deviceGuid
});*/




// callback function when some button is pressed
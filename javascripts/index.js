// JavaScript source code


// Read in CAH phrases, and store them in array
var cahPhrases = [];
var cahPrompts = [];
var cahPromptsPointer = 0;

	document.write("Reading external javascript file succeess!");


	// Executes on initialization (opening app)


	var fb = new Firebase('https://wpcah.firebaseio.com/');

	// Testing whether or not firebase works! remove once working
	fb.push({
	    name: 'Hello world!',
	    text: 'lorem ipsum!'
	});



/*fb.push({
	name: deviceName,
	guid: deviceGuid
});*/




// callback function when some button is pressed
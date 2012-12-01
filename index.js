//VALUES ---------------------------------------------------------------------------

var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
var ampm = ['am', 'pm'];
var places = ['Abu Dhabi', 'California', 'Colorado', 'Manila', 'Minnesota', 'New York'];

function populate() {
	$.each(days, function() {
		$('#dayselect').append(new Option(this, this));
	});
	
	for (var i = 1; i <= 12; i++) {
		$('#hourselect').append(new Option(i, i));
	}
	
	for (var i = 0; i < 60; i++) {
		$('#minuteselect').append(new Option(formatMinutes(i), i));
	}
	
	$.each(ampm, function() {
		$('#ampmselect').append(new Option(this, this));
	});

	$.each(places, function() {
		$('#placeselect').append(new Option(this, this));
	});
}

function formatMinutes(i) {
	var s = i.toString();
	if (s.length === 1) s = '0' + s;
	return s;
}


//COLORS ---------------------------------------------------------------------------

var colorvalues = {
	pink: 'E55F99',
	orange: 'EC813A',
	yellow: 'ECD03A',
	green: '9DE33C',
	blue: '54D2F1',
	purple: '8E94F6'
}

var colornames = ['pink', 'orange', 'yellow', 'green', 'blue', 'purple'];

function setColors() {
	var boxes = $('.timebox');
	for (var i = 0; i < boxes.length; i++) {
		boxes[i].style.borderColor = colors(i);
	}
}

function colors(i) {
	return colorvalues[colornames[i]];
}


//DEFAULTS ---------------------------------------------------------------------------

var abbrevs = {
	'Mon': 'Monday',
	'Tue': 'Tuesday',
	'Wed': 'Wednesday',
	'Thu': 'Thursday',
	'Fri': 'Friday',
	'Sat': 'Saturday',
	'Sun': 'Sunday'
}

var currentPlace = places[3];
var currentTime = Object();

function getUserPlace() {
	var cookie = document.cookie;
	var key = 'place=';
	var keyIndex = cookie.indexOf(key);
	
	if (keyIndex !== -1) {
		var end = cookie.indexOf(';', keyIndex);
		if (end === -1) end = cookie.length;
		return unescape(cookie.substring(keyIndex + key.length, end));
	}
}

function setUserPlace() {
	var userPlace = getUserPlace();
	if (userPlace) currentPlace = userPlace;
	$('#placeselect').val(currentPlace);
}

function setUserTime() {
	var userTime = Date();
	
	currentTime.day = abbrevs[userTime.substring(0, 3)];
	$('#dayselect').val(currentTime.day);
	
	var index = userTime.indexOf(':');
	var hours = parseInt(userTime.substring(index-2, index));
	var minutes = parseInt(userTime.substring(index+1, index+3));
	
	currentTime.hour = parseInt(userTime.substring(index-2, index));
	currentTime.minute = parseInt(userTime.substring(index+1, index+3));
}

/*
function roundMinutes(minutes) {
	// return 1 if minutes >= 30, 0 otherwise
}
*/


//READY ---------------------------------------------------------------------------

function getValues() {
	currentPlace = $('#placeselect').val();
	currentTime.minute = parseInt($('#minuteselect').val());
	currentTime.day = $('#dayselect').val();
	
	var ampm = $('#ampmselect').val();
	var hour = parseInt($('#hourselect').val());
	if (hour === 12) hour = 0;
	
	if (ampm === 'am') {
		currentTime.hour = hour;
	}
	else {
		currentTime.hour = hour + 12;
	}
}

function setValues() {
	$('#placeselect').val(currentPlace);
	$('#minuteselect').val(currentTime.minute);
	$('#dayselect').val(currentTime.day);
	
	if (currentTime.hour === 0) {
		$('#hourselect').val(12);
		$('#ampmselect').val('am');
	}
	else if (currentTime.hour < 12) {
		$('#hourselect').val(currentTime.hour);
		$('#ampmselect').val('am');
	}
	else if (currentTime.hour === 12) {
		$('#hourselect').val(currentTime.hour);
		$('#ampmselect').val('pm');
	}
	else {
		$('#hourselect').val(currentTime.hour % 12);
		$('#ampmselect').val('pm');
	}
}

$(document).ready(function() {
	populate();
	setColors();
	setUserPlace();
	setUserTime();
	setValues();
	
	var dayselect = $('#dayselect');
	var hourselect = $('#hourselect');
	var minuteselect = $('#minuteselect');
	var ampmselect = $('#ampmselect');
	var placeselect = $('#placeselect');
	
	$('select').change(function() {
		getValues();
		setValues();
		//console.log(currentPlace + " \t", currentTime);
	});
	
	placeselect.change(function() {
		document.cookie = 'place=' + escape(placeselect.val()) + ';expires=Wed, 1 Jan 2020 00:00:00 GMT';
	})
});

var timezones = {
	"Abu Dhabi": 12,
	"California": 0,
	"Colorado": 1,
	"Manila": 16,
	"Minnesota": 2,
	"New York": 3
};

var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

var maintext = "";
var currentPlace = "Manila";
var currentTime = Object();

currentTime.toString = function() {
	var hours = this.hours;
	var minutes = this.minutes;
	var suffix = 'am';
	
	if (minutes >= 60) {
		hours = hours + Math.floor(minutes / 60);
		minutes = minutes % 60;
	}
	
	if (hours === 0) {
		hours = 12;
	}
	else if (hours == 12) {
		suffix = 'pm'
	}
	else if (hours > 12) {
		hours = hours % 12;
		suffix = 'pm';
	}
	
	if (minutes.toString().length === 1) {
		minutes = '0' + minutes;
	}
	
	hours = hours.toString();
	return hours + ":" + minutes + suffix;
}

function fetchUserTime() {
	var userTime = Date();
	var index = userTime.indexOf(':');
	currentTime.hours = parseInt(userTime.substring(index-2, index));
	currentTime.minutes = parseInt(userTime.substring(index+1, index+3));
}

function fetchUserPlace() {
	var cookie = document.cookie;
	var key = 'place=';
	var keyIndex = cookie.indexOf(key);
	
	if (keyIndex !== -1) {
		var end = cookie.indexOf(';', keyIndex);
		if (end === -1) end = cookie.length;
		return unescape(cookie.substring(keyIndex + key.length, end));
	}
}

function setMaintext() {
	maintext = currentTime.toString() + " in " + currentPlace + " is...";
	$('#maintext').text(maintext);
}

$(document).ready(function() {
	var userPlace = fetchUserPlace();
	if (userPlace) currentPlace = userPlace;
	
	var places = $('#places');
	places.val(currentPlace);
	fetchUserTime();
	setMaintext();
	
	places.change(function() {
		document.cookie = 'place=' + escape(places.val()) + ';expires=Wed, 1 Jan 2020 00:00:00 GMT';
		currentPlace = places.val();
		setMaintext();
	});
});
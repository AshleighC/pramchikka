//VALUES ---------------------------------------------------------------------------

var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
var ampm = ['am', 'pm'];
var places = ['Abu Dhabi', 'California', 'Colorado', 'Manila', 'Minnesota', 'New York'];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var monthdays = function() {
  var result = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var year = (new Date()).getYear();
  if (!(year & 3 || year & 15 && !(year % 25))) {
    result[1] = 29;
  }
  return result;
}();

function populate() {
  $.each(days, function() {
    $('#dayselect').append(new Option(this, this));
  });

  for (var i = 1; i <= 12; i++) {
    $('#hourselect').append(new Option(i, i));
  }

  for (var i = 0; i < 60; i++) {
    $('#minuteselect').append(new Option(formatMinute(i), i));
  }

  $.each(ampm, function() {
    $('#ampmselect').append(new Option(this, this));
  });

  $.each(places, function() {
    $('#placeselect').append(new Option(this, this));
  });

  $.each(months, function() {
    $('#monthselect').append(new Option(this, this));
  });

  for (var i = 1; i <= 31; i++) {
    $('#dateselect').append(new Option(i, i));
  }
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
  var userTime = new Date();
  currentTime.day = days[(userTime.getDay() + (days.length - 1)) % days.length];
  currentTime.hour = userTime.getHours();
  currentTime.minute = userTime.getMinutes();
  currentTime.month = months[userTime.getMonth()];
  currentTime.date = userTime.getDate();
}


//DST FIXES ----------------------------------------------------------------------------

var timezones = {
  "Abu Dhabi": 12,
  "California": 0,
  "Colorado": 1,
  "Manila": 16,
  "Minnesota": 2,
  "New York": 3
};

function isDST() {
  var userTime = new Date();
  var month = months.indexOf(currentTime.month) + 1;

  if ((month < 3) || (month > 11)) {
    return false;
  } else if ((month > 3) && (month < 11)) {
    return true;
  } else {
    var prevSunday = currentTime.date - ((days.indexOf(currentTime.day) + 1) % 7);

    if (month === 3) {
      return prevSunday >= 8;
    } else {
      return prevSunday <= 0;
    }
  }
}

function fixTimezones() {
  if (isDST()) {
    timezones["Abu Dhabi"] = 11;
    timezones["Manila"] = 15;
  } else {
    timezones["Abu Dhabi"] = 12;
    timezones["Manila"] = 16;
  }
}

function findDay() {
  var month = months.indexOf(currentTime.month);
  var date = currentTime.date;
  var year = (new Date()).getFullYear();

  day = (new Date(year, month, date, 0, 0, 0, 0)).getDay();
  return days[(day + (days.length - 1)) % days.length];
}


//PROCESSING ---------------------------------------------------------------------------

function updateValues() {
  console.log(currentTime.day + " " + currentTime.month + " " + currentTime.date + ", " + currentTime.hour + ":" + currentTime.minute); // DEBUGGING CODE

  fixTimezones();
  var boxes = $('.timebox');

  for (var i = 0; i < boxes.length; i++) {
    var place = boxes[i].id;
    boxes[i].innerHTML = makeString(place, calculateTime(place));
  }
}

function calculateTime(place) {
  var difference = timezones[place] - timezones[currentPlace];
  var day = currentTime.day;
  var hour = currentTime.hour + difference;
  var minute = currentTime.minute;
  var month = months.indexOf(currentTime.month);
  var date = currentTime.date;

  if (hour < 0) {
    hour = hour + 24;
    day = days[(days.indexOf(day) + (days.length - 1)) % days.length];
    date = date - 1;
  } else if (hour > 23) {
    hour = hour - 24;
    day = days[(days.indexOf(day) + 1) % days.length];
    date = date + 1;
  }

  if (date < 1) {
    month = (month + (months.length - 1)) % months.length;
    date = monthdays[month];
  } else if (date > monthdays[month]) {
    month = (month + 1) % months.length;
    date = 1;
  }

  return {month: months[month], date: date, day: day, hour: hour, minute: minute}
}

function makeString(place, time) {
  var hourAMPM = parseTime(time);
  var day = time.day;
  var hour = hourAMPM.hour;
  var minute = formatMinute(time.minute);
  var ampm = hourAMPM.ampm;
  var month = time.month;
  var date = time.date;

  var placeString = "<b>" + place + "</b>: ";
  var dateString = month.substring(0, 3) + " " + date;
  var timeString = hour + ":" + minute + ampm;

  return placeString + day + " " + dateString + ", " + timeString;
}

function parseTime(time) {
  var hour;
  var ampm;

  if (time.hour === 0) {
    hour = 12;
    ampm = 'am';
  }
  else if (time.hour < 12) {
    hour = time.hour;
    ampm = 'am';
  }
  else if (time.hour === 12) {
    hour = time.hour;
    ampm = 'pm';
  }
  else {
    hour = time.hour % 12;
    ampm = 'pm';
  }

  return {hour: hour, ampm: ampm}
}

function formatMinute(i) {
  var s = i.toString();
  if (s.length === 1) s = '0' + s;
  return s;
}


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
  var hourAMPM = parseTime(currentTime);
  $('#dayselect').val(currentTime.day);
  $('#hourselect').val(hourAMPM.hour);
  $('#minuteselect').val(currentTime.minute);
  $('#ampmselect').val(hourAMPM.ampm);
  $('#placeselect').val(currentPlace);
  $('#monthselect').val(currentTime.month);
  $('#dateselect').val(currentTime.date);
}

$(document).ready(function() {
  populate();
  setColors();
  setUserPlace();
  setUserTime();
  setValues();
  updateValues();

  var dayselect = $('#dayselect');
  var hourselect = $('#hourselect');
  var minuteselect = $('#minuteselect');
  var ampmselect = $('#ampmselect');
  var placeselect = $('#placeselect');
  var monthselect = $('#monthselect');
  var dateselect = $('#dateselect');

  dayselect.attr('disabled', 'disabled');

  $('#linktext').focus(function() {
    $(this).select();
  });

  $('#linktext').mouseup(function(e) {
    e.preventDefault();
  });

  dateselect.change(function() {
    currentTime.date = dateselect.val();
    dayselect.val(findDay());
  });

  monthselect.change(function() {
    currentTime.month = monthselect.val();
    dateselect.empty();

    var currentDate = dateselect.val();
    var daysInMonth = monthdays[months.indexOf(currentTime.month)];

    for (var i = 1; i <= daysInMonth; i++) {
      dateselect.append(new Option(i, i));
    }

    if (currentTime.date > daysInMonth) {
      currentTime.date = daysInMonth;
    }

    dateselect.val(currentTime.date);
    dayselect.val(findDay());
  });

  dayselect.change(function() {
    var newDay = days.indexOf(dayselect.val());
    var oldDay = days.indexOf(findDay());
    var difference = newDay - oldDay;
  });

  $('select').change(function() {
    getValues();
    updateValues();
  });

  placeselect.change(function() {
    document.cookie = 'place=' + escape(placeselect.val()) + ';expires=Wed, 1 Jan 2020 00:00:00 GMT';
  });
});

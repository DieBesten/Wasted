var c_red;
var c_blue;
var c_lightblue;
var c_verylightblue;

var timeStart;
var timeEnd;
var currentTimeHours;
var currentTimeMinutes;
var currentDay;

var stress;
var productivity;
var verlust;

// x, y, width, height, label, background, backgroundLabel
var days;
var dayLabels;

var diaTest;

var pxProMinute;
var progress;

var playing;

var setup = function(){
	createCanvas(windowWidth, windowHeight);
	background(255, 255, 255, 0);

	// Set our main colors
	c_red = color(222, 82, 66);
	c_blue = color(29, 29, 36);
	c_lightblue = color(33, 34, 41);
	c_verylightblue = color(56, 56, 71);

	// Create the Days
	var x = (width / 100 * 12) + ((width / 100 * 76) / 100 * 5);
	var w = width - (x * 2);
	days = [];
	dayLabels = ["MONTAG", "DIENSTAG", "MITTWOCH", "DONNERSTAG", "FREITAG"];
	for(var i = 1; i < 6; i++){
		days.push(new Day(x, 124 * i, w, 120, dayLabels[i-1], c_lightblue, c_verylightblue));
	}

	// Simulation playing
	playing = false;

	// Declare variables for the timeline
	timeStart = 8;
	timeEnd = 17;
	currentTime = timeStart;
	currentTimeMinutes = 0;
	currentDay = 0;

	days[currentDay].backgroundLabel = c_red;

	stress = 0;
	productivity = 100;
	verlust = 0;

	pxProMinute = w / 540;
	progress = ((currentTimeHours - 8) * pxProMinute * 60) + (currentTimeMinutes * pxProMinute);

	// day, type, c_Stroke, c_Fill, distance
	diaTest = new Dia(days[0], 0, c_red, c_red, w / 540 * 60);
	stress = random(0, 100);
}

var draw = function(){
	frameRate(60);
	background(255, 255, 255, 0);		
	noStroke();

	progress = ((currentTimeHours - 8) * pxProMinute * 60) + (currentTimeMinutes * pxProMinute);

	// Background Overwrite Areas
	// Content
	fill(c_blue);
	rect(width / 100 * 12, 0, width / 100 * 76, height);

	for(var i = 0; i < days.length; i++){
		days[i].draw();
	}

	stress += random(-1, 1);

	diaTest.draw(progress, stress);

	// Draw the Timeline
	timeLine();
}

var timeLine = function(){
	fill(c_red);
	// x Position vom Zeitstrahl
	var x = (width / 100 * 12) + ((width / 100 * 76) / 100 * 5);
	
	// Breite des Stahles
	var w = width - (x * 2);
	var pxProMinute = w / 540;

	var progress = ((currentTimeHours - 8) * pxProMinute * 60) + (currentTimeMinutes * pxProMinute);

	rect(x, 107, progress, 8);

	// Zeitberrechnung

	if(playing){
		if(currentTimeHours < timeEnd){		
			if(currentTimeMinutes < 60){
				currentTimeMinutes += 1;
			} else {
				currentTimeMinutes = 0;
				currentTimeHours++;
				diaTest.addData(stress);
			}
		} else {
			timeLineReset();
			currentTimeHours = timeStart;
			currentTimeMinutes = 0;
		}
	}

	timeLineStrahl(x + progress, 107);
}

var timeLineStrahl = function(x, y){
	noStroke();
	fill(255);
	rect(x - 8, y, 16, 8);
	triangle(x - 8, y + 8, x + 8, y + 8, x, y + 16);
	stroke(255);
	line(x, 107, x, 107 + (5 * 126));
	noStroke();

	textAlign("CENTER");
	text(currentTimeHours + ":" + currentTimeMinutes, x - 12, y - 5);
}

var timeLineReset = function(){
	fill(c_blue);
	var x = (width / 100 * 12) + ((width / 100 * 76) / 100 * 5);
	var w = width - (x * 2);
	rect(x, 107, w + 20, 8);

	// next Day

	if(currentDay < days.length){		
		days[currentDay].backgroundLabel = c_red;
		if(currentDay >= 1){
			days[currentDay-1].backgroundLabel = c_verylightblue;
		}		
		currentDay++;
	} else {
		currentDay = 0;
		days[days.length-1].backgroundLabel = c_verylightblue;
	}
}

var leftSidebar = function(){
	// play Button
	if(dist(mouseX, mouseY, width / 100 * 9, 164) < 40){
		
	}
}
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

var setup = function(){
	createCanvas(windowWidth, windowHeight);
	background(255, 255, 255, 0);

	c_red = color(222, 82, 66);
	c_blue = color(29, 29, 36);

	timeStart = 8;
	timeEnd = 17;
	currentTime = timeStart;
	currentTimeMinutes = 0;
	currentDay = 1;

	stress = 0;
	productivity = 100;
	verlust = 0;
}

var draw = function(){
	background(255, 255, 255, 0);		
	noStroke();

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

	if(currentTimeHours < timeEnd){		
		if(currentTimeMinutes < 60){
			currentTimeMinutes++;
		} else {
			currentTimeMinutes = 0;
			currentTimeHours++;
		}
	} else {
		timeLineReset();
		currentTimeHours = timeStart;
		currentTimeMinutes = 0;
	}

	console.log(currentTimeHours);
}

var timeLineReset = function(){
	fill(c_blue);
	var x = (width / 100 * 12) + ((width / 100 * 76) / 100 * 5);
	var w = width - (x * 2);
	rect(x, 107, w + 20, 8);
}
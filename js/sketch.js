var c_red;
var c_blue;
var c_lightblue;
var c_verylightblue;

var timeStart;
var timeEnd;
var currentTimeHours;
var currentTimeMinutes;
var currentDay;

// calculation vars
var stress;
var productivity;
var verlust;
var mitarbeiter;
var krankheitstage;
var wertDesMitarbeiters;
var gehalt;
var ablenkung;

// vom Tag vorher
var oldStress;

// x, y, width, height, label, background, backgroundLabel
var days;
var dayLabels;

var diaTest;
var proDiaTest;

var pxProMinute;
var progress;

var playing;
var editMode;

var stressArray;
var productivityArray;

var srmArray;

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
	editMode = true;

	// Declare variables for the timeline
	timeStart = 8;
	timeEnd = 17;
	currentTime = timeStart;
	currentTimeMinutes = 0;
	currentDay = 0;

	days[currentDay].backgroundLabel = c_red;

	// Set start values for the calculation
	stress = 0;
	productivity = 100;
	verlust = 0;
	mitarbeiter = 1;
	krankheitstage = 0;
	gehalt = 21 * 8;
	wertDesMitarbeiters = gehalt * 4.29;
	ablenkung = 0;
	oldStress = 0;

	pxProMinute = w / 540;
	progress = ((currentTimeHours - 8) * pxProMinute * 60) + (currentTimeMinutes * pxProMinute);

	// Diagrams Array and creation for first day
	stressArray = [];
	productivityArray = [];

	stressArray.push(new Dia(days[currentDay], 0, c_red, c_red, w / 540 * 60));
	productivityArray.push(new Dia(days[currentDay], 1, 255, c_red, w / 540 * 60));

	stressArray[currentDay].addData(stress);
	productivityArray[currentDay].addData(productivity);

	// SRM Array
	srmArray = [];
	srmArray.push(new Srm(1, width / 100 * 6 - 56, height / 2, "Yoga", days));

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

	// Draw the days
	for(var i = 0; i < days.length; i++){
		days[i].draw();
	}

	// Draw the diagrams
	if(currentDay >= 1){
		for(var i = 0; i < stressArray.length; i++){
			stressArray[i].draw(progress, stress - 100);
			productivityArray[i].draw(progress, productivity);
		}
	}

	text(stress, width / 2, 20);

	// Draw the timeline
	timeLine();

	// Draw the right sidebar
	rightSidebar();

	// Draw the left sidebar
	leftSidebar();
}

var timeLine = function(){
	noStroke();

	// x Position vom Zeitstrahl
	var x = (width / 100 * 12) + ((width / 100 * 76) / 100 * 5);
	
	// Breite des Stahles
	var w = width - (x * 2);
	var pxProMinute = w / 540;

	var progress = ((currentTimeHours - 8) * pxProMinute * 60) + (currentTimeMinutes * pxProMinute);

	fill(c_lightblue);
	rect(x, 107, w, 8);

	fill(c_red);
	rect(x, 107, progress, 8);

	// Zeitberrechnung

	if(playing){
		if(currentTimeHours < timeEnd){		
			if(currentTimeMinutes < 60){
				currentTimeMinutes += 1;				
				calculation();
			} else {
				currentTimeMinutes = 0;
				currentTimeHours++;
				stressArray[currentDay-1].addData(stress - 100);
				productivityArray[currentDay-1].addData(productivity);
			}
		} else {
			timeLineReset();
			currentTimeHours = timeStart;
			currentTimeMinutes = 0;
		}
	}

	text(round(verlust), width / 2, 100);
	ellipse(width / 2, 50, round(frameRate()), round(frameRate()));

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

	// indicators

	// productivity
	fill(255);
	ellipse(x, ((y + 126) - (productivity) / 112 * 100) + 10 + ((currentDay - 1) * 124), 10, 10);

	// stress
	fill(c_red);
	ellipse(x, ((y + 126) - ((stress - 100) / 112 * 100)) + 10 + ((currentDay - 1) * 124), 10, 10);

	// indicatior text

	fill(255);
	text("Produktiviät: " + productivity + "%", x, ((y + 126) - (productivity) / 112 * 100) + 10 + ((currentDay - 1) * 124));
	text("Stress: " + round(stress - 100) + "%", x, ((y + 126) - ((stress - 100) / 112 * 100)) + 10 + ((currentDay - 1) * 124));
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
		oldStress += stress;
		// NEXT DAY --> New Diagrams
		if(currentDay > 1){
			// finish the old diagram
			stressArray[currentDay-2].end();
			productivityArray[currentDay-2].end();
			// create new diagrams for the next day
			stressArray.push(new Dia(days[currentDay-1], 0, c_red, c_red, w / 540 * 60));
			productivityArray.push(new Dia(days[currentDay-1], 1, 255, c_red, w / 540 * 60));
			// Start values for the new day
			stressArray[currentDay-1].addData(stress);
			productivityArray[currentDay-1].addData(productivity);
		}
	} else {
		currentDay = 0;
		days[days.length-1].backgroundLabel = c_verylightblue;
	}
}

var leftSidebar = function(){
	// background for SRM
	fill(c_lightblue);
	rect(0, 224, width / 100 * 12, height - 224);

	// play Button
	if(dist(mouseX, mouseY, width / 100 * 9, 164) < 40 && mouseIsPressed){
		playing = true;
		editMode = false;
	}
	// edit Button
	if(dist(mouseX, mouseY, width / 100 * 3, 164) < 40 && mouseIsPressed){
		playing = false;
		editMode = true;
	}

	// Edit Mode

	for(var i = 0; i < srmArray.length; i++){
		srmArray[i].draw();
	}
}

var rightSidebar = function(){
	fill(c_lightblue);
	rect(width / 100 * 88, 0, width / 100 * 12, height);

	// Marks

	stroke(c_verylightblue);
	for(var i = 0; i < 10; i++){
		line(width / 100 * 89, height / 10 * i, width / 100 * 99, height / 10 * i);
	}
	noStroke();

	// Water
	fill(c_red.levels[0], c_red.levels[1], c_red.levels[2], 200);
	rect(width / 100 * 88, height - verlust / 100, width / 100 * 12, verlust / 100);
}

var calculation = function(){
	// Produktiviät = -28% bei 100% Ablenkung
	productivity = 100 - (ablenkung / 100 * 28);
	// Stress erhöht sich je länger der Tag geht, 200 ist das maximale Stresslevel
	if(stress < 200){
		stress = (100 - (ablenkung / 100 * 60)) + ((currentTimeHours * 60 + currentTimeMinutes) / 20) + random(0,1) + oldStress;
	} else {
		stress = 200;
	}
	krankheitstage = (stress * 2) / 365;
	verlust += (((krankheitstage * wertDesMitarbeiters * productivity)) * mitarbeiter) / 24 / 60;
}

var mouseReleased = function(){
	// reset drag and drop stuff
	for(var i = 0; i < srmArray.length; i++){
		srmArray[i].dragging = false;
		srmArray[i].changingDuration = false;
	}
}
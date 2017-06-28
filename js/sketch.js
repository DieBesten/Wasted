p5.disableFriendlyErrors = true;

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

var srmStash;

var isDragging;

var ablenkungen;

var gesamterGewinn;

// fonts
/*
var f_Roboto;

var preload = function() {
   f_Roboto = loadFont('../assets/Roboto-Regular.ttf');
}
*/

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
	wertDesMitarbeiters = gehalt * 4.29 / 8 / 60;
	ablenkung = 100;
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
	/*
	srmArray.push(new Srm(1, width / 100 * 6 - 56, height / 2, "Yoga", days));
	srmArray.push(new Srm(2, width / 100 * 6 - 56, height / 2 + 128, "Sport", days));
	srmArray.push(new Srm(3, width / 100 * 6 - 56, height / 2 + 128 * 2, "SMB", days));
	*/

	srmStash = [];
	srmStash.push(new Srm(0, width / 100 * 6 - 56, height / 2, "Yoga", days));
	srmStash.push(new Srm(0, width / 100 * 6 - 56, height / 2 + 128, "Sport", days));
	srmStash.push(new Srm(0, width / 100 * 6 - 56, height / 2 + 128 * 2, "SMB", days));

	isDragging = false;

	ablenkungen = [];

	gesamterGewinn = 0;
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

	if(playing){
		for(var i = 0; i < srmArray.length; i++){
			srmArray[i].draw();
		}
	}

	// Draw the diagrams
	if(currentDay >= 1){
		for(var i = 0; i < stressArray.length; i++){
			stressArray[i].draw(progress, stress - 100);
			productivityArray[i].draw(progress, productivity);
		}
	}

	for(var i = 0; i < ablenkungen.length; i++){
		ablenkungen[i].draw();
	}

	textSize(12);

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

	// TIME START

	textAlign(LEFT);
	text("08:00", x, 96);

	textAlign(RIGHT);
	text("17:00", x + w, 96);

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

	// CURRENT TIME
	textAlign(CENTER);
	textSize(20);
	if(currentTimeHours < 10){
		if(currentTimeMinutes < 10){
			text("0" + currentTimeHours + ":0" + currentTimeMinutes, x - 4, y - 16);
		} else {
			text("0" + currentTimeHours + ":" + currentTimeMinutes, x - 4, y - 16);
		}
	} else {
		if(currentTimeMinutes < 10){
			text(currentTimeHours + ":0" + currentTimeMinutes, x - 4, y - 16);
		} else {
			text(currentTimeHours + ":" + currentTimeMinutes, x - 4, y - 16);
		}
	}
	
	textSize(12);

	// indicators

	// productivity
	fill(255);
	ellipse(x, ((y + 126) - (productivity) / 112 * 100) + 10 + ((currentDay - 1) * 124), 10, 10);

	// stress
	fill(c_red);
	ellipse(x, ((y + 126) - ((stress - 100) / 112 * 100)) + 10 + ((currentDay - 1) * 124), 10, 10);

	// indicatior text

	textAlign(LEFT);
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
			stress = 0;
			gesamterGewinn += wertDesMitarbeiters * (currentTimeHours - 8) * 60 + currentTimeMinutes;
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

	if(editMode){
		for(var i = 0; i < srmStash.length; i++){
			srmStash[i].draw();
		}
		for(var i = 0; i < srmArray.length; i++){
			srmArray[i].draw();
		}
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

	// Line --> Wie viel könnte erarbeitet werden
	fill(255);
	var potentiellerGewinn = wertDesMitarbeiters * (currentTimeHours - 8) * 60 + currentTimeMinutes + gesamterGewinn;
	textAlign(CENTER);
	text("Potentieller Gewinn:\n" + round(potentiellerGewinn) + "€", width / 100 * 94, 120);

	// Water
	fill(c_red.levels[0], c_red.levels[1], c_red.levels[2], 200);
	var y = height - ((((verlust / potentiellerGewinn * 100)) / 100) * height);
	rect(width / 100 * 88, y, width / 100 * 12, height);

	fill(255);
	text("Verlust durch\ndigitalen Stress:\n", width / 100 * 94, height - 120);
	textSize(20);
	text(round(verlust) + "€", width / 100 * 94, height - 60);
}

var calculation = function(){

	// Zufällige Ablenkung --> Ca alle 20 Minuten?
	var newDistraction = round(random(0,ablenkung / 5));
	if(newDistraction >= (ablenkung / 5) - 1){
		if(currentDay >= 1){
			ablenkungen.push(new Ablenkung(days[currentDay-1].x + progress, days[currentDay - 1].y + days[currentDay-1].height - (productivity / 120 * 100)));
			ablenkung += 1;
		}
		// Die Produktivität fällt durch die Ablenkung
		productivity = 20;
	}

	// Produktiviät = -28% bei 100% Ablenkung	
	//productivity = 100 - (ablenkung / 100 * 28);
	if(productivity < 100){
		// 20 Minuten um wieder voll produktiv zu sein
		productivity += 5;
	}
	// Stress erhöht sich je länger der Tag geht, 200 ist das maximale Stresslevel
	if(stress < 200){
		stress = 100 + ((currentTimeHours * 60 + currentTimeMinutes) / 20) + random(0,1) + (oldStress / 10);
		if(stress > 200){
			stress = 200;
		}
	} else {
		stress = 200;
	}
	krankheitstage = (stress * 2) / 365 / 8 / 60;

	// Einfluss der SRM
	for(var i = 0; i < srmArray.length; i++){
		if(progress > srmArray[i].startTime * pxProMinute && progress < srmArray[i].endTime * pxProMinute && srmArray[i].day == days[currentDay-1]){
			srmArray[i].influence();
		}
	}

	// Kein negativer Stress
	if(stress < 100){
		stress = 100;
	} else if(stress > 200){
		stress = 200;
	}

	// Verlustrechnung
	verlust += ((wertDesMitarbeiters * ((100 - productivity)) / 100) * mitarbeiter);
	verlust += wertDesMitarbeiters * krankheitstage;
}

var mouseReleased = function(){
	// reset drag and drop stuff
	for(var i = 0; i < srmArray.length; i++){
		if(srmArray[i].dragging == true && srmArray[i].onDay == false){
			srmArray.splice(i, 1);
		} else {
			srmArray[i].dragging = false;			
			srmArray[i].changingDuration = false;
		}
	}
	for(var i = 0; i < srmStash.length; i++){		
		srmStash[i].done = false;
	}
	isDragging = false;
}
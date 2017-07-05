/*
Wasted - Business Unplugged
Prototype Version 0.1

IMD Semesterprojekt Sommersemester 2017

Elina Faber, Sabina Mujcinovic, Philipp Kaltofen


Known Bugs:
Auswirkungen von SRM nicht ganz fertig implementiert
Reset von Simulation fehlt noch

*/

p5.disableFriendlyErrors = true;

var c_red;
var c_blue;
var c_lightblue;
var c_verylightblue;
var c_turq;

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
var ablenkungFrequency;

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

var onSRM;

// fonts

var f_Roboto;
var f_FontAwesome;

var preload = function() {
   f_Roboto = loadFont('../assets/Roboto-Regular.ttf');
   f_FontAwesome = loadFont('../assets/FontAwesome.otf');
}

var setup = function(){
	createCanvas(windowWidth, windowHeight);
	background(255, 255, 255, 0);

	textFont(f_Roboto);

	// Set our main colors
	c_red = color(222, 82, 66);
	// 29, 29, 36
	c_blue = color(29, 29, 36);
	c_lightblue = color(33, 34, 41);
	c_verylightblue = color(56, 56, 71);
	// 87, 87, 109
	c_yellow = color(0, 105, 146); // Blau

	// Create the Days
	var x = (width / 100 * 12) + ((width / 100 * 76) / 100 * 5);
	var w = width - (x * 2);
	days = [];
	dayLabels = ["MO", "DI", "MI", "DO", "FR"];
	for(var i = 1; i < 6; i++){
		days.push(new Day(x, 124 * i, w, 120, dayLabels[i-1], c_lightblue, c_verylightblue));
	}

	// Simulation playing
	playing = false; // Simulation wird abgespielt
	playMode = false; // Im Simulationsmodus
	editMode = true; // Im Bearbeitenmodus

	// Declare variables for the timeline
	timeStart = 8; // Stunden
	timeEnd = 17; // Stunden
	currentTime = timeStart;
	currentTimeMinutes = 0;
	currentDay = 0;

	days[currentDay].backgroundLabel = c_yellow;

	// Set start values for the calculation
	stress = 0; // Prozent
	productivity = 100; // Prozent
	verlust = 0; // Euro
	mitarbeiter = 1;
	krankheitstage = 0; // Tage
	gehalt = 21 * 8; // Euro
	wertDesMitarbeiters = gehalt * 4.29 / 8 / 60; // Euro
	ablenkung = 100; // Prozent
	ablenkungFrequency = 20; // Durchschnitt in Minuten
	oldStress = 0; // Prozent an Stress der vom vorherigen Tag mitgenommen wird

	pxProMinute = w / 540; // Pixel
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

	srmStash = [];
	srmStash.push(new Srm(0, width / 100 * 6 - 28, height / 2 - 128, "Yoga", days));
	srmStash.push(new Srm(0, width / 100 * 6 - 28, height / 2, "Autogenes\nTraining", days));
	srmStash.push(new Srm(0, width / 100 * 6 - 28, height / 2 + 128, "Social Media\nBlocking", days));
	srmStash.push(new Srm(0, width / 100 * 6 - 28, height / 2 + 128 * 2, "Mail Sperre", days));

	isDragging = false;

	ablenkungen = [];

	gesamterGewinn = 0; // Euro

	onSRM = false;
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

	if(playMode){
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

	// Draw the top left sidebar
	leftTop();
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

	fill(c_yellow);
	rect(x, 107, progress, 8);

	// TIME START

	textFont("Arial");
	fill(255);
	textAlign(LEFT);
	text("08:00", x, 96);

	textAlign(RIGHT);
	text("17:00", x + w, 96);
	
	textFont(f_Roboto);

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
	textSize(20);	// wird warum auch immer ignoriert	
	textFont("Arial");
	if(currentTimeHours < 10){
		if(currentTimeMinutes < 10){
			text("0" + currentTimeHours + ":0" + currentTimeMinutes, x - 4, y - 24);
		} else {
			text("0" + currentTimeHours + ":" + currentTimeMinutes, x - 4, y - 24);
		}
	} else {
		if(currentTimeMinutes < 10){
			text(currentTimeHours + ":0" + currentTimeMinutes, x - 4, y - 24);
		} else {
			text(currentTimeHours + ":" + currentTimeMinutes, x - 4, y - 24);
		}
	}
	textFont(f_Roboto);
	
	textSize(12);

	// indicators

	// productivity
	fill(255);
	ellipse(x, ((y + 126) - (productivity) / 112 * 100) + 10 + ((currentDay - 1) * 124), 10, 10);

	// stress
	fill(c_red);
	ellipse(x, ((y + 126) - ((stress - 100) / 112 * 100)) + 10 + ((currentDay - 1) * 124), 10, 10);

	// indicatior text

	if(onSRM){
		fill(c_blue);
	} else {
		fill(255);
	}

	textAlign(LEFT);
	textSize(16);
	text(productivity + "%", x + 16, ((y + 126) - (productivity) / 112 * 100) + 10 + ((currentDay - 1) * 124));
	text(round(stress - 100) + "%", x + 16, ((y + 126) - ((stress - 100) / 112 * 100)) + 10 + ((currentDay - 1) * 124));
	textSize(10);
	text("\nProduktiviaet", x + 16, ((y + 126) - (productivity) / 112 * 100) + 10 + ((currentDay - 1) * 124));
	text("\nStress", x + 16, ((y + 126) - ((stress - 100) / 112 * 100)) + 10 + ((currentDay - 1) * 124));

}

var timeLineReset = function(){
	fill(c_blue);
	var x = (width / 100 * 12) + ((width / 100 * 76) / 100 * 5);
	var w = width - (x * 2);
	rect(x, 107, w + 20, 8);

	// next Day

	if(currentDay < days.length){		
		days[currentDay].backgroundLabel = c_yellow;
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

var leftTop = function(){
	// background
	fill(c_lightblue);
	rect(0,0, width / 100 * 12, 224);

	// logo

	// controls
	textAlign(CENTER);
	// left
	if(editMode){
		fill(c_yellow);
	} else {
		fill(c_verylightblue)
	}
	rect(0, 124, width / 100 * 6, 80);

	// Icon
	textFont(f_FontAwesome);
	fill(255);
	textSize(30);
	text("", width / 100 * 3, 176);
	textFont(f_Roboto);
	// right
	if(playMode){
		fill(c_yellow);
	} else {
		fill(c_verylightblue)
	}
	rect(width / 100 * 6, 124, width / 100 * 6, 80);

	// Icon
	textFont(f_FontAwesome);
	fill(255);
	textSize(30);
	text("", width / 100 * 9, 176);
	textFont(f_Roboto);

	// time control
	// show only in play mode
	if(playMode){
		fill(c_verylightblue);
		rect(0, 212, width / 100 * 12, 40);

		// buttons
		// left -- DELETE
		if(mouseX > 0 && mouseX < width / 100 * 4 && mouseY > 212 && mouseY < 262){
			// hover effect
			fill(c_yellow);
			// on click
			if(mouseIsPressed){

			}
		} else {
			fill(c_verylightblue)
		}
		// left content
		rect(0, 212, width / 100 * 4, 40);
		// Icon
		textFont(f_FontAwesome);
		fill(255);
		textSize(18);
		text("", width / 100 * 2, 238);

		// middle -- PAUSE
		if(mouseX > width / 100 * 4 && mouseX < width / 100 * 8 && mouseY > 212 && mouseY < 262){
			// hover effect
			fill(c_yellow);
			// on click
			if(mouseIsPressed){
				playing = false;
			}
		} else {
			fill(c_verylightblue)
		}
		// middle content
		rect(width / 100 * 4, 212, width / 100 * 4, 40);
		// Icon
		textFont(f_FontAwesome);
		fill(255);
		textSize(18);
		text("", width / 100 * 6, 238);

		// right -- PLAY
		if(mouseX > width / 100 * 8 && mouseX < width / 100 * 12 && mouseY > 212 && mouseY < 262){
			// hover effect
			fill(c_yellow);
			console.log("RIGHT");
			// on click
			if(mouseIsPressed){
				playing = true;
			}
		} else {
			fill(c_verylightblue)
		}
		// right content
		rect(width / 100 * 8, 212, width / 100 * 4, 40);
		// Icon
		textFont(f_FontAwesome);
		fill(255);
		textSize(18);
		text("", width / 100 * 10, 238);
		textFont(f_Roboto);
	}
}

var leftSidebar = function(){
	// background for SRM
	fill(c_lightblue);
	rect(0, 224, width / 100 * 12, height - 224);

	// play Button
	if(dist(mouseX, mouseY, width / 100 * 9, 164) < 40 && mouseIsPressed){
		playing = true;
		playMode = true;
		editMode = false;
	}
	// edit Button
	if(dist(mouseX, mouseY, width / 100 * 3, 164) < 40 && mouseIsPressed){
		playing = false;
		playMode = false;
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
	var potentiellerGewinn = (wertDesMitarbeiters * (currentTimeHours - 8) * 60 + currentTimeMinutes + gesamterGewinn) * mitarbeiter;
	if(isNaN(potentiellerGewinn)){
		potentiellerGewinn = 0;
	}
	textAlign(CENTER);
	textSize(20);
	text(round(potentiellerGewinn) + "€", width / 100 * 94, 100);
	textSize(10);
	text("Potenzielle Tagesleistung", width / 100 * 94, 120);

	// Water
	fill(c_red.levels[0], c_red.levels[1], c_red.levels[2], 200);
	var y = height - ((((verlust / potentiellerGewinn * 100)) / 100) * height);
	rect(width / 100 * 88, y, width / 100 * 12, height);

	fill(255);	
	textSize(20);
	text(round(verlust) + "€", width / 100 * 94, height - 120);
	textSize(10);
	text("Verlust durch\ndigitalen Stress", width / 100 * 94, height - 100);
}

var calcAblenkung = function(){
	// Zufällige Ablenkung --> Wahrscheinlichkeit abhängig von ablenkungFrequency --> 1 : ablenkungFrequency
	var newDistraction = round(random(0, ablenkungFrequency));
	console.log(newDistraction);
	// Wenn die aF 0 ist = keine Ablenkung
	if(ablenkungFrequency == 0){
		return ablenkung;
	}
	// Wenn random(0, aF) >= aF dann neue Ablenkung
	if(newDistraction >= ablenkungFrequency){
		if(currentDay >= 1){
			ablenkungen.push(new Ablenkung(days[currentDay-1].x + progress, days[currentDay - 1].y + 24)); // + days[currentDay-1].height - (productivity / 120 * 100)
			ablenkung += 1;
		}
		// Die Produktivität fällt durch die Ablenkung
		productivity = 20;
	}
	return ablenkung;
}

var calcStress = function(){
	// Stress erhöht sich je länger der Tag geht, 200 ist das maximale Stresslevel
	if(stress < 200){
		stress = 100 + ((currentTimeHours * 60 + currentTimeMinutes) / 20) + random(0,1) + (oldStress / 10);
		if(stress > 200){
			stress = 200;
		}
	} else {
		stress = 200;
	}
	return stress;
}

var calcProductivity = function(){
	// Produktiviät = -28% bei 100% Ablenkung	
	//productivity = 100 - (ablenkung / 100 * 28);
	if(productivity < 100){
		// 20 Minuten um wieder voll produktiv zu sein
		productivity += 5;
	}
	return calcProductivity;
}

var calcKrankheitstage = function(){
	krankheitstage = (stress * 2) / 365 / 8 / 60;
	return krankheitstage;
}

var calcVerlust = function(){
	// Verlustrechnung
	verlust += ((wertDesMitarbeiters * ((100 - productivity)) / 100) * mitarbeiter);
	verlust += wertDesMitarbeiters * krankheitstage;
	return verlust;
}

var calculation = function(){

	calcAblenkung();
	calcProductivity();
	calcKrankheitstage();
	calcStress();

	// Einfluss der SRM

	var SRMcheck = false;

	for(var i = 0; i < srmArray.length; i++){
		if(progress > srmArray[i].startTime * pxProMinute && progress < srmArray[i].endTime * pxProMinute && srmArray[i].day == days[currentDay-1] && onSRM == false){
			srmArray[i].influence();
			onSRM = true;
			SRMcheck = true;
		}
	}

	if(SRMcheck == false){
		onSRM = false;
	}

	// Kein negativer Stress
	if(stress < 100){
		stress = 100;
	} else if(stress > 200){
		stress = 200;
	}

	calcVerlust();

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
class Srm{
	constructor(type, x, y, label, days){
		this.type = type;

		this.duration = 120;

		// Influences on other variables
		this.i_pro = 0;
		this.i_stress = 0;
		this.i_ablenkung = 0;
		this.i_krankheitstage = 0;
		this.i_ablenkungFrequency = 0;

		this.label = label;

		this.position = createVector(x,y);
		this.day = null;
		this.days = days;

		this.dragging = false;
		this.changingDuration = false;
		// Side thats changing
		this.cdSide = 0;

		this.onDay = false;
		this.placed = false;

		this.x = (width / 100 * 12) + ((width / 100 * 76) / 100 * 5);
		this.w = width - (x * 2);

		this.startTime = round((this.position.x - x) / pxProMinute);
		this.endTime = round((this.position.x - x + this.duration) / pxProMinute);

		// only 1 new srm when clicked
		this.done = false;

		// Set influences based on type
		// 1: Yoga
		// 2: Sport
		// 3: Social Media Blocking
		// 4: Email Begrenzung
		switch(this.type){
			case 0:		
				break;
			case 1:
				// YOGA
				this.i_pro = 0;
				this.i_stress -= 10;
				this.i_ablenkung = 0;
				this.i_krankheitstage -= 15;
				break;
			case 2:
				// SPORT
				this.i_pro += 10;
				this.i_stress -= 15;
				this.i_ablenkung = 0;
				this.i_krankheitstage -= 15; // ?
				break;
			case 3:
				// SOCIAL MEDIA BLOCKING
				this.i_pro -= 5;
				this.i_stress -= 10;
				this.i_ablenkung -= 15;
				this.i_krankheitstage -= 0;
				this.i_ablenkungFrequency -= 100;
				break;
			case 4:
				// EMAIL BEGRENZUNG
				this.i_pro -= 10;
				this.i_stress -= 20;
				this.i_ablenkung -= 30;
				this.i_krankheitstage -= 0;
				break;
		}
	}

	influence(){
		switch(this.type){
			case 0:		
				break;
			case 1:
				// YOGA
				this.i_pro = 0;
				this.i_stress -= 10;
				this.i_ablenkung = 0;
				this.i_krankheitstage -= 15;
				productivity = this.i_pro;
				ablenkungFrequency = this.i_ablenkung;
				break;
			case 2:
				// SPORT
				this.i_pro += 10;
				this.i_stress -= 15;
				this.i_ablenkung = 0;
				this.i_krankheitstage -= 15; // ?
				break;
			case 3:
				// SOCIAL MEDIA BLOCKING
				this.i_pro = 95;
				this.i_stress -= 10;
				this.i_ablenkung -= 15;
				this.i_krankheitstage -= 0;
				this.i_ablenkungFrequency -= 100;
				break;
			case 4:
				// EMAIL BEGRENZUNG
				this.i_pro -= 10;
				this.i_stress -= 20;
				this.i_ablenkung -= 30;
				this.i_krankheitstage -= 0;
				break;
		}

		/*
		productivity += this.i_pro;
		stress += this.i_stress;
		ablenkung += this.i_ablenkung;
		krankheitstage += this.i_krankheitstage;
		ablenkungFrequency += this.i_ablenkungFrequency;
		*/
	}

	calculateTime(){
		this.startTime = round((this.position.x - this.x) / pxProMinute);
		this.endTime = round((this.position.x - this.x + this.duration) / pxProMinute);
	}

	draw(){

		// Border
		if(this.onDay){
			if(this.dragging){
				fill(255,255,255, 0);
			} else {
				fill(c_blue);
			}				
			rect(this.position.x - 4, this.position.y, this.duration + 8, 120);
		}

		// SRM itself
		if(this.type != 0){			
			fill(255);
		} else {
			fill(c_verylightblue);
		}
		if(this.dragging){
			fill(255,255,255, 200);
		}
		if(this.onDay == false && this.type != 0){
			fill(255, 255, 255, 20);
		}
		rect(this.position.x, this.position.y, this.duration, 120);
		textAlign(CENTER);		
		if(this.type != 0){			
			fill(0);
		} else {
			fill(255);
		}
		textSize(18);
		text(this.label, this.position.x + this.duration / 2, this.position.y + 70);

		// duration interaction indicator
		if(this.onDay && editMode){
			// Sides background
			/*
			fill(c_verylightblue);
			rect(this.position.x, this.position.y, 16, 120);			
			rect(this.position.x + this.duration - 16, this.position.y, 16, 120);
			*/
			// Handles
			fill(c_verylightblue);
			// Left			
			rect(this.position.x + 4, this.position.y + 44, 1, 24);
			rect(this.position.x + 8, this.position.y + 44, 1, 24);
			// Right
			rect(this.position.x + this.duration - 6, this.position.y + 44, 1, 24);
			rect(this.position.x + this.duration - 10, this.position.y + 44, 1, 24);

			// Arrows			
			fill(c_yellow);
			triangle(this.position.x, this.position.y + 115, this.position.x + 8, this.position.y + 108, this.position.x + 16, this.position.y + 115);
			triangle(this.position.x + this.duration - 16, this.position.y + 115, this.position.x + this.duration - 8, this.position.y + 108, this.position.x + this.duration, this.position.y + 115);

			// Border
			rect(this.position.x, this.position.y + 115, this.duration, 5);

			// Time
			textFont("Arial");
			textSize(10);
			fill(c_blue);
			textAlign(LEFT);
			// Start
			var m = this.startTime % 60;
			var h = 8 + round(this.startTime / 60);
			var t = 0;
			if(m < 10){
				if(h < 10){
					t = "0" + h + ":0" + (this.startTime % 60);
				} else {
					t = h + ":0" + (this.startTime % 60);
				}
			} else {
				if(h < 10){
					t = "0" + h + ":" + (this.startTime % 60);
				} else {
					t = h + ":" + (this.startTime % 60);
				}
			}
			text(t, this.position.x + 18, this.position.y + 110);
			// End
			textAlign(RIGHT);
			m = this.endTime % 60;
			h = 8 + round(this.endTime / 60);
			t = 0;
			if(m < 10){
				if(h < 10){
					t = "0" + h + ":0" + (this.endTime % 60);
				} else {
					t = h + ":0" + (this.endTime % 60);
				}
			} else {
				if(h < 10){
					t = "0" + h + ":" + (this.endTime % 60);
				} else {
					t = h + ":" + (this.endTime % 60);
				}
			}
			text(t, this.position.x + this.duration -  18, this.position.y + 110);
			textFont(f_Roboto);
		}

		// Disable functionality if type 0 --> sidebar
		if(this.type != 0){

		this.calculateTime();
		// Drag and Drop

		// Increase duration
		// Left side
		if(this.dragging == false){
			if((mouseX > this.position.x && mouseX < this.position.x + 16 && mouseY > this.position.y && mouseY < this.position.y + 112 && mouseIsPressed) || (this.changingDuration == true && this.cdSide == 0)){
				this.changingDuration = true;
				this.cdSide = 0;
				// increase - decrease
				// if mouse is not outside of the day
				if(mouseX > this.x + 16 && mouseX < width - this.x - 16){
					if(pmouseX > mouseX){
						this.position.x = mouseX;
						this.duration += pmouseX - mouseX;
					} else {
						this.position.x = mouseX;
						this.duration -= mouseX - pmouseX;
					}
				}
			} else
			// Right side
			if((mouseX > this.position.x + this.duration - 16 && mouseX < this.position.x + this.duration && mouseY > this.position.y && mouseY < this.position.y + 112 && mouseIsPressed) || (this.changingDuration == true && this.cdSide == 1)){
				this.changingDuration = true;
				this.cdSide = 1;
				// increase - decrease
				if(mouseX > this.x + 16 && mouseX < width - this.x - 16){
					if(pmouseX < mouseX){
						this.duration += mouseX - pmouseX;
					} else {
						this.duration -= pmouseX - mouseX;
					}
				}
			}
		}

		// Move
		if(this.changingDuration == false){
			if(mouseX > this.position.x + 16 && mouseX < this.position.x + this.duration - 16 && mouseY > this.position.y && mouseY < this.position.y + 112 && mouseIsPressed){
				if(editMode){
					this.dragging = true;
					this.onDay = false;
				}
			}
		}		

		if(this.dragging == true){
			// Outside of Day Area
			if(((this.position.x + 60) < (width / 100 * 12) + ((width / 100 * 76) / 100 * 5))){
				this.position.x = mouseX - this.duration / 2;
				this.position.y = mouseY - 60;
				this.onDay = false;
			} else {
				// Find nearest day
				if(this.day == null){
					this.day = this.days[0];
				}
				for(var i = 0; i < this.days.length; i++){
					if(dist(0, this.day.y + 62, 0, mouseY) > dist(0, this.days[i].y, 0, mouseY)){
						this.day = this.days[i];
					}					
					this.position.y = this.day.y;
					this.position.x = mouseX - this.duration / 2;
				}
				this.onDay = true;
			}
		}

		} else {
			if(mouseX > this.position.x + 16 && mouseX < this.position.x + this.duration - 16 && mouseY > this.position.y && mouseY < this.position.y + 112 && mouseIsPressed && this.done == false){
				srmArray.push(new Srm(1, mouseX - 60, mouseY - 60, this.label, days));
				for(var i = 0; i < srmStash.length; i++){
					srmStash[i].done = true;
				}
			}
		}
	}
}
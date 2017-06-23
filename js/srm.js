class Srm{
	constructor(type, x, y, label, days){
		this.type = type;

		this.duration = 120;

		// Influences on other variables
		this.i_pro = 0;
		this.i_stress = 0;
		this.i_ablenkung = 0;
		this.i_krankheitstage = 0;
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

		// Set influences based on type
		// 1: Yoga
		// 2: Sport
		// 3: Social Media Blocking
		// 4: Email Begrenzung
		switch(this.type){
			case 1:
				break;
		}
	}

	draw(){

		// Border
		if(this.onDay){
			fill(c_blue);
			rect(this.position.x - 4, this.position.y, this.duration + 8, 120);
		}

		// SRM itself
		fill(255);
		rect(this.position.x, this.position.y, this.duration, 120);
		textAlign(CENTER);
		fill(0);
		textSize(18);
		text(this.label, this.position.x + this.duration / 2, this.position.y + 70);

		// duration interaction indicator
		if(this.onDay){
			fill(c_verylightblue);
			rect(this.position.x, this.position.y, 16, 120);			
			rect(this.position.x + this.duration - 16, this.position.y, 16, 120);
			fill(255);
			rect(this.position.x + 4, this.position.y + 30, 2, 60);
			rect(this.position.x + 8, this.position.y + 30, 2, 60);
			rect(this.position.x + this.duration - 4, this.position.y + 30, 2, 60);
			rect(this.position.x + this.duration - 8, this.position.y + 30, 2, 60);
		}

		// Drag and Drop

		// Increase duration
		// Left side
		if(this.dragging == false){
			if((mouseX > this.position.x && mouseX < this.position.x + 16 && mouseY > this.position.y && mouseY < this.position.y + 112 && mouseIsPressed) || (this.changingDuration == true && this.cdSide == 0)){
				this.changingDuration = true;
				this.cdSide = 0;
				// increase - decrease
				if(pmouseX > mouseX){
					this.position.x = mouseX;
					this.duration += pmouseX - mouseX;
				} else {
					this.position.x = mouseX;
					this.duration -= mouseX - pmouseX;
				}
			} else
			// Right side
			if((mouseX > this.position.x + this.duration - 16 && mouseX < this.position.x + this.duration && mouseY > this.position.y && mouseY < this.position.y + 112 && mouseIsPressed) || (this.changingDuration == true && this.cdSide == 1)){
				this.changingDuration = true;
				this.cdSide = 1;
				// increase - decrease
				if(pmouseX < mouseX){
					this.duration += mouseX - pmouseX;
				} else {
					this.duration -= pmouseX - mouseX;
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
	}
}
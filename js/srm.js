class Srm{
	constructor(type, x, y, label){
		this.type = type;
		// Influences on other variables
		this.i_pro = 0;
		this.i_stress = 0;
		this.i_ablenkung = 0;
		this.i_krankheitstage = 0;
		this.label = label;

		this.position = createVector(x,y);
		this.day = null;

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
		fill(255);
		rect(this.position.x, this.position.y, 112, 112);
		textAlign(CENTER);
		text(this.label, this.position.x + 32, this.position.y + 32);

		// Drag and Drop
		if(mouseX > this.position.x && mouseX < this.position.x + 112 && mouseY > this.position.y && mouseY < this.position.y + 112 && mouseIsPressed){
			this.position.x = mouseX - 56;
			this.position.y = mouseY - 56;
		}
	}
}
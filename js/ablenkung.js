class Ablenkung{
	constructor(x, y, dia){
		this.position = createVector(x,y);
		this.dia = dia;
		this.type = this.newType();
	}

	draw(){
		fill(255);
		noStroke();
		textSize(16);
		textAlign(CENTER);
		textFont(f_FontAwesome);
		text(this.type, this.position.x, this.position.y);
		// ellipse(this.position.x, this.position.y, 5, 5);
	}

	newType(){
		var types = ["", "", ""];
		return types[round(random(0, types.length - 1))];
	}
}
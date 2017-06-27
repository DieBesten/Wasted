class Ablenkung{
	constructor(x, y, dia){
		this.position = createVector(x,y);
		this.dia = dia;
		this.type = this.newType();
	}

	draw(){
		fill(255);
		textSize(10);
		textAlign(CENTER);
		text(this.type, this.position.x, this.position.y);
	}

	newType(){
		var types = ["Email", "Facebook", "Tinder"];
		return types[round(random(0, types.length - 1))];
	}
}
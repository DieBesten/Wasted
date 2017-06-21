class Dia{
	constructor(day, type, c_Stroke, c_Fill, distance){
		this.day = day;
		this.type = type;
		this.data = [];
		this.distance = distance;
		this.c_Stroke = c_Stroke;
		this.c_Fill = c_Fill;
	}

	draw(progress, stress){
		if(this.type == 0){

			// TYPE 0 --> Filled, no Stroke

			fill(this.c_Fill);
			stroke(this.c_Stroke);
			beginShape();
			vertex(this.day.x, this.day.y + this.day.height);
			for(var i = 0; i < this.data.length; i++){
				vertex(this.day.x + this.distance * (i + 1), (this.day.y + this.day.height) - this.data[i]);	
			}
			vertex(this.day.x + progress, (this.day.y + this.day.height) - stress);
			vertex(this.day.x + progress, (this.day.y + this.day.height));
			// console.log(progress);
			endShape(CLOSE);
		} else {
			
			// TYPE 1 --> Stroke und Transparent

			// Area
			fill(20, 20, 20, 50);
			beginShape();
			vertex(this.day.x, this.day.y + this.day.height);
			for(var i = 0; i < this.data.length; i++){
				vertex(this.day.x + this.distance * (i + 1), (this.day.y + this.day.height) - this.data[i]);	
			}
			vertex(this.day.x + progress, (this.day.y + this.day.height) - stress);
			vertex(this.day.x + progress, (this.day.y + this.day.height));
			// console.log(progress);
			endShape(CLOSE);

			// Top Stroke
			stroke(this.c_Stroke);
			fill(255,255,255,0);
			beginShape();
			vertex(this.day.x, this.day.y + this.day.height);
			for(var i = 0; i < this.data.length; i++){
				vertex(this.day.x + this.distance * (i + 1), (this.day.y + this.day.height) - this.data[i]);	
			}
			vertex(this.day.x + progress, (this.day.y + this.day.height) - stress);
			vertex(this.day.x + progress, (this.day.y + this.day.height));
			// console.log(progress);
			endShape();
		}
	}

	addData(data){
		this.data.push(data);
	}
}
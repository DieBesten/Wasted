class Dia{
	constructor(day, type, c_Stroke, c_Fill, distance){
		this.day = day;
		this.type = type;
		this.data = [];
		this.distance = distance;
		this.c_Stroke = c_Stroke;
		this.c_Fill = c_Fill;
		this.finished = false;
	}

	draw(progress, value){
		// 224 = max height of diagram
		value = value / 112 * 100;
		if(this.finished == true){
			progress = this.day.width;	
		}
		if(this.type == 0){

			// TYPE 0 --> Filled, no Stroke

			fill(this.c_Fill);
			noStroke();
			beginShape();
			vertex(this.day.x, this.day.y + this.day.height);
			for(var i = 0; i < this.data.length; i++){
				vertex(this.day.x + this.distance * (i), (this.day.y + this.day.height) - this.data[i]);	
			}
			vertex(this.day.x + progress, (this.day.y + this.day.height) - value);
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
				vertex(this.day.x + this.distance * (i), (this.day.y + this.day.height) - this.data[i]);	
			}
			vertex(this.day.x + progress, (this.day.y + this.day.height) - value);
			vertex(this.day.x + progress, (this.day.y + this.day.height));
			endShape(CLOSE);

			// Top Stroke
			stroke(this.c_Stroke);
			fill(255,255,255,0);
			beginShape();
			vertex(this.day.x, this.day.y + this.day.height);
			for(var i = 0; i < this.data.length; i++){
				vertex(this.day.x + this.distance * (i), (this.day.y + this.day.height) - this.data[i]);	
			}
			vertex(this.day.x + progress, (this.day.y + this.day.height) - value);
			vertex(this.day.x + progress, (this.day.y + this.day.height));
			endShape();
		}
	}

	addData(data){
		this.data.push(data);
	}

	end(){
		this.finished = true;
	}
}
class Day{
	constructor(x, y, width, height, label, background, backgroundLabel){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.label = label;
		this.background = background;
		this.backgroundLabel = backgroundLabel;
		this.active = false;
	}

	draw(){
		// Label for Day
		fill(this.backgroundLabel);
		rect(this.x, this.y, 16, this.height);
		fill(255);
		textAlign(LEFT);
		push();
		translate(this.x + 12, this.y + 112);
		rotate(radians(-90));
		text(this.label, 0, 0);
		pop();

		// Day Area Background
		fill(this.background);
		rect(this.x + 16, this.y, this.width - 16, this.height);

	}

	setActive(b){
		this.active = b;
	}
}
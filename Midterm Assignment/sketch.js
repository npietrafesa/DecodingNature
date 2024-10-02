let drawer;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(80);
  drawer = new Drawer(10000, 15);
  drawer2 = new Drawer(20000, 5);
  drawer3 = new Drawer(30000, 1);
  stroke(255);
  drawer.makeLines();
  stroke(150);
  drawer.makeLines();
  stroke(255, 0, 0);
  drawer2.makeLines();
  stroke(0, 0, 255);
  drawer3.makeLines();
  stroke(50, 100, 255);
  drawer3.makeLines();
  stroke(255, 255, 0);
  drawer3.makeLines();
}

function draw() {}

function mouseClicked() {
  background(50);
    stroke(255);
  drawer.makeLines();
  stroke(150);
  drawer.makeLines();
  stroke(255, 0, 0);
  drawer2.makeLines();
  stroke(0, 0, 255);
  drawer3.makeLines();
  stroke(50, 100, 255);
  drawer3.makeLines();
  stroke(255, 255, 0);
  drawer3.makeLines();
}

class Drawer {
  constructor(seg, swScale) {
    this.seg = seg;
    this.swScale = swScale;
    this.sw = width * random(0.0002, 0.005);
    this.frame = width * 0.05;
    this.angVary = PI * 0.02;
    this.edgeBuff = height * 0.08;
    this.lineLength = height * 0.001;
    this.x = round(random(width));
    this.y = round(random(height));
    this.prevX = this.x;
    this.prevY = this.y;
    this.ang = random(PI * 2);
    if (random(2) < 1) {
      this.ang = PI * 0.25;
    } else {
      this.ang = PI * 0.75;
    }
  }
  makeLines() {
    for (let i = 0; i < this.seg; i++) {
      this.ang = this.ang + random(-this.angVary, this.angVary);
      this.x = this.lineLength * sin(this.ang) + this.x;
      this.y = this.lineLength * cos(this.ang) + this.y;
      if (
        this.x > width ||
        this.x < 0 ||
        this.y > height ||
        this.y < 0
      ) {
        this.ang += 0.2;
      }
      this.sw += width * random(-0.00003, 0.00003);
      this.sw = constrain(this.sw, width * 0.0001, width * 0.009);
      strokeWeight(this.sw * this.swScale);
      line(this.prevX, this.prevY, this.x, this.y);
      this.prevX = this.x;
      this.prevY = this.y;
      if (random(1000) < 1) {
        this.sw = width * random(0.0002, 0.005);
        this.x = round(random(width));
        this.y = round(random(height));
        this.prevX = this.x;
        this.prevY = this.y;
        this.ang = random(PI * 2);
        if (random(2) < 1) {
          this.ang = PI * 0.25;
        } else {
          this.ang = PI * 0.75;
        }
      }
    }
  }
}

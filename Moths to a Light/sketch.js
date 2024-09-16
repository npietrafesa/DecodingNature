let img;
let moths = [];
let light;

function preload() {
  img = loadImage("porch.jpg");
}

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES)
  for (let i = 0; i < 10; i++) {
    moths.push(
      new Moth(random(-width / 2, width / 2), random(-height / 2, height / 2))
    );
  }
  light = new Light(-35, 0);
}

function draw() {
  background(220);
  image(img, 0, 0, width, height, 0, 0, img.width, img.height, COVER);
  translate(width / 2, height / 2);
  for (let i = 0; i < moths.length; i++) {
    moths[i].update(light);
    moths[i].display(light);
  }
}

class Moth {
  constructor(x, y) {
    this.size = random(8, 15)
    this.pos = createVector(x, y);
    this.prev = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0.5, 0.5);
    this.counter = 0;
  }

  move() {
    this.pos.add(this.vel);
    this.pos.add(random(-5,5), random(-5,5))
  }

  update(light) {
    let direction;
    direction = createVector(
      light.pos.x - this.pos.x,
      light.pos.y - this.pos.y
    );
    direction.normalize();

    this.vel.add(direction.mult(this.acc));
    this.vel.limit(10);
    this.move();
  }

  display(light) {
    noStroke();
    let distance = Math.abs(Math.sqrt(Math.pow(this.pos.x-light.pos.x, 2)+Math.pow(this.pos.y-light.pos.y, 2)))
    let theta = this.vel.heading() + PI / 2;
    map(distance, 0, height, 50, 200)
    fill(Math.abs(255-distance));
    push()
    translate(this.pos.x, this.pos.y)
    rotate(theta);
    ellipse(0, 0, this.size*0.6, this.size);
    if (this.counter%2 == 0) {
      rotate(290)
    } else {
      rotate(310)
    }
    fill(Math.abs(200-distance));
    ellipse(4, -2, this.size*0.8, this.size*0.5);
    ellipse(-4, -2, this.size*0.8, this.size*0.5);
    pop()
    this.counter++
  }
}

class Light {
  constructor(x, y) {
    this.pos = createVector(x, y);
  }

  attract(moth) {
    let force = p5.Vector.sub(this.pos, moth.pos);
    let distanceSq = constrain(force.magSq(), 25, 2500);
    let G = 1;
    let strength = (G * (this.m * moth.m)) / distanceSq;
    force.setMag(strength);
    moth.applyForce(force);
  }
}

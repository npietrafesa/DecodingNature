let rain = [];
let dropDensity = 3;
let dropVel = 0.8;
let dropAcc = 0.5;
let wind = 0;

let windSlider;
let densitySlider;

function setup() {
  createCanvas(600, 600);
  //adjust the direction the wind blows the rain
  windSlider = createSlider(-0.3, 0.3, 0, 0.1);
  windSlider.position(20, 10);
  windSlider.size(80);

  //adjust the density of the rain
  densitySlider = createSlider(1, 6, 1, 1);
  densitySlider.position(140, 10);
  densitySlider.size(80);
}

function draw() {
  background(0);
  noStroke();
  fill(255);
  text("Wind Direction: " + wind, 10, 50);
  wind = windSlider.value();
  text("Rain Density: " + dropDensity, 140, 50);
  dropDensity = densitySlider.value();

  //generate a number of raindrops based on the density
  for (let i = 0; i < dropDensity; i++) {
    rain.push(new Drop(dropVel, dropAcc, wind));
  }

  for (let i = 0; i < rain.length; i++) {
    rain[i].acc.x = wind;
    rain[i].step();
    rain[i].show();
    //delete raindrops when they hit the bottom of screen
    if (rain[i].pos.y > height + rain[i].len) {
      rain.splice(i, 1);
    }
  }
}

class Drop {
  constructor(vel, acc, angle) {
    this.len = random(10, 15);
    this.pos = createVector(random(width), -this.len);
    //slightly varying velocity so they all dont fall at the same exact speed
    this.vel = createVector(0, random(0.5, vel));
    this.acc = createVector(angle, acc);
  }
  step() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    //make sure the drops stay in bounds of screen
    if (this.pos.x > width) {
      this.pos.x = -this.len;
    }
    if (this.pos.x < -this.len) {
      this.pos.x = width;
    }
  }
  show() {
    //draw raindrop
    stroke(209, 255, 251);
    line(
      this.pos.x,
      this.pos.y,
      this.pos.x - this.vel.x,
      this.pos.y - this.len
    );
  }
}

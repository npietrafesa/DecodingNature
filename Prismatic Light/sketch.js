// Flowfield object
let flow;
// An ArrayList of vehicles
let vehicles = [];
let leader;

function setup() {
  //background(255)
  createCanvas(800, 800);
  blendMode(BLEND);
  // Make a new flow field with "resolution" of 10
  flow = new FlowField(10);
  leader = new Vehicle(
    random(width),
    random(height),
    random(2, 5),
    random(0.1, 0.5),
    true
  );
  for (let i = 0; i < 20; i++) {
    vehicles.push(
      new Vehicle(
        random(width),
        random(height),
        random(2, 5),
        random(0.1, 0.5),
        false
      )
    );
  }
}

function draw() {
  background(0, 5);
  for (let i = 0; i < vehicles.length; i++) {
    vehicles[i].follow(flow);
    vehicles[i].run();
  }
  //leader after so its on top
  leader.follow(flow);
  leader.run();
}

class Vehicle {
  constructor(x, y, ms, mf, isleader) {
    this.position = createVector(x, y);
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.r = 4;
    this.maxspeed = ms;
    this.maxforce = mf;
    this.red = random(100, 200);
    this.blue = random(100, 200);
    this.green = random(100, 200);
    this.origin = random(width);
    this.isLeader = isleader;
    this.distance = createVector(0, 0);
  }

  run() {
    this.update();
    this.borders();
    this.show();
  }

  // Implementing Reynolds' flow field following algorithm
  follow(flow) {
    // What is the vector at that spot in the flow field?
    let desired = flow.lookup(this.position);
    // Scale it up by maxspeed
    desired.mult(this.maxspeed);
    // Steering is desired minus velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force
    this.applyForce(steer);
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  // Method to update location
  update() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);
  }

  // Wraparound
  borders() {
    if (this.position.x < -this.r) {
      this.position.x = width + this.r;
      this.position.y = random(height);
      this.origin = random(width);
    }
    if (this.position.y < -this.r) {
      this.position.x = random(width);
      this.position.y = height + this.r;
      this.origin = random(width);
    }
    if (this.position.x > width + this.r) {
      this.position.x = -this.r;
      this.position.y = random(height);
      this.origin = random(width);
    }
    if (this.position.y > height + this.r) {
      this.position.y = -this.r;
      this.position.x = random(width);
      this.origin = random(width);
    }
  }
  show() {

    if (this.isLeader) { //leader is a white ball witha "glow"
      noStroke();
      fill(200, 50);
      circle(this.position.x, this.position.y, 50);
      fill(255);
      circle(this.position.x, this.position.y, 30);
    } else { //rest follow flow lines, but also draw a line from its position to leader
      stroke(this.red, this.blue, this.green, 150);
      strokeWeight(5);
      line(
        this.position.x,
        this.position.y,
        leader.position.x,
        leader.position.y
      );
    }
  }
}

class FlowField {
  constructor(r) {
    this.resolution = r;

    this.cols = width / this.resolution;
    this.rows = height / this.resolution;

    this.field = new Array(this.cols);
    for (let i = 0; i < this.cols; i++) {
      this.field[i] = new Array(this.rows);
    }

    // Reseed noise for a new flow field each time
    noiseSeed(random(10000));
    let xoff = 0;
    for (let i = 0; i < this.cols; i++) {
      let yoff = 0;
      for (let j = 0; j < this.rows; j++) {
        //use Perlin noise to create the vectors.
        let angle = map(noise(xoff, yoff), 0, 1, 0, TWO_PI);
        this.field[i][j] = p5.Vector.fromAngle(angle);
        yoff += 0.1;
      }
      xoff += 0.1;
    }
  }

  // Draw every vector
  show() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let w = width / this.cols;
        let h = height / this.rows;
        let v = this.field[i][j].copy();
        v.setMag(w * 0.5);
        let x = i * w + w / 2;
        let y = j * h + h / 2;
        stroke(100);
        strokeWeight(5);
        line(x, y, x + v.x, y + v.y);
      }
    }
  }

  //A function to return a p5.Vector based on a position
  lookup(position) {
    let column = constrain(
      floor(position.x / this.resolution),
      0,
      this.cols - 1
    );
    let row = constrain(floor(position.y / this.resolution), 0, this.rows - 1);
    return this.field[column][row].copy();
  }
}

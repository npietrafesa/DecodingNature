let drawer;
let times = -1;
let r;
let g;
let b;
let strokeScale;
let nSegments;
let isBW = false;
let generateButton;

function setup() {
  createCanvas(800, 600);
  background(50);
  //button to generate new painting
  generateButton = createButton("Generate");
  generateButton.mouseClicked(generatePainting);
  generateButton.size(200, 75);
  generateButton.position(0, height);
  generateButton.style("font-size", "20px");
  drawer = new Drawer(); //drawer object
}

function draw() {
  if (times == -1) {
    //default to -1, choose random color and random number for times. times = number of layers
    times = round(random(7, 12));
    r = round(random(255));
    g = round(random(255));
    b = round(random(255));
    strokeScale = round(random(5, 8)); //size of the lines
    nSegments = round(random(10000, 30000)); //segments of lines (length essentially)
  } else if (times == 0) {
    //at the final time, do a layer of white then black on top. looks nicer and more pollack-y to me
    noFill();
    stroke(255);
    drawer.makeLines(40000, 2);
    noStroke();
    fill(255);
    makeBlob(round(random(5, 15)));

    noFill();
    stroke(0);
    drawer.makeLines(100000, 2);
    noStroke();
    fill(0);
    makeBlob(round(random(5, 15)));
    times = -2;
  } else if (times == -2) {
    //when finished painting, do nothing
  } else {
    //main code for making the different layers
    noFill();
    stroke(r, g, b);
    drawer.makeLines(nSegments, strokeScale);
    noStroke();
    fill(r, g, b);
    makeBlob(round(random(10, 20)));
    //once done generating a layer, decide what to do next:
    // there is a 65% chance to modify the current color by making slightly lighter/darker. add a bit more randomness so that in the event it goes back to a previous color its still slightly different.
    if (random(1) < 0.65 && !isBW) {
      if (random(1) > 0.5) {
        r += 40 + round(random(10, 20));
        g += 40 + round(random(10, 20));
        b += 40 + round(random(10, 20));
      } else {
        r -= 40 - round(random(10, 20));
        g -= 40 - round(random(10, 20));
        b -= 40 - round(random(10, 20));
      }
      r = constrain(r, 0, 255);
      g = constrain(g, 0, 255);
      b = constrain(b, 0, 255);
    } else {
      // there is a 35% chance to do one of two things: pick a new random color, or make the next color either black or white. the isBW boolean is there to prevent the 65% chance to change the shade of black/white, and instead choose a new color.
      if (random(1) < 0.5 || isBW) {
        //choose new color
        r = round(random(255));
        g = round(random(255));
        b = round(random(255));
        isBW = false;
      } else {
        if (random(1) < 0.5) {
          // 50/50 for black or white
          r = 0;
          g = 0;
          b = 0;
        } else {
          r = 255;
          g = 255;
          b = 255;
        }
        isBW = true;
      }
    }
    //choose new line thickness and length
    strokeScale = round(random(2, 5));
    nSegments = round(random(10000, 40000));
    times--;
  }
}

function generatePainting() {
  //when button is pressed, reset the times and clear canvas
  background(50);
  times = -1;
}

function keyPressed() {
  //don't use this, the version that saves svgs also happens to break buttons, so I was forced to update the p5js version. this means saving svgs will not work. also wow when i updated to the latest verson of p5js my program runs wayyyyy faster
  if (keyCode === ENTER) {
    //save("test.svg");
  }
}

function makeBlob(num) {
  //this is the code that makes blobs, which intend to emulate paint drops
  for (let i = 0; i < num; i++) {
    //generate a numberof blobs based on what num is
    push();
    translate(
      random(width * 0.1, width - width * 0.1),
      random(height * 0.1, height - height * 0.1)
    ); //choose random location, then rotate the vertex randomly. then connect the vertexes and repeat this randomized rotation until the circle is complete. then repeat num times
    rotate(random(PI * 2));
    sizeInc = 10;
    let r = (startR = height * sizeInc * random(0.001, 0.002));
    beginShape();
    for (k = 0; k < PI * 2; k += 0.3) {
      r += r * random(-0.25, 0.25);
      if (k > PI * 1.5) {
        r = r + (startR - r) / 3;
      } else if (k > PI * 1.75) {
        r = r + (startR - r) / 7;
      }
      let x = cos(k) * r;
      let y = sin(k) * r;
      curveVertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
}

class Drawer {
  //drawer class, this draws all the lines
  constructor() {
    this.seg = 0;
    this.swScale = 0; //line width multiplier
    this.sw = width * random(0.0002, 0.005); //choose random line width
    this.angVary = PI * 0.02; //how much the line varies its path
    this.lineLength = height * 0.001; //length of each segment
    this.x = 0;
    this.y = 0;
    this.setXY(); //choose random starting position
  }
  setXY() {
    //choose random starting point, angle, and line width
    this.x = round(random(width * 0.1, width - width * 0.1));
    this.y = round(random(height * 0.1, height - height * 0.1));
    this.ang = random(PI * 2);
    if (random(2) < 1) {
      //randomly vary the angle a bit more
      this.ang = PI * 0.25;
    } else {
      this.ang = PI * 0.75;
    }
    this.sw = width * random(0.0002, 0.005); //set width
  }
  makeLines(seg, swScale) {
    //line drawer. creates a small segment that will connect and form a line. once in a while, end the line and start randomly in a new place
    this.seg = seg;
    this.swScale = swScale;
    beginShape();
    for (let i = 0; i < this.seg; i++) {
      this.ang = this.ang + random(-this.angVary, this.angVary); //randomly choose a direction for the line to go
      this.x = this.lineLength * sin(this.ang) + this.x; //add angle to xy coords
      this.y = this.lineLength * cos(this.ang) + this.y;
      if (
        width * 0.1 * sin(this.ang) + this.x > width + width * 0.05 ||
        width * 0.1 * sin(this.ang) + this.x < 0 - width * 0.05 ||
        height * 0.1 * cos(this.ang) + this.y > height + height * 0.05 ||
        height * 0.1 * cos(this.ang) + this.y < 0 - height * 0.05
      ) {
        //if the next segment will go too far out of bounds, have it turn so it doesnt do that
        this.ang += 0.2;
      }
      this.sw += width * random(-0.00005, 0.00005); //make the line width get slightly smaller/larger for each segment
      this.sw = constrain(this.sw, width * 0.0001, width * 0.009); //make sure its not too big or small
      strokeWeight(this.sw * this.swScale); //apply line width and scaling
      curveVertex(this.x, this.y); //connect the new point to the previous one
      if (random(1000) < 1) {
        //once in a while, stop the line and start a new one
        this.setXY();
        endShape();
        beginShape();
      }
    }
    endShape();
    this.reset();
  }
  reset() {
    //reset the position
    this.setXY();
  }
}

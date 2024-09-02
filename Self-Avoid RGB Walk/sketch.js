// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

let spacing = 10;
let cols;
let rows;
let grid;
let walker;

//all adjacent points on grid
let allOptions = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
];

function setup() {
  createCanvas(600, 600);
  cols = floor(width / spacing);
  rows = floor(height / spacing);
  background(0);
  //create grid for walker to travel on
  grid = new Array(cols);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(rows);
  }
  //every point on the grid starts unvisited
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = false;
    }
  }
  //the starting point is visited though
  grid[cols / 2][rows / 2] = true;
  walker = new Walker();
}

function draw() {
  walker.step();
  //end program if its stuck (has visited all adjacent points)
  if(walker.stuck) {
    noLoop();
  }
}

//checks to make sure the point is unvisited
function isValid(i, j) {
  if (i < 0 || i >= cols || j < 0 || j >= rows) {
    return false;
  }
  return !grid[i][j];
}

class Walker {
  constructor() {
    //starts in center
    this.x = cols / 2;
    this.y = rows / 2;
    this.stuck = false;
  }

  step() {
    //maps the point on the grid to a corresponding rgb color based on its location. since its 2d, idk what to do w blue so i just had it pick a random value
    stroke(map(this.x, 0, cols, 0, 255), map(this.y, 0, rows, 0, 255), random(255));
    strokeWeight(spacing * 0.5);
    point(this.x * spacing, this.y * spacing);

    //looks at all adjacent points, any that are visited are omitted as an option
    let options = [];
    for (let option of allOptions) {
      let newX = this.x + option.dx;
      let newY = this.y + option.dy;
      if (isValid(newX, newY)) {
        options.push(option);
      }
    }
    //chose a random direction to move in
    if (options.length > 0) {
      let step = random(options);
      
      //map the lines between the points
      strokeWeight(1);
      //stroke(255);
      beginShape();
      vertex(this.x * spacing, this.y * spacing);
      this.x += step.dx;
      this.y += step.dy;
      vertex(this.x * spacing, this.y * spacing);
      endShape();
      //signal that this point has been visited
      grid[this.x][this.y] = true;
    } else {
      //ends program if theres nowhere to go
      console.log(`I'm stuck!`);
      this.stuck = true;
    }
  }
}

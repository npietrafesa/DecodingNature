let spacing = 20; //determines length between points and how long the lines are
let cols;
let rows;
let depth;
let grid; //invisible grid that the walker moves along
let walker;
let font;
let path = []; //stores the coordinates that the walker has visited in order
let lerpX = 0;
let lerpY = 0;
let lerpZ = 0;
let reset; //reset button
let gridToggle;
let gridToggled = false;
let gridColor;
let gridColored = false;
let colorToggle;
let colorToggled = false;
let oscillateToggle;
let oscillateToggled = false;

//all adjacent points on grid
let allOptions = [
  { dx: 1, dy: 0, dz: 0 },
  { dx: -1, dy: 0, dz: 0 },
  { dx: 0, dy: 1, dz: 0 },
  { dx: 0, dy: -1, dz: 0 },
  { dx: 0, dy: 0, dz: 1 },
  { dx: 0, dy: 0, dz: -1 },
];

//have to preload fonts bc of webgl stuff
function preload() {
  font = loadFont("/assets/Inconsolata.otf");
}

function setup() {
  createCanvas(800, 800, WEBGL);
  cols = floor(width / spacing);
  rows = floor(height / spacing);
  depth = cols;
  background(0);

  //making buttons
  //reset button but hide it until the walker gets stuck
  reset = createButton("I'm stuck! Reset");
  reset.mouseClicked(resetWalker);
  reset.size(200, 100);
  reset.position(10, 10);
  reset.style("font-family", font);
  reset.style("font-size", "36px");
  reset.hide();

  //toggles a grid showing the bounds the path cannot travel beyond
  gridToggle = createButton("Toggle Grid");
  gridToggle.mouseClicked(toggleGrid);
  gridToggle.size(width / 4, 50);
  gridToggle.style("font-family", font);
  gridToggle.style("font-size", "20px");

  //maps the color of the grid to correspond with its point in RGB/HSB space.
  gridColor = createButton("Grid Color");
  gridColor.mouseClicked(toggleGridColor);
  gridColor.size(width / 4, 50);
  gridColor.position(width / 4, height);
  gridColor.style("font-family", font);
  gridColor.style("font-size", "20px");

  //swap between using RGB or HSB as the color system
  colorToggle = createButton("RGB/HSB");
  colorToggle.mouseClicked(toggleColor);
  colorToggle.size(width / 4, 50);
  colorToggle.position(width / 2, height);
  colorToggle.style("font-family", font);
  colorToggle.style("font-size", "20px");

  //toggle the lines on the path to move randomly, making it less boxy and more erratic
  oscillateToggle = createButton("Oscillate");
  oscillateToggle.mouseClicked(toggleOscillate);
  oscillateToggle.size(width / 4, 50);
  oscillateToggle.position((width * 3) / 4, height);
  oscillateToggle.style("font-family", font);
  oscillateToggle.style("font-size", "20px");

  //create grid for walker to travel on
  grid = new Array(cols);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(rows);
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = new Array(depth);
    }
  }
  //every point on the grid starts unvisited
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      for (let k = 0; k < depth; k++) {
        grid[i][j][k] = false;
      }
    }
  }
  //the starting point is visited though
  const cx = floor(cols / 2);
  grid[cx][cx][cx] = true;
  //set first point for the colored path
  path.push([cx * spacing, cx * spacing, cx * spacing]);
  walker = new Walker();
}

function draw() {
  background(0);


  
  //this essentially moves the the screen so it stays mostly centered on the entire path
  let centerV = createVector(0, 0, 0);
  let minXYZ = createVector(Infinity, Infinity, Infinity);
  let maxXYZ = createVector(0, 0, 0);
  for (let i = 0; i < path.length; i++) {
    minXYZ.x = min(path[i][0], minXYZ.x);
    minXYZ.y = min(path[i][1], minXYZ.y);
    minXYZ.z = min(path[i][2], minXYZ.z);
    maxXYZ.x = max(path[i][0], maxXYZ.x);
    maxXYZ.y = max(path[i][1], maxXYZ.y);
    maxXYZ.z = max(path[i][2], maxXYZ.z);
  }

  centerV.x = (maxXYZ.x - minXYZ.x) * 0.5 + minXYZ.x;
  centerV.y = (maxXYZ.y - minXYZ.y) * 0.5 + minXYZ.y;
  centerV.z = (maxXYZ.z - minXYZ.z) * 0.5 + minXYZ.z;

  const amt = 0.05;
  lerpX = lerp(lerpX, centerV.x, amt);
  lerpY = lerp(lerpY, centerV.y, amt);
  lerpZ = lerp(lerpZ, centerV.z, amt);
  orbitControl();
  translate(-lerpX, -lerpY, -lerpZ);
  if (gridToggled) {
    showGrid(4);
  }
  walker.step();

  //if walker stuck, you can click button to reset it
  if (walker.stuck) {
    oscillateToggled = false;
    reset.show();
  }
}

//these functions handle the toggles when the buttons are pressed
function toggleGrid() {
  gridToggled = !gridToggled;
}

function toggleGridColor() {
  gridColored = !gridColored;
}

function toggleColor() {
  if (!colorToggled) {
    colorMode(HSB);
  } else {
    colorMode(RGB);
  }
  colorToggled = !colorToggled;
}

function toggleOscillate() {
  oscillateToggled = !oscillateToggled;
}


function showGrid(scale) {
  strokeWeight(spacing * 0.05);
  noFill();
  for (let i = 0; i < cols / scale; i++) {
    for (let j = 0; j < rows / scale; j++) {
      for (let k = 0; k < depth / scale; k++) {
        noFill();
        push();
        //colors grid if option is selected
        if (gridColored && !colorToggled) {
          let r = map(i, 0, cols / scale, 100, 255, true);
          let g = map(j, 0, rows / scale, 100, 255, true);
          let b = map(k, 0, depth / scale, 100, 255, true);
          stroke(r, g, b, 50);
        } else if (gridColored && colorToggled) {
          let h = map(i, 0, cols / scale, 0, 355, true);
          let s = map(j, 0, rows / scale, 0, 100, true);
          let b = map(k, 0, depth / scale, 50, 100, true);
          stroke(h, s, b, 0.2);
        } else if (!gridColored && colorToggled) {
          stroke(40, 0.2);
        } else {
          stroke(100, 80);
        }
        //make boxes that are x times larger, where x is scale. make a 3d grid of boxes within the bounds.
        translate(
          (i * scale * spacing)+(spacing * scale)/2,
          (j * scale * spacing)+(spacing * scale)/2,
          (k * scale * spacing)+(spacing * scale)/2
        );
        box(spacing * scale);
        pop();
      }
    }
  }
}

//reset grid, remove all visited nodes in path, put walker back in its original position
function resetWalker() {
  clear();
  background(0);
  for (let i = 0; i < grid.length - 1; i++) {
    for (let j = 0; j < grid[i].length - 1; j++) {
      for (let k = 0; k < grid[i][j].length - 1; k++) {
        grid[i][j][k] = false;
      }
    }
  }
  while (path.length > 0) {
    path.pop();
  }
  walker.x = floor(cols / 2);
  walker.y = floor(cols / 2);
  walker.z = floor(cols / 2);
  grid[walker.x][walker.y][walker.z] = true;
  path.push([walker.x * spacing, walker.y * spacing, walker.z * spacing]);
  walker.stuck = false;
  reset.hide();
}

//checks to make sure the selected point is unvisited and in bounds
function isValid(i, j, k) {
  if (i < 0 || i >= cols || j < 0 || j >= rows || k < 0 || k >= depth) {
    return false;
  }
  return !grid[i][j][k];
}

class Walker {
  constructor() {
    this.x = floor(cols / 2);
    this.y = floor(cols / 2);
    this.z = floor(cols / 2);
    this.stuck = false;
  }

  step() {
    //looks at all adjacent points, any that are visited or out of bounds are omitted as an option. if there are unvisited nodes, add them to the list so the walker can randomly select from it.
    let options = [];
    for (let option of allOptions) {
      let newX = this.x + option.dx;
      let newY = this.y + option.dy;
      let newZ = this.z + option.dz;
      if (isValid(newX, newY, newZ)) {
        options.push(option);
      }
    }
    //chose a random direction to move in based on what was calculated to be unvisited/in bounds
    if (options.length > 0) {
      let step = random(options);
      //map the lines between the points
      this.x += step.dx;
      this.y += step.dy;
      this.z += step.dz;

      //signal that this point has been visited, and add coordinate to the path
      grid[this.x][this.y][this.z] = true;
      path.push([this.x * spacing, this.y * spacing, this.z * spacing]);
    } else {
      //stops doing stuff if theres nowhere to go
      this.stuck = true;
    }
    //iterates through path and put lines between the current and previous coordinates
    for (let i = 0; i < path.length - 1; i++) {
      let v1 = path[i];
      //this makes the lines oscillate over time, making the path look more jagged and erratic
      if (oscillateToggled && !walker.stuck) {
        path[i][0] += random(-0.6, 0.6);
        path[i][1] += random(-0.6, 0.6);
        path[i][2] += random(-0.6, 0.6);
      }
      strokeWeight(spacing * 0.1);
      noFill();
      let v2 = path[i + 1];
      if (!colorToggled) {
        //map the coordinates to rgb values so you are moving through a 3d rgb space
        let r = map(v1[0] / spacing, 0, cols, 100, 255, true);
        let g = map(v1[1] / spacing, 0, rows, 100, 255, true);
        let b = map(v1[2] / spacing, 0, depth, 100, 255, true);
        stroke(r, g, b);
      } else {
        //map coordinates to hsv values instead
        let h = map(v1[0] / spacing, 0, cols, 0, 359, true);
        let s = map(v1[1] / spacing, 0, rows, 0, 100, true);
        let b = map(v1[2] / spacing, 0, depth, 50, 100, true);
        stroke(h, s, b);
      }
      line(v1[0], v1[1], v1[2], v2[0], v2[1], v2[2]);
    }
  }
}

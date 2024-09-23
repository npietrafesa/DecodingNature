let alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
let total;
let angles = [];
let r = 3;
let font;

function preload() {
  font = loadFont("/Inconsolata.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(font);
  textSize(30);
  total = floor(width / (r * 2));
  for (let i = 0; i < total; i++) {
    angles[i] = map(i, 0, total, 0, TWO_PI * 2);
  }
  colorMode(HSB);
  camera(1000, -1500, 800, width / 2, height / 2, 0);
}

function draw() {
  orbitControl();
  rotateX(frameCount * 0.0075);
  rotateY(frameCount * 0.0075);
  rotateZ(frameCount * 0.0075);
  background(0);
  translate(400, 400);
  for (let i = 0; i < total; i++) {
    let y = map(sin(angles[i]), -1, 1, -height, height / 2);
    let x = map(i, 0, total, -width * 2, width / 2, true);
    let letter;
    letter = map(x, -width / 2, width / 2, 0, alphabet.length - 1, true);
    push();
    for (let i = 0; i < 25; i++) {
      rotateY(45);
      translate(0, 0, 0.5);
      fill((i * 2 + frameCount) % 360, 100, 100);
      text(alphabet[floor(random(alphabet.length))], x, y);
    }
    pop();
    let increment = TWO_PI / 60;
    angles[i] += increment;
  }
}

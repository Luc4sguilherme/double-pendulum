const g = 1;

let r1;
let r2;
let m1;
let m2;
let cx;
let cy;
let canvas;
let buffer;
let colours;

let a1 = Math.PI / 2;
let a2 = Math.PI / 4;
let a1_v = 0;
let a2_v = 0;
let px2 = 0;
let py2 = 0;

function calculateAccelerationDelta1(velocity1, velocity2, angle1, angle2) {
  const num1 = -g * (2 * m1 + m2) * sin(angle1);
  const num2 = -m2 * g * sin(angle1 - 2 * angle2);
  const num3 = -2 * sin(angle1 - angle2) * m2;
  const num4 = velocity2 * velocity2 * r2 + velocity1 * velocity1 * r1 * cos(angle1 - angle2);
  const den = r1 * (2 * m1 + m2 - m2 * cos(2 * angle1 - 2 * angle2));
  const acceleration = (num1 + num2 + num3 * num4) / den;

  return acceleration;
}

function calculateAccelerationDelta2(velocity1, velocity2, angle1, angle2) {
  const num1 = 2 * sin(angle1 - angle2);
  const num2 = velocity1 * velocity1 * r1 * (m1 + m2);
  const num3 = g * (m1 + m2) * cos(angle1);
  const num4 = velocity2 * velocity2 * r2 * m2 * cos(angle1 - angle2);
  const den = r2 * (2 * m1 + m2 - m2 * cos(2 * angle1 - 2 * angle2));
  const acceleration = (num1 * (num2 + num3 + num4)) / den;

  return acceleration;
}

function calculatePendulumVelocity() {
  const a1_a = calculateAccelerationDelta1(a1_v, a2_v, a1, a2);
  const a2_a = calculateAccelerationDelta2(a1_v, a2_v, a1, a2);

  a1_v += a1_a;
  a2_v += a2_a;
  a1 += a1_v;
  a2 += a2_v;
  a1_v *= 0.9980;
  a2_v *= 0.9980;
}

function calculatePendulumPosition() {
  const x1 = r1 * sin(a1);
  const y1 = r1 * cos(a1);
  const x2 = x1 + r2 * sin(a2);
  const y2 = y1 + r2 * cos(a2);

  return {
    x1,
    y1,
    x2,
    y2,
  };
}

function drawPendulum(x1, y1, x2, y2) {
  translate(cx, cy);
  stroke(colours[0]);
  strokeWeight(1);

  fill(colours[0]);
  ellipse(0, 0, m1 / 4, m1 / 4);

  line(0, 0, x1, y1);
  fill(colours[0]);
  ellipse(x1, y1, m1 / 2, m1 / 2);

  line(x1, y1, x2, y2);
  fill(colours[0]);
  ellipse(x2, y2, m2 / 2, m2 / 2);
}

function drawTrail(x2, y2) {
  const trans = map(x2, (r1 + r2) * -1, r1 + r2, 0, 1);
  const lineColour = lerpColor(colours[1], colours[2], trans);

  buffer.stroke(lineColour);
  buffer.strokeWeight(1);
  buffer.line(px2, py2, x2, y2);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 255, 255, 255, 1);
  pixelDensity(1);

  r1 = random(40, 250);
  r2 = random(40, 250);
  m1 = random(20, 50);
  m2 = random(20, 50);

  cx = width / 2;
  cy = height / 2 - 150;

  colours = [color(229, 252, 255, 0.3), color(120, 80, 240, 0.7), color(230, 10, 120, 0.7), color(20, 34, 51)];
  buffer = createGraphics(width, height);
  buffer.background(colours[3]);
  buffer.translate(cx, cy);
}

function draw() {
  image(buffer, 0, 0, width, height);

  calculatePendulumVelocity();

  const { x1, y1, x2, y2 } = calculatePendulumPosition();

  drawPendulum(x1, y1, x2, y2);

  if (frameCount > 1) {
    drawTrail(x2, y2);
  }

  px2 = x2;
  py2 = y2;
}

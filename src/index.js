import "./styles.css";
import { SVG, Color } from "@svgdotjs/svg.js";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let fillFunctions = [
  //drawBlackRect,
  drawRect,
  drawTriangle,
  drawCircle,
  drawLine
];

const MAX_RECURSIONDEPTH = 2;
const BW_CHANCE = 80;
const MATRIX_SIZE_EXPONENT = 2;

function fillRect(surface, fillfunctions, recursionDepth) {
  let matrixSize;
  do {
    matrixSize = 2 ** getRandomInt(0, MATRIX_SIZE_EXPONENT);
    // we don't want a 1x1 Matrix as the only result
  } while (recursionDepth === 0 && matrixSize === 1);
  //let matrixSize = getRandomInt(2, 8);
  //let matrixSize = 2;
  let blockSize = viewboxSize / matrixSize;

  let color =
    getRandomInt(0, 100) > BW_CHANCE
      ? Color.random("vibrant")
      : Color.random("grey");

  if (matrixSize === 1 || recursionDepth >= MAX_RECURSIONDEPTH) {
    let fillFunction = getRandomInt(0, fillfunctions.length - 1);
    fillfunctions[fillFunction](surface, color);
  } else {
    for (let x = 0; x < matrixSize; x++) {
      for (let y = 0; y < matrixSize; y++) {
        let newSurface = surface
          .nested()
          .move(x * blockSize, y * blockSize)
          .viewbox(0, 0, viewboxSize / 2, viewboxSize / 2)
          .size(blockSize, blockSize);
        fillRect(newSurface, fillfunctions, recursionDepth + 1);
      }
    }
  }
}

function makeGradient(surface, color) {
  let gradient = surface.gradient("linear", function (add) {
    add.stop(0, color);
    add.stop(1, "#000");
  });
  return gradient;
}

function drawRect(surface, color) {
  let gradient = makeGradient(surface, color);
  let x, y;
  x = y = getRandomInt(900, 1000);

  surface.rect(x, y).move(0, 0).attr({ fill: gradient });
  //.attr({ fill: Color.random("grey") });
}

function drawBlackRect(surface, color) {
  surface.rect(1000, 1000).move(0, 0).attr({ fill: "#000" });
  //.attr({ fill: Color.random("grey") });
}

function drawCircle(surface, color) {
  let gradient = makeGradient(surface, color);

  surface.circle(1000).move(0, 0).attr({ fill: gradient });
}

function drawTriangle(surface, color) {
  let gradient = makeGradient(surface, color);

  surface
    .polygon("0,0 1000,1000 0,1000")
    .attr({ fill: gradient })
    .scale(1)
    .rotate(getRandomInt(-180, 180));
}

function drawText(surface, color) {
  let text = getRandomInt(0, 1) === 0 ? "A" : "N";

  surface.text(text).move(0, 300).attr({ fill: color, "font-size": "400" });
}

function drawLine(surface, color) {
  let gradient = makeGradient(surface, color);

  surface
    //.line(0, 0, getRandomInt(0, 1000), getRandomInt(0, 1000))
    .line(0, 0, 1000, 1000)
    .attr({
      stroke: gradient,
      "stroke-width": 200,
      "stroke-dasharray": "20 20"
    });
}

const viewboxSize = 1000;

let draw = SVG().addTo("body").size("100%", "100%").viewbox(0, 0, 1000, 1000);

let muster = draw.defs().group();

fillRect(muster, fillFunctions, 0);

// draw.use(muster);
// draw.use(muster).flip({ x: 250, y: 250 });
// draw.use(muster).scale(0.5, 0.5, 0, 0);
// draw
//   .use(muster)
//   .scale(0.5, 0.5, 0, 0)
//   .move(1000, 1000)
//   .flip("x", { x: 1000, y: 1000 });
// draw
//   .use(muster)
//   .scale(0.5, 0.5, 0, 0)
//   .move(1000, 1000)
//   .flip("y", { x: 1000, y: 1000 });
// draw
//   .use(muster)
//   .scale(0.5, 0.5, 0, 0)
//   .move(0, 0)
//   .flip("both", { x: 1000, y: 1000 });

let stepwidth = 90;
let moveAmount = getRandomInt(0, 100);
for (let i = 0; i < 360; i = i + stepwidth) {
  draw
    .use(muster)
    .move(moveAmount, moveAmount)
    .scale(0.5, 0.5, 1000, 1000)
    .rotate(i, 0, 0);
}

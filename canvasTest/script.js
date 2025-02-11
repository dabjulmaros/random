const maskCanvas = document.querySelector('canvas#mask');
const maskCtx = maskCanvas.getContext('2d');
const controlCanvas = document.querySelector('canvas#control');
const controlCtx = controlCanvas.getContext('2d');


const img = document.querySelector('img');

let settings = { tool: 1, size: 10 };

img.addEventListener('mousemove', e => {
  processMouse(e);
})

img.addEventListener("mousedown", e => {
  processMouse(e);
});

img.addEventListener('wheel', e => {
  e.preventDefault();
  settings.size += e.deltaY;

  if (settings.size < 5) {
    settings.size = 5;
  }
  else if (settings.size > 200) {
    settings.size = 200;
  }
  drawControl(controlCanvas.width / 2, controlCanvas.height / 2);
});

function processMouse(e) {
  drawControl(e.offsetX, e.offsetY);
  // console.log(e)

  if (e.buttons) {
    drawMask(e.offsetX, e.offsetY, e.altKey);
  }
}


function drawControl(x, y) {
  controlCtx.clearRect(0, 0, controlCanvas.width, controlCanvas.height);
  controlCtx.beginPath();
  if (settings.tool == 0) {
    controlCtx.arc(x, y, settings.size, 0, 2 * Math.PI);
  } else if (settings.tool == 1) {
    controlCtx.rect(x - settings.size / 2, y - settings.size / 2, settings.size, settings.size)
  }
  controlCtx.stroke()
}
function drawMask(x, y, remove) {
  maskCtx.fillStyle = `rgba(255,255,255,1)`;

  if (remove) {
    maskCtx.globalCompositeOperation = 'destination-out';
  } else {
    maskCtx.globalCompositeOperation = 'source-over';
  }

  // maskCtx.globalCompositionOperation = "source-over";


  maskCtx.beginPath();
  if (settings.tool == 0) {
    maskCtx.arc(x, y, settings.size, 0, 2 * Math.PI);
  } else if (settings.tool == 1) {
    maskCtx.rect(x - settings.size / 2, y - settings.size / 2, settings.size, settings.size);

  }
  maskCtx.fill();
}
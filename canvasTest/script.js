const maskCanvas = document.querySelector('canvas#mask');
const maskCtx = maskCanvas.getContext('2d');
const controlCanvas = document.querySelector('canvas#control');
const controlCtx = controlCanvas.getContext('2d');


const img = document.querySelector('img');

let settings = { tool: 1, size: 10 };

let setShift = false;
let shiftDir = null;
let shiftConstVal = 0;

img.addEventListener('mousemove', e => {
  processMouse(e);
})

img.addEventListener("mousedown", e => {
  processMouse(e);
});

img.addEventListener("mouseup", e => {
  if (setShift) {
    setShift = false;
    shiftDir = null;
  }
})

img.addEventListener('contextmenu', e => {
  if (true) {
    e.preventDefault();
  }
})

img.addEventListener('wheel', e => {
  e.preventDefault();

  settings.size += e.deltaY / 5;

  if (settings.size < 5) {
    settings.size = 5;
  }
  else if (settings.size > 200) {
    settings.size = 200;
  }
  drawControl(controlCanvas.width / 2, controlCanvas.height / 2);
});

function processMouse(e) {
  if (e.shiftKey && shiftDir == null && e.buttons) {
    setShift = true;
    if (Math.abs(e.movementX) > Math.abs(e.movementY)) {
      shiftDir = 'x';
      shiftConstVal = e.offsetY;
    } else {
      shiftDir = 'y';
      shiftConstVal = e.offsetX;
    }
  }

  drawControl(e.offsetX, e.offsetY);

  if (e.buttons) {
    drawMask(e.offsetX, e.offsetY, e.altKey || e.buttons == 2);
  }
}


function drawControl(x, y) {
  controlCtx.clearRect(0, 0, controlCanvas.width, controlCanvas.height);
  controlCtx.beginPath();

  if (setShift) {
    if (shiftDir == 'x') {
      y = shiftConstVal;
    } else if (shiftDir == 'y') {
      x = shiftConstVal;
    }
  }

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

  if (setShift) {
    if (shiftDir == 'x') {
      y = 0;
      y = shiftConstVal;
    } else if (shiftDir == 'y') {
      x = 0;
      x = shiftConstVal;
    }
  }

  maskCtx.beginPath();
  if (settings.tool == 0) {
    maskCtx.arc(x, y, settings.size, 0, 2 * Math.PI);
  } else if (settings.tool == 1) {
    maskCtx.rect(x - settings.size / 2, y - settings.size / 2, settings.size, settings.size);

  }
  maskCtx.fill();
}
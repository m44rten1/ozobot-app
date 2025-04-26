import "./style.css";

// DOM Elements
const canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d");
const colorOptions = document.querySelectorAll(".color-option");
const undoBtn = document.getElementById("undo-btn");
const clearBtn = document.getElementById("clear-btn");
const fullscreenBtn = document.getElementById("fullscreen-btn");

// Variables
let isDrawing = false;
let currentColor = "black";
let lineWidth = 15;
let paths = []; // Store drawing paths for undo functionality
let currentPath = [];

// Set canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  redrawPaths(); // Redraw after resize
}

// Initialize canvas
function initCanvas() {
  resizeCanvas();

  // Set initial canvas state
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = currentColor;
}

// Draw stored paths
function redrawPaths() {
  // Clear canvas
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Redraw all paths
  paths.forEach((path) => {
    if (path.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = path[0].color;
      ctx.lineWidth = path[0].width;
      ctx.moveTo(path[0].x, path[0].y);

      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }

      ctx.stroke();
    }
  });
}

// Start drawing
function startDrawing(e) {
  isDrawing = true;
  currentPath = [];

  const point = getPoint(e);
  currentPath.push({
    x: point.x,
    y: point.y,
    color: currentColor,
    width: lineWidth,
  });

  // Begin new path
  ctx.beginPath();
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = lineWidth;
  ctx.moveTo(point.x, point.y);
}

// Continue drawing
function draw(e) {
  if (!isDrawing) return;

  const point = getPoint(e);
  currentPath.push({
    x: point.x,
    y: point.y,
    color: currentColor,
    width: lineWidth,
  });

  ctx.lineTo(point.x, point.y);
  ctx.stroke();
}

// Stop drawing
function stopDrawing() {
  if (isDrawing) {
    isDrawing = false;
    paths.push([...currentPath]);
    ctx.closePath();
  }
}

// Get pointer position (works for both mouse and touch)
function getPoint(e) {
  let x, y;

  if (e.type.includes("touch")) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  } else {
    x = e.clientX;
    y = e.clientY;
  }

  return { x, y };
}

// Set color
function setColor(color) {
  currentColor = color;
  colorOptions.forEach((option) => {
    option.classList.remove("active");
    if (option.dataset.color === color) {
      option.classList.add("active");
    }
  });
}

// Undo last line
function undo() {
  if (paths.length > 0) {
    paths.pop();
    redrawPaths();
  }
}

// Clear canvas
function clearCanvas() {
  paths = [];
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Toggle fullscreen mode
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    // Try standard fullscreen API first
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(`Standard fullscreen failed, likely on iOS: ${err.message}`);

      // iOS/iPad fallback - toggle a CSS class for "fullscreen-like" experience
      document.documentElement.classList.add("ios-fullscreen");

      // On iOS, we can use viewport meta tag updates for a more immersive experience
      const metaViewport = document.querySelector("meta[name=viewport]");
      if (metaViewport) {
        metaViewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        );
      }
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }

    // Cleanup iOS "fullscreen-like" mode
    document.documentElement.classList.remove("ios-fullscreen");

    // Reset viewport meta for iOS
    const metaViewport = document.querySelector("meta[name=viewport]");
    if (metaViewport) {
      metaViewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0"
      );
    }
  }
}

// Event Listeners
window.addEventListener("resize", resizeCanvas);

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// Touch support
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  startDrawing(e);
});
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  draw(e);
});
canvas.addEventListener("touchend", stopDrawing);

// Control buttons
undoBtn.addEventListener("click", undo);
clearBtn.addEventListener("click", clearCanvas);
fullscreenBtn.addEventListener("click", toggleFullscreen);

// Color options
colorOptions.forEach((option) => {
  option.addEventListener("click", () => {
    setColor(option.dataset.color);
  });
});

// Initialize the app
initCanvas();

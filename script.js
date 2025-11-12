// Inisialisasi canvas
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Load gambar background dan karakter dengan struktur folder custom
const bgImg = new Image();
bgImg.src = "unduhan/bg.jpg"; // nama dan folder background

const charImg = new Image();
charImg.src = "Freminet-removebg-preview/char1.png"; // nama dan folder karakter

// ===== Game Core =====
let player = {
  w: 40,
  h: 40,
  x: canvas.width / 2 - 20,
  y: 500,
  vx: 0,
  vy: 0,
  gravity: 0.35,
  jumpPower: 8.9,
  speed: 3.2,
};
let platforms = [];
let score = 0;

// Platform generator
function makePlatforms() {
  platforms = [];
  let y = 580;
  for (let i = 0; i < 8; i++) {
    platforms.push({
      x: Math.random() * (canvas.width - 88),
      y: y,
      w: 88,
      h: 13
    });
    y -= 70;
  }
}

function resetGame() {
  makePlatforms();
  player.x = canvas.width / 2 - 20;
  player.y = 500;
  player.vy = 0;
  score = 0;
  document.getElementById('score').textContent = score;
}

function update() {
  player.vx = 0;
  if (left) player.vx = -player.speed;
  if (right) player.vx = player.speed;
  player.x += player.vx;
  if (player.x < 0) player.x = 0;
  if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;

  player.vy += player.gravity;
  player.y += player.vy;

  // Platform collide & lompat
  for (let pf of platforms) {
    if (
      player.vy > 0 &&
      player.x + player.w > pf.x &&
      player.x < pf.x + pf.w &&
      player.y + player.h > pf.y &&
      player.y + player.h < pf.y + 12
    ) {
      player.y = pf.y - player.h;
      player.vy = -player.jumpPower;
      score++;
      document.getElementById('score').textContent = score;
    }
  }

  // Camera scroll naik
  if (player.y < canvas.height / 2) {
    let d = (canvas.height / 2) - player.y;
    player.y = canvas.height / 2;
    for (let pf of platforms) {
      pf.y += d;
      if (pf.y > canvas.height) {
        pf.y = Math.random() * 20;
        pf.x = Math.random() * (canvas.width - pf.w);
      }
    }
    score += Math.floor(d / 8);
    document.getElementById('score').textContent = score;
  }

  // Jatuh, game ulang
  if (player.y > canvas.height) {
    resetGame();
  }
}

function draw() {
  // Pastikan gambar background sudah siap
  if (bgImg.complete) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Draw platforms
  for (let pf of platforms) {
    ctx.fillStyle = "#6b421b";
    ctx.fillRect(pf.x, pf.y, pf.w, pf.h);
    ctx.fillStyle = "#fff9b2";
    ctx.fillRect(pf.x + 6, pf.y + 2, pf.w - 12, 4);
  }
  // Draw karakter
  if (charImg.complete) {
    ctx.drawImage(charImg, player.x, player.y, player.w, player.h);
  }
}

let left = false, right = false;
document.addEventListener('keydown', function(e) {
  if (e.key === "ArrowLeft") left = true;
  if (e.key === "ArrowRight") right = true;
  if ((e.key === " " || e.key === "ArrowUp") && player.vy > 2)
    player.vy = -player.jumpPower;
});
document.addEventListener('keyup', function(e) {
  if (e.key === "ArrowLeft") left = false;
  if (e.key === "ArrowRight") right = false;
});

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Start
resetGame();
loop();

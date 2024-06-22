////////////////////////////////////////////////////////////////////////
////////////////////////// Pageflip-Animation //////////////////////////
// delay possible clicks until page is turned
document.getElementById('book').addEventListener('click', function (e) {
  e = this;
  e.style.pointerEvents = "none";
  setTimeout(function () {
    e.style.pointerEvents = "";
  }, 2000);
});

// Code by Yanis Deplazes, props bro.
function openBook() {
  var splashScreen = document.getElementById('splashScreen');
  var mainContent = document.getElementById('mainContent');

  if (splashScreen && mainContent) {

      splashScreen.style.top = '-100vh';
        mainContent.style.top = '0';
        mainContent.style.background = 'linear-gradient(-45deg, #f9974c, #540410);';
      }

      playLevelupSound();
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////// Player & Sprite Sheet Animation //////////////////////////

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth; // Setze die Breite des Canvas auf die Breite des Fensters
  canvas.height = window.innerHeight; // Setze die Höhe des Canvas auf die Höhe des Fensters
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const playerImage = new Image();
playerImage.src = './images/dogsprite_v6.png';
const spriteWidth = 718;
const spriteHeight = 669;
const scaledWidth = spriteWidth / 5; // Skaliert den player
const scaledHeight = spriteHeight / 5;
let playerState = 'forward';

let gameFrame = 0; 
const staggerFrames = 13; // Geschwindigkeit der Animation
const spriteAnimations = []; // Array für die Animationen
const animationStates = [
  { name: 'left', frames: 3 },
  { name: 'forward', frames: 3 },
  { name: 'right', frames: 3 },
  { name: 'back', frames: 3 },
];
animationStates.forEach((state, index) => {
    let frames = {
        loc: [],
    }
    for (let j = 0; j < state.frames; j++) {
        let positionX = j * spriteWidth;
        let positionY = index * spriteHeight;
        frames.loc.push({ x: positionX, y: positionY });
    }
    spriteAnimations[state.name] = frames;
});
console.log(spriteAnimations);

/////////////////////////////////////////////////////////////////////
////////////////////////// Keyboard Input //////////////////////////

let keyPresses = {};

window.addEventListener('keydown', keyDownListener, false);
function keyDownListener(event) {
  keyPresses[event.key] = true;
}

window.addEventListener('keyup', keyUpListener, false);
function keyUpListener(event) {
  keyPresses[event.key] = false;
}

/////////////////////////////////////////////////////////////////////////////////
////////////////////////// Moving Player across canvas //////////////////////////

const MOVEMENT_SPEED = 6;
let positionX = window.innerWidth/2 - scaledWidth/2;
let positionY = window.innerHeight/4 - scaledHeight/2;

function drawFrame(frameX, frameY, canvasX, canvasY) {
  ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, canvasX, canvasY, scaledWidth, scaledHeight);
}

////////////////////////////////////////////////////////////////////////
////////////////////////// Sound Controls //////////////////////////
// Background music does not play
const backgroundMusic = document.getElementById('backgroundMusic');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.2; // volume to 20%

function startBackgroundMusic() {
  if (collectedCount < totalCount) {
    backgroundMusic.play().catch(error => {
      console.error('Error playing background music:', error);
    });
  }
}

// Check if the screen width is smaller than 600px
if (window.innerWidth < 600) {
  backgroundMusic.pause(); // Stop the background music
  musicLevelup.pause(); // Stop the levelup sound
  collectSounds.forEach(sound => sound.pause()); // Stop all collect sounds
}

const musicLevelup = document.getElementById('musicLevelup');
musicLevelup.volume = 0.4;

const collectSounds = [
  new Audio('./audio/mc-cat1.mp3'),
  new Audio('./audio/mc-cat2.mp3'),
  new Audio('./audio/mc-cat3.mp3'),
  new Audio('./audio/mc-cat4.mp3')
];

collectSounds.forEach(sound => {
  sound.volume = 0.6;
});
collectSounds[3].volume = 1; // Set the volume of the last sound to 0.9

function playLevelupSound() {
  musicLevelup.play();
}

// plays a random collect sound
function playCollectSound() {
  const randomIndex = Math.floor(Math.random() * collectSounds.length);
  collectSounds[randomIndex].play();
}

/////////////////////////////////////////////////////////////////////////////////
////////////////////////// Cats moving across canvas //////////////////////////
// unfortunately canvas does not allow to load gifs, so I used pngs instead. (emotional damage)
const gifs = [];
const gifImages = [
                  './images/meme1.png',
                  './images/meme2.png',
                  './images/meme3.png',
                  './images/meme4.png',
                  './images/meme5.png',
                  './images/meme6.png',
                  './images/meme7.png',
                  './images/meme8.png',
                  './images/meme9.png',
                  './images/meme1.png',
                  './images/meme2.png',
                  './images/meme3.png',
                  './images/meme4.png',
                  './images/meme5.png',
                  './images/meme6.png',
                  './images/meme7.png',
                  './images/meme8.png',
                  './images/meme9.png',
                  './images/meme1.png',
                  './images/meme2.png',
                  './images/meme3.png',
                  './images/meme4.png',
                  './images/meme5.png',
                  './images/meme6.png',
                  './images/meme7.png',
                  './images/meme8.png',
                  './images/meme9.png'
                ];

gifImages.forEach(src => {
  let gif = new Image();
  gif.src = src;
  let gifObject = {
    image: gif,
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    width: 55,
    height: 55,
    speedX: (Math.random() - 0.1) * 8,
    speedY: (Math.random() - 0.1) * 8
  };
  gifs.push(gifObject);
});

function drawGifs() {
  gifs.forEach(gif => {
    gif.x += gif.speedX;
    gif.y += gif.speedY;
    
    if (gif.x < 0 || gif.x + gif.width > canvas.width) gif.speedX *= -1;
    if (gif.y < 0 || gif.y + gif.height > canvas.height) gif.speedY *= -1;
    
    ctx.drawImage(gif.image, gif.x, gif.y, gif.width, gif.height);
  });
}

function checkCollision(gif) {
  return (
    positionX < gif.x + gif.width &&
    positionX + scaledWidth > gif.x &&
    positionY < gif.y + gif.height &&
    positionY + scaledHeight > gif.y
  );
}

//////////////////////////////////////////////////////////////////////////////////
////////////////////////// Counter for collected sanity //////////////////////////
let collectedCount = 0;
const totalCount = gifImages.length;

function updateCounter() {
  document.getElementById('counter').innerText = 'Collected sanity: ' + collectedCount + '/' + totalCount;
}

////////////////////////////////////////////////////////////////////////
////////////////////////// Game Loop //////////////////////////////////
function gameLoop() {
  startBackgroundMusic();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Aktualisiere die Position des Players basierend auf den Tastatureingaben
  if (keyPresses['w']) {
    positionY -= MOVEMENT_SPEED;
    playerState = 'back';
  } else if (keyPresses['s']) {
    positionY += MOVEMENT_SPEED;
    playerState = 'forward';
  } else if (keyPresses['a']) {
    positionX -= MOVEMENT_SPEED;
    playerState = 'left';
  } else if (keyPresses['d']) {
    positionX += MOVEMENT_SPEED;
    playerState = 'right';
  } else {
    // Wenn keine Taste gedrückt wird, zur ersten Frame des aktuellen States wechseln
    gameFrame = 0;
  }

  // Grenzkollision überprüfen und korrigieren
  if (positionX < 0) positionX = 0;
  if (positionY < 0) positionY = 0;
  if (positionX + scaledWidth > canvas.width) positionX = canvas.width - scaledWidth;
  if (positionY + scaledHeight > canvas.height) positionY = canvas.height - scaledHeight;

  // Berechne den aktuellen Frame der Animation
  let position = Math.floor(gameFrame / staggerFrames) % spriteAnimations[playerState].loc.length;
  let frameX = spriteWidth * position;
  let frameY = spriteAnimations[playerState].loc[position].y;

  drawFrame(frameX, frameY, positionX, positionY);

  gifs.forEach(function(gif, index) {
    if (checkCollision(gif)) {
      gifs.splice(index, 1); // Entferne das GIF, wenn es eingesammelt wird
      collectedCount++;
      updateCounter();
      playCollectSound();
      
      if (collectedCount === totalCount) {
        // Verzögere das Ausblenden des Canvas um 0.4 Sekunde
        setTimeout(function() {
          canvas.style.display = 'none';
          openBook();
          //console.log('All sanity collected');
        }, 400);
        backgroundMusic.pause(); // Stop the background music
      }
    }
  });
  drawGifs();

  gameFrame++;
  requestAnimationFrame(gameLoop);
}

updateCounter();
gameLoop();
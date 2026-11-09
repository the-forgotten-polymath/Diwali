import { DiwaliEngine } from '../src';

const diwali = new DiwaliEngine({
  fps: 50,
  sound: true,
  volume: 0.45,
});

// 🚀 AUTOMATIC ROCKETS SHOW:
// Automatically and continuously launches rockets randomly from the bottom into the festive sky!
let isRunning = true;
let stopRocketShow: (() => void) | null = diwali.startRocketShow(850);

// 🏮 Hanging Lanterns at top with mouse proximity transparency
diwali.hangingLanterns(10);

// 🪔 Docked Diyas with corners cleared
diwali.diyas({ count: 9, mode: 'docked', clearCorners: true, glowIntensity: 1.2 });

// 🐕 Cute Golden Labrador eating treats in bottom-left
diwali.labrador(1.05);

// 🏮 Ascending Sky Floaters entering bottom and drifting out top
diwali.lanterns({ count: 6, continuous: true, position: 'full' });

// Click or tap anywhere to launch an extra rocket directly to that spot
diwali.enableClickToSpawn('rocket');

// Unmute audio automatically on first interaction (required by browser autoplay policy)
const enableAudioOnFirstClick = () => {
  diwali.setSoundEnabled(true);
  window.removeEventListener('click', enableAudioOnFirstClick);
  window.removeEventListener('touchstart', enableAudioOnFirstClick);
};
window.addEventListener('click', enableAudioOnFirstClick);
window.addEventListener('touchstart', enableAudioOnFirstClick);

// Controls
const btnSound = document.getElementById('btn-sound') as HTMLButtonElement;
const btnPlayPause = document.getElementById('btn-play-pause') as HTMLButtonElement;
const btnMouseRockets = document.getElementById('btn-mouse-rockets') as HTMLButtonElement;
const btnCode = document.getElementById('btn-code') as HTMLButtonElement;
const btnFullscreen = document.getElementById('btn-fullscreen') as HTMLButtonElement;

const codeBanner = document.getElementById('code-banner') as HTMLDivElement;
const codeContent = document.getElementById('code-content') as HTMLElement;
const copyBtn = document.getElementById('copy-btn') as HTMLButtonElement;

// 🔊 Sound Toggle
let soundActive = true;
btnSound.addEventListener('click', (e) => {
  e.stopPropagation();
  soundActive = !soundActive;
  diwali.setSoundEnabled(soundActive);
  btnSound.textContent = soundActive ? '🔊' : '🔇';
  btnSound.classList.toggle('active', soundActive);
});

// ⏸️ Play / Pause Auto Rockets
btnPlayPause.addEventListener('click', (e) => {
  e.stopPropagation();
  if (isRunning) {
    if (stopRocketShow) stopRocketShow();
    stopRocketShow = null;
    isRunning = false;
    btnPlayPause.textContent = '▶️';
    btnPlayPause.classList.remove('active');
  } else {
    stopRocketShow = diwali.startRocketShow(850);
    isRunning = true;
    btnPlayPause.textContent = '⏸️';
    btnPlayPause.classList.add('active');
  }
});

// 🎯 Fireworks-js style Cursor-Following Rockets
let mouseRocketsActive = false;
let stopMouseRockets: (() => void) | null = null;
btnMouseRockets.addEventListener('click', (e) => {
  e.stopPropagation();
  mouseRocketsActive = !mouseRocketsActive;
  btnMouseRockets.classList.toggle('active', mouseRocketsActive);

  if (mouseRocketsActive) {
    stopMouseRockets = diwali.enableMouseRockets({ interval: 350, homing: true });
  } else if (stopMouseRockets) {
    stopMouseRockets();
    stopMouseRockets = null;
  }
});

// 💻 Code Snippet Drawer
btnCode.addEventListener('click', (e) => {
  e.stopPropagation();
  codeBanner.classList.toggle('hidden');
  btnCode.classList.toggle('active', !codeBanner.classList.contains('hidden'));
});

// 📋 Copy Button
copyBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  navigator.clipboard.writeText(codeContent.textContent || '');
  copyBtn.textContent = '✅ Copied!';
  setTimeout(() => {
    copyBtn.textContent = '📋 Copy Code';
  }, 1800);
});

// ⛶ Fullscreen Toggle
btnFullscreen.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
});

// Close code drawer if clicked outside
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (!codeBanner.contains(target) && target !== btnCode) {
    codeBanner.classList.add('hidden');
    btnCode.classList.remove('active');
  }
});

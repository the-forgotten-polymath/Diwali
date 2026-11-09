(function () {
  const { DiwaliEngine } = window.DiwaliAnimations || {};
  if (!DiwaliEngine) {
    console.error('[DiwaliOverlay] DiwaliAnimations global bundle not loaded.');
    return;
  }

  const canvas = document.getElementById('overlay-canvas');

  // Initialize engine with canvas in transparent mode
  const diwali = new DiwaliEngine({
    canvas: canvas,
    sound: false, // Default muted for clean desktop overlay
    volume: 0.35,
    dpr: 1.0, // 1:1 pixel mapping for ultra-smooth 60/120 FPS without Retina fill-rate lag
  });

  // A. 🌺 Subtle Marigold Toran across entire top edge with Diwali fairy lights
  // and hanging brass lamps between scallop intersections (fades on mouse proximity!)
  const stopToran = diwali.toran();

  // 1. 🏮 Hanging Lanterns suspended from the top edge with mouse proximity transparency
  const stopHanging = diwali.hangingLanterns(6);

  // 2. 🪔 Glowing Clay Diyas docked along the bottom of the screen (corners cleared)
  const stopDiyas = diwali.diyas({ count: 9, mode: 'docked', clearCorners: true, glowIntensity: 1.1 });

  // 3. 🐕 Realistic Golden Labrador (Julie) eating sweets in bottom-left corner
  const stopLabrador = diwali.labrador(1.0);

  // B. 🏮 Rising sky lanterns: Slowly drifting upwards from bottom to top for beautiful depth
  let stopSkyFloaters = diwali.lanterns({ count: 4, continuous: true, position: 'full' });

  // D. 🌸 Traditional Diwali Rangoli in bottom-right corner (replacing Anar, zero lag!)
  const stopRangoli = diwali.rangoli();

  // 3. Realistic Fireworks Cadence: One or two fireworks randomly every 3.5-5 seconds
  let currentSpeed = 3800;
  let isPlaying = true;
  let stopRockets = diwali.startRocketShow(currentSpeed);

  // 🖱️ Fireworks-JS Mouse Following Feature:
  // Rockets launch automatically towards cursor as you move your mouse across the screen!
  diwali.setMouseFollow(true);

  // 💥 CLICK TO BLAST ROCKET FEATURE:
  // Wherever user clicks on screen (globally across any Mac app or directly), blast a rocket there!
  function blastRocketAt(x, y) {
    if (!isPlaying) return;
    diwali.blastAt(x, y);
  }

  // Local window clicks (if overlay window ever receives focus)
  window.addEventListener('click', (e) => {
    blastRocketAt(e.clientX, e.clientY);
  });

  // Track local mouse movements
  window.addEventListener('mousemove', (e) => {
    diwali.updateMousePosition(e.clientX, e.clientY);
  });

  // Track global OS mouse events & global clicks from Mac system
  if (window.overlayApi) {
    // Global mouse cursor sync (for top toran & lantern proximity fading)
    window.overlayApi.onCursorMove(({ x, y }) => {
      diwali.updateMousePosition(x, y);
    });

    // 💥 Global Click-to-Blast: Blasts a rocket at the exact click coordinate anywhere on screen!
    window.overlayApi.onGlobalClick(({ x, y }) => {
      blastRocketAt(x, y);
    });

    // Toggle pause / resume
    window.overlayApi.onTogglePlay((playing) => {
      isPlaying = playing;
      if (isPlaying) {
        if (!stopRockets) stopRockets = diwali.startRocketShow(currentSpeed);
      } else {
        if (stopRockets) {
          stopRockets();
          stopRockets = null;
        }
      }
    });

    // Toggle sound
    window.overlayApi.onToggleSound((soundEnabled) => {
      diwali.setSoundEnabled(soundEnabled);
    });

    // Master intensity modes: subtle / festive / celebration
    window.overlayApi.onChangeIntensity((mode) => {
      if (mode === 'subtle') {
        currentSpeed = 6500;
      } else if (mode === 'celebration') {
        currentSpeed = 1800;
      } else {
        currentSpeed = 3800; // festive default
      }

      if (isPlaying) {
        if (stopRockets) stopRockets();
        stopRockets = diwali.startRocketShow(currentSpeed);
      }
    });

    // Speed cadence change
    window.overlayApi.onChangeSpeed((speedMs) => {
      currentSpeed = speedMs;
      if (isPlaying) {
        if (stopRockets) stopRockets();
        stopRockets = diwali.startRocketShow(currentSpeed);
      }
    });

    // Launch Salvo
    window.overlayApi.onBurstSalvo((count) => {
      diwali.rockets({ count: count || 5 });
    });
  }
})();

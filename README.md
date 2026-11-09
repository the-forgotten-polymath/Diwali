# diwali-julie 🪔✨

> *A high-performance festive animation engine & ambient desktop screen overlay for Diwali — crafted with love, light, and cherished memories of Julie.*

[![npm version](https://img.shields.io/badge/npm-diwali--julie-orange.svg)](https://www.npmjs.com/package/diwali-julie)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![60/120 FPS](https://img.shields.io/badge/Performance-60%2F120%20FPS-brightgreen.svg)](#-performance--architecture)

---

### 🐾 In Loving Memory of Julie ("Juluu")

<div align="center">
  <img src="electron/julie.png" width="180" alt="Julie my beloved Labrador" />
  <p>
    <em>"Last year on Diwali Julie was here with me and this time I am really missing her a lot...<br>
    This project is for you, my Juluu. 💛🕊️"</em>
  </p>
</div>

---

## 🖥️ macOS Ambient Desktop Screen Overlay

The project features a **native transparent macOS screen overlay** that floats gently above your entire desktop while you work or code. Clicks pass through 100% unimpeded to your active applications (`pointer-events: none`).

### ✨ Desktop Overlay Highlights

- 🐕 **Julie in the Bottom-Left**: Realistic photographic Labrador eating festive besan laddoos from a polished brass urli bowl, with gentle breathing, chewing animations, and floating golden heart sparkles.
- 🌸 **Floor-Perspective Rangoli (Bottom-Right)**: An elliptical mandala resting naturally in horizontal perspective on the floor plane, featuring 16 curved auspicious lotus petals (*Kamal*), peacock teal/turmeric rings, and an upright glowing terracotta Diya flame in the center.
- 🪔 **Docked Terracotta Diyas**: 7 glowing clay lamps docked along the bottom edge with realistic two-tier flame flickers and warm radial candlelight auras.
- 🌺 **Subtle Marigold Toran & Fairy Lights**: Fresh marigold garland across the top edge with twinkling micro-LED fairy lights and hanging brass lamps.
- 🏮 **Hanging Lanterns with Proximity Fade**: Suspended lanterns swaying softly from the top edge that gracefully turn transparent when your cursor approaches tabs or top menus.
- 🏮 **Rising Sky Lanterns**: Warm paper lanterns slowly ascending into the sky to give ambient visual depth.
- 🚀 **Click-to-Blast Rockets**: Click anywhere on your screen (even inside VS Code, browser, or terminal) to launch a rocket directly to your cursor!
- 🖱️ **Cursor-Following Rockets**: Automated rockets gracefully steer toward your mouse cursor as you move across the screen.
- 🪔 **Native Menu Bar Tray (`🪔`)**:
  - ⏸️ Pause / Resume animations
  - 🎚️ Master Intensity: **Subtle** / **Festive** / **Celebration**
  - 🔊 Toggle sound effects (muted by default for focused work)
  - 🚀 Trigger instant celebratory fireworks
  - ❌ Quit overlay

### 🚀 Running the Desktop Overlay

```bash
# 1. Clone the repository
git clone https://github.com/the-forgotten-polymath/Diwali.git
cd Diwali

# 2. Install dependencies
npm install

# 3. Launch the screen overlay
npm run overlay
```

Or simply **double-click** `Launch-Diwali-Overlay.command` from macOS Finder!

To build a standalone **`Diwali Overlay.app`** macOS application bundle:
```bash
npm run package:app
```

---

## 🪔 The Node / Web Package (`diwali-julie`)

`diwali-julie` is a zero-dependency, tree-shakeable festive animation package for modern web apps (React, Next.js, Vue, or Vanilla HTML5 Canvas), plus an instant CLI desktop overlay!

### 📦 Installation

```bash
npm install diwali-julie
```

```bash
yarn add diwali-julie
```

```bash
pnpm add diwali-julie
```

---

## ⚡ Instant Desktop Overlay (`npx diwali-julie`)

You can launch the festive ambient macOS desktop overlay directly from your terminal anytime:

```bash
npx diwali-julie
```

---

## 🚀 Quick Start (Vanilla JavaScript / TypeScript)

### 1. One-Line Festive Salvos

```typescript
import { rockets, diyas, rangoli, labrador, toran, chakri, flowerShower } from 'diwali-julie';

// Launch a rocket salvo bursting into vibrant sparks
rockets({ count: 6 });

// Dock glowing clay diyas at the bottom of the screen (corners cleared)
const stopDiyas = diyas({ mode: 'docked', count: 7, clearCorners: true });

// Place the floor-perspective rangoli in the bottom-right
const stopRangoli = rangoli();

// Place Julie eating sweets in the bottom-left
const stopJulie = labrador(1.0);

// Add top marigold toran with fairy lights
const stopToran = toran();

// Shower celebratory marigold & rose petals
flowerShower({ count: 50, duration: 6000 });
```

### 2. Full Engine Control

```typescript
import { DiwaliEngine } from 'diwali-julie';

const diwali = new DiwaliEngine({
  sound: true,      // Procedural Web Audio (no audio downloads!)
  volume: 0.35,
  dpr: 1.0,         // Crisp 1:1 pixel rendering
});

// Start an automated fireworks show with mouse-following rockets
diwali.startRocketShow(3500);
diwali.setMouseFollow(true);

// Blast a rocket on click
window.addEventListener('click', (e) => {
  diwali.blastAt(e.clientX, e.clientY);
});
```

---

## ⚛️ React Integration

```tsx
import React, { useEffect } from 'react';
import { DiwaliCanvas, useDiwali } from 'diwali-julie/react';

export function DiwaliHero() {
  const { rockets, celebrate } = useDiwali();

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#0a0a0f' }}>
      {/* High-performance transparent overlay canvas */}
      <DiwaliCanvas 
        interactive="rocket" 
        sound={false} 
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} 
      />

      <main style={{ position: 'relative', zIndex: 10, textAlign: 'center', paddingTop: '20vh' }}>
        <h1 style={{ color: '#FFD700', fontSize: '3.5rem' }}>Happy Diwali! 🪔</h1>
        <button 
          onClick={() => celebrate()}
          style={{ padding: '12px 28px', fontSize: '1.2rem', borderRadius: '30px', cursor: 'pointer' }}
        >
          💥 Celebrate
        </button>
      </main>
    </div>
  );
}
```

---

## ⚡ Performance & Architecture

- **Pre-Allocated Object Pooling**: Zero per-frame memory allocation or garbage collection stutter.
- **Offscreen Canvas Caching**: Complex vectors (Rangoli mandala, Diyas, Toran, Sweets bowl) are pre-rasterized to offscreen canvas buffers and blitted in a single fast `drawImage` call.
- **Trace Coordinate Ring Buffers**: Rocket trails maintain a fast fixed-length coordinate queue (`coords.unshift`, `coords.pop`) for smooth, glowing line strokes.
- **Procedural Web Audio**: Whistles, pops, and crackles are synthesized dynamically with Web Audio API oscillators and noise buffers — zero MP3/WAV assets to load.
- **Accessibility & Battery Friendly**: Pauses automatically when the browser tab or desktop is inactive (`document.hidden`), and respects `prefers-reduced-motion`.

---

## 📁 Repository Structure

```
Diwali/
├── demo/                    # Interactive web demo & showcase
├── electron/                # macOS ambient screen overlay source
│   ├── click-monitor.swift  # Native Mach-O zero-permission click detector
│   ├── main.cjs             # Transparent frameless window & tray menu
│   ├── overlay.html         # Overlay DOM container
│   ├── overlay.js           # Overlay composition & interactivity
│   └── preload.cjs          # Secure IPC bridge
├── scripts/                 # Standalone .app packaging script
├── src/                     # Core animation library
│   ├── core/
│   │   ├── effects/         # Diyas, Rockets, Rangoli, Toran, Julie, etc.
│   │   ├── engine/          # Particle pool, Canvas manager, Sound
│   │   └── DiwaliEngine.ts  # Master engine orchestrator
│   └── react/               # React components and hooks
├── test/                    # Node test suites (ESM & CJS)
├── Launch-Diwali-Overlay.command # Double-clickable macOS launcher
├── package.json
└── README.md
```

---

## 📜 License

MIT © 2026 [the-forgotten-polymath](https://github.com/the-forgotten-polymath)

*Dedicated to Julie 💛*

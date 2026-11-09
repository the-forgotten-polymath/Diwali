var X = Object.defineProperty;
var O = (y, e, a) => e in y ? X(y, e, { enumerable: !0, configurable: !0, writable: !0, value: a }) : y[e] = a;
var o = (y, e, a) => O(y, typeof e != "symbol" ? e + "" : e, a);
class N {
  constructor(e = 1e3, a = 4e3) {
    o(this, "pool", []);
    o(this, "activeCount", 0);
    o(this, "maxCapacity");
    o(this, "idSequence", 0);
    this.maxCapacity = a, this.preallocate(e);
  }
  preallocate(e) {
    for (let a = 0; a < e; a++)
      this.pool.push(this.createEmptyParticle());
  }
  createEmptyParticle() {
    return {
      id: ++this.idSequence,
      type: "spark",
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      size: 2,
      initialSize: 2,
      color: "#FFD700",
      alpha: 1,
      life: 0,
      maxLife: 60,
      rotation: 0,
      rotationSpeed: 0,
      scaleX: 1,
      scaleY: 1,
      drag: 0.98,
      active: !1
    };
  }
  acquire() {
    if (this.activeCount++, this.pool.length > 0) {
      const a = this.pool.pop();
      return a.active = !0, a.life = 0, a.alpha = 1, a.prevX = a.x, a.prevY = a.y, a.customData = void 0, a;
    }
    if (this.activeCount < this.maxCapacity) {
      const a = this.createEmptyParticle();
      return a.active = !0, a.prevX = a.x, a.prevY = a.y, a;
    }
    const e = this.createEmptyParticle();
    return e.active = !0, e.prevX = e.x, e.prevY = e.y, e;
  }
  release(e) {
    e.active && (e.active = !1, this.activeCount = Math.max(0, this.activeCount - 1), this.pool.length < this.maxCapacity && this.pool.push(e));
  }
  getActiveCount() {
    return this.activeCount;
  }
  getPoolSize() {
    return this.pool.length;
  }
  clear() {
    this.pool.length = 0, this.activeCount = 0;
  }
}
class B {
  constructor(e, a, t = 9999, r) {
    o(this, "canvas");
    o(this, "ctx");
    o(this, "isCreatedInternally", !1);
    o(this, "parentContainer", null);
    o(this, "resizeObserver", null);
    o(this, "onResizeCallbacks", []);
    o(this, "width", 0);
    o(this, "height", 0);
    o(this, "dpr", 1);
    o(this, "customDpr");
    o(this, "updateDimensions", () => {
      this.dpr = this.customDpr !== void 0 ? this.customDpr : Math.min(window.devicePixelRatio || 1, 1.5);
      let e = window.innerWidth, a = window.innerHeight;
      if (this.parentContainer && this.parentContainer !== document.body) {
        const t = this.parentContainer.getBoundingClientRect();
        e = t.width, a = t.height;
      } else this.isCreatedInternally || (e = this.canvas.clientWidth || window.innerWidth, a = this.canvas.clientHeight || window.innerHeight);
      this.width = e, this.height = a, this.canvas.width = Math.floor(e * this.dpr), this.canvas.height = Math.floor(a * this.dpr), this.ctx.setTransform(1, 0, 0, 1, 0, 0), this.ctx.scale(this.dpr, this.dpr);
      for (const t of this.onResizeCallbacks)
        t(this.width, this.height, this.dpr);
    });
    this.customDpr = r, e ? (this.canvas = e, this.isCreatedInternally = !1) : (this.canvas = document.createElement("canvas"), this.isCreatedInternally = !0, this.canvas.style.position = a ? "absolute" : "fixed", this.canvas.style.top = "0", this.canvas.style.left = "0", this.canvas.style.width = "100%", this.canvas.style.height = "100%", this.canvas.style.pointerEvents = "none", this.canvas.style.zIndex = String(t), this.canvas.setAttribute("aria-hidden", "true"), this.canvas.setAttribute("role", "presentation"), this.parentContainer = a || document.body, this.parentContainer.appendChild(this.canvas));
    const h = this.canvas.getContext("2d");
    if (!h)
      throw new Error("[diwali-animations] Unable to obtain 2D rendering context from canvas.");
    this.ctx = h, this.updateDimensions(), this.setupListeners();
  }
  getCanvas() {
    return this.canvas;
  }
  getContext() {
    return this.ctx;
  }
  onResize(e) {
    return this.onResizeCallbacks.push(e), () => {
      this.onResizeCallbacks = this.onResizeCallbacks.filter((a) => a !== e);
    };
  }
  setupListeners() {
    window.addEventListener("resize", this.updateDimensions), typeof ResizeObserver < "u" && this.parentContainer && this.parentContainer !== document.body && (this.resizeObserver = new ResizeObserver(() => {
      this.updateDimensions();
    }), this.resizeObserver.observe(this.parentContainer));
  }
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  destroy() {
    window.removeEventListener("resize", this.updateDimensions), this.resizeObserver && (this.resizeObserver.disconnect(), this.resizeObserver = null), this.onResizeCallbacks = [], this.isCreatedInternally && this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
  }
}
class U {
  constructor(e = !1, a = 0.35) {
    o(this, "ctx", null);
    o(this, "enabled", !1);
    o(this, "volume", 0.35);
    o(this, "masterGain", null);
    o(this, "compressor", null);
    this.enabled = e, this.volume = Math.max(0, Math.min(1, a));
  }
  initContext() {
    if (!this.ctx)
      try {
        const e = window.AudioContext || window.webkitAudioContext;
        if (!e) return;
        this.ctx = new e(), this.compressor = this.ctx.createDynamicsCompressor(), this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime), this.compressor.knee.setValueAtTime(12, this.ctx.currentTime), this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime), this.compressor.attack.setValueAtTime(3e-3, this.ctx.currentTime), this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime), this.masterGain = this.ctx.createGain(), this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime), this.masterGain.connect(this.compressor), this.compressor.connect(this.ctx.destination);
      } catch {
      }
  }
  setEnabled(e) {
    this.enabled = e, e && !this.ctx && this.initContext();
  }
  isEnabled() {
    return this.enabled;
  }
  setVolume(e) {
    this.volume = Math.max(0, Math.min(1, e)), this.masterGain && this.ctx && this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
  }
  resumeIfSuspended() {
    this.ctx && this.ctx.state === "suspended" && this.ctx.resume().catch(() => {
    });
  }
  /**
   * 🚀 Rocket Launch: High-pitched whistling ascent + fiery exhaust air rush
   */
  playRocketWhistle(e = 0.9) {
    if (!this.enabled || (this.initContext(), !this.ctx || !this.masterGain)) return;
    this.resumeIfSuspended();
    const a = this.ctx.currentTime, t = this.ctx.createOscillator(), r = this.ctx.createGain();
    t.type = "sine", t.frequency.setValueAtTime(380, a), t.frequency.exponentialRampToValueAtTime(1800, a + e), r.gain.setValueAtTime(1e-3, a), r.gain.linearRampToValueAtTime(0.18, a + 0.1), r.gain.exponentialRampToValueAtTime(1e-3, a + e), t.connect(r), r.connect(this.masterGain), t.start(a), t.stop(a + e);
    const h = this.createFilteredNoise(e, 800, 2);
    if (h) {
      const s = this.ctx.createGain();
      s.gain.setValueAtTime(0.08, a), s.gain.exponentialRampToValueAtTime(1e-3, a + e), h.output.connect(s), s.connect(this.masterGain), h.source.start(a), h.source.stop(a + e);
    }
  }
  /**
   * 💥 Firework Explosion: Deep sub-bass boom + shockwave transient + crackle tail
   */
  playExplosion() {
    if (!this.enabled || (this.initContext(), !this.ctx || !this.masterGain)) return;
    this.resumeIfSuspended();
    const e = this.ctx.currentTime, a = this.ctx.createOscillator(), t = this.ctx.createGain();
    a.type = "triangle", a.frequency.setValueAtTime(140, e), a.frequency.exponentialRampToValueAtTime(28, e + 0.45), t.gain.setValueAtTime(0.65, e), t.gain.exponentialRampToValueAtTime(1e-3, e + 0.55), a.connect(t), t.connect(this.masterGain), a.start(e), a.stop(e + 0.6);
    const r = this.createFilteredNoise(0.12, 450, 1);
    if (r) {
      const s = this.ctx.createGain();
      s.gain.setValueAtTime(0.4, e), s.gain.exponentialRampToValueAtTime(1e-3, e + 0.12), r.output.connect(s), s.connect(this.masterGain), r.source.start(e), r.source.stop(e + 0.13);
    }
    const h = 5 + Math.floor(Math.random() * 5);
    for (let s = 0; s < h; s++) {
      const i = 0.12 + Math.random() * 0.35;
      setTimeout(() => {
        this.playMicroSnap(0.08, 0.12);
      }, i * 1e3);
    }
  }
  /**
   * ✨ Phuljhadi (Handheld Sparkler): Sizzling metallic hiss and crackling snaps
   */
  playSparklerCrackle() {
    !this.enabled || Math.random() > 0.45 || (this.initContext(), !(!this.ctx || !this.masterGain) && (this.resumeIfSuspended(), this.playMicroSnap(0.03 + Math.random() * 0.04, 0.09)));
  }
  /**
   * 🌀 Chakri (Ground Spinner): Whirring, fluttering Doppler spin + continuous friction sizzle
   */
  playChakriWhir(e = 4.2) {
    if (!this.enabled || (this.initContext(), !this.ctx || !this.masterGain)) return;
    this.resumeIfSuspended();
    const a = this.ctx.currentTime, t = this.ctx.createOscillator(), r = this.ctx.createGain();
    t.type = "sawtooth", t.frequency.setValueAtTime(200, a), t.frequency.linearRampToValueAtTime(480, a + 1.2), t.frequency.linearRampToValueAtTime(160, a + e);
    const h = this.ctx.createOscillator(), s = this.ctx.createGain();
    h.type = "sine", h.frequency.setValueAtTime(18, a), h.frequency.linearRampToValueAtTime(28, a + 1.5), h.frequency.linearRampToValueAtTime(8, a + e), s.gain.setValueAtTime(0.05, a), h.connect(s.gain), t.connect(r), r.connect(this.masterGain), r.gain.setValueAtTime(0.01, a), r.gain.linearRampToValueAtTime(0.12, a + 0.3), r.gain.exponentialRampToValueAtTime(1e-3, a + e), t.start(a), h.start(a), t.stop(a + e), h.stop(a + e), this.playNoiseCrackle(e, 0.12, 2200);
  }
  /**
   * 🏺 Anar (Flowerpot Fountain): Roaring volcanic jet with continuous crackling embers
   */
  playAnarFountain(e = 4.8) {
    if (!this.enabled || (this.initContext(), !this.ctx || !this.masterGain)) return;
    this.resumeIfSuspended(), this.playNoiseCrackle(e, 0.22, 1800);
    const a = Math.floor(e * 4);
    for (let t = 0; t < a; t++) {
      const r = Math.random() * e;
      setTimeout(() => {
        this.enabled && this.playMicroSnap(0.04, 0.14);
      }, r * 1e3);
    }
  }
  /**
   * 💥 Ladi (Firecracker String): Crisp, sharp, rapid pistol-like firecracker report
   */
  playLadiPop() {
    if (!this.enabled || (this.initContext(), !this.ctx || !this.masterGain)) return;
    this.resumeIfSuspended();
    const e = this.ctx.currentTime, a = this.ctx.createOscillator(), t = this.ctx.createGain(), r = 180 + Math.random() * 80;
    a.type = "triangle", a.frequency.setValueAtTime(r, e), a.frequency.exponentialRampToValueAtTime(40, e + 0.08), t.gain.setValueAtTime(0.45, e), t.gain.exponentialRampToValueAtTime(1e-3, e + 0.08), a.connect(t), t.connect(this.masterGain), a.start(e), a.stop(e + 0.09), this.playMicroSnap(0.035, 0.35);
  }
  playMicroSnap(e, a) {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime, r = this.createFilteredNoise(e, 2500 + Math.random() * 1500, 2.5);
    if (!r) return;
    const h = this.ctx.createGain();
    h.gain.setValueAtTime(a, t), h.gain.exponentialRampToValueAtTime(1e-3, t + e), r.output.connect(h), h.connect(this.masterGain), r.source.start(t), r.source.stop(t + e);
  }
  playNoiseCrackle(e, a, t = 1400) {
    if (!this.ctx || !this.masterGain) return;
    const r = this.ctx.currentTime, h = this.createFilteredNoise(e, t, 1.8);
    if (!h) return;
    const s = this.ctx.createGain();
    s.gain.setValueAtTime(0.01, r), s.gain.linearRampToValueAtTime(a, r + 0.3), s.gain.exponentialRampToValueAtTime(1e-3, r + e), h.output.connect(s), s.connect(this.masterGain), h.source.start(r), h.source.stop(r + e);
  }
  createFilteredNoise(e, a, t) {
    if (!this.ctx) return null;
    const r = Math.floor(this.ctx.sampleRate * Math.min(e, 5)), h = this.ctx.createBuffer(1, r, this.ctx.sampleRate), s = h.getChannelData(0);
    for (let n = 0; n < r; n++)
      s[n] = Math.random() * 2 - 1;
    const i = this.ctx.createBufferSource();
    i.buffer = h;
    const c = this.ctx.createBiquadFilter();
    return c.type = "bandpass", c.frequency.setValueAtTime(a, this.ctx.currentTime), c.Q.setValueAtTime(t, this.ctx.currentTime), i.connect(c), { source: i, output: c };
  }
}
class q {
  constructor(e = window) {
    o(this, "x", 0);
    o(this, "y", 0);
    o(this, "isDown", !1);
    o(this, "isMoving", !1);
    o(this, "speed", 0);
    o(this, "lastX", 0);
    o(this, "lastY", 0);
    o(this, "moveTimeout", null);
    o(this, "clickListeners", []);
    o(this, "moveListeners", []);
    o(this, "handleMouseMove", (e) => {
      this.x = e.clientX, this.y = e.clientY, this.updateMotion();
    });
    o(this, "handleTouchMove", (e) => {
      e.touches.length > 0 && (this.x = e.touches[0].clientX, this.y = e.touches[0].clientY, this.updateMotion());
    });
    o(this, "handleMouseDown", () => {
      this.isDown = !0;
    });
    o(this, "handleMouseUp", () => {
      this.isDown = !1;
    });
    o(this, "handleTouchStart", (e) => {
      this.isDown = !0, e.touches.length > 0 && (this.x = e.touches[0].clientX, this.y = e.touches[0].clientY);
    });
    o(this, "handleTouchEnd", () => {
      this.isDown = !1;
    });
    o(this, "handleClick", (e) => {
      var h, s, i, c;
      const a = e.target;
      if (a && a.closest("button, input, select, a, .control-dock, .side-panel"))
        return;
      const t = "clientX" in e ? e.clientX : ((s = (h = e.changedTouches) == null ? void 0 : h[0]) == null ? void 0 : s.clientX) ?? this.x, r = "clientY" in e ? e.clientY : ((c = (i = e.changedTouches) == null ? void 0 : i[0]) == null ? void 0 : c.clientY) ?? this.y;
      for (const n of this.clickListeners)
        n(t, r, e);
    });
    this.x = window.innerWidth / 2, this.y = window.innerHeight / 2, this.lastX = this.x, this.lastY = this.y, e.addEventListener("mousemove", this.handleMouseMove, { passive: !0 }), e.addEventListener("mousedown", this.handleMouseDown, { passive: !0 }), e.addEventListener("mouseup", this.handleMouseUp, { passive: !0 }), e.addEventListener("click", this.handleClick), e.addEventListener("touchmove", this.handleTouchMove, { passive: !0 }), e.addEventListener("touchstart", this.handleTouchStart, { passive: !0 }), e.addEventListener("touchend", this.handleTouchEnd, { passive: !0 });
  }
  updateMotion() {
    const e = this.x - this.lastX, a = this.y - this.lastY;
    this.speed = Math.sqrt(e * e + a * a), this.lastX = this.x, this.lastY = this.y, this.isMoving = !0;
    for (const t of this.moveListeners)
      t(this.x, this.y);
    this.moveTimeout && window.clearTimeout(this.moveTimeout), this.moveTimeout = window.setTimeout(() => {
      this.isMoving = !1, this.speed = 0;
    }, 100);
  }
  onMove(e) {
    return this.moveListeners.push(e), () => {
      this.moveListeners = this.moveListeners.filter((a) => a !== e);
    };
  }
  onClick(e) {
    return this.clickListeners.push(e), () => {
      this.clickListeners = this.clickListeners.filter((a) => a !== e);
    };
  }
  destroy() {
    window.removeEventListener("mousemove", this.handleMouseMove), window.removeEventListener("mousedown", this.handleMouseDown), window.removeEventListener("mouseup", this.handleMouseUp), window.removeEventListener("click", this.handleClick), window.removeEventListener("touchmove", this.handleTouchMove), window.removeEventListener("touchstart", this.handleTouchStart), window.removeEventListener("touchend", this.handleTouchEnd), this.moveTimeout && window.clearTimeout(this.moveTimeout), this.clickListeners = [], this.moveListeners = [];
  }
}
class Q {
  constructor(e) {
    o(this, "diyas", []);
    o(this, "options");
    o(this, "offscreenDiya", null);
    o(this, "diyaW", 60);
    o(this, "diyaH", 50);
    this.options = {
      container: (e == null ? void 0 : e.container) ?? null,
      canvas: (e == null ? void 0 : e.canvas) ?? null,
      zIndex: (e == null ? void 0 : e.zIndex) ?? 9999,
      sound: (e == null ? void 0 : e.sound) ?? !1,
      volume: (e == null ? void 0 : e.volume) ?? 0.3,
      reducedMotion: (e == null ? void 0 : e.reducedMotion) ?? !0,
      speed: (e == null ? void 0 : e.speed) ?? 1,
      scale: (e == null ? void 0 : e.scale) ?? 1,
      fps: (e == null ? void 0 : e.fps) ?? 50,
      count: (e == null ? void 0 : e.count) ?? 5,
      mode: (e == null ? void 0 : e.mode) ?? "docked",
      positions: (e == null ? void 0 : e.positions) ?? [],
      flickerSpeed: (e == null ? void 0 : e.flickerSpeed) ?? 1,
      glowIntensity: (e == null ? void 0 : e.glowIntensity) ?? 1,
      smoke: (e == null ? void 0 : e.smoke) ?? !1,
      // Disabled by default for maximum 120 FPS smoothness
      clearCorners: (e == null ? void 0 : e.clearCorners) ?? !1
    }, this.createOffscreenDiya(this.options.scale);
  }
  createOffscreenDiya(e) {
    if (typeof document > "u") return;
    const a = e, t = Math.ceil(70 * a), r = Math.ceil(65 * a);
    this.diyaW = t, this.diyaH = r;
    const h = document.createElement("canvas");
    h.width = t, h.height = r;
    const s = h.getContext("2d");
    if (!s) return;
    const i = t / 2, c = r - 14 * a, n = s.createRadialGradient(i, c - 14 * a, 2, i, c - 14 * a, 30 * a);
    n.addColorStop(0, "rgba(255, 179, 0, 0.45)"), n.addColorStop(0.5, "rgba(255, 109, 0, 0.15)"), n.addColorStop(1, "rgba(255, 87, 34, 0)"), s.fillStyle = n, s.beginPath(), s.arc(i, c - 14 * a, 30 * a, 0, Math.PI * 2), s.fill();
    const l = s.createLinearGradient(i, c - 6 * a, i, c + 14 * a);
    l.addColorStop(0, "#D95D28"), l.addColorStop(0.6, "#A73812"), l.addColorStop(1, "#661F04"), s.fillStyle = l, s.beginPath(), s.moveTo(i - 22 * a, c), s.bezierCurveTo(i - 20 * a, c + 14 * a, i + 20 * a, c + 14 * a, i + 22 * a, c), s.bezierCurveTo(i + 15 * a, c + 4 * a, i - 15 * a, c + 4 * a, i - 22 * a, c), s.fill();
    const d = s.createLinearGradient(i - 22 * a, 0, i + 22 * a, 0);
    d.addColorStop(0, "#8A2D09"), d.addColorStop(0.5, "#F9A825"), d.addColorStop(1, "#8A2D09"), s.strokeStyle = d, s.lineWidth = 2.4 * a, s.beginPath(), s.ellipse(i, c, 22 * a, 5 * a, 0, 0, Math.PI * 2), s.stroke();
    const f = s.createRadialGradient(i, c, 0, i, c, 18 * a);
    f.addColorStop(0, "#FFE082"), f.addColorStop(0.7, "#D35400"), f.addColorStop(1, "#78281F"), s.fillStyle = f, s.beginPath(), s.ellipse(i, c, 18 * a, 4.5 * a, 0, 0, Math.PI * 2), s.fill(), s.strokeStyle = "#2C3E50", s.lineWidth = 2 * a, s.beginPath(), s.moveTo(i, c + 1 * a), s.lineTo(i, c - 6 * a), s.stroke();
    const u = s.createLinearGradient(i, c - 6 * a, i, c - 30 * a);
    u.addColorStop(0, "#FF4500"), u.addColorStop(0.35, "#FF8C00"), u.addColorStop(0.85, "#FFD700"), u.addColorStop(1, "rgba(255, 240, 180, 0.9)"), s.fillStyle = u, s.beginPath(), s.moveTo(i - 5.5 * a, c - 6 * a), s.bezierCurveTo(i - 7 * a, c - 12 * a, i - 2 * a, c - 25 * a, i, c - 30 * a), s.bezierCurveTo(i + 2 * a, c - 25 * a, i + 7 * a, c - 12 * a, i + 5.5 * a, c - 6 * a), s.closePath(), s.fill();
    const m = s.createLinearGradient(i, c - 6 * a, i, c - 22 * a);
    m.addColorStop(0, "#00E5FF"), m.addColorStop(0.25, "#FFFFFF"), m.addColorStop(1, "#FFF59D"), s.fillStyle = m, s.beginPath(), s.moveTo(i - 2.8 * a, c - 6 * a), s.bezierCurveTo(i - 3.5 * a, c - 10 * a, i - 1 * a, c - 18 * a, i, c - 22 * a), s.bezierCurveTo(i + 1 * a, c - 18 * a, i + 3.5 * a, c - 10 * a, i + 2.8 * a, c - 6 * a), s.closePath(), s.fill(), this.offscreenDiya = h;
  }
  init(e, a) {
    this.diyas = [], this.createOffscreenDiya(this.options.scale);
    const t = this.options.count;
    if (this.options.mode === "custom" && this.options.positions.length > 0) {
      for (const s of this.options.positions)
        this.diyas.push({
          x: s.x,
          y: s.y,
          baseY: s.y,
          scale: this.options.scale,
          flamePhase: Math.random() * Math.PI * 2,
          flickerSpeed: (0.08 + Math.random() * 0.05) * this.options.flickerSpeed,
          floatPhase: Math.random() * Math.PI * 2,
          floatSpeed: 0.02 + Math.random() * 0.02,
          currentAlpha: 1,
          targetAlpha: 1
        });
      return;
    }
    const r = e / (t + 1), h = typeof this.options.clearCorners == "number" ? this.options.clearCorners : this.options.clearCorners ? 1 : 0;
    for (let s = 0; s < t; s++) {
      if (h > 0 && (s < h || s >= t - h))
        continue;
      const i = r * (s + 1), n = this.options.mode === "docked" ? a - 34 * this.options.scale : a * 0.75 + Math.sin(s) * 20;
      this.diyas.push({
        x: i,
        y: n,
        baseY: n,
        scale: this.options.scale,
        flamePhase: Math.random() * Math.PI * 2,
        flickerSpeed: (0.07 + Math.random() * 0.04) * this.options.flickerSpeed,
        floatPhase: s / t * Math.PI * 2,
        floatSpeed: 0.02 + Math.random() * 0.015,
        currentAlpha: 1,
        targetAlpha: 1
      });
    }
  }
  update(e, a, t = -999, r = -999, h = 1) {
    const s = this.options.mode === "floating";
    for (const i of this.diyas) {
      i.flamePhase += i.flickerSpeed * this.options.speed * h, s && (i.floatPhase += i.floatSpeed * this.options.speed * h, i.y = i.baseY + Math.sin(i.floatPhase) * 6);
      const c = Math.hypot(t - i.x, r - i.y), n = 120 * i.scale;
      if (c < n) {
        const l = Math.max(0, c / n);
        i.targetAlpha = 0.06 + l * 0.94;
      } else
        i.targetAlpha = 1;
      i.currentAlpha += (i.targetAlpha - i.currentAlpha) * Math.min(0.22 * h, 1);
    }
  }
  render(e) {
    if (!this.offscreenDiya) return;
    e.save();
    const a = this.diyaW / 2, t = this.diyaH;
    for (const r of this.diyas) {
      if (r.currentAlpha <= 0.02) continue;
      e.globalAlpha = r.currentAlpha;
      const h = Math.sin(r.flamePhase) * 0.08, s = t * (1 + h);
      e.drawImage(
        this.offscreenDiya,
        r.x - a,
        r.y - s + 14 * r.scale,
        this.diyaW,
        s
      );
    }
    e.restore();
  }
  clear() {
    this.diyas = [];
  }
}
const j = [
  "#FFD700",
  // Gold
  "#FF4500",
  // Saffron / Orange-Red
  "#00E676",
  // Emerald Spark
  "#FF1744",
  // Ruby Red
  "#E040FB",
  // Festive Magenta
  "#00E5FF",
  // Cyan Sparkle
  "#FFAB00",
  // Amber
  "#FFFFFF"
  // Diamond White
];
class H {
  constructor(e, a, t, r) {
    o(this, "rockets", []);
    o(this, "activeSparks", []);
    o(this, "ambientStardust", []);
    o(this, "pool");
    o(this, "sound");
    o(this, "mouse", null);
    o(this, "options");
    o(this, "isContinuous", !1);
    o(this, "spawnInterval", null);
    o(this, "reducedMotion", !1);
    o(this, "lowEndMode", !1);
    // 🖱️ Fireworks-JS Mouse Following
    o(this, "mouseFollow", !0);
    o(this, "lastMouseX", -1);
    o(this, "lastMouseY", -1);
    o(this, "mouseMoveCooldown", 0);
    this.pool = e, this.sound = a, this.mouse = r ?? null, this.options = {
      container: (t == null ? void 0 : t.container) ?? null,
      canvas: (t == null ? void 0 : t.canvas) ?? null,
      zIndex: (t == null ? void 0 : t.zIndex) ?? 9999,
      sound: (t == null ? void 0 : t.sound) ?? !1,
      volume: (t == null ? void 0 : t.volume) ?? 0.3,
      reducedMotion: (t == null ? void 0 : t.reducedMotion) ?? !0,
      speed: (t == null ? void 0 : t.speed) ?? 1,
      scale: (t == null ? void 0 : t.scale) ?? 1,
      fps: (t == null ? void 0 : t.fps) ?? 50,
      count: (t == null ? void 0 : t.count) ?? 2,
      origins: (t == null ? void 0 : t.origins) ?? [],
      colors: (t == null ? void 0 : t.colors) ?? j,
      burstParticles: (t == null ? void 0 : t.burstParticles) ?? 65,
      spread: (t == null ? void 0 : t.spread) ?? 1,
      gravity: (t == null ? void 0 : t.gravity) ?? 0.09
    }, typeof window < "u" && window.matchMedia && (this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches), this.initStardust(window.innerWidth || 1440, window.innerHeight || 900);
  }
  setMouseTracker(e) {
    this.mouse = e;
  }
  setMouseFollow(e) {
    this.mouseFollow = e;
  }
  setLowEndMode(e) {
    this.lowEndMode = e;
  }
  initStardust(e, a) {
    const t = this.reducedMotion ? 6 : this.lowEndMode ? 10 : 20;
    this.ambientStardust = [];
    for (let r = 0; r < t; r++)
      this.ambientStardust.push({
        x: Math.random() * e,
        y: Math.random() * a,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.15 - Math.random() * 0.3,
        size: 0.8 + Math.random() * 1.2,
        alpha: 0.2 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2
      });
  }
  /**
   * 💥 BLAST AT: Direct instantaneous rocket targeting (x, y) like fireworks-js!
   */
  blastAt(e, a) {
    const t = window.innerWidth, r = window.innerHeight, h = Math.max(20, Math.min(t - 20, e + (Math.random() - 0.5) * 80)), s = r + 5, i = e - h, c = a - s, n = Math.hypot(i, c), l = Math.atan2(c, i), d = 14 * this.options.speed, f = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
    this.rockets.push({
      startX: h,
      startY: s,
      x: h,
      y: s,
      targetX: e,
      targetY: a,
      totalDistance: n,
      currentDistance: 0,
      angle: l,
      speed: d,
      acceleration: 1.04,
      color: f,
      coords: [[h, s], [h, s], [h, s]],
      exploded: !1,
      homing: !0
      // Smoothly tracks moving cursor in flight
    }), this.options.sound && this.sound.playRocketWhistle();
  }
  launch(e = this.options.count, a, t, r, h, s = !1) {
    const i = window.innerWidth, c = window.innerHeight;
    for (let n = 0; n < e; n++)
      setTimeout(() => {
        const l = a !== void 0 ? a : (0.08 + Math.random() * 0.84) * i, d = t !== void 0 ? t : c + 5, f = r !== void 0 ? r : l + (Math.random() - 0.5) * 180, u = h !== void 0 ? h : (0.12 + Math.random() * 0.32) * c, m = f - l, g = u - d, v = Math.hypot(m, g), M = Math.atan2(g, m), F = (9.5 + Math.random() * 3.5) * this.options.speed, w = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
        this.rockets.push({
          startX: l,
          startY: d,
          x: l,
          y: d,
          targetX: f,
          targetY: u,
          totalDistance: v,
          currentDistance: 0,
          angle: M,
          speed: F,
          acceleration: 1.025,
          color: w,
          coords: [[l, d], [l, d], [l, d]],
          exploded: !1,
          homing: s
        }), this.options.sound && this.sound.playRocketWhistle();
      }, n * 200);
  }
  startLoop(e = 3800) {
    this.isContinuous = !0, this.launch(1);
    const a = () => {
      if (!this.isContinuous) return;
      const t = Math.random() > 0.65 ? 2 : 1;
      this.launch(t);
      const r = e * (0.8 + Math.random() * 0.5);
      this.spawnInterval = window.setTimeout(a, r);
    };
    this.spawnInterval = window.setTimeout(a, e * 0.7);
  }
  stopLoop() {
    this.isContinuous = !1, this.spawnInterval && (clearTimeout(this.spawnInterval), this.spawnInterval = null);
  }
  update(e = 1) {
    var c;
    const a = window.innerWidth || 1440, t = window.innerHeight || 900;
    this.mouseFollow && this.mouse && this.mouse.x > 0 && this.mouse.y > 0 && (this.mouseMoveCooldown -= e, Math.hypot(this.mouse.x - this.lastMouseX, this.mouse.y - this.lastMouseY) > 8 && (this.lastMouseX = this.mouse.x, this.lastMouseY = this.mouse.y, this.mouseMoveCooldown <= 0 && this.rockets.length < 3 && (this.mouseMoveCooldown = 22, this.blastAt(this.mouse.x, this.mouse.y))));
    for (const n of this.ambientStardust)
      n.phase += 0.03 * e, n.x += (n.vx + Math.sin(n.phase) * 0.12) * e, n.y += n.vy * e, n.y < -10 && (n.y = t + 5, n.x = Math.random() * a), n.x < -10 && (n.x = a + 5), n.x > a + 10 && (n.x = -5);
    for (let n = this.rockets.length - 1; n >= 0; n--) {
      const l = this.rockets[n];
      if (l.homing && this.mouse && this.mouse.x > 0) {
        l.targetX = this.mouse.x, l.targetY = this.mouse.y;
        const m = l.targetX - l.x, g = l.targetY - l.y;
        let M = Math.atan2(g, m) - l.angle;
        for (; M > Math.PI; ) M -= Math.PI * 2;
        for (; M < -Math.PI; ) M += Math.PI * 2;
        l.angle += M * Math.min(0.14 * e, 1), l.totalDistance = Math.hypot(l.targetX - l.startX, l.targetY - l.startY);
      }
      l.coords.pop(), l.coords.unshift([l.x, l.y]), l.speed *= Math.min(1.05, 1 + (l.acceleration - 1) * e);
      const d = Math.cos(l.angle) * l.speed, f = Math.sin(l.angle) * l.speed;
      l.x += d * e, l.y += f * e, l.currentDistance = Math.hypot(l.x - l.startX, l.y - l.startY);
      const u = Math.hypot(l.targetX - l.x, l.targetY - l.y);
      (l.currentDistance >= l.totalDistance || u <= 24 || l.y <= l.targetY) && (this.explodeRocket(l), this.rockets.splice(n, 1));
    }
    const r = Math.max(0.85, 1 - (1 - 0.95) * e), h = Math.max(0.92, 1 - (1 - 0.985) * e), s = this.options.gravity * e, i = this.options.speed * e;
    for (let n = this.activeSparks.length - 1; n >= 0; n--) {
      const l = this.activeSparks[n];
      l.prevX = l.x, l.prevY = l.y;
      const d = (c = l.customData) == null ? void 0 : c.drifting, f = d ? h : r;
      l.vx *= f, l.vy = l.vy * f + (d ? 0.02 * e : s), l.x += l.vx * i, l.y += l.vy * i, l.life += e, l.alpha = Math.max(0, 1 - l.life / l.maxLife), (l.life >= l.maxLife || l.alpha <= 0.01) && (this.pool.release(l), this.activeSparks.splice(n, 1));
    }
    if (this.activeSparks.length > 400) {
      const n = this.activeSparks.length - 400;
      for (let l = 0; l < n; l++) {
        const d = this.activeSparks.shift();
        d && this.pool.release(d);
      }
    }
  }
  explodeRocket(e) {
    this.options.sound && this.sound.playExplosion();
    let a = this.options.burstParticles;
    this.reducedMotion ? a = Math.round(a * 0.35) : this.lowEndMode && (a = Math.round(a * 0.55));
    const t = e.color, r = this.options.colors[Math.floor(Math.random() * this.options.colors.length)], h = Math.floor(Math.random() * 4);
    if (h === 1)
      for (let s = 0; s < a; s++) {
        const i = this.pool.acquire(), c = Math.random() * Math.PI * 2, n = (2.5 + Math.random() * 4.5) * this.options.spread;
        i.x = e.x, i.y = e.y, i.prevX = e.x, i.prevY = e.y, i.vx = Math.cos(c) * n, i.vy = Math.sin(c) * n, i.color = Math.random() > 0.3 ? "#FFD700" : "#FFF9C4", i.size = 2, i.initialSize = i.size, i.alpha = 1, i.maxLife = 65 + Math.random() * 35, i.drag = 0.975, this.activeSparks.push(i);
      }
    else if (h === 2)
      for (let s = 0; s < a; s++) {
        const i = this.pool.acquire(), c = s < a * 0.25, n = c ? Math.random() * Math.PI * 2 : s / a * Math.PI * 2, l = c ? 1.2 + Math.random() * 2 : 4.5;
        i.x = e.x, i.y = e.y, i.prevX = e.x, i.prevY = e.y, i.vx = Math.cos(n) * l, i.vy = Math.sin(n) * l, i.color = c ? r : t, i.size = 2, i.initialSize = i.size, i.alpha = 1, i.maxLife = 48 + Math.random() * 20, i.drag = 0.94, this.activeSparks.push(i);
      }
    else
      for (let s = 0; s < a; s++) {
        const i = this.pool.acquire(), c = Math.random() * Math.PI * 2, n = (2 + Math.random() * 4) * this.options.spread;
        i.x = e.x, i.y = e.y, i.prevX = e.x, i.prevY = e.y, i.vx = Math.cos(c) * n, i.vy = Math.sin(c) * n, i.color = s % 2 === 0 ? t : r, i.size = 2, i.initialSize = i.size, i.alpha = 1, i.maxLife = 45 + Math.random() * 28, i.drag = 0.95, this.activeSparks.push(i);
      }
    for (let s = 0; s < 12; s++) {
      const i = this.pool.acquire(), c = Math.random() * Math.PI * 2, n = 1.5 + Math.random() * 5;
      i.x = e.x, i.y = e.y, i.prevX = e.x, i.prevY = e.y, i.vx = Math.cos(c) * n, i.vy = Math.sin(c) * n * 0.4 - 0.3, i.color = "#FFD700", i.size = 1.2, i.initialSize = i.size, i.alpha = 0.85, i.maxLife = 75 + Math.random() * 40, i.drag = 0.985, i.customData = { drifting: !0 }, this.activeSparks.push(i);
    }
  }
  render(e) {
    e.save(), e.fillStyle = "#FFD54F";
    for (const a of this.ambientStardust)
      e.globalAlpha = a.alpha, e.beginPath(), e.arc(a.x, a.y, a.size, 0, Math.PI * 2), e.fill();
    e.lineCap = "round";
    for (const a of this.rockets) {
      const t = a.coords.length - 1, r = a.coords[t][0], h = a.coords[t][1];
      e.strokeStyle = a.color, e.lineWidth = 2.5, e.globalAlpha = 0.85, e.beginPath(), e.moveTo(r, h), e.lineTo(a.x, a.y), e.stroke(), e.fillStyle = "#FFFFFF", e.globalAlpha = 1, e.beginPath(), e.arc(a.x, a.y, 2.2, 0, Math.PI * 2), e.fill();
    }
    e.globalCompositeOperation = "lighter", e.lineWidth = 1.8;
    for (const a of this.activeSparks)
      e.globalAlpha = a.alpha, e.strokeStyle = a.color, e.beginPath(), e.moveTo(a.prevX, a.prevY), e.lineTo(a.x, a.y), e.stroke();
    e.restore();
  }
  clear() {
    for (const e of this.activeSparks)
      this.pool.release(e);
    this.activeSparks = [], this.rockets = [], this.stopLoop();
  }
}
const Z = [
  "#FFD700",
  // Gold
  "#FF9100",
  // Vivid Orange
  "#00E676",
  // Emerald Green
  "#FFFFFF",
  // White heat
  "#FF3D00"
  // Fiery Red
];
class J {
  constructor(e, a, t, r) {
    o(this, "instances", []);
    o(this, "activeSparks", []);
    o(this, "pool");
    o(this, "sound");
    o(this, "mouse", null);
    o(this, "options");
    this.pool = e, this.sound = a, this.mouse = r ?? null, this.options = {
      container: (t == null ? void 0 : t.container) ?? null,
      canvas: (t == null ? void 0 : t.canvas) ?? null,
      zIndex: (t == null ? void 0 : t.zIndex) ?? 9999,
      sound: (t == null ? void 0 : t.sound) ?? !1,
      volume: (t == null ? void 0 : t.volume) ?? 0.3,
      reducedMotion: (t == null ? void 0 : t.reducedMotion) ?? !0,
      speed: (t == null ? void 0 : t.speed) ?? 1,
      scale: (t == null ? void 0 : t.scale) ?? 1,
      fps: (t == null ? void 0 : t.fps) ?? 50,
      x: (t == null ? void 0 : t.x) ?? window.innerWidth / 2,
      y: (t == null ? void 0 : t.y) ?? window.innerHeight - 80,
      duration: (t == null ? void 0 : t.duration) ?? 4500,
      radius: (t == null ? void 0 : t.radius) ?? 16,
      sparkDensity: (t == null ? void 0 : t.sparkDensity) ?? 1,
      colors: (t == null ? void 0 : t.colors) ?? Z,
      followMouse: (t == null ? void 0 : t.followMouse) ?? !1
    };
  }
  setMouseTracker(e) {
    this.mouse = e;
  }
  ignite(e, a, t, r = !1) {
    const h = r || this.options.followMouse, s = h && this.mouse ? this.mouse.x : e ?? this.options.x, i = h && this.mouse ? this.mouse.y : a ?? this.options.y, c = t ?? this.options.duration;
    this.instances.push({
      x: s,
      y: i,
      radius: this.options.radius * this.options.scale,
      angle: 0,
      angularVelocity: 0.35 * this.options.speed,
      duration: c,
      elapsed: 0,
      sparkColors: this.options.colors,
      followMouse: h,
      finished: !1
    }), this.options.sound && this.sound.playChakriWhir();
  }
  update(e = 1) {
    for (let a = this.instances.length - 1; a >= 0; a--) {
      const t = this.instances[a];
      if (t.elapsed += 20 * e, t.angle += t.angularVelocity * e, t.followMouse && this.mouse && (t.x += (this.mouse.x - t.x) * Math.min(0.4 * e, 1), t.y += (this.mouse.y - t.y) * Math.min(0.4 * e, 1)), t.duration > 0) {
        const h = t.elapsed / t.duration;
        if (h >= 1) {
          t.finished = !0, this.instances.splice(a, 1);
          continue;
        }
        h < 0.2 ? t.angularVelocity = Math.min(0.5, t.angularVelocity + 0.015 * e) : h > 0.7 && (t.angularVelocity = Math.max(0.08, t.angularVelocity * Math.pow(0.985, e)));
      } else
        t.angularVelocity = 0.42 * this.options.speed;
      const r = Math.floor((8 + Math.random() * 8) * this.options.sparkDensity * e);
      for (let h = 0; h < r; h++) {
        const s = Math.PI * 2 * (h % 3) / 3, i = t.angle + s, c = t.x + Math.cos(i) * t.radius, n = t.y + Math.sin(i) * t.radius, l = i + Math.PI / 2, d = (5 + Math.random() * 9) * this.options.scale * (t.angularVelocity / 0.3), f = this.pool.acquire();
        f.x = c, f.y = n, f.prevX = c, f.prevY = n, f.vx = Math.cos(l) * d + (Math.random() - 0.5) * 2, f.vy = Math.sin(l) * d + (Math.random() - 0.5) * 2, f.drag = 0.93, f.color = t.sparkColors[Math.floor(Math.random() * t.sparkColors.length)], f.size = (1.5 + Math.random() * 2.2) * this.options.scale, f.initialSize = f.size, f.alpha = 1, f.life = 0, f.maxLife = 22 + Math.random() * 28, this.activeSparks.push(f);
      }
    }
    for (let a = this.activeSparks.length - 1; a >= 0; a--) {
      const t = this.activeSparks[a];
      t.prevX = t.x, t.prevY = t.y, t.vx *= Math.pow(t.drag, e), t.vy = t.vy * Math.pow(t.drag, e) + 0.05 * e, t.x += t.vx * this.options.speed * e, t.y += t.vy * this.options.speed * e, t.life += e, t.alpha = Math.max(0, 1 - t.life / t.maxLife), (t.life >= t.maxLife || t.alpha <= 0.01) && (this.pool.release(t), this.activeSparks.splice(a, 1));
    }
  }
  render(e) {
    e.save();
    for (const a of this.instances) {
      const t = e.createRadialGradient(a.x, a.y, 2, a.x, a.y, 45 * this.options.scale);
      t.addColorStop(0, "rgba(255, 200, 50, 0.4)"), t.addColorStop(0.5, "rgba(255, 100, 0, 0.15)"), t.addColorStop(1, "rgba(255, 80, 0, 0)"), e.fillStyle = t, e.beginPath(), e.arc(a.x, a.y, 45 * this.options.scale, 0, Math.PI * 2), e.fill(), e.save(), e.translate(a.x, a.y), e.rotate(a.angle), e.fillStyle = "#D84315", e.beginPath(), e.arc(0, 0, a.radius, 0, Math.PI * 2), e.fill(), e.strokeStyle = "#FFE082", e.lineWidth = 2, e.beginPath();
      for (let r = 0; r < Math.PI * 4; r += 0.2) {
        const h = a.radius * r / (Math.PI * 4), s = Math.cos(r) * h, i = Math.sin(r) * h;
        r === 0 ? e.moveTo(s, i) : e.lineTo(s, i);
      }
      e.stroke(), e.fillStyle = "#FFFFFF", e.beginPath(), e.arc(0, 0, 3 * this.options.scale, 0, Math.PI * 2), e.fill(), e.restore();
    }
    e.globalCompositeOperation = "lighter", e.lineCap = "round";
    for (const a of this.activeSparks)
      e.globalAlpha = a.alpha, e.strokeStyle = a.color, e.lineWidth = a.size, e.shadowBlur = 5, e.shadowColor = a.color, e.beginPath(), e.moveTo(a.prevX, a.prevY), e.lineTo(a.x, a.y), e.stroke();
    e.restore();
  }
  clear() {
    for (const e of this.activeSparks)
      this.pool.release(e);
    this.activeSparks = [], this.instances = [];
  }
}
const V = [
  "#FFF8E1",
  // Radiant White/Cream
  "#FFD54F",
  // Golden Spark
  "#FFB300",
  // Amber
  "#FF6F00",
  // Fiery Orange
  "#FF1744"
  // Red ember
];
class K {
  constructor(e, a, t) {
    o(this, "instances", []);
    o(this, "activeSparks", []);
    o(this, "pool");
    o(this, "sound");
    o(this, "options");
    this.pool = e, this.sound = a, this.options = {
      container: (t == null ? void 0 : t.container) ?? null,
      canvas: (t == null ? void 0 : t.canvas) ?? null,
      zIndex: (t == null ? void 0 : t.zIndex) ?? 9999,
      sound: (t == null ? void 0 : t.sound) ?? !1,
      volume: (t == null ? void 0 : t.volume) ?? 0.3,
      reducedMotion: (t == null ? void 0 : t.reducedMotion) ?? !0,
      speed: (t == null ? void 0 : t.speed) ?? 1,
      scale: (t == null ? void 0 : t.scale) ?? 1,
      fps: (t == null ? void 0 : t.fps) ?? 50,
      x: (t == null ? void 0 : t.x) ?? window.innerWidth / 2,
      y: (t == null ? void 0 : t.y) ?? window.innerHeight - 30,
      height: (t == null ? void 0 : t.height) ?? 320,
      spread: (t == null ? void 0 : t.spread) ?? 160,
      duration: (t == null ? void 0 : t.duration) ?? 5e3,
      colors: (t == null ? void 0 : t.colors) ?? V
    };
  }
  ignite(e, a, t, r) {
    const h = e ?? this.options.x, s = a ?? this.options.y, i = t ?? this.options.height, c = r ?? this.options.duration;
    this.instances.push({
      x: h,
      y: s,
      height: i * this.options.scale,
      spread: this.options.spread * this.options.scale,
      duration: c,
      elapsed: 0,
      finished: !1
    }), this.options.sound && this.sound.playAnarFountain();
  }
  update(e = 1) {
    for (let a = this.instances.length - 1; a >= 0; a--) {
      const t = this.instances[a];
      t.elapsed += 20 * e;
      const r = t.elapsed / t.duration;
      if (r >= 1) {
        t.finished = !0, this.instances.splice(a, 1);
        continue;
      }
      let h = 1;
      r < 0.15 ? h = r / 0.15 : r > 0.75 && (h = Math.max(0.1, (1 - r) / 0.25));
      const s = t.y - 28 * this.options.scale, i = Math.floor((14 + Math.random() * 16) * h * e);
      for (let c = 0; c < i; c++) {
        const n = this.pool.acquire(), l = (10 + Math.random() * 9) * h * this.options.scale * this.options.speed, d = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
        n.x = t.x + (Math.random() - 0.5) * 8, n.y = s, n.prevX = n.x, n.prevY = n.y, n.vx = Math.cos(d) * l * 0.4 + (Math.random() - 0.5) * 2.5, n.vy = -Math.sin(d) * l, n.drag = 0.988, n.color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)], n.size = (1.5 + Math.random() * 2.2) * this.options.scale, n.initialSize = n.size, n.alpha = 1, n.life = 0, n.maxLife = 45 + Math.random() * 35, this.activeSparks.push(n);
      }
    }
    for (let a = this.activeSparks.length - 1; a >= 0; a--) {
      const t = this.activeSparks[a];
      t.prevX = t.x, t.prevY = t.y, t.vx *= Math.pow(t.drag, e), t.vy = t.vy * Math.pow(t.drag, e) + 0.22 * e, t.x += t.vx * this.options.speed * e, t.y += t.vy * this.options.speed * e, t.life += e, t.alpha = Math.max(0, 1 - t.life / t.maxLife), (t.life >= t.maxLife || t.alpha <= 0.01) && (this.pool.release(t), this.activeSparks.splice(a, 1));
    }
  }
  render(e) {
    e.save();
    for (const a of this.instances) {
      const t = this.options.scale, r = 32 * t, h = 36 * t;
      e.save(), e.translate(a.x, a.y);
      const s = e.createLinearGradient(0, -r, 0, 0);
      s.addColorStop(0, "#E65100"), s.addColorStop(0.5, "#BF360C"), s.addColorStop(1, "#4E342E"), e.fillStyle = s, e.beginPath(), e.moveTo(0, -r), e.lineTo(h / 2, 0), e.lineTo(-h / 2, 0), e.closePath(), e.fill(), e.strokeStyle = "#FFD54F", e.lineWidth = 2 * t, e.beginPath(), e.moveTo(-h * 0.35, -r * 0.35), e.lineTo(h * 0.35, -r * 0.35), e.moveTo(-h * 0.2, -r * 0.65), e.lineTo(h * 0.2, -r * 0.65), e.stroke();
      const i = e.createRadialGradient(0, -r, 1, 0, -r, 14 * t);
      i.addColorStop(0, "#FFFFFF"), i.addColorStop(0.4, "#FFE082"), i.addColorStop(1, "rgba(255, 111, 0, 0)"), e.fillStyle = i, e.beginPath(), e.arc(0, -r, 14 * t, 0, Math.PI * 2), e.fill(), e.restore();
    }
    e.globalCompositeOperation = "lighter", e.lineCap = "round";
    for (const a of this.activeSparks)
      e.globalAlpha = a.alpha, e.strokeStyle = a.color, e.lineWidth = a.size, e.shadowBlur = 6, e.shadowColor = a.color, e.beginPath(), e.moveTo(a.prevX, a.prevY), e.lineTo(a.x, a.y), e.stroke();
    e.restore();
  }
  clear() {
    for (const e of this.activeSparks)
      this.pool.release(e);
    this.activeSparks = [], this.instances = [];
  }
}
const _ = [
  "#FFFFFF",
  // Diamond White Spark
  "#FFF9C4",
  // Pale Yellow Star
  "#FFD54F",
  // Golden Spark
  "#FFCA28",
  // Amber
  "#FF6F00"
  // Saffron Ember
];
class $ {
  constructor(e, a, t, r) {
    o(this, "wands", []);
    o(this, "activeSparks", []);
    o(this, "pool");
    o(this, "sound");
    o(this, "mouse", null);
    o(this, "options");
    this.pool = e, this.sound = a, this.mouse = r ?? null, this.options = {
      container: (t == null ? void 0 : t.container) ?? null,
      canvas: (t == null ? void 0 : t.canvas) ?? null,
      zIndex: (t == null ? void 0 : t.zIndex) ?? 9999,
      sound: (t == null ? void 0 : t.sound) ?? !1,
      volume: (t == null ? void 0 : t.volume) ?? 0.3,
      reducedMotion: (t == null ? void 0 : t.reducedMotion) ?? !0,
      speed: (t == null ? void 0 : t.speed) ?? 1,
      scale: (t == null ? void 0 : t.scale) ?? 1,
      fps: (t == null ? void 0 : t.fps) ?? 50,
      followMouse: (t == null ? void 0 : t.followMouse) ?? !1,
      x: (t == null ? void 0 : t.x) ?? window.innerWidth * 0.7,
      y: (t == null ? void 0 : t.y) ?? window.innerHeight * 0.6,
      wireLength: (t == null ? void 0 : t.wireLength) ?? 120,
      duration: (t == null ? void 0 : t.duration) ?? 8e3,
      colors: (t == null ? void 0 : t.colors) ?? _
    };
  }
  setMouseTracker(e) {
    this.mouse = e;
  }
  lightWand(e = this.options.followMouse, a, t, r) {
    this.wands.push({
      x: a ?? (e && this.mouse ? this.mouse.x : this.options.x),
      y: t ?? (e && this.mouse ? this.mouse.y : this.options.y),
      angle: -Math.PI / 4,
      // 45 degree tilt
      followMouse: e,
      duration: r ?? this.options.duration,
      elapsed: 0,
      burnLength: 0,
      finished: !1
    });
  }
  update(e = 1) {
    var a;
    for (let t = this.wands.length - 1; t >= 0; t--) {
      const r = this.wands[t];
      if (r.elapsed += 20 * e, r.duration > 0 && r.elapsed >= r.duration) {
        r.finished = !0, this.wands.splice(t, 1);
        continue;
      }
      r.followMouse && this.mouse && (r.x += (this.mouse.x - r.x) * Math.min(0.35 * e, 1), r.y += (this.mouse.y - r.y) * Math.min(0.35 * e, 1));
      const h = r.x, s = r.y, i = Math.floor((5 + Math.random() * 6) * this.options.scale * e);
      for (let c = 0; c < i; c++) {
        const n = this.pool.acquire(), l = Math.random() * Math.PI * 2, d = (2 + Math.random() * 6.5) * this.options.scale * this.options.speed;
        n.x = h + (Math.random() - 0.5) * 4, n.y = s + (Math.random() - 0.5) * 4, n.prevX = h, n.prevY = s, n.vx = Math.cos(l) * d, n.vy = Math.sin(l) * d, n.drag = 0.93, n.color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)], n.size = (1.2 + Math.random() * 2) * this.options.scale, n.initialSize = n.size, n.alpha = 1, n.life = 0, n.maxLife = 18 + Math.random() * 20, n.customData = {
          branch: Math.random() > 0.7
        }, this.activeSparks.push(n);
      }
      this.options.sound && Math.random() < 0.35 * e && this.sound.playSparklerCrackle();
    }
    for (let t = this.activeSparks.length - 1; t >= 0; t--) {
      const r = this.activeSparks[t];
      if (r.prevX = r.x, r.prevY = r.y, r.vx *= Math.pow(r.drag, e), r.vy = r.vy * Math.pow(r.drag, e) + 0.12 * e, r.x += r.vx * this.options.speed * e, r.y += r.vy * this.options.speed * e, r.life += e, r.alpha = Math.max(0, 1 - r.life / r.maxLife), (a = r.customData) != null && a.branch && r.life === Math.floor(r.maxLife * 0.5)) {
        r.customData.branch = !1;
        for (let h = 0; h < 2; h++) {
          const s = this.pool.acquire(), i = Math.random() * Math.PI * 2;
          s.x = r.x, s.y = r.y, s.prevX = r.x, s.prevY = r.y, s.vx = Math.cos(i) * 3, s.vy = Math.sin(i) * 3, s.drag = 0.9, s.color = "#FFF9C4", s.size = 1.2 * this.options.scale, s.initialSize = s.size, s.alpha = 1, s.life = 0, s.maxLife = 10, this.activeSparks.push(s);
        }
      }
      (r.life >= r.maxLife || r.alpha <= 0.01) && (this.pool.release(r), this.activeSparks.splice(t, 1));
    }
  }
  render(e) {
    e.save();
    for (const a of this.wands) {
      const t = this.options.wireLength * this.options.scale, r = a.x - Math.cos(a.angle) * t, h = a.y - Math.sin(a.angle) * t;
      e.strokeStyle = "#90A4AE", e.lineWidth = 2 * this.options.scale, e.beginPath(), e.moveTo(a.x, a.y), e.lineTo(r, h), e.stroke();
      const s = a.x - Math.cos(a.angle) * (t * 0.05), i = a.y - Math.sin(a.angle) * (t * 0.05), c = a.x - Math.cos(a.angle) * (t * 0.65), n = a.y - Math.sin(a.angle) * (t * 0.65);
      e.strokeStyle = "#455A64", e.lineWidth = 4 * this.options.scale, e.beginPath(), e.moveTo(s, i), e.lineTo(c, n), e.stroke();
      const l = e.createRadialGradient(a.x, a.y, 1, a.x, a.y, 18 * this.options.scale);
      l.addColorStop(0, "#FFFFFF"), l.addColorStop(0.3, "#FFE082"), l.addColorStop(0.7, "#FF6F00"), l.addColorStop(1, "rgba(255, 111, 0, 0)"), e.fillStyle = l, e.beginPath(), e.arc(a.x, a.y, 18 * this.options.scale, 0, Math.PI * 2), e.fill();
    }
    e.globalCompositeOperation = "lighter", e.lineCap = "round";
    for (const a of this.activeSparks)
      e.globalAlpha = a.alpha, e.strokeStyle = a.color, e.lineWidth = a.size, e.shadowBlur = 6, e.shadowColor = a.color, e.beginPath(), e.moveTo(a.prevX, a.prevY), e.lineTo(a.x, a.y), e.stroke(), e.fillStyle = a.color, e.beginPath(), e.arc(a.x, a.y, a.size * 0.7, 0, Math.PI * 2), e.fill();
    e.restore();
  }
  clear() {
    for (const e of this.activeSparks)
      this.pool.release(e);
    this.activeSparks = [], this.wands = [];
  }
}
const x = [
  { body: "#FFA726", dark: "#E65100" },
  { body: "#FF7043", dark: "#BF360C" },
  { body: "#FFCA28", dark: "#FF8F00" },
  { body: "#EF5350", dark: "#C62828" }
];
class ee {
  constructor(e) {
    o(this, "lanterns", []);
    o(this, "options");
    o(this, "spriteCanvases", []);
    this.options = {
      container: (e == null ? void 0 : e.container) ?? null,
      canvas: (e == null ? void 0 : e.canvas) ?? null,
      zIndex: (e == null ? void 0 : e.zIndex) ?? 9999,
      sound: (e == null ? void 0 : e.sound) ?? !1,
      volume: (e == null ? void 0 : e.volume) ?? 0.3,
      reducedMotion: (e == null ? void 0 : e.reducedMotion) ?? !0,
      speed: (e == null ? void 0 : e.speed) ?? 1,
      scale: (e == null ? void 0 : e.scale) ?? 1,
      count: (e == null ? void 0 : e.count) ?? 5,
      speedMultiplier: (e == null ? void 0 : e.speed) ?? 1,
      sway: (e == null ? void 0 : e.sway) ?? 1.5,
      size: (e == null ? void 0 : e.size) ?? 36,
      glow: (e == null ? void 0 : e.glow) ?? 1,
      continuous: (e == null ? void 0 : e.continuous) ?? !0,
      position: (e == null ? void 0 : e.position) ?? "full"
    }, this.preRenderSprites();
  }
  preRenderSprites() {
    if (typeof document > "u") return;
    this.spriteCanvases = [];
    const e = 60, a = 80, t = 35, r = e + t * 2, h = a + t * 2, s = r / 2, i = h / 2;
    for (let c = 0; c < x.length; c++) {
      const n = x[c], l = document.createElement("canvas");
      l.width = r, l.height = h;
      const d = l.getContext("2d");
      if (!d) continue;
      const f = d.createRadialGradient(s, i, 4, s, i, 45);
      f.addColorStop(0, "rgba(255, 180, 50, 0.45)"), f.addColorStop(0.5, "rgba(255, 100, 20, 0.16)"), f.addColorStop(1, "rgba(255, 80, 0, 0)"), d.fillStyle = f, d.beginPath(), d.arc(s, i, 45, 0, Math.PI * 2), d.fill();
      const u = d.createLinearGradient(s - e / 2, i - a / 2, s + e / 2, i + a / 2);
      u.addColorStop(0, "#FFF176"), u.addColorStop(0.4, n.body), u.addColorStop(1, n.dark), d.fillStyle = u;
      const m = e * 0.2;
      d.beginPath(), d.roundRect(s - e / 2, i - a / 2, e, a, [m, m, m * 0.4, m * 0.4]), d.fill(), d.strokeStyle = "#5D4037", d.lineWidth = 2, d.strokeRect(s - e * 0.4, i + a / 2 - 3, e * 0.8, 4);
      const g = d.createRadialGradient(s, i + a * 0.22, 0, s, i + a * 0.22, e * 0.35);
      g.addColorStop(0, "#FFFFFF"), g.addColorStop(0.4, "#FFE082"), g.addColorStop(1, "rgba(255, 160, 0, 0)"), d.fillStyle = g, d.beginPath(), d.arc(s, i + a * 0.22, e * 0.35, 0, Math.PI * 2), d.fill(), this.spriteCanvases.push(l);
    }
  }
  init(e, a) {
    this.lanterns = [];
    for (let t = 0; t < this.options.count; t++)
      this.lanterns.push(this.createLantern(e, a, !0));
  }
  createLantern(e, a, t = !1) {
    const r = 0.45 + Math.random() * 0.55, h = this.options.size * this.options.scale * r, s = h * 1.35, i = Math.floor(Math.random() * x.length), c = Math.random() * e, n = this.options.position === "sky" ? a * 0.55 : a, l = t ? Math.random() * n : a + s + Math.random() * 80;
    return {
      x: c,
      y: l,
      baseX: c,
      width: h,
      height: s,
      vy: (-0.35 - Math.random() * 0.45) * this.options.speed * r,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: (0.012 + Math.random() * 0.014) * this.options.speed,
      swayAmplitude: (14 + Math.random() * 20) * this.options.sway * r,
      paletteIndex: i,
      depth: r,
      currentAlpha: 1,
      targetAlpha: 1
    };
  }
  update(e, a, t = -999, r = -999, h = 1) {
    for (let s = 0; s < this.lanterns.length; s++) {
      const i = this.lanterns[s];
      i.swayPhase += i.swaySpeed * h, i.x = i.baseX + Math.sin(i.swayPhase) * i.swayAmplitude, i.y += i.vy * h;
      const c = Math.hypot(t - i.x, r - i.y), n = 90 * i.depth;
      if (c < n) {
        const l = Math.max(0, c / n);
        i.targetAlpha = 0.08 + l * 0.92;
      } else
        i.targetAlpha = 1;
      i.currentAlpha += (i.targetAlpha - i.currentAlpha) * Math.min(0.25 * h, 1), i.y < -i.height * 2 && (this.options.continuous ? this.lanterns[s] = this.createLantern(e, a, !1) : (this.lanterns.splice(s, 1), s--));
    }
  }
  render(e) {
    if (this.spriteCanvases.length !== 0) {
      e.save();
      for (const a of this.lanterns) {
        if (a.currentAlpha <= 0.02) continue;
        const t = this.spriteCanvases[a.paletteIndex];
        if (!t) continue;
        e.save(), e.globalAlpha = 0.88 * a.depth * a.currentAlpha;
        const r = a.width * 2.1, h = a.height * 1.85;
        e.drawImage(t, a.x - r / 2, a.y - h / 2, r, h), e.restore();
      }
      e.restore();
    }
  }
  clear() {
    this.lanterns = [];
  }
}
const te = ["#FF9800", "#FFB300", "#F57C00", "#FFC107"], ae = ["#C2185B", "#D81B60", "#E91E63", "#880E4F"];
class se {
  constructor(e) {
    o(this, "petals", []);
    o(this, "options");
    o(this, "isRunning", !1);
    this.options = {
      container: (e == null ? void 0 : e.container) ?? null,
      canvas: (e == null ? void 0 : e.canvas) ?? null,
      zIndex: (e == null ? void 0 : e.zIndex) ?? 9999,
      sound: (e == null ? void 0 : e.sound) ?? !1,
      volume: (e == null ? void 0 : e.volume) ?? 0.3,
      reducedMotion: (e == null ? void 0 : e.reducedMotion) ?? !0,
      speed: (e == null ? void 0 : e.speed) ?? 1,
      scale: (e == null ? void 0 : e.scale) ?? 1,
      fps: (e == null ? void 0 : e.fps) ?? 50,
      count: (e == null ? void 0 : e.count) ?? 60,
      petalType: (e == null ? void 0 : e.petalType) ?? "mix",
      wind: (e == null ? void 0 : e.wind) ?? 0.2,
      duration: (e == null ? void 0 : e.duration) ?? 6e3
    };
  }
  shower(e, a) {
    this.isRunning = !0, this.petals = [];
    for (let t = 0; t < this.options.count; t++)
      this.petals.push(this.createPetal(e, a, !0));
    this.options.duration > 0 && setTimeout(() => {
      this.isRunning = !1;
    }, this.options.duration);
  }
  createPetal(e, a, t = !1) {
    let r = "marigold";
    this.options.petalType === "rose" ? r = "rose" : this.options.petalType === "mix" && (r = Math.random() > 0.4 ? "marigold" : "rose");
    const h = r === "marigold" ? te : ae, s = h[Math.floor(Math.random() * h.length)];
    return {
      x: Math.random() * (e + 100) - 50,
      y: t ? Math.random() * a - a * 0.3 : -20 - Math.random() * 50,
      vy: (1.2 + Math.random() * 1.5) * this.options.speed,
      vx: this.options.wind * 2 + (Math.random() - 0.5) * 0.5,
      size: (10 + Math.random() * 8) * this.options.scale,
      type: r,
      color: s,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
      rollAngle: Math.random() * Math.PI * 2,
      rollSpeed: (Math.random() - 0.5) * 0.05,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.03 + Math.random() * 0.02,
      alpha: 0.9
    };
  }
  update(e, a, t = 1) {
    for (let r = this.petals.length - 1; r >= 0; r--) {
      const h = this.petals[r];
      h.swayPhase += h.swaySpeed * t, h.rotation += h.rotationSpeed * t, h.rollAngle += h.rollSpeed * t, h.x += (h.vx + Math.sin(h.swayPhase) * 1.2) * t, h.y += h.vy * t, h.y > a + 30 && (this.isRunning ? this.petals[r] = this.createPetal(e, a, !1) : this.petals.splice(r, 1));
    }
  }
  render(e) {
    e.save();
    for (const a of this.petals) {
      e.save(), e.translate(a.x, a.y), e.rotate(a.rotation);
      const t = Math.cos(a.rollAngle);
      e.scale(t, 1), e.globalAlpha = a.alpha, e.fillStyle = a.color, a.type === "marigold" ? (e.beginPath(), e.moveTo(0, 0), e.bezierCurveTo(-a.size * 0.4, -a.size * 0.5, -a.size * 0.3, -a.size, 0, -a.size), e.bezierCurveTo(a.size * 0.3, -a.size, a.size * 0.4, -a.size * 0.5, 0, 0), e.fill(), e.strokeStyle = "rgba(190, 80, 0, 0.4)", e.lineWidth = 1, e.beginPath(), e.moveTo(0, 0), e.lineTo(0, -a.size * 0.85), e.stroke()) : (e.beginPath(), e.moveTo(0, 0), e.bezierCurveTo(-a.size * 0.5, -a.size * 0.4, -a.size * 0.6, -a.size * 0.8, 0, -a.size), e.bezierCurveTo(a.size * 0.6, -a.size * 0.8, a.size * 0.5, -a.size * 0.4, 0, 0), e.fill()), e.restore();
    }
    e.restore();
  }
  clear() {
    this.petals = [], this.isRunning = !1;
  }
}
class re {
  constructor(e, a, t) {
    o(this, "crackers", []);
    o(this, "activeSparks", []);
    o(this, "smokeClouds", []);
    o(this, "paperDebris", []);
    o(this, "pool");
    o(this, "sound");
    o(this, "options");
    o(this, "currentIndex", 0);
    o(this, "burstTimer", null);
    o(this, "isIgnited", !1);
    this.pool = e, this.sound = a, this.options = {
      container: (t == null ? void 0 : t.container) ?? null,
      canvas: (t == null ? void 0 : t.canvas) ?? null,
      zIndex: (t == null ? void 0 : t.zIndex) ?? 9999,
      sound: (t == null ? void 0 : t.sound) ?? !1,
      volume: (t == null ? void 0 : t.volume) ?? 0.3,
      reducedMotion: (t == null ? void 0 : t.reducedMotion) ?? !0,
      speed: (t == null ? void 0 : t.speed) ?? 1,
      scale: (t == null ? void 0 : t.scale) ?? 1,
      fps: (t == null ? void 0 : t.fps) ?? 50,
      x: (t == null ? void 0 : t.x) ?? window.innerWidth * 0.5,
      y: (t == null ? void 0 : t.y) ?? 60,
      crackerCount: (t == null ? void 0 : t.crackerCount) ?? 40,
      length: (t == null ? void 0 : t.length) ?? 280
    };
  }
  ignite(e, a, t) {
    const r = e ?? this.options.x, h = a ?? this.options.y, s = t ?? this.options.crackerCount, i = this.options.length * this.options.scale;
    this.crackers = [];
    const c = i / s;
    for (let n = 0; n < s; n++) {
      const l = h + n * c, d = n % 2 === 0 ? 1 : -1;
      this.crackers.push({
        x: r + d * (8 * this.options.scale),
        y: l,
        exploded: !1,
        angle: d * 0.3
      });
    }
    this.currentIndex = this.crackers.length - 1, this.isIgnited = !0, this.burstNextCracker();
  }
  burstNextCracker() {
    if (!this.isIgnited || this.currentIndex < 0) {
      this.isIgnited = !1;
      return;
    }
    const e = this.crackers[this.currentIndex];
    e.exploded = !0, this.options.sound && this.sound.playLadiPop();
    const a = Math.floor(10 * this.options.scale);
    for (let r = 0; r < a; r++) {
      const h = this.pool.acquire(), s = Math.random() * Math.PI * 2, i = 2 + Math.random() * 5;
      h.x = e.x, h.y = e.y, h.prevX = e.x, h.prevY = e.y, h.vx = Math.cos(s) * i, h.vy = Math.sin(s) * i, h.drag = 0.92, h.color = Math.random() > 0.4 ? "#FFFFFF" : "#FFD54F", h.size = 2 * this.options.scale, h.initialSize = h.size, h.alpha = 1, h.life = 0, h.maxLife = 12 + Math.random() * 12, this.activeSparks.push(h);
    }
    for (let r = 0; r < 3; r++)
      this.smokeClouds.push({
        x: e.x + (Math.random() - 0.5) * 8,
        y: e.y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.8 - Math.random() * 0.8,
        size: 8 + Math.random() * 8,
        alpha: 0.5,
        life: 0,
        maxLife: 35 + Math.random() * 20
      });
    for (let r = 0; r < 4; r++)
      this.paperDebris.push({
        x: e.x,
        y: e.y,
        vx: (Math.random() - 0.5) * 4,
        vy: -1 - Math.random() * 3,
        size: 3 + Math.random() * 3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        alpha: 1
      });
    this.currentIndex--;
    const t = 35 + Math.random() * 40;
    this.burstTimer = window.setTimeout(() => {
      this.burstNextCracker();
    }, t);
  }
  update(e = 1) {
    for (let a = this.activeSparks.length - 1; a >= 0; a--) {
      const t = this.activeSparks[a];
      t.prevX = t.x, t.prevY = t.y, t.vx *= Math.pow(t.drag, e), t.vy = t.vy * Math.pow(t.drag, e) + 0.1 * e, t.x += t.vx * this.options.speed * e, t.y += t.vy * this.options.speed * e, t.life += e, t.alpha = Math.max(0, 1 - t.life / t.maxLife), (t.life >= t.maxLife || t.alpha <= 0.01) && (this.pool.release(t), this.activeSparks.splice(a, 1));
    }
    for (let a = this.smokeClouds.length - 1; a >= 0; a--) {
      const t = this.smokeClouds[a];
      t.x += t.vx * e, t.y += t.vy * e, t.size += 0.3 * e, t.life += e, t.alpha = Math.max(0, 0.5 * (1 - t.life / t.maxLife)), t.life >= t.maxLife && this.smokeClouds.splice(a, 1);
    }
    for (let a = this.paperDebris.length - 1; a >= 0; a--) {
      const t = this.paperDebris[a];
      t.x += t.vx * e, t.vy += 0.15 * e, t.y += t.vy * e, t.rotation += t.rotationSpeed * e, t.alpha *= Math.pow(0.98, e), (t.alpha <= 0.05 || t.y > window.innerHeight) && this.paperDebris.splice(a, 1);
    }
  }
  render(e) {
    if (e.save(), this.crackers.length > 0) {
      const a = this.crackers[0].y - 20, t = this.crackers[this.crackers.length - 1].y, r = this.options.x;
      e.strokeStyle = "#D7CCC8", e.lineWidth = 2 * this.options.scale, e.beginPath(), e.moveTo(r, a), e.lineTo(r, t), e.stroke();
      for (const h of this.crackers)
        h.exploded || (e.save(), e.translate(h.x, h.y), e.rotate(h.angle), e.fillStyle = "#D32F2F", e.fillRect(-6 * this.options.scale, -3 * this.options.scale, 12 * this.options.scale, 6 * this.options.scale), e.fillStyle = "#FFD54F", e.fillRect(-2 * this.options.scale, -3 * this.options.scale, 4 * this.options.scale, 6 * this.options.scale), e.restore());
    }
    for (const a of this.paperDebris)
      e.save(), e.translate(a.x, a.y), e.rotate(a.rotation), e.fillStyle = `rgba(211, 47, 47, ${a.alpha})`, e.fillRect(-a.size / 2, -a.size / 2, a.size, a.size * 0.7), e.restore();
    for (const a of this.smokeClouds)
      e.fillStyle = `rgba(220, 220, 225, ${a.alpha})`, e.beginPath(), e.arc(a.x, a.y, a.size, 0, Math.PI * 2), e.fill();
    e.globalCompositeOperation = "lighter", e.lineCap = "round";
    for (const a of this.activeSparks)
      e.globalAlpha = a.alpha, e.strokeStyle = a.color, e.lineWidth = a.size, e.beginPath(), e.moveTo(a.prevX, a.prevY), e.lineTo(a.x, a.y), e.stroke();
    e.restore();
  }
  clear() {
    this.burstTimer && (clearTimeout(this.burstTimer), this.burstTimer = null), this.isIgnited = !1, this.crackers = [], this.smokeClouds = [], this.paperDebris = [];
    for (const e of this.activeSparks)
      this.pool.release(e);
    this.activeSparks = [];
  }
}
const S = [
  { primary: "#FF5722", accent: "#FFD700" },
  // Saffron Red & Gold
  { primary: "#FF9800", accent: "#FFF59D" },
  // Amber Orange & Bright Yellow
  { primary: "#E91E63", accent: "#FFEB3B" },
  // Festive Magenta & Golden
  { primary: "#9C27B0", accent: "#FFD54F" },
  // Royal Purple & Gold
  { primary: "#00BCD4", accent: "#FFE082" }
  // Turquoise & Gold
];
class ie {
  constructor(e = 6) {
    o(this, "lanterns", []);
    o(this, "count", 6);
    o(this, "fadeRadius", 170);
    o(this, "spriteCanvases", []);
    this.count = e, this.preRenderSprites();
  }
  preRenderSprites() {
    if (typeof document > "u") return;
    this.spriteCanvases = [];
    const e = 44, a = e * 1.35, t = e + 24, r = a + 24, h = e * 0.5, s = t / 2, i = 12;
    for (let c = 0; c < S.length; c++) {
      const n = S[c], l = document.createElement("canvas");
      l.width = t, l.height = r;
      const d = l.getContext("2d");
      if (!d) continue;
      d.fillStyle = "rgba(255, 150, 0, 0.25)", d.beginPath(), d.arc(s, i + a * 0.45, h * 1.3, 0, Math.PI * 2), d.fill();
      const f = d.createLinearGradient(s - h, i, s + h, i + a);
      f.addColorStop(0, n.primary), f.addColorStop(0.5, n.accent), f.addColorStop(1, n.primary), d.fillStyle = f, d.beginPath(), d.moveTo(s, i), d.lineTo(s + h, i + a * 0.45), d.lineTo(s + h * 0.5, i + a), d.lineTo(s - h * 0.5, i + a), d.lineTo(s - h, i + a * 0.45), d.closePath(), d.fill(), d.fillStyle = "#FFA000", d.fillRect(s - h * 0.35, i - 5, h * 0.7, 5), d.fillStyle = "#FFD700", d.beginPath(), d.arc(s, i - 6, 3.5, 0, Math.PI * 2), d.fill();
      const u = d.createRadialGradient(s, i + a * 0.45, 2, s, i + a * 0.45, h * 0.7);
      u.addColorStop(0, "rgba(255, 255, 255, 0.95)"), u.addColorStop(0.4, "rgba(255, 235, 59, 0.75)"), u.addColorStop(1, "rgba(255, 152, 0, 0)"), d.fillStyle = u, d.beginPath(), d.arc(s, i + a * 0.45, h * 0.7, 0, Math.PI * 2), d.fill(), this.spriteCanvases.push(l);
    }
  }
  init(e) {
    this.lanterns = [];
    const a = e / (this.count + 1);
    for (let t = 0; t < this.count; t++) {
      const r = a * (t + 1), h = t % S.length, s = S[h], i = 35 + t % 3 * 16 + Math.random() * 8, c = 40, n = c * 1.35;
      this.lanterns.push({
        baseX: r,
        x: r,
        y: i,
        stringLength: i,
        width: c,
        height: n,
        swayPhase: t / this.count * Math.PI * 2 + Math.random(),
        swaySpeed: 0.016 + Math.random() * 0.01,
        swayMaxAngle: 0.07 + Math.random() * 0.05,
        swayAngle: 0,
        glowPhase: Math.random() * Math.PI * 2,
        paletteIndex: h,
        primaryColor: s.primary,
        accentColor: s.accent,
        currentAlpha: 1,
        targetAlpha: 1
      });
    }
  }
  update(e, a, t = 1) {
    for (const r of this.lanterns) {
      r.swayPhase += r.swaySpeed * t, r.swayAngle = Math.sin(r.swayPhase) * r.swayMaxAngle, r.glowPhase += 0.05 * t, r.x = r.baseX + Math.sin(r.swayAngle) * r.stringLength, r.y = Math.cos(r.swayAngle) * r.stringLength;
      const h = Math.hypot(e - r.x, a - (r.y + r.height * 0.5));
      if (h < this.fadeRadius) {
        const s = Math.max(0.06, h / this.fadeRadius);
        r.targetAlpha = s * s;
        const i = (r.x - e) / (this.fadeRadius || 1);
        r.swayAngle += i * 5e-3 * t;
      } else
        r.targetAlpha = 1;
      r.currentAlpha += (r.targetAlpha - r.currentAlpha) * Math.min(0.2 * t, 1);
    }
  }
  render(e) {
    if (this.spriteCanvases.length !== 0) {
      e.save();
      for (const a of this.lanterns) {
        if (a.currentAlpha <= 0.01) continue;
        e.save(), e.globalAlpha = a.currentAlpha, e.strokeStyle = "rgba(255, 215, 0, 0.45)", e.lineWidth = 1.2, e.beginPath(), e.moveTo(a.baseX, 0), e.lineTo(a.x, a.y), e.stroke(), e.translate(a.x, a.y), e.rotate(a.swayAngle);
        const t = this.spriteCanvases[a.paletteIndex];
        if (t) {
          const i = a.width + 24, c = a.height + 24;
          e.drawImage(t, -i / 2, -6, i, c);
        }
        e.strokeStyle = a.accentColor, e.lineWidth = 1.4;
        const r = a.width * 0.5, h = a.height, s = Math.sin(a.swayPhase * 1.3) * 5;
        e.beginPath(), e.moveTo(-r * 0.3, h), e.quadraticCurveTo(-r * 0.15, h + 10, -r * 0.3 + s, h + 20), e.moveTo(0, h), e.quadraticCurveTo(s * 0.5, h + 11, s, h + 22), e.moveTo(r * 0.3, h), e.quadraticCurveTo(r * 0.15, h + 10, r * 0.3 + s, h + 20), e.stroke(), e.restore();
      }
      e.restore();
    }
  }
  clear() {
    this.lanterns = [];
  }
}
class he {
  constructor(e) {
    o(this, "scale", 1);
    o(this, "width", 1440);
    o(this, "nodes", []);
    o(this, "fairyLights", []);
    o(this, "currentAlpha", 1);
    o(this, "targetAlpha", 1);
    o(this, "time", 0);
    // High-performance offscreen canvas caching for static elements
    o(this, "offscreenCanvas", null);
    o(this, "isCached", !1);
    this.scale = (e == null ? void 0 : e.scale) ?? 1;
  }
  init(e, a) {
    this.width = e, this.nodes = [], this.fairyLights = [], this.isCached = !1;
    const t = this.scale, r = 240 * t, h = Math.max(4, Math.round(e / r)), s = e / h, i = 38 * t;
    for (let c = 0; c < h; c++) {
      const n = c * s;
      this.nodes.push({
        apexX: n,
        lampChainLen: (26 + c % 2 * 8) * t,
        flamePhase: Math.random() * Math.PI * 2
      });
      const l = Math.round(s / (14 * t));
      for (let d = 0; d <= l; d++) {
        const f = d / l, u = n + f * s, m = 4 * f * (1 - f) * i;
        d % 2 === 0 && this.fairyLights.push({
          x: u,
          y: m - 2 * t,
          phase: Math.random() * Math.PI * 2,
          color: d % 4 === 0 ? "#FFF9C4" : "#FFD54F"
        });
      }
    }
    this.nodes.push({
      apexX: e,
      lampChainLen: 28 * t,
      flamePhase: Math.random() * Math.PI * 2
    }), this.preRenderStaticToran(h, s, i);
  }
  preRenderStaticToran(e, a, t) {
    if (typeof document > "u") return;
    const r = this.scale, h = Math.ceil(t + 45 * r);
    this.offscreenCanvas = document.createElement("canvas"), this.offscreenCanvas.width = this.width, this.offscreenCanvas.height = h;
    const s = this.offscreenCanvas.getContext("2d");
    if (!s) return;
    const i = "#FF6F00", c = "#FFA000", n = "#FFD600", l = "#FFF176", d = "#1B5E20", f = "#2E7D32";
    s.strokeStyle = "#D84315", s.lineWidth = 2.5 * r, s.beginPath(), s.moveTo(0, 0), s.lineTo(this.width, 0), s.stroke();
    for (let u = 0; u < e; u++) {
      const m = u * a, g = Math.round(a / (14 * r));
      for (let v = 1; v < g; v += 2) {
        const M = v / g, F = m + M * a, w = 4 * M * (1 - M) * t + 8 * r, A = 8 * r, b = (M - 0.5) * 0.4;
        s.save(), s.translate(F, w), s.rotate(b), s.fillStyle = v % 4 === 1 ? d : f, s.beginPath(), s.moveTo(0, -A), s.quadraticCurveTo(A * 0.7, 0, 0, A * 1.6), s.quadraticCurveTo(-A * 0.7, 0, 0, -A), s.fill(), s.strokeStyle = "#1B5E20", s.lineWidth = 1 * r, s.beginPath(), s.moveTo(0, -A), s.lineTo(0, A * 1.4), s.stroke(), s.restore();
      }
      for (let v = 0; v <= g; v++) {
        const M = v / g, F = m + M * a, w = 4 * M * (1 - M) * t, A = (u * g + v) % 2 === 0;
        s.fillStyle = A ? l : c, s.beginPath(), s.arc(F, w, (7 + v % 2 * 1.5) * r, 0, Math.PI * 2), s.fill(), s.fillStyle = A ? n : i, s.beginPath(), s.arc(F, w, (5 + v % 2) * r, 0, Math.PI * 2), s.fill();
      }
    }
    for (const u of this.nodes) {
      const m = u.apexX, g = u.lampChainLen;
      s.strokeStyle = "#FFB300", s.lineWidth = 1.2 * r, s.beginPath(), s.moveTo(m, 0), s.lineTo(m, g), s.stroke(), s.fillStyle = "#FFA000", s.beginPath(), s.arc(m, g - 2 * r, 3.5 * r, 0, Math.PI * 2), s.fill();
      const v = s.createLinearGradient(m - 10 * r, g, m + 10 * r, g + 7 * r);
      v.addColorStop(0, "#FF8F00"), v.addColorStop(0.5, "#FFE082"), v.addColorStop(1, "#E65100"), s.fillStyle = v, s.beginPath(), s.ellipse(m, g + 5 * r, 10 * r, 4.5 * r, 0, 0, Math.PI * 2), s.fill();
    }
    this.isCached = !0;
  }
  update(e, a, t = 1) {
    if (this.time += 0.05 * t, a < 130) {
      const r = Math.max(0, a / 130);
      this.targetAlpha = 0.08 + r * 0.92;
    } else
      this.targetAlpha = 1;
    this.currentAlpha += (this.targetAlpha - this.currentAlpha) * Math.min(0.2 * t, 1);
  }
  render(e) {
    if (this.currentAlpha <= 0.02) return;
    e.save(), e.globalAlpha = this.currentAlpha, this.isCached && this.offscreenCanvas && e.drawImage(this.offscreenCanvas, 0, 0);
    const a = this.scale;
    for (const t of this.nodes) {
      const r = t.apexX, h = t.lampChainLen, s = Math.sin(this.time * 3 + t.flamePhase) * 1.5 * a;
      e.fillStyle = "#FFF9C4", e.beginPath(), e.moveTo(r - 2.5 * a, h + 3 * a), e.quadraticCurveTo(r - 3.5 * a, h, r, h - 7 * a + s), e.quadraticCurveTo(r + 3.5 * a, h, r + 2.5 * a, h + 3 * a), e.closePath(), e.fill(), e.fillStyle = "#FFFFFF", e.beginPath(), e.ellipse(r, h + 1 * a, 1.2 * a, 2.5 * a, 0, 0, Math.PI * 2), e.fill();
    }
    for (const t of this.fairyLights) {
      const r = (Math.sin(this.time * 4 + t.phase) + 1) * 0.5;
      e.fillStyle = t.color, e.globalAlpha = this.currentAlpha * (0.4 + r * 0.6), e.beginPath(), e.arc(t.x, t.y, (1.6 + r * 1.2) * a, 0, Math.PI * 2), e.fill();
    }
    e.restore();
  }
  clear() {
  }
}
const ne = "data:image/webp;base64,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";
class le {
  constructor(e) {
    o(this, "scale", 1);
    o(this, "x", 12);
    o(this, "y", 0);
    o(this, "targetWidth", 125);
    o(this, "targetHeight", 148);
    o(this, "image", null);
    o(this, "isImageLoaded", !1);
    o(this, "chewPhase", 0);
    o(this, "breathPhase", 0);
    o(this, "sparkleTimer", 0);
    o(this, "currentAlpha", 1);
    o(this, "targetAlpha", 1);
    // Offscreen pre-rendered sweets bowl & laddoos
    o(this, "bowlCanvas", null);
    o(this, "bowlOffsetX", 0);
    o(this, "bowlOffsetY", 0);
    o(this, "crumbs", []);
    o(this, "sparkles", []);
    typeof e == "number" ? this.scale = e : e && (this.scale = e.scale ?? 1);
    const a = typeof e == "object" && (e != null && e.imageSrc) ? e.imageSrc : ne;
    this.loadImage(a);
  }
  loadImage(e) {
    typeof Image > "u" || (this.image = new Image(), this.image.onload = () => {
      this.isImageLoaded = !0;
    }, this.image.src = e, this.image.complete && this.image.naturalWidth > 0 && (this.isImageLoaded = !0));
  }
  init(e) {
    const a = this.scale;
    this.targetHeight = Math.round(148 * a), this.targetWidth = Math.round(this.targetHeight * (420 / 495)), this.x = 10 * a, this.y = e - this.targetHeight - 6 * a, this.preRenderSweetsBowl();
  }
  preRenderSweetsBowl() {
    if (typeof document > "u") return;
    const e = this.scale, a = 32 * e, t = 23 * e, r = Math.ceil(a * 2 + 50 * e), h = Math.ceil(t + 60 * e);
    this.bowlCanvas = document.createElement("canvas"), this.bowlCanvas.width = r, this.bowlCanvas.height = h;
    const s = this.bowlCanvas.getContext("2d");
    if (!s) return;
    const i = r / 2, c = h - 12 * e;
    this.bowlOffsetX = i, this.bowlOffsetY = c;
    const n = s.createRadialGradient(i, c - 14 * e, 4 * e, i, c - 14 * e, 48 * e);
    n.addColorStop(0, "rgba(255, 179, 0, 0.35)"), n.addColorStop(0.6, "rgba(255, 143, 0, 0.12)"), n.addColorStop(1, "rgba(255, 143, 0, 0)"), s.fillStyle = n, s.beginPath(), s.arc(i, c - 14 * e, 48 * e, 0, Math.PI * 2), s.fill(), s.fillStyle = "rgba(0, 0, 0, 0.40)", s.beginPath(), s.ellipse(i, c + 4 * e, a, 7 * e, 0, 0, Math.PI * 2), s.fill();
    const l = s.createLinearGradient(i - a, 0, i + a, -t);
    l.addColorStop(0, "#E65100"), l.addColorStop(0.25, "#FFB300"), l.addColorStop(0.55, "#FFF176"), l.addColorStop(0.8, "#FFA000"), l.addColorStop(1, "#BF360C"), s.fillStyle = l, s.beginPath(), s.moveTo(i - a, c), s.bezierCurveTo(
      i - a * 0.9,
      c - t,
      i + a * 0.9,
      c - t,
      i + a,
      c
    ), s.closePath(), s.fill();
    const d = s.createLinearGradient(i - a, 0, i + a, 0);
    d.addColorStop(0, "#FFA000"), d.addColorStop(0.4, "#FFFDE7"), d.addColorStop(0.7, "#FFD54F"), d.addColorStop(1, "#FF8F00"), s.strokeStyle = d, s.lineWidth = 3.6 * e, s.beginPath(), s.ellipse(i, c - t + 2 * e, a, 7.5 * e, 0, 0, Math.PI * 2), s.stroke();
    const f = [
      { x: i - 16 * e, y: c - t - 2 * e, r: 11.5 * e, c1: "#FFE082", c2: "#FF8F00", vark: !0 },
      { x: i + 16 * e, y: c - t - 2 * e, r: 11.5 * e, c1: "#FFD54F", c2: "#FF6F00", vark: !0 },
      { x: i, y: c - t - 1 * e, r: 12 * e, c1: "#FFF9C4", c2: "#FFA000", vark: !1 },
      { x: i, y: c - t - 14 * e, r: 11 * e, c1: "#FFF9C4", c2: "#FFA000", vark: !0 }
    ];
    for (const u of f) {
      const m = s.createRadialGradient(
        u.x - u.r * 0.35,
        u.y - u.r * 0.35,
        u.r * 0.15,
        u.x,
        u.y,
        u.r
      );
      m.addColorStop(0, u.c1), m.addColorStop(1, u.c2), s.fillStyle = "rgba(0, 0, 0, 0.22)", s.beginPath(), s.arc(u.x, u.y + 2 * e, u.r, 0, Math.PI * 2), s.fill(), s.fillStyle = m, s.beginPath(), s.arc(u.x, u.y, u.r, 0, Math.PI * 2), s.fill(), s.fillStyle = "#00E676", s.beginPath(), s.ellipse(u.x - u.r * 0.25, u.y - u.r * 0.3, 2.2 * e, 1.2 * e, 0.5, 0, Math.PI * 2), s.fill(), u.vark && (s.fillStyle = "rgba(255, 255, 255, 0.85)", s.beginPath(), s.arc(u.x - u.r * 0.32, u.y - u.r * 0.38, 2 * e, 0, Math.PI * 2), s.fill());
    }
  }
  update(e, a, t = 1) {
    this.chewPhase += 0.08 * t, this.breathPhase += 0.04 * t;
    const r = this.x + this.targetWidth * 0.6, h = this.y + this.targetHeight * 0.55, s = Math.hypot(e - r, a - h), i = 200 * this.scale;
    if (s < i) {
      const n = Math.max(0, s / i);
      this.targetAlpha = 0.06 + n * 0.94;
    } else
      this.targetAlpha = 1;
    if (this.currentAlpha += (this.targetAlpha - this.currentAlpha) * Math.min(0.22 * t, 1), s < 220 && (this.sparkleTimer += t, this.sparkleTimer > 18 && (this.sparkleTimer = 0, this.sparkles.push({
      x: r + (Math.random() - 0.5) * 50,
      y: this.y + 25 + Math.random() * 25,
      vx: (Math.random() - 0.5) * 1,
      vy: -1 - Math.random() * 0.8,
      size: 9 + Math.random() * 5,
      alpha: 1,
      char: Math.random() < 0.6 ? "✨" : "💛"
    }))), Math.sin(this.chewPhase * 2.2) > 0.8 && Math.random() < 0.35 * t) {
      const n = ["#FFB300", "#FFA000", "#FFE082", "#FF8F00"], l = this.x + this.targetWidth + 30 * this.scale, d = this.y + this.targetHeight - 16 * this.scale;
      this.crumbs.push({
        x: l + (Math.random() - 0.5) * 26,
        y: d - 18 * this.scale,
        vx: (Math.random() - 0.5) * 2.2,
        vy: -1.8 - Math.random() * 1.8,
        size: 1.8 + Math.random() * 2.4,
        alpha: 1,
        color: n[Math.floor(Math.random() * n.length)]
      });
    }
    for (let n = this.crumbs.length - 1; n >= 0; n--) {
      const l = this.crumbs[n];
      l.x += l.vx * t, l.y += l.vy * t, l.vy += 0.16 * t, l.alpha -= 0.028 * t, l.alpha <= 0 && this.crumbs.splice(n, 1);
    }
    for (let n = this.sparkles.length - 1; n >= 0; n--) {
      const l = this.sparkles[n];
      l.x += l.vx * t, l.y += l.vy * t, l.alpha -= 0.022 * t, l.alpha <= 0 && this.sparkles.splice(n, 1);
    }
  }
  render(e) {
    if (this.currentAlpha <= 0.02) return;
    const a = this.scale, t = this.targetWidth, r = this.targetHeight, h = this.y + r;
    if (e.save(), e.globalAlpha = this.currentAlpha, e.fillStyle = "rgba(0, 0, 0, 0.28)", e.beginPath(), e.ellipse(this.x + t * 0.42, h + 3 * a, t * 0.52, 7 * a, 0, 0, Math.PI * 2), e.fill(), this.image && (this.isImageLoaded || this.image.complete)) {
      e.save();
      const s = Math.sin(this.breathPhase) * 0.012, i = Math.sin(this.chewPhase) * 1.3 * a, c = this.x + t * 0.45, n = h;
      e.translate(c, n + i), e.scale(1 - s * 0.4, 1 + s), e.translate(-c, -n), e.drawImage(this.image, this.x, this.y, t, r), e.restore();
    }
    if (this.bowlCanvas) {
      const s = this.x + t + 30 * a, i = h - 4 * a;
      e.drawImage(this.bowlCanvas, s - this.bowlOffsetX, i - this.bowlOffsetY);
    }
    for (const s of this.crumbs)
      e.save(), e.globalAlpha = Math.max(0, s.alpha), e.fillStyle = s.color, e.beginPath(), e.arc(s.x, s.y, s.size * a, 0, Math.PI * 2), e.fill(), e.restore();
    for (const s of this.sparkles)
      e.save(), e.globalAlpha = Math.max(0, s.alpha), e.font = `${Math.round(s.size * a)}px sans-serif`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(s.char, s.x, s.y), e.restore();
    e.restore();
  }
  clear() {
    this.crumbs = [], this.sparkles = [];
  }
}
class oe {
  constructor(e) {
    o(this, "scale", 1);
    o(this, "x", 0);
    o(this, "y", 0);
    o(this, "radiusX", 68);
    o(this, "radiusY", 34);
    o(this, "nativeR", 56);
    o(this, "offscreenCanvas", null);
    o(this, "flamePhase", 0);
    o(this, "currentAlpha", 1);
    o(this, "targetAlpha", 1);
    o(this, "options");
    this.options = e, this.scale = (e == null ? void 0 : e.scale) ?? 1, this.radiusX = Math.round(((e == null ? void 0 : e.radiusX) ?? 68) * this.scale), this.radiusY = Math.round(((e == null ? void 0 : e.radiusY) ?? 34) * this.scale);
  }
  init(e, a) {
    var s, i, c, n;
    const t = this.scale;
    this.radiusX = Math.round((((s = this.options) == null ? void 0 : s.radiusX) ?? 68) * t), this.radiusY = Math.round((((i = this.options) == null ? void 0 : i.radiusY) ?? 34) * t);
    const r = 16 * t, h = 24 * t;
    this.x = ((c = this.options) == null ? void 0 : c.x) ?? e - this.radiusX - h, this.y = ((n = this.options) == null ? void 0 : n.y) ?? a - this.radiusY - r, this.preRenderRangoli();
  }
  preRenderRangoli() {
    if (typeof document > "u") return;
    const e = this.nativeR, t = Math.ceil((e + 14) * 2), r = t / 2, h = t / 2;
    this.offscreenCanvas = document.createElement("canvas"), this.offscreenCanvas.width = t, this.offscreenCanvas.height = t;
    const s = this.offscreenCanvas.getContext("2d");
    if (!s) return;
    const i = s.createRadialGradient(r, h, e * 0.45, r, h, e + 8);
    i.addColorStop(0, "rgba(0, 0, 0, 0.46)"), i.addColorStop(0.7, "rgba(0, 0, 0, 0.18)"), i.addColorStop(1, "rgba(0, 0, 0, 0)"), s.fillStyle = i, s.beginPath(), s.arc(r, h, e + 8, 0, Math.PI * 2), s.fill(), s.fillStyle = "#6E1B00", s.beginPath(), s.arc(r, h, e * 0.98, 0, Math.PI * 2), s.fill(), s.strokeStyle = "rgba(255, 255, 255, 0.95)", s.lineWidth = 1.6, s.stroke();
    const c = 16, n = Math.PI * 2 / c;
    for (let f = 0; f < c; f++) {
      const u = f * n, m = u + n / 2, g = u + n, v = e * 0.64, M = f % 2 === 0 ? e * 0.96 : e * 0.88, F = e * 0.82, w = r + Math.cos(u) * v, A = h + Math.sin(u) * v, b = r + Math.cos(m) * M, C = h + Math.sin(m) * M, R = r + Math.cos(g) * v, T = h + Math.sin(g) * v, k = r + Math.cos(u + n * 0.22) * F, P = h + Math.sin(u + n * 0.22) * F, L = r + Math.cos(m - n * 0.08) * (M * 0.98), E = h + Math.sin(m - n * 0.08) * (M * 0.98), G = r + Math.cos(m + n * 0.08) * (M * 0.98), I = h + Math.sin(m + n * 0.08) * (M * 0.98), Y = r + Math.cos(g - n * 0.22) * F, D = h + Math.sin(g - n * 0.22) * F, p = s.createRadialGradient(r, h, v * 0.8, b, C, e * 0.4);
      f % 2 === 0 ? (p.addColorStop(0, "#B71C1C"), p.addColorStop(0.5, "#E91E63"), p.addColorStop(1, "#FF80AB")) : (p.addColorStop(0, "#E65100"), p.addColorStop(0.6, "#FF9800"), p.addColorStop(1, "#FFE082")), s.fillStyle = p, s.beginPath(), s.moveTo(w, A), s.bezierCurveTo(k, P, L, E, b, C), s.bezierCurveTo(G, I, Y, D, R, T), s.closePath(), s.fill(), s.strokeStyle = "rgba(255, 255, 255, 0.85)", s.lineWidth = 1, s.stroke();
      const z = r + Math.cos(m) * (M * 0.92), W = h + Math.sin(m) * (M * 0.92);
      s.fillStyle = "#FFFFFF", s.beginPath(), s.arc(z, W, 1.3, 0, Math.PI * 2), s.fill();
    }
    for (let f = 0; f < c; f++) {
      const u = (f + 0.5) * n, m = f * n, g = (f + 1) * n, v = e * 0.44, M = e * 0.65, F = e * 0.56, w = r + Math.cos(m) * v, A = h + Math.sin(m) * v, b = r + Math.cos(u) * M, C = h + Math.sin(u) * M, R = r + Math.cos(g) * v, T = h + Math.sin(g) * v, k = r + Math.cos(m + n * 0.25) * F, P = h + Math.sin(m + n * 0.25) * F, L = r + Math.cos(g - n * 0.25) * F, E = h + Math.sin(g - n * 0.25) * F;
      s.fillStyle = f % 2 === 0 ? "#FFB300" : "#FFD54F", s.beginPath(), s.moveTo(w, A), s.quadraticCurveTo(k, P, b, C), s.quadraticCurveTo(L, E, R, T), s.closePath(), s.fill(), s.strokeStyle = "#FFFFFF", s.lineWidth = 0.8, s.stroke();
    }
    s.fillStyle = "#00695C", s.beginPath(), s.arc(r, h, e * 0.43, 0, Math.PI * 2), s.fill(), s.strokeStyle = "#FFFFFF", s.lineWidth = 1.3, s.stroke(), s.fillStyle = "#FFC107", s.beginPath(), s.arc(r, h, e * 0.32, 0, Math.PI * 2), s.fill(), s.fillStyle = "#FFFFFF";
    for (let f = 0; f < 12; f++) {
      const u = f / 12 * Math.PI * 2, m = r + Math.cos(u) * (e * 0.38), g = h + Math.sin(u) * (e * 0.38);
      s.beginPath(), s.arc(m, g, 1.4, 0, Math.PI * 2), s.fill();
    }
    const l = e * 0.21, d = s.createRadialGradient(r, h, 2, r, h, l);
    d.addColorStop(0, "#FFA000"), d.addColorStop(0.5, "#D84315"), d.addColorStop(1, "#8D2B0F"), s.fillStyle = d, s.beginPath(), s.arc(r, h, l, 0, Math.PI * 2), s.fill(), s.strokeStyle = "#FFF176", s.lineWidth = 1.3, s.stroke(), s.fillStyle = "#4E342E", s.beginPath(), s.arc(r, h, l * 0.65, 0, Math.PI * 2), s.fill(), s.fillStyle = "#212121", s.beginPath(), s.arc(r, h - l * 0.2, 1.5, 0, Math.PI * 2), s.fill();
  }
  update(e = -999, a = -999, t = 1) {
    this.flamePhase += 0.08 * t;
    const r = Math.hypot(e - this.x, a - this.y), h = 150 * this.scale;
    if (r < h) {
      const s = Math.max(0, r / h);
      this.targetAlpha = 0.06 + s * 0.94;
    } else
      this.targetAlpha = 1;
    this.currentAlpha += (this.targetAlpha - this.currentAlpha) * Math.min(0.22 * t, 1);
  }
  render(e) {
    if (!this.offscreenCanvas || this.currentAlpha <= 0.02) return;
    e.save(), e.globalAlpha = this.currentAlpha;
    const a = this.nativeR, t = 14, r = (a + t) * 2, h = (a + t) / a, s = this.radiusX * 2 * h, i = this.radiusY * 2 * h;
    e.drawImage(
      this.offscreenCanvas,
      0,
      0,
      r,
      r,
      this.x - s / 2,
      this.y - i / 2,
      s,
      i
    );
    const c = Math.sin(this.flamePhase) * 1.5, n = this.x, l = this.y - 2 * this.scale, d = e.createRadialGradient(
      n,
      l - 6,
      1,
      n,
      l - 6,
      30 * this.scale
    );
    d.addColorStop(0, "rgba(255, 214, 0, 0.65)"), d.addColorStop(0.45, "rgba(255, 111, 0, 0.24)"), d.addColorStop(1, "rgba(255, 111, 0, 0)"), e.fillStyle = d, e.beginPath(), e.arc(n, l - 6, 30 * this.scale, 0, Math.PI * 2), e.fill();
    const f = (16 + c) * this.scale, u = 5 * this.scale;
    e.fillStyle = "#FF9100", e.beginPath(), e.moveTo(n - u, l), e.quadraticCurveTo(n - u * 1.3, l - f * 0.4, n, l - f), e.quadraticCurveTo(n + u * 1.3, l - f * 0.4, n + u, l), e.closePath(), e.fill();
    const m = f * 0.72, g = u * 0.62;
    e.fillStyle = "#FFEA00", e.beginPath(), e.moveTo(n - g, l), e.quadraticCurveTo(n - g * 1.2, l - m * 0.4, n, l - m), e.quadraticCurveTo(n + g * 1.2, l - m * 0.4, n + g, l), e.closePath(), e.fill(), e.fillStyle = "#FFFFFF", e.beginPath(), e.ellipse(n, l - m * 0.35, 1.4 * this.scale, 3.2 * this.scale, 0, 0, Math.PI * 2), e.fill(), e.restore();
  }
  clear() {
  }
}
class de {
  constructor(e) {
    o(this, "canvasMgr");
    o(this, "pool");
    o(this, "sound");
    o(this, "mouse");
    o(this, "diyasRenderer", null);
    o(this, "hangingLanternsRenderer", null);
    o(this, "toranRenderer", null);
    o(this, "rangoliRenderer", null);
    o(this, "labradorRenderer", null);
    o(this, "rocketsRenderer");
    o(this, "chakriRenderer");
    o(this, "anarRenderer");
    o(this, "phuljhadiRenderer");
    o(this, "lanternsRenderer", null);
    o(this, "flowerShowerRenderer", null);
    o(this, "ladiRenderer");
    o(this, "animationFrameId", null);
    o(this, "isRunning", !1);
    o(this, "isPaused", !1);
    o(this, "interactiveClickMode", "none");
    o(this, "lastFrameTime", 0);
    this.canvasMgr = new B(e == null ? void 0 : e.canvas, e == null ? void 0 : e.container, (e == null ? void 0 : e.zIndex) ?? 9999, e == null ? void 0 : e.dpr), this.pool = new N(800, 3500), this.sound = new U((e == null ? void 0 : e.sound) ?? !1, (e == null ? void 0 : e.volume) ?? 0.3), this.mouse = new q(this.canvasMgr.getCanvas().parentElement || window), this.rocketsRenderer = new H(this.pool, this.sound, e, this.mouse), this.chakriRenderer = new J(this.pool, this.sound, e, this.mouse), this.anarRenderer = new K(this.pool, this.sound, e), this.phuljhadiRenderer = new $(this.pool, this.sound, e, this.mouse), this.ladiRenderer = new re(this.pool, this.sound, e), this.setupListeners(), this.startLoop();
  }
  setupListeners() {
    this.canvasMgr.onResize((e, a) => {
      this.diyasRenderer && this.diyasRenderer.init(e, a), this.lanternsRenderer && this.lanternsRenderer.init(e, a), this.hangingLanternsRenderer && this.hangingLanternsRenderer.init(e), this.toranRenderer && this.toranRenderer.init(e, a), this.rangoliRenderer && this.rangoliRenderer.init(e, a), this.labradorRenderer && this.labradorRenderer.init(a);
    }), document.addEventListener("visibilitychange", () => {
      this.isPaused = document.hidden;
    }), this.mouse.onClick((e, a) => {
      this.handleInteractiveClick(e, a);
    });
  }
  handleInteractiveClick(e, a) {
    if (this.interactiveClickMode === "none") return;
    let t = this.interactiveClickMode;
    if (t === "random") {
      const r = ["rocket", "chakri", "anar", "phuljhadi"];
      t = r[Math.floor(Math.random() * r.length)];
    }
    switch (t) {
      case "rocket":
        this.rocketsRenderer.launch(1, e, this.canvasMgr.height, a);
        break;
      case "chakri":
        this.chakriRenderer.ignite(e, a);
        break;
      case "anar":
        this.anarRenderer.ignite(e, a);
        break;
      case "phuljhadi":
        this.phuljhadiRenderer.lightWand(!1, e, a, 4e3);
        break;
    }
  }
  setSoundEnabled(e) {
    this.sound.setEnabled(e);
  }
  setSoundVolume(e) {
    this.sound.setVolume(e);
  }
  /**
   * 🪔 Diyas (Deepak): Floating or bottom-docked clay lamps with organic flame flickering & warm ambient glow
   */
  diyas(e) {
    return (e == null ? void 0 : e.sound) !== void 0 && this.sound.setEnabled(e.sound), this.diyasRenderer = new Q(e), this.diyasRenderer.init(this.canvasMgr.width, this.canvasMgr.height), () => {
      this.diyasRenderer = null;
    };
  }
  /**
   * 🏮 Hanging Lanterns: Suspended from the top of the screen with pendulum sway
   * and intelligent mouse-proximity transparency (fades smoothly when mouse comes near!).
   */
  hangingLanterns(e = 9) {
    return this.hangingLanternsRenderer = new ie(e), this.hangingLanternsRenderer.init(this.canvasMgr.width), () => {
      this.hangingLanternsRenderer = null;
    };
  }
  /**
   * 🌺 Subtle Marigold Toran: Traditional flower garland, fairy lights, and hanging brass lamps
   * across the top edge with intelligent mouse-proximity transparency!
   */
  toran(e) {
    return this.toranRenderer = new he(e), this.toranRenderer.init(this.canvasMgr.width, this.canvasMgr.height), () => {
      this.toranRenderer = null;
    };
  }
  /**
   * 💥 BLAST AT: Direct rocket launch detonating precisely where clicked!
   */
  blastAt(e, a) {
    this.rocketsRenderer.blastAt(e, a);
  }
  /**
   * 🖱️ Fireworks-JS Mouse Following: Toggle continuous mouse-following rockets
   */
  setMouseFollow(e) {
    this.rocketsRenderer.setMouseFollow(e);
  }
  /**
   * ⛲ Occasional Anar Fountain: Spawns a sparkling flowerpot fountain in the bottom corner
   */
  startOccasionalAnar(e = 18e3) {
    let a = null;
    const t = () => {
      const r = this.canvasMgr.width, h = this.canvasMgr.height, s = Math.max(r * 0.72, r - 120);
      this.anar({ x: s, y: h - 14, height: 180, duration: 4200 });
      const i = e * (0.8 + Math.random() * 0.4);
      a = window.setTimeout(t, i);
    };
    return a = window.setTimeout(t, 3500), () => {
      a && clearTimeout(a);
    };
  }
  /**
   * 🌸 Traditional Diwali Rangoli: Intricate geometric floral floor art in bottom corner with central glowing diya
   */
  rangoli(e) {
    return this.rangoliRenderer = new oe(e), this.rangoliRenderer.init(this.canvasMgr.width, this.canvasMgr.height), () => {
      this.rangoliRenderer = null;
    };
  }
  /**
   * 🐕 Labrador Dog: Realistic Golden Labrador (Julie) eating festive treats in the bottom-left corner
   */
  labrador(e) {
    return this.labradorRenderer = new le(e), this.labradorRenderer.init(this.canvasMgr.height), () => {
      this.labradorRenderer = null;
    };
  }
  /**
   * Update mouse cursor coordinates (useful for global OS cursor tracking in desktop overlays)
   */
  updateMousePosition(e, a) {
    this.mouse.x = e, this.mouse.y = a;
  }
  /**
   * 🚀 Enable fireworks-js style cursor-following rockets!
   * Rockets launch from the bottom, curve and track your moving cursor,
   * and detonate into vibrant bursts right where your mouse is pointing.
   */
  enableMouseRockets(e) {
    (e == null ? void 0 : e.sound) !== void 0 && this.sound.setEnabled(e.sound);
    const a = (e == null ? void 0 : e.interval) ?? 380, t = (e == null ? void 0 : e.homing) ?? !0;
    let r = 0;
    const h = (c, n) => {
      const l = performance.now();
      if (l - r < a) return;
      r = l;
      const d = this.canvasMgr.width, f = this.canvasMgr.height, u = Math.max(30, Math.min(d - 30, c + (Math.random() - 0.5) * 220)), m = f;
      this.rocketsRenderer.launch(1, u, m, c, n, t);
    }, s = this.mouse.onMove((c, n) => {
      h(c, n);
    }), i = window.setInterval(() => {
      (this.mouse.isMoving || this.mouse.isDown) && h(this.mouse.x, this.mouse.y);
    }, a);
    return () => {
      s(), clearInterval(i);
    };
  }
  /**
   * 🚀 Rockets (Aatishbazi): Upward launching whistling trail bursting into colorful sparkle clusters
   */
  rockets(e) {
    (e == null ? void 0 : e.sound) !== void 0 && this.sound.setEnabled(e.sound);
    const a = (e == null ? void 0 : e.count) ?? 4;
    return this.rocketsRenderer.launch(a), () => {
      this.rocketsRenderer.clear();
    };
  }
  /**
   * 🚀 Start continuous ambient rocket launches randomly from the bottom of the screen into the night sky
   */
  startRocketShow(e = 850) {
    return this.rocketsRenderer.startLoop(e), () => {
      this.rocketsRenderer.stopLoop();
    };
  }
  /**
   * 🌀 Chakri (Ground Spinner): Spinning circular wheel shooting centrifugal golden & colorful sparks
   */
  chakri(e) {
    return (e == null ? void 0 : e.sound) !== void 0 && this.sound.setEnabled(e.sound), this.chakriRenderer.ignite(e == null ? void 0 : e.x, e == null ? void 0 : e.y, e == null ? void 0 : e.duration, (e == null ? void 0 : e.followMouse) ?? !1), () => {
      this.chakriRenderer.clear();
    };
  }
  /**
   * 🌀 Enable spinning Chakkar (fire wheel) that follows the user's cursor / touch point
   */
  enableMouseChakkar(e) {
    return this.chakri({ ...e, followMouse: !0, duration: 0 });
  }
  /**
   * 🏺 Anar (Flowerpot Fountain): High-reaching vertical fountain of sparkling golden embers
   */
  anar(e) {
    return (e == null ? void 0 : e.sound) !== void 0 && this.sound.setEnabled(e.sound), this.anarRenderer.ignite(e == null ? void 0 : e.x, e == null ? void 0 : e.y, e == null ? void 0 : e.height, e == null ? void 0 : e.duration), () => {
      this.anarRenderer.clear();
    };
  }
  /**
   * ✨ Phuljhadi (Sparkler): Crackling golden/silver sparks with micro-bursts and smoke trail
   */
  phuljhadi(e) {
    return (e == null ? void 0 : e.sound) !== void 0 && this.sound.setEnabled(e.sound), this.phuljhadiRenderer.lightWand(
      (e == null ? void 0 : e.followMouse) ?? !1,
      e == null ? void 0 : e.x,
      e == null ? void 0 : e.y,
      e == null ? void 0 : e.duration
    ), () => {
      this.phuljhadiRenderer.clear();
    };
  }
  /**
   * ✨ Enable cursor-following sparkler
   */
  enableMouseSparkler(e) {
    return this.phuljhadi({ ...e, followMouse: !0, duration: 0 });
  }
  /**
   * 🏮 Akash Kandil / Lanterns: Warm paper lanterns drifting upward with subtle wind sway
   */
  lanterns(e) {
    return (e == null ? void 0 : e.sound) !== void 0 && this.sound.setEnabled(e.sound), this.lanternsRenderer = new ee(e), this.lanternsRenderer.init(this.canvasMgr.width, this.canvasMgr.height), () => {
      this.lanternsRenderer && (this.lanternsRenderer.clear(), this.lanternsRenderer = null);
    };
  }
  /**
   * 🌸 Flower Shower (Phoolon ki Barish): Marigold (genda phool) and rose petals fluttering softly
   */
  flowerShower(e) {
    return this.flowerShowerRenderer = new se(e), this.flowerShowerRenderer.shower(this.canvasMgr.width, this.canvasMgr.height), () => {
      this.flowerShowerRenderer && (this.flowerShowerRenderer.clear(), this.flowerShowerRenderer = null);
    };
  }
  /**
   * 💥 Ladi (Firecracker String): Rapid sequential popping firecracker string with flashes and smoke
   */
  ladi(e) {
    return (e == null ? void 0 : e.sound) !== void 0 && this.sound.setEnabled(e.sound), this.ladiRenderer.ignite(e == null ? void 0 : e.x, e == null ? void 0 : e.y, e == null ? void 0 : e.crackerCount), () => {
      this.ladiRenderer.clear();
    };
  }
  /**
   * 💥 Festive Combo / Ladi: Curated grand show combining all Diwali animations
   */
  celebrate(e) {
    const a = [];
    return (e == null ? void 0 : e.diyas) !== !1 && a.push(this.diyas({ mode: "docked", count: 7 })), (e == null ? void 0 : e.lanternCount) !== 0 && a.push(this.lanterns({ count: (e == null ? void 0 : e.lanternCount) ?? 6 })), a.push(this.startRocketShow(2e3)), (e == null ? void 0 : e.groundCrackers) !== !1 && setTimeout(() => {
      const t = this.canvasMgr.width, r = this.canvasMgr.height;
      this.chakri({ x: Math.max(80, t * 0.15), y: r - 60 }), this.anar({ x: Math.min(t - 80, t * 0.85), y: r - 30 });
    }, 800), (e == null ? void 0 : e.flowerShower) !== !1 && a.push(this.flowerShower({ count: 50, duration: (e == null ? void 0 : e.duration) ?? 8e3 })), e != null && e.duration && e.duration > 0 && setTimeout(() => {
      a.forEach((t) => t());
    }, e.duration), () => {
      a.forEach((t) => t());
    };
  }
  /**
   * Enable Click/Tap to spawn festive crackers
   */
  enableClickToSpawn(e = "random") {
    return this.interactiveClickMode = e, () => {
      this.interactiveClickMode = "none";
    };
  }
  startLoop() {
    if (this.isRunning) return;
    this.isRunning = !0, this.lastFrameTime = performance.now();
    const e = (a) => {
      if (!this.isRunning || (this.animationFrameId = requestAnimationFrame(e), this.isPaused)) return;
      const t = Math.max(1, a - this.lastFrameTime);
      this.lastFrameTime = a;
      const r = Math.min(t / 16.667, 2), h = this.canvasMgr.getContext(), s = this.canvasMgr.width, i = this.canvasMgr.height;
      this.canvasMgr.clear(), this.lanternsRenderer && (this.lanternsRenderer.update(s, i, this.mouse.x, this.mouse.y, r), this.lanternsRenderer.render(h)), this.flowerShowerRenderer && (this.flowerShowerRenderer.update(s, i, r), this.flowerShowerRenderer.render(h)), this.anarRenderer.update(r), this.anarRenderer.render(h), this.chakriRenderer.update(r), this.chakriRenderer.render(h), this.rocketsRenderer.update(r), this.rocketsRenderer.render(h), this.ladiRenderer.update(r), this.ladiRenderer.render(h), this.phuljhadiRenderer.update(r), this.phuljhadiRenderer.render(h), this.diyasRenderer && (this.diyasRenderer.update(s, i, this.mouse.x, this.mouse.y, r), this.diyasRenderer.render(h)), this.rangoliRenderer && (this.rangoliRenderer.update(this.mouse.x, this.mouse.y, r), this.rangoliRenderer.render(h)), this.toranRenderer && (this.toranRenderer.update(this.mouse.x, this.mouse.y, r), this.toranRenderer.render(h)), this.hangingLanternsRenderer && (this.hangingLanternsRenderer.update(this.mouse.x, this.mouse.y, r), this.hangingLanternsRenderer.render(h)), this.labradorRenderer && (this.labradorRenderer.update(this.mouse.x, this.mouse.y, r), this.labradorRenderer.render(h));
    };
    this.animationFrameId = requestAnimationFrame(e);
  }
  clear() {
    this.canvasMgr.clear(), this.rocketsRenderer.clear(), this.chakriRenderer.clear(), this.anarRenderer.clear(), this.phuljhadiRenderer.clear(), this.ladiRenderer.clear(), this.lanternsRenderer && this.lanternsRenderer.clear(), this.toranRenderer && this.toranRenderer.clear(), this.rangoliRenderer && this.rangoliRenderer.clear(), this.hangingLanternsRenderer && this.hangingLanternsRenderer.clear(), this.labradorRenderer && this.labradorRenderer.clear(), this.flowerShowerRenderer && this.flowerShowerRenderer.clear(), this.pool.clear();
  }
  destroy() {
    this.isRunning = !1, this.animationFrameId && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = null), this.clear(), this.mouse.destroy(), this.canvasMgr.destroy();
  }
}
export {
  de as D,
  ie as H,
  le as L,
  oe as R,
  he as T
};
//# sourceMappingURL=DiwaliEngine-DsmUah-1.js.map

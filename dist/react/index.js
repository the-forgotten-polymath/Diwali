import { useRef as k, useState as D, useEffect as S, useCallback as u } from "react";
import { D as g } from "../DiwaliEngine-DsmUah-1.js";
import { jsx as m } from "react/jsx-runtime";
function M(t) {
  const r = k(null), [a, o] = D((t == null ? void 0 : t.sound) ?? !1);
  S(() => (r.current = new g(t), () => {
    var n;
    (n = r.current) == null || n.destroy(), r.current = null;
  }), []);
  const f = u((n) => {
    var e;
    return (e = r.current) == null ? void 0 : e.diyas(n);
  }, []), s = u((n) => {
    var e;
    return (e = r.current) == null ? void 0 : e.rockets(n);
  }, []), i = u((n) => {
    var e;
    return (e = r.current) == null ? void 0 : e.chakri(n);
  }, []), l = u((n) => {
    var e;
    return (e = r.current) == null ? void 0 : e.anar(n);
  }, []), d = u((n) => {
    var e;
    return (e = r.current) == null ? void 0 : e.phuljhadi(n);
  }, []), h = u((n) => {
    var e;
    return (e = r.current) == null ? void 0 : e.lanterns(n);
  }, []), y = u((n) => {
    var e;
    return (e = r.current) == null ? void 0 : e.flowerShower(n);
  }, []), b = u((n) => {
    var e;
    return (e = r.current) == null ? void 0 : e.celebrate(n);
  }, []), w = u((n) => {
    var e;
    return (e = r.current) == null ? void 0 : e.enableMouseSparkler(n);
  }, []), c = u((n = "random") => {
    var e;
    return (e = r.current) == null ? void 0 : e.enableClickToSpawn(n);
  }, []), x = u(() => {
    o((n) => {
      var v;
      const e = !n;
      return (v = r.current) == null || v.setSoundEnabled(e), e;
    });
  }, []), C = u(() => {
    var n;
    (n = r.current) == null || n.clear();
  }, []);
  return {
    engine: r.current,
    diyas: f,
    rockets: s,
    chakri: i,
    anar: l,
    phuljhadi: d,
    lanterns: h,
    flowerShower: y,
    celebrate: b,
    enableMouseSparkler: w,
    enableClickToSpawn: c,
    clear: C,
    soundEnabled: a,
    toggleSound: x
  };
}
const z = ({
  className: t,
  style: r,
  autoCelebrate: a,
  diyasOptions: o,
  rocketsOptions: f,
  lanternsOptions: s,
  flowerShowerOptions: i,
  celebrateOptions: l,
  mouseSparkler: d,
  clickToSpawn: h,
  ...y
}) => {
  const b = k(null), w = k(null);
  return S(() => {
    if (!b.current) return;
    const c = new g({
      ...y,
      canvas: b.current
    });
    return w.current = c, a ? c.celebrate(l) : (o && c.diyas(o), s && c.lanterns(s), i && c.flowerShower(i)), d && c.enableMouseSparkler(), h && h !== "none" && c.enableClickToSpawn(h), () => {
      c.destroy(), w.current = null;
    };
  }, []), /* @__PURE__ */ m(
    "canvas",
    {
      ref: b,
      className: t,
      style: {
        width: "100%",
        height: "100%",
        display: "block",
        ...r
      },
      "aria-hidden": "true",
      role: "presentation"
    }
  );
}, p = ({
  className: t,
  style: r,
  count: a = 7,
  scale: o = 1,
  glowIntensity: f = 1,
  smoke: s = !0,
  ...i
}) => {
  const l = k(null);
  return S(() => {
    if (!l.current) return;
    const d = new g({
      ...i,
      container: l.current,
      zIndex: 10
    });
    return d.diyas({
      count: a,
      scale: o,
      glowIntensity: f,
      smoke: s,
      mode: "docked"
    }), () => {
      d.destroy();
    };
  }, [a, o, f, s]), /* @__PURE__ */ m(
    "div",
    {
      ref: l,
      className: t,
      style: {
        position: "relative",
        width: "100%",
        height: "90px",
        overflow: "hidden",
        pointerEvents: "none",
        ...r
      }
    }
  );
}, I = (t) => (S(() => {
  const r = new g({
    zIndex: t.zIndex ?? 99999,
    sound: t.sound ?? !1
  }), a = r.enableMouseSparkler(t);
  return () => {
    a(), r.destroy();
  };
}, [t.sound, t.scale]), null);
export {
  z as DiwaliCanvas,
  p as DiyaDock,
  I as PhuljhadiCursor,
  M as useDiwali
};
//# sourceMappingURL=index.js.map

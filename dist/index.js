import { D as t } from "./DiwaliEngine-GeW5pnSd.js";
import { H as D, L as F, R as H, T as O } from "./DiwaliEngine-GeW5pnSd.js";
let e = null;
function r() {
  return e || (e = new t()), e;
}
function o(n) {
  return r().diyas(n);
}
function u(n) {
  return r().rockets(n);
}
function i(n = 850) {
  return r().startRocketShow(n);
}
function l(n) {
  return r().enableMouseRockets(n);
}
function c(n) {
  return r().chakri(n);
}
function s(n) {
  return r().anar(n);
}
function f(n) {
  return r().phuljhadi(n);
}
function b(n) {
  return r().enableMouseChakkar(n);
}
function d(n) {
  return r().enableMouseSparkler(n);
}
function k(n) {
  return r().lanterns(n);
}
function g(n = 9) {
  return r().hangingLanterns(n);
}
function h(n) {
  return r().labrador(n);
}
function L(n) {
  return r().toran(n);
}
function m(n, a) {
  r().blastAt(n, a);
}
function C(n) {
  r().setMouseFollow(n);
}
function T(n = 18e3) {
  return r().startOccasionalAnar(n);
}
function x(n) {
  return r().rangoli(n);
}
function w(n) {
  return r().flowerShower(n);
}
function p(n) {
  return r().ladi(n);
}
function R(n) {
  return r().celebrate(n);
}
function M(n = "random") {
  return r().enableClickToSpawn(n);
}
function S() {
  e && (e.destroy(), e = null);
}
const y = {
  DiwaliEngine: t,
  diyas: o,
  rockets: u,
  startRocketShow: i,
  chakri: c,
  anar: s,
  phuljhadi: f,
  ladi: p,
  hangingLanterns: g,
  labrador: h,
  lanterns: k,
  flowerShower: w,
  celebrate: R,
  enableMouseRockets: l,
  enableMouseSparkler: d,
  enableMouseChakkar: b,
  enableClickToSpawn: M,
  stopAll: S
};
export {
  t as DiwaliEngine,
  D as HangingLanternsRenderer,
  F as LabradorRenderer,
  H as RangoliRenderer,
  O as ToranRenderer,
  s as anar,
  m as blastAt,
  R as celebrate,
  c as chakri,
  y as default,
  o as diyas,
  M as enableClickToSpawn,
  b as enableMouseChakkar,
  l as enableMouseRockets,
  d as enableMouseSparkler,
  w as flowerShower,
  g as hangingLanterns,
  h as labrador,
  p as ladi,
  k as lanterns,
  f as phuljhadi,
  x as rangoli,
  u as rockets,
  C as setMouseFollow,
  T as startOccasionalAnar,
  i as startRocketShow,
  S as stopAll,
  L as toran
};
//# sourceMappingURL=index.js.map

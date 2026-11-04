// Draws B1-style hand-drawn stick figures and props as transparent PNGs.
// Run with the stickman skill's node_modules on NODE_PATH: node draw-art.mjs
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {createCanvas} = require(process.env.CANVAS_MODULE || '@napi-rs/canvas');
const OUT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), 'art');
fs.mkdirSync(OUT, {recursive: true});

const INK = '#1d1d1f', RED = '#E5463B', GREEN = '#3E9B4F', YELLOW = '#F2B92E', NAVY = '#24395E', PAPER = '#FFFDF7';

// Deterministic jitter so re-runs produce identical art.
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) - 0.5;

function canvas(w, h) {
  const c = createCanvas(w, h), g = c.getContext('2d');
  g.lineCap = 'round'; g.lineJoin = 'round';
  return [c, g];
}

// A pen stroke through points: main line plus a faint second pass for a hand-drawn edge.
function pen(g, pts, {w = 7, color = INK, j = 2.2} = {}) {
  for (const [pass, alpha, width] of [[0, 1, w], [1, 0.35, w * 0.55]]) {
    g.strokeStyle = color; g.globalAlpha = alpha; g.lineWidth = width;
    g.beginPath();
    pts.forEach(([x, y], i) => {
      const dx = rnd() * j * (pass ? 2 : 1), dy = rnd() * j * (pass ? 2 : 1);
      i ? g.lineTo(x + dx, y + dy) : g.moveTo(x + dx, y + dy);
    });
    g.stroke();
  }
  g.globalAlpha = 1;
}

// Smooth curve through points via midpoints, for limbs and wobbly shapes.
function curve(g, pts, opts = {}) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
    for (let t = 0.25; t <= 1; t += 0.25) out.push([ax + (bx - ax) * t, ay + (by - ay) * t]);
  }
  pen(g, out, opts);
}

function ellipse(g, x, y, rx, ry, {fill = null, stroke = INK, w = 7} = {}) {
  const pts = [];
  for (let a = 0; a <= Math.PI * 2 + 0.3; a += 0.25) pts.push([x + Math.cos(a) * rx * (1 + rnd() * 0.03), y + Math.sin(a) * ry * (1 + rnd() * 0.03)]);
  if (fill) {
    g.fillStyle = fill; g.beginPath();
    pts.forEach(([px, py], i) => i ? g.lineTo(px, py) : g.moveTo(px, py));
    g.fill();
  }
  if (stroke) pen(g, pts, {w, color: stroke, j: 1});
}

function rect(g, x, y, w, h, {fill = null, stroke = INK, lw = 6, r = 10} = {}) {
  if (fill) {
    g.fillStyle = fill; g.beginPath(); g.roundRect(x, y, w, h, r); g.fill();
  }
  if (stroke) pen(g, [[x + r, y], [x + w - r, y], [x + w, y + r], [x + w, y + h - r], [x + w - r, y + h], [x + r, y + h], [x, y + h - r], [x, y + r], [x + r, y]], {w: lw, color: stroke, j: 1.5});
}

// Face moods: eyes, brows and mouth change together so emotion reads at phone size.
function face(g, hx, hy, r, mood, look = 0) {
  const ex = r * 0.38, ey = hy - r * 0.05, lx = look * r * 0.18;
  for (const s of [-1, 1]) ellipse(g, hx + s * ex + lx, ey, r * 0.1, r * 0.16, {fill: INK, stroke: null});
  const brow = {
    sad: s => [[hx + s * ex * 1.5 + lx, ey - r * 0.32], [hx + s * ex * 0.4 + lx, ey - r * 0.46]],
    worried: s => [[hx + s * ex * 1.5 + lx, ey - r * 0.36], [hx + s * ex * 0.3 + lx, ey - r * 0.5]],
    happy: s => [[hx + s * ex * 1.5 + lx, ey - r * 0.42], [hx + s * ex * 0.4 + lx, ey - r * 0.52]],
    curious: s => s < 0 ? [[hx - ex * 1.5 + lx, ey - r * 0.36], [hx - ex * 0.4 + lx, ey - r * 0.38]] : [[hx + ex * 0.4 + lx, ey - r * 0.56], [hx + ex * 1.5 + lx, ey - r * 0.46]],
  }[mood];
  for (const s of [-1, 1]) pen(g, brow(s), {w: 5});
  const my = hy + r * 0.45;
  if (mood === 'sad') curve(g, [[hx - r * 0.3 + lx, my + r * 0.1], [hx + lx, my - r * 0.08], [hx + r * 0.3 + lx, my + r * 0.1]], {w: 5});
  if (mood === 'worried') ellipse(g, hx + lx, my, r * 0.17, r * 0.2, {fill: INK, stroke: null});
  if (mood === 'curious') curve(g, [[hx - r * 0.22 + lx, my], [hx + lx, my + r * 0.06], [hx + r * 0.3 + lx, my - r * 0.1]], {w: 5});
  if (mood === 'happy') {
    g.fillStyle = INK; g.beginPath();
    g.moveTo(hx - r * 0.36 + lx, my - r * 0.08);
    g.quadraticCurveTo(hx + lx, my + r * 0.5, hx + r * 0.36 + lx, my - r * 0.08); g.closePath(); g.fill();
  }
}

// Stick figure from joint positions. Head is an outline circle; limbs are single lines.
function figure(g, p) {
  const r = p.r ?? 52;
  ellipse(g, p.head[0], p.head[1], r, r, {fill: '#ffffff'});
  face(g, p.head[0], p.head[1], r, p.mood, p.look ?? 0);
  curve(g, [p.neck, p.hip], {w: 7});
  for (const limb of ['armL', 'armR']) curve(g, [p.neck, ...p[limb]], {w: 7});
  for (const limb of ['legL', 'legR']) curve(g, [p.hip, ...p[limb]], {w: 7});
  for (const limb of ['armL', 'armR']) { const [x, y] = p[limb].at(-1); ellipse(g, x, y, 11, 9, {fill: INK, stroke: null}); }
  for (const limb of ['legL', 'legR']) { const [x, y] = p[limb].at(-1); ellipse(g, x + (p.feet ?? 10), y, 20, 9, {fill: INK, stroke: null}); }
  // Yellow lanyard badge: the founder's one colored detail.
  pen(g, [[p.neck[0] - 14, p.neck[1] + 4], [p.neck[0] + (p.badgeDx ?? 4), p.neck[1] + 70], [p.neck[0] + 14, p.neck[1] + 4]], {w: 3, color: NAVY});
  rect(g, p.neck[0] + (p.badgeDx ?? 4) - 16, p.neck[1] + 70, 32, 26, {fill: YELLOW, lw: 3, r: 5});
}

function sweat(g, x, y) {
  g.fillStyle = '#6FB7E8'; g.beginPath();
  g.moveTo(x, y); g.quadraticCurveTo(x + 14, y + 24, x, y + 30); g.quadraticCurveTo(x - 14, y + 24, x, y); g.fill();
  pen(g, [[x, y], [x + 11, y + 22], [x, y + 30], [x - 11, y + 22], [x, y]], {w: 3, j: 0.5});
}

function question(g, x, y, s = 1, color = INK) {
  curve(g, [[x - 18 * s, y - 20 * s], [x - 10 * s, y - 40 * s], [x + 12 * s, y - 40 * s], [x + 18 * s, y - 22 * s], [x, y], [x, y + 16 * s]], {w: 6 * s, color});
  ellipse(g, x, y + 34 * s, 5 * s, 5 * s, {fill: color, stroke: null});
}

function save(c, name) { fs.writeFileSync(path.join(OUT, name), c.toBuffer('image/png')); console.log(name); }

// Capability video art: same B1 founder and operator characters as the executive video.
const GREY = '#9aa1aa', ORANGE = '#E08A2E';
function label(g, text, x, y, {size = 40, color = INK, bold = true, align = 'left'} = {}) {
  g.fillStyle = color; g.font = `${bold ? 'bold ' : ''}${size}px Arial`; g.textAlign = align; g.textBaseline = 'middle';
  g.fillText(text, x, y);
}
function tick(g, x, y, s = 1, color = GREEN) { curve(g, [[x - 30 * s, y], [x - 8 * s, y + 24 * s], [x + 34 * s, y - 28 * s]], {w: 11 * s, color}); }

// 1 · Founder holding a small hardware gadget.
{
  const [c, g] = canvas(700, 1000);
  figure(g, {mood: 'happy', look: 1, head: [280, 250], neck: [290, 310], hip: [290, 620],
    armL: [[380, 420], [470, 400]], armR: [[370, 450], [470, 450]],
    legL: [[250, 790], [220, 950]], legR: [[330, 790], [370, 950]], badgeDx: 12});
  rect(g, 470, 360, 150, 110, {fill: '#DDE3EA', lw: 6, r: 12});
  ellipse(g, 515, 415, 18, 18, {fill: GREEN, w: 4});
  pen(g, [[560, 400], [600, 400]], {w: 4, color: NAVY}); pen(g, [[560, 430], [590, 430]], {w: 4, color: NAVY});
  pen(g, [[590, 360], [610, 300]], {w: 5}); ellipse(g, 612, 294, 9, 9, {fill: RED, stroke: null});
  save(c, 'founder-gadget.png');
}

// 1 · Situation tags.
for (const [name, text, fill] of [['tag-japan', 'JAPAN', '#FFFFFF'], ['tag-preseed', 'PRE-SEED', '#FFFFFF'], ['tag-check', '$150K ASK', '#FFF6DA']]) {
  const [c, g] = canvas(420, 120);
  rect(g, 10, 10, 400, 100, {fill, lw: 6, r: 22});
  label(g, text, 210, 62, {size: 46, color: NAVY, align: 'center'});
  save(c, `${name}.png`);
}

// 2-3 · Investor result cards with four criteria rows (ticks are separate layers).
function card(name, ticks) {
  const [c, g] = canvas(520, 560);
  rect(g, 12, 12, 496, 536, {fill: PAPER, lw: 7, r: 22});
  label(g, name, 260, 80, {size: 40, color: NAVY, align: 'center'});
  pen(g, [[50, 130], [470, 128]], {w: 4, color: GREY});
  ['Stage', 'Sector', 'Location', 'Check size'].forEach((row, i) => {
    const y = 190 + i * 90;
    label(g, row, 55, y, {size: 36, bold: false});
    rect(g, 385, y - 34, 68, 68, {fill: '#ffffff', lw: 5, r: 10});
    if (ticks) tick(g, 419, y, 0.9);
  });
  return c;
}
save(card('Monozukuri Ventures', false), 'card-monozukuri.png');
save(card('Geek Ventures', false), 'card-geek.png');
save(card('Monozukuri Ventures', true), 'card-monozukuri-done.png');

{ const [c, g] = canvas(100, 100); tick(g, 50, 52, 1.2); save(c, 'tick.png'); }
{ const [c, g] = canvas(100, 100); question(g, 50, 40, 0.9, GREY); save(c, 'qmark.png'); }
{ const [c, g] = canvas(220, 220); question(g, 110, 90, 2.2, RED); save(c, 'qmark-big.png'); }
{ const [c, g] = canvas(200, 200); ellipse(g, 100, 100, 88, 88, {fill: '#E8F4EA', stroke: GREEN, w: 8}); tick(g, 100, 104, 1.7); save(c, 'tick-big.png'); }
{
  const [c, g] = canvas(300, 90);                         // geography note for Geek Ventures
  rect(g, 8, 8, 284, 74, {fill: '#FCEBD9', stroke: ORANGE, lw: 5, r: 18});
  label(g, 'US focus', 150, 47, {size: 38, color: ORANGE, align: 'center'});
  save(c, 'note-us.png');
}

// 3 · Founder looking curious.
{
  const [c, g] = canvas(600, 1000);
  figure(g, {mood: 'curious', look: 1, head: [280, 250], neck: [290, 310], hip: [290, 620],
    armL: [[380, 430], [400, 520]], armR: [[210, 430], [190, 540]],
    legL: [[250, 790], [220, 950]], legR: [[330, 790], [370, 950]], badgeDx: 10});
  question(g, 420, 140, 1.1);
  save(c, 'founder-curious.png');
}

// 4 · The empty gap between founder and investor.
{
  const [c, g] = canvas(520, 60);
  for (let x = 20; x < 500; x += 56) pen(g, [[x, 30], [x + 30, 30]], {w: 7, color: GREY});
  save(c, 'gap-dashed.png');
}

// 5 · Operator adding a confirmed connection.
{
  const [c, g] = canvas(600, 1000);
  figure(g, {mood: 'happy', look: 0, head: [300, 250], neck: [300, 310], hip: [300, 620],
    armL: [[230, 230], [250, 130]], armR: [[380, 230], [360, 130]],
    legL: [[260, 790], [230, 950]], legR: [[340, 790], [370, 950]], badgeDx: 0});
  save(c, 'operator-add.png');
}
{
  const [c, g] = canvas(340, 110);                        // source and date tag
  rect(g, 10, 10, 320, 90, {fill: '#ffffff', lw: 5, r: 14});
  ellipse(g, 52, 55, 14, 14, {fill: YELLOW, w: 4});
  label(g, 'source · date', 190, 57, {size: 36, color: NAVY, align: 'center'});
  save(c, 'tag-source.png');
}

// 6 · A mentor figure in the middle of the path.
{
  const [c, g] = canvas(600, 1000);
  figure(g, {mood: 'happy', look: 0, head: [300, 250], neck: [300, 310], hip: [300, 620],
    armL: [[190, 420], [90, 400]], armR: [[410, 420], [510, 400]],
    legL: [[260, 790], [230, 950]], legR: [[340, 790], [370, 950]], badgeDx: 0});
  save(c, 'mentor.png');
}

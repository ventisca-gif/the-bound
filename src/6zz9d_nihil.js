// ================= v4.65: NIHIL CON EL DIBUJO DE SERGIO Y SUS SEIS ATAQUES =================
// Atlas y efectos generados por tools/dev/nihil.py (src/6zz9c_nihil_data.js). Solo aparece en la Corona del Cielo.
// Súper jefe difícil pero justo: todo se avisa en el suelo antes de golpear y todo se puede esquivar rodando.
// Ataques: Orbe Umbrío (orbes que te persiguen), Garra del Vacío (zarpazo donde estás), Pilar Oscuro (pilares en cruz),
// Lluvia de Cristales, Nova Nihil (anillo enorme: sal o rueda) y Prisión Sombría (te encierra si no ruedas a tiempo).
// Fases: 100-60 % normal; 60-25 % más rápido y llama sombras; < 25 % «Silencio»: combina dos ataques.

const NIHX = { cv: null, fx: null };
{ const [fw, fh] = NIHX_SIZE, c = mkCanvas(fw * 10, fh * 4); NIHX.cv = c; const im = new Image(); im.onload = () => c.getContext('2d').drawImage(im, 0, 0); im.src = NIHX_SHEET; }
{ const [fw, fh] = NIHX_FXSIZE, c = mkCanvas(fw * 5, fh * 6); NIHX.fx = c; const im = new Image(); im.onload = () => c.getContext('2d').drawImage(im, 0, 0); im.src = NIHX_FX; }
{ const _ma = mobAtlasFor; mobAtlasFor = function (art) { if (art && art[0] === 'nihx') return getAtlas('Mnihx', () => { const [fw, fh] = NIHX_SIZE; return { img: NIHX.cv, fw, fh, idx: { idle: 0, walk: 2, atk: 6, hurt: 9 }, ax: fw >> 1, ay: fh - 4 }; }); return _ma(art); }; }
if (BOSSES.nihil) Object.assign(BOSSES.nihil, { art: ['nihx', 'nihil'], fly: 1, hp: 54, atk: 3.0, def: 2.9, spd: 40, r: 40, moves: ['blink', 'summon'] });
SUPER_BOSS.nihil = SUPER_BOSS.nihil !== undefined ? SUPER_BOSS.nihil : 19;

// ---------- efectos (fila del atlas: orbe 0, garra 1, pilar 2, cristales 3, nova 4, prisión 5) ----------
const NFX = [];   // {r: fila, x, y, t0, dur, s, loop}
function nfxAdd(row, x, y, dur, s, loop) { NFX.push({ r: row, x, y, t0: G.t, dur, s: s || 1, loop: !!loop }); }
WORLD_DRAW.push((cx, cy) => {
  if (!NFX.length && !NHZ.length && !NORB.length) return; const [fw, fh] = NIHX_FXSIZE;
  for (const h of NHZ) { if (h.done) continue; const k = Math.min(1, (G.t - h.ts) / Math.max(0.01, h.t0 - h.ts)); const x = h.x - cx, y = h.y - cy;
    ctx.save(); ctx.globalAlpha = 0.25 + 0.35 * k; ctx.fillStyle = '#6a1aa0'; ctx.beginPath(); ctx.ellipse(x, y, h.r, h.r * 0.72, 0, 0, 7); ctx.fill();
    ctx.globalAlpha = 0.9; ctx.strokeStyle = k > 0.75 ? '#ff7aff' : '#c060ff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, h.r * k, h.r * 0.72 * k, 0, 0, 7); ctx.stroke(); ctx.restore(); }
  for (let i = NFX.length - 1; i >= 0; i--) { const f = NFX[i], t = (G.t - f.t0) / f.dur; if (t >= 1 && !f.loop) { NFX.splice(i, 1); continue; }
    const fr = Math.min(4, Math.floor((f.loop ? t % 1 : t) * 5)), w = fw * f.s, h = fh * f.s;
    ctx.save(); ctx.imageSmoothingEnabled = false; if (t > 0.8 && !f.loop) ctx.globalAlpha = Math.max(0, (1 - t) / 0.2);
    ctx.drawImage(NIHX.fx, fr * fw, f.r * fh, fw, fh, Math.round(f.x - cx - w / 2), Math.round(f.y - cy - h + 6 * f.s), Math.round(w), Math.round(h)); ctx.restore(); }
  for (const o of NORB) { const fr = 2 + (Math.floor(G.t * 8) % 2), s = 1; ctx.save(); ctx.imageSmoothingEnabled = false; ctx.drawImage(NIHX.fx, fr * fw, 0, fw, fh, Math.round(o.x - cx - fw * s / 2), Math.round(o.y - cy - fh * s + 10), fw * s, fh * s); ctx.restore(); }
});

// ---------- zonas de daño propias ----------
const NHZ = [];   // {x, y, r, ts, t0 (golpe), dmg, root, fx, done}
const NORB = [];  // orbes que persiguen {x, y, t1, sp}
function nhzAdd(x, y, r, warn, dmg, o) { const h = Object.assign({ x, y, r, ts: G.t, t0: G.t + warn, dmg, done: false }, o || {}); NHZ.push(h); return h; }
function nihilBoss() { return G.ents.find(e => e.type === 'mob' && e.mid === 'nihil' && !e.dying && e.map === (G.map && G.map.id)); }
function nihilTick(dt) {
  const P = G.P; if (!P) return; const m = nihilBoss();
  if (!m) { if (NHZ.length || NORB.length) { NHZ.length = 0; NORB.length = 0; } return; }
  const hit = (frac, txt) => { if (P.dead || P.ifr > 0) return false; hurtPlayer(P.S.maxhp * frac, { lv: m.lv }); if (txt) floatText(P.x, P.y - 36, txt, '#e070ff'); return true; };
  for (let i = NHZ.length - 1; i >= 0; i--) { const h = NHZ[i]; if (h.done) { NHZ.splice(i, 1); continue; } if (G.t < h.t0) continue; h.done = true;
    if (h.fx !== undefined) nfxAdd(h.fx, h.x, h.y + h.r * 0.3, 0.6, h.fs || 1.4);
    const d = Math.hypot(P.x - h.x, (P.y - h.y) * 1.3), inside = h.ring ? d > h.safe && d < h.r : d < h.r;
    if (inside && hit(h.dmg) && h.root) { P.rootT = h.root; floatText(P.x, P.y - 46, L2('¡ATRAPADO! Rueda para soltarte', 'TRAPPED! Roll to break free'), '#ff7aff'); } }
  for (let i = NORB.length - 1; i >= 0; i--) { const o = NORB[i]; if (G.t > o.t1) { nfxAdd(0, o.x, o.y, 0.4, 1); NORB.splice(i, 1); continue; }
    const dx = P.x - o.x, dy = P.y - o.y, L = Math.hypot(dx, dy) || 1; o.x += dx / L * o.sp * dt; o.y += dy / L * o.sp * dt;
    if (L < 14) { nfxAdd(0, o.x, o.y, 0.4, 1.2); NORB.splice(i, 1); hit(0.11, L2('Orbe Umbrío', 'Umbral Orb')); } }
}
V33_TICKS.push(nihilTick);

// ---------- los seis ataques ----------
const NIH_ATK = {
  orbe: [L2('Orbe Umbrío: los orbes te persiguen, aléjate', 'Umbral Orb: the orbs chase you, keep moving'), (m, P) => { for (let k = 0; k < 3; k++) { const a = k * 2.1; NORB.push({ x: m.x + Math.cos(a) * 30, y: m.y - 20 + Math.sin(a) * 20, t1: G.t + 5, sp: 46 + k * 6 }); } nfxAdd(0, m.x, m.y - 10, 0.8, 1.6); }],
  garra: [L2('Garra del Vacío', 'Void Claw'), (m, P) => { nhzAdd(P.x, P.y, 30, 0.85, 0.2, { fx: 1, fs: 1.5 }); }],
  pilar: [L2('Pilar Oscuro: busca un hueco', 'Dark Pillar: find a gap'), (m, P) => { nhzAdd(P.x, P.y, 20, 1.0, 0.16, { fx: 2, fs: 1.6 }); for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4; nhzAdd(P.x + Math.cos(a) * 48, P.y + Math.sin(a) * 36, 20, 1.25, 0.16, { fx: 2, fs: 1.6 }); } }],
  cristales: [L2('Lluvia de Cristales', 'Crystal Rain'), (m, P) => { for (let k = 0; k < 9; k++) nhzAdd(P.x + (Math.random() - 0.5) * (k ? 150 : 8), P.y + (Math.random() - 0.5) * (k ? 100 : 6), 16, 0.8 + k * 0.12, 0.09, { fx: 3, fs: 1.1 }); }],
  nova: [L2('¡Nova Nihil! Aléjate o rueda en el último momento', 'Nihil Nova! Get away or roll at the last moment'), (m, P) => { nfxAdd(4, m.x, m.y + 24, 1.6, 2.4); nhzAdd(m.x, m.y, 115, 1.6, 0.26, { fx: 4, fs: 2.8 }); }],
  prision: [L2('Prisión Sombría: ¡rueda antes de que se cierre!', 'Shadow Prison: roll before it closes!'), (m, P) => { nhzAdd(P.x, P.y, 22, 1.1, 0.08, { fx: 5, fs: 1.4, root: 2.5 }); nhzAdd(P.x, P.y, 18, 3.3, 0.14, { fx: 2, fs: 1.4 }); }],
};
let NIH_NEXT = '';
function nihilPick(m) { const ph = m.hp / m.maxhp; const pool = ph > 0.6 ? ['orbe', 'garra', 'pilar', 'cristales', 'garra', 'nova'] : ['orbe', 'garra', 'pilar', 'cristales', 'nova', 'prision', 'prision'];
  let k = pick(pool); if (k === m.nLast) k = pick(pool); m.nLast = k; return k; }
if (typeof BMECH !== 'undefined') BMECH.nihil = { every: 5.5, get name() { const m = nihilBoss(); NIH_NEXT = m ? nihilPick(m) : 'garra'; return NIH_ATK[NIH_NEXT][0]; }, fn: (m, P) => {
  const ph = m.hp / m.maxhp;
  if (ph < 0.6 && !m.nP2) { m.nP2 = 1; banner(L2('Nihil se deshilacha', 'Nihil unravels'), L2('Ataca más rápido y llama a sus sombras', 'It attacks faster and calls its shadows')); }
  if (ph < 0.25 && !m.nP3) { m.nP3 = 1; banner(L2('El Silencio', 'The Silence'), L2('Nihil combina sus ataques. ¡Aguanta!', 'Nihil combines its attacks. Hold on!')); }
  const a = NIH_NEXT || nihilPick(m), A = NIH_ATK[a]; setAnim(m, 'atk'); try { A[1](m, P); } catch (e) { }
  if (m.nP3) { const b = nihilPick(m); if (b !== a) setTimeout(() => { if (!m.dying && !G.P.dead) try { NIH_ATK[b][1](m, G.P); } catch (e) { } }, 1300); }
  if (m.nP2 && Math.random() < 0.35) for (let k = 0; k < 2; k++) { const s = spawnMob(BOSSES.nihil.minion || 'sombra_tejida', Math.max(1, m.lv - 8), m.x + (k ? 50 : -50), m.y + 30, m.L, null, false); if (s) s.map = m.map; }
  m.mech = m.nP3 ? 1.6 : m.nP2 ? 1.2 : 0;   // empieza a contar desde aquí: cada 3,9-5,5 s
} };

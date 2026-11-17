// v5.03: iconos de habilidad dibujados a mano en 16×16 (antes eran un hexágono oscuro casi vacío).
// Solo cambia el dibujo del icono; SK, costes, daño y la ranura de cada habilidad no se tocan.
const SVI_GLYPH = {
 cleave: 'slash', whirlwind: 'spin', judgment: 'hammer', shout: 'shout', wall: 'shield', charge: 'dash', quake: 'hammer', avatar: 'wings',
 fireball: 'fireball', meteors: 'meteor', inferno: 'flame', icebolt: 'shard', frost: 'snow', icearmor: 'shield', blizzard: 'snow', blink: 'blink',
 arcshield: 'shield', chargedarrow: 'arrow', deatharrow: 'arrow', arrowstorm: 'arrows', poisonarrow: 'arrow', roots: 'leaf', forestheal: 'heal',
 arrowrain: 'arrows', tumble: 'dash', multishot: 'arrows', hunter: 'target', shadow: 'dagger', stealth: 'moon', deathmark: 'target', venom: 'drop',
 toxic: 'drop', daggers: 'daggers', bladedance: 'daggers', thousand: 'daggers', steelstorm: 'spin', bond: 'bond', fortress: 'shield', aegis: 'shield',
 leap: 'impact', cataclysm: 'hammer', meteor: 'meteor', apocalypse: 'meteor', glacier: 'shard', absolute: 'snow', blackhole: 'orb', singularity: 'orb',
 pierce: 'arrow', mark: 'target', arrowflood: 'arrows', forestwrath: 'leaf', fan: 'arrows', hawkeye: 'eye', execute: 'dagger', shadowdance: 'daggers',
 plague: 'drop', miasma: 'drop', voidstep: 'blink', shadows: 'moon', note: 'note', chord: 'notes', crescendo: 'shout', song: 'heal', ballad: 'note',
 rebirth: 'heal', dance: 'dash', march: 'notes', rhythm: 'note', symphony: 'notes', requiem: 'note', choir: 'shield', aria: 'note', echo: 'shout',
 finale: 'notes', concert: 'notes', summon: 'skull', soulrage: 'wisp', reap: 'scythe', scythespin: 'scythe', execution: 'scythe', drain: 'wisp',
 soulplague: 'wisp', curse: 'target', army: 'skull', soulking: 'skull', macabre: 'skull', harvest: 'scythe', hellfire: 'flame', gate: 'orb',
 skyblade: 'impact', prism: 'orb', phoenix: 'wings', shadowcuts: 'daggers', bite: 'fang', frenzy: 'fang', jaw: 'fang', bubble: 'bubble', tide: 'wave',
 grab: 'hand', whirl: 'spin', abysmal: 'shield', megalodon: 'fin', devour: 'fang', tsunami: 'wave', carapace: 'shield', shark: 'fin', kraken: 'tentacle',
 leviathan: 'fang', dawn: 'wings', seraph: 'wings', runerain: 'meteor', arcanestorm: 'orb', zephyr: 'arrow', feathers: 'wings', dusk: 'moon',
 shadowstep: 'blink', hymn: 'heal', thunderchord: 'notes', legion: 'skull', judgmentscythe: 'scythe', deluge: 'wave', abysswhirl: 'spin',
};
// Pasivas: el dibujo sale de lo que mejoran.
const SVI_PAS = { atkP: 'slash', sumP: 'skull', defP: 'shield', hpP: 'heart', life: 'drop', mpReg: 'drop', vsPoison: 'drop', fireP: 'flame', crit: 'eye', critD: 'skull', spdP: 'dash', aspdP: 'dash', dodge: 'blink', soulP: 'wisp' };
const SVI_GOLD = [C('#8a5a12'), C('#e0a43a'), C('#ffd96a'), C('#fff6c8')];
function sviPalette(hex) { const c = C(hex); return [uMix(c, C('#000000'), .45), c, uMix(c, C('#ffffff'), .45), uMix(c, C('#ffffff'), .85)]; }
function sviArc(p, cx, cy, r, a0, a1, c, ry = r) { const n = Math.max(8, Math.ceil(Math.abs(a1 - a0) * r * 1.6)); for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; p.set(Math.round(cx + Math.cos(a) * r - .5), Math.round(cy + Math.sin(a) * ry - .5), c); } }
function sviThick(p, x0, y0, x1, y1, c, c2) { p.line(x0, y0, x1, y1, c); p.line(x0 + 1, y0, x1 + 1, y1, c2 ?? c); }
const SVI_DRAW = {
 slash(p, [d, m, l, w], A) { sviArc(p, 7, 9, 7, Math.PI * 1.05, Math.PI * 1.75, m); sviArc(p, 7, 9, 6, Math.PI * 1.05, Math.PI * 1.75, l);
  p.poly([[12, 1], [15, 1], [15, 4], [7, 11], [5, 9]], l); p.line(6, 10, 14, 2, w); p.line(3, 8, 8, 13, A[2]); p.line(4, 8, 8, 12, A[1]); p.line(2, 14, 4, 12, d); p.set(1, 15, A[2]); },
 spin(p, [d, m, l, w], A) { let last = null; for (let i = 0; i <= 40; i++) { const a = i * .19, r = 1.2 + i * .16, z = [Math.round(8 + Math.cos(a) * r), Math.round(8 + Math.sin(a) * r)]; if (last) p.line(...last, ...z, i > 26 ? m : i > 12 ? l : w); last = z; }
  p.poly([[14, 2], [15, 3], [11, 7], [10, 6]], w); p.line(9, 7, 8, 8, A[2]); },
 hammer(p, [d, m, l, w], A) { p.line(2, 14, 8, 8, A[1]); p.line(3, 14, 9, 8, A[0]); p.poly([[5, 5], [10, 0], [15, 5], [10, 10]], m); p.poly([[6, 5], [10, 1], [12, 3], [8, 7]], l); p.line(6, 5, 10, 1, w); p.set(1, 15, A[2]); p.set(13, 12, w); p.set(14, 9, l); p.set(11, 13, l); },
 shout(p, [d, m, l, w], A) { p.ball(4, 8, 2.5, 3.2, [m, l, w, w]); for (const [r, c] of [[5, w], [8, l], [11, m]]) sviArc(p, 4, 8, r, -.85, .85, c); },
 shield(p, [d, m, l, w], A) { p.poly([[2, 1], [14, 1], [14, 8], [8, 15], [2, 8]], m); p.poly([[4, 3], [12, 3], [12, 8], [8, 12], [4, 8]], l); p.hl(2, 1, 12, w);
  p.line(8, 4, 8, 10, A[2]); p.line(5, 6, 11, 6, A[2]); p.set(8, 6, w); },
 dash(p, [d, m, l, w]) { [[2, m], [6, l], [10, w]].forEach(([x, c]) => { p.line(x, 2, x + 4, 8, c); p.line(x + 4, 8, x, 14, c); p.line(x + 1, 2, x + 5, 8, c); p.line(x + 5, 8, x + 1, 14, c); }); },
 blink(p, [d, m, l, w]) { for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; p.line(8 + Math.round(Math.cos(a) * 3), 8 + Math.round(Math.sin(a) * 3), 8 + Math.round(Math.cos(a) * 7), 8 + Math.round(Math.sin(a) * 7), i % 2 ? m : l); } p.ball(8, 8, 2.5, 2.5, [l, w, w, w]); },
 wings(p, [d, m, l, w], A) { for (const s of [-1, 1]) { const x = v => 8 + s * v; p.poly([[x(1), 8], [x(7), 2], [x(7.5), 6], [x(6), 9], [x(4), 12]].map(([a, b]) => [a, b]), l); p.line(x(2), 8, x(6), 4, w); p.line(x(3), 10, x(6), 8, m); }
  p.ball(8, 9, 2, 3, [A[1], A[2], A[3], A[3]]); sviArc(p, 8, 3, 3, Math.PI, Math.PI * 2, A[2], 1.5); },
 bond(p, [d, m, l, w], A) { sviArc(p, 6, 8, 4, 0, Math.PI * 2, l); sviArc(p, 6, 8, 3.2, 0, Math.PI * 2, w); sviArc(p, 10.5, 8, 4, 0, Math.PI * 2, A[2]); sviArc(p, 10.5, 8, 3.2, 0, Math.PI * 2, A[1]); },
 flame(p, [d, m, l, w]) { p.poly([[8, 1], [13, 7], [13, 11], [9, 15], [6, 15], [3, 11], [3, 7], [5, 4], [7, 7]], m); p.poly([[8, 5], [11, 9], [11, 12], [8, 14], [5, 12], [5, 9]], l); p.poly([[8, 9], [10, 12], [8, 14], [6, 12]], w); },
 fireball(p, [d, m, l, w]) { p.poly([[1, 15], [5, 8], [9, 12]], m); p.line(2, 14, 7, 9, l); p.ball(10, 6, 4.5, 4.5, [m, l, w, w]); },
 meteor(p, [d, m, l, w]) { p.poly([[0, 15], [6, 4], [12, 10]], m); p.poly([[3, 13], [7, 6], [10, 9]], l); p.ball(10, 6, 4, 4, [d, m, l, w]); p.set(9, 4, w); p.set(8, 5, w); },
 snow(p, [d, m, l, w]) { for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + Math.PI / 2, ex = 8 + Math.cos(a) * 6.5, ey = 8 + Math.sin(a) * 6.5; p.line(8, 8, Math.round(ex), Math.round(ey), l);
  for (const s of [-1, 1]) p.line(Math.round(8 + Math.cos(a) * 4), Math.round(8 + Math.sin(a) * 4), Math.round(8 + Math.cos(a) * 4 + Math.cos(a + s * 1) * 2.4), Math.round(8 + Math.sin(a) * 4 + Math.sin(a + s * 1) * 2.4), w); } p.ball(8, 8, 1.5, 1.5, [w, w, w, w]); },
 shard(p, [d, m, l, w]) { p.poly([[13, 1], [15, 3], [5, 13], [2, 14], [3, 11]], l); p.line(4, 12, 14, 2, w); p.poly([[1, 9], [4, 10], [3, 12]], m); p.poly([[6, 14], [7, 11], [9, 13]], m); },
 arrow(p, [d, m, l, w], A) { p.line(3, 13, 12, 4, l); p.line(4, 13, 13, 4, m); p.poly([[15, 1], [9, 3], [13, 7]], w); p.line(1, 11, 4, 13, A[2]); p.line(3, 15, 4, 13, A[2]); p.line(1, 13, 3, 14, A[1]); },
 arrows(p, [d, m, l, w], A) { [[3, 1], [8, 3], [13, 0]].forEach(([x, y]) => { p.line(x, y, x, y + 8, l); p.poly([[x - 2.5, y + 8], [x + 2.5, y + 8], [x, y + 12]], w); p.set(x - 1, y, A[2]); p.set(x + 1, y, A[2]); }); },
 drop(p, [d, m, l, w]) { p.poly([[8, 1], [13, 9], [12, 13], [8, 15], [4, 13], [3, 9]], m); p.poly([[8, 4], [11, 9], [10, 12], [8, 13], [6, 12], [5, 9]], l); p.line(6, 9, 6, 11, w); p.set(12, 3, l); p.set(14, 6, w); },
 leaf(p, [d, m, l, w], A) { p.poly([[2, 14], [3, 7], [8, 2], [14, 1], [13, 7], [8, 12]], m); p.poly([[4, 12], [5, 7], [9, 4], [12, 3], [11, 7], [7, 11]], l); p.line(2, 14, 12, 3, w); p.line(6, 10, 4, 7, d); p.line(9, 7, 11, 9, d); },
 heal(p, [d, m, l, w], A) { p.poly([[6, 2], [10, 2], [10, 6], [14, 6], [14, 10], [10, 10], [10, 14], [6, 14], [6, 10], [2, 10], [2, 6], [6, 6]], l); p.line(8, 4, 8, 12, w); p.line(4, 8, 12, 8, w); p.set(13, 2, A[3]); p.set(2, 13, A[2]); },
 target(p, [d, m, l, w], A) { sviArc(p, 8, 8, 6.5, 0, Math.PI * 2, l); sviArc(p, 8, 8, 3.5, 0, Math.PI * 2, A[2]); for (const [a, b, c, e] of [[8, 0, 8, 4], [8, 12, 8, 16], [0, 8, 4, 8], [12, 8, 16, 8]]) p.line(a, b, c, e, w); p.set(8, 8, w); },
 eye(p, [d, m, l, w], A) { p.poly([[1, 8], [5, 4], [11, 4], [15, 8], [11, 12], [5, 12]], w); p.ball(8, 8, 3.2, 3.2, [A[0], A[1], A[2], A[2]]); p.ball(8, 8, 1.4, 1.4, [d, d, d, d]); p.set(7, 7, w); p.hl(5, 3, 6, l); },
 moon(p, [d, m, l, w], A) { p.ball(8, 8, 6.5, 6.5, [m, l, w, w]); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const dx = x + .5 - 11, dy = y + .5 - 5.5; if (dx * dx + dy * dy < 30) p.set(x, y, 0); } p.set(13, 10, A[2]); p.set(12, 13, w); },
 dagger(p, [d, m, l, w], A) { p.poly([[14, 1], [15, 2], [8, 10], [6, 8]], l); p.line(7, 9, 14, 2, w); p.line(4, 8, 8, 12, A[2]); p.line(2, 13, 5, 10, d); p.line(3, 14, 6, 11, A[0]); },
 daggers(p, P, A) { const [d, m, l, w] = P; for (const s of [1, -1]) { const X = x => s > 0 ? x : 15 - x; p.poly([[X(14), 1], [X(15), 2], [X(9), 9], [X(7), 7]], l); p.line(X(8), 8, X(14), 2, w); p.line(X(5), 8, X(8), 11, A[2]); p.line(X(2), 14, X(6), 10, A[1]); p.set(X(1), 15, A[2]); } },
 note(p, [d, m, l, w], A) { p.ball(5, 12, 3.2, 2.4, [m, l, w, w]); p.line(8, 12, 8, 2, w); p.line(7, 12, 7, 3, l); p.line(8, 2, 13, 5, l); p.line(13, 5, 12, 8, l); p.line(8, 3, 12, 6, m); },
 notes(p, [d, m, l, w], A) { p.ball(4, 12, 2.6, 2, [m, l, w, w]); p.ball(11, 10, 2.6, 2, [m, l, w, w]); p.line(6, 12, 6, 3, w); p.line(13, 10, 13, 1, w); p.line(6, 3, 13, 1, l); p.line(6, 4, 13, 2, l); p.line(6, 6, 13, 4, m); },
 skull(p, [d, m, l, w], A) { p.ball(8, 7, 5.5, 5.5, [m, l, w, w]); p.poly([[5, 10], [11, 10], [11, 14], [5, 14]], l); p.ball(5.8, 7.5, 1.5, 1.6, [d, d, d, d]); p.ball(10.2, 7.5, 1.5, 1.6, [d, d, d, d]); p.set(8, 10, d); for (const x of [6, 8, 10]) p.set(x, 13, d); p.set(5, 7, A[2]); p.set(10, 7, A[2]); },
 scythe(p, [d, m, l, w], A) { p.line(3, 15, 10, 2, A[0]); p.line(4, 15, 11, 2, A[1]); p.poly([[10, 2], [5, 1], [1, 4], [3, 5], [6, 3], [10, 4]], l); p.line(1, 4, 6, 1, w); p.set(10, 3, w); },
 wisp(p, [d, m, l, w]) { p.poly([[11, 1], [12, 5], [11, 9], [8, 13], [5, 13], [3, 10], [4, 6], [6, 8], [7, 4]], m); p.ball(7, 10, 3.2, 3, [l, w, w, w]); p.set(6, 10, d); p.set(8, 10, d); p.set(13, 2, l); },
 fang(p, [d, m, l, w]) { p.ell(8, 8, 7.5, 6.5, m); p.ell(8, 8, 5.5, 4.5, d); for (const x of [3.5, 6.5, 9.5, 12.5]) { p.poly([[x - 1.5, 3.6], [x + 1.5, 3.6], [x, 7.5]], w); p.poly([[x - 1.5, 12.4], [x + 1.5, 12.4], [x, 8.5]], l); } sviArc(p, 8, 8, 7.5, Math.PI * 1.15, Math.PI * 1.6, l, 6.5); },
 bubble(p, [d, m, l, w]) { sviArc(p, 8, 8, 6.5, 0, Math.PI * 2, l); sviArc(p, 8, 8, 5.5, 0, Math.PI * 2, m); sviArc(p, 8, 8, 4, Math.PI * 1.1, Math.PI * 1.5, w); p.ball(12, 3, 1.4, 1.4, [l, w, w, w]); p.ball(3, 13, 1, 1, [l, w, w, w]); },
 wave(p, [d, m, l, w]) { p.poly([[0, 15], [1, 9], [4, 4], [8, 1.5], [12, 2], [15, 5], [12, 4.5], [9, 5.5], [8, 8.5], [10, 11], [13, 11], [16, 15]], m); p.line(1, 10, 4, 5, l); p.line(4, 5, 8, 2, w); p.line(8, 2, 12, 2, w); p.line(12, 2, 15, 5, l); p.set(9, 7, l); p.set(10, 9, l); p.hl(11, 13, 5, w); p.set(14, 3, w); },
 fin(p, [d, m, l, w]) { p.poly([[2, 12], [9, 1], [10, 6], [14, 12]], m); p.line(3, 11, 9, 2, l); p.line(9, 2, 10, 6, w); for (let x = 0; x < 16; x++) { p.set(x, 12 + Math.round(Math.sin(x * .9)), l); p.set(x, 14 + Math.round(Math.sin(x * .9 + 2)), m); } },
 tentacle(p, [d, m, l, w]) { for (let i = 0; i < 12; i++) { const t = i / 11, x = 4 + Math.sin(t * 5) * 4 + t * 4, y = 15 - t * 13, r = 2.8 - t * 1.9; p.ball(x, y, r, r, [m, l, l, w]); if (i % 3 === 1) p.set(Math.round(x - 1), Math.round(y), w); } },
 hand(p, [d, m, l, w]) { p.poly([[4, 8], [12, 8], [12, 13], [9, 15], [5, 14], [3, 11]], l); for (const x of [4, 6.5, 9, 11.5]) { p.line(Math.round(x), 8, Math.round(x), x === 4 ? 5 : 2, l); p.set(Math.round(x), x === 4 ? 5 : 2, w); } p.line(2, 10, 3, 8, l); p.line(5, 11, 10, 11, m); },
 impact(p, [d, m, l, w], A) { p.poly([[6, 1], [10, 1], [10, 7], [13, 7], [8, 12], [3, 7], [6, 7]], l); p.line(8, 2, 8, 10, w); p.line(1, 15, 5, 12, A[2]); p.line(15, 15, 11, 12, A[2]); p.line(8, 15, 8, 13, A[2]); },
 heart(p, [d, m, l, w]) { p.ball(5, 6, 3.5, 3.5, [m, l, l, w]); p.ball(11, 6, 3.5, 3.5, [m, l, l, w]); p.poly([[1.6, 7], [14.4, 7], [8, 14.5]], l); p.set(4, 4, w); p.set(5, 4, w); },
 orb(p, [d, m, l, w], A) { p.ball(8, 8, 5, 5, [d, m, l, w]); sviArc(p, 8, 8, 7.3, 0, Math.PI * 2, A[2], 3); sviArc(p, 8, 8, 7.3, Math.PI * .1, Math.PI * .9, w, 3); p.set(6, 6, w); },
};
function sviPaint(glyph, P, A) { const p = new Pix(16, 16); (SVI_DRAW[glyph] || SVI_DRAW.slash)(p, P, A); p.outline(OUTL, false); return p; }
{
 const prev = genIcon;
 genIcon = function (spec) {
  if (spec[0] !== 'sv_skill' || !SK[spec[1]]) return prev.apply(this, arguments);
  const s = SK[spec[1]], D = SV_OF.get(s.id);
  if (D) { const glyph = SVI_GLYPH[D.fx] || 'slash', P = [D.colors[0], D.colors[1], D.colors[2], D.colors[3]]; return sviPaint(glyph, P.map((c, i) => i === 0 ? c : uMix(c, C('#ffffff'), i === 1 ? .12 : 0)), SVI_GOLD); }
  // Pasiva: dibujo por estadística y el color original de SK.
  const k = Object.keys(s.pas || s.eff || {}).find(v => SVI_PAS[v]), col = Array.isArray(s.icon) && typeof s.icon[1] === 'string' && /^#[0-9a-f]{6}$/i.test(s.icon[1]) ? s.icon[1] : '#c8d0e0';
  return sviPaint(SVI_PAS[k] || 'slash', sviPalette(col), SVI_GOLD);
 };
}

// Transmutador: human form shares Warrior's weapon progression; the forms fight unarmed.
// 6.66: four original forms chosen from the wrist bracelet (Brazalete de núcleos), all available from level 1 and
// growing with the player's level up to MAXLV. Forms are drawn with the game's own engine (drawHero + HD detail) on
// the player's body structure, so the four walking directions use the native poses.
CLASSES.transmutador = {
  ...CLASSES.guerrero, n: 'Transmutador', color: '#8ed344',
  desc: L2('Usa el Brazalete de núcleos para elegir entre cuatro formas (Ascua, Prisma, Céfiro y Coloso) que se hacen más fuertes con tu nivel.',
    'Use the Core Bracelet to choose between four forms (Ember, Prism, Zephyr and Colossus) that grow stronger with your level.')
};
BR.transmutador = ['Forma', 'Combate', 'Control'];
for (const [id, item] of Object.entries(ITEMS)) {
  if (!/^w_guerrero_\d+$/.test(id)) continue;
  const newId = id.replace('guerrero', 'transmutador');
  ITEMS[newId] = { ...item, id: newId, cls: 'transmutador' };
  const recipe = RECIPES.find(r => r.out === id);
  if (recipe) RECIPES.push({ ...recipe, id: recipe.id + '_tm', out: newId });
}
hookAfter('newPlayer', P => {
  if (P.cls === 'transmutador') { P.app.tmOutfit = true; P.app.tmForm = 'ascua'; }
});
// Armour already fits every class; the Transmutador may also wear rings and amulets of any class (weapons stay its own).
hookAround('canEquip', (next, id) => {
  const it = ITEMS[id], P = G.P;
  if (P?.cls === 'transmutador' && it?.cls && it.cls !== 'transmutador' && it.slot && it.slot !== 'weapon')
    return (it.lv || 1) > P.lv ? 'Requiere nivel ' + it.lv : null;
  return next(id);
});
hookAround('appEditorHTML', (next, app, tabs) => {
  const html = next(app, tabs);
  const cls = (G.P?.cls ?? CC.cls) === 'transmutador';
  return cls && edTab === 'ropa' ? html + '<button class="chip" data-tm-outfit>Alternar atuendo del Transmutador</button>' : html;
});
hookAfter('bindAppEditor', (_, root, app, onChange) => {
  const button = root.querySelector('[data-tm-outfit]');
  if (button) button.onclick = () => { app.tmOutfit = app.tmOutfit === false; onChange(true); };
});
hookAfter('normApp', (o, a) => { if (typeof a?.tmForm === 'string') o.tmForm = a.tmForm; });

// ---------- shared helpers ----------
const TM_STAGES = [[1, 'I'], [100, 'II'], [300, 'III'], [500, 'IV']];
function tmActive(P) { return P?.cls === 'transmutador' && !!P.tmFire; }
function tmGrowth(P) { return clamp(((P?.lv || 1) - 1) / Math.max(1, MAXLV - 1), 0, 1); }
function tmStage(P) { let s = 0; TM_STAGES.forEach((st, i) => { if ((P?.lv || 1) >= st[0]) s = i; }); return s; }
function tmFormId(P) { const k = P?.app?.tmForm; return TM_FORMS[k] ? k : 'ascua'; }
function tmForm(P) { return TM_FORMS[tmFormId(P)]; }
function tmFormName(k) { const F = TM_FORMS[k] || TM_FORMS.ascua; return L2(F.n[0], F.n[1]); }
function tmStageName(P) { return tmFormName(tmFormId(P)) + ' ' + TM_STAGES[tmStage(P)][1]; }
const tmHash = (a, b) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const tmLerp = (a, b, g) => a + (b - a) * g;
const TM_ARMOR = ['head', 'body', 'legs', 'feet'];
const tmCost = (P, t) => Math.ceil(P.S.maxmp * t.mp * 0.3);   // mana share × 0.3: a full rotation fits the regeneration

// ---------- forms ----------
// buff(g): g = 0 at level 1 … 1 at MAXLV. Moderate values; PvP is equalised with PVP_CLS (tools/dev/pvp.py).
// armor: extra share of the armour's own defence and life while transformed.
const TM_FORMS = {
  ascua: {
    n: ['Ascua', 'Ember'], role: ['Fuego a distancia', 'Ranged fire'], gem: ['#c8420c', '#ffb43a'], col: '#ff7a1a',
    buff: g => ({ atk: tmLerp(0.08, 0.24, g), def: tmLerp(0.05, 0.15, g), hp: tmLerp(0, 0.10, g) }), armor: 0.15,
    punch: 0.88, swipe: ['#ff3d10', '#ffb52e', '#fff2a6'],
    techs: [
      { n: ['Cometa ígneo', 'Fire comet'], img: 0, cd: 2.5, mp: 0.045, m: 1.65, sim: { k: 'proj', hits: 1, f: 0.85 }, run: c => c.ascuaComet() },
      { n: ['Abanico de llamas', 'Flame fan'], img: 1, cd: 6, mp: 0.075, m: 0.72, sim: { k: 'proj', hits: 2, f: 0.85 }, run: c => c.ascuaFan() },
      { n: ['Puño de magma', 'Magma fist'], img: 2, cd: 8, mp: 0.09, m: 2.35, sim: { k: 'slam', hits: 1, f: 0.85 }, run: c => c.ascuaFist() },
      { n: ['Corona de fuego', 'Fire crown'], img: 3, cd: 13, mp: 0.13, m: 2.6, sim: { k: 'nova', hits: 1, f: 0.9 }, run: c => c.ascuaCrown() },
      { n: ['Lluvia de brasas', 'Ember rain'], img: 4, cd: 20, mp: 0.17, m: 1.15, sim: { k: 'rain', hits: 3, f: 0.5 }, run: c => c.ascuaRain() }
    ]
  },
  prisma: {
    n: ['Prisma', 'Prism'], role: ['Cristal resistente', 'Tough crystal'], gem: ['#1a6a9a', '#c8f2ff'], col: '#6ad4ff',
    buff: g => ({ atk: tmLerp(0, 0.06, g), def: tmLerp(0.20, 0.45, g), hp: tmLerp(0.10, 0.30, g) }), armor: 0.35,
    punch: 0.85, swipe: ['#1a6a9a', '#6ad4ff', '#effbff'],
    techs: [
      { n: ['Lanza de cristal', 'Crystal lance'], icon: '💎', cd: 3, mp: 0.05, m: 1.8, sim: { k: 'proj', hits: 1, f: 0.85 }, run: c => c.prismaLance() },
      { n: ['Muralla prismática', 'Prism wall'], icon: '🛡️', cd: 14, mp: 0.12, m: 0.8, sim: { k: 'nova', hits: 1, f: 0.9, shield: 22, defP: 30, dur: 6 }, run: c => c.prismaWall() },
      { n: ['Erupción de cristales', 'Crystal eruption'], icon: '✴️', cd: 8, mp: 0.09, m: 0.9, sim: { k: 'slam', hits: 3, f: 0.8 }, run: c => c.prismaErupt() },
      { n: ['Estallido prismático', 'Prism burst'], icon: '🔷', cd: 16, mp: 0.14, m: 1.6, sim: { k: 'nova', hits: 2, f: 0.85 }, run: c => c.prismaBurst() }
    ]
  },
  cefiro: {
    n: ['Céfiro', 'Zephyr'], role: ['Velocidad de tormenta', 'Storm speed'], gem: ['#c89a10', '#fff2a0'], col: '#ffe14a',
    buff: g => ({ atk: tmLerp(0.04, 0.14, g), def: tmLerp(0, 0.05, g), hp: 0, spd: tmLerp(0.15, 0.30, g), aspd: tmLerp(0.15, 0.35, g), crit: tmLerp(3, 8, g) }), armor: 0.10,
    punch: 0.62, swipe: ['#3a8aff', '#ffe14a', '#ffffff'],
    techs: [
      { n: ['Estela relámpago', 'Lightning trail'], icon: '⚡', cd: 4, mp: 0.05, m: 2.0, sim: { k: 'dash', hits: 1, f: 0.8 }, run: c => c.cefiroDash() },
      { n: ['Torbellino', 'Whirlwind'], icon: '🌀', cd: 7, mp: 0.08, m: 0.6, sim: { k: 'spin', hits: 5, f: 0.9 }, run: c => c.cefiroSpin() },
      { n: ['Ráfaga de mil golpes', 'Thousand-blow flurry'], icon: '👊', cd: 9, mp: 0.09, m: 0.45, sim: { k: 'flurry', hits: 8, f: 0.9 }, run: c => c.cefiroFlurry() },
      { n: ['Sobremarcha', 'Overdrive'], icon: '💨', cd: 18, mp: 0.12, m: 0, sim: { k: 'buff', aspdP: 40, crit: 10, dur: 6 }, run: c => c.cefiroOverdrive() }
    ]
  },
  coloso: {
    n: ['Coloso', 'Colossus'], role: ['Fuerza de cuatro brazos', 'Four-armed strength'], gem: ['#8a1a10', '#ff8a5a'], col: '#ff5a3a',
    buff: g => ({ atk: tmLerp(0.18, 0.40, g), def: tmLerp(0.08, 0.18, g), hp: tmLerp(0.10, 0.25, g), spd: -0.08, aspd: -0.12 }), armor: 0.20,
    punch: 1.25, swipe: ['#8a1a10', '#ffcf5a', '#ffffff'],
    techs: [
      { n: ['Aplauso de rocas', 'Rock clap'], icon: '🪨', cd: 5, mp: 0.06, m: 2.0, sim: { k: 'slash', hits: 1, f: 0.9 }, run: c => c.colosoClap() },
      { n: ['Cuádruple golpe', 'Quad strike'], icon: '✊', cd: 7, mp: 0.08, m: 0.9, sim: { k: 'flurry', hits: 4, f: 0.9 }, run: c => c.colosoQuad() },
      { n: ['Salto titánico', 'Titan leap'], icon: '⛰️', cd: 10, mp: 0.1, m: 3.0, sim: { k: 'leap', hits: 1, f: 0.8 }, run: c => c.colosoLeap() },
      { n: ['Lluvia de peñascos', 'Boulder rain'], icon: '☄️', cd: 18, mp: 0.12, m: 0.8, sim: { k: 'rain', hits: 3, f: 0.6, atkP: 25, dur: 7 }, run: c => c.colosoRoar() }
    ]
  }
};
const TM_FORM_IDS = Object.keys(TM_FORMS);
function tmArmorSum(P) {
  let def = 0, hp = 0;
  for (const s of TM_ARMOR) { const e = P.equip?.[s], it = e && ITEMS[e.id]; if (!it) continue; const k = 1 + 0.08 * (e.up || 0); def += (it.def || 0) * k; hp += (it.hpB || 0) * k; }
  return { def, hp };
}
hookAfter('calcStats', (S, P) => {
  if (!tmActive(P) || !S) return;
  const F = tmForm(P), b = F.buff(tmGrowth(P)), ar = tmArmorSum(P);
  S.atk = Math.round(S.atk * (1 + b.atk));
  S.def = Math.round(S.def * (1 + b.def) + ar.def * F.armor);
  S.maxhp = Math.round(S.maxhp * (1 + b.hp) + ar.hp * F.armor);
  if (b.spd) S.spd *= 1 + b.spd;
  if (b.aspd) S.aspd /= 1 + b.aspd;
  if (b.crit) S.crit = Math.min(65, S.crit + b.crit);
  S.power = Math.round(S.atk * 2 + S.def * 1.5 + S.maxhp / 10);
  if (P.hp > S.maxhp) P.hp = S.maxhp;
});

// ---------- looks: original designs on the player's own body ----------
const TM_PAL = {
  ascua: { skin: pal(['#8a3410', '#d0702a', '#eda05a', '#ffd49a']), hair: pal(['#5e0e06', '#a8200c', '#e04812', '#ff9a2a']), eyes: 'blanco',
    m: P5(['#0d0a0c', '#1d1619', '#2f2428', '#463539', '#5f4a4c']), s: P5(['#6a1404', '#b8320a', '#f06a12', '#ffb43a', '#fff0a0']), cape: P5(['#8a1806', '#d2400c', '#f87a1a', '#ffb83a', '#fff0a0']) },
  prisma: { skin: pal(['#1e6a58', '#3aa88a', '#7ad8b8', '#d0fff0']), hair: pal(['#0e4a3c', '#1e8a6c', '#4ac8a0', '#bff8e4']), eyes: 'blanco',
    m: P5(['#0a1416', '#142428', '#1e363a', '#2c4e52', '#3e6a6c']), s: P5(['#1e8a6c', '#3aa88a', '#7ad8b8', '#d0fff0', '#ffffff']) },
  cefiro: { skin: pal(['#1a5a7a', '#2e8ab0', '#5ab8d8', '#a8e4f4']), hair: pal(['#06080e', '#10141e', '#1c2232', '#2e5a78']), eyes: 'dorado',
    m: P5(['#0a0e1e', '#141c36', '#22305a', '#34488a', '#4a64b4']), s: P5(['#8a6a08', '#c89a10', '#ffd630', '#fff0a0', '#ffffff']), scarf: P5(['#8a6a08', '#c89a10', '#ffd630', '#fff0a0', '#ffffff']) },
  coloso: { skin: pal(['#5a0e0a', '#9a2216', '#cc3e28', '#f07a52']), hair: pal(['#6a6a78', '#a8a8b8', '#d8d8e4', '#ffffff']), eyes: 'dorado',
    m: P5(['#3a1e08', '#6a3a12', '#9a5a20', '#c8843a', '#eab868']), s: P5(['#6a4a14', '#b08a2a', '#dcbc4a', '#f8e48a', '#ffffff']) }
};
function tmLook(P, form) {
  const app = normApp(P.app), stage = tmStage(P), C5 = TM_PAL[form];
  const L = { ...heroLook(P.cls, app, {}, {}) };
  L.skin = C5.skin; L.hair = C5.hair; L.hair2 = null; L.eyes = C5.eyes;
  L.head = null; L.mask = null; L.scarf = null; L.back = null;
  L.weapon = { k: 'none', tier: 1 };
  if (form === 'ascua') {
    L.top = { k: 'plate', m: C5.m, s: C5.s, t: 6 + stage * 2 }; L.bot = { k: 'greaves', m: C5.m, s: C5.s }; L.feet = { k: 'sabatons', m: C5.m };
    if (stage >= 1) L.back = { k: 'cape', o: C5.cape, i: C5.s, tr: C5.hair };
  } else if (form === 'prisma') {
    L.top = { k: 'plate', m: C5.m, s: C5.s, t: 8 + stage * 2 }; L.bot = { k: 'greaves', m: C5.m, s: C5.s }; L.feet = { k: 'sabatons', m: C5.m };
  } else if (form === 'cefiro') {
    L.top = { k: 'tunic', m: C5.m, s: P5(['#1a5a7a', '#2e8ab0', '#5ab8d8', '#a8e4f4', '#ffffff']) }; L.bot = { k: 'pants', m: C5.m }; L.feet = { k: 'boots', m: P5(['#1a5a7a', '#2e8ab0', '#5ab8d8', '#a8e4f4', '#ffffff']) }; L.scarf = C5.scarf;
  } else {
    // Bigger body: the widest structure of the player's gender (Titán / Guerrera).
    const bt = app.g === 'f' ? 6 : 5; if (BODY_T[app.g === 'f' ? 'f' : 'm'][bt]) { L.bt = bt; L.btS = BODY_T[app.g === 'f' ? 'f' : 'm'][bt]; }
    L.top = { k: 'plate', m: C5.m, s: C5.s, t: 10 + stage }; L.bot = { k: 'baggy', m: P5(['#0e0e14', '#1a1a24', '#262634', '#363648', '#4a4a60']) }; L.feet = { k: 'boots', m: C5.m };
  }
  L.tmDevice = false; L.tmForm = form; L.tmStage = stage; L.mirror = false;
  return L;
}
function tmOpaque(p, x, y) { return x >= 0 && y >= 0 && x < p.w && y < p.h && (p.d[y * p.w + x] >>> 24) > 0; }
function tmHairTop(p, x, maxY) { for (let y = 0; y < Math.min(p.h, maxY); y++) if (tmOpaque(p, x, y)) return y; return -1; }
function tmDrawFlames(p, A, stage, fr) {
  const cols = [C('#f06a12'), C('#ffb83a'), C('#fff2a6')];
  for (let x = Math.round(A.hx) - 6; x <= Math.round(A.hx) + 6; x++) {
    const y0 = tmHairTop(p, x, A.torsoTop); if (y0 < 1) continue;
    const edge = Math.abs(x - A.hx) / 6, n = tmHash(x * 3 + 1, fr), h = Math.max(0, Math.round((2 + stage * 0.8) * (1 - edge * 0.65) + n * 2.4 - 0.6));
    for (let k = 1; k <= h && y0 - k >= 0; k++) { const t = k / (h + 0.5); p.set(x, y0 - k, cols[t < 0.35 ? 0 : t < 0.75 ? 1 : 2]); }
  }
  if (stage >= 2) for (let i = 0; i < stage; i++) {
    const sx = Math.round(A.hx - 7 + tmHash(i, fr) * 14), sy = Math.round(A.hy - 9 - tmHash(fr, i + 5) * 6);
    if (sy > 0 && !tmOpaque(p, sx, sy)) p.set(sx, sy, cols[2]);
  }
}
function tmDrawShards(p, A, stage) {
  // Angular sky-blue crystals growing from the head and the shoulders.
  const dark = C('#0e4a3c'), mid = C('#3aa88a'), lite = C('#bff8e4'), glint = C('#ffffff');
  const spike = (x, y0, h, lean) => { h = Math.max(2, Math.round(h)); for (let k = 0; k < h; k++) { const w = Math.max(0, Math.round((h - k) / h * 1.6)), xx = Math.round(x + lean * k * 0.35);
    for (let i = -w; i <= w; i++) if (y0 - k >= 0) p.set(xx + i, y0 - k, i < 0 ? dark : i === 0 ? lite : mid); }
    if (y0 - h >= 0) p.set(Math.round(x + lean * h * 0.35), y0 - h + 1, glint); };
  const n = 3 + Math.min(2, stage), hx = Math.round(A.hx);
  for (let j = 0; j < n; j++) {
    const off = Math.round((j - (n - 1) / 2) * 3), x = hx + off, y0 = tmHairTop(p, x, A.torsoTop); if (y0 < 2) continue;
    spike(x, y0 + 1, 3 + stage + (j === (n >> 1) ? 2 : 0) - Math.abs(off) / 3, Math.sign(off));
  }
  if (!A.side) for (const sx of [A.tx0 - 1, A.tx0 + A.tw]) spike(sx, A.torsoTop + 1, 3 + Math.min(2, stage), sx < A.cx ? -1 : 1);
  else spike(Math.round(A.cx - A.d * 2), A.torsoTop + 1, 3 + Math.min(2, stage), -A.d);
}
function tmDrawTail(p, A, fr) {
  // Lightning tail: one solid sky-blue tail ending in a yellow bolt, swaying with the walk.
  const base = C('#2e8ab0'), lite = C('#5ab8d8'), dark = C('#1a5a7a'), bolt = C('#ffe14a'), out = C('#06080e');
  const sway = Math.sin((A.f || 0) * 1.6) * 1.5, y0 = A.legTop - 1;
  const pts = []; let x, y;
  if (A.side) { x = Math.round(A.cx - A.d * 4); y = y0; for (let k = 0; k < 9; k++) pts.push([x - A.d * k, Math.round(y + Math.sin(k * 0.7) * 1.2 - k * 0.45 + sway * (k / 9))]); }
  else if (A.up) { x = Math.round(A.cx); y = y0; for (let k = 0; k < 8; k++) pts.push([Math.round(x + Math.sin(k * 0.8 + sway) * 1.6), y + k]); }
  else { x = Math.round(A.tx0 + A.tw + 1); y = y0 + 2; for (let k = 0; k < 6; k++) pts.push([x + Math.round(k * 0.6), Math.round(y + Math.sin(k * 0.9 + sway) * 1.1 - k * 0.3)]); }
  pts.forEach(([px, py], i) => { if (!A.up && !A.side && tmOpaque(p, px, py)) return; const w = i < 3 ? 1 : 0;
    for (let j = -w; j <= w + 1; j++) { const yy = py + j; if (tmOpaque(p, px, yy) && !(A.up || A.side)) continue; p.set(px, yy, j === -w ? lite : j === w + 1 ? dark : base); }
    p.set(px, py - w - 1, out); p.set(px, py + w + 2, out); });
  const [tx, ty] = pts[pts.length - 1], dx = A.side ? -A.d : 1;
  [[0, 0], [dx, -1], [0, -2], [dx, -3], [dx * 2, -2]].forEach(([ox, oy]) => p.set(tx + ox, ty + oy, bolt));
}
function tmDrawStorm(p, A, stage, fr) {
  tmDrawTail(p, A, fr);
  // Electric streaks crossing the hair; they jump between frames.
  const bolt = C('#fffbd0'), glow = C('#ffe14a');
  for (let j = 0; j < 2 + Math.min(2, stage); j++) {
    let x = Math.round(A.hx - 5 + tmHash(j, fr) * 10), y = tmHairTop(p, x, A.torsoTop); if (y < 1) continue;
    for (let k = 0; k < 4; k++) { if (tmOpaque(p, x, y)) p.set(x, y, k % 2 ? glow : bolt); x += tmHash(j + k, fr) < 0.5 ? -1 : 1; y++; }
  }
  if (A.anim === 'walk' || A.anim === 'dash') { const bx = Math.round(A.hx - (A.side ? A.d * 7 : 0)), by = Math.round(A.hy - 2);
    for (let k = 0; k < 3; k++) { const xx = bx - (A.side ? A.d * k : 0), yy = by + k * 2; if (!tmOpaque(p, xx, yy)) p.set(xx, yy, glow); } }
}
function tmDrawArms(p, A, L) {
  // Second pair of arms below the first (counter-phase swing), placed from the torso anchors of each body structure.
  const ps = heroPose(A.dir, A.anim, A.f, L), SK = L.skin, aw = 3, al = Math.max(5, Math.round(A.th * 0.8)), y0 = A.torsoTop + Math.max(3, Math.round(A.th * 0.35));
  const outl = C('#1a0606'), band = C('#dcbc4a'), bandD = C('#8a6a1a');
  const arm = (sx, dx, dy, back) => {
    dx = clamp(dx || 0, -2, 2); dy = clamp(dy || 0, -2, 2);
    for (let k = 0; k <= al; k++) { const t = k / al, x = Math.round(sx + dx * t), y = Math.round(y0 + k + dy * t);
      for (let i = -1; i <= aw; i++) { const edge = i < 0 || i === aw; if (edge && tmOpaque(p, x + i, y)) continue;
        p.set(x + i, y, edge ? outl : k === al - 2 ? (i === 0 ? band : bandD) : SK[back ? 0 : i === 0 ? 3 : i === 1 ? 2 : 1]); } }
    // fist
    const fx = Math.round(sx + dx), fy = Math.round(y0 + al + dy);
    for (let i = -1; i <= aw; i++) { p.set(fx + i, fy + 1, outl); if (i >= 0 && i < aw) p.set(fx + i, fy, SK[back ? 0 : 2]); }
  };
  if (!A.side) { arm(A.tx0 - aw - 1, -(ps.rax || 0), ps.ray, A.up); arm(A.tx0 + A.tw + 1, -(ps.lax || 0), ps.lay, A.up); }
  else { arm(Math.round(A.cx - 1 + A.d * 2), ps.rax, ps.ray, true); arm(Math.round(A.cx - 2 - A.d), ps.lax, ps.lay, false); }
}
hookAround('drawHero', (next, p, L, ...a) => {
  if (!L.tmForm) return next(p, L, ...a);
  if (!p.t) p.t = new Uint8Array(p.w * p.h);
  const r = next(p, L, ...a), A = p.meta; if (!A) return r;
  const fr = (HERO_ANIMS.indexOf(A.anim) + 1) * 7 + (A.f || 0), tg = p.tg;
  p.tg = 3;
  if (L.tmForm === 'ascua') tmDrawFlames(p, A, L.tmStage, fr);
  else if (L.tmForm === 'prisma') tmDrawShards(p, A, L.tmStage);
  else if (L.tmForm === 'cefiro') tmDrawStorm(p, A, L.tmStage, fr);
  else tmDrawArms(p, A, L);
  p.tg = tg;
  return r;
});
function tmAtlas(P = G.P) {
  const app = normApp(P.app), stage = tmStage(P), form = tmFormId(P);
  return getAtlas('tm:' + form + ':' + heroKey(P.cls, app, {}, {}, 0) + ':' + stage, () => buildHeroAtlas(tmLook(P, form)));
}
hookAround('playerAtlas', (next, P) => tmActive(P) ? tmAtlas(P) : next(P));

// ---------- transform / revert ----------
function tmClearBuffs(P) { for (const b of (P.buffs || []).slice()) if (/^tm_/.test(b.id)) removeBuff(P, b.id); }
function tmApply(P, on, form) {
  const hp = P.hp / Math.max(1, P.S.maxhp);
  tmClearBuffs(P);
  if (form) P.app.tmForm = form;
  P.tmFire = on;
  calcStats(P); P.hp = Math.max(1, Math.min(P.S.maxhp, Math.round(P.S.maxhp * hp)));
  refreshLook(); if (typeof markDirty === 'function') markDirty();
  uiDirty.hud = true;
}
function tmToggle(P, form) {
  if (!P || P.cls !== 'transmutador' || P.dead) return;
  if (P.tmFire && !form) { // going back to human form is never blocked
    tmApply(P, false);
    burst(P.x, P.y - 10, 14, { sp: 50, up: 25, life: 0.4, c: ['#5a5a5a', '#a0a0a0', '#ffffff'] }); sfx('buff'); return;
  }
  if (!P.tmFire && (P.job || P.fishing || P.busy > 0 || P.dawnHelm)) return;
  const k = TM_FORMS[form] ? form : tmFormId(P);
  tmApply(P, true, k);
  addFx({ type: 'tmpillar', x: P.x, y: P.y, dur: 0.6, light: 70, col: TM_FORMS[k].col });
  burst(P.x, P.y - 10, 26, { sp: 80, up: 60, g: -20, life: 0.6, c: [TM_FORMS[k].gem[0], TM_FORMS[k].col, TM_FORMS[k].gem[1]] });
  toast(L2('Forma ' + tmStageName(P), tmStageName(P) + ' form'));
  sfx(k === 'ascua' ? 'fire' : 'buff');
}
hookAfter('playerDie', () => { if (tmActive(G.P)) tmApply(G.P, false); });

// ---------- combat ----------
// Techniques gain mastery with the level (as other classes rank up their skills): ×1 at level 1 → ×TM_MASTERY at MAXLV.
const TM_MASTERY = [2.6, 1.8];   // [techniques, punch]
function tmMastery(P, tech) { return 1 + ((tech ? TM_MASTERY[0] : TM_MASTERY[1]) - 1) * tmGrowth(P); }
function tmDamage(P, m, tech) { return (P.S.atk * 0.9 + P.lv * 0.65) * m * tmMastery(P, tech) * (tech ? 1 + P.S.skillP / 100 : 1); }
function tmAttack(P, i) {
  if (P.dead || P.job || P.fishing || P.busy > 0 || P.dawnHelm) return;
  const formId = tmFormId(P), F = TM_FORMS[formId], tech = F.techs[i], key = 'tm_' + formId + '_' + i;
  if (tech) {
    const cost = tmCost(P, tech);
    if (P.cds[key] > 0 || P.mp < cost) return;
    P.cds[key] = tech.cd; P.mp -= cost;
  } else { if (P.atkCd > 0) return; P.atkCd = P.S.aspd; }
  const stage = tmStage(P), grow = 1 + stage * 0.12;
  const target = nearestMob(P.x, P.y, i < 0 ? 48 : 170);
  if (target) P.dir = dirFromVec(target.x - P.x, target.y - P.y);
  const [dx, dy] = DIRV[P.dir], angle = Math.atan2(dy, dx), map = G.map;
  // S.atk already carries the form buff (calcStats), so every technique and the punch grow with the level.
  const damage = tmDamage(P, tech ? tech.m : F.punch, !!tech);
  const self = tech && tech.m === 0;
  setAnim(P, self || i === 3 ? 'cast' : formId === 'coloso' && i === 2 ? 'slam' : 'atk');
  P.loopAnim = false; P.busy = 0.3; P.combatT = G.t;
  const later = (s, fn) => delayAct(s, () => { if (G.P === P && G.map === map && !P.dead && tmActive(P) && tmFormId(P) === formId) fn(); });
  const ex = target?.x ?? P.x + dx * 62, ey = target?.y ?? P.y + dy * 62;
  const blast = (x, y, r, src, col) => { hitCircle(x, y, r, damage, src); addFx({ type: 'tmblast', x, y, r, dur: 0.45, light: r * 2, pal: col }); };
  const fire = { fire: 1, burn: 1 }, ST = ['#3a8aff', '#ffe14a', '#ffffff'], CO = ['#8a1a10', '#ffcf5a', '#ffffff'];
  const c = {
    // Ascua
    ascuaComet: () => later(0.08, () => spawnProj('p', P.x + dx * 6, P.y - 6, angle, { ...fire, spd: 230, dmg: damage, art: 'tmfire', tmS: 1 + stage * 0.15, ex: Math.round(19 * grow), life: 0.8, glow: 18, glowC: 'rgb(255,140,40)' })),
    ascuaFan: () => { const offs = stage >= 2 ? [-0.42, -0.21, 0, 0.21, 0.42] : [-0.31, 0, 0.31]; addFx({ type: 'tmcone', x: P.x, y: P.y - 8, ang: angle, r: 46 * grow, dur: 0.3 });
      later(0.08, () => offs.forEach(o => spawnProj('p', P.x + dx * 6, P.y - 6, angle + o, { ...fire, spd: 200, dmg: offs.length > 3 ? damage * 0.7 : damage, art: 'tmfire', tmS: 0.7, life: 0.8 }))); },
    ascuaFist: () => later(0.1, () => { const x = P.x + dx * 25, y = P.y + dy * 22; addFx({ type: 'tmfist', x, y, ang: angle, r: 26 * grow, dur: 0.5, light: 80 }); blast(x, y, Math.round(22 * grow), fire); }),
    ascuaCrown: () => later(0.12, () => { hitCircle(P.x, P.y, 55 * grow, damage, fire); addFx({ type: 'tmcrown', x: P.x, y: P.y, r: 55 * grow, dur: 0.7, light: 120 }); }),
    ascuaRain: () => [[-19, 6], [16, 10], [0, -13], [-6, 18], [22, -8]].slice(0, 3 + Math.min(2, stage)).forEach(([ox, oy], j) => {
      later(0.1 + j * 0.12, () => addFx({ type: 'tmmeteor', x: ex + ox, y: ey + oy, dur: 0.32, s: grow }));
      later(0.42 + j * 0.12, () => blast(ex + ox, ey + oy, Math.round(23 * grow), fire)); }),
    // Prisma
    prismaLance: () => later(0.1, () => spawnProj('p', P.x + dx * 6, P.y - 7, angle, { spd: 260, dmg: damage, art: 'tmshard', tmS: 1 + stage * 0.12, pierce: true, life: 0.75, glow: 14, glowC: 'rgb(120,210,255)' })),
    prismaWall: () => { const sp = 22 + 8 * tmGrowth(P); P.shield = P.S.maxhp * sp / 100; P.shieldT = 6; addBuff(P, 'tm_prisma_wall', { defP: 30 }, 6);
      later(0.1, () => { hitCircle(P.x, P.y, 34 * grow, damage, { kb: 40 }); addFx({ type: 'tmdome', x: P.x, y: P.y, r: 30 * grow, dur: 0.8, light: 80 }); }); },
    prismaErupt: () => { const n = 5 + Math.min(2, stage); for (let j = 0; j < n; j++) later(0.1 + j * 0.07, () => { const x = P.x + dx * (18 + j * 15), y = P.y + dy * (14 + j * 12);
      hitCircle(x, y, 15 * grow, damage, { stun: 0.4 }); addFx({ type: 'tmspikes', x, y, r: 12 * grow, dur: 0.55, seed: j }); }); },
    prismaBurst: () => later(0.15, () => { hitCircle(P.x, P.y, 40 * grow, damage, { stun: 0.6 }); addFx({ type: 'tmspikes', x: P.x, y: P.y, r: 30 * grow, dur: 0.7, seed: 9, ring: 1 });
      for (let j = 0; j < 10; j++) spawnProj('p', P.x, P.y - 7, j / 10 * Math.PI * 2, { spd: 190, dmg: damage * 0.45, art: 'tmshard', tmS: 0.7, life: 0.5 }); }),
    // Céfiro
    cefiroDash: () => { const x0 = P.x, y0 = P.y, steps = 8, dist = 80 + stage * 8;
      for (let j = 1; j <= steps; j++) later(j * 0.018, () => moveEnt(G.map, P, dx * dist / steps, dy * dist / steps));
      later(steps * 0.018 + 0.01, () => { addFx({ type: 'tmdash', x: x0, y: y0 - 10, x2: P.x, y2: P.y - 10, dur: 0.35, light: 60 });
        const mx = (x0 + P.x) / 2, my = (y0 + P.y) / 2, len = Math.hypot(P.x - x0, P.y - y0); hitArc(mx, my, angle, len / 2 + 14, 0.9, damage, { stun: 0.3 }); }); },
    cefiroSpin: () => { for (let j = 0; j < 5; j++) later(0.08 + j * 0.12, () => { P.dir = ['down', 'left', 'up', 'right'][j % 4]; setAnim(P, 'atk'); hitCircle(P.x, P.y, 34 * grow, damage, { kb: 18 }); });
      addFx({ type: 'tmwind', x: P.x, y: P.y, r: 34 * grow, dur: 0.75 }); },
    cefiroFlurry: () => { for (let j = 0; j < 8; j++) later(0.05 + j * 0.06, () => { setAnim(P, 'atk'); hitArc(P.x, P.y, angle, 32, 1.4, damage, {});
      addFx({ type: 'tmswipe', x: P.x + (tmHash(j, 3) - 0.5) * 10, y: P.y - 9 + (tmHash(3, j) - 0.5) * 8, ang: angle + (tmHash(j, 7) - 0.5) * 0.8, r: 16 + tmHash(j, 1) * 8, dur: 0.16, flip: j % 2, pal: ST }); }); },
    cefiroOverdrive: () => { addBuff(P, 'tm_cefiro_over', { aspdP: 40, spdP: 30, crit: 10 }, 6); addFx({ type: 'tmpillar', x: P.x, y: P.y, dur: 0.5, col: '#ffe14a', light: 60 });
      burst(P.x, P.y - 10, 22, { sp: 110, up: 20, life: 0.4, c: ST }); },
    // Coloso
    colosoClap: () => later(0.15, () => { hitArc(P.x, P.y, angle, 46 * grow, 1.2, damage * 0.6, { kb: 50 }); addFx({ type: 'tmquake', x: P.x, y: P.y, ang: angle, r: 52 * grow, dur: 0.5, light: 70 }); G.shake = Math.max(G.shake || 0, 3);
      [-0.25, 0, 0.25].forEach(o => spawnProj('p', P.x + dx * 8, P.y - 8, angle + o, { spd: 210, dmg: damage * 0.6, art: 'tmrock', tmS: 1 + stage * 0.12, life: 0.6, kb: 30 })); }),
    colosoQuad: () => { for (let j = 0; j < 4; j++) later(0.08 + j * 0.13, () => { setAnim(P, 'atk'); const x = P.x + dx * 18, y = P.y + dy * 14; hitCircle(x, y, 20 * grow, damage, j === 3 ? { kb: 45 } : {});
      addFx({ type: 'tmblast', x: x + (j % 2 ? 5 : -5), y, r: 12 * grow, dur: 0.3, pal: CO }); burst(x, y - 4, 6, { sp: 70, up: 40, g: 160, life: 0.5, c: ['#6a5040', '#8a705a', '#4a3a30'], s: 2 }); G.shake = Math.max(G.shake || 0, 1.5); }); },
    colosoLeap: () => { const d = Math.min(90, Math.hypot(ex - P.x, ey - P.y)), a = Math.atan2(ey - P.y, ex - P.x), steps = 8;
      addFx({ type: 'tele', shape: 'circle', x: P.x + Math.cos(a) * d, y: P.y + Math.sin(a) * d, r: 40 * grow, dur: 0.3, col: 'rgba(255,90,58,0.18)' });
      for (let j = 1; j <= steps; j++) later(j * 0.035, () => moveEnt(G.map, P, Math.cos(a) * d / steps, Math.sin(a) * d / steps));
      later(steps * 0.035 + 0.02, () => { setAnim(P, 'slam'); hitCircle(P.x, P.y, 40 * grow, damage, { stun: 0.8 }); addFx({ type: 'tmslam', x: P.x, y: P.y, r: 40 * grow, dur: 0.6, light: 90 }); addFx({ type: 'tmrockspikes', x: P.x, y: P.y, r: 36 * grow, dur: 0.8, seed: 3 }); G.shake = Math.max(G.shake || 0, 5); }); },
    colosoRoar: () => { addBuff(P, 'tm_coloso_roar', { atkP: 25 }, 7); addFx({ type: 'tmroar', x: P.x, y: P.y - 14, r: 50 * grow, dur: 0.6 });
      const spots = [[0, 0], [-24, 10], [22, -8], [-10, -20], [16, 18]].slice(0, 3 + Math.min(2, stage));
      spots.forEach(([ox, oy], j) => { later(0.1 + j * 0.12, () => addFx({ type: 'tmboulder', x: ex + ox, y: ey + oy, dur: 0.34, s: grow }));
        later(0.44 + j * 0.12, () => { hitCircle(ex + ox, ey + oy, 24 * grow, damage, { stun: 0.5 }); addFx({ type: 'tmrockspikes', x: ex + ox, y: ey + oy, r: 18 * grow, dur: 0.6, seed: j }); G.shake = Math.max(G.shake || 0, 2.5); }); }); }
  };
  if (tech) tech.run(c);
  else later(0.06, () => {
    const r = formId === 'coloso' ? 34 : 29;
    hitArc(P.x, P.y, angle, r, 1.7, damage, formId === 'ascua' ? fire : formId === 'coloso' ? { kb: 22 } : {});
    addFx({ type: 'tmswipe', x: P.x, y: P.y - 9, ang: angle, r: formId === 'coloso' ? 27 : 22, dur: 0.22, flip: (P._tmSw = !P._tmSw), pal: F.swipe });
  });
  sfx(formId === 'ascua' ? 'fire' : 'hit');
}
hookBefore('basicAttack', () => { if (tmActive(G.P)) { tmAttack(G.P, -1); return HOOK_SKIP; } });
hookBefore('useSkill', slot => { if (tmActive(G.P)) { if (tmForm(G.P).techs[slot]) tmAttack(G.P, slot); return HOOK_SKIP; } });

// pvp.py: SK-like rotation of a form, so tools/dev/pvp.py can weigh the Transmutador with the other classes.
function tmPvpSim(P, S, form) {
  const F = TM_FORMS[form], base = (S.atk * 0.9 + P.lv * 0.65) / Math.max(1, S.atk), tb = base * tmMastery(P, true) * (1 + (S.skillP || 0) / 100);
  return { basic: F.punch * base * tmMastery(P, false), acts: F.techs.map((t, i) => ({ id: 'tm_' + form + '_' + i, type: 'act', cd: t.cd, mp: Math.ceil(S.maxmp * t.mp * 0.3),
    eff: { k: t.sim.k, hits: t.sim.hits, dur: t.sim.dur || 0, p: t.sim.shield || 0 },
    sim: { m: Math.round(t.m * tb * 100), atkP: t.sim.atkP || 0, aspdP: t.sim.aspdP || 0, crit: t.sim.crit || 0, defP: t.sim.defP || 0, p: t.sim.shield || 0 } })) };
}

// ---------- VFX (separate layer from the sprite) ----------
const TM_FIREC = ['#ff3d10', '#ff7a1a', '#ffb52e', '#fff2a6'];
function tmRGB(h) { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function tmGlow(x, y, r, a, col) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(1, r)), [cr, cg, cb] = col ? tmRGB(col) : [255, 110, 30];
  g.addColorStop(0, `rgba(255,236,180,${a})`); g.addColorStop(0.45, `rgba(${cr},${cg},${cb},${a * 0.55})`); g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
function tmTongue(x, y, h, w, col) {
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - w, y); ctx.quadraticCurveTo(x - w * 0.6, y - h * 0.55, x, y - h); ctx.quadraticCurveTo(x + w * 0.6, y - h * 0.55, x + w, y); ctx.closePath(); ctx.fill();
}
function tmCrystal(x, y, h, w, lean, cols) {
  const tx = x + lean, ty = y - h;
  ctx.fillStyle = cols[0]; ctx.beginPath(); ctx.moveTo(x - w, y); ctx.lineTo(tx, ty); ctx.lineTo(x, y + 1); ctx.closePath(); ctx.fill();
  ctx.fillStyle = cols[1]; ctx.beginPath(); ctx.moveTo(x + w, y); ctx.lineTo(tx, ty); ctx.lineTo(x, y + 1); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = cols[2]; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(tx, ty); ctx.stroke();
}
hookAround('drawProj', (next, e, cx, cy) => {
  if (e.art !== 'tmfire' && e.art !== 'tmshard' && e.art !== 'tmrock') return next(e, cx, cy);
  const x = Math.round(e.x - cx), y = Math.round(e.y - cy - e.z), c = Math.cos(e.ang), s = Math.sin(e.ang), sc = e.tmS || 1;
  if (e.art === 'tmrock') { // tumbling boulder with dust
    const r = 4.5 * sc, rot = e.t * 14;
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(x, y + e.z, r, r * 0.45, 0, 0, 7); ctx.fill();
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#5a4434'; ctx.beginPath();
    for (let q = 0; q < 7; q++) { const a = q / 7 * Math.PI * 2, rr = r * (0.8 + tmHash(q, 5) * 0.35); q ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    ctx.closePath(); ctx.fill(); ctx.fillStyle = '#8a705a'; ctx.fillRect(-r * 0.5, -r * 0.6, r * 0.7, r * 0.5); ctx.fillStyle = '#2e221a'; ctx.fillRect(0, r * 0.2, r * 0.6, r * 0.35); ctx.restore();
    if (Math.random() < 0.5) part(e.x - c * 5, e.y - s * 5, { z: e.z, vz: 8, life: 0.4, c: '#a89078', s: 2 });
    return;
  }
  if (e.art === 'tmshard') {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; tmGlow(x, y, 11 * sc, 0.45, '#6ad4ff');
    for (let k = 1; k < 5; k++) { ctx.globalAlpha = 0.5 - k * 0.1; ctx.fillStyle = '#6ad4ff'; ctx.fillRect(Math.round(x - c * k * 4 * sc), Math.round(y - s * k * 4 * sc), 2, 2); }
    ctx.restore();
    ctx.save(); ctx.translate(x, y); ctx.rotate(e.ang); const L = 8 * sc, W = 2.6 * sc;
    ctx.fillStyle = '#1e6ea0'; ctx.beginPath(); ctx.moveTo(L, 0); ctx.lineTo(-L * 0.6, -W); ctx.lineTo(-L, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#7cd8ff'; ctx.beginPath(); ctx.moveTo(L, 0); ctx.lineTo(-L * 0.6, W); ctx.lineTo(-L, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.round(L * 0.3), -1, 3, 1); ctx.restore();
    if (Math.random() < 0.4) part(e.x, e.y, { z: e.z, vz: 6, life: 0.35, c: Math.random() < 0.5 ? '#bfeeff' : '#ffffff' });
    return;
  }
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  tmGlow(x, y, 14 * sc, 0.55);
  for (let k = 6; k >= 0; k--) {
    const tx = x - c * k * 2.6 * sc + Math.sin(G.t * 40 + k) * 0.8, ty = y - s * k * 2.6 * sc + Math.cos(G.t * 37 + k) * 0.8, rr = (4.6 - k * 0.55) * sc;
    ctx.fillStyle = TM_FIREC[k > 4 ? 0 : k > 2 ? 1 : 2]; ctx.globalAlpha = 1 - k * 0.11;
    ctx.beginPath(); ctx.arc(tx, ty, Math.max(0.8, rr), 0, 7); ctx.fill();
  }
  ctx.globalAlpha = 1; ctx.restore();
  ctx.fillStyle = '#fff6c8'; ctx.beginPath(); ctx.arc(x + c * sc, y + s * sc, 2.2 * sc, 0, 7); ctx.fill();
  if (Math.random() < 0.7) part(e.x - c * 6, e.y - s * 6, { z: e.z, vx: -c * 20 + (Math.random() - 0.5) * 20, vy: -s * 20 + (Math.random() - 0.5) * 14, vz: 14, life: 0.4, c: TM_FIREC[1 + (Math.random() * 3 | 0)], s: Math.random() < 0.3 ? 2 : 1 });
});
hookAfter('explode', (_, e) => { if (e?.art === 'tmfire') addFx({ type: 'tmblast', x: e.x, y: e.y, r: e.ex || 18, dur: 0.45 }); });
hookAround('drawFx', (next, f, cx, cy) => {
  if (!f.type || f.type.slice(0, 2) !== 'tm') return next(f, cx, cy);
  const x = f.x - cx, y = f.y - cy, k = clamp(f.t / f.dur, 0, 1), fade = 1 - k, pal = f.pal || ['#ff3d10', '#ffb52e', '#fff2a6'];
  ctx.save();
  switch (f.type) {
    case 'tmswipe': {
      ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      const sweep = 1.8, a0 = f.ang - sweep / 2, prog = Math.min(1, k * 2.4), dir = f.flip ? -1 : 1, s = dir > 0 ? a0 : a0 + sweep, e = s + dir * sweep * prog;
      [[5, pal[0], 0.55], [3, pal[1], 0.8], [1.4, pal[2], 1]].forEach(([w, col, a]) => { ctx.strokeStyle = col; ctx.globalAlpha = a * fade; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(x, y, f.r, Math.min(s, e), Math.max(s, e)); ctx.stroke(); });
      ctx.globalAlpha = 1; tmGlow(x + Math.cos(f.ang) * f.r, y + Math.sin(f.ang) * f.r * 0.8, 10, 0.5 * fade, pal[1]);
      break;
    }
    case 'tmcone': {
      ctx.globalCompositeOperation = 'lighter';
      const r = f.r * (0.4 + 0.6 * Math.min(1, k * 2)), g = ctx.createRadialGradient(x, y, 2, x, y, r);
      g.addColorStop(0, `rgba(255,240,170,${0.8 * fade})`); g.addColorStop(0.5, `rgba(255,130,30,${0.55 * fade})`); g.addColorStop(1, 'rgba(255,50,10,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r, f.ang - 0.6, f.ang + 0.6); ctx.closePath(); ctx.fill();
      break;
    }
    case 'tmfist': {
      const r = f.r * (0.5 + 0.7 * k);
      ctx.strokeStyle = `rgba(60,20,10,${0.7 * fade})`; ctx.lineWidth = 1.5;
      for (let j = 0; j < 7; j++) { const a = f.ang + (j - 3) * 0.45, l = f.r * (0.6 + tmHash(j, f.x | 0) * 0.6); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l * 0.5 + 2, y + Math.sin(a) * l * 0.3); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l * 0.6); ctx.stroke(); }
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = `rgba(255,180,60,${fade})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.55, 0, f.ang - 1.2, f.ang + 1.2); ctx.stroke();
      for (let j = 0; j < 5; j++) { const a = f.ang + (j - 2) * 0.5, px = x + Math.cos(a) * r * 0.7, py = y + Math.sin(a) * r * 0.4, h = (10 + tmHash(j, 9) * 10) * Math.sin(Math.min(1, k * 1.6) * Math.PI);
        tmTongue(px, py, h, 3, TM_FIREC[1]); tmTongue(px, py, h * 0.6, 1.6, TM_FIREC[3]); }
      tmGlow(x, y - 4, f.r * 1.2, 0.6 * fade);
      break;
    }
    case 'tmcrown': {
      const r = f.r * (0.25 + 0.75 * Math.min(1, k * 1.5));
      ctx.fillStyle = `rgba(40,10,5,${0.25 * fade})`; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.55, 0, 0, 7); ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = `rgba(255,120,30,${0.7 * fade})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.55, 0, 0, 7); ctx.stroke();
      for (let j = 0; j < 22; j++) { const a = j / 22 * Math.PI * 2 + k * 0.6, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r * 0.55, h = (7 + tmHash(j, (f.t * 20) | 0) * 7) * fade;
        tmTongue(px, py, h, 2.6, TM_FIREC[1]); tmTongue(px, py, h * 0.55, 1.3, TM_FIREC[3]); }
      tmGlow(x, y - 6, r * 0.8, 0.35 * fade);
      break;
    }
    case 'tmmeteor': {
      const sc = f.s || 1, hgt = 110 * (1 - k), mx = x - hgt * 0.45, my = y - hgt;
      ctx.fillStyle = `rgba(0,0,0,${0.25 * k})`; ctx.beginPath(); ctx.ellipse(x, y, 6 * sc * k + 2, 3 * sc * k + 1, 0, 0, 7); ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      for (let j = 8; j >= 0; j--) { ctx.globalAlpha = 1 - j * 0.1; ctx.fillStyle = TM_FIREC[j > 5 ? 0 : j > 2 ? 1 : 2]; ctx.beginPath(); ctx.arc(mx - j * 2.4 * sc, my - j * 2.7 * sc, (5 - j * 0.45) * sc, 0, 7); ctx.fill(); }
      ctx.globalAlpha = 1; tmGlow(mx, my, 14 * sc, 0.6);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#3a2420'; ctx.beginPath(); ctx.arc(mx, my, 3.2 * sc, 0, 7); ctx.fill();
      ctx.fillStyle = '#ffdf7a'; ctx.fillRect(Math.round(mx - 1), Math.round(my - 1), 2, 1);
      break;
    }
    case 'tmblast': {
      const r = f.r * (0.45 + 0.75 * k);
      ctx.fillStyle = `rgba(35,12,6,${0.35 * fade})`; ctx.beginPath(); ctx.ellipse(x, y, f.r * 0.9, f.r * 0.5, 0, 0, 7); ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      tmGlow(x, y - 5, r * 1.1, 0.9 * fade, pal[0]);
      ctx.strokeStyle = pal[2]; ctx.globalAlpha = fade; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.55, 0, 0, 7); ctx.stroke(); ctx.globalAlpha = 1;
      for (let j = 0; j < 7; j++) { const a = j / 7 * Math.PI * 2, px = x + Math.cos(a) * r * 0.5, py = y + Math.sin(a) * r * 0.28, h = (6 + tmHash(j, f.x | 0) * 9) * Math.sin(Math.min(1, k * 1.4) * Math.PI); tmTongue(px, py, h, 2.4, pal[1]); }
      break;
    }
    case 'tmpillar': {
      ctx.globalCompositeOperation = 'lighter';
      const [cr, cg, cb] = tmRGB(f.col || '#ff7a1a'), w = 14 * fade + 2, g = ctx.createLinearGradient(x, y - 70, x, y);
      g.addColorStop(0, `rgba(${cr},${cg},${cb},0)`); g.addColorStop(0.6, `rgba(${cr},${cg},${cb},${0.6 * fade})`); g.addColorStop(1, `rgba(255,245,210,${0.9 * fade})`);
      ctx.fillStyle = g; ctx.fillRect(x - w / 2, y - 70, w, 70);
      for (let j = 0; j < 9; j++) tmTongue(x + (j - 4) * 3, y, (10 + tmHash(j, (f.t * 24) | 0) * 18) * fade, 2.4, f.col || TM_FIREC[j % 2 ? 1 : 2]);
      break;
    }
    case 'tmspikes': {
      const grow = Math.sin(Math.min(1, k * 2.2) * Math.PI * 0.5) * (k > 0.7 ? (1 - k) / 0.3 : 1), cols = ['#0e4a3c', '#4ac8a0', '#ffffff'];
      ctx.fillStyle = `rgba(10,30,50,${0.3 * fade})`; ctx.beginPath(); ctx.ellipse(x, y, f.r, f.r * 0.5, 0, 0, 7); ctx.fill();
      const n = f.ring ? 12 : 4;
      for (let j = 0; j < n; j++) { const a = f.ring ? j / n * Math.PI * 2 : (j - 1.5) * 0.9, rr = f.ring ? f.r * 0.85 : f.r * 0.45 * (j % 2 ? 1 : 0.5);
        const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr * 0.5, h = (10 + tmHash(j, f.seed || 0) * 10) * grow * (f.ring ? 1 : 1.2);
        tmCrystal(px, py, h, 3, (tmHash(f.seed || 0, j) - 0.5) * 6, cols); }
      ctx.globalCompositeOperation = 'lighter'; tmGlow(x, y - 6, f.r * 1.1, 0.4 * fade, '#6ad4ff');
      break;
    }
    case 'tmdome': {
      const r = f.r * (0.6 + 0.4 * Math.min(1, k * 3));
      ctx.globalAlpha = 0.35 * fade; ctx.fillStyle = '#6ad4ff'; ctx.beginPath(); ctx.ellipse(x, y - r * 0.4, r, r * 0.9, 0, Math.PI, 0); ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = `rgba(225,248,255,${fade})`; ctx.lineWidth = 1.5;
      for (let j = 0; j < 6; j++) { const a = Math.PI + j / 5 * Math.PI; ctx.beginPath(); ctx.moveTo(x, y - r * 1.3); ctx.lineTo(x + Math.cos(a) * r, y - r * 0.4 + Math.sin(a) * r * 0.9 + r * 0.4); ctx.stroke(); }
      ctx.beginPath(); ctx.ellipse(x, y - r * 0.4, r, r * 0.9, 0, Math.PI, 0); ctx.stroke();
      ctx.globalCompositeOperation = 'lighter'; tmGlow(x, y - r * 0.5, r, 0.35 * fade, '#6ad4ff');
      break;
    }
    case 'tmdash': {
      ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      const x2 = f.x2 - cx, y2 = f.y2 - cy;
      [[7, 'rgba(58,138,255,', 0.5], [3.5, 'rgba(255,225,74,', 0.9], [1.4, 'rgba(255,255,255,', 1]].forEach(([w, c0, a]) => {
        ctx.strokeStyle = c0 + (a * fade) + ')'; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y);
        for (let q = 1; q < 7; q++) { const t = q / 7; ctx.lineTo(x + (x2 - x) * t + (tmHash(q, (f.t * 30) | 0) - 0.5) * 8, y + (y2 - y) * t + (tmHash((f.t * 30) | 0, q) - 0.5) * 6); }
        ctx.lineTo(x2, y2); ctx.stroke(); });
      tmGlow(x2, y2, 16, 0.6 * fade, '#ffe14a');
      break;
    }
    case 'tmwind': {
      ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      for (let j = 0; j < 4; j++) { const a = G.t * 16 + j * Math.PI / 2, r = f.r * (0.55 + j * 0.15);
        ctx.strokeStyle = j % 2 ? `rgba(255,225,74,${0.8 * fade})` : `rgba(200,230,255,${0.7 * fade})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(x, y - 6, r, r * 0.5, 0, a, a + 1.6); ctx.stroke(); }
      if (Math.random() < 0.6) part(f.x + (Math.random() - 0.5) * f.r * 2, f.y + (Math.random() - 0.5) * f.r, { vz: 30, life: 0.4, c: '#fff6c0' });
      break;
    }
    case 'tmquake': {
      const r = f.r * (0.3 + 0.7 * Math.min(1, k * 1.6));
      ctx.fillStyle = `rgba(40,30,20,${0.3 * fade})`; ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r, f.ang - 0.6, f.ang + 0.6); ctx.closePath(); ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      for (let j = 0; j < 3; j++) { const rr = r * (0.6 + j * 0.2); ctx.strokeStyle = `rgba(255,140,90,${(0.8 - j * 0.2) * fade})`; ctx.lineWidth = 3 - j; ctx.beginPath(); ctx.arc(x, y, rr, f.ang - 0.6, f.ang + 0.6); ctx.stroke(); }
      ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#6a5a48';
      for (let j = 0; j < 8; j++) { const a = f.ang + (tmHash(j, 4) - 0.5) * 1.2, d = r * tmHash(4, j), hh = Math.sin(k * Math.PI) * 10 * tmHash(j, j); ctx.fillRect(Math.round(x + Math.cos(a) * d), Math.round(y + Math.sin(a) * d * 0.6 - hh), 2, 2); }
      break;
    }
    case 'tmslam': {
      const r = f.r * (0.4 + 0.6 * Math.min(1, k * 2));
      ctx.fillStyle = `rgba(30,24,18,${0.4 * fade})`; ctx.beginPath(); ctx.ellipse(x, y, f.r * 0.7, f.r * 0.38, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = `rgba(20,14,10,${0.8 * fade})`; ctx.lineWidth = 1.5;
      for (let j = 0; j < 9; j++) { const a = j / 9 * Math.PI * 2, l = f.r * (0.6 + tmHash(j, 2) * 0.5); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a + 0.2) * l * 0.5, y + Math.sin(a + 0.2) * l * 0.28); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l * 0.55); ctx.stroke(); }
      ctx.fillStyle = `rgba(200,190,170,${0.45 * fade})`;
      for (let j = 0; j < 14; j++) { const a = j / 14 * Math.PI * 2; ctx.beginPath(); ctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.55 - 3, 4 + tmHash(j, 1) * 3, 0, 7); ctx.fill(); }
      ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,140,90,${fade})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.55, 0, 0, 7); ctx.stroke();
      break;
    }
    case 'tmrockspikes': { // stone pillars bursting from the ground
      const grow = Math.sin(Math.min(1, k * 2.4) * Math.PI * 0.5) * (k > 0.7 ? (1 - k) / 0.3 : 1), n = 7;
      ctx.fillStyle = `rgba(40,28,20,${0.35 * fade})`; ctx.beginPath(); ctx.ellipse(x, y, f.r, f.r * 0.5, 0, 0, 7); ctx.fill();
      for (let j = 0; j < n; j++) { const a = j / n * Math.PI * 2 + (f.seed || 0), rr = f.r * (0.45 + tmHash(j, f.seed || 0) * 0.45), px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr * 0.5, h = (8 + tmHash(f.seed || 0, j) * 10) * grow;
        tmCrystal(px, py, h, 3.4, (tmHash(j, 8) - 0.5) * 4, ['#4a3828', '#8a705a', '#c8b098']); }
      break;
    }
    case 'tmboulder': { // falling boulder with a burning trail
      const sc = f.s || 1, hgt = 110 * (1 - k), mx = x - hgt * 0.3, my = y - hgt, r = 6 * sc;
      ctx.fillStyle = `rgba(0,0,0,${0.3 * k})`; ctx.beginPath(); ctx.ellipse(x, y, r * k + 2, r * 0.5 * k + 1, 0, 0, 7); ctx.fill();
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let j = 6; j >= 1; j--) { ctx.globalAlpha = 0.6 - j * 0.08; ctx.fillStyle = j > 3 ? '#ff5a3a' : '#ffb54a'; ctx.beginPath(); ctx.arc(mx - j * 1.6 * sc, my - j * 3.2 * sc, (r - j * 0.6) * 0.8, 0, 7); ctx.fill(); }
      ctx.restore();
      ctx.save(); ctx.translate(mx, my); ctx.rotate(G.t * 6); ctx.fillStyle = '#5a4434'; ctx.beginPath();
      for (let q = 0; q < 8; q++) { const a = q / 8 * Math.PI * 2, rr = r * (0.8 + tmHash(q, 2) * 0.3); q ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
      ctx.closePath(); ctx.fill(); ctx.fillStyle = '#8a705a'; ctx.fillRect(-r * 0.5, -r * 0.6, r * 0.7, r * 0.45); ctx.restore();
      break;
    }
    case 'tmroar': {
      ctx.globalCompositeOperation = 'lighter';
      for (let j = 0; j < 3; j++) { const kk = clamp(k * 1.3 - j * 0.15, 0, 1), r = f.r * kk; if (kk <= 0) continue;
        ctx.strokeStyle = `rgba(${j === 1 ? '255,207,90' : '255,110,70'},${(1 - kk) * 0.9})`; ctx.lineWidth = 3 - j * 0.6; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.6, 0, 0, 7); ctx.stroke(); }
      break;
    }
  }
  ctx.restore();
});
// Form aura while transformed (drawn over the world, never baked into the sprite).
hookAfter('drawEnt', (_, e, cx, cy) => {
  const P = G.P;
  if (e !== P || !tmActive(P) || P.dead) return;
  const st = tmStage(P), F = tmForm(P), x = P.x - cx, y = P.y - cy - 12, form = tmFormId(P);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  tmGlow(x, y, 16 + st * 3 + Math.sin(G.t * 9) * 1.5, (form === 'coloso' ? 0.08 : 0.16) + st * 0.03, F.col);
  if (form === 'cefiro' && P._tmMove) {
    const [dx, dy] = DIRV[P.dir] || [0, 1];
    for (let j = 0; j < 4; j++) { const o = (j - 1.5) * 5, l = 10 + tmHash(j, (G.t * 20) | 0) * 10;
      ctx.strokeStyle = j % 2 ? 'rgba(255,225,74,0.55)' : 'rgba(220,235,255,0.5)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x - dx * 6 - dy * o, y + 4 - dy * 6 + dx * o * 0.6); ctx.lineTo(x - dx * (6 + l) - dy * o, y + 4 - dy * (6 + l) + dx * o * 0.6); ctx.stroke(); }
  }
  ctx.restore();
});
hookAfter('updatePlayer', dt => {
  const P = G.P;
  if (!tmActive(P) || P.dead || !dt) return;
  const form = tmFormId(P), rate = { ascua: 5, prisma: 1.5, cefiro: 3, coloso: 0.8 }[form] + tmStage(P) * (form === 'ascua' ? 3 : 1);
  P._tmMove = Math.abs(P.x - (P._tmLX ?? P.x)) + Math.abs(P.y - (P._tmLY ?? P.y)) > 0.2; P._tmLX = P.x; P._tmLY = P.y;
  P._tmEmb = (P._tmEmb || 0) + dt * rate;
  const F = TM_FORMS[form], cols = form === 'ascua' ? TM_FIREC.slice(1) : [F.gem[0], F.col, F.gem[1]];
  while (P._tmEmb >= 1) { P._tmEmb--; part(P.x + (Math.random() - 0.5) * 12, P.y - 4 - Math.random() * 6, { z: 6 + Math.random() * 12, vx: (Math.random() - 0.5) * 10, vz: form === 'coloso' ? 6 : 18 + Math.random() * 16, life: 0.55 + Math.random() * 0.4, c: cols[Math.random() * 3 | 0], s: Math.random() < 0.25 ? 2 : 1 }); }
});

// ---------- HUD: bracelet button, form selector and technique buttons ----------
function tmBtnAct(button, fn) {
  // pointerdown like the game's action buttons: a HUD redraw between finger down and up can never swallow the tap.
  let last = 0;
  button.addEventListener('pointerdown', ev => { ev.preventDefault(); ev.stopPropagation(); last = performance.now(); fn(); });
  button.addEventListener('click', ev => { ev.stopPropagation(); if (performance.now() - last > 600) fn(); });
}
const tmSetText = (el, text) => { if (el.textContent !== text) el.textContent = text; };
function tmGemHTML(k, size = 14) { const F = TM_FORMS[k]; return `<i style="display:inline-block;width:${size}px;height:${size}px;transform:rotate(45deg);background:linear-gradient(135deg,${F.gem[1]},${F.gem[0]});border:2px solid #2a2a2a;box-shadow:0 0 6px ${F.col};margin:0 8px 0 4px;vertical-align:middle"></i>`; }
function tmPickOpen(open) {
  const pick = document.getElementById('tmPick'); if (!pick) return;
  pick.style.display = open ? 'flex' : 'none';
  if (!open) return;
  const P = G.P, cur = tmFormId(P);
  pick.innerHTML = `<b style="width:100%;text-align:center;font-size:.8em;color:#f1e7d3">⌚ ${L2('Brazalete de núcleos · elige forma', 'Core Bracelet · choose a form')}</b>` +
    TM_FORM_IDS.map(k => `<button class="chip${tmActive(P) && k === cur ? ' gold' : ''}" data-tmf="${k}" style="min-width:8.5em;text-align:left">${tmGemHTML(k)}<span><b>${tmFormName(k)}</b><br><small>${L2(TM_FORMS[k].role[0], TM_FORMS[k].role[1])}</small></span></button>`).join('');
  pick.querySelectorAll('[data-tmf]').forEach(b => tmBtnAct(b, () => { tmPickOpen(false); const P = G.P; if (tmActive(P) && tmFormId(P) === b.dataset.tmf) return; tmToggle(P, b.dataset.tmf); }));
}
function tmBuildTechs(controls, form) {
  [...controls.querySelectorAll('[data-tmt]')].forEach(b => b.remove());
  TM_FORMS[form].techs.forEach((t, i) => {
    const button = document.createElement('button');
    button.className = 'chip'; button.dataset.tmt = i;
    const name = L2(t.n[0], t.n[1]); button.setAttribute('aria-label', name); button.title = name;
    if (t.img !== undefined && typeof TM_ICONS !== 'undefined') { const icon = new Image(30, 30); icon.src = TM_ICONS[t.img]; icon.alt = ''; icon.style.cssText = 'vertical-align:middle;image-rendering:pixelated'; button.append(icon); }
    else { const s = document.createElement('b'); s.textContent = t.icon; s.style.cssText = 'font-size:22px;line-height:30px;display:inline-block;width:30px;text-align:center;vertical-align:middle'; button.append(s); }
    button.append(document.createElement('span'));
    tmBtnAct(button, () => { if (tmActive(G.P)) tmAttack(G.P, i); });
    controls.append(button);
  });
  controls.dataset.form = form;
}
hookAfter('updateHUD', () => {
  const P = G.P;
  let controls = document.getElementById('tmControls');
  if (P?.cls !== 'transmutador') { controls?.remove(); document.getElementById('tmPick')?.remove(); return; }
  if (!controls) {
    controls = document.createElement('div');
    controls.id = 'tmControls';
    controls.style.cssText = 'position:fixed;z-index:7;left:50%;bottom:15%;transform:translateX(-50%);display:flex;flex-wrap:wrap;justify-content:center;gap:4px;width:max-content;max-width:75vw';
    const toggle = document.createElement('button'); toggle.className = 'chip'; toggle.dataset.tmMain = 1;
    tmBtnAct(toggle, () => { if (tmActive(G.P)) { tmPickOpen(false); tmToggle(G.P); } else { const pk = document.getElementById('tmPick'); tmPickOpen(pk?.style.display === 'none'); } });
    const swap = document.createElement('button'); swap.className = 'chip'; swap.dataset.tmSwap = 1; swap.textContent = '⇄'; swap.title = L2('Cambiar de forma', 'Change form');
    tmBtnAct(swap, () => { const pk = document.getElementById('tmPick'); tmPickOpen(pk?.style.display === 'none'); });
    controls.append(toggle, swap);
    const pick = document.createElement('div'); pick.id = 'tmPick';
    pick.style.cssText = 'position:fixed;z-index:8;left:50%;bottom:calc(15% + 3.4em);transform:translateX(-50%);display:none;flex-wrap:wrap;justify-content:center;gap:4px;max-width:80vw;background:rgba(14,9,7,.88);border:2px solid var(--gold);border-radius:10px;padding:6px';
    document.getElementById('hud').append(controls, pick);
  }
  const form = tmFormId(P), on = tmActive(P);
  if (controls.dataset.form !== form) tmBuildTechs(controls, form);
  const show = P.dead ? 'none' : 'flex';
  if (controls.style.display !== show) controls.style.display = show;
  if (P.dead) tmPickOpen(false);
  const main = controls.querySelector('[data-tm-main]'), swap = controls.querySelector('[data-tm-swap]');
  tmSetText(main, on ? L2('Volver a forma humana', 'Back to human form') : L2('⌚ Transformar', '⌚ Transform'));
  if (swap.hidden === on) swap.hidden = !on;
  TM_FORMS[form].techs.forEach((t, i) => {
    const button = controls.querySelector(`[data-tmt="${i}"]`); if (!button) return;
    const cd = Math.ceil(P.cds['tm_' + form + '_' + i] || 0);
    if (button.hidden === on) button.hidden = !on;
    const dis = cd > 0 || P.mp < tmCost(P, t);
    if (button.disabled !== dis) button.disabled = dis;
    tmSetText(button.lastChild, cd ? ' ' + cd : '');
  });
});

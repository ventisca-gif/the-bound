// Transmutador: human form shares Warrior's weapon progression; the Ascua form fights unarmed.
// 6.66: the fire form is an original design (Forma Ascua) drawn with the game's own engine (drawHero + HD detail)
// on the player's body structure, so the four walking directions use the native poses. Power grows with level.
CLASSES.transmutador = {
  ...CLASSES.guerrero, n: 'Transmutador', color: '#8ed344',
  desc: L2('Usa un dispositivo de muñeca para adoptar la Forma Ascua, un espíritu de fuego que se hace más fuerte con tu nivel.',
    'Use a wrist device to take on the Ember Form, a fire spirit that grows stronger with your level.')
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
  if (P.cls === 'transmutador') P.app.tmOutfit = true;
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
// [name, cooldown, mana share, damage multiplier]
const tmTechniques = [
  ['Cometa ígneo', 2.5, 0.045, 1.65],
  ['Abanico de llamas', 6, 0.075, 0.72],
  ['Puño de magma', 8, 0.09, 2.35],
  ['Corona de fuego', 13, 0.13, 2.6],
  ['Lluvia de brasas', 20, 0.17, 1.15]
];
// Form stages follow the player's level up to the current maximum.
const TM_STAGES = [[1, 'Chispa', 'Spark'], [100, 'Brasa', 'Ember'], [300, 'Llamarada', 'Blaze'], [500, 'Sol Ígneo', 'Fire Sun']];
function tmActive(P) { return P?.cls === 'transmutador' && !!P.tmFire; }
function tmGrowth(P) { return clamp(((P?.lv || 1) - 1) / Math.max(1, MAXLV - 1), 0, 1); }
function tmStage(P) { let s = 0; TM_STAGES.forEach((st, i) => { if ((P?.lv || 1) >= st[0]) s = i; }); return s; }
function tmStageName(P) { const s = TM_STAGES[tmStage(P)]; return L2(s[1], s[2]); }
// Moderate buff: +8% → +24% attack, +5% → +15% defence and up to +10% life while transformed.
function tmBuff(P) { const g = tmGrowth(P); return { atk: 0.08 + 0.16 * g, def: 0.05 + 0.10 * g, hp: 0.10 * g }; }
hookAfter('calcStats', (S, P) => {
  if (!tmActive(P) || !S) return;
  const b = tmBuff(P);
  S.atk = Math.round(S.atk * (1 + b.atk)); S.def = Math.round(S.def * (1 + b.def)); S.maxhp = Math.round(S.maxhp * (1 + b.hp));
  S.power = Math.round(S.atk * 2 + S.def * 1.5 + S.maxhp / 10);
});
// ---------- look: original fire spirit on the player's own body ----------
const TM_LAVA = pal(['#8a3410', '#d0702a', '#eda05a', '#ffd49a']);
const TM_FLAME = pal(['#5e0e06', '#a8200c', '#e04812', '#ff9a2a']);
const TM_OBS = P5(['#0d0a0c', '#1d1619', '#2f2428', '#463539', '#5f4a4c']);
const TM_MAGMA = P5(['#6a1404', '#b8320a', '#f06a12', '#ffb43a', '#fff0a0']);
const TM_MANTLE = P5(['#8a1806', '#d2400c', '#f87a1a', '#ffb83a', '#fff0a0']);
function tmLook(P) {
  const app = normApp(P.app), stage = tmStage(P);
  const L = { ...heroLook(P.cls, app, {}, {}) };
  L.skin = TM_LAVA; L.hair = TM_FLAME; L.hair2 = null; L.eyes = 'blanco';
  L.top = { k: 'plate', m: TM_OBS, s: TM_MAGMA, t: 6 + stage * 2 };
  L.bot = { k: 'greaves', m: TM_OBS, s: TM_MAGMA };
  L.feet = { k: 'sabatons', m: TM_OBS };
  L.head = null; L.mask = null; L.scarf = null;
  L.back = stage >= 1 ? { k: 'cape', o: TM_MANTLE, i: TM_MAGMA, tr: TM_FLAME } : null;
  L.weapon = { k: 'none', tier: 1 };
  L.tmDevice = false; L.tmIgn = stage + 1; L.mirror = false;
  return L;
}
// Hash for deterministic flicker per column/frame.
const tmHash = (a, b) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
hookAround('drawHero', (next, p, L, ...a) => {
  const r = next(p, L, ...a);
  if (!L.tmIgn || !p.meta) return r;
  const A = p.meta, stage = L.tmIgn - 1, fr = (HERO_ANIMS.indexOf(A.anim) + 1) * 7 + (A.f || 0);
  const tg = p.tg; p.tg = 3;
  const cols = [C('#d2400c'), C('#f06a12'), C('#ffb83a'), C('#fff2a6')];
  const opaque = (x, y) => x >= 0 && y >= 0 && x < p.w && y < p.h && (p.d[y * p.w + x] >>> 24) > 0;
  // Living flames rise from the top of the hair (follows any hairstyle and body structure).
  for (let x = Math.round(A.hx) - 6; x <= Math.round(A.hx) + 6; x++) {
    let y0 = -1; for (let y = 0; y < Math.min(p.h, A.torsoTop); y++) if (opaque(x, y)) { y0 = y; break; }
    if (y0 < 1) continue;
    const edge = Math.abs(x - A.hx) / 6, n = tmHash(x * 3 + 1, fr);
    const h = Math.max(0, Math.round((2 + stage * 0.8) * (1 - edge * 0.65) + n * 2.4 - 0.6));
    for (let k = 1; k <= h && y0 - k >= 0; k++) {
      const t = k / (h + 0.5);
      p.set(x, y0 - k, cols[t < 0.35 ? 1 : t < 0.75 ? 2 : 3]);
    }
  }
  // Ember sparks above the head on the higher stages.
  if (stage >= 2) for (let i = 0; i < stage; i++) {
    const sx = Math.round(A.hx - 7 + tmHash(i, fr) * 14), sy = Math.round(A.hy - 9 - tmHash(fr, i + 5) * 6);
    if (sy > 0 && !opaque(sx, sy)) p.set(sx, sy, cols[3]);
  }
  p.tg = tg;
  return r;
});
function tmAtlas(P = G.P) {
  const app = normApp(P.app), stage = tmStage(P);
  return getAtlas('tm:ascua:' + heroKey(P.cls, app, {}, {}, 0) + ':' + stage, () => buildHeroAtlas(tmLook(P)));
}
hookAround('playerAtlas', (next, P) => tmActive(P) ? tmAtlas(P) : next(P));
function tmToggle(P) {
  if (!P || P.cls !== 'transmutador' || P.dead) return;
  // Going back to human form is never blocked.
  if (!P.tmFire && (P.job || P.fishing || P.busy > 0 || P.dawnHelm)) return;
  P.tmFire = !P.tmFire;
  const hp = P.hp / Math.max(1, P.S.maxhp);
  calcStats(P); if (P.tmFire) P.hp = Math.min(P.S.maxhp, Math.round(P.S.maxhp * hp));
  refreshLook(); markDirty?.();
  if (P.tmFire) {
    addFx({ type: 'tmpillar', x: P.x, y: P.y, dur: 0.6, light: 70 });
    burst(P.x, P.y - 10, 26, { sp: 80, up: 60, g: -20, life: 0.6, c: ['#ff571c', '#ffb52e', '#fff2a6'] });
    toast(L2('Forma Ascua · ' + tmStageName(P), 'Ember Form · ' + tmStageName(P)));
  } else burst(P.x, P.y - 10, 14, { sp: 50, up: 25, life: 0.4, c: ['#5a5a5a', '#a0a0a0', '#ff8a2a'] });
  sfx('fire'); uiDirty.hud = true;
}
function tmAttack(P, i) {
  if (P.dead || P.job || P.fishing || P.busy > 0 || P.dawnHelm) return;
  const technique = tmTechniques[i], key = 'tm_fire_' + i;
  if (technique) {
    const cost = Math.ceil(P.S.maxmp * technique[2]);
    if (P.cds[key] > 0 || P.mp < cost) return;
    P.cds[key] = technique[1];
    P.mp -= cost;
  } else {
    if (P.atkCd > 0) return;
    P.atkCd = P.S.aspd;
  }
  const stage = tmStage(P), grow = 1 + stage * 0.12;
  const target = nearestMob(P.x, P.y, i < 0 || i === 2 ? 48 : 160);
  if (target) P.dir = dirFromVec(target.x - P.x, target.y - P.y);
  const [dx, dy] = DIRV[P.dir], angle = Math.atan2(dy, dx);
  // S.atk already carries the form buff (calcStats), so every technique and the punch grow with the level.
  const damage = (P.S.atk * 0.9 + P.lv * 0.65) * (technique ? technique[3] * (1 + P.S.skillP / 100) : 0.88);
  const map = G.map;
  setAnim(P, i >= 3 ? 'cast' : 'atk');
  P.loopAnim = false;
  P.busy = 0.3;
  P.combatT = G.t;
  const fire = { fire: 1, burn: technique ? 1 : 0 };
  const impact = (x, y, radius, big) => {
    hitCircle(x, y, radius, damage, fire);
    addFx({ type: 'tmblast', x, y, r: radius, dur: big ? 0.55 : 0.4, light: radius * 2 });
    burst(x, y - 6, big ? 18 : 11, { sp: 90, up: 40, g: 60, life: 0.5, c: ['#ff4e15', '#ffb62a', '#fff4a0'] });
  };
  const later = (seconds, action) => delayAct(seconds, () => {
    if (G.P === P && G.map === map && !P.dead && tmActive(P)) action();
  });
  if (i === 0 || i === 1) {
    const offsets = i === 0 ? [0] : stage >= 2 ? [-0.42, -0.21, 0, 0.21, 0.42] : [-0.31, 0, 0.31];
    if (i === 1) addFx({ type: 'tmcone', x: P.x, y: P.y - 8, ang: angle, r: 46 * grow, dur: 0.3 });
    later(0.08, () => {
      for (const offset of offsets) spawnProj('p', P.x + dx * 6, P.y - 6, angle + offset,
        { ...fire, spd: i === 0 ? 230 : 200, dmg: i === 1 && offsets.length > 3 ? damage * 0.7 : damage, art: 'tmfire', tmS: i === 0 ? 1 + stage * 0.15 : 0.7, ex: i === 0 ? Math.round(19 * grow) : 0, life: 0.8, glow: 18, glowC: 'rgb(255,140,40)' });
    });
  } else if (i === 4) {
    const x = target?.x ?? P.x + dx * 62, y = target?.y ?? P.y + dy * 62;
    const drops = [[-19, 6], [16, 10], [0, -13], [-6, 18], [22, -8]].slice(0, 3 + Math.min(2, stage));
    drops.forEach(([ox, oy], j) => {
      later(0.1 + j * 0.12, () => addFx({ type: 'tmmeteor', x: x + ox, y: y + oy, dur: 0.32, s: grow }));
      later(0.42 + j * 0.12, () => impact(x + ox, y + oy, Math.round(23 * grow), true));
    });
  } else if (i === 3) later(0.12, () => {
    hitCircle(P.x, P.y, 55 * grow, damage, fire);
    addFx({ type: 'tmcrown', x: P.x, y: P.y, r: 55 * grow, dur: 0.7, light: 120 });
    burst(P.x, P.y - 6, 24, { sp: 120, up: 30, life: 0.5, c: ['#ff4e15', '#ffb62a', '#fff4a0'] });
  });
  else if (i === 2) later(0.1, () => {
    const x = P.x + dx * 25, y = P.y + dy * 22;
    addFx({ type: 'tmfist', x, y, ang: angle, r: 26 * grow, dur: 0.5, light: 80 });
    impact(x, y, Math.round(22 * grow), true);
  });
  else later(0.06, () => {
    hitArc(P.x, P.y, angle, 29, 1.7, damage, fire);
    addFx({ type: 'tmswipe', x: P.x, y: P.y - 9, ang: angle, r: 22, dur: 0.22, flip: (P._tmSw = !P._tmSw) });
  });
  sfx('fire');
}
hookBefore('basicAttack', () => { if (tmActive(G.P)) { tmAttack(G.P, -1); return HOOK_SKIP; } });
hookBefore('useSkill', slot => { if (tmActive(G.P)) { if (tmTechniques[slot]) tmAttack(G.P, slot); return HOOK_SKIP; } });
hookAfter('playerDie', () => {
  if (tmActive(G.P)) { G.P.tmFire = false; calcStats(G.P); refreshLook(); }
});
// ---------- VFX (separate layer from the sprite) ----------
const TM_FIREC = ['#ff3d10', '#ff7a1a', '#ffb52e', '#fff2a6'];
function tmGlow(x, y, r, a) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(255,214,120,${a})`); g.addColorStop(0.45, `rgba(255,110,30,${a * 0.55})`); g.addColorStop(1, 'rgba(255,60,10,0)');
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
function tmTongue(x, y, h, w, col) {
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - w, y); ctx.quadraticCurveTo(x - w * 0.6, y - h * 0.55, x, y - h); ctx.quadraticCurveTo(x + w * 0.6, y - h * 0.55, x + w, y); ctx.closePath(); ctx.fill();
}
hookAround('drawProj', (next, e, cx, cy) => {
  if (e.art !== 'tmfire') return next(e, cx, cy);
  const x = Math.round(e.x - cx), y = Math.round(e.y - cy - e.z), c = Math.cos(e.ang), s = Math.sin(e.ang), sc = e.tmS || 1;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  tmGlow(x, y, 14 * sc, 0.55);
  // Comet tail: overlapping flames that shrink and cool along the trail.
  for (let k = 6; k >= 0; k--) {
    const tx = x - c * k * 2.6 * sc + Math.sin(G.t * 40 + k) * 0.8, ty = y - s * k * 2.6 * sc + Math.cos(G.t * 37 + k) * 0.8, rr = (4.6 - k * 0.55) * sc;
    ctx.fillStyle = TM_FIREC[k > 4 ? 0 : k > 2 ? 1 : 2]; ctx.globalAlpha = 1 - k * 0.11;
    ctx.beginPath(); ctx.arc(tx, ty, Math.max(0.8, rr), 0, 7); ctx.fill();
  }
  ctx.globalAlpha = 1; ctx.restore();
  ctx.fillStyle = '#fff6c8'; ctx.beginPath(); ctx.arc(x + c * sc, y + s * sc, 2.2 * sc, 0, 7); ctx.fill();
  if (Math.random() < 0.7) part(e.x - c * 6, e.y - s * 6, { z: e.z, vx: -c * 20 + (Math.random() - 0.5) * 20, vy: -s * 20 + (Math.random() - 0.5) * 14, vz: 14, life: 0.4, c: TM_FIREC[1 + (Math.random() * 3 | 0)], s: Math.random() < 0.3 ? 2 : 1 });
});
hookAfter('explode', (_, e) => {
  if (e?.art === 'tmfire') addFx({ type: 'tmblast', x: e.x, y: e.y, r: e.ex || 18, dur: 0.45 });
});
hookAround('drawFx', (next, f, cx, cy) => {
  if (!f.type || f.type.slice(0, 2) !== 'tm') return next(f, cx, cy);
  const x = f.x - cx, y = f.y - cy, k = clamp(f.t / f.dur, 0, 1), fade = 1 - k;
  ctx.save();
  switch (f.type) {
    case 'tmswipe': { // crescent flame slash for the basic punch
      ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      const sweep = 1.8, a0 = f.ang - sweep / 2, prog = Math.min(1, k * 2.4), dir = f.flip ? -1 : 1;
      const s = dir > 0 ? a0 : a0 + sweep, e = s + dir * sweep * prog;
      [[5, TM_FIREC[0], 0.55], [3, TM_FIREC[2], 0.8], [1.4, TM_FIREC[3], 1]].forEach(([w, col, a]) => {
        ctx.strokeStyle = col; ctx.globalAlpha = a * fade; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(x, y, f.r, Math.min(s, e), Math.max(s, e)); ctx.stroke();
      });
      tmGlow(x + Math.cos(f.ang) * f.r, y + Math.sin(f.ang) * f.r * 0.8, 10, 0.5 * fade);
      break;
    }
    case 'tmcone': { // fan of flame in front of the player
      ctx.globalCompositeOperation = 'lighter';
      const r = f.r * (0.4 + 0.6 * Math.min(1, k * 2));
      const g = ctx.createRadialGradient(x, y, 2, x, y, r);
      g.addColorStop(0, `rgba(255,240,170,${0.8 * fade})`); g.addColorStop(0.5, `rgba(255,130,30,${0.55 * fade})`); g.addColorStop(1, 'rgba(255,50,10,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r, f.ang - 0.6, f.ang + 0.6); ctx.closePath(); ctx.fill();
      break;
    }
    case 'tmfist': { // magma fist: shock crescent, ground cracks and flame pillars
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
    case 'tmcrown': { // expanding ring of flame tongues around the player
      const r = f.r * (0.25 + 0.75 * Math.min(1, k * 1.5));
      ctx.fillStyle = `rgba(40,10,5,${0.25 * fade})`; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.55, 0, 0, 7); ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = `rgba(255,120,30,${0.7 * fade})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.55, 0, 0, 7); ctx.stroke();
      const n = 22;
      for (let j = 0; j < n; j++) { const a = j / n * Math.PI * 2 + k * 0.6, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r * 0.55;
        const h = (7 + tmHash(j, (f.t * 20) | 0) * 7) * fade; tmTongue(px, py, h, 2.6, TM_FIREC[1]); tmTongue(px, py, h * 0.55, 1.3, TM_FIREC[3]); }
      tmGlow(x, y - 6, r * 0.8, 0.35 * fade);
      break;
    }
    case 'tmmeteor': { // falling meteor with a long burning trail
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
    case 'tmblast': { // impact: flash, scorch and rising tongues
      const r = f.r * (0.45 + 0.75 * k);
      ctx.fillStyle = `rgba(35,12,6,${0.35 * fade})`; ctx.beginPath(); ctx.ellipse(x, y, f.r * 0.9, f.r * 0.5, 0, 0, 7); ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      tmGlow(x, y - 5, r * 1.1, 0.9 * fade);
      ctx.strokeStyle = `rgba(255,200,90,${fade})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.55, 0, 0, 7); ctx.stroke();
      for (let j = 0; j < 7; j++) { const a = j / 7 * Math.PI * 2, px = x + Math.cos(a) * r * 0.5, py = y + Math.sin(a) * r * 0.28; const h = (6 + tmHash(j, f.x | 0) * 9) * Math.sin(Math.min(1, k * 1.4) * Math.PI); tmTongue(px, py, h, 2.4, TM_FIREC[1]); }
      break;
    }
    case 'tmpillar': { // transformation pillar
      ctx.globalCompositeOperation = 'lighter';
      const w = 14 * fade + 2, g = ctx.createLinearGradient(x, y - 70, x, y);
      g.addColorStop(0, 'rgba(255,90,20,0)'); g.addColorStop(0.6, `rgba(255,150,40,${0.6 * fade})`); g.addColorStop(1, `rgba(255,240,170,${0.9 * fade})`);
      ctx.fillStyle = g; ctx.fillRect(x - w / 2, y - 70, w, 70);
      for (let j = 0; j < 9; j++) tmTongue(x + (j - 4) * 3, y, (10 + tmHash(j, (f.t * 24) | 0) * 18) * fade, 2.4, TM_FIREC[j % 2 ? 1 : 2]);
      break;
    }
  }
  ctx.restore();
});
// Aura glow and rising embers while transformed (drawn over the world, never baked into the sprite).
hookAfter('drawEnt', (_, e, cx, cy) => {
  const P = G.P;
  if (e !== P || !tmActive(P) || P.dead) return;
  const st = tmStage(P), x = P.x - cx, y = P.y - cy - 12;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  tmGlow(x, y, 16 + st * 3 + Math.sin(G.t * 9) * 1.5, 0.16 + st * 0.03);
  ctx.restore();
});
hookAfter('updatePlayer', dt => {
  const P = G.P;
  if (!tmActive(P) || P.dead || !dt) return;
  P._tmEmb = (P._tmEmb || 0) + dt * (5 + tmStage(P) * 3);
  while (P._tmEmb >= 1) { P._tmEmb--; part(P.x + (Math.random() - 0.5) * 12, P.y - 4 - Math.random() * 6, { z: 6 + Math.random() * 12, vx: (Math.random() - 0.5) * 10, vz: 18 + Math.random() * 16, life: 0.55 + Math.random() * 0.4, c: TM_FIREC[1 + (Math.random() * 3 | 0)], s: Math.random() < 0.25 ? 2 : 1 }); }
});
// ---------- HUD controls ----------
function tmBtnAct(button, fn) {
  // pointerdown like the game's action buttons: a HUD redraw between finger down and up can never swallow the tap.
  let last = 0;
  button.addEventListener('pointerdown', ev => { ev.preventDefault(); ev.stopPropagation(); last = performance.now(); fn(); });
  button.addEventListener('click', ev => { ev.stopPropagation(); if (performance.now() - last > 600) fn(); });
}
const tmSetText = (el, text) => { if (el.textContent !== text) el.textContent = text; };
hookAfter('updateHUD', () => {
  const P = G.P;
  let controls = document.getElementById('tmControls');
  if (P?.cls !== 'transmutador') { controls?.remove(); return; }
  if (!controls) {
    controls = document.createElement('div');
    controls.id = 'tmControls';
    controls.style.cssText = 'position:fixed;z-index:7;left:50%;bottom:15%;transform:translateX(-50%);display:flex;flex-wrap:wrap;justify-content:center;gap:4px;width:max-content;max-width:75vw';
    const toggle = document.createElement('button');
    toggle.className = 'chip';
    tmBtnAct(toggle, () => tmToggle(G.P));
    controls.append(toggle);
    tmTechniques.forEach(([name], i) => {
      const button = document.createElement('button');
      button.className = 'chip';
      button.setAttribute('aria-label', name);
      button.title = name;
      const icon = new Image(30, 30);
      icon.src = TM_ICONS[i];
      icon.alt = '';
      icon.style.cssText = 'vertical-align:middle;image-rendering:pixelated';
      button.append(icon, document.createElement('span'));
      tmBtnAct(button, () => { if (tmActive(G.P)) tmAttack(G.P, i); });
      controls.append(button);
    });
    document.getElementById('hud').append(controls);
  }
  const show = P.dead ? 'none' : 'flex';
  if (controls.style.display !== show) controls.style.display = show;
  const on = tmActive(P);
  tmSetText(controls.firstChild, on ? L2('Volver a forma humana', 'Back to human form') : L2('🔥 Forma Ascua · ' + tmStageName(P), '🔥 Ember Form · ' + tmStageName(P)));
  tmTechniques.forEach(([name], i) => {
    const button = controls.children[i + 1], cd = Math.ceil(P.cds['tm_fire_' + i] || 0);
    if (button.hidden === on) button.hidden = !on;
    const dis = cd > 0 || P.mp < Math.ceil(P.S.maxmp * tmTechniques[i][2]);
    if (button.disabled !== dis) button.disabled = dis;
    tmSetText(button.lastChild, cd ? ' ' + cd : '');
  });
});

// ================= v5.66: BARRA MÁS LIMPIA, BRAZOS VISIBLES AL BAILAR, 5 AURAS NUEVAS =================
// Sergio (5.66): «quita la casilla + y la del libro, hay muchos botones»; «los bailes no mueven los brazos con la ropa»;
// «5 auras nuevas, distintas a las que hay, con mejor pixel art, compradas con oro en el armario».

// ---------- barra de abajo: fuera ＋ (casilla libre) y 📖 (misiones). Siguen en el código por si se quieren volver a poner ----------
const HB_HIDE = ['hbFree', 'hbBook', 'ihbf'];
{ const st = document.createElement('style'); st.textContent = HB_HIDE.map(id => '#' + id).join(',') + '{display:none!important}body.hb8 #hotbar{transform:translateX(-50%)}@media (orientation:landscape){body.hb8 #hotbar{transform:translateX(calc(-50% - 2.4em))}}'; document.head.appendChild(st); }

// ---------- bailes: los brazos se repintan al final, encima de la ropa, con contorno oscuro ----------
// 35_art_hero guarda en p._dArms los píxeles de cada brazo delantero (solo con ps.danceJoints). Aquí, después de TODAS
// las capas (ropa, cosméticos, mangas, busto, desgarros…), se vuelven a pintar para que el movimiento se vea con cualquier prenda.
{ const _dh = drawHero; drawHero = function (p) { if (p) p._dArms = null; const r = _dh.apply(this, arguments);
  try { const arms = p && p._dArms; if (arms && arms.length) { const tg = p.tg, top = p.meta && p.meta.torsoTop != null ? p.meta.torsoTop - 1 : -99; if (p.t) p.tg = 3;
      const own = new Set(); for (const rec of arms) for (const [x, y] of rec) own.add(x + ',' + y);
      for (const rec of arms) for (const [x, y] of rec) for (const [ox, oy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = x + ox, Y = y + oy; if (own.has(X + ',' + Y) || Y < top || !p.get(X, Y)) continue; p.set(X, Y, OUTL); }
      // con ropa muy oscura (negra) el brazo se aclara un poco para que se distinga del torso del mismo color
      const lift = c => { const r = uR(c), g = uG(c), b = uB(c), l = r * .3 + g * .59 + b * .11; return l < 70 ? rgbU(Math.min(255, r + 48), Math.min(255, g + 44), Math.min(255, b + 52), uA(c)) : c; };
      for (const rec of arms) for (const [x, y, c] of rec) p.set(x, y, lift(c));
      p.tg = tg; } } catch (e) { } if (p) p._dArms = null; return r; }; }

// ---------- 5 auras nuevas (mismo sistema: cosAuraOwn/cosAura, oro, Armario › Auras) ----------
Object.assign(COS_AURAS, {
  escarcha: { n: L2('Escarcha cristalina', 'Crystal frost'), d: L2('Cristales de hielo que crecen del suelo y copos que giran.', 'Ice crystals growing from the ground and swirling snowflakes.'), pr: 45000 },
  carmesi: { n: L2('Pacto carmesí', 'Crimson pact'), d: L2('Dos cintas rojas en espiral alrededor del cuerpo y gotas de luz.', 'Two red ribbons spiralling around the body and drops of light.'), pr: 70000 },
  humo: { n: L2('Humo de sombra', 'Shadow smoke'), d: L2('Humo negro que sube desde los pies con brasas moradas.', 'Black smoke rising from your feet with purple embers.'), pr: 55000 },
  prisma: { n: L2('Prisma arcoíris', 'Rainbow prism'), d: L2('Arcos de siete colores que suben como la montaña de Vinicunca.', 'Seven-colour arcs rising like the Vinicunca mountain.'), pr: 90000 },
  fatuo: { n: L2('Fuegos fatuos', 'Will-o\'-wisps'), d: L2('Llamitas espectrales que giran a tu alrededor dejando estela.', 'Ghostly flames circling you and leaving a trail.'), pr: 65000 }
});
Object.assign(COS_AURA_FX.themes, { escarcha: { color: '#bfefff' }, carmesi: { color: '#ff4a5a' }, humo: { color: '#9a6aff' }, prisma: { color: '#ffd84a' }, fatuo: { color: '#7affd8' } });
const AURA2 = {
  // pixel art a media resolución (como las demás): g está escalado ×0,5 y luego se amplía ×2
  escarcha(g, M, t) { const cx = M.cx, base = M.maxY + 3, w = Math.max(30, M.bodyW * .6 + 10);
    // hexágono de escarcha en el suelo
    const hx = []; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + t * .2; hx.push([cx + Math.cos(a) * w * .85, base + Math.sin(a) * 5]); } A2line(g, hx.concat([hx[0]]), 'rgba(160,230,255,.75)', 2);
    // cristales que crecen y se encogen alrededor de la silueta
    for (let i = 0; i < 8; i++) { const side = i % 2 ? 1 : -1, k = i >> 1, ph = (t * .5 + i * .37) % 1, hgt = 10 + 14 * Math.sin(ph * Math.PI), xx = cx + side * (w * .55 + k * 6), yy = base - k * 3;
      A2poly(g, [[xx - 3, yy], [xx, yy - hgt], [xx + 3, yy]], i % 3 ? '#8fdcff' : '#d8f6ff'); A2line(g, [[xx, yy - 1], [xx, yy - hgt + 2]], '#ffffff', 1); }
    // copos girando a la altura del cuerpo (usa las filas de la silueta)
    for (let i = 0; i < 7; i++) { const a = t * .8 + i / 7 * Math.PI * 2, yy = M.minY + 10 + (i * 13) % Math.max(20, M.bodyH - 10), row = M.rows[Math.max(0, Math.min(95, Math.round(yy - 32)))] || [40, 56], half = Math.max(8, (row[1] - row[0]) / 2 + 9), xx = cx + Math.cos(a) * half;
      if (Math.sin(a) < -.2) continue; A2flake(g, xx, yy); } },
  carmesi(g, M, t) { const cx = M.cx, base = M.maxY + 2, top = M.minY - 8, h = base - top, half0 = Math.max(12, M.bodyW * .5 + 9);
    for (const ph of [0, Math.PI]) { const pts = []; for (let k = 0; k <= 48; k++) { const p = k / 48, y = base - p * h, half = half0 * (0.75 + 0.35 * Math.sin(p * Math.PI)), a = p * Math.PI * 3 + t * 2.2 + ph; pts.push([cx + Math.cos(a) * half, y, Math.sin(a) > 0]); }
      for (const front of [false, true]) { let run = []; const flush = () => { if (run.length > 1) { A2line(g, run, front ? '#8a0a1e' : 'rgba(90,0,20,.55)', front ? 5 : 4); if (front) { A2line(g, run, '#e8203a', 3); A2line(g, run.map(([x, y]) => [x, y - 1]), '#ff8a96', 1); } } run = []; };
        for (const [x, y, f] of pts) { if (f === front) run.push([x, y]); else flush(); } flush(); } }
    for (let i = 0; i < 6; i++) { const p = (t * .35 + i * .17) % 1, xx = cx + (i % 2 ? 1 : -1) * (8 + (i * 5) % 16), yy = top + p * (h + 6); g.fillStyle = '#ff3a4a'; g.fillRect(Math.round(xx), Math.round(yy), 2, 4); g.fillStyle = '#ffd0d4'; g.fillRect(Math.round(xx), Math.round(yy), 1, 1); } },
  humo(g, M, t) { const cx = M.cx, base = M.maxY + 3, w = Math.max(30, M.bodyW * .6 + 10);
    g.fillStyle = 'rgba(30,10,50,.6)'; g.beginPath(); g.ellipse(cx, base, w * .95, 7, 0, 0, Math.PI * 2); g.fill();
    for (let i = 0; i < 16; i++) { const p = (t * .22 + i * .0625) % 1, side = i % 2 ? 1 : -1, r = 5 + 6 * (1 - p) + (i % 3), xx = cx + side * (w * (.4 + .25 * Math.sin(i * 1.7 + t))) + Math.sin(p * 6 + i) * 4, yy = base - 2 - p * (M.bodyH + 22), al = (.85 * (1 - p)).toFixed(2);
      g.fillStyle = `rgba(${70 + i % 3 * 14},${40 + i % 2 * 10},${110 + i % 4 * 12},${al})`; g.fillRect(Math.round(xx - r - 1), Math.round(yy - r * .8 - 1), Math.round(r * 2 + 2), Math.round(r * 1.6 + 2));
      g.fillStyle = `rgba(${26 + i % 3 * 8},${14 + i % 2 * 6},${40 + i % 4 * 8},${al})`; g.fillRect(Math.round(xx - r), Math.round(yy - r * .8), Math.round(r * 2), Math.round(r * 1.6)); }
    for (let i = 0; i < 10; i++) { const p = (t * .4 + i * .1) % 1, xx = cx + (i % 2 ? 1 : -1) * (6 + (i * 7) % (w * .8)), yy = base - p * (M.bodyH + 30); g.fillStyle = i % 3 ? '#b06aff' : '#f0c8ff'; g.fillRect(Math.round(xx), Math.round(yy), 2, 2); } },
  prisma(g, M, t) { const cx = M.cx, base = M.maxY + 3, cols = ['#ff3a3a', '#ff8a2a', '#ffd84a', '#5ad85a', '#3ab0ff', '#4a5aff', '#b05aff'], R = Math.max(26, M.bodyW * .55 + 14);
    for (let i = 0; i < 7; i++) { const ph = (t * .3 + i / 7) % 1, r = R * (.55 + ph * .7), a0 = Math.PI * 1.05, a1 = Math.PI * 1.95, pts = []; for (let k = 0; k <= 22; k++) { const a = a0 + (a1 - a0) * k / 22; pts.push([cx + Math.cos(a) * r, base + Math.sin(a) * r * 1.25]); }
      g.globalAlpha = Math.max(0, Math.min(1, (1 - ph) * 1.4)); A2line(g, pts, cols[i], 3); g.globalAlpha = 1; }
    for (let i = 0; i < 9; i++) { const p = (t * .3 + i * .11) % 1, xx = cx + (i % 2 ? 1 : -1) * (8 + (i * 9) % (R * .9)), yy = base - p * (M.bodyH + 26); A2flake(g, xx, yy, cols[i % 7]); } },
  fatuo(g, M, t) { const cx = M.cx, cy = (M.minY + M.maxY) / 2, rx = Math.max(32, M.bodyW * .62 + 16), ry = Math.max(18, M.bodyH * .42);
    g.fillStyle = 'rgba(60,220,180,.18)'; g.beginPath(); g.ellipse(cx, M.maxY + 3, rx * .8, 6, 0, 0, Math.PI * 2); g.fill();
    for (let i = 0; i < 5; i++) { const a = t * 1.2 + i / 5 * Math.PI * 2, front = Math.sin(a) > 0, bob = Math.sin(t * 3 + i) * 4, X = b => cx + Math.cos(b) * rx, Y = b => cy + Math.sin(b) * ry * .55 - bob;
      for (let k = 9; k >= 1; k--) { const b = a - k * .1, s = Math.max(2, 7 - k * .6); g.fillStyle = `rgba(90,255,210,${(.62 - k * .06).toFixed(2)})`; g.fillRect(Math.round(X(b) - s / 2), Math.round(Y(b) - s / 2), Math.round(s), Math.round(s)); }
      const x = X(a), y = Y(a), fl = Math.sin(t * 9 + i * 2) * 2;
      g.fillStyle = front ? 'rgba(90,255,200,.35)' : 'rgba(60,200,160,.2)'; g.fillRect(Math.round(x - 7), Math.round(y - 9), 14, 16);
      A2poly(g, [[x - 6, y + 5], [x - 4, y - 4], [x - 1 + fl, y - 14], [x + 2, y - 6], [x + 6, y + 5]], front ? '#3ae8b0' : 'rgba(50,190,150,.75)');
      A2poly(g, [[x - 3, y + 4], [x, y - 8 + fl], [x + 3, y + 4]], front ? '#c8fff0' : 'rgba(170,255,230,.7)'); g.fillStyle = '#ffffff'; g.fillRect(Math.round(x) - 1, Math.round(y), 2, 2); } }
};
function A2poly(x, pts, col) { x.fillStyle = col; x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath(); x.fill(); }
function A2line(x, pts, col, w = 1) { x.strokeStyle = col; x.lineWidth = w; x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.stroke(); }
function A2flake(x, cx, cy, col) { x.fillStyle = col || '#e8f8ff'; x.fillRect(Math.round(cx) - 2, Math.round(cy), 5, 1); x.fillRect(Math.round(cx), Math.round(cy) - 2, 1, 5); x.fillStyle = '#ffffff'; x.fillRect(Math.round(cx), Math.round(cy), 1, 1); }
{ const _draw = COS_AURA_FX.draw; COS_AURA_FX.draw = function (sprite, key, kind, time, opts = {}) { if (!AURA2[kind]) return _draw.apply(this, arguments);
  const W = COS_AURA_FX.width, H = COS_AURA_FX.height, c = opts.target || mkCanvas(W, H), x = c.getContext('2d'), M = COS_AURA_FX.maskOf(sprite, key);
  x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H); x.imageSmoothingEnabled = false;
  const fx = opts.fx || mkCanvas(W / 2, H / 2), g = fx.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W / 2, H / 2); g.scale(.5, .5); g.imageSmoothingEnabled = false; g.lineJoin = 'miter'; g.lineCap = 'square'; g.globalAlpha = Math.min(1, opts.strength ?? 1);
  try { AURA2[kind](g, M, time); } catch (e) { } g.globalAlpha = 1; x.drawImage(fx, 0, 0, W, H);
  if (!opts.effectOnly) x.drawImage(sprite, COS_AURA_FX.padX, COS_AURA_FX.padY); return c; }; }

if (typeof GSIS !== 'undefined') GSIS.unshift(['auras566', '✦ ' + L2('Auras nuevas y bailes más claros', 'New auras and clearer dances'), () => [
  L2('✦ Armario › Auras: 5 auras nuevas que se compran con oro y se equipan en el mismo sitio: ', '✦ Wardrobe › Auras: 5 new auras bought with gold and equipped in the same place: ') + ['escarcha', 'carmesi', 'humo', 'prisma', 'fatuo'].map(k => COS_AURAS[k].n + ' (' + fmt(COS_AURAS[k].pr) + ')').join(', ') + '.',
  L2('💃 Al bailar, los brazos se dibujan encima de la ropa con contorno: se ve el movimiento con cualquier prenda.', '💃 While dancing, arms are drawn over your clothes with an outline: the movement shows with any outfit.'),
  L2('▦ Barra de abajo: hacha · poción · pico · caña · mochila · tu arma. Las misiones siguen en el aviso de arriba y en la Bitácora.', '▦ Bottom bar: axe · potion · pickaxe · rod · bag · your weapon. Quests are still in the top tracker and the Logbook.')
], () => null]);

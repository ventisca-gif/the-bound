// ================= 6.58 · Arreglos y diario del héroe con dibujo =================

// 1) Nombres de NPC: el del NPC más cercano siempre se dibuja, pero si otro nombre se había dibujado antes en ese
//    fotograma quedaban uno encima del otro. Ahora el sitio del más cercano se reserva al empezar el fotograma, así que
//    los demás que lo pisarían no se dibujan (como ya pasaba entre nombres normales).
hookBefore('drawOverhead', function (e, cx, cy) {
  if (LBL.t === G.t) return; LBL.t = G.t; LBL.r = [];
  try {
    const n = lblNearNpc(); if (!n || !n.atlas || !n.def || n.map !== G.P.map) return;
    if (n.noTag && dist2(n.x, n.y, G.P.x, G.P.y) >= 2500) return;
    const A = n.atlas, top = Math.round(n.y - cy - A.ay + (A.fh - (n.hgt || 34)) - 6), x = Math.round(n.x - cx), s = textSprite(n.def.n, '#ffe8a0');
    LBL.r.push([x - (s.width >> 1), top - 9, s.width]);
  } catch (err) { }
});

// 2) Mago y arquero contra monstruos (Sergio aceptó reforzarlos). Medido con tools/dev/aguante.py: a nivel 500-600, aun
//    con todo, caían en 16-40 s quietos ante un jefe de su nivel mientras guerrero, bardo y pez aguantaban el minuto.
//    «Guardia arcana» (mago) e «Instinto del bosque» (arquero): desde nivel 200 reciben menos daño de monstruos y
//    jefes, hasta un 40 % (mago) o 50 % (arquero, que solo tiene una cura) a nivel 700. No cuenta en PvP (golpes con src.pvp ni duelos), así que PVP_CLS no cambia.
const V658_RES = { mago: 1, arquero: 1.25 };
function v658Guard(P) {
  if (!P || !V658_RES[P.cls]) return 0; const L = P.lv || 1; if (L < 200) return 0;
  return V658_RES[P.cls] * Math.min(0.40, 0.30 * Math.min(1, (L - 200) / 300) + (L > 500 ? 0.10 * Math.min(1, (L - 500) / 200) : 0));
}
hookAround('hurtPlayer', function (next, base, src, ...a) {
  const P = G.P, g = v658Guard(P);
  if (!g || (src && (src.pvp || src.duel)) || (typeof PVP !== 'undefined' && PVP && PVP.duel)) return next(base, src, ...a);
  return next(base * (1 - g), src, ...a);
});

// 3) La protección se ve en Personaje (debajo de las estadísticas).
hookAfter('renderChar', function (r, B) {
  try { const g = v658Guard(G.P); if (!g) return; const st = (B || document).querySelector('.stats'); if (!st || st.querySelector('.v658g')) return;
    const n = G.P.cls === 'mago' ? L2('Guardia arcana', 'Arcane guard') : L2('Instinto del bosque', 'Forest instinct');
    st.insertAdjacentHTML('beforeend', `<div class="st v658g" title="${L2('Menos daño de monstruos y jefes (no cuenta en PvP)', 'Less damage from monsters and bosses (not in PvP)')}"><span>${n}</span><b>−${Math.round(g * 100)}%</b></div>`);
  } catch (e) { }
});

// 4) Diario del héroe con dibujo (idea pendiente de la 5.59): cada página nueva guarda cómo eras en ese momento (clase,
//    cuerpo, pelo, equipo y cosméticos) y el diario lo dibuja con el motor (heroLook / buildHeroAtlas, el mismo atlas
//    del juego, todas las estructuras de cuerpo). Los aspectos se guardan una sola vez en P.heroLooks (máx. 80) y la
//    página solo apunta a su número (lk), así la partida casi no crece. Las páginas de antes de la 6.58 no tienen dibujo.
SAVEKEYS.push('heroLooks');
function v658LookNow() { const P = G.P; return { c: P.cls, a: normApp(P.app), g: gearTiers(P), s: P.cos || {}, h: P.hideHelm ? 1 : 0 }; }
function v658LookKey(L) { return heroKey(L.c, L.a, L.g, L.s, L.h); }
function v658LookIdx() {
  const P = G.P; P.heroLooks = P.heroLooks || []; const L = v658LookNow(), k = v658LookKey(L);
  let i = P.heroLooks.findIndex(q => q && v658LookKey(q) === k); if (i >= 0) return i;
  P.heroLooks.push(JSON.parse(JSON.stringify(L)));
  if (P.heroLooks.length > 80) { P.heroLooks.shift(); for (const pg of P.heroLog || []) if (pg.lk != null) pg.lk = pg.lk > 0 ? pg.lk - 1 : null; }
  return P.heroLooks.length - 1;
}
hookAfter('hlAdd', function () { try { const P = G.P, L_ = P.heroLog; if (L_ && L_.length) L_[L_.length - 1].lk = v658LookIdx(); } catch (e) { errOnce('v658 diario', e); } });
function v658LookAtlas(L) { return getAtlas(v658LookKey(L), () => buildHeroAtlas(heroLook(L.c, L.a, L.g, L.s, { hideHelm: !!L.h }))); }
function v658DrawLook(cvs, L) {
  const A = v658LookAtlas(L); if (!A) return; const x = cvs.getContext('2d'); x.imageSmoothingEnabled = false; x.clearRect(0, 0, cvs.width, cvs.height);
  const hd = typeof HDS !== 'undefined' && HDS > 1 && A.hdL && typeof hdEnsure === 'function' && hdEnsure(A, 0, 0, true), src = hd ? A.hd : A.img, k = hd ? 2 : 1;
  // recorta al contorno del personaje (el cuadro del atlas trae margen para armas y alas)
  const W = A.fw * k, H = A.fh * k, t = document.createElement('canvas'); t.width = W; t.height = H; const g = t.getContext('2d'); g.drawImage(src, 0, 0, W, H, 0, 0, W, H);
  const d = g.getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) if (d[(yy * W + xx) * 4 + 3] > 8) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
  if (x1 < 0) return; const bw = x1 - x0 + 1, bh = y1 - y0 + 1, s = Math.min(cvs.width / bw, cvs.height / bh);
  x.drawImage(t, x0, y0, bw, bh, Math.round((cvs.width - bw * s) / 2), Math.round(cvs.height - bh * s), Math.round(bw * s), Math.round(bh * s));
}
// El diario es un libro desde la 5.60 (hbPageHTML / hbRender, src/…_v561.js): en cada página con dibujo, el héroe
// sale junto al icono de la hazaña. Las páginas de amigos online no traen aspecto (solo texto), así que no cambian.
hookAfter('hbPageHTML', function (html, p) {
  try { if (HB.owner || !p || !p.e || p.e.lk == null || !(G.P.heroLooks || [])[p.e.lk]) return;
    return html.replace('<div class="hbic">', `<div class="hbic v658ic"><canvas class="v658pg" width="44" height="54" data-lk="${p.e.lk | 0}" title="${L2('Así eras ese día', 'This is how you looked that day')}"></canvas>`);
  } catch (e) { }
});
hookAfter('hbRender', function () {
  try { const L = G.P.heroLooks || []; document.querySelectorAll('#dyBook canvas.v658pg').forEach(c => { const lk = L[+c.dataset.lk]; if (lk) v658DrawLook(c, lk); }); } catch (e) { errOnce('v658 diario', e); }
});

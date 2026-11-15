// ================= v4.66: ARREGLO DEL FUEGO PEGADO AL HÉROE =================
// En la 4.65 una runa de fuego, hielo o rayo dejaba el aura del arma encendida todo el rato (aunque estuvieras quieto
// en una tienda). Ahora:
// - La runa solo enciende el aura un instante cuando golpeas a un monstruo.
// - La de una habilidad de elemento dura 1,5 s; la Esencia de imbuir, sus 5 min (tocar otra esencia igual la cancela).
// - Opciones › «Aura de armas imbuidas» apaga todas las auras (la tuya y las de los demás).
// - En la forja hay un botón «Quitar la runa».
// - El aura es más pequeña y va pegada al arma, no encima del cuerpo.
if (SETTINGS.imbue === undefined) SETTINGS.imbue = true;
imbueOf = function (P) {
  if (!P || !P.equip || !P.equip.weapon || SETTINGS.imbue === false) return '';
  if (P.imb && P.imb.until > Date.now() && IMB_CV[P.imb.k]) return P.imb.k;
  if (P._el && P._el.id !== 'imb' && G.t - P._el.t < 1.5 && IMB_CV[P._el.k]) return P._el.k;
  if (P._runeT && G.t - P._runeT < 0.9) { const r = P.equip.weapon.fg && P.equip.weapon.fg.rune; return r === 'fuego' ? 'fire' : r === 'hielo' ? 'ice' : r === 'rayo' ? 'shock' : ''; }
  return '';
};
{ const _hm = hitMob; hitMob = function (m, base, src) { const d = _hm.apply(this, arguments); try { const P = G.P, w = P && P.equip && P.equip.weapon; if (d && w && w.fg && /fuego|hielo|rayo/.test(w.fg.rune || '')) P._runeT = G.t; } catch (e) { } return d; }; }
// más pequeña y en la mano
drawImbue = function (e, cx, cy, k) {
  const c = IMB_CV[k]; if (!c || !c.width || SETTINGS.imbue === false) return; const [w, h] = IMB_SIZE[k], s = 0.55;
  const off = { down: [8, -6], up: [-8, -9], left: [-9, -7], right: [9, -7] }[e.dir] || [8, -6];
  const atk = e.anim === 'atk', a = atk ? dirAng(e.dir) + Math.PI / 2 : 0.35 * (e.dir === 'left' ? -1 : 1);
  const x = Math.round(e.x - cx + off[0] + (atk ? Math.cos(dirAng(e.dir)) * 6 : 0)), y = Math.round(e.y - cy + off[1]);
  ctx.save(); ctx.imageSmoothingEnabled = false; ctx.translate(x, y); ctx.rotate(a);
  ctx.globalAlpha = 0.25; ctx.fillStyle = IMB_COL[k]; ctx.beginPath(); ctx.ellipse(0, -h * s / 2, w * s * 0.8, h * s * 0.55, 0, 0, 7); ctx.fill();
  ctx.globalAlpha = 0.9; if (Math.floor(G.t * 8) % 2 && k === 'fire') ctx.scale(-1, 1);
  ctx.drawImage(c, Math.round(-w * s / 2), Math.round(-h * s - 1), Math.round(w * s), Math.round(h * s)); ctx.restore();
  if (Math.random() < 0.15) part(e.x + off[0], e.y + off[1], { z: 6 + Math.random() * 8, vz: k === 'ice' || k === 'wet' ? -6 : 14, life: 0.5, c: IMB_COL[k], s: 1 });
};
// la presencia online ya usa imbueOf; si alguien apaga las auras, tampoco ve las de los demás (drawImbue lo comprueba)
// tocar otra vez una esencia con el arma imbuida de ese elemento la cancela
{ const _ui = useItem; useItem = function (idx) { const P = G.P, s = P && P.inv[idx], I = s && ITEMS[s.id];
    if (I && I.imbK && P.imb && P.imb.k === I.imbK && P.imb.until > Date.now()) { P.imb = null; toast(L2('Has quitado la esencia del arma', 'You removed the essence from your weapon'), 'info'); markDirty(); return; }
    return _ui.apply(this, arguments); }; }
// opción en Opciones › Juego
{ const _ro = renderOpts; renderOpts = function (B) { const r = _ro.apply(this, arguments);
    try { const wx = $('#oWx'); if (wx && !$('#oImb')) { const l = document.createElement('label'); l.className = 'tg'; l.innerHTML = `<input type="checkbox" id="oImb" ${SETTINGS.imbue !== false ? 'checked' : ''}> ${L2('Aura de armas imbuidas (fuego, hielo, rayo y agua)', 'Imbued weapon aura (fire, ice, lightning and water)')}`; wx.closest('label').after(l); $('#oImb').onchange = e => { SETTINGS.imbue = e.target.checked; saveSettings(); }; } } catch (e) { }
    return r; }; }
// forja: quitar la runa
{ const _fo = fgOpen; fgOpen = function () { const r = _fo.apply(this, arguments);
    try { const P = G.P, e = fgW(); if (e && e.fg && e.fg.rune) { const h = [...$$('#modal h3')].find(x => /runa|rune/i.test(x.textContent)); if (h && !$('#fgNoRune')) { const b = document.createElement('button'); b.className = 'btn sm'; b.id = 'fgNoRune'; b.textContent = '✕ ' + L2('Quitar la runa', 'Remove the rune'); b.style.marginLeft = '.5em';
      b.onclick = () => { delete e.fg.rune; calcStats(P); markDirty(true); toast(L2('Runa quitada', 'Rune removed'), 'info'); fgOpen(); }; h.appendChild(b); } } } catch (x) { }
    return r; }; }

// 6.19 · Frutas del Diablo + transformaciones (Sergio: «las otras transformaciones se suman con las frutas del diablo, ¿no?» y
// «¿no serían más fáciles las batallas con tantas técnicas? Que te dé unas 2 de la fruta y otras 2 de la transformación»).
// El daño de las técnicas de fruta ya usa tu ataque total (P.S.atk), que incluye la forma. Antes, al transformarte, las 4
// casillas pasaban a las 4 técnicas de la forma (srSet) y la fruta no se podía usar. Ahora, con fruta y forma a la vez:
// 2 técnicas de la forma + 2 de la fruta. El botón de la fruta junto a la barra cambia qué pareja de técnicas de fruta llevas.
SAVEKEYS.push('srFruitPair');
function dfFormFruitList(P) {
  const all = (DFS[P.fruit] || []).filter(id => P.skills[id] > 0), out = [];
  for (const id of P.srSlots || []) if (id && all.includes(id) && !out.includes(id)) out.push(id);   // primero las que llevabas puestas
  for (const id of all) if (!out.includes(id)) out.push(id);
  return out;
}
const dfFormMix = P => !!(P && P.srF && P.fruit && DFS[P.fruit] && SRSK[P.sr] && dfFormFruitList(P).length);
function dfFormApply(P) {
  if (!dfFormMix(P)) return;
  const F = dfFormFruitList(P), n = Math.max(1, Math.ceil(F.length / 2)), k = ((P.srFruitPair || 0) % n) * 2;
  P.slots = [SRSK[P.sr][0], SRSK[P.sr][1], F[k] || null, F[k + 1] || (F.length > 1 && F[0] !== F[k] ? F[0] : null)];
  uiDirty.hud = true;
}
hookAfter('srSet', (r, on) => { const P = G.P; if (on && P && P.srF) dfFormApply(P); });
function dfFormNext() {
  const P = G.P; if (!dfFormMix(P)) return;
  P.srFruitPair = (P.srFruitPair || 0) + 1; dfFormApply(P); markDirty(); sfx('ui');
  toast(DFR[P.fruit].ic + ' ' + P.slots.slice(2).filter(Boolean).map(id => SK[id].n).join(' · '), 'info', 2.5);
}
V33_TICKS.push(() => {
  const P = G.P; let b = document.getElementById('bDfForm');
  const show = dfFormMix(P) && !P.dead && dfFormFruitList(P).length > 2;
  // si la fruta se aprendió o cambió estando transformado, la barra se rehace
  if (dfFormMix(P) && !DFS[P.fruit].includes(P.slots[2]) && !DFS[P.fruit].includes(P.slots[3])) dfFormApply(P);
  if (!show) { if (b) b.hidden = true; return; }
  if (!b) { b = document.createElement('button'); b.id = 'bDfForm'; b.className = 'rb';
    b.style.cssText = 'position:absolute;right:12.7em;bottom:5.9em;width:2.6em;height:2.6em;font-size:1em;z-index:6';
    b.onclick = e => { e.stopPropagation(); dfFormNext(); };
    (document.querySelector('.sk') ? document.querySelector('.sk').parentNode : document.body).appendChild(b); }
  b.hidden = false; const t = DFR[P.fruit].ic + '⇄';
  if (b.textContent !== t) { b.textContent = t; b.title = L2('Cambiar las 2 técnicas de la fruta', 'Swap the 2 fruit techniques'); }
});
GSIS.push(['fruta_forma', L2('Frutas del Diablo y transformaciones', 'Devil Fruits and transformations'), () => [
  L2('Se suman: el daño de cada técnica de fruta sale de tu ataque total, así que la transformación, los despertares y el equipo la hacen más fuerte.', 'They stack: every fruit technique’s damage comes from your total attack, so transformations, awakenings and gear make it stronger.'),
  L2('Transformado y con fruta, la barra lleva 2 técnicas de la forma y 2 de la fruta. El botón de la fruta (junto a la barra) cambia qué 2 técnicas de fruta llevas.', 'Transformed and with a fruit, the bar holds 2 form techniques and 2 fruit techniques. The fruit button (next to the bar) changes which 2 fruit techniques you carry.')
]]);

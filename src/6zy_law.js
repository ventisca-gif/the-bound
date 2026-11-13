// ================= v4.6: MULTAS Y ANTECEDENTES, COLGANTE DE PROMESA =================
// Antes solo los NPCs con id «guardia…» cobraban multas y solo la de su pueblo: el Guardia Rolf (Albor) y el
// Capitán Darius (Arxar) no ofrecían pagar, Yarakai y Puerto Brasa no tienen guardia, y si eras «Criminal» por
// robos que salieron bien no había multa que pagar aunque los guardias te persiguieran.
// Ahora cualquier guardia cobra las multas de cualquier pueblo, enseña tus antecedentes y te deja limpiar tu nombre.

// el Colgante de Promesa ya no pide nivel de Joyería
{ const r = RECIPES.find(r => r.id === 'r_colgante_amor'); if (r) r.jlv = 1; }

const LAW_TOWNS = () => TOWNS.filter(t => t.lvl || t.lvl === 0);
function isLawNpc(id) { return id === 'rolf' || id === 'darius' || /^guardia/.test(id || ''); }
// multa de un pueblo: la registrada al pillarte robando, o el precio por limpiar tu nombre si te consideran Criminal
function lawFine(tk) { const P = G.P, B = P.bounty || {}; if (B[tk] > 0) return B[tk]; if (repStatus(tk).n === 'Criminal') return 400 + P.lv * 30; return 0; }
function lawPending() { return LAW_TOWNS().map(t => ({ k: t.k, n: t.n, fine: lawFine(t.k), st: repStatus(t.k), bounty: !!((G.P.bounty || {})[t.k] > 0) })).filter(x => x.fine > 0); }
function lawPay(tk) {
  const P = G.P, amt = lawFine(tk); if (!amt) return 'none'; if (P.gold < amt) return 'gold';
  P.gold -= amt; if (P.bounty) delete P.bounty[tk]; P.rep = P.rep || {}; P.rep[tk] = Math.max(repOf(tk), -90);
  for (const m of G.ents) if (m.lawOf === tk) m.remove = true;
  if (!lawPending().length) P.lawCd = 0;
  sfx('coin'); uiDirty.hud = true; markDirty(true); return 'ok';
}
function lawPayMsg(r, tk) {
  if (r === 'ok') return L2(`Deuda con ${townName(tk)} saldada. Pórtate bien.`, `Your debt with ${townName(tk)} is settled. Behave.`);
  if (r === 'gold') return L2('No tienes suficiente oro. Vuelve con el dinero.', "You don't have enough gold. Come back with the money.");
  return L2('No tienes nada pendiente allí.', 'You owe nothing there.');
}
function openLawPanel() {
  const P = G.P, pend = lawPending(), total = pend.reduce((s, x) => s + x.fine, 0);
  const rows = LAW_TOWNS().map(t => { const st = repStatus(t.k), f = lawFine(t.k);
    return `<div class="srow"><div class="sn"><b>${esc(t.n)}</b><small style="color:${st.c}">${esc(st.n)}${f ? ' · ' + (((P.bounty || {})[t.k] > 0) ? L2('multa por robo', 'theft fine') : L2('limpiar tu nombre', 'clear your name')) : ''}</small></div>${f ? `<button class="btn sm ${P.gold >= f ? 'gold' : ''}" data-lawpay="${t.k}">${L2('Pagar', 'Pay')} ${fmt(f)}</button>` : `<small class="hint">${L2('Sin multas', 'No fines')}</small>`}</div>`; }).join('');
  openModal(`<div class="lawm"><h2>${L2('Multas y antecedentes', 'Fines and record')}</h2><p class="hint">${L2('Cualquier guardia cobra las multas de cualquier pueblo. Al pagar, los guardias dejan de perseguirte allí.', 'Any guard collects fines from any town. Once paid, the guards there stop chasing you.')} · ${L2('Tu oro', 'Your gold')}: ${fmt(P.gold)}</p><div class="lawlist">${rows}</div><p class="hint" id="lawMsg"></p><div class="row">${pend.length > 1 ? `<button class="btn gold" id="lawAll">${L2('Pagar todo', 'Pay all')} (${fmt(total)})</button>` : ''}<button class="btn" id="lawOk">${L2('Cerrar', 'Close')}</button></div></div>`, 'lawmodal');
  $('#lawOk').onclick = () => closeModal();
  $$('[data-lawpay]').forEach(b => b.onclick = () => { const tk = b.dataset.lawpay, r = lawPay(tk); if (r === 'ok') { openLawPanel(); toast(lawPayMsg(r, tk), 'info', 3); } else $('#lawMsg').textContent = lawPayMsg(r, tk); });
  const all = $('#lawAll'); if (all) all.onclick = () => { if (P.gold < total) { $('#lawMsg').textContent = lawPayMsg('gold'); return; } for (const x of pend) lawPay(x.k); openLawPanel(); toast(L2('Todas tus multas están pagadas.', 'All your fines are paid.'), 'info', 3); };
}
(function () { const st = document.createElement('style'); st.textContent = '.lawm{max-width:30em;width:100%}.lawm h2{text-align:center;margin:.1em 0 .3em}.lawm .lawlist{max-height:min(52vh,22em);overflow:auto}.lawm .srow{display:flex;align-items:center;justify-content:space-between;gap:.6em;padding:.25em 0;border-bottom:1px solid rgba(217,178,90,.2)}.lawm .sn{display:flex;flex-direction:column}.lawm .row{display:flex;gap:.5em;justify-content:center;margin-top:.6em}'; document.head.appendChild(st); })();
DLG_HOOKS.push((npc, opts) => {
  if (!npc || !isLawNpc(npc.id) || !G.P) return;
  // quita la opción antigua (solo servía para algunos guardias) y pone la nueva
  for (let i = opts.length - 1; i >= 0; i--) if (/^(Pagar multa|Pay fine)/i.test(opts[i].label || '')) opts.splice(i, 1);
  const here = npc.map === 'world' ? (wedTownOf(npc) || {}).k : null, pend = lawPending();
  if (!pend.length) { opts.push({ label: L2('Preguntar por multas', 'Ask about fines'), icon: ['coin'], fn: () => typeText(L2('Estás limpio: no tienes multas en ningún pueblo.', "You're clean: no fines in any town.")) }); return; }
  opts.unshift({ label: L2('Multas y antecedentes', 'Fines and record') + ` (${pend.length})`, icon: ['coin'], fn: () => { closeDialog(); openLawPanel(); } });
  const loc = pend.find(x => x.k === here) || (pend.length === 1 ? pend[0] : null);
  if (loc) opts.unshift({ label: L2(`Pagar multa de ${loc.n} (${fmt(loc.fine)} oro)`, `Pay ${loc.n} fine (${fmt(loc.fine)} gold)`), icon: ['coin'], fn: () => typeText(lawPayMsg(lawPay(loc.k), loc.k)) });
});
// al empezar la persecución, decir dónde pagar
{ const _lt = lawTick; lawTick = function (dt) { const before = G.P && G.P.lawCd; const r = _lt(dt); if (G.P && G.P.lawCd !== before && G.P.lawCd) setTimeout(() => toast(L2('Cualquier guardia cobra tus multas: Rolf en Albor, Darius o los guardias en Arxar, y los de Puerto Coral y Sahrim (iconos rojos en el mapa).', 'Any guard collects your fines: Rolf in Albor, Darius or the guards in Arxar, and those in Puerto Coral and Sahrim (red icons on the map).'), 'info', 5), 2500); return r; }; }

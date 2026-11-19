// ================= v5.41: TODAS TUS FORMAS GUARDADAS Y FORMA HÍBRIDA DEL DRAGÓN =================
// Sergio: «mantener guardadas nuestras formas para escoger: si ya conseguimos lobo, vampiro, fantasma o dragón se
// guardan; depende de qué forma usemos. Y la forma híbrida del dragón, mejor (+10 % de daño)».
//  · P.srOwn = formas conseguidas (no se pierden). P.sr = la que usas ahora. Se cambia en 🌀 Transformaciones.
//    Cada forma guarda su propio rango de habilidades (P.srXs). La Poción de Sangre Limpia solo te deja sin forma puesta.
//  · El ritual de Corvel sirve para conseguir las que te faltan aunque ya tengas otra.
//  · Dragón: normal → Forma Híbrida (+16 % de ataque, 10 % más que la mitad) → dragón a cuatro patas.
//  · Arreglo: el estado «a cuatro patas» (srF 2) no viajaba (se guardaba como 1) y el lobo a cuatro patas no se veía.

SAVEKEYS.push('srOwn', 'srXs');
const srOwned = () => { const P = G.P; if (!P) return []; P.srOwn = (P.srOwn || []).filter(k => SR[k]); if (P.sr && SR[P.sr] && !P.srOwn.includes(P.sr)) P.srOwn.push(P.sr); return P.srOwn; };
V33_TICKS.push(() => { const P = G.P; if (P && P.sr && !(P.srOwn || []).includes(P.sr)) srOwned(); });
// ---------- arreglo: híbrida (1) y completa (2) viajan distintas ----------
{ const _gt = gearTiers; gearTiers = function (P) { const g = _gt.apply(this, arguments); if (P && P.sr && P.srF) g.sf = P.srF === 2 ? 2 : 1; return g; }; }
{ const _lg = lkGear; lkGear = function (g) { const o = _lg.apply(this, arguments); if (o && o.sr && g && g.sf === 2) o.sf = 2; return o; }; }

// ---------- usar una forma guardada ----------
function srUse(k) { const P = G.P; if (!P || P.dead) return; if (k && !srOwned().includes(k)) return; if ((P.srTT || 0) > G.t) { toast(L2('Espera un momento', 'Wait a moment'), 'warn'); return; }
  if (P.srF) srSet(false); P.srXs = P.srXs || {}; if (P.sr) P.srXs[P.sr] = P.srX || 0;
  P.sr = k || null; P.srX = k ? (P.srXs[k] || 0) : 0; if (k === 'lobo') P.srC = P.srC || 'blanco'; P.srTT = G.t + 1.2;
  calcStats(P); refreshLook(); uiDirty.hud = true; markDirty(true); if (k) { const D = SR[k]; addFx({ type: 'ring', x: P.x, y: P.y, r: 40, dur: 0.6, col: D.col }); banner(D.ic + ' ' + D.n, L2('Toca ', 'Tap ') + D.ic + L2(' para transformarte', ' to transform')); sfx('buff'); } else { banner(L2('Tu forma de siempre', 'Your usual form'), ''); sfx('ui'); } }
// ---------- el ritual: conseguir las que faltan ----------
{ const _sr = srRitual; srRitual = function () { const r = _sr.apply(this, arguments); try { const P = G.P, own = srOwned();
  document.querySelectorAll('#modal [data-sr]').forEach(b => { const k = b.dataset.sr;
    if (own.includes(k)) { b.disabled = true; b.textContent = '✓ ' + L2('Ya la tienes', 'You have it'); return; }
    if (k !== 'dragon' && !P.quests.done.sr1) { b.disabled = true; b.textContent = '🔒 ' + L2('Misión de Corvel', 'Corvel\'s quest'); return; }
    const h = b.onclick; if (!h || b.disabled) return; b.onclick = e => { const old = P.sr, oldX = P.srX || 0; if (old && P.srF) srSet(false); h(e); if (P.sr && P.sr !== old) { P.srXs = P.srXs || {}; if (old) P.srXs[old] = oldX; srOwned(); toast(L2('Forma guardada: la puedes cambiar cuando quieras en 🌀 Transformaciones.', 'Form saved: you can switch any time in 🌀 Transformations.'), 'quest', 5); markDirty(true); } }; });
  const hint = document.querySelector('#modal .hint'); if (hint) hint.textContent = L2('Las formas que consigues se guardan todas. Elige cuál usar en 🌀 Transformaciones.', 'Every form you get is kept. Choose which to use in 🌀 Transformations.'); } catch (e) { console.warn(e); } return r; }; }
DLG_HOOKS.push((npc, opts) => { const P = G.P; if (npc.id !== 'corvel' || !P.sr) return; const own = srOwned(), can = Object.keys(SR).some(k => !own.includes(k) && (k === 'dragon' ? (typeof drgReady === 'function' && drgReady()) : P.quests.done.sr1));
  if (can) opts.unshift({ label: L2('Ritual: conseguir otra forma', 'Ritual: get another form'), icon: ['talk'], fn: () => { closeDialog(); srRitual(); } }); });
// la Poción de Sangre Limpia ya no borra tus formas guardadas: solo te quita la que llevas
{ const _ui = useItem; useItem = function (i) { const P = G.P, s = P && P.inv[i], I_ = s && ITEMS[s.id]; if (I_ && I_.clean && P.sr) srOwned(); return _ui.apply(this, arguments); }; }

// ---------- el dragón tiene 3 estados, como el lobo ----------
const SR_FORMS = k => k === 'lobo' ? [[1, L2('Forma Híbrida', 'Hybrid Form')], [2, L2('Lobo a cuatro patas', 'Four-legged wolf')]] : k === 'dragon' ? [[1, L2('Forma Híbrida', 'Hybrid Form')], [2, L2('Dragón a cuatro patas', 'Four-legged dragon')]] : [[1, SR[k].f]];
{ const _st = srToggle; srToggle = function () { const P = G.P; if (!P || P.sr !== 'dragon') return _st.apply(this, arguments); if (P.dead || (P.srTT || 0) > G.t) return; P.srTT = G.t + 1.2;
  srSet(((P.srF || 0) + 1) % 3); const D = SR.dragon; addFx({ type: 'ring', x: P.x, y: P.y, r: 40, dur: 0.6, col: D.col }); burst(P.x, P.y - 14, 30, { sp: 80, up: 60, g: 20, life: 0.8, c: [D.col, '#ffffff', '#ffd040'] }); sfx(P.srF ? 'buff' : 'ui');
  if (P.srF) banner(P.srF === 1 ? L2('Forma Híbrida', 'Hybrid Form') : D.f, P.srF === 1 ? L2('Toca 🐉 otra vez: dragón a cuatro patas', 'Tap 🐉 again: four-legged dragon') : L2('Toca 🐉 otra vez para volver', 'Tap 🐉 again to change back')); }; }
{ const _ts = transSet; transSet = function (f) { const P = G.P; const r = _ts.apply(this, arguments); if (P && P.sr === 'dragon' && P.srF === 1) banner(L2('Forma Híbrida', 'Hybrid Form'), L2('+16 % de ataque', '+16% attack')); return r; }; }

// ---------- 🌀 Transformaciones: tus formas guardadas ----------
transOpen = function () { const P = G.P; if (!P) return; const own = srOwned();
  const lockWhy = k => { const D = SR[k], c = D.cost[0], off = c[1] + '× ' + esc(ITEMS[c[0]] ? ITEMS[c[0]].n : c[0]) + ' + ' + fmt(200000) + L2(' de oro', ' gold');
    if (k === 'dragon') return (P.lv < DRG_LV ? `<b>${L2('Requiere nivel ', 'Requires level ')}${DRG_LV} (${L2('tienes ', 'you are ')}${P.lv}).</b> ` : '') + L2('Misiones de Nilo y Corvel (Lupa › Subrazas) y ritual de la brasa: ', 'Nilo and Corvel quests (Magnifier › Subraces) and the ember ritual: ') + off + '.';
    return L2('Ritual de sangre con Corvel en el Velo Roto (tras la misión de las Rosas Azules). Ofrenda: ', 'Blood ritual with Corvel in the Broken Veil (after the Blue Roses quest). Offering: ') + off + '.'; };
  const rows = Object.keys(SR).map(k => { const D = SR[k];
    if (!own.includes(k)) return `<div class="gsrc trlock"><span><b>🔒 ${D.ic} ${esc(D.n)}</b><br><small>${esc(D.pas)}</small><br><small class="trwhy">${lockWhy(k)}</small></span></div>`;
    if (P.sr !== k) return `<div class="gsrc"><span><b>${D.ic} ${esc(D.n)}</b> <small>· ${L2('guardada', 'saved')} · ${L2('rango ', 'rank ')}${Math.min(10, 1 + Math.floor(((P.srXs || {})[k] || 0) / 150))}</small><br><small>${esc(D.pas)}</small></span><div class="row wrap"><button class="btn sm gold" data-tu="${k}">${L2('Usar esta forma', 'Use this form')}</button></div></div>`;
    return `<div class="gsrc"><span><b>${D.ic} ${esc(D.n)}</b> <small>· ${L2('la usas ahora', 'in use')} · ${L2('rango ', 'rank ')}${srRank()}</small><br><small>${esc(D.pas)}</small></span><div class="row wrap"><button class="btn sm ${!P.srF ? 'gold' : ''}" data-tf="0">${L2('Normal', 'Normal')}</button>${SR_FORMS(k).map(([f, n]) => `<button class="btn sm ${P.srF === f ? 'gold' : ''}" data-tf="${f}">${esc(n)}</button>`).join('')}<button class="btn sm" data-tu="">${L2('Quitármela', 'Take it off')}</button></div></div>`; }).join('');
  openModal(`<div class="frame"><h3>🌀 ${L2('Transformaciones', 'Transformations')}</h3><p class="hint">${L2('Todas las formas que consigues se quedan guardadas: elige cuál usar. Cada una guarda su rango. Las bloqueadas se consiguen con Corvel (Lupa › Subrazas).', 'Every form you get stays saved: choose which to use. Each keeps its rank. Locked ones come from Corvel (Magnifier › Subraces).')}</p>${rows}<div class="row"><button class="btn" id="trX">${L2('Cerrar', 'Close')}</button></div></div>`);
  $('#trX').onclick = closeModal; $$('#modal [data-tf]').forEach(b => b.onclick = () => { transSet(+b.dataset.tf); closeModal(); }); $$('#modal [data-tu]').forEach(b => b.onclick = () => { srUse(b.dataset.tu || null); transOpen(); }); };

// ---------- Lupa ----------
if (typeof GSIS !== 'undefined') GSIS.unshift(['sr541', '🌀 ' + L2('Tus formas guardadas', 'Your saved forms'), () => [
  L2('Todas las transformaciones que consigues (lobo, fantasma, vampiro y dragón) se quedan guardadas para siempre. En 🌀 Transformaciones eliges cuál usar; cada una guarda su propio rango de habilidades.', 'Every transformation you get (wolf, ghost, vampire and dragon) stays saved forever. In 🌀 Transformations you choose which to use; each keeps its own skill rank.'),
  L2('Para conseguir las que te faltan, habla con Corvel: «Ritual: conseguir otra forma». La Poción de Sangre Limpia solo te quita la forma que llevas puesta.', 'To get the ones you are missing, talk to Corvel: «Ritual: get another form». The Clean Blood Potion only takes off the form you are wearing.'),
  L2('Dragón: normal → Forma Híbrida (escamas en la piel y alas grandes, +16 % de ataque) → dragón a cuatro patas (+32 %). El lobo también tiene su forma a cuatro patas.', 'Dragon: normal → Hybrid Form (scales on the skin and big wings, +16% attack) → four-legged dragon (+32%). The wolf also has its four-legged form.')], () => null]);

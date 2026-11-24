// ===== v5.18: un solo botón de atajos (▦) y botón de Transformaciones =====
// Los botones pequeños de arriba a la derecha (mazmorras, familia, montura, grupo, lupa, libro, mapa, menú...)
// siguen viviendo en `#tr .trbtns` (cada sistema los crea y actualiza ahí como siempre), pero ahora esa fila
// es una ventana que se abre con el botón ▦. El botón de subraza (#bSr) se sustituye por 🌀 Transformaciones.
function hubOpen(on) { document.body.classList.toggle('hubOpen', on === undefined ? !document.body.classList.contains('hubOpen') : !!on); }
function hubMount() {
  const tr = $('#tr'), row = $('#tr .trbtns'); if (!tr || !row) return;
  if (!$('#bHub')) { const b = document.createElement('button'); b.className = 'mini'; b.id = 'bHub'; b.title = L2('Atajos', 'Shortcuts'); b.setAttribute('aria-label', b.title); b.innerHTML = '<span class="hubic">▦</span><span class="hubt">' + L2('Atajos', 'Shortcuts') + '</span>'; b.onclick = e => { e.stopPropagation(); hubOpen(); }; tr.insertBefore(b, row);
    row.addEventListener('click', e => { if (e.target.closest('button')) setTimeout(() => hubOpen(false), 0); });
    document.addEventListener('pointerdown', e => { if (document.body.classList.contains('hubOpen') && !e.target.closest('#tr .trbtns') && !e.target.closest('#bHub') && !e.target.closest('#trTabs')) hubOpen(false); }, true); }
  let t = $('#bTrans'); if (!t) { t = document.createElement('button'); t.className = 'mini'; t.id = 'bTrans'; t.title = L2('Transformaciones', 'Transformations'); t.textContent = '🌀'; t.onclick = transOpen; row.insertBefore(t, row.firstChild); }
  { const hb = $('#bHub'), pg = !!row.querySelector('.ping'); if (hb && hb.classList.contains('ping') !== pg) hb.classList.toggle('ping', pg); }
  const P = G.P, ic = P && P.sr && SR[P.sr] ? SR[P.sr].ic + (P.srF ? '✓' : '') : '🌀'; if (t.textContent !== ic) t.textContent = ic;
}
V33_TICKS.push(hubMount);
// lobo: 0 normal, 1 híbrido, 2 cuatro patas; fantasma y vampiro: 0 / 1
function transSet(f) { const P = G.P; if (!P || !P.sr || P.dead) return; if ((P.srF || 0) === f) return; if ((P.srTT || 0) > G.t) { toast(L2('Espera un momento', 'Wait a moment'), 'warn'); return; } P.srTT = G.t + 1.2;
  srSet(f); const D = SR[P.sr]; addFx({ type: 'ring', x: P.x, y: P.y, r: 40, dur: 0.6, col: D.col }); burst(P.x, P.y - 14, 30, { sp: 80, up: 60, g: 20, life: 0.8, c: [D.col, '#ffffff', P.sr === 'vampiro' ? '#5a0a1a' : P.sr === 'lobo' ? '#6a6a7a' : '#9ae8ff'] }); sfx(P.srF ? 'buff' : 'ui');
  banner(P.srF ? (P.sr === 'lobo' ? (P.srF === 1 ? L2('Forma Híbrida', 'Hybrid Form') : L2('Forma de Lobo', 'Wolf Form')) : D.f) : L2('Tu forma de siempre', 'Your usual form'), ''); }
function transOpen() { const P = G.P; if (!P) return;
  const forms = k => k === 'lobo' ? [[1, L2('Forma Híbrida', 'Hybrid Form')], [2, L2('Lobo a cuatro patas', 'Four-legged wolf')]] : [[1, SR[k].f]];
  const rows = Object.keys(SR).map(k => { const D = SR[k], mine = P.sr === k;
    if (!mine) { const c = D.cost[0], why = P.sr ? L2('Solo puedes tener una subraza. Bebe la Poción de Sangre Limpia (Corvel) para cambiar.', 'You can only have one subrace. Drink the Clean Blood Potion (Corvel) to change.') : L2('Ritual de sangre con Corvel en el Velo Roto. Ofrenda: ', 'Blood ritual with Corvel in the Broken Veil. Offering: ') + c[1] + '× ' + esc(ITEMS[c[0]] ? ITEMS[c[0]].n : c[0]) + ' + ' + fmt(200000) + L2(' de oro.', ' gold.');
      return `<div class="gsrc trlock"><span><b>🔒 ${D.ic} ${esc(D.n)}</b><br><small>${esc(D.pas)}</small><br><small class="trwhy">${why}</small></span></div>`; }
    return `<div class="gsrc"><span><b>${D.ic} ${esc(D.n)}</b><br><small>${esc(D.pas)}</small></span><div class="row wrap"><button class="btn sm ${!P.srF ? 'gold' : ''}" data-tf="0">${L2('Normal', 'Normal')}</button>${forms(k).map(([f, n]) => `<button class="btn sm ${P.srF === f ? 'gold' : ''}" data-tf="${f}">${esc(n)}</button>`).join('')}</div></div>`; }).join('');
  openModal(`<div class="frame"><h3>🌀 ${L2('Transformaciones', 'Transformations')}</h3><p class="hint">${L2('Elige tu forma. Las bloqueadas se consiguen con el ritual de sangre.', 'Choose your form. Locked ones come from the blood ritual.')}</p>${rows}<div class="row"><button class="btn" id="trX">${L2('Cerrar', 'Close')}</button></div></div>`);
  $('#trX').onclick = closeModal; $$('#modal [data-tf]').forEach(b => b.onclick = () => { transSet(+b.dataset.tf); closeModal(); }); }
{ const st = document.createElement('style'); st.textContent = `#bHub{gap:.3em;padding:0 .5em}#bHub .hubic{font-size:1.25em;line-height:1}#bHub .hubt{font-size:.8em}#bHub.ping{box-shadow:0 0 0 2px #ffd040,0 0 10px 2px #ffd040;animation:bping 1.2s infinite}body.hubOpen #bHub{background:#3a2a14;border-color:#ffd040}
#tr{position:absolute}#tr #bSr{display:none!important}
#tr .trbtns{display:none!important}
body.hubOpen #tr .trbtns{display:grid!important;position:absolute;top:100%;right:0;margin-top:.3em;z-index:40;grid-template-columns:repeat(4,4.6em);gap:.35em;max-width:none;padding:.5em;background:linear-gradient(var(--pbg1),var(--pbg2));border:2px solid var(--gold);border-radius:.6em;box-shadow:0 0 0 2px var(--ink),0 6px 14px rgba(0,0,0,.6)}
body.hubOpen #tr .trbtns>.mini{position:relative;width:4.6em!important;height:3.9em!important;font-size:1em!important;overflow:hidden;flex-direction:column;justify-content:center;gap:.15em;padding:.15em .1em;font-size:inherit}
body.hubOpen #tr .trbtns>.mini::after{content:attr(title);font-size:.52em;word-break:break-word;line-height:1.05;color:#f3e6c8;text-align:center;max-width:100%;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.trlock{opacity:.6}.trlock .trwhy{color:#ffd080}`; document.head.appendChild(st); }

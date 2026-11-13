// ================= v3.6: IDIOMA (Español / English) =================
// Los textos del código se traducen al compilar (tools/i18n/tr.js + en.json): cada uno es (LANG_EN ? "inglés" : "español").
// Aquí: textos fijos de la página HTML, nombres de objetos por rango y el selector de idioma (cambiar de idioma recarga el juego).
function setLang(en) { try { localStorage.setItem('thebound.lang', en ? 'en' : 'es'); } catch (e) { } try { if (G && G.P && typeof saveGame === 'function') saveGame(true); } catch (e) { } setTimeout(() => location.reload(), 150); }
function i18nDom(root) {
  if (!LANG_EN) return; const tr = s => { const lead = s.match(/^\s*/)[0], trail = s.slice(lead.length).match(/\s*$/)[0], core = s.slice(lead.length, s.length - trail.length); const en = I18N_TPL[core]; return en === undefined ? null : lead + en + trail; };
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
  for (const n of nodes) { if (n.parentNode && /^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName)) continue; const t = tr(n.nodeValue); if (t !== null) n.nodeValue = t; }
  for (const el of root.querySelectorAll('[placeholder],[title],[aria-label],[alt]')) for (const a of ['placeholder', 'title', 'aria-label', 'alt']) { const v = el.getAttribute(a); if (v) { const t = tr(v); if (t !== null) el.setAttribute(a, t); } }
}
if (LANG_EN) { document.documentElement.lang = 'en'; i18nDom(document.body); }
// nombres de armas, armaduras y herramientas por rango, con el orden natural del inglés ("Wooden Sword", no "Sword of Wood")
if (LANG_EN) {
  const TN = [null, 'Wooden', 'Copper', 'Iron', 'Steel', 'Silver', 'Golden', 'Mithril', 'Adamantite', 'Runic', 'Draconic', 'Bond', 'Orichalcum', 'Celestial', 'Abyssal', 'Eclipse', 'Stellar', 'Primordial', 'Divine'];
  const WB = { guerrero: 'Sword', mago: 'Staff', arquero: 'Bow', asesino: 'Daggers', bardo: 'Lute', invocador: 'Scythe', pez: 'Combat Fins' };
  for (let t = 1; t <= 18; t++) {
    for (const c in WB) { const I = ITEMS[`w_${c}_${t}`]; if (I && !I.ws && !I.leg) I.n = `${TN[t]} ${WB[c]}`; }
    for (const [p, n] of [['h', 'Helmet'], ['b', 'Armor'], ['l', 'Greaves'], ['f', 'Boots']]) { const I = ITEMS[`${p}_${t}`]; if (I) I.n = `${TN[t]} ${n}`; }
  }
  const TT = [null, 'Copper', 'Iron', 'Mithril', 'Runic'];
  for (let t = 1; t <= 4; t++) for (const [p, n] of [['hacha', 'Axe'], ['pico', 'Pickaxe'], ['cana', 'Fishing Rod'], ['hoz', 'Sickle']]) { const I = ITEMS[p + t]; if (I) I.n = `${TT[t]} ${n}`; }
}
// selector de idioma: en Opciones y en la pantalla de título
{ const _ro = renderOpts; renderOpts = function (B) { _ro(B); const f = B.querySelector('.opts') || B; f.insertAdjacentHTML('afterbegin', `<h3>Idioma · Language</h3><div class="row langrow"><button class="btn ${LANG_EN ? '' : 'gold'}" id="oLangEs">Español</button><button class="btn ${LANG_EN ? 'gold' : ''}" id="oLangEn">English</button></div>`); $('#oLangEs').onclick = () => { if (LANG_EN) setLang(false); }; $('#oLangEn').onclick = () => { if (!LANG_EN) setLang(true); }; }; }
{ const T = document.getElementById('title'); if (T && !document.getElementById('tLang')) { const d = document.createElement('div'); d.id = 'tLang'; d.innerHTML = `<button class="chip ${LANG_EN ? '' : 'on'}" data-lang="es">ES</button><button class="chip ${LANG_EN ? 'on' : ''}" data-lang="en">EN</button>`; T.appendChild(d); d.querySelectorAll('[data-lang]').forEach(b => b.onclick = () => { const en = b.dataset.lang === 'en'; if (en !== LANG_EN) setLang(en); }); } }

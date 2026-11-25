// 6.23 · Forma de ojos a elegir (Sergio: «que los ojos existentes se puedan personalizar, ponerte los que quieras sin
// que fallen prendas, armaduras, transformaciones…»). Antes la forma de los ojos venía fija con la estructura de cuerpo
// (Héroe → ojos de la referencia, Atlético → afilados…). Ahora app.eyst la elige aparte; vacío = la de la estructura.
// Solo cambia los píxeles de los ojos (bodyEye / ojos chibi de drawHero): no toca medidas, así que ropa, armaduras,
// cosméticos, peinados, armas y transformaciones (que se dibujan con heroLook/drawHero) siguen igual.
const EYE_STYLES = [
  ['', ['De mi estructura', 'From my build']],
  ['chibi', ['Chibi', 'Chibi']],      // los de siempre (estructura clásica)
  ['hero', ['Héroe', 'Hero']],        // los de la referencia de Sergio
  ['sharp', ['Afilados', 'Sharp']],
  ['soft', ['Amables', 'Gentle']],
  ['lash', ['Pestañas', 'Lashes']],
  ['big', ['Grandes', 'Big']]
];
const EYE_OK = new Set(EYE_STYLES.map(e => e[0]).filter(Boolean));
// viaja con la partida, en el multijugador y en la clave del dibujo (heroKey usa normApp)
hookAfter('normApp', (o, a) => { if (!o) return; if (a && EYE_OK.has(a.eyst)) o.eyst = a.eyst; else delete o.eyst; });
hookAfter('heroLook', (L, cls, app) => {
  if (!L || !app || !EYE_OK.has(app.eyst)) return;
  const g = (app.g === 'm' ? 'm' : 'f'), base = L.btS || (g === 'f' ? BODY_T.f[0] : {});
  L.btS = Object.assign({}, base, { eye: app.eyst === 'chibi' ? undefined : app.eyst });
  return L;
});
// editor (creación y peluquería): fila «Forma de ojos» debajo de «Estructura»
hookAfter('appEditorHTML', (h, app) => {
  if (typeof edTab === 'undefined' || edTab !== 'cuerpo' || typeof h !== 'string') return;
  const cur = app && EYE_OK.has(app.eyst) ? app.eyst : '';
  const row = `<h4>${L2('Forma de ojos', 'Eye shape')} <small>${esc((EYE_STYLES.find(e => e[0] === cur) || EYE_STYLES[0])[1][LANG_EN ? 1 : 0])}</small></h4><div class="chips">${EYE_STYLES.map(([v, n]) => `<button class="chip ${cur === v ? 'on' : ''}" data-ek="eyst" data-ev="${v}">${esc(LANG_EN ? n[1] : n[0])}</button>`).join('')}</div>`;
  const a = h.indexOf('data-ek="bt"'); if (a < 0) return;
  const i = h.indexOf('</div>', a); return i < 0 ? h : h.slice(0, i + 6) + row + h.slice(i + 6);
});
hookAfter('bindAppEditor', (_r, root, app) => {
  $$('[data-ek="eyst"]', root).forEach(b => { const f = b.onclick; b.onclick = e => { f && f(e); if (!b.dataset.ev) delete app.eyst; }; });
});

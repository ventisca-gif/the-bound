// 5.97 · Destino de los descendientes (Sergio: «que se jubilen; algunos jamás llegarán al nivel 500, otros encuentran la
// cura de la vejez y viven hasta 300 años, otros aceptan su destino y mueren, otros te acompañan hasta el 500 por
// probabilidad; que sigan subiendo de nivel pero que no puedan llegar solos al nivel máximo; en el Mar de Dawn no se les
// puede llamar»). Vale para hijos, nietos, bisnietos y siguientes (todos están en P.kids).
const KID_LV_MAX = 500, KID_SOLO_LV = 300;
// [clave, probabilidad, icono, nombre, explicación]
const KID_FATES = [
  ['humilde', 0.40, '🌾', L2('Vida sencilla', 'Simple life'), L2('Nunca llegará al nivel 500: tiene su propio tope. Se jubila a los 65 y vive hasta los 82-98.', 'Will never reach level 500: has a personal cap. Retires at 65 and lives to 82-98.')],
  ['destino', 0.30, '🕯', L2('Acepta su destino', 'Accepts their fate'), L2('Puede llegar al 500, pero no busca alargar su vida: se jubila a los 65 y muere de viejo (82-98).', 'Can reach 500 but does not seek a longer life: retires at 65 and dies of old age (82-98).')],
  ['cura', 0.15, '⚗', L2('Cura de la vejez', 'Cure for old age'), L2('A los 60 encuentra la cura de la vejez: se jubila a los 200 y vive hasta los 260-300 años.', 'At 60 they find the cure for old age: retires at 200 and lives to 260-300.')],
  ['leyenda', 0.15, '⭐', L2('Te acompaña hasta el 500', 'Follows you to 500'), L2('No se jubila hasta llegar al nivel 500 contigo (o a los 120 años) y vive hasta los 122-138.', 'Will not retire until reaching level 500 with you (or turning 120) and lives to 122-138.')]];
const kidSeed = k => String(k.id || k.name || '').split('').reduce((a, c) => a * 31 + c.charCodeAt(0) | 0, 7);
function kidFate(k) { if (!k) return KID_FATES[1]; if (!k.fate) { const r = hash2(kidSeed(k), 11, 433); let acc = 0; k.fate = 'destino'; for (const f of KID_FATES) { acc += f[1]; if (r < acc) { k.fate = f[0]; break; } } }
  return KID_FATES.find(f => f[0] === k.fate) || KID_FATES[1]; }
function kidLvCap(k) { const f = kidFate(k)[0]; return f === 'humilde' ? 120 + Math.floor(hash2(kidSeed(k), 13, 71) * 361) : KID_LV_MAX; }
function kidRetireAge(k) { const f = kidFate(k)[0]; if (f === 'cura') return 200; if (f === 'leyenda') return (k.lv || 1) >= KID_LV_MAX ? Math.max(AGE_RET, Math.min(kidAgeY(k), 120)) : 120; return AGE_RET; }

// ---------- nivel: tope propio, nunca más de 500, y desde el 300 solo contigo ----------
let KID_XP_WITH_YOU = false;
{ const _gx = gainXp; gainXp = function () { KID_XP_WITH_YOU = true; try { return _gx.apply(this, arguments); } finally { KID_XP_WITH_YOU = false; } }; }
{ const _kg = kidGainXp; kidGainXp = function (k, n) { if (!k) return; const cap = kidLvCap(k);
  const lv0 = kidLv(k); if (lv0 >= cap) { k.xp = 0; if (!k.capSaid) { k.capSaid = 1; toast(kidFate(k)[2] + ' ' + k.name + L2(' llegó a su límite: nivel ', ' reached their limit: level ') + cap, 'info', 5); } return; }
  if (lv0 >= KID_SOLO_LV && !KID_XP_WITH_YOU) return;
  const r = _kg.apply(this, arguments); const top = KID_XP_WITH_YOU ? cap : Math.min(cap, Math.max(lv0, KID_SOLO_LV)); if ((k.lv || 1) > top) { k.lv = top; k.xp = 0; } return r; }; }
// por si algún hijo ya pasó su tope en una partida vieja: se queda donde está (no se le baja), solo deja de subir

// ---------- edad: jubilación y muerte según el destino ----------
{ const _da = kidDeathAge; kidDeathAge = function (k) { const f = kidFate(k)[0], b = _da.apply(this, arguments); return f === 'cura' ? 260 + Math.floor(hash2(kidSeed(k), 17, 9) * 41) : f === 'leyenda' ? b + 40 : b; }; }
ageDay = function () { const P = G.P; if (!P || !P.kids) return; for (const k of P.kids.slice()) { const a = kidAgeY(k), d = kidDeathAge(k), f = kidFate(k)[0];
  if (a >= d) { kidDie(k); continue; }
  if (f === 'cura' && a >= 60 && !k.cureSaid) { k.cureSaid = 1; banner('⚗ ' + k.name + L2(' encontró la cura de la vejez', ' found the cure for old age'), L2('Vivirá hasta los ', 'Will live until ') + d + L2(' años.', ' years old.')); sfx('quest'); }
  if (a >= kidRetireAge(k) && !k.ret) kidRetire(k); else if (a === d - 3 && !k.oldW) { k.oldW = 1; toast('👴 ' + k.name + L2(' está muy mayor. Visítale.', ' is very old. Go see them.'), 'info', 6); } } };
// al hacerse adulto descubre su destino
{ let t = 0; V33_TICKS.push(dt => { t += dt || 0.016; if (t < 3) return; t = 0; const P = G.P; if (!P || !P.kids) return;
  for (const k of P.kids) { if (k.fateSaid || kidStage(k) < 2) continue; k.fateSaid = 1; const F = kidFate(k); if (k.ag0 === undefined || kidAgeY(k) < 40) toast(F[2] + ' ' + k.name + ': ' + F[3], 'info', 6); } }); }

// ---------- en el Mar de Dawn no se puede llamar a la familia ----------
const FAM_NO_MAPS = new Set(['dawn', 'alvida_deck', 'marina_deck', 'tortuga']);
const famBlockedHere = () => !!(G.map && (FAM_NO_MAPS.has(G.map.id) || G.map.dawn || G.map.tortuga));
{ const _fc = famCall; famCall = function () { if (famBlockedHere()) { toast('⛵ ' + L2('En el Mar de Dawn no puedes llamar a tu familia: te espera en casa.', 'You cannot call your family in the Dawn Sea: they wait at home.'), 'info', 4); return; } return _fc.apply(this, arguments); }; }
{ const _fm = familyOnMap; familyOnMap = function (M) { if (M && (FAM_NO_MAPS.has(M.id) || M.dawn || M.tortuga)) { for (const q of G.ents) if (q.type === 'kid' && !q.fam) q.remove = true; FOLLOW_KIDS = []; return; } return _fm.apply(this, arguments); }; }
V33_TICKS.push(() => { if (!famBlockedHere()) return; let n = 0; for (const q of G.ents) if (q.type === 'kid' && !q.remove && q.map === G.map.id) { q.remove = true; n++; } if (n) FOLLOW_KIDS = FOLLOW_KIDS.filter(e => !e.remove); });

// ---------- cómo se ve en la familia ----------
function kidFateLine(k) { const F = kidFate(k), cap = kidLvCap(k); return `${F[2]} <b>${esc(F[3])}</b> · ${L2('tope nivel ', 'cap level ')}${cap} · ${L2('jubilación ', 'retires at ')}${kidFate(k)[0] === 'leyenda' ? L2('al llegar al 500', 'on reaching 500') : kidRetireAge(k)} · ${L2('vida hasta ', 'lives to ')}${kidDeathAge(k)}`; }
{ const _ok = openKid; openKid = function (e) { const r = _ok.apply(this, arguments); try { const k = e && e.kid, body = $('#mbody'); if (!k || !body || e.fam || !(G.P.kids || []).includes(k)) return r;
  body.querySelectorAll('.legBox small').forEach(s => { if (/82-98/.test(s.textContent)) s.textContent = kidFate(k)[4]; });
  const d = document.createElement('div'); d.className = 'legBox'; d.innerHTML = `<div class="srow"><div class="sn"><span>${kidFateLine(k)}</span><small>${esc(L2('Desde el nivel ', 'From level ') + KID_SOLO_LV + L2(' solo sube peleando contigo. Ningún descendiente pasa del ', ' they only level up fighting with you. No descendant goes past level ') + KID_LV_MAX + '.')}</small></div></div>`; body.appendChild(d); } catch (er) { } return r; }; }
{ const _ft = famTree; famTree = function () { const r = _ft.apply(this, arguments); try { const h = $('#modal .hint'); if (h) h.textContent = L2('Cada descendiente tiene su destino: 🌾 vida sencilla (no llega al 500), 🕯 acepta su destino (65 / 82-98), ⚗ cura de la vejez (200 / 260-300) o ⭐ te acompaña hasta el 500. Nadie pasa del 500 y desde el 300 solo suben contigo. Los que se van descansan en el Camposanto del Alba, al sur de Albor.', 'Each descendant has a fate: 🌾 simple life (never reaches 500), 🕯 accepts their fate (65 / 82-98), ⚗ cure for old age (200 / 260-300) or ⭐ follows you to 500. Nobody goes past 500 and from 300 they only level up with you. Those who pass rest in the Dawn Graveyard, south of Albor.');
  $$('#modal .ftN').forEach(n => { const b = n.querySelector('b'); if (!b || n.classList.contains('dead')) return; const k = (G.P.kids || []).find(k => b.textContent.includes(k.name)); if (k && !n.dataset.fate) { n.dataset.fate = 1; b.insertAdjacentText('afterbegin', kidFate(k)[2] + ' '); } }); } catch (e) { } return r; }; }
// Lupa › 🏙 Ciudades y vida
if (typeof LUPA_CIU !== 'undefined') LUPA_CIU.push(['destino', '🌳 ' + L2('Destino de tu familia', 'Your family’s fate'), () => KID_FATES.map(f => `${f[2]} ${f[3]} (${Math.round(f[1] * 100)} %): ${f[4]}`).concat([
  L2('Ningún descendiente pasa del nivel 500. Desde el 300 solo suben peleando contigo; antes también con su oficio y sus expediciones.', 'No descendant goes past level 500. From 300 they only level up fighting with you; before that also with their job and expeditions.'),
  L2('En el Mar de Dawn (islas, barcos y la tortuga) no puedes llamar a tu familia: te esperan en casa y vuelven contigo al salir.', 'In the Dawn Sea (islands, ships and the turtle) you cannot call your family: they wait at home and rejoin you when you leave.')]),
  () => null]);

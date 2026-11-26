// 6.39 · La tumba por dentro y el luto de tu pareja (Sergio: «que veamos el cuerpo enterrado, y que tu esposa con la que
// tuviste ese hijo tenga diálogos nuevos»).
// - En el juego (no en una ventana; Sergio lo pidió así): delante de cada tumba de la familia hay una fosa de tierra y, a
//   través de ella, su cuerpo tumbado, dibujado con el motor (drawHero de su aspecto; con canas si murió con 60+), en la capa
//   del suelo (V8_UNDER, dentro de M.drawExtra, antes que las figuras).
// - Al acercarte y tocar la tumba: «Dejar unas palabras» (5 frases o las tuyas, máx. 60): tu personaje las dice (bocadillo)
//   y quedan escritas sobre la tumba, debajo de su nombre, cuando te acercas.
// - Diálogos: el padre o la madre de un hijo fallecido (f.parent; en los nietos, la pareja de entonces es abuela/o) dice
//   frases propias al abrir «Relación ♥»: duelo los 3 primeros días, luto hasta el día 14 y recuerdos después. Tiene la
//   opción «Hablar de <nombre>» (recuerdo distinto cada vez, sube un poco la confianza una vez al día) e «Ir juntos a su
//   tumba» (flecha dorada).
function lutoApp(f) { const a = Object.assign({}, f.app || {}); if (!a.g) a.g = f.g === 'f' ? 'f' : 'm'; if ((f.age || 0) >= 60) { a.hair = 'blanco'; delete a.hair2; } return normApp(a); }
// ---------- en el juego: su cuerpo bajo la tierra, delante de la lápida (capa del suelo) ----------
const LUTO_SPR = {};
function lutoSprite(f) { const key = f.id + ':' + ((f.age || 0) >= 60 ? 'o' : 'y'); if (LUTO_SPR[key] !== undefined) return LUTO_SPR[key];
  let c = null; try { const L = heroLook('guerrero', lutoApp(f), { weapon: 0 }, {}, {}); L.weapon = null; L.back = null; const A = buildHeroAtlas(L), cw = 34, ch = 44;
    c = document.createElement('canvas'); c.width = ch; c.height = cw; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.translate(ch / 2, cw / 2); x.rotate(-Math.PI / 2); x.drawImage(A.img, A.idx.idle * A.fw + 7, 2, cw, ch, -cw / 2, -ch / 2, cw, ch); } catch (e) { c = null; }
  LUTO_SPR[key] = c; return c; }
function lutoGround(cx, cy) { const W = G.world, P = G.P, M = G.map; if (!M || !M.isWorld || !W || typeof SA === 'undefined' || !SA.famG || !P) return;
  for (const o of SA.famG) { if (o.hidden) continue; const sx = Math.round(o.px - cx), sy = Math.round(o.py - cy); if (sx < -40 || sx > VW + 40 || sy < -40 || sy > VH + 60) continue; const f = (P.fallen || [])[o.fi]; if (!f) continue;
    ctx.fillStyle = '#4a321e'; ctx.fillRect(sx - 15, sy + 2, 30, 13); ctx.fillStyle = '#6a4a2e'; ctx.fillRect(sx - 14, sy + 3, 28, 11);
    ctx.fillStyle = '#7a5a3a'; for (let i = 0; i < 6; i++) ctx.fillRect(sx - 12 + i * 5, sy + 4 + (i % 2) * 6, 1, 1);
    const sp = lutoSprite(f); if (sp) { ctx.save(); ctx.globalAlpha = 0.62; ctx.drawImage(sp, sx - 14, sy - 3, 28, 22); ctx.restore(); }
    ctx.fillStyle = 'rgba(74,50,30,.35)'; ctx.fillRect(sx - 14, sy + 3, 28, 11);
    if (P.cmFl && P.cmFl[f.id] === calDay()) for (const [dx, col] of [[-12, '#ff6a8a'], [-10, '#ffd040'], [10, '#ffffff'], [12, '#ff9ad8']]) { ctx.fillStyle = '#3e7a32'; ctx.fillRect(sx + dx, sy + 12, 1, 3); ctx.fillStyle = col; ctx.fillRect(sx + dx - 1, sy + 11, 3, 1); } } }
// capa del suelo de 6zz9zzzzzz_oficios528 (V8_UNDER): se dibuja dentro de M.drawExtra, antes de las figuras, sin envolverlo otra vez
if (typeof V8_UNDER !== 'undefined') V8_UNDER.push(lutoGround);
// sus palabras: escritas sobre la tumba al acercarte (encima de su nombre)
WORLD_DRAW.push((cx, cy) => { const M = G.map, P = G.P; if (!M || !M.isWorld || typeof SA === 'undefined' || !SA.famG || !P || !P.cmWords) return;
  for (const o of SA.famG) { if (o.hidden || dist2(o.px, o.py, P.x, P.y) > 70 * 70) continue; const f = (P.fallen || [])[o.fi], w = f && P.cmWords[f.id]; if (!w) continue; const s = textSprite('«' + w.t + '»', '#fff4d0'); ctx.drawImage(s, Math.round(o.px - cx - s.width / 2), Math.round(o.py - cy - 46)); } });
const LUTO_WORDS = [L2('Te echamos de menos cada día.', 'We miss you every day.'), L2('Gracias por todo lo que nos diste.', 'Thank you for everything you gave us.'), L2('Descansa, ya estás en casa.', 'Rest, you are home now.'), L2('Tu hilo sigue con nosotros.', 'Your thread is still with us.'), L2('Algún día volveremos a vernos.', 'Someday we will meet again.')];
function lutoSay(f, t, o) { const P = G.P; t = String(t || '').trim().slice(0, 60); if (!t) return; P.cmWords = P.cmWords || {}; P.cmWords[f.id] = { t, day: calDay() }; P.chat = t; P.chatT = G.t;
  if (o) for (let q = 0; q < 10; q++) part(o.px + (Math.random() - 0.5) * 16, o.py - 10, { vz: 18, g: -8, life: 1.6, c: pick(['#fff4d0', '#c8b0ff', '#ffffff']) });
  const pk = f.parent || P.spouse || P.partner; if (pk && typeof nick === 'function' && ROM[pk]) setTimeout(() => toast('🕯 ' + nick(pk) + ': ' + L2('Seguro que te ha escuchado.', 'I’m sure they heard you.'), 'info', 4), 1600); markDirty(); }
function lutoWords(f, o) { openModal(`<div class="frame"><h3>✍ ${L2('Unas palabras para ', 'A few words for ')}${esc(f.name)}</h3><div class="slist">${LUTO_WORDS.map((w, i) => `<button class="srow" data-lw="${i}"><div class="sn">${esc(w)}</div></button>`).join('')}</div>
  <p class="hint">${L2('O escribe las tuyas (máx. 60 letras):', 'Or write your own (max 60 letters):')}</p><input id="lwT" maxlength="60" autocomplete="off" placeholder="${L2('Tus palabras…', 'Your words…')}"><div class="row"><button class="btn gold" id="lwOk">${L2('Decir', 'Say')}</button><button class="btn" id="lwX">${L2('Cancelar', 'Cancel')}</button></div></div>`);
  $$('#modal [data-lw]').forEach(b => b.onclick = () => { closeModal(); lutoSay(f, LUTO_WORDS[+b.dataset.lw], o); }); $('#lwOk').onclick = () => { const t = $('#lwT').value; closeModal(); lutoSay(f, t, o); }; $('#lwX').onclick = closeModal; }
{ const X = typeof XACT !== 'undefined' && XACT.cm_fam; if (X) { const run = X[2]; X[2] = o => { const r = run(o); try { const f = (G.P.fallen || [])[o.fi], M = $('#modal'); if (f && M) { const row = M.querySelector('.row');
  if (row && !row.querySelector('#lwGo')) { row.insertAdjacentHTML('afterbegin', `<button class="btn gold" id="lwGo">✍ ${L2('Dejar unas palabras', 'Leave a few words')}</button>`); $('#lwGo').onclick = () => { closeModal(); lutoWords(f, o); }; } } } catch (e) { console.warn('luto', e); } return r; }; } }

// ---------- diálogos de la pareja ----------
function lutoOf(k) { const P = G.P; if (!P || !k) return []; const fl = P.fallen || [], kids = (P.kids || []).concat(fl);
  return fl.filter(f => f.parent === k || (!f.parent && (f.gen || 2) === 2 && (P.spouse === k || P.partner === k)) || (f.gparent && (() => { const p = kids.find(q => q.id === f.gparent); return p && p.parent === k; })())); }
const lutoRel = (f, me) => { const nieto = !!f.gparent, fem = f.g === 'f'; return nieto ? (fem ? L2('nuestra nieta', 'our granddaughter') : L2('nuestro nieto', 'our grandson')) : (fem ? L2('nuestra hija', 'our daughter') : L2('nuestro hijo', 'our son')); };
function lutoLine(f) { const d = calDay() - (f.day || 0), n = f.name, rl = lutoRel(f), age = f.age || 0;
  const A = [L2(`No dejo de pensar en ${n}… ${age} años y aún me parece que fue ayer cuando lo tuvimos en brazos.`, `I can’t stop thinking about ${n}… ${age} years, and it still feels like yesterday we held them.`),
    L2(`Hoy no tengo fuerzas para mucho. ${n} era ${rl}… abrázame un momento.`, `I don’t have much strength today. ${n} was ${rl}… hold me for a moment.`),
    L2(`Fui a llevarle flores a ${n} al Camposanto del Alba. ¿Vienes conmigo la próxima vez?`, `I took flowers to ${n} at the Dawn Graveyard. Will you come with me next time?`)];
  const B = [L2(`La casa está muy callada sin ${n}. A veces pongo un plato de más sin darme cuenta.`, `The house is so quiet without ${n}. Sometimes I set an extra plate without noticing.`),
    L2(`Encontré sus juguetes de cuando era pequeñ${f.g === 'f' ? 'a' : 'o'}. Los guardé en el baúl, junto a la cuna.`, `I found their toys from when they were little. I kept them in the chest, by the crib.`),
    L2(`Odila cuida bien su tumba. Dice que siempre hay flores frescas para ${n}.`, `Odila takes good care of the grave. She says there are always fresh flowers for ${n}.`)];
  const C = [L2(`¿Te acuerdas de cuando ${n} se escondía detrás de la cuna para asustarte? Se reía tanto…`, `Remember when ${n} hid behind the crib to scare you? They laughed so much…`),
    L2(`Hoy soñé con ${n}. Estaba en el Telar, tranquil${f.g === 'f' ? 'a' : 'o'}, saludándonos.`, `I dreamt of ${n} today. They were at the Loom, at peace, waving at us.`),
    L2(`${n} vivió ${age} años felices. Eso me consuela: lo hicimos bien, ¿verdad?`, `${n} lived ${age} happy years. That comforts me: we did well, didn’t we?`),
    L2(`Cada vez que paso por la vía del tren miro hacia el Camposanto y le digo hola a ${n}.`, `Every time I pass the railway I look towards the Graveyard and say hello to ${n}.`)];
  return pick(d <= 3 ? A : d <= 14 ? B : C); }
let LUTO_K = null;
hookAround('romanceMenu', (next, npc, msg, ...a) => { const k = npc && relKey(npc.id), L = lutoOf(k); if (!L.length) return next(npc, msg, ...a); const f = L.slice().sort((x, y) => (y.day || 0) - (x.day || 0))[0];
  const P = G.P; P.lutoSeen = P.lutoSeen || {}; let m = msg; if (!m && P.lutoSeen[k] !== calDay() && calDay() - (f.day || 0) <= 14) { P.lutoSeen[k] = calDay(); m = '🕯 ' + lutoLine(f); }
  LUTO_K = { k, npc, f, L }; try { return next(npc, m, ...a); } finally { LUTO_K = null; } });
hookBefore('setOpts', opts => { const Z = LUTO_K; if (!Z || !Array.isArray(opts) || opts.some(o => o && o.luto)) return; const { npc, f, k } = Z, P = G.P;
  opts.unshift({ luto: 1, label: '🕯 ' + L2('Hablar de ', 'Talk about ') + f.name, icon: ['heart', '#c8b0ff'], fn: () => { P.lutoTalk = P.lutoTalk || {}; if (P.lutoTalk[k] !== calDay()) { P.lutoTalk[k] = calDay(); try { addRel(k, 8, 4, npc.x, npc.y - 36); } catch (e) { } } romanceMenu(npc, lutoLine(f)); } },
    { luto: 1, label: '🪦 ' + L2('Ir juntos a su tumba', 'Go to their grave together'), icon: ['ways'], fn: () => { closeDialog(); if (typeof cemGo === 'function') cemGo(f); toast(nick(k) + ': ' + L2('Vamos. Le llevaremos flores.', 'Let’s go. We’ll bring flowers.'), 'info', 4); } }); });
if (typeof GSIS !== 'undefined') try { GSIS.unshift(['luto639', '🕯 ' + L2('Familia que se va', 'Family who pass away'), () => [L2('Tus hijos y nietos envejecen y se van de viejos. Descansan en el Camposanto del Alba: en su tumba ves su descanso bajo la tierra y puedes dejar flores. Tu pareja, su madre o padre, habla de ellos (duelo, luto y recuerdos) y puedes «Hablar de» él o ella o ir juntos a la tumba.', 'Your children and grandchildren grow old and pass away. They rest in the Dawn Graveyard: at their grave you see them resting under the earth and can leave flowers. Your partner, their mother or father, talks about them (grief, mourning and memories) and you can «Talk about» them or go to the grave together.')], () => null]); } catch (e) { }

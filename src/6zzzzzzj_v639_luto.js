// 6.39 · La tumba por dentro y el luto de tu pareja (Sergio: «que veamos el cuerpo enterrado, y que tu esposa con la que
// tuviste ese hijo tenga diálogos nuevos»).
// - Al tocar la tumba (XACT.cm_fam) sale, además de sus datos y las flores, un corte de la tierra: lápida y flores arriba
//   y, abajo, el ataúd abierto con su cuerpo tumbado, dibujado con el motor (drawHero de su aspecto; con canas si murió
//   mayor de 60), en paz. Sin nada desagradable.
// - Diálogos: el padre o la madre de un hijo fallecido (f.parent; en los nietos, la pareja de entonces es abuela/o) dice
//   frases propias al abrir «Relación ♥»: duelo los 3 primeros días, luto hasta el día 14 y recuerdos después. Tiene la
//   opción «Hablar de <nombre>» (recuerdo distinto cada vez, sube un poco la confianza una vez al día) e «Ir juntos a su
//   tumba» (flecha dorada).
function lutoApp(f) { const a = Object.assign({}, f.app || {}); if (!a.g) a.g = f.g === 'f' ? 'f' : 'm'; if ((f.age || 0) >= 60) { a.hair = 'blanco'; delete a.hair2; } return normApp(a); }
function lutoBodyCanvas(f) { const S = 3, W = 96, H = 64, c = document.createElement('canvas'); c.width = W * S; c.height = H * S; const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
  const px = (X, Y, w, h, col) => { x.fillStyle = col; x.fillRect(X * S, Y * S, w * S, h * S); };
  px(0, 0, W, 14, '#2a3a5a'); for (let i = 0; i < 18; i++) px((i * 37) % W, (i * 13) % 12, 1, 1, '#e8f0ff');            // cielo de noche
  px(0, 14, W, 3, '#3e7a32'); for (let i = 0; i < W; i += 3) px(i, 13, 1, 1, '#5aa846');                                 // hierba
  for (let y = 17; y < H; y++) px(0, y, W, 1, y % 7 === 0 ? '#4a3220' : y < 30 ? '#6a4a2e' : '#5a3e26');                // tierra
  for (let i = 0; i < 30; i++) px((i * 29 + 7) % W, 18 + (i * 17) % (H - 20), 1, 1, '#7a5a3a');
  px(40, 3, 16, 12, '#8a8a96'); px(41, 2, 14, 2, '#9a9aa6'); px(41, 4, 1, 10, '#b0b0bc'); px(47, 6, 2, 6, '#5a5a66'); px(45, 8, 6, 2, '#5a5a66');   // lápida con cruz
  const P = G.P; if (P && P.cmFl && P.cmFl[f.id] === calDay()) for (const [fx, col] of [[36, '#ff6a8a'], [38, '#ffd040'], [57, '#ffffff'], [59, '#ff9ad8']]) { px(fx, 12, 1, 2, '#3e7a32'); px(fx - 1, 11, 3, 1, col); }
  px(18, 34, 60, 22, '#3a2414'); px(19, 35, 58, 20, '#a87848'); px(21, 37, 54, 16, '#e8dcc8'); px(21, 37, 54, 2, '#c8b8a0');   // ataúd abierto y su tela
  try { const L = heroLook('guerrero', lutoApp(f), { weapon: 0 }, {}, {}); L.weapon = null; L.back = null; const A = buildHeroAtlas(L);
    const fw = A.fw, fh = A.fh, sx = A.idx.idle * fw, cw = 34, ch = 44, ox = 7, oy = 2; x.save(); x.translate(48 * S, 45 * S); x.rotate(-Math.PI / 2);
    const k = 0.85; x.drawImage(A.img, sx + ox, oy, cw, ch, -(cw * k * S) / 2, -(ch * k * S) / 2, cw * k * S, ch * k * S); x.restore(); } catch (e) { }
  x.fillStyle = 'rgba(40,30,60,.18)'; x.fillRect(21 * S, 37 * S, 54 * S, 16 * S);                                              // luz tenue
  return c; }
{ const X = typeof XACT !== 'undefined' && XACT.cm_fam; if (X) { const run = X[2]; X[2] = o => { const r = run(o); try { const f = (G.P.fallen || [])[o.fi], M = $('#modal'); if (f && M) { const h = M.querySelector('h2'), cv = lutoBodyCanvas(f); cv.style.cssText = 'display:block;width:100%;max-width:288px;margin:.4em auto;border:2px solid #5a4630;border-radius:.3em;image-rendering:pixelated';
      if (h) h.insertAdjacentElement('afterend', cv); const cap = document.createElement('p'); cap.className = 'hint'; cap.style.textAlign = 'center'; cap.textContent = L2('Descansa en paz bajo la tierra del Alba.', 'Resting in peace beneath the Dawn soil.'); cv.insertAdjacentElement('afterend', cap); } } catch (e) { console.warn('luto', e); } return r; }; } }

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

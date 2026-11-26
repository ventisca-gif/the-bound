// 6.40 · Arreglos de Sergio y el cementerio de la familia a largo plazo.
// 1) Duelo de rivales (amistades de 6zz9g_vida): el rival no tenía poder (`o.pw`) y el tick del duelo (6zyzw_v444) hacía
//    `HN_PW[undefined][1]` cada 4,5 s: barra roja y la pantalla parada. Ahora recibe uno al azar y `pwFx` ignora un poder
//    desconocido. Tu pareja (paseo de la mano) o tus hijos que te siguen se quedaban en la arena y se duplicaban: al empezar
//    un duelo la pareja vuelve a casa y los hijos dejan de seguirte (avisa).
// 2) Familia sin fin: cada generación muere de vieja. Solo las 12 últimas tumbas tienen cuerpo y datos; las más antiguas pasan
//    al Memorial (`P.fallenOld`, nombre, generación, año de nacimiento y de muerte, hasta 300) que se lee en el monumento del
//    Camposanto («Rendir tributo»), así no se satura.
// 3) Cementerio compartido en línea: tu presencia lleva tus 3 últimos fallecidos (nombre, fechas y aspecto) cuando estás en el
//    mundo, y los de los demás jugadores ocupan hasta 4 de las 12 tumbas de tu Camposanto (con su nombre y el de su familia).
// ---------- 1) duelo de rivales ----------
hookBefore('duelStart', o => { if (o && !(typeof HN_PW !== 'undefined' && HN_PW[o.pw])) o.pw = pick(Object.keys(HN_PW)); try { if (typeof COMP !== 'undefined' && COMP) { endComp(true); toast(L2('Tu pareja te espera en casa mientras luchas.', 'Your partner waits at home while you fight.'), 'info', 4); }
  const P = G.P; let k = 0; for (const q of (P.kids || [])) if (q.follow) { q.follow = false; k++; } if (k) { if (typeof FOLLOW_KIDS !== 'undefined') { for (const e of FOLLOW_KIDS) if (e) e.remove = true; FOLLOW_KIDS = []; } toast(L2('Tus hijos vuelven a casa: el duelo es uno contra uno.', 'Your children go home: the duel is one on one.'), 'info', 4); } } catch (e) { } });
hookBefore('pwFx', pw => { if (typeof HN_PW === 'undefined' || !HN_PW[pw]) return HOOK_SKIP; });

// ---------- 2) memorial: solo las 12 últimas tumbas; las antiguas, en el monumento ----------
SAVEKEYS.push('fallenOld');
const FAM_GRAVES = 12, FAM_OLD_MAX = 300;
function famPrune() { const P = G.P; if (!P || !P.fallen || P.fallen.length <= FAM_GRAVES) return; const old = P.fallen.splice(0, P.fallen.length - FAM_GRAVES); P.fallenOld = P.fallenOld || [];
  for (const f of old) { P.fallenOld.push({ n: f.name, g: f.g, gen: f.gen || 2, b: f.born || 0, d: f.day || 0, a: f.age || 0 }); if (P.cmWords) delete P.cmWords[f.id]; if (P.cmFl) delete P.cmFl[f.id]; }
  if (P.fallenOld.length > FAM_OLD_MAX) P.fallenOld.splice(0, P.fallenOld.length - FAM_OLD_MAX); markDirty(); }
hookAfter('kidDie', () => famPrune());
V33_TICKS.push(() => { try { famPrune(); } catch (e) { } });
const famYear = d => { try { return calDate(d).y; } catch (e) { return 1; } };
{ const X = typeof XACT !== 'undefined' && XACT.cm_tributo; if (X) { const run = X[2]; X[2] = o => { const r = run(o); try { const P = G.P, L = (P.fallenOld || []).slice().reverse(), M = $('#modal'); if (L.length && M) { const row = M.querySelector('.row');
  const html = `<div class="famold"><b>📜 ${L2('Memorial de la familia', 'Family memorial')} (${L.length})</b><br><small>${L2('Las generaciones antiguas descansan aquí. Las 12 más recientes tienen su tumba.', 'Older generations rest here. The 12 most recent have their own grave.')}</small><div style="max-height:9.5em;overflow:auto;margin-top:.3em">${L.map(f => `<div>• <b>${esc(f.n)}</b> · ${esc(famGenName(f.gen))} · ${L2('nació el año ', 'born in year ')}${famYear(f.b)} · ${L2('murió el año ', 'died in year ')}${famYear(f.d)} (${f.a} ${L2('años', 'years')})</div>`).join('')}</div></div>`;
  if (row) row.insertAdjacentHTML('beforebegin', html); } } catch (e) { console.warn('memorial', e); } return r; }; } }

// ---------- 3) cementerio compartido en línea ----------
const cmfApp = a => { const n = normApp(a || {}); return { g: n.g, hair: n.hair, hs: n.hs, skin: n.skin, eyes: n.eyes, bt: n.bt || 0 }; };
hookAfter('extraPresence', (r, o) => { const P = G.P; if (!o || !P || P.map !== 'world' || !(P.fallen || []).length) return; o.cmf = P.fallen.slice(-3).map(f => [String(f.name || '').slice(0, 16), f.born || 0, f.day || 0, f.age || 0, f.g === 'f' ? 'f' : 'm', cmfApp(f.app)]); });
hookAfter('extraRecv', (res, r, pr) => { if (!r) return; const a = pr && Array.isArray(pr.cmf) ? pr.cmf.slice(0, 3) : null;
  r.cmf = a ? a.filter(x => Array.isArray(x) && typeof x[0] === 'string').map(x => ({ id: 'r:' + String(pr.n || '').slice(0, 16) + ':' + x[0], name: x[0].slice(0, 16), born: +x[1] || 0, day: +x[2] || 0, age: Math.min(150, +x[3] || 0), g: x[4] === 'f' ? 'f' : 'm', app: x[5] && typeof x[5] === 'object' ? x[5] : {}, owner: String(pr.n || '?').slice(0, 16) })) : null; });
function cmRemoteList() { const out = []; for (const r of G.remote.values()) { if (!r.cmf || !r.cmf.length) continue; out.push(r.cmf[r.cmf.length - 1]); if (out.length >= 4) break; } return out; }
hookAfter('cmSync', () => { const W = G.world, P = G.P; if (!W || typeof SA === 'undefined' || !SA.famG || !P) return; const rem = cmRemoteList(), fl = P.fallen || [], ownN = Math.min(fl.length, SA.famG.length - rem.length), start = fl.length - ownN;
  SA.famG.forEach((o, k) => { let on = false; o.rf = null; if (k < ownN) { o.fi = start + k; on = true; } else if (k - ownN < rem.length) { o.fi = -1; o.rf = rem[k - ownN]; on = true; } o.hidden = !on; W.solidO[W.I(o.tx, o.ty)] = on ? 1 : 0; }); });
// tumbas de otros jugadores: nombre y familia al acercarte, su cuerpo en la tierra y una ficha al tocarla
const cmF = o => o && (o.rf || (G.P.fallen || [])[o.fi]);
{ const X = typeof XACT !== 'undefined' && XACT.cm_fam; if (X) { const lab = X[0], run = X[2]; X[0] = o => o && o.rf ? L2('Tumba de ', 'Grave of ') + o.rf.name + ' (' + o.rf.owner + ')' : lab(o);
  X[2] = o => { if (!o || !o.rf) return run(o); const f = o.rf; xMsg('🪦 ' + esc(f.name), `<b>${L2('Familia de ', 'Family of ')}${esc(f.owner)}</b><br>${L2('Nació el año ', 'Born in year ')}${famYear(f.born)} · ${L2('murió el año ', 'died in year ')}${famYear(f.day)} · ${f.age} ${L2('años', 'years')}<br><br><i>${L2('«Su hilo sigue en el Telar.»', '"Their thread remains in the Loom."')}</i>`,
    [['💐 ' + L2('Dejar flores', 'Leave flowers'), () => { for (let q = 0; q < 14; q++) part(o.px + (Math.random() - 0.5) * 20, o.py - 8, { vz: 24, g: -6, life: 1.4, c: pick(['#ff6a8a', '#ffffff', '#ffd040']) }); toast(L2('Dejas flores en la tumba de ', 'You leave flowers on the grave of ') + f.name, 'info'); }]]); }; } }
if (typeof V8_UNDER !== 'undefined') V8_UNDER.push((cx, cy) => { const M = G.map; if (!M || !M.isWorld || typeof SA === 'undefined' || !SA.famG) return; for (const o of SA.famG) { if (o.hidden || !o.rf) continue; const sx = Math.round(o.px - cx), sy = Math.round(o.py - cy); if (sx < -40 || sx > VW + 40 || sy < -40 || sy > VH + 60) continue;
  ctx.fillStyle = '#4a321e'; ctx.fillRect(sx - 15, sy + 2, 30, 13); ctx.fillStyle = '#6a4a2e'; ctx.fillRect(sx - 14, sy + 3, 28, 11); const sp = typeof lutoSprite === 'function' ? lutoSprite(o.rf) : null; if (sp) { ctx.save(); ctx.globalAlpha = 0.62; ctx.drawImage(sp, sx - 14, sy - 3, 28, 22); ctx.restore(); } ctx.fillStyle = 'rgba(74,50,30,.35)'; ctx.fillRect(sx - 14, sy + 3, 28, 11); } });
WORLD_DRAW.push((cx, cy) => { const M = G.map, P = G.P; if (!M || !M.isWorld || typeof SA === 'undefined' || !SA.famG || !P) return; for (const o of SA.famG) { if (o.hidden || !o.rf || dist2(o.px, o.py, P.x, P.y) > 70 * 70) continue; const f = o.rf, X = o.px - cx, Y = o.py - cy;
  const a = textSprite('+ ' + f.name, '#e8e0ff'); ctx.drawImage(a, Math.round(X - a.width / 2), Math.round(Y - 34)); const b = textSprite(L2('Familia de ', 'Family of ') + f.owner + ' - ' + (typeof lutoAgo === 'function' ? lutoAgo(f) : ''), '#d8d0f0'); ctx.drawImage(b, Math.round(X - b.width / 2), Math.round(Y - 46)); } });
if (typeof GSIS !== 'undefined') GSIS.unshift(['familia640', '🕯 ' + L2('Memorial y cementerio compartido', 'Memorial and shared graveyard'), () => [
  L2('Solo las 12 tumbas más recientes de tu familia tienen cuerpo y datos. Las generaciones más antiguas pasan al Memorial del monumento del Camposanto («Rendir tributo»): nombre, generación, año en que nacieron y en que murieron.', 'Only your family’s 12 most recent graves have a body and details. Older generations go to the Memorial on the Graveyard monument («Pay tribute»): name, generation, year born and year died.'),
  L2('En línea, los demás jugadores ven tus 3 últimos fallecidos y tú ves los de ellos: comparten hasta 4 tumbas de tu Camposanto, con su nombre y el de su familia.', 'Online, other players see your 3 latest departed and you see theirs: they share up to 4 graves in your Graveyard, with their name and their family’s.')
], () => null]);

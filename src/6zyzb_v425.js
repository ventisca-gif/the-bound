// ================= v4.25: MÚSICA DEL VELO ROTO Y PAREJA ONLINE CON SU ROPA =================
// - En todo el Velo Roto (y el Jardín de la Sonrisa) suena la música de los vídeos de Sergio: primero la pista 1 y
//   luego la 2, en bucle. Datos en 6zyza_musica_data.js (tools/dev/musica.py). Sigue el volumen de música del juego.
// - La pareja que te acompaña se ve online con la ropa que le hayas puesto (antes los demás la veían con la de siempre).

// ---------- música ----------
let VMUS = null;
function b64ab(u) { const s = atob(u.split(',')[1]), a = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a.buffer; }
function velMusicPlay(i) { if (!AC || !VMUS || !VMUS.want) return; const b = VMUS.bufs[i] || VMUS.bufs[0]; if (!b) return; const s = AC.createBufferSource(); s.buffer = b; s.connect(VMUS.g);
  s.onended = () => { if (VMUS.src === s && VMUS.want) velMusicPlay(VMUS.bufs[1 - i] ? 1 - i : i); }; VMUS.src = s; s.start(); }
function velMusicStart() { if (!AC) return; VMUS = VMUS || { bufs: [] }; VMUS.want = 1; if (!VMUS.g) { VMUS.g = AC.createGain(); VMUS.g.connect(mGain); }
  VMUS.g.gain.cancelScheduledValues(AC.currentTime); VMUS.g.gain.setValueAtTime(0.0001, AC.currentTime); VMUS.g.gain.exponentialRampToValueAtTime(3, AC.currentTime + 1.5);
  if (!VMUS.dec) { VMUS.dec = 1; ['velo1', 'velo2'].forEach((k, i) => { try { AC.decodeAudioData(b64ab(MUSICA_VELO[k]), b => { VMUS.bufs[i] = b; if (VMUS.want && !VMUS.src && i === 0) velMusicPlay(0); }, () => { }); } catch (e) { } }); }
  else if (!VMUS.src) velMusicPlay(0); }
function velMusicStop() { if (!VMUS) return; VMUS.want = 0; const s = VMUS.src; VMUS.src = null; if (s && AC) { VMUS.g.gain.setTargetAtTime(0.0001, AC.currentTime, 0.3); setTimeout(() => { try { s.stop(); } catch (e) { } }, 1200); } }
{ const _cm = currentMusic; currentMusic = function () { const M = G.map, P = G.P; if (P && !P.ghost && M && (M.vr || M.jardin)) return 'velo'; return _cm(); }; }
{ const _sm = setMusic; setMusic = function (name) { const want = name || (G.P ? currentMusic() : 'title');
  if (want === 'velo') { if (curMusic === 'velo' && VMUS && VMUS.want) return; curMusic = 'velo'; if (!AC) return;
    if (musicState && musicState.g) { const og = musicState.g; og.gain.setTargetAtTime(0.0001, AC.currentTime, 0.3); setTimeout(() => { try { og.disconnect(); } catch (e) { } }, 1500); musicState = null; }
    clearInterval(musicTimer); musicTimer = 1; velMusicStart(); return; }
  if (VMUS && VMUS.want) velMusicStop(); if (curMusic === 'velo') musicTimer = null; return _sm(name); }; }
document.addEventListener('visibilitychange', () => { if (!VMUS || !VMUS.g || !AC || !VMUS.want) return; VMUS.g.gain.setTargetAtTime(document.hidden ? 0.0001 : 3, AC.currentTime, 0.2); });

// ---------- la pareja online con su ropa ----------
function rcompAtlas(id, out) { const L = out && typeof ptSetLook === 'function' ? ptSetLook(id, out) : null;
  if (L) return getAtlas('PTR' + id + out, () => buildAtlas(Object.assign({}, NPCS[id].look, L), ['idle', 'walk', 'hug', 'kiss']));
  if (G.P && G.P.partner === relKey(id) && NPCS[id] && NPCS[id].look) return getAtlas('NPCR' + id, () => buildAtlas(NPCS[id].look, ['idle', 'walk', 'hug', 'kiss']));   // sin la ropa que tú le pones a tu pareja
  return npcAtlas(id); }
{ const _ep = extraPresence; extraPresence = function (o) { _ep(o); const P = G.P; if (o.cp && COMP && COMP.e && P) o.cp[6] = (P.partner === relKey(COMP.e.id) || P.partner2 === relKey(COMP.e.id)) && P.pOut && P.pOut !== 'normal' ? P.pOut : 0; }; }
{ const _er = extraRecv; extraRecv = function (r, pr) { _er(r, pr); const e = r.rcp; if (!e || !Array.isArray(pr.cp)) return; const out = typeof pr.cp[6] === 'string' && typeof PT_SETS !== 'undefined' && PT_SETS[pr.cp[6]] ? pr.cp[6] : 0;
  if (e.pOut !== out || !e.atlasR) { e.pOut = out; e.atlasR = 1; e.atlas = rcompAtlas(e.id, out); } }; }

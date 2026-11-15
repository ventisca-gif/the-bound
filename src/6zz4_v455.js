// =====================================================================================
// v4.55: se guardan los títulos y demás campos nuevos; el equipo de hijos, nietos y bisnietos no se puede quitar.
// v4.56: el poder vuelve a calcularse como antes; los números de la ficha se ven grandes y claros.
// =====================================================================================

// ---------- guardar los campos nuevos (antes se perdían al recargar: por eso «Aprendiz» salía otra vez) ----------
SAVEKEYS.push('titles', 'title', 'seen', 'arWins', 'dqN', 'dqLast');

// ---------- v4.56: el poder vuelve a calcularse como antes (sin ×10) ----------
V33_TICKS.push(() => { const P = G.P; if (!P) return; try { const H = hunt(); if (H.sc10) { H.score = Math.round((H.score || 0) / 10); delete H.sc10; } } catch (e) { } });
// ---------- v4.56: números grandes y claros en la ficha del personaje (la letra pixelada confundía el 8 con la S) ----------
{ const st = document.createElement('style'); st.textContent = '.chR .st b,.chR .attrs b,.chR .attrs .v,.chR .xpline small,.chR .pwv{font-family:Verdana,"Trebuchet MS",Arial,sans-serif;font-weight:700;letter-spacing:.02em}.chR .st b{font-size:1.18em}.chR .pwv{font-size:1.35em;color:var(--gold-hi);text-shadow:0 0 6px rgba(255,208,64,.45)}.chR .xpline small{font-size:1.05em}#tpRes{font-family:Verdana,"Trebuchet MS",Arial,sans-serif;font-weight:700;font-size:1.3em}'; document.head.appendChild(st); }
{ const _rc = renderChar; renderChar = function () { const r = _rc.apply(this, arguments); try { const sub = document.querySelector('.chR .sub'); if (sub && !sub.querySelector('.pwv')) sub.innerHTML = sub.innerHTML.replace(/(Poder|Power) ([0-9.,]+)/, (m, w, n) => w + ' <span class="pwv">' + n + '</span>'); } catch (e) { } return r; }; }

// ---------- el equipo de tu familia es suyo: no se puede quitar ----------
{ const _ok = openKid; openKid = function (e) { const r = _ok.apply(this, arguments); try { const k = e && e.kid; if (!k) return r;
      $$('[data-kun]').forEach(b => { const sl = b.dataset.kun, s = k.equip && k.equip[sl]; if (!s) return; const sm = b.querySelector('small'); if (sm) sm.textContent = ({ weapon: L2('Arma', 'Weapon'), head: L2('Cabeza', 'Head'), body: L2('Torso', 'Torso'), legs: L2('Piernas', 'Legs'), feet: L2('Pies', 'Feet') })[sl] + ' · ' + L2('es suyo', 'it\'s theirs');
        b.onclick = () => toast(L2('El equipo de ', 'The gear of ') + k.name + L2(' es suyo: no se lo puedes quitar. Sí puedes darle algo mejor.', ' is theirs: you can\'t take it. You can give them something better.'), 'info', 4); });
      // al darle algo, lo que llevaba se queda en su propia mochila (no vuelve a la tuya)
      const P = G.P; $$('[data-keq]').forEach(b => b.onclick = () => { const s = P.inv[+b.dataset.keq]; if (!s) return; const sl = ITEMS[s.id].slot; P.inv.splice(+b.dataset.keq, 1); if (k.equip[sl]) { k.inv = k.inv || []; k.inv.push(k.equip[sl]); } k.equip[sl] = s; sfx('equip'); refreshKidAtlas(k); uiDirty.inv = true; markDirty(true); openKid(e); }); } catch (x) { } return r; }; }

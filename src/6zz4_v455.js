// =====================================================================================
// v4.55: se guardan los títulos y demás campos nuevos; el poder se muestra ×10 (números más claros);
// el equipo de hijos, nietos y bisnietos no se puede quitar.
// =====================================================================================

// ---------- guardar los campos nuevos (antes se perdían al recargar: por eso «Aprendiz» salía otra vez) ----------
SAVEKEYS.push('titles', 'title', 'seen', 'arWins', 'dqN', 'dqLast');

// ---------- poder ×10 ----------
{ const _cs = calcStats; calcStats = function (P) { const r = _cs.apply(this, arguments); try { const S = (P && P.S) || r; if (S && S.atk !== undefined) S.power = Math.round((S.atk * 2 + S.def * 1.5 + S.maxhp / 10) * 10); } catch (e) { } return r; }; }
HN_RKSC.splice(0, HN_RKSC.length, 0, 34000, 100000, 230000, 360000, 500000);
V33_TICKS.push(() => { const P = G.P; if (!P) return; try { const H = hunt(); if (H.score && !H.sc10) { H.sc10 = 1; H.score *= 10; } } catch (e) { } });
for (const [id, v] of [['t_aprendiz', 30000], ['t_veterano', 100000], ['t_elite', 200000], ['t_heroe', 300000], ['t_leyenda', 400000], ['t_mito', 500000]]) { const t = TIT_ID[id]; if (!t) continue; t[3] = P => titPw(P) >= v; t[4] = L2('Llega a ', 'Reach ') + fmt(v) + L2(' de poder.', ' power.') + (id === 't_mito' ? L2(' (todo al máximo y transformado)', ' (everything maxed and transformed)') : ''); }
{ const i = GSIS.findIndex(x => x[0] === 'poder'); if (i >= 0) GSIS[i][2] = () => [
  L2('Poder = (ataque × 2 + defensa × 1,5 + vida ÷ 10) × 10. Lo ves en el menú del personaje y lo mide el cristal de la Torre.', 'Power = (attack × 2 + defence × 1.5 + HP ÷ 10) × 10. You see it in the character menu and the Tower crystal measures it.'),
  L2('Nivel 350 con el mejor equipo de tu nivel: unos 205.000–220.000.', 'Level 350 with the best gear for your level: about 205,000–220,000.'),
  L2('+ todo a +10 en la herrería, arma despertada al 10 y maestría 50: unos 377.000–410.000.', '+ everything at +10 at the blacksmith, weapon awakened to 10 and mastery 50: about 377,000–410,000.'),
  L2('+ clase despertada: unos 413.000–457.000.', '+ awakened class: about 413,000–457,000.'),
  L2('+ subraza transformada: Lobo 475.000–529.000, Vampiro 460.000–510.000, Fantasma 450.000–500.000 (sin transformarte la subraza no suma poder).', '+ transformed subrace: Wolf 475,000–529,000, Vampire 460,000–510,000, Ghost 450,000–500,000 (untransformed, the subrace adds no power).'),
  L2('Rangos de la Torre: Hierro 34.000, Plata 100.000, Oro 230.000, Platino 360.000 y Astral 500.000.', 'Tower ranks: Iron 34,000, Silver 100,000, Gold 230,000, Platinum 360,000 and Astral 500,000.'),
  L2('Mascotas, anillos, comida y familia suman algo más.', 'Pets, rings, food and family add a bit more.')]; }
{ const i = GSIS.findIndex(x => x[0] === 'titulos'); if (i >= 0) GSIS[i][2] = () => [L2('Se equipan en el Armario › Títulos y salen encima de tu personaje (online también). Se ganan así:', 'Equip them in Wardrobe › Titles; they show above your character (online too). How to earn them:')].concat(TITLES.map(t => '· ' + t[1] + ' — ' + t[4])); }

// ---------- el equipo de tu familia es suyo: no se puede quitar ----------
{ const _ok = openKid; openKid = function (e) { const r = _ok.apply(this, arguments); try { const k = e && e.kid; if (!k) return r;
      $$('[data-kun]').forEach(b => { const sl = b.dataset.kun, s = k.equip && k.equip[sl]; if (!s) return; const sm = b.querySelector('small'); if (sm) sm.textContent = ({ weapon: L2('Arma', 'Weapon'), head: L2('Cabeza', 'Head'), body: L2('Torso', 'Torso'), legs: L2('Piernas', 'Legs'), feet: L2('Pies', 'Feet') })[sl] + ' · ' + L2('es suyo', 'it\'s theirs');
        b.onclick = () => toast(L2('El equipo de ', 'The gear of ') + k.name + L2(' es suyo: no se lo puedes quitar. Sí puedes darle algo mejor.', ' is theirs: you can\'t take it. You can give them something better.'), 'info', 4); });
      // al darle algo, lo que llevaba se queda en su propia mochila (no vuelve a la tuya)
      const P = G.P; $$('[data-keq]').forEach(b => b.onclick = () => { const s = P.inv[+b.dataset.keq]; if (!s) return; const sl = ITEMS[s.id].slot; P.inv.splice(+b.dataset.keq, 1); if (k.equip[sl]) { k.inv = k.inv || []; k.inv.push(k.equip[sl]); } k.equip[sl] = s; sfx('equip'); refreshKidAtlas(k); uiDirty.inv = true; markDirty(true); openKid(e); }); } catch (x) { } return r; }; }

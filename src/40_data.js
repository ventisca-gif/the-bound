// ================= GAME DATA =================
const MAXLV = 350;   // v4.18: el Continente del Velo Roto sube el máximo a 350
const xpToNext = L => Math.floor(40 * Math.pow(L, 1.5) + 60);
const jobXpToNext = L => Math.floor(26 * Math.pow(L, 1.45) + 24);
const JOBS = {
  tala: { n: 'Tala', icon: 'axe', desc: 'Corta árboles para obtener troncos. Árboles mejores piden más nivel y mejor hacha.' },
  mineria: { n: 'Minería', icon: 'pick', desc: 'Pica vetas de mineral. Los metales raros requieren más nivel y mejor pico.' },
  pesca: { n: 'Pesca', icon: 'rod', desc: 'Pesca en ríos, lagos y el mar. Cada aguas tiene sus peces.' },
  herbo: { n: 'Herboristería', icon: 'herb', desc: 'Recolecta hierbas y flores para la alquimia y la cocina.' },
  herreria: { n: 'Herrería', icon: 'anvil', desc: 'Forja armas, armaduras y herramientas en las herrerías.' },
  alquimia: { n: 'Alquimia', icon: 'potion', desc: 'Prepara pociones en el caldero de los alquimistas.' },
  cocina: { n: 'Cocina', icon: 'food', desc: 'Cocina pescado y hierbas en las posadas para obtener mejoras.' },
};
const JOBMAX = 75;
const RESLV = [0, 1, 8, 16, 24, 32, 40, 48, 56, 62, 68, 74];
const CLASSES = {
  guerrero: { n: 'Guerrero', desc: 'Domina la espada. Resiste golpes y arrasa cuerpo a cuerpo.', base: { str: 10, int: 3, dex: 5, vit: 10 }, grow: { str: 2, int: 0.4, dex: 0.8, vit: 1.6 }, hp: 140, mp: 40, main: 'str', weapon: 'sword', range: 30, aspd: 0.42, color: '#c83444' },
  mago: { n: 'Mago', desc: 'Fuego, hielo y magia arcana. Frágil, pero letal a distancia.', base: { str: 3, int: 12, dex: 5, vit: 6 }, grow: { str: 0.4, int: 2.4, dex: 0.8, vit: 1 }, hp: 95, mp: 110, main: 'int', weapon: 'staff', range: 130, aspd: 0.52, color: '#6e5ebc' },
  arquero: { n: 'Arquero', desc: 'Precisión y movilidad. Castiga desde lejos con críticos.', base: { str: 4, int: 4, dex: 12, vit: 8 }, grow: { str: 0.7, int: 0.6, dex: 2.3, vit: 1.2 }, hp: 115, mp: 60, main: 'dex', weapon: 'bow', range: 140, aspd: 0.44, color: '#4e9656' },
  asesino: { n: 'Asesino', desc: 'Veloz y letal. Críticos, venenos y movimientos sombríos.', base: { str: 6, int: 3, dex: 12, vit: 7 }, grow: { str: 0.9, int: 0.5, dex: 2.3, vit: 1.1 }, hp: 110, mp: 55, main: 'dex', weapon: 'dagger', range: 24, aspd: 0.34, color: '#b01e2e' },
  bardo: { n: 'Bardo', desc: 'Música mágica: notas que hieren, canciones que curan y fortalecen al grupo.', base: { str: 4, int: 10, dex: 8, vit: 8 }, grow: { str: 0.5, int: 2.1, dex: 1.1, vit: 1.35 }, hp: 120, mp: 95, main: 'int', weapon: 'lute', range: 115, aspd: 0.46, color: '#e0a030' },
  invocador: { n: 'Invocador', desc: 'Guadaña de la muerte. Captura las almas de los enemigos e invoca hasta 3 espíritus.', base: { str: 6, int: 11, dex: 4, vit: 7 }, grow: { str: 0.8, int: 2.2, dex: 0.5, vit: 1.25 }, hp: 108, mp: 100, main: 'int', weapon: 'scythe', range: 34, aspd: 0.55, color: '#3a8ae0' },
};
// ---------- skills ----------
const BR = { guerrero: ['Espada', 'Bastión', 'Furia'], mago: ['Fuego', 'Hielo', 'Arcano'], arquero: ['Precisión', 'Naturaleza', 'Agilidad'], asesino: ['Sombras', 'Veneno', 'Danza'], bardo: ['Melodía', 'Armonía', 'Ritmo'], invocador: ['Almas', 'Muerte', 'Maldición'] };
const SK = {};
function sk(id, cls, b, row, n, type, req, pre, o) { SK[id] = Object.assign({ id, cls, b, row, n, type, req, pre, max: 10 }, o); }
// guerrero
sk('g1', 'guerrero', 0, 0, 'Tajo Poderoso', 'act', 1, null, { mp: 8, cd: 4, icon: ['slash', '#e8e8f0'], eff: { k: 'slash', m: 1.8, mr: 0.15, arc: 2.4, r: 34, kb: 60 }, d: 'Un tajo amplio que golpea a todos los enemigos al frente con {m}% de ataque.' });
sk('g2', 'guerrero', 0, 1, 'Torbellino', 'act', 8, 'g1', { mp: 18, cd: 9, icon: ['spin', '#e8e8f0'], eff: { k: 'spin', m: 0.7, mr: 0.06, r: 38, hits: 4 }, d: 'Giras con la espada golpeando 4 veces alrededor ({m}% cada golpe).' });
sk('g3', 'guerrero', 0, 2, 'Maestría de Espada', 'pas', 15, 'g1', { icon: ['up', '#ffd040'], pas: { atkP: 3 }, d: 'Aumenta el ataque en {atkP}%.' });
sk('g4', 'guerrero', 0, 3, 'Juicio Final', 'act', 45, 'g2', { mp: 40, cd: 20, icon: ['slam', '#ffd040'], eff: { k: 'slam', m: 4, mr: 0.4, r: 46, stun: 1.5, front: 24 }, d: 'Golpe devastador al suelo: {m}% de daño en área y aturde 1.5 s.' });
sk('g5', 'guerrero', 1, 0, 'Piel de Hierro', 'pas', 3, null, { icon: ['shield', '#9aa6c0'], pas: { defP: 4 }, d: 'Aumenta la defensa en {defP}%.' });
sk('g6', 'guerrero', 1, 1, 'Grito de Guerra', 'act', 10, 'g5', { mp: 20, cd: 25, icon: ['shout', '#ff8a3a'], eff: { k: 'buff', dur: 12, st: { atkP: 15, defP: 15 }, str: { atkP: 2, defP: 2 } }, d: 'Durante 12 s: +{atkP}% ataque y +{defP}% defensa.' });
sk('g7', 'guerrero', 1, 2, 'Vitalidad', 'pas', 18, 'g5', { icon: ['heart', '#e84050'], pas: { hpP: 4 }, d: 'Aumenta la vida máxima en {hpP}%.' });
sk('g8', 'guerrero', 1, 3, 'Baluarte', 'act', 35, 'g6', { mp: 30, cd: 30, icon: ['shield', '#ffd040'], eff: { k: 'shield', p: 20, pr: 3, dur: 8 }, d: 'Un escudo que absorbe daño igual al {p}% de tu vida máxima (8 s).' });
sk('g9', 'guerrero', 2, 0, 'Carga', 'act', 5, null, { mp: 12, cd: 7, icon: ['dash', '#e8e8f0'], eff: { k: 'dash', dist: 96, m: 1.4, mr: 0.12, stun: 0.6 }, d: 'Embistes hacia delante con {m}% de daño y aturdes 0.6 s.' });
sk('g10', 'guerrero', 2, 1, 'Sed de Sangre', 'pas', 12, 'g9', { icon: ['drop', '#c02030'], pas: { life: 1 }, d: 'Recuperas el {life}% del daño infligido como vida.' });
sk('g11', 'guerrero', 2, 2, 'Golpe Sísmico', 'act', 25, 'g9', { mp: 28, cd: 12, icon: ['slam', '#c8a060'], eff: { k: 'slam', m: 2.2, mr: 0.2, r: 50, stun: 1, front: 30 }, d: 'Partes la tierra al frente: {m}% de daño y aturdes 1 s.' });
sk('g12', 'guerrero', 2, 3, 'Avatar de Guerra', 'act', 60, 'g11', { mp: 60, cd: 60, icon: ['star', '#ff4040'], eff: { k: 'buff', dur: 15, st: { atkP: 40, aspdP: 20 }, str: { atkP: 3 } }, d: 'Durante 15 s: +{atkP}% ataque y +20% velocidad de ataque.' });
// mago
sk('m1', 'mago', 0, 0, 'Bola de Fuego', 'act', 1, null, { mp: 10, cd: 2.5, icon: ['fire', '#ff7020'], eff: { k: 'proj', m: 1.9, mr: 0.15, spd: 190, ex: 26, burn: 1, art: 'fire' }, d: 'Lanza una bola de fuego que explota: {m}% de daño en área y quema.' });
sk('m2', 'mago', 0, 1, 'Ignición', 'pas', 8, 'm1', { icon: ['fire', '#ffd040'], pas: { fireP: 5 }, d: 'Tus hechizos de fuego hacen +{fireP}% de daño.' });
sk('m3', 'mago', 0, 2, 'Lluvia de Meteoros', 'act', 22, 'm1', { mp: 35, cd: 14, icon: ['meteor', '#ff7020'], eff: { k: 'rain', m: 1.6, mr: 0.12, n: 6, r: 26, area: 64, art: 'meteor', fire: 1 }, d: 'Caen 6 meteoros sobre la zona objetivo: {m}% de daño cada uno.' });
sk('m4', 'mago', 0, 3, 'Inferno', 'act', 50, 'm3', { mp: 70, cd: 30, icon: ['nova', '#ff4010'], eff: { k: 'nova', m: 4, mr: 0.3, r: 76, burn: 1, art: 'fire', fire: 1 }, d: 'Una explosión de fuego a tu alrededor: {m}% de daño y quema.' });
sk('m5', 'mago', 1, 0, 'Lanza de Hielo', 'act', 3, null, { mp: 9, cd: 3, icon: ['ice', '#7ad0ff'], eff: { k: 'proj', m: 1.5, mr: 0.12, spd: 230, pierce: 1, slow: 2, art: 'ice' }, d: 'Una lanza que atraviesa enemigos: {m}% de daño y ralentiza.' });
sk('m6', 'mago', 1, 1, 'Nova Helada', 'act', 12, 'm5', { mp: 22, cd: 12, icon: ['nova', '#7ad0ff'], eff: { k: 'nova', m: 1.2, mr: 0.1, r: 54, freeze: 1.5, art: 'ice' }, d: 'Congela a los enemigos cercanos 1.5 s con {m}% de daño.' });
sk('m7', 'mago', 1, 2, 'Armadura de Escarcha', 'act', 20, 'm6', { mp: 25, cd: 30, icon: ['shield', '#7ad0ff'], eff: { k: 'buff', dur: 20, st: { defP: 25 }, str: { defP: 3 } }, d: 'Durante 20 s: +{defP}% defensa.' });
sk('m8', 'mago', 1, 3, 'Ventisca', 'act', 40, 'm6', { mp: 50, cd: 22, icon: ['snow', '#bfefff'], eff: { k: 'field', m: 0.9, mr: 0.08, r: 52, ticks: 8, slow: 1.5, art: 'ice' }, d: 'Una ventisca de 8 golpes en la zona: {m}% por golpe y ralentiza.' });
sk('m9', 'mago', 2, 0, 'Teletransporte', 'act', 6, null, { mp: 12, cd: 6, icon: ['blink', '#c070ff'], eff: { k: 'blink', dist: 96 }, d: 'Te teletransportas hacia delante.' });
sk('m10', 'mago', 2, 1, 'Maestría Arcana', 'pas', 10, null, { icon: ['up', '#c070ff'], pas: { atkP: 4 }, d: 'Aumenta tu poder mágico (ataque) en {atkP}%.' });
sk('m11', 'mago', 2, 2, 'Escudo Arcano', 'act', 18, 'm9', { mp: 30, cd: 25, icon: ['shield', '#c070ff'], eff: { k: 'shield', p: 25, pr: 3, dur: 10 }, d: 'Un escudo que absorbe el {p}% de tu vida máxima (10 s).' });
sk('m12', 'mago', 2, 3, 'Recarga de Maná', 'pas', 25, 'm10', { icon: ['drop', '#4a8aff'], pas: { mpReg: 1 }, d: 'Recuperas {mpReg} de maná por segundo.' });
// arquero
sk('a1', 'arquero', 0, 0, 'Disparo Cargado', 'act', 1, null, { mp: 8, cd: 3, icon: ['arrow', '#ffd040'], eff: { k: 'proj', m: 2, mr: 0.18, spd: 300, pierce: 1, art: 'bigarrow' }, d: 'Una flecha potente que atraviesa: {m}% de daño.' });
sk('a2', 'arquero', 0, 1, 'Ojo de Águila', 'pas', 6, 'a1', { icon: ['eye', '#ffd040'], pas: { crit: 2 }, d: 'Aumenta la probabilidad de crítico en {crit}%.' });
sk('a3', 'arquero', 0, 2, 'Disparo Mortal', 'act', 30, 'a2', { mp: 30, cd: 12, icon: ['arrow', '#ff4040'], eff: { k: 'proj', m: 4.5, mr: 0.35, spd: 340, pierce: 1, critB: 50, art: 'bigarrow' }, d: 'Un disparo letal con {m}% de daño y +50% de crítico.' });
sk('a4', 'arquero', 0, 3, 'Tormenta de Flechas', 'act', 55, 'a3', { mp: 60, cd: 25, icon: ['rain', '#ffd040'], eff: { k: 'rain', m: 1.4, mr: 0.1, n: 14, r: 20, area: 76, art: 'arrowrain' }, d: '14 flechas caen del cielo: {m}% de daño cada una.' });
sk('a5', 'arquero', 1, 0, 'Flecha Venenosa', 'act', 4, null, { mp: 8, cd: 4, icon: ['arrow', '#6ae04a'], eff: { k: 'proj', m: 1.2, mr: 0.1, spd: 280, poison: 4, art: 'arrow' }, d: '{m}% de daño y envenena durante 4 s.' });
sk('a6', 'arquero', 1, 1, 'Trampa de Raíces', 'act', 14, 'a5', { mp: 18, cd: 14, icon: ['root', '#6ae04a'], eff: { k: 'nova', m: 1.5, mr: 0.1, r: 46, root: 2.5, art: 'root' }, d: 'Raíces atrapan a los enemigos cercanos 2.5 s con {m}% de daño.' });
sk('a7', 'arquero', 1, 2, 'Espíritu del Bosque', 'act', 24, 'a6', { mp: 30, cd: 30, icon: ['leaf', '#8aff6a'], eff: { k: 'heal', p: 20, pr: 2 }, d: 'Recuperas el {p}% de tu vida máxima.' });
sk('a8', 'arquero', 1, 3, 'Lluvia de Flechas', 'act', 38, 'a6', { mp: 32, cd: 14, icon: ['rain', '#8aff6a'], eff: { k: 'rain', m: 1.2, mr: 0.1, n: 9, r: 18, area: 56, art: 'arrowrain' }, d: '9 flechas caen sobre la zona: {m}% de daño cada una.' });
sk('a9', 'arquero', 2, 0, 'Voltereta', 'act', 3, null, { mp: 6, cd: 5, icon: ['dash', '#e8e8f0'], eff: { k: 'dash', dist: 80, m: 0, inv: 1 }, d: 'Ruedas hacia delante esquivando todo daño.' });
sk('a10', 'arquero', 2, 1, 'Disparo Múltiple', 'act', 10, 'a9', { mp: 14, cd: 6, icon: ['multi', '#e8e8f0'], eff: { k: 'proj', m: 0.9, mr: 0.08, spd: 280, n: 5, spread: 0.7, art: 'arrow' }, d: 'Disparas 5 flechas en abanico: {m}% de daño cada una.' });
sk('a11', 'arquero', 2, 2, 'Pies Ligeros', 'pas', 16, 'a9', { icon: ['boot', '#e8e8f0'], pas: { spdP: 2, aspdP: 2 }, d: '+{spdP}% velocidad de movimiento y +{aspdP}% velocidad de ataque.' });
sk('a12', 'arquero', 2, 3, 'Furia del Cazador', 'act', 45, 'a10', { mp: 45, cd: 45, icon: ['star', '#ffd040'], eff: { k: 'buff', dur: 12, st: { aspdP: 35, crit: 20 }, str: { aspdP: 3 } }, d: 'Durante 12 s: +{aspdP}% velocidad de ataque y +20% de crítico.' });
// asesino
sk('s1', 'asesino', 0, 0, 'Golpe Sombrío', 'act', 1, null, { mp: 10, cd: 5, icon: ['blink', '#b01e2e'], eff: { k: 'shadow', m: 2, mr: 0.18 }, d: 'Apareces tras el enemigo más cercano y lo golpeas con {m}%.' });
sk('s2', 'asesino', 0, 1, 'Golpe Crítico', 'pas', 6, null, { icon: ['skull', '#ffd040'], pas: { critD: 6, crit: 1 }, d: '+{critD}% de daño crítico y +{crit}% de crítico.' });
sk('s3', 'asesino', 0, 2, 'Invisibilidad', 'act', 20, 's1', { mp: 25, cd: 25, icon: ['eye', '#8a70b0'], eff: { k: 'buff', dur: 5, st: { invis: 1, ambush: 200 }, str: { ambush: 15 } }, d: 'Te vuelves invisible 5 s. Tu siguiente ataque hace +{ambush}%.' });
sk('s4', 'asesino', 0, 3, 'Marca de Muerte', 'act', 50, 's3', { mp: 50, cd: 30, icon: ['skull', '#ff4040'], eff: { k: 'mark', m: 3, mr: 0.25, p: 30, pr: 3 }, d: 'Marcas al enemigo: recibe +{p}% de daño 10 s y un golpe de {m}%.' });
sk('s5', 'asesino', 1, 0, 'Hoja Envenenada', 'act', 4, null, { mp: 15, cd: 20, icon: ['drop', '#6ae04a'], eff: { k: 'buff', dur: 12, st: { poisonHit: 1 }, str: {} }, d: 'Durante 12 s tus golpes envenenan.' });
sk('s6', 'asesino', 1, 1, 'Nube Tóxica', 'act', 14, 's5', { mp: 22, cd: 14, icon: ['cloud', '#6ae04a'], eff: { k: 'field', m: 0.6, mr: 0.06, r: 46, ticks: 8, poison: 3, art: 'poison', self: 1 }, d: 'Una nube tóxica a tu alrededor: 8 golpes de {m}% y veneno.' });
sk('s7', 'asesino', 1, 2, 'Toxinas', 'pas', 22, 's5', { icon: ['up', '#6ae04a'], pas: { vsPoison: 5 }, d: '+{vsPoison}% de daño contra enemigos envenenados.' });
sk('s8', 'asesino', 1, 3, 'Lanzar Dagas', 'act', 10, null, { mp: 12, cd: 5, icon: ['multi', '#e8e8f0'], eff: { k: 'proj', m: 0.9, mr: 0.08, spd: 300, n: 4, spread: 0.5, art: 'dagger' }, d: 'Lanzas 4 dagas en abanico: {m}% de daño cada una.' });
sk('s9', 'asesino', 2, 0, 'Danza de Cuchillas', 'act', 8, null, { mp: 16, cd: 8, icon: ['spin', '#b01e2e'], eff: { k: 'spin', m: 0.5, mr: 0.05, r: 32, hits: 6 }, d: 'Giras cortando 6 veces a tu alrededor ({m}% cada golpe).' });
sk('s10', 'asesino', 2, 1, 'Evasión', 'pas', 12, 's9', { icon: ['boot', '#8a70b0'], pas: { dodge: 1.5 }, d: '{dodge}% de probabilidad de esquivar ataques.' });
sk('s11', 'asesino', 2, 2, 'Paso Veloz', 'pas', 18, 's9', { icon: ['boot', '#e8e8f0'], pas: { spdP: 2, aspdP: 2 }, d: '+{spdP}% velocidad de movimiento y +{aspdP}% de ataque.' });
sk('s12', 'asesino', 2, 3, 'Mil Cortes', 'act', 60, 's11', { mp: 60, cd: 40, icon: ['star', '#ff4040'], eff: { k: 'flurry', m: 0.6, mr: 0.05, hits: 10 }, d: 'Desatas 10 cortes veloces sobre el enemigo: {m}% cada uno.' });
// ---------- items ----------
const TIER = [null,
  { k: 'madera', m: 'de Madera', f: 'de Madera', mp: 'de Madera', fp: 'de Madera', lv: 1, p: 1 }, { k: 'cobre', m: 'de Cobre', f: 'de Cobre', mp: 'de Cobre', fp: 'de Cobre', lv: 3, p: 2 }, { k: 'hierro', m: 'de Hierro', f: 'de Hierro', mp: 'de Hierro', fp: 'de Hierro', lv: 12, p: 3 }, { k: 'acero', m: 'de Acero', f: 'de Acero', mp: 'de Acero', fp: 'de Acero', lv: 20, p: 4 },
  { k: 'plata', m: 'de Plata', f: 'de Plata', mp: 'de Plata', fp: 'de Plata', lv: 30, p: 5 }, { k: 'oro', m: 'Dorado', f: 'Dorada', mp: 'Dorados', fp: 'Doradas', lv: 40, p: 6 }, { k: 'mithril', m: 'de Mithril', f: 'de Mithril', mp: 'de Mithril', fp: 'de Mithril', lv: 50, p: 7 },
  { k: 'adamantita', m: 'de Adamantita', f: 'de Adamantita', mp: 'de Adamantita', fp: 'de Adamantita', lv: 62, p: 8 }, { k: 'runico', m: 'Rúnico', f: 'Rúnica', mp: 'Rúnicos', fp: 'Rúnicas', lv: 75, p: 9 }, { k: 'draco', m: 'Dracónico', f: 'Dracónica', mp: 'Dracónicos', fp: 'Dracónicas', lv: 88, p: 10 }, { k: 'vinculo', m: 'del Vínculo', f: 'del Vínculo', mp: 'del Vínculo', fp: 'del Vínculo', lv: 98, p: 11 },
  { k: 'oricalco', m: 'de Oricalco', f: 'de Oricalco', mp: 'de Oricalco', fp: 'de Oricalco', lv: 106, p: 12 }, { k: 'celestial', m: 'Celestial', f: 'Celestial', mp: 'Celestiales', fp: 'Celestiales', lv: 118, p: 13 }, { k: 'abisal', m: 'Abisal', f: 'Abisal', mp: 'Abisales', fp: 'Abisales', lv: 130, p: 14 }, { k: 'eclipse', m: 'del Eclipse', f: 'del Eclipse', mp: 'del Eclipse', fp: 'del Eclipse', lv: 142, p: 15 }];
const ITEMS = {};
function it(id, o) { ITEMS[id] = Object.assign({ id, stack: false, price: 1, rar: 0 }, o); }
const WBASE = { guerrero: ['Espada', 'f', 'sword', 1.0], mago: ['Báculo', 'm', 'staff', 1.04], arquero: ['Arco', 'm', 'bow', 0.96], asesino: ['Dagas', 'fp', 'dagger', 0.82], bardo: ['Laúd', 'm', 'lute', 0.98], invocador: ['Guadaña', 'f', 'scythe', 0.92] };
for (let t = 1; t <= 15; t++) {
  const T_ = TIER[t], rar = t >= 12 ? 5 : t >= 11 ? 4 : t >= 9 ? 3 : t >= 6 ? 2 : t >= 3 ? 1 : 0;
  for (const c in WBASE) { const [bn, g, art, mul] = WBASE[c]; const atk = Math.round((8 + T_.lv * 3.1 + t * 5) * mul);
    it(`w_${c}_${t}`, { n: `${bn} ${T_[g]}`, t: 'weapon', slot: 'weapon', cls: c, lv: T_.lv, tier: t, atk, crit: c === 'arquero' ? t : c === 'asesino' ? t * 1.5 : 0, mpB: c === 'mago' || c === 'invocador' ? t * 12 : c === 'bardo' ? t * 9 : 0, price: Math.round(20 * Math.pow(t, 2.3)), icon: [art, t], rar }); }
  const def = 3 + T_.lv * 1.4 + t * 2;
  it(`h_${t}`, { n: `Casco ${T_.m}`, t: 'armor', slot: 'head', lv: T_.lv, tier: t, def: Math.round(def * 0.45), hpB: Math.round(T_.lv * 1.5), price: Math.round(14 * Math.pow(t, 2.3)), icon: ['helm', t], rar });
  it(`b_${t}`, { n: `Armadura ${T_.f}`, t: 'armor', slot: 'body', lv: T_.lv, tier: t, def: Math.round(def), hpB: Math.round(T_.lv * 3.5), price: Math.round(20 * Math.pow(t, 2.3)), icon: ['armor', t], rar });
  it(`l_${t}`, { n: `Grebas ${T_.fp}`, t: 'armor', slot: 'legs', lv: T_.lv, tier: t, def: Math.round(def * 0.6), hpB: Math.round(T_.lv * 2), price: Math.round(16 * Math.pow(t, 2.3)), icon: ['legs', t], rar });
  it(`f_${t}`, { n: `Botas ${T_.fp}`, t: 'armor', slot: 'feet', lv: T_.lv, tier: t, def: Math.round(def * 0.35), spdB: Math.min(t, 8), price: Math.round(12 * Math.pow(t, 2.3)), icon: ['boots', t], rar });
}
const TOOLT = [null, ['de Cobre', 1, 2], ['de Hierro', 10, 3], ['de Mithril', 30, 7], ['Rúnico', 55, 9]];
for (let t = 1; t <= 4; t++) { const [adj, lv, ti] = TOOLT[t]; it(`hacha${t}`, { n: `Hacha ${adj}`, t: 'tool', tool: 'tala', power: t, lv, price: 30 * t * t, icon: ['axe', ti] }); it(`pico${t}`, { n: `Pico ${adj}`, t: 'tool', tool: 'mineria', power: t, lv, price: 30 * t * t, icon: ['pick', ti] }); it(`cana${t}`, { n: `Caña ${t === 4 ? 'Rúnica' : adj}`, t: 'tool', tool: 'pesca', power: t, lv, price: 30 * t * t, icon: ['rod', ti] }); }
const LOGN = [null, 'Roble', 'Pino', 'Abedul', 'Ébano', 'Sauce', 'Pino Escarchado', 'Ceniza'], OREN = [null, 'Cobre', 'Hierro', 'Plata', 'Oro', 'Mithril', 'Adamantita', 'Cristal Rúnico'];
for (let t = 1; t <= 7; t++) {
  it(`log${t}`, { n: `Tronco de ${LOGN[t]}`, t: 'mat', stack: true, tier: t, price: 4 * t * t, icon: ['log', t] });
  it(`ore${t}`, { n: t === 7 ? 'Cristal Rúnico' : `Mineral de ${OREN[t]}`, t: 'mat', stack: true, tier: t, price: 5 * t * t, icon: ['ore', t] });
  it(`herb${t}`, { n: HERB[t][0], t: 'mat', stack: true, tier: t, price: 4 * t * t, icon: ['herb', t] });
}
const FISH = [
  ['sardina', 'Sardina', 1, ['mar'], '#9ab0c8'], ['trucha', 'Trucha', 1, ['rio'], '#a8a878'], ['carpa', 'Carpa', 1, ['lago'], '#c8a058'],
  ['lubina', 'Lubina', 2, ['mar'], '#7a9ab8'], ['salmon', 'Salmón', 2, ['rio', 'lago'], '#e88a6a'], ['perca', 'Perca', 2, ['lago', 'pantano'], '#8aa858'],
  ['pezglobo', 'Pez Globo', 3, ['mar'], '#d8c060'], ['anguila', 'Anguila', 3, ['pantano', 'rio'], '#4a5a3a'], ['lucio', 'Lucio', 3, ['lago', 'rio'], '#6a8a4a'],
  ['pezespada', 'Pez Espada', 4, ['mar'], '#5a7aa8'], ['truchadorada', 'Trucha Dorada', 4, ['rio'], '#f0c040'], ['pezluna', 'Pez Luna', 4, ['lago', 'pantano'], '#c8c8e8'],
  ['pezhielo', 'Pez de Hielo', 5, ['hielo'], '#9ae0ff'], ['pezlinterna', 'Pez Linterna', 5, ['pantano', 'mar'], '#ffe060'],
  ['atunreal', 'Atún Real', 6, ['mar'], '#3a5a8a'], ['koi', 'Koi Celestial', 6, ['lago', 'hielo'], '#ff6a3a'], ['pezdragon', 'Pez Dragón', 7, ['nhar', 'mar'], '#e0302a'],
];
for (const [id, n, t, hab, col] of FISH) it(id, { n, t: 'mat', fish: true, stack: true, tier: t, hab, price: 6 * t * t + 4, icon: ['fish', col], rar: t >= 7 ? 3 : t >= 5 ? 2 : t >= 3 ? 1 : 0 });
const DROPS = [['gel', 'Gel de Slime', 1, ['gel', '#6ad04a']], ['piel', 'Piel de Lobo', 2, ['pelt', '#8a8a9a']], ['colmillo', 'Colmillo de Jabalí', 2, ['fang', '#f0ead0']], ['espora', 'Espora Mágica', 2, ['spore', '#e04a3a']], ['caparazon', 'Caparazón', 1, ['shell', '#e04a20']],
  ['oreja', 'Oreja de Goblin', 3, ['ear', '#68a03a']], ['tela', 'Tela Robada', 3, ['cloth', '#8a603c']], ['garra', 'Garra de Oso', 4, ['fang', '#d8d0b8']], ['colmilloorco', 'Colmillo de Orco', 4, ['fang', '#e8e0c8']], ['ala', 'Ala de Murciélago', 3, ['wing', '#46305c']],
  ['ecto', 'Ectoplasma', 5, ['gel', '#b0c8e8']], ['hueso', 'Hueso Antiguo', 5, ['bone', '#e0d8c2']], ['nucleo', 'Núcleo de Gólem', 6, ['core', '#ffd060']], ['cristalhielo', 'Cristal de Hielo', 6, ['crystal', '#9ae0ff']], ['pelaje', 'Pelaje de Yeti', 6, ['pelt', '#e8ecf2']],
  ['brasa', 'Brasa Eterna', 7, ['core', '#ff6a1a']], ['esencia', 'Esencia Oscura', 7, ['core', '#a040e0']], ['escama', 'Escama de Dragón', 8, ['scale', '#c43a1c']]];
for (const [id, n, t, icon] of DROPS) it(id, { n, t: 'mat', stack: true, tier: t, price: 5 * t * t + 3, icon });
// consumables
it('pocion1', { n: 'Poción de Vida Pequeña', t: 'cons', stack: true, heal: 120, price: 15, icon: ['potion', '#e02838'] });
it('pocion2', { n: 'Poción de Vida', t: 'cons', stack: true, heal: 420, price: 60, lv: 12, icon: ['potion', '#e02838'] });
it('pocion3', { n: 'Poción de Vida Grande', t: 'cons', stack: true, heal: 1400, price: 220, lv: 35, icon: ['potion2', '#ff3048'], rar: 1 });
it('pocion4', { n: 'Poción de Vida Suprema', t: 'cons', stack: true, heal: 4200, price: 700, lv: 65, icon: ['potion2', '#ff6a8a'], rar: 2 });
it('eter1', { n: 'Poción de Maná Pequeña', t: 'cons', stack: true, mana: 60, price: 18, icon: ['potion', '#2a64e0'] });
it('eter2', { n: 'Poción de Maná', t: 'cons', stack: true, mana: 200, price: 70, lv: 12, icon: ['potion', '#2a64e0'] });
it('eter3', { n: 'Poción de Maná Grande', t: 'cons', stack: true, mana: 600, price: 240, lv: 35, icon: ['potion2', '#3a80ff'], rar: 1 });
it('eter4', { n: 'Poción de Maná Suprema', t: 'cons', stack: true, mana: 1800, price: 750, lv: 65, icon: ['potion2', '#6aa0ff'], rar: 2 });
it('elixir', { n: 'Elixir del Vínculo', t: 'cons', stack: true, heal: 99999, mana: 99999, price: 1500, lv: 40, icon: ['potion2', '#ffd040'], rar: 3 });
it('antidoto', { n: 'Antídoto', t: 'cons', stack: true, cure: 1, price: 20, icon: ['potion', '#6ae04a'] });
it('retorno', { n: 'Pergamino de Retorno', t: 'cons', stack: true, recall: 1, price: 60, icon: ['scroll', '#4ad8f0'] });
const FOODS = [[1, 'Sardinas Asadas', 60, 5], [2, 'Salmón a la Brasa', 200, 8], [3, 'Sopa de Anguila', 600, 10], [4, 'Pez Espada al Limón', 1500, 12], [5, 'Guiso de Pez Luna', 3000, 14], [6, 'Banquete del Puerto', 5000, 16], [7, 'Festín del Dragón', 9000, 20]];
for (const [t, n, heal, buff] of FOODS) it('food' + t, { n, t: 'cons', stack: true, heal, food: buff, tier: t, price: 25 * t * t, icon: ['food', t], rar: t >= 6 ? 2 : t >= 4 ? 1 : 0 });
// accessories (boss drops)
const ACCS = [['acc_gel', 'Amuleto de Gel', { hpB: 120, def: 6 }, 8, 1], ['acc_bosque', 'Anillo del Bosque', { atk: 20, hpB: 200 }, 18, 2], ['acc_gruk', 'Colmillo de Gruk', { atk: 55, crit: 4 }, 34, 2], ['acc_bruja', 'Anillo de la Bruja', { mpB: 250, atk: 60 }, 46, 3],
  ['acc_vael', 'Corona de Vael', { crit: 10, atk: 90, def: 30 }, 60, 3], ['acc_hielo', 'Corazón de Escarcha', { def: 120, hpB: 1500 }, 74, 3], ['acc_dragon', 'Escama de Ignaroth', { atk: 220, crit: 8, hpB: 1000 }, 86, 4], ['acc_vinculo', 'Sello del Vínculo', { atk: 400, def: 200, hpB: 4000, mpB: 600, crit: 15 }, 98, 4],
  ['acc_insignia', 'Insignia Real', { def: 10, hpB: 100, spdB: 4 }, 9, 1], ['acc_cobre', 'Anillo de Cobre', { atk: 6 }, 5, 0], ['acc_plata', 'Anillo de Plata', { atk: 30, crit: 2 }, 30, 1], ['acc_mithril', 'Anillo de Mithril', { atk: 80, crit: 4, hpB: 400 }, 50, 2]];
for (const [id, n, st, lv, rar] of ACCS) it(id, Object.assign({ n, t: 'acc', slot: 'acc', lv, price: 40 * lv * (rar + 1), icon: ['ring', rar], rar }, st));
for (let k = 1; k <= 8; k++) it('frag' + k, { n: 'Fragmento del Vínculo ' + ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][k - 1], t: 'quest', stack: false, price: 0, icon: ['frag', k], rar: 4 });
// ---------- recipes ----------
const RECIPES = []; // {id, job, out, n, lv (player lv), jlv (job lv), gold, mats:[[id,n]]}
const TMATS = [null, [], [['ore1', 3]], [['ore2', 4], ['log2', 2]], [['ore2', 6], ['log3', 2], ['colmillo', 2]], [['ore3', 6], ['log3', 3], ['garra', 2]], [['ore4', 6], ['log4', 3], ['colmilloorco', 3]], [['ore5', 7], ['log5', 3], ['ecto', 3]], [['ore6', 7], ['log6', 3], ['nucleo', 2]], [['ore7', 6], ['log6', 4], ['cristalhielo', 3]], [['ore7', 9], ['log7', 4], ['escama', 2]], [['ore7', 12], ['log7', 6], ['escama', 4], ['esencia', 4]], [['ore8', 10], ['log8', 5], ['aguijon', 4]], [['ore9', 10], ['log9', 5], ['pieljaguar', 4], ['savia', 2]], [['ore10', 12], ['log10', 6], ['prisma', 4], ['polvoestelar', 2]], [['ore11', 14], ['log11', 6], ['esenciaeclipse', 5], ['ojovacio', 2]]];
for (let t = 1; t <= 15; t++) {
  const gold = Math.round(20 * Math.pow(t, 2.2)), jlv = t <= 2 ? 1 : Math.round((t - 2) * 4.6 + 3);
  const mats = TMATS[t]; const half = mats.map(([a, b]) => [a, Math.max(1, Math.ceil(b * 0.6))]);
  for (const c in WBASE) RECIPES.push({ id: `r_w_${c}_${t}`, job: 'herreria', out: `w_${c}_${t}`, n: 1, lv: TIER[t].lv, jlv, gold, mats: t === 1 ? [['log1', 2]] : mats, cat: 'arma', cls: c });
  RECIPES.push({ id: `r_b_${t}`, job: 'herreria', out: `b_${t}`, n: 1, lv: TIER[t].lv, jlv, gold, mats: t === 1 ? [] : mats, cat: 'armadura' });
  RECIPES.push({ id: `r_h_${t}`, job: 'herreria', out: `h_${t}`, n: 1, lv: TIER[t].lv, jlv, gold: Math.round(gold * 0.6), mats: t <= 2 ? [] : half, cat: 'armadura' });
  RECIPES.push({ id: `r_l_${t}`, job: 'herreria', out: `l_${t}`, n: 1, lv: TIER[t].lv, jlv, gold: Math.round(gold * 0.55), mats: t <= 2 ? [] : half, cat: 'armadura' });
  RECIPES.push({ id: `r_f_${t}`, job: 'herreria', out: `f_${t}`, n: 1, lv: TIER[t].lv, jlv, gold: Math.round(gold * 0.5), mats: t <= 2 ? [] : half, cat: 'armadura' });
}
for (let t = 1; t <= 4; t++) { const lv = TOOLT[t][1], m = [null, [['ore1', 2], ['log1', 2]], [['ore2', 4], ['log2', 3]], [['ore5', 5], ['log4', 4]], [['ore7', 5], ['log6', 4]]][t]; for (const k of ['hacha', 'pico', 'cana']) RECIPES.push({ id: `r_${k}${t}`, job: 'herreria', out: `${k}${t}`, n: 1, lv, jlv: (t - 1) * 8, gold: 30 * t * t, mats: m, cat: 'herramienta' }); }
RECIPES.push({ id: 'r_acc_cobre', job: 'herreria', out: 'acc_cobre', n: 1, lv: 5, jlv: 3, gold: 60, mats: [['ore1', 4]], cat: 'accesorio' }, { id: 'r_acc_plata', job: 'herreria', out: 'acc_plata', n: 1, lv: 30, jlv: 18, gold: 900, mats: [['ore3', 8], ['ore4', 2]], cat: 'accesorio' }, { id: 'r_acc_mithril', job: 'herreria', out: 'acc_mithril', n: 1, lv: 50, jlv: 30, gold: 4000, mats: [['ore5', 10], ['nucleo', 2]], cat: 'accesorio' });
[['pocion1', [['herb1', 2]], 1, 1, 5], ['pocion2', [['herb3', 2], ['herb1', 1], ['gel', 1]], 12, 10, 20], ['pocion3', [['herb5', 2], ['herb3', 1], ['ecto', 1]], 35, 24, 60], ['pocion4', [['herb7', 2], ['herb6', 1], ['brasa', 1]], 65, 40, 200],
['eter1', [['herb2', 1], ['herb1', 1]], 1, 4, 6], ['eter2', [['herb4', 2], ['espora', 1]], 12, 14, 24], ['eter3', [['herb6', 2], ['cristalhielo', 1]], 35, 28, 70], ['eter4', [['herb7', 2], ['esencia', 1]], 65, 42, 220],
['antidoto', [['herb2', 1], ['espora', 1]], 1, 2, 5], ['elixir', [['herb5', 1], ['herb6', 1], ['herb7', 1], ['escama', 1]], 40, 45, 400]].forEach(([out, mats, lv, jlv, gold]) => RECIPES.push({ id: 'r_' + out, job: 'alquimia', out, n: out.startsWith('poc') || out.startsWith('eter') ? 2 : 1, lv, jlv, gold, mats, cat: 'pocion' }));
[[1, [['sardina', 2]]], [2, [['salmon', 1], ['herb1', 1]]], [3, [['anguila', 1], ['herb3', 1]]], [4, [['pezespada', 1], ['herb2', 2]]], [5, [['pezluna', 1], ['herb5', 1]]], [6, [['atunreal', 1], ['koi', 1]]], [7, [['pezdragon', 1], ['herb7', 2]]]].forEach(([t, mats]) => RECIPES.push({ id: 'r_food' + t, job: 'cocina', out: 'food' + t, n: 2, lv: 1, jlv: (t - 1) * 7, gold: 5 * t, mats, cat: 'comida', alt: t === 1 ? ['trucha', 'carpa', 'sardina'] : t === 2 ? ['salmon', 'lubina', 'perca'] : t === 3 ? ['anguila', 'lucio', 'pezglobo'] : null }));
// ---------- monsters ----------
const MOBS = {
  slime_v: { n: 'Slime Verde', art: ['slime', 'green'], reg: ['valle'], lv: [1, 6], hp: 0.8, atk: 0.7, def: 0.6, spd: 34, ai: 'passive', fam: 'slime', drops: [['gel', 0.45]] },
  slime_a: { n: 'Slime Azul', art: ['slime', 'blue'], reg: ['costa', 'valle'], lv: [3, 10], hp: 0.9, atk: 0.8, def: 0.7, spd: 36, ai: 'passive', fam: 'slime', drops: [['gel', 0.45]] },
  hongo: { n: 'Hongo Saltarín', art: ['mush', ''], reg: ['valle', 'bosque'], lv: [3, 14], hp: 0.9, atk: 0.9, def: 0.8, spd: 40, ai: 'aggro', fam: 'hongo', drops: [['espora', 0.4]] },
  lobo: { n: 'Lobo', art: ['quad', 'lobo'], reg: ['valle', 'bosque', 'llanuras'], lv: [5, 20], hp: 1, atk: 1.1, def: 0.9, spd: 64, ai: 'aggro', fam: 'lobo', drops: [['piel', 0.45]] },
  cangrejo: { n: 'Cangrejo Coral', art: ['crab'], reg: ['costa'], lv: [4, 12], hp: 1.1, atk: 0.9, def: 1.3, spd: 38, ai: 'aggro', fam: 'cangrejo', drops: [['caparazon', 0.5]] },
  jabali: { n: 'Jabalí', art: ['quad', 'jabali'], reg: ['bosque', 'llanuras'], lv: [9, 20], hp: 1.3, atk: 1.1, def: 1, spd: 58, ai: 'charge', fam: 'jabali', drops: [['colmillo', 0.45]] },
  goblin: { n: 'Goblin', art: ['hum', 'goblin'], reg: ['bosque', 'llanuras', 'colinas'], lv: [12, 28], hp: 0.9, atk: 1.15, def: 0.9, spd: 54, ai: 'aggro', fam: 'goblin', group: 3, drops: [['oreja', 0.45], ['ore2', 0.1]] },
  bandido: { n: 'Bandido', art: ['hum', 'bandido'], reg: ['llanuras', 'arxar'], lv: [15, 28], hp: 1.1, atk: 1.2, def: 1, spd: 58, ai: 'aggro', fam: 'bandido', drops: [['tela', 0.45], ['pocion1', 0.1]] },
  lobosombra: { n: 'Lobo Sombrío', art: ['quad', 'sombra'], reg: ['arxar', 'nhar'], lv: [20, 92], hp: 1.1, atk: 1.25, def: 1, spd: 70, ai: 'aggro', fam: 'lobo', drops: [['piel', 0.4], ['esencia', 0.06]] },
  oso: { n: 'Oso Pardo', art: ['quad', 'oso'], reg: ['colinas', 'arxar'], lv: [24, 36], hp: 1.8, atk: 1.3, def: 1.2, spd: 48, ai: 'aggro', fam: 'oso', drops: [['garra', 0.45]] },
  orco: { n: 'Orco', art: ['hum', 'orco'], reg: ['colinas'], lv: [26, 38], hp: 1.5, atk: 1.3, def: 1.2, spd: 52, ai: 'aggro', fam: 'orco', group: 3, drops: [['colmilloorco', 0.45], ['ore3', 0.1]] },
  slime_m: { n: 'Slime Tóxico', art: ['slime', 'purple'], reg: ['pantano'], lv: [36, 44], hp: 1, atk: 1.1, def: 0.9, spd: 40, ai: 'aggro', fam: 'slime', poison: 1, drops: [['gel', 0.5], ['herb4', 0.1]] },
  hongo_v: { n: 'Hongo Venenoso', art: ['mush', 'veneno'], reg: ['pantano'], lv: [36, 46], hp: 1, atk: 1.2, def: 1, spd: 44, ai: 'aggro', fam: 'hongo', poison: 1, drops: [['espora', 0.5]] },
  fantasma: { n: 'Espectro', art: ['ghost', ''], reg: ['pantano', 'ruinas'], lv: [40, 56], hp: 1, atk: 1.3, def: 0.8, spd: 50, ai: 'ranged', fam: 'fantasma', drops: [['ecto', 0.45]] },
  murcielago: { n: 'Murciélago', art: ['bat', ''], reg: ['ruinas', 'pantano'], lv: [42, 52], hp: 0.7, atk: 1.1, def: 0.7, spd: 76, ai: 'aggro', fam: 'murcielago', fly: 1, drops: [['ala', 0.45]] },
  esqueleto: { n: 'Esqueleto', art: ['hum', 'esqueleto'], reg: ['ruinas'], lv: [46, 60], hp: 1.2, atk: 1.3, def: 1.3, spd: 50, ai: 'aggro', fam: 'esqueleto', group: 3, drops: [['hueso', 0.45], ['ore5', 0.08]] },
  golem: { n: 'Gólem de Piedra', art: ['hum', 'golem'], reg: ['ruinas', 'picos'], lv: [52, 72], hp: 2.2, atk: 1.4, def: 1.8, spd: 36, ai: 'aggro', fam: 'golem', drops: [['nucleo', 0.4], ['ore6', 0.12]] },
  lobohielo: { n: 'Lobo de Escarcha', art: ['quad', 'lobohielo'], reg: ['picos'], lv: [58, 68], hp: 1.2, atk: 1.3, def: 1.1, spd: 70, ai: 'aggro', fam: 'lobo', drops: [['cristalhielo', 0.4], ['piel', 0.3]] },
  slime_h: { n: 'Slime Helado', art: ['slime', 'ice'], reg: ['picos'], lv: [58, 64], hp: 1, atk: 1.1, def: 1, spd: 40, ai: 'aggro', fam: 'slime', drops: [['gel', 0.4], ['cristalhielo', 0.2]] },
  yeti: { n: 'Yeti', art: ['hum', 'yeti'], reg: ['picos'], lv: [64, 74], hp: 2, atk: 1.5, def: 1.4, spd: 48, ai: 'aggro', fam: 'yeti', drops: [['pelaje', 0.45]] },
  slime_r: { n: 'Slime de Magma', art: ['slime', 'red'], reg: ['nhar'], lv: [72, 82], hp: 1.1, atk: 1.3, def: 1, spd: 42, ai: 'aggro', fam: 'slime', burn: 1, drops: [['gel', 0.4], ['brasa', 0.2]] },
  murcifuego: { n: 'Murciélago Ígneo', art: ['bat', 'fuego'], reg: ['nhar'], lv: [76, 88], hp: 0.9, atk: 1.4, def: 0.9, spd: 80, ai: 'aggro', fam: 'murcielago', fly: 1, drops: [['ala', 0.3], ['brasa', 0.25]] },
  fantafuego: { n: 'Alma Ígnea', art: ['ghost', 'fuego'], reg: ['nhar'], lv: [80, 92], hp: 1.1, atk: 1.5, def: 1, spd: 52, ai: 'ranged', fam: 'fantasma', drops: [['ecto', 0.3], ['brasa', 0.25]] },
  caballero: { n: 'Caballero Oscuro', art: ['hum', 'caballero'], reg: ['nhar'], lv: [86, 100], hp: 1.8, atk: 1.6, def: 1.6, spd: 54, ai: 'aggro', fam: 'caballero', drops: [['esencia', 0.4], ['ore7', 0.12]] },
};
const BOSSES = {
  reyslime: { n: 'Rey Slime', lv: 8, art: ['slime', 'green', 2.6, true], hp: 30, atk: 1.3, def: 1.2, spd: 34, moves: ['slam', 'summon', 'hop'], minion: 'slime_v', frag: 1, acc: 'acc_gel', drops: [['gel', 1, 5]], quest: 'q4', r: 26 },
  ent: { n: 'Ent Anciano', lv: 18, art: ['treant'], hp: 38, atk: 1.6, def: 1.4, spd: 24, moves: ['roots', 'slam', 'rain'], frag: 2, acc: 'acc_bosque', drops: [['log2', 1, 8]], r: 30 },
  gruk: { n: 'Gruk, Señor Orco', lv: 34, art: ['hum', 'gruk'], hp: 30, atk: 1.7, def: 1.5, spd: 50, moves: ['charge', 'slam', 'summon'], minion: 'orco', frag: 3, acc: 'acc_gruk', drops: [['colmilloorco', 1, 6]], r: 26 },
  morgana: { n: 'Morgana, la Bruja', lv: 46, art: ['hum', 'morgana'], hp: 26, atk: 1.7, def: 1.4, spd: 48, moves: ['volley', 'blink', 'field'], frag: 4, acc: 'acc_bruja', drops: [['herb4', 1, 8]], r: 20 },
  vael: { n: 'Rey Vael', lv: 60, art: ['hum', 'vael'], hp: 24, atk: 1.8, def: 1.6, spd: 50, moves: ['charge', 'slam', 'summon', 'volley'], minion: 'esqueleto', frag: 5, acc: 'acc_vael', drops: [['hueso', 1, 8]], r: 22 },
  golemhielo: { n: 'Gólem de Escarcha', lv: 74, art: ['hum', 'golemhielo'], hp: 20, atk: 1.9, def: 1.9, spd: 36, moves: ['rain', 'nova', 'slam'], frag: 6, acc: 'acc_hielo', drops: [['cristalhielo', 1, 8]], r: 30 },
  ignaroth: { n: 'Ignaroth, Dragón Carmesí', lv: 86, art: ['dragon'], hp: 24, atk: 2, def: 1.8, spd: 40, moves: ['breath', 'rain', 'nova', 'volley'], frag: 7, acc: 'acc_dragon', drops: [['escama', 1, 6]], r: 40 },
  desatado: { n: 'El Desatado', lv: 98, art: ['hum', 'desatado'], hp: 28, atk: 2.1, def: 2, spd: 56, moves: ['charge', 'slam', 'rain', 'nova', 'summon', 'volley'], minion: 'caballero', frag: 8, acc: 'acc_vinculo', drops: [['esencia', 1, 10]], r: 30 },
};
function mobStats(def, lv, boss) {
  const hp = (20 + 12 * lv + 0.45 * lv * lv) * def.hp, atk = (6 + 3.2 * lv + 0.06 * lv * lv) * def.atk, df = (2 + 1.3 * lv) * def.def;
  return { hp: Math.round(hp), atk: Math.round(atk), def: Math.round(df), xp: Math.floor((6 + 3 * Math.pow(lv, 1.15)) * (boss ? 25 : def.hp)), gold: Math.round((2 + lv * 1.1) * (boss ? 20 : 1)) };
}

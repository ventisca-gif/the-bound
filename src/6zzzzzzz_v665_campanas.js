// Native Grand Line chapter: Puerto de las Campanas.
const GL_PORT = L2('Puerto de las Campanas', 'Bellhaven');
const GL_PORT_PIER = [169, 385], GL_PORT_MOOR = [178, 385];
const GL_PORT_PLAZA = [151, 368], GL_PORT_ARCHIVE = [205, 361], GL_PORT_BELL = [177, 337];
const GL_PORT_LEVEL = 620;
const GL_PORT_FOES = [
  ['glp_broker', 620, [173, 337], 76, 4.45, ['charge', 'slam']],
  ['glp_warden', 622, [181, 337], 80, 4.6, ['volley', 'nova']]
];
SAVEKEYS.push('glPortQuest');

const glpPal = (...colors) => P5(colors);
NPCS.glp_cartographer = {
  n: 'Naira', title: L2('Cartógrafa de mareas', 'Tide cartographer'),
  look: LK({skin:SKINS[2], hair:HAIRS.negro, hairStyle:'short', outfit:'tunic',
    main:glpPal('#57351e','#805128','#ad7733','#ce9b47','#e9ba64')}),
  lines: [L2('Si la campana suena dos veces, mira las puertas, no el cielo.',
    'If the bell rings twice, watch the doors, not the sky.')]
};
NPCS.glp_keeper = {
  n: 'Oriel', title: L2('Farolero del puerto','Harbor lamplighter'),
  look: LK({skin:SKINS[1], hair:HAIRS.gris, beard:HAIRS.gris, outfit:'elder',
    main:glpPal('#253533','#324a45','#487068','#619183','#a0c9b0')}),
  lines: [L2('Antes, la campana servía para avisar a los barcos cuando subía la marea.',
    'The bell used to warn ships of the rising tide.')]
};
NPCS.glp_broker = {
  n: L2('Varda, la Remachadora','Varda the Riveter'),
  look: LK({skin:SKINS[2], hair:HAIRS.rojo, outfit:'guard',
    main:glpPal('#411d2b','#642536','#8b3c49','#b65657','#db7770'),
    weapon:{k:'hammer',tier:5}})
};
NPCS.glp_warden = {
  n: L2('Mástil Gris','Grey Mast'),
  look: LK({outfit:'guard', hat:'hood',
    main:glpPal('#1e263c','#32405a','#4d617b','#647e97','#8da5af'),
    weapon:{k:'spear',tier:5}})
};
for (const [id, lv, , hp, atk, moves] of GL_PORT_FOES) {
  BOSSES[id] = {n:NPCS[id].n, lv, hp, atk, moves, def:3.95, spd:88, r:32,
    where:GL_PORT, art:['glp_actor', id], drops:[]};
}
hookAround('mobAtlasFor', (next, art) => {
  if (art[0] !== 'glp_actor') return next(art);
  const id = art[1];
  return getAtlas('glp:' + id, () => buildAtlas(NPCS[id].look, ['idle','walk','atk','hurt']));
});

function glpTile(x, y) {
  const edge = Math.hypot((x - 178) / 55, (y - 362) / 46);
  if (edge > 1) return T.DEEP;
  const channel = 178 + Math.sin((y - 385) / 11) * 2;
  if (y >= 350 && Math.abs(x - channel) < 8 + Math.max(0, y - 380) * 0.23) return T.DEEP;
  if (edge > .94 || (y >= 349 && Math.abs(x - channel) < 10 + Math.max(0, y - 380) * .23)) return T.SAND;
  return edge > .77 ? T.GRASS : T.DIRT;
}
function populateGrandLinePort(M) {
  for (let y = 316; y <= 408; y++) for (let x = 123; x <= 233; x++) {
    const terrain = glpTile(x, y);
    if (terrain === T.DEEP) continue;
    const i = M.I(x, y);
    M.ter[i] = terrain;
    M.lvl[i] = GL_PORT_LEVEL;
  }
  rectTer(M, 149, 367, 164, 383, T.COBBLE, 1);
  rectTer(M, 158, 381, 169, 386, T.COBBLE, 1);
  rectTer(M, 165, 384, 172, 386, T.PLANK, 1);
  rectTer(M, 146, 344, 151, 371, T.COBBLE, 1);
  rectTer(M, 149, 338, 207, 346, T.COBBLE, 1);
  rectTer(M, 202, 344, 207, 373, T.COBBLE, 1);
  rectTer(M, 168, 333, 186, 342, T.COBBLE, 1);

  const homes = [[138,354],[155,355],[158,362],[138,372],[151,388],
    [190,350],[211,357],[190,365],[211,369],[194,379],[198,328],[158,328]];
  homes.forEach(([x,y],i) => addBuilding(M,x,y,i % 3 === 0 ? 7 : 6,4,
    {style:'puerto', roof:i % 3 === 0 ? 'slate' : 'blue', awning:i % 2 ? '#775e8e' : '#356e72', box:true}));
  addBuilding(M, 173, 327, 9, 5, {style:'smith', roof:'slate', sign:'smith', big:true});
  for (const [x,y] of [[151,374],[162,378],[173,334],[183,334],[204,349],[208,362],[195,371],[148,347]]) {
    addObj(M, 'lantern', x, y, {kind:'wood', solid:false});
  }
  for (const [x,y] of [[147,366],[154,372],[156,371],[193,361],[196,361],[167,383],[140,371]]) {
    addObj(M, (x + y) % 2 ? 'barrel' : 'crate', x, y);
  }
  for (let y = 320; y < 405; y += 3) for (let x = 128; x < 229; x += 3) {
    if (M.ter[M.I(x,y)] === T.GRASS && M.objAt[M.I(x,y)] < 0 && hash2(x,y,67) > .82) {
      addObj(M, 'cactus', x, y, {solid:false});
    }
  }
  addObj(M, 'sign', ...GL_PORT_PLAZA, {xact:'glp_ledger', solid:false});
  addObj(M, 'sign', ...GL_PORT_ARCHIVE, {xact:'glp_tides', solid:false});
  addObj(M, 'glp_bell', ...GL_PORT_BELL, {xact:'glp_bell', solid:false});
}

// Bell and stone frame, drawn through the map's native sprite cache.
hookAround('objSprite', (next, o) => {
  if (o.k !== 'glp_bell') return next(o);
  return spr('glp:bell', () => {
    const p = new Pix(54, 60);
    p.rect(4, 8, 8, 50, C('#7d7267'));
    p.rect(42, 8, 8, 50, C('#7d7267'));
    p.rect(5, 9, 3, 47, C('#b1a08b'));
    p.rect(43, 9, 3, 47, C('#b1a08b'));
    p.rect(3, 6, 48, 8, C('#c4b198'));
    p.rect(10, 1, 34, 6, C('#e0cdb1'));
    p.rect(26, 12, 3, 9, C('#5b3f31'));
    p.poly([[23,19],[32,19],[35,25],[37,41],[42,47],[14,47],[19,41],[20,25]], C('#a86536'));
    p.poly([[24,21],[29,21],[29,42],[19,43]], C('#eac479'));
    p.rect(14, 44, 28, 4, C('#f3cd7d'));
    p.rect(25, 48, 5, 5, C('#805327'));
    p.outline(C('#302b35'),false);
    return {c:p.canvas(), ax:27, ay:58};
  });
});

function glpState(P) {
  return P.glPortQuest || (P.glPortQuest = {clues:0, beaten:0, done:false});
}
function glpOnFoot(P = G.P) {
  return !!(P && !P.dead && G.map?.grandLine && !P.dawnHelm && P.dawnBoat?.bellhaven);
}
function glpDockAction() {
  const P = G.P;
  if (!P || P.dead || G.fading || !G.map?.grandLine) return null;
  if (P.dawnHelm && P.dawnHelm.kind !== 'swim' && conomiNear(P, GL_PORT_MOOR, 44)) {
    return P.lv >= GL_PORT_LEVEL ? 'glp_land' : 'glp_locked';
  }
  if (glpOnFoot(P) && conomiNear(P, GL_PORT_PIER, 40)) return 'glp_sail';
  return null;
}
function glpClue(bit, message) {
  if (!glpOnFoot()) return;
  const q = glpState(G.P);
  if (!(q.clues & bit)) {
    q.clues |= bit;
    markDirty(true);
  }
  toast(message, 'info', 5);
}
XACT.glp_land = [L2('Desembarcar en Puerto de las Campanas','Land at Bellhaven'),'ways',()=>{
  if (glpDockAction() === 'glp_land') dawnIslandDock(true,'bellhaven',GL_PORT_PIER,GL_PORT_MOOR,GL_PORT,L2('Primera isla · nivel 620','First island · level 620'));
}];
XACT.glp_sail = [L2('Volver al barco','Return to your ship'),'ways',()=>{
  if (glpDockAction() === 'glp_sail') dawnIslandDock(false,'bellhaven',GL_PORT_PIER,GL_PORT_MOOR,GL_PORT,'');
}];
XACT.glp_locked = [L2('Desembarco · nivel 620','Landing · level 620'),'ways',()=>{
  toast(L2('Necesitas nivel 620 para desembarcar.','You need level 620 to land.'),'info');
}];
XACT.glp_ledger = [L2('Leer el registro del banquete','Read the banquet ledger'),'talk',()=>glpClue(1,
  L2('La lista de invitados tiene el nombre de tu barco y un precio al lado.','The guest list has your ship’s name with a price beside it.'))];
XACT.glp_tides = [L2('Revisar las tablas de mareas','Check the tide tables'),'talk',()=>glpClue(2,
  L2('Los Remachadores van a cerrar el canal al segundo toque. Naira marcó la salida con tinta dorada.',
  'The Riveters will close the channel at the second bell. Naira marked the way out in gold.'))];
XACT.glp_bell = [L2('Investigar la campana','Investigate the bell'),'talk',()=>{
  if (!glpOnFoot()) return;
  const P = G.P, q = glpState(P);
  if (q.done) return toast(L2('La campana vuelve a marcar la marea.','The bell marks the tides again.'),'info');
  if (q.clues !== 3) return toast(L2('Busca el registro en la plaza y las tablas de mareas en el barrio este.',
    'Find the ledger in the square and the tide tables in the east quarter.'),'info',5);
  const next = GL_PORT_FOES.findIndex((_,i)=>(q.beaten & (1 << i)) === 0);
  const [id, lv, at] = GL_PORT_FOES[next];
  if (G.ents.some(e=>e.map===GL_ID && e.mid===id && e.hp>0 && !e.remove)) return;
  banner(L2('La campana de doble toque','The double bell'),
    next === 0 ? L2('Naira investigaba el rescate de barcos para los Vigías del Alba.',
      'Naira was investigating ship ransoms for the Dawn Watch.') : NPCS[id].n);
  showBoss(spawnMob(id, lv, ...dawnPx(at), P.L, null, true));
}];
hookAround('interactTarget',(next)=>{
  const key = glpDockAction();
  if (key) return rareAction(key);
  if (glpOnFoot()) {
    for (const [spot, action] of [[GL_PORT_PLAZA,'glp_ledger'],[GL_PORT_ARCHIVE,'glp_tides'],[GL_PORT_BELL,'glp_bell']]) {
      if (conomiNear(G.P, spot, 24)) return rareAction(action);
    }
  }
  return next();
});
hookAfter('setMap',(_,M)=>{
  if (!M.grandLine) return;
  for (const [id, at] of [['glp_cartographer',[151,370]],['glp_keeper',[205,364]]]) {
    if (!G.ents.some(e=>e.map===GL_ID && e.id===id && !e.remove)) spawnNPC(id,...dawnPx(at),GL_ID);
  }
});
hookAfter('killMob',(_,m)=>{
  if (!glpOnFoot() || m.map !== GL_ID) return;
  const i = GL_PORT_FOES.findIndex(([id])=>id === m.mid);
  if (i < 0) return;
  const P = G.P, q = glpState(P);
  q.beaten |= 1 << i;
  if (q.beaten === 3 && !q.done) {
    q.done = true;
    P.gold += 15000;
    uiDirty.hud = true;
    banner(L2('Canal liberado','Channel freed'),L2('Naira recuperó las cartas de navegación · 15 000 oro',
      'Naira recovered the navigation charts · 15,000 gold'));
  } else {
    toast(L2('La segunda guardia espera junto a la campana.','The second guard waits at the bell.'),'info');
  }
  markDirty(true);
});

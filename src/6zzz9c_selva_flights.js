// Gate 2 is independent of the tickets used by the other international routes.
const SELVA_FARE = 10000;
const SELVA_GATE = [23,5];
const SELVA_AIR_SPAWN = [SELVA_AIR[0]+2,SELVA_AIR[1]+1];
SAVEKEYS.push('selvaTicket');
{ const previous = makeTerminal; makeTerminal = function (id, config) {
  const M = previous.apply(this,arguments);
  if (id !== 'pe_terminal' || M.selvaGate) return M;
  M.selvaGate = true;
  addObj(M,'furn',SELVA_GATE[0],3,{f:'selva_gate',fp:[[-1,0],[0,0],[1,0]]});
  addObj(M,'furn',...SELVA_GATE,{f:'ae_vacio',solid:false,xact:'selva_embarcar'});
  for (const ob of M.objs) if (ob.f === 'ae_panel') ob.f = 'lm_panel';
  return M;
}; }
XSPR.selva_gate = () => {
  const s = XSPR.ae_puerta_emb(), g = s.c.getContext('2d');
  g.fillStyle = '#9dd58b'; g.fillRect(0,0,52,9);
  jpText(g, 'PUERTA 2',4,-1,'#121418',10);
  return s;
};

function selvaFly(title, arrive) {
  const P = G.P;
  if (G.fading || P.plane || P._selvaFlight) return;
  P._selvaFlight = {m:P.map,x:P.x,y:P.y};
  closeDialog();
  flightCine(title,() => transition(() => {
    arrive(P);
    P._selvaFlight = null;
    markDirty(true);
  }));
}

function selvaBuyTicket() {
  const P = G.P;
  if (G.map.id !== 'pe_terminal' || G.fading || P._selvaFlight) return;
  if (P.selvaTicket) { typeText(L2('Ya tienes tu billete. Ve a la Puerta 2.','You already have your ticket. Go to Gate 2.')); return; }
  if (P.gold < SELVA_FARE) { typeText(L2('Te falta oro. El billete cuesta 10.000 de oro.','You need 10,000 gold for the ticket.')); return; }
  P.gold -= SELVA_FARE; P.selvaTicket = true;
  markDirty(true); sfx('coin');
  const b = aeBoarding();
  typeText(b.open ? L2('Billete comprado. Ya puedes embarcar por la Puerta 2.','Ticket purchased. You can board at Gate 2 now.') :
    L2('Billete comprado. La Puerta 2 abre en ','Ticket purchased. Gate 2 opens in ') + b.wait + L2(' segundos.',' seconds.'));
}
DLG_HOOKS.push((npc,opts) => {
  if (npc.id === 'pe_taquilla' && G.map.id === 'pe_terminal') opts.unshift({
    label:L2('✈ Billete a la Selva peruana · 10.000 de oro','✈ Peruvian Amazon ticket · 10,000 gold'),icon:['coin'],fn:selvaBuyTicket
  });
  if (npc.id === 'selva_piloto') opts.unshift({
    label:L2('✈ Volver a Lima (gratis)','✈ Fly back to Lima (free)'),icon:['ways'],
    fn:() => {
      if (!G.map.selva) return;
      selvaFly('SELVA · LIMA',P => {
        const M = makeTerminal('pe_terminal',AE_PE);
        P.inside = M.id; P._selvaReturned = true;
        setMap(M,SELVA_GATE[0]*16+8,(SELVA_GATE[1]+2)*16+8,'down');
        banner('Jorge Chávez',L2('Llegada de la Selva peruana','Arrival from the Peruvian Amazon'));
      });
    }
  });
});
XACT.selva_embarcar = [
  () => {
    const b = aeBoarding();
    return b.open ? L2('✈ Puerta 2 · Embarcar a la Selva','✈ Gate 2 · Board for the Amazon') :
      L2('✈ Puerta 2 · Embarque en ','✈ Gate 2 · Boarding in ') + b.wait + ' s';
  },
  'run',
  () => {
    const P = G.P;
    if (G.map.id !== 'pe_terminal' || G.fading || P._selvaFlight) return;
    if (!P.selvaTicket) { xMsg(L2('Puerta 2','Gate 2'),L2('Compra el billete a la Selva en el mostrador.','Buy your Amazon ticket at the counter.')); return; }
    const b = aeBoarding();
    if (!b.open) { xMsg(L2('Puerta 2','Gate 2'),L2('El embarque empieza en ','Boarding begins in ') + b.wait + L2(' segundos.',' seconds.')); return; }
    selvaFly('LIMA · SELVA',P => {
      const M = makeSelva();
      P.inside = M.id;
      setMap(M,SELVA_AIR_SPAWN[0]*16+8,SELVA_AIR_SPAWN[1]*16+8,'down');
      P.selvaTicket = false;
      banner(SELVA_NAME,L2('Aeródromo del Aguaje','Aguaje Airstrip'));
    });
  }
];
{ const previous = setMap; setMap = function (M) {
  if (M.selva) selvaLocalPeople(M);
  return previous.apply(this,arguments);
}; }

// Keep the world fallback for older builds and restore the actual position in 5.68+.
{ const previous = serializeP; serializeP = function(P) {
  const save = previous.apply(this,arguments);
  if (P._selvaFlight || P.map === 'selva' || (P.map === 'pe_terminal' && (P.selvaTicket || P._selvaReturned)) || (P.map === 'lima' && P.selvaTicket)) {
    save.selvaStay = P._selvaFlight || {m:P.map,x:P.x,y:P.y};
    save.abLast = null;
    save.x = P.retX || SA.term.door*16+8;
    save.y = P.retY || (SA.term.y+SA.term.h+1)*16+8;
  }
  return save;
}; }
function selvaRestoreStay(P) {
  const S = P.selvaStay;
  if (!S) return null;
  let M, fallback;
  if (S.m === 'selva') { M = makeSelva(); fallback = SELVA_AIR_SPAWN; }
  else if (S.m === 'pe_terminal') {
    M = makeTerminal('pe_terminal',AE_PE); fallback = [M.exit.x,M.exit.y-2]; P._selvaReturned = true;
  } else if (S.m === 'lima' && P.selvaTicket) {
    M = makeLima(); fallback = [LM_Q.term.door,LM_Q.term.y+LM_Q.term.h+2];
  } else return null;
  P.retX = P.x; P.retY = P.y; P.inside = M.id;
  if (Number.isFinite(S.x) && Number.isFinite(S.y) && !blockedFor(M,S.x>>4,S.y>>4,0)) return {map:M,x:S.x,y:S.y};
  return {map:M,x:fallback[0]*16+8,y:fallback[1]*16+8};
}

GSIS.push(['selva','🌿 '+SELVA_NAME,() => [
  L2('Desde el Aeropuerto Jorge Chávez en Lima, habla con la azafata de tierra. El billete cuesta 10.000 de oro y se embarca por la Puerta 2. La vuelta con Daniela es gratis.',
    'Talk to the ground agent at Jorge Chávez Airport in Lima. The ticket costs 10,000 gold and you board at Gate 2. The return with Daniela is free.'),
  L2('Luz enseña shipibo-konibo en el Puerto del Aguaje y Elena enseña asháninka en el Tambo del Bosque. Ambas ofrecen una práctica breve.',
    'Luz teaches Shipibo-Konibo in Aguaje Port and Elena teaches Ashaninka in the Forest Tambo. Both offer a short exercise.')
], () => {
  const m = G.P?.map;
  if (m === 'selva') return {loc:SELVA_PORT,t:NPCS.ag_luz.title,m};
  if (m === 'pe_terminal') return {loc:[8,5],t:NPCS.pe_taquilla.n,m};
  if (m === 'lima') return {loc:[LM_Q.term.door,LM_Q.term.y+LM_Q.term.h+1],t:'Aeropuerto Jorge Chávez',m};
  return {loc:[SA.term.door,SA.term.y+SA.term.h+1],t:L2('Aeródromo de Albor','Albor Aerodrome'),m:'world'};
}]);
{ const previous = wpRoute; wpRoute = function (wp) {
  if (wp.m === 'selva') {
    if (G.map.id === 'lima') return [LM_Q.term.door,LM_Q.term.y+LM_Q.term.h+1];
    if (G.map.id === 'pe_terminal') return G.P.selvaTicket ? SELVA_GATE : [8,5];
    if (G.map.id === 'world') return [SA.term.door,SA.term.y+SA.term.h+1];
  }
  if (G.map.selva && wp.m !== 'selva') return SELVA_AIR;
  return previous.apply(this,arguments);
}; }

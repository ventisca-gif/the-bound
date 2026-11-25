const MERRY_DECK_X=104,MERRY_DECK_MIN_Y=-1,MERRY_DECK_MAX_Y=21;
function merryDeck(P=G.P){
 return G.map?.dawn&&P?.dawnCrewJoined&&P.dawnHelm?.kind==='skiff'?P.dawnHelm.deck:null;
}
function merryWalkDeck(){
 const P=G.P,H=P?.dawnHelm;
 if(!G.map?.dawn||!P?.dawnCrewJoined||H?.kind!=='skiff')return;
 if(H.deck){
  P.dir=H.deck.heading;delete H.deck;setAnim(P,'idle',true);
  toast(L2('Vuelves al timón.','You take the helm again.'),'info',3);return;
 }
 H.deck={x:0,y:11,heading:P.dir,dir:'down',stopped:false};
 toast(L2('Nami mantiene el rumbo. Usa el joystick para pasear por cubierta.','Nami holds the course. Use the joystick to walk around the deck.'),'info',5);
}
XACT.merry_walk=[L2('Pasear por cubierta · Nami al timón','Walk the deck · Nami at the helm'),'ways',merryWalkDeck];
XACT.merry_helm=[L2('Volver al timón','Take the helm again'),'ways',merryWalkDeck];
{const old=dawnTalkAboard;dawnTalkAboard=function(){
 if(G.P?.dawnHelm?.kind!=='skiff')return old.apply(this,arguments);
 if(!dawnCrewAtHelm())return;
 const P=G.P;
 const choices=DAWN_CREW.filter((_,i)=>dawnCrewAvailable(P)&(1<<i)).map(([id,name,role])=>[
  name+' · '+role,()=>openDialog({id,type:'npc',map:'dawn',dawnCrew:true,aboard:true,atlas:npcAtlas(id),
   def:{...NPCS[id],title:role,lines:dawnCrewLines(id,true)}})
 ]);
 const key=merryDeck()?'merry_helm':'merry_walk';
 choices.unshift([XACT[key][0],()=>{closeModal();merryWalkDeck();}]);
 if(merryDeck())choices.push([L2('Pedir a Nami que pare','Ask Nami to stop'),()=>{
  const deck=merryDeck();if(deck)deck.stopped=true;
 }]);
 xMsg(DAWN_MERRY_NAME,L2('¿Con quién quieres hablar?','Who do you want to talk to?'),choices);
};}
{const old=updatePlayer;updatePlayer=function(dt){
 const P=G.P,M=G.map,deck=merryDeck(P);
 if(!deck||P.dead||G.fading)return old.apply(this,arguments);
 const [dx,dy]=moveInput();
 if(dx||dy){
  deck.dir=dirFromVec(dx,dy);
  deck.x=clamp(deck.x+dx*110*dt,-MERRY_DECK_X,MERRY_DECK_X);
  deck.y=clamp(deck.y+dy*72*dt,MERRY_DECK_MIN_Y,MERRY_DECK_MAX_Y);
  setAnim(P,'walk',true);stepAnim(P,dt,9);
 }else{setAnim(P,'idle',true);stepAnim(P,dt,2);}
 if(deck.stopped)return;
 const [sx,sy]=DIRV[deck.heading]||DIRV.down;
 const distance=dt*DAWN_HELM_SPEED*.62,steps=Math.max(1,Math.ceil(distance/6));
 for(let j=0;j<steps;j++){
  const x=P.x+sx*distance/steps,y=P.y+sy*distance/steps;
  if(!dawnSurface(M,x,y,dawnShipRadius(P,P.dawnHelm))){
   deck.stopped=true;
   toast(L2('Nami frenó junto a la costa.','Nami stopped near the shore.'),'info',3);break;
  }
  P.x=x;P.y=y;
 }
};}
{const old=drawEnt;drawEnt=function(e,cx,cy){
 const deck=e===G.P&&merryDeck(e);
 if(!deck)return old.apply(this,arguments);
 // The avatar can walk without moving the ship's navigation or docking point.
 const display={...e,x:e.x+deck.x,y:e.y+deck.y,dir:deck.dir};
 return old.call(this,display,cx,cy);
};}
DAWN_CREW_TOPICS[ORANGE_NAMI].push(['Al timón','At the helm','Camina por donde quieras. Si veo bajos delante, detengo el Merry y te aviso.','Walk wherever you like. If I spot shallows ahead, I’ll stop the Merry and tell you.','deck']);
{const old=basicAttack;basicAttack=function(){
 if(merryDeck())return;
 return old.apply(this,arguments);
};}
DLG_HOOKS.push((npc,opts)=>{
 if(npc.id!==ORANGE_NAMI||!npc.aboard||G.P?.dawnHelm?.kind!=='skiff')return;
 opts.unshift({label:L2('Tomar el timón o pasear','Take the helm or walk the deck'),icon:['ways'],fn:()=>{closeDialog();merryWalkDeck();}});
 if(!merryDeck())return;
 opts.push({label:L2('Indicar rumbo a Nami','Give Nami a heading'),icon:['ways'],fn:()=>{
  typeText(L2('¿Hacia dónde pongo la proa?','Where should I point the bow?'));
  const headings=[['up','Norte','North'],['right','Este','East'],['down','Sur','South'],['left','Oeste','West']];
  setOpts(headings.map(([heading,es,en])=>({label:L2(es,en),fn:()=>{
   const deck=merryDeck();if(!deck)return;
   deck.heading=G.P.dir=heading;deck.stopped=false;closeDialog();
  }})));
 }});
});

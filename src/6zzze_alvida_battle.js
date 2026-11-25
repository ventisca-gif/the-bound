const ALVIDA_BOSS='dawn_alvida';
const ALVIDA_MACE='w_alvida_mace';
const ALVIDA_CREW_WHERE=L2('Cubierta del galeón de Alvida, en el Mar de Dawn','Alvida’s galleon deck, in the Dawn Sea');
const obsidianGolem=MOBS.cb_golem;
for(const [id,es,en,hp] of [['dawn_deckhand','Marinero del galeón','Galleon deckhand',.67],['dawn_boarder','Pirata de abordaje','Galleon boarder',.75]]){
  MOBS[id]={...obsidianGolem,n:L2(es,en),art:['hum',id],lv:[500,500],reg:['dawn'],fam:'alvida_crew',
    where:ALVIDA_CREW_WHERE,hp:obsidianGolem.hp*hp,atk:obsidianGolem.atk*.8,drops:[]};
}
BOSSES[ALVIDA_BOSS]={n:L2('Alvida, Maza de Hierro','Iron Mace Alvida'),where:ALVIDA_CREW_WHERE,lv:500,
  art:['hum',ALVIDA_BOSS],hp:obsidianGolem.hp*1.24,atk:obsidianGolem.atk*1.13,def:obsidianGolem.def*1.08,
  r:33,spd:62,moves:['slam'],drops:[],reward:ALVIDA_MACE};
const ALVIDA_WEAPON_BASE=Object.values(ITEMS).filter(i=>i.t==='weapon'&&i.slot==='weapon'&&i.cls==='guerrero'&&(i.lv||1)<=500)
  .reduce((best,i)=>!best||i.atk>best.atk?i:best,null);
it(ALVIDA_MACE,{n:L2('Mazo de Hierro de Alvida','Alvida’s Iron Mace'),t:'weapon',slot:'weapon',cls:'guerrero',lv:500,
  tier:ALVIDA_WEAPON_BASE.tier,atk:Math.ceil(ALVIDA_WEAPON_BASE.atk*1.055),rar:ALVIDA_WEAPON_BASE.rar,
  icon:['alvida_club'],price:ALVIDA_WEAPON_BASE.price,
  d:L2('Recompensa única por vencer a Alvida. Recógela en la cubierta del galeón.','One-time reward for defeating Alvida. Claim it on the galleon deck.')});
{const old=gearTiers;gearTiers=function(P){
  const gear=old.apply(this,arguments);
  if(P.equip.weapon?.id===ALVIDA_MACE)gear.alvidaClub=1;
  return gear;
};}
{const old=heroLook;heroLook=function(cls,app,gear){
  const L=old.apply(this,arguments);
  if(gear?.alvidaClub)L.weapon={k:'alvida_club',tier:1,size:.83};
  return L;
};}
{const old=itemSources;itemSources=function(id){
  if(id===ALVIDA_MACE)return [[ITEMS[id].d,{loc:[229,129],m:'world',t:L2('Capitana Marina','Captain Marina')}]];
  return old.apply(this,arguments);
};}
{const old=bossWhere;bossWhere=function(id){
  return id===ALVIDA_BOSS?{loc:[229,129],where:ALVIDA_CREW_WHERE}:old.apply(this,arguments);
};}
{const old=mobWhere;mobWhere=function(id){
  return MOBS[id]?.fam==='alvida_crew'?{loc:[229,129],where:ALVIDA_CREW_WHERE}:old.apply(this,arguments);
};}
function alvidaClearFight(M){
  if(!M?.alvidaRun)return;
  for(const m of [...M.alvidaRun.crew,M.alvidaRun.boss])if(m)m.remove=true;
  M.alvidaRun=null;
  if(G.bossBar?.mid===ALVIDA_BOSS)showBoss(null);
}
function alvidaStart(M,replay=false){
  alvidaClearFight(M);
  if(G.P.alvidaMace&&!replay)return;
  const crew=AD_CREW.map(([id,x,y])=>{
    const e=spawnMob(id,500,...dawnPx([x,y]),0,null,false);
    e.state='chase';return e;
  });
  M.alvidaRun={crew,boss:null,replay};
}
V33_TICKS.push(()=>{
  const M=G.map,R=M?.alvidaRun;
  if(M?.id!==AD_DECK||!R||R.boss||G.P.alvidaMace&&!R.replay||G.P.dead||R.crew.some(e=>!e.dying&&!e.remove))return;
  R.boss=spawnMob(ALVIDA_BOSS,500,...dawnPx([22,11]),0,null,true);
  R.boss.state='fight';R.boss.cd=.55;
  showBoss(R.boss);sfx('boss');banner(BOSSES[ALVIDA_BOSS].n,L2('Esquiva el mazo cuando levante el brazo.','Dodge the mace as she raises her arm.'));
});
{const previous=setMap;setMap=function(M){
  if(G.map?.id===AD_DECK&&M.id!==AD_DECK)alvidaClearFight(G.map);
  return previous.apply(this,arguments);
};}
function alvidaClaim(){
  const P=G.P;
  if(G.map.id!==AD_DECK||P.alvidaMace!==1)return;
  if(giveItem(ALVIDA_MACE,1)) {P.alvidaMace=2;markDirty(true);}
  else toast(L2('Haz espacio en el inventario. El mazo seguirá en la cubierta.','Make room in your inventory. The mace will stay on the deck.'),'info');
}
{const previous=bossKilled;bossKilled=function(m){
  if(m.mid!==ALVIDA_BOSS)return previous.apply(this,arguments);
  if(!G.P.alvidaMace)G.P.alvidaMace=1;
  const result=previous.apply(this,arguments);
  if(G.P.alvidaMace===1)toast(L2('El mazo está en el cofre junto al timón.','The mace is in the chest by the helm.'),'quest',5);
  return result;
};}
{const previous=updateBoss;updateBoss=function(m,dt,d,dh,speed,moveTo){
  if(m.mid!==ALVIDA_BOSS)return previous.apply(this,arguments);
  const P=G.P;
  if(P.dead){setAnim(m,'idle',true);return;}
  if(m.alvidaStrike>0){
    m.alvidaStrike-=dt;
    m.af=clamp(Math.floor((m.windup-m.alvidaStrike)/m.windup*4),0,3);
    return;
  }
  if(d>m.range+9){moveTo(P.x,P.y,speed);return;}
  if(m.cd>0){setAnim(m,'idle',true);return;}
  const ang=Math.atan2(P.y-m.y,P.x-m.x), sweep=m.alvidaSweep=!m.alvidaSweep;
  const x=m.x+Math.cos(ang)*24,y=m.y+Math.sin(ang)*24,r=sweep?48:32,dur=sweep?.72:.54;
  m.windup=m.alvidaStrike=dur;m.cd=dur+(sweep?1.05:.63);
  mobFace(m,P.x-m.x,P.y-m.y);setAnim(m,'atk');
  telegraph({shape:'circle',x,y,r,dur,cb:()=>{
    if(G.map.id!==AD_DECK||m.dying||m.remove)return;
    if(dist2(P.x,P.y,x,y)<r*r)hurtPlayer(m.atk*(sweep?1.08:1),{lv:m.lv});
    G.shake=Math.max(3,G.shake);
    burst(x,y,11,{sp:82,up:33,g:100,life:.35,c:['#a78a72','#dec4a1']});sfx('swing');
  }});
};}

// Dawn fruit discoveries use the existing bag, fruit rank, map and skill slots.
const DF_NEW={
 mera:{item:'df_mera',n:L2('Mera Mera','Flame-Flame'),ic:'🔥',rank:2,colors:['#ff5927','#ff9427','#fff1a0'],
  desc:L2('Controla el fuego con cuatro ataques. Enciende la Logia temporal para dispersar golpes físicos de monstruos comunes.',
   'Control fire with four attacks. Activate temporary Logia to disperse ordinary monsters’ physical hits.')},
 hana:{item:'df_hana',n:L2('Hana Hana','Flower-Flower'),ic:'🌸',rank:1,colors:['#ad627e','#ed98b6','#ffe3df'],
  desc:L2('Haz brotar brazos a distancia. Usa agarres, golpes de área y una barrera que empuja.',
   'Sprout arms at a distance. Use grabs, area strikes and a barrier that pushes enemies back.')}
};
const DF_TECH={
 mera:[
  ['mera_hiken','Puño de Fuego','Fire Fist',6,22,'fire',2.75,.14,'Barrido frontal de fuego que quema a los enemigos alcanzados.','A frontal sweep of fire that burns enemies it hits.'],
  ['mera_higan','Pistolas de Fuego','Fire Gun',8,26,'arrow',.88,.054,'Cuatro disparos rápidos. Cada ráfaga puede golpear más de una vez.', 'Four quick shots. The burst can hit an enemy more than once.'],
  ['mera_hibashira','Pilar de Fuego','Flame Pillar',13,36,'slam',.86,.047,'Levanta un pilar en la posición del objetivo. Golpea cuatro veces y quema en el último impacto.','Raise a pillar at the target’s position. It hits four times and burns on the final hit.'],
  ['mera_entei','Gran Entei','Great Flame Emperor',31,62,'meteor',5.25,.25,'Concentra una esfera de fuego durante un segundo y hazla estallar en el punto señalado.','Charge a fire sphere for a second, then detonate it at the marked spot.'],
  ['mera_logia','Cuerpo de Fuego · Logia','Flame Body · Logia',26,36,'shield',0,0,'Seis segundos. Dispersa hasta tres impactos físicos de monstruos comunes. Los jefes, el daño elemental, el agua y el PvP atraviesan la forma.',
   'Six seconds. Disperses up to three physical hits from ordinary monsters. Bosses, elemental damage, water and PvP pierce the form.']
 ],
 hana:[
  ['hana_clutch','Clutch · Agarre','Clutch · Grab',6,19,'star',2.58,.13,'Brazos que inmovilizan brevemente al enemigo señalado. Los jefes resisten el agarre.','Arms briefly pin down the targeted enemy. Bosses resist the hold.'],
  ['hana_twist','Seis Fleur · Giro','Seis Fleur · Twist',10,26,'spin',3.15,.17,'Seis brazos golpean alrededor del objetivo y ralentizan a los enemigos comunes.','Six arms strike around the target and slow ordinary enemies.'],
  ['hana_delphinium','Ochenta Fleur · Delphinium','Ochenta Fleur · Delphinium',14,33,'multi',3.95,.18,'Una oleada de brazos barre el suelo por delante y empuja a los enemigos comunes.','A wave of arms sweeps the ground ahead and pushes ordinary enemies back.'],
  ['hana_wall','Cien Fleur · Muro','Cien Fleur · Wall',23,35,'shield',1.8,.12,'Forma una barrera, empuja a los enemigos cercanos y absorbe hasta el 22 % de tu vida máxima durante cinco segundos.',
   'Form a barrier that pushes nearby enemies back and absorbs up to 22% of your max HP for five seconds.']
 ]
};
const DF_TECH_OWNER={};
for(const [kind,rows] of Object.entries(DF_TECH)){
 const fruit=DFR[kind]=DF_NEW[kind];
 DFS[kind]=rows.map(([id,es,en,cd,mp,icon,m,mr,desc,text])=>{
  DF_TECH_OWNER[id]=kind;
  sk(id,'fruta',0,0,L2(es,en),'act',500,null,{mp,cd,icon:[icon,fruit.colors[1]],eff:{k:id,m,mr},fruit:1,max:10,
   d:L2(desc,text)+(m?' '+L2('Potencia: {m}% por impacto.','Power: {m}% per hit.'):'')});
  return id;
 });
 it(fruit.item,{n:L2('Fruta ','Fruit: ')+fruit.n,t:'cons',stack:true,price:0,icon:[fruit.item],rar:5,d:fruit.desc});
}
function dfClearNewEffects(P){
 P.meraLogiaUntil=0;P.meraLogiaHits=0;
 P.hanaGuardUntil=0;P.hanaGuardHP=0;
}
const dfNewCombatReady=P=>!!P?.S&&!!G.map&&!P.dead&&!P.dawnHelm&&!DF_WATER_MAPS.has(G.map.id);
const dfNewMob=(m,M)=>m.type==='mob'&&!m.remove&&!m.dying&&m.map===M.id&&(m.L===G.P.L||m.L<0||G.P.L<0);
function dfNewBurst(x,y,kind,n,sp=85) {
 burst(x,y-9,n,{sp,up:22,g:45,life:.44,c:DF_NEW[kind].colors});
}
function dfNewEffect(id,x,y,r,dur,more={}){
 addFx({type:'df_new',id,x,y,r,dur,ground:more.ground||false,...more});
}
function dfNewHitCircle(M,x,y,r,dmg,src={},filter=()=>true){
 for(const m of G.ents)if(dfNewMob(m,M)&&filter(m)&&dist2(m.x,y+(m.y-y)*1.22,x,y)<=(r+(m.rad||6))**2){
  hitMob(m,dmg,typeof src==='function'?src(m):src);
 }
}
function dfNewSweep(M,x,y,dx,dy,length,width,dmg,src){
 for(const m of G.ents){
  if(!dfNewMob(m,M))continue;
  const px=m.x-x,py=m.y-y,along=px*dx+py*dy,side=px*dy-py*dx;
  if(along>=-10&&along<=length+8&&Math.abs(side)<=width+(m.rad||6))hitMob(m,dmg,src);
 }
}
function dfNewCast(id){
 const P=G.P,M=G.map,kind=DF_TECH_OWNER[id],s=SK[id],power=s.eff;
 const damage=P.S.atk*(power.m+power.mr*(dfRank()-1))*(1+(P.S.skillP||0)/100);
 const mob=nearestMob(P.x,P.y,170,m=>dfNewMob(m,M)),[ax,ay]=DIRV[P.dir]||DIRV.down;
 const angle=mob?Math.atan2(mob.y-P.y,mob.x-P.x):Math.atan2(ay,ax);
 const dx=Math.cos(angle),dy=Math.sin(angle),x=P.x,y=P.y;
 const tx=mob?.x??x+dx*82,ty=mob?.y??y+dy*82;
 const valid=()=>G.P===P&&G.map===M&&P.fruit===kind&&dfNewCombatReady(P);
 const later=(delay,fn)=>delayAct(delay,()=>{if(valid())fn();});
 setAnim(P,'cast');
 switch(id){
 case 'mera_hiken':
  P.busy=.38;
  dfNewEffect(id,x,y,28,.49,{angle,length:145});
  later(.23,()=>{dfNewSweep(M,x,y,dx,dy,145,22,damage,{fire:1,burn:1,kb:90});dfNewBurst(x+dx*127,y+dy*127,kind,18);sfx('boom');});
  break;
 case 'mera_higan':
  P.busy=.62;
  for(let i=0;i<4;i++)later(.08+i*.14,()=>{
   const a=angle+[-.035,.035,-.065,.065][i];
   dfNewEffect(id,x,y,6,.22,{angle:a,length:153});
   dfNewSweep(M,x,y,Math.cos(a),Math.sin(a),153,9,damage,{fire:1});sfx('swing');
  });
  break;
 case 'mera_hibashira':
  P.busy=.38;dfNewEffect(id,tx,ty,48,2.1,{ground:true});
  for(let i=0;i<4;i++)later(.36+i*.38,()=>{
   dfNewHitCircle(M,tx,ty,48,damage,{fire:1,burn:i===3?1:0});dfNewBurst(tx,ty,kind,11);
  });
  sfx('boom');break;
 case 'mera_entei':
  P.busy=1.04;dfNewEffect(id,tx,ty,72,1.42,{ground:true});
  later(.99,()=>{
   dfNewHitCircle(M,tx,ty,72,damage,{fire:1,burn:1,kb:170});
   addFx({type:'ring',x:tx,y:ty,r:80,dur:.5,col:'#ffcf67'});dfNewBurst(tx,ty,kind,38,165);
   G.shake=Math.max(G.shake,7);sfx('boom');
  });
  break;
 case 'mera_logia':
  P.meraLogiaUntil=G.t+6;P.meraLogiaHits=3;
  dfNewBurst(x,y,kind,18);sfx('buff');break;
 case 'hana_clutch':
  P.busy=.34;dfNewEffect(id,tx,ty,24,.65);
  later(.29,()=>{
   if(mob&&!mob.dying&&!mob.remove){hitMob(mob,damage,mob.boss?{}:{root:1.2,stun:.55});dfNewBurst(mob.x,mob.y,kind,16);}
  });break;
 case 'hana_twist':
  P.busy=.43;dfNewEffect(id,tx,ty,47,.77,{ground:true});
  later(.37,()=>{dfNewHitCircle(M,tx,ty,49,damage,m=>m.boss?{}:{slow:1.7});dfNewBurst(tx,ty,kind,20);sfx('swing');});
  break;
 case 'hana_delphinium':
  P.busy=.7;dfNewEffect(id,x,y,18,.94,{angle,length:134,ground:true});
  later(.55,()=>{dfNewSweep(M,x,y,dx,dy,133,28,damage,{kb:170});dfNewBurst(x+dx*105,y+dy*105,kind,21);sfx('swing');});
  break;
 case 'hana_wall':
  P.hanaGuardUntil=G.t+5;P.hanaGuardHP=Math.round(P.S.maxhp*.22);
  dfNewHitCircle(M,x,y,48,damage,{kb:185});dfNewEffect(id,x,y,39,.56,{ground:true});
  dfNewBurst(x,y,kind,16);sfx('buff');break;
 }
 uiDirty.hud=true;
}
{const old=dfCast;dfCast=function(id){
 if(!DF_TECH_OWNER[id])return old.apply(this,arguments);
 if(G.P.fruit===DF_TECH_OWNER[id]&&dfNewCombatReady(G.P))dfNewCast(id);
};}
{const old=useSkill;useSkill=function(slot){
 const P=G.P,id=P?.slots?.[slot];
 if(DF_TECH_OWNER[id]){
  if(P.fruit!==DF_TECH_OWNER[id])return;
  if(!dfNewCombatReady(P)){
   if(!P.dead)toast(L2('Necesitas estar en tierra firme.','You need to be on dry land.'),'info',3);
   return;
  }
 }
 return old.apply(this,arguments);
};}

function dfNewAbsorb(P,src,damage){
 if(P.fruit!=='hana'||P.hanaGuardUntil<=G.t||!P.hanaGuardHP||src.pvp||!dfNewCombatReady(P))return damage;
 const absorbed=Math.min(damage,P.hanaGuardHP);
 P.hanaGuardHP-=absorbed;
 if(absorbed){floatText(P.x,P.y-42,L2('MURO FLORAL','FLOWER WALL'),'#ffd2e5');dfNewBurst(P.x,P.y,'hana',6);}
 return damage-absorbed;
}
{const old=hurtPlayer;hurtPlayer=function(base,src){
 const P=G.P;
 if(P?.fruit==='mera'&&P.meraLogiaUntil>G.t&&P.meraLogiaHits>0&&src?.dfPhysical&&!src.burn&&!src.poison&&!src.pvp&&
   !DAWN_RETO_SRC&&dfNewCombatReady(P)&&P.ifr<=0&&!G.paused){
  P.meraLogiaHits--;
  dfNewBurst(P.x,P.y,'mera',13);
  floatText(P.x,P.y-42,L2('LOGIA','LOGIA'),'#ffd17a');
  return;
 }
 return old.apply(this,arguments);
};}
{const old=setMap;setMap=function(M){
 const prior=G.map,r=old.apply(this,arguments);
 if(G.map!==prior&&G.P)dfClearNewEffects(G.P);
 return r;
};}
{const old=playerDie;playerDie=function(){
 if(G.P)dfClearNewEffects(G.P);
 return old.apply(this,arguments);
};}

function dfRenderArm(x,y,anchor,progress,col){
 const h=13+progress*16;
 ctx.save();ctx.fillStyle=col;ctx.strokeStyle='#8c4a58';ctx.lineWidth=2;
 ctx.translate(x,y);ctx.rotate(anchor);
 ctx.beginPath();ctx.roundRect(-2,-h,5,h,2);ctx.fill();ctx.stroke();
 ctx.fillRect(-2,-h-4,5,7);
 for(let i=0;i<3;i++)ctx.fillRect(-3+i*2,-h-7+(i%2),2,5);
 ctx.restore();
}
function dfFlameTongue(x,y,w,h,time,tone){
 const curl=Math.sin(time)*w*.33;
 const colors=['#9d3033','#d3452c','#ff7533','#ffb83c','#fff0a3'];
 ctx.save();ctx.translate(x,y);
 ctx.fillStyle=colors[tone];
 ctx.beginPath();
 ctx.moveTo(-w*.53,0);
 ctx.bezierCurveTo(-w*.71,-h*.31,-w*.16,-h*.37,-w*.23,-h*.64);
 ctx.quadraticCurveTo(-w*.03,-h*.46,w*.08,-h*.54);
 ctx.quadraticCurveTo(w*.37+curl,-h*.78,curl,-h);
 ctx.bezierCurveTo(w*.68+curl,-h*.74,w*.74,-h*.3,w*.48,0);
 ctx.closePath();ctx.fill();
 ctx.restore();
}
{const old=drawFx;drawFx=function(f,cx,cy){
 if(f.type!=='df_new')return old.apply(this,arguments);
 const x=f.x-cx,y=f.y-cy,p=clamp(f.t/f.dur,0,1);
 const flame=f.id.startsWith('mera'),r=f.r;
 ctx.save();ctx.globalAlpha=Math.min(1,p*15,(1-p)*6);
 if(flame){
  if(f.id==='mera_entei'){
   const thump=f.t>.99,grow=thump?1:clamp(f.t,0,1);
   ctx.fillStyle='#b7463540';ctx.strokeStyle='#ffbe64';ctx.lineWidth=2;
   ctx.beginPath();ctx.ellipse(x,y,r,r*.61,0,0,Math.PI*2);ctx.fill();ctx.stroke();
   const ball=(thump?56:10+grow*19),yy=y-(thump?6:56-grow*21);
   for(const [color,size] of [['#a43229',1],['#e65b2a',.87],['#ff9f32',.71],['#ffde7c',.53],['#fff1b1',.32]]){
    ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,yy,ball*size,0,Math.PI*2);ctx.fill();
   }
   for(let i=0;i<9;i++){
    const a=i*Math.PI*2/9+f.t*2,l=ball*(.87+Math.sin(a*6+f.t*11)*.09);
    const ax=x+Math.cos(a)*l,ay=yy+Math.sin(a)*l;
    ctx.save();ctx.translate(ax,ay);ctx.rotate(a+Math.PI*.5);
    dfFlameTongue(0,0,9+grow*7,8+grow*15,f.t*11+i,2+i%3);
    ctx.restore();
   }
  }else if(f.id==='mera_hibashira'){
   const pulse=.62+Math.sin(f.t*18)*.16;
   ctx.strokeStyle='#f6b359';ctx.beginPath();ctx.ellipse(x,y,r,r*.56,0,0,Math.PI*2);ctx.stroke();
   for(let i=0;i<11;i++){
    const a=i*2.4+f.t*9,xx=x+Math.cos(a)*r*.52;
    const hh=(16+((i*27+f.t*105)%68))*pulse;
    dfFlameTongue(Math.round(xx),Math.round(y+Math.sin(a)*10),10+(i%3)*4,hh,f.t*9+i,i%4);
    if(i%2===0)dfFlameTongue(Math.round(xx+1),y,7,hh*.58,f.t*9+i,4);
   }
  }else{
   ctx.translate(x,y-15);ctx.rotate(f.angle);
   const end=f.id==='mera_higan'?f.length*p:f.length*Math.min(1,p*2.8);
   const width=f.id==='mera_higan'?2:9+12*Math.sin(p*Math.PI);
   for(let i=6;i>=0;i--){
    const small=f.id==='mera_higan',pos=end-i*(small?4:9);
    if(pos<0)continue;
    const ww=width*(1-i*.095);
    ctx.save();ctx.translate(Math.round(pos),Math.sin(f.t*18+i)*ww*.14);ctx.rotate(Math.PI/2);
    dfFlameTongue(0,-10,ww*(small?2.1:1.42),small?12:28,f.t*11+i,Math.max(0,4-Math.floor(i*.75)));
    ctx.restore();
   }
   if(f.id==='mera_hiken')for(let i=0;i<10;i++){
    const sx=end-6-i*6,sy=Math.sin(i*3.5+p*13)*width;
    if(sx>0){ctx.fillStyle=i%2?'#ff8a38':'#ffe994';ctx.fillRect(sx,sy,i%3+2,2);}
   }
  }
 }else{
  const stage=Math.min(1,p*2.5),col='#f3b3b7';
  if(f.id==='hana_delphinium'){
   for(let i=0;i<10;i++){
    const s=i*13,delay=p-s/240;if(delay<0)continue;
    const side=i%2?10:-10;
    dfRenderArm(x+Math.cos(f.angle)*s-Math.sin(f.angle)*side,y+Math.sin(f.angle)*s+Math.cos(f.angle)*side,
     f.angle+side*.036,Math.min(1,delay*3),col);
   }
  }else{
   const count=f.id==='hana_clutch'?4:f.id==='hana_wall'?10:6;
   for(let i=0;i<count;i++){
    const a=i*Math.PI*2/count,k=r*(f.id==='hana_clutch'?.57:.67);
    dfRenderArm(x+Math.cos(a)*k,y+Math.sin(a)*k*.57,a*.27,stage,col);
   }
  }
  ctx.fillStyle='#f9bfdc';
  for(let i=0;i<7;i++)ctx.fillRect(Math.round(x+Math.cos(i*2.35+p)*r*.9),Math.round(y+Math.sin(i*2+p)*r*.38-p*19),3,2);
 }
 ctx.restore();
};}
DL_HOOKS.push((list,cx,cy)=>{
 const P=G.P;if(!dfNewCombatReady(P))return;
 const fire=P.fruit==='mera'&&P.meraLogiaHits>0&&P.meraLogiaUntil>G.t;
 const wall=P.fruit==='hana'&&P.hanaGuardHP>0&&P.hanaGuardUntil>G.t;
 if(!fire&&!wall)return;
 list.push({type:'xdraw',x:P.x,y:P.y+2,noShadow:true,draw:()=>{
  const x=P.x-cx,y=P.y-cy;
  ctx.save();ctx.globalAlpha=.74;
  if(fire)for(let i=0;i<8;i++){
   const a=i*.83+G.t*5,xx=Math.round(x+Math.cos(a)*15),yy=Math.round(y+Math.sin(a)*7-4);
   const h=7+Math.round((1+Math.sin(a*2+G.t*17))*6);
   dfFlameTongue(xx,yy,6+(i%3),h,a,i%3+1);
   dfFlameTongue(xx+1,yy,3,h*.65,a,4);
  }
  if(wall)for(let i=0;i<6;i++){
   const a=i*Math.PI/3+G.t*.8;
   dfRenderArm(x+Math.cos(a)*20,y+Math.sin(a)*12,.18,1,'#f3b3b7');
  }
  ctx.restore();
 }});
});

function dfDiscoverySites(M,P=G.P){
 const sites=[
  [['Foosha','Foosha'],[502,241]],
  [['Foosha','Foosha'],[545,246]]
 ];
 if(M.shells)sites.push([['Shells Town','Shells Town'],[M.shells.start+207,198]]);
 if(M.orange)sites.push([[ORANGE_NAME,ORANGE_NAME],[613,466]]);
 if(M.rare&&P?.dawnCrewJoined&&P.bossKills?.[ORANGE_BUGGY])sites.push([[RARE_NAME,RARE_NAME],[1246,485]]);
 if(M.syrup&&P?.rareDone&&P.dawnCrewJoined)sites.push([[SYRUP_NAME,SYRUP_NAME],[951,757]]);
 return sites;
}
function dfNewDiscovery(P,M,kind,roll=Math.random){
 const sites=dfDiscoverySites(M,P),len=sites.length,start=Math.floor(roll()*len)%len;
 for(let i=0;i<len;i++){
  const [name,[x,y]]=sites[(start+i)%len];
  const p=freePxNear(M,x*16+8,y*16+10,5);
  if(!p)continue;
  const [px,py]=p,cell=M.ter[M.I(px>>4,py>>4)];
  if(WATERY[cell]||SOLID_T[cell]||cell===T.DEEP)continue;
  return {x:px,y:py,t:G.t,kind,island:L2(...name)};
 }
 return null;
}
function dfAnnouncement(F){
 const fruit=DFR[F.kind||'transparente'];
 banner(fruit.ic+' '+ITEMS[fruit.item].n,F.island?
  L2('Apareció en ','Appeared on ')+F.island+L2(' · Quedan 4 minutos',' · 4 minutes remaining'):
  L2('Apareció cerca · Quedan 4 minutos','Appeared nearby · 4 minutes remaining'));
 sfx('quest');
 setWp({loc:[F.x>>4,F.y>>4],m:'dawn',t:ITEMS[fruit.item].n});
}
{const old=dfTrySpawn;dfTrySpawn=function(){
 const P=G.P,M=G.map;
 if(!P||M?.id!=='dawn'||P.dead||DF_SPAWN.f||G.t-DF_SPAWN.t<45)return;
 if(!P.dawnHelm)old.apply(this,arguments);
 if(DF_SPAWN.f)return;
 DF_SPAWN.t=G.t;
 const roll=Math.random();
 if(dfHas()&&roll<.26){
  const kind=roll<.13?'mera':'hana',fruit=DF_NEW[kind];
  if(P.fruit!==kind&&!countItem(fruit.item)){
   const site=dfNewDiscovery(P,M,kind);
   if(site){ DF_SPAWN.f=site;dfAnnouncement(site); }
  }
 }
};}
MAPC.df_fruit=[L2('Fruta del Diablo','Devil Fruit'),L2('Fruta','Fruit'),'#ffc473','star'];
{const old=otherPOI;otherPOI=function(M){
 const out=old.apply(this,arguments),F=DF_SPAWN.f;
 if(M.id==='dawn'&&F&&G.t-F.t<240&&F.kind){
  const fruit=DFR[F.kind];
  out.push({c:'df_fruit',x:F.x>>4,y:F.y>>4,t:ITEMS[fruit.item].n+' · '+F.island});
 }
 return out;
};}
GSIS.push(['dawn_element_fruits',L2('Mera Mera y Hana Hana','Flame-Flame and Flower-Flower'),()=>[
 L2('Las dos frutas aparecen ocasionalmente en el Mar de Dawn durante cuatro minutos. El aviso dice la isla y el mapa marca el punto. Requieren que ya tengas acceso a los desembarcos.','Both fruits occasionally appear in the Dawn Sea for four minutes. The alert names the island and the map marks the spot. You must already have landing access.'),
 L2('Se comen desde el inventario. Equipa sus técnicas en Habilidades › Fruta. Solo puedes tener el poder de una fruta a la vez.','Eat them from your inventory. Equip techniques in Skills › Fruit. You can only have one fruit power at a time.'),
 L2('Shanks retira la Mera Mera con Voluntad 2 y la Hana Hana con Voluntad 1. Si ya ganaste su duelo, puede retirar cualquiera de las dos.','Shanks removes Flame-Flame at Will rank 2 and Flower-Flower at Will rank 1. If you already won his duel, he can remove either power.')
],()=>{const F=DF_SPAWN.f;return F?.kind?{loc:[F.x>>4,F.y>>4],m:'dawn',t:ITEMS[DFR[F.kind].item].n}:null;}]);

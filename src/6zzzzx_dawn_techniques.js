// [nombre, inglés, alcance, impactos, peso, recarga, forma visual]
const CREW_TECHNIQUES={
 [SHELLS_CAST_IDS.luffy]:[
  ['Puñetazo de Goma','Gum-Gum Pistol',155,1,1,2.1,'rubber'],
  ['Metralleta de Goma','Gum-Gum Gatling',124,6,1.8,4.1,'rubber'],
  ['Bazuca de Goma','Gum-Gum Bazooka',105,2,1.52,3.6,'rubber'],
  ['Hacha de Goma','Gum-Gum Axe',74,1,1.8,4.5,'axe'],
  ['Bala de Goma','Gum-Gum Bullet',61,1,1.48,3.1,'rubber']
 ],
 [SHELLS_CAST_IDS.zoro]:[
  ['Onigiri','Oni Giri',65,3,1.45,3.05,'blade'],
  ['Corte del Tigre','Tiger Hunt',55,2,1.55,3.6,'blade'],
  ['Barrido de tres espadas','Three-Sword Sweep',44,3,1.2,2.9,'sweep'],
  ['Paso cruzado','Cross Step',75,2,1.13,2.5,'blade'],
  ['Guardia y corte','Guard and Cut',48,1,1.6,4.3,'sweep']
 ],
 [SYRUP_USOPP]:[
  ['Estrella de plomo','Lead Star',168,1,1,2.1,'shot'],
  ['Estrella de pólvora','Gunpowder Star',136,1,1.7,4,'powder'],
  ['Tiro de rebote','Ricochet Shot',138,2,1.16,2.8,'shot'],
  ['Abrojos de la cuesta','Slope Caltrops',80,1,1.12,2.7,'sweep'],
  ['Tiro de cobertura','Cover Shot',158,2,1.4,3.5,'shot']
 ],
 [BAR_SANJI]:[
  ['Collier','Collier',56,1,1.2,2.45,'kick'],
  ['Épaule','Épaule',63,1,1.17,2.6,'kick'],
  ['Côtelette','Côtelette',57,3,1.55,3.6,'kick'],
  ['Selle','Selle',49,2,1.36,3.1,'sweep'],
  ['Gigot','Gigot',67,1,1.75,4.3,'kick']
 ]
};
SYRUP_ALLIES[BAR_SANJI]=[45200,4200,61];
const CREW_TECH_COLORS={blade:'#adedd7',rubber:'#ffcc93',axe:'#ffe381',kick:'#ffd4a9',sweep:'#acecdb',shot:'#fff2ba',powder:'#ff9b54'};
SAVEKEYS.push('dawnCrewTactics');
function crewTechniqueMenu(npc){
 const P=G.P,id=npc.id,skills=CREW_TECHNIQUES[id];
 const choose=i=>{
  const prefs=P.dawnCrewTactics||(P.dawnCrewTactics={});
  if(i<0)delete prefs[id];else prefs[id]=i;
  markDirty(true);crewTechniqueMenu(npc);
 };
 const pref=P.dawnCrewTactics?.[id]??-1;
 const items=[{label:(pref<0?'✓ ':'')+L2('Automático','Automatic'),icon:['talk'],fn:()=>choose(-1)}];
 skills.forEach(([es,en,range,hits,,cd],i)=>items.push({
  label:(pref===i?'✓ ':'')+L2(es,en)+' · '+range+' px · '+hits+'× · '+cd+' s',
  icon:['sword'],fn:()=>choose(i)
 }));
 items.push({label:L2('Volver','Back'),fn:dialogMenu});
 typeText(L2('Elige una técnica prioritaria. Usaré otra si está recargando o el rival queda fuera de alcance.','Choose a preferred technique. I’ll use a different one if it’s recharging or the enemy is out of range.'));
 setOpts(items);
}
DLG_HOOKS.push((npc,opts)=>{
 if(!npc.dawnCrew||G.map?.id!=='dawn'||!CREW_TECHNIQUES[npc.id])return;
 opts.unshift({label:L2('Técnicas de combate','Combat techniques'),icon:['sword'],fn:()=>crewTechniqueMenu(npc)});
});
function crewTechniqueAttack(M,e,m,foes,live,boost=1,floor=.22){
 const skills=CREW_TECHNIQUES[e.id];
 if(G.map!==M||!skills||e.hp===0||e.remove||m.dying||m.remove||G.t<(e.nextAssist||0))return false;
 const cooldown=e.crewCooldown||(e.crewCooldown=[]),dist=d2(e,m);
 const clustered=foes.filter(b=>!b.dying&&dist2(b.x,b.y,m.x,m.y)<56**2).length>1;
 const preferred=G.P.dawnCrewTactics?.[e.id];
 let best=-1,score=-Infinity;
 skills.forEach((s,i)=>{
  const [,,reach,,weight,,mode]=s;
  if((cooldown[i]||0)>G.t||dist>reach**2)return;
  const value=i===preferred?99:weight+(clustered&&['sweep','powder'].includes(mode)?.95:0)+(m.hp<m.maxhp*.38&&s[3]===1?.28:0)+reach*.001;
  if(value>score){best=i;score=value;}
 });
 if(best<0)return false;
 const [es,en,reach,hits,power,cd,mode]=skills[best],dur=hits>3?.83:.64;
 const angle=Math.atan2(m.y-e.y,m.x-e.x),col=CREW_TECH_COLORS[mode];
 const level=Math.max(550,e.lv||550),scale=1+clamp((level-550)*.004,0,.5);
 const total=Math.min(m.maxhp*.028,m.maxhp*.0118*power*boost*scale);
 e.dir=dirFromVec(m.x-e.x,m.y-e.y);setAnim(e,'atk');
 e.actionUntil=G.t+dur;e.actionLength=dur;e.nextAssist=G.t+1.68;cooldown[best]=G.t+cd;
 e.crewPose={index:best,start:G.t,end:G.t+dur};
 floatText(e.x,e.y-72,L2(es,en),col);
 for(let j=0;j<hits;j++){
  const delay=.24+j*.49/hits;
  const x=e.x,y=e.y-13,endX=m.x,endY=m.y-12;
  addFx({type:'crewTechnique',x,y,endX,endY,angle,mode,col,delay,j,dur:delay+.25,tick:delay,cbTick(f){
   if(f.fired||!live()||e.remove||e.hp===0||m.dying||m.remove)return;
   f.fired=true;
   if(d2(e,m)>(reach+18)**2)return;
   const area=mode==='sweep'||mode==='powder';
   for(const target of area?foes:[m]){
    if(target.dying||target.remove||target.hp<=target.maxhp*floor||dist2(target.x,target.y,m.x,m.y)>55**2)continue;
    hitMob(target,total/hits*(target===m?1:.56),{summon:true});
   }
   burst(m.x,m.y-12,mode==='powder'?16:5,{sp:90,up:15,g:62,life:.3,c:[col,'#fff4d9']});
  }});
 }
 return true;
}
{const old=drawFx;drawFx=function(f,cx,cy){
 if(f.type!=='crewTechnique')return old.apply(this,arguments);
 const progress=clamp(f.t/f.delay,0,1),x=f.x-cx,y=f.y-cy,ex=f.endX-cx,ey=f.endY-cy;
 ctx.save();ctx.strokeStyle=f.col;ctx.fillStyle=f.col;ctx.globalAlpha=1-Math.max(0,f.t-f.delay)/.27;
 if(f.mode==='shot'||f.mode==='powder'){
  const xx=lerp(x,ex,progress),yy=lerp(y,ey,progress)-Math.sin(Math.PI*progress)*(f.mode==='powder'?19:4);
  ctx.fillRect(xx-2,yy-2,4,4);
  if(f.fired&&f.mode==='powder'){ctx.beginPath();ctx.arc(ex,ey,7+(f.t-f.delay)*65,0,Math.PI*2);ctx.stroke();}
 }else if(f.mode==='rubber'||f.mode==='axe'){
  const z=f.mode==='axe',xx=lerp(x,ex,progress),yy=lerp(y,ey,progress)-Math.sin(progress*Math.PI)*(z?41:5)+Math.sin(f.j*2)*5;
  ctx.lineWidth=z?7:4;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(lerp(x,xx,.5),z?yy-18:yy,xx,yy);ctx.stroke();
  ctx.fillRect(xx-4,yy-4,8,8);
 }else{
  const a=f.angle+(progress-.5)*1.6+Math.sin(f.j*2)*.21,r=f.mode==='kick'?42:53;
  ctx.lineWidth=f.mode==='kick'?3:2;ctx.beginPath();ctx.ellipse(x,y,r,r*.6,a,a-1,a+.83);ctx.stroke();
 }
 ctx.restore();
};}
DAWN_CREW_TOPICS[BAR_SANJI]=[
 ['Provisiones','Provisions','La próxima compra la hago yo. Si mando a Luffy, se trae el barril vacío.','I’m doing the shopping next time. Luffy would bring back an empty barrel.','deck'],
 ['Defender el comedor','Defending the dining room','En cubierta puedo estirar la pierna. En el comedor, hasta una patada tiene que esquivar los platos.','On deck I can stretch my legs. In the dining room even a kick has to dodge the dishes.'],
 ['El sueño del All Blue','Dreaming of the All Blue','Si de verdad se juntan cuatro mares, quiero saber qué cocinan los pescadores de ese puerto.','If four seas really meet, I want to learn what the fishermen in that port cook.']
];
DAWN_CREW_TOPICS[SHELLS_CAST_IDS.luffy].push(
 ['Cuando Kuro desaparece','When Kuro disappears','Si ya no veo a Kuro, espero a oír el siguiente paso. Entonces le tiro el puño donde va a parar.','When Kuro vanishes, I wait for his next footstep. Then I throw my fist where he’s going to stop.']);
DAWN_CREW_TOPICS[SHELLS_CAST_IDS.zoro].push(
 ['Cuándo cruzar las espadas','When to cross swords','Déjame sitio al entrar. Si el otro se aparta, sigo con un corte corto sin quedarme vendido.','Give me room on the way in. If they step aside I follow with a short cut to stay covered.']);
DAWN_CREW_TOPICS[SYRUP_USOPP].push(
 ['Disparo de cobertura','Covering shot','Yo puedo tirar desde atrás mientras tú avanzas. Avísame si vas a cambiar de lado.','I can shoot from behind while you advance. Let me know if you’re changing sides.']);

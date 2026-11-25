const CON_AXE_RAISE=2.45,CON_AXE_DROP=3.87,CON_AXE_END=8.65;
const CON_AXE_FLOORS=[
 [4.27,0,'Sala de mapas','Map room'],
 [4.89,128,'Galería superior','Upper gallery'],
 [5.49,256,'Galería inferior','Lower gallery'],
 [6.13,384,'Planta baja','Ground floor']
];
const CON_FINISH_IMG=Object.fromEntries(Object.entries(typeof CON_FINISH_ART==='undefined'?{}:CON_FINISH_ART).map(([id,url])=>{
 const image=new Image();image.src=url;return [id,image];
}));
function conomiAxeTick(R,t){
 const [luffy,arlong]=R.cast;
 if(t>=CON_AXE_RAISE&&R.beat===2){
  R.beat=3;setAnim(luffy,'atk');
  shellsRescueSpeak(luffy,'¡Hacha de Goma!','Gum-Gum Axe!');
 }
 const landed=CON_AXE_FLOORS.filter(([at])=>t>=at).length;
 while((R.floorHits||0)<landed){
  const floor=R.floorHits||0;R.floorHits=floor+1;
  sfx(floor===3?'boom':'hit');G.shake=floor===3?19:8;
  setAnim(arlong,floor===3?'dead':'hurt');
  if(floor===3)banner(L2('Arlong Park se derrumba','Arlong Park collapses'),L2('Cocoyashi es libre','Cocoyashi is free'));
 }
}
function conomiAxeDepth(t){
 let previousTime=CON_AXE_DROP,previousDepth=-64;
 for(const [at,y] of CON_AXE_FLOORS){
  if(t<at){
   const p=clamp((t-previousTime)/(at-previousTime),0,1);
   return lerp(previousDepth,y,p*p*(2-p));
  }
  previousTime=at;previousDepth=y;
 }
 return previousDepth;
}
function conomiCutawayFloor(g,x,y,w,i,t){
 const [impact]=CON_AXE_FLOORS[i],age=t-impact,broken=age>=0,base=i===3;
 const left=x-w/2,right=x+w/2;
 g.fillStyle=['#514046','#463b45','#3a3947','#323443'][i];g.fillRect(left,y-116,w,116);
 g.fillStyle='#745a4c';
 for(let k=0;k<5;k++){
  g.fillRect(left+k*w/4-3,y-116,6,116);
  g.fillRect(left+5,y-112+k*22,w-10,1);
 }
 if(i===0){
  g.fillStyle='#b39b73';g.fillRect(left+30,y-39,62,24);g.fillRect(right-92,y-39,62,24);
  g.fillStyle='#dfcb9e';g.fillRect(left+35,y-41,47,15);g.fillRect(right-83,y-41,41,15);
  g.fillStyle='#617b7e';g.fillRect(left+43,y-36,23,3);g.fillRect(right-76,y-32,28,2);
 }else{
  g.fillStyle='#202b36';g.fillRect(left+35,y-85,38,57);g.fillRect(right-73,y-85,38,57);
  g.fillStyle='#8d7065';g.fillRect(left+35,y-85,38,4);g.fillRect(right-73,y-85,38,4);
 }
 const hole=broken&&!base?Math.min(65,41+age*43):0;
 g.fillStyle='#34252a';g.fillRect(left,y+6,w,8);
 g.fillStyle='#bc8e63';
 if(hole){
  g.fillRect(left,y,w/2-hole,7);g.fillRect(x+hole,y,w/2-hole,7);
  for(let j=0;j<5;j++){
   g.fillStyle=j%2?'#b28761':'#684c40';
   g.fillRect(x-hole-3+(j%2)*4,y+2*j,8-j,5);
   g.fillRect(x+hole-(j%2)*5,y+j*2,7-j,5);
  }
 }else{
  g.fillRect(left,y,w,7);
  if(base&&broken){
   g.strokeStyle='#211d24';g.beginPath();g.moveTo(x-57,y+3);g.lineTo(x-12,y+1);g.lineTo(x+17,y+10);g.lineTo(x+54,y+5);g.stroke();
  }
 }
 if(broken&&age<1.6){
  g.save();g.globalAlpha=Math.max(0,1-age/1.6);
  for(let j=0;j<24;j++){
   const vx=((j*37)%151-75),vy=(j*29)%75;
   g.fillStyle=['#d6a77c','#bd8f68','#78574a','#e4c19b'][j%4];
   g.fillRect(x+vx*(.28+age),y-vy*age+123*age*age,3+j%9,3+j%5);
  }
  g.restore();
 }
}
function conomiAxeFrame(scene,t){
 if(t<CON_AXE_RAISE)return;
 const g=ctx,[luffy,arlong]=scene.cast;
 const scale=Math.min(VW/370,VH/237),depth=conomiAxeDepth(t),final=t>=CON_AXE_FLOORS[3][0];
 const hits=scene.floorHits||0,last=CON_AXE_FLOORS[Math.max(0,hits-1)][0];
 const kick=hits?Math.max(0,1-(t-last)*6)*(hits===4?12:6):0;
 const x=VW/2,y=VH*(t<CON_AXE_DROP?.69:.64),offset=hits%2?kick:-kick;
 g.save();g.fillStyle='#141e2a';g.fillRect(0,0,VW,VH);
 g.translate(Math.round(x+offset),Math.round(y));g.scale(scale,scale);
 const shift=t<CON_AXE_DROP?12:depth;
 for(const [i,[,floor]] of CON_AXE_FLOORS.entries())conomiCutawayFloor(g,0,floor-shift,305,i,t);
 const a=arlong.atlas,b=luffy.atlas;
 const target=t<CON_AXE_DROP?10:depth+9;
 const actorY=final?384-shift+3:target-shift;
 if(final)atlasBlit(g,a,a.idx.dead,1,-a.ax+15,actorY-a.ay,a.fw,a.fh);
 else atlasBlit(g,a,t<CON_AXE_DROP?a.idx.atk+1:a.idx.hurt,1,-a.ax+15,actorY-a.ay,a.fw,a.fh);
 const frame=t<CON_AXE_DROP?'lift':final?'rest':'slam',img=CON_FINISH_IMG[frame];
 const lift=clamp((t-CON_AXE_RAISE)/.75,0,1);
 const weaponX=t<CON_AXE_DROP?-49:-44;
 const foot=t<CON_AXE_DROP?-12:final?0:-6;
 if(img?.naturalWidth){
  const h=img.naturalHeight,w=img.naturalWidth,dx=weaponX-w/2;
  if(frame==='lift'){
   const tip=Math.round(h*.10),leg=Math.round(h*.29),body=h-tip-leg;
   const extension=Math.max(1,Math.round(leg*(.14+.86*lift))),bodyY=foot-body;
   g.drawImage(img,0,tip+leg,w,body,dx,bodyY,w,body);
   g.drawImage(img,0,tip,w,leg,dx,bodyY-extension,w,extension);
   g.drawImage(img,0,0,w,tip,dx,bodyY-extension-tip,w,tip);
  }else g.drawImage(img,dx,foot-h);
 }else{
  atlasBlit(g,b,frame==='rest'?b.idx.idle:b.idx.atk+2,2,weaponX-b.ax,foot-b.ay,b.fw,b.fh);
  if(frame==='lift'){
   g.fillStyle='#e4a16a';g.fillRect(weaponX+12,foot-33-103*lift,6,103*lift);
   g.fillStyle='#5b3a27';g.fillRect(weaponX+9,foot-35-103*lift,14,4);
  }
 }
 g.restore();
 g.save();
 g.fillStyle='#162336';g.fillRect(0,0,VW,20);g.fillRect(0,VH-22,VW,22);
 const floor=CON_AXE_FLOORS[Math.min(hits,3)];
 g.font='bold 10px sans-serif';g.fillStyle='#f3e3ca';g.textAlign='center';
 g.fillText(final?L2('Arlong derrotado · Planta baja','Arlong defeated · Ground floor'):L2(floor[2],floor[3]),VW/2,VH-8);
 g.restore();
}
WORLD_DRAW.push(()=>{
 const scene=G.map?.conomi?.scene;
 if(scene?.kind==='finale')conomiAxeFrame(scene,G.t-scene.at);
});
const CONOMI_AFTER_TALK={
 [SHELLS_CAST_IDS.luffy]:['Las cartas de Nami','Nami’s charts','Que dibuje hasta el último rincón del mar si le da la gana. Ahora cada mapa que haga será suyo.','She can draw every corner of the sea if she wants. Now every chart she draws will be hers.'],
 [SHELLS_CAST_IDS.zoro]:['Después del parque','After the park','Seis espadas y todavía sigo de pie. Ya me sentaré cuando salgamos del puerto.','Six swords and I’m still standing. I’ll sit down once we’re out of the harbor.'],
 [BAR_SANJI]:['La cena de Cocoyashi','Supper in Cocoyashi','Nojiko trajo mandarinas. Voy a guardar las mejores para cuando Nami vuelva al timón.','Nojiko brought tangerines. I’ll save the best ones for when Nami takes the helm.'],
 [SYRUP_USOPP]:['La historia que contaré','The story I’ll tell','Esta vez puedo contar cómo vencí a Chew sin adornar nada. Bueno, quizá dé un poco más de altura al chorro.','This time I can tell how I beat Chew without embellishing. Well, I might make his water shot a little taller.'],
 [ORANGE_NAMI]:['Nuestro próximo rumbo','Our next heading','Lo primero que voy a marcar es el huerto. Así siempre sabré cómo volver. Después, dime qué parte del mar quieres ver.','First I’ll mark the orchard, so I’ll always know how to come back. Then tell me what part of the sea you want to see.']
};
DLG_HOOKS.push((npc,opts)=>{
 if(!G.P?.conomiCleared)return;
 const topic=CONOMI_AFTER_TALK[npc.id==='con_nami'?ORANGE_NAMI:npc.id];
 if(!topic||!npc.dawnCrew&&npc.id!=='con_nami')return;
 const [es,en,line,english]=topic;
 opts.unshift({label:L2(es,en),icon:['talk'],fn:()=>typeText(L2(line,english))});
});

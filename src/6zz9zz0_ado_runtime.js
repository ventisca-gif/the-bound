// v5.08 Ado: approved art, shared romance/family/online systems, one existing concert hall.
const ADO_HAIR_PAL=['#111323','#252a46','#434d78','#7086ad'];
HAIRS.ado=pal(ADO_HAIR_PAL);HAIR_N.ado='Azul Ado';if(!HAIR_ORDER.includes('ado'))HAIR_ORDER.push('ado');
R8_PALETTES.ado=ADO_HAIR_PAL;
const ADO_HS={};for(const [g,T] of [['f',HS_F],['m',HS_M]]){ADO_HS[g]=T.length;T.push({n:L2('Ado · detallado','Ado · detailed'),cap:'round',bang:'full',side:4,back:12,r8HD:'ado',r8Base:'ado'});}
const ADO_APP={g:'f',bt:1,skin:0,hair:'ado',eyes:'celeste',hs:ADO_HS.f,top:[1,'blanco'],bot:[2,'negro'],shoe:[0,'negro']};
NPCS.jp_ado={n:'Ado',title:L2('Cantante invitada · Rosa azul','Guest singer · Blue rose'),look:LK({g:'f',skin:SKINS[0],hair:HAIRS.ado,eyes:'celeste',hairStyle:'long',outfit:'dress',main:CLOTH.negro,sec:CLOTH.blanco}),quests:[],lines:[
 L2('En el escenario puedo decir lo que fuera de él se me queda en la garganta.','On stage I can say what gets stuck in my throat elsewhere.'),
 L2('La rosa azul no necesita parecerse a las otras flores. Esa idea me gusta.','The blue rose does not need to look like the other flowers. I like that thought.'),
 L2('Estoy preparando la voz. ¿Te quedas al ensayo?','I am warming up my voice. Will you stay for rehearsal?'),
 L2('Miku me enseñó a disfrutar las luces. Teto dice que lo importante es no olvidar la merienda.','Miku taught me to enjoy the lights. Teto says the important thing is not to forget snacks.'),
 L2('A veces una canción termina y todavía necesito unos segundos de silencio.','Sometimes a song ends and I still need a few seconds of silence.'),
 L2('Me gusta caminar por Akihabara cuando las tiendas están a punto de cerrar.','I like walking around Akihabara when the shops are about to close.'),
 L2('Ese broche azul me acompaña en cada ensayo. No es una armadura, pero me da valor.','That blue brooch comes with me to every rehearsal. It is not armor, but it gives me courage.'),
 L2('No hace falta cantar perfecto para cantar con alguien.','You do not need to sing perfectly to sing with someone.'),
 L2('Hoy compartimos sala. Cada artista necesita su espacio y cada público, su momento.','We share the hall today. Every artist needs space and every audience its moment.'),
 L2('¿También escuchas la lluvia como si llevara un ritmo?','Do you also hear the rain as if it had a rhythm?'),
 L2('Si me ves con el traje pequeño, no te rías: es cómodo para pasear.','If you see me in the little outfit, do not laugh: it is comfortable for walks.'),
 L2('Gracias por escuchar hasta la última nota.','Thank you for listening to the very last note.') ]};
ROM.jp_ado={g:'f',loves:['bouquet','crystal'],likes:['cake','gem','amulet'],hates:['bone','ore'],taste:L2('las flores azules y los cristales','blue flowers and crystals')};
ROM_WHERE.jp_ado=L2('Sala STELLA☆LINK, Akihabara (Japón), rincón de la rosa azul','STELLA☆LINK hall, Akihabara (Japan), blue rose corner');
STELLA_PARTNER_OUTFITS.jp_ado=['normal','ado_chibi'];PT_SETS.ado_chibi={n:L2('Ado · estilo del juego','Ado · game style')};
STELLA_LOVE_LINES.jp_ado=[
 L2('Hoy no quiero cantar para una sala llena. Quiero cantar bajito para ti. ♥','Today I do not want to sing for a full hall. I want to sing softly for you. ♥'),
 L2('Tu mano no hace ruido, pero cuando me la das todo se calma.','Your hand makes no sound, but when you give it to me everything becomes quiet.'),
 L2('Ensayé cómo decirte que te extrañaba. Al verte se me olvidaron las palabras.','I rehearsed how to say I missed you. When I saw you I forgot the words.'),
 L2('Cuando acabe el concierto, ¿volvemos juntos a casa?','When the concert ends, shall we go home together?'),
 L2('Si nuestra familia fuera una canción, querría escucharla cada mañana.','If our family were a song, I would want to hear it every morning.'),
 L2('No necesito focos cuando sonríes así. ♥','I do not need spotlights when you smile like that. ♥') ];
// Fixed identity for inheritance, independent of concert graphics, outfit, or palette object identity.
{const old=partnerApp;partnerApp=function(id){if(id==='jp_ado')return{g:'f',hair:'ado',skin:0,eyes:'celeste',hs:ADO_HS.f};if(id==='jp_miku')return{g:'f',hair:'turquesa',skin:0,eyes:'turquesa'};if(id==='jp_teto')return{g:'f',hair:'rojo',skin:0,eyes:'rojo'};return old.apply(this,arguments);};}
{const old=mixApps;mixApps=function(g,n){const out=old.apply(this,arguments);if(G.P?.partner!=='jp_ado')return out;for(let i=0;i<out.length;i++){const a=out[i];if(i%2===0){a.hs=ADO_HS[g];if(a.hair!=='ado')a.r8Dye=1;}else if(i%3===0)a.hair2='ado';if(i%3===0){const B=partnerApp('jp_ado'),A=normApp(G.P.app);if(A.eyes!==B.eyes)a.eyes2=a.eyes===A.eyes?B.eyes:A.eyes;}}return out;};}
const ADO_IMAGES={};for(const style of ['detail','classic'])ADO_IMAGES[style]=ADO_ART[style].map(src=>{const im=new Image();im.src=src;return im;});
const IDOL_SOCIAL_CACHE=new Map();
// Split limbs from the original sprite, pose them at their existing shoulder anchors, keep hair/face pixels.
function idolPoseFrame(source,sw,sh,row,anim,f,adoStyle){
 const w=adoStyle?96:sw*2,h=adoStyle?112:sh*2,c=mkCanvas(w,h),x=c.getContext('2d');x.imageSmoothingEnabled=false;
 if(adoStyle)x.drawImage(source,0,0);else x.drawImage(source,0,row*sh,sw,sh,0,0,w,h);
 const idle=anim==='idle',walk=anim==='walk',hug=anim==='hug',kiss=anim==='kiss',sit=anim==='sit'||anim==='held',wave=anim==='wave'||anim==='cheer',sing=anim==='dance';
 const head=adoStyle?(adoStyle==='detail'?51:65):Math.round(h*.53),waist=adoStyle?(adoStyle==='detail'?81:86):Math.round(h*.77),base=h-8;
 const body=mkCanvas(w,h),b=body.getContext('2d');b.imageSmoothingEnabled=false;
 const bob=walk||sing?(f%2?-2:0):idle?-(f%2):hug||kiss?-1-f:0;
 b.drawImage(c,0,0,w,waist,0,bob,w,waist);
 if(sit){const leg=mkCanvas(w,h),l=leg.getContext('2d');l.imageSmoothingEnabled=false;l.drawImage(c,0,waist,w,h-waist,0,waist,w,h-waist);b.save();b.translate(w/2,waist-2);b.rotate(row===1?-.85:.85);b.drawImage(leg,-w/2,-waist);b.restore();}
 else{const mid=w/2;for(let side=0;side<2;side++){const dx=walk?Math.round(Math.sin((f+side*2)*Math.PI/2)*2):0,dy=walk?Math.max(0,Math.round(Math.cos((f+side*2)*Math.PI/2)*2)):0;b.drawImage(c,side*mid,waist,mid,h-waist,side*mid+dx,waist+dy,mid,h-waist);}}
 if(hug||kiss||wave||sing||sit){
  // Cut only sleeve/skin pixels; blue hair behind the arms remains in place.
  const data=b.getImageData(0,0,w,h),d=data.data,arms=[mkCanvas(w,h),mkCanvas(w,h)],ay=head+3,cy=waist-2,aw=adoStyle?7:6,xc=w/2,offset=adoStyle?(adoStyle==='detail'?10:13):Math.round(w*.18);
  for(let i=0;i<2;i++){const ax=Math.round(xc+(i?offset:-offset)-aw/2),a=arms[i].getContext('2d'),part=a.createImageData(w,h);for(let yy=ay;yy<cy;yy++)for(let xx=ax;xx<ax+aw;xx++){if(xx<0||xx>=w)continue;const j=(yy*w+xx)*4,r=d[j],g=d[j+1],bl=d[j+2];if(!d[j+3]||(bl>r*1.25&&bl>g*1.16))continue;part.data.set(d.slice(j,j+4),j);d[j+3]=0;}a.putImageData(part,0,0);}
  b.putImageData(data,0,0);
  arms.forEach((part,i)=>{const ax=xc+(i?offset:-offset),ang=wave?(i?(-2.4+f*.2):0):sing?(i?-.9-f*.1:.2):hug?(i?1.05:-1.05):kiss?(i?.85:-.85):(i?.8:-.8);b.save();b.translate(ax,ay+bob);b.rotate(ang);b.drawImage(part,-ax,-ay);b.restore();});
  if(kiss&&row!==3){b.fillStyle='#df7d96';b.fillRect(xc-7,head-7+bob,2,1);b.fillRect(xc+4,head-7+bob,2,1);}
  if(sing&&row!==3){const mx=xc+(row===1?-6:6),my=head+7+bob;b.fillStyle='#a4b4d7';b.fillRect(mx-1,my-5,3,4);b.fillStyle='#111524';b.fillRect(mx,my-2,2,10);}
 }
 return body;
}
function idolSocialAtlas(id,out='normal'){
 const ado=id==='jp_ado',style=out==='ado_chibi'?'classic':'detail',key=id+':'+out;let A=IDOL_SOCIAL_CACHE.get(key);if(A){if(!A.ready)A.paint();return A;}
 const src=ado?null:(out!=='normal'?jpVariantAtlas(out):STELLA_NPC_ATLAS(id)),fw=ado?48:src.fw,fh=ado?56:src.fh;
 const names=['idle','walk','hug','kiss','sit','dance','cheer','wave','held'],idx={};let cols=0;for(const n of names){idx[n]=cols;cols+=ANIMS[n]?.[1]||1;}
 A={img:mkCanvas(fw*cols,fh*4),hd:mkCanvas(fw*cols*2,fh*8),fw,fh,ax:ado?24:src.ax,ay:ado?54:src.ay,idx,ready:false,idolHD:true,adoStyle:ado?style:null,key:'idol:'+key};IDOL_SOCIAL_CACHE.set(key,A);
 const paint=()=>{if(ado&&!ADO_IMAGES[style].every(im=>im.complete&&im.naturalWidth))return;if(src&&src.ready===false)return;const low=A.img.getContext('2d'),hi=A.hd.getContext('2d');low.imageSmoothingEnabled=hi.imageSmoothingEnabled=false;
  for(let row=0;row<4;row++)for(const n of names)for(let f=0;f<(ANIMS[n]?.[1]||1);f++){const source=ado?ADO_IMAGES[style][[0,2,3,1][row]]:src.img,frame=idolPoseFrame(source,fw,fh,row,n,f,ado?style:null),col=idx[n]+f;hi.drawImage(frame,col*fw*2,row*fh*2);low.drawImage(frame,0,0,fw*2,fh*2,col*fw,row*fh,fw,fh);}A.ready=true;};
 A.paint=paint;paint();if(ado)for(const im of ADO_IMAGES[style])im.addEventListener('load',paint,{once:true});return A;
}
{const old=stellaPartnerAtlas;stellaPartnerAtlas=function(id,out='normal'){return STELLA_PARTNER_OUTFITS[id]?idolSocialAtlas(id,out):old.apply(this,arguments);};}
{const old=npcAtlas;npcAtlas=function(id){if(id==='jp_ado'){const out=G.P?.partner===id&&G.P.pOut==='ado_chibi'?'ado_chibi':'normal';return idolSocialAtlas(id,out);}return old.apply(this,arguments);};}
{const old=rcompAtlas;rcompAtlas=function(id,out){if(STELLA_PARTNER_OUTFITS[id])return idolSocialAtlas(id,STELLA_PARTNER_OUTFITS[id].includes(out)?out:'normal');return old.apply(this,arguments);};}
{const old=atlasBlit;atlasBlit=function(c,A,col,row,x,y,w,h){if(A.idolHD&&A.ready&&HDS>1){c.drawImage(A.hd,col*A.fw*2,row*A.fh*2,A.fw*2,A.fh*2,x,y,w,h);return;}return old.apply(this,arguments);};}
// HD carried pose uses bent knees, resting hands, proper facing and the shared holder animation.
{const old=drawCarried;drawCarried=function(e,holder,cx,cy,kissing){const A=e.atlas;if(!A?.idolHD)return old.apply(this,arguments);const dir=holder.dir||'down',side=dir==='left'||dir==='right',d=dir==='left'?-1:1,row=DIRI[dir],x=holder.x-cx,y=holder.y-cy-10-(kissing?3:0),sc=(e.scale||1)*.8;ctx.save();ctx.translate(Math.round(x+(side?d*6:0)),Math.round(y));ctx.rotate(side?d*(-Math.PI/2+.25):dir==='up'?Math.PI/2:-Math.PI/2);atlasBlit(ctx,A,A.idx.held,row,-A.fw*sc/2,-A.fh*sc*.55,A.fw*sc,A.fh*sc);ctx.restore();};}
{const old=jpDrawDialoguePortrait;jpDrawDialoguePortrait=function(npc){if(npc.id!=='jp_ado')return old.apply(this,arguments);const im=new Image(),active=dlg;im.onload=()=>{if(dlg!==active)return;const c=$('#dport'),x=c.getContext('2d');x.imageSmoothingEnabled=false;x.clearRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);};im.src=ADO_ART.portrait;};}
V33_TICKS.push(()=>{for(const A of IDOL_SOCIAL_CACHE.values())if(!A.ready)A.paint();});
// Ado uses a dedicated side greeting spot; no additional room, automatic concert or crowd is created.
function adoPlace(M){if(!M||G.ents.some(e=>e.id==='jp_ado'&&!e.remove))return;spawnNPC('jp_ado',22*16+8,11*16+8,M.id,{face:'down',wander:0});}
{const old=makeLive;makeLive=function(){const M=old.apply(this,arguments);adoPlace(M);return M;};}
let adoShow=null;
function adoStop(){const s=adoShow;if(!s)return;adoShow=null;if(s.gain)s.gain.disconnect();for(const saved of s.saved){const e=saved.e;if(e.remove)continue;Object.assign(e,saved.state);}applyVolumes();}
function adoStart(netEnd,remoteHost){if(G.map?.id!==JP_GUEST_ROOM)return false;if(adoShow)return true;if(jpGuestShow||COMP?.e?.id==='jp_ado'){toast(L2('Termina la actuación actual o despídete de Ado antes del concierto.','End the current performance or say goodbye to Ado before the concert.'),'info');return false;}
 const saved=[];for(const e of G.ents)if(['jp_ado'].includes(e.id)&&e.map===G.map.id&&!e.scene){saved.push({e,state:{map:e.map,scene:e.scene||0,x:e.x,y:e.y,dir:e.dir}});e.scene=1;e.map='_ado_stage';}
 const remaining=Number.isFinite(netEnd)?svClamp((netEnd-Date.now())/1000,0,90):90;if(remaining<=0)return false;adoShow={room:G.map,start:G.t-(90-remaining),duration:90,end:Date.now()+remaining*1000,remoteHost,saved,beat:-1};audioUnlock();if(AC){adoShow.gain=AC.createGain();adoShow.gain.connect(AC.destination);}applyVolumes();return true;}
{const old=jpGuestStart;jpGuestStart=function(){if(adoShow){toast(L2('Ado está actuando. Termina su concierto con Akane.','Ado is performing. End her show with Akane.'),'info');return;}return old.apply(this,arguments);};}
{const old=liveOn;liveOn=()=>!!(adoShow&&G.map===adoShow.room)||old();}
{const old=jpLiveGroup;jpLiveGroup=function(next){if(!next&&adoShow&&G.map===adoShow.room)return{name:'ADO · BLUE ROSE',guest:true};return old.apply(this,arguments);};}
DLG_HOOKS.push((npc,opts)=>{if(npc.id==='jp_prod'&&G.map?.id===JP_GUEST_ROOM)opts.push({label:adoShow?L2('Terminar concierto de Ado','End Ado concert'):L2('Ver concierto de Ado · Rosa azul','Watch Ado · Blue rose'),icon:['star'],fn:()=>{closeDialog();if(adoShow)adoStop();else adoStart();}});
 if(npc.id==='jp_ado')opts.push({label:L2('Hablar del próximo concierto','Talk about the next concert'),icon:['talk'],fn:()=>typeText(L2('Akane me reserva este mismo escenario. Las demás actúan primero; cuando me toque, habrá espacio para escuchar mi voz.','Akane reserves this same stage for me. The others perform first; when my turn comes, there will be space to hear my voice.'))});});
V33_TICKS.push(()=>{if(adoShow&&(G.map!==adoShow.room||G.t-adoShow.start>=adoShow.duration))adoStop();});
DL_HOOKS.push(list=>{if(!adoShow||G.map!==adoShow.room)return;const t=G.t-adoShow.start,A=idolSocialAtlas('jp_ado'),phase=Math.floor(t/15)%3,x=248+Math.sin(t*1.7)*12,y=108;list.push({type:'xdraw',x,y,noShadow:true,draw(e,cx,cy){const row=[0,1,0,2][Math.floor(t/4)%4],f=Math.floor(t*5)%4;ctx.drawImage(shadowSprite(10,3),x-cx-10,y-cy-2);atlasBlit(ctx,A,A.idx.dance+f,row,Math.round(x-cx-A.ax),Math.round(y-cy-A.ay-Math.abs(Math.sin(t*3))*2),A.fw,A.fh);
 ctx.fillStyle='#759eea';for(let j=0;j<6;j++){const a=t*.6+j*Math.PI/3,rx=26+phase*5;ctx.fillRect(Math.round(x-cx+Math.cos(a)*rx),Math.round(y-cy-25+Math.sin(a)*rx*.45),1,2);}}});});
// Local performance cue is shared; late arrivals and expired/invalid packets cannot restart a finished show.
{const old=socialPresence;socialPresence=function(o){old.apply(this,arguments);if(adoShow&&!adoShow.remoteHost)o.ado=adoShow.end;};}
// Child appearance and partner wardrobe use existing save keys; appended hairstyle indices remain stable.
if(typeof GSIS!=='undefined')GSIS.push(['jp_ado','🎤 Ado · Rosa azul',()=>[
 L2('Ado espera en la zona derecha de la sala STELLA☆LINK de Akihabara, Japón. Habla con Akane para su concierto de 90 segundos en el escenario existente.','Ado waits on the right side of STELLA☆LINK in Akihabara, Japan. Talk to Akane for her 90-second show on the existing stage.'),
 L2('Su diseño detallado es el habitual. Si es tu pareja, su Armario incluye también el estilo pequeño. Comparte confianza, amor, regalos, paseos, abrazos, besos, cargar en brazos, boda y familia.','Her detailed design is the default. As your partner her Wardrobe also includes the small style. She shares trust, love, gifts, walks, hugs, kisses, carrying, marriage and family.'),
 L2('El peinado Ado está al final de los catálogos masculino y femenino y se ajusta a las cinco estructuras. Tinte original o personalizado. Los hijos mezclan pelo, ojos y piel de los dos padres.','The Ado hairstyle is appended to both catalogs and fits all five bodies. Original or custom dye. Children mix both parents hair, eyes and skin.')],()=>({loc:[161,77],t:'Ado · STELLA☆LINK',m:'japon'})]);

{const old=socialRecv;socialRecv=function(r,pr){old.apply(this,arguments);if(r.map!==JP_GUEST_ROOM||G.map?.id!==JP_GUEST_ROOM)return;const end=pr.ado;if(Number.isFinite(end)&&end>Date.now()&&end-Date.now()<=91000){if(!adoShow&&!jpGuestShow)adoStart(end,r.peer||r.id); }else if(adoShow?.remoteHost===(r.peer||r.id))adoStop();};}
{const old=applyVolumes;applyVolumes=function(){old.apply(this,arguments);if(adoShow){if(mGain)mGain.gain.value=0;if(adoShow.gain)adoShow.gain.gain.value=svClamp(SETTINGS.music,0,1)*.10;}};}
// Original procedural instrumental, not a recording or imitation of the singer's voice.
V33_TICKS.push(()=>{const s=adoShow;if(!s||!AC||!s.gain||AC.state!=='running'||document.hidden)return;const beat=Math.floor((G.t-s.start)*4);if(beat===s.beat)return;s.beat=beat;const melody=[69,72,76,74,72,69,67,64,65,69,72,76,74,72,67,69],n=melody[beat%16],t=AC.currentTime;tone(NOTE(n),t,.20,'triangle',.24,s.gain);if(beat%2===0)tone(NOTE([45,41,48,43][Math.floor(beat/8)%4]),t,.35,'sine',.34,s.gain);});
// Flavor dialogue reuses the original relationship gains and cooldowns.
{const old=romTalk;romTalk=function(npc){const r=old.apply(this,arguments);if(npc.id==='jp_ado')typeText(pick(rel('jp_ado').t<400?NPCS.jp_ado.lines:STELLA_LOVE_LINES.jp_ado.concat(NPCS.jp_ado.lines.slice(4,8))));return r;};}
{const old=romFlirt;romFlirt=function(npc){if(npc.id!=='jp_ado')return old.apply(this,arguments);const R=rel('jp_ado'),a=R.a,wait=cdLeft(R,'cf',150),r=old.apply(this,arguments);if(wait<=0)typeText(R.a>a?pick([L2('Eso no estaba en el ensayo… Me has hecho sonrojar.','That was not in rehearsal… You made me blush.'),L2('Si lo dices mirándome así, me voy a olvidar del estribillo.','If you say it while looking at me like that, I will forget the chorus.'),L2('Quédate un poco más. Todavía no quiero que termine esta conversación.','Stay a little longer. I do not want this conversation to end yet.')]):L2('Dame un poco de tiempo. Prefiero conocerte sin prisas.','Give me a little time. I would rather get to know you slowly.'));return r;};}
DLG_HOOKS.push((npc,opts)=>{if(npc.id!=='jp_ado')return;for(const [label,lines] of [
 [L2('La rosa azul','The blue rose'),[L2('Me recuerda que ser diferente también puede ser bonito.','It reminds me that being different can also be beautiful.'),L2('No hace falta que me traigas una rosa imposible. Con que vuelvas a saludarme me basta.','You do not need to bring me an impossible rose. Coming back to say hello is enough.')]],
 [L2('Después del escenario','After the stage'),[L2('Me quito los zapatos, preparo algo caliente y dejo de contar compases.','I take off my shoes, make something warm and stop counting beats.'),L2('Me cuesta dormir justo después de cantar. ¿Me acompañas a caminar?','I find it hard to sleep right after singing. Will you walk with me?')]],
 [L2('Su familia soñada','Her dream family'),[L2('Una casa donde nadie tenga miedo de cantar desafinado. Así la imagino.','A house where nobody is afraid of singing off key. That is how I imagine it.'),L2('Si algún día tenemos hijos, quiero escuchar sus propias canciones. No tienen que cantar como yo.','If we have children someday, I want to hear their own songs. They do not have to sing like me.')]]
 ])opts.push({label,icon:['talk'],fn:()=>typeText(pick(lines))});});

Object.assign(NPCS.jp_miku.look,{hair:HAIRS.turquesa,hairStyle:'long',eyes:'turquesa'});Object.assign(NPCS.jp_teto.look,{hair:HAIRS.rojo,hairStyle:'long',eyes:'rojo'});
JP_NEW_SPRITES.ado_chibi=ADO_ART.classic[0];
{const old=jpVariantAtlas;jpVariantAtlas=function(id){return id==='ado_chibi'?idolSocialAtlas('jp_ado',id):old.apply(this,arguments);};}

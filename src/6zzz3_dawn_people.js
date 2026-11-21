// El reparto humanoide usa los cuerpos y anclajes nativos.
const DAWN_CAST={
 dawn_shanks:{n:'Shanks',bt:2,hair:'rojo',skin:1,hs:5,top:'blanco',bot:'marron',kind:'shanks',hat:'straw',cape:true},
 dawn_benn:{n:'Benn Beckman',bt:2,hair:'negro',skin:1,hs:9,top:'negro',bot:'verde',kind:'benn'},
 dawn_roux:{n:'Lucky Roux',bt:3,hair:'marron',skin:1,hs:0,top:'verde',bot:'beige',kind:'roux',hat:'roux'},
 dawn_yasopp:{n:'Yasopp',bt:2,hair:'rubio',skin:3,hs:27,top:'azul',bot:'blanco',kind:'yasopp',hat:'band'},
 dawn_limejuice:{n:'Limejuice',bt:2,hair:'rubio',skin:1,hs:5,top:'blanco',bot:'marron',hat:'band'},
 dawn_snake:{n:'Building Snake',bt:2,hair:'marron',skin:1,hs:9,top:'amarillo',bot:'gris',hat:'band'},
 dawn_crew1:{n:L2('Marinero del Pelirrojo','Red Hair sailor'),bt:1,hair:'rojo',skin:1,hs:0,top:'gris',bot:'beige'},
 dawn_crew2:{n:L2('Vigía del Pelirrojo','Red Hair lookout'),bt:2,hair:'negro',skin:2,hs:0,top:'amarillo',bot:'gris'},
 dawn_makino:{n:'Makino',g:'f',bt:1,hair:'verde',skin:0,hs:5,top:'verde',bot:'beige',hat:'band'},
 dawn_pirata:{n:L2('Pirata pendenciero','Brawling pirate'),bt:2,hair:'negro',skin:3,hs:0,top:'amarillo',bot:'gris',kind:'pirate'}
};
const DAWN_PLACEMENTS=[['dawn_shanks',527,252],['dawn_benn',530,254],['dawn_roux',524,254],['dawn_yasopp',533,253],['dawn_limejuice',535,255],['dawn_snake',521,255],['dawn_crew1',518,257],['dawn_crew2',537,257],['dawn_makino',526,250],['dawn_luffy',523,252]];
fitKind('body','dawn_shirt',(p,A,s)=>{
 const {tx0,tw,torsoTop:y,th,cx,side,up,sk}=A,m=s.m,waist=y+th-2;
 if(s.dawn==='roux'){
  for(let x=tx0;x<tx0+tw;x++)for(let yy=y;yy<y+th-3;yy++)p.set(x,yy,(x-tx0)%4<2?m[2]:C('#eee8ce'));
  p.rect(tx0,y+th-4,tw,2,sk[2]);p.hl(tx0,waist,tw,m[1]);
 }else if(!up){
  const depth=s.dawn==='pirate'?3:Math.max(3,th-3);
  for(let yy=0;yy<depth;yy++){const half=Math.max(0,Math.round((1-yy/depth)*(side?2:3)));for(let x=cx-half;x<=cx+half;x++)if(x>=tx0&&x<tx0+tw)p.set(x,y+yy,sk[x<cx?3:2]);}
  if(s.dawn==='pirate')for(let yy=y+3;yy<waist;yy+=2)p.set(cx,yy,C('#49371d'));
 }
 const sash=s.dawn==='shanks'?C('#a42c34'):s.dawn==='benn'?C('#b29438'):s.dawn==='roux'?C('#247246'):null;
 if(sash)p.rect(tx0,waist,tw,2,sash);
});
fitKind('head','dawn_hat',(p,A,s)=>{
 const {hx,hy,hrx,headTop,side,up}=A,top=Math.max(2,Math.round(headTop)),wide=Math.ceil(hrx)+2;
 if(s.dawn==='straw'){
  p.ell(hx,top+4,wide+2,2,C('#b18b46'));p.ell(hx,top+3,wide+1,2,C('#dfbd71'));p.rect(hx-wide+3,top-1,wide*2-6,5,C('#e6c582'));p.hl(hx-wide+3,top+3,wide*2-6,C('#a73236'));p.hl(hx-wide+4,top,wide*2-9,C('#f4d99b'));
 }else if(s.dawn==='roux'){
  for(let y=top;y<top+6;y++)for(let x=hx-wide+2;x<hx+wide-1;x++)p.set(x,y,(x-hx+wide)%4<2?C('#277747'):C('#eee7cf'));
  if(!up){const y=Math.round(hy-2);for(const x of side?[hx-3]:[hx-4,hx+2]){p.rect(x-1,y-1,4,3,C('#6b5225'));p.rect(x,y,2,1,C('#b7d6cb'));}}
 }else{p.rect(hx-hrx,top+2,hrx*2,3,C('#7d4430'));p.hl(hx-hrx,top+2,hrx*2,C('#ae7149'));if(side||up)p.rect(hx+hrx-1,top+4,2,4,C('#7d4430'));}
});
function dawnLook(id,g,bt){const D=DAWN_CAST[id],app={...DEF_APP,g:g||D.g||'m',bt:bt===undefined?D.bt:bt,skin:D.skin,hair:HAIRS[D.hair]?D.hair:'negro',eyes:'marron',hs:D.hs,top:[1,CLOTH[D.top]?D.top:'negro'],bot:[0,CLOTH[D.bot]?D.bot:'negro'],shoe:[0,'negro']},L=heroLook('guerrero',app,{}, {},{});
 L.weapon=null;L.back=D.cape?{k:'cape',o:CLOTH.negro,i:CLOTH.negro,tr:CLOTH.negro}:null;
 if(D.kind)L.top={k:'dawn_shirt',dawn:D.kind,m:CLOTH[D.top]||CLOTH.negro,s:CLOTH.negro};
 if(D.hat)L.head={k:'dawn_hat',dawn:D.hat,cover:'hat'};
 if(id==='dawn_pirata')L.hs={...HS_M[0],cap:'buzz',bang:'none',side:0,back:0};
 L.dawnId=id;return L;
}
// Facial marks stay anchored to the native face; the face itself is never replaced.
{const old=drawHero;drawHero=function(p,L,dir,anim,f){const r=old.apply(this,arguments);if(L.dawnId==='dawn_shanks'&&p.meta&&!p.meta.up){const A=p.meta;if(!A.side){const x=Math.round(A.hx-4),y=Math.round(A.ey-1);for(let k=0;k<3;k++)p.vl(x+k,y,2,C('#883d37'));} }return r;};}
for(const id in DAWN_CAST)if(id!=='dawn_pirata')NPCS[id]={n:DAWN_CAST[id].n,title:L2('Dawn · Villa Foosha','Dawn · Foosha Village'),look:LK({}),quests:[],lines:[L2('En Foosha los molinos nunca dejan de mirar al mar.','In Foosha the windmills never stop facing the sea.')]};
NPCS.dawn_shanks.lines=[L2('Un buen capitán cuida de su gente. El mar puede esperar un brindis.','A good captain looks after his crew. The sea can wait for a toast.'),L2('Luffy quiere zarpar con nosotros. Todavía tiene muchas cosas que aprender en tierra.','Luffy wants to sail with us. He still has plenty to learn on land.')];
NPCS.dawn_benn.lines=[L2('Mantén los problemas lejos del pueblo. Aquí hay familias, no rivales.','Keep trouble away from the village. These are families, not rivals.')];
NPCS.dawn_roux.lines=[L2('¡Primero la comida! Luego ya hablaremos de aventuras.','Food first! We can talk about adventure afterwards.')];
NPCS.dawn_yasopp.lines=[L2('Desde estos muelles se ve dónde empieza una buena historia.','From these docks you can see where a good story begins.')];
NPCS.dawn_makino.lines=[L2('Bienvenido a Partys Bar. Shanks y su tripulación están descansando junto al puerto.','Welcome to Partys Bar. Shanks and his crew are resting by the harbour.')];
NPCS.dawn_luffy={n:'Luffy',title:L2('Dawn · Villa Foosha','Dawn · Foosha Village'),quests:[],
 lines:[L2('¡Algún día tendré mi propio barco y mi propia tripulación!','One day I will have my own ship and crew!')]};
{const old=npcAtlas;npcAtlas=function(id){return DAWN_CAST[id]?getAtlas('Dawn:'+id,()=>buildAtlas(dawnLook(id),['idle','walk'],drawHero)):old.apply(this,arguments);};}
{const old=mobAtlasFor;mobAtlasFor=function(art){return art[0]==='hum'&&art[1]==='dawn_pirata'?getAtlas('Dawn:pirate',()=>buildAtlas(dawnLook('dawn_pirata'),['idle','walk','atk','hurt','dead'],drawHero)):old.apply(this,arguments);};}
// Match the current level-490–500 Obsidian Golem exactly, using final shared mobStats (+40% XP above 250).
MOBS.dawn_pirata={...MOBS.cb_golem,n:DAWN_CAST.dawn_pirata.n,art:['hum','dawn_pirata'],reg:['dawn'],lv:[500,500],fam:'dawn_pirate',spd:56,ai:'aggro',drops:[]};

it('dawn_fruta_diablo',{n:L2('Fruta del diablo · Dawn','Devil Fruit · Dawn'),t:'quest',stack:true,price:0,icon:['fruit',1],rar:5,d:L2('Requisito futuro del viaje de Marina. Todavía no se puede obtener ni entregar.','Future requirement for Marina’s voyage. It cannot be obtained or handed in yet.')});
function dawnTravelStatus(){return {open:DAWN_TRAVEL_OPEN,required:'dawn_fruta_diablo',available:false,minLv:500};}
function dawnMarinaTalk(){return L2('He encontrado una ruta hacia Dawn, la isla de Villa Foosha. Para abrir ese paso necesitaré una fruta del diablo. Todavía no se puede conseguir: el viaje sigue cerrado. No entregarás objetos ni gastarás oro por ahora.','I have found a route to Dawn, the island of Foosha Village. Opening that passage will require a Devil Fruit. It cannot be obtained yet: the voyage remains closed. You will not hand in items or spend gold for now.');}
DLG_HOOKS.push((npc,opts)=>{if(npc.id==='marina')opts.push({label:L2('Isla Dawn · viaje cerrado','Dawn Island · voyage closed'),icon:['ways'],fn:()=>typeText(dawnMarinaTalk())});if(npc.id==='dawn_shanks')opts.push({label:L2('Romance Dawn · el comienzo','Romance Dawn · the beginning'),icon:['talk'],fn:()=>typeText(L2('Esta es la primera escala de nuestra historia: Foosha, Makino, los molinos y el sueño de Luffy. Cuando se abra el viaje, nos encontrarás aquí.','This is the first stop in our story: Foosha, Makino, the windmills and Luffy’s dream. When the voyage opens, you will find us here.'))});});
// One hard gate shared by every public arrival path: inventory or map browsing never bypasses it.
{const old=setMap;setMap=function(M,x,y,dir){if(M?.dawn&&!DAWN_TRAVEL_OPEN&&!G.P?.dawnHelm){toast(L2('Dawn: viaje todavía cerrado. Habla con la Capitana Marina.','Dawn: voyage still closed. Talk to Captain Marina.'),'info',4);return false;}return old.apply(this,arguments);};}
function dawnSpawnPeople(M){for(const d of M.npcDefs)if(!G.ents.some(e=>e.type==='npc'&&e.map===M.id&&e.id===d.id&&!e.remove)){const at=freePxNear(M,d.x*16+8,d.y*16+12,5);if(at)spawnNPC(d.id,at[0],at[1],M.id,{face:d.face});}}
// Kept separate so future opening requires an explicit release, not a saved variable.
V33_TICKS.push(()=>{const M=G.map;if(!M?.dawn)return;dawnSpawnPeople(M);for(const c of M.camps){c.alive=c.alive.filter(e=>!e.remove&&e.hp>0);c.dead=c.dead.filter(t=>t>G.t);const d=Math.abs(c.x-G.P.x/16)+Math.abs(c.y-G.P.y/16);if(d>44){for(const m of c.alive)m.remove=true;c.alive=[];continue;}if(d>30||c.alive.length+c.dead.length>=c.n)continue;const at=freePxNear(M,(c.x+(Math.random()-.5)*4)*16,(c.y+(Math.random()-.5)*4)*16,3);if(!at)continue;const m=spawnMob(c.mob,500,at[0],at[1],0,c);m.map='dawn';c.alive.push(m);}});
MAPC.dawn=['Dawn · lugares','Dawn · locations','#9aca7b','house'];
MAPW_LIST.push({id:'dawn',n:L2('Dawn · Villa Foosha (cerrado)','Dawn · Foosha Village (closed)'),mk:()=>makeDawn(),how:L2('Habla con la Capitana Marina en Puerto Coral. Fruta del diablo: requisito futuro; viaje todavía cerrado.','Talk to Captain Marina in Puerto Coral. Devil Fruit: future requirement; voyage still closed.')});
{const old=otherPOI;otherPOI=function(M){const out=old.apply(this,arguments);if(M?.dawn){for(const p of M.dawnData.pois)out.push({c:'dawn',x:p.x,y:p.y,t:p.name});for(const c of M.camps)out.push({c:'boss',x:c.x,y:c.y,t:L2('Piratas · nivel 500','Pirates · level 500')});}return out;};}
GSIS.push(['dawn','⚓ Dawn · Villa Foosha',()=>[L2('Mapa de 720 × 360 casillas, el mismo tamaño que Lima. Pasto suave, molinos, Partys Bar, puerto, palmeras costeras y caminos hacia Colubo y Goa.','720 × 360 tiles, the same size as Lima. Soft grass, windmills, Partys Bar, harbour, coastal palms and paths toward Colubo and Goa.'),dawnMarinaTalk(),L2('Shanks y su tripulación son amistosos. Los piratas pendencieros de nivel 500 están fuera del pueblo; usan el mismo equilibrio que el Gólem de Obsidiana actual. El nivel máximo sigue en 500.','Shanks and his crew are friendly. Level-500 brawling pirates are outside the village; they use the current Obsidian Golem balance. The level cap remains 500.'),L2('Primer escenario preparado para Romance Dawn. La ruta sigue cerrada y aún no se juega el capítulo completo.','First setting prepared for Romance Dawn. The route remains closed and the full chapter is not yet playable.')],()=>({m:'world',loc:[229,129],t:'Capitana Marina'})]);

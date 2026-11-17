// v5.02: direcciones artísticas por habilidad; los datos de SK y la resolución del combate no se modifican.
const SV_ART = {
 "g1": "cleave",
 "g2": "whirlwind",
 "g4": "judgment",
 "g6": "shout",
 "g8": "wall",
 "g9": "charge",
 "g11": "quake",
 "g12": "avatar",
 "g13": "steelstorm",
 "g14": "bond",
 "g15": "fortress",
 "g16": "aegis",
 "g17": "leap",
 "g18": "cataclysm",
 "g19": "skyblade",
 "ev_g1": "dawn",
 "ev_g2": "seraph",
 "m1": "fireball",
 "m3": "meteors",
 "m4": "inferno",
 "m5": "icebolt",
 "m6": "frost",
 "m7": "icearmor",
 "m8": "blizzard",
 "m9": "blink",
 "m11": "arcshield",
 "m13": "meteor",
 "m14": "apocalypse",
 "m15": "glacier",
 "m16": "absolute",
 "m17": "blackhole",
 "m18": "singularity",
 "m19": "prism",
 "ev_m1": "runerain",
 "ev_m2": "arcanestorm",
 "a1": "chargedarrow",
 "a3": "deatharrow",
 "a4": "arrowstorm",
 "a5": "poisonarrow",
 "a6": "roots",
 "a7": "forestheal",
 "a8": "arrowrain",
 "a9": "tumble",
 "a10": "multishot",
 "a12": "hunter",
 "a13": "pierce",
 "a14": "mark",
 "a15": "arrowflood",
 "a16": "forestwrath",
 "a17": "fan",
 "a18": "hawkeye",
 "a19": "phoenix",
 "ev_a1": "zephyr",
 "ev_a2": "feathers",
 "s1": "shadow",
 "s3": "stealth",
 "s4": "deathmark",
 "s5": "venom",
 "s6": "toxic",
 "s8": "daggers",
 "s9": "bladedance",
 "s12": "thousand",
 "s13": "execute",
 "s14": "shadowdance",
 "s15": "plague",
 "s16": "miasma",
 "s17": "voidstep",
 "s18": "shadows",
 "s19": "shadowcuts",
 "ev_s1": "dusk",
 "ev_s2": "shadowstep",
 "d1": "note",
 "d2": "chord",
 "d4": "crescendo",
 "d5": "song",
 "d6": "ballad",
 "d8": "rebirth",
 "d9": "dance",
 "d11": "march",
 "d12": "rhythm",
 "d13": "symphony",
 "d14": "requiem",
 "d15": "choir",
 "d16": "aria",
 "d17": "echo",
 "d18": "finale",
 "d19": "concert",
 "ev_b1": "hymn",
 "ev_b2": "thunderchord",
 "i1": "summon",
 "i4": "soulrage",
 "i5": "reap",
 "i6": "scythespin",
 "i8": "execution",
 "i9": "drain",
 "i11": "soulplague",
 "i12": "curse",
 "i13": "army",
 "i14": "soulking",
 "i15": "macabre",
 "i16": "harvest",
 "i17": "hellfire",
 "i18": "gate",
 "ev_i1": "legion",
 "ev_i2": "judgmentscythe",
 "z1": "bite",
 "z2": "frenzy",
 "z4": "jaw",
 "z6": "bubble",
 "z8": "tide",
 "z9": "grab",
 "z11": "whirl",
 "z12": "abysmal",
 "z13": "megalodon",
 "z14": "devour",
 "z15": "tsunami",
 "z16": "carapace",
 "z17": "shark",
 "z18": "kraken",
 "z19": "leviathan",
 "ev_z1": "deluge",
 "ev_z2": "abysswhirl"
};
const SV_OLD_POSE=heroPose, SV_BASE_USE=useSkill, SV_BASE_FX=drawFx, SV_BASE_PROJ=drawProj;
const svClamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),svLerp=(a,b,t)=>a+(b-a)*t;
const svEase=v=>{v=svClamp(v);return v*v*(3-2*v);};
function svClassPose(cls,dir,t,L){
 const wind=svEase(t/.27),hit=svEase((t-.27)/.18),recover=svEase((t-.62)/.24),active=t<.88;
 const frame=t<.28?0:t<.43?1:t<.63?2:3;
 const base=cls==='guerrero'||cls==='pez'?'slam':cls==='mago'||cls==='invocador'?'cast':'atk';
 let p={...SV_OLD_POSE(dir,base,base==='slam'?Math.min(2,frame):base==='cast'?frame%2:frame,L)};
 const side=dir==='left'||dir==='right',d=dir==='left'?-1:1;
 if(!active)return {...SV_OLD_POSE(dir,'idle',0,L)};
 if(cls==='guerrero'){
  p.rax=svLerp(side?-d:1,side?d*6:2,hit);p.ray=svLerp(-7*wind,3,hit);p.lax=svLerp(side?0:-1,side?d*3:-2,hit);p.lay=svLerp(-6*wind,2,hit);p.wang=svLerp(-1.65,dir==='left'?2.55:dir==='right'?.55:1.5,hit);p.crouch=wind*(1-hit)+hit*2*(1-recover);p.jump=0;p.lean=hit*2*(1-recover);
 }else if(cls==='mago'){
  p.rax=(side?d:1)*(2+hit*3);p.ray=-6*wind+hit*4;p.lax=(side?d:-1)*3;p.lay=-3*wind-hit;p.wang=svLerp(-1.6,side?(d>0?.35:2.7):1.15,hit);p.bob=-Math.sin(t*10)*.45;p.crouch=0;p.lean=hit*(1-recover);
 }else if(cls==='arquero'){
  p.wph=t<.2?1:t<.38?2:0;p.rax=side?d*4:3;p.ray=side?-1:2;p.lax=side?-d*(1+wind*4):-3;p.lay=-1-wind*3+hit*3;p.crouch=wind*.7;p.lean=-wind*(1-hit)+hit;p.wang=({down:1.57,up:-1.57,left:3.14,right:0})[dir];
 }else if(cls==='asesino'){
  p.crouch=2.5*(1-recover);p.lean=3*hit*(1-recover);p.rax=(side?d:1)*(2+hit*5);p.ray=-2+hit*5;p.lax=(side?d:-1)*(1+hit*4);p.lay=1-hit*4;p.wang=({down:1.57,up:-1.57,left:3.14,right:0})[dir]+Math.sin(t*18)*.5;p.dual=t>.36?1:0;
 }else if(cls==='bardo'){
  p.lax=side?d:0;p.lay=-3;p.rax=side?d*3:2;p.ray=-3+Math.sin(svClamp((t-.2)/.45)*Math.PI*4)*2;p.wang=-.6;p.wph=frame%2;p.bob=t>.22&&t<.65?-Math.sin(t*17):0;p.lfy=t>.25&&t<.5?-1:0;p.crouch=0;
 }else if(cls==='invocador'){
  p.rax=(side?d:1)*(2+wind*2);p.lax=(side?d:-1)*(2+wind*2);p.ray=-2-wind*5+hit;p.lay=-1-wind*5+hit;p.wang=side?(d>0?.6:2.5):.7;p.crouch=0;p.jump=0;p.bob=-wind*.8;
 }else if(cls==='pez'){
  p.noWeapon=1;p.rax=(side?d:1)*(1+hit*5);p.lax=(side?d:-1)*(1+hit*5);p.ray=-3+hit*5;p.lay=-3+hit*5;p.crouch=wind*2*(1-hit)+hit*(1-recover);p.lean=hit*3*(1-recover);p.jump=Math.sin(svClamp((t-.27)/.3)*Math.PI)*2;
 }
 for(const k of['rax','ray','lax','lay','crouch','jump','lean','bob','lfy','rfy'])if(p[k])p[k]*=1-recover;
 return p;
}
const SV_COL={guerrero:['#543724','#bd8140','#efc674','#fff1cc'],mago:['#722528','#d55629','#ffac45','#fff0b9'],arquero:['#1b4940','#418b6f','#99d7a3','#e6f8d7'],asesino:['#25162f','#633d81','#c28bd9','#f6d7ed'],bardo:['#57416b','#ad709b','#edc773','#fff0b4'],invocador:['#122e51','#366b9e','#89c9e6','#ecffff'],pez:['#123e64','#3187a6','#8edee0','#edffff']};
const svHash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h;};
const SV_OF=new Map();
for(const s of Object.values(SK))if(AP_CLASSES.includes(s.cls)&&s.type==='act'){
 const seed=svHash(s.id),kind=s.eff.k,fx=SV_ART[s.id]||s.id;
 const pose=['spin','flurry'].includes(kind)?'combo':['slam','leap','skyfall','meteor'].includes(kind)?'heavy':['dash','blink','shadow'].includes(kind)?'dash':['shield','buff','sumbuff'].includes(kind)?'guard':kind==='heal'?'heal':['field','rain','vortex','concert','army','kingsoul','summon','beams'].includes(kind)?'channel':kind==='mark'?'mark':kind==='grab'?'grab':s.cls==='arquero'?'bow':s.cls==='bardo'?'music':kind==='proj'?'cast':'strike';
 let colors=SV_COL[s.cls];if(/ice|frost|blizzard|glacier|absolute/.test(fx))colors=['#163b64','#4386b2','#9eddf4','#f4ffff'];else if(/poison|venom|toxic|plague|miasma/.test(fx))colors=['#243723','#537847','#afce71','#f3efb7'];else if(/arc|prism|singularity|blackhole|void/.test(fx))colors=['#211d47','#604b96','#b49bdc','#f2d9ff'];
 SV_OF.set(s.id,{id:s.id,cls:s.cls,kind,fx,pose,seed,variant:seed%5,beats:2+seed%4,dur:['channel','heavy'].includes(pose)?.78:pose==='dash'?.42:.58,colors:colors.map(h=>C(h))});
}
ANIMS.sv_skill=[0,12];
function svPose(D,dir,f,L){
 const raw=f/12,t=svClamp(raw+(D.variant-2)*.012),p=svClassPose(D.cls,dir,t,L),side=dir==='left'||dir==='right',d=dir==='left'?-1:1,hit=svEase((t-.16)/.24),back=1-svEase((t-.65)/.25),wave=Math.sin(t*Math.PI);
 if(t>.9)return SV_OLD_POSE(dir,'idle',0,L);
 if(D.pose==='combo'){p.wang=({down:.5,up:-2,left:2,right:0})[dir]+t*Math.PI*2*(D.beats/2);p.rax=Math.cos(t*Math.PI*D.beats)*3;p.ray=Math.sin(t*Math.PI*D.beats)*3-1;p.lax=-p.rax;p.lay=-p.ray;p.crouch=1;p.dual=D.cls==='asesino'?1:p.dual;}
 if(D.pose==='guard'){p.rax=side?d*2:2;p.lax=side?d:-2;p.ray=-2-wave*3;p.lay=-2-wave*3;p.crouch=wave;p.wang=side?(d>0?-.7:3.7):-1.1;}
 if(D.pose==='dash'){p.crouch=2*back;p.lean=(2+D.variant*.25)*hit*back;p.rax=side?d*5:3;p.ray=1;p.lax=side?-d*2:-2;p.lay=-2;p.wang=({down:1.7,up:-1.7,left:3.1,right:0})[dir];}
 if(D.pose==='heavy'){p.ray=svLerp(-7,3,hit)*back;p.lay=svLerp(-6,2,hit)*back;p.rax=side?d*hit*5:1;p.lax=side?d:-1;p.wang=svLerp(-1.6,({down:1.5,up:-1.5,left:2.7,right:.4})[dir],hit);p.crouch=hit*2*back;p.jump=0;}
 if(D.pose==='heal'){p.rax=side?d*2:3;p.lax=side?d:-3;p.ray=-wave*6;p.lay=-wave*5;p.wang=side?.3:-.8;p.crouch=0;}
 if(D.pose==='channel'){p.ray=-3-wave*(3+D.variant*.3);p.lay=-2-wave*4;p.rax=side?d*4:3;p.lax=side?d*2:-3;p.crouch=0;p.wang=D.cls==='invocador'?.65:-1.3;}
 if(D.pose==='mark'){p.rax=side?d*5:3;p.ray=-wave*3;p.lax=-1;p.lay=-2;p.wang=side?.4:1.2;}
 if(D.pose==='grab'){p.rax=(side?d:1)*hit*6;p.lax=(side?d:-1)*hit*6;p.ray=p.lay=hit*4;p.crouch=hit*2*back;p.noWeapon=1;}
 // Cada habilidad mantiene un ritmo y una trayectoria de manos propios dentro de su familia.
 p.rax+=(D.variant-2)*.35*wave;p.lay+=(D.beats-3)*.45*wave;p.bob=(p.bob||0)-wave*(D.variant%2)*.4;
 return p;
}
heroPose=function(dir,anim,f,L){const D=L?.svId&&SV_OF.get(L.svId);return anim==='sv_skill'&&D?svPose(D,dir,f,L):SV_OLD_POSE.apply(this,arguments);};
const SV_ATLASES=new Map(),SV_FX_CACHE=new Map();let svContext=null;
function svGet(map,key){const v=map.get(key);if(v){map.delete(key);map.set(key,v);}return v;}
function svPut(map,key,value,max){map.set(key,value);while(map.size>max)map.delete(map.keys().next().value);return value;}
function svAtlas(e,D){const app=normApp(e.app),gear=e.type==='player'?gearTiers(e):e.gear,cos=e.cos||{},hh=e.type==='player'?e.hideHelm:e.hh,key=D.id+heroKey(e.cls,app,gear,cos,hh);let A=svGet(SV_ATLASES,key);if(A)return A;
 const L=heroLook(e.cls,app,gear,cos,{hideHelm:hh});L.svId=D.id;L.mirror=false;
 A={img:mkCanvas(48*12,48*4),fw:48,fh:48,ax:24,ay:44,idx:{sv_skill:0},hdL:L,hdDraw:drawHero,hdAnims:['sv_skill'],svDone:new Uint8Array(48)};
 return svPut(SV_ATLASES,key,A,4);
}
function svEnsure(A,f,row){const at=row*12+f;if(A.svDone[at])return;const p=new Pix(48,48);p.t=new Uint8Array(2304);p.tg=0;drawHero(p,A.hdL,DIRS[row],'sv_skill',f);p.outline(OUTL,false);p.toCtx(A.img.getContext('2d'),f*48,row*48);A.svDone[at]=1;}
// Dibujos de efectos separados del cuerpo y de las áreas que resuelven el daño.
function svEffect(id,frame,role='cast',dir='down'){
 const D=SV_OF.get(id);if(!D)return null;frame=svClamp(frame|0,0,11);const key=[id,frame,role,dir].join(':');let cv=svGet(SV_FX_CACHE,key);if(cv)return cv;
 const p=new Pix(128,128),C_=D.colors,t=(frame+1)/12,seed=D.seed,n=D.beats,angle=({right:0,down:Math.PI/2,left:Math.PI,up:-Math.PI/2})[dir]||0;
 const pt=(u,v)=>[Math.round(64+Math.cos(angle)*u-Math.sin(angle)*v),Math.round(64+(Math.sin(angle)*u+Math.cos(angle)*v)*.65)];
 const line=(a,b,c=C_[2])=>p.line(...pt(...a),...pt(...b),c),dot=(u,v,r=2)=>p.ball(...pt(u,v),r,r,[C_[0],C_[1],C_[2],C_[3]]);
 const poly=(a,c)=>p.poly(a.map(v=>pt(...v)),c),circle=(r,phase=0,c=C_[2],sides=24)=>{let last;for(let i=0;i<=sides;i++){const a=i/sides*Math.PI*2+phase,z=[Math.cos(a)*r,Math.sin(a)*r];if(last)line(last,z,c);last=z;}};
 const projectile=role==='proj',ground=role==='field',fx=D.fx;
 if(projectile){
  if(/arrow|pierce|zephyr|fan|feathers/.test(fx)){line([-21,0],[14,0],C_[3]);poly([[17,0],[8,-4],[10,0],[8,4]],C_[2]);for(let i=0;i<n;i++)line([-12-i*5,-3-i],[-20-i*4,-3-i],C_[1]);}
  else if(/dagger/.test(fx)){poly([[-15,-2],[18,0],[-15,3],[-9,0]],C_[3]);line([-11,-6],[-11,6]);}
  else if(/note|chord|echo/.test(fx)){for(let i=0;i<n-1;i++){const x=-6+i*7,y=Math.sin(t*7+i)*5;dot(x,y,3);line([x+3,y],[x+3,y-12]);line([x+3,y-12],[x+7,y-9]);}}
  else{for(let i=5;i>=0;i--)dot(-i*5,Math.sin(i+t*10+seed%5)*3,Math.max(1,8-i));if(/ice/.test(fx))poly([[16,0],[-7,-6],[-3,0],[-7,6]],C_[3]);}
 }else if(/whirl|storm|spin|vortex|blackhole|singularity|kraken|gate|macabre|bladedance|scythespin|judgmentscythe/.test(fx)){
  for(let j=0;j<n;j++){let last;for(let i=0;i<17;i++){const a=i*.18+j*Math.PI*2/n+t*6,r=8+i*(1.3+D.variant*.1),z=[Math.cos(a)*r,Math.sin(a)*r];if(last)line(last,z,j%2?C_[1]:C_[2]);last=z;}dot(Math.cos(j*2+t*5)*18,Math.sin(j*2+t*5)*18,2);}
  if(/kraken/.test(fx))for(let j=0;j<4;j++){let last=[(j-1.5)*10,0];for(let i=1;i<8;i++){const z=[(j-1.5)*10+Math.sin(i*.7+t*7)*5,-i*5];line(last,z,C_[2]);last=z;}}
 }else if(/jaw|bite|frenzy|megalodon|devour|shark|leviathan/.test(fx)){
  const rx=18+D.variant*2,ry=8+Math.sin(t*Math.PI)*14;let up,lo;
  for(let i=0;i<=18;i++){const a=i/18*Math.PI,z=[Math.cos(a)*rx,Math.sin(a)*ry],u=[z[0],-z[1]];if(up)line(up,u,C_[2]);if(lo)line(lo,z,C_[3]);up=u;lo=z;}
  for(let i=-2;i<=2;i++){const x=i*rx/3,y=Math.sqrt(Math.max(0,1-x*x/(rx*rx)))*ry;poly([[x-3,-y],[x+3,-y],[x,-y+6]],C_[3]);poly([[x-3,y],[x+3,y],[x,y-6]],C_[3]);}
 }else if(/roots|forestwrath|forestheal/.test(fx)){
  for(let j=0;j<n+2;j++){const x=(j-(n+1)/2)*10,h=10+t*18;line([x,14],[x+Math.sin(j)*4,-h],C_[1]);for(let i=0;i<3;i++)poly([[x,-i*7],[x+7,-i*7-5],[x+3,-i*7-9]],i%2?C_[2]:C_[1]);}
 }else if(/toxic|venom|plague|miasma|poison/.test(fx)){
  for(let j=0;j<10;j++){const a=j*2.399+seed%7,r=8+(j%4)*7;dot(Math.cos(a)*r,Math.sin(a)*r-10*t,2+j%4);}
  for(let j=0;j<3;j++)line([-20+j*18,12],[-14+j*18,17],C_[3]);
 }else if(/song|heal|rebirth|hymn|tide/.test(fx)){
  for(let j=0;j<n+2;j++){const x=(j-n/2)*10,y=12-t*30+(j%2)*5;line([x-4,y],[x+4,y],C_[3]);line([x,y-4],[x,y+4],C_[3]);dot(x-3,y+10,1);}
 }else if(/note|chord|crescendo|symphony|requiem|choir|aria|echo|finale|concert|march|ballad|rhythm|dance/.test(fx)){
  for(let j=0;j<5;j++){let last;for(let i=0;i<22;i++){const z=[-33+i*3,j*4-8+Math.sin(i*.3-t*7)*5];if(last)line(last,z,j%2?C_[1]:C_[2]);last=z;}}
  for(let j=0;j<n;j++){const x=-25+j*14,y=Math.sin(j+t*5)*8-7;dot(x,y,3);line([x+3,y],[x+3,y-13],C_[3]);line([x+3,y-13],[x+7,y-10]);}
 }else if(/summon|army|soulking|legion|soulrage/.test(fx)){
  circle(24,seed%6,C_[1],6);circle(18,-t,C_[2],6);for(let j=0;j<(fx==='summon'?1:n);j++){const x=(j-(n-1)/2)*12,y=-t*20;dot(x,y-8,5);poly([[x-4,y-6],[x+4,y-6],[x+6,y+7],[x,y+3],[x-5,y+7]],C_[1]);dot(x-2,y-9,1);dot(x+2,y-9,1);}
 }else if(/wall|aegis|seraph|arcshield|icearmor|fortress|carapace|bubble|stealth|hawkeye|avatar|abysmal|hunter|shout|shadows/.test(fx)){
  if(fx==='bubble'){circle(27,t*.3,C_[2]);for(let j=0;j<5;j++)dot(Math.cos(j)*21,Math.sin(j)*21,2);}
  else{poly([[-21,-21],[21,-21],[18,14],[0,30],[-18,14]],C_[0]);line([-21,-21],[0,-16],C_[3]);line([0,-16],[21,-21]);line([-18,14],[0,30]);line([0,30],[18,14]);for(let j=0;j<n;j++)line([-12+j*7,-12],[-12+j*7,12],C_[1]);}
 }else if(/blink|tumble|voidstep|shadowstep|charge/.test(fx)){
  for(let j=0;j<n+1;j++){const x=-27+j*13-t*12;poly([[x,-12],[x+8,0],[x,12],[x+4,0]],j%2?C_[1]:C_[2]);}
 }else if(/mark|curse|deathmark/.test(fx)){
  poly([[0,-28],[21,0],[0,28],[-21,0]],C_[0]);for(const sign of[-1,1]){line([sign*15,-18],[-sign*15,18],C_[2]);line([sign*9,-24],[sign*15,-18],C_[3]);}dot(0,0,4);
 }else if(/ice|frost|glacier|absolute|blizzard/.test(fx)){
  for(let j=0;j<n+2;j++){const x=(j-(n+1)/2)*10,h=12+((j*7+seed)%19)*t;poly([[x-4,12],[x,-h],[x+5,12]],C_[j%2?1:2]);line([x,-h],[x+1,8],C_[3]);}
 }else if(/meteor|apocalypse|runerain|deluge|feathers|prism|skyblade|dawn/.test(fx)){
  for(let j=0;j<n;j++){const x=(j-(n-1)/2)*13,y=-30+((t*65+j*9)%52);line([x-4,y-17],[x,y],C_[1]);poly([[x-5,y],[x,y+9],[x+5,y],[x,y-7]],C_[3]);}
 }else if(/fire|inferno|phoenix/.test(fx)){
  for(let j=0;j<n+3;j++){const x=(j-(n+2)/2)*8,h=10+(Math.sin(j*2+t*8)+1)*12;poly([[x-6,15],[x-5,0],[x,-h],[x+3,-4],[x+6,15]],C_[j%2?1:2]);poly([[x-2,12],[x,-h*.5],[x+3,12]],C_[3]);}
 }else if(/judgment|quake|cataclysm|leap|harvest/.test(fx)){
  for(let j=0;j<n+4;j++){const a=j*2.399+seed%3,r=14+t*24,z=[Math.cos(a)*r,Math.sin(a)*r];line([0,0],[z[0]*.5,z[1]*.6],C_[1]);line([z[0]*.5,z[1]*.6],z,C_[2]);dot(z[0],z[1]-6,2);}
  poly([[-4,-35],[3,-22],[5,14],[-2,23]],C_[3]);
 }else{
  // Filo, drenaje y combinaciones: trayectoria y cantidad de impactos específicas del identificador.
  for(let j=0;j<n;j++){const a=(j-(n-1)/2)*.5+(D.variant-2)*.1,r=20+t*15;line([Math.cos(a)*-r,Math.sin(a)*-r],[Math.cos(a)*r,Math.sin(a)*r],j%2?C_[1]:C_[3]);line([Math.cos(a)*r,Math.sin(a)*r],[Math.cos(a+.2)*(r+5),Math.sin(a+.2)*(r+5)],C_[2]);}
 }
 // Un detalle geométrico de la firma se integra en el efecto; no es solo un cambio de color.
 for(let j=0;j<D.variant+1;j++){const a=(j+1)*2.399+seed%11,r=31+(frame%3);dot(Math.cos(a)*r,Math.sin(a)*r,1);}
 cv=p.canvas();return svPut(SV_FX_CACHE,key,cv,96);
}
function svDrawEffect(D,phase,role,dir,x,y,r=32){const cv=svEffect(D.id,Math.min(11,Math.floor(phase*12)),role,dir);if(!cv)return;const size=role==='proj'?48:svClamp(r*2,32,180);ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(cv,Math.round(x-size/2),Math.round(y-size*.55),size,size*.8);ctx.restore();}
function svStart(e,D,dir){if(!e||e.dead)return;e.svCast={id:D.id,t:G.t,dur:D.dur,dir:DIRS.includes(dir)?dir:e.dir};}
{const old=drawEnt;drawEnt=function(e,cx,cy){const S=e.svCast,D=S&&SV_OF.get(S.id);if(!D||e.dead||G.t-S.t>=S.dur||e.job||['hurt','dead'].includes(e.anim))return old.apply(this,arguments);
 const age=svClamp((G.t-S.t)/S.dur),f=Math.min(11,Math.floor(age*12)),A=svAtlas(e,D),saved=[e.atlas,e.anim,e.af,e.dir];e.atlas=A;e.anim='sv_skill';e.af=f;e.dir=S.dir;svEnsure(A,f,DIRI[e.dir]);
 try{const result=old.apply(this,arguments);svDrawEffect(D,age,'cast',S.dir,e.x-cx,e.y-cy-9,26);return result;}finally{[e.atlas,e.anim,e.af,e.dir]=saved;}};}
{const old=delayAct;delayAct=function(t,fn){const D=svContext;if(!D)return old.apply(this,arguments);return old(t,function(){const before=svContext;svContext=D;try{return fn.apply(this,arguments);}finally{svContext=before;}});};}
{const old=addFx;addFx=function(o){return old(svContext?Object.assign({},o,{svId:svContext.id,svDir:G.P?.dir||'down'}):o);};}
{const old=spawnProj;spawnProj=function(owner,x,y,ang,o){const e=old.apply(this,arguments);if(e&&owner==='p'&&svContext)e.svId=svContext.id;return e;};}
{const old=nfxPush;nfxPush=function(e){return old(svContext?Object.assign({},e,{svId:svContext.id}):e);};}
useSkill=function(slot){const P=G.P,id=P?.slots?.[slot],D=SV_OF.get(id),before=id?(P.cds[id]||0):0,prior=svContext;svContext=D||null;
 try{const result=SV_BASE_USE.apply(this,arguments);if(D&&G.P===P&&(P.cds[id]||0)>before){svStart(P,D,P.dir);nfxPush({k:'sv',id:D.id,dir:P.dir});}return result;}finally{svContext=prior;}};
{const old=setAnim;setAnim=function(e,a){if(e.svCast&&!svContext&&['atk','cast','walk','hurt','dead'].includes(a))delete e.svCast;return old.apply(this,arguments);};}
const SV_REPLACED=new Set(['slash','ring','boom','fall','note','line','beam','bolt','field']);
drawFx=function(f,cx,cy){const D=f.svId&&SV_OF.get(f.svId);if(!D||!SV_REPLACED.has(f.type))return SV_BASE_FX.apply(this,arguments);
 const phase=svClamp(f.t/f.dur),r=f.r||32,dir=f.svDir||'down';
 if(['beam','line','bolt'].includes(f.type)&&Number.isFinite(f.x2)&&Number.isFinite(f.y2)){ctx.save();ctx.strokeStyle=uCss(D.colors[2]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(Math.round(f.x-cx),Math.round(f.y-cy));ctx.lineTo(Math.round(f.x2-cx),Math.round(f.y2-cy));ctx.stroke();ctx.restore();svDrawEffect(D,phase,f.type,dir,f.x2-cx,f.y2-cy,r);return;}
 svDrawEffect(D,phase,f.type,dir,f.x-cx,f.y-cy,r);
};
drawProj=function(e,cx,cy){const D=e.svId&&SV_OF.get(e.svId);if(!D)return SV_BASE_PROJ.apply(this,arguments);svDrawEffect(D,(e.t||0)/(e.life||1),'proj',dirFromVec(Math.cos(e.ang),Math.sin(e.ang)),e.x-cx,e.y-cy-(e.z||0),20);};
{const old=nfxPlay;nfxPlay=function(r,ev){const D=SV_OF.get(ev?.id||ev?.svId);if(ev?.k==='sv'){if(D&&D.cls===r.cls)svStart(r,D,ev.dir);return;}
 if(ev?.k==='p'&&D&&D.cls===r.cls){const a=+ev.a||0,v=svClamp(+ev.v||200,20,900),life=svClamp(+ev.l||.9,.1,3),x=svClamp(+ev.x||0,0,G.map.w*16),y=svClamp(+ev.y||0,0,G.map.h*16);addFx({type:'custom',x,y,dur:life,net:1,draw(f,sx,sy){svDrawEffect(D,f.t/life,'proj',dirFromVec(Math.cos(a),Math.sin(a)),sx+Math.cos(a)*v*f.t,sy+Math.sin(a)*v*f.t-12,20);}});return;}
 return old.apply(this,arguments);};}
// Los iconos se sustituyen al dibujar la interfaz; SK conserva sus colores, costes y efectos originales.
const SV_ICON_IDS=new WeakMap(),SV_OLD_ICON=genIcon;
for(const s of Object.values(SK))if(AP_CLASSES.includes(s.cls)){SV_ICON_IDS.set(s.icon,s.id);UI_ICONS.push('sv_skill:'+s.id);}
genIcon=function(spec){if(spec[0]!=='sv_skill'||!SK[spec[1]])return SV_OLD_ICON.apply(this,arguments);const s=SK[spec[1]],D=SV_OF.get(s.id),p=new Pix(16,16),P=D?.colors||SV_COL[s.cls].map(h=>C(h)),h=svHash(s.id);p.poly([[8,1],[14,5],[13,12],[8,15],[2,11],[1,5]],P[0]);
 if(D){const cv=svEffect(D.id,5,'cast','right'),tmp=mkCanvas(16,16),x=tmp.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(cv,24,24,80,80,1,1,14,14);const data=x.getImageData(0,0,16,16).data;for(let i=0;i<256;i++)if(data[i*4+3]>80)p.d[i]=rgbU(data[i*4],data[i*4+1],data[i*4+2],255);}
 else{p.line(4,11,11,4,P[2]);for(let j=0;j<3;j++)p.set(4+j*3,5+(h>>j&3),P[3]);p.hl(5,12,6,P[1]);}p.outline(OUTL,false);return p;};
{const old=iconHTML;iconHTML=function(spec,...a){const id=SV_ICON_IDS.get(spec);return old.call(this,id?['sv_skill',id]:spec,...a);};}

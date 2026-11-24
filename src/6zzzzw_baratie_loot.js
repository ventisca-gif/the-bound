const BAR_LOOT_PITY=10;
const BAR_WEAPONS=[
 ['baratie_pearl','w_bar_pearl','Escudo de Nácar','Mother-of-Pearl Shield',600,.08,1.025],
 ['baratie_gin','w_bar_gin','Tonfa de Contrapeso','Counterweight Tonfa',600,.07,1.04],
 ['baratie_krieg','w_bar_spear','Lanza de Asedio Dorada','Golden Siege Spear',605,.06,1.065],
 ['baratie_krieg','w_bar_sabre','Sable de la Flota','Fleet Sabre',605,.04,1.09]
];
const BAR_BASE_ATK=Math.max(...Object.values(ITEMS).filter(i=>i.slot==='weapon'&&i.lv<=605).map(i=>i.atk||0));
const BAR_LOOT=Object.fromEntries(Object.keys(BAR_FOES).map(id=>[id,[]]));
const BAR_WEAPON_PX={};
for(const [boss,id,es,en,lv,ch,mul] of BAR_WEAPONS){
 const art=BAR_LOOT_WEAPON_ART[id];
 BAR_WEAPON_PX[id]={pix:wsprPix(art[0]),pivot:art[1]};
 it(id,{n:L2(es,en),t:'weapon',slot:'weapon',lv,tier:44,atk:Math.ceil(BAR_BASE_ATK*mul),rar:5,
  price:68000,icon:['baratie_weapon',id],d:L2('Arma de Baratie para cualquier clase. Mantiene las habilidades de tu clase.','Baratie weapon for any class. Retains your class skills.')});
 BAR_LOOT[boss].push({id,ch,pity:BAR_LOOT_PITY});
}
const BAR_LAV=P5(['#292439','#443951','#675373','#9280a3','#b4a1c2']);
const BAR_PEARL=P5(['#3c3549','#665a75','#9887a8','#c2b2d3','#e5d6ee']);
fitKind('head','baratie_wrap',(p,A,s)=>{
 const {hx,hrx,ey,side}=A,m=s.m,y=ey-3;
 const left=Math.round(hx-hrx+1),width=Math.round(2*hrx-1);
 p.hl(left,y,width,m[1]);p.hl(left,y+1,width,m[3]);p.hl(left+1,y+2,width-2,m[2]);
 if(s.stripe)p.hl(left+1,y+2,width-2,m[0]);
 if(side)p.set(left+width-2,y+1,m[4]);
},{face:true});
fitKind('body','baratie_plate',(p,A,s)=>{
 const {tx0,tw,torsoTop:y,th,cx,up,side}=A,m=s.m;
 p.hl(tx0,y+1,tw,m[3]);
 for(let i=2;i<th-1;i+=2)p.hl(tx0+1,y+i,tw-2,m[2]);
 if(up)return;
 if(side){p.vl(cx,y+2,th-3,m[3]);return;}
 p.ell(cx,y+th*.48,Math.max(2,tw*.36),Math.max(2,th*.36),m[0]);
 p.ell(cx,y+th*.48,Math.max(1,tw*.28),Math.max(1,th*.28),m[3]);
 p.set(cx,y+Math.floor(th*.48),m[4]);
});
const BAR_WARDROBE={
 baratie_pearl:[
  ['head','Casco de Nácar','Pearl Helm',{k:'of_hardhat',cover:'hat',m:BAR_PEARL}],
  ['body','Coraza de Nácar','Pearl Breastplate',{k:'baratie_plate',m:BAR_PEARL}],
  ['legs','Pantalón acolchado de Pearl','Pearl’s Padded Trousers',{k:'rm_pantalon',m:BAR_LAV}],
  ['feet','Botas de guardia de Pearl','Pearl’s Guard Boots',{k:'boots',m:SY.negro}]
 ],
 baratie_gin:[
  ['head','Venda rayada de Gin','Gin’s Striped Bandage',{k:'baratie_wrap',m:BAR_PEARL,stripe:true}],
  ['body','Chaqueta de Gin','Gin’s Jacket',{k:'sy_frac',m:SY.blanco,vest:SY.oliva,gold:false}],
  ['legs','Pantalón blanco de Gin','Gin’s White Trousers',{k:'sy_rayas',m:SY.blanco,s:BAR_LAV}],
  ['feet','Botas de Gin','Gin’s Boots',{k:'boots',m:SY.negro}]
 ],
 baratie_krieg:[
  ['head','Venda de Don Krieg','Don Krieg’s Bandage',{k:'baratie_wrap',m:SY.blanco}],
  ['body','Coraza dorada de Don Krieg','Don Krieg’s Golden Breastplate',{k:'baratie_plate',m:SY.oro}],
  ['legs','Pantalón de Don Krieg','Don Krieg’s Trousers',{k:'rm_pantalon',m:BAR_LAV}],
  ['feet','Botas blindadas de Don Krieg','Don Krieg’s Armored Boots',{k:'boots',m:SY.oro}],
  ['back','Capa de almirante de Don Krieg','Don Krieg’s Admiral Cape',{k:'cape',o:BAR_LAV,i:SY.morado,tr:SY.blanco}]
 ]
};
const BAR_SOURCES={};
for(const [boss,pieces] of Object.entries(BAR_WARDROBE)){
 for(const [slot,es,en,vis] of pieces){
  const id='c_'+boss+'_'+slot, item='cosi_'+id,n=L2(es,en);
  const src=L2('Botín de ','Dropped by ')+BAR_FOES[boss].n+' · Baratie';
  const ch=slot==='back'?.14:slot==='body'?.18:.22;
  cosm(id,n,slot,()=>vis,{src});
  it(item,{n,t:'cos',cos:id,price:26000,icon:['hanger'],rar:4,d:L2('Pieza cosmética del Armario. ','Wardrobe cosmetic. ')+src});
  BAR_LOOT[boss].push({id:item,cos:id,ch,pity:BAR_LOOT_PITY});
 }
 for(const item of BAR_LOOT[boss])BAR_SOURCES[item.id]=boss;
}
SAVEKEYS.push('baratiePity');
const baratieOwn=(P,r)=>r.cos?(P.wardrobe||[]).includes(r.cos):P.equip.weapon?.id===r.id||countItem(r.id)>0;
for(const boss of Object.keys(BAR_LOOT))BOSS_EXTRA[boss]=()=>{
 const P=G.P;
 return P?BAR_LOOT[boss].filter(r=>!baratieOwn(P,r)).map(r=>[
  r.id,r.ch,L2('seguro en ','sure in ')+Math.max(1,r.pity-(P.baratiePity?.[r.id]||0))
 ]):[];
};
{const old=bossKilled;bossKilled=function(m){
 const P=G.P,R=G.map?.baratie?.run,items=R?.foes.includes(m)?BAR_LOOT[m.mid]:null;
 const result=old.apply(this,arguments);
 if(!items)return result;
 const counters=P.baratiePity||(P.baratiePity={});
 for(const r of items){
  if(baratieOwn(P,r))continue;
  const n=Math.min(r.pity,(counters[r.id]||0)+1);
  counters[r.id]=n;
  if(n<r.pity&&Math.random()>=Math.min(1,r.ch*dropEventMul()))continue;
  if(giveItem(r.id,1,true)){delete counters[r.id];lootFx(m.x,m.y,r.id);}
 }
 markDirty(true);return result;
};}
DLG_HOOKS.push((npc,opts)=>{
 const P=G.P,M=G.map;
 if(npc?.id!=='baratie_zeff'||!P.baratieSanji||!baratieHere(M,P)||M.baratie.run)return;
 for(const id of Object.keys(BAR_FOES))opts.push({
  label:L2('Revancha · ','Rematch · ')+BAR_FOES[id].n,icon:['sword'],
  fn:()=>{closeDialog();baratieStart(id,true);}
 });
});
{const old=itemSources;itemSources=function(id){
 const key=BAR_SOURCES[id]?id:'cosi_'+id,boss=BAR_SOURCES[key];
 if(!boss)return old.apply(this,arguments);
 const {ch,pity}=BAR_LOOT[boss].find(r=>r.id===key);
 return [[BAR_FOES[boss].n+' · '+Math.round(ch*100)+'% · '+L2('seguro a las ','guaranteed after ')+pity+L2(' victorias',' wins'),
  {loc:BARATIE_ARENA,m:'dawn',t:BARATIE_NAME}]];
};}
{const old=genIcon;genIcon=function(spec){return spec[0]==='baratie_weapon'?BAR_WEAPON_PX[spec[1]].pix:old.apply(this,arguments);};}
{const old=gearTiers;gearTiers=function(P){
 const gear=old.apply(this,arguments),id=P.equip.weapon?.id;
 if(BAR_WEAPON_PX[id])gear.barWeapon=id;
 return gear;
};}
{const old=cleanGear;cleanGear=function(g){
 const gear=old.apply(this,arguments);
 if(g&&Object.hasOwn(BAR_WEAPON_PX,g.barWeapon))gear.barWeapon=g.barWeapon;
 return gear;
};}
{const old=heroLook;heroLook=function(cls,app,gear){
 const look=old.apply(this,arguments);
 if(gear&&BAR_WEAPON_PX[gear.barWeapon])look.weapon={...look.weapon,barWeapon:gear.barWeapon};
 return look;
};}
{const old=drawWeapon;drawWeapon=function(p,w,x,y,angle){
 const art=BAR_WEAPON_PX[w?.barWeapon];
 if(!art)return old.apply(this,arguments);
 drawSpriteRot(p,art.pix,x,y,w.barWeapon==='w_bar_pearl'?-Math.PI/4:angle,art.pivot);
};}

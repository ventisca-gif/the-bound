// Original pixel art, shared by the whole island via the engine's sprite cache.
const GARDEN_SHALE=pal(['#28332e','#435144','#5b6350','#7c8067','#9b9d7e','#bbba95','#d8d2ab']);
const GARDEN_LEAF=pal(['#23432f','#31583a','#417343','#578747','#79a154','#a0b96a']);
const GARDEN_BONE=pal(['#524b38','#827556','#aa9870','#c8b58b','#e2d3ad','#f3e3be']);
function gardenSprite(name) {
  return spr('garden:'+name,()=>{
    if(name.startsWith('tree')||name.startsWith('palm')){
      const s=genTree(name.startsWith('tree')?'ancestral':'palma',+name.at(-1)), scale=name.startsWith('tree')?1.22:1.32;
      const c=mkCanvas(Math.ceil(s.w*scale),Math.ceil(s.h*scale)),g=c.getContext('2d');
      g.imageSmoothingEnabled=false;
      g.drawImage(s.trunk,0,0,c.width,c.height);
      g.drawImage(s.canopy,0,0,c.width,c.height);
      return {c,ax:s.ax*scale,ay:s.ay*scale};
    }
    if(name.startsWith('boulder'))return genRock('m',+name.at(-1),'normal');
    const [kind,variant]=[name.replace(/[0-9]+$/,''),Number(name.at(-1))||0];
    const dims={ridge:[191,151],volcano:[155,145],bone:[73,43],fern:[36,32],beacon:[28,48]};
    const [w,h]=dims[kind],p=new Pix(w,h), seed=272+variant*71;
    const stone=GARDEN_SHALE,leaf=GARDEN_LEAF,bone=GARDEN_BONE;
    if(kind==='ridge'){
      const peak=variant?83:107, crown=variant?14:3;
      p.poly([[3,140],[32,102],[48,63],[62,29],[peak,crown],[peak+27,30],[165,77],[188,137]],stone[3]);
      for(let y=crown;y<143;y++)for(let x=3;x<w-3;x++){
        if(!p.d[y*w+x])continue;
        const q=hash2(x>>1,y>>1,seed), slope=x<peak?1:0;
        let shade=clamp(2+slope+(((x+y*.53+Math.sin(y*.086)*11)/9)|0)%3+(q>.78?1:0),1,6);
        if(y>104&&hash2(x>>2,y>>2,seed+3)>.83) p.set(x,y,leaf[1+(q*3|0)]);
        else p.set(x,y,stone[shade]);
      }
      for (const [x,y,rx,ry] of variant?[[62,107,15,27],[109,103,18,33],[149,124,12,13]]:[[57,119,14,19],[91,92,21,37],[137,109,18,27]]){
        p.ell(x,y,rx+4,ry+2,stone[5]);
        p.ell(x+1,y+2,rx,ry,stone[1]);
        p.ell(x+1,y+1,Math.max(4,rx-4),ry-2,C('#20292b'));
        p.ell(x-2,y-4,Math.max(3,rx-6),Math.max(4,ry-6),C('#152226'));
        p.hl(x-rx+2,y+ry-5,rx*2-4,stone[2]);
      }
      for(let i=0;i<44;i++){
        const x=25+i*3.45,y=x<peak?crown+(peak-x)*.87:crown+(x-peak)*1.03,r=4+hash2(i,variant,seed)*8;
        p.ball(x,y+11,r,r*.54,leaf,0);
        if(i%3===0)p.ball(x+5,y+20,r*.75,r*.48,leaf,0);
      }
    }else if(kind==='volcano'){
      const ash=pal(['#392f31','#58453b','#765648','#936c56','#b58a68','#d3a381']);
      const top=variant?34:15, craterY=top+9;
      p.poly([[3,139],[29,114],[51,78],[62,top+7],[86,top+2],[98,top+11],[110,73],[134,115],[151,137]],ash[3]);
      for(let y=top;y<141;y++)for(let x=3;x<152;x++){
        if(!p.d[y*w+x])continue;
        const q=hash2(x>>1,y>>1,seed),rib=Math.sin((x-77)*3.2/Math.max(15,y-top)*8+Math.sin(y*.14)*.8);
        p.set(x,y,ash[clamp((rib*1.15+3+(q-.5)*1.4+(x<71?.45:0))|0,0,5)]);
      }
      p.ell(79,craterY,17,7,ash[1]);p.ell(78,craterY+1,11,4,ash[0]);
      p.ell(79,craterY+2,8,2,C('#e88649'));
      if(!variant){
        const lava=GARDEN_COLORS.lava;
        for(let i=0;i<11;i++){const y=top+18+i*7,x=80+i*2+Math.sin(i*1.1)*4;p.line(x-2,y,x+2,y+8,lava[1]);p.line(x,y,x+3,y+7,lava[2+i%2]);}
      }
      for(let i=0;i<13;i++){const x=i*11+10,y=135-hash2(i,0,seed)*5;p.ball(x,y,9,4,leaf);}
    }else if(kind==='bone'){
      p.ell(37,37,34,5,stone[2]);
      if(!variant){
        for(let i=0;i<6;i++){const x=11+i*10,y=11+Math.abs(2-i)*3;p.line(x,y,x-4,32,bone[1]);p.line(x+2,y,x-1,34,bone[4]);p.line(x+2,y,x+6,y+3,bone[5]);}
        p.line(7,18,61,20,bone[3]);p.line(9,17,59,19,bone[5]);
      }else{
        p.ball(30,19,16,13,bone);p.rect(29,17,25,10,bone[3]);p.ell(46,23,11,7,bone[2]);p.ell(34,16,5,4,stone[0]);
        p.ell(51,19,3,2,stone[1]);p.hl(38,26,17,bone[5]);p.line(21,31,54,35,bone[4]);
      }
    }else if(kind==='fern'){
      for(let i=0;i<8;i++){
        const angle=-Math.PI+i*.43;
        for(let d=1;d<16;d++){
          const x=18+Math.cos(angle)*d,y=29+Math.sin(angle)*d-(d*d)/52;
          const f=clamp((hash2(i,d,seed)*4|0)+1,1,5);
          p.set(x|0,y|0,leaf[f]);
          if(d%2===0){p.line(x,y,x+Math.cos(angle+1.15)*4,y+Math.sin(angle+1.15)*4,leaf[f]);p.line(x,y,x+Math.cos(angle-1.15)*3,y+Math.sin(angle-1.15)*3,leaf[f-1]);}
        }
      }
    }else{
      p.rect(12,11,4,35,WOOD[1]);p.vl(12,12,32,WOOD[4]);p.poly([[4,10],[23,10],[18,18],[4,18]],WOOD[3]);
      p.hl(5,11,16,WOOD[4]);p.hl(7,14,8,C('#dfd3a3'));p.hl(17,14,3,C('#dfd3a3'));
    }
    p.outline(OUTL,false);
    return {c:p.canvas(),ax:w/2,ay:h-3};
  });
}
{const old=objSprite;objSprite=function(o){if(o.k!=='garden')return old.apply(this,arguments);
  return gardenSprite(o.gardenSprite);};}

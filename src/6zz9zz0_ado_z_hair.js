// Ado 5.09: native two-layer pixel hair. Head and length follow separate body anchors.
// Coordinates are HD head pixels (16 px radius), never a full-character image squeezed into a hairstyle.
const ADO_NATIVE_PAL=['#101426','#1c2039','#292e4d','#3c4268','#50577c','#697294','#243d70','#32578b'];
const ADO_NATIVE_PATHS={
 down:{rear:[
 [1,'M -13 -9 C -23 6 -15 19 -25 31 C -31 40 -25 49 -18 47 C -25 43 -23 37 -18 32 C -11 24 -9 14 -8 5 Z'],
 [2,'M -8 -9 C -17 9 -8 22 -19 36 C -25 44 -19 52 -10 49 C -18 46 -15 42 -10 37 C -4 29 -4 16 -2 6 Z'],
 [6,'M -13 12 C -18 29 -22 35 -21 42 C -21 46 -18 48 -15 47 C -19 42 -11 35 -9 27 Z'],
 [1,'M 8 -12 C 24 -5 15 12 23 23 C 32 35 25 45 17 48 C 22 41 24 37 19 31 C 10 23 12 11 7 3 Z'],
 [2,'M 12 -3 C 19 12 12 21 20 32 C 26 42 18 51 9 48 C 17 42 15 37 10 31 C 4 22 8 12 4 2 Z'],
 [6,'M 16 14 C 16 25 25 33 21 42 L 17 46 C 20 35 10 29 12 18 Z'],
 [3,'M -16 9 C -19 20 -18 23 -24 33 C -28 40 -24 44 -22 44 C -25 38 -18 31 -16 26 C -13 20 -14 14 -13 10 Z'],
 [3,'M 15 3 C 22 15 16 20 23 30 C 28 38 24 43 21 45 C 24 37 18 32 17 28 C 12 18 17 12 13 5 Z']
 ],front:[
 [2,'M -17 2 C -20 -5 -18 -15 -10 -19 C -5 -22 6 -21 12 -17 C 18 -14 20 -5 17 4 L 15 12 C 11 16 9 17 7 16 C 12 10 12 6 12 0 C 9 -3 7 -6 6 -10 C 5 -3 1 2 -4 5 L -9 8 C -7 5 -6 3 -5 0 C -9 5 -13 7 -15 7 L -14 1 Z'],
 [3,'M -14 -8 C -13 -17 -5 -20 2 -19 C -6 -15 -5 -6 -13 1 C -17 5 -18 9 -17 13 C -22 6 -16 0 -14 -8 Z'],
 [3,'M 2 -19 C 10 -19 16 -11 15 -1 C 12 -9 10 -14 6 -16 C 7 -10 9 -5 11 -2 C 5 -4 3 -13 2 -19 Z'],
 [1,'M -1 -15 C -1 -7 -5 0 -12 4 C -8 -1 -4 -8 -1 -15 Z'],
 [1,'M 10 -10 C 15 -2 16 8 12 13 L 9 15 C 15 5 10 -2 10 -10 Z'],
 [4,'M -11 -15 L -9 -17 L -7 -16 L -9 -13 L -11 -13 Z'],
 [4,'M -6 -18 L -4 -19 L -3 -17 L -4 -15 L -6 -16 Z'],
 [4,'M 7 -17 L 10 -15 L 11 -12 L 9 -13 Z'],
 [3,'M -2 -20 C -10 -23 -20 -22 -24 -14 C -21 -18 -13 -20 -7 -19 Z']
 ]},
 up:{rear:[
 [1,'M -14 -10 C -22 7 -14 18 -24 30 C -31 42 -23 48 -17 46 C -21 43 -24 39 -18 33 L -7 8 Z'],
 [1,'M 12 -9 C 24 8 15 20 24 30 C 29 37 25 47 15 49 C 22 39 15 34 12 29 L 4 8 Z'],
 [2,'M -13 -7 C -20 10 -9 21 -18 33 C -26 43 -15 53 -7 47 C -14 46 -13 40 -8 33 C -3 24 -1 8 -1 1 Z'],
 [6,'M 10 10 C 11 24 22 32 19 40 C 18 44 14 47 10 47 C 17 40 11 36 8 30 L 4 11 Z'],
 [2,'M 0 -6 C -9 12 3 24 -6 37 C -12 47 -1 53 8 47 C 2 48 0 44 5 39 C 15 29 11 13 10 -3 Z'],
 [3,'M -15 2 C -18 19 -12 22 -20 33 C -25 40 -20 44 -17 45 C -20 39 -15 36 -12 30 C -7 20 -13 11 -10 3 Z'],
 [3,'M -2 0 C -8 15 0 25 -8 37 C -12 44 -6 48 -2 48 C -8 43 -2 38 0 32 C 4 20 -3 12 2 1 Z'],
 [3,'M 12 0 C 18 15 11 21 18 31 C 23 38 18 43 14 44 C 18 37 13 34 11 29 C 7 20 13 13 9 2 Z']
 ],front:[
 [2,'M -17 8 C -19 -1 -20 -11 -12 -17 C -6 -22 7 -22 14 -16 C 21 -9 18 3 17 13 C 14 23 19 29 17 33 C 12 28 12 21 11 15 C 10 25 13 32 9 38 C 7 28 4 22 4 13 C 0 24 5 35 0 42 C -7 39 -4 24 -6 17 C -8 28 -9 32 -14 34 C -11 24 -15 18 -17 8 Z'],
 [3,'M -12 -14 C -17 -6 -13 6 -13 13 C -10 21 -15 27 -14 31 C -8 27 -9 19 -9 13 C -8 4 -12 -6 -7 -16 Z'],
 [3,'M 0 -19 C -6 -9 0 1 -2 13 C -5 25 -1 31 -2 37 C 3 29 0 23 2 15 C 5 3 -1 -5 3 -18 Z'],
 [3,'M 9 -16 C 14 -6 11 3 12 11 C 13 16 13 22 16 25 C 14 13 17 5 16 -3 C 15 -10 13 -14 9 -16 Z'],
 [4,'M -11 -14 L -9 -15 L -8 -11 L -10 -10 Z'],[4,'M -6 -16 L -4 -17 L -3 -13 L -5 -12 Z'],[4,'M 6 -17 L 8 -16 L 9 -13 L 7 -13 Z'],
 [3,'M 4 -20 C -6 -24 -18 -23 -23 -15 C -18 -19 -10 -21 -2 -19 Z']
 ]},
 left:{rear:[
 [1,'M 6 -14 C 24 -5 17 13 24 26 C 30 37 22 48 14 47 C 19 43 21 37 16 31 C 9 21 12 10 3 0 Z'],
 [2,'M 2 -6 C 15 3 9 19 17 31 C 25 42 14 52 6 48 C 14 45 12 39 7 33 C 2 23 4 10 -1 4 Z'],
 [6,'M 13 10 C 13 24 24 32 19 41 L 15 45 C 18 37 7 30 9 17 Z'],
 [3,'M 15 1 C 22 15 16 20 23 30 C 27 37 23 43 20 44 C 22 37 16 33 15 28 C 11 17 17 11 12 3 Z'],
 [3,'M 6 12 C 10 27 8 28 14 36 C 18 43 13 47 9 48 C 14 43 7 37 6 31 C 2 23 5 17 4 13 Z']
 ],front:[
 [2,'M -17 0 C -19 -9 -13 -18 -4 -20 C 5 -22 16 -15 17 -6 C 20 6 10 16 10 24 C 6 21 6 14 7 7 L 9 1 C 5 -5 0 -7 -2 -13 C -4 -6 -8 -1 -15 4 L -12 -2 Z'],
 [3,'M -8 -15 C -15 -10 -13 -4 -19 3 C -17 -5 -19 -10 -11 -17 C -4 -22 4 -21 10 -17 C 2 -20 -4 -18 -8 -15 Z'],
 [3,'M 5 -16 C 14 -12 14 -5 12 2 C 10 5 10 10 10 13 C 6 6 10 1 9 -4 C 9 -10 6 -11 5 -16 Z'],
 [1,'M -1 -13 C -1 -5 -8 0 -12 2 C -7 -3 -5 -8 -1 -13 Z'],
 [4,'M -8 -16 L -6 -18 L -4 -17 L -6 -14 Z'],[4,'M 1 -18 L 3 -17 L 4 -14 L 2 -15 Z'],
 [3,'M 3 -20 C -6 -24 -19 -21 -24 -12 C -19 -18 -10 -20 -4 -19 Z']
 ]}
};
const ADO_NATIVE_CACHE=new Map();
function adoNativeLayer(dir,layer){
 const key=dir+':'+layer;if(ADO_NATIVE_CACHE.has(key))return ADO_NATIVE_CACHE.get(key);
 // Rasterize once on the HD pixel grid; quantized pigments keep edges and clusters crisp.
 const c=mkCanvas(80,96),x=c.getContext('2d'),mirror=dir==='right',view=ADO_NATIVE_PATHS[mirror?'left':dir];x.translate(40,28);if(mirror)x.scale(-1,1);
 for(const [tone,path]of view[layer]){const points=path.match(/[A-Za-z]|-?\d+(?:\.\d+)?/g);x.beginPath();let i=0;while(i<points.length){const k=points[i++],n=a=>Array.from({length:a},()=>+points[i++]);if(k==='M')x.moveTo(...n(2));else if(k==='L')x.lineTo(...n(2));else if(k==='C')x.bezierCurveTo(...n(6));else if(k==='Z')x.closePath();}x.strokeStyle=ADO_NATIVE_PAL[0];x.lineWidth=1.2;x.lineJoin='round';x.stroke();x.fillStyle=ADO_NATIVE_PAL[tone];x.fill();}
 const a=x.getImageData(0,0,80,96).data,pixels=new Uint8Array(80*96);for(let i=0;i<pixels.length;i++){if(a[i*4+3]<140)continue;let best=0,dist=Infinity;for(let k=0;k<ADO_NATIVE_PAL.length;k++){const rgb=hexRGB(ADO_NATIVE_PAL[k]),d=rgb.reduce((sum,v,j)=>sum+(v-a[i*4+j])**2,0);if(d<dist){dist=d;best=k;}}pixels[i]=best+1;}
 const F={w:80,h:96,pixels};ADO_NATIVE_CACHE.set(key,F);return F;
}
function adoNativePaint(p,m,L,dir,anim,f,scale){
 const hx=(m.hx+.5)*scale,hy=m.hy*scale,rx=m.hrx*scale,ry=m.hry*scale;
 const sx=rx/16,sy=ry/16,neck=12,tailEnd=Math.min(p.h-3*scale,(m.base-2)*scale);
 const neckY=hy+neck*sy,tailScale=Math.max(.12,(tailEnd-neckY)/(50-neck));
 const palette=L.r8Original?ADO_NATIVE_PAL.map(c=>C(c)):(()=>{const T=ahPal(L.hair);return ADO_NATIVE_PAL.map((c,i)=>i>=6?uMix(T[1],T[3],(i-6)*.4):T[Math.min(5,i)]);})();
 const phase=anim==='walk'||anim==='dance'?Math.sin(f*Math.PI/2):0;
 const tg=p.tg;for(const layer of ['rear','front']){
  const F=adoNativeLayer(dir,layer),top=Math.max(0,Math.floor(hy-23*sy)),bottom=Math.min(p.h-1,Math.ceil(tailEnd));
  for(let y=top;y<=bottom;y++){const v=y+.5<neckY?(y+.5-hy)/sy:neck+(y+.5-neckY)/tailScale,fy=Math.floor(v+28);if(fy<0||fy>=F.h)continue;
   const drift=phase*.45*scale*Math.max(0,(v-8)/42);
   for(let x=Math.max(0,Math.floor(hx-30*sx));x<=Math.min(p.w-1,Math.ceil(hx+30*sx));x++){
    const fx=Math.floor((x+.5-hx-drift)/sx+40);if(fx<0||fx>=F.w)continue;const tone=F.pixels[fy*F.w+fx];if(!tone)continue;
    // Rear curls stay behind clothes, face, hands and weapons. Back-view hair covers the torso only.
    const tag=p.t?.[y*p.w+x];if(layer==='rear'&&p.get(x,y))continue;
    if(layer==='front'&&v>12&&dir!=='up'&&p.get(x,y))continue;
    if(dir==='up'&&v>12&&p.get(x,y)&&!(tag===2||tag===4||tag===6||tag===5&&y<m.torsoTop*scale||tag===1&&y<(m.legTop+2)*scale))continue;
    if(p.t)p.tg=6;p.set(x,y,palette[tone-1]);
   }
  }
 }if(p.t)p.tg=tg;
}
{const original=r8HDPaint;r8HDPaint=function(p,m,L,dir,anim,f,scale){return L.hs.r8HD==='ado'?adoNativePaint(p,m,L,dir,anim,f,scale):original.apply(this,arguments);};}

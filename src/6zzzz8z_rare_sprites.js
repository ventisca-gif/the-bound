// Keep PNGs as separate sources; the renderer builds only the atlases it encounters.
const RARE_IMAGES=Object.fromEntries(Object.entries(RARE_BITMAPS).map(([id,src])=>{
 const image=new Image();image.src=src;return [id,image];
}));
const rareArtworkReady=()=>Object.values(RARE_IMAGES).every(image=>image.naturalWidth>0);
function rareActorAtlas(id){
 const key=id.slice(5),img=RARE_IMAGES[key];
 if(!img?.naturalWidth)return npcAtlas(ORANGE_NAMI);
 return getAtlas('rare:'+key,()=>{
  const atlas=dawnPixelAtlas(80,72,{idle:0,walk:2},6,(g,col,row)=>{
   const ga=key==='gaimon',source=ga?[0,3,1,2][row]*160:0;
   const step=col>=2?(col-2):col;
   if(!ga&&row===1){g.translate(160,0);g.scale(-1,1);}
   // Their silhouettes are kept whole while steps alternate in height and lean.
   const lift=ga?0:col<2?step:([0,2,1,2][step]);
   const sway=ga?0:col<2?0:[0,-2,0,2][step];
   g.drawImage(img,source,0,160,144,sway,-lift,160,144);
  });
  atlas.frames={idle:2,walk:4};
  return atlas;
 });
}

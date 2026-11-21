// Native bodies and walk atlases for the residents of both fictional settlements.
const SELVA_PEOPLE = [
  ['ag_luz','Luz', 'f',0,344,233,'verde',L2('Maestra shipibo-konibo','Shipibo-Konibo teacher'),L2('En casa y en la escuela usamos nuestra lengua. Si quieres, te enseño dos palabras del río y la tierra.','We use our language at home and at school. I can teach you two words for the river and the land.')],
  ['ag_rosa','Rosa','f',1,332,229,'rojo',L2('Artesana del puerto','Port artisan'),L2('Trabajo el kené, un arte shipibo-konibo de diseños geométricos que se plasma en textiles, cerámica y otras superficies. Cada artesana toma sus propias decisiones al trazarlo.','I make kené, a Shipibo-Konibo art of geometric designs used on textiles, ceramics and other surfaces. Each artist makes her own choices when drawing it.')],
  ['ag_mara','Mara','f',2,351,238,'beige',L2('Vendedora del mercado','Market vendor'),L2('Prueba el aguaje del mercado. La pulpa se usa para preparar aguajina, una bebida que servimos bien fría.','Try the aguaje at the market. We use its pulp to make aguajina, a drink we serve well chilled.')],
  ['ag_ana','Ana','f',3,323,228,'azul',L2('Bióloga de la cocha','Lake biologist'),L2('Cuando baja el río quedan cochas, como la del Espejo. Busca aves desde el mirador de la orilla y deja el agua tranquila.','When the river drops, oxbow lakes such as Mirror Lake remain. Look for birds from the shore viewpoint and give the water some space.')],
  ['ag_ines','Inés','f',4,357,229,'blanco',L2('Carpintera del puerto','Port carpenter'),L2('Ajusto las tablas antes de la creciente. Los pilotes mantienen el piso por encima del barro cuando sube el agua.','I tighten the boards before the high-water season. The stilts keep the floor above the mud when the water rises.')],
  ['ag_elias','Elías','m',0,353,246,'azul',L2('Motorista fluvial','Riverboat pilot'),L2('Fíjate en las marcas del muelle. Ayer el agua tocaba una tabla más arriba. Aquí el río decide a qué altura amarramos.','Look at the marks on the pier. Yesterday the water reached one board higher. The river decides where we tie up.')],
  ['ag_tomas','Tomás','m',1,336,211,'gris',L2('Vecino del puerto','Port resident'),L2('Tenemos familias aquí y en Lima. Mi prima también habla shipibo-konibo en la ciudad, junto al Rímac.','We have family here and in Lima. My cousin speaks Shipibo-Konibo in the city too, near the Rímac.')],
  ['ag_julio','Julio','m',2,348,223,'amarillo',L2('Cocinero del puerto','Port cook'),L2('Hoy hago patarashca. Envuelvo el pescado y lo cocino sobre las brasas para que conserve su jugo.','Today I’m making patarashca. I wrap the fish and cook it over embers so it stays juicy.')],
  ['ag_dario','Darío','m',3,329,237,'marron',L2('Reparador de canoas','Canoe repairer'),L2('Antes de salir reviso el fondo y el remo de repuesto. Si solo vienes a mirar, toma la pasarela: se llega a pie.','Before setting out, I check the hull and the spare paddle. If you’re sightseeing, take the boardwalk. You can get there on foot.')],
  ['ag_luis','Luis','m',4,317,225,'verde',L2('Mensajero del puerto','Port courier'),L2('Para encontrar el Tambo, sigue el sendero al noreste y cruza el puente. Luego el bosque se abre antes del mercado.','To find the Tambo, follow the trail northeast and cross the bridge. The forest opens out just before the market.')],
  ['ta_elena','Elena','f',0,529,78,'azul',L2('Maestra asháninka','Ashaninka teacher'),L2('Soy maestra del Tambo. En la escuela dibujamos el río y la comunidad, y escribimos sus nombres en asháninka. ¿Quieres probar?','I teach here in the Tambo. At school we draw the river and community and write their names in Ashaninka. Want to try?')],
  ['ta_nora','Nora','f',1,524,75,'verde',L2('Agricultora del Tambo','Tambo farmer'),L2('Mi familia cultiva yuca y plátano. La yuca de la chacra llega hoy a la cocina comunal.','My family grows cassava and bananas. Cassava from our plot is coming into the community kitchen today.')],
  ['ta_rita','Rita','f',2,533,84,'rojo',L2('Guardiana del sendero','Trail steward'),L2('Si quieres ver la cascada, ve hacia el oeste y toma el desvío del bosque. Con lluvia, camina despacio cerca de las piedras.','For the waterfall, head west and take the forest turnoff. In the rain, go slowly near the rocks.')],
  ['ta_julia','Julia','f',3,546,81,'beige',L2('Cartógrafa del Tambo','Tambo mapmaker'),L2('Los mapas de la escuela llevan nuestros propios nombres para los caminos. Así recordamos por dónde íbamos con los abuelos.','Our school maps use our own names for the paths. That way we remember where we used to walk with our grandparents.')],
  ['ta_milagros','Milagros','f',4,515,82,'marron',L2('Cocinera del Tambo','Tambo cook'),L2('Al mediodía servimos pescado y yuca. Si todavía tienes camino por delante, el mercado queda justo al este de la casa comunal.','At midday we serve fish and cassava. If you still have a long walk ahead, the market is just east of the community hall.')],
  ['ta_raul','Raúl','m',0,537,75,'verde',L2('Vecino del Tambo','Tambo resident'),L2('Mi abuelo vivió junto al Ene. En el camino de vuelta cruzamos varias cuencas donde se habla asháninka.','My grandfather lived by the Ene. On the way back we cross several river basins where Ashaninka is spoken.')],
  ['ta_abel','Abel','m',1,511,76,'gris',L2('Constructor del Tambo','Tambo builder'),L2('Dejamos espacio debajo del alero para que corra el aire. Cuando empieza a llover, ese mismo alero protege a los vecinos.','We leave space under the eaves for air to circulate. When rain starts, those same eaves shelter the neighbors.')],
  ['ta_alex','Álex','m',2,548,72,'azul',L2('Guía del aguajal','Aguajal guide'),L2('El aguajal está al este. El aguaje reúne a muchos animales alrededor de sus frutos, desde guacamayos hasta tapires.','The aguaje palm swamp lies to the east. Its fruit attracts all sorts of animals, from macaws to tapirs.')],
  ['ta_oscar','Óscar','m',3,524,84,'amarillo',L2('Vendedor del Tambo','Tambo vendor'),L2('Si buscas camino para la Cocha Espejo, baja por el sendero del sureste. El puente te deja en la orilla norte.','For Mirror Lake, head down the southeast trail. The bridge takes you to the north shore.')],
  ['ta_pedro','Pedro','m',4,535,79,'blanco',L2('Vecino del Tambo','Tambo resident'),L2('Mi tía usa palabras un poco distintas a las mías. Las formas de hablar el asháninka varían según la región.','My aunt uses slightly different words from mine. Ashaninka varies from region to region.')],
  ['selva_piloto','Daniela','f',2,...SELVA_AIR,'azul',L2('Piloto del Aeródromo del Aguaje','Aguaje Airstrip pilot'),L2('Bienvenido a la Selva peruana. Sigue el camino hacia el sureste para llegar al Puerto del Aguaje. Si vas de vuelta a Lima, dímelo.','Welcome to the Peruvian Amazon. Follow the trail southeast to Aguaje Port. Let me know when you’re heading back to Lima.')]
];
const SELVA_LOOKS = {};
for (const [id,n,g,bt,x,y,top,title,line] of SELVA_PEOPLE) {
  const app = {...DEF_APP, g, bt, skin:1+bt%3, hs:(g === 'f' ? [6,3,2,9,5] : [3,9,0,2,5])[bt],
    hair:'negro', eyes:'marron', top:[1,top], bot:[g === 'f' ? 1 : 0,bt%2 ? 'beige' : 'gris'], shoe:[1,'marron']};
  SELVA_LOOKS[id] = app;
  NPCS[id] = {n,title,look:LK({}),quests:[],lines:[line]};
}
{ const previous = npcAtlas; npcAtlas = function (id) {
  const app = SELVA_LOOKS[id];
  if (!app) return previous.apply(this,arguments);
  return getAtlas('selva:' + id, () => {
    const look = heroLook('guerrero',app,{}, {}, {});
    look.weapon = null; look.back = null;
    return buildAtlas(look,['idle','walk'],drawHero);
  });
}; }
function selvaLocalPeople(M) {
  if (M.residents) return;
  M.residents = true;
  for (const [id,,,,x,y] of SELVA_PEOPLE) {
    const at = blockedFor(M,x,y,0) ? freePxNear(M,x*16+8,y*16+8,5) : [x*16+8,y*16+10];
    if (at) spawnNPC(id,at[0],at[1],M.id,{face:'down',wander:id === 'selva_piloto' ? 0 : 1});
  }
}

const SELVA_LESSONS = {
  ag_luz: {
    title:L2('Aprender shipibo-konibo','Learn Shipibo-Konibo'),
    text:L2('En shipibo-konibo, «jene» es agua de río y «mai» es tierra. Esta lengua pertenece a la familia pano y se habla en comunidades a lo largo del Ucayali y en otros lugares, incluida Lima.','In Shipibo-Konibo, “jene” means river water and “mai” means earth or soil. This Panoan language is spoken in communities along the Ucayali and elsewhere, including Lima.'),
    question:L2('Practicar: ¿qué significa «jene»?','Practice: What does “jene” mean?'),
    right:L2('Agua de río','River water'), wrong:L2('Tierra','Earth')
  },
  ta_elena: {
    title:L2('Aprender asháninka','Learn Ashaninka'),
    text:L2('En asháninka, «nija» puede referirse al río y «nampi» a la comunidad. El asháninka pertenece a la familia arawak y se habla en varias cuencas, entre ellas la del Ene, el Tambo y el Perené.','In Ashaninka, “nija” can refer to the river and “nampi” to the community. Ashaninka is an Arawakan language spoken in several river basins, including the Ene, Tambo and Perené.'),
    question:L2('Practicar: ¿qué significa «nampi»?','Practice: What does “nampi” mean?'),
    right:L2('Comunidad','Community'), wrong:L2('Río','River')
  }
};
DLG_HOOKS.push((npc,opts) => {
  const l = SELVA_LESSONS[npc.id];
  if (!l) return;
  opts.unshift({label:l.title, icon:['book'], fn:() => typeText(l.text)}, {
    label:l.question, icon:['talk'], fn:() => {
      closeDialog();
      xMsg(NPCS[npc.id].n, l.question, [
        [l.wrong, () => xMsg(l.title,L2('Inténtalo de nuevo con la maestra.','Try again with the teacher.'))],
        [l.right, () => xMsg(l.title,L2('¡Correcto! ','Correct! ') + l.text)]
      ]);
    }
  });
});

// Original conversations available from the same character dialogue on land and aboard.
const DAWN_CREW_TOPICS={
 [SHELLS_CAST_IDS.luffy]:[
  ['El sombrero','The hat','Shanks me lo dejó para que se lo devolviera algún día. Por eso, si me ves salir corriendo detrás de un sombrero, no me detengas.','Shanks left it with me so I could return it someday. So if you see me running after a hat, don’t stop me.'],
  ['La próxima isla','The next island','Primero quiero ver quién vive ahí. Luego buscaré algo de comer. Si resulta que esas dos cosas están en el mismo sitio, mejor.','First I want to see who lives there. Then I’ll look for food. If those two things are in the same place, even better.'],
  ['Por qué te invita a pelear','Why he asks you to fight','Me gusta que cuando alguien grita «¡atrás!», tú te fijas primero en quién se quedó delante. Eso me da ganas de seguir contigo.','When someone yells “fall back,” you look to see who’s still up front. I like that. It makes me want to keep going with you.'],
  ['Las provisiones','The supplies','Nami ahora cuenta las naranjas una por una. Yo le dije que las había contado antes, pero no se lo tragó.','Nami counts the oranges one by one now. I told her I’d already counted them, but she didn’t buy it.','deck'],
  ['Elegir el camino','Choosing a path','Si escucho risas detrás de una colina, quiero ir a ver. Si escucho a Zoro decir que conoce el camino, también quiero ir a ver, pero por el otro lado.','If I hear laughter over a hill, I want to see what’s happening. If I hear Zoro say he knows the way, I want to look too, just in the other direction.','shore'],
  ['Lo que hizo Usopp','What Usopp did','Cuando llegó el momento de avisar al pueblo, se le notaba el miedo hasta en los zapatos. Y aun así no se fue. Por eso quería que subiera a bordo.','When it was time to warn the village, he looked scared down to his boots. He stayed anyway. That’s why I wanted him aboard.','syrup']
 ],
 [SHELLS_CAST_IDS.zoro]:[
  ['Las tres espadas','The three swords','La tercera cambia dónde puedo cubrirme. Lo difícil es saber cuándo dejar de atacar para que el otro se descubra solo.','The third blade changes where I can guard. The hard part is knowing when to stop attacking and let the other fighter leave an opening.'],
  ['Entrenar en grupo','Training as a crew','Entrena conmigo un rato algún día. Me interesa ver dónde te colocas cuando dos rivales se te vienen encima.','Train with me sometime. I’d like to see where you stand when two opponents come at you together.'],
  ['Turno de guardia','Taking watch','Puedo hacerme cargo del primer turno. Avísame cuando veas un barco; me cuesta ver sus colores cuando el sol se queda justo detrás.','I can take first watch. Tell me if you spot a ship. I have a hard time seeing its colors with the sun right behind it.','deck'],
  ['Seguir las marcas','Following the marks','Nami dejó señales junto a los cruces. No es que me pierda. Es que a veces los caminos buenos empiezan detrás de los malos.','Nami left signs at the junctions. I don’t get lost. Sometimes the good roads just start behind the bad ones.','shore'],
  ['Sham y Buchi','Sham and Buchi','Sham quería que siguiera sus manos. Buchi quería que olvidara sus pies. La próxima vez que dos se junten así, cuidado con el que parezca más lento.','Sham wanted me watching his hands. Buchi wanted me to forget his feet. Next time two fighters team up like that, watch the one who looks slower.','syrup']
 ],
 [ORANGE_NAMI]:[
  ['Dibujar la carta','Drawing the chart','Empiezo marcando dónde cambia el color del agua. Un puerto bonito sirve de poco si la quilla nunca llega a tocarlo.','I start by marking where the water changes color. A pretty harbor isn’t much use if your keel can’t reach it.'],
  ['Administrar provisiones','Managing supplies','La mejor parte de administrar el oro es que llega para comprar repuestos. La peor es que cada reparto empieza preguntándole a Luffy qué abrió.','The best part of managing the money is that we can afford spares. The worst part is that every inventory starts by asking Luffy what he opened.'],
  ['Leer el viento','Reading the wind','Mira las velas, no la brújula. Si el paño de arriba se afloja antes que el de abajo, algo cambió. Entonces sí, mira la brújula.','Watch the sails, not the compass. If the upper sail goes slack before the lower one, something changed. Then check the compass.','deck'],
  ['Volver al muelle','Getting back to the pier','Cuando desembarquemos de nuevo, fíjate en lo que tienes a la espalda al bajar. A la vuelta, el camino nunca se ve igual.','Next time we land, check what’s behind you as you step off. The road never looks the same coming back.','shore'],
  ['La escolta de Kaya','Escorting Kaya','Usopp conocía un paso entre los setos que ni aparecía en mi carta. A veces el mejor mapa es la persona que ha caminado más por el lugar.','Usopp knew a way through the hedges that wasn’t even on my chart. Sometimes the best map is the person who knows the roads.','syrup']
 ],
 [SYRUP_USOPP]:[
  ['Preparar el tirachinas','Preparing the slingshot','Me gusta que las piedras para practicar sean todas del mismo peso. Cuando conozco el peso, ya puedo preocuparme por el viento.','I like my practice stones to weigh the same. Once I know the weight, I can worry about the wind.'],
  ['El disparo de pólvora','The powder shot','Lo guardo para cuando una piedra sola no basta. Si ves el destello, es que llegué a tiempo. Si lo oyes antes de verlo, dame un poco más de espacio.','I save it for when one stone won’t do. If you see the flash, I was in time. If you hear it before you see it, give me a bit more room.'],
  ['Kaya y el pueblo','Kaya and the village','Algunas historias se las contaba para que se riera. Ahora quiero tener historias que pueda contarle sin inventarme las mejores partes.','I used to tell her stories to make her laugh. Now I want stories I can tell without making up the best parts.'],
  ['Una historia de Yasopp','A story about Yasopp','Mi padre salió al mar antes de que yo supiera qué había al otro lado del horizonte. Algún día quiero preguntarle qué vio primero.','My father went to sea before I knew what was beyond the horizon. Someday I want to ask him what he saw first.'],
  ['Vigía del Merry','The Merry’s lookout','Desde arriba puedo distinguir hasta las gaviotas. El detalle que omití cuando me ofrecí de vigía es que bajar da más miedo que subir.','From up there I can tell the gulls apart. The part I left out when I volunteered for lookout is that climbing down is scarier than climbing up.','deck'],
  ['Buscar un buen ángulo','Finding a good angle','Dame un claro frente a ti y un árbol a un lado. Así te puedo cubrir sin que el otro sepa de dónde salió el disparo.','Give me a clearing ahead and a tree to the side. Then I can cover you without the other guy knowing where the shot came from.','shore']
 ]
};
function dawnConversationTopics(npc,P=G.P){
 return (DAWN_CREW_TOPICS[npc.id]||[]).filter(([, , , , where])=>
  !where||where==='deck'&&npc.aboard||where==='shore'&&!npc.aboard||where==='syrup'&&P.syrupUsopp);
}
function dawnConversationMenu(npc){
 const menu=dawnConversationTopics(npc).map(([title,name,line,text])=>({
  label:L2(title,name),icon:['talk'],fn:()=>{
   typeText(L2(line,text));
   setOpts([{label:L2('Seguir conversando','Keep talking'),fn:()=>dawnConversationMenu(npc)},
    {label:L2('Volver','Back'),fn:()=>dialogMenu()},{label:L2('Despedirse','Say goodbye'),fn:closeDialog}]);
  }
 }));
 menu.push({label:L2('Volver','Back'),fn:()=>dialogMenu()});
 typeText(L2('¿De qué quieres hablar?','What would you like to talk about?'));
 setOpts(menu);
}
DLG_HOOKS.push((npc,opts)=>{
 if(!npc.dawnCrew||G.map?.id!=='dawn'||!DAWN_CREW_TOPICS[npc.id])return;
 opts.unshift({label:L2('Conversar','Talk'),icon:['talk'],fn:()=>dawnConversationMenu(npc)});
});

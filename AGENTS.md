# The Bound

The Bound es un RPG 2D de mundo abierto con movimiento en cuatro direcciones.

## Sprites, ropa y efectos de ataque

- Usa el sprite original como base para conservar la cara, el pelo, las proporciones y la cuadrícula de píxeles.
- Cada atuendo terminado debe verse en todos los fotogramas de caminata. Muestra el frente al bajar, la espalda al subir y el perfil correspondiente al ir a izquierda o derecha.
- Comprueba la posición de capas, bolsillos, adornos y otros accesorios asimétricos en cada vista. Conserva su lado al adaptar las animaciones.
- Mantén la animación del personaje y los efectos visuales de ataque en capas separadas para combinarlos durante el juego.

## Animación de caminata

- Prepara un ciclo de caminata para cada dirección: abajo (frente), arriba (espalda), izquierda y derecha. Usa la caminata original como base y conserva la cantidad, el orden y la duración de sus fotogramas cuando ya estén definidos.
- Alterna el apoyo de los pies y acompaña cada paso con el movimiento de los brazos. Adapta la ropa, el pelo y los accesorios a la pose de cada fotograma. Si el personaje lleva un arma, mantenla alineada con la mano que la sostiene.
- Conserva el tamaño de celda y el punto de anclaje del sprite original. Revisa en bucle las cuatro caminatas y su transición a reposo para detectar saltos de posición o cambios de ropa entre fotogramas.
- Toma como referencia la caminata del juego: pasos cortos, poco rebote vertical y cambios de dirección ágiles. Al crear un atuendo, adapta la ropa a los fotogramas originales de cada dirección para conservar ese movimiento.

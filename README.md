# Video-Synopsis

Notas:
-Ahora todas las clases que vayamos creando estan en Quadtree.js

-Hay una nueva clase, Blob. Es muy similar a Rectangle, salvo que le agrega los
porcentuales, que son los que vienen en el dataset. Para usarlo previamente hay que
cargarle width y height, para ajustar el blob al tamaño del background.-->inBackground()
Tambien le agrega un id y el tiempo real en el que fue detectado.

-Es importante que antes de poner un blob en el quadtree lo ubiquemos en un fondo,
para eso esta el metodo inBackground. Esto se debe a que los blobs vienen en
medidas porcentuales.

-Tuple ahora tiene el metodo isSimilar(obj,margin) que se fija si 2 blobs transcurren
al mismo tiempo, o si hay un margen de diferencia que hagan que esten muy cerca
uno del otro.

-sketch.js es el archivo necesario para utilizar la libreria p5, hay algunas
cosas hechas pero como no pude resolver lo de utilizar los objetos del json
fuera del jquery todavia no nos va a servir de mucho. Sin embargo, esta hecha la
implementacion del quadtree para poder observarlo graficamente. Estaba armado para
guardar rectangulos con un id en particular para tener en cuenta en el quadtree
al momento de las colisiones, pero tuve un error y volvi para atras. Falta hacer
eso.
Si queres probarlo y no queres que te imprima toda una secuencia de blobs, solo quita el
for de mousePressed y listo, te va a imprimir el rectangulo donde esta el mouse solamente.

-En assets estan los 3 dataset que nos dio Franco y el fondo, los puse ahi para
que sea mas comodo al momento de poner las rutas, asi tenemos los dos la misma ruta

-En notasdelmain guarde todos los comentarios que tenias vos en el main.js, los corri
porque molestaban un poco para leer.

Queda hacer:

-Probablemente para el lunes corrija lo del quadtree asi detecta colisiones teniendo
en cuenta el tiempo

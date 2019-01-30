console.log("Todo bien1");

let quad;
let tuplas;
//Prueba cargar todos los blobs del data example

function prueba() {
  let x, y, w, h;
  w = Math.random() * 100;
  h = Math.random() * 50;
  x = 1;
  y = 1;
  let obj;
  //console.log(quad);
  //for (let o : blobs) {
  //  obj = new Rectangle(x, y, w, h);

  //  blobs.push(obj);
  //  quad.insert(o);
  //  x = floor(Math.random()*800);
  //  y = floor(Math.random()*400);
  //  console.log("x:" + x + " y:" + y);
  //}
  //console.log(quad);
}

var dataset = 'script/assets/dataset_small.json';
$.getJSON(dataset)
  .done(function(response) { //Se escribe el codigo aca adentro, utilizando response object como el contenedor, ya que getJSON es asincronico y no se puede pasar el objeto afuera del json
    let data = response.data;

    //Ordenar los blobs en orden ascendente
    function sortBlobs() {
      let blob;
      for (let i = 0; i < data.length; i++) {
        blob = data[i].lightweight_blobs;
        blob.sort(function(a, b) { //ordena los blobs de cada tracked blob ascendentemente segun la funcion de comparacion
          return -new Date(b.time) + +new Date(a.time);
        });
      }
      data.sort(function(a, b) { //ordena todos los tracked blobs segun el momento que ingresan a la escena
        return -new Date(b.init) + +new Date(a.init);
      });

    }
    sortBlobs();
	console.log(data[0]);

	/*
    function listById(dataset) {
      let blobs = new Array();
      for (b of data) {
        let tblob = new Tuple(b, new Date(0, 0, 0, 0, 0));
        blobs.push(tblob);
        console.log(tblob);
      }
      console.log(blobs[1]);
    }
*/
    function loadBlobs(tblob) {
      //Carga en Blob cada blob detectado de un objeto
      let blobs = new Array();
	  let i;
      for (i = 0; i < data[tblob].lightweight_blobs.length; i++) {

        let objCenter = data[tblob].lightweight_blobs[i]['centroid'];
        //console.log(objCenter + " " +i);
        let cornerCoord = JSON.parse(objCenter); //necesito convertir el json a un objeto de Javascript
        let tracked_blob_id = JSON.stringify(data[tblob].lightweight_blobs[i].tracked_blob_id);
        let width = parseFloat(data[tblob].lightweight_blobs[i].width); //parse convierte un string al tipo que queramos
        let height = parseFloat(data[tblob].lightweight_blobs[i].height); //por ejemplo, parseFloat lo pasa a float
        let time = new Date(data[tblob].lightweight_blobs[i].time);
        //console.log(time);
        let bl = new Frame(cornerCoord.x, cornerCoord.y, width, height, tracked_blob_id, time, 800, 400); //{tracked_blob_id,width,height,time,cornerCoord};


        if (blobs.length == 0) {
          blobs.push(new Tuple(bl, 0));
        } else {
          let ntime = bl.time - blobs[0].blob.time;
          blobs.push(new Tuple(bl, ntime));
        }
		
      }
      //console.log(blobs);
      //trackedBlobs.push(blobs);
      //console.log(trackedBlobs);
      return blobs;
    }
/*
    function dateTest() { //funcion para jugar con el objeto Date, ver como funciona y eso
      let i;
      let blob;
      let blobsList = new Array();
      let time = new Date(0, 0, 0, 0, 0);
      for (let i = 0; i < data.length; i++) {
        blob = new Tuple(data[i], time);
        //cambia tiempo de cada tracked blob
        if (blobsList.length == 0) {
          blobsList.push(blob);
        } else {
          blob = new Tuple(data[i], new Date(blobsList[blobsList.length - 1].time));
          //console.log("Antes de setear: " + blobsList[blobsList.length - 1]);
          blob.setTime(10000 + blob.time.getMilliseconds());
          blobsList.push(blob);
          console.log(blobsList[blobsList.length - 1]);
        }
      }
      console.log("Hora: " + blobsList[3].time);
      console.log(blobsList[2].time);
    }
    //datetest();*/

	function loadScene() {
      let scenetest = new Scene(20, 800, 400, 0);
      for (let i = 0; i < data.length; i++) {
        tuplas = loadBlobs(i);
        tblob = new TrackedBlob(tuplas,0);
        scenetest.insert(tblob);
      }
      return scenetest;
    }
  let otraprueba = loadScene();
  console.log(otraprueba);
  });

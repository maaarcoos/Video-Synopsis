console.log("Todo bien1");

var amountTB = 0;

var t0 = performance.now();

let tuplas;

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

    function loadBlobs(tblob) {
      //Carga en Blob cada blob detectado de un objeto
      let blobs = new Array();
      let i;
      for (i = 0; i < data[tblob].lightweight_blobs.length; i++) {

        let objCenter = data[tblob].lightweight_blobs[i]['centroid'];
        //console.log(objCenter + " " +i);
        let cornerCoord = JSON.parse(objCenter); //necesito convertir el json a un objeto de Javascript
        let tracked_blob_id = data[tblob].lightweight_blobs[i].tracked_blob_id;
        let width = parseFloat(data[tblob].lightweight_blobs[i].width); //parse convierte un string al tipo que queramos
        let height = parseFloat(data[tblob].lightweight_blobs[i].height); //por ejemplo, parseFloat lo pasa a float
        let time = new Date(data[tblob].lightweight_blobs[i].time);
        //console.log(time);
        let bl = new Frame(cornerCoord.x, cornerCoord.y, width, height, tracked_blob_id, time, 800, 400); //{tracked_blob_id,width,height,time,cornerCoord};

        if (blobs.length == 0) {
          blobs.push(new Tuple(bl, 0));
        } else {
          let ntime = bl.time.getTime() - blobs[0].blob.time.getTime();
          //console.log(ntime);
          blobs.push(new Tuple(bl, ntime));
        }
      }
      return blobs;
    }


    var width = 800;
    var heigth = 400;



    function loadScenes() {
      let objMax = 32;
	  let persMax = 8;
      let timeInit = 0;
      let sceneList = new Array(); //Arreglo que contiene todas las escenas
      let scene;
      //console.log(data);

      for (let i = 0; i < data.length; i++) {
		let aliasShape = data[i].data.shape[0];

        tuplas = loadBlobs(i);

        let tracked_blob_id = data[i].lightweight_blobs[0].tracked_blob_id;
        tblob = new TrackedBlob(tuplas, tracked_blob_id, aliasShape); //ahora al tb solo se le manda el arreglo de tuplas y por defecto el delay va a ser siempre 0
        //console.log(tblob);
        if (sceneList.length == 0) {
          scene = new Scene(objMax, persMax, width, heigth, timeInit); //dentro de scene, le va a setear al nuevo tb el delay correspondiente al timeInit de la escena
          scene.insert(tblob);
          sceneList.push(scene);
        } else {
          if (sceneList[sceneList.length - 1].insert(tblob)) {
            //nada
          } else {
            timeInit = sceneList[sceneList.length - 1].getSceneTime();
            scene = new Scene(objMax, persMax, width, heigth, timeInit);
            // console.log(sceneList);
            scene.insert(tblob);
            sceneList.push(scene);
          }
        }
      }
      return sceneList;
    }

    let otraprueba = loadScenes();
    console.log(otraprueba);
    var t1 = performance.now();
    console.log(t1 - t0);
	for(let i=0; i<otraprueba.length; i++){
			let cantObj=0;
	let cantPers=0;
		console.log("holis");
		 console.log(otraprueba[i].getMaxObjecQuad());
		 console.log(otraprueba[i].objects.length);
		 console.log(otraprueba[i].persons.length);
		 for(let j=0; j<otraprueba[i].objects.length; j++){
			 cantObj=otraprueba[i].objects[j].blobs.length;
		 }
		 for(let t=0; t<otraprueba[i].persons.length;t++){
			 cantPers=otraprueba[i].persons[t].blobs.length;
		 }
		 console.log(cantObj);
		 console.log(cantPers);
		//console.log(otraprueba[i].quadtree.objects.length);
	}
  }
  );

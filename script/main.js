console.log("Todo bien1");

var t0 = performance.now();
let tuplas;

var dataset = 'script/assets/dataset_full.json';
$.getJSON(dataset)
  .done(function(response) { //Se escribe el codigo aca adentro, utilizando response object como el contenedor, ya que getJSON es asincronico y no se puede pasar el objeto afuera del json
    let data = response.data;
    var resolution = data[0].lightweight_spritesheets[0].resolution;//guarda la resolucion del video
    var res = resolution.split("x", 2);
    var width = res[0];
    var heigth = res[1];
    var cantBlobs = 0;

    var objMax;
    var persMax;
    var arrayRes = [];

    function sortBlobs() {
      let blob;
      for (let i = 0; i < data.length; i++) {//itera por todos los TB
        blob = data[i].lightweight_blobs;
        blob.sort(function(a, b) { //ordena los blobs de cada tracked blob ascendentemente segun la funcion de comparacion
          return -new Date(b.time) + +new Date(a.time);
        });
<<<<<<< HEAD
        for (let j = 0; j < data[i].lightweight_blobs.length; j++) { //itera por todos los blobs del TB
          if (j % 2){//obtiene la mitad de la cantidad de blobs
		  cantBlobs = cantBlobs + 1;}
=======
        for (let j = 0; j < data[i].lightweight_blobs.length; j++) { //obtiene cantidad de blobs
          if (j % 2) {
            cantBlobs = cantBlobs + 1;
          }
>>>>>>> 1cd653e56fe456312af967eeed6b28f69364c6a9
        }
      }
      data.sort(function(a, b) { //ordena todos los tracked blobs segun el momento que ingresan a la escena
        return -new Date(b.init) + +new Date(a.init);
      });
    }
    sortBlobs();

    function loadBlobs(tblob) {//Carga en Blob cada blob detectado de un objeto
      let blobs = new Array();
      let i;
      for (i = 0; i < data[tblob].lightweight_blobs.length; i++) {
        if (i % 2 || i == data[tblob].lightweight_blobs.length - 1) { //Solo agrega blobs pares
          let objCenter = data[tblob].lightweight_blobs[i]['centroid'];
          let cornerCoord = JSON.parse(objCenter); //necesito convertir el json a un objeto de Javascript
          let tracked_blob_id = data[tblob].lightweight_blobs[i].tracked_blob_id;
          let width = parseFloat(data[tblob].lightweight_blobs[i].width); //parse convierte un string al tipo que queramos
          let height = parseFloat(data[tblob].lightweight_blobs[i].height); //por ejemplo, parseFloat lo pasa a float
          let time = new Date(data[tblob].lightweight_blobs[i].time);
          let bl = new Frame(cornerCoord.x, cornerCoord.y, width, height, tracked_blob_id, time, 800, 400); //{tracked_blob_id,width,height,time,cornerCoord};
          if (blobs.length == 0) {
            blobs.push(new Tuple(bl, 0));
          } else {
            let ntime = bl.time.getTime() - blobs[0].blob.time.getTime();
            blobs.push(new Tuple(bl, ntime));
          }
        }
      }
      return blobs;
    }

<<<<<<< HEAD
    var objMax;
    var persMax;
=======
>>>>>>> 1cd653e56fe456312af967eeed6b28f69364c6a9

    function calculatorLimit() {//Calcula el almacenamiento maximo posible para cada escena de objetos y de personas
      objMax = Math.ceil((width * heigth) / (cantBlobs)); //divide la resolucion maxima por la mitad de los blobs totales
      persMax = Math.ceil(objMax / 2); 
    }

<<<<<<< HEAD
var arrayRes = [];//contiene TB resultados
=======

>>>>>>> 1cd653e56fe456312af967eeed6b28f69364c6a9

    function loadScenes() {
      calculatorLimit();
      let timeInit = 0;
      let sceneList = new Array(); //Arreglo que contiene todas las escenas
      let scene;

<<<<<<< HEAD
      for (let i = 0; i < data.length; i++) {//itera por todos los TB
        let aliasShape = data[i].data.shape[0];//contiene descripcion del TB
		var arrayRow = [];//arreglo que contiene caracteristicas del TB
        tuplas = loadBlobs(i);//obtiene la lista de blobs del TB
        let tracked_blob_id = data[i].lightweight_blobs[0].tracked_blob_id;//obtiene id del TB
        tblob = new TrackedBlob(tuplas, tracked_blob_id, aliasShape); //al tb se le manda el arreglo de tuplas, por defecto el delay va a ser siempre 0, su id y descripcion
        if (sceneList.length == 0) {
			scene = new Scene(objMax, persMax, width, heigth, timeInit); //crea una nueva escena con timpo inicial en 0 si es la primera escena
			scene.insert(tblob);//inserta el TB
			arrayRow.push(tblob.id);//guarda id TB
			arrayRow.push(tblob.getInicTime());//guarda tiempo de entrada de escena del TB
			arrayRow.push(tblob.getMaxTime());//guarda el tiempo de salida de escena del TB
			sceneList.push(scene);//inserta en la lista de escenas
        } else {
          if (sceneList[sceneList.length - 1].insert(tblob)) {//chequea si la ultima escena puede contener el TB
				arrayRow.push(tblob.id);
				arrayRow.push(tblob.getInicTime());
				arrayRow.push(tblob.getMaxTime());
          } else {//si la ultima escena no lo puede contener, creara una nueva
				timeInit = sceneList[sceneList.length - 1].getSceneTime();//calcula tiempo de inicio de la nueva escena, que es el tiempo final de la escena anterior
				scene = new Scene(objMax, persMax, width, heigth, timeInit);

				scene.insert(tblob);
				arrayRow.push(tblob.id);
				arrayRow.push(tblob.getInicTime());
				arrayRow.push(tblob.getMaxTime());
				sceneList.push(scene);
			}
        }
		arrayRes.push(arrayRow);//agrega la lista de descripcion del TB
=======
      for (let i = 0; i < data.length; i++) {
        let aliasShape = data[i].data.shape[0];
        var arrayRow = [];
        tuplas = loadBlobs(i);
        let tracked_blob_id = data[i].lightweight_blobs[0].tracked_blob_id;
        tblob = new TrackedBlob(tuplas, tracked_blob_id, aliasShape); //ahora al tb solo se le manda el arreglo de tuplas y por defecto el delay va a ser siempre 0
        if (sceneList.length == 0) {
          scene = new Scene(objMax, persMax, width, heigth, timeInit); //dentro de scene, le va a setear al nuevo tb el delay correspondiente al timeInit de la escena
          scene.insert(tblob);
          arrayRow.push(tblob.id);
          arrayRow.push(tblob.getInicTime());
          arrayRow.push(tblob.getMaxTime());
          sceneList.push(scene);
        }
        else {
          if (sceneList[sceneList.length - 1].insert(tblob)) {
            arrayRow.push(tblob.id);
            arrayRow.push(tblob.getInicTime());
            arrayRow.push(tblob.getMaxTime());
          }
          else {
            timeInit = sceneList[sceneList.length - 1].getSceneTime();
            scene = new Scene(objMax, persMax, width, heigth, timeInit);

            scene.insert(tblob);
            arrayRow.push(tblob.id);
            arrayRow.push(tblob.getInicTime());
            arrayRow.push(tblob.getMaxTime());
            sceneList.push(scene);
          }
        }
        arrayRes.push(arrayRow);
      }
      return sceneList;
    }


    function download_csv() {
      var csv = dataset + '\n';
      csv += 'id,time Inic, time final\n';
      arrayRes.forEach(function(row) {
        csv += row.join(',');
        csv += "\n";
      });
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += csv;
      return csvContent;
>>>>>>> 1cd653e56fe456312af967eeed6b28f69364c6a9
    }

    let sceneList = new Array();
    sceneList = loadScenes();
    for (let i = 0; i < sceneList.length; i++) {
      let cantObj = 0;
      let cantPers = 0;
      for (let j = 0; j < sceneList[i].objects.length; j++) {
        cantObj = sceneList[i].objects[j].blobs.length;
      }
      for (let t = 0; t < sceneList[i].persons.length; t++) {
        cantPers = sceneList[i].persons[t].blobs.length;
      }

    }

    let encodedUri = encodeURI(download_csv());
    link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Result.csv');
    link.click();

<<<<<<< HEAD
	function download_csv() {//crea el archivo csv
    var csv = dataset + '\n';
	csv += 'id,time Inic, time final\n';
    arrayRes.forEach(function(row) {//utiliza el arreglo que contiene los tiempos de TB finales 
            csv += row.join(',');
            csv += "\n";
    });
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += csv;


    return csvContent;
	}
  let encodedUri = encodeURI(download_csv());
  link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'Result.csv');
        link.click();
  window.open(encodedUri);//para descargar automaticamente el archivo csv
=======
    var t1 = performance.now();
    console.log(t1 - t0);
>>>>>>> 1cd653e56fe456312af967eeed6b28f69364c6a9


  })

;

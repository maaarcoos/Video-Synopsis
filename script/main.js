console.log("Todo bien1");

var t0 = performance.now();
let tuplas;

var dataset = 'script/assets/dataset_full.json';
$.getJSON(dataset)
  .done(function(response) { //Se escribe el codigo aca adentro, utilizando response object como el contenedor, ya que getJSON es asincronico y no se puede pasar el objeto afuera del json
    let data = response.data;
    var resolution = data[0].lightweight_spritesheets[0].resolution;
    var res = resolution.split("x", 2);
    var width = res[0];
    var heigth = res[1];
    var cantBlobs = 0;

    var objMax;
    var persMax;
    var arrayRes = [];

    function sortBlobs() {
      let blob;
      for (let i = 0; i < data.length; i++) {
        blob = data[i].lightweight_blobs;
        blob.sort(function(a, b) { //ordena los blobs de cada tracked blob ascendentemente segun la funcion de comparacion
          return -new Date(b.time) + +new Date(a.time);
        });
        for (let j = 0; j < data[i].lightweight_blobs.length; j++) { //obtiene cantidad de blobs
          if (j % 2) {
            cantBlobs = cantBlobs + 1;
          }
        }
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


    function calculatorLimit() {
      objMax = Math.ceil((width * heigth) / (cantBlobs));
      persMax = Math.ceil(objMax / 2);
    }



    function loadScenes() {
      calculatorLimit();
      let timeInit = 0;
      let sceneList = new Array(); //Arreglo que contiene todas las escenas
      let scene;

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

    var t1 = performance.now();
    console.log(t1 - t0);


  })

;

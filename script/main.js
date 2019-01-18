console.log("Todo bien1");


function prueba(){
	var i,x,y,w,h;
	w=4;h=3;x=0;y=0;
	var obj;
	var bo=new Rectangle(0,0,10,7);
	var quad=new Quadtree(bo,1);
	//console.log(quad);
	for(i=0 ; i<7 ; i++){
		obj=new Rectangle(x,y,w,h);
		quad.insert(obj);
		x=x+2;
		y++;
	}
	console.log(quad);

}
prueba();

var dataset = 'script/dataset_small.json';

$.getJSON(dataset)
    .done(function(response) {//Se escribe el codigo aca adentro, utilizando response object como el contenedor, ya que getJSON es asincronico y no se puede pasar el objecto afuera del json
		var data = response.data;

		function sortBlobs(){
		var blob;
		var i;
		for(i = 0; i < data.length; i++){
			var j;
			blob = data[i].lightweight_blobs;
			blob.sort(function(a,b){//ordena los blobs de cada tracked blob ascendentemente segun la funcion de comparacion
					return -new Date(b.time) + +new Date(a.time);
				});
		}
		data.sort(function(a,b){//ordena todos los tracked blobs segun el momento que ingresan a la escena
			return -new Date(b.init) + +new Date(a.init);
		});

		}
		sortBlobs();
		//console.log(data);

		/*


		//Luego de ordenar, empieza el codigo llamando a las clases y todo hecho fuera
		var scenesList = new Array();
		var time= new Date(0,0,0,0,0);//time inicializado en 00:00:00

		function insertInScene(obj){
			if(scenesList.length == 0){//Si es la primer Escena
					var scene= new Scene(20,800,480,time);

			}
			else{//Si hay mas escenas
				var i;
				for(i=0;i<scenesList.length;i++){

				}
			}



		}

		var i;
		var blobs;
		for(i = 0; i < data.length; i++){
			var j;
			blobs=data[i].lightweight_blobs;
			for(j=0 ; j < blobs.length ; j++){
				insertInScene(blobs[j]);
			}
		}
		*/



		//var FinalList = new Array();
		var time = new Date(0,0,0,0,0);
		var i;
		var blob;
		var blobsList = new Array();
		for(i = 0;i<data.length;i++){
			var j;
			var trackblobs;

			blob=new Tuple(data[i], time);

				//cambia tiempo de cada tracked blob
			if(blobsList.length == 0){
				blobsList.push(blob);
				//blob=new Tuple(data[i], blobsList[blobsList.length - 1].time);

			}
			else {
				blob=new Tuple(data[i], blobsList[blobsList.length - 1].time);
				//console.log(blobsList[blobsList.length - 1]);
				blob.setTime(10000 + blob.time.getMilliseconds());
				blobsList.push(blob);
				console.log(blobsList[blobsList.length - 1]);
			}

			}

			console.log(blobsList[2].time);





	}

	);

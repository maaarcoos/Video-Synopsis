class TrackedBlob {//contenedor de cada tb
  constructor(blobs, id, alias) {
    this.delay = 0;
    this.blobs = blobs; //Se le pasa una lista de blobs ordenados
    this.id = id;
    this.alias = alias;
  }

  getInicTime(){
	  return this.blobs[0].time;
  }

  getMaxTime() {//devuelve el tiempo maximo de su ultimo blob en escena
    return this.blobs[this.blobs.length - 1].time;
  }

  setDelay(lag) {
    this.delay = this.delay + lag;
  }
}


class Tuple {

  constructor(blob, time) { //time  - blob contiene el blob en cuestion
    this.blob = blob;
    this.time = time;
    this.collision = false;
  }
  setTime(delay) {
    this.time = this.time + delay;
  }
  similarTime(obj, margin) { //compara el tiempo entre dos blobs
    return (this.time == obj.time ||
      this.time - margin <= obj.time && this.time > obj.time ||
      this.time <= obj.time && this.time + margin > obj.time);
  }
  
  overlap(obj) { //se fija si se solapan al menos en un cuarto de cada uno
    return ((obj.blob.x <= this.blob.x + this.blob.width) ||
      (obj.blob.y <= this.blob.y + this.blob.heigth) ||
      (obj.blob.x + (obj.blob.width) >= this.blob.x) ||
      (obj.blob.y + (obj.blob.heigth) >= this.blob.y));
  }

}


class Rectangle { //el primero se inicializara con (0,0,800,400)
  constructor(x, y, w, h) { //Javascript soporta parametros faltantes en el llamado
    this.x = x; // al constructor
    this.y = y;
    this.width = w;
    this.heigth = h;
  }

  contains(obj) { //contiene al menos la mitad del objeto en cuestion
    return ((obj.blob.x + (obj.blob.width) / 2 <= this.x + this.width) &&
      (obj.blob.y + (obj.blob.heigth) / 2 <= this.y + this.heigth) &&
      (obj.blob.x + (obj.blob.width) / 2 >= this.x - this.width) &&
      (obj.blob.y + (obj.blob.heigth) / 2 >= this.y - this.heigth));
  }
}

class Frame {//clase contenedora de blob

  constructor(x, y, w, h, id, time, resWidth, resHeigth) {
    this.x = (resWidth * x) / 100;
    this.y = (resHeigth * y) / 100;
    this.width = (resWidth * w) / 100;
    this.heigth = (resHeigth * h) / 100;
    this.id = id;
    this.time = time;
  }

}

class Quadtree {
  constructor(bounds, maxObj) { //Recibe un rectangulo que delimita al quad y la cantidad max de objetos;
    this.objects = new Array();
    this.bounds = bounds;
    this.maxObjects = maxObj; //cantidad max de objetos por quad -> es distinto a la cantidad max de objetos por escena
    this.splited = false;
  }
  split() { //divide el quadtree en 4 quadtree (4 nodos mas en el arbol que se ubican en el proximo nivel del arbol)
    let subWidth = this.bounds.width / 2;
    let subheigth = this.bounds.heigth / 2;
    let x = this.bounds.x;
    let y = this.bounds.y;

    this.child0 =
      new Quadtree(new Rectangle(x, y, subWidth, subheigth), this.maxObjects); //hijo0
    this.child1 =
      new Quadtree(new Rectangle(x + subWidth, y, subWidth, subheigth), this.maxObjects); //hijo1
    this.child2 =
      new Quadtree(new Rectangle(x, y + subheigth, subWidth, subheigth), this.maxObjects); //hijo2
    this.child3 =
      new Quadtree(new Rectangle(x + subWidth, y + subheigth, subWidth, subheigth), this.maxObjects); //hijo3
    this.splited = true;
  }

  retrieve() {//si esta divido, pasa sus objetos a sus regiones hijas
	if(this.splited){
		while (this.objects.length != 0) {
			let obj = this.objects.pop();
			if (this.child0.insert(obj)) {} else if (this.child1.insert(obj)) {} else if (this.child2.insert(obj)) {} else if (this.child3.insert(obj)) {}
		}
		return true;
	}
	return false;
  }

  
  
  collide(obj) {//detecta colision del objeto blob
    if (!this.bounds.contains(obj)) {//si no lo puede contener retorna false
      return false;
    } else
    if (this.objects.length < this.maxObjects && !this.splited) {//si lo puede contener y no se dividio el quad
      for (let i = 0; i < this.objects.length; i++) {//recorre todos los blob que contiene
	  //chequea que no tengan mismo id (que no pertenezcan al mismo TB, que no se solapen y que se encuentren en el mismo intervalo de tiempo)
        if (obj.blob.id != this.objects[i].blob.id && obj.overlap(this.objects[i]) && obj.similarTime(this.objects[i], 1000)) {
          obj.collision = true;
          return true;
        }
      }
      return false;//si esta dividido, se fija si en sus hijos colisiona
    } else if (this.splited) {
      if (this.child0.collide(obj)) {
        return true;
      } else
      if (this.child1.collide(obj)) {
        return true;
      } else
      if (this.child2.collide(obj)) {
        return true;
      } else
      if (this.child3.collide(obj)) {
        return true;
      }

    } else return false;
  }

  insert(obj) {
    if (!this.bounds.contains(obj)) { //Si no lo puede contener al objeto por lo limites, retorna false
      return false;
    } else {
      if (this.objects.length < this.maxObjects && !this.splited) { //Si la cantidad de objetos no excede la cantidad maxima permitida de objetos, inserta y ademas si aun no esta dividido
        this.objects.push(obj);
        return true;
      } else {

        if (!this.splited) { //Si no esta dividido, lo divide
          this.split();
          this.retrieve();
        } //Como se dividio se debe insertar sus objetos en sus hijos
        if (this.child0.insert(obj)) {
          return true;
        } //Se fija si alguno lo puede contener al objeto actual
        else
        if (this.child1.insert(obj)) {
          return true;
        } else
        if (this.child2.insert(obj)) {
          return true;
        } else
        if (this.child3.insert(obj)) {
          return true;
        }
      }
    }
  }
  
    clear(){//limpia el quadtree
	  if(! this.splited){
		for(let i=0;i<this.objects.length;i++){
		  this.objects.splice(i,1);
		}
		this.objects=[];
	  }
	  else{
		  this.child0.clear();
			this.child1.clear();
			this.child2.clear();
			this.child3.clear();
	}
  }

  drop(obj) {//elimina un objeto del quadtree
    if (!this.bounds.contains(obj)) { //Si no lo podria contener, no se fija de sacarlo
      return false;
    } else
    if (this.splited) { //Si esta dividido, lo busca por sus hijos
      if (this.child0.drop(obj)) {
        return true
      } else if (this.child1.drop(obj)) {
        return true
      } else if (this.child2.drop(obj)) {
        return true
      } else if (this.child3.drop(obj)) {
        return true
      }
    } else { //Si no esta dividido y lo puede contener, lo elimina
      let i = 0;
      while (i < this.objects.length && this.objects[i].blob.id != obj.blob.id) {
        i++;
      }
      obj.collision = false;
      this.objects.splice(i, 1);
      return true;
    }
  }

  getMaxObjects() {//obtiene la cantidad maxima de objetos del quadtree total
    if (this.splited) {
      return this.child0.getMaxObjects() + this.child1.getMaxObjects() + this.child2.getMaxObjects() + this.child3.getMaxObjects();
    } else
      return this.objects.length;
  }

}



class Scene {//escena
  constructor(objMax, personsMax, widthMax, hightMax, timeInit) {
    this.objMax = objMax;
    this.personsMax = personsMax
    this.bounds = new Rectangle(0, 0, widthMax, hightMax);
    this.quadtree = new Quadtree(this.bounds, Math.ceil(objMax / 4));
    this.timeInit = timeInit;
    this.timeLimit;
    this.objects = new Array(); //arreglo de tracked blobs
    this.persons = new Array(); //arreglo donde se guardan tracked blobs que fueron detectados
    // con el alias "human"
  }

  insert(tb) {//inserta cada tb por escena
    if (this.objects.length < this.objMax || this.persons.length < this.persMax) {//si los limites no fueron excedidos, lo puede insertar
      tb.setDelay(this.timeInit); //setea el delay inicial del tb que corresponde al inicio de la escena
      let i = 0;
      while (i < tb.blobs.length) {//itera por todos los blobs del tb
        tb.blobs[i].time += tb.delay;//setea a cada blob el delay 
        if (this.quadtree.collide(tb.blobs[i])) {//si el blob ocasiona colision en el quadtree
          let j = i;
          while (j >= 0) {//recorre todos los blobs anteriormente seteados y les saca el delay actual
            tb.blobs[j].time -= tb.delay;
            j--;
          }
          tb.setDelay(100);//setea un nuevo delay al TB
          i = 0;
        } else {
          i++;
        }
      }
	  
	  //chequea si pertenece a la clasificacion de persona o de objeto, para insertarlo en un arreglo o en el otro

      if (!(tb.alias == undefined) && this.persons.length < this.personsMax && tb.alias.accuracy >= 60 && (tb.alias.alias == "human" || tb.alias.alias == "cyclist")) {
        for (let j = 0; j < tb.blobs.length; j++) {
          this.quadtree.insert(tb.blobs[j]);
        }
        this.persons.push(tb);
        return true;
      } else if ((tb.alias == undefined) && (this.objects.length < this.objMax) || (this.objects.length < this.objMax) || !(this.persons.length < this.persMax) ) {

        for (let j = 0; j < tb.blobs.length; j++) {
          this.quadtree.insert(tb.blobs[j]);
        }
        this.objects.push(tb);
        return true;
      }
      return false; 
    }
	return false;//si no tiene lugar para contenerlo, retorna false
  }

  sortScene() {//ordena los arreglos de objetos y de personas de la escena

    this.objects.sort(function(a, b) {
      return (-b.blobs[b.blobs.length - 1].time + +a.blobs[a.blobs.length - 1].time);
    });
	this.persons.sort(function(a, b) {
      return (-b.blobs[b.blobs.length - 1].time + +a.blobs[a.blobs.length - 1].time);
    });
  }

  getMaxObjectQuad() {//retorna la maxima cantidad de objetos por escena
    return this.quadtree.getMaxObjects();
  }

  getSceneTime() {//retorna el tiempo final de la escena que sera el tiempo de salida de escena del blob mas lento de cada tb
	this.sortScene();
	let timeMax=0;
	if(this.objects.length != 0 && this.persons.length !=0){//si los dos arreglos no son vacios
		timeMax = Math.max(this.objects[this.objects.length - 1].getMaxTime(), this.persons[this.persons.length-1].getMaxTime());}
	else//si alguno de los dos es vacio
		if(this.objects.length != 0){
			timeMax =this.objects[this.objects.length - 1].getMaxTime();}
		else
			timeMax = this.persons[this.persons.length-1].getMaxTime();

	console.log("tiempo de escena: " + timeMax);
	return timeMax;
  }

}

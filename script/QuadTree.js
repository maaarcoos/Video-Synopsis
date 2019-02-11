class TrackedBlob {
  constructor(blobs, id, alias) {
    this.delay = 0;
    this.blobs = blobs; //Se le pasa una lista de blobs
    this.id = id;
    this.alias = alias;
  }
  getTimeDelayed(i) {
    return this.blobs[i].time + this.delay;
  }

  getMaxTime() {
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
    return ((obj.blob.x + (obj.blob.width) / 4 <= this.blob.x + this.blob.width) &&
      (obj.blob.y + (obj.blob.heigth) / 4 <= this.blob.y + this.blob.heigth) &&
      (obj.blob.x + (obj.blob.width) / 4 >= this.blob.x - this.blob.width) &&
      (obj.blob.y + (obj.blob.heigth) / 4 >= this.blob.y - this.blob.heigth));
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

class Frame {

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

  retrieve() {
	if(this.splited){
		while (this.objects.length != 0) {
			let obj = this.objects.pop();
			if (this.child0.insert(obj)) {} else if (this.child1.insert(obj)) {} else if (this.child2.insert(obj)) {} else if (this.child3.insert(obj)) {}
		}
		return true;
	}
	return false;
  }

  collide(obj) {
    if (!this.bounds.contains(obj)) {
      return false;
    } else
    if (this.objects.length < this.maxObjects && !this.splited) {
      for (let i = 0; i < this.objects.length; i++) {
        if (obj.blob.id != this.objects[i].blob.id && obj.overlap(this.objects[i]) &&
          obj.similarTime(this.objects[i], 100)) {
          obj.collision = true;
          return true;
        }
      }
      return false;
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
  
    clear(){
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

  drop(obj) {
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

  getMaxObjects() {
    if (this.splited) {
      return this.child0.getMaxObjects() + this.child1.getMaxObjects() + this.child2.getMaxObjects() + this.child3.getMaxObjects();
    } else
      return this.objects.length;
  }

}



class Scene {
  constructor(objMax, personsMax, widthMax, hightMax, timeInit) {
    this.objMax = objMax;
    this.personsMax = personsMax
    this.bounds = new Rectangle(0, 0, widthMax, hightMax);
    this.quadtree = new Quadtree(this.bounds, objMax / 4);
    this.timeInit = timeInit;
    this.timeLimit;
    this.objects = new Array(); //arreglo de tracked blobs
    this.persons = new Array(); //arreglo donde se guardan tracked blobs que fueron detectados
    // con el alias "human"
  }

  insert(tb) {
    if (this.objects.length < this.objMax || this.persons.length < this.persMax) {
      tb.setDelay(this.timeInit); 
      let i = 0;
      while (i < tb.blobs.length) {
        tb.blobs[i].time += tb.delay;
        if (this.quadtree.collide(tb.blobs[i])) {
          let j = i;
          while (j >= 0) {
            tb.blobs[j].time -= tb.delay;
            j--;
          }
          tb.setDelay(100);
          i = 0;
        } else {
          i++;
        }
      }

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
	return false;
  }

  sortScene() {

    this.objects.sort(function(a, b) {
      return (-b.blobs[b.blobs.length - 1].time + +a.blobs[a.blobs.length - 1].time);
    });
	this.persons.sort(function(a, b) {
      return (-b.blobs[b.blobs.length - 1].time + +a.blobs[a.blobs.length - 1].time);
    });
  }

  getMaxObjectQuad() {
    return this.quadtree.getMaxObjects();
  }

  getSceneTime() {
	if(this.objects.length != 0 || this.persons.length !=0){
		this.sortScene();
		let timeMax = Math.max(this.objects[this.objects.length - 1].getMaxTime(), this.persons[this.persons.length-1].getMaxTime());
		console.log("tiempo de escena: " + timeMax);
		return timeMax;
	}
	return 0;
  }

}

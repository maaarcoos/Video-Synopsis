class TrackedBlob {
  constructor(blobs) {
    this.delay = 0;
    this.blobs = blobs; //Se le pasa una lista de blobs
  }
  sortTBlob(){
	  this.blobs.sort(function(a,b){
		  return -b.time + +a.time;
	  });
  }
  
  getMaxTime(){
	this.sortTBlob();
	return this.blobs[this.blobs.length - 1].time + this.delay;
  }
  
  
  getTimeIndex(index) {
    return this.blobs[index].time + this.delay;
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
  getX() {
    return this.blob.x;
  }
  getY() {
    return this.blob.y;
  }
  getHeigth() {
    return this.blob.heigth;
  }
  getWidth() {
    return this.blob.width;
  }

}


class Rectangle { //el primero se inicializara con (0,0,800,400)
  constructor(x, y, w, h) { //Javascript soporta parametros faltantes en el llamado
    this.x = x; // al constructor
    this.y = y;
    this.width = w;
    this.heigth = h;
  }

  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  getWidth() {
    return this.width;
  }
  getheigth() {
    return this.heigth;
  }
  setX(newx) {
    this.x = newx;
  }
  setY(newY) {
    this.y = newY;
  }
  setWidth(newW) {
    this.width = newW;
  }
  setheigth(newH) {
    this.heigth = newH;
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

  overlap(obj) { //se fija si se solapan al menos en un cuarto de cada uno
    //console.log(obj);
    //console.log(this);
    return ((obj.blob.x + (obj.blob.width) / 4 <= this.x + this.width) &&
      (obj.blob.y + (obj.blob.heigth) / 4 <= this.y + this.heigth) &&
      (obj.blob.x + (obj.blob.width) / 4 >= this.x - this.width) &&
      (obj.blob.y + (obj.blob.heigth) / 4 >= this.y - this.heigth));

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
    while (this.objects.length != 0) {
      let obj = this.objects.pop();
      if (this.child0.insert(obj)) {} else if (this.child1.insert(obj)) {} else if (this.child2.insert(obj)) {} else if (this.child3.insert(obj)) {}
    }
  }

  collide(obj) {
    for (let i = 0; i < this.objects.length; i++) {
      if (obj.blob.overlap(this.objects[i]) &&
        obj.similarTime(this.objects[i], 100) &&
        obj.blob.id != this.objects[i].blob.id) {
        return true;
      }
    }

    return false;
  }

  insert(obj) {
    if (!this.bounds.contains(obj)) { //Si no lo puede contener al objeto por lo limites, retorna false
      return false;
    } else {
      if (this.objects.length < this.maxObjects && !this.splited) { //Si la cantidad de objetos no excede la cantidad maxima permitida de objetos, inserta y ademas si aun no esta dividido
        if (this.collide(obj)) {
          obj.collision = true;
        } else {
          this.objects.push(obj);
        }
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
      this.objects.splice(i, 1);
      return true;
    }
  }

  getNeighbors() {
    return this.objects;
  }
}

class Scene {
  constructor(objMax, widthMax, hightMax, timeInit) {
    this.objMax = objMax;
    this.bounds = new Rectangle(0, 0, widthMax, hightMax);
    this.quadtree = new Quadtree(this.bounds, objMax / 4);
    this.timeInit = timeInit;
    this.timeLimit;
    this.objects = new Array(); //arreglo de tracked blobs
  }
  objMax() {
    return this.objMax;
  }
  timeInit() {
    return this.timeInit;
  }
  timeLimit() {
    return this.timeLimit;
  }

  insert(tb) {
    let i = 0;
	tb.setDelay(this.timeInit);//Scene se encarga de setear al nuevo tb el delay inicial, que es igual al comienzo de la escena
    while ((this.objects.length < this.objMax) && i < tb.blobs.length) {
      tb.blobs[i].setTime(tb.delay);
      this.quadtree.insert(tb.blobs[i]);
      if (tb.blobs[i].collision) { //al insert en el quadtree hay que agregar si hay o no colision
        let j = i;
        while (j >= 0) {
          this.quadtree.drop(tb.blobs[j]);
          let x = (tb.blobs[j].time - tb.delay);
          tb.blobs[j].setTime(x);
          j--;
        }
        tb.setDelay(100);
        i = 0;
      } else {
        i++;
      }


      this.objects.push(tb);
      return true;
    }
    return false; //Devuelve si la cantidad de objetos excede la capacidad de la escena
  }
  
  sortScene(){

	  this.objects.sort(function(a,b){
		  return -b.blobs[b.blobs.length - 1].time + +a.blobs[a.blobs.length - 1].time;
	  });
  }
  
  
  getSceneTime() { //Devuelve la duracion maxima de la escena
	for (let i = 0; i < this.objects.length; i++) {
		this.objects[i].sortTBlob();
      }
	this.sortScene();
	let tbMax=this.objects[this.objects.length - 1];
    return tbMax.getMaxTime();
  }
}

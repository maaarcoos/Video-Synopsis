class TrackedBlob{
	constructor(blobs,delay){
		this.delay = delay;
		this.blobs=blobs;
	}
	getTimeIndex(index){
		return blobs[index].time + delay;
	}
	setDelay(lag){
		this.delay=this.delay + lag;
	}
}


class Tuple {
  constructor(blob, time) { //time  - blob contiene el blob en cuestion
    this.blob = blob;
    this.time = time;
	this.collision=false;
  }

  setTime(delay) {
    this.time = this.time + delay;
  }
  similarTime(obj, margin) {//compara el tiempo entre dos blobs
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
    this.height = h;
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
  getHeight() {
    return this.height;
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
  setHeight(newH) {
    this.height = newH;
  }
  contains(obj) { //contiene al menos la mitad del objeto en cuestion
    return ((obj.getX() + (obj.getWidth()) / 2 <= this.x + this.width) &&
      (obj.getY() + (obj.getHeight()) / 2 <= this.y + this.height) &&
      (obj.getX() + (obj.getWidth()) / 2 >= this.x - this.width) &&
      (obj.getY() + (obj.getHeight()) / 2 >= this.y - this.height));
  }
}

class Frame{
  constructor(x, y, w, h, id, time, resWidth, resHeigth) {
    this.x = (resWidth * x) / 100;
    this.y = (resHeigth * y) / 100;
    this.width = (resWidth * w) / 100;
    this.heigth = (resHeigth * h) / 100;
    this.id = id;
    this.time = time;
  }

  overlap(obj) { //se fija si se solapan al menos en un cuarto de cada uno
    return ((obj.x + (obj.width) / 4 <= this.x + this.width) &&
      (obj.y + (obj.height) / 4 <= this.y + this.height) &&
      (obj.x + (obj.width) / 4 >= this.x - this.width) &&
      (obj.y + (obj.height) / 4 >= this.y - this.height));
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
    let subHeight = this.bounds.height / 2;
    let x = this.bounds.x;
    let y = this.bounds.y;

    this.child0 =
      new Quadtree(new Rectangle(x, y, subWidth, subHeight), this.maxObjects); //hijo0
    this.child1 =
      new Quadtree(new Rectangle(x + subWidth, y, subWidth, subHeight), this.maxObjects); //hijo1
    this.child2 =
      new Quadtree(new Rectangle(x, y + subHeight, subWidth, subHeight), this.maxObjects); //hijo2
    this.child3 =
      new Quadtree(new Rectangle(x + subWidth, y + subHeight, subWidth, subHeight), this.maxObjects); //hijo3
    this.splited = true;
  }

  retrieve() {
    while (this.objects.length != 0) {
      let obj = this.objects.pop();
      if (this.child0.insert(obj)) {} 
	  else if (this.child1.insert(obj)) {} 
	  else if (this.child2.insert(obj)) {} 
	  else if (this.child3.insert(obj)) {}
    }
  }

  collide(obj) {
    for (let i = 0;i<this.objects.length;i++) {
		if (obj.blob.overlap(this.objects[i]) &&
			obj.similarTime(this.objects[i],100) &&
			obj.blob.id != this.objects[i].blob.id) {
			//console.log("Colision entre " + obj + " y " + this.objects[i]);
			//console.log("X: "+obj.getX()+ " Y: "obj.getY()+" Width: "+obj.getWidth()+" Heigth: "+obj.getHeigth());
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
				if(this.collide(obj))
				{	
					obj.collision=true;
				}
				else{
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
  getNeighbors() {
    return this.objects;
  }
}

class Scene {
  constructor(objMax, widthMax, hightMax, timeInit) {
    this.objMax = objMax;
    this.bounds = new Reactangle(0, 0, widthMax, hightMax);
    this.quadtree = new Quadtree(bounds, objMax / 4);
    this.timeInit = timeInit;
    this.timeLimit;
    this.objects = new Array();
  }
  objMax() {
    return objMax;
  }
  timeInit() {
    return timeInit;
  }
  timeLimit() {
    return timeLimit;
  }
  
  insert(tb) {
    if (objects.length < ObjMax) {
		let i=0;
		while(i<tb.blobs.length){
			tb.blobs[i].setTime(tb.delay);
			quadtree.insert(tb.blobs[i]);
			if (tb.blobs[i].collision) { //al insert en el quadtree hay que agregar si hay o no colision
				let j=i;
				while(j<=0){
					tb.blobs[j].setTime(tb.blobs[j].time - tb.delay);
					j--;
				}
				tb.setDelay(100);
				i=0;
			}
			else 
			{
				i++;
			}
		}
			
		this.objects.push(tb);	
		return true;
	}
	else return false;//Devuelve si la cantidad de objetos excede la capacidad de la escena
  }
}


class Tuple {
	constructor(blob, time){//time debe ser de tipo date - blob contiene el blob en cuestion
		this.blob=blob;
		this.time=time;

	}
	blob(){
		return blob;
	}
	time(){
		return time;
	}
	setTime(milis){
		this.time.setMilliseconds(milis);
	}

}


class Rectangle {//el primero se inicializara con (0,0,800,400)
	constructor(x,y,w,h){
		this.x=x;
		this.y=y;
		this.width=w;
		this.height=h;
	}
	x(){
		return this.x;
	}
	y(){
		return this.y;
	}
	width(){
		return this.width;
	}
	height(){
		return this.height;
	}
	setX(newx){
		this.x=newx;
	}
	setY(newY){
		this.y=newY;
	}
	setWidth(newW){
		this.width=newW;
	}
	setHeight(newH){
		this.height=newH;
	}
	contains(obj){//contiene al menos la mitad del objeto en cuestion
		return((obj.x + (obj.width)/2 <= this.x + this.width) &&
			(obj.y + (obj.height)/2 <= this.y + this.height) &&
			(obj.x + (obj.width)/2 >= this.x - this.width) &&
			(obj.y + (obj.height)/2 >= this.y - this.height));
	}
}

class Quadtree {
	constructor(bounds, maxObj){//Recibe un rectangulo que delimita al quad y la cantidad max de objetos;
		this.objects= new Array();
		this.bounds=bounds;
		this.maxObjects= maxObj;//cantidad max de objetos por quad -> es distinto a la cantidad max de objetos por escena
		this.splited=false;
		}
	split(){//divide el quadtree en 4 quadtree (4 nodos mas en el arbol que se ubican en el proximo nivel del arbol)
		var subWidth = this.bounds.width / 2;
		var subHeight = this.bounds.height / 2;
		var x=this.bounds.x;
		var y=this.bounds.y;

		this.child0= new Quadtree(new Rectangle(x, y, subWidth, subHeight), this.maxObjects);//hijo0
		this.child1= new Quadtree(new Rectangle(x + subWidth,y,subWidth, subHeight), this.maxObjects);//hijo1
		this.child2= new Quadtree(new Rectangle(x, y + subHeight, subWidth, subHeight), this.maxObjects);//hijo2
		this.child3= new Quadtree(new Rectangle(x + subWidth, y + subHeight, subWidth, subHeight), this.maxObjects);//hijo3
		this.splited=true;
	}

	retrieve(){
		while(this.objects.length != 0){
			var obj=this.objects.pop();
			if(this.child0.insert(obj)){}
			else if(this.child1.insert(obj)){}
			else if(this.child2.insert(obj)){ }
			else if(this.child3.insert(obj)){ }
		}
	}


	insert(obj){
		if(!this.bounds.contains(obj)){//Si no lo puede contener al objeto por lo limites, retorna false
			return false;
		}else{

			if(this.objects.length<this.maxObjects && !this.splited){//Si la cantidad de objetos no excede la cantidad maxima permitida de objetos, inserta y ademas si aun no esta dividido
				this.objects.push(obj);
				return true;
			}
			else{

				if(!this.splited){//Si no esta dividido, lo divide
					this.split();
					this.retrieve();}//Como se dividio se debe insertar sus objetos en sus hijos
				if(this.child0.insert(obj)){return true;}//Se fija si alguno lo puede contener al objeto actual
				else
						if(this.child1.insert(obj)){return true;}
				else
						if(this.child2.insert(obj)){return true;}
				else
						if(this.child3.insert(obj)){return true;}

			}
	}

}
}

class Scene{
	constructor(objMax,widthMax,hightMax,timeInit){
		this.objMax=objMax;
		this.bounds=new Reactangle(0,0,widthMax,hightMax);
		this.quadtree= new Quadtree(bounds,objMax/4);
		this.timeInit=timeInit;
		this.timeLimit;
		this.objects=new Array();
	}
	objMax(){
		return objMax;
	}
	timeInit(){
		return timeInit;
	}
	timeLimit(){
		return timeLimit;
	}
	insert(obj){
		if(objects.length < ObjMax){
			var tuple = new Tuple(obj,timeInit);
			if(quadtree.insert(obj)){//al insert en el quadtree hay que agregar si hay o no colision
				objects.push(obj);
			}
			return true;
		}
		else return false;
	}
}

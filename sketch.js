/*let color = 255;
let i = 0;
let width = 800
let heigth = 400

function setup() {
  createCanvas(width, heigth);
  background(0);
  let bo = new Rectangle(0, 0, 800, 400);
  //let blobs = new Array();
  quad = new Quadtree(bo, 2);
  //console.log(tuplas);
  //  console.log("cat");
  //console.log(quad);
}

function draw() {
  //Draw the quadtree
  show(quad, 0);

}

function show(quadtree, level) {
  stroke(255);
  noFill();
  strokeWeight(2);
  rectMode(CORNER);
  rect(quadtree.bounds.x, quadtree.bounds.y, quadtree.bounds.width, quadtree.bounds.height);
  //console.log("Nivel: "+ level + " pos x*w y*h*" + quadtree.bounds.x*quadtree.bounds.width + "," + quadtree.bounds.y*quadtree.bounds.height);
  if (quadtree.splited) {
    show(quadtree.child0, level++);
    show(quadtree.child1, level++);
    show(quadtree.child2, level++);
    show(quadtree.child3, level++);
  }
}

function mousePressed() {
  console.clear();
  for (let j = mouseX; j < width; j += 50) {
    nrect = new Rectangle(j, mouseY + Math.random() * 10, 40, 50);
    quad.insert(nrect);
    stroke(255, 0, 0);
    noFill();
    strokeWeight(1);
    rectMode(CORNER);
    rect(nrect.x, nrect.y, 40, 50);
    text(i, nrect.x, nrect.y);
  }
  rect(mouseX, mouseY, 40, 50);
  //console.log(quad);
  i++;

}
*/
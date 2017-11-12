
edgemode = "lines";
curveRes = 50;
edgeVertSize = 5;
$( document ).ready(function() {
	edges = [];
	$("#new-edge").on("click", function(){
		createEdge();
	})

	createEdge();
    
    loop();

    
});	



function createEdge(){

	var canvas = document.createElement('canvas');

	canvas.id = "edge-"+ edges.length;

	canvas.width = 300;
	canvas.height = 200;
	canvas.classList.add('edge');


	var edgesDiv = $("#edges")[0];
	edgesDiv.appendChild(canvas);

    var ctx = canvas.getContext('2d');	
    var obj; 
    if(edgemode == "lines"){
    	obj = new edge(ctx, canvas, edgeVertSize);
    }
    if(edgemode == "curves"){
    	obj = new bezierEdge(ctx, canvas, curveRes);
    }
    

    edges.push(obj);





    $(canvas).on("mousedown", function(event){
    	var ind = $(this).attr("id").split("-")[1];
		ind = parseInt(ind);
		var edge = edges[ind];    	
		var rect = event.target.getBoundingClientRect();
	  
		x =  event.clientX - rect.left
		y = event.clientY - rect.top
	   	edge.handleMouseDown(x,y);
		
    })
    $(canvas).on("mouseup", function(event){
    	var ind = $(this).attr("id").split("-")[1];
		ind = parseInt(ind);
		var edge = edges[ind];   

		var rect = event.target.getBoundingClientRect();
	  
		x =  event.clientX - rect.left
		y = event.clientY - rect.top
	   	edge.handleMouseUp(x,y);

	   	puzz.setEdges(edges);
		
    })
    $(canvas).on("mousemove", function(event){
    	var ind = $(this).attr("id").split("-")[1];
		ind = parseInt(ind);
		var edge = edges[ind];   

		var rect = event.target.getBoundingClientRect();
	  
		x =  event.clientX - rect.left
		y = event.clientY - rect.top
	   	edge.handleMouseMove(x,y);
		
    })



}
    

function bezierEdge(ctx, elem, pieces){
	this.ctx = ctx;
	this.elem = elem;
	this.radius = 7.0;
	this.vertices = [];
	this.controlPoints = [];
	this.selectedInd = undefined;
	
    for(var i =0 ; i < 7; i++){

    	var x = -1 + 2 / (7-1) * i;
    	var y = 0;
    	this.controlPoints.push({x:x, y:y});
    }

    this.distance = function(a,b, c,d){
    	return Math.sqrt((a-c)*(a-c) + (b-d)*(b-d));
    }
    this.handleMouseDown = function(x,y){

		w = this.elem.width;
		h = this.elem.height;
		centerx = w/2;
	    centery = h/2;
    	for(var i = 0 ; i < this.controlPoints.length; i++){
    		var vert = this.controlPoints[i];
    		var vertx = vert.x * centerx + centerx;
    		var verty = vert.y * centery + centery;
    		if(this.distance(x,y, vertx, verty) < this.radius && i != 0 && i != this.controlPoints.length -1){
    			this.selectedInd = i;
    		}
    	}
    }
    this.handleMouseUp = function(x,y){

    	this.selectedInd = undefined;

    }
    this.handleMouseMove = function(x,y){
    	w = this.elem.width;
		h = this.elem.height;
		centerx = w/2;
	    centery = h/2;


    	if(this.selectedInd != undefined){

    		this.controlPoints[this.selectedInd].x = (x - centerx)/centerx;
    		this.controlPoints[this.selectedInd].y = (y - centery)/centery;
    	}
    	this.calculateVertices();
    }
    this.drawLine = function(){
    	
	    w = this.elem.width;
	    h = this.elem.height;
	    centerx = w/2;
	    centery = h/2;
		
		var x = this.vertices[0].x * centerx + centerx;
	    var y = this.vertices[0].y * centery + centery;

	    this.ctx.beginPath();
		this.ctx.moveTo(x,y);


	    for(var i = 1; i < this.vertices.length; i++){
	    	var x = this.vertices[i].x  * centerx + centerx;
	    	var y = this.vertices[i].y  * centery + centery;
	    	
	    	this.ctx.lineTo(x,y);
	    }

	    this.ctx.stroke();
    }
    this.drawVertices = function(){
    	
    	for(var i = 0; i < this.controlPoints.length; i++){
    		if(i == 0 || i == this.controlPoints.length-1 ){
    			continue;
    		}
	    	var x = this.controlPoints[i].x  * centerx + centerx;
	    	var y = this.controlPoints[i].y  * centery + centery;
	    	
	    	this.ctx.beginPath();
	    	this.ctx.arc(x,y,this.radius,0,2*Math.PI);
	    	this.ctx.fillStyle = 'green';
			this.ctx.fill();
			this.ctx.lineWidth = 2;
			this.ctx.strokeStyle = '#001100';
			
			this.ctx.stroke()
	    }
    }
	this.draw  = function() {
		this.ctx.clearRect(0, 0, this.elem.width, this.elem.height);
	    this.drawLine();
	    this.drawVertices();
	}		
	this.calculateVertices = function(){
		this.vertices = [];
		for(var i =0 ; i < this.controlPoints.length - 1; i = i + 3){
			console.log(i + " out of " + this.controlPoints.length)
			var p1 = this.controlPoints[i];
			var p2 = this.controlPoints[i+1]
			var p3 = this.controlPoints[i+2];
			var p4 = this.controlPoints[i+3];

			console.log(p1)
			console.log(p2)
			console.log(p3)
			console.log(p4)

			for(var j = 0; j < curveRes/2; j++){
				var t = j;

				if(t > curveRes/2 ){
					t = t - curveRes/2;
				}
				t = t / (curveRes/2 - 1);

				var x = Math.pow((1-t),3) *  p1.x
					+3 * t * Math.pow((1-t), 2) * p2.x
					+3 * Math.pow(t, 2) * (1-t)*p3.x
					+ Math.pow(t,3) * p4.x

				var y = Math.pow((1-t),3) *  p1.y
					+3 * t * Math.pow((1-t), 2) * p2.y
					+3 * Math.pow(t, 2) * (1-t)*p3.y
					+ Math.pow(t,3) * p4.y
				this.vertices.push({x:x, y:y});

			}
			
		}
	}
	this.calculateVertices();
}




function edge(ctx, elem, pieces){
	this.ctx = ctx;
	this.elem = elem;
	this.radius = 7.0;
	this.vertices = []
	this.selectedInd = undefined;
	
    for(var i =0 ; i < pieces; i++){

    	var x = -1 + 2 / (pieces-1) * i;
    	var y = 0;
    	this.vertices.push({x:x, y:y});
    }
    this.distance = function(a,b, c,d){
    	return Math.sqrt((a-c)*(a-c) + (b-d)*(b-d));
    }
    this.handleMouseDown = function(x,y){

		w = this.elem.width;
		h = this.elem.height;
		centerx = w/2;
	    centery = h/2;
    	for(var i = 0 ; i < this.vertices.length; i++){
    		var vert = this.vertices[i];
    		var vertx = vert.x * centerx + centerx;
    		var verty = vert.y * centery + centery;
    		if(this.distance(x,y, vertx, verty) < this.radius && i != 0 && i != this.vertices.length -1){
    			this.selectedInd = i;
    		}
    	}
    }
    this.handleMouseUp = function(x,y){

    	this.selectedInd = undefined;

    }
    this.handleMouseMove = function(x,y){
    	w = this.elem.width;
		h = this.elem.height;
		centerx = w/2;
	    centery = h/2;


    	if(this.selectedInd != undefined){

    		this.vertices[this.selectedInd].x = (x - centerx)/centerx;
    		this.vertices[this.selectedInd].y = (y - centery)/centery;
    	}
    }
    this.drawLine = function(){
    	
	    w = this.elem.width;
	    h = this.elem.height;
	    centerx = w/2;
	    centery = h/2;
		
		var x = this.vertices[0].x * centerx + centerx;
	    var y = this.vertices[0].y * centery + centery;

	    this.ctx.beginPath();
		this.ctx.moveTo(x,y);


	    for(var i = 1; i < this.vertices.length; i++){
	    	var x = this.vertices[i].x  * centerx + centerx;
	    	var y = this.vertices[i].y  * centery + centery;
	    	
	    	this.ctx.lineTo(x,y);
	    }

	    this.ctx.stroke();
    }
    this.drawVertices = function(){
    	
    	for(var i = 0; i < this.vertices.length; i++){
    		if(i == 0 || i == this.vertices.length-1 ){
    			continue;
    		}
	    	var x = this.vertices[i].x  * centerx + centerx;
	    	var y = this.vertices[i].y  * centery + centery;
	    	
	    	this.ctx.beginPath();
	    	this.ctx.arc(x,y,this.radius,0,2*Math.PI);
	    	this.ctx.fillStyle = 'green';
			this.ctx.fill();
			this.ctx.lineWidth = 2;
			this.ctx.strokeStyle = '#001100';
			
			this.ctx.stroke()
	    }
    }
	this.draw  = function() {
		this.ctx.clearRect(0, 0, this.elem.width, this.elem.height);
	    this.drawLine();
	    this.drawVertices();
	}		

}

function loop(){
	for(var i = 0; i < edges.length ; i++){
		edges[i].draw();
	}
	//
	setTimeout(loop, 50);

}

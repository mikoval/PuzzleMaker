

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
    var obj = new edge(ctx, canvas, edgeVertSize);

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

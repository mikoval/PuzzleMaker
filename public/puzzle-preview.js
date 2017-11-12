DIMENSIONS = 3;
$( 
	document ).ready(function() {
	canvas = document.createElement('canvas');

	canvas.id = "puzzle-preview-obj"

	canvas.width = 600;
	canvas.height = 600;
	canvas.classList.add('puzzle');


	var puzzleDiv = $("#puzzle-preview")[0];
	puzzleDiv.appendChild(canvas);

	puzz = new puzzle(DIMENSIONS, null, canvas);
	puzz.draw();

});	

function puzzle(dimensions, edges, canvas){

	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');	
	this.pieces = createGrid(dimensions);



	var pieceWidth = canvas.width / dimensions;
	var pieceHeight = canvas.height/dimensions;
	for(var i = 0; i < this.pieces.length; i++)
	{
		for(var j = 0; j < this.pieces[0].length; j++){
			var x=  i * pieceWidth + pieceWidth /2
			var y = j * pieceHeight + pieceHeight /2
			var p = new piece(x, y ,pieceWidth, pieceHeight, edgeVertSize,   this.ctx);
			this.pieces[i][j]= p;
		}
	}
	this.draw = function(){
		this.ctx.fillStyle = 'white';
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
		
		var img=document.getElementById("img");
    	this.ctx.drawImage(img,0,0, this.canvas.width, this.canvas.height);

		//this.pieces[1][0].draw();
		for(var i = 0; i < this.pieces.length; i++){
			for(var j = 0; j < this.pieces.length; j++){
				this.pieces[i][j].draw();
			}
		}
	}

	this.getPieces = function(){
		var ret = [];

		for(var i =0 ; i < this.pieces.length; i++){
			for(var j =0 ; j < this.pieces[0].length; j++){
				ret.push(this.pieces[i][j].getVerts());
			}
		}
		return ret;
	}

	this.setEdges = function(edges){
		
		for (var i = 0; i < this.pieces.length; i++){
			for (var j = i%2; j < this.pieces.length; j+=2){
				if (i != 0) {

					this.edges = edges;
					var edgeIndex = Math.floor(Math.random() * this.edges.length);
					var edgeVerts = this.edges[edgeIndex].vertices;

					this.pieces[i][j].setLeftEdge(edgeVerts);
					this.pieces[i-1][j].setRightEdge(edgeVerts);

				};
				if (i != this.pieces.length - 1) {

					this.edges = edges;
					var edgeIndex = Math.floor(Math.random() * this.edges.length);
					var edgeVerts = this.edges[edgeIndex].vertices;

					this.pieces[i][j].setRightEdge(edgeVerts);
					this.pieces[i+1][j].setLeftEdge(edgeVerts);

				};

				if (j != 0) {

					this.edges = edges;
					var edgeIndex = Math.floor(Math.random() * this.edges.length);
					var edgeVerts = this.edges[edgeIndex].vertices;

					this.pieces[i][j].setTopEdge(edgeVerts);
					this.pieces[i][j-1].setBottomEdge(edgeVerts);

				};
				if (j != this.pieces.length - 1) {

					this.edges = edges;
					var edgeIndex = Math.floor(Math.random() * this.edges.length);
					var edgeVerts = this.edges[edgeIndex].vertices;

					this.pieces[i][j].setBottomEdge(edgeVerts);
					this.pieces[i][j+1].setTopEdge(edgeVerts);

				};

			}
		}

		this.draw();

		
	}
}

function piece(x,y, width, height, vertices, ctx){
	this.position = {x:x, y:y};
	this.ctx = ctx;
	this.left = [];
	this.top = [];
	this.right = [];
	this.bottom = [];
	this.width = width;
	this.height = height;
	this.vertices = vertices;

	this.setLeftEdge = function(edgeVerts){

		for (var i = 0; i < this.left.length; i++){


			var vert = edgeVerts[this.left.length - i -1];
			var newVert = {x : vert.y, y:-vert.x};
			this.left[i].x = newVert.x * this.width/2;
			this.left[i].y = newVert.y * this.height/2;
			this.left[i].x -=this.width/2;

		}
	}

	this.getVerts = function(){
		var verts = [];


		for (var i = 0; i < this.left.length; i++){

			var x = this.left[i].x / (this.width/2); 
			var y = this.left[i].y / (this.height/2); 
			x = x.toFixed(2);
			y = y.toFixed(2); 
			x = parseFloat(x)
			y = parseFloat(y)
			verts.push( {x: x, y:y });
		};
		
		for (var i = 0; i < this.bottom.length; i++){
			var x = this.bottom[i].x / (this.width/2); 
			var y = this.bottom[i].y / (this.height/2); 
			x = x.toFixed(2);
			y = y.toFixed(2); 
			x = parseFloat(x)
			y = parseFloat(y)
			verts.push( {x: x, y:y });
		};
		for (var i = 0; i < this.right.length; i++){
			var x = this.right[i].x / (this.width/2); 
			var y = this.right[i].y / (this.height/2); 
			x = x.toFixed(2);
			y = y.toFixed(2); 
			x = parseFloat(x)
			y = parseFloat(y)
			verts.push( {x: x, y:y });
		}
		for (var i = 0; i < this.top.length; i++){
			var x = this.top[i].x / (this.width/2); 
			var y = this.top[i].y / (this.height/2); 
			x = x.toFixed(2);
			y = y.toFixed(2); 

			x = parseFloat(x)
			y = parseFloat(y)
			verts.push( {x: x, y:y });
		}
		return verts;
	}
	this.setRightEdge = function(edgeVerts){

		for (var i = 0; i < this.right.length; i++){


			var vert = edgeVerts[i];
			var newVert = {x : vert.y, y:-vert.x};
			this.right[i].x = newVert.x * this.width/2;
			this.right[i].y = newVert.y * this.height/2;
			this.right[i].x +=this.width/2;

		}
	}


	this.setTopEdge = function(edgeVerts){

		for (var i = 0; i < this.top.length; i++){


			var newVert = edgeVerts[this.top.length - i -1];

			this.top[i].x = newVert.x * this.width/2;
			this.top[i].y = newVert.y * this.height/2;
			this.top[i].y -=this.height/2;
		}
	}


	this.setBottomEdge = function(edgeVerts){

		for (var i = 0; i < this.bottom.length; i++){


			var newVert = edgeVerts[i];

			this.bottom[i].x = newVert.x * this.width/2;
			this.bottom[i].y = newVert.y * this.height/2;
			this.bottom[i].y +=this.height/2;

		}
	}

	this.initEdges = function(){
		//left

		for (var i = 0; i < this.vertices; i++){
			var y = -(height/2) * (1-(i/(vertices - 1))) + height/2 * (i/(vertices-1));
			var x = -width/2;
			this.left.push({x:x, y:y});
		}

		for (var i = 0; i < this.vertices; i++){
			var y = (height/2) * (1-(i/(vertices - 1))) - height/2 * (i/(vertices-1));
			var x = width/2;
			this.right.push({x:x, y:y});
		}
		
		for (var i = 0; i < this.vertices; i++){
			var y = -height/2;
			var x = (width/2) * (1-(i/(vertices - 1))) - width/2 * (i/(vertices-1));
			this.top.push({x:x, y:y});
		}

		for (var i = 0; i < this.vertices; i++){
			var y = height/2;
			var x = -(width/2) * (1-(i/(vertices - 1))) + width/2 * (i/(vertices-1));
			this.bottom.push({x:x, y:y});
		}
		

		

	}
	this.draw = function(){
		var x = this.position.x;
		var y = this.position.y;
		//ORDER MATTERS otherwise will draw diagonal lines
		this.ctx.beginPath(this.left[0].x + x, this.left[0].y + y);
		for (var i = 0; i < this.left.length; i++){
			//console.log("X: " + (this.left[i].x + x) + ", Y: " + (this.left[i].y + y ) )
			this.ctx.lineTo(this.left[i].x + x, this.left[i].y + y);
		};
		
		for (var i = 0; i < this.bottom.length; i++){
			//console.log("X: " + (this.bottom[i].x + x) + ", Y: " + (this.bottom[i].y + y ))
			this.ctx.lineTo(this.bottom[i].x + x, this.bottom[i].y + y);
		};
		for (var i = 0; i < this.right.length; i++){
			//console.log("X: " +( this.right[i].x + x) + ", Y: " + (this.right[i].y + y) )
			this.ctx.lineTo(this.right[i].x + x, this.right[i].y + y);
		};
		for (var i = 0; i < this.top.length; i++){
			//console.log("X: " + (this.top[i].x + x) + ", Y: " + (this.top[i].y + y) )
			this.ctx.lineTo(this.top[i].x + x, this.top[i].y + y);
		};
		this.ctx.stroke();
	}
	this.initEdges();

}
function createGrid(x){
	var arr = [];
	for(var i = 0; i < x; i++){
		arr.push(new Array(x));
	}

	return arr;
}
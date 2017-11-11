$( document ).ready(function() {
	var canvas = document.createElement('canvas');

	canvas.id = "puzzle-preview-obj"

	canvas.width = 600;
	canvas.height = 600;
	canvas.classList.add('puzzle');


	var puzzleDiv = $("#puzzle-preview")[0];
	puzzleDiv.appendChild(canvas);

	puzzle = new puzzle(3, null, canvas);
	puzzle.draw();

});	


function puzzle(dimensions, edges, canvas){

	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');	
	this.pieces = createGrid(dimensions, dimensions);


	var pieceWidth = canvas.width / dimensions;
	var pieceHeight = canvas.height/dimensions;
	for(var i = 0; i < this.pieces.length; i++)
	{
		for(var j = 0; j < this.pieces[0].length; j++){
			var x=  i * pieceWidth + pieceWidth /2
			var y = j * pieceHeight + pieceHeight /2
			var p = new piece(x, y ,pieceWidth, pieceHeight, 5,   this.ctx);
			this.pieces[i][j]= p;
		}
	}
	this.draw = function(){
		this.ctx.fillStyle = 'white';
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
		


		for(var i = 0; i < this.pieces.length; i++){
			for(var j = 0; j < this.pieces.length; j++){
				this.pieces[i][j].draw();
			}
		}
	}
}

function piece(x,y, width, height, vertices, ctx){
	this.position = {x:x, y:y};
	this.ctx = ctx;
	this.left = {};
	this.top = {};
	this.right = {};
	this.bottom = {};
	this.width = width;
	this.height = height;
	this.initEdges = function(){

	}
	this.draw = function(){
		var x = this.position.x - 10;
		var y = this.position.y - 10;
		
		ctx.fillStyle = 'green';
		ctx.fillRect(x,y,20,20);
	}
	this.initEdges();

}
function createGrid(x,y){
	var arr = [];
	for(var i = 0; i < x; i++){
		arr.push(new Array(y));
	}
	return arr;
}
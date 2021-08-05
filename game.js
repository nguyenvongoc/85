var CELL_SIZE = 10;
var FPS = 10    ;
var WIDTH = 400;
var HEIGHT = 400;
let score=0;
function Game(canvas_id){
    var _pressedKey;
    var _cols = WIDTH/CELL_SIZE;
    var _rows = HEIGHT/CELL_SIZE;
    var _snake = new Snake(_cols,_rows);
 
    var _canvas = document.getElementById(canvas_id);
    var _context = _canvas.getContext('2d');
    _context.fillStyle = "black";
 
    var _food = {};
    var _running = false;
    var _timer;
 
    this.init = function() {
        _canvas.width = WIDTH;
        _canvas.height = HEIGHT;
 
        _canvas.onkeydown = function(e) {
            e.preventDefault();
            if(e.keyCode == 13) 
            {
                if(!_running)
                    startGame();
            }
            else if(_running)
            {
                _pressedKey = e.keyCode;
            }
        };
 
       
        _context.textAlign = "center";
       
        _context.font = "16px Arial";
        _context.fillText(" Enter to Start Game",WIDTH/2,HEIGHT/2);
 
    }
 
    function startGame() {
        _pressedKey = null;
        clearInterval(_timer);
        _snake.init();
        createFood();
        _running = true;
        _timer = setInterval(update,1000/FPS);
 
    }
 
    function update() {
        if(!_running)
            return;
 
        _snake.handleKey(_pressedKey);
        var ret = _snake.update(_food);
 
        if(ret==1)
        {
            createFood();
        }else if(ret==2) {
          
            _running = false;
            _context.save();
            _context.fillStyle = "rgba(0,0,0,0.2)";
            _context.fillRect(0,0,WIDTH,HEIGHT);
            _context.restore();
            _context.fillText("You Die,Enter to Restart",WIDTH/2,HEIGHT/2);
            let maxscore= localStorage.getItem('score');
            if(maxscore<score){
                localStorage.setItem('score',score);
            }
            let max=localStorage.getItem('score');
            document.getElementById('maxscore').innerHTML=max;
            score=0;
            return;
        }
 
        draw();
    }
    function draw(){
 
        _context.beginPath();
        _context.clearRect(0,0,WIDTH,HEIGHT);
        _context.fill();
 
        _snake.draw(_context);
        
        _context.beginPath();
        _context.arc((_food.x*CELL_SIZE)+CELL_SIZE/2, (_food.y*CELL_SIZE)+CELL_SIZE/2, CELL_SIZE/2, 0, Math.PI*2, false);
        _context.fill();
    }
 
    function createFood() {
        var x = Math.floor(Math.random()*_cols);
        var y;
        do {
            y = Math.floor(Math.random()*_rows);
        } while(_snake.collide(x, y));
 
        _food = {x: x, y: y};
    }
 
}
function Snake(mapCols,mapRows){
 
    var LEFT = 0, UP = 1, RIGHT = 2, DOWN = 3;
 
    var direction; 
    var data; 
 

    this.init = function(){
        var x = 3;
        var y = 0;
        data = [
            {x: x, y: y},
            {x: x-1, y: y},
            {x: x-2, y: y}
        ];
        direction = RIGHT;
    };
    this.handleKey = function(key){
      
        if(key >= 37 && key <=40)
        {
            var newdir = key - 37;
            if(Math.abs(direction-newdir)!=2) 
                direction = newdir;
        }
    };
    this.draw = function(ctx) {
        for(var i = 0;i < data.length; i++)
            ctx.fillRect(data[i].x*CELL_SIZE, data[i].y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
    };
 
    this.update = function(food){
        var x = data[0].x;
        var y = data[0].y;
 
        switch(direction) {
            case LEFT:
                x--; break;
            case UP:
                y--; break;
            case RIGHT:
                x++; break;
            case DOWN:
                y++; break;
        }
 
     
        if(x == food.x && y == food.y)
        {
            score++;
            data.unshift(food);
            return 1;
        }
        document.getElementById('score').innerHTML=score;
       
        if(this.collide(x,y))
            return 2;
       
        data.unshift({x:x, y:y});
    
        data.pop();
       
        return 0;
    };
 
    this.collide = function(x, y) {
 
        if(x < 0 || x > mapCols-1)
            return true;
 
        if(y < 0 || y > mapRows-1)
            return true;
 
        for(var i = 0; i<data.length; i++) {
            if(x == data[i].x && y == data[i].y)
                return true;
        }
        return false;
    }
}
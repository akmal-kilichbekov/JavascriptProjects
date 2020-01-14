var myGamePiece;
var myObstacle = [];
var myScore, myBackground, mySound, myMusic;

function startGame() {
    myGamePiece = new component(40, 40, "images/right.png", 10, 120, "image");
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myBackground = new component(656, 270, "/images/sky.jpg", 0, 0, "background");
    mySound = new sound("/sounds/ant.mp3");
    myMusic = new sound("/sounds/avengers.mp3");
    myMusic.play();
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (event) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[event.keyCode] = true; //(event.type == 'keydown');
        });
        window.addEventListener('keyup', function (event) {
            myGameArea.keys[event.keyCode] = false; //(event.type == 'keydown');
        });
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
};

function everyinterval(n) {
    if((myGameArea.frameNo / n) % 1 == 0){
        return true;
    }
    return false;
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        if(this.type == "text"){
          ctx.font = this.width + " " + this.height;
          ctx.fillStyle = color;
          ctx.fillText(this.text, this.x, this.y);
        }
        else if(this.type == "image" || this.type == "background"){
           ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
           if (this.type == "background"){
               ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
           }
        }
        else{
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

    };
    this.newPos = function () {
      this.x += this.speedX;
      this.y += this.speedY;
      this.border();
      if (this.type == "background") {
            if (this.x == -(this.width)) {
                this.x = 0;
            }
      }

    };
    this.border = function () {
        if(this.y < 0 && this.type == "image"){
            this.y = 0;
        }
        if(this.x < 0 && this.type == "image"){
            this.x = 0;
        }
        if(this.y > (myGameArea.canvas.height - this.height) && this.type == "image"){
            this.y = 20;//myGameArea.canvas.height - this.height;
        }
        if(this.x > (myGameArea.canvas.width - this.width) && this.type == "image"){
            this.x = 20;// myGameArea.canvas.width - this.width;
        }
    };
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    };
}

function updateGameArea() {
    myGameArea.clear();
    myBackground.speedX = -1;
    myBackground.newPos();
    myBackground.update();
    keyPress();
    checkEveryObstacle();
    frameScore();
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();

}

function keyPress() {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {
        myGamePiece.image.src = "/images/left.png";
        myGamePiece.speedX = -8;
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
        myGamePiece.image.src = "/images/right.png";
        myGamePiece.speedX = 8;
    }
    if (myGameArea.keys && myGameArea.keys[38]) {
        myGamePiece.image.src = "/images/up.png";
        myGamePiece.speedY = -8;
    }
    if (myGameArea.keys && myGameArea.keys[40]) {
        myGamePiece.image.src = "/images/down.png";
        myGamePiece.speedY = 8;
    }
}

function checkEveryObstacle() {
    for(var i = 0; i < myObstacle.length; i++){
        if(myGamePiece.crashWith(myObstacle[i])){
            mySound.play();
            myMusic.stop();
            myGameArea.stop();
            return;
        }
    }
}

function frameScore() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    myGameArea.frameNo += 1;

    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacle.push(new component(10, height, "green", x, 0));
        myObstacle.push(new component(10, x - height - gap, "blue", x, height + gap));
    }

    for(var i = 0; i < myObstacle.length; i++){
        myObstacle[i].speedX = -1;
        myObstacle[i].newPos();
        myObstacle[i].update();
    }
    myScore.text = "SCORE: " + myGameArea.frameNo;
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    };
    this.stop = function () {
        this.sound.pause();
    };
}


startGame();
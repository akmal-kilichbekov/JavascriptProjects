const STATES = {
    PAUSE: 0,    
    RUNNING: 1,
    GAMEOVER: 2,
    WIN: 3
}
const GAME_HEIGHT = 600;
const GAME_WIDTH = 800;
let canvas = document.getElementById("canvasScreen");
let ctx = canvas.getContext("2d");
let lastTime = 0;
ctx.clearRect(0, 0, GAME_HEIGHT, GAME_WIDTH);

class Game {
    constructor(canvasHeight, canvasWidth) {
        this.height = canvasHeight;
        this.width = canvasWidth;
    }

    start() {
        this.gameState = STATES.RUNNING;
        this.paddle = new Paddle(this);
        this.ball = new Ball(this);
        let bricks = this.buildBricks();
        this.objects = [this.paddle, this.ball, ...bricks];
        new KeyboardClick(this.paddle, this);
    }

    update(deltaTime) {
        if (this.gameState === STATES.PAUSE || this.gameState === STATES.GAMEOVER || this.gameState === STATES.WIN) return;

        this.objects.forEach(objects => objects.update(deltaTime));
        this.objects = this.objects.filter(objects => !objects.detectCollision);

        if(this.objects.length < 3){
            this.gameState = STATES.WIN;           
        }
    }

    draw(ctx) {
        this.objects.forEach(objects => objects.draw(ctx));

        if (this.gameState === STATES.PAUSE || this.gameState === STATES.WIN) {
            ctx.rect(0, 0, this.width, this.height);
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fill();

            ctx.font = "30px Arial";
            ctx.fillStyle = "White";
            ctx.textAliign = "center";
            ctx.fillText(this.gameState === STATES.PAUSE ? "Paused" : "WOW!!! You Win!!!", this.width / 2, this.height / 2);
        }

        if (this.gameState === STATES.GAMEOVER) {
            ctx.rect(0, 0, this.width, this.height);
            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.fill();

            ctx.font = "30px Arial";
            ctx.fillStyle = "White";
            ctx.textAliign = "center";
            ctx.fillText("Game Over!!! Click Spacebar to start again !!!", this.width / 6, this.height / 2);
        }
    }

    level() {
        return [
            [1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];
    }

    buildBricks() {
        let bricks = [];
        let level = this.level();
        let game = this;

        level.forEach((row, rowIndex) => {
            row.forEach((brick, brickIndex) => {
                if (brick === 1) {
                    let position = {
                        x: 80 * brickIndex,
                        y: 50 + 24 * rowIndex
                    };
                    bricks.push(new Brick(game, position));
                }
            });
        });

        return bricks;
    }

    detectCollision(ball, gameObject) {
        let bottomOfBall = ball.position.y + ball.size;
        let topOfBall = ball.position.y;

        let topOfObject = gameObject.position.y;
        let bottomOfObject = gameObject.position.y + gameObject.height;


        let leftSideOfObject = gameObject.position.x;
        let rightSideOfObject = gameObject.position.x + gameObject.width;

        if (bottomOfBall >= topOfObject && topOfBall <= bottomOfObject && ball.position.x >= leftSideOfObject &&
            ball.position.x + ball.size <= rightSideOfObject) {
            return true;
        } else {
            return false;
        }

    }

    pauseGame() {
        if (this.gameState === STATES.RUNNING) {
            this.gameState = STATES.PAUSE;
        } else {
            this.gameState = STATES.RUNNING;
        }

    }

    gameOver() {
        this.gameState = STATES.GAMEOVER;
    }
}

class Paddle {
    constructor(game) {
        this.canvasWidth = game.width;
        this.speed = 0;
        this.maxSpeed = 7;
        this.height = 20;
        this.width = 150;
        this.position = {
            x: game.width / 2 - this.width / 2,
            y: game.height - this.height - 10,
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#0f0';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    moveRight() {
        this.speed = this.maxSpeed;
    }

    moveLeft() {
        this.speed = -this.maxSpeed;
    }

    stop() {
        this.speed = 0;
    }

    update(deltaTime) {
        this.position.x += this.speed;

        if (this.position.x < 0) {
            this.position.x = 0;
        }

        if (this.position.x > this.canvasWidth - this.width) {
            this.position.x = this.canvasWidth - this.width;
        }
    }
}

class Ball {
    constructor(game) {
        this.game = game;
        this.height = game.height;
        this.width = game.width;
        this.ball = document.getElementById("ball");
        this.position = {
            x: 10,
            y: 400
        };
        this.speed = {
            x: 4,
            y: -4
          };
        this.size = 16;
        this.game = game;

    }

    draw(ctx) {
        ctx.drawImage(this.ball, this.position.x, this.position.y, this.size, this.size);
    }

    update(deltaTime) {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        // check left and rigth sides
        if (this.position.x + this.size > this.width || this.position.x < 0)
            this.speed.x = -this.speed.x;

        // check bottom and top sides
        if (this.position.y < 0)
            this.speed.y = -this.speed.y;

        // ball is on the bottom    
        if (this.position.y + this.size > this.height) {
            this.game.gameOver();
        }

        // check collision with paddle
        if (this.game.detectCollision(this, this.game.paddle)) {
            this.speed.y = -this.speed.y;
            this.position.y = this.game.paddle.position.y - this.size;
        }
    }
}

class KeyboardClick {
    constructor(paddle, game) {
        document.addEventListener("keydown", event => {
            switch (event.keyCode) {
                case 37:
                    paddle.moveLeft();
                    break;
                case 39:
                    paddle.moveRight();
                    break;
                case 27:
                    game.pauseGame();
                    break;
                case 32:
                    game.start();
                    break;
            }
        });

        document.addEventListener("keyup", event => {
            switch (event.keyCode) {
                case 38:
                    paddle.stop();
                    break;
            }
        });

    }
}

class Brick {
    constructor(game, position) {
        this.image = document.getElementById("brick");
        this.game = game;
        this.position = position;
        this.width = 80;
        this.height = 24;
        this.detectCollision = false;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update(deltaTime) {
        if (this.game.detectCollision(this.game.ball, this)) {
            this.game.ball.speed.y = -this.game.ball.speed.y;
            this.detectCollision = true;
        }
    }
}

let game = new Game(GAME_HEIGHT, GAME_WIDTH);
game.start();

function gameLoop(timestmap) {
    let deltaTime = timestmap - lastTime;
    lastTime = timestmap;
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
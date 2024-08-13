var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var Boat = /** @class */ (function () {
    function Boat(x, y, width, height, imageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imageSrc;
        this.movingLeft = false;
        this.movingRight = false;
        this.flipped = false;
    }
    Boat.prototype.draw = function () {
        ctx.save();
        if (this.flipped) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, -this.x - this.width, this.y, this.width, this.height);
        }
        else {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    };
    Boat.prototype.move = function (dx) {
        this.x += dx;
        if (this.x < 0)
            this.x = 0;
        if (this.x + this.width > canvas.width)
            this.x = canvas.width - this.width;
    };
    Boat.prototype.update = function () {
        if (this.movingLeft) {
            this.move(-5);
        }
        if (this.movingRight) {
            this.move(5);
        }
    };
    return Boat;
}());
var Parachutist = /** @class */ (function () {
    function Parachutist(x, y, width, height, speed, imageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.image = new Image();
        this.image.src = imageSrc;
    }
    Parachutist.prototype.draw = function () {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    Parachutist.prototype.update = function () {
        this.y += this.speed;
    };
    return Parachutist;
}());
var Plane = /** @class */ (function () {
    function Plane(x, y, width, height, speed, imageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.image = new Image();
        this.image.src = imageSrc;
    }
    Plane.prototype.draw = function () {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(this.image, -this.x - this.width, this.y, this.width, this.height);
        ctx.restore();
    };
    Plane.prototype.update = function () {
        this.x += this.speed;
        if (this.x > canvas.width) {
            this.x = -this.width;
        }
    };
    return Plane;
}());
var background = new Image();
background.src = 'background.png';
var sea = new Image();
sea.src = 'sea.png';
var boat = new Boat(350, 460, 100, 50, 'boat.png'); 
var plane = new Plane(0, 50, 100, 50, 2, 'plane.png');
var parachutists = [];
var score = 0;
var lives = 3;
function spawnParachutist() {
    var x = plane.x + plane.width / 2;
    var parachutist = new Parachutist(x, plane.y + plane.height, 30, 30, 2, 'parachutist.png');
    parachutists.push(parachutist);
}
function updateGame() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(sea, 0, canvas.height - 100, canvas.width, 100);
    plane.update();
    plane.draw();
    boat.update();
    boat.draw();
    parachutists.forEach(function (parachutist, index) {
        parachutist.update();
        parachutist.draw();
        if (parachutist.y + parachutist.height > canvas.height - 100) {
            parachutists.splice(index, 1);
            lives--;
            if (lives === 0) {
                alert('Game Over');
                document.location.reload();
            }
        }
        else if (parachutist.y + parachutist.height > boat.y &&
            parachutist.x + parachutist.width > boat.x &&
            parachutist.x < boat.x + boat.width) {
            parachutists.splice(index, 1);
            score += 10;
        }
    });
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText("Score: ".concat(score), 10, 20);
    ctx.fillText("Lives: ".concat(lives), 10, 50);
    requestAnimationFrame(updateGame);
}
document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
        boat.movingLeft = true;
        boat.flipped = false; 
    }
    else if (e.key === 'ArrowRight') {
        boat.movingRight = true;
        boat.flipped = true; 
    }
});
document.addEventListener('keyup', function (e) {
    if (e.key === 'ArrowLeft') {
        boat.movingLeft = false;
    }
    else if (e.key === 'ArrowRight') {
        boat.movingRight = false;
    }
});
setInterval(spawnParachutist, 2000);
updateGame();

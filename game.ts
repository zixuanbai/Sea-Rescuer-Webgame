const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

interface GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    draw(): void;
}

class Boat implements GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    image: HTMLImageElement;
    movingLeft: boolean;
    movingRight: boolean;
    flipped: boolean;

    constructor(x: number, y: number, width: number, height: number, imageSrc: string) {
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

    draw() {
        ctx.save();
        if (this.flipped) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, -this.x - this.width, this.y, this.width, this.height);
        } else {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    }

    move(dx: number) {
        this.x += dx;
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    }

    update() {
        if (this.movingLeft) {
            this.move(-5);
        }
        if (this.movingRight) {
            this.move(5);
        }
    }
}

class Parachutist implements GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    image: HTMLImageElement;

    constructor(x: number, y: number, width: number, height: number, speed: number, imageSrc: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.speed;
    }
}

class Plane implements GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    image: HTMLImageElement;

    constructor(x: number, y: number, width: number, height: number, speed: number, imageSrc: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    draw() {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(this.image, -this.x - this.width, this.y, this.width, this.height);
        ctx.restore();
    }

    update() {
        this.x += this.speed;
        if (this.x > canvas.width) {
            this.x = -this.width;
        }
    }
}

const background = new Image();
background.src = 'background.png';

const sea = new Image();
sea.src = 'sea.png';

let boat = new Boat(350, 460, 100, 50, 'boat.png'); 
let plane = new Plane(0, 50, 100, 50, 2, 'plane.png');
let parachutists: Parachutist[] = [];
let score = 0;
let lives = 3;

function spawnParachutist() {
    const x = plane.x + plane.width / 2;
    const parachutist = new Parachutist(x, plane.y + plane.height, 30, 30, 2, 'parachutist.png');
    parachutists.push(parachutist);
}

function updateGame() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(sea, 0, canvas.height - 100, canvas.width, 100);
    plane.update();
    plane.draw();
    boat.update();
    boat.draw();
    parachutists.forEach((parachutist, index) => {
        parachutist.update();
        parachutist.draw();
        if (parachutist.y + parachutist.height > canvas.height - 100) {
            parachutists.splice(index, 1);
            lives--;
            if (lives === 0) {
                alert('Game Over');
                document.location.reload();
            }
        } else if (
            parachutist.y + parachutist.height > boat.y &&
            parachutist.x + parachutist.width > boat.x &&
            parachutist.x < boat.x + boat.width
        ) {
            parachutists.splice(index, 1);
            score += 10;
        }
    });
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Lives: ${lives}`, 10, 50);
    requestAnimationFrame(updateGame);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        boat.movingLeft = true;
        boat.flipped = false; 
    } else if (e.key === 'ArrowRight') {
        boat.movingRight = true;
        boat.flipped = true; 
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        boat.movingLeft = false;
    } else if (e.key === 'ArrowRight') {
        boat.movingRight = false;
    }
});

setInterval(spawnParachutist, 2000);
updateGame();




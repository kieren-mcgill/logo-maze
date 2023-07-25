
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const ball = {
    centerX: canvas.width / 2,
    centerY: canvas.height -50,
    radius: 10,
    fillColor: 'red',
};

function drawBall() {
    ctx.fillStyle = ball.fillColor;
    ctx.beginPath();
    ctx.arc(ball.centerX, ball.centerY, ball.radius, 0, 2 * Math.PI);
    ctx.fill();
}

function drawBoundary() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 240;
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

function drawCenterRectangle() {
    const rectHeight = 40;
    const rectWidth = canvas.width - 120;
    const rectX = (canvas.width - rectWidth) / 2;
    const rectY = (canvas.height - rectHeight) / 2;
    ctx.fillStyle = 'white';
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
}

function drawLogo() {
    ctx.drawImage(img, (canvas.width / 2) - (imgSize / 2), (canvas.width / 2) - (imgSize / 2), imgSize, imgSize);
}

function drawMaze() {
    drawBoundary();
    drawLogo();
    drawCenterRectangle();
    drawBall();
}

const img = new Image();
const imgSize = 240;
img.src = 'insta-logo.png';
img.onload = function () {
    drawMaze();
}

function checkIfCollide(accelX, accelY) {
    for (let angle = 0; angle < 360; angle += 10) {
        const xCoordinate = (ball.centerX + accelX) + (ball.radius) * Math.cos(angle * (Math.PI / 180));
        const yCoordinate = (ball.centerY + accelY) + (ball.radius) * Math.sin(angle * (Math.PI / 180));
        const checkColour = ctx.getImageData(xCoordinate - 0.5, yCoordinate - 0.5, 1, 1).data.slice(0, 3);
        if (checkColour.every((value) => value < 50)) {
            return true;
        }
    }
    return false;
}

function getAccel() {
    ball.centerX = canvas.width / 2;
    ball.centerY = canvas.height -50;
    const XScalingFactor = 2;
    const YScalingFactor = 4;
    const maxAccel = 4;
    const minAccel = -4;

    DeviceMotionEvent.requestPermission().then(response => {
        if (response === 'granted') {
            window.addEventListener('devicemotion', (event) => {
                let accelX = event.accelerationIncludingGravity.x * XScalingFactor;
                let accelY = -event.accelerationIncludingGravity.y * YScalingFactor;

                accelX = Math.min(maxAccel, Math.max(minAccel, accelX));
                accelY = Math.min(maxAccel, Math.max(minAccel, accelY));

                const willCollide = checkIfCollide(accelX, accelY);
                if (!willCollide) {
                    ball.centerX += accelX;
                    ball.centerY += accelY;
                }
                drawMaze();
            });
        }
    });
}
drawMaze();
const video = document.querySelector('video');
const canvas = document.getElementById('client');
const ctx = canvas.getContext('2d');

const otherCanvas = document.getElementById('other');
const otherCtx = otherCanvas.getContext('2d');

const qualityInput = document.getElementById('quality');

let quality = 0.5;
qualityInput.addEventListener('change', (e) => {
    quality = parseFloat(e.target.value);
});

const fpsInput = document.getElementById('fps');

let fps = 30;
fpsInput.addEventListener('change', (e) => {
    fps = parseInt(e.target.value);
});

let previousFrame = 0;

// Websocket
const socket = io();

socket.on('canvas', (data) => {
    const img = new Image();
    img.onload = () => {
        otherCtx.drawImage(img, 0, 0, otherCanvas.width, otherCanvas.height);
    };
    img.src = data;
});

let faceKeypoints = [];

navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
    video.srcObject = stream;
    video.play();
})
.catch(err => {
    console.error(err);
});

function drawCanvas() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    drawKeypoints();

    // Limit FPS
    const now = Date.now();
    const delta = now - previousFrame;
    const interval = 1000 / fps;

    if (delta > interval) {
        socket.emit('canvas', canvas.toDataURL('image/jpeg', quality));
        previousFrame = now;
    }

    requestAnimationFrame(drawCanvas);
}

function drawKeypoints() {
    if (faceKeypoints.length === 0) return;

    // Draw keypoints
    // for (let i = 0; i < faceKeypoints.length; i++) {
    //     const keypoints = faceKeypoints[i].scaledMesh;

    //     for (let j = 0; j < keypoints.length; j++) {
    //         const [x, y] = keypoints[j];

    //         ctx.beginPath();
    //         ctx.arc(x, y, 1, 0, 2 * Math.PI);
    //         ctx.fillStyle = 'black';
    //         ctx.fill();
    //     }
    // }

    // Draw nose tip
    const noseTip = faceKeypoints[0].annotations.noseTip[0];

    ctx.beginPath();
    ctx.arc(noseTip[0], noseTip[1], 20, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
}

function modelLoaded() {
    console.log('Model Loaded!');
}

function gotResults(results) {
    faceKeypoints = results;
}

drawCanvas();

const poseNet = ml5.facemesh(video, modelLoaded);
poseNet.on('face', gotResults);
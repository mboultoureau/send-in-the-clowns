// HTML elements
const video = document.querySelector('video');
const clientCanvas = document.getElementById('client');
const clientCtx = clientCanvas.getContext('2d');
const serverCanvas = document.getElementById('server');
const serverCtx = serverCanvas.getContext('2d');
const qualityInput = document.getElementById('quality');
const fpsInput = document.getElementById('fps');
const showFaceKeypointsInput = document.getElementById('show-face-keypoints');

// Variables
let previousFrame = 0;
let faceKeypoints = [];
const socket = io();

// Options
let quality = 0.5;
let fps = 30;
let showFaceKeypoints = false;

// Get webcam stream
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
    video.srcObject = stream;
    video.play();
})
.catch(err => {
    console.error(err);
});


// Draw client canvas
function drawCanvas() {
    // Draw noses
    clientCtx.drawImage(video, 0, 0, clientCanvas.width, clientCanvas.height);
    drawKeypoints();

    // Limit fps sending rate
    const now = Date.now();
    const delta = now - previousFrame;
    const interval = 1000 / fps;

    if (delta > interval) {
        socket.emit('canvas', clientCanvas.toDataURL('image/jpeg', quality));
        previousFrame = now;
    }

    requestAnimationFrame(drawCanvas);
}

// Draw noses
function drawKeypoints() {
    if (faceKeypoints.length === 0) return;

    // Draw face mesh keypoints
    if (showFaceKeypoints) {
        for (let i = 0; i < faceKeypoints.length; i++) {
            const keypoints = faceKeypoints[i].scaledMesh;
    
            for (let j = 0; j < keypoints.length; j++) {
                const [x, y] = keypoints[j];
    
                clientCtx.beginPath();
                clientCtx.arc(x, y, 1, 0, 2 * Math.PI);
                clientCtx.fillStyle = 'black';
                clientCtx.fill();
            }
        }
    }

    // Draw reds noses
    for (let i = 0; i < faceKeypoints.length; i++) {
        const noseTip = faceKeypoints[i].annotations.noseTip[0];

        clientCtx.beginPath();
        clientCtx.arc(noseTip[0], noseTip[1], 20, 0, 2 * Math.PI);
        clientCtx.fillStyle = 'red';
        clientCtx.fill();
    }
}

drawCanvas();

const facemesh = ml5.facemesh(video, () => console.log('Model loaded!'));
facemesh.on('face', (results) => faceKeypoints = results);


// Draw received canvas
socket.on('canvas', (data) => {
    const img = new Image();
    img.onload = () => {
        serverCtx.drawImage(img, 0, 0, serverCanvas.width, serverCanvas.height);
    };
    img.src = data;
});


// Handle options inputs
qualityInput.addEventListener('change', (e) => {
    quality = parseFloat(e.target.value);
});

fpsInput.addEventListener('change', (e) => {
    fps = parseInt(e.target.value);
});

showFaceKeypointsInput.addEventListener('change', (e) => {
    showFaceKeypoints = e.target.checked;
});
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = 3000;
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Serve static files
app.use(express.static(__dirname + '/public'));

// Socket connection
io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('disconnect', () => {
        console.log('User disconnected')
    });

    // Receive and broadcast message
    socket.on('canvas', (data) => {
        io.emit('canvas', data);
    });
});

// Start server
server.listen(port, () => {
    console.log(`App listening on port ${port}!`)
});
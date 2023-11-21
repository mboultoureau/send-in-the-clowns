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

// Routes for all js files
app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('connected');

    socket.on('disconnect', () => {
        console.log('disconnected')
    });

    socket.on('canvas', (data) => {
        io.emit('canvas', data);
    });
});

server.listen(port, () => {
    console.log(`App listening on port ${port}!`)
});
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { isObject } = require('util');
const socketio = require("socket.io")

const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("./public"));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/singleplayer', function(req, res) {
    res.sendFile(__dirname + '/public/singleplayer.html');
});

app.get('/multiplayer', function(req, res) {
    res.sendFile(__dirname + '/public/multiplayer.html');
});

app.get('/team', function(req, res) {
    res.sendFile(__dirname + '/public/aboutTeam.html');
});

app.get('/contact', function(req, res) {
    res.sendFile(__dirname + '/public/contact.html');
});

app.get('/project', function(req, res) {
    res.sendFile(__dirname + '/public/aboutProject.html');
});

app.get('/rules', function(req, res) {
    res.sendFile(__dirname + '/public/rules.html');
});

app.get('/documentation', function(req, res) {
    res.send('Documentation');
});




io.on('connection', function(socket) {
    console.log('New Connection!');
})


server.listen(6969, () => {

    console.log('Server started on port 6969');
});
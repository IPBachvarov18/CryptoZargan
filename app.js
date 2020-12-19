const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { isObject } = require('util');
const socketio = require('socket.io');
const game = require('./utils/game');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("./public"));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
})

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


    socket.on('startSingleplayer', function(username) {
        let gameCount = 1;
        let hasWon = false;
        let level = 1;
        let hasTries = true;
        let guessedDigits = 0;
        let guessedPosition = 0;

        console.log(username);

        let code = game.generateCode();

        console.log(code);

        socket.on('nextLevel', function() {
            if (hasWon) {
                level = 2;
                guessedDigits = 0;
                guessedPosition = 0;
                gameCount = 1;
                code = game.generateCode(); // LEVEL 2
                console.log(code);
                hasWon = false;
                hasTries = true;
            }
        })

        socket.on('crackCodeSinglePlayer', function(guessedCode) {
            if (!guessedCode || guessedCode.length != 4) {
                console.log(`Invalid request: !${guessedCode}!`)
                return {};
            }

            hasTries = gameCount <= 3;
            if (hasTries) {
                gameCount++;
                guessedDigits = game.calculatesGuessedDigits(guessedCode, code);
                guessedPosition = game.calculateExactPositions(guessedCode, code);
                hasWon = guessedPosition == 4;
                if (hasWon && level == 2) {
                    gameCount = 420;
                }
                console.log("Digs: " + guessedDigits, "Pos: " + guessedPosition);

            }
            socket.emit("singleplayerAnswer", { guessedDigits, guessedPosition, hasTries, hasWon, level });
        })
    })



})


server.listen(6969, () => {

    console.log('Server started on port 6969');
});
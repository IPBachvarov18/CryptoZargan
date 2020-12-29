'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { isObject } = require('util');
const socketio = require('socket.io');
const game = require('./utils/game');
const uuid = require("uuid");

const http = require('http')
const app = express();
const https = require('https');
const fs = require('fs');
require('dotenv').config();


const httpApp = express(http);

httpApp.listen(process.env.httpPort, () => {
    console.log(`HTTP server started on port ${process.env.httpPort}`);
})

httpApp.get("*", function(req, res) {
    res.redirect("https://" + req.headers.host);
})

const server = https.createServer({
    hostname: process.env.hostname,
    path: process.env.path,
    method: process.env.method,
    pfx: fs.readFileSync(process.env.pfxPath),
    passphrase: process.env.passphrase,
    agent: process.env.agent,
    rejectUnauthorized: process.env.rejectUnauthorized
}, app);

server.listen(process.env.httpsPort, () => {
    console.log(`HTTPS Server running on port ${process.env.httpsPort}`);
});

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

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/error404.html');
});


let multiGameState = {};

io.on('connection', function(socket) {
    console.log('New Connection!');


    socket.on('startSingleplayer', function(username) {
        if (username != undefined) {
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
                    code = game.generateRepetitiveCode(); // LEVEL 2
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

                hasTries = gameCount <= 13;
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
        }
    })


    let roomExist = false;

    socket.on("chooseRole", function(nickname, role) {
        const roomId = uuid.v4();
        socket.join(roomId);

        multiGameState[roomId] = {
            firstPlayer: nickname,
            firstPlayerRole: role,
            secondPlayer: null,
            secondPlayerRole: null
        };

        console.log(`${nickname} who is ${role} has joind in room with id ${roomId}`);
        console.log(multiGameState);

        socket.emit("generateId", roomId)
    });

    socket.on("joinRoom", function(nickname, roomId) {
        console.log(roomExist);
        // TODO: check if room exist, Stoyane!
        if (roomId != undefined) {
            if (roomExist == true) {
                socket.join(roomId);

                let size = Object.keys(multiGameState).length
                console.log(size)

                if (multiGameState[roomId].firstPlayer != undefined && multiGameState[roomId].firstPlayerRole != undefined) {
                    multiGameState[roomId].secondPlayer = nickname;
                    if (multiGameState[roomId].firstPlayerRole == "German") {
                        multiGameState[roomId].secondPlayerRole = "British";
                    } else {
                        multiGameState[roomId].secondPlayerRole = "German";
                    }
                    multiGameState[roomId].state = "In progress";

                    console.log(multiGameState);


                    console.log(`${nickname} who is ${multiGameState[roomId].secondPlayerRole} has joind in room with id ${roomId}`);

                    socket.broadcast.to(roomId).emit('playerJoined', `${nickname} has joined`, multiGameState[roomId]);
                }
            } else {
                console.log(`!Room with ID of ${roomId} doesn't exist!`);
            }
        }

    });

    socket.on("startGame", function(roomId) {
        if (roomId != undefined) {
            console.log("New multiplayer game has started!");
            console.log(roomId);
            socket.emit("playerInfo", multiGameState[roomId]);
        } else {
            console.log("Cannot start game due to non-existing room")
        }
    })



})
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

app.get(process.env.er1, function(req, res) {
    res.sendFile(__dirname + process.env.ee1);
})

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

    socket.on('startSingleplayer', function(username, difficulty) {

        console.log(username, difficulty)

        if (username != undefined && difficulty != undefined) {
            let gameCount = 1;
            let hasWon = false;
            let level = 1;
            let hasTries = true;
            let guessedDigits = 0;
            let guessedPosition = 0;
            let code;
            let length;

            let code2;

            if (difficulty == "easy") {
                length = 3;
                code = game.generateCode(length);
                code2 = game.generateRepetitiveCode(length);
            } else if (difficulty == "medium") {
                length = 4;
                code = game.generateCode(length);
                code2 = game.generateRepetitiveCode(length);
            } else if (difficulty == "hard") {
                length = 5;
                code = game.generateCode(length);
                code2 = game.generateRepetitiveCode(length);
            }

            console.log(code);

            socket.on('nextLevel', function() {
                if (hasWon) {
                    level = 2;
                    guessedDigits = 0;
                    guessedPosition = 0;
                    gameCount = 1;
                    code = code2; // LEVEL 2
                    console.log(code);
                    hasWon = false;
                    hasTries = true;
                }
            })

            socket.on('crackCodeSinglePlayer', function(guessedCode) {
                if (!guessedCode || guessedCode.length != length) {
                    console.log(`Invalid request: !${guessedCode}!`)
                    return {};
                }

                hasTries = gameCount <= 13;
                if (hasTries) {
                    gameCount++;
                    guessedDigits = game.calculatesGuessedDigits(guessedCode, code);
                    guessedPosition = game.calculateExactPositions(guessedCode, code);
                    hasWon = guessedPosition == length;
                    if (hasWon && level == 2) {
                        gameCount = 420;
                    }
                    console.log("Digs: " + guessedDigits, "Pos: " + guessedPosition);

                }
                socket.emit("singleplayerMediumAnswer", { guessedDigits, guessedPosition, hasTries, hasWon, level });
            })
        }
    })

    socket.on("chooseRole", function(nickname, role) {
        const roomId = uuid.v4();
        socket.join(roomId);

        multiGameState[roomId] = {
            firstPlayer: nickname,
            firstPlayerRole: role,
            secondPlayer: null,
            secondPlayerRole: null,
            firstPlayerId: socket.id,
            code: null
        };

        console.log(`${nickname} who is ${role} has joind in room with id ${roomId}`);
        console.log(multiGameState);
        socket.emit("generateId", roomId)
    });

    socket.on("joinRoom", function(nickname, roomId) {

        // TODO: check if room exist, Stoyane!
        if (roomId != undefined) {
            if (multiGameState.hasOwnProperty(roomId)) {
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
                    multiGameState[roomId].secondPlayerId = socket.id;

                    console.log(multiGameState);


                    console.log(`${nickname} who is ${multiGameState[roomId].secondPlayerRole} has joind in room with id ${roomId}`);

                    socket.broadcast.to(roomId).emit('playerJoined', `${nickname} has joined`, multiGameState[roomId]);
                }
            } else {
                console.log(`!Room with ID of ${roomId} doesn't exist!`);
            }
        }

    });
    let ID = null; //ne struva, ne se izpulnqva pri vtoriq user i zatova ne raboti
    socket.on("startGame", function(roomId) {
        console.log(multiGameState);
        io.to(multiGameState[roomId].firstPlayerId).emit(`playerInfo${multiGameState[roomId].firstPlayerRole}`, multiGameState[roomId]);
        io.to(multiGameState[roomId].secondPlayerId).emit(`playerInfo${multiGameState[roomId].secondPlayerRole}`, multiGameState[roomId]);
        ID = roomId;
    })

    socket.on("setupCode", function(code) {

        if (game.checkInput(code)) {

            io.to(multiGameState[ID].firstPlayerId).emit(`generateCode${multiGameState[ID].firstPlayerRole}`, multiGameState[ID], multiGameState[ID].code);

            io.to(multiGameState[ID].secondPlayerId).emit(`generateCode${multiGameState[ID].secondPlayerRole}`, multiGameState[ID], multiGameState[ID].code);

        }
    })

    socket.on("inputCode", function(britishCode) {
        if (!britishCode || britishCode.length != 4) {
            console.log(`Invalid request: !${britishCode}!`)
            return {};
        }
        console.log(ID);
        let guessedDigits = game.calculatesGuessedDigits(britishCode, multiGameState[ID].code)
        let exactPositions = game.calculateExactPositions(britishCode, 4)


    })


})
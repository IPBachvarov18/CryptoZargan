"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const { isObject } = require("util");
const socketio = require("socket.io");
const game = require("./utils/game");
const uuid = require("uuid");
const mailer = require("nodemailer");

const http = require("http");
const app = express();
const https = require("https");
const fs = require("fs");
const { listeners } = require("cluster");
require("dotenv").config();

const httpApp = express(http);

httpApp.listen(process.env.httpPort, () => {
	console.log(`HTTP server started on port ${process.env.httpPort}`);
});

httpApp.get("*", function (req, res) {
	res.redirect("https://" + req.headers.host);
});

const server = https.createServer(
	{
		hostname: process.env.hostname,
		path: process.env.path,
		method: process.env.method,
		pfx: fs.readFileSync(process.env.pfxPath),
		passphrase: process.env.passphrase,
		agent: process.env.agent,
		rejectUnauthorized: process.env.rejectUnauthorized,
	},
	app
);

const smtpConfig = {
	host: process.env.gmailHost,
	port: process.env.gmailPORT,
	secure: true,
	auth: {
		user: process.env.gmailID,
		pass: process.env.gmailPass,
	},
};

const transporter = mailer.createTransport(smtpConfig);

server.listen(process.env.httpsPort, () => {
	console.log(`HTTPS Server running on port ${process.env.httpsPort}`);
});

const io = socketio(server);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("./public"));
app.use(express.static("./out"));
app.use(express.static("./docs"));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/public/index.html");
});

app.get("/singleplayer", function (req, res) {
	res.sendFile(__dirname + "/public/singleplayer.html");
});

app.get("/multiplayer", function (req, res) {
	res.sendFile(__dirname + "/public/multiplayer.html");
});

app.get("/team", function (req, res) {
	res.sendFile(__dirname + "/public/aboutTeam.html");
});

app.get("/contact", function (req, res) {
	res.sendFile(__dirname + "/public/contact.html");
});

app.get(process.env.er1, function (req, res) {
	res.sendFile(__dirname + process.env.ee1);
});

app.get("/rules", function (req, res) {
	res.sendFile(__dirname + "/public/rules.html");
});

app.get("/documentation", function (req, res) {
	res.sendFile(__dirname + "/out/global.html");
});

app.get("*", function (req, res) {
	res.sendFile(__dirname + "/public/error404.html");
});

app.post("/processContact", function (req, res) {
	let data = req.body;

	let mailOptions = {
		from: data.email,
		to: process.env.gmailID,
		subject: data.subject,
		html: `
		 <h1> ${data.username} send you a message </h1>

		<h2> Message: </h2> <p> ${data.message} </p>
		`,
	};
	console.log(mailOptions);

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
		}
	});

	res.redirect("/contact");
});

let multiGameState = {
	getRoomIdBySocketId(socketId) {
		for (let key in this) {
			if (
				this[key].firstPlayerId == socketId ||
				this[key].secondPlayerId == socketId
			) {
				return key;
			}
		}

		return null;
	},

	getUserIdByRole(role) {
		for (let key in this) {
			if (this[key].firstPlayerRole == role) {
				return this[key].firstPlayerId;
			}

			if (this[key].secondPlayerRole == role) {
				return this[key].secondPlayerId;
			}
		}

		return null;
	},

	getUsersByRoles() {
		return {
			britishPlayerId: multiGameState.getUserIdByRole(ROLES.BRITISH),
			germanPlayerId: multiGameState.getUserIdByRole(ROLES.GERMAN),
		};
	},
};

/**
 * Enum for game roles.
 * @enum {string}
 */
let ROLES = {
	/** The role is German.*/
	GERMAN: "German",
	/** The role is British.*/
	BRITISH: "British",
};

/**
 * Enum for different game states.
 * @enum {number}
 */
let GAME_PROGRESS = {
	/** The game is in the preparing state.*/
	PREPARE: 0,
	/** The game is in the starting state.*/
	STARTED: 1,
	/** The game is in the level 1 state.*/
	LEVEL_1: 2,
	/** The game is in the level 2 state.*/
	LEVEL_2: 3,
	/** The game is in the finishing state.*/
	FINISH: 4,
};

let ERROR = {
	NO_NAME_P1: 0,
	NO_NAME_P2: 1,
	INVALID_CODE_GERMAN: 2,
	INVALID_CODE_BRITISH: 3,
};

io.on("connection", function (socket) {
	console.log("New Connection!");

	socket.on("startSingleplayer", function (username, difficulty) {
		console.log(username, difficulty);

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

			socket.on("nextLevel", function () {
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
			});

			socket.on("crackCodeSinglePlayer", function (guessedCode) {
				if (!guessedCode || guessedCode.length != length) {
					console.log(`Invalid request: !${guessedCode}!`);
					return {};
				}

				hasTries = gameCount <= 13;
				if (hasTries) {
					gameCount++;
					guessedDigits = game.calculatesGuessedDigits(
						guessedCode,
						code
					);
					guessedPosition = game.calculateExactPositions(
						guessedCode,
						code
					);
					hasWon = guessedPosition == length;
					if (hasWon && level == 2) {
						gameCount = 420;
					}
					console.log(
						"Digs: " + guessedDigits,
						"Pos: " + guessedPosition
					);
				}
				socket.emit("singleplayerMediumAnswer", {
					guessedDigits,
					guessedPosition,
					hasTries,
					hasWon,
					level,
				});
			});
		}
	});

	socket.on("playerOneJoin", function (nickname, role) {
		const roomId = uuid.v4();
		socket.join(roomId);

		if (nickname == "" || role == "") {
			console.log("User tried to join with no name or role");
			io.to(socket.id).emit("error", ERROR.NO_NAME_P1);
			return {};
		}

		multiGameState[roomId] = {
			firstPlayer: nickname,
			firstPlayerRole: role,
			secondPlayer: null,
			secondPlayerRole: null,
			firstPlayerId: socket.id,
			code: null,
			progress: GAME_PROGRESS.PREPARE,
		};

		console.log(
			`${nickname} who is ${role} has joind in room with id ${roomId}`
		);
		console.log(multiGameState);
		socket.emit("generateId", roomId);
	});

	socket.on("playerTwoJoin", function (nickname, roomId) {
		// TODO: check if room exist, Stoyane!
		if (nickname == "") {
			socket.emit("error", ERROR.NO_NAME_P2);
			return {};
		}
		if (roomId != undefined) {
			if (multiGameState.hasOwnProperty(roomId)) {
				let players = multiGameState.getUsersByRoles();
				socket.join(roomId);
				if (
					multiGameState[roomId].firstPlayer != undefined &&
					multiGameState[roomId].firstPlayerRole != undefined
				) {
					multiGameState[roomId].secondPlayer = nickname;
					if (multiGameState[roomId].firstPlayerRole == "German") {
						multiGameState[roomId].secondPlayerRole = "British";
					} else {
						multiGameState[roomId].secondPlayerRole = "German";
					}
					multiGameState[roomId].secondPlayerId = socket.id;

					console.log(multiGameState);

					console.log(
						`${nickname} who is ${multiGameState[roomId].secondPlayerRole} has joind in room with id ${roomId}`
					);

					socket.broadcast
						.to(roomId)
						.emit(
							"playerJoined",
							`${nickname} has joined`,
							multiGameState[roomId]
						);
				}
			} else {
				console.log(`!Room with ID of ${roomId} doesn't exist!`);
			}
		}
	});

	socket.on("startGame", function () {
		// !Check if id is null
		let roomId = multiGameState.getRoomIdBySocketId(socket.id);
		if (roomId == null) {
			return {};
		}
		// !Check if id is null
		let players = multiGameState.getUsersByRoles();

		multiGameState[roomId].progress = GAME_PROGRESS.STARTED;

		io.to(players.germanPlayerId).emit(`gameStatusGerman`);
		io.to(players.britishPlayerId).emit(`gameStatusBritish`);
	});

	socket.on("gameStarted", function () {
		// !Check if id is null
		let roomId = multiGameState.getRoomIdBySocketId(socket.id);
		if (roomId == null) {
			return {};
		}
		// !Check if id is null
		let players = multiGameState.getUsersByRoles();

		multiGameState[roomId].progress = GAME_PROGRESS.LEVEL_1;

		io.to(players.germanPlayerId).emit(
			`displayGerman`,
			multiGameState[roomId].code
		);
		io.to(players.britishPlayerId).emit(`displayBritish`);
	});

	let gameCountMultiplayer = 1;
	let hasWonMultiplayer = false;
	let hasTriesMultiplayer = true;
	let code2;
	let guessedDigitsMultiplayer;
	let exactPositionsMultiplayer;

	socket.on("nextLevelMultiplayer", function (hasWon1) {
		let roomId = multiGameState.getRoomIdBySocketId(socket.id);
		if (hasWon1) {
			multiGameState[roomId].progress = GAME_PROGRESS.LEVEL_2;
			guessedDigitsMultiplayer = 0;
			exactPositionsMultiplayer = 0;
			gameCountMultiplayer = 1;
			hasWonMultiplayer = false;
			hasTriesMultiplayer = true;
		}
		console.log(multiGameState[roomId].code);
	});

	let cntCodeSetup = 0;

	socket.on("setupCode", function (code) {
		// !Check if id is null
		let roomId = multiGameState.getRoomIdBySocketId(socket.id);

		let players = multiGameState.getUsersByRoles();

		if (roomId == null) {
			return {};
		}

		if (socket.id == players.britishPlayerId) {
			return {};
		}
		// cntCodeSetup++;
		// if (cntCodeSetup > 2) {
		// 	console.log("Game terminated due to cheater in the game");
		// 	socket.emit(
		// 		"cheaterDetected",
		// 		"Game terminated due to cheater in the game"
		// 	);
		// 	return {};
		// }
		// this.counter++;
		// console.log(`Codes entered: ${this.counter}`);
		// if (this.counter > 2) {
		//     console.log("MAZEN CHEATER");
		//     return {};
		// }

		console.log(multiGameState[roomId].progress);

		if (multiGameState[roomId].progress + 1 == 2) {
			if (game.checkInput(code)) {
				multiGameState[roomId].code = code;
				socket.emit("codeGenerated");
			} else {
				socket.emit("error", ERROR.INVALID_CODE_GERMAN);
			}
		} else if (multiGameState[roomId].progress == 3) {
			if (game.checkInputTaskTwo(code)) {
				multiGameState[roomId].code = code;
				io.to(players.britishPlayerId).emit(`nextLevelBritish`);
			} else {
				io.to(players.germanPlayerId).emit(
					"error",
					ERROR.INVALID_CODE_GERMAN
				);
			}
		}
	});

	socket.on("inputCode", function (britishCode) {
		// !Check if id is null
		let roomId = multiGameState.getRoomIdBySocketId(socket.id);
		if (roomId == null) {
			return {};
		}

		// !Check if id is null
		let players = multiGameState.getUsersByRoles();

		if (socket.id != players.britishPlayerId) {
			return {};
		}

		if (!britishCode || britishCode.length != 4) {
			console.log(`Invalid request: !${britishCode}!`);
			socket.emit("error", ERROR.INVALID_CODE_BRITISH);
			return {};
		}

		guessedDigitsMultiplayer = game.calculatesGuessedDigits(
			britishCode,
			multiGameState[roomId].code
		);

		exactPositionsMultiplayer = game.calculateExactPositions(
			britishCode,
			multiGameState[roomId].code
		);

		hasTriesMultiplayer = gameCountMultiplayer < 13;
		if (hasTriesMultiplayer) {
			gameCountMultiplayer++;
			hasWonMultiplayer = exactPositionsMultiplayer == 4;
			if (hasWonMultiplayer && multiGameState[roomId].progress == 3) {
				gameCountMultiplayer = 420;
			}
			console.log(
				"Digs: " + guessedDigitsMultiplayer,
				"Pos: " + exactPositionsMultiplayer + " " + hasWonMultiplayer
			);
		}
		console.log(multiGameState[roomId].progress);
		io.to(players.germanPlayerId).emit(
			`resultGerman`,
			britishCode,
			guessedDigitsMultiplayer,
			exactPositionsMultiplayer,
			hasTriesMultiplayer,
			hasWonMultiplayer,
			multiGameState[roomId].progress
		);

		io.to(players.britishPlayerId).emit(
			`guessBritish`,
			britishCode,
			guessedDigitsMultiplayer,
			exactPositionsMultiplayer,
			hasTriesMultiplayer,
			hasWonMultiplayer,
			multiGameState[roomId].progress
		);
	});
});

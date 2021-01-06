const socket = io();
let кюфте;

const createGameForm = document.getElementById("createGameForm");
const createJoin = document.getElementById("createOrJoin");
const createButton = document.getElementById("create");
const joinButton = document.getElementById("join");
const joinGameForm = document.getElementById("joinGameForm");
const waitingForPlayer = document.getElementById("waitingForPlayer");
const guessedDigits = document.getElementById("guessedDigits");
const triesTableBody = document
	.getElementById("triesTable")
	.getElementsByTagName("tbody")[0];
const triesTable = document.getElementById("triesTable");
const levelActions = document.getElementById("levelActions");

$(() => {
	$("#digit1").on("input", () => {
		$("#digit2").focus();
	});

	$("#digit2").on("input", () => {
		$("#digit3").focus();
	});

	$("#digit3").on("input", () => {
		$("#digit4").focus();
	});

	$("#digit4").on("input", () => {
		$("#digit5").focus();
	});
});

if (joinGameForm) {
	joinGameForm.addEventListener("submit", function (e) {
		e.preventDefault();

		const nickname = e.target.nickname.value;
		const roomId = e.target.gameId.value;
		const waitingForStart = document.getElementById("waitForStart");
		if (roomId != undefined && nickname != undefined) {
			socket.emit("playerTwoJoin", nickname, roomId);
		}

		joinGameForm.style.display = "none";
		waitingForStart.style.display = "block";
	});
}

const startButton = document.getElementById("startButton");

socket.on("playerJoined", function (message, obj) {
	const startGame = document.getElementById("startGame");
	const joinMessage = document.getElementById("joinMessage");

	waitingForPlayer.style.display = "none";
	startGame.style.display = "block";

	joinMessage.innerText = message;
});

if (startButton) {
	startButton.addEventListener("click", function (e) {
		e.preventDefault();
		alert(1);
		socket.emit("startGame");
	});
}

if (createGameForm) {
	createGameForm.addEventListener("submit", function (e) {
		e.preventDefault();

		const nickname = e.target.nickname.value;
		const role = e.target.role.value;

		console.log(nickname, role);

		socket.emit("playerOneJoin", nickname, role);
		createGameForm.style.display = "none";
	});
}

socket.on("generateId", function (code) {
	waitingForPlayer.style.display = "block";
	roomId.innerText = code;
});

$("#codeInitialSetup").on("submit", function (e) {
	e.preventDefault();

	let digit1 = e.target.create1.value;
	let digit2 = e.target.create2.value;
	let digit3 = e.target.create3.value;
	let digit4 = e.target.create4.value;

	let code =
		String(digit1) + String(digit2) + String(digit3) + String(digit4);

	socket.emit("setupCode", code);

	e.target.elements.create1.value = "";
	e.target.elements.create2.value = "";
	e.target.elements.create3.value = "";
	e.target.elements.create4.value = "";
});

$("#guessedDigits").on("submit", function (e) {
	e.preventDefault();

	let digit1 = e.target.digit1.value;
	let digit2 = e.target.digit2.value;
	let digit3 = e.target.digit3.value;
	let digit4 = e.target.digit4.value;

	let britishCode =
		String(digit1) + String(digit2) + String(digit3) + String(digit4);

	socket.emit("inputCode", britishCode);

	e.target.elements.digit1.value = "";
	e.target.elements.digit2.value = "";
	e.target.elements.digit3.value = "";
	e.target.elements.digit4.value = "";
});

socket.on("gameStatusBritish", function () {
	$("#startGame").hide();
	$("#waitForStart").hide();
	$("#waitForCode").show();
});

socket.on("gameStatusGerman", function () {
	$("#startGame").hide();
	$("#codeInitialSetup").show();
	$("#waitForStart").hide();
});

socket.on("displayBritish", function () {
	$("#waitForCode").hide();
	$("#guessedDigits").show();
	$("#triesTable").show();
});

socket.on("displayGerman", function (code) {
	$("#codeInitialSetup").hide();
	$("#triesTable").show();
	$("#code").show();
	$("#code").text(`Code: ${code}`);
});

socket.on("incorrectInput", function (message) {
	alert(message);
});

socket.on("codeGenerated", function (message, code) {
	alert(message);
	socket.emit("gameStarted");
});

socket.on("cheaterDetected", function(message) {
    alert(message)
});

socket.on(
    "resultGerman",
    function(
        britishCode,
        guessedDigits,
        exactPositions,
        hasTries,
        hasWon,
        level
    ) {
        if (hasWon) {
            console.log(level);
            if (level == 2) {
                $("#levelResult").show();
                $("#nextLevelMultiplayer").on("click", function(e) {
                    e.preventDefault();
                    $("#tries").empty();
                    alert("BABUN");
                    socket.emit("nextLevelMultiplayer", hasWon);
                    console.log(level);
                    $("#levelResult").hide();
                    $("#codeInitialSetup").show();
                    $("#code").hide();
                });
            } else {
                $("#guessedDigits").hide();
                $("#won").show();
            }
        }
        if (!hasTries) {
            $("#lose").show();
        }

        addRowsToTable(guessedDigits, exactPositions, britishCode);
    }
);

socket.on(
    "guessBritish",
    function(
        britishCode,
        guessedDigits,
        exactPositions,
        hasTries,
        hasWon,
        level
    ) {
        if (hasWon) {
            console.log(level);

            if (level == 2) {
                $("#guessedDigits").hide();
                $("#congratulationsLevel").show();
                $("#waitForNextLevel").show();
                socket.on("nextLevelBritish", function() {
                    $("#tries").empty();
                    $("#congratulationsLevel").hide();
                    $("#waitForNextLevel").hide();
                    $("#guessedDigits").show();
                });
            } else {
                $("#guessedDigits").hide();
                $("#won").show();
            }
        }

        if (!hasTries) {
            $("#lose").show();
            $("#guessedDigits").hide();
        }

        addRowsToTable(guessedDigits, exactPositions, britishCode);
    }
);

$("#createGameButton").on("click", function (e) {
	e.preventDefault();

	$("#createJoin").hide();
	$("#createGameForm").show();
});

$("#joinGameButton").on("click", function (e) {
	e.preventDefault();

	$("#createJoin").hide();
	$("#joinGameForm").show();
});

function addRowsToTable(guessedDigits, exactPositions, britishCode) {
	let newRow = triesTableBody.insertRow();
	let cell1 = newRow.insertCell(0);
	let cell2 = newRow.insertCell(1);
	let cell3 = newRow.insertCell(2);

	cell1.innerHTML = guessedDigits;
	cell2.innerHTML = exactPositions;
	cell3.innerHTML = britishCode;
}

const socket = io();

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
		$("#gsSubmit").focus();
	});

	$("#create1").on("input", () => {
		$("#create2").focus();
	});

	$("#create2").on("input", () => {
		$("#create3").focus();
	});

	$("#create3").on("input", () => {
		$("#create4").focus();
	});

	$("#create4").on("input", () => {
		$("#crSubmit").focus();
	});
});

if (joinGameForm) {
	joinGameForm.addEventListener("submit", function (e) {
		e.preventDefault();

		const nickname = e.target.nickname.value;
		const roomId = e.target.gameId.value;
		const waitingForStart = document.getElementById("waitForStart");
		socket.emit("playerTwoJoin", nickname, roomId);

		joinGameForm.style.display = "none";
		waitingForStart.style.display = "block";
		$("#errorMessage").hide();
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
	$("#errorMessage").hide();
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

	clearInitialSetupDigits(e);
	$("#errorMessage").hide();
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

	clearGuessedDigits(e);
	$("#errorMessage").hide();
});

socket.on("gameStatusBritish", function () {
	console.log("GameStatusBritish");
	$("#startGame").hide();
	$("#waitForStart").hide();
	$("#waitForCode").show();
});

socket.on("gameStatusGerman", function () {
	console.log("GameStatusGerman");
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

socket.on("codeGenerated", function () {
	socket.emit("gameStarted");
});

socket.on("cheaterDetected", function (message) {
	alert(message);
});

socket.on(
	"resultGerman",
	function (
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
				$("#nextLevelMultiplayer").on("click", function (e) {
					e.preventDefault();
					$("#tries").empty();
					$("#code").hide();
					socket.emit("nextLevelMultiplayer", hasWon);
					console.log(level);
					$("#levelResult").hide();
					$("#codeInitialSetup").show();
				});
			} else {
				$("#loseImg").attr("src", "img/germanLoseImg.png");
				$("#lose").show();
				$("#multiMain").hide();
				$("#multiLose").show();
				$("#homeButton").show();
			}
		}
		if (!hasTries) {
			$("#winImg").attr("src", "img/germanWinImg.png");
			$("#win").show();
			$("#multiMain").hide();
			$("#multiWin").show();
			$("#homeButton").show();
		}

		addRowsToTable(guessedDigits, exactPositions, britishCode);
	}
);

socket.on(
	"guessBritish",
	function (
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
				socket.on("nextLevelBritish", function () {
					$("#tries").empty();
					$("#congratulationsLevel").hide();
					$("#waitForNextLevel").hide();
					$("#guessedDigits").show();
				});
			} else {
				$("#winImg").attr("src", "img/britishWinImg.png");
				$("#win").show();
				$("#guessedDigits").hide();
				$("#multiMain").hide();
				$("#multiWin").show();
				$("#homeButton").show();
			}
		}

		if (!hasTries) {
			$("#guessedDigits").hide();
			$("#loseImg").attr("src", "img/britishLoseImg.png");
			$("#lose").show();
			$("#multiMain").hide();
			$("#multiLose").show();
			$("#homeButton").show();
		}

		addRowsToTable(guessedDigits, exactPositions, britishCode);
	}
);

socket.on("error", function (errorCode) {
	switch (errorCode) {
		case 0:
			$("#errorMessage").show();
			$("#errorMessage").text("Please enter name and role");
			$("#createGameForm").show();
			break;
		case 1:
			$("#errorMessage").show();
			$("#errorMessage").text("Please enter name");
			$("#joinGameForm").show();
			$("#waitForStart").hide();
			break;
		case 2:
			$("#errorMessage").show();
			$("#errorMessage").text("Invalid code");
			clearInitialSetupDigits();
			break;
		case 3:
			$("#errorMessage").show();
			$("#errorMessage").text("Invalid code");
			clearGuessedDigits();
			break;
		case 4:
			$("#errorMessage").show();
			$("#errorMessage").text("The Game Has Started");
			$("#joinGameForm").show();
			$("#waitForStart").hide();
	}
});

socket.on("gameCrash", function () {
	$("#guessedDigits").hide();
	$("#triesTable").hide();
	$("#code").hide();
	$("#createJoin").hide();
	$("#codeInitialSetup").hide();
	$("#createGameForm").hide();
	$("#joinGameForm").hide();
	$("#waitForStart").hide();
	$("#startGame").hide();
	$("#congratulationsLevel").hide();
	$("#waitForNextLevel").hide();
	$("#levelActions").hide();
	$("#leaveMessage").show();
});

socket.on("levelTwoCode", function (code) {
	$("#codeInitialSetup").hide();
	$("#code").text(`Code: ${code}`);
	$("#code").show();
});

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

/**
 * Adds rows with information about the guessed digits and exact positions to the table.
 *
 * @param {number} guessedDigits The number of digits that are guessed.
 * @param {number} exactPositions The number of exact positions that are guessed.
 * @param {number} britishCode The code that was guessed from the player.
 */
function addRowsToTable(guessedDigits, exactPositions, britishCode) {
	let newRow = triesTableBody.insertRow();
	let cell1 = newRow.insertCell(0);
	let cell2 = newRow.insertCell(1);
	let cell3 = newRow.insertCell(2);

	cell1.innerHTML = guessedDigits;
	cell2.innerHTML = exactPositions;
	cell3.innerHTML = britishCode;
}

function copyToClipboard() {
	const str = $("#roomId").text();
	const el = document.createElement("textarea");
	el.value = str;
	el.setAttribute("readonly", "");
	el.style.position = "absolute";
	el.style.left = "-9999px";
	document.body.appendChild(el);
	el.select();
	document.execCommand("copy");
	document.body.removeChild(el);
}

function clearGuessedDigits() {
	$("#guessedDigits")[0].reset();
}

function clearInitialSetupDigits() {
	$("#codeInitialSetup")[0].reset();
}

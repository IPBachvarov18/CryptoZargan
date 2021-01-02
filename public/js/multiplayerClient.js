const socket = io();
let кюфте;

const createGameForm = document.getElementById("createGameForm");
const createJoin = document.getElementById("createOrJoin");
const createButton = document.getElementById("create");
const joinButton = document.getElementById("join");
const joinGameForm = document.getElementById("joinGameForm");
const roomId = document.getElementById("roomId");
const waitingForPlayer = document.getElementById("waitingForPlayer");
const guessedDigits = document.getElementById("guessedDigits");
const triesTableBody = document.getElementById("triesTable").getElementsByTagName('tbody')[0];
const triesTable = document.getElementById("triesTable");
const levelActions = document.getElementById("levelActions");

if (joinGameForm) {
    joinGameForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const nickname = e.target.nickname.value;
        const roomId = e.target.gameId.value;
        const waitingForStart = document.getElementById("waitStart")
        if (roomId != undefined && nickname != undefined) {
            socket.emit("joinRoom", nickname, roomId);
        }

        joinGameForm.style.display = "none";
        waitingForStart.style.display = "block";

    })
}

const startButton = document.getElementById("startButton");

socket.on("playerJoined", function(message, obj) {
    const startGame = document.getElementById("startGame");
    const joinMessage = document.getElementById("joinMessage");

    waitingForPlayer.style.display = "none";
    startGame.style.display = "block";

    joinMessage.innerText = message;
})


if (startButton) {
    startButton.addEventListener("click", function(e) {
        e.preventDefault();
        const roomId = document.getElementById("roomId").innerText;
        socket.emit("startGame", roomId);
    })
}

if (createGameForm) {
    createGameForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const nickname = e.target.nickname.value;
        const role = e.target.role.value


        console.log(nickname, role);

        socket.emit('chooseRole', nickname, role)
        createGameForm.style.display = "none";
    })
}

socket.on("generateId", function(code) {
    waitingForPlayer.style.display = "block";
    roomId.innerText = code;
})

$("#codeInitialSetup").on("submit", function(e) {
    e.preventDefault();

    let digit1 = e.target.create1.value;
    let digit2 = e.target.create2.value;
    let digit3 = e.target.create3.value;
    let digit4 = e.target.create4.value;

    let code = String(digit1) + String(digit2) + String(digit3) + String(digit4);

    socket.emit("setupCode", code, кюфте);
})

$("#guessedDigits").on("submit", function(e) {
    e.preventDefault();

    let digit1 = e.target.digit1.value;
    let digit2 = e.target.digit2.value;
    let digit3 = e.target.digit3.value;
    let digit4 = e.target.digit4.value;

    let britishCode = String(digit1) + String(digit2) + String(digit3) + String(digit4);

    socket.emit("inputCode", britishCode, кюфте);
})



socket.on("playerInfoBritish", function(multiGameState, roomId) {
    кюфте = roomId;
    console.log(кюфте);
    $("#startGame").hide();
    $("#waitStart").hide();
    $("#waitGeneration").show();

})

socket.on("playerInfoGerman", function(multiGameState, roomId) {
    кюфте = roomId;
    console.log(кюфте);
    $("#startGame").hide();
    $("#codeInitialSetup").show();
    $("#waitStart").hide();

})


socket.on("displayBritish", function(multiGameState) {
    $("#waitGeneration").hide();
    $("#guessedDigits").show();
    $("#triesTable").show();
})

socket.on("displayGerman", function(multiGameState) {

    $("#codeInitialSetup").hide();
    $("#triesTable").show();
    $("#code").show();
    $("#code").text(`Code: ${multiGameState.code}`)
})

socket.on("incorrectInput", function(message) {
    alert(message);
})

socket.on("codeGenerated", function(message, code) {
    alert(message);
    socket.emit("poznavaiPedal", кюфте);
})

$("#codeInitialSetup2").on("submit", function(e) {
    e.preventDefault();

    let digit1 = e.target.create1.value;
    let digit2 = e.target.create2.value;
    let digit3 = e.target.create3.value;
    let digit4 = e.target.create4.value;

    let code = String(digit1) + String(digit2) + String(digit3) + String(digit4);

    socket.emit("code2", code, кюфте)
})

socket.on("slagaiGerman", function(britishCode, guessedDigits, exactPositions, hasTries, hasWon, level) {
    if (hasWon) {
        console.log(level)
        if (level == 1) {
            $("#levelResult").show();
            $("#nextLevelM").on("click", function(e) {
                e.preventDefault();
                $("#tries").empty();

                socket.emit("nextLevelM", кюфте);
                console.log(level)
                $("#levelResult").hide();
                $("#codeInitialSetup2").show();
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
})

socket.on("slagaiBritish", function(britishCode, guessedDigits, exactPositions, hasTries, hasWon, level) {

    if (hasWon) {
        console.log(level)

        if (level == 1) {
            $("#guessedDigits").hide();
            $("#congratsLevel").show();
            $("#waitLevel2").show();
            socket.on("nextLevelBritish", function() {
                $("#tries").empty();
                $("#congratsLevel").hide();
                $("#waitLevel2").hide();
                $("#guessedDigits").show();
            })
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
})





$("#createGameButton").on("click", function(e) {
    e.preventDefault();

    $("#createJoin").hide();
    $("#createGameForm").show();
})


$("#joinGameButton").on("click", function(e) {
    e.preventDefault();

    $("#createJoin").hide();
    $("#joinGameForm").show();
})

function addRowsToTable(guessedDigits, exactPositions, britishCode) {
    let newRow = triesTableBody.insertRow();
    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);

    cell1.innerHTML = guessedDigits;
    cell2.innerHTML = exactPositions;
    cell3.innerHTML = britishCode;
}

const socket = io();

const createGameForm = document.getElementById("createGameForm");
const createJoin = document.getElementById("createOrJoin");
const createButton = document.getElementById("create");
const joinButton = document.getElementById("join");
const joinGameForm = document.getElementById("joinGameForm");
const roomId = document.getElementById("roomId");
const waitingForPlayer = document.getElementById("waitingForPlayer");
const guessedDigits = document.getElementById("guessedDigits");

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

    socket.emit("setupCode", code);
})

$("#guessedDigits").on("submit", function(e) {
    e.preventDefault();

    let digit1 = e.target.digit1.value;
    let digit2 = e.target.digit2.value;
    let digit3 = e.target.digit3.value;
    let digit4 = e.target.digit4.value;

    let britishCode = String(digit1) + String(digit2) + String(digit3) + String(digit4);

    socket.emit("inputCode", britishCode);
})


socket.on("playerInfoBritish", function(multiGameState) {
    $("#startGame").hide();
    $("#waitStart").hide();
    $("#waitGeneration").show();


})

socket.on("playerInfoGerman", function(multiGameState) {
    $("#startGame").hide();
    $("#codeInitialSetup").show();
    $("#waitStart").hide();

})

socket.on("generateCodeGerman", function(multiGameState, code) {
    alert("Code is OK")
})

socket.on("generateCodeBritish", function(multiGameState, code) {
    $("#waitGeneration").hide();
    $("#guessedDigits").show();
})


if (createButton) {
    createButton.addEventListener("click", function(e) {
        e.preventDefault();

        createJoin.style.display = "none";
        createGameForm.style.display = "block";
    })
}

if (joinButton) {
    joinButton.addEventListener("click", function(e) {
        e.preventDefault();

        createJoin.style.display = "none";
        joinGameForm.style.display = "block";
    })
}

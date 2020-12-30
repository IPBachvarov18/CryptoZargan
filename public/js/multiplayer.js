const socket = io();

const createGameForm = document.getElementById("createGameForm");
const createJoin = document.getElementById("createOrJoin");
const createButton = document.getElementById("create");
const joinButton = document.getElementById("join");
const joinGameForm = document.getElementById("joinGameForm");
const roomId = document.getElementById("roomId");
const waitingForPlayer = document.getElementById("waitingForPlayer");
const guessedDigits = document.getElementById("guessedDigits");
let roleee;
let gameState;



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
        roleee = role

        console.log(nickname, role);

        socket.emit('chooseRole', nickname, role)
        createGameForm.style.display = "none";
    })
}

socket.on("generateId", function(code) {
    waitingForPlayer.style.display = "block";
    roomId.innerText = code;
})

socket.on("playerInfo", function(multiGameState) {


    gameState = multiGameState;
    // console.log("Qshaaa");
    // console.log(multiGameState);
    // if (roleee == "British") {
    //     guessedDigits.style.display = "block";
    //     alert("qjldaf")
    // } else {
    //     alert("Gerols")
    // }
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

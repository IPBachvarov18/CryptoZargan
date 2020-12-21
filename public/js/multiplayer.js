const socket = io();

const createGameForm = document.getElementById("createGameForm");
const createJoin = document.getElementById("createOrJoin");
const createButton = document.getElementById("create");
const joinButton = document.getElementById("join");
const joinGameForm = document.getElementById("joinGameForm");
const roomId = document.getElementById("roomId");
const waitingForPlayer = document.getElementById("waitingForPlayer");
const qshaa = document.getElementById("qshaa");

if (joinGameForm) {
    joinGameForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const nickname = e.target.nickname.value
        const roomId = e.target.gameId.value

        socket.emit("joinRoom", nickname, roomId);
    })
}

socket.on("qsha", function(a) {
    qshaa.innerText = a;
})

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

socket.on("generateId", function(obj) {
    waitingForPlayer.style.display = "block";
    roomId.innerHTML = obj.roomId;

    socket.emit("joinRoom", obj.nickname, obj.role, obj.roomId);
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
const socket = io();

const inputUsername = document.getElementById("inputUsername");
const guessedDigits = document.getElementById("guessedDigits");
const levelActions = document.getElementById("levelActions");
const won = document.getElementById("won");

if (inputUsername) {
    inputUsername.addEventListener("submit", function(e) {
        e.preventDefault();

        inputUsername.style.display = "none";
        guessedDigits.style.display = "block";

        const username = e.target.elements.username.value;
        console.log(username);
        socket.emit('startSingleplayer', username);
    });
}

if (levelActions) {
    levelActions.addEventListener("submit", function(e) {

        e.preventDefault();


        socket.emit("nextLevel");


        guessedDigits.style.display = "block";
        levelResult.style.display = "none";
    });

}



if (guessedDigits) {
    guessedDigits.addEventListener("submit", function(e) {
        e.preventDefault();

        const digit1 = e.target.elements.digit1.value;
        const digit2 = e.target.elements.digit2.value;
        const digit3 = e.target.elements.digit3.value;
        const digit4 = e.target.elements.digit4.value;

        const number = String(digit1) + String(digit2) + String(digit3) + String(digit4);

        console.log(number);

        socket.emit('crackCodeSinglePlayer', number);

    });
}

socket.on("singleplayerAnswer", function(obj) {
    console.log(obj);

    if (obj.hasWon) {
        if (obj.level == 1) {

            guessedDigits.style.display = "none";
            levelResult.style.display = "block";
        } else {
            guessedDigits.style.display = "none";
            won.style.display = "block";
        }

    }


});
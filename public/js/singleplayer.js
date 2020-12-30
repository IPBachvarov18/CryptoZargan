const socket = io();

const inputUsername = document.getElementById("inputUsername");
const guessedDigits = document.getElementById("guessedDigits");
const levelActions = document.getElementById("levelActions");
const won = document.getElementById("won");
const lose = document.getElementById("lose");
const triesTableBody = document.getElementById("triesTable").getElementsByTagName('tbody')[0];
const triesTable = document.getElementById("triesTable");
const difficulty = document.getElementById("difficulty")

$(() => {
    $("#digit1").on("input", () => {
        $("#digit2").focus();
    })

    $("#digit2").on("input", () => {
        $("#digit3").focus();
    })

    $("#digit3").on("input", () => {
        $("#digit4").focus();
    })

    $("#digit4").on("input", () => {
        $("#digit5").focus();
    })

    $("#digit5").on("input", () => {
        $("#submit").focus();
    })

    setTimeout(() => {
        $("#singlePlayerUsername").focus();
    }, 100)
})



if (inputUsername) {
    inputUsername.addEventListener("submit", function(e) {
        e.preventDefault();

        inputUsername.style.display = "none";

        difficulty.style.display = "block";
        const username = e.target.elements.username.value;

        $("#easy").on("click", () => {
            difficulty.style.display = "none";
            socket.emit('startSingleplayer', username, "easy");
            guessedDigits.style.display = "block";
            triesTable.style.display = "block";
            $("#digit4").hide();
            $("#digit5").hide();
        })

        $("#medium").on("click", () => {
            difficulty.style.display = "none";
            socket.emit('startSingleplayer', username, "medium");
            guessedDigits.style.display = "block";
            $("#digit5").hide();
            triesTable.style.display = "block";
        })

        $("#hard").on("click", () => {
            difficulty.style.display = "none";
            socket.emit('startSingleplayer', username, "hard");
            guessedDigits.style.display = "block";
            triesTable.style.display = "block";
            $("#digit5").show()
        })

        console.log(username);
        $("#digit1").focus();
    });

}

if (levelActions) {
    levelActions.addEventListener("submit", function(e) {

        e.preventDefault();

        socket.emit("nextLevel");

        guessedDigits.style.display = "block";
        levelResult.style.display = "none";
        triesTableBody.innerHTML = "";
    });

}


let number;

if (guessedDigits) {
    guessedDigits.addEventListener("submit", function(e) {
        e.preventDefault();

        const digit1 = e.target.elements.digit1.value;
        const digit2 = e.target.elements.digit2.value;
        const digit3 = e.target.elements.digit3.value;
        const digit4 = e.target.elements.digit4.value;
        const digit5 = e.target.elements.digit5.value;

        number = String(digit1) + String(digit2) + String(digit3) + String(digit4) + String(digit5);

        console.log(number);

        socket.emit('crackCodeSinglePlayer', number);

        e.target.elements.digit1.value = "";
        e.target.elements.digit2.value = "";
        e.target.elements.digit3.value = "";
        e.target.elements.digit4.value = "";

        e.target.elements.digit1.focus();
    });
}

socket.on("singleplayerMediumAnswer", function(obj) {
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

    if (!obj.hasTries) {
        lose.style.display = "block";
        guessedDigits.style.display = "none";
        triesTable.style.display = "none";

    }

    displayTries(obj);


});

function displayTries(obj) {

    let newRow = triesTableBody.insertRow();
    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);

    cell1.innerHTML = obj.guessedDigits;
    cell2.innerHTML = obj.guessedPosition;
    cell3.innerHTML = number;
}
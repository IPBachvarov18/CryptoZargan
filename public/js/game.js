'use strict'

/*
   Generate unique random number
   @param {object} blacklister Array with blacklisted digits
   @return {Number} Unique random number 
*/

let gamesInProgress;

const uuid = require("uuid");


function getTrulyRandomNumber(blacklister = []) {
    let randNumber;

    do {

        randNumber = Math.floor(Math.random() * 8);
    } while (blacklister.indexOf(randNumber) != -1);

    return randNumber;
}

// let digits_ = [];

// digits_.push(getTrulyRandomNumber([0]));
// digits_.push(getTrulyRandomNumber(digits_));
// digits_.push(getTrulyRandomNumber(digits_));
// digits_.push(getTrulyRandomNumber(digits_));

//console.log(digits);


function isThereDuplicates(arr) {

    for (let i = 0; i < arr.length; i++) {

        for (let j = i + 1; j < arr.length; j++) {

            if (arr[i] == arr[j]) {

                return true;
            }
        }
    }
    return false;
}

/*
   Checks if user input is valid
   @param {object} inputDigits Array with user input
   @return {boolean} Is correct or no 
*/
function checkUserInput(inputDigits = []) {

    let whiteList = [0, 1, 2, 3, 4, 5, 6, 7];
    let correctDigit = 0;

    for (let i = 0; i < inputDigits.length; i++) {

        for (let j = 0; j < whiteList.length; j++) {

            if (inputDigits[i] == whiteList[j]) {

                correctDigit++;
            }
        }
    }

    if (correctDigit == 4 &&
        inputDigits[0] != 0 &&
        !isThereDuplicates(inputDigits)) {

        return true;
    }

    return false;

};

function calculatesGuessedDigits(inputDigits, digits) {

    let guessed = 0;


    for (let i = 0; i < inputDigits.length; i++) {

        if (digits.indexOf(inputDigits[i]) != -1) {

            guessed++;
        }
    }

    return guessed;

}

//console.log(calculatesGuessedDigits("1234", "5634"));

function calculateExactPositions(inputDigits, digits) {

    let guessedPosition = 0;

    for (let i = 0; i < inputDigits.length; i++) {

        if (inputDigits[i] == digits[i]) {

            guessedPosition++;
        }
    }

    return guessedPosition;
}

function checkGuessedNumber(inputDigits = [], digits = []) {

    let isCorrect = checkUserInput(inputDigits);
    let guessedDigits = calculatesGuessedDigits(inputDigits, digits)
    let guessedPositions = calculateExactPositions(inputDigits, digits);

    let result = {
        Valid: isCorrect,
        Match: guessedDigits,
        Exact: guessedPositions
    };

    return result;

}

function startGame() {

    let id = uuid.v4();

    let digits = [];

    digits.push(getTrulyRandomNumber(digits));
    digits.push(getTrulyRandomNumber(digits));
    digits.push(getTrulyRandomNumber(digits));
    digits.push(getTrulyRandomNumber(digits));


    let number = "";

    for (let i = 0; i < 4; i++) {

        number += String(digits[i]);
    }


    // Dictionary
    gamesInProgress[id] = {

        generatedCode: number,
        guesses: []
    }

    console.log(gamesInProgress);
}

function getGuessedData(id) {

    let renderData = [];

    for (let i = 0; i < gamesInProgress[id].guesses.length; i++) {

        let currGuess = gamesInProgress[id].guesses[i];
        let currNum = gamesInProgress[id].generatedCode;

        renderData.push({
            guess: currGuess,
            matches: calculatesGuessedDigits(currGuess, currNum),
            exactMatches: calculateExactPositions(currGuess, currNum)
        });
    }

    return renderData;

}




// DONT GLEDA
//console.log(checkUserInput([1, 2, 3, 4]));
//console.log(calculatesGuessedDigits([1, 2, 0, 7], [1, 2, 7, 0]));
//console.log(calculateExactPositions([1, 2, 7, 0], [1, 2, 7, 0]));

//console.log(checkGuessedNumber([1, 3, 7, 0], [1, 2, 7, 0]));

/*function checkDigits(digits) {
    let isValid = true;

    while (digits[0] == 0) {
        digits[0] = Math.floor(Math.random() * 8);
    }

    for (let i = 0; i < 4; i++) {
        for (let j = i + 1; j < 4; j++) {

            if (digits[i] == digits[j]) {
                let digit;
                isValid = true;
                while (isValid) {
                    digit = Math.floor(Math.random() * 8);
                    while (digit == 0) {
                        digit = Math.floor(Math.random() * 8);
                    }

                    if (digits.indexOf(digit) == -1 || digit == 0) {
                        isValid = false;
                    }
                }
                digits[i] = digit;
//Excel Kadriev 
            }
        }
    }
    return digits;
}*/
'use strict'

let gamesInProgress;

const uuid = require("uuid");

/*
   Generate unique random number
   @param {object} blacklister Array with blacklisted digits
   @return {Number} Unique random number 
*/
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

/*
   Calculate guessed digits, 
   @param {string} inputDigits the input of the user
   @param {string} digits the correct code
   @return {Number} The number of guessed digits
*/
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

/*
   Calculate exact positions,
   @param {string} inputDigits the input of the user
   @param {string} digits the correct code
   @return {Number} The number of digits on exact positions
*/
function calculateExactPositions(inputDigits, digits) {

    let guessedPosition = 0;

    for (let i = 0; i < inputDigits.length; i++) {

        if (inputDigits[i] == digits[i]) {

            guessedPosition++;
        }
    }

    return guessedPosition;
}

/*
   Initialise game session, 
   @return {String} Generated ID of the game
*/
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

/*
   Process user's data, 
   @param {string} Generated ID of the game
   @return {Object} Returns object with user's guess, matches and exact matches
*/
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
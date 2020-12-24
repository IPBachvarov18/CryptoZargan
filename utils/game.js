'use strict'

let gamesInProgress;

const uuid = require('uuid');

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

/*
   Calculate guessed digits, 
   @param {string} inputDigits the input of the user
   @param {string} digits the correct code
   @return {Number} The number of guessed digits
*/
function calculatesGuessedDigits(inputDigits, digits) {

    let guessed = 0;
    if (!inputDigits || !digits) {
        return {};
    }

    for (let i = 0; i < inputDigits.length; i++) {

        if (digits.indexOf(inputDigits[i]) != -1) {

            guessed++;
        }
    }

    return guessed;

}


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

function checkUserInput(input) {

    if (input.length > 4) {
        return false;
    }

    let usedDigits = '';

    for (let i = 0; i < input.length; i++) {
        if (input[i] <= '0' || input[i] >= '7') {
            return false;
        }

        if (usedDigits.indexOf(input[i]) != -1) {
            return false;
        }

        usedDigits += input[i];
    }

    return true;
}

function processTurn(input) {

    console.log(input);
}

/*
   Initialise game session, 
   @return {String} Generated ID of the game
*/
// function startGame() {

//     let id = uuid.v4();

//     let digits = [];

//     digits.push(getTrulyRandomNumber(digits));
//     digits.push(getTrulyRandomNumber(digits));
//     digits.push(getTrulyRandomNumber(digits));
//     digits.push(getTrulyRandomNumber(digits));


//     let number = '';

//     for (let i = 0; i < 4; i++) {

//         number += String(digits[i]);
//     }


//     // Dictionary
//     gamesInProgress[id] = {

//         generatedCode: number,
//         guesses: []
//     }

//     //console.log(gamesInProgress);
// }


function generateCode() {

    let digits = [];

    digits.push(getTrulyRandomNumber(digits));
    digits.push(getTrulyRandomNumber(digits));
    digits.push(getTrulyRandomNumber(digits));
    digits.push(getTrulyRandomNumber(digits));


    let code = '';

    for (let i = 0; i < 4; i++) {

        code += String(digits[i]);
    }

    return code;
}

function generateRepetitiveCode() {
    let randNumber1 = Math.floor(Math.random() * 8);
    let randNumber2 = Math.floor(Math.random() * 8);
    let randNumber3 = Math.floor(Math.random() * 8);
    let randNumber4 = Math.floor(Math.random() * 8);

    let code = String(randNumber1) + String(randNumber2) +
        String(randNumber3) + String(randNumber4);

    return code;
}

/*
   Process user's data, 
   @param {string} Generated ID of the game
   @return {Object} Returns object with user's guess, matches and exact matches
*/
// function getGuessedData(id) {

//     let renderData = [];

//     for (let i = 0; i < gamesInProgress[id].guesses.length; i++) {

//         let currGuess = gamesInProgress[id].guesses[i];
//         let currNum = gamesInProgress[id].generatedCode;

//         renderData.push({
//             guess: currGuess,
//             matches: calculatesGuessedDigits(currGuess, currNum),
//             exactMatches: calculateExactPositions(currGuess, currNum)
//         });
//     }

//     return renderData;
// }

exports.generateCode = generateCode;
exports.calculateExactPositions = calculateExactPositions;
exports.calculatesGuessedDigits = calculatesGuessedDigits;
exports.generateRepetitiveCode = generateRepetitiveCode;
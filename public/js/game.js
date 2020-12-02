'use strict'

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

let digits = [];

digits.push(getTrulyRandomNumber([0]));
digits.push(getTrulyRandomNumber(digits));
digits.push(getTrulyRandomNumber(digits));
digits.push(getTrulyRandomNumber(digits));

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

console.log(checkUserInput([1, 2, 3, 4]));
console.log(typeof(true));

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

            }
        }
    }
    return digits;
}*/
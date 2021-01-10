"use strict";

let gamesInProgress;

const uuid = require("uuid");

/**
 * Generates an unique random number.
 *
 * @param {object} blacklister An array with blacklisted digits.
 * @return {number} randNumber An unique random number.
 */
function getTrulyRandomNumber(blacklister = []) {
	let randNumber;

	do {
		randNumber = Math.floor(Math.random() * 8);
	} while (blacklister.indexOf(randNumber) != -1);

	return randNumber;
}

/**
 * Calculates guessed digits.
 *
 * @param {string} inputDigits The input of the user.
 * @param {string} digits The digits of the correct code.
 * @return {number} guessed The number of guessed digits.
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

/**
 * Calculates exact positions.
 *
 * @param {string} inputDigits The input of the user.
 * @param {string} digits The digits of the correct code.
 * @return {number} guessedPosition The number of digits on exact positions.
 */
function calculateExactPositions(inputDigits, digits) {
	let guessedPosition = 0;
	//let allowedNumbers = "/^[0-7]+$/"
	for (let i = 0; i < 4; i++) {
		if (inputDigits[i] < "0" || inputDigits[i] > "7") {
			return 0;
		}
	}
	for (let i = 0; i < inputDigits.length; i++) {
		if (inputDigits[i] == digits[i]) {
			guessedPosition++;
		}
	}

	return guessedPosition;
}

/**
 * Generates a code for task 1.
 *
 * @param {number} length The length of the code that has to be generated.
 * @return {number} code Returns the code that has been converted as a string.
 */
function generateCode(length) {
	let digits = [];

	for (let i = 0; i < length; i++) {
		digits.push(getTrulyRandomNumber(digits));
	}
	let code = "";

	for (let i = 0; i < length; i++) {
		code += String(digits[i]);
	}

	return code;
}

/**
 * Generates a code for task 2.
 *
 * @param {number} length The length of the code that has to be generated.
 * @return {number} code Returns the code that has been converted as a string.
 */
function generateRepetitiveCode(length) {
	let digits = [];

	for (let i = 0; i < length; i++) {
		digits.push(Math.floor(Math.random() * 8));
	}

	let code = "";

	for (let i = 0; i < length; i++) {
		code += String(digits[i]);
	}

	return code;
}

/**
 * Checks if the user's input is valid.
 *
 * @param {string} input The input of the user.
 * @return {boolean} Returns true or false.
 */
function checkInput(input) {
	if (input.length != 4) {
		return false;
	}

	let usedDigits = "";

	for (let i = 0; i < input.length; i++) {
		if (input[i] < "0" || input[i] > "7") {
			return false;
		}

		if (usedDigits.indexOf(input[i]) != -1) {
			return false;
		}

		usedDigits += input[i];
	}

	return true;
}

function checkInputTaskTwo(input) {
	if (input.length != 4) {
		return false;
	}

	for (let i = 0; i < input.length; i++) {
		if (input[i] < "0" || input[i] > "7") {
			return false;
		}
	}

	return true;
}

exports.generateCode = generateCode;
exports.calculateExactPositions = calculateExactPositions;
exports.calculatesGuessedDigits = calculatesGuessedDigits;
exports.generateRepetitiveCode = generateRepetitiveCode;
exports.checkInput = checkInput;
exports.checkInputTaskTwo = checkInputTaskTwo;

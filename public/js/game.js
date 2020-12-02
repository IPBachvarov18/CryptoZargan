function generateRandomNumbers() {

    let digits = [
        Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 8)
    ];

    return digits;
}


function checkDigits(digits) {
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
}

let digits = generateRandomNumbers()
console.log(`Original ${digits}`);
let smDigits = checkDigits(digits);
console.log(`Checked ${smDigits}`);



//turciq
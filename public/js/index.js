const socket = io();

const guessedDigits = document.getElementById("guessedDigits");

const username = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

console.log(username);

if (guessedDigits) {
    guessedDigits.addEventListener("submit", function(e) {
        e.preventDefault();

        const digit1 = e.target.elements.digit1.value;
        const digit2 = e.target.elements.digit2.value;
        const digit3 = e.target.elements.digit3.value;
        const digit4 = e.target.elements.digit4.value;

        const number = String(digit1) + String(digit2) + String(digit3) + String(digit4);

        console.log(number);

        socket.emit('crackCode', number);
    });
}
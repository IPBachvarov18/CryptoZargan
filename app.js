const express = require("express");
const bodyParser = require("body-parser");
const game = require("./public/js/game.js")

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));



app.get("/", function(req, res) {

    res.render("index.ejs");
});

app.get("/game", function(req, res) {

    res.render("game.ejs");
});

app.get("/about", function(req, res) {

    res.render("about.ejs");
});

app.get("/contact", function(req, res) {

    res.render("contact.ejs");
})

app.post("/game", function(req, res) {

    let data = req.body;
    let guess = data.digit_1 + data.digit_2 + data.digit_3 + data.digit_4;
    game.getUserInput(guess);
    res.redirect("/");
});

app.get("*", function(req, res) {

    res.send("Page not found! Error 404");
})

app.listen(6969, () => {

    console.log("Server started on port 6969");
});
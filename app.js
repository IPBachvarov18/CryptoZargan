const express = require("express");
const app = express();


app.get("/", function(req, res){
    res.render("index.ejs");
});

app.get("*", function(req, res){
    res.send("Page not found! Error 404");
})

app.listen(6969, ()=>{
    console.log("Server started on port 6969");
});





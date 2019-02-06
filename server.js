// Require our dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");
//Set up our port 
var PORT = process.env.PORT || 3000;

//Start Express App
var app = express();

//Set up an Express Router
var router = express.Router ();

//Require routes file to pass through router object
require("./config/routes")(router);

//Set up Public Folder as a static directory
app.use(express.static(__dirname + "/public"));

//Connect Handlebars
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine","handlebars");

//bodyParser
app.use(bodyParser.urlencoded({
    extended: false
}));

//Router middleware
app.use(router);

var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadLines";

//Connect Mongoose
mongoose.connect(db, function(error){
    if(error){
        console.log(error);
    }
    else{
        console.log("mongoose connection is working");
    }
});

//Listen on PORT
app.listen(PORT, function(){
    console.log("Listening on port:" + PORT);
});
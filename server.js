var express = require("express"),
    path = require("path"),
    port = 8000,
    app = express(),
    server = app.listen(port),
    mongoose = require("./config/mongoose.js"),
    session = require("express-session");

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public/dist/public"));
app.use(session({
    secret : "xd",
    resave : false,
    saveUninitialized : true
}));
require("./config/routes.js")(app);

var express = require("express"),
    path = require("path"),
    port = 8000,
    app = express(),
    server = app.listen(port),
    mongoose = require("./config/mongoose.js");

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public/dist/public"));
require("./config/routes.js")(app);

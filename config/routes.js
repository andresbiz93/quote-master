var controller = require("./../controllers/controller.js");
var path = require("path");

module.exports = function(app){
    app.get("/random_quotes", controller.random_quotes);
    app.get("/logged_player", controller.logged_player);
    app.get("/player_info", controller.player_info);
    app.post("/log_in", controller.log_in);
    app.get("/log_out", controller.log_out);
    app.post("/create_player", controller.create_player);
    app.post("/add_score", controller.add_score);
    app.post("/change_favorite", controller.change_fav);
    app.all("*", (req, res, next) => {
        res.sendFile(path.resolve("../project_v2/public/dist/public/index.html"));
    });
}
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ScoreSchema = new mongoose.Schema({

    wpm : {
        type : Number,
        min : 0,
    },

    tpm : {
        type : Number,
        min : 0,
    },

    player_id : {
        type : Schema.Types.ObjectId,
        ref : "Player"
    }

}, {timestamps : true});

var Score = new mongoose.model("Score", ScoreSchema);

module.exports = Score;
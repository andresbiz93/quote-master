var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ScoreSchema = new mongoose.Schema({

    //words per minute
    wpm : {
        type : Number,
        min : 0,
    },

    //typos per minute
    tpm : {
        type : Number,
        min : 0,
    },

    //the player who got this score
    player_id : {
        type : Schema.Types.ObjectId,
        ref : "Player"
    }

}, {timestamps : true});
//timestamps will help us graph and catalogue scores within tables

var Score = new mongoose.model("Score", ScoreSchema);

module.exports = Score;
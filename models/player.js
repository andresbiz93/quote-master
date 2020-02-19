var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PlayerSchema = new mongoose.Schema({

    username : {
        type : String,
        required : true,
        minlength : 4
    },

    password : {
        type : String,
        required : true,
        minlength : 4
    },

    //used for the profile summary
    avg_tpm : {
        type : Number,
        required : false,
    },

    //used for the profile summary
    avg_wpm : {
        type : Number,
        required : false,
    },

    //keeps track of score id's so that we can access all of them later
    scores : [{
        type : Schema.Types.ObjectId,
        ref : "Score",
        required : false
    }],

    //Keeps track of completed quote id's so that we can access all of them later
    completed_quotes : [{
        type : Object,
        required : false
    }],

    //not currently used****
    is_admin : {
        type : Boolean,
        required : true,
        default : false
    }

}, {timestamps : true});

var Player = new mongoose.model("Player", PlayerSchema);

module.exports = Player;
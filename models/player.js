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

    avg_tpm : {
        type : Number,
        required : false,
    },

    avg_wpm : {
        type : Number,
        required : false,
    },

    scores : [{
        type : Schema.Types.ObjectId,
        ref : "Score",
        required : false
    }],

    completed_quotes : [{
        type : Object,
        required : false
    }],

    is_admin : {
        type : Boolean,
        required : true,
        default : false
    }

}, {timestamps : true});

var Player = new mongoose.model("Player", PlayerSchema);

module.exports = Player;
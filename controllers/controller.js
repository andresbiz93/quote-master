var Player = require("../models/player.js");
var Score = require("../models/score.js");
var bcrypt = require("bcrypt");
var session = require("express-session");
var fs = require("fs"),
    file_data = fs.readFileSync("./public/src/assets/Database-Quotes-JSON/quotes.json"),
    all_quotes = JSON.parse(file_data);

module.exports = {

    //*******LOGIN/REGISTRATION-RELATED FUNCTIONS:

    log_in : function(req, res){
        console.log("LOGIN", req.body.username, req.body.password);
        Player.findOne({"username" : req.body.username})
        .then(found_player => {
            //if a player that has the provided username does not exist
            if(!found_player){
                var error = {errors : {not_found : "Player with that username does not exist."}}
                res.json(error);
            }
            else{
                bcrypt.compare(req.body.password, found_player.password)
                .then(result => {
                    if(result){
                        session.player_id = found_player._id;
                        result = {player_id : session.player_id};
                        res.json(result);
                    }
                    else{
                        error = {errors : {wrong_pw : "Password does not match"}};
                        res.json(error);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
    },

    log_out : function(req, res){
        session.player_id = false;
        var result = {player_id : false};
        res.json(result);
    },

    logged_player : function(req, res){
        var result = {player_id : false};
        if(session.player_id){
            result.player_id = session.player_id;
        }
        res.json(result);
    },

    player_info : function(req, res){
        Player.findOne({_id : session.player_id})
        .then(found_player => {
            console.log("PLYR INFO FROM DB", found_player);
            //Grabbing info from the player instance to send back
            var result = {username : found_player.username, scores : found_player.scores, quotes : [], avg_wpm : found_player.avg_wpm, avg_tpm : found_player.avg_tpm};
            console.log("RESULT PRE LOOP", result);
            //Since only id's and favorite status are stored on the player instance, need to join that info with the quote text/author so the component can use it all together
            for(i = 0; i < found_player.completed_quotes.length; i++){
                var quote_obj = {quote : undefined, id : undefined, is_favorite : undefined};
                quote_obj.quote = all_quotes[found_player.completed_quotes[i].id];
                quote_obj.id = found_player.completed_quotes[i].id;
                quote_obj.is_favorite = found_player.completed_quotes[i].is_favorite;
                console.log("QUOTE OBJ", quote_obj);
                result.quotes.push(quote_obj);
            }
            //Component will now have all necessary info
            console.log("RESULT POST LOOP", result);
            Score.find({player_id : found_player._id})
            .then(found_scores => {
                result.scores = found_scores;
                res.json(result);
            })
            .catch(err => {
                res.json(err);
            })
            //res.json(result);
        })
        .catch(err => {
            res.json(err);
        })
    },

    create_player : function(req, res){
        console.log("REGISTRY", req.body.username, req.body.password, req.body.conf_pw);



        if(req.body.password.length < 5 || req.body.username.length < 5){
            console.log("Password is too short");
            var error = {errors : {validation : "Username and password must be at least 5 characters long"}};
            res.json(error);
        }

        //Check if password and password confirmation match
        if(req.body.password != req.body.conf_pw){
            console.log("Passwords don't match");
            var error = {errors : {mismatch : "Password and Password Confirmation Don't Match"}};
            res.json(error);
        }
        
        //add catch statements?*****

        //Find any players with an username that matches the one provided in the form
        Player.find({username : req.body.username})
        .then(found_player => {

            //If there's already a player with that username, throw an error
            if(found_player.length > 0){
                console.log("Duplicate username");
                var error = {errors : {duplicate : "This username is already taken"}};
                res.json(error);

            }
            //if no such player exists, create a new player
            else{
                console.log("Creating new player");
                console.log("PW", req.body.password);
                bcrypt.hash(req.body.password, 10)
                .then(hashed_pw => {
                    console.log("HASHED PW", hashed_pw);
                    var new_player = new Player();
                    new_player.username = req.body.username;
                    new_player.password = hashed_pw;
                    new_player.scores = [];
                    new_player.completed_quotes = [];
                    new_player.avg_wpm = 0;
                    new_player.avg_tpm = 0;
                    new_player.admin = false;
                    new_player.save()
                    .then(saved_player => {
                        session.player_id = saved_player._id;
                        console.log("Creating session with ID", session.player_id);
                        result = {player_id : session.player_id};
                        res.json(result);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                })
                .catch(err => {
                    console.log(err);
                })
            }
            
        })
        .catch(err => {
            console.log(err);
        })
    },

    //*******GAME-RELATED FUNCTIONS

    random_quotes : function(req, res){
        //Want to find the quotes that the player has already completed, so that the ones we send back are all new
        Player.findOne({_id : session.player_id})
        .then(player_info => {
            console.log("SERVER PLYR INFO", player_info);
            var quotes = [];
            //pass indexes back to game as well. This way we can store the player's completed quotes as indexes instead of having to store the whole quote for each player.
            var indexes = [];
            while(quotes.length < 15){
                var index = Math.floor(Math.random() * all_quotes.length);
                var add = true;
                for(var i = 0; i < player_info.completed_quotes.length; i++){
                    if(index == player_info.completed_quotes[i].id){
                        add = false;
                    }
                }
                //If the random index is not found within the player's completed quotes, add it to the list to be sent back
                if(add){
                    console.log(index);
                    quotes.push(all_quotes[index]);
                    indexes.push(index);
                }
            }
            var result = {quotes : quotes, indexes : indexes};
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        })

    },

    add_score : function(req, res){
        console.log("REQ BODY", req.body);
        var words_per_minute = req.body.words_per_minute;
        var typos_per_minute = req.body.typos_per_minute;
        var quotes = []; 
        for(var i = 0; i < req.body.quotes.length; i++){
            var x = {id : req.body.quotes[i], is_favorite : false};
            quotes.push(x)
        }
        //build new score based off posted stats and save
        var new_score = new Score();
        new_score.wpm = words_per_minute;
        new_score.tpm = typos_per_minute;
        console.log("SESSION ID", session.player_id);
        new_score.player_id = session.player_id;
        console.log("NEW SCORE", new_score);
        new_score.save()
        .then(saved_score => {
            console.log("SAVED SCORE", saved_score);
            //adding the score to the associated player
            Player.findOne({_id : session.player_id})
            .then(found_player => {
                var new_avg_wpm;
                var new_avg_tpm;

                //Updating player's avg_wpm. Initial value upon creation is 0
                if(found_player.avg_wpm == 0 || found_player.avg_wpm == undefined){
                    new_avg_wpm = saved_score.wpm;
                }
                else{
                    new_avg_wpm = ((found_player.avg_wpm*found_player.scores.length) + saved_score.wpm)/(found_player.scores.length + 1);
                }

                //Updating player's avg_tpm. Initial value upon creation is 0
                if(found_player.avg_tpm == 0 || found_player.avg_tpm == undefined){
                    new_avg_tpm = saved_score.tpm;
                }
                else{
                    new_avg_tpm = ((found_player.avg_tpm*found_player.scores.length) + saved_score.tpm)/(found_player.scores.length + 1);
                }

                console.log("NEW AVG WPM", new_avg_wpm, "NEW AVG TPM", new_avg_tpm);

                //Update player stats and push new score and completed quotes into respective arrays
                Player.updateOne({_id : session.player_id}, {$push : {scores : saved_score, completed_quotes : {$each : quotes}}, avg_wpm : new_avg_wpm, avg_tpm : new_avg_tpm})
                .then(updated_player => {
                    res.json(updated_player);
                })
                .catch(err => {
                    res.json(err);
                })
            })
            .catch(err => {
                res.json(err);
            })
        })
        .catch(err => {
            res.json(err);
        })
    },
    
    change_fav : function(req, res){
        console.log("ADD FAVORITE REQ", req.body.id);
        var index;
        //we find the player, and look through its quotes to find one with a matching id
        Player.findOne({_id : session.player_id})
        .then(found_player => {
            console.log("FOUND PLAYER QUOTES", found_player.completed_quotes);
            for(var i = 0; i < found_player.completed_quotes.length; i++){
                if(found_player.completed_quotes[i].id == req.body.id){
                    console.log("FOUND QUOTE TO FAV");
                    //once one with a matching id is found, change its favorite status
                    found_player.completed_quotes[i].is_favorite = !found_player.completed_quotes[i].is_favorite;
                    index = i;
                    break;
                }
            }
            //grab the updated instance of completed_quotes and use it to update the player - save() doesn't work for this somehow
            var update = found_player.completed_quotes;
            console.log(update);
            Player.updateOne({_id : found_player._id}, {completed_quotes : update})
            .then(update_result => {
                console.log("FAV UPDATE RESULT", found_player.completed_quotes[index]);
                res.json(found_player.completed_quotes[index]);
            })
            .catch(err => {
                res.json(err);
            })
        })
        .catch(err => {
            res.json(err);
        })

    },

}
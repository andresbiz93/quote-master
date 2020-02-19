import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {
  quotes : any = [];
  master_indexes : any = [];
  quote_to_show : any;
  index : any;
  values = "";
  user_input = "";
  time_to_show : Object = {minutes : 3, seconds : 0};
  game_start : Boolean;
  game_over : Boolean;
  total_time : number;
  timer : any;
  character_counter : number;
  typo_counter : number;
  has_typo : boolean;
  completion_error : boolean;
  final_wpm : number;
  final_tpm : number;
  @ViewChild("quote_text", {static : false}) target_quote;
  @Output() prompt_reload = new EventEmitter();

  constructor(private _httpService : HttpService, private _router : Router) { }

  //Check whether there is somebody logged in or not.
  ngOnInit() {
    let observable = this._httpService.getLoggedPlayer();
    observable.subscribe(data => {
      console.log("PROFILE ONINIT", data);
      //if a player is not logged in, redirect to login page
      if(data["player_id"] == false){
        this._router.navigate(["/login"]);
      }
      else{
        this.game_start = false;
        this.game_over = false;
      }
    })
  }

  //Pull a number of random quotes from the quote bank and call functions to get the game started.
  getRandomQuotesFromService(){
    let observable = this._httpService.getQuotes();
    observable.subscribe(data => {
      console.log("QUOTES", data["quotes"]);
      //separating the quote author and text from the quote indexes as they relate to the master list
      this.quotes = data["quotes"];
      this.master_indexes = data["indexes"];
      console.log("MASTER INDEXES", this.master_indexes);
      this.game_start = true;
      this.game_over = false;
      this.index = 0;
      this.character_counter = 0;
      this.typo_counter = 0;
      this.has_typo = false;
      this.completion_error = false;
      //timer will be one minute
      this.total_time = 1;
      this.final_wpm = 0;
      this.final_tpm = 0;
      this.startTimer();
      this.showNextQuote();
    })
  }

  //Upon pressing the enter key, see if the user input matches the given quote. If so, get next quote - otherwise, error.
  checkCompletion(){
    if(this.user_input == this.quote_to_show.quoteText){
      console.log("USER INPUT MATCHES");
      this.completion_error = false;
      //loads next quote
      this.showNextQuote();
    }
    else{
      //displays an error on game screen
      console.log("USER INPUT DOES NOT MATCH");
      this.completion_error = true;
    }
  }

  //Cycle to next quote in the list. If no more quotes left, it's game over.
  showNextQuote(){
    if(this.index < this.quotes.length){
      if(this.index > 0){
        //adds the total number of characters in the previous (completed) quote's text to the total character counter
        this.character_counter += this.quotes[this.index - 1].quoteText.length;
      }

      //shows the new quote on screen
      this.quote_to_show = this.quotes[this.index];
      var target = document.getElementById("quote_text");
      if(target){
        //displays the quote text
        target.textContent = this.quote_to_show.quoteText;
      }
      //moves the index for the next quote by one
      this.index += 1;
      //resets player input to blank
      this.user_input = "";
    }
    else{
      this.gameOver();
    }
  }

  //Every time that the user presses and lifts off a key, check whether it matches the quote so far
  onKeyUp(){
    var in_length = this.user_input.length;
    var comparison_string = "";

    //Want to have an input to begin with if we're gonna check it against the quote
    if(in_length > 0){
      //Checking two strings of the same length - we get a substring of the quote based on the length of input
      comparison_string = this.quote_to_show.quoteText.substring(0,in_length);

      //If input so far does not equal 
      if(this.user_input != comparison_string){
        //we flash the typo warning
        this.has_typo = true;
      }
      else{
        //we only add to the typo counter once the user input re-matches the quote. This is to not double-count a set of typos/fatfingering
        if(this.has_typo){
          this.typo_counter++;
        }
        this.has_typo = false;
        
        //we modify the target element to remove portions of the quote that are already completed - only the part of the quote that remains to be typed is displayed
        var to_edit = document.getElementById("quote_text");
        to_edit.textContent = this.quote_to_show.quoteText.substring(in_length, this.quote_to_show.quoteText.length);
      }
    }
    else{
      //if the player cleared the input box and there was a typo flag active, want to incr typo counter and reset typo flag to false
      if(this.has_typo){
        this.typo_counter++;
      }
      this.has_typo = false;
    }
  }

  //subscribe to a timer that ticks every second. Every tick decreases the initial time value down by 1, once it hits zero it's game over.
  startTimer(){
    var time = this.total_time * 60;
    this.timer = timer(0,1000).subscribe(ellapsed_cycles => {
      if(this.game_start){
        time -= 1;
        this.time_to_show = this.getDisplayTimer(time);
        if(time == 0){
          this.gameOver();
        }
      }
    });
  }

  //do calculations to get minutes and seconds of time left in game
  getDisplayTimer(time : number){
    var minutes = Math.floor(time % 3600 / 60);
    var seconds = Math.floor(time % 3600 % 60);
    var display_time = {minutes : minutes, seconds : seconds};
    return display_time;
  }

  //unsubscribe from timer and set state variables to false - game is over
  gameOver(){

    //Want to grab any characters that the player typed but were not submitted due to lack of quote completion

    var last_input = this.user_input;
    var quote_text = this.quote_to_show.quoteText;

    //If the typed characters are correct, they should count towards WPM

    for(var i = 0; i < quote_text.length; i++){
      if(i > last_input.length - 1){
        break;
      }
      else{
        if(last_input.charAt(i) == quote_text.charAt(i)){
          this.character_counter++;
        }
      }
    }

    //End timer subscription and reset input to blank
    this.timer.unsubscribe();
    this.user_input = "";

    //set game state variables to false - game is not running
    this.quote_to_show = false;
    this.game_start = false;

    //divide total words over game time to get words per minute and total typos over game time for typos per minute
    //Need to capture case where player finishes all quotes before time is up?*****
    
    //The number of words typed is standardized as (total number of characters typed divided by 5)
    var wpm = (this.character_counter/5)/this.total_time;
    var tpm = this.typo_counter/this.total_time;
    
    this.final_wpm = wpm;
    this.final_tpm = tpm;

    //get the quotes that the player completed
    var completed_quote_indexes = [];
    if(this.index > 0){
      completed_quote_indexes = this.master_indexes.slice(0,this.index - 1);
      console.log("COMPLETED QUOTES", completed_quote_indexes);
    }

    //collect the score and send to server
    var score = {words_per_minute : wpm, typos_per_minute : tpm, quotes : completed_quote_indexes};
    let observable = this._httpService.postScore(score);
    observable.subscribe(data => {
      console.log("SERVER RESPONSE TO SCORE", data);
      //emitting to profile component so that it reloads player data - this will update the avg wpm/tpm, completed quotes, scores, graph
      this.prompt_reload.emit();
      this.game_over = true;
      this.game_start = false;
    })
  }

}

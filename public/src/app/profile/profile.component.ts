import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username : String;
  quotes : any [];
  scores : any [];
  wpm_to_show : String;
  tpm_to_show : String;
  quote_num_to_show : number;
  quote_completion_to_show : String;
  is_quote_list : Boolean;
  is_scoreboard : Boolean;
  is_play : Boolean;
  is_loaded : Boolean;
  current_player : any;

  constructor(private _httpService : HttpService, private _router : Router) { }

  ngOnInit() {
    this.is_quote_list = true;
    this.is_scoreboard = false;
    this.is_play = false;
    this.is_loaded = false;
    let observable = this._httpService.getLoggedPlayer();
    observable.subscribe(data => {
      console.log("PROFILE ONINIT", data);
      if(data["player_id"] == false){
        this._router.navigate(["/login"]);
      }
      else{
        this.getPlayerInfo();
      }
    })
  }

  printParent(){
    console.log(this.quotes);
  }

  getPlayerInfo(){
    let observable = this._httpService.getPlayerInfo();
    observable.subscribe(data => {
      console.log("PLYR INFO", data);
      //grabbing player info and sending to variables used by template
      this.username = data["username"];
      this.quotes = data["quotes"];
      this.quote_num_to_show = this.quotes.length;
      this.quote_completion_to_show = ((this.quote_num_to_show/1636) * 100).toFixed(1);
      this.scores = data["scores"];
      this.wpm_to_show = data["avg_wpm"].toFixed(1);
      this.tpm_to_show = data["avg_tpm"].toFixed(1);
      this.is_loaded = true;
    })
  }

  logOutFromService(){
    let observable = this._httpService.logOut();
    observable.subscribe(data =>{
      this._router.navigate(["/login"]);
    })
  }

  play(){
    if(this.is_quote_list){
      this.is_quote_list = false;
      document.getElementById("quote_button").setAttribute("class", "btn-primary");
    }
    if(this.is_scoreboard){
      this.is_scoreboard = false;
      document.getElementById("score_button").setAttribute("class", "btn-primary");
    }

    this.is_play = true;
    document.getElementById("play_button").setAttribute("class", "btn-primary green");
  }

  quoteList(){
    if(this.is_play){
      this.is_play = false;
      document.getElementById("play_button").setAttribute("class", "btn-primary");
    }
    if(this.is_scoreboard){
      this.is_scoreboard = false;
      document.getElementById("score_button").setAttribute("class", "btn-primary");
    }

    this.is_quote_list = true;
    document.getElementById("quote_button").setAttribute("class", "btn-primary green");
  }

  scoreboard(){
    if(this.is_play){
      this.is_play = false;
      document.getElementById("play_button").setAttribute("class", "btn-primary");
    }
    if(this.is_quote_list){
      this.is_quote_list = false;
      document.getElementById("quote_button").setAttribute("class", "btn-primary");
    }

    this.is_scoreboard = true;
    document.getElementById("score_button").setAttribute("class", "btn-primary green");
  }


}

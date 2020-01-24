import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http : HttpClient) { }

  postLogin(info){
    return this._http.post("/log_in", info);
  }

  postRegistry(info){
    return this._http.post("/create_player", info);
  }

  getQuotes(){
    return this._http.get("/random_quotes");
  }

  getLoggedPlayer(){
    return this._http.get("/logged_player");
  }

  getPlayerInfo(){
    return this._http.get("/player_info");
  }

  logOut(){
    return this._http.get("/log_out");
  }

  postScore(score){
    return this._http.post("/add_score", score);
  }

  postFavoriteQuote(id){
    return this._http.post("/change_favorite", id);
  }
}

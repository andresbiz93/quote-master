import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http : HttpClient) { }

  postLogin(info){
    return this._http.post("/log_in", info, {withCredentials : true});
  }

  postRegistry(info){
    return this._http.post("/create_player", info, {withCredentials : true});
  }

  getQuotes(){
    return this._http.get("/random_quotes", {withCredentials : true});
  }

  getLoggedPlayer(){
    return this._http.get("/logged_player", {withCredentials : true});
  }

  getPlayerInfo(){
    return this._http.get("/player_info", {withCredentials : true});
  }

  logOut(){
    return this._http.get("/log_out", {withCredentials : true});
  }

  postScore(score){
    return this._http.post("/add_score", score, {withCredentials : true});
  }

  postFavoriteQuote(id){
    return this._http.post("/change_favorite", id, {withCredentials : true});
  }
}

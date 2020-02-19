import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http : HttpClient) { }

  //passing login info to backend
  postLogin(info){
    return this._http.post("/log_in", info, {withCredentials : true});
  }

  //passing registry info to backend
  postRegistry(info){
    return this._http.post("/create_player", info, {withCredentials : true});
  }

  //retrieving a set of random quotes from the backend
  getQuotes(){
    return this._http.get("/random_quotes", {withCredentials : true});
  }

  //retrieving whether a player is logged in the session
  getLoggedPlayer(){
    return this._http.get("/logged_player", {withCredentials : true});
  }

  //getting completed quotes and the set of scores for a specific player
  getPlayerInfo(){
    return this._http.get("/player_info", {withCredentials : true});
  }

  //log player out of session
  logOut(){
    return this._http.get("/log_out", {withCredentials : true});
  }

  //send completed score to backend
  postScore(score){
    return this._http.post("/add_score", score, {withCredentials : true});
  }

  //toggle whether a quote is favorited by the user
  postFavoriteQuote(id){
    return this._http.post("/change_favorite", id, {withCredentials : true});
  }
}

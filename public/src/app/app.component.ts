import { Component, OnInit } from '@angular/core';
import { HttpService } from './http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'public';

  constructor(private _httpService : HttpService, private _router : Router){}

  ngOnInit(){
    let observable = this._httpService.getLoggedPlayer();
    observable.subscribe(data => {
      //if session has a player_id stored, proceed to user profile. otherwise reroute to login page
      if(data["player_id"] == false){
        this._router.navigate(["/login"]);
      }
      else{
        this._router.navigate(["/my_profile"]);
      }
    });
  }

  //reroutes to play component
  goToPlay(){
    this._router.navigate(["/play"]);
  }

  //reroutes to profile component
  goToProfile(){
    this._router.navigate(["/my_profile"]);
  }

}

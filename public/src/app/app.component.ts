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
      if(data["player_id"] == false){
        this._router.navigate(["/login"]);
      }
      else{
        this._router.navigate(["/my_profile"]);
      }
    });
  }

  goToPlay(){
    this._router.navigate(["/play"]);
    /*let observable = this._httpService.getLoggedPlayer();
    observable.subscribe(data => {
      if(data["player_id"] == false){
        this._router.navigate(["/login"]);
      }
      else{
        this._router.navigate(["/play"]);
      }
    });*/
  }

  goToProfile(){
    this._router.navigate(["/my_profile"]);
    /*let observable = this._httpService.getLoggedPlayer();
    observable.subscribe(data => {
      if(data["player_id"] == false){
        this._router.navigate(["/login"]);
      }
      else{
        this._router.navigate(["/my_profile"]);
      }
    });*/
  }

}

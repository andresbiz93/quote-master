import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login_info = {username : "", password : ""};
  new_user_info = {username : "", password : "", conf_pw : ""}
  error = false;
  error_msg = [];

  constructor(private _httpService : HttpService, private _router : Router) { }

  ngOnInit() {

  }

  postLoginToService(){
    let observable = this._httpService.postLogin(this.login_info);
    observable.subscribe(data => {
      console.log("LOGIN INFO RETURN", data);
      if("errors" in data){
        if("not_found" || "wrong_pw" in data["errors"]){
          this.error = true;
          this.error_msg = ["Login Information is Not Valid"];
        }
      }
      else{
        console.log("LOGIN SUCCESS");
        this.error = false;
        this._router.navigate(["/my_profile"]);
      }
    })
  }

  postRegistryToService(){
    let observable = this._httpService.postRegistry(this.new_user_info);
    observable.subscribe(data => {
      console.log("REGISTRY INFO RETURN", data);
      if("errors" in data){
        if("mismatch" in data["errors"]){
          this.error = true;
          this.error_msg = ["Password and password confirmation do not match."];
        }
        if("duplicate" in data["errors"]){
          this.error = true;
          this.error_msg = ["This username is already taken."];
        }
        if("validation" in data["errors"]){
          this.error = true;
          this.error_msg = ["The username and password must be at least 5 characters long."]
        }
      }
      else{
        console.log("REGISTRY SUCCESS");
        this.error = false;
        this._router.navigate(["/my_profile"]);
      }
    })
  }

}

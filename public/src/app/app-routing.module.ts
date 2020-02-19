import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { PlayComponent } from './play/play.component';


const routes: Routes = [
  {path : "login", component : LoginComponent},
  {path : "my_profile", component : ProfileComponent},
  //quotes-list and scoreboard components will be displayed within the my_profile component
  {path : "play", component : PlayComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

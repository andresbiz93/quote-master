import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { PlayComponent } from './play/play.component';
//import { ScoreboardComponent } from './scoreboard/scoreboard.component';
//import { QuoteListComponent } from './quote-list/quote-list.component';


const routes: Routes = [
  {path : "login", component : LoginComponent},
  {path : "my_profile", component : ProfileComponent},
  /*{path : "my_profile", component : ProfileComponent, children : [
    {path : "scoreboard", component : ScoreboardComponent},
    {path : "quotes", component : QuoteListComponent}
  ]},*/
  {path : "play", component : PlayComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

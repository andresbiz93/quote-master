import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quote-list',
  templateUrl: './quote-list.component.html',
  styleUrls: ['./quote-list.component.css']
})
export class QuoteListComponent implements OnInit {
  @Input() child_quotes : Object[];
  original_state : Object[];
  quotes_to_show : Object[];
  favorites_only : Boolean;
  age_filter : Boolean;
  oldest_first : Boolean;
  alpha_filter : Boolean;
  a_first : Boolean;

  constructor(private _httpService : HttpService, private _router : Router) { }

  //Grabbing the quotes from parent component and creating new arrays out of them.
  //Track the original state so that we can use this baseline when transforming the array
  //Quotes to show will be the post-transform result for the user
  ngOnInit() {
    console.log("CHILD", this.child_quotes);
    this.age_filter = true;
    this.oldest_first = false;
    this.alpha_filter = false;
    this.a_first = true;
    this.favorites_only = false
    this.original_state = [...this.child_quotes];
    var temp = [...this.original_state];
    this.quotes_to_show = temp.reverse();
    document.getElementById("age_button").setAttribute("class", "btn-primary green")

  }

  toggleAlphabeticalOrder(){
    console.log("ORIG", this.original_state);
    this.age_filter = false;
    document.getElementById("age_button").setAttribute("class", "btn-primary")
    //if alphabetical filter was not set previously, we set it
    if(this.alpha_filter == false){
      this.alpha_filter = true;
      document.getElementById("alphabetical_button").setAttribute("class", "btn-primary green")
      this.a_first = true;
    }
    //if alphabetical filter was set previously, then we reverse the polarity
    else{
      this.a_first = !this.a_first;
    } 

    var temp = [...this.original_state];

    //if we are sorting from a-z
    if(this.a_first){
      this.quotes_to_show = temp.sort(function(a, b){
        //we split the author name so that we can access the last word in the name (last name)
        var x = a["quote"].quoteAuthor.toLowerCase();
        var xsplit = x.split(" ");
        var y = b["quote"].quoteAuthor.toLowerCase();
        var ysplit = y.split(" ");

        //returning 1 (positive num) means that the a value is greater than the b value and will be ordered accordingly
        if(xsplit[xsplit.length - 1] > ysplit[ysplit.length - 1]){
          return 1;
        }
        //returning -1 (negative num) means that the a value is lesser than the b value and will be ordered accordingly
        else{
          return -1;
        }
      })
    }
    //if sorting from z-a, reverse the polarity of the sort function
    else{
      this.quotes_to_show = temp.sort(function(a, b){
        var x = a["quote"].quoteAuthor.toLowerCase();
        var xsplit = x.split(" ");
        var y = b["quote"].quoteAuthor.toLowerCase();
        var ysplit = y.split(" ");
        if(xsplit[xsplit.length - 1] > ysplit[ysplit.length - 1]){
          return -1;
        }
        else{
          return 1;
        }
      })
    }
  }

  toggleHistoricalOrder(){
    console.log("ORIG", this.original_state);
    this.alpha_filter = false;
    document.getElementById("alphabetical_button").setAttribute("class", "btn-primary")
    //if age filter was not previously set, we set it
    if(this.age_filter == false){
      this.age_filter = true;
      document.getElementById("age_button").setAttribute("class", "btn-primary green")
      this.oldest_first = false;
    }
    //if age filter was previously set, we reverse its polarity
    else{
      this.oldest_first = !this.oldest_first;
    }

    //oldest first is the original state of the quotes list
    if(this.oldest_first){
      this.quotes_to_show = [...this.original_state];
    }
    //we reverse for newest first
    else{
      var temp = [...this.original_state];
      this.quotes_to_show = temp.reverse();
    }
  }

  toggleFavoritesOnly(){
    //we toggle the boolean value and recolor the button
    this.favorites_only = !this.favorites_only;
    if(this.favorites_only){
      document.getElementById("favorite_button").setAttribute("class", "btn-primary green")
    }
    else{
      document.getElementById("favorite_button").setAttribute("class", "btn-primary")
    }
  }

  favoriteQuoteToService(quote_id){
    //We send the quote_id to the server. The server will then toggle its favorite status
    var info = {id : quote_id};
    let observable = this._httpService.postFavoriteQuote(info);
    observable.subscribe(data => {

      //Here we update the quote's is_favorite status on the display based on server response
      for(var i = 0; i < this.child_quotes.length; i++){
        if(this.child_quotes[i]["id"] == quote_id){
          this.child_quotes[i]["is_favorite"] = data["is_favorite"];
        }
      }
    })
  }

}

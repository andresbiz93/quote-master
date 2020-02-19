import { Component, OnInit, Input } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {
  @Input() child_scores : Object[];
  data : Object[] = [];

  constructor() { }

  ngOnInit() {
    //Want to change the date formatting from that provided by MongoDB
    //Breaking down the child_scores info into a set of data points for the graph. Only need wpm, tpm, date.
    for(var i = 0; i < this.child_scores.length; i++){
      var new_date = new Date(this.child_scores[i]["createdAt"]);
      //each data entry to be graphed will consist of a wpm, tpm, and date
      this.data.push({
        "wpm" : this.child_scores[i]["wpm"], 
        "tpm" : this.child_scores[i]["tpm"],
        "date" : new_date});
    }
    console.log("SCORES", this.child_scores);
    console.log("DATA", this.data);
  }

  ngAfterContentInit(){

    //Selecting the grapharea div
    var graph_area = document.getElementById("grapharea");

    //Setting a margin for the graph - the graph title and axis labels will be written within the margins
    var margin = {top : 20, right: 50, bottom: 50, left:50},
      width = graph_area.offsetWidth - margin.left - margin.right,
      height = graph_area.offsetHeight - margin.top - margin.bottom;

    var title = "Words Per Minute and Typos Per Minute Over Time";

    //Creating the axis scales and labels
    var x = d3.scaleTime().range([0, width]),
      xLabel = "Date",
      //height goes first for the y axes since the axis value decrements from top to bottom
      y0 = d3.scaleLinear().range([height, 0]),
      y0Label = "Words Per Minute",
      y1 = d3.scaleLinear().range([height, 0]),
      y1Label = "Typos Per Minute";

    //The first line will be plotted using wpm and date
    var valueline0 = d3.line()
      .x(function(d){return x(d.date);})
      .y(function(d){return y0(d.wpm);})
      .curve(d3.curveBasis);

    //The second line will be plotted using tpm and date
    var valueline1 = d3.line()
      .x(function(d){return x(d.date);})
      .y(function(d){return y1(d.tpm);})
      .curve(d3.curveBasis);

    //Appending the svg graph to grapharea
    var svg = d3.select("#grapharea").append("svg")
      //whole svg dimensions must include margins
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //getting the axis domains. 
    x.domain(d3.extent(this.data, function(d){return d.date;}));
    y0.domain([0, d3.max(this.data, function(d){return Math.max(d.wpm)})]);
    y1.domain([0, d3.max(this.data, function(d){return Math.max(d.tpm)})]);

    //adding the first line path - colored blue
    svg.append("path")
      .data([this.data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("d", valueline0);

    //adding second line path - colored red
    svg.append("path")
      .data([this.data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("d", valueline1);

    //x axis is translated to the bottom of the graph area
    var xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("color", "lightgray")
      .call(d3.axisBottom(x));

    //first y axis is not translated since it starts at the origin
    var y0Axis = svg.append("g")
      .attr("class", "axisSteelBlue")
      .attr("color", "lightgray")
      .call(d3.axisLeft(y0));

    //second y axis is translated to the right of the graph area
    var y1Axis = svg.append("g")
      .attr("class", "axisRed")
      .attr("color", "lightgray")
      .attr("transform", "translate( " + width + ", 0 )")
      .call(d3.axisRight(y1));

    //x label is translated to the bottom and halfway to the right
    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + height + ")")
      .attr("y", "+35")
      .attr("fill", "lightgray")
      .style("text-anchor", "middle")
      .text(xLabel);

    //due to the -90 degree rotation of the y0 axis, the effect of changing the x and y attributes is swapped. 
    svg.append("text")
      .attr("transform", "rotate(-90)")
      //changing the x attribute moves the label up and down the axis
      .attr("x", 0 - (height/2))
      //changing the y attribute moves the label left or right - closer or farther to the axis
      .attr("y", 0 - margin.left + 5)
      .attr("dy", "1em")
      .attr("fill", "lightgray")
      .style("text-anchor", "middle")
      .text(y0Label);   

    //same concept as the other rotation
    svg.append("text")
      .attr("transform", `translate(${width}, 0) rotate(90)`)
      .attr("x", 0 + (height/2))
      .attr("y", 0 - margin.right + 5)
      .attr("dy", "1em")
      .attr("fill", "lightgray")
      .style("text-anchor", "middle")
      .text(y1Label); 
    
    //placing the title of the graph
    svg.append("text")
      .attr("fill", "lightgray")
      .attr("x", (width/4))
      .attr("font-weight", "bold")
      .text(title);

    //coloring y axis numbers to match the color of the paths they are related to
    d3.selectAll(".axisSteelBlue text")
      .attr("fill", "steelblue")

    d3.selectAll(".axisRed text")
      .attr("fill", "red")
  }
}
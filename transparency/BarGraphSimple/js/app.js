var width = 1500,
    height = 2000;

var svg = d3.select("body").append("svg")
	.attr("class", "chart")
    .attr("width", width)
    .attr("height", height);

var dsv = d3.dsv(";", "text/plain");

var barwidth = 1000;
var barheight = 10;
var baroffsetx = 150;
var baroffsety = 10;
var gap = 4;

dsv("data/Facebook_Global_Government_Requests_2013_Jan-June.csv", function(error, data) {

	var min = d3.min(data, function(d) { return +d.Total_Requests;} );
	var max = d3.max(data, function(d) { return +d.Total_Requests;} );
	var valuescale = d3.scale.linear().domain([min,max]).range([0,barwidth]);

 	d3.select(".chart")
	.attr("width", width)
	.attr("height", (barheight + gap) * data.length);

	var bar = svg.selectAll("g")
	.data(data)
	.enter().append("g")

	bar.append("svg:rect")
  	.attr("class", "bar_facebook")
	.attr("x", baroffsetx)
    .attr("y", function(d, i){return i * (barheight + gap) + baroffsety})
    .attr("width", function(d, i){return valuescale(d.Total_Requests);})
    .attr("height", barheight)
    ;

	bar.append("svg:text")
  	.attr("class", "label")
	.attr("transform", function(d, i) {
            var x = baroffsetx - 2;
            var y = i * (barheight + gap) + baroffsety + barheight;
            return "translate("+x+","+y+")";
          })
    .text(function(d){return d.Country;})
    ;

});

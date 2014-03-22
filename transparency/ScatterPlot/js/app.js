var width = 1000,
    height = 1000;

var svg = d3.select("body").append("svg")
	.attr("class", "chart")
    .attr("width", width)
    .attr("height", height);

var dsv = d3.dsv(";", "text/plain");

var dotradius = 5;
var graphwidth = 650;
var graphheight = 650;
var baroffsetx = 50;
var baroffsety = 10;

dsv("data/Facebook_Global_Government_Requests_2013_Jan-June.csv", function(error, data) {

	var miny = d3.min(data, function(d) { return +d.Total_Requests;} );
	var maxy = d3.max(data, function(d) { return +d.Total_Requests;} );
	var scaley = d3.scale.log().domain([miny,maxy]).range([0,graphheight]);
	var scalex = d3.scale.linear().domain([0,100]).range([0,graphwidth]);

	var graph = svg.selectAll("g")
	.data(data)
	.enter().append("g")

	graph.append("svg:circle")
  	.attr("class", "bar_facebook")
    .attr("cx", function(d, i){return scalex(d.Percentage) + baroffsetx;})
	.attr("cy", function(d, i){return scaley(d.Total_Requests) + baroffsety;})
    .attr("r", dotradius);
    ;

    var xAxis = d3.svg.axis()
    .scale(scalex);
    graph.append("g")
    .attr("class", "axis")
    .attr("transform", "translate("+baroffsetx+","+(graphheight+baroffsety)+")")
    .call(xAxis);


	var scaley = d3.scale.log().domain([maxy, miny]).range([0,graphheight]);
    var yAxis = d3.svg.axis()
    .scale(scaley)
    .orient("left")
    .tickFormat(d3.format(".1"));

    graph.append("g")
    .attr("class", "axis")
    .attr("transform", "translate("+baroffsetx+","+baroffsety+")")
    .call(yAxis);

});

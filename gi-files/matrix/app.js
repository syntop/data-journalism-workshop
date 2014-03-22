var w = 800,
    h = 800,
    rx = w / 2,
    ry = h / 2,
    m0,
    rotate = 0;

var svg = d3.select("body").append("svg:svg")
    .attr("width", w + 300)
    .attr("height", h+300);


var g=svg.append("svg:g")
    .attr("transform", "translate(" + 200 + "," + 100  + ")");


d3.json("gi_mails_c.json", function(mails) {
  var numMails = mails.length;
  var angleStep = 360/mails.length;
  var r = 200;
 
  function mailIndex(eMailString){
    var index = -1;
      for(var i = 0; i < mails.length; i++){
        if(eMailString == mails[i].from){
          console.log(i);
          index = i;
        }
      }
      return index;
  }

  g.selectAll("g.row")
      .data(mails)
      .enter()
      .append("svg:g")
      .attr("class", "row")
      .attr("id", function(d) { return "row-" + d.from; })
      .attr("transform", function(d,i){
        return "translate(" + 0 +"," + h / mails.length * i + ")";
      })
      .append("svg:text")
      .text(function(d) { return  d.from; })
      .attr("text-anchor","end")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);
  
  g.selectAll("g.row")
      .each(function(m, i){
            var row = this;
            mails.forEach( function(mail, j){
              for (var k =0; k < m.recipients.length; k++){
                if(m.recipients[k].email == mail.from){
                  var x, y
                  d3.select(row).append("svg:rect")
              .attr("width", (w / mails.length) * 0.75 )
              .attr("height", (h / mails.length) * 0.75)
              .attr("x", w / mails.length * j)
              .attr("alt", "test")
              .append("svg:title").text(mail.from)
              // .attr("y", -(h / mails.length) * 0.75)
              // .attr("y",0)

                } 


              }
             
            })
      });
});




function mouseover(d) {
  svg.selectAll("path.link.target-" + d.key)
      .classed("target", true)
      .each(updateNodes("source", true));

  svg.selectAll("path.link.source-" + d.key)
      .classed("source", true)
      .each(updateNodes("target", true));
}

function mouseout(d) {
  svg.selectAll("path.link.source-" + d.key)
      .classed("source", false)
      .each(updateNodes("target", false));

  svg.selectAll("path.link.target-" + d.key)
      .classed("target", false)
      .each(updateNodes("source", false));
}

function updateNodes(name, value) {
  return function(d) {
    if (value) this.parentNode.appendChild(this);
    svg.select("#node-" + d[name].key).classed(name, value);
  };
}


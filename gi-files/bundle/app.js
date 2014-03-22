var w = 1280,
    h = 800,
    rx = w / 2,
    ry = h / 2,
    m0,
    rotate = 0;

var svg = d3.select("body").append("svg:svg")
    .attr("width", w)
    .attr("height", w)


var g=svg.append("svg:g")
    .attr("transform", "translate(" + rx + "," + ry + ")");


d3.json("gi_mails_c.json", function(mails) {
  var numMails = mails.length;
  var angleStep = 360/mails.length;
  var r = 200;

  function indexOfMailByFrom(theFrom){
    for(var i = 0; i < numMails; i++){
      if(mails[i].from == theFrom){
        return i;
      }
    }
  }
  
  function toDegrees (angle) {
    return angle * (180 / Math.PI);
  }

 function toRadians (angle) {
  return angle * (Math.PI / 180);
  }
  
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
  

  function circlePos(eMailString){
    var index = mailIndex(eMailString);
    var x = Math.sin(toRadians(index * angleStep)) * r ,
        y = Math.cos(toRadians(index * angleStep)) * r;
    return [x,y];
  }

  g.selectAll("g.node")
      .data(mails)
      .enter()
      .append("svg:g")
      .attr("class", "node")
      .attr("id", function(d) { return "node-" + d.from; })
      .append("svg:text")
      .attr("dx", function(d) { return circlePos(d.from)[0];})
      .attr("dy", function(d) { return circlePos(d.from)[1];})
      .text(function(d) { return  d.from; })
      //.attr("text-anchor", function(d) {  return Math.sin(toRadians(mails.indexOf(d) * angleStep)) * r > 0 ? "start" : "end"; })
      //.attr("transform", function(d) { return Math.sin(toRadians(mails.indexOf(d) * angleStep)) * r > 0 ? null : "rotate(" + mails.indexOf(d) * angleStep + ")"; })
      .attr("transform", function(d) { 
            var angle = 360 - mailIndex(d.from) * angleStep + 90;
            var x = Math.sin(toRadians(mailIndex(d.from) * angleStep)) * r;
            var y = Math.cos(toRadians(mailIndex(d.from) * angleStep))* r;
            //console.log(angle, x, y);
            return "rotate(" + angle + " " + x + " " + y + ")"; 
          })
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);
  
  g.selectAll("g.node")
      .each(function(d,i){
          var g = this;
          d.recipients.forEach(function(value, j) {
            var fromMail = d.from;
            var toMail = value.email;
            var x1 = circlePos(fromMail)[0];
            var y1 = circlePos(fromMail)[1];
            var x2 = circlePos(toMail)[0];
            var y2 = circlePos(toMail)[1];
            d3.select(g)
                .append("svg:line")
                .attr('x1', x1)
                 .attr('y1', y1)
                 .attr('x2', x2)
                 .attr('y2', y2)
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


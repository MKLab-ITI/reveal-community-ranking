// Wrapping in nv.addGraph allows for '0 timeout render', stores rendered charts in nv.graphs, and may do more in the future... it's NOT required
var chart,chart2;
var con = [],con2=[],con3 = [],con4=[],con5=[],con6=[];
var cumlen=10;
var colors=["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
 var cum = [];
  for (var i = 0; i < cumlen; i++) {
    cum[i] = [];
  }
  var cum2 = [];
  for (var i = 0; i < cumlen; i++) {
    cum2[i] = [];
  }
  
  var centrality = [[1,2,4,7,2,4,6,9,1,8],[1,4,5,3,7,9,2,3,4,5],[5,6,3,2,7,4,9,9,7,4],[5,4,4,3,2,6,7,8,5,5],[9,9,7,6,5,4,8,9,7,5],[3,9,5,8,6,7,4,9,3,2],[9,5,9,3,8,6,4,2,5,4],[5,9,8,4,3,2,9,8,7,4],[9,8,6,5,4,7,5,4,3,9],[5,4,3,7,8,4,8,9,6,5,7]];
//alert(items[0][0]); 

$.ajax({
        type: "GET",
        url: "ntinos.json",
        dataType: "json",
        success: function (data) {
            alert(data.length);
        },
        async: true
    });



/////////////////////////////GRAPH1///////////////////////////////
nv.addGraph(function() {
  chart = nv.models.lineChart()
                .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                //.useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                .transitionDuration(350)  //how fast do you want the lines to transition?
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true)  //1344556800000
                .forceX([new Date(1344546800000),new Date(1344700900000)])//Show the x-axis
                .forceY([1,10])//Show the x-axis
                .showLegend(false) 
                .yDomain([11,1])
                .tooltipContent(function(key, x, y , z) {
                                                        return '<h3>' + key + '</h3>' + '<p>Centrality:  ' + z.point.z + '</p>'
                                                       });
  ;
var tickMarks = [new Date(1344546800000),new Date(1344571200000),new Date(1344585600000), new Date(1344600000000),new Date(1344614400000),new Date(1344628800000),new Date(1344643200000),new Date(1344657600000),new Date(1344672000000),new Date(1344686400000) ];
var tickMarks2 = [1,2,3,4,5,6,7,8,9,10];
  // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
  chart.xAxis
    .axisLabel("Timeslot")
    .tickValues(tickMarks)
    //.rotateLabels(-90)
    .tickFormat(function(d) { return d3.time.format('%a %H:%M')(new Date(d)); });

  chart.yAxis
    .tickValues(tickMarks2)
    .tickFormat(function(d) { return "Community   " + d; })
    ;

  d3.select('#chart1 svg')
    .datum(databul())
    .call(chart);

  //TODO: Figure out a good way to do this automatically
  //nv.utils.windowResize(chart.update);
  //nv.utils.windowResize(function() { d3.select('#chart1 svg').call(chart) });

  //chart.dispatch.on(' elementMouseover', function(e) { alert("DADSA");});
  chart.lines.dispatch.on('elementClick', function(e) {
      //$('#chart1').stop().animate({"opacity": 0}, 1000); 
      $('#chart2,#chart1').stop().animate({"opacity": 0}, 1000, function() {
    $('#chart2,#chart1').hide();
  });

    // alert("You've clicked on " + e.series.key + " - " + new Date(e.point.x) + " - " + e.point.z);
 });
 chart.lines.dispatch.on('elementMouseover', function(e) {
  var point;
  $('#chart1 .nv-scatterWrap .nv-groups .nv-series-'+(e.point.y-1)+' .nv-point').attr("fill", "#666666");
  
for(var i = 0; i < 2; i++) {
    if ((con[i].x ===  e.point.x)&& (con[i].y ===  e.point.y)) {
        
        for(var j = 0; j < con.length; j++) {
        point=((con[j].x-1344556800000)/14400000);
        $('#chart1 .nv-scatterWrap .nv-groups .nv-series-'+(con[j].y-1)+' .nv-point-'+point).attr("fill", "#666666");
        }
       // break;
    }
    if ((con2[i].x ===  e.point.x)&& (con2[i].y ===  e.point.y)) {
        
        for(var j = 0; j < con2.length; j++) {
        point=((con2[j].x-1344556800000)/14400000);
        $('#chart1 .nv-scatterWrap .nv-groups .nv-series-'+(con2[j].y-1)+' .nv-point-'+point).attr("fill", "#666666");
        }
        //break;
    }
    
    if ((con3[i].x ===  e.point.x)&& (con3[i].y ===  e.point.y)) {
        
        for(var j = 0; j < con3.length; j++) {
        point=((con3[j].x-1344556800000)/14400000);
        $('#chart1 .nv-scatterWrap .nv-groups .nv-series-'+(con3[j].y-1)+' .nv-point-'+point).attr("fill", "#666666");
        }
        //break;
    }
    
    if ((con4[i].x ===  e.point.x)&& (con4[i].y ===  e.point.y)) {
        
        for(var j = 0; j < con4.length; j++) {
        point=((con4[j].x-1344556800000)/14400000);
        $('#chart1 .nv-scatterWrap .nv-groups .nv-series-'+(con4[j].y-1)+' .nv-point-'+point).attr("fill", "#666666");
        }
        //break;
    }
    if ((con5[i].x ===  e.point.x)&& (con5[i].y ===  e.point.y)) {
        
        for(var j = 0; j < con5.length; j++) {
        point=((con5[j].x-1344556800000)/14400000);
        $('#chart1 .nv-scatterWrap .nv-groups .nv-series-'+(con5[j].y-1)+' .nv-point-'+point).attr("fill", "#666666");
        }
       // break;
    }
    
    if ((con6[i].x ===  e.point.x)&& (con6[i].y ===  e.point.y)) {
        
        for(var j = 0; j < con6.length; j++) {
        point=((con6[j].x-1344556800000)/14400000);
        $('#chart1 .nv-scatterWrap .nv-groups .nv-series-'+(con6[j].y-1)+' .nv-point-'+point).attr("fill", "#666666");
        }
       // break;
    }
   
}
 point=((e.point.x-1344556800000)/14400000);
 $('#chart1 .nv-scatterWrap .nv-groups .nv-series-'+(e.point.y-1)+' .nv-point-'+point).attr("fill", "#000000");
   
//console.log(point);

//alert(found);
//alert(exists);
     
   // console.log("You've hovered on " + e.series.key + " - " + e.point.x + " - " + e.point.z);
 });
 
 chart.lines.dispatch.on('elementMouseout', function() {
  $('#chart1 .nv-lineChart circle.nv-point').attr("fill", "#B5B5B5");

//alert(found);
//alert(exists);
     
   // console.log("You've hovered on " + e.series.key + " - " + e.point.x + " - " + e.point.z);
 });
setTimeout(function() {  
 
    for (var i = 0; i < cumlen; i++) {
        for (var j = 0; j < 10; j++) {
        $('#chart1 .nv-scatterWrap .nv-groups .nv-series-'+i+' .nv-point-'+j).attr("r", centrality[i][j]);
        //stroke="black" stroke-width="3"
    }
    }
         // $('#chart1 .nv-scatterWrap .nv-groups .nv-group circle').attr("r", "13.5");
            
			//$('#chart1 .nv-lineChart circle.nv-point').attr("fill", "red");
                        //$('#chart1 .nv-lineChart circle.nv-point').attr("opacity", "1.4");//fill-opacity="0.5" stroke-opacity="0.8"
                        $('#chart1 .nv-scatterWrap .nv-groups .nv-group circle').attr("stroke-width", "3");//stroke="black"
                        $('#chart1 .nv-scatterWrap .nv-groups .nv-group circle').attr("stroke-opacity", ".3");
                       
        // select all the lines with d3 both main plot and focus
        // see this article for help on dashed d3 lines
        // http://www.d3noob.org/2013/01/making-dashed-line-in-d3js.html
        d3.select('#chart1')
          .selectAll('path.nv-line')
            //.style('stroke-dasharray', ('3, 3'))
    .style('opacity', 0);
     $(".nv-y .nv-axisMaxMin").first().hide();
   

       
 }, 100);
 
 
  return chart;
  
});
/////////////////////////////GRAPH1///////////////////////////////




/////////////////////////////GRAPH2///////////////////////////////
nv.addGraph(function() {
  chart2 = nv.models.lineChart()
                .interactive(false)
                .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                .useInteractiveGuideline(false)  //We want nice looking tooltips and a guideline!
                .transitionDuration(350)  //how fast do you want the lines to transition?
                .showLegend(false)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(false)        //Show the y-axis
                .showXAxis(false)  //1344556800000
                .forceX([new Date(1344546800000),new Date(1344700900000)])//Show the x-axis
                .forceY([1,10])//Show the x-axis
                .yDomain([11,1])
                
  ;
var tickMarks = [new Date(1344556800000),new Date(1344546800000),new Date(1344571200000),new Date(1344585600000), new Date(1344600000000),new Date(1344614400000),new Date(1344628800000),new Date(1344643200000),new Date(1344657600000),new Date(1344672000000),new Date(1344686400000) ];
var tickMarks2 = [1,2,3,4,5,6,7,8,9,10];
  // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
  chart2.xAxis
    .axisLabel("Timeslot")
    .tickValues(tickMarks)
    //.rotateLabels(-90)
    .tickFormat(function(d) { return d3.time.format('%a %H:%M')(new Date(d)); });

  chart2.yAxis
    .tickValues(tickMarks2)
    .tickFormat(function(d) { return "Community   " + d; })
    ;

  d3.select('#chart2 svg')
    .datum(datacon())
    .call(chart2);

  //TODO: Figure out a good way to do this automatically
  //nv.utils.windowResize(chart.update);
  //nv.utils.windowResize(function() { d3.select('#chart1 svg').call(chart) });

  //chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
setTimeout(function() {  
 
    /*for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 1; j++) {
        $('#chart2 .nv-scatterWrap .nv-groups .nv-series-'+i+' .nv-point-'+j).attr("r", centrality[i][j]);
        //stroke="black" stroke-width="3"
    }
    }
    */
   /*$('#chart2 .nv-scatterWrap .nv-groups .nv-series-0 .nv-point-0').attr("r", centrality[6][2]);
   $('#chart2 .nv-scatterWrap .nv-groups .nv-series-0 .nv-point-1').attr("r", centrality[5][3]);
   //$('#chart2 .nv-scatterWrap .nv-groups .nv-series-0 .nv-point-2').attr("r", centrality[4][4]);
   
   $('#chart2 .nv-scatterWrap .nv-groups .nv-series-1 .nv-point-0').attr("r", centrality[1][7]);
   $('#chart2 .nv-scatterWrap .nv-groups .nv-series-1 .nv-point-1').attr("r", centrality[2][8]);
   //$('#chart2 .nv-scatterWrap .nv-groups .nv-series-1 .nv-point-2').attr("r", centrality[9][9]);
   
   $('#chart2 .nv-scatterWrap .nv-groups .nv-series-2 .nv-point-0').attr("r", centrality[3][1]);
   $('#chart2 .nv-scatterWrap .nv-groups .nv-series-2 .nv-point-1').attr("r", centrality[5][2]);
   //$('#chart2 .nv-scatterWrap .nv-groups .nv-series-2 .nv-point-2').attr("r", centrality[4][3]);
   
   $('#chart2 .nv-scatterWrap .nv-groups .nv-series-3 .nv-point-0').attr("r", centrality[1][4]);
   $('#chart2 .nv-scatterWrap .nv-groups .nv-series-3 .nv-point-1').attr("r", centrality[6][5]);
   
   $('#chart2 .nv-scatterWrap .nv-groups .nv-series-4 .nv-point-0').attr("r", centrality[1][4]);
   $('#chart2 .nv-scatterWrap .nv-groups .nv-series-4 .nv-point-1').attr("r", centrality[1][5]);
   
   $('#chart2 .nv-scatterWrap .nv-groups .nv-series-5 .nv-point-0').attr("r", centrality[1][4]);
   $('#chart2 .nv-scatterWrap .nv-groups .nv-series-5 .nv-point-1').attr("r", centrality[8][5]);
   */
   //$('#chart2 .nv-scatterWrap .nv-groups .nv-series-3 .nv-point-2').attr("r", centrality[4][6]);
         // $('#chart1 .nv-scatterWrap .nv-groups .nv-group circle').attr("r", "13.5");
            
			//$('#chart1 .nv-lineChart circle.nv-point').attr("fill", "red");
                        //$('#chart1 .nv-lineChart circle.nv-point').attr("opacity", "0.2");//fill-opacity="0.5" stroke-opacity="0.8"
                        //$('#chart1 .nv-scatterWrap .nv-groups .nv-group circle').attr("stroke-width", "3");//stroke="black"
                        //$('#chart1 .nv-scatterWrap .nv-groups .nv-group circle').attr("stroke-opacity", ".3");
                       
        // select all the lines with d3 both main plot and focus
        // see this article for help on dashed d3 lines
        // http://www.d3noob.org/2013/01/making-dashed-line-in-d3js.html
       for(var i=1; i<7;i++){
           d3.select('#chart2 .nv-series-'+(i-1))                   
             .select('path.nv-line')
             .style('stroke-dasharray', ((10+i)+', 3'))
             .style('stroke-width', i/2)
             .style('opacity', 0.1*i);
       }
        
        
      
       
 }, 100);
    
       
  return chart2;
  
});

////////////////////////////////GRAPH2//////////////////////////////////////




function databul() {
  
for (var j = 0; j < cumlen; j++) {
  for (var i = 0; i < 10; i++) {
    cum[j].push({x: 1344556800000+(i*14400000), y: j+1, z: centrality[j][i]});
   // rand.push({x:i, y: rand1(), z: rand1()});
    //rand2.push({x: i, y: rand1(), z: rand1() })
  }
  }
  var data=[];
  for (var j = 0; j < cumlen; j++) {
      data.push({values: cum[j], key: "Community "+(j+1) , color: "#B5B5B5"});
  }
  //console.log(cum[1]);
  return data;
}

function datacon() {
    
    con.push({x:   1344585600000, y: 7, z:1});//  1 344 600 000 000
    con.push({x:   1344600000000, y: 6, z:1});//  1 344 614 400 000
    //con.push({x:   1344614400000, y: 5, z:1});//  1 344 614 400 000
    
    con2.push({x:   1344657600000, y: 2, z:1});//  1 344 600 000 000
    con2.push({x:   1344672000000, y: 3, z:1});//  1 344 614 400 000
    //con2.push({x:   1344686400000, y: 10, z:1});//  1 344 614 400 000
    
    con3.push({x:   1344571200000, y: 4, z:1});//  1 344 600 000 000
    con3.push({x:   1344585600000, y: 6, z:1});//  1 344 614 400 000
    //con3.push({x:   1344600000000, y: 1, z:1});//  1 344 614 400 000
    
    con4.push({x:   1344614400000, y: 2, z:1});//  1 344 600 000 000
    con4.push({x:   1344628800000, y: 7, z:1});//  1 344 614 400 000
    //con4.push({x:   1344643200000, y: 9, z:1});//  1 344 614 400 000
    
    con5.push({x:   1344614400000, y: 2, z:1});//  1 344 600 000 000
    con5.push({x:   1344628800000, y: 2, z:1});//
    
    con6.push({x:   1344614400000, y: 2, z:1});//  1 344 600 000 000
    con6.push({x:   1344628800000, y: 9, z:1});//
    
    
    
 // for (var j = 0; j < 2; j++) {
  //for (var i = 0; i < 3; i++) {
    //cum2[j].push({x: 1344556800000+(i*14400000), y: j+1, z: 1});
   // rand.push({x:i, y: rand1(), z: rand1()});
    //rand2.push({x: i, y: rand1(), z: rand1() })
 // }
 // }
  var data=[];
 // for (var j = 0; j < 2; j++) {
      data.push({values: con, key: "Community " , color: "red"});
      data.push({values: con2, key: "Community2 " , color: "red"});
      data.push({values: con3, key: "Community3 " , color: "red"});
      data.push({values: con4, key: "Community4 " , color: "red"});
      data.push({values: con5, key: "Community5 " , color: "red"});
      data.push({values: con6, key: "Community6 " , color: "red"});
 // }
  //console.log(cum[1]);
  return data;
}


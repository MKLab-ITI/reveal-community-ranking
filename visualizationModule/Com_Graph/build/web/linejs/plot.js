var chart, chart2,chart3;
var con = [];
var con0 = [],con2=[],con3 = [],con4=[],con5=[],con6=[];
var cumlen = 20;
var timelen;
var conlen;
var cum = [];
var cumone = [];
var centrality = [];
var users = [];
var connections=[];
var tags=[];
var tagssize=[];
var keys=[];
var keyssize=[];
var bigrams=[];
var bigramssize=[];
var ftweets=[];
var ftweetssize=[];
var contimestamp=[];
var concommunity=[];
var conquality=[];
var min,max,usersmin,usersmax,centmin,centmax,conmin,conmax,fixed;
for (var i = 0; i < cumlen; i++) {
    cum[i] = [];
}
var mindate;
var maxdate;
var tickMarks = [];
var tickMarks2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
var timestamps = [];
var colname=gup("collection");
if((colname==="")||(colname==="elections")){    
    window.history.pushState('page2', 'Title', 'http://160.40.51.26:8084/Com_Graph/community.html?collection=elections');
    colname="elections";  
    min=50000;
    max=44500;
    usersmin=9;
    usersmax=160;
    centmin=7;
    centmax=50;
    conmin=10;
    conmax=2000;
    fixed=2;
}
if(colname==="ucl"){
    min=2000;
    max=2500;
    usersmin=10;
    usersmax=60;
    centmin=2;
    centmax=18;
    conmin=20;
    conmax=200;
    fixed=2;
}
if(colname==="sherlock"){
    min=50000;
    max=45000;
    usersmin=20;
    usersmax=200;
    centmin=2;
    centmax=18;
    conmin=20;
    conmax=800;
    fixed=2;
}

$.ajax({
    type: "GET",
    url: "jsons/"+colname+"communities.json",
    dataType: "json",
    success: function(data) {
        timelen=data.datasetInfo.allTimeslots.length;
        mindate = (data.datasetInfo.allTimeslots[0] - min)*1000;
        maxdate = (data.datasetInfo.allTimeslots[timelen-1] + max)*1000;
        conlen=0;//data.connections.length;
       
        for (var i = 0; i < cumlen; i++) {
            var arr1 = [];
            var arr2 = [];
            var arr3 = [];
            
            var arr4 = [];
            var arr5 = [];
            
            var arr6 = [];
            var arr7 = [];
            
            var arr8 = [];
            var arr9 = [];
            
            var arr10 = [];
            var arr11 = [];
            
            for(var j=0;j<timelen;j++){
                arr1.push(data.ranked_communities[i].DyCContainer[j].commCentrality);
                arr2.push(data.ranked_communities[i].DyCContainer[j].commSize);
                arr3.push(data.ranked_communities[i].DyCContainer[j].connectionsNum);
                var keylen=data.ranked_communities[i].DyCContainer[j].commHashTags.length;
                if(keylen>3){
                    for(var f=0;f<3;f++){
                        arr4.push(data.ranked_communities[i].DyCContainer[j].commHashTags[f][0]);
                        arr5.push(data.ranked_communities[i].DyCContainer[j].commHashTags[f][1]);
                    }
                }
                else{
                    for(var f=0;f<keylen;f++){
                        arr4.push(data.ranked_communities[i].DyCContainer[j].commHashTags[f][0]);
                        arr5.push(data.ranked_communities[i].DyCContainer[j].commHashTags[f][1]);
                    }
                    for(var f=0;f<3-keylen;f++){
                        arr4.push("-");
                        arr5.push(0);
                    }
                }
                
                var keylen=data.ranked_communities[i].DyCContainer[j].commKeywords.length;
                if(keylen>3){
                    for(var f=0;f<3;f++){
                        arr6.push(data.ranked_communities[i].DyCContainer[j].commKeywords[f][0]);
                        arr7.push(data.ranked_communities[i].DyCContainer[j].commKeywords[f][1]);
                    }
                }
                else{
                    for(var f=0;f<keylen;f++){
                        arr6.push(data.ranked_communities[i].DyCContainer[j].commKeywords[f][0]);
                        arr7.push(data.ranked_communities[i].DyCContainer[j].commKeywords[f][1]);
                    }
                    for(var f=0;f<3-keylen;f++){
                        arr6.push("-");
                        arr7.push(0);
                    }
                }
                
                 var keylen=data.ranked_communities[i].DyCContainer[j].communityBigramsPerSlot.length;
                if(keylen>3){
                    for(var f=0;f<3;f++){
                        arr8.push(data.ranked_communities[i].DyCContainer[j].communityBigramsPerSlot[f][0]);
                        arr9.push(data.ranked_communities[i].DyCContainer[j].communityBigramsPerSlot[f][1]);
                    }
                }
                else{
                    for(var f=0;f<keylen;f++){
                        arr8.push(data.ranked_communities[i].DyCContainer[j].communityBigramsPerSlot[f][0]);
                        arr9.push(data.ranked_communities[i].DyCContainer[j].communityBigramsPerSlot[f][1]);
                    }
                    for(var f=0;f<3-keylen;f++){
                        arr8.push("-");
                        arr9.push(0);
                    }
                }
                
                var keylen=data.ranked_communities[i].DyCContainer[j].commTweets.length;
                if(keylen>5){
                    for(var f=0;f<5;f++){
                        arr10.push(data.ranked_communities[i].DyCContainer[j].commTweets[f][0]);
                        arr11.push(data.ranked_communities[i].DyCContainer[j].commTweets[f][1]);
                    }
                }
                else{
                    for(var f=0;f<keylen;f++){
                        arr10.push(data.ranked_communities[i].DyCContainer[j].commTweets[f][0]);
                        arr11.push(data.ranked_communities[i].DyCContainer[j].commTweets[f][1]);
                    }
                    for(var f=0;f<5-keylen;f++){
                        arr10.push("-");
                        arr11.push(0);
                    }
                }
                
                
            }
            
            centrality.push(arr1);  
            users.push(arr2);  
            connections.push(arr3);  
            tags.push(arr4);  
            tagssize.push(arr5);  
            keys.push(arr6);  
            keyssize.push(arr7);  
            bigrams.push(arr8);  
            bigramssize.push(arr9);  
            ftweets.push(arr10);  
            ftweetssize.push(arr11);  
        }
        
        for(var j=0;j<timelen;j++){
                tickMarks.push(new Date((data.datasetInfo.allTimeslots[j])*1000));
                timestamps.push((data.datasetInfo.allTimeslots[j])*1000);
        }
        //graphone();
        
/*      for (var i = 0; i < data.connections.length; i++) {
            con[i] = [];
            
            var arr1=[];
            arr1.push(data.connections[i].timestamp1);
            arr1.push(data.connections[i].timestamp2);
            contimestamp.push(arr1);
            
            var arr2=[];
            arr2.push(data.connections[i].community1);
            arr2.push(data.connections[i].community2);
            concommunity.push(arr2);
            
            conquality.push(data.connections[i].quality)
        }
*/
    },
    async: false
});
//function graphone(){
//console.log(connections);
/////////////////////////////GRAPH1///////////////////////////////
nv.addGraph(function() {
    chart = nv.models.lineChart()
        .margin({left: 100}) 
        .transitionDuration(350) 
        .useInteractiveGuideline(false)
        .showYAxis(true) 
        .showXAxis(true)
        .forceX([new Date(mindate), new Date(maxdate)])
        .forceY([1, 20]) 
        .showLegend(false)
        .yDomain([21, 1])
          //.tooltipContent(function(key, x, y, z) {
          //  return '<h3>' + key + '</h3>' + '<p>Centrality:  ' + z.point.z + '</p>'
        //})
        ;
        
    chart.xAxis
        .axisLabel("")
        .tickValues(tickMarks)
        //.rotateLabels(33)
        .tickFormat(function(d) {
            return d3.time.format('%a %H:%M')(new Date(d));
        });

    chart.yAxis
        .tickValues(tickMarks2)
        .tickFormat(function(d) {
            return "Community   " + d;
        });

    d3.select('#chart1 svg')
        .datum(databul())
        .call(chart);
        //.transition().duration(1200);




    chart.lines.dispatch.on('elementClick', function(e) {//epointy-1//timestamps.indexOf(e.point.x)
        var full=1;
        if($('#admin').text().substr(8)==="Users"){
            if(users[e.point.y-1][timestamps.indexOf(e.point.x)]===0){full=0;}
        }
        if($('#admin').text().substr(8)==="Centrality"){
            if(centrality[e.point.y-1][timestamps.indexOf(e.point.x)]===0){full=0;}
        }
        if($('#admin').text().substr(8)==="Connections"){
            if(connections[e.point.y-1][timestamps.indexOf(e.point.x)]===0){full=0;}
        }
        
        if(full===0){$('#myModal1').reveal();}
        else{
        createnet(e.point.y,timestamps.indexOf(e.point.x));
        
        nv.addGraph(function() {
 chart3= nv.models.lineChart()
        .margin({top: 15,left:100}) 
        .transitionDuration(350) 
        .useInteractiveGuideline(false)
        .showYAxis(true) 
        .showXAxis(true)
        .forceX([new Date(mindate), new Date(maxdate)])
        //.forceY([1, 10]) 
        .showLegend(false)
        .tooltips(false)
        //.yDomain([11, 1])
        //.yDomain([11, 1])
        //.tooltipContent(function(key, x, y, z) {
          //  return '<h3>' + key + '</h3>' + '<p>Centrality:  ' + z.point.z + '</p>'
        //})
        ;
        
    chart3.xAxis
        //.axisLabel("Timeslot")
        .tickValues(tickMarks)
        .rotateLabels(-45)
        .tickFormat(function(d) {
            return d3.time.format('%a %H:%M')(new Date(d));
        });

    chart3.yAxis
        .tickValues(tickMarks2)
        .tickFormat(function(d) {
            return "Community   " + d;
        });
    d3.select('#chart3 svg')
        .datum(databulone(e.point.y))
        .call(chart3);




    chart3.lines.dispatch.on('elementClick', function(e) {
       //CHART3 CLICK   
       if(e.point.z!==0){animate(timestamps.indexOf(e.point.x));}
    });
    
    /*
    chart3.lines.dispatch.on('elementMouseover', function(e) {
      //CHART3 MOUSEOVER
    });

    chart3.lines.dispatch.on('elementMouseout', function() {
        //CHART3 MOUSEOUT
    });
    */
    
    setTimeout(function() {
var text=$('#admin').text();
        //for (var i = 0; i < 1; i++) {
            for (var j = 0; j < timelen; j++) {
                if(text.substr(8)==="Users"){
                    var cent=users[e.point.y-1][j];
                //if((cent>0)&&(cent<0.2)){cent=1;}
                //else if((cent>0.2)&&(cent<1)){cent=Math.floor(cent*10);}
                //else if(cent===1){cent=10}
                if(cent!==0){cent=(cent-usersmin)/(usersmax)*(9)+1;}
                else{cent=-1;}
                $('#chart3 .nv-scatterWrap .nv-groups .nv-series-0 .nv-point-' + j).attr("r", cent+1);
                }
                if(text.substr(8)==="Centrality"){
                    var cent=centrality[e.point.y-1][j];
                //if((cent>0)&&(cent<0.2)){cent=1;}
                //else if((cent>0.2)&&(cent<1)){cent=Math.floor(cent*10);}
                //else if(cent===1){cent=10}
                if(cent!==0){cent=(cent-centmin)/(centmax)*(9)+1;}
                else{cent=-1;}
                $('#chart3 .nv-scatterWrap .nv-groups .nv-series-0 .nv-point-' + j).attr("r", cent+1);
                }
                if(text.substr(8)==="Connections"){
                     var cent=connections[e.point.y-1][j];
                //if((cent>0)&&(cent<0.2)){cent=1;}
                //else if((cent>0.2)&&(cent<1)){cent=Math.floor(cent*10);}
                //else if(cent===1){cent=10}
                if(cent!==0){cent=(cent-conmin)/(conmax)*(9)+1;}
                else{cent=-1;}
                $('#chart3 .nv-scatterWrap .nv-groups .nv-series-0 .nv-point-' + j).attr("r", cent+1);
                }
                
            }
        //}
        $('#chart3 .nv-scatterWrap .nv-groups .nv-series-0 .nv-point-'+timestamps.indexOf(e.point.x)).attr("fill", "#ff0000");
        $('#chart3 .nv-scatterWrap .nv-groups .nv-group circle').attr("stroke-width", "1"); 
        $('#chart3 .nv-scatterWrap .nv-groups .nv-group circle').attr("stroke-opacity", ".3");

       
        d3.select('#chart3')
            .selectAll('path.nv-line')
            .style('opacity', 0);
        $("#chart3 .nv-axisMaxMin").hide();
    }, 100);
    return chart;
});
       
        $('#container').stop().animate({"opacity": 1});
       
        $('#chart2,#chart1').stop().animate({"opacity": 0}, 1000, function() {
            $('#chart2,#chart1').hide();
        });
        
        
        
        
        
    }
    });
    
    
    
    
    chart.lines.dispatch.on('elementMouseover', function(e) {
        $('.nvtooltip').html('');
        //if($('.nvtooltip').css('left')>75)
        //for(var i=0;i<cumlen;i++){
          //  console.log(centrality[i][timestamps.indexOf(e.point.x)])
        //}
       //$('.nvtooltip').html("<div>Community:"+e.point.y+"-"+centrality[e.point.y]+"-"+"</div>");
        
 //var y = chart.lines.yScale().invert(coordinates[1]-chart.margin().top);
 //<tr class="nv-pointer-events-none"><td colspan="3" class="nv-pointer-events-none"><strong class="x-value">Thu 10:49</strong></td></tr>
 //<tr class="highlight nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none" style="border-bottom-color: rgb(211, 211, 211); border-top-color: rgb(211, 211, 211);"><div style="background-color: rgb(181, 181, 181);" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none" style="border-bottom-color: rgb(211, 211, 211); border-top-color: rgb(211, 211, 211);">Community 2</td><td class="value nv-pointer-events-none" style="border-bottom-color: rgb(211, 211, 211); border-top-color: rgb(211, 211, 211);">Community   2</td></tr><tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: rgb(181, 181, 181);" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Community 3</td><td class="value nv-pointer-events-none">Community   3</td></tr><tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: rgb(181, 181, 181);" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Community 4</td><td class="value nv-pointer-events-none">Community   4</td></tr><tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: rgb(181, 181, 181);" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Community 5</td><td class="value nv-pointer-events-none">Community   5</td></tr><tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: rgb(181, 181, 181);" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Community 6</td><td class="value nv-pointer-events-none">Community   6</td></tr><tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: rgb(181, 181, 181);" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Community 7</td><td class="value nv-pointer-events-none">Community   7</td></tr><tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: rgb(181, 181, 181);" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Community 8</td><td class="value nv-pointer-events-none">Community   8</td></tr><tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: rgb(181, 181, 181);" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Community 9</td><td class="value nv-pointer-events-none">Community   9</td></tr><tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: rgb(181, 181, 181);" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Community 10</td><td class="value nv-pointer-events-none">Community   10</td></tr>
 if(e.point.z>0){
 $('.nvtooltip').html('<table class="nv-pointer-events-none"><thead></thead><tbody></tbody></table>');
 $('.nvtooltip table thead').append('<tr class="nv-pointer-events-none"><td colspan="3" class="nv-pointer-events-none"><strong class="x-value">'+d3.time.format('%a %H:%M')(new Date(e.point.x))+'</strong></td></tr>')
 /*
  if($('#admin').text().substr(8)==="Users"){
      
      var A=[];
 var B=[];
 for(var i=0;i<cumlen;i++){
     A.push(users[i][timestamps.indexOf(e.point.x)]);
     B.push("Community "+(i+1));
      //if(i===(e.point.y)-1){  $('.nvtooltip table tbody').append('<tr class="highlight nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: rgb(181, 181, 181);" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Community '+(i+1)+'</td><td class="value nv-pointer-events-none">'+centrality[i][timestamps.indexOf(e.point.x)].toFixed(3)+'</td></tr>');}
      //else{  $('.nvtooltip table tbody').append('<tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: rgb(181, 181, 181);" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Community '+(i+1)+'</td><td class="value nv-pointer-events-none">'+centrality[i][timestamps.indexOf(e.point.x)].toFixed(3)+'</td></tr>');}
}
//var A = [60, 80, 82, 50, 80, 80];
//var B = ['a', 'b', 'c', 'd', 'e', 'f'];

var all = [];

for (var i = 0; i < B.length; i++) {
    all.push({ 'A': A[i], 'B': B[i] });
}

all.sort(function(a, b) {
  return b.A - a.A;
});

A = [];
B = [];

for (var i = 0; i < all.length; i++) {
   A.push(all[i].A);
   B.push(all[i].B);
}    
      
  } 
  if($('#admin').text().substr(8)==="Centrality"){
      
      var A=[];
 var B=[];
 for(var i=0;i<cumlen;i++){
     A.push(centrality[i][timestamps.indexOf(e.point.x)].toFixed(6));
     B.push("Community "+(i+1));
      //if(i===(e.point.y)-1){  $('.nvtooltip table tbody').append('<tr class="highlight nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: rgb(181, 181, 181);" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Community '+(i+1)+'</td><td class="value nv-pointer-events-none">'+centrality[i][timestamps.indexOf(e.point.x)].toFixed(3)+'</td></tr>');}
      //else{  $('.nvtooltip table tbody').append('<tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: rgb(181, 181, 181);" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Community '+(i+1)+'</td><td class="value nv-pointer-events-none">'+centrality[i][timestamps.indexOf(e.point.x)].toFixed(3)+'</td></tr>');}
}
//var A = [60, 80, 82, 50, 80, 80];
//var B = ['a', 'b', 'c', 'd', 'e', 'f'];

var all = [];

for (var i = 0; i < B.length; i++) {
    all.push({ 'A': A[i], 'B': B[i] });
}

all.sort(function(a, b) {
  return b.A - a.A;
});

A = [];
B = [];

for (var i = 0; i < all.length; i++) {
   A.push(all[i].A);
   B.push(all[i].B);
}    
  } 
  if($('#admin').text().substr(8)==="Connections"){
      
      var A=[];
 var B=[];
 for(var i=0;i<cumlen;i++){
     A.push(connections[i][timestamps.indexOf(e.point.x)]);
     B.push("Community "+(i+1));
      //if(i===(e.point.y)-1){  $('.nvtooltip table tbody').append('<tr class="highlight nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: rgb(181, 181, 181);" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Community '+(i+1)+'</td><td class="value nv-pointer-events-none">'+centrality[i][timestamps.indexOf(e.point.x)].toFixed(3)+'</td></tr>');}
      //else{  $('.nvtooltip table tbody').append('<tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: rgb(181, 181, 181);" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Community '+(i+1)+'</td><td class="value nv-pointer-events-none">'+centrality[i][timestamps.indexOf(e.point.x)].toFixed(3)+'</td></tr>');}
}
//var A = [60, 80, 82, 50, 80, 80];
//var B = ['a', 'b', 'c', 'd', 'e', 'f'];

var all = [];

for (var i = 0; i < B.length; i++) {
    all.push({ 'A': A[i], 'B': B[i] });
}

all.sort(function(a, b) {
  return b.A - a.A;
});

A = [];
B = [];

for (var i = 0; i < all.length; i++) {
   A.push(all[i].A);
   B.push(all[i].B);
}    
  } 
        
 


for(var i=0;i<cumlen;i++){
     //A.push(centrality[i][timestamps.indexOf(e.point.x)].toFixed(6));
     //B.push("Community "+i);
     //console.log(e.point.y);
     //if(B[i]==="Community "+i){console.log(B[i])};
     
     if($('#admin').text().substr(8)==="Centrality"){
         if(B[i]==="Community "+e.point.y){  $('.nvtooltip table tbody').append('<tr class="highlight nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: rgb(181, 181, 181);" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">'+B[i]+'</td><td class="value nv-pointer-events-none">'+parseFloat(A[i]).toFixed(3)+'</td></tr>');}
      else{  $('.nvtooltip table tbody').append('<tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: rgb(181, 181, 181);" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">'+B[i]+'</td><td class="value nv-pointer-events-none">'+parseFloat(A[i]).toFixed(3)+'</td></tr>');}
     }
     else{
         if(B[i]==="Community "+e.point.y){  $('.nvtooltip table tbody').append('<tr class="highlight nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: rgb(181, 181, 181);" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">'+B[i]+'</td><td class="value nv-pointer-events-none">'+parseInt(A[i])+'</td></tr>');}
      else{  $('.nvtooltip table tbody').append('<tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: rgb(181, 181, 181);" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">'+B[i]+'</td><td class="value nv-pointer-events-none">'+parseInt(A[i])+'</td></tr>');}
     }
     
      
}
*/
//console.log(e);
//var param;
//if($('#admin').text().substr(8)==="Centrality"){param="Centrality "+centrality[e.point.y-1][timestamps.indexOf(e.point.x)].toFixed(3);}
//if($('#admin').text().substr(8)==="Users"){param="Users "+users[e.point.y-1][timestamps.indexOf(e.point.x)];}
//if($('#admin').text().substr(8)==="Connections"){param="Connections "+connections[e.point.y-1][timestamps.indexOf(e.point.x)];}
//$('.nvtooltip table tbody').append('<tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: #000000;" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Community '+e.point.y+'</td></tr>');
$('.nvtooltip table tbody').append('<tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: #000000;" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Centrality <span>'+centrality[e.point.y-1][timestamps.indexOf(e.point.x)].toFixed(fixed)+'</span></td></tr>');
$('.nvtooltip table tbody').append('<tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: #000000;" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Users <span>'+users[e.point.y-1][timestamps.indexOf(e.point.x)]+'</span></td></tr>');
$('.nvtooltip table tbody').append('<tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: #000000;" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Connections <span>'+connections[e.point.y-1][timestamps.indexOf(e.point.x)]+'</span></td></tr>');

//<td class="value nv-pointer-events-none">'+param+'</td>
$('.nvtooltip').append('<p class="categories" style="border-right: 2px dashed gray;">HASHTAGS</p>');
$('.nvtooltip').append('<p class="categories" style="border-right: 2px dashed gray;">KEYWORDS</p>');
$('.nvtooltip').append('<p class="categories" style="width:146px">BIGRAMS</p>');
//$('.nvtooltip').append('<div class="categories">TAKIS</div>');
//$('.nvtooltip').append('<div class="categories">TAKIS</div>');
$('.nvtooltip').append('<div style="width:450px;border-bottom: 2px;border-bottom-color: gray;border-bottom-style: double;"></div>');
$('.nvtooltip').append('<div id="ta"></div>');
$('.nvtooltip #ta').append('<p>FREQUENT TWEETS</p>');
if(ftweets[e.point.y-1][(timestamps.indexOf(e.point.x))*5]!=="-"){$('.nvtooltip #ta').append('<img class="fimg" src="imgs/tweet.png"/><p class="ftweets">'+ftweets[e.point.y-1][(timestamps.indexOf(e.point.x))*5]+'</p><p class="fcount">'+ftweetssize[e.point.y-1][(timestamps.indexOf(e.point.x))*5]+'</p>');}
if(ftweets[e.point.y-1][((timestamps.indexOf(e.point.x))*5)+1]!=="-"){$('.nvtooltip #ta').append('<img class="fimg" src="imgs/tweet.png"/><p class="ftweets">'+ftweets[e.point.y-1][((timestamps.indexOf(e.point.x))*5)+1]+'</p><p class="fcount">'+ftweetssize[e.point.y-1][((timestamps.indexOf(e.point.x))*5)+1]+'</p>');}
if(ftweets[e.point.y-1][((timestamps.indexOf(e.point.x))*5)+2]!=="-"){$('.nvtooltip #ta').append('<img class="fimg" src="imgs/tweet.png"/><p class="ftweets">'+ftweets[e.point.y-1][((timestamps.indexOf(e.point.x))*5)+2]+'</p><p class="fcount">'+ftweetssize[e.point.y-1][((timestamps.indexOf(e.point.x))*5)+2]+'</p>');}
if(ftweets[e.point.y-1][((timestamps.indexOf(e.point.x))*5)+3]!=="-"){$('.nvtooltip #ta').append('<img class="fimg" src="imgs/tweet.png"/><p class="ftweets">'+ftweets[e.point.y-1][((timestamps.indexOf(e.point.x))*5)+3]+'</p><p class="fcount">'+ftweetssize[e.point.y-1][((timestamps.indexOf(e.point.x))*5)+3]+'</p>');}
if(ftweets[e.point.y-1][((timestamps.indexOf(e.point.x))*5)+4]!=="-"){$('.nvtooltip #ta').append('<img class="fimg" src="imgs/tweet.png"/><p class="ftweets">'+ftweets[e.point.y-1][((timestamps.indexOf(e.point.x))*5)+4]+'</p><p class="fcount">'+ftweetssize[e.point.y-1][((timestamps.indexOf(e.point.x))*5)+4]+'</p>');}
//$('.nvtooltip').append('<p class="ftweets">dsadas dasdasdas das da</p>');
//$('.nvtooltip').append('<p class="ftweets">dasd asdasdsa dasdasdsa das</p>');
//$('.nvtooltip').append('<p class="ftweets">da dsa dasdsa dasda</p>');
//$('.nvtooltip').append('<p class="ftweets">dsadas dasd as</p>');


      //setTimeout(function(){
        //  width=150;
//heightadd=100;
var tsize1=20,tsize2=18,tsize3=16;
var ksize1=20,ksize2=18,ksize3=16;
var bsize1=20,bsize2=18,bsize3=16;
if(tags[e.point.y-1][(timestamps.indexOf(e.point.x))*3]==="-"){tsize1=0;}
if(tags[e.point.y-1][((timestamps.indexOf(e.point.x))*3)+1]==="-"){tsize2=0;}
if(tags[e.point.y-1][((timestamps.indexOf(e.point.x))*3)+2]==="-"){tsize3=0;}
if(keys[e.point.y-1][(timestamps.indexOf(e.point.x))*3]==="-"){ksize1=0;}
if(keys[e.point.y-1][((timestamps.indexOf(e.point.x))*3)+1]==="-"){ksize2=0;}
if(keys[e.point.y-1][((timestamps.indexOf(e.point.x))*3)+2]==="-"){ksize3=0;}
if(bigrams[e.point.y-1][(timestamps.indexOf(e.point.x))*3]==="-"){bsize1=0;}
if(bigrams[e.point.y-1][((timestamps.indexOf(e.point.x))*3)+1]==="-"){bsize2=0;}
if(bigrams[e.point.y-1][((timestamps.indexOf(e.point.x))*3)+2]==="-"){bsize3=0;}
var word_array = [{text:tags[e.point.y-1][(timestamps.indexOf(e.point.x))*3],size:tsize1},{text:tags[e.point.y-1][((timestamps.indexOf(e.point.x))*3)+1],size:tsize2},{text:tags[e.point.y-1][((timestamps.indexOf(e.point.x))*3)+2],size:tsize3}];
var word_array2 = [{text:keys[e.point.y-1][(timestamps.indexOf(e.point.x))*3],size:ksize1},{text:keys[e.point.y-1][((timestamps.indexOf(e.point.x))*3)+1],size:ksize2},{text:keys[e.point.y-1][((timestamps.indexOf(e.point.x))*3)+2],size:ksize3}];
var word_array3 = [{text:bigrams[e.point.y-1][(timestamps.indexOf(e.point.x))*3],size:bsize1},{text:bigrams[e.point.y-1][((timestamps.indexOf(e.point.x))*3)+1],size:bsize2},{text:bigrams[e.point.y-1][((timestamps.indexOf(e.point.x))*3)+2],size:bsize3}];
//var fill = d3.scale.category20();
//console.log
  var svg = d3.select('.nvtooltip > div').append("svg")
              //.attr("width", width)
              .attr("style", "width:150px;height:200px;display:inline-block;border-right:2px dashed gray;")
              //.attr("width", 150)
              .append("g")
              .attr("transform", "translate(75,100)");
      //console.log(svg);
      d3.layout.cloud().size([130, 180])
      .words(word_array)
      .padding(1)
      .rotate(function() {  var notRandomNumbers = [1, 1, 1, 1, 1, 1, 1, 0, 0, 0];
                            var idx = Math.floor(Math.random() * notRandomNumbers.length);
                            return (notRandomNumbers[idx])*90;})
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();    
     
      

          function draw() {
    //Use the 'text' attribute (the word itself) to identity unique elements.
    var cloud = svg.selectAll("g text")
                    .data(word_array, function(d) {return d.text; })

    //Entering words
    cloud.enter()
          .append("text")
          .style("font-family", "Impact")
          .style("fill", "rgb(135, 135, 135)")//function(d, i) { return fill(i); }
          .attr("text-anchor", "middle")
          .attr('font-size', 1)
          //.attr('onclick',function(d, i) { return 'tagclicked("'+d.text+'");'; })
          .text(function(d) { return d.text; });

    //Entering and existing words
    cloud.transition()
          .duration(600)
          .style("font-size", function(d) {return d.size + "px"; })
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .style("fill-opacity", 1);

    //Exiting words
    cloud.exit()
          .transition()
          .duration(200)
          .style('fill-opacity', 1e-6)
          .attr('font-size', 1)
          .remove();
  }
  
  var svg2 = d3.select('.nvtooltip > div').append("svg")
              //.attr("width", width)
              .attr("style", "width:150px;height:200px;display:inline-block;border-right:2px dashed gray;")
              //.attr("width", 150)
              .append("g")
              .attr("transform", "translate(75,100)");
      //console.log(svg);
      d3.layout.cloud().size([130, 180])
      .words(word_array2)
      .padding(1)
      .rotate(function() {  var notRandomNumbers = [1, 1, 1, 1, 1, 1, 1, 0, 0, 0];
                            var idx = Math.floor(Math.random() * notRandomNumbers.length);
                            return (notRandomNumbers[idx])*90;})
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw2)
      .start();    
     
      

          function draw2() {
    //Use the 'text' attribute (the word itself) to identity unique elements.
    var cloud = svg2.selectAll("g text")
                    .data(word_array2, function(d) {return d.text; })

    //Entering words
    cloud.enter()
          .append("text")
          .style("font-family", "Impact")
          .style("fill", "rgb(135, 135, 135)")//function(d, i) { return fill(i); }
          .attr("text-anchor", "middle")
          .attr('font-size', 1)
          //.attr('onclick',function(d, i) { return 'tagclicked("'+d.text+'");'; })
          .text(function(d) { return d.text; });

    //Entering and existing words
    cloud.transition()
          .duration(600)
          .style("font-size", function(d) {return d.size + "px"; })
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .style("fill-opacity", 1);

    //Exiting words
    cloud.exit()
          .transition()
          .duration(200)
          .style('fill-opacity', 1e-6)
          .attr('font-size', 1)
          .remove();
  }
  
  var svg3 = d3.select('.nvtooltip > div').append("svg")
              //.attr("width", width)
              .attr("style", "width:146px;height:200px;display:inline-block;")
              //.attr("width", 150)
              .append("g")
              .attr("transform", "translate(73,100)");
      //console.log(svg);
      d3.layout.cloud().size([130, 180])
      .words(word_array3)
      .padding(1)
      .rotate(function() {  var notRandomNumbers = [1, 1, 1, 1, 1, 1, 1, 0, 0, 0];
                            var idx = Math.floor(Math.random() * notRandomNumbers.length);
                            return (notRandomNumbers[idx])*90;})
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw3)
      .start();    
     
      

          function draw3() {
    //Use the 'text' attribute (the word itself) to identity unique elements.
    var cloud = svg3.selectAll("g text")
                    .data(word_array3, function(d) {return d.text; })

    //Entering words
    cloud.enter()
          .append("text")
          .style("font-family", "Impact")
          .style("fill", "rgb(135, 135, 135)")//function(d, i) { return fill(i); }
          .attr("text-anchor", "middle")
          .attr('font-size', 1)
          //.attr('onclick',function(d, i) { return 'tagclicked("'+d.text+'");'; })
          .text(function(d) { return d.text; });

    //Entering and existing words
    cloud.transition()
          .duration(600)
          .style("font-size", function(d) {return d.size + "px"; })
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .style("fill-opacity", 1);

    //Exiting words
    cloud.exit()
          .transition()
          .duration(200)
          .style('fill-opacity', 1e-6)
          .attr('font-size', 1)
          .remove();
  }

      
     // }, 500);
      
      

//for(var i=0;i<timelen;i++){
    /*var splits=tags[e.point.y-1][timestamps.indexOf(e.point.x)].split(',');
    //console.log(splits.length);
    for(var i=0;i<splits.length;i++){
        //console.log(splits[i]);
         $('.nvtooltip > div').append('<p>'+splits[i]+'</p>');
    }
   */
//}


        d3.select('g.nv-interactive').append("g").attr("class", " nv-wrap nv-interactiveLineLayer").append("g").attr("class","nv-interactiveGuideLine").append("line")
				 		.attr("class", "nv-guideline")
				 		.attr("x1", e.pos[0]-100)
				 		.attr("x2", e.pos[0]-100)
				 		.attr("y1", $('.nv-lineChart g rect').attr('height'))
				 		.attr("y2",0)
				 		;
				 	//line.exit().remove();;
				
			
        
        
        var point;
        $('#chart1 .nv-scatterWrap .nv-groups .nv-series-' + (e.point.y - 1) + ' .nv-point').attr("fill", "#666666");
    
    for (var j = 0; j < conlen; j++) {
        for (var i = 0; i < 2; i++) {
            if ((con[j][i].x === e.point.x) && (con[j][i].y === e.point.y)) {

                for (var k = 0; k < con[j].length; k++) {
                    point = ((con[j][k].x - 1344556800000) / 14400000);
                    $('#chart1 .nv-scatterWrap .nv-groups .nv-series-' + (con[j][k].y - 1) + ' .nv-point-' + point).attr("fill", "#666666");
                }               
            }
        }
    }
        point=timestamps.indexOf(e.point.x);
        $('#chart1 .nv-scatterWrap .nv-groups .nv-series-' + (e.point.y - 1) + ' .nv-point-' + point).attr("fill", "#000000");
    }
    else{
        $('.nvtooltip').html('');
    }
    });

    chart.lines.dispatch.on('elementMouseout', function() {
        $('g.nv-interactive').html('');
        $('#chart1 .nv-lineChart circle.nv-point').attr("fill", "#B5B5B5");
    });
    
    
    setTimeout(function() {
var text=$('#admin').text();
$('#chart1 .nv-x .tick text').attr("transform", 'translate(0,'+-($('#chart1').height()-30)+')rotate(45 0 0)');
//$('#chart1 .nv-x .nv-axislabel').attr("transform", 'translate(0,'+-($('#chart1').height()+10)+')');
        for (var i = 0; i < cumlen; i++) {
            for (var j = 0; j < timelen; j++) {
                if(text.substr(8)==="Users"){
                    var cent=users[i][j];
                //if((cent>0)&&(cent<0.2)){cent=1;}
                //else if((cent>0.2)&&(cent<1)){cent=Math.floor(cent*10);}
                //else if(cent===1){cent=10}
                if(cent!==0){cent=(cent-usersmin)/(usersmax)*(9)+1;}
                else{cent=-1;}
                $('#chart1 .nv-scatterWrap .nv-groups .nv-series-' + i + ' .nv-point-' + j).attr("r", cent+1);
                }
                if(text.substr(8)==="Connections"){
                    var cent=connections[i][j];
                //if((cent>0)&&(cent<0.2)){cent=1;}
                //else if((cent>0.2)&&(cent<1)){cent=Math.floor(cent*10);}
                //else if(cent===1){cent=10}
                if(cent!==0){cent=(cent-conmin)/(conmax)*(9)+1;}
                else{cent=-1;}
                $('#chart1 .nv-scatterWrap .nv-groups .nv-series-' + i + ' .nv-point-' + j).attr("r", cent+1);
                }
                if(text.substr(8)==="Centrality"){
                    var cent=centrality[i][j];
                //if((cent>0)&&(cent<0.2)){cent=1;}
                //else if((cent>0.2)&&(cent<1)){cent=Math.floor(cent*10);}
                //else if(cent===1){cent=10}
                if(cent!==0){cent=(cent-centmin)/(centmax)*(9)+1;}
                else{cent=-1;}
                $('#chart1 .nv-scatterWrap .nv-groups .nv-series-' + i + ' .nv-point-' + j).attr("r", cent+1);
                }
                
            }
        }
        
        $('#chart1 .nv-scatterWrap .nv-groups .nv-group circle').attr("stroke-width", "3"); 
        $('#chart1 .nv-scatterWrap .nv-groups .nv-group circle').attr("stroke-opacity", ".3");

       
        d3.select('#chart1')
            .selectAll('path.nv-line')
            .style('opacity', 0);
        $(".nv-y .nv-axisMaxMin").first().hide();
        
        
        
    }, 100);
    return chart;
});
//}
/////////////////////////////GRAPH1///////////////////////////////



/*
/////////////////////////////GRAPH2///////////////////////////////
nv.addGraph(function() {
    chart2 = nv.models.lineChart()
        .interactive(false)
        .margin({left: 100}) 
        .transitionDuration(350) 
        .showLegend(false) 
        .showYAxis(false) 
        .showXAxis(false) 
        .forceX([new Date(mindate), new Date(maxdate)])
        .forceY([1, 10]) 
        .yDomain([11, 1]);

   
    chart2.xAxis
        .axisLabel("Timeslot")
        .tickValues(tickMarks)
        .tickFormat(function(d) {
            return d3.time.format('%a %H:%M')(new Date(d));
        });

    chart2.yAxis
        .tickValues(tickMarks2)
        .tickFormat(function(d) {
            return "Community   " + d;
        });

    d3.select('#chart2 svg')
        .datum(datacon())
        .call(chart2);
    
    setTimeout(function() {

        
        for (var i = 0; i < conlen; i++) {
            d3.select('#chart2 .nv-series-' + i )
                .select('path.nv-line')
                .style('stroke-dasharray', ((10 + conquality[i]) + ', 3'))
                .style('stroke-width', conquality[i] / 2)
                .style('opacity', 0.1 * conquality[i]);
        }
    }, 100);


    return chart2;

});

////////////////////////////////GRAPH2//////////////////////////////////////
*/

function databul() {
    
    for (var i = 0; i < cumlen; i++) {
    cum[i] = [];
}

if($('#admin').text().substr(8)==="Centrality"){
    
    for (var j = 0; j < cumlen; j++) {
        for (var i = 0; i < timelen; i++) {
            cum[j].push({
                x: timestamps[i],
                y: j + 1,
                z: centrality[j][i]
            });

        }
    }
}
if($('#admin').text().substr(8)==="Users"){
    
    for (var j = 0; j < cumlen; j++) {
        for (var i = 0; i < timelen; i++) {
            cum[j].push({
                x: timestamps[i],
                y: j + 1,
                z: users[j][i]
            });

        }
    }
    
}
if($('#admin').text().substr(8)==="Connections"){
    
    for (var j = 0; j < cumlen; j++) {
        for (var i = 0; i < timelen; i++) {
            cum[j].push({
                x: timestamps[i],
                y: j + 1,
                z: connections[j][i]
            });

        }
    }
    
}
    
    var data = [];
    for (var j = 0; j < cumlen; j++) {
        data.push({
            values: cum[j],
            key: "Community " + (j + 1),
            color: "#B5B5B5"
        });
    }
   
    return data;
}

function datacon() {

    for (var j = 0; j < conlen; j++) {
        for (var i = 0; i < 2; i++) {
            con[j].push({
                x: contimestamp[j][i],
                y: concommunity[j][i],
                z: conquality[j]
            });

        }
    }

    var data = [];
    for (var j = 0; j < conlen; j++) {
        data.push({
            values: con[j],
            key: "Community " + j,
            color: "red"
        });
    }

    return data;

}

function databulone(point) {
//alert(point);
cumone.length = 0;
    //for (var j = 0; j < 1; j++) {
    if($('#admin').text().substr(8)==="Users"){
        for (var i = 0; i < timelen; i++) {
            cumone.push({
                x: timestamps[i],
                y: point,
                z: users[point-1][i]
            });

        }
    }
    if($('#admin').text().substr(8)==="Centrality"){
        for (var i = 0; i < timelen; i++) {
            cumone.push({
                x: timestamps[i],
                y: point,
                z: centrality[point-1][i]
            });

        }
    }
    if($('#admin').text().substr(8)==="Connections"){
        for (var i = 0; i < timelen; i++) {
            cumone.push({
                x: timestamps[i],
                y: point,
                z: connections[point-1][i]
            });

        }
    }
        
    //}
    //alert(point);
    var data = [];
    //for (var j = 0; j < 1; j++) {
        data.push({
            values: cumone,
            key: "Community "+point,
            color: "#B5B5B5"
        });
    //}
   
    return data;
}

function gup(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null) return "";
    else return results[1];
}
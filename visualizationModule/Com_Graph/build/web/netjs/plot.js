sigma.utils.pkg('sigma.canvas.nodes');
sigma.canvas.nodes.image = (function() {
  var _cache = {},
      _loading = {},
      _callbacks = {};

  // Return the renderer itself:
  var renderer = function(node, context, settings) {
    var args = arguments,
        prefix = settings('prefix') || '',
        size = node[prefix + 'size'],
        color = node.color || settings('defaultNodeColor'),
        url = node.url;

    if (_cache[url]) {
      context.save();

      // Draw the clipping disc:
      context.beginPath();
      context.arc(
        node[prefix + 'x'],
        node[prefix + 'y'],
        node[prefix + 'size'],
        0,
        Math.PI * 2,
        true
      );
      context.closePath();
      context.clip();

      // Draw the image
      context.drawImage(
        _cache[url],
        node[prefix + 'x'] - size,
        node[prefix + 'y'] - size,
        2 * size,
        2 * size
      );

      // Quit the "clipping mode":
      context.restore();

      // Draw the border:
      context.beginPath();
      context.arc(
        node[prefix + 'x'],
        node[prefix + 'y'],
        node[prefix + 'size'],
        0,
        Math.PI * 2,
        true
      );
      context.lineWidth = size / 8;
      context.strokeStyle = node.color || settings('defaultNodeColor');
      context.stroke();
    } else {
      sigma.canvas.nodes.image.cache(url);
      sigma.canvas.nodes.def.apply(
        sigma.canvas.nodes,
        args
      );
    }
  };

  // Let's add a public method to cache images, to make it possible to
  // preload images before the initial rendering:
  renderer.cache = function(url, callback) {
    if (callback)
      _callbacks[url] = callback;

    if (_loading[url])
      return;

    var img = new Image();

    img.onload = function() {
      _loading[url] = false;
      _cache[url] = img;

      if (_callbacks[url]) {
        _callbacks[url].call(this, img);
        delete _callbacks[url];
      }
    };

    _loading[url] = true;
    img.src = url;
  };

  return renderer;
})();


sigma.classes.graph.addMethod('neighbors', function(nodeId) {
    var k,
        neighbors = {},
        index = this.allNeighborsIndex[nodeId] || {};

    for (k in index)
      neighbors[k] = this.nodesIndex[k];

    return neighbors;
  });
  
  
  /**
 * This is an example on how to use sigma filters plugin on a real-world graph.
 */
//var filter;

/**
 * DOM utility functions
 */

/*
var _ = {
  $: function (id) {
    return document.getElementById(id);
  },

  all: function (selectors) {
    return document.querySelectorAll(selectors);
  },

  removeClass: function(selectors, cssClass) {
    var nodes = document.querySelectorAll(selectors);
    var l = nodes.length;
    for ( i = 0 ; i < l; i++ ) {
      var el = nodes[i];
      // Bootstrap compatibility
      el.className = el.className.replace(cssClass, '');
    }
  },

  addClass: function (selectors, cssClass) {
    var nodes = document.querySelectorAll(selectors);
    var l = nodes.length;
    for ( i = 0 ; i < l; i++ ) {
      var el = nodes[i];
      // Bootstrap compatibility
      if (-1 == el.className.indexOf(cssClass)) {
        el.className += ' ' + cssClass;
      }
    }
  },

  show: function (selectors) {
    this.removeClass(selectors, 'hidden');
  },

  hide: function (selectors) {
    this.addClass(selectors, 'hidden');
  },

  toggle: function (selectors, cssClass) {
    var cssClass = cssClass || "hidden";
    var nodes = document.querySelectorAll(selectors);
    var l = nodes.length;
    for ( i = 0 ; i < l; i++ ) {
      var el = nodes[i];
      //el.style.display = (el.style.display != 'none' ? 'none' : '' );
      // Bootstrap compatibility
      if (-1 !== el.className.indexOf(cssClass)) {
        el.className = el.className.replace(cssClass, '');
      } else {
        el.className += ' ' + cssClass;
      }
    }
  }
};


function updatePane (graph, filter) {
  // get max degree
  var maxDegree = 0;
  
  // read nodes
  graph.nodes().forEach(function(n) {
    maxDegree = Math.max(maxDegree, graph.degree(n.id));
  })

  // min degree
  _.$('min-degree').max = maxDegree;
  _.$('max-degree-value').textContent = maxDegree;
  
 
  // reset button
  _.$('reset-btn').addEventListener("click", function(e) {
    _.$('min-degree').value = 0;
    _.$('min-degree-val').textContent = '0';
    filter.undo().apply();
    _.$('dump').textContent = '';
    _.hide('#dump');
  });

  
}
*/
var s,s2,
    N,
    C,
    datag,
    timeclick,
    clickeduser,
    clickedavatar,
    flag=0,
    bigger=0,
    end,
    start,
    myinter,
    //loaded = 0,
    comclick,
    urls = [],
    labels=[],
    locations=[],
    tweets=[],
    description=[],
    following=[],
    followers=[],
    username=[],
    sizesnow=[],
    nowx=[],
    nowy=[],
    indexes=[];
    var g1,myinterval;
    
     window.onload = function(){
          g1 = new JustGage({
          id: "g1", 
          value: 50, 
          min: 0,
          max: 100,
          title: "Connections Percentage",
          label: "% of total",
		  levelColors: [
          "#00fff6",
          "#5d9fd2",
          "#0089ff"
        ]       
        });
      
      
        //setTimeout(function(){  
        $('#g1 svg text').eq(0).attr('y','12');
        $('#g1 svg text').eq(1).attr('y','10');
        $('#g1 svg text').eq(2).attr('y','7');
        $('#g1 svg text').eq(3).attr('y','5');
        $('#g1 svg text').eq(4).attr('y','5');
         myinterval=setInterval(function() {
          g1.refresh(50);
        }, 1500);
        //}, 3000);
      };
    
/////////////////////////////////////////////////////
function createnet(com,timeslot){
    
    
    
    
    bigger=0;
    urls.length=0;
    labels.length=0;
    locations.length=0;
    description.length=0;
    tweets.length=0;
    following.length=0;
    followers.length=0;
    username.length=0;
    sizesnow.length=0;
    nowx.length=0;
    nowy.length=0;
    start=0;
    end=0;
    indexes.length=[];
   // loaded=0;
     //$('#comtitle').text('Community '+com);
     //$('#datenum').text(d3.time.format('%a %H:%M')(new Date(timestamps[timeslot])));
     $('.content').hide(500);
var o,
    E,
    allcon=0,
    g = {
      nodes: [],
      edges: []
    };
    timeclick=timeslot;
    comclick=com;
    //alert(comclick);

$.ajax({
    type: "GET",
    url: "jsons/"+colname+"users"+comclick+".json",
    dataType: "json",
    success: function(data) {
        datag=data;
        N=data.datasetInfo.allUsernames.length;
        E=data.connections[timeclick].timestamp_connections.length;
        C=data.connections.length;
        
        
        
    
    for(var i=0;i<C;i++){
        indexes.push(centrality[comclick-1][i]);
    }
    for(var i=0;i<C;i++){
        if(indexes[i]!==0){start=i;break}
    }
    for(var i=C-1;i>=0;i--){
        if(indexes[i]!==0){end=i;break}
    }
    
 if(timeclick===start){$('#prev').hide(500);}
 if(timeclick===end){$('#next').hide(500);}
 if((timeclick>start)&&(timeclick<end)){$('#next').show(500);$('#prev').show(500);}
        
        for(var i=0;i<data.datasetInfo.allUsernames.length;i++){
            if(data.datasetInfo.allUsernames[i].avatar===""){urls.push('imgs/noprofile.gif');}
            else{urls.push(data.datasetInfo.allUsernames[i].avatar);}
            
            if(data.datasetInfo.allUsernames[i].screen_name===""){labels.push('-');}
            else{labels.push(data.datasetInfo.allUsernames[i].screen_name);}
            
            if(data.datasetInfo.allUsernames[i].location===""){locations.push('Unkown');}
            else{locations.push(data.datasetInfo.allUsernames[i].location);}
            
            if(data.datasetInfo.allUsernames[i].name===""){username.push('-');}
            else{username.push(data.datasetInfo.allUsernames[i].name);} 
                        
            var desc=data.datasetInfo.allUsernames[i].description;
            if(desc){
                if(desc.length>40){desc=desc.substring(0,37)+"...";}
            }
            else{desc="None";}
            description.push(desc);
            
            if(data.datasetInfo.allUsernames[i].friends_count===""){following.push(0);}
            else{following.push(data.datasetInfo.allUsernames[i].friends_count);}
            
            if(data.datasetInfo.allUsernames[i].followers_count===""){followers.push(0);}
            else{followers.push(data.datasetInfo.allUsernames[i].followers_count);}
            
            if(data.datasetInfo.allUsernames[i].statuses_count===""){tweets.push(0);}
            else{tweets.push(data.datasetInfo.allUsernames[i].statuses_count);}
                              
            sizesnow.push(0);
        }
       
   
for (i = 0; i < E; i++){
    var con=data.connections[timeclick].timestamp_connections[i].split(';');
    allcon+=1*con[2];
        for(var j=0;j<data.datasetInfo.allUsernames.length;j++){
            
            if(data.connections[timeclick].timestamp_connections[i].indexOf(labels[j])>-1){
                //if(sizesnow[j]===-1){sizesnow[j]=1;}
                sizesnow[j]=sizesnow[j]+1*con[2];
            }
              
        }
        //console.log(E+"-"+C);
  g.edges.push({
    id: 'e' + i,
    source: 'n' + labels.indexOf(con[0]),
    target: 'n' + labels.indexOf(con[1]),
    size:con[2],
    //color:"#ff0000"
    //type: "arrow"
    type: "curvedArrow"
    //type: 'curve'
    //head: 'arrow'
  });
  //if(labels.indexOf(con[0]===-1)){console.log(con[0])}
  //console.log(labels.indexOf(con[0])+"-"+con[0]);
    }



if(E!==0){
    //$('#nodata').hide(500);
// Generate a random graph:
for (i = 0; i < N; i++) {
    nowx[i]=Math.random();
    nowy[i]=Math.random();
    //if(sizesnow[i]>0){
  o = {
    id: 'n' + i,
    label: labels[i],
    type: 'image',
    url: urls[i],
    x: nowx[i],
    y: nowy[i],
    size: sizesnow[i],
    color: '#5d9fd2',
    username:username[i],
    description:description[i],
    following:following[i],
    followers:followers[i],
    locations:locations[i],
    tweets:tweets[i]
  };
  g.nodes.push(o);
    //}
  
  if(sizesnow[i]>0){bigger++;}
}
}
else{
    //$('#nodata').show(1000);
}

sigma.renderers.def = sigma.renderers.canvas;




//urls.forEach(function(url,index) {
    
    //if(sizesnow[index]>0){
 
       // sigma.canvas.nodes.image.cache(
   // url,
    //function() {//console.log("B: "+bigger+" L: "+loaded);
      //if ((++loaded >= bigger/1.5)&&(flag===0)){
          
          //flag=1;
         // setTimeout(function(){
        // Instantiate sigma:
        s = new sigma({
          graph: g,
          renderer: {
            // IMPORTANT:
            // This works only with the canvas renderer, so the
            // renderer type set as "canvas" is necessary here.
            container: document.getElementById('graph-container'),
            type: 'canvas'
          },settings: {
    animationsTime: 1000,
    minNodeSize: 8,
    maxNodeSize: 25
  }
        });
        
        s.graph.nodes().forEach(function(node) {
  if(node.size===0){node.hidden = true;}
});

if($('#expand').is(":visible")){
      s.graph.nodes().forEach(function(node) {
  if(node.size===1){node.hidden = true;}
});
} 
else{
      s.graph.nodes().forEach(function(node) {
  if(node.size===1){node.hidden = false;}
});
}

// Refresh the renderers to make the changes effective:
s.refresh();
    //sigma.plugins.dragNodes(s, s.renderers[0]);
    
   // We first need to save the original colors of our
      // nodes and edges, like this:
      s.graph.nodes().forEach(function(n) {
        n.originalColor = n.color;
      });
      s.graph.edges().forEach(function(e) {
        e.originalColor = e.color;
      });
      
      s.bind('clickNode', function(e) {
         
          g1.refresh((((e.data.node.size)*100)/allcon).toFixed(2));
           clearInterval(myinterval);
           myinterval=setInterval(function() {
         g1.refresh((((e.data.node.size)*100)/allcon).toFixed(2));
        }, 500);
          jQuery( ".user-profile" ).show(500);
          //console.dir(e);
          //console.dir(e.data.node.label);
          //console.dir(e.data.node.url);
          jQuery( ".bio" ).text("@"+e.data.node.label);
          jQuery( ".avatar" ).attr('src',e.data.node.url);
          jQuery( "#infophoto img" ).attr('src',e.data.node.url);
          jQuery( "#infouser" ).text("@"+e.data.node.label);
          jQuery( "#link" ).attr('href','https://twitter.com/'+e.data.node.label);
          jQuery( "#link2" ).attr('href','https://twitter.com/'+e.data.node.label);
          jQuery( ".username" ).text(e.data.node.username);
          jQuery( "#infoname" ).text(e.data.node.username);
          jQuery( ".description" ).text(e.data.node.description);
          jQuery( "#infodesc" ).text(e.data.node.description);
          jQuery( ".data li" ).eq(1).html('<span>'+e.data.node.following+'</span><p>Following</p>');
          jQuery( "#infofw" ).html('<span>'+e.data.node.following+'</span><br><span>Following</span>');
          jQuery( ".data li" ).eq(2).html('<span>'+e.data.node.followers+'</span><p>Followers</p>');
          jQuery( "#infofs" ).html('<span>'+e.data.node.followers+'</span><br><span>Followers</span>');
          jQuery( ".data li" ).eq(0).html('<span>'+e.data.node.tweets+'</span><p>Tweets</p>');
          jQuery( "#infotw" ).html('<span>'+e.data.node.tweets+'</span><br><span>Tweets</span>');
          jQuery( "#infoloc" ).html('<img src="imgs/loca.png" alt="error">'+e.data.node.locations);
          
 
          
        var nodeId = e.data.node.id,
            toKeep = s.graph.neighbors(nodeId);
        toKeep[nodeId] = e.data.node;

        s.graph.nodes().forEach(function(n) {
          if (toKeep[n.id])
            n.color = n.originalColor;
          else
            n.color = '#eee';
        });

        s.graph.edges().forEach(function(e) {
          if (toKeep[e.source] && toKeep[e.target])
            e.color = e.originalColor;
          else
            e.color = '#eee';
        });

        // Since the data has been modified, we need to
        // call the refresh method to make the colors
        // update effective.
        s.refresh();
      });
      
    
      
       // When the stage is clicked, we just color each
      // node and edge with its original color.
    s.bind('clickStage', function(e) {
        jQuery( ".user-profile" ).hide(1000);
        s.graph.nodes().forEach(function(n) {
          n.color = n.originalColor;
        });

        s.graph.edges().forEach(function(e) {
          e.color = e.originalColor;
        });

        // Same as in the previous event:
        s.refresh();
      });
      myinter=setInterval(function(){ s.refresh();}, 1500);
      //setTimeout(function(){s.refresh();}, ((bigger/42)*400)+500);
      //setTimeout(function(){s.refresh();}, 5000);
      //setTimeout(function(){s.refresh();}, 7000);
      //setTimeout(function(){s.refresh();}, ((bigger/42)*800)+1000);
      
      s.startForceAtlas2();//s.stopForceAtlas2();
     
     /* 
       filter = new sigma.plugins.filter(s);

  updatePane(s.graph, filter);

  function applyMinDegreeFilter(e) {
    var v = e.target.value;
    _.$('min-degree-val').textContent = v;

    filter
      .undo('min-degree')
      .nodesBy(function(n) {
        return this.degree(n.id) >= v;
      }, 'min-degree')
      .apply();
  }

  _.$('min-degree').addEventListener("input", applyMinDegreeFilter);  // for Chrome and FF
  _.$('min-degree').addEventListener("change", applyMinDegreeFilter); // for IE10+, that sucks
  
    */
  // }, 500);
     // }
    //}
 // );
//}
//});
 },
    async: false
});
}
    ////////////////////////////////////////////////////////////

    
/*for (i = 0; i < 101; i++) {
  setTimeout((function(i) {
    return function() {
      var angle = i / 100;
      s.cameras[0].angle = angle;
      s.refresh();
    };
  })(i), 100*i);
}
*/


function animate(direction) {
    jQuery( ".user-profile" ).hide(1000);
    clearInterval(myinter);
    
   s.killForceAtlas2();
   s.graph.nodes().forEach(function(node,index) {
            nowx[index]=node.x;
            nowy[index]=node.y;
});
    
    //$('#nodata').hide(500);
    bigger=0;
    $('#graph-container').html('');
     var o,
         E,
         allcon=0,
         sizesnxt=[],
         //nowxnxt=[],
         //nowynxt=[],
         g = {
          nodes: [],
          edges: []
         };
       //console.log(timeclick);
   if(direction===-2){
       do{    
       timeclick--;
       if(timeclick===start){$('#prev').hide(500);break;}
   }while((indexes[timeclick]===0));
    $('#next').show(500);
    
    
}
else if (direction===-1){
       do{    
       timeclick++;
       if(timeclick===end){$('#next').hide(500);break;}
   }while((indexes[timeclick]===0));
    $('#prev').show(500);
   
}
else{
    timeclick=direction;
}

if(timeclick===start){$('#prev').hide(500);$('#next').show(500);}
if(timeclick===end){$('#next').hide(500);$('#prev').show(500);}
if((timeclick>start)&&(timeclick<end)){$('#next').show(500);$('#prev').show(500);}

 $('#chart3 .nv-lineChart circle.nv-point').attr("fill", "#B5B5B5");
 $('#chart3 .nv-scatterWrap .nv-groups .nv-series-0 .nv-point-'+timeclick).attr("fill", "#ff0000");

 //$('#comtitle').text('Community '+com);
     //$('#datenum').text(d3.time.format('%a %H:%M')(new Date(timestamps[timeclick])));
   
    
    $.ajax({
    type: "GET",
    url: "jsons/"+colname+"users"+comclick+".json",
    dataType: "json",
    success: function(data) {
       // N=data.datasetInfo.allUsernames.length;
        E=data.connections[timeclick].timestamp_connections.length;
        //C=data.connections.length;
        
        //if(timeclick===0){$('#prev').hide();}
        //if(timeclick===C-1){$('#next').hide();}
        
        for(var i=0;i<N;i++){
            //urls.push(data.datasetInfo.allUsernames[i].avatar);
            //labels.push(data.datasetInfo.allUsernames[i].user);
            sizesnxt.push(0);
        }
       
   
for (i = 0; i < E; i++){
    var con=data.connections[timeclick].timestamp_connections[i].split(';');
    allcon+=1*con[2];
        for(var j=0;j<N;j++){
            
            if(data.connections[timeclick].timestamp_connections[i].indexOf(labels[j])>-1){
                //if(sizesnxt[j]===-1){sizesnxt[j]=1;}
               sizesnxt[j]=sizesnxt[j]+1*con[2];
            }
              
        }
        
  g.edges.push({
    id: 'e' + i,
    source: 'n' + labels.indexOf(con[0]),
    target: 'n' + labels.indexOf(con[1]),
    size:con[2],
    type: "curvedArrow"
    //type: 'curve'
    //head: 'arrow'
  });
    }



if(E!==0){
// Generate a random graph:
//$('#nodata').hide(500);
for (i = 0; i < N; i++) {
   //nowxnxt[i]=Math.random();
   //nowynxt[i]=Math.random();
   //if(sizesnxt[i]>0){
  o = {
    id: 'n' + i,
    label: labels[i],
    type: 'image',
    url: urls[i],
    now1_x: nowx[i],
    now1_y: nowy[i],
    now1_size: sizesnow[i],
    now1_color: '#5d9fd2',
    now2_x: nowx[i],
    now2_y: nowy[i],
    now2_size: sizesnxt[i],
    now2_color: '#5d9fd2',
    username:username[i],
    description:description[i],
    following:following[i],
    followers:followers[i],
    locations:locations[i],
    tweets:tweets[i]
  };

  ['x', 'y', 'size', 'color'].forEach(function(val) {
    o[val] = o['now1_' + val];
  });

  g.nodes.push(o);
  // }
   if(sizesnxt[i]>0){bigger++;}
}
    }
    else{
    //$('#nodata').show(500);
}
        
        /*
    
    if(E!==0){
    $('#nodata').hide(500);
// Generate a random graph:
for (i = 0; i < N; i++) {
    nowx[i]=Math.random();
    nowy[i]=Math.random();
    if(sizesnow[i]>0){
  o = {
    id: 'n' + i,
    label: labels[i],
    type: 'image',
    url: urls[i],
    x: nowx[i],
    y: nowy[i],
    size: sizesnow[i],
    color: '#5d9fd2'
  };
  g.nodes.push(o);
    }
  
  if(sizesnow[i]>0){bigger++;}
}
}
else{
    $('#nodata').show(500);
}
*/
    
    
//sizesnow=[];
//console.log("Sizenow1-"+sizesnow);
//console.log("Sizenxt1-"+sizesnxt);

//console.log("Sizenow2-"+sizesnow);
//console.log("Sizenxt2-"+sizesnxt);



if(s){
     s.graph.clear();
    //this gets rid of any methods you've attached to s.
    s.graph.kill();
   // your code here.
 };
//this gets rid of all the ndoes and edges
   
//loaded=0;
//urls.forEach(function(url) {
  //sigma.canvas.nodes.image.cache(
   // url,
    //function() {
      //if (++loaded === urls.length){
        // Instantiate sigma:
        s = new sigma({
          graph: g,
          renderer: {
            // IMPORTANT:
            // This works only with the canvas renderer, so the
            // renderer type set as "canvas" is necessary here.
            container: document.getElementById('graph-container'),
            type: 'canvas'
          },settings: {
    animationsTime: 1000,
    minNodeSize: 8,
    maxNodeSize: 25
  }
        });
        
        
   setTimeout(function(){
  s.graph.nodes().forEach(function(node,index) {
             //console.log(node.size+"-"+node.label);
  if(sizesnxt[index]===0){
  node.hidden = true;
              }
});


}, 900);     

s.graph.nodes().forEach(function(node,index) {
             //console.log(node.size+"-"+node.label);
  if((sizesnxt[index]===0)&&(sizesnow[index]===0)){
  node.hidden = true;
              }
              
              if($('#expand').is(":visible")){
     // s.graph.nodes().forEach(function(node) {
  if(sizesnxt[index]===1){node.hidden = true;}
//});
} 
else{
      //s.graph.nodes().forEach(function(node) {
  if(sizesnxt[index]===1){node.hidden = false;}
//});
}
              
              
});

sizesnow = sizesnxt.slice(0);
//nowx = nowxnxt.slice(0);
//nowy = nowynxt.slice(0);

// Refresh the renderers to make the changes effective:
//s.refresh();
   // sigma.plugins.dragNodes(s, s.renderers[0]);
    
    // We first need to save the original colors of our
      // nodes and edges, like this:
      s.graph.nodes().forEach(function(n) {
        n.originalColor = n.color;
      });
      s.graph.edges().forEach(function(e) {
        e.originalColor = e.color;
      });
      
      s.bind('clickNode', function(e) {
          g1.refresh((((e.data.node.size)*100)/allcon).toFixed(2));
           clearInterval(myinterval);
           myinterval=setInterval(function() {
         g1.refresh((((e.data.node.size)*100)/allcon).toFixed(2));
        }, 500);
          jQuery( ".user-profile" ).show(500);
          //console.dir(e);
          //console.dir(e.data.node.label);
          //console.dir(e.data.node.url);
          jQuery( ".bio" ).text("@"+e.data.node.label);
          jQuery( ".avatar" ).attr('src',e.data.node.url);
          jQuery( "#infophoto img" ).attr('src',e.data.node.url);
          jQuery( "#infouser" ).text("@"+e.data.node.label);
          jQuery( "#link" ).attr('href','https://twitter.com/'+e.data.node.label);
          jQuery( "#link2" ).attr('href','https://twitter.com/'+e.data.node.label);
          jQuery( ".username" ).text(e.data.node.username);
          jQuery( "#infoname" ).text(e.data.node.username);
          jQuery( ".description" ).text(e.data.node.description);
          jQuery( "#infodesc" ).text(e.data.node.description);
          jQuery( ".data li" ).eq(1).html('<span>'+e.data.node.following+'</span><p>Following</p>');
          jQuery( "#infofw" ).html('<span>'+e.data.node.following+'</span><br><span>Following</span>');
          jQuery( ".data li" ).eq(2).html('<span>'+e.data.node.followers+'</span><p>Followers</p>');
          jQuery( "#infofs" ).html('<span>'+e.data.node.followers+'</span><br><span>Followers</span>');
          jQuery( ".data li" ).eq(0).html('<span>'+e.data.node.tweets+'</span><p>Tweets</p>');
          jQuery( "#infotw" ).html('<span>'+e.data.node.tweets+'</span><br><span>Tweets</span>');
          jQuery( "#infoloc" ).html('<img src="imgs/loca.png" alt="error">'+e.data.node.locations);
          
        var nodeId = e.data.node.id,
            toKeep = s.graph.neighbors(nodeId);
        toKeep[nodeId] = e.data.node;

        s.graph.nodes().forEach(function(n) {
          if (toKeep[n.id])
            n.color = n.originalColor;
          else
            n.color = '#eee';
        });

        s.graph.edges().forEach(function(e) {
          if (toKeep[e.source] && toKeep[e.target])
            e.color = e.originalColor;
          else
            e.color = '#eee';
        });

        // Since the data has been modified, we need to
        // call the refresh method to make the colors
        // update effective.
        s.refresh();
      });
      
       // When the stage is clicked, we just color each
      // node and edge with its original color.
    s.bind('clickStage', function(e) {
         jQuery( ".user-profile" ).hide(1000);
        s.graph.nodes().forEach(function(n) {
          n.color = n.originalColor;
        });

        s.graph.edges().forEach(function(e) {
          e.color = e.originalColor;
        });

        // Same as in the previous event:
        s.refresh();
      });
      myinter=setInterval(function(){ s.refresh();}, 1500);
      //setTimeout(function(){s.refresh();}, ((bigger/42)*400)+500);
      //setTimeout(function(){s.refresh();}, 3000);
      setTimeout(function(){s.startForceAtlas2();}, 2000);
      //setTimeout(function(){s.refresh();}, 7000);
      //setTimeout(function(){s.refresh();}, ((bigger/42)*800)+1000);
    
    
    var prefix = 'now2_';
  sigma.plugins.animate(
    s,
    {
      x: prefix + 'x',
      y: prefix + 'y',
      size: prefix + 'size',
      color: prefix + 'color'
    }
  );
  s.refresh();
    //}
   // }
 // );
//});
 },
    async: false
});
    
    
    
    
  


//this gets rid of all the ndoes and edges
    //s.graph.clear();
    //this gets rid of any methods you've attached to s.
    //s.graph.kill();


    
}


jQuery( "#back" ).click(function() {
    
    clearInterval(myinter);
    s.killForceAtlas2();
  $('#container').stop().animate({"opacity": 0}, 1000, function() {
            $('#graph-container').html('');
            jQuery( ".user-profile" ).hide(1000);
  });
  //$('#nodata').hide(500);
  $('#chart2,#chart1').show();
  $('.content').show(500);
  $('#chart3').html('<svg></svg>');
  $('#chart2,#chart1').stop().animate({"opacity": 1}, 1000, function() {
            
        });
});

jQuery( "#prev, #next" ).click(function() {
  if($(this).attr('id')==="next"){animate(-1);}
  else{animate(-2);}
});

jQuery( "#closeuser" ).click(function() {
  jQuery( ".user-profile" ).hide(1000);
});
jQuery( "#closeconve" ).click(function() {
  jQuery('#conve').stop().slideToggle();
 var vague = $("#myModal2").Vague({intensity:0});
vague.blur();
jQuery('#overlay').hide();
jQuery('#vague-svg-blur').remove();
});
jQuery( "#overlay" ).click(function() {
   jQuery('#conve').stop().slideToggle();
 var vague = $("#myModal2").Vague({intensity:0});
vague.blur();
jQuery('#overlay').hide();
jQuery('#vague-svg-blur').remove();
});




jQuery( "#more img" ).click(function() {
    
 $('#myModal2').reveal();
 
 
 /////////////////////////////////////NEW GRAPH INSIDE  //////////////////////////////////////////////     
  //bigger=0;
    //urls.length=0;
    //labels.length=0;
    //sizesnow.length=0;
    //nowx.length=0;
    //nowy.length=0;
    //start=0;
    //end=0;
    //indexes.length=[];
   // loaded=0;
     //$('#comtitle').text('Community '+com);
     //$('#datenum').text(d3.time.format('%a %H:%M')(new Date(timestamps[timeslot])));
     $('#graph-container-inside').html('');
     $('#chart4').html('<svg></svg>');
     
var o,
    E,
    sizesnowin=[],
    namesgraph=[],
    sizecon=[],
    g = {
      nodes: [],
      edges: []
    };
    //timeclick=timeslot;
    //comclick=com;
    
        //N=data.datasetInfo.allUsernames.length;//users
        E=datag.connections[timeclick].timestamp_connections.length;//timeslot connections
        //C=data.connections.length;//timeslots
        
        
 
        
        for(var i=0;i<N;i++){
            
            sizesnowin.push(0);
            sizecon.push(0);
        }
       
var username=jQuery( ".bio" ).text().substring(1);
var direct;
for (var i = 0; i < E; i++){
    var con=datag.connections[timeclick].timestamp_connections[i].split(';');
       // for(var j=0;j<datag.datasetInfo.allUsernames.length;j++){
            
            if(datag.connections[timeclick].timestamp_connections[i].indexOf(username)>-1){
                if (con[1]===username){direct="#5d9fd2";}
                else{direct="#2ca02c"}
                g.edges.push({
    id: 'e' + i,
    source: 'n' + labels.indexOf(con[0]),
    target: 'n' + labels.indexOf(con[1]),
    size:con[2],
    color:direct,
    type: "curvedArrow"
    //type: 'curve'
    //head: 'arrow'
  });
                //if(sizesnow[j]===-1){sizesnow[j]=1;}
                sizesnowin[labels.indexOf(con[0])]=sizesnowin[labels.indexOf(con[0])]+1*con[2];
                sizesnowin[labels.indexOf(con[1])]=sizesnowin[labels.indexOf(con[1])]+1*con[2];
                //sizecon[labels.indexOf(con[0])]=sizecon[labels.indexOf(con[0])]+1*con[2];
                //sizecon[labels.indexOf(con[1])]=sizecon[labels.indexOf(con[1])]+1*con[2];
            }
              
       // }
        //console.log(E+"-"+C);
  
  //if(labels.indexOf(con[0]===-1)){console.log(con[0])}
  //console.log(labels.indexOf(con[0])+"-"+con[0]);
    }



//if(E!==0){
    //$('#nodata').hide(500);
// Generate a random graph:
for (i = 0; i < N; i++) {
   // nowx[i]=
   // nowy[i]=
    //if(sizesnow[i]>0){
  o = {
    id: 'n' + i,
    label: labels[i],
    type: 'image',
    url: urls[i],
    x: Math.random(),
    y: Math.random(),
    size: sizesnowin[i],
    color: '#5d9fd2'
    //takis:"DA"
  };
  g.nodes.push(o);
    //}
  
  
}
//}
//else{
    //$('#nodata').show(1000);
//}
 
 
 
 
           s2 = new sigma({
          graph: g,
          renderer: {
            // IMPORTANT:
            // This works only with the canvas renderer, so the
            // renderer type set as "canvas" is necessary here.
            container: document.getElementById('graph-container-inside'),
            type: 'canvas'
          },settings: {
    animationsTime: 1000,
    minNodeSize: 8,
    maxNodeSize: 25
  }
        });
         s2.graph.nodes().forEach(function(node) {
  if(node.size===0){node.hidden = true;}
});
s2.refresh();

s2.graph.nodes().forEach(function(n) {
        n.originalColor = n.color;
      });
      s2.graph.edges().forEach(function(e) {
        e.originalColor = e.color;
      });
      
  s2.bind('clickNode', function(e) { 
  
  var nodeId = e.data.node.id,
            toKeep = s2.graph.neighbors(nodeId);
        toKeep[nodeId] = e.data.node;

        s2.graph.nodes().forEach(function(n) {
          if (toKeep[n.id])
            n.color = n.originalColor;
          else
            n.color = '#eee';
        });
        //console.log(nodeId);
        //console.dir(e.data.node);

        s2.graph.edges().forEach(function(e) {
          if (toKeep[e.source] && toKeep[e.target])
            e.color = e.originalColor;
          else
            e.color = '#eee';
        });

        // Since the data has been modified, we need to
        // call the refresh method to make the colors
        // update effective.
        s2.refresh();
        //console.dir(e);
        if(e.data.node.label===username){
        d3.selectAll(".nv-series-0 .nv-bar").attr('style','fill: rgb(93, 159, 210);stroke: rgb(93, 159, 210);');
        d3.selectAll(".nv-series-1 .nv-bar").attr('style','fill: rgb(44, 160, 44);stroke: rgb(44, 160, 44);');
        //$(".s3d").hide(500,function(){
      //$(".s3d").css('visibility','hidden');
    //});
        
        }
        else{
            //if ($(".s3d").css("visibility") === "hidden") {
              //  $(".s3d").css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0});
            //} 
            
            //$(".s3d").show(500);
            //console.dir(namesgraph);
            clickeduser=e.data.node.label;
            d3.selectAll(".nv-series-0 .nv-bar").attr('style','fill: rgb(93, 159, 210);stroke: rgb(93, 159, 210);');
            d3.selectAll(".nv-series-1 .nv-bar").attr('style','fill: rgb(44, 160, 44);stroke: rgb(44, 160, 44);');
        $(".nv-series-0").children().eq(namesgraph.indexOf(e.data.node.label)).attr('style','fill: #ff0000;stroke: #ff0000;');    
        $(".nv-series-1").children().eq(namesgraph.indexOf(e.data.node.label)).attr('style','fill: #ff0000;stroke: #ff0000;');    
        }
  
  });  
  
  s2.bind('clickStage', function(e) {
      s2.graph.nodes().forEach(function(n) {
          n.color = n.originalColor;
        });

        s2.graph.edges().forEach(function(e) {
          e.color = e.originalColor;
        });

        // Same as in the previous event:
        s2.refresh();
        //$(".s3d").hide(500,function(){
      //$(".s3d").css('visibility','hidden');
    //});
        d3.selectAll(".nv-series-0 .nv-bar").attr('style','fill: rgb(93, 159, 210);stroke: rgb(93, 159, 210);');
        d3.selectAll(".nv-series-1 .nv-bar").attr('style','fill: rgb(44, 160, 44);stroke: rgb(44, 160, 44);');
         
  });  
  s2.killForceAtlas2();
  s2.startForceAtlas2();
          
///////////////////////////////////////////////////////////   /////////////////////////////////////////////       
 


    var values = [];
    var values2 = [];
    var name;
    var itemAmount=0;
    var itemAmount2=0;
    
    /*for ( var i = 0,j = 0; i < N; i++) {
        if(sizesnowin[i]>0){
            if(labels[i]!==username){
                namesgraph[j]=labels[i];
                j++;
                if(labels[i].length>8){name=labels[i].substring(0,8)+"..";}
                else{name =labels[i];}
       
       itemAmount = sizesnowin[i];
        values.push({"label": name, "value": itemAmount,"realname":labels[i]});
    }
}
    }
    var data= [{
        "values" : values
    }];
*/


for ( var i = 0,j = 0; i < N; i++) {
     if(sizesnowin[i]>0){
         
         if(labels[i]!==username){
             namesgraph[j]=labels[i];
                j++;
                if(labels[i].length>8){name=labels[i].substring(0,8)+"..";}
                else{name =labels[i];}
     itemAmount=0;
     itemAmount2=0;
       //itemAmount = sizesnowin[i];
       //E=datag.connections[timeclick].timestamp_connections.length;//timeslot connections
       //
        for (var k = 0; k < E; k++){
            
             var con=datag.connections[timeclick].timestamp_connections[k].split(';');
       // for(var j=0;j<datag.datasetInfo.allUsernames.length;j++){
            
            if((datag.connections[timeclick].timestamp_connections[k].indexOf(labels[i])>-1) &&(datag.connections[timeclick].timestamp_connections[k].indexOf(username)>-1)){
               
                if (con[1]===username){itemAmount2=itemAmount2+1*con[2];}
                else{itemAmount=itemAmount+1*con[2];}
            }
            
        }
        
                
        values.push({x: name, y: itemAmount2,realname:labels[i],takis:itemAmount});
        values2.push({x: name, y: itemAmount,realname:labels[i]});
             
         }
     }
}
var data= [{
        values : values,
        key:"IN",
        color:"#5d9fd2"
    },
    {values : values2,
        key:"OUT",
        color:"#2ca02c"}];
/*var   test_data = [
      {
        values:[
          {x:"M",y:1,realname:"takis"},
          {x:"T",y:2},
          {x:"W",y:3},
          {x:"R",y:3},
          {x:"F",y:4},
          {x:"S",y:5},
          {x:"U",y:6}
        ],
        key:"OUT",
        color:"#5d9fd2"
      },
      {
        values:[
          {x:"M",y:5},
          {x:"T",y:2},
          {x:"W",y:6},
          {x:"R",y:8},
          {x:"F",y:2},
          {x:"S",y:4},
          {x:"U",y:1}
        ],
        key:"IN",
		color:"#2ca02c"
      }
    ];

 */



nv.addGraph(function() {  
  var chart = nv.models.multiBarChart()
      //.x(function(d) { return d.label })
      //.y(function(d) { return d.value })
      //.staggerLabels(true)
      //.staggerLabels(data[0].values.length >1)
      .tooltips(true)
      //.barColor(d3.scale.category20().range())
      .stacked(true).showControls(false)
      .duration(1300)//only in liq this works
      //.margin({bottom: 100, left: 70})
      //.rotateLabels(45)
      .groupSpacing(0.05)
      .reduceXTicks(false)//.staggerLabels(true)
        
      //.showLegend(false)
              //.rotate(45)
      .margin({bottom: 80})
      //.showValues(true)
      //.transitionDuration(250)
      //.color(["#5d9fd2","#ff0000"])
      .tooltipContent(function(key, x, y, realname) {
          //console.dir(realname);
  if(realname.point.series===0){
        return '<h3><img class="toolimg" src="' + urls[labels.indexOf(realname.point.realname)] + '" onError="this.src=\'imgs/noprofile.gif\';"/><p>'+realname.point.realname+'</p></h3>' + '<p>In:  ' + realname.point.y + '</p>'+ '<p>Out:  ' + realname.point.takis + '</p>';
    }
    else{
        return '<h3><img class="toolimg" src="' + urls[labels.indexOf(realname.point.realname)] + '" onError="this.src=\'imgs/noprofile.gif\';"/><p>'+realname.point.realname+'</p></h3>' + '<p>In:  ' + realname.point.y0 + '</p>'+ '<p>Out:  ' + realname.point.y + '</p>';
    }
          })
      ;
      
      
      
        chart.yAxis.tickFormat(d3.format('d'));
        //chart.valueFormat(d3.format('d'));

  var svg =d3.select('#chart4 svg')
      .datum(data)
      .call(chart);
    // console.dir(data);
    /*var makeLegend = nv.models.legend()
            //initialize legend function

        .key(function(d) { return d.label; });
            //tell the function which property to use as text

  svg.append("g").attr("class", "legend")
    //add a group to hold legend, position as necessary
    //(no positioning will draw legend across top of SVG)

    .datum(historicalBarChart[0].values) 
    //set data to the array of objects you want 
    //included in the legend

    .transition().duration(500)
        .call(makeLegend); //make it so
   */

for (var property in chart.legend.dispatch) {
    chart.legend.dispatch[property] = function() { };
}

  return chart;
 },function(){
     
          d3.selectAll(".nv-bar").on('click',//dblclick
               function(e){//console.log($(this).index());
                  // if ($(".s3d").css("visibility") === "hidden") {
                //$(".s3d").css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0});
            //} 
                   d3.selectAll(".nv-series-0 .nv-bar").attr('style','fill: rgb(93, 159, 210);stroke: rgb(93, 159, 210);');
                   d3.selectAll(".nv-series-1 .nv-bar").attr('style','fill: rgb(44, 160, 44);stroke: rgb(44, 160, 44);');
                    $('.nv-series-0 .nv-bar').eq($(this).index()).attr('style','fill: #ff0000;stroke: #ff0000;');
                    $('.nv-series-1 .nv-bar').eq($(this).index()).attr('style','fill: #ff0000;stroke: #ff0000;');
                    
                    //e.realname;
                    clickeduser=e.realname;
                    s2.graph.nodes().forEach(function(n) {
          if(n.label===e.realname){
              
                        var nodeId = n.id,
            toKeep = s2.graph.neighbors(nodeId);
        toKeep[nodeId] = n;

        s2.graph.nodes().forEach(function(n) {
          if (toKeep[n.id])
            n.color = n.originalColor;
          else
            n.color = '#eee';
        });
        //console.log(nodeId);
        //console.dir(e.data.node);

        s2.graph.edges().forEach(function(e) {
          if (toKeep[e.source] && toKeep[e.target])
            e.color = e.originalColor;
          else
            e.color = '#eee';
        });

        // Since the data has been modified, we need to
        // call the refresh method to make the colors
        // update effective.
        s2.refresh();
                            
                            
                            //console.dir(n);
                        
                        
                        }
        });
           });
           var xTicks = d3.select('.nv-x.nv-axis > g').selectAll('g');
xTicks
  .selectAll('text')
  .attr('transform', function(d,i,j) { return 'translate (-10, 33) rotate(-90 0,0)' })

  

});
 
 
});


/*
jQuery( ".twitter" ).click(function() {
    
   jQuery('#cd-timeline').empty();
    jQuery('#overlay').show();
    
 //$('#myModal2').trigger('reveal:close');
 //setTimeout(function(){ $('#myModal1').reveal(); }, 1000);
 jQuery('#conve').stop().slideToggle();
 jQuery('#vague-svg-blur').remove();
 var vague = $("#myModal2").Vague({intensity:3});
vague.blur();
var username1=jQuery( ".bio" ).text().substring(1);
var avatar1=jQuery( "#link2 img" ).attr('src');
var username2=clickeduser;
var avatar2=urls[labels.indexOf(username2)]
for(var i=0;i<6;i++){
    
    if(i%2===1){jQuery('#cd-timeline').append('<div class="cd-timeline-block"><div class="cd-timeline-img cd-picture"><img src="imgs/iconmonstr-email-icon.svg" alt="Picture"></div><div class="cd-timeline-content"><img src='+avatar1+' onError="this.src=\'imgs/noprofile.gif\';"/><h2>Name</h2><h3>@'+username1+'</h3><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, optio, dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde? Iste voluptatibus minus veritatis qui ut.</p><span class="cd-date">'+d3.time.format('%b %e %H:%M')(new Date(1401263341000+i*14400000))+'</span></div></div>');}
    else{jQuery('#cd-timeline').append('<div class="cd-timeline-block"><div class="cd-timeline-img cd-picture"><img src="imgs/iconmonstr-email-icon.svg" alt="Picture"></div><div class="cd-timeline-content"><img src='+avatar2+' onError="this.src=\'imgs/noprofile.gif\';"/><h2>Name</h2><h3>@'+username2+'</h3><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, optio, dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde? Iste voluptatibus minus veritatis qui ut.</p><span class="cd-date">'+d3.time.format('%b %e %H:%M')(new Date(1401263341000+i*14400000))+'</span></div></div>');}
    
    
    //jQuery('#cd-timeline').append('<div class="cd-timeline-block"></div>');
}
hidemsg();

//setTimeout(function(){
    
  //  var vague = $("#myModal2").Vague({intensity:0});
//vague.blur();
//}, 3000);

});
*/

jQuery( "#minimize" ).click(function() {
   s.graph.nodes().forEach(function(node) {
  if(node.size===1){node.hidden = true;}
});
s.refresh();
jQuery( "#minimize" ).hide();
jQuery( "#expand" ).show();
});

jQuery( "#expand" ).click(function() {
   s.graph.nodes().forEach(function(node) {
  if(node.size===1){node.hidden = false;}
});
s.refresh();
jQuery( "#minimize" ).show();
jQuery( "#expand" ).hide();
});


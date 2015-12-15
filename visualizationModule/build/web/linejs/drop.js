$( "#admin,#settings" ).click(function() {
 $( "#menu" ).fadeToggle( "fast" );
});

$(document).click(function(e){    
       if( $(e.target).closest("#admin,#settings").length > 0 ) {
        return false;
    }        

      //Do processing of click event here for every element except with id menu_content
if($("#menu").is(":visible")){$( "#menu" ).fadeToggle( "fast" );}  
});

$( "#menu div:not(:first-child)" ).click(function() {
    var choice=$(this).html().substr(0, $(this).html().indexOf(' <i'));
    var already=$('#admin').text().substr(8);
    if(choice!==already){//console.log(chart);
        $( "#admin" ).text( "size by "+choice);
        d3.select('#chart1 svg')
        .datum(databul());
        //.transition().duration(1200);
        //.call(chart);

setTimeout(function() {
var text=$('#admin').text();
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
        
        
    
    }
});
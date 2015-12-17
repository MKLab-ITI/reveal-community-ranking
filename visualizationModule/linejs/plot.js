var chart, chart3;
var con = [];
var cumlen = 20;
var timelen;
var conlen;
var cum = [];
var cumone = [];
var centrality = [];
var users = [];
var connections = [];
var tags = [];
var tagssize = [];
var keys = [];
var keyssize = [];
var bigrams = [];
var bigramssize = [];
var ftweets = [];
var ftweetssize = [];
var furls = [];
var furlssize = [];
var domains = [];
var domainssize = [];
var ucent = [];
var ucentsize = [];
var contimestamp = [];
var concommunity = [];
var conquality = [];
var min, max, usersmin, usersmax, centmin, centmax, conmin, conmax, fixed;
for (var i = 0; i < cumlen; i++) {
    cum[i] = [];
}
var mindate;
var maxdate;
var tickMarks = [];
var tickMarks2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
var timestamps = [];
var colname = gup("collection");

$.ajax({
    type: "GET",
    url: "jsons/" + colname + "communities.json",
    dataType: "json",
    success: function (data) {

        min = data.datasetInfo.limits.min;
        max = data.datasetInfo.limits.max;
        usersmin = data.datasetInfo.limits.usersmin;
        usersmax = data.datasetInfo.limits.usersmax;
        centmin = data.datasetInfo.limits.centmin;
        centmax = data.datasetInfo.limits.centmax;
        conmin = data.datasetInfo.limits.conmin;
        conmax = data.datasetInfo.limits.conmax;
        fixed = data.datasetInfo.limits.fixed;

        timelen = data.datasetInfo.allTimeslots.length;
        mindate = (data.datasetInfo.allTimeslots[0] - min) * 1000;
        maxdate = (data.datasetInfo.allTimeslots[timelen - 1] + max) * 1000;
        conlen = 0;


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

            var arr12 = [];
            var arr13 = [];

            var arr14 = [];
            var arr15 = [];

            var arr16 = [];
            var arr17 = [];

            for (var j = 0; j < timelen; j++) {
                arr1.push(data.ranked_communities[i].DyCContainer[j].commCentrality);
                arr2.push(data.ranked_communities[i].DyCContainer[j].commSize);
                arr3.push(data.ranked_communities[i].DyCContainer[j].connectionsNum);
                var keylen = data.ranked_communities[i].DyCContainer[j].commHashTags.length;
                if (keylen > 5) {
                    for (var f = 0; f < 5; f++) {
                        arr4.push(data.ranked_communities[i].DyCContainer[j].commHashTags[f][0]);
                        arr5.push(data.ranked_communities[i].DyCContainer[j].commHashTags[f][1]);
                    }
                }
                else {
                    for (var f = 0; f < keylen; f++) {
                        arr4.push(data.ranked_communities[i].DyCContainer[j].commHashTags[f][0]);
                        arr5.push(data.ranked_communities[i].DyCContainer[j].commHashTags[f][1]);
                    }
                    for (var f = 0; f < 5 - keylen; f++) {
                        arr4.push("-");
                        arr5.push(0);
                    }
                }

                var keylen = data.ranked_communities[i].DyCContainer[j].commKeywords.length;
                if (keylen > 5) {
                    for (var f = 0; f < 5; f++) {
                        arr6.push(data.ranked_communities[i].DyCContainer[j].commKeywords[f][0]);
                        arr7.push(data.ranked_communities[i].DyCContainer[j].commKeywords[f][1]);
                    }
                }
                else {
                    for (var f = 0; f < keylen; f++) {
                        arr6.push(data.ranked_communities[i].DyCContainer[j].commKeywords[f][0]);
                        arr7.push(data.ranked_communities[i].DyCContainer[j].commKeywords[f][1]);
                    }
                    for (var f = 0; f < 5 - keylen; f++) {
                        arr6.push("-");
                        arr7.push(0);
                    }
                }

                var keylen = data.ranked_communities[i].DyCContainer[j].communityBigramsPerSlot.length;
                if (keylen > 5) {
                    for (var f = 0; f < 5; f++) {
                        arr8.push(data.ranked_communities[i].DyCContainer[j].communityBigramsPerSlot[f][0]);
                        arr9.push(data.ranked_communities[i].DyCContainer[j].communityBigramsPerSlot[f][1]);
                    }
                }
                else {
                    for (var f = 0; f < keylen; f++) {
                        arr8.push(data.ranked_communities[i].DyCContainer[j].communityBigramsPerSlot[f][0]);
                        arr9.push(data.ranked_communities[i].DyCContainer[j].communityBigramsPerSlot[f][1]);
                    }
                    for (var f = 0; f < 5 - keylen; f++) {
                        arr8.push("-");
                        arr9.push(0);
                    }
                }

                var keylen = data.ranked_communities[i].DyCContainer[j].commTweets.length;
                if (keylen > 5) {
                    for (var f = 0; f < 5; f++) {
                        arr10.push(data.ranked_communities[i].DyCContainer[j].commTweets[f][0]);
                        arr11.push(data.ranked_communities[i].DyCContainer[j].commTweets[f][1]);
                    }
                }
                else {
                    for (var f = 0; f < keylen; f++) {
                        arr10.push(data.ranked_communities[i].DyCContainer[j].commTweets[f][0]);
                        arr11.push(data.ranked_communities[i].DyCContainer[j].commTweets[f][1]);
                    }
                    for (var f = 0; f < 5 - keylen; f++) {
                        arr10.push("-");
                        arr11.push(0);
                    }
                }

                var keylen = data.ranked_communities[i].DyCContainer[j].commUrls.length;
                if (keylen > 5) {
                    for (var f = 0; f < 5; f++) {
                        arr12.push(data.ranked_communities[i].DyCContainer[j].commUrls[f][0]);
                        arr13.push(data.ranked_communities[i].DyCContainer[j].commUrls[f][1]);
                    }
                }
                else {
                    for (var f = 0; f < keylen; f++) {
                        arr12.push(data.ranked_communities[i].DyCContainer[j].commUrls[f][0]);
                        arr13.push(data.ranked_communities[i].DyCContainer[j].commUrls[f][1]);
                    }
                    for (var f = 0; f < 5 - keylen; f++) {
                        arr12.push("-");
                        arr13.push(0);
                    }
                }

                var keylen = data.ranked_communities[i].DyCContainer[j].commDomains.length;
                if (keylen > 5) {
                    for (var f = 0; f < 5; f++) {
                        arr14.push(data.ranked_communities[i].DyCContainer[j].commDomains[f][0]);
                        arr15.push(data.ranked_communities[i].DyCContainer[j].commDomains[f][1]);
                    }
                }
                else {
                    for (var f = 0; f < keylen; f++) {
                        arr14.push(data.ranked_communities[i].DyCContainer[j].commDomains[f][0]);
                        arr15.push(data.ranked_communities[i].DyCContainer[j].commDomains[f][1]);
                    }
                    for (var f = 0; f < 5 - keylen; f++) {
                        arr14.push("-");
                        arr15.push(0);
                    }
                }

                var keylen = data.ranked_communities[i].DyCContainer[j].usersCentrality.length;
                if (keylen > 5) {
                    for (var f = 0; f < 5; f++) {
                        arr16.push(data.ranked_communities[i].DyCContainer[j].usersCentrality[f][0]);
                        arr17.push(data.ranked_communities[i].DyCContainer[j].usersCentrality[f][1]);
                    }
                }
                else {
                    for (var f = 0; f < keylen; f++) {
                        arr16.push(data.ranked_communities[i].DyCContainer[j].usersCentrality[f][0]);
                        arr17.push(data.ranked_communities[i].DyCContainer[j].usersCentrality[f][1]);
                    }
                    for (var f = 0; f < 5 - keylen; f++) {
                        arr16.push("-");
                        arr17.push(0);
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
            furls.push(arr12);
            furlssize.push(arr13);
            domains.push(arr14);
            domainssize.push(arr15);
            ucent.push(arr16);
            ucentsize.push(arr17);
        }

        for (var j = 0; j < timelen; j++) {
            tickMarks.push(new Date((data.datasetInfo.allTimeslots[j]) * 1000));
            timestamps.push((data.datasetInfo.allTimeslots[j]) * 1000);
        }
    },
    async: false
});
nv.addGraph(function () {
    chart = nv.models.lineChart()
        .margin({left: 100})
        .transitionDuration(350)
        .useInteractiveGuideline(false)
        .showYAxis(true)
        .showXAxis(true)
        .forceX([new Date(mindate), new Date(maxdate)])
        .forceY([1, 20])
        .showLegend(false)
        .yDomain([21, 1]);

    chart.xAxis
        .axisLabel("")
        .tickValues(tickMarks)
        .tickFormat(function (d) {
            return d3.time.format('%e %b %H:%M')(new Date(d));
        });

    chart.yAxis
        .tickValues(tickMarks2)
        .tickFormat(function (d) {
            return "Community   " + d;
        });

    d3.select('#chart1 svg')
        .datum(databul())
        .call(chart);
    chart.lines.dispatch.on('elementClick', function (e) {//epointy-1//timestamps.indexOf(e.point.x)
        var full = 1;
        if ($('#admin').text().substr(21) === "Users") {
            if (users[e.point.y - 1][timestamps.indexOf(e.point.x)] === 0) {
                full = 0;
            }
        }
        if ($('#admin').text().substr(21) === "Centrality") {
            if (centrality[e.point.y - 1][timestamps.indexOf(e.point.x)] === 0) {
                full = 0;
            }
        }
        if ($('#admin').text().substr(21) === "Connections") {
            if (connections[e.point.y - 1][timestamps.indexOf(e.point.x)] === 0) {
                full = 0;
            }
        }

        if (full === 0) {
            $('#myModal1').reveal();
        }
        else {
            createnet(e.point.y, timestamps.indexOf(e.point.x));

            nv.addGraph(function () {
                chart3 = nv.models.lineChart()
                    .margin({top: 15, left: 100})
                    .transitionDuration(350)
                    .useInteractiveGuideline(false)
                    .showYAxis(true)
                    .showXAxis(true)
                    .forceX([new Date(mindate), new Date(maxdate)])
                    .showLegend(false)
                    .tooltips(false);

                chart3.xAxis
                    .tickValues(tickMarks)
                    .rotateLabels(-45)
                    .tickFormat(function (d) {
                        return d3.time.format('%e %b %H:%M')(new Date(d));
                    });

                chart3.yAxis
                    .tickValues(tickMarks2)
                    .tickFormat(function (d) {
                        return "Community   " + d;
                    });
                d3.select('#chart3 svg')
                    .datum(databulone(e.point.y))
                    .call(chart3);


                chart3.lines.dispatch.on('elementClick', function (e) {
                    if (e.point.z !== 0) {
                        animate(timestamps.indexOf(e.point.x));
                    }
                });
                setTimeout(function () {
                    var text = $('#admin').text();
                    //for (var i = 0; i < 1; i++) {
                    for (var j = 0; j < timelen; j++) {
                        if (text.substr(21) === "Users") {
                            var cent = users[e.point.y - 1][j];
                            if (cent !== 0) {
                                cent = (cent - usersmin) / (usersmax) * (9) + 1;
                            }
                            else {
                                cent = -1;
                            }
                            $('#chart3 .nv-scatterWrap .nv-groups .nv-series-0 .nv-point-' + j).attr("r", cent + 1);
                        }
                        if (text.substr(21) === "Centrality") {
                            var cent = centrality[e.point.y - 1][j];
                            //if((cent>0)&&(cent<0.2)){cent=1;}
                            //else if((cent>0.2)&&(cent<1)){cent=Math.floor(cent*10);}
                            //else if(cent===1){cent=10}
                            if (cent !== 0) {
                                cent = (cent - centmin) / (centmax) * (9) + 1;
                            }
                            else {
                                cent = -1;
                            }
                            $('#chart3 .nv-scatterWrap .nv-groups .nv-series-0 .nv-point-' + j).attr("r", cent + 1);
                        }
                        if (text.substr(21) === "Connections") {
                            var cent = connections[e.point.y - 1][j];
                            //if((cent>0)&&(cent<0.2)){cent=1;}
                            //else if((cent>0.2)&&(cent<1)){cent=Math.floor(cent*10);}
                            //else if(cent===1){cent=10}
                            if (cent !== 0) {
                                cent = (cent - conmin) / (conmax) * (9) + 1;
                            }
                            else {
                                cent = -1;
                            }
                            $('#chart3 .nv-scatterWrap .nv-groups .nv-series-0 .nv-point-' + j).attr("r", cent + 1);
                        }

                    }
                    //}
                    $('#chart3 .nv-scatterWrap .nv-groups .nv-series-0 .nv-point-' + timestamps.indexOf(e.point.x)).attr("fill", "#ff0000");
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

            $('#chart2,#chart1').stop().animate({"opacity": 0}, 1000, function () {
                $('#chart2,#chart1').hide();
            });


        }
    });


    chart.lines.dispatch.on('elementMouseover', function (e) {

        $('.nvtooltip').html('');
        if (e.point.z > 0) {
            $('.nvtooltip').html('<table class="nv-pointer-events-none"><thead></thead><tbody></tbody></table>');
            $('.nvtooltip table thead').append('<tr class="nv-pointer-events-none"><td colspan="3" class="nv-pointer-events-none"><strong class="x-value">' + d3.time.format('%e %b %H:%M')(new Date(e.point.x)) + '</strong></td></tr>')
            $('.nvtooltip table tbody').append('<tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: #000000;" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Centrality <span>' + centrality[e.point.y - 1][timestamps.indexOf(e.point.x)].toFixed(fixed) + '</span></td></tr>');
            $('.nvtooltip table tbody').append('<tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: #000000;" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Users <span>' + users[e.point.y - 1][timestamps.indexOf(e.point.x)] + '</span></td></tr>');
            $('.nvtooltip table tbody').append('<tr class="nv-pointer-events-none"><td class="legend-color-guide nv-pointer-events-none"><div style="background-color: #000000;" class="nv-pointer-events-none"></div></td><td class="key nv-pointer-events-none">Connections <span>' + connections[e.point.y - 1][timestamps.indexOf(e.point.x)] + '</span></td></tr>');

            $('.nvtooltip').append('<div id="words"></div>');
            $('.nvtooltip #words').append('<div id="first"></div><div id="second"></div><div id="third"></div><div id="fourth"></div>');
            $('.nvtooltip #words').append('<p class="categories" style="border-bottom: 2px solid gray;">HASHTAGS</p>');
            $('.nvtooltip #words').append('<p class="categories" style="border-bottom: 2px solid gray;">KEYWORDS</p>');
            $('.nvtooltip #words').append('<p class="categories" style="border-bottom: 2px solid gray;">BIGRAMS</p>');
            $('.nvtooltip #words').append('<p class="categories" style="border-bottom: 2px solid gray;">DOMAINS</p>');
            $('.nvtooltip #words').append('<p class="categories" style="width:146px;border-bottom: 2px solid gray;">USERS CENTRALITY</p>');

            $('.nvtooltip #words').append('<div style="width:750px;border-bottom: 2px;border-bottom-color: gray;border-bottom-style: double;"><div id="hashtagsdiv" style="vertical-align: top;width:150px;padding-top: 15px;display:inline-block;"></div><div id="keywordsdiv" style="vertical-align: top;width:150px;padding-top: 15px;display:inline-block;"></div><div id="bigramsdiv" style="vertical-align: top;width:150px;padding-top: 15px;display:inline-block;"></div><div id="domainsdiv" style="vertical-align: top;width:150px;padding-top: 15px;display:inline-block;"></div><div id="ucentdiv" style="vertical-align: top;width:150px;padding-top: 15px;display:inline-block;"></div></div>');
            $('.nvtooltip').append('<div id="words2"></div>');
            $('.nvtooltip #words2').append('<div id="ta"></div>');
            $('.nvtooltip #ta').append('<p>FREQUENT TWEETS</p>');
            if (ftweets[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5] !== "-") {
                $('.nvtooltip #ta').append('<p class="ftweets">' + ftweets[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5] + '&nbsp;&nbsp;&nbsp;<b>(' + ftweetssize[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5] + ')</b></p>');
            }
            if (ftweets[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1] !== "-") {
                $('.nvtooltip #ta').append('<p class="ftweets">' + ftweets[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1] + '&nbsp;&nbsp;&nbsp;<b>(' + ftweetssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1] + ')</b></p>');
            }
            if (ftweets[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2] !== "-") {
                $('.nvtooltip #ta').append('<p class="ftweets">' + ftweets[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2] + '&nbsp;&nbsp;&nbsp;<b>(' + ftweetssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2] + ')</b></p>');
            }
            if (ftweets[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3] !== "-") {
                $('.nvtooltip #ta').append('<p class="ftweets">' + ftweets[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3] + '&nbsp;&nbsp;&nbsp;<b>(' + ftweetssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3] + ')</b></p>');
            }
            if (ftweets[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4] !== "-") {
                $('.nvtooltip #ta').append('<p class="ftweets">' + ftweets[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4] + '&nbsp;&nbsp;&nbsp;<b>(' + ftweetssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4] + ')</b></p>');
            }

            $('.nvtooltip #words2').append('<div id="ta2"></div>');
            $('.nvtooltip #words2').append('<div id="first2"></div>');
            $('.nvtooltip #ta2').append('<p>FREQUENT URLS</p>');
            if (furls[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5] !== "-") {
                $('.nvtooltip #ta2').append('<p class="ftweets">' + furls[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5] + '&nbsp;&nbsp;&nbsp;<b>(' + furlssize[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5] + ')</b></p>');
            }
            if (furls[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1] !== "-") {
                $('.nvtooltip #ta2').append('<p class="ftweets">' + furls[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1] + '&nbsp;&nbsp;&nbsp;<b>(' + furlssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1] + ')</b></p>');
            }
            if (furls[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2] !== "-") {
                $('.nvtooltip #ta2').append('<p class="ftweets">' + furls[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2] + '&nbsp;&nbsp;&nbsp;<b>(' + furlssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2] + ')</b></p>');
            }
            if (furls[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3] !== "-") {
                $('.nvtooltip #ta2').append('<p class="ftweets">' + furls[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3] + '&nbsp;&nbsp;&nbsp;<b>(' + furlssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3] + ')</b></p>');
            }
            if (furls[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4] !== "-") {
                $('.nvtooltip #ta2').append('<p class="ftweets">' + furls[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4] + '&nbsp;&nbsp;&nbsp;<b>(' + furlssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4] + ')</b></p>');
            }

            setTimeout(function () {

                if (!(tags[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5] === "-")) {
                    $('#hashtagsdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + tags[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(tagssize[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5]) + '</p>');
                }
                if (!(tags[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1] === "-")) {
                    $('#hashtagsdiv').append('<p style="padding: 2px 10px;float: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + tags[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(tagssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1]) + '</p>');
                }
                if (!(tags[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2] === "-")) {
                    $('#hashtagsdiv').append('<p style="padding: 2px 10px;float: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + tags[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(tagssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2]) + '</p>');
                }
                if (!(tags[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3] === "-")) {
                    $('#hashtagsdiv').append('<p style="padding: 2px 10px;float: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + tags[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(tagssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3]) + '</p>');
                }
                if (!(tags[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4] === "-")) {
                    $('#hashtagsdiv').append('<p style="padding: 2px 10px;float: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + tags[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(tagssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4]) + '</p>');
                }

                if (!(keys[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5] === "-")) {
                    $('#keywordsdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + keys[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(keyssize[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5]) + '</p>');
                }
                if (!(keys[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1] === "-")) {
                    $('#keywordsdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + keys[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(keyssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1]) + '</p>');
                }
                if (!(keys[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2] === "-")) {
                    $('#keywordsdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + keys[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(keyssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2]) + '</p>');
                }
                if (!(keys[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3] === "-")) {
                    $('#keywordsdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + keys[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(keyssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3]) + '</p>');
                }
                if (!(keys[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4] === "-")) {
                    $('#keywordsdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + keys[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(keyssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4]) + '</p>');
                }

                if (!(bigrams[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5] === "-")) {
                    $('#bigramsdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + bigrams[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(bigramssize[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5]) + '</p>');
                }
                if (!(bigrams[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1] === "-")) {
                    $('#bigramsdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + bigrams[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(bigramssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1]) + '</p>');
                }
                if (!(bigrams[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2] === "-")) {
                    $('#bigramsdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + bigrams[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(bigramssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2]) + '</p>');
                }
                if (!(bigrams[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3] === "-")) {
                    $('#bigramsdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + bigrams[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(bigramssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3]) + '</p>');
                }
                if (!(bigrams[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4] === "-")) {
                    $('#bigramsdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + bigrams[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(bigramssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4]) + '</p>');
                }

                if (!(domains[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5] === "-")) {
                    $('#domainsdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + domains[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(domainssize[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5]) + '</p>');
                }
                if (!(domains[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1] === "-")) {
                    $('#domainsdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + domains[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(domainssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1]) + '</p>');
                }
                if (!(domains[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2] === "-")) {
                    $('#domainsdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + domains[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(domainssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2]) + '</p>');
                }
                if (!(domains[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3] === "-")) {
                    $('#domainsdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + domains[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(domainssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3]) + '</p>');
                }
                if (!(domains[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4] === "-")) {
                    $('#domainsdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + domains[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(domainssize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4]) + '</p>');
                }

                if (!(ucent[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5] === "-")) {
                    $('#ucentdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + ucent[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(ucentsize[e.point.y - 1][(timestamps.indexOf(e.point.x)) * 5]) + '</p>');
                }
                if (!(ucent[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1] === "-")) {
                    $('#ucentdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + ucent[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(ucentsize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 1]) + '</p>');
                }
                if (!(ucent[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2] === "-")) {
                    $('#ucentdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + ucent[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(ucentsize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 2]) + '</p>');
                }
                if (!(ucent[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3] === "-")) {
                    $('#ucentdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + ucent[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(ucentsize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 3]) + '</p>');
                }
                if (!(ucent[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4] === "-")) {
                    $('#ucentdiv').append('<p style="padding: 2px 10px;float: left;text-align: left;width: 100px;word-wrap: break-word;white-space: normal;text-align: left;">' + ucent[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4] + '</p><p style="padding:0;display: inline-block;float: right;top: 2px;position: relative;margin-right: 2px;">' + Math.round(ucentsize[e.point.y - 1][((timestamps.indexOf(e.point.x)) * 5) + 4]) + '</p>');
                }


            }, 500);
            d3.select('g.nv-interactive').append("g").attr("class", " nv-wrap nv-interactiveLineLayer").append("g").attr("class", "nv-interactiveGuideLine").append("line")
                .attr("class", "nv-guideline")
                .attr("x1", e.pos[0] - 100)
                .attr("x2", e.pos[0] - 100)
                .attr("y1", $('.nv-lineChart g rect').attr('height'))
                .attr("y2", 0)
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
            point = timestamps.indexOf(e.point.x);
            $('#chart1 .nv-scatterWrap .nv-groups .nv-series-' + (e.point.y - 1) + ' .nv-point-' + point).attr("fill", "#000000");
        }
        else {
            $('.nvtooltip').html('');
        }

        //}, 300);
    });

    chart.lines.dispatch.on('elementMouseout', function () {
        $('.nvtooltip').html('');
        //$("#ta,#ta2").empty();   
        $('g.nv-interactive').html('');
        $('#chart1 .nv-lineChart circle.nv-point').attr("fill", "#B5B5B5");
    });


    setTimeout(function () {
        var text = $('#admin').text();
        $('#chart1 .nv-x .tick text').attr("transform", 'translate(0,' + -($('#chart1').height() - 30) + ')rotate(45 0 0)');
        for (var i = 0; i < cumlen; i++) {
            for (var j = 0; j < timelen; j++) {
                if (text.substr(21) === "Users") {
                    var cent = users[i][j];
                    //if((cent>0)&&(cent<0.2)){cent=1;}
                    //else if((cent>0.2)&&(cent<1)){cent=Math.floor(cent*10);}
                    //else if(cent===1){cent=10}
                    if (cent !== 0) {
                        cent = (cent - usersmin) / (usersmax) * (9) + 1;
                    }
                    else {
                        cent = -1;
                    }
                    $('#chart1 .nv-scatterWrap .nv-groups .nv-series-' + i + ' .nv-point-' + j).attr("r", cent + 1);
                }
                if (text.substr(21) === "Connections") {
                    var cent = connections[i][j];
                    if (cent !== 0) {
                        cent = (cent - conmin) / (conmax) * (9) + 1;
                    }
                    else {
                        cent = -1;
                    }
                    $('#chart1 .nv-scatterWrap .nv-groups .nv-series-' + i + ' .nv-point-' + j).attr("r", cent + 1);
                }
                if (text.substr(21) === "Centrality") {
                    var cent = centrality[i][j];
                    if (cent !== 0) {
                        cent = (cent - centmin) / (centmax) * (9) + 1;
                    }
                    else {
                        cent = -1;
                    }
                    $('#chart1 .nv-scatterWrap .nv-groups .nv-series-' + i + ' .nv-point-' + j).attr("r", cent + 1);
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

function databul() {

    for (var i = 0; i < cumlen; i++) {
        cum[i] = [];
    }

    if ($('#admin').text().substr(21) === "Centrality") {

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
    if ($('#admin').text().substr(21) === "Users") {

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
    if ($('#admin').text().substr(21) === "Connections") {

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
    cumone.length = 0;
    //for (var j = 0; j < 1; j++) {
    if ($('#admin').text().substr(21) === "Users") {
        for (var i = 0; i < timelen; i++) {
            cumone.push({
                x: timestamps[i],
                y: point,
                z: users[point - 1][i]
            });

        }
    }
    if ($('#admin').text().substr(21) === "Centrality") {
        for (var i = 0; i < timelen; i++) {
            cumone.push({
                x: timestamps[i],
                y: point,
                z: centrality[point - 1][i]
            });

        }
    }
    if ($('#admin').text().substr(21) === "Connections") {
        for (var i = 0; i < timelen; i++) {
            cumone.push({
                x: timestamps[i],
                y: point,
                z: connections[point - 1][i]
            });

        }
    }

    var data = [];
    //for (var j = 0; j < 1; j++) {
    data.push({
        values: cumone,
        key: "Community " + point,
        color: "#B5B5B5"
    });
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
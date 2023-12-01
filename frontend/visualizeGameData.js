function displayTeams(textSvg, homeTeam, awayTeam) {

    if (!textSvg.selectAll("text").empty()) {
        textSvg.selectAll("text").remove()
    }
    textSvg.append("text")
      .attr("x", 20)
      .attr("y", 25)
      .text(homeTeam)
      .attr("font-size", "32px")

    textSvg.append("text")
      .attr("x", 160)
      .attr("y", 25)
      .text("vs.")
      .attr("font-size", "32px")

    textSvg.append("text")
      .attr("x", 300)
      .attr("y", 25)
      .text(awayTeam)
      .attr("font-size", "32px")
}

function scaleCoordinates(x, y) {
    const xScale = d3.scaleLinear()
        .domain([0, 120])
        .range([81, 816])

    const yScale = d3.scaleLinear()
        .domain([0, 53.3])
        .range([535, 155])

    newX = xScale(x)
    newY = yScale(y)

    return [newX, newY]
}

function getSliderMapping(playIdToRows) {
    const keys = Object.keys(playIdToRows);
    keys.sort((a, b) => a - b);

    const mappedKeys = {}
    keys.forEach((key, index) => {
        newKeyValue = index + 1
        mappedKeys[newKeyValue] = key
    })

    return mappedKeys

}

function visualizePlayers(playerData, color) {
    
    var circles = mainSvg.selectAll("circle").data(playerData, function(d) {
        return d.jerseyNumber + d.team;
    });
    circles.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    circles.enter().append("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", 7)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("id", function(d) { return "circle-" + d.jerseyNumber + "-" + d.team; })
        .attr("class", "circle-label");

    circles.enter().append("text")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .style("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", color)
        .text(function(d) { return d.jerseyNumber; })
        .attr("id", function(d) { return "text-" + d.jerseyNumber + "-" + d.team; })
        .attr("class", "circle-label");

    circles.each(function(d) {
        const textId = "text-" + d.jerseyNumber + "-" + d.team;
        const correspondingText = d3.select("#" + textId);
        if (correspondingText.size() > 0) {
            correspondingText.attr("x", d.x).attr("y", d.y);
        }
    });

}

function populateScoreBoard(mainSvg, awayColor, homeColor, homeTeamAbbr, awayTeamAbbr) {
    const homeTeam = mainSvg.select("#homeTeam");
    const awayTeam = mainSvg.select("#awayTeam");
    const gameInfo = mainSvg.select("#gameInfo");

    homeTeam.style("display", "block")
    awayTeam.style("display", "block")
    gameInfo.style("display", "block")

    homeTeam.selectAll("text").remove();
    awayTeam.selectAll("text").remove();
    gameInfo.selectAll("text").remove();

    awayTeam.select("rect").attr("fill", awayColor)
    homeTeam.select("rect").attr("fill", homeColor)

    homeTeam.append("text")
      .attr("x", 5)
      .attr("y", 35)
      .text(homeTeamAbbr)
      .attr("class", "text-styling")

    homeTeam.append("text")
      .attr("id", "homeScore")
      .attr("y", 35)
      .text("0")
      .attr("text-anchor", "end")
      .each(function () {
        const textElement = d3.select(this);
        const homeTeamWidth = homeTeam.node().getBBox().width;
        textElement.attr("x", homeTeamWidth - 18)
          .attr("class", "text-styling")
      });

    homeTeam.append("ellipse")
        .attr("id", "homePossession")
        .attr("cx", homeTeam.node().getBBox().width - 55)
        .attr("cy", 25)
        .attr("fill", "brown")
        .classed("ellipse", true)
        .style("display", "none");

    xCoordinate = 135;

    if (awayTeamAbbr && awayTeamAbbr.length === 2) {
        xCoordinate += 15;
    }

    awayTeam.append("text")
      .attr("x", xCoordinate)
      .attr("y", 35)
      .text(awayTeamAbbr)
      .attr("class", "text-styling")

    awayTeam.append("text")
      .attr("id", "awayScore")
      .attr("x", 5)
      .attr("y", 35)
      .text("0")
      .attr("class", "text-styling")

    awayTeam.append("ellipse")
        .attr("id", "awayPossession")
        .attr("cx", 55)
        .attr("cy", 25)
        .attr("fill", "brown")
        .classed("ellipse", true)
        .style("display", "none")

    homeTeam.select("rect").attr("fill", homeColor)
    awayTeam.select("rect").attr("fill", awayColor)

    gameInfo.append("text")
      .attr("id", "Quarter")
      .attr("x", 5)
      .attr("y", 30)
      .text("1st")
      .attr("class", "text-styling")

    gameInfo.append("text")
      .attr("id", "GameClock")
      .attr("x", gameInfo.node().getBBox().width / 2 - 10)
      .attr("y", 30)
      .text("15:00")
      .attr("text-anchor", "middle")
      .attr("class", "text-styling")

    gameInfo.append("text")
      .attr("id", "Down")
      .attr("x", gameInfo.node().getBBox().width - 122)
      .attr("y", 30)
      .text("1st & 10")
      .attr("class", "text-styling")

    mainSvg.selectAll("circle").remove();

}

function backendCall(mainSvg, playData, homeTeamAbbr, awayTeamAbbr) {
    //["yardlineNumber", "quarter", "down", 'gameClock_minutes', 'gameClock_seconds', "yardsToGo", "preSnapHomeScore", "preSnapVisitorScore", "offensiveTeam", "defensiveTeam"]
    //all variables below are strings
    yardlineNumber = (parseInt(playData.absoluteYardlineNumber) - 10).toString() // -10 to account for endzone
    quarter = playData.quarter //possible values are 1, 2, 3, 4
    down = playData.down //possible values are 1, 2, 3, 4
    const [gameClock_minutes, gameClock_seconds] = playData.gameClock.split(":").map(Number);
    yardsToGo = playData.yardsToGo
    preSnapHomeScore = playData.preSnapHomeScore
    preSnapVisitorScore = playData.preSnapVisitorScore
    offensiveTeam = playData.possessionTeam
    defensiveTeam = playData.possessionTeam === homeTeamAbbr ? awayTeamAbbr : homeTeamAbbr

    console.log("yardlineNumber:", yardlineNumber);
    console.log("quarter:", quarter);
    console.log("down:", down);
    console.log("gameClock_minutes:", gameClock_minutes);
    console.log("gameClock_seconds:", gameClock_seconds);
    console.log("yardsToGo:", yardsToGo);
    console.log("preSnapHomeScore:", preSnapHomeScore);
    console.log("preSnapVisitorScore:", preSnapVisitorScore);
    console.log("offensiveTeam:", offensiveTeam);
    console.log("defensiveTeam:", defensiveTeam);
}

function backendCallJson(mainSvg, playData, homeTeamAbbr, awayTeamAbbr) {
    yardlineNumber = (parseInt(playData.absoluteYardlineNumber) - 10).toString() // -10 to account for endzone
    quarter = playData.quarter //possible values are 1, 2, 3, 4
    down = playData.down //possible values are 1, 2, 3, 4
    const [gameClock_minutes, gameClock_seconds] = playData.gameClock.split(":").map(Number);
    yardsToGo = playData.yardsToGo
    preSnapHomeScore = playData.preSnapHomeScore
    preSnapVisitorScore = playData.preSnapVisitorScore
    offensiveTeam = playData.possessionTeam
    defensiveTeam = playData.possessionTeam === homeTeamAbbr ? awayTeamAbbr : homeTeamAbbr

    return {
        "yardlineNumber": yardlineNumber,
        "quarter": quarter,
        "down": down,
        "gameClock_minutes": gameClock_minutes, 
        "gameClock_seconds": gameClock_seconds,
        "yardsToGo": yardsToGo,
        "preSnapHomeScore": preSnapHomeScore,
        "preSnapAwayScore": preSnapVisitorScore,
        "offensiveTeam": offensiveTeam,
        "defensiveTeam": defensiveTeam
    };
}

function updateScoreBoard(mainSvg, playData, homeTeamAbbr, awayTeamAbbr) {
    const homeTeam = mainSvg.select("#homeTeam");
    const awayTeam = mainSvg.select("#awayTeam");
    const gameInfo = mainSvg.select("#gameInfo");

    homeTeam.select("#homePossession").style("display", "none");
    awayTeam.select("#awayPossession").style("display", "none");

    const ordinalMap = {
        "1": "1st",
        "2": "2nd",
        "3": "3rd",
        "4": "4th"
    };

    ordinalQuarter = ordinalMap[playData.quarter]
    downText = ordinalMap[playData.down] + " & " + playData.yardsToGo
    const absoluteYardNumber = parseInt(playData.absoluteYardlineNumber)
    let yardsToGo = parseInt(playData.yardsToGo)

    if ((absoluteYardNumber - yardsToGo === 10) || (absoluteYardNumber + yardsToGo === 110)) {
        downText = ordinalMap[playData.down] + " & Goal"
    }

    const invisibleText = gameInfo.append("text")
        .attr("class", "text-styling")
        .attr("visibility", "hidden")
        .text(downText);
    const textWidth = invisibleText.node().getBBox().width;

    gameInfo.select("#Quarter").text(ordinalQuarter)
    gameInfo.select("#GameClock").text(playData.gameClock)
    gameInfo.select("#Down").attr("x", gameInfo.node().getBBox().width - textWidth - 10)
    gameInfo.select("#Down").text(downText)

    homeTeam.select("#homeScore").text(playData.preSnapHomeScore)
    awayTeam.select("#awayScore").text(playData.preSnapVisitorScore)

    if (playData.possessionTeam === homeTeamAbbr) {
        homeTeam.select("#homePossession").style("display", "block");
    } else {
        awayTeam.select("#awayPossession").style("display", "block");
    }

}

function decrementClock(mainSvg) {
  const gameInfo = mainSvg.select("#gameInfo");
  const gameClock = gameInfo.select("#GameClock");
  const currentTime = gameClock.text();
  const [minutes, seconds] = currentTime.split(":").map(Number);

  const totalSeconds = minutes * 60 + seconds;
  const newTotalSeconds = totalSeconds - 1;
  const finalTotalSeconds = Math.max(newTotalSeconds, 0);

  const newMinutes = Math.floor(finalTotalSeconds / 60);
  const newSeconds = finalTotalSeconds % 60;
  const newTimeString = `${padZero(newMinutes)}:${padZero(newSeconds)}`;
  gameClock.text(newTimeString);
}


function padZero(number) {
  return number < 10 ? `0${number}` : number;
}

function getTeamColor(teamAbbr) {
  return getComputedStyle(document.documentElement).getPropertyValue(`--team-color-${teamAbbr}`) || "blue";
}

function addMarkers(mainSvg, playData, homeTeam, awayTeam) {

    d3.select("#scrimmage").remove();
    d3.select("#firstDown").remove();

    quarter = playData.quarter
    possessionTeam = playData.possessionTeam

    const absoluteYardNumber = parseInt(playData.absoluteYardlineNumber)
    const yardsToGo = parseInt(playData.yardsToGo)
    const yardlineSide = playData.yardlineSide

    if (yardlineSide === possessionTeam) {
        if (absoluteYardNumber < 60) {
            firstDownMarker = absoluteYardNumber + yardsToGo
        } else {
            firstDownMarker = absoluteYardNumber - yardsToGo
        }
    } else {
        if (absoluteYardNumber < 60) {
            firstDownMarker = absoluteYardNumber - yardsToGo
        } else if (absoluteYardNumber === 60 && possessionTeam === homeTeam) {
            firstDownMarker = absoluteYardNumber - yardsToGo
        } else if (absoluteYardNumber === 60 && possessionTeam === homeTeam) {
            firstDownMarker = absoluteYardNumber + yardsToGo
        } else {
            firstDownMarker = absoluteYardNumber + yardsToGo
        }
    }

    const lineOfScrimmage = scaleCoordinates(parseInt(playData.absoluteYardlineNumber), 0)[0];
    firstDownMarker = scaleCoordinates(firstDownMarker, 0)[0]

    mainSvg.append("rect")
        .attr("id", "scrimmage")
        .attr("x", lineOfScrimmage)
        .attr("y", 164)
        .attr("width", 3)
        .attr("height", 372)
        .attr("fill", "blue")

    if ((absoluteYardNumber - yardsToGo !== 10) && (absoluteYardNumber + yardsToGo !== 110)) {
        mainSvg.append("rect")
            .attr("id", "firstDown")
            .attr("x", firstDownMarker)
            .attr("y", 164)
            .attr("width", 3)
            .attr("height", 372)
            .attr("fill", "yellow")
    }

}

function visualizePlay(allPlayData, playNumber, mainSvg, interval, homeTeam, awayTeam) {
    
    // Vanilla JS to make a GET request
    // `raw_text${}`
    // fetch('http://127.0.0.1:5000/get_play_details?home_team=SF&away_team=ATL&yardlineNumber=50&quarter=1&down=4&gameClock_minutes=10&gameClock_seconds=15&yardsToGo=45&preSnapHomeScore=7&preSnapVisitorScore=5&offensiveTeam=SF&defensiveTeam=ATL')
    // .then(response => response.json())
    // .then(data => {
    // console.log(data); // Process your data here
    // })
    // .catch(error => {
    // console.error('Error:', error);
    // });
    
    if (!allPlayData[playNumber]) {
        throw new Error(`Play # '${playNumber}' could not be found.`)
    }
    playData = allPlayData[playNumber]
    timeToData = {}
    playData.forEach((row, index) => {
        datapointTime = row.time
        if (!timeToData[datapointTime]) {
            timeToData[datapointTime] = {}
            timeToData[datapointTime].homeTeam = []
            timeToData[datapointTime].awayTeam = []
            timeToData[datapointTime].football = []
        }
        if (row.team === 'football') {
            timeToData[datapointTime].football.push(row)
        } else if (row.team === homeTeam) {
            timeToData[datapointTime].homeTeam.push(row)
        } else {
            timeToData[datapointTime].awayTeam.push(row)
        }

    })

    var keys = Object.keys(timeToData)
    let index = 0;

    const homeColor = getTeamColor(homeTeamAbbr);
    const awayColor = getTeamColor(awayTeamAbbr);


    const updateLocation = () => {

        if (index < keys.length) {
            var currTimeData = keys[index]
            var value = timeToData[currTimeData]
            var awayData = value.awayTeam
            var homeData = value.homeTeam
            var footballData = value.football
            if (footballData.length > 1) {
                throw new Error(`For play # '${playNumber}', multiple (x, y) coordinates for football
                found at datapoint '${currTimeData}'`)
            }
            visualizePlayers(homeData, homeColor);
            visualizePlayers(awayData, awayColor);
            mainSvg.select(".football").attr("cx", footballData[0].x).attr("cy", footballData[0].y);
            index++;

            if (index % 10 === 0) {
              decrementClock(mainSvg);
            }

        } else {
            clearInterval(interval);
        }
    };

    const intervalID = setInterval(updateLocation, interval);
    mainSvg.selectAll(".circle, .circle-label").remove();

}

function visualizeStats(allPlayData, playNumber, mainSvg, interval, homeTeam, awayTeam) {
    backendCallDataResult = backendCallJson(mainSvg, allPlayData, homeTeam, awayTeam);

    yardlineNumber = backendCallDataResult["yardlineNumber"];
    quarter = backendCallDataResult["quarter"];
    down = backendCallDataResult["down"];
    gameClock_minutes = backendCallDataResult["gameClock_minutes"];
    gameClock_seconds = backendCallDataResult["gameClock_seconds"];
    yardsToGo = backendCallDataResult["yardsToGo"];
    preSnapHomeScore = backendCallDataResult["preSnapHomeScore"];
    preSnapAwayScore = backendCallDataResult["preSnapAwayScore"];
    offensiveTeam = backendCallDataResult["offensiveTeam"];
    defensiveTeam = backendCallDataResult["defensiveTeam"];

    allTeamsGV = [];
    defTeamGV = [];
    specTeamGV = [];
    allTeamsMY = [];
    defTeamMY = [];
    specTeamMY = [];
    allTeamsPV = [];
    defTeamPV = [];
    specTeamPV = [];
    rec = [];
    notifyDanger = false;
    // make sure that both frontend server and backend server are running
    fetch_url = `http://127.0.0.1:5000/get_play_details?home_team=${homeTeam}&away_team=${awayTeam}&yardlineNumber=${yardlineNumber}&quarter=${quarter}&down=${down}&gameClock_minutes=${gameClock_minutes}&gameClock_seconds=${gameClock_seconds}&yardsToGo=${yardsToGo}&preSnapHomeScore=${preSnapHomeScore}&preSnapVisitorScore=${preSnapAwayScore}&offensiveTeam=${offensiveTeam}&defensiveTeam=${defensiveTeam}`;
    fetch_url = 
    fetch(fetch_url)
    .then(response => response.json())
    .then(data => {
        allTeamsGV = data["gower_values"]["All Teams"];
        defTeamGV = data["gower_values"]["Defense Specific"];
        specTeamGV = data["gower_values"]["Specified Team"];
        allTeamsMY = data["historical_plays"]["mean_yards"]["All Teams"];
        defTeamMY = data["historical_plays"]["mean_yards"]["Defense Specific"];
        specTeamMY = data["historical_plays"]["mean_yards"]["Team Specific"];
        allTeamsPV = data["historical_plays"]["prob_values"]["All Teams"];
        defTeamPV = data["historical_plays"]["prob_values"]["Defense Specific"];
        specTeamPV = data["historical_plays"]["prob_values"]["Team Specific"];
        notifyDanger = !!data["notify_danger"];
        rec = data["recommendation"];
        console.log(notifyDanger);
        dangerrect = null;
        dangertext = null;
        mainSvg.select("#blueline").remove();
        mainSvg.select("#greenline").remove();
        mainSvg.select("#redline").remove();
        mainSvg.select("#dangerrect").remove();
        mainSvg.select("#dangertext").remove();
        const xScale = d3.scaleLinear().domain([0, allTeamsGV.length]).range([0, 300]);
        const yScale = d3.scaleLinear().domain([0, Math.max(d3.max(allTeamsGV), 0.65)]).range([300, 0]);
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale).ticks(10);
        mainSvg.select('#gv_xaxis').transition().duration(250).call(xAxis);
        mainSvg.select('#gv_yaxis').transition().duration(250).call(yAxis);
        const line = d3.line().x((li, i) => xScale(i)).y(li => yScale(li));
        mainSvg.append('path')
        .data([allTeamsGV])
        .attr('transform', 'translate(950, 0)')
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('id', "blueline")
        .attr('stroke-width', '4px');

        mainSvg.append('path')
        .data([defTeamGV])
        .attr('transform', 'translate(950, 0)')
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('id', "greenline")
        .attr('stroke-width', '4px');

        mainSvg.append('path')
        .data([specTeamGV])
        .attr('transform', 'translate(950, 0)')
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('id', "redline")
        .attr('stroke-width', '4px');

        // histogram
        
        atFGProb = allTeamsPV["field_goal"];
        atNPProb = allTeamsPV["no_play"];
        atPProb = allTeamsPV["punt"];
        atRProb = allTeamsPV["run"];

        dFGProb = defTeamPV["field_goal"];
        dNPProb = defTeamPV["no_play"];
        dPProb = defTeamPV["punt"];
        dRProb = defTeamPV["run"];
        console.log(data);
        tFGProb = specTeamPV["field_goal"];
        tNPProb = specTeamPV["no_play"];
        tPProb = specTeamPV["punt"];
        tRProb = specTeamPV["run"];

        fgData = [atFGProb, dFGProb, tFGProb];
        npData = [atNPProb, dNPProb, tNPProb];
        pData = [atPProb, dPProb, tPProb];
        rData = [atRProb, dRProb, tRProb];

        histogram_data = [
            {
                "action": "Field Goal",
                "atProb": atFGProb,
                "dProb": dFGProb,
                "tProb": tFGProb,
            },
            {
                "action": "No Play",
                "atProb": atNPProb,
                "dProb": dNPProb,
                "tProb": tNPProb,
            },
            {
                "action": "Punt",
                "atProb": atPProb,
                "dProb": dPProb,
                "tProb": tPProb,
            },
            {
                "action": "Run",
                "atProb": atRProb,
                "dProb": dRProb,
                "tProb": tRProb,
            }
        ];
        var x = d3.scaleBand().rangeRound([0, 800]).padding([0.1]);
        var y = d3.scaleLinear().rangeRound([800, 0]);

        x.domain(histogram_data.map(function(d) {return d.action;}));
        y.domain([0, d3.max(histogram_data, function(d) { return d.atProb})]);
        /*
        mainSvg.selectAll("bar")
            .data(histogram_data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", x(d.action))
            .attr("y", y(d.atProb))
            .attr("width", x.bandwidth())
            .attr("height", function(d) {return 1920 - y(d.atProb);});
        
        mod_hdata = histogram_data.map(i => {
            i.action = i.action;
            return i;
            });
        
        var xScale0 = d3.scaleBand().range([0, 500]).padding([0.2]);
        var xScale1 = d3.scaleBand();
        var yScaleH = d3.scaleLinear().range([500, 0]);

        xScale0.domain(mod_hdata.map(d => d.action));
        xScale1.domain(['atProb', 'dProb', 'tProb']).range([0, 500]);
        yScaleH.domain([0, 1]);

        var model_name = mainSvg.selectAll(".model_name")
            .data(mod_hdata)
            .enter().append("g")
            .attr("class", "model_name")
            .attr("transform", d => `translate(${xScale0(d.action)},0)`);

        model_name.selectAll(".bar.field1")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar field1")
            .style("fill","blue")
            .attr("x", d => xScale1(d.atProb))
            .attr("y", d => yScaleH(d.atProb))
            .attr("width", 20)
            .attr("height", d => {return yScaleH(d.atProb)});

        model_name.selectAll(".bar.field2")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar field2")
            .style("fill","red")
            .attr("x", d => xScale1(d.dProb))
            .attr("y", d => yScaleH(d.dProb))
            .attr("width", 20)
            .attr("height", d => {return yScaleH(d.dProb)});
        
        model_name.selectAll(".bar.field3")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar field3")
            .style("fill","green")
            .attr("x", d => xScale1(d.tProb))
            .attr("y", d => yScaleH(d.tProb))
            .attr("width", 20)
            .attr("height", d => {return yScaleH(d.tProb)});
        */

        if (notifyDanger) { 
            dangerrect = mainSvg.append('rect')
                .attr("transform", "translate(635, 10)")
                .attr("width", 250)
                .attr("height", 100)
                .attr('id', "dangerrect")   
                .attr("fill", "red");
            dangertext = mainSvg.append('text')
                .attr("transform", "translate(675, 60)")
                .style("font-size", "14px")
                .attr("font-weight", "700")
                .attr('id', "dangertext")
                .text("This is a dangerous situation.");
        }
    })
    .catch(error => {
        console.error("error:", error);
    });
}

function setUpGraphs(mainSvg, width) {
    // gower chart
    const xScale = d3.scaleLinear().domain([0, 99]).range([0, 300]);
    const yScale = d3.scaleLinear().domain([0, 1]).range([300, 0]);
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(10);

    mainSvg.append('g')
        .attr('transform', 'translate(950, 300)')
        .attr('id', 'gv_xaxis')
        .call(xAxis);

    mainSvg.append('g')
        .attr('transform', 'translate(950, 0)')
        .attr('id', 'gv_yaxis')
        .call(yAxis);
    
    mainSvg.append('text')
        .attr('transform', 'translate(1035, 333)')
        .text('Gower Values');

    mainSvg.append('rect')
        .attr('transform', 'translate(1175, 60)')
        .attr('fill', 'blue')
        .attr('width', 10)
        .attr('height', 10);

    mainSvg.append('rect')
        .attr('transform', 'translate(1175, 80)')
        .attr('fill', 'red')
        .attr('width', 10)
        .attr('height', 10);
    
    mainSvg.append('rect')
        .attr('transform', 'translate(1175, 100)')
        .attr('fill', 'green')
        .attr('width', 10)
        .attr('height', 10);
    
    mainSvg.append('text')
        .attr('transform', 'translate(1188, 68)')
        .style('font-size', '9px')
        .text("All Teams");
    
    mainSvg.append('text')
        .attr('transform', 'translate(1188, 88)')
        .style('font-size', '9px')
        .text("Defense Specified");

    mainSvg.append('text')
        .attr('transform', 'translate(1188, 108)')
        .style('font-size', '9px')
        .text("Specified Team");

    // histogram
    const xScaleH = d3.scaleBand().domain(["Field Goal", "No Play", "Punt", "Run"]).range([0, 400]).padding([0.2]);
    const yScaleH = d3.scaleLinear().domain([0, 1]).range([300, 0]);
    const xAxisH = d3.axisBottom(xScaleH).tickValues(["Field Goal", "No Play", "Punt", "Run"]);
    const yAxisH = d3.axisLeft(yScaleH).ticks(10);

    mainSvg.append('g')
        .attr('transform', 'translate(950, 650)')
        .attr('id', 'h_xaxis')
        .call(xAxisH);

    mainSvg.append('g')
        .attr('transform', 'translate(950, 350)')
        .attr('id', 'h_yaxis')
        .call(yAxisH);
    
    mainSvg.append('text')
        .attr('transform', 'translate(1100, 690)')
        .text('Success Probabilities');

    mainSvg.append('rect')
        .attr('transform', 'translate(980, 715)')
        .attr('fill', 'blue')
        .attr('width', 10)
        .attr('height', 10);

    mainSvg.append('rect')
        .attr('transform', 'translate(1040, 715)')
        .attr('fill', 'red')
        .attr('width', 10)
        .attr('height', 10);
    
    mainSvg.append('rect')
        .attr('transform', 'translate(1135, 715)')
        .attr('fill', 'green')
        .attr('width', 10)
        .attr('height', 10);
    
    mainSvg.append('text')
        .attr('transform', 'translate(995, 722)')
        .style('font-size', '9px')
        .text("All Teams");
    
    mainSvg.append('text')
        .attr('transform', 'translate(1055, 722)')
        .style('font-size', '9px')
        .text("Defense Specified");

    mainSvg.append('text')
        .attr('transform', 'translate(1150, 722)')
        .style('font-size', '9px')
        .text("Specified Team");
}
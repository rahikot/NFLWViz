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

function visualizePlayers(playerData, color, playerDataById) {
    var toolTip = d3.tip().attr('id', "tooltip").attr('class', 'd3-tip').html(function(d){
        return "Name: " + playerDataById[d.nflId].displayName + "<br>Position: " +playerDataById[d.nflId].officialPosition
    })
    //make tooltip look modern
    .style("border-radius", "10px").style("padding", "10px").style("color", "white").style("font-size", "16px").offset([50,100])
    .style("background-color", "black").style("border", "solid").style("border-width", "2px").style("border-color", color);
    
    mainSvg.call(toolTip)
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
        .attr("class", "circle-label")
        


    circles.enter().append("text")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .style("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", color)
        .text(function(d) { return d.jerseyNumber; })
        .attr("id", function(d) { return "text-" + d.jerseyNumber + "-" + d.team; })
        .attr("class", "circle-label")
        .on('mouseover', toolTip.show)
        .on('mouseout', toolTip.hide)

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
        } else if (absoluteYardNumber === 60 && possessionTeam === awayTeam) {
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

function visualizePlay(allPlayData, playNumber, mainSvg, interval, homeTeam, awayTeam, playerDataById) {
    
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
            visualizePlayers(homeData, homeColor, playerDataById);
            visualizePlayers(awayData, awayColor, playerDataById);
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
        dangerrect = null;
        dangertext = null;
        console.log(data);
        mainSvg.select("#blueline").remove();
        mainSvg.select("#greenline").remove();
        mainSvg.select("#redline").remove();
        mainSvg.select("#dangerrect").remove();
        mainSvg.select("#dangertext").remove();
        mainSvg.select("#histogram_svg").remove();
        mainSvg.select('#gv_xaxis').remove();
        mainSvg.select('#gv_yaxis').remove();
        mainSvg.select('#recommendationrect').remove();
        mainSvg.select('#rectext').remove();
        const xScale = d3.scaleLinear().domain([0, allTeamsGV.length]).range([0, 300]);
        const yScale = d3.scaleLinear().domain([0, Math.max(d3.max(allTeamsGV), 0.65)]).range([300, 0]);
        const xAxis = d3.axisBottom(xScale).tickFormat(function(d) {return d + 1});
        const yAxis = d3.axisLeft(yScale).ticks(10);
        mainSvg.append('g')
            .attr('transform', 'translate(950, 300)')
            .attr('id', 'gv_xaxis')
            .call(xAxis);

        mainSvg.append('g')
            .attr('transform', 'translate(950, 0)')
            .attr('id', 'gv_yaxis')
            .call(yAxis);
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
        .attr('stroke', 'red')
        .attr('id', "redline")
        .attr('stroke-width', '4px');

        mainSvg.append('path')
        .data([specTeamGV])
        .attr('transform', 'translate(950, 0)')
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('id', "greenline")
        .attr('stroke-width', '4px');

        // histogram
        console.log(data);
        atFGProb = allTeamsPV["field_goal"] === undefined ? 0 : allTeamsPV["field_goal"];        
        atNPProb = allTeamsPV["no_play"] === undefined ? 0 : allTeamsPV["no_play"];
        atPProb = allTeamsPV["punt"] === undefined ? 0 : allTeamsPV["punt"];
        atRProb = allTeamsPV["run"] === undefined ? 0 : allTeamsPV["run"];
        atPsProb = allTeamsPV["pass"] === undefined ? 0 : allTeamsPV["pass"];

        dFGProb = defTeamPV["field_goal"] === undefined ? 0 : defTeamPV["field_goal"];
        dNPProb = defTeamPV["no_play"] === undefined ? 0 : defTeamPV["no_play"];
        dPProb = defTeamPV["punt"] === undefined ? 0 : defTeamPV["punt"];
        dRProb = defTeamPV["run"] === undefined ? 0 : defTeamPV["run"];
        dPsProb = defTeamPV["pass"] === undefined ? 0 : defTeamPV["pass"];

        tFGProb = specTeamPV["field_goal"] === undefined ? 0 : specTeamPV["field_goal"];
        tNPProb = specTeamPV["no_play"] === undefined ? 0 : specTeamPV["no_play"];
        tPProb = specTeamPV["punt"] === undefined ? 0 : specTeamPV["punt"];
        tRProb = specTeamPV["run"] === undefined ? 0 : specTeamPV["run"];
        tPsProb = specTeamPV["pass"] === undefined ? 0 : specTeamPV["pass"];
        
        atFGyds = allTeamsMY["field_goal"] === undefined ? 0 : Math.round(allTeamsMY["field_goal"] * 100) / 100;        
        atNPyds = allTeamsMY["no_play"] === undefined ? 0 : Math.round(allTeamsMY["no_play"] * 100) / 100;
        atPyds = allTeamsMY["punt"] === undefined ? 0 : Math.round(allTeamsMY["punt"] * 100) / 100;
        atRyds = allTeamsMY["run"] === undefined ? 0 : Math.round(allTeamsMY["run"] * 100) / 100;
        atPsyds = allTeamsMY["pass"] === undefined ? 0 : Math.round(allTeamsMY["pass"] * 100) / 100;

        dFGyds = defTeamMY["field_goal"] === undefined ? 0 : Math.round(defTeamMY["field_goal"] * 100) / 100;
        dNPyds = defTeamMY["no_play"] === undefined ? 0 : Math.round(defTeamMY["no_play"] * 100) / 100;
        dPyds = defTeamMY["punt"] === undefined ? 0 : Math.round(defTeamMY["punt"] * 100) / 100;
        dRyds = defTeamMY["run"] === undefined ? 0 : Math.round(defTeamMY["run"] * 100) / 100;
        dPsyds = defTeamMY["pass"] === undefined ? 0 : Math.round(defTeamMY["pass"] * 100) / 100;

        tFGyds = specTeamMY["field_goal"] === undefined ? 0 : Math.round(specTeamMY["field_goal"] * 100) / 100;
        tNPyds = specTeamMY["no_play"] === undefined ? 0 : Math.round(specTeamMY["no_play"] * 100) / 100;
        tPyds = specTeamMY["punt"] === undefined ? 0 : Math.round(specTeamMY["punt"] * 100) / 100;
        tRyds = specTeamMY["run"] === undefined ? 0 : Math.round(specTeamMY["run"] * 100) / 100;
        tPsyds = specTeamMY["pass"] === undefined ? 0 : Math.round(specTeamMY["pass"] * 100) / 100;

        histogram_data = [
            {
                "action": "Field Goal",
                "atProb": atFGProb,
                "dProb": dFGProb,
                "tProb": tFGProb,
                "atyds": atFGyds,
                "dyds": dFGyds,
                "tyds": tFGyds,
                "psyds": atPsProb
            },
            {
                "action": "No Play",
                "atProb": atNPProb,
                "dProb": dNPProb,
                "tProb": tNPProb,
                "atyds": atNPyds,
                "dyds": dNPyds,
                "tyds": tNPyds
            },
            {
                "action": "Punt",
                "atProb": atPProb,
                "dProb": dPProb,
                "tProb": tPProb,
                "atyds": atPyds,
                "dyds": dPyds,
                "tyds": tPyds
            },
            {
                "action": "Run",
                "atProb": atRProb,
                "dProb": dRProb,
                "tProb": tRProb,
                "atyds": atRyds,
                "dyds": dRyds,
                "tyds": tRyds
            },
            {
                "action": "Pass",
                "atProb": atPsProb,
                "dProb": dPsProb,
                "tProb": tPsProb,
                "atyds": atPsyds,
                "dyds": dPsyds,
                "tyds": tPsyds
            }
        ];

        // histogram
        const margin = {
            "top": 10,
            "right": 30,
            "bottom": 30,
            "left":40
        };
        const width = 460 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const histogramSvg = mainSvg.append("g")
            .attr("transform", `translate(950, 400)`)
            .attr('id', "histogram_svg");

        const x0 = d3.scaleBand().range([0, width]).paddingInner(0.1);
        const x1 = d3.scaleBand().padding(0.05);
        const y = d3.scaleLinear().range([height, 0]);

        x0.domain(histogram_data.map(d => d.action));
        x1.domain(['atProb', 'dProb', 'tProb']).range([0, x0.bandwidth()]);
        y.domain([0,1]);

        histogramSvg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x0));
        histogramSvg.append("g").call(d3.axisLeft(y));

        mainSvg.append('text')
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", 1175)
            .attr("y", 793)
            .text("Plays");

        mainSvg.append('text')
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("transform", "translate(918, 525) rotate(-90)")
            .text("Proportion of Plays");

        const actionGroup = histogramSvg.selectAll(".action-group")
                            .data(histogram_data)
                            .enter().append("g")
                            .attr("class", "action-group")
                            .attr("transform", d => `translate(${x0(d.action)}, 0)`);

        var tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("background", "white")
            .text("a simple tooltip");
        
        actionGroup.selectAll(".bar.all-teams")
            .data(d => [d])
            .enter().append("rect")
            .attr("class", "bar all-teams")
            .style("fill", "blue")
            .attr("x", d => x1('atProb'))
            .attr("y", d => y(d.atProb))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - y(d.atProb))
            .on("mouseover", function(d){tooltip.text(`Mean Yards: ${d.atyds}`); return tooltip.style("visibility", "visible");})
            .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
        actionGroup.selectAll(".bar.defense-specific")
            .data(d => [d])
            .enter().append("rect")
            .attr("class", "bar defense-specific")
            .style("fill", "green")
            .attr("x", d => x1('tProb'))
            .attr("y", d => y(d.tProb))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - y(d.tProb))
            .on("mouseover", function(d){tooltip.text(`Mean Yards: ${d.tyds}`); return tooltip.style("visibility", "visible");})
            .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

        actionGroup.selectAll(".bar.team-specific")
            .data(d => [d])
            .enter().append("rect")
            .attr("class", "bar team-specific")
            .style("fill", "red")
            .attr("x", d => x1('dProb'))
            .attr("y", d => y(d.dProb))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - y(d.dProb))
            .on("mouseover", function(d){tooltip.text(`Mean Yards: ${d.dyds}`); return tooltip.style("visibility", "visible");})
            .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");});              

        if (notifyDanger) { 
            dangerrect = mainSvg.append('rect')
                .attr("transform", "translate(620, 10)")
                .attr("width", 250)
                .attr("height", 100)
                .attr('id', "dangerrect")   
                .attr("fill", "LightPink")
                .attr("rx", 10)
                .attr("ry", 10);
            dangertext = mainSvg.append('text')
                .attr("transform", "translate(660, 65)")
                .style("font-size", "14px")
                .attr("font-weight", "700")
                .attr('id', "dangertext")
                .text("This is a dangerous situation.");
        }

        recommendation = data["recommendation"];
        if (typeof recommendation === 'string' || recommendation instanceof String) {
            recrect = mainSvg.append('rect')
                .attr("transform", "translate(0, 10)")
                .attr("width", 250)
                .attr("height", 100)
                .attr('id', "recommendationrect")
                .attr("fill", "LightGreen")
                .attr("rx", 10) // Set the x-radius for rounded corners
                .attr("ry", 10);

            rectext = mainSvg.append('text')
                .attr("transform", "translate(0, 25)")
                .style("font-size", "14px")
                .attr("font-weight", "700")
                .attr('id', "rectext")
                .text(`Model Recommendation:  ${recommendation}`);
        } else {
            action = recommendation[0];
            direction = "";
            actionDistance = "";
            if (action === "run" || action == "pass") {
                direction = `${recommendation[1]}`;
                actionDistance = `${recommendation[2].toFixed(2)} yds`;
            }
            if (recommendation[2] == 0) {
                actionDistance = "";
            }
            recrect = mainSvg.append('rect')
                .attr("transform", "translate(0, 10)")
                .attr("width", 250)
                .attr("height", 100)
                .attr('id', "recommendationrect")
                .attr("fill", "LightGreen")
                .attr("rx", 10)
                .attr("ry", 10);
            // rectext = mainSvg.append('text')
            //     .attr("transform", "translate(20, 60)")
            //     .style("font-size", "14px")
            //     .attr("font-weight", "700")
            //     .attr('id', "rectext")
            //     .text(`Recommendation:  ${action} ${direction} ${actionDistance}`);

            mainSvg.append('text')
                .attr("transform", "translate(5, 25)")
                .style("font-size", "14px")
                .attr("font-weight", "700")
                .attr('id', "rectext")
                .style("text-decoration", "underline")
                .text(`Model Recommendation`);


            mainSvg.append('text')
                .attr("transform", "translate(5, 45)")
                .style("font-size", "14px")
                .attr("font-weight", "700")
                .attr('id', "rectext")
                .text(`Play Type: ${action.charAt(0).toUpperCase() + action.slice(1)}`);

            mainSvg.append('text')
                .attr("transform", "translate(5, 65)")
                .style("font-size", "14px")
                .attr("font-weight", "700")
                .attr('id', "rectext")
                .text(`Direction: ${direction.charAt(0).toUpperCase() + direction.slice(1)}`);


            mainSvg.append('text')
                .attr("transform", "translate(5, 85)")
                .style("font-size", "14px")
                .attr("font-weight", "700")
                .attr('id', "rectext")
                .text(`Expected Gain: ${actionDistance} `);

            mainSvg.append('text')
                .attr("transform", "translate(5, 105)")
                .style("font-size", "14px")
                .attr("font-weight", "700")
                .attr('id', "rectext")
                .text(`Actual Play Gain: ${Number(allPlayData.playResult).toFixed(2)}`);



        }

    })
    .catch(error => {
        console.error("error:", error);
    });
}

function setUpGraphs(mainSvg, width) {
    // gower chart
    const xScale = d3.scaleLinear().domain([0, 10]).range([0, 300]);
    const yScale = d3.scaleLinear().domain([0, 1]).range([300, 0]);
    const xAxis = d3.axisBottom(xScale).tickFormat(function(d) {return d + 1});
    const yAxis = d3.axisLeft(yScale).ticks(10);

    var tooltip2 = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "white");

    mainSvg.append('g')
        .attr('transform', 'translate(950, 300)')
        .attr('id', 'gv_xaxis')
        .call(xAxis);

    mainSvg.append('g')
        .attr('transform', 'translate(950, 0)')
        .attr('id', 'gv_yaxis')
        .call(yAxis);
    
    mainSvg.append('text')
        .attr('transform', 'translate(1060, 0)')
        .attr('id', 'gv_text')
        .text('Gower Values')
        .on("mouseover", function(d){tooltip2.text(`Gower Values: This chart is the similarity distance of the plays that were evaluated \n
                                                    in the All Teams, Specific Team, and Defense Specific play subsets to compare against \n
                                                    the current play. A lower number indicates more similarity.`); 
                                                    return tooltip2.style("visibility", "visible");
                                                })
        .on("mousemove", function(){return tooltip2.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
        .on("mouseout", function(){return tooltip2.style("visibility", "hidden");}); 

    mainSvg.append('rect')
        .attr('transform', 'translate(1225, 30)')
        .attr('fill', 'blue')
        .attr('width', 10)
        .attr('height', 10);

    mainSvg.append('rect')
        .attr('transform', 'translate(1225, 50)')
        .attr('fill', 'red')
        .attr('width', 10)
        .attr('height', 10);
    
    mainSvg.append('rect')
        .attr('transform', 'translate(1225, 70)')
        .attr('fill', 'green')
        .attr('width', 10)
        .attr('height', 10);
    
    mainSvg.append('text')
        .attr('transform', 'translate(1238, 38)')
        .style('font-size', '9px')
        .text("All Teams");
    
    mainSvg.append('text')
        .attr('transform', 'translate(1238, 58)')
        .style('font-size', '9px')
        .text("Defense Specified");

    mainSvg.append('text')
        .attr('transform', 'translate(1238, 78)')
        .style('font-size', '9px')
        .text("Specified Team");

    mainSvg.append('text')
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", 1185)
        .attr("y", 340)
        .text("Nth Most Similar Play");

    mainSvg.append('text')
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("transform", "translate(918, 137) rotate(-90)")
        .text("Gower Value");

    // histogram    
    mainSvg.append('text')
        .attr('transform', 'translate(1088, 400)')
        .text('Historical Proportions')
        .on("mouseover", function(d){tooltip2.text(`Historical Proportions: This chart shows a proportion as to what action was taken \n
                                                    in similar plays. Hovering over a bar shows the mean yardage of when that action was \n
                                                    run historically, if applicable. All Teams chooses similar plays among all the \n
                                                    teams. Specific Team looks at similar plays where the same offensive team was involved. \n
                                                    Defense Specific looks at similar plays where the same defensive team was involved (but \n
                                                    any offensive team).`);
                                                    return tooltip2.style("visibility", "visible");
                                                })
        .on("mousemove", function(){return tooltip2.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
        .on("mouseout", function(){return tooltip2.style("visibility", "hidden");}); 

    mainSvg.append('rect')
        .attr('transform', 'translate(1040, 800)')
        .attr('fill', 'blue')
        .attr('width', 10)
        .attr('height', 10);

    mainSvg.append('rect')
        .attr('transform', 'translate(1100, 800)')
        .attr('fill', 'red')
        .attr('width', 10)
        .attr('height', 10);
    
    mainSvg.append('rect')
        .attr('transform', 'translate(1195, 800)')
        .attr('fill', 'green')
        .attr('width', 10)
        .attr('height', 10);
    
    mainSvg.append('text')
        .attr('transform', 'translate(1055, 807)')
        .style('font-size', '9px')
        .text("All Teams");
    
    mainSvg.append('text')
        .attr('transform', 'translate(1115, 807)')
        .style('font-size', '9px')
        .text("Defense Specified");

    mainSvg.append('text')
        .attr('transform', 'translate(1210, 807)')
        .style('font-size', '9px')
        .text("Specified Team");
}

var firstChange = false;
function teardownGraphs(mainSvg) {
    if (firstChange) {
        return;
    }
    mainSvg.select('#gv_xaxis').remove();
    mainSvg.select('#gv_yaxis').remove();
    mainSvg.select('#blueline').remove();
    mainSvg.select('#redline').remove();
    mainSvg.select('#greenline').remove();
    mainSvg.select('#histogram_svg').remove();
    mainSvg.select('#dangerrect').remove();
    mainSvg.select('#dangertext').remove();
}
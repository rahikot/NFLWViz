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

    // ["yardlineNumber", "quarter", "down", 'gameClock_minutes', 'gameClock_seconds', "yardsToGo", "preSnapHomeScore", "preSnapVisitorScore", "offensiveTeam", "defensiveTeam"]
    // all variables below are strings
    // yardlineNumber = (parseInt(playData.absoluteYardlineNumber) - 10).toString() // -10 to account for endzone
    // quarter = playData.quarter //possible values are 1, 2, 3, 4
    // down = playData.down //possible values are 1, 2, 3, 4
    // const [gameClock_minutes, gameClock_seconds] = playData.gameClock.split(":").map(Number);
    // yardsToGo = playData.yardsToGo
    // preSnapHomeScore = playData.preSnapHomeScore
    // preSnapVisitorScore = playData.preSnapVisitorScore
    // offensiveTeam = playData.possessionTeam
    // defensiveTeam = playData.possessionTeam === homeTeamAbbr ? awayTeamAbbr : homeTeamAbbr
    //
    // console.log("yardlineNumber:", yardlineNumber);
    // console.log("quarter:", quarter);
    // console.log("down:", down);
    // console.log("gameClock_minutes:", gameClock_minutes);
    // console.log("gameClock_seconds:", gameClock_seconds);
    // console.log("yardsToGo:", yardsToGo);
    // console.log("preSnapHomeScore:", preSnapHomeScore);
    // console.log("preSnapVisitorScore:", preSnapVisitorScore);
    // console.log("offensiveTeam:", offensiveTeam);
    // console.log("defensiveTeam:", defensiveTeam);

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


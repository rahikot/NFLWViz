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

function visualizePlay(allPlayData, playNumber, footballObject, interval) {
    if (!allPlayData[playNumber]) {
        throw new Error(`Play # '${playNumber}' could not be found.`)
    }
    playData = allPlayData[playNumber]

    footballData = playData.filter(item => item.team === 'football')
    //We can make modifications here to visualize all players

    let index = 0;

    const updateFootballLocation = () => {
        if (index < playData.length) {
            const footballData = playData.filter(item => item.team === 'football');
            if (index < footballData.length) {
                const data = footballData[index];
                footballObject.attr("x", data.x).attr("y", data.y);
                index++;
            }
        } else {
            clearInterval(interval);
        }
    };

    const intervalID = setInterval(updateFootballLocation, interval);

}


// Function that converts DateTime to seconds. Currently not used
/*function scaleTimeData(data) {
    var transformedData = {}
    var firstDate = data[0].time

    for (const rowNum in data) {
        const row = data[rowNum];
        const rowDate = row.time
        const timeInSeconds = (rowDate - firstDate)/1000
        transformedData[rowNum] = {
            ...row,
            time: timeInSeconds
        }
    }

}*/

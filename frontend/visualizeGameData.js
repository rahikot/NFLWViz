

function displayTeams(textSvg, homeTeam, awayTeam) {
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


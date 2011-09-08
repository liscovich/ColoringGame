function plotAdmin(geometry, returnData) {
  // this needs to be changed if the div id is changed
  var graphId = "#draw";
  // write log
  var i;
  if (lastQueueLength == null) {
    $("#queue").html("");
    i = 0;
  } else {
    i = lastQueueLength;
  }
  var moveQueue = returnData.moveQueue;
  for (; i < moveQueue.length; i++) {
    $("#queue").append(moveQueue[i]);
    $("#queue").append('\n');
  }
  lastQueueLength = moveQueue.length;
  
  // write report
  if (lastReportLength == null) {
    $("#report").html("");
    i = 0;
  } else {
    i = lastReportLength;
  }
  var report = returnData.report;
  for (; i < report.length; i++) {
    $("#report").append(report[i]);
    $("#report").append('\n');
  }
  lastReportLength = report.length;
  $("#logUrl").html("<a href='" + returnData.logUrl + "'>Raw log</a>");
  $("#reportUrl").html("<a href='" + returnData.reportUrl + "'>Reports</a>");

  var edgeArray = returnData.edges;
  if (edgeArray == null || edgeArray[0] == undefined) {
    return;
  }
  var coopArray = returnData.cooperating;
  var selectedGame = 0;

  if (returnData.selectedGame == "Liscovich Game")
    selectedGame = 1;
  else if (returnData.selectedGame == "Arbesman-Rand Game")
    selectedGame = 2;

  // declare local variables
  var nodeTop, nodeLeft, node, cY, drawHeight, i, angle, curCoord;
  var numPlayers = edgeArray.length;

  // The angle of each step
  var angleStep = (geometry.endAngle - geometry.startAngle) / (numPlayers - 1);
  if ((geometry.startAngle == 0 && geometry.endAngle == 360)
      || (geometry.startAngle == 360 && geometry.endAngle == 0))
    angleStep = (geometry.endAngle - geometry.startAngle) / numPlayers;

  var drawWidth = (geometry.radius + geometry.boxWidth) * 2;
  if ((geometry.startAngle >= 180 && geometry.endAngle >= 180)
      || (geometry.startAngle <= 180 && geometry.endAngle <= 180)) {
    drawHeight = geometry.radius + (geometry.boxHeight * 2);
    if (geometry.startAngle >= 180 && geometry.endAngle >= 180)
      cY = geometry.radius + geometry.boxHeight;
    else
      cY = geometry.boxHeight;
  } else {
    drawHeight = (geometry.radius + geometry.boxHeight) * 2;
    cY = drawHeight / 2;
  }
  var cX = drawWidth / 2;

  if (drawCanvas) {
    drawCanvas.clear();
  } else {
    drawCanvas = Raphael(document.getElementById('draw'), drawWidth, drawHeight);
  }

  // store xCoords and yCoords in an array
  var xCoords = new Array();
  var yCoords = new Array();

  switch (selectedGame) {
  case 1:
    // let's record the order to display the players to get a nice ring
    // store which edges we have already added in here
    var edgesUsed = new Array(edgeArray.length);
    for (i = 0; i < edgeArray.length; i++)
      edgesUsed[i] = false;

    var playerOrder = new Array(numPlayers);
    // start with player # 0
    var curPlayer = edgeArray[0][0];
    playerOrder[0] = curPlayer;
    var numAssigned = 1;

    while (numAssigned < edgeArray.length) {
      for (i = 0; i < edgeArray.length; i++) {
        if ((edgeArray[i][0] == curPlayer || edgeArray[i][1] == curPlayer)
            && (!edgesUsed[i])) {
          edgesUsed[i] = true;
          curPlayer = (edgeArray[i][0] == curPlayer) ? edgeArray[i][1]
              : edgeArray[i][0];
          playerOrder[numAssigned] = curPlayer;
          numAssigned++;
        }
      }
    }

    // now record the coordinates of the boxes
    for (i = 0; i < numPlayers; i++) {
      angle = parseInt(geometry.startAngle + (i * angleStep));
      curCoord = getCoordinates(cX, cY, geometry.radius, angle);

      xCoords[playerOrder[i]] = curCoord.x;
      yCoords[playerOrder[i]] = curCoord.y;
    }
    break;
  case 2:
    // simply record the coordinates of the boxes
    for (i = 0; i < numPlayers; i++) {
      angle = parseInt(geometry.startAngle + (i * angleStep));
      curCoord = getCoordinates(cX, cY, geometry.radius, angle);

      xCoords[i] = curCoord.x;
      yCoords[i] = curCoord.y;
    }

    break;
  default:
    alert("Error, can't determine game type.");
    return null;
    break;
  }

  // Now add edges
  if (edgeArray.length > 0) {
    var pathString = "";
    for (i = 0; i < edgeArray.length; i++) {
      pathString += "M" + xCoords[edgeArray[i][0]] + " "
          + yCoords[edgeArray[i][[ 0 ]]];
      pathString += "L" + xCoords[edgeArray[i][1]] + " "
          + yCoords[edgeArray[i][[ 1 ]]];
    }
    var pathShadow = drawCanvas.path(pathString);
    pathShadow.attr({
      stroke : "#000000",
      "stroke-width" : "4",
      translation : "2,2",
      opacity : ".5"
    });
    pathShadow.blur();

    var path = drawCanvas.path(pathString);
    path.attr({
      stroke : "#acb9c2",
      "stroke-width" : "4"
    });
  }

  // Finally, draw the boxes
  for (i = 0; i < numPlayers; i++) {
    var playerId = i;

    if (selectedGame == 1) {
      playerId = playerOrder[i];
    }

    var curX = xCoords[playerId];
    var curY = yCoords[playerId];

    // Top and left of the boxes will be 1/2 the width and height less than the
    // center
    nodeTop = curY - parseInt(.5 * geometry.boxHeight);
    nodeLeft = curX - parseInt(.5 * geometry.boxWidth);

    var colorClass = "";
    if (coopArray[playerId] == 1) {
      drawCanvas.image(appURL + "/images/orange_ring_shadow.png", nodeLeft,
          nodeTop, geometry.boxWidth, geometry.boxHeight);
    } else if (coopArray[playerId] == 0) {
      drawCanvas.image(appURL + "/images/blue_ring_shadow.png", nodeLeft,
          nodeTop, geometry.boxWidth, geometry.boxHeight);
    } else {
      drawCanvas.image(appURL + "/images/gray_ring_shadow.png", nodeLeft,
          nodeTop, geometry.boxWidth, geometry.boxHeight);
    }

    boxText = playerId;
    var t = drawCanvas.text(curX, curY, boxText);
    t.toFront();
  }
}
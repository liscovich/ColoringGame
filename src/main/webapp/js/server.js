drawCanvas = null;
function getRandomString(length) {
  var digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var returnString = "";
  for (var i = 0; i < length; i++) {
    returnString += digits[Math.floor(Math.random() * digits.length)];
  }
  return returnString;
}

function startGame(sid) {
  $.ajax({
    type: "POST",
    url: appURL + "/server",
    data: "serverid=" + encodeURIComponent(sid) +"&clientid=128&action=StartServer",
  });
}

function dropPlayer(sid, pid) {
  $.ajax({
    type: "POST",
    url: appURL + "/server",
    data: "serverid=" + encodeURIComponent(sid) + "&clientid=128&action=DropPlayer&playerid=" + pid,
  });
}

function stopGame(sid) {
  $.ajax({
    type: "POST",
    url: appURL + "/server",
    data: "serverid=" + encodeURIComponent(sid) + "&clientid=128&action=StopServer",
  });
}

function ignoreTimeout(sid) {
  $.ajax({
    type: "POST",
    url: appURL + "/server",
    data: "serverid=" + encodeURIComponent(sid) + "&clientid=128&action=IgnoreTimeout",
  });
}

function deleteGame(sid) {
  previewId = "-1";
  $.ajax({
    type: "POST",
    url: appURL + "/server",
    data: "serverid=" + encodeURIComponent(sid) + "&clientid=128&action=DeleteServer",
  });
}

function cancelGame(sid) {
  $.ajax({
    type: "POST",
    url: appURL + "/server",
    data: "serverid=" + encodeURIComponent(sid) + "&clientid=128&action=CancelServer",
    });
  }

function gameDone(sid) {
  if (drawCanvas != null && drawCanvas != undefined) {
    drawCanvas.clear();
  }
  previewGame = false;
  previewId = "-1";
  stopGame(sid);
  $('#watch').css('visibility', 'hidden');
}

function watchGame(sid) {
  if (drawCanvas != null && drawCanvas != undefined) {
    drawCanvas.clear();
  }
  lastRound = 0;
  previewGame = true;
  previewId = sid;
  $("#clientTable").find("tr:gt(0)").remove();
  $('#watch').css('visibility', 'visible');
  lastQueueLength = null;
  lastReportLength = null;
}

function stopWatching() {
  if (drawCanvas != null && drawCanvas != undefined) {
    drawCanvas.clear();
  }
  lastRound = 0;
  previewGame = false;
  previewId = "-1";
  $('#watch').css('visibility', 'hidden');
}

var intervalId;
var previewGame = false;
var previewId = "-1";

var geometry = { "radius" : 180,
        "startAngle" : 0,
        "endAngle" : 360,
        "boxHeight" : 45,
        "boxWidth" : 45 };
var lastRound = -1;
var updateTime = 2000;
var working = 0;
lastQueueLength = null;
$(document).ready(function(){
  $.preloadImages("images/1_3d.png",
        "images/2_3d.png",
        "images/3_3d.png",
        "images/4_3d.png",
        "images/5_3d.png",
        "images/6_3d.png",
        "images/7_3d.png",
        "images/8_3d.png",
        "images/gray_ring_shadow.png",
        "images/orange_ring_shadow.png",
        "images/blue_ring_shadow.png");

$('#eli').change(function() {
  if ($('#eli').val() == "Yes") {
    $('#orderA').attr("disabled", "");
    $('#orderB').attr("disabled", "");
  } else {
    $('#orderA').val("Rnd");
    $('#orderB').val("Rnd");
    $('#orderA').attr("disabled", "disabled");
    $('#orderB').attr("disabled", "disabled");
  }
});

intervalId = setInterval(function() {$.ajax({
    type: "POST",
    url: appURL + "/server",
    data: "serverid=" + encodeURIComponent(previewId) + "&clientid=128&action=GetUpdate",
    error: function(){ $('#working').attr("src", "images/0_3d.png"); },
    success: function(returnData){
      if (previewGame && previewId != "-1" && previewId != "" && returnData.clientInstructions == "UpdateGraph") {
        lastRound = returnData.round;
        plotAdmin(geometry, returnData);

        // Clear rows beyond first one
        $("#clientTable").find("tr:gt(0)").remove();
        for (var i = 0; i < returnData.players.length; i++) {
          var clientURL = appURL + "/ar_client.html?workerNumber=" 
            + parseInt(returnData.players[i].id) + "&serverid=" + encodeURIComponent(previewId) 
            + "&workerId=cnt" + getRandomString(5);
          var dropLink = "";
          if (returnData.gameStatus == "PREPARED"
              || returnData.gameStatus == "WAITING_FOR_PLAYERS"
              || returnData.gameStatus == "TUTORIAL_ROUND"
              || returnData.gameStatus == "ELICITATION_ROUND") {
            if (returnData.players[i].status != "DROPPED") {
              dropLink = "<a href='javascript:dropPlayer(\"" + previewId + "\", \"" + returnData.players[i].id + "\")'>DROP</a>";
            } 
          }

          var newRow = "\
            <tr" + (returnData.players[i].status == "DROPPED" ? " style='color:#BBBBBB'" : "") + ">\
              <td>" + returnData.players[i].id + "</td>\
              <td nowrap='nowrap'>" + returnData.players[i].name + "</td>\
              <td width='100'>" + returnData.players[i].status + "</td>\
              <td>" + returnData.players[i].points + "</td>\
              <td>" + returnData.players[i].eliFirstMove + "</td>\
              <td>" + returnData.players[i].rule + "</td>\
              <td>" + returnData.players[i].curMove + "</td>\
              <td>" + returnData.players[i].lastMove + "</td>\
              <td>" + returnData.players[i].neighbors + "</td>\
              <td><a href='" + clientURL + "' target='_blank'>Link</a></td>\
              <td>" + returnData.players[i].turkerid + "</td>\
              <td align='right'>" + returnData.players[i].tutorialTime + "</td>\
              <td align='right'>" + returnData.players[i].elicitationTime + "</td>\
              <td align='right'>" + returnData.players[i].lastPing + "</td>\
              <td align='right' style='white-space:nowrap;'>" + returnData.players[i].idleTime + " " + dropLink + "</td>\
            </tr>";

          $('#clientTable tr:last').after(newRow);
        }
      }
      var lines = $('#turkIds').val().split('\n');
      $.each(lines, function(){
        if (this != "")
        {
          $("#clientTable td:contains('" + $.trim(this) + "')").css("background-color", "#FF7777");
        }
      });

      $('#working').attr("src", "images/" + (((++working)%8)+1) + "_3d.png");

      // Clear rows beyond first two
      $("#gameTable").find("tr:gt(1)").remove();

      if (returnData.games.length == 0) {
        stopWatching();
      }
      
      for (var i = 0; i < returnData.games.length; i++) {
        if (previewGame && previewId == returnData.games[i].id) {
          var linkText = "<a href='javascript:stopWatching()' class='command'>HIDE</a> ";
        } else {
          var linkText = "<a href='javascript:watchGame(\"" + returnData.games[i].id + "\")' class='command'>WATCH</a>";
        }
        switch (returnData.games[i].status) {
          case "STOPPED":
            linkText += " <a href='javascript:startGame(\"" + returnData.games[i].id + "\")' class='command'>START</a>";
            linkText += " <a href='javascript:cancelGame(\"" + returnData.games[i].id + "\")' class='command'>CANCEL</a>";
            break;
          case "FINISHED":
            linkText += " <a href='javascript:deleteGame(\"" + returnData.games[i].id + "\")' class='command'>DELETE</a>";
            break;
          case "CANCELLED":
            linkText += " <a href='javascript:deleteGame(\"" + returnData.games[i].id + "\")' class='command'>DELETE</a>";
            break;
          default:
            linkText += " <a href='javascript:stopGame(\"" + returnData.games[i].id + "\")' class='command'>STOP</a>";
            linkText += " <a href='javascript:cancelGame(\"" + returnData.games[i].id + "\")' class='command'>CANCEL</a>";
            break;
        }
        linkText += " <a href='javascript:replicateGame(\"" + returnData.games[i].id + "\")' class='command'>REPLICATE</a>";
        var newRow = "<tr";
        if (returnData.games[i].status == "FINISHED") {
          if (returnData.games[i].regular) {
            newRow += " style='color:green'"
          } else {
            newRow += " style='color:red'"
          }
        }
        newRow += ">" +
            "<td><a href='ar_client.html?serverid=" + encodeURIComponent(returnData.games[i].id) + "'>" + returnData.games[i].id + "</a></td>" +
            "<td style='text-transform:uppercase;' height='40'>" + returnData.games[i].status.replace(/_/g, " ") + "</td>" +
            "<td>" + returnData.games[i].numPlayers + "</td>\
            <td>" + returnData.games[i].numAIPlayers + "</td>\
            <td>" + returnData.games[i].costOfCooperation + "</td>\
            <td>" + returnData.games[i].payOff + "</td>\
            <td>" + returnData.games[i].seedMoney + "</td>\
            <td>" + returnData.games[i].exchangeRate + "</td>";
            if (returnData.games[i].fixed) {
              newRow += "<td>" + returnData.games[i].numRoundsA + "</td>" +
              		"<td>" + returnData.games[i].numRoundsB + "</td>" 
            } else {
              newRow += "<td style='opacity:0.25;'>" + returnData.games[i].numRoundsA + "</td>" +
              "<td style='opacity:0.25;'>" + returnData.games[i].numRoundsB + "</td>";
            }
            newRow += "<td>" + returnData.games[i].poe + "</td>\
            <td>" + returnData.games[i].eli + "</td>\
            <td>" + returnData.games[i].orderA + "</td>\
            <td>" + returnData.games[i].orderB + "</td>\
            <td>" + returnData.games[i].globalTimeout + "/" + returnData.games[i].elapseTime + "/" + returnData.games[i].roundElapseTime + "</td>\
            <td>" + returnData.games[i].playerTimeout + (returnData.games[i].timeoutIgnored ? " Ignored": " <a href='javascript:ignoreTimeout(\"" + returnData.games[i].id + "\")'>IGNORE</a>") + "</td>\
            <td>" + returnData.games[i].idleTimeout + "</td>\
            <td>" + linkText + "</td></tr>";
            $('#gameTable tr:last').after(newRow);
      }
      $('#gameTable tr:even').css("background-color", "#f5f8fa");
      $('#clientTable tr:even').css("background-color", "#f5f8fa");
      $('#maxMemory').html(returnData.maxMemory);
      $('#totalMemory').html(returnData.totalMemory);
      $('#freeMemory').html(returnData.freeMemory);
      $('#usedMemory').html(returnData.usedMemory);
    }
  });}, updateTime);

  $('#prepareServer').click(function(){
    // get variables from form
    if ($('#sid').val().trim().length == 0) {
      return;
    }

    serverId = encodeURIComponent($('#sid').val());
    var numAiPlayers = $('#n').val();
    var numHumanPlayers = $('#hu').val();
    var costOfCooperation = $('#coc').val();
    var payOff = $('#po').val();
    var seedMoney = $('#sm').val();
    var numRoundsB = $('#rB').val();
    var numRoundsA = $('#rA').val();
    var poe = $('#poe').val();
    var eli = $('#eli').val();
    var orderA = $('#orderA').val();
    var orderB = $('#orderB').val();
    var globalTimeout = $('#gto').val()
    var playerTimeout = $('#pto').val()
    var idleTimeout = $('#ito').val()
    var exchangeRate = $('#er').val()
    var probsA = $('#probsA').val()
    var probsB = $('#probsB').val()
    var fixed = $('#fixed').val()

    var data = { 
      "serverid" : serverId, 
      "clientid" : 128,
      "action" : "PrepareServer", 
      "numAiPlayers" : numAiPlayers, 
      "numHumanPlayers" : numHumanPlayers,
      "costOfCooperation" : costOfCooperation, 
      "payOff" : payOff,
      "seedMoney" : seedMoney, 
      "numRoundsB" : numRoundsB, 
      "numRoundsA" : numRoundsA,
      "poe" : poe,
      "eli" : eli,
      "orderA" : orderA, 
      "orderB" : orderB,
      "globalTimeout" : globalTimeout, 
      "playerTimeout" : playerTimeout,
      "idleTimeout" : idleTimeout,
      "exchangeRate" : exchangeRate,
      "probsA" : probsA,
      "probsB" : probsB,
      "fixed" : fixed
    };
    $.ajax({
        type: "POST",
        url: appURL + "/server",
        data: data,
        success: function(returnData){
          $('#working').attr("src", "images/" + (((++working)%8)+1) + "_3d.png");
        }
      });
  });
});

function generateGameID() {
  var date = new Date();
  var gameId = "g"
  if (date.getMonth() + 1 < 10) {
    gameId += "0";
  }
  gameId += (date.getMonth() + 1);

  if (date.getDate() < 10) {
    gameId += "0";
  }
  gameId += date.getDate();
  
  if (date.getHours() < 10) {
    gameId += "0";
  }
  gameId += date.getHours();
  
  if (date.getMinutes() < 10) {
    gameId += "0";
  }
  gameId += date.getMinutes();
  gameId += getRandomString(3);
  return gameId;
}

function genNumberOfRounds() {
  var prob = parseFloat($('#poe').val());
  if (prob > 0) {
    $('#rA').val(genNumberOfRound(prob));
    $('#rA').css("color", "#CCCCCC");
    $('#rB').val(genNumberOfRound(prob));
    $('#rB').css("color", "#CCCCCC");
    $('#fixed').val("false");
  }
}
function genNumberOfRound(prob) {
  var round = 1;
  while (Math.random() > prob) {
    round++;
  }
  return round;
}
function switchToManually(prob) {
  $('#rA').css("color", "");
  $('#rB').css("color", "");
  $('#fixed').val("true");
}
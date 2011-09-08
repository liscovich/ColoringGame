function initialize() {
  // If ClientLocation was filled in by the loader, use that info instead
  if (google.loader.ClientLocation) {
    latlng = new google.maps.LatLng(google.loader.ClientLocation.latitude,
      google.loader.ClientLocation.longitude);
    la = google.loader.ClientLocation.latitude;
    lo = google.loader.ClientLocation.longitude;
    loc = getFormattedLocation();
  }
}

function getFormattedLocation() {
  if (google.loader.ClientLocation.address.country_code == "US"
  && google.loader.ClientLocation.address.region) {
  return google.loader.ClientLocation.address.city + ", "
    + google.loader.ClientLocation.address.region.toUpperCase();
} else {
  return google.loader.ClientLocation.address.city + ", "
      + google.loader.ClientLocation.address.country_code;
  }
}

function mouseLocation(e) { // works on IE6,FF,Moz,Opera7
  if (!e) e = window.event; // works on IE, but not NS (we rely on NS
                            // passing us the event)
  if (e) { 
    if (e.pageX || e.pageY) { // this doesn't work on IE6!! (works on
                              // FF,Moz,Opera7)
      mouseX = e.pageX;
      mouseY = e.pageY;
    } else if (e.clientX || e.clientY) { // works on IE6,FF,Moz,Opera7
      mouseX = e.clientX + document.body.scrollLeft;
      mouseY = e.clientY + document.body.scrollTop;
    }  
  }
}

function onblur() {
  active = "Inactive";
  waitingUserMove = true;
}

function onfocus() {
  active = "Active";
  waitingUserMove = false;
}

function getPostData() {
  var result = JGenerous.postData;
  result["mx"] = mouseX;
  result["my"] = mouseY;
  result["active"] = active;
  result["lag"] = lag;
  if (progress) {
    result["p"] = progress;
  }
  if (svg == undefined) {
    svg = Modernizr.svg;
    result["svg"] = svg;
  }
  return result;
}

function updateClient() {
  JGenerous.postData = {
    "clientid" : decodeURIComponent(JGenerous.clientId), 
    "serverid" : decodeURIComponent(JGenerous.serverId), 
    "action" : "GetUpdate", 
    "workerId" : decodeURIComponent(JGenerous.workerId), 
    "assignmentId" : decodeURIComponent(JGenerous.assignmentId), 
    "hitId" : decodeURIComponent(JGenerous.hitId), 
    "turkSubmitTo" : decodeURIComponent(JGenerous.turkSubmitTo), 
    "browserCode": navigator.appCodeName, 
    "browserName": navigator.appName, 
    "browserVersion": navigator.appVersion, 
    "cookiesEnabled": navigator.cookieEnabled, 
    "platform": navigator.platform, 
    "userAgent": navigator.userAgent,
    "la": la,
    "lo": lo,
    "loc": loc,
    "cw": cw,
    "ch": ch};
  JGenerous.ctime1 = new Date().getTime();
  $.ajax({
    type: "POST",
    url: appURL + "/server",
    data: getPostData(),
    success: function(returnData){
      JGenerous.ctime2 = new Date().getTime();
      lag = JGenerous.ctime2 - JGenerous.ctime1;
      JGenerous.returnData && (JGenerous.sptime = JGenerous.returnData.time);
      JGenerous.returnData = returnData;
      // blink the browser title to notify the player
      if ((JGenerous.returnData.gameStatus == "COOPERATION_ROUND_A"
          || JGenerous.returnData.gameStatus == "COOPERATION_ROUND_B"
          || JGenerous.returnData.gameStatus == "WAITING_FOR_PLAYERS"
          || JGenerous.returnData.gameStatus == "PAYOFF_ROUND"
          || JGenerous.returnData.gameStatus == "FINISHED") 
          && active != "Active" 
          && waitingUserMove
          && !titleBlinking
          && !waitingOtherMove) {
        if (JGenerous.returnData.gameStatus == "WAITING_FOR_PLAYERS") {
          blinkTitle("Please continue!");
        } else if (JGenerous.returnData.gameStatus == "FINISHED"){
          if (JGenerous.returnData.progress != "SentFeedback" && progress != "SentFeedback") {
            blinkTitle("Game finished! Please enter your feedback!");
          } else {
            waitingUserMove = false;
          }
        } else {
          blinkTitle("Your turn! Please choose your next move!");
        }
      }
      if (waitToStart) {
        if ($("#countdown").length == 0) {
          if (JGenerous.returnData.waitTime > 0) {
            JGenerous.waitTime = JGenerous.returnData.waitTime;
            $("#status").append("<br/>(no more than <span id='countdown'>" + JGenerous.returnData.waitTime + "</span> sec)");
            setTimeout("updateWaitTime()", 1000);
          }
        } else {
          if (JGenerous.returnData.waitTime <= 0) {
            $("#status").html("Waiting for the other players...");
          } else {
            JGenerous.waitTime = JGenerous.returnData.waitTime;
          }
        }
      }
      if (JGenerous.currentStatus != JGenerous.returnData.gameStatus) {
        JGenerous.currentStatus = JGenerous.returnData.gameStatus;
        switch (JGenerous.returnData.gameStatus) {
          case "PREPARED":
            $("#statusDiv").html("Please wait...");
            $("#message").html("Please wait for the game to be started.");
            break;
          case "WAITING_FOR_PLAYERS":
            $("#statusDiv").html("");
            if (!JGenerous.returnData.doneTutorial) {
              $("#title").html("Tutorial");
              if (JGenerous.skip && JGenerous.skip <= 10) {
                tutorial(JGenerous.skip);
              } else {
                tutorial(1);
              }
            } else if (!JGenerous.returnData.doneElicitation && JGenerous.returnData.eli == "Yes") {
              tutorial(11);
            } else {
              intro();
            }
            break;
          case "PART_INTRO":
            $("#sm_end").hide();
            if (JGenerous.returnData.firstAllocationFinished) {
              intro2();
            } else {
              intro();
            }
            waitingOtherMove = false;
            break;
          case "COOPERATION_ROUND_A":
            $("#sm_end").hide();
            roundA();
            waitingOtherMove = false;
            break;
          case "COOPERATION_ROUND_B":
            $("#sm_end").hide();
            roundB();
            break;
          case "PAYOFF_ROUND":
            plotClient();
            if (JGenerous.previousStatus == 'BB') {// player was substitute by admin or robot
              realRoundB();
            } else if ($('#message').html().trim().length == 0) {
              showCurrentRoundChoice();
            }
            if (!JGenerous.returnData.shownPayoff) {
              $("#status").remove();
              waitingOtherMove = false;
              resultsStep();
              var poe = "" + Math.round(JGenerous.returnData.poe * 1000);
              while (poe.length < 3) {
                poe = "0" + poe;
              }
              initSlotMachine('sm_end', 'Another Round?', poe);
            } else {
              if ($("#status").length == 0) {
                $("#draw").append("<div id='status' class='waiting'>Waiting for the other players...</div>");
              }
            }
            
            break;
          case "NOT_ENOUGH_PLAYER":
            $("#title").html("The game could not be started");
            $("#message").html("<p>There is not enough player who completes the Tutorial " + 
              (JGenerous.returnData.eli == "Yes" ? "and Part 1 " : "") + "of the game</p>");
            $("#navi").html("<div class='navi'></div>");
            $("#status").remove();
            $("#sm_end").hide();
            $(".container").parent().parent().show();
            clearInterval (JGenerous.interval);
            break;
          case "STOPPED":
            waitingUserMove = false;
            $("#statusDiv").html("Game paused by administrator, please wait...");
            $("#title").html("");
            $("#message").html("<p>The game has not started yet or has been paused by the administrator.</p>  <p>Please wait for the game to resume.</p>");
            $("#navi").html("<div class='navi'><div id='right' style='visibility:hidden'/></div>");
            $(".container").parent().parent().show();
            $("#status").remove();
            $("#sm_end").hide();
            break;
          case "CANCELLED":
            waitingUserMove = false;
            $("#statusDiv").html("Game cancelled.");
            $("#title").html("");
            $("#message").html("<p><b>Thank you for playing.</b></p> <p>Unfortunately, the game could not be completed and was cancelled by the administrator.</p>  <p>You will still be paid for your participation but bonuses will not be awarded.</p>  <p>Please contact us at <a href='mailto:mturkgroup@gmail.com'>mturkgroup@gmail.com</a> with any questions or comments about this game.</p>");
            $("#navi").html("<div class='navi'><div id='right' style='visibility:hidden'/></div>");
            $("#status").remove();
            $("#sm_end").hide();
            $(".container").parent().parent().show();
            clearInterval (JGenerous.interval);
            break;
          case "FINISHED":
            finish();
            clearInterval (JGenerous.interval);
            $("#status").remove();
            $("#sm_end").hide();
            break;
          case "DROPPED":
            waitingUserMove = false;
            $("#status").remove();
            $("#sm_end").hide();
            $("#statusDiv").html("Dropped from game.");
            $("#title").html("");
            $("#message").html("<p><b>Thank you for playing.</b></p>" + JGenerous.returnData.reason);
            $("#navi").html("<div class='navi'><div id='right' style='visibility:hidden'/></div>");
            $(".container").parent().parent().show();
            clearInterval (JGenerous.interval);
            break;
        }
      } 
      !JGenerous.interval && (JGenerous.interval = setInterval ("updateClient()", JGenerous.updateTime ));
    },
    error: function(returnData, textStatus, errorThrown){
      $("#statusDiv").html("Lost connection with server, please wait...");
      $('#working').attr("src", "images/0_3d.png");
      $("#message").html("<p>The application did not receive a response from the server.  If the game does not resume you may want to try refreshing your browser.</p>" +
        "<p>If you continue receiving this error, please contact <a href='mailto:mturkgroup@gmail.com'>mturkgroup@gmail.com</a> " +
        "and provide the following error message:</p>" +
        "<textarea cols='30' rows = '5' style='border: 1px solid gray;'>" + errorThrown + "</textarea>");
      $("#navi").html("<div class='navi'><div id='right' style='visibility:hidden'/></div>");
      clearInterval (JGenerous.interval);
    }
  });
}

var la = "";
var lo = "";
var loc = "";
var ch = "";
var cw = "";
var mouseX = "";
var mouseY = "";
var active = "Active";
var progress;
var name;
var maxTutorial = 0;
var waitingOtherMove = false;
var waitingUserMove = true;
var waitToStart = false;
var lag = -1;
var svg;
google.load("maps", "3", {
  callback : initialize,
  other_params : "sensor=false"
});
if (document.compatMode == "CSS1Compat") {
  ch = document.documentElement.clientHeight;
  cw = document.documentElement.clientWidth;
} else {
  ch = document.body.clientHeight;
  cw = document.body.clientWidth;
}
var JGenerous = {};
// Grab the client's ID number from the query string
JGenerous.skip = parseInt($.getUrlVar('skip'));
JGenerous.clientId = parseInt($.getUrlVar('workerNumber'));
// Grab the server's ID number from the query string
JGenerous.serverId = $.getUrlVar('serverid');
// Grab the Turker ID from the query string
JGenerous.workerId = $.getUrlVar('workerId');
JGenerous.assignmentId = $.getUrlVar('assignmentId') || "";
JGenerous.hitId = $.getUrlVar('hitId') || "";
JGenerous.turkSubmitTo = $.getUrlVar('turkSubmitTo') || "";
// This keeps track of the loading icon
JGenerous.working = 0;
// These are the variables that determine how the network is displayed
JGenerous.geometry = { "radius" : 200,
         "startAngle" : 200,
         "endAngle" : 340,
         "boxHeight" : 45,
         "boxWidth" : 45,
         "myBoxHeight" : 109,
         "myBoxWidth" : 109 };

// This is the SVG Canvas element for displaying the graph
JGenerous.drawCanvas = null;
// Keep track of the current round here
JGenerous.lastRound = -1;
// How often the client checks in with the server
JGenerous.updateTime = 1000;
// This variable keeps track of the JavaScript timer
JGenerous.interval;
JGenerous.startingBonus;
JGenerous.currentStatus;
JGenerous.tutorialRelationships = [{id:1, lastDecision:-1, connected: true, change: false}, {id: 2, lastDecision:-1, connected:true, change:false}];
$(document).ready(function(){
  if ($.browser.msie) {
    $("#title").html("Warning!");
    $("#message").html("<p> This game currently does not currently support Microsoft Internet Explorer." +
        " To play, please use any other popular browser (e. g. Firefox, Chrome, or Safari). " +
        "Just copy the following URL to your other browser:</p>" + 
        "<p><div style='word-wrap: break-word;float:left;width:360px;'>" + window.location + "</div></p>");
    $("#navi").html("<div class='navi'></div>");
  } else {
    document.onmousemove = mouseLocation;
    $(window).bind('focus', function() {
      onfocus();
    });
    $(window).bind('blur', function() {
      onblur();
    });
    updateClient();
  }
});

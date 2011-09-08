function tutorial(tutorialStep) {
  JGenerous.previousStatus = 'T';
  // This switch tells the other functions not to send the results to the server
  JGenerous.tutorialMode = true;
  JGenerous.numberOfStep = 9;
  JGenerous.tutorialStepAvailableColor = 6;
  JGenerous.tutorialStep = tutorialStep;
  if (tutorialStep > maxTutorial) {
    maxTutorial = tutorialStep;
  }
  switch(tutorialStep) {
    case 1:
      if (JGenerous.returnData.progress) {
        var step = parseInt(JGenerous.returnData.progress);
        if (step == 1) {
          firstStep();
        } else {
          tutorial(step);
        }
      } else {
        firstStep();
      }
      break;
    case 2:
      progress = 2;
      $("#message").html("<p>In this game, each player is connected to 2 other players&mdash;one " +
      		"on their right and one on their left&mdash;forming one circular social network. Here is what it looks like! </p>");
      $("#navi").html("<div class='navi'><div id='left'/><div id='right'/><div class='begin'>Click to continue</div><div class='steps'>" 
          + (JGenerous.tutorialStep - 1) + "/" + JGenerous.numberOfStep + "</div></div>");
      $("body").append('<div class="welcome" id="status"></div>');
      draw2();
      $('#right').click(function(){
        if (JGenerous.drawCanvas) JGenerous.drawCanvas.clear();
        $("#status").remove();
        $('#right').css("visibility", "hidden");
        $('#left').css("visibility", "hidden");
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Next", 1);
        JGenerous.tutorialStep++;
        tutorial(JGenerous.tutorialStep);
      });
      $('#left').click(function(){
        if (JGenerous.drawCanvas) JGenerous.drawCanvas.clear();
        $("#status").remove();
        $('#right').css("visibility", "hidden");
        $('#left').css("visibility", "hidden");
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Back", 1);
        JGenerous.tutorialStep--;
        firstStep();
      });
      break;
    case 3:
      progress = 3;
      $("#message").html("<p>Even though you are a part of a bigger network, you are only able to see your immediate neighbors. </p>");
      $("#navi").html("<div class='navi'><div id='left'/><div id='right'/><div class='steps'>" 
          + (JGenerous.tutorialStep - 1) + "/" + JGenerous.numberOfStep + "</div></div>");
      $("body").append('<div class="welcome1" id="status"></div>');
      $('#right').click(function(){
        if (JGenerous.drawCanvas) JGenerous.drawCanvas.clear();
        $("#status").remove();
        $('#right').css("visibility", "hidden");
        $('#left').css("visibility", "hidden");
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Next", 1);
        JGenerous.tutorialStep++;
        tutorial(JGenerous.tutorialStep);
      });
      $('#left').click(function(){
        if (JGenerous.drawCanvas) JGenerous.drawCanvas.clear();
        $("#status").remove();
        $('#right').css("visibility", "hidden");
        $('#left').css("visibility", "hidden");
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Back", 1);
        JGenerous.tutorialStep--;
        tutorial(JGenerous.tutorialStep);
      });
      break;
    case 4:
      progress = 4;
      $("#message").html("<p>Therefore, your game view looks like this. </p>");
      $("#navi").html("<div class='navi'><div id='left'/><div id='right'/><div class='steps'>" 
          + (JGenerous.tutorialStep - 1) + "/" + JGenerous.numberOfStep + "</div></div>");
      $("body").append('<div class="welcome2" id="status"></div>');
      $('#right').click(function(){
        if (JGenerous.drawCanvas) JGenerous.drawCanvas.clear();
        $("#status").remove();
        $('#right').css("visibility", "hidden");
        $('#left').css("visibility", "hidden");
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Next", 1);
        JGenerous.tutorialStep++;
        tutorial(JGenerous.tutorialStep);
      });
      $('#left').click(function(){
        if (JGenerous.drawCanvas) JGenerous.drawCanvas.clear();
        $("#status").remove();
        $('#right').css("visibility", "hidden");
        $('#left').css("visibility", "hidden");
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Back", 1);
        JGenerous.tutorialStep--;
        tutorial(JGenerous.tutorialStep);
      });
      break;
    case 5:
      progress = 5;
      JGenerous.returnData.relationships = [{id:1, lastDecision:-1, connected: true, change: false}, {id: 2, lastDecision:-1, connected:true, change:false}];
      plotClient();
      draw5();
      $("#message").html("<p>Each player starts out with a colorless ring and an initial balance of <b>" + JGenerous.returnData.seedMoney + "</b> tokens. </p>");
      $("#navi").html("<div class='navi'><div id='left'/><div id='right'/><div class='steps'>" + (JGenerous.tutorialStep - 1) + "/" + JGenerous.numberOfStep + "</div></div>");
      $('#right').click(function(){
        if (JGenerous.drawCanvas) JGenerous.drawCanvas.clear();
        $("#status").remove();
        $('#right').css("visibility", "hidden");
        $('#left').css("visibility", "hidden");
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Next", 1);
        JGenerous.tutorialStep++;
        tutorial(JGenerous.tutorialStep);
      });
      $('#left').click(function(){
        if (JGenerous.drawCanvas) JGenerous.drawCanvas.clear();
        $("#status").remove();
        $('#right').css("visibility", "hidden");
        $('#left').css("visibility", "hidden");
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Back", 1);
        JGenerous.tutorialStep--;
        tutorial(JGenerous.tutorialStep);
      });
      break;
    case 6:
      progress = 6;
      JGenerous.returnData.relationships = [{id:1, lastDecision:-1, connected: true, change: false}, {id: 2, lastDecision:-1, connected:true, change:false}];
      plotClient();
      $("#message").html("You must then choose whether to color your ring orange or blue:  " 
          + "<div style='text-align:center'><p>An <span class='orange'>orange ring</span> costs <b>" + JGenerous.returnData.coc 
          + "</b> tokens</p><p>A <span class='blue'>blue ring</span> costs <b>0</b> tokens</p></div>");
      cooperationStep3();
      $("#navi").html("<div class='navi'><div id='left'/><div id='right'/><div class='steps'>" + (JGenerous.tutorialStep - 1) + "/" + JGenerous.numberOfStep + "</div></div>");
      $('#right').click(function(){
        $('#right').css("visibility", "hidden");
        $('#left').css("visibility", "hidden");
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Next", 1);
        JGenerous.tutorialStep++;
        tutorial(JGenerous.tutorialStep);
      });
      $('#left').click(function(){
        $('#right').css("visibility", "hidden");
        $('#left').css("visibility", "hidden");
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Back", 1);
        JGenerous.tutorialStep--;
        tutorial(JGenerous.tutorialStep);
      });
      break;
    case 7:
      progress = 7;
      JGenerous.tutorialRelationships = [{id:1, lastDecision:-1, connected: true, change: false}, {id: 2, lastDecision:-1, connected:true, change:false}];
      JGenerous.startingBonus = JGenerous.returnData.bonus;
      plotClient(JGenerous.tutorialRelationships, -1);
      $("#message").html("After your neighbors choose a color, their selection becomes visible to you and your selection becomes visible to them. Now the rings pay off!  "
          + "<div style='text-align:center'><p>Each <span class='orange'>orange ring</span> gives <b>" + JGenerous.returnData.payOff 
          + "</b> tokens to its owner as well as his or her neighbors</p>" +
            "<p>Each <span class='blue'>blue ring</span> gives <b>0</b> tokens to its owner as well as his or her neighbors</p></div>");
      cooperationStep4();
      $("#navi").html("<div class='navi'><div id='left'/><div id='right' style='display:none'/><div class='steps'>" 
          + (JGenerous.tutorialStep - 1) + "/" + JGenerous.numberOfStep 
          + "</div><div id='begin' class='begin'>See below!</div></div>");
      $('#right').click(function(){
        $('#right').css("visibility", "hidden");
        $('#left').css("visibility", "hidden");
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Next", 1);
        $('#help').remove();
        JGenerous.tutorialStep++;
        tutorial(JGenerous.tutorialStep);
      });
      $('#left').click(function(){
        $('#right').css("visibility", "hidden");
        $('#left').css("visibility", "hidden");
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Back", 1);
        $('#help').remove();
        JGenerous.tutorialStep--;
        tutorial(JGenerous.tutorialStep);
      });
      break;
    case 8:
      progress = 8;
      $("#message").html("<p>In the next round, each player chooses a new color.  </p>" +
      		" <p>Now let's try choosing the <span class='blue'>blue ring</span>.</p>");
      if (JGenerous.startingBonus == undefined) {
        JGenerous.startingBonus = JGenerous.returnData.bonus;
      }
      plotClient(JGenerous.tutorialRelationships, 1);
      cooperationStep5();
      $("#navi").html("<div class='navi'><div id='left'/><div id='right' style='display:none'/><div class='steps'>" + (JGenerous.tutorialStep - 1) + "/" + JGenerous.numberOfStep + "</div></div>");
      $('#right').click(function(){
        $('#right').css("visibility", "hidden");
        $('#left').css("visibility", "hidden");
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Next", 1);
        $('#help').remove();
        JGenerous.tutorialStep++;
        tutorial(JGenerous.tutorialStep);
      });
      $('#left').click(function(){
        $('#right').css("visibility", "hidden");
        $('#left').css("visibility", "hidden");
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Back", 1);
        $('#help').remove();
        JGenerous.tutorialStep--;
        tutorial(JGenerous.tutorialStep);
      });
      break;
    case 9:
    // Track how many practice rounds we've done
      progress = 9;
      JGenerous.practiceRounds = 1;
      JGenerous.tutorialRelationships = [{id:1, lastDecision:-1, connected: true, change: false}, {id: 2, lastDecision:-1, connected:true, change:false}];
      $("#message").html("Great! Now let's play 3 quick practice rounds with simulated opponents. The outcome of the practice rounds won't affect your actual earnings.");
      JGenerous.startingBonus = JGenerous.returnData.bonus;
      JGenerous.returnData.lastMove = -1;
      plotClient(JGenerous.tutorialRelationships, -1);
      cooperationStep6();
      $("#navi").html("<div class='navi'><div id='left'/><div id='right' style='display:none'/><div class='steps'>" + (JGenerous.tutorialStep - 1) + "/" + JGenerous.numberOfStep + "</div></div>");
      $('#right').click(function(){
        $('#right').css("visibility", "hidden");
        $('#left').css("visibility", "hidden");
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Next", 1);
        $("#help").remove();
        JGenerous.tutorialStep++;
        tutorial(JGenerous.tutorialStep);
      });
      $('#left').click(function(){
        $('#right').css("visibility", "hidden");
        $('#left').css("visibility", "hidden");
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Back", 1);
        $("#help").remove();
        JGenerous.tutorialStep--;
        tutorial(JGenerous.tutorialStep);
      });
      preloadImages();
      break;
    case 10:
      progress = 10;
      JGenerous.returnData.relationships = [{id:1, lastDecision:-1, connected: true, change: false}, {id: 2, lastDecision:-1, connected:true, change:false}];
      $("#message").html("<p>Congratulations! You've completed the tutorial and are now ready for action.</p>"
          + "<p>The game features " + (JGenerous.returnData.eli == "Yes" ? "three" : "two") 
          + " separate parts that together will take you about <b>10&mdash;15</b> minutes to complete.</p>"
          + "<p style='font-style:italic;'>If you do not have enough time available to complete the game, please close your browser now. </p>"
          + "<p>You will need to finish all " + (JGenerous.returnData.eli == "Yes" ? "three" : "two") 
          + " phases of the game to receive your completion bonus at a rate of <b>"
          + (JGenerous.returnData.exchangeRate * 100) 
          + "</b> cents per each token earned during the game. Don't worry&mdash;we will deposit it directly into your MTurk Account.</p>"
          + "<p>Good luck!</p>");
      JGenerous.startingBonus = JGenerous.returnData.bonus;
      JGenerous.returnData.lastMove = -1;
      if (JGenerous.drawCanvas != null) {
        if (JGenerous.drawCanvas) JGenerous.drawCanvas.clear();
      }
      $("#navi").html("<div class='navi'><div id='left'/><div class='begin'><button id='begin'>Let's start!</button></div><div class='steps'>" + (JGenerous.tutorialStep - 1) + "/" + JGenerous.numberOfStep + "</div></div>");
      $('#begin').click(function(){
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Let's start", 1);
        $('#left').css("visibility", "hidden");
        $('#begin').attr("disabled", true);
        if (JGenerous.returnData.eli != "Yes") {
          JGenerous.eliMemoryMinus1 = [];
          JGenerous.eliFirstMove = undefined;
          JGenerous.drawCanvas && JGenerous.drawCanvas.clear();
        }
        doTutorial();
        if (!JGenerous.returnData.doneElicitation && JGenerous.returnData.eli == "Yes") {
          tutorial(11);
        } else {
          intro();
        }
      });
      $('#left').click(function(){
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Back", 1);
        $('#begin').attr("disabled", true);
        $('#left').css("visibility", "hidden");
        JGenerous.tutorialStep--;
        tutorial(JGenerous.tutorialStep);
      });
      preloadImages();
      break;
    case 11:
      JGenerous.eliMemoryMinus1 = [];
      JGenerous.eliFirstMove = undefined;
      if (JGenerous.returnData.progress) {
        var step = parseInt(JGenerous.returnData.progress);
        if (step > 11) {
          tutorial(step);
          return;
        }
      }
      progress = 11;
      updateClient();
      $("#message").html("<p>In this part, you will program your own coloring robot! Excited?</p>"
          + "<p>Let's first give him a name:</p>" +
          	"<p><input type='text' id='robotName' style='width:275px;' value='Robo' maxlength='12'" +
          	"onfocus='if (this.value==\"Robo\") this.value=\"\";' onblur='if (this.value.trim() == \"\") this.value=\"Robo\"'/> <button id='submit' style='width: 75px;'>Submit</button>" +
          	"<span id='error' style='color:red;display:none;'>Robot name must not be empty and contain alphabet and numberic characters only.</span></p>");
      $("#title").html("Part 1: Robot");
      $("#navi").html("<div class='navi'></div>");
      $("body").append('<div id="status" class="robot_hi"><img id="robotName" src="images/robo_hi_small.jpg" width="280"/></div>');
      $('#submit').click(function(){
        name = $("#robotName").val();
        if (name.match(/^[\w\d]+$/)) {
          sendRobotName($("#robotName").val());
        } else {
          $("#error").show();
        }
      });
      
      preloadImages();
      break;
    case 12:
      $("body").append('<div id="status" class="robot_name">' + showBubble("myNameRobo", "myNameRobo")
          + '<img id="robotName" src="images/robo_hi_small.jpg" width="280"/></div>');
      $("#myNameRobo_content").html('<p style="font-size: 18px; text-align: center; font-weight: bold;line-height: 28px;">Hiya!<br/>'
          + 'My name is ' + (JGenerous.returnData.robotName || name || 'Robo') + '. </p>'
          + "<button id='elibegin' style='margin-top: 2px; margin-left: 215px;'>Cool!</button></div>");
      $(".container").parent().parent().hide();
      $('#elibegin').click(function(){
        track("Elicitation", "Cool!", 2, (JGenerous.tutorialStep - 10));
        $('#elibegin').attr("disabled", true);
        $(".container").parent().parent().show();
        $("#status").remove();
        progress = 13;
        JGenerous.tutorialStep++;
        tutorial(JGenerous.tutorialStep);
      });
      preloadImages();
      break;
    case 13:
      $(".container").parent().parent().show();
      $("#title").html("Make " + (JGenerous.returnData.robotName || name || 'Robo') + " Work for You");
      $("#message").html("<p>You will now teach " + (JGenerous.returnData.robotName || name || 'Robo') 
          + " how to play The Coloring Game that you just learned in the tutorial. </p>"
          + "<p>Then " + (JGenerous.returnData.robotName || name || 'Robo') 
          + " will play a series of rounds with the robots of other players entirely on his own!  </p>"
          + "<p>After each round, there will be a <b>" 
          + (100 - JGenerous.returnData.poe * 100) 
        + "%</b> chance that the game continues to the next round, and a <b>" 
        + (JGenerous.returnData.poe * 100) 
        + "%</b> chance that it ends.</p>"
        + "<p>And what's in it for you? " + (JGenerous.returnData.robotName || name || 'Robo') 
        + "'s final earnings will become yours!</p> ");
      $("#navi").html("<div class='navi'><div class='begin'><button id='elibegin'>Great!</button></div></div>");
      $("body").append('<div id="status" class="robot_contest">' + showBubble('iamready', 'iamready') + '</div>');
      $('#iamready_content').html('<p style="font-size: 18px; text-align: center; font-weight: bold;">I am ready!</p>');
      $('#elibegin').click(function(){
        $('#elibegin').attr("disabled", true);
        track("Elicitation", "Great!", 2, (JGenerous.tutorialStep - 10));
        $(".container").parent().parent().show();
        $("#status").remove();
        progress = 14;
        JGenerous.tutorialStep++;
        tutorial(JGenerous.tutorialStep);
      });
      preloadImages();
      break;
    case 14:
      $(".container").parent().parent().hide();
      showEli();
      $("#question_content").html("I can't wait to start playing! But I need you to teach how to play effectively. Which color would you like me to pick for my first round?");
      $("#eli_title").html("Beginning");
      $("#answer_content").html("Got it!");
      var numNeighbors = 2;
      var geometry = JGenerous.geometry;
      geometry.angleStep = (geometry.endAngle - geometry.startAngle) / (numNeighbors - 1);
      var relationships = [{id:1, lastDecision:-1, connected: true, change: false}, 
      {id: 2, lastDecision:-1, connected:true, change:false}];
      JGenerous.returnData.lastMove = -1;
      plotElicitation(geometry, relationships, numNeighbors, -1, true);
      break;
    case 15:
      $(".container").parent().parent().hide();
      showEli();
      $("#question_content").html("OK, Great. Now I just need to learn how to react to the most recent round. That way I’ll know what to do at any point in the game. Since every round can only end in 8 possible ways, let’s just go over them one-by-one. What would you like me to do if you and your neighbors chose this way during the previous round?");
      $("#question").width(400);
      $("#answer_content").html("Sure!");
      var eli = 22 - JGenerous.tutorialStep;
      $("#eli_title").html("Case " + (8 - eli));
      var numNeighbors = 2;
      var geometry = JGenerous.geometry;
      var rightDecision = eli % 2;
      var leftDecision = (eli >>> 2) % 2;
      var selfDecision = (eli >>> 1) % 2;
      relationships = [{id:1, lastDecision:leftDecision, connected: true, change: false}, {id: 2, lastDecision:rightDecision, connected:true, change:false}];
      plotElicitation(geometry, relationships, numNeighbors, selfDecision, false, eli);
      break;
    case 16:
      $(".container").parent().parent().hide();
      showEli();
      $("#question_content").html("Now let's pretend that the previous round went this way. What do you think I should do?");
      var eli = 22 - JGenerous.tutorialStep;
      $("#eli_title").html("Case " + (8 - eli));
      $("#answer_content").html("Understood!");
      var numNeighbors = 2;
      var geometry = JGenerous.geometry;
      geometry.angleStep = (geometry.endAngle - geometry.startAngle) / (numNeighbors - 1);
      geometry.radius = 145;
      var rightDecision = eli % 2;
      var leftDecision = (eli >>> 2) % 2;
      var selfDecision = (eli >>> 1) % 2;
      relationships = [{id:1, lastDecision:leftDecision, connected: true, change: false}, {id: 2, lastDecision:rightDecision, connected:true, change:false}];
      plotElicitation(geometry, relationships, numNeighbors, selfDecision, false, eli);
      break;
    case 17:
      $(".container").parent().parent().hide();
      showEli();
      $("#question_content").html("OK, Great. Now I know how you want me to behave. Let's pretend you picked blue in the previous round and the other players both picked orange. Now what should I do in this case? ");
      $("#answer_content").html("Ok!");
      var eli = 22 - JGenerous.tutorialStep;
      $("#eli_title").html("Case " + (8 - eli));
      var numNeighbors = 2;
      var geometry = JGenerous.geometry;
      geometry.angleStep = (geometry.endAngle - geometry.startAngle) / (numNeighbors - 1);
      geometry.radius = 145;
      var rightDecision = eli % 2;
      var leftDecision = (eli >>> 2) % 2;
      var selfDecision = (eli >>> 1) % 2;
      relationships = [{id:1, lastDecision:leftDecision, connected: true, change: false}, {id: 2, lastDecision:rightDecision, connected:true, change:false}];
      plotElicitation(geometry, relationships, numNeighbors, selfDecision, false, eli);
      break;
    case 18:
      $(".container").parent().parent().hide();
      showEli();
      $("#question_content").html("What should I do if the previous round looks like this?");
      $("#answer_content").html("Got it!");
      var eli = 22 - JGenerous.tutorialStep;
      $("#eli_title").html("Case " + (8 - eli));
      var numNeighbors = 2;
      var geometry = JGenerous.geometry;
      geometry.angleStep = (geometry.endAngle - geometry.startAngle) / (numNeighbors - 1);
      geometry.radius = 145;
      var rightDecision = eli % 2;
      var leftDecision = (eli >>> 2) % 2;
      var selfDecision = (eli >>> 1) % 2;
      relationships = [{id:1, lastDecision:leftDecision, connected: true, change: false}, {id: 2, lastDecision:rightDecision, connected:true, change:false}];
      plotElicitation(geometry, relationships, numNeighbors, selfDecision, false, eli);
      break;
    case 19:
      $(".container").parent().parent().hide();
      showEli();
      $("#question_content").html("We're almost finished! Once you tell me how to act in these last few possible outcomes for the previous round, I'll know everything you want me to do!");
      $("#answer_content").html("As you wish!");
      var eli = 22 - JGenerous.tutorialStep;
      $("#eli_title").html("Case " + (8 - eli));
      var numNeighbors = 2;
      var geometry = JGenerous.geometry;
      geometry.angleStep = (geometry.endAngle - geometry.startAngle) / (numNeighbors - 1);
      geometry.radius = 145;
      var rightDecision = eli % 2;
      var leftDecision = (eli >>> 2) % 2;
      var selfDecision = (eli >>> 1) % 2;
      relationships = [{id:1, lastDecision:leftDecision, connected: true, change: false}, {id: 2, lastDecision:rightDecision, connected:true, change:false}];
      plotElicitation(geometry, relationships, numNeighbors, selfDecision, false, eli);
      break;
    case 20:
      $(".container").parent().parent().hide();
      showEli();
      $("#question_content").html("What should I do if the previous round goes this way?");
      $("#answer_content").html("Agreed!");
      var eli = 22 - JGenerous.tutorialStep;
      $("#eli_title").html("Case " + (8 - eli));
      var numNeighbors = 2;
      var geometry = JGenerous.geometry;
      geometry.angleStep = (geometry.endAngle - geometry.startAngle) / (numNeighbors - 1);
      geometry.radius = 145;
      var rightDecision = eli % 2;
      var leftDecision = (eli >>> 2) % 2;
      var selfDecision = (eli >>> 1) % 2;
      relationships = [{id:1, lastDecision:leftDecision, connected: true, change: false}, {id: 2, lastDecision:rightDecision, connected:true, change:false}];
      plotElicitation(geometry, relationships, numNeighbors, selfDecision, false, eli);
      break;
    case 21:
      $(".container").parent().parent().hide();
      showEli();
      $("#question_content").html("What should I do if the previous round ends like this?");
      $("#answer_content").html("Will do!");
      var eli = 22 - JGenerous.tutorialStep;
      $("#eli_title").html("Case " + (8 - eli));
      var numNeighbors = 2;
      var geometry = JGenerous.geometry;
      geometry.angleStep = (geometry.endAngle - geometry.startAngle) / (numNeighbors - 1);
      geometry.radius = 145;
      var rightDecision = eli % 2;
      var leftDecision = (eli >>> 2) % 2;
      var selfDecision = (eli >>> 1) % 2;
      relationships = [{id:1, lastDecision:leftDecision, connected: true, change: false}, {id: 2, lastDecision:rightDecision, connected:true, change:false}];
      plotElicitation(geometry, relationships, numNeighbors, selfDecision, false, eli);
      break;
    case 22:
      $(".container").parent().parent().hide();
      showEli();
      $("#question_content").html("Last One! How would you like me to react if the previous turn turns out like this?");
      $("#answer_content").html("No problem!");
      var eli = 22 - JGenerous.tutorialStep;
      $("#eli_title").html("Case " + (8 - eli));
      var numNeighbors = 2;
      var geometry = JGenerous.geometry;
      geometry.angleStep = (geometry.endAngle - geometry.startAngle) / (numNeighbors - 1);
      geometry.radius = 145;
      var rightDecision = eli % 2;
      var leftDecision = (eli >>> 2) % 2;
      var selfDecision = (eli >>> 1) % 2;
      relationships = [{id:1, lastDecision:leftDecision, connected: true, change: false}, {id: 2, lastDecision:rightDecision, connected:true, change:false}];
      plotElicitation(geometry, relationships, numNeighbors, selfDecision, false, eli);
      break;
    case 23:
      // make the elicitation navigator unclickable
      var temp = $("#eli_navi").html();
      $("#status").remove();
      $("body").append("<div style='margin: 10px auto 0pt; width: 800px; position: relative;'><div id='status' class='robot_name'>" + showBubble("enlighted", "enlighted") 
          + "<img id='robotName' src='images/robo_zen_small.jpg'/></div></div>");
      $("#status").append("<div id='eli_navi'>" + temp + "</div>");
      for (var i = 1; i <= 9; i++ ) {
        $("#cell" + i).css("cursor", "");
      }
      $("#enlighted_content").html("<p style='font-size: 14px; text-align: center; font-weight: bold; padding-top: 10px; line-height: 28px;'>Wow, I feel totally enlightened now!<br/>" 
          + "And ready to play.</p>"
          + "<button id='endeli' style='margin-top: 2px; margin-left: 200px;'>Good luck!</button>");
      $("#back").css("visibility", "hidden");
      $("#next").hide();
      $(".container").parent().parent().hide();
      $('#endeli').click(function(){
        $('#endeli').attr("disabled", true);
        $("#status").remove();
        track("Elicitation", "Good luck!", 2, (JGenerous.tutorialStep - 10));
        doElicitation();
      });
      break;
  }
}
function tutorialRevise(tutorialStep) {
  if (tutorialStep > maxTutorial) {
    return;
  }
  if (JGenerous.tutorialStep == 23) { // don't allow to revise at last screen of elicitation
    return;
  }
  JGenerous.tutorialStep = tutorialStep;
  if (tutorialStep > maxTutorial) {
    maxTutorial = tutorialStep;
  }
  showEli();
  $("#question_content").html("Want me to pick a different color?");
  $("#question").width(270);
  $("#question").attr("class", "question alter");
  $("#question").show();
  $("#answer").hide();
  $(".orangeBox").show();
  $(".blueBox").show();
  $("#next").attr("class", "next");
  
  var eli = 22 - JGenerous.tutorialStep;
  switch(tutorialStep) {
  case 14:
    $("#eli_title").html("Beginning");
    if (JGenerous.eliFirstMove == 1) {
      $("#light").html("<img src='images/orange_ring_big_shadow.png'/>");
    } else {
      $("#light").html("<img src='images/blue_ring_big_shadow.png'/>");
    }
    var numNeighbors = 2;
    var geometry = JGenerous.geometry;
    geometry.angleStep = (geometry.endAngle - geometry.startAngle) / (numNeighbors - 1);
    var relationships = [{id:1, lastDecision:-1, connected: true, change: false}, 
                         {id: 2, lastDecision:-1, connected:true, change:false}];
    JGenerous.returnData.lastMove = -1;
    plotElicitation(geometry, relationships, numNeighbors, -1, true);
    break;
  case 15:
  case 16:
  case 17:
  case 18:
  case 19:
  case 20:
  case 21:
  case 22:
    if (JGenerous.eliMemoryMinus1[8 - eli - 1] == 1) {
      $("#light").html("<img src='images/orange_ring_big_shadow.png'/>");
    } else {
      $("#light").html("<img src='images/blue_ring_big_shadow.png'/>");
    }
    $("#eli_title").html("Case " + (8 - eli));
    var eli = 22 - JGenerous.tutorialStep;
    var numNeighbors = 2;
    var geometry = JGenerous.geometry;
    var rightDecision = eli % 2;
    var leftDecision = (eli >>> 2) % 2;
    var selfDecision = (eli >>> 1) % 2;
    relationships = [{id:1, lastDecision:leftDecision, connected: true, change: false}, {id: 2, lastDecision:rightDecision, connected:true, change:false}];
    plotElicitation(geometry, relationships, numNeighbors, selfDecision, false, eli);
    break;
  }
  $("#light").show();
  switch(tutorialStep) {
  case 15:
    $("#answer_content").html("Sure!");
    break;
  case 16:
    $("#answer_content").html("Understood!");
    break;
  case 17:
    $("#answer_content").html("Ok!");
    break;
  case 18:
    $("#answer_content").html("Got it!");
    break;
  case 19:
    $("#answer_content").html("As you wish!");
    break;
  case 20:
    $("#answer_content").html("Agreed!");
    break;
  case 21:
    $("#answer_content").html("Will do!");
    break;
  case 22:
    $("#answer_content").html("No problem!");
    break;
  }
}
function plotElicitation(geometry, relationships, numNeighbors, selfDecision, firstMove, eli) {
  geometry.drawWidth = 400;
  geometry.drawHeight = 500;
  geometry.myBoxHeight = 89
  geometry.myBoxWidth = 89; 
  geometry.radius = 145;
  $("#eli_draw").html("");
  var drawCanvas = Raphael(document.getElementById("eli_draw"), geometry.drawWidth, geometry.drawHeight);
  var player = {};
  player.cX = 170;
  player.cY = 390;

  // Array of neighbors
  neighbors = new Array();
  
  // Store neighbor array
  for (var i=0; i<numNeighbors; i++) {
    // Create a new object
    neighbors[i] = {};
    // Store whether we're currently connected to this player
    neighbors[i].connected = relationships[i].connected;
    // Store the players last decision:  0: do not cooperate, 1: cooperate, 2: don't know
    neighbors[i].cooperating = relationships[i].lastDecision;
    // Are we making a decision this round to make/break this relationship?
    neighbors[i].change = relationships[i].change;
    // Was this connection rewired recently?
    neighbors[i].rewired = relationships[i].rewired;
    // current angle at which to display the player
    var angle = parseInt(geometry.startAngle + (i * geometry.angleStep));
    // the coordinates of the center of the square
    var coords = getCoordinates(player.cX, player.cY, geometry.radius, angle);
    neighbors[i].cX = coords.x;
    neighbors[i].cY = coords.y;
  }

  // Draw lines
  for (i=0; i < neighbors.length; i++) {
    var pathString = "";
    pathString += "M" + player.cX + " " + player.cY;
    pathString += "L" + neighbors[i].cX + " " + neighbors[i].cY;
    neighbors[i].pathShadow = drawCanvas.path(pathString);
    neighbors[i].pathShadow.attr({"stroke" : "#000000", "stroke-width" : "4", "translation" : "1,1", "opacity" : ".5"});
    neighbors[i].pathLine = drawCanvas.path(pathString);
    neighbors[i].pathLine.attr({stroke: "#acb9c2", "stroke-width": "4"});
    neighbors[i].path = drawCanvas.set();
    neighbors[i].path.push(neighbors[i].pathLine, neighbors[i].pathShadow);

    if (!neighbors[i].connected)
    {
      neighbors[i].path.hide();
    }
  }

  // Draw nodes
  for (i=0; i < neighbors.length; i++) {
    // calculate the top left corner of the node
    var nodeTop = neighbors[i].cY - parseInt(.5 * geometry.boxHeight);
    var nodeLeft = neighbors[i].cX - parseInt(.5 * geometry.boxWidth);

    neighbors[i].node = drawCanvas.image(appURL + "/images/grey.png", nodeLeft, nodeTop, geometry.boxWidth, geometry.boxHeight);
      switch (neighbors[i].cooperating) {
        case 0: // not cooperating
          neighbors[i].node = drawCanvas.image(appURL + "/images/blue_ring_shadow.png", nodeLeft, nodeTop, geometry.boxWidth, geometry.boxHeight);
          break;
        case 1: // cooperating
          neighbors[i].node = drawCanvas.image(appURL + "/images/orange_ring_shadow.png", nodeLeft, nodeTop, geometry.boxWidth, geometry.boxHeight);
          break;
        default: // don't know if we're cooperating or not
          neighbors[i].node = drawCanvas.image(appURL + "/images/gray_ring_shadow.png", nodeLeft, nodeTop, geometry.boxWidth, geometry.boxHeight);
          break;
      }
  }
  
  // Add player node
  nodeTop = player.cY - parseInt(.5 * geometry.myBoxHeight);
  nodeLeft = player.cX - parseInt(.5 * geometry.myBoxWidth);
  player.node = drawCanvas.image(appURL + "/images/grey_big.png", nodeLeft, nodeTop, geometry.myBoxWidth, geometry.myBoxHeight);
  switch (selfDecision)  {
    case 0: // not cooperating
      player.node = drawCanvas.image(appURL + "/images/blue_ring_big_shadow.png", nodeLeft, nodeTop, geometry.myBoxWidth, geometry.myBoxHeight);
      break;
    case 1: // cooperating
      player.node = drawCanvas.image(appURL + "/images/orange_ring_big_shadow.png", nodeLeft, nodeTop, geometry.myBoxWidth, geometry.myBoxHeight);
      break;
    default: // don't know if we're cooperating or not
      player.node = drawCanvas.image(appURL + "/images/gray_ring_big_shadow.png", nodeLeft, nodeTop, geometry.myBoxWidth, geometry.myBoxHeight);
      break;
  }
  
  //Dim out nodes to show they were last round's moves
  player.node.attr({opacity : ".7"});
  for (i = 0; i < neighbors.length; i++)
  {
    if (neighbors[i].node !== undefined)
      neighbors[i].node.attr({opacity : ".7"});
  }
}

function checkEliClickCount() {
  JGenerous.eliClickCount--;
  if (JGenerous.eliClickCount == 0) {
    $('#begin').removeAttr("disabled");
  }
}
function sendRobotName(name) {
  $.ajax({
    type: "POST",
    url: appURL + "/server",
    data: "serverid=" + JGenerous.serverId + "&clientid=" + JGenerous.clientId + "&action=RobotName&name=" + encodeURIComponent(name),
    success: function() {
      $("#error").hide();
      $('#submit').attr("disabled", true);
      track("Elicitation", "Submit robot name", 2, (JGenerous.tutorialStep - 10));
      name = escapeHTML($("#robotName").val());
      $("#status").remove();
      progress = 12;
      JGenerous.tutorialStep++;
      tutorial(JGenerous.tutorialStep);
    },
    error: function() {
      $("#error").show();
    }
  });
}
function doTutorial() {
  $.ajax({
    type: "POST",
    url: appURL + "/server",
    data: "serverid=" + JGenerous.serverId + "&clientid=" + JGenerous.clientId + "&action=DoTutorial",
    success: function(returnData) {
      JGenerous.returnData = returnData;
      if (JGenerous.returnData.eli != "Yes") {
        JGenerous.startingBonus = JGenerous.returnData.bonus;
        JGenerous.tutorialMode = false;
        JGenerous.drawCanvas = null;
        $("#draw").html("");
      }
    }
  });
}
function doElicitation() {
  var rule = 0;
  for (var i = 0; i < 8; i++) {
    if (JGenerous.eliMemoryMinus1[i] == 1) {
      rule += 1 << i; 
    }
  }
  $.ajax({
    type: "POST",
    url: appURL + "/server",
    data: "serverid=" + JGenerous.serverId + "&clientid=" + JGenerous.clientId + "&action=DoElicitation&rule=" + rule + "&firstmove=" + JGenerous.eliFirstMove,
    success: function(returnData){
      JGenerous.returnData = returnData;
      JGenerous.startingBonus = JGenerous.returnData.bonus;
      JGenerous.tutorialMode = false;
      JGenerous.drawCanvas = null;
      $("#draw").html("");
      intro();
    }
  });
}

arrow = function (canvas, x1, y1, x2, y2, size, color) {
  var angle = Math.atan2(x1-x2,y2-y1);
  angle = (angle / (2 * Math.PI)) * 360;
  var arrowPath = canvas.path("M" + x2 + " " + y2 + " L" + (x2 - size) + " " + (y2 - size / 2) + " L" + (x2 - size) + " " + (y2 + size / 2) + " L" + x2 + " " + y2 ).attr("fill",color).rotate((90+angle),x2,y2);
  arrowPath.attr({fill: color, stroke: color});
  var linePath = canvas.path("M" + x1 + " " + y1 + " L" + x2 + " " + y2);
  linePath.attr({fill: color, stroke: color});
  return [linePath,arrowPath];
}

function plotClient(relationships, lastMove) {
  !relationships && (relationships = JGenerous.returnData.relationships);
  (lastMove == undefined) && (lastMove = JGenerous.returnData.lastMove);
  
  // one box per neighbor (either current or potential)
  JGenerous.numNeighbors = relationships.length;

  // Create a player object
  JGenerous.player = {};

  // Calculate the angle between each box
  if (JGenerous.numNeighbors < 2) {
    JGenerous.geometry.angleStep = 0;
  } else {
    JGenerous.geometry.angleStep = (JGenerous.geometry.endAngle - JGenerous.geometry.startAngle) / (JGenerous.numNeighbors- 1);
  }

  // if the end and start angles are the same we need to change the formula slightly
  if ( (JGenerous.geometry.startAngle == 0 && JGenerous.geometry.endAngle == 360) || (JGenerous.geometry.startAngle == 360 && JGenerous.geometry.endAngle == 0 ) )
    JGenerous.geometry.angleStep = (JGenerous.geometry.endAngle - JGenerous.geometry.startAngle) / JGenerous.numNeighbors;

  // calculate the width of the draw area
  JGenerous.geometry.drawWidth = (JGenerous.geometry.radius + JGenerous.geometry.boxWidth) * 2;

  // Calculate if we are using half the draw box or the entire draw box
  if ( (JGenerous.geometry.startAngle >= 180 && JGenerous.geometry.endAngle >= 180) || (JGenerous.geometry.startAngle <= 180 && JGenerous.geometry.endAngle <= 180) ) {
    JGenerous.geometry.drawHeight = JGenerous.geometry.radius + (JGenerous.geometry.boxHeight * 2) + 100;
    if (JGenerous.geometry.startAngle >= 180 && JGenerous.geometry.endAngle >= 180) {
      JGenerous.player.cY = JGenerous.geometry.radius * 4 / 5;
    } else {
      JGenerous.player.cY = JGenerous.geometry.boxHeight;
    }
  }  else {
    JGenerous.geometry.drawHeight = ((JGenerous.geometry.radius + JGenerous.geometry.boxHeight) * 2) + 100;
    JGenerous.player.cY = JGenerous.geometry.drawHeight/2;
  }

  JGenerous.player.cX = JGenerous.geometry.drawWidth/2;

  $("#draw").width(JGenerous.geometry.drawWidth);
  $("#draw").height(JGenerous.geometry.drawHeight);

  // clear and resize the current draw frame
  if (JGenerous.drawCanvas === null) {
    JGenerous.drawCanvas = Raphael(document.getElementById('draw'), JGenerous.geometry.drawWidth, JGenerous.geometry.drawHeight);
  } else {
    JGenerous.drawCanvas.clear();
  }

  // Array of neighbors
  JGenerous.neighbors = new Array();

  if (JGenerous.numNeighbors > 0)
  {
    // Store neighbor array
    for (var i=0; i<JGenerous.numNeighbors; i++)
    {
      // Create a new object
      JGenerous.neighbors[i] = {};

      // Store whether we're currently connected to this player
      JGenerous.neighbors[i].connected = relationships[i].connected;

      // Store the players last decision:  0: do not cooperate, 1: cooperate, 2: don't know
      JGenerous.neighbors[i].cooperating = relationships[i].lastDecision;

      // Are we making a decision this round to make/break this relationship?
      JGenerous.neighbors[i].change = relationships[i].change;

      // Was this connection rewired recently?
      JGenerous.neighbors[i].rewired = relationships[i].rewired;

      // current angle at which to display the player
      var angle = parseInt(JGenerous.geometry.startAngle + (i * JGenerous.geometry.angleStep));

      // the coordinates of the center of the square
      var coords = getCoordinates(JGenerous.player.cX, JGenerous.player.cY, JGenerous.geometry.radius, angle);

      JGenerous.neighbors[i].cX = coords.x;
      JGenerous.neighbors[i].cY = coords.y;
    }
    
    // Draw lines
    for (i=0; i < JGenerous.neighbors.length; i++)
    {
        var pathString = "";
        pathString += "M" + JGenerous.player.cX + " " + JGenerous.player.cY;
        pathString += "L" + JGenerous.neighbors[i].cX + " " + JGenerous.neighbors[i].cY;
        JGenerous.neighbors[i].pathShadow = JGenerous.drawCanvas.path(pathString);
        JGenerous.neighbors[i].pathShadow.attr({"stroke" : "#000000", "stroke-width" : "4", "translation" : "1,1", "opacity" : ".5"});
        JGenerous.neighbors[i].pathLine = JGenerous.drawCanvas.path(pathString);

        //  If this was a recently made connection and this is the round where we're displaying network changes, make it a different color
        if (JGenerous.neighbors[i].rewired && ( JGenerous.returnData.gameStatus == "SHOW_REWIRING_ROUND" || JGenerous.returnData.gameStatus == "REWIRING_ROUND" )) {
          JGenerous.neighbors[i].pathLine.attr({stroke: "#7FC172", "stroke-width": "4"});
        } else {
          JGenerous.neighbors[i].pathLine.attr({stroke: "#acb9c2", "stroke-width": "4"});
        }

        JGenerous.neighbors[i].path = JGenerous.drawCanvas.set();
        JGenerous.neighbors[i].path.push(JGenerous.neighbors[i].pathLine, JGenerous.neighbors[i].pathShadow);
        if (!JGenerous.neighbors[i].connected) {
          JGenerous.neighbors[i].path.hide();
        }
        
        if (JGenerous.tutorialMode && JGenerous.tutorialStep == JGenerous.tutorialStepArrow){
          var size = .2;
          var arrowStartX = JGenerous.player.cX ;
          var arrowStartY = otherY - 20;
          var arrowEndX = JGenerous.neighbors[i].cX;
          var arrowEndY = JGenerous.neighbors[i].cY;
          var x1 = (arrowEndX - arrowStartX) * 0.35 + arrowStartX;
          var x2 = (arrowEndX - arrowStartX) * (1 - size) + arrowStartX;
          var y1 = (arrowEndY - arrowStartY) * 0.35 + arrowStartY;
          var y2 = (arrowEndY - arrowStartY) * (1 - size) + arrowStartY;
          arrow(JGenerous.drawCanvas, x1, y1, x2, y2, 5, "#555555");
        }
    }

    // Draw nodes
    for (i=0; i < JGenerous.neighbors.length; i++)
    {
      // calculate the top left corner of the node
      var nodeTop = JGenerous.neighbors[i].cY - parseInt(.5 * JGenerous.geometry.boxHeight);
      var nodeLeft = JGenerous.neighbors[i].cX - parseInt(.5 * JGenerous.geometry.boxWidth);

      // Only show unconnected neighbors during the rewiring round.
      if (JGenerous.neighbors[i].connected || (JGenerous.returnData.gameStatus == "REWIRING_ROUND") || (JGenerous.tutorialMode && JGenerous.tutorialStep > 4) )
      {
        JGenerous.neighbors[i].node = JGenerous.drawCanvas.image(appURL + "/images/white.png", nodeLeft, nodeTop, JGenerous.geometry.boxWidth, JGenerous.geometry.boxHeight);
        switch (JGenerous.neighbors[i].cooperating)
        {
          case 0: // not cooperating
            JGenerous.neighbors[i].node = JGenerous.drawCanvas.image(appURL + "/images/blue_ring_shadow.png", nodeLeft, nodeTop, JGenerous.geometry.boxWidth, JGenerous.geometry.boxHeight);
            break;
          case 1: // cooperating
            JGenerous.neighbors[i].node = JGenerous.drawCanvas.image(appURL + "/images/orange_ring_shadow.png", nodeLeft, nodeTop, JGenerous.geometry.boxWidth, JGenerous.geometry.boxHeight);
            break;
          default: // don't know if we're cooperating or not
            JGenerous.neighbors[i].node = JGenerous.drawCanvas.image(appURL + "/images/gray_ring_shadow.png", nodeLeft, nodeTop, JGenerous.geometry.boxWidth, JGenerous.geometry.boxHeight);
            break;
        }
      }
    }
  }

  // Add player node
  nodeTop = JGenerous.player.cY - parseInt(.5 * JGenerous.geometry.myBoxHeight);
  nodeLeft = JGenerous.player.cX - parseInt(.5 * JGenerous.geometry.myBoxWidth);
  if (JGenerous.tutorialMode && JGenerous.tutorialStep == JGenerous.tutorialStepArrow){
    var size1 = .1
    var size2 = .3
    var arrowStartX = JGenerous.player.cX  - 20;
    var arrowStartY = youY ;
    var arrowEndX = JGenerous.player.cX;
    var arrowEndY = JGenerous.player.cY;
    var x1 = (arrowEndX - arrowStartX) * size1 + arrowStartX;
    var x2 = (arrowEndX - arrowStartX) * (1 - size2) + arrowStartX;
    var y1 = (arrowEndY - arrowStartY) * size1 + arrowStartY;
    var y2 = (arrowEndY - arrowStartY) * (1 - size2) + arrowStartY;
    arrow(JGenerous.drawCanvas, x1, y1, x2, y2, 5, "#555555");
  }

  JGenerous.drawCanvas.image(appURL + "/images/white_big.png", nodeLeft, nodeTop, JGenerous.geometry.myBoxWidth, JGenerous.geometry.myBoxHeight);
  switch (lastMove) {
    case 0: // not cooperating
      JGenerous.player.node = JGenerous.drawCanvas.image(appURL + "/images/blue_ring_big_shadow.png", nodeLeft, nodeTop, JGenerous.geometry.myBoxWidth, JGenerous.geometry.myBoxHeight);
      break;
    case 1: // cooperating
      JGenerous.player.node = JGenerous.drawCanvas.image(appURL + "/images/orange_ring_big_shadow.png", nodeLeft, nodeTop, JGenerous.geometry.myBoxWidth, JGenerous.geometry.myBoxHeight);
      break;
    default: // don't know if we're cooperating or not
      JGenerous.player.node = JGenerous.drawCanvas.image(appURL + "/images/gray_ring_big_shadow.png", nodeLeft, nodeTop, JGenerous.geometry.myBoxWidth, JGenerous.geometry.myBoxHeight);
      break;
  }

  if (JGenerous.startingBonus === undefined) {
    //show the bonus
    JGenerous.bonusText = JGenerous.drawCanvas.text(JGenerous.player.cX, JGenerous.player.cY, JGenerous.returnData.bonus);
  } else {
    JGenerous.bonusText = JGenerous.drawCanvas.text(JGenerous.player.cX, JGenerous.player.cY, JGenerous.startingBonus);
  }
  JGenerous.bonusText.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "16", "font-weight" : "bold"});
  JGenerous.bonusText.toFront();
}

function draw2() {
  var w = 800;
  var h = 400;
  if (JGenerous.drawCanvas === null) {
    JGenerous.drawCanvas = Raphael(document.getElementById('draw'), w, h);
  } else {
    JGenerous.drawCanvas.clear();
  }
  $("#draw").width(w);
  $("#draw").height(h);
  
  if (JGenerous.drawCanvas !== null) {
    var x1 = 426;
    var y1 = 157;
    var x2 = 485;
    var y2 = 55;
    arrow(JGenerous.drawCanvas, x1, y1, x2, y2, 5, "#555555");
    
    y1 = 200;
    y2 = 297;
    arrow(JGenerous.drawCanvas, x1, y1, x2, y2, 5, "#555555");
    var x = 666;
    var y = 106;
    var e = JGenerous.drawCanvas.text(x, y, "You");
    e.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "12", "fill": "#555555"});

    x1 = 646;
    y1 = 117;
    x2 = 600;
    y2 = 160;
    arrow(JGenerous.drawCanvas, x1, y1, x2, y2, 5, "#555555");
    
    x = 400;
    y = 175;
    e = JGenerous.drawCanvas.text(x, y, "Your neighbors");
    e.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "12", "fill": "#555555"});
  }
}
function draw5() {
  x1 = 196;
  y1 = 57;
  x2 = 245;
  y2 = 145;
  arrow(JGenerous.drawCanvas, x1, y1, x2, y2, 5, "#555555");
  
  x = 186;
  y = 44;
  e = JGenerous.drawCanvas.text(x, y, "Your initial balance");
  e.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "12", "fill": "#555555"});
}

function cooperationStep3()
{
  JGenerous.startingBonus = JGenerous.returnData.bonus;
  if (JGenerous.bonusText != undefined) {
    JGenerous.bonusText.remove();
  }
  JGenerous.bonusText = JGenerous.drawCanvas.text(JGenerous.player.cX, JGenerous.player.cY, JGenerous.startingBonus);
  JGenerous.bonusText.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "16", "font-weight" : "bold"});
  // cX and cY denote the center of the node calculate the top left of the bubble
  var bubbleX = JGenerous.player.cX - 76;
  var bubbleY = JGenerous.player.cY + 30;
  
  if (JGenerous.drawCanvas !== null)
  {
    var bubble = JGenerous.drawCanvas.image(appURL + "/images/bubble.png", bubbleX, bubbleY, 152, 90);
    var orangeRing = JGenerous.drawCanvas.image(appURL + "/images/orange_ring_shadow.png", bubbleX + 21, bubbleY + 33, 45, 45);
    var orangeAmount = JGenerous.drawCanvas.text(bubbleX + 44, bubbleY + 55, "-" + JGenerous.returnData.coc);
    orangeAmount.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "11"});

    var blueRing = JGenerous.drawCanvas.image(appURL + "/images/blue_ring_shadow.png", bubbleX + 87, bubbleY + 33, 45, 45);
    var blueAmount = JGenerous.drawCanvas.text(bubbleX + 110, bubbleY + 55, 0);
    blueAmount.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "11"});
    var blue = JGenerous.drawCanvas.set();
    blue.push(blueRing, blueAmount);
    blue.attr({cursor : "pointer"});
    var orange = JGenerous.drawCanvas.set();
    orange.push(orangeRing, orangeAmount);
    orange.attr({cursor : "pointer"});
    
    if (JGenerous.tutorialMode && JGenerous.tutorialStep == JGenerous.tutorialStepAvailableColor) {
      var x1 = 246;
      var y1 = 331;
      var x2 = 213;
      var y2 = 262;
      arrow(JGenerous.drawCanvas, x1, y1, x2, y2, 5, "#555555");
      
      x2 = 279;
      y2 = 262;
      arrow(JGenerous.drawCanvas, x1, y1, x2, y2, 5, "#555555");
      var x = 241;
      var y = 345;
      var e = JGenerous.drawCanvas.text(x, y, "Available ring colors\nand their cost");
      e.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "12", "fill": "#555555"});
    }

    // Dim out nodes to show they were last round's moves
    JGenerous.player.node.attr({opacity : ".7"});
    for (i = 0; i < JGenerous.neighbors.length; i++)
    {
      if (JGenerous.neighbors[i].node !== undefined)
        JGenerous.neighbors[i].node.attr({opacity : ".7"});
    }
    var decided;
    orange.hover(function (event) {
      JGenerous.player.node.attr({src : appURL + "/images/orange_ring_big_shadow.png", opacity : "1"});
    }, function (event) {
      if (decided == undefined) {
        switch (JGenerous.returnData.lastMove)
        {
          case 0: // not cooperating
            JGenerous.player.node.attr({src : appURL + "/images/blue_ring_big_shadow.png", opacity : ".7"});
            break;
          case 1: // cooperating
            JGenerous.player.node.attr({src : appURL + "/images/orange_ring_big_shadow.png", opacity : ".7"});
            break;
          default: // don't know if we're cooperating or not
            JGenerous.player.node.attr({src : appURL + "/images/gray_ring_big_shadow.png", opacity : ".7"});
            break;
        }
      }
    });

    blue.hover(function (event) {
      JGenerous.player.node.attr({src : appURL + "/images/blue_ring_big_shadow.png", opacity : "1"});
    }, function (event) {
      if (decided == undefined) {
        switch (JGenerous.returnData.lastMove)
        {
          case 0: // not cooperating
            JGenerous.player.node.attr({src : appURL + "/images/blue_ring_big_shadow.png", opacity : ".7"});
            break;
          case 1: // cooperating
            JGenerous.player.node.attr({src : appURL + "/images/orange_ring_big_shadow.png", opacity : ".7"});
            break;
          default: // don't know if we're cooperating or not
            JGenerous.player.node.attr({src : appURL + "/images/gray_ring_big_shadow.png", opacity : ".7"});
            break;
        }
      }
    });
  }
}
function cooperationStep4() {
  JGenerous.startingBonus = JGenerous.returnData.bonus;
  if (JGenerous.bonusText != undefined) {
    JGenerous.bonusText.remove();
  }
  JGenerous.bonusText = JGenerous.drawCanvas.text(JGenerous.player.cX, JGenerous.player.cY, JGenerous.startingBonus);
  JGenerous.bonusText.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "16", "font-weight" : "bold"});
  // cX and cY denote the center of the node calculate the top left of the bubble
  var bubbleX = JGenerous.player.cX - 76;
  var bubbleY = JGenerous.player.cY + 30;
  
  if (JGenerous.drawCanvas !== null)
  {
    var bubble = JGenerous.drawCanvas.image(appURL + "/images/bubble.png", bubbleX, bubbleY, 152, 90);
    var orangeRing = JGenerous.drawCanvas.image(appURL + "/images/orange_ring_shadow.png", bubbleX + 21, bubbleY + 33, 45, 45);
    var orangeAmount = JGenerous.drawCanvas.text(bubbleX + 44, bubbleY + 55, "-" + JGenerous.returnData.coc);
    orangeAmount.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "11"});

    var blueRing = JGenerous.drawCanvas.image(appURL + "/images/blue_ring_shadow.png", bubbleX + 87, bubbleY + 33, 45, 45);
    var blueAmount = JGenerous.drawCanvas.text(bubbleX + 110, bubbleY + 55, 0);
    blueAmount.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "11"});
    var blue = JGenerous.drawCanvas.set();
    blue.push(blueRing, blueAmount);
    blue.attr({cursor : "pointer"});
    var orange = JGenerous.drawCanvas.set();
    orange.push(orangeRing, orangeAmount);
    orange.attr({cursor : "pointer"});
    
    var size1 = .1
    var size2 = .3
    var arrowStartX = bubbleX + 45 ;
    var arrowStartY = bubbleY + 120;
    var arrowEndX = bubbleX + 45;
    var arrowEndY = bubbleY + 52;
    var x1 = (arrowEndX - arrowStartX) * size1 + arrowStartX;
    var x2 = (arrowEndX - arrowStartX) * (1 - size2) + arrowStartX;
    var y1 = (arrowEndY - arrowStartY) * size1 + arrowStartY;
    var y2 = (arrowEndY - arrowStartY) * (1 - size2) + arrowStartY;
    var a = arrow(JGenerous.drawCanvas, x1, y1, x2, y2, 5, "#555555");
    
    var x = bubbleX + 45;
    var y = bubbleY + 135;
    
    $("#draw").append("<div id='help' style='margin-left: 143px;position: absolute;text-align: center;top: 308px;width: 135px;'>Click on the <br/><span class='orange'>orange ring</span> now</div>")

    // Dim out nodes to show they were last round's moves
    JGenerous.player.node.attr({opacity : ".7"});
    for (i = 0; i < JGenerous.neighbors.length; i++)
    {
      if (JGenerous.neighbors[i].node !== undefined)
        JGenerous.neighbors[i].node.attr({opacity : ".7"});
    }
    var decided;
    orange.hover(function (event) {
      JGenerous.player.node.attr({src : appURL + "/images/orange_ring_big_shadow.png", opacity : "1"});
    }, function (event) {
      if (decided == undefined) {
        switch (JGenerous.returnData.lastMove)
        {
          case 0: // not cooperating
            JGenerous.player.node.attr({src : appURL + "/images/blue_ring_big_shadow.png", opacity : ".7"});
            break;
          case 1: // cooperating
            JGenerous.player.node.attr({src : appURL + "/images/orange_ring_big_shadow.png", opacity : ".7"});
            break;
          default: // don't know if we're cooperating or not
            JGenerous.player.node.attr({src : appURL + "/images/gray_ring_big_shadow.png", opacity : ".7"});
            break;
        }
      }
    });

    blue.hover(function (event) {
      JGenerous.player.node.attr({src : appURL + "/images/blue_ring_big_shadow.png", opacity : "1"});
    }, function (event) {
      if (decided == undefined) {
        switch (JGenerous.returnData.lastMove)
        {
          case 0: // not cooperating
            JGenerous.player.node.attr({src : appURL + "/images/blue_ring_big_shadow.png", opacity : ".7"});
            break;
          case 1: // cooperating
            JGenerous.player.node.attr({src : appURL + "/images/orange_ring_big_shadow.png", opacity : ".7"});
            break;
          default: // don't know if we're cooperating or not
            JGenerous.player.node.attr({src : appURL + "/images/gray_ring_big_shadow.png", opacity : ".7"});
            break;
        }
      }
    });

    orange.click(function(){
      track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Cooperate", 1);
      decided = true;
      bubble.remove();
      orange.remove();
      blue.remove();
      JGenerous.player.node.attr({src : appURL + "/images/orange_ring_big_shadow.png"});
      a[0].remove();
      a[1].remove();
      $("#help").remove();
      JGenerous.tutorialRelationships[0].lastDecision = 0;
      JGenerous.tutorialRelationships[1].lastDecision = 1;
      plotClient(JGenerous.tutorialRelationships, 1);
      JGenerous.startingBonus = JGenerous.startingBonus - JGenerous.returnData.coc;
      animateBonus(-1 * JGenerous.returnData.coc, JGenerous.player.cX, JGenerous.player.cY, null, 1000);
      var x1 = 272;
      var x2 = 249;
      var y1 = 245;
      var y2 = 172;
      a = arrow(JGenerous.drawCanvas, x1, y1, x2, y2, 5, "#555555");
      $("#draw").append("<div id='help' style='margin-left: 209px;position: absolute;text-align: center;top: 246px;width: 170px;'>" +
          "You picked an <span class='orange'>orange ring</span> and paid <b>" + JGenerous.returnData.coc 
          +"</b> tokens for it <br/> <button id='gotit'>Got it!</button></div>");
      $('#gotit').click(function(){
        $('#gotit').attr("disabled", true);
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Got it!", 1);
        a[0].remove();
        a[1].remove();
        $("#help").remove();
        resultsStepSlow(1000, 1);
      });
      JGenerous.bonusText.remove();
      JGenerous.bonusText = JGenerous.drawCanvas.text(JGenerous.player.cX, JGenerous.player.cY, JGenerous.startingBonus);
      JGenerous.bonusText.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "16", "font-weight" : "bold"});
      JGenerous.bonusText.toFront();
    });
  }
}
function cooperationStep5() {
  if (JGenerous.bonusText != undefined) {
    JGenerous.bonusText.remove();
  }
  JGenerous.bonusText = JGenerous.drawCanvas.text(JGenerous.player.cX, JGenerous.player.cY, JGenerous.startingBonus);
  JGenerous.bonusText.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "16", "font-weight" : "bold"});
  // cX and cY denote the center of the node calculate the top left of the bubble
  var bubbleX = JGenerous.player.cX - 76;
  var bubbleY = JGenerous.player.cY + 30;
  
  if (JGenerous.drawCanvas !== null)
  {
    var bubble = JGenerous.drawCanvas.image(appURL + "/images/bubble.png", bubbleX, bubbleY, 152, 90);
    var orangeRing = JGenerous.drawCanvas.image(appURL + "/images/orange_ring_shadow.png", bubbleX + 21, bubbleY + 33, 45, 45);
    var orangeAmount = JGenerous.drawCanvas.text(bubbleX + 44, bubbleY + 55, "-" + JGenerous.returnData.coc);
    orangeAmount.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "11"});

    var blueRing = JGenerous.drawCanvas.image(appURL + "/images/blue_ring_shadow.png", bubbleX + 87, bubbleY + 33, 45, 45);
    var blueAmount = JGenerous.drawCanvas.text(bubbleX + 110, bubbleY + 55, 0);
    blueAmount.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "11"});
    var blue = JGenerous.drawCanvas.set();
    blue.push(blueRing, blueAmount);
    blue.attr({cursor : "pointer"});
    var orange = JGenerous.drawCanvas.set();
    orange.push(orangeRing, orangeAmount);
    orange.attr({cursor : "pointer"});
    var x1 = 279;
    var x2 = 279;
    var y1 = 305;
    var y2 = 262;
    var a = arrow(JGenerous.drawCanvas, x1, y1, x2, y2, 5, "#555555");
    
    var x = bubbleX + 45;
    var y = bubbleY + 135;
    
    $("#draw").append("<div id='help' style='margin-left: 239px;position: absolute;text-align: center;top: 308px;width: 110px;'>" +
        "Click on the <br/><span class='blue'>blue ring</span></div>")
    
    // Dim out nodes to show they were last round's moves
    JGenerous.player.node.attr({opacity : ".7"});
    for (i = 0; i < JGenerous.neighbors.length; i++)
    {
      if (JGenerous.neighbors[i].node !== undefined)
        JGenerous.neighbors[i].node.attr({opacity : ".7"});
    }
    var decided;
    orange.hover(function (event) {
      JGenerous.player.node.attr({src : appURL + "/images/orange_ring_big_shadow.png", opacity : "1"});
    }, function (event) {
      if (decided == undefined) {
        switch (JGenerous.returnData.lastMove)
        {
          case 0: // not cooperating
            JGenerous.player.node.attr({src : appURL + "/images/blue_ring_big_shadow.png", opacity : ".7"});
            break;
          case 1: // cooperating
            JGenerous.player.node.attr({src : appURL + "/images/orange_ring_big_shadow.png", opacity : ".7"});
            break;
          default: // don't know if we're cooperating or not
            JGenerous.player.node.attr({src : appURL + "/images/gray_ring_big_shadow.png", opacity : ".7"});
            break;
        }
      }
    });

    blue.hover(function (event) {
      JGenerous.player.node.attr({src : appURL + "/images/blue_ring_big_shadow.png", opacity : "1"});
    }, function (event) {
      if (decided == undefined) {
        switch (JGenerous.returnData.lastMove)
        {
          case 0: // not cooperating
            JGenerous.player.node.attr({src : appURL + "/images/blue_ring_big_shadow.png", opacity : ".7"});
            break;
          case 1: // cooperating
            JGenerous.player.node.attr({src : appURL + "/images/orange_ring_big_shadow.png", opacity : ".7"});
            break;
          default: // don't know if we're cooperating or not
            JGenerous.player.node.attr({src : appURL + "/images/gray_ring_big_shadow.png", opacity : ".7"});
            break;
        }
      }
    });

    blue.click(function(){
      track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 NotCooperate", 1);
      decided = true;
      bubble.remove();
      orange.remove();
      blue.remove();
      JGenerous.player.node.attr({src : appURL + "/images/blue_ring_big_shadow.png"});
      a[0].remove();
      a[1].remove();
      $("#help").remove();
      
      JGenerous.tutorialRelationships[0].lastDecision = 1;
      JGenerous.tutorialRelationships[1].lastDecision = 0;
      plotClient(JGenerous.tutorialRelationships, 0);
      
      animateBonus(0, JGenerous.player.cX, JGenerous.player.cY, null, 1000);
      var x1 = 272;
      var x2 = 249;
      var y1 = 245;
      var y2 = 172;
      a = arrow(JGenerous.drawCanvas, x1, y1, x2, y2, 5, "#555555");
      $("#draw").append("<div id='help' style='margin-left: 209px;position: absolute;text-align: center;top: 246px;width: 136px;'>" +
      		"You picked a <span class='blue'>blue ring</span> and paid <b>0</b> tokens for it<br/> <button id='gotit'>Got it!</button></div>")
      $('#gotit').click(function(){
        $('#gotit').attr("disabled", true);
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Got it!", 1);
        a[0].remove();
        a[1].remove();
        $("#help").remove();
        resultsStepSlow(1000, 0);
      });
      JGenerous.bonusText.remove();
      JGenerous.bonusText = JGenerous.drawCanvas.text(JGenerous.player.cX, JGenerous.player.cY, JGenerous.startingBonus);
      JGenerous.bonusText.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "16", "font-weight" : "bold"});
      JGenerous.bonusText.toFront();
    });
  }
}
function cooperationStep6() {
  if (JGenerous.bonusText != undefined) {
    JGenerous.bonusText.remove();
  }
  JGenerous.bonusText = JGenerous.drawCanvas.text(JGenerous.player.cX, JGenerous.player.cY, JGenerous.startingBonus);
  JGenerous.bonusText.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "16", "font-weight" : "bold"});
  // cX and cY denote the center of the node calculate the top left of the bubble
  var bubbleX = JGenerous.player.cX - 76;
  var bubbleY = JGenerous.player.cY + 30;
  
  if (JGenerous.drawCanvas !== null) {
    var bubble = JGenerous.drawCanvas.image(appURL + "/images/bubble.png", bubbleX, bubbleY, 152, 90);
    var orangeRing = JGenerous.drawCanvas.image(appURL + "/images/orange_ring_shadow.png", bubbleX + 21, bubbleY + 33, 45, 45);
    var orangeAmount = JGenerous.drawCanvas.text(bubbleX + 44, bubbleY + 55, "-" + JGenerous.returnData.coc);
    orangeAmount.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "11"});

    var blueRing = JGenerous.drawCanvas.image(appURL + "/images/blue_ring_shadow.png", bubbleX + 87, bubbleY + 33, 45, 45);
    var blueAmount = JGenerous.drawCanvas.text(bubbleX + 110, bubbleY + 55, 0);
    blueAmount.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "11"});
    var blue = JGenerous.drawCanvas.set();
    blue.push(blueRing, blueAmount);
    blue.attr({cursor : "pointer"});
    var orange = JGenerous.drawCanvas.set();
    orange.push(orangeRing, orangeAmount);
    orange.attr({cursor : "pointer"});
    
    var x = bubbleX + 45;
    var y = bubbleY + 135;
    
    $("#draw").append("<div id='help' style='margin-left: 193px;position: absolute;text-align: center;top: 308px;width: 110px;'>" +
        "Practice round " + JGenerous.practiceRounds + "</div>")
    
    // Dim out nodes to show they were last round's moves
    JGenerous.player.node.attr({opacity : ".7"});
    for (i = 0; i < JGenerous.neighbors.length; i++) {
      if (JGenerous.neighbors[i].node !== undefined)
        JGenerous.neighbors[i].node.attr({opacity : ".7"});
    }
    var decided;
    orange.hover(function (event) {
      JGenerous.player.node.attr({src : appURL + "/images/orange_ring_big_shadow.png", opacity : "1"});
    }, function (event) {
      if (decided == undefined) {
        switch (JGenerous.returnData.lastMove)
        {
          case 0: // not cooperating
            JGenerous.player.node.attr({src : appURL + "/images/blue_ring_big_shadow.png", opacity : ".7"});
            break;
          case 1: // cooperating
            JGenerous.player.node.attr({src : appURL + "/images/orange_ring_big_shadow.png", opacity : ".7"});
            break;
          default: // don't know if we're cooperating or not
            JGenerous.player.node.attr({src : appURL + "/images/gray_ring_big_shadow.png", opacity : ".7"});
            break;
        }
      }
    });

    blue.hover(function (event) {
      JGenerous.player.node.attr({src : appURL + "/images/blue_ring_big_shadow.png", opacity : "1"});
    }, function (event) {
      if (decided == undefined) {
        switch (JGenerous.returnData.lastMove)
        {
          case 0: // not cooperating
            JGenerous.player.node.attr({src : appURL + "/images/blue_ring_big_shadow.png", opacity : ".7"});
            break;
          case 1: // cooperating
            JGenerous.player.node.attr({src : appURL + "/images/orange_ring_big_shadow.png", opacity : ".7"});
            break;
          default: // don't know if we're cooperating or not
            JGenerous.player.node.attr({src : appURL + "/images/gray_ring_big_shadow.png", opacity : ".7"});
            break;
        }
      }
    });

    orange.click(function(){
      track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Practice round " + JGenerous.practiceRounds + ": Cooperate", 1);
      decided = true;
      bubble.remove();
      orange.remove();
      blue.remove();
      JGenerous.player.node.attr({src : appURL + "/images/orange_ring_big_shadow.png"});
      
      JGenerous.tutorialLastMove = 1;
      JGenerous.tutorialRelationships[0].lastDecision = (1 + JGenerous.practiceRounds) % 2;
      JGenerous.tutorialRelationships[1].lastDecision = JGenerous.practiceRounds % 2;
      plotClient(JGenerous.tutorialRelationships, JGenerous.tutorialLastMove);
      
      JGenerous.startingBonus = JGenerous.startingBonus - JGenerous.returnData.coc;
      animateBonus(-1 * JGenerous.returnData.coc, JGenerous.player.cX, JGenerous.player.cY, resultsStep);
      JGenerous.bonusText.remove();
      JGenerous.bonusText = JGenerous.drawCanvas.text(JGenerous.player.cX, JGenerous.player.cY, JGenerous.startingBonus);
      JGenerous.bonusText.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "16", "font-weight" : "bold"});
      JGenerous.bonusText.toFront();
    });
    
    blue.click(function(){
      track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Practice round " + JGenerous.practiceRounds + ": NotCooperate", 1);
      decided = true;
      bubble.remove();
      orange.remove();
      blue.remove();
      JGenerous.player.node.attr({src : appURL + "/images/blue_ring_big_shadow.png"});
      
      JGenerous.tutorialLastMove = 0;
      JGenerous.tutorialRelationships[0].lastDecision = (1 + JGenerous.practiceRounds) % 2;
      JGenerous.tutorialRelationships[1].lastDecision = (1 + JGenerous.practiceRounds) % 2;
      plotClient(JGenerous.tutorialRelationships, JGenerous.tutorialLastMove);
      
      animateBonus(0, JGenerous.player.cX, JGenerous.player.cY, resultsStep);
      JGenerous.bonusText.remove();
      JGenerous.bonusText = JGenerous.drawCanvas.text(JGenerous.player.cX, JGenerous.player.cY, JGenerous.startingBonus);
      JGenerous.bonusText.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "16", "font-weight" : "bold"});
      JGenerous.bonusText.toFront();
    });
  }
}
function cooperationStep() {
  $("#status").remove();
  JGenerous.startingBonus = JGenerous.returnData.bonus;
  if (JGenerous.bonusText != undefined) {
    JGenerous.bonusText.remove();
  }
  JGenerous.bonusText = JGenerous.drawCanvas.text(JGenerous.player.cX, JGenerous.player.cY, JGenerous.startingBonus);
  JGenerous.bonusText.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "16", "font-weight" : "bold"});
  // cX and cY denote the center of the node calculate the top left of the bubble
  var bubbleX = JGenerous.player.cX - 76;
  var bubbleY = JGenerous.player.cY + 30;
  
  if (JGenerous.drawCanvas !== null) {
    var bubble = JGenerous.drawCanvas.image(appURL + "/images/bubble.png", bubbleX, bubbleY, 152, 90);
    var orangeRing = JGenerous.drawCanvas.image(appURL + "/images/orange_ring_shadow.png", bubbleX + 21, bubbleY + 33, 45, 45);
    var orangeAmount = JGenerous.drawCanvas.text(bubbleX + 44, bubbleY + 55, "-" + JGenerous.returnData.coc);
    orangeAmount.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "11"});

    var blueRing = JGenerous.drawCanvas.image(appURL + "/images/blue_ring_shadow.png", bubbleX + 87, bubbleY + 33, 45, 45);
    var blueAmount = JGenerous.drawCanvas.text(bubbleX + 110, bubbleY + 55, 0);
    blueAmount.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "11"});
    var blue = JGenerous.drawCanvas.set();
    blue.push(blueRing, blueAmount);
    blue.attr({cursor : "pointer"});
    var orange = JGenerous.drawCanvas.set();
    orange.push(orangeRing, orangeAmount);
    orange.attr({cursor : "pointer"});
    
    // Dim out nodes to show they were last round's moves
    JGenerous.player.node.attr({opacity : ".7"});
    for (i = 0; i < JGenerous.neighbors.length; i++) {
      if (JGenerous.neighbors[i].node !== undefined)
        JGenerous.neighbors[i].node.attr({opacity : ".7"});
    }
    var decided;
    orange.hover(function (event) {
      JGenerous.player.node.attr({src : appURL + "/images/orange_ring_big_shadow.png", opacity : "1"});
    }, function (event) {
      if (decided == undefined) {
        switch (JGenerous.returnData.lastMove)
        {
          case 0: // not cooperating
            JGenerous.player.node.attr({src : appURL + "/images/blue_ring_big_shadow.png", opacity : ".7"});
            break;
          case 1: // cooperating
            JGenerous.player.node.attr({src : appURL + "/images/orange_ring_big_shadow.png", opacity : ".7"});
            break;
          default: // don't know if we're cooperating or not
            JGenerous.player.node.attr({src : appURL + "/images/gray_ring_big_shadow.png", opacity : ".7"});
            break;
        }
      }
    });

    blue.hover(function (event) {
      JGenerous.player.node.attr({src : appURL + "/images/blue_ring_big_shadow.png", opacity : "1"});
    }, function (event) {
      if (decided == undefined) {
        switch (JGenerous.returnData.lastMove)
        {
          case 0: // not cooperating
            JGenerous.player.node.attr({src : appURL + "/images/blue_ring_big_shadow.png", opacity : ".7"});
            break;
          case 1: // cooperating
            JGenerous.player.node.attr({src : appURL + "/images/orange_ring_big_shadow.png", opacity : ".7"});
            break;
          default: // don't know if we're cooperating or not
            JGenerous.player.node.attr({src : appURL + "/images/gray_ring_big_shadow.png", opacity : ".7"});
            break;
        }
      }
    });

    orange.click(function(){
      track("Set " + (JGenerous.returnData.firstAllocationFinished ? "2" : "1") 
          + ", Round " + JGenerous.returnData.round, " Cooperate", 3); 
      decided = true;
      bubble.remove();
      orange.remove();
      blue.remove();
      waitOtherPlayer();
      JGenerous.player.node.attr({src : appURL + "/images/orange_ring_big_shadow.png"});
      $.ajax({
          type: "POST",
          url: appURL + "/server",
          data: "serverid=" + JGenerous.serverId 
            + "&clientid=" + JGenerous.clientId 
            + "&action=Cooperate&round=" + JGenerous.returnData.round 
            + "&workerId=" + JGenerous.workerId,
          success: function(returnData){
            animateBonus(-1 * JGenerous.returnData.coc, JGenerous.player.cX, JGenerous.player.cY);
            JGenerous.startingBonus = JGenerous.startingBonus - JGenerous.returnData.coc;

            JGenerous.bonusText.remove();
            JGenerous.bonusText = JGenerous.drawCanvas.text(JGenerous.player.cX, JGenerous.player.cY, JGenerous.startingBonus);
            JGenerous.bonusText.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "16", "font-weight" : "bold"});
            JGenerous.bonusText.toFront();
          }
        });
    });

    blue.click(function(){
      track("Set " + (JGenerous.returnData.firstAllocationFinished ? "2" : "1") 
          + ", Round " + JGenerous.returnData.round, " NotCooperate", 3); 
      decided = true;
      bubble.remove();
      orange.remove();
      blue.remove();
      JGenerous.player.node.attr({src : appURL + "/images/blue_ring_big_shadow.png"});
      waitOtherPlayer();
      $.ajax({
          type: "POST",
          url: appURL + "/server",
          data: "serverid=" + JGenerous.serverId + "&clientid=" + JGenerous.clientId 
            + "&action=DoNothing&round=" + JGenerous.returnData.round
            + "&workerId=" + JGenerous.workerId,
          success: function(returnData){
            animateBonus(0, JGenerous.player.cX, JGenerous.player.cY);
          }
        });
    });
  }
}
function resultsStepSlow(speed, lastMove) {
  (lastMove == undefined) && (lastMove = JGenerous.returnData.lastMove);
  // blink the player node and, immediately after, show the results of the choice
  var x1 = 225;
  var y1 = 261;
  temp = [];
  
  for (var i = 0; i < JGenerous.neighbors.length; i++){
    if (JGenerous.neighbors[i].connected)  {
      var x2;
      if (JGenerous.neighbors[i].cX < JGenerous.player.cX) {
        x2 = JGenerous.neighbors[i].cX + 15;
      } else {
        x2 = JGenerous.neighbors[i].cX - 15;
      }
      var y2 = JGenerous.neighbors[i].cY + 15;
      var a = arrow(JGenerous.drawCanvas, x1, y1, x2, y2, 5, "#555555");
      temp[temp.length] = a[0];temp[temp.length] = a[1];
    }
  }
  if (lastMove == 1) { // Player is cooperating
    $("#draw").append("<div id='help' style='margin-left: 156px;position: absolute;text-align: center;top: 268px;width: 135px;'>" +
        "Your <span class='orange'>orange ring</span> will now add <b>" + JGenerous.returnData.payOff 
        + "</b> tokens to you and your neighbors<br/><button id='gotit'>Got it!</button></div>");
  } else {
    $("#draw").append("<div id='help' style='margin-left: 156px;position: absolute;text-align: center;top: 268px;width: 135px;'>" +
        "Your <span class='blue'>blue ring</span> will now add <b>0</b> tokens to you and your neighbors<br/><button id='gotit'>Got it!</button></div>");
  }
  temp[temp.length] = $("#help");
  var x2 = JGenerous.player.cX;
  var y2 = JGenerous.player.cY + 35;
  var a = arrow(JGenerous.drawCanvas, x1, y1, x2, y2, 5, "#555555");
  temp[temp.length] = a[0];temp[temp.length] = a[1];
  
  $('#gotit').click(function(){
    $('#gotit').attr("disabled", true);
    track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Got it!", 1);
    JGenerous.player.node.animate({
      "0%" : {opacity : 1},
      "25%" : {opacity : 0},
      "50%" : {opacity : 1},
      "75%" : {opacity : 0},
      "100%" : {opacity : 1, callback : function() {
        for (var i = 0; i < JGenerous.neighbors.length; i++){
          if (JGenerous.neighbors[i].connected)  {
            if (lastMove == 1) {// Player is cooperating
              animateBonus(JGenerous.returnData.payOff, JGenerous.neighbors[i].cX, JGenerous.neighbors[i].cY, undefined, speed);
            } else {
              animateBonus(0, JGenerous.neighbors[i].cX, JGenerous.neighbors[i].cY, undefined, speed);
            }
          }
        }
        if (lastMove == 1) { // Player is cooperating
          animateBonus(JGenerous.returnData.payOff, JGenerous.player.cX, JGenerous.player.cY, undefined, speed);
          JGenerous.bonusText.remove();
          if (JGenerous.startingBonus == undefined) {
            JGenerous.bonusText = JGenerous.drawCanvas.text(JGenerous.player.cX, JGenerous.player.cY, JGenerous.returnData.bonus);
          } else {
            JGenerous.startingBonus = JGenerous.startingBonus + JGenerous.returnData.payOff;
            JGenerous.bonusText = JGenerous.drawCanvas.text(JGenerous.player.cX, JGenerous.player.cY, JGenerous.startingBonus);
          }
          JGenerous.bonusText.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "16", "font-weight" : "bold"});
          JGenerous.bonusText.toFront();
        } else {
          animateBonus(0, JGenerous.player.cX, JGenerous.player.cY, undefined, speed);
        }
        
        if (JGenerous.startingBonus == undefined) {
          setTimeout("showNeighbor(0, false)", 1500);
        } else {
          setTimeout("showNeighbor(0, true)", 1500);
        }
      }}
    }, 1000);
  });
}

function showNeighbor(neighborNumber, useLocal) {
  for (var i = 0; i < temp.length; i++){
    temp[i].remove();
  }
  showNeighborActionSlow(neighborNumber, useLocal);
}
function resultsStep() {
  var lastMove;
  if (JGenerous.tutorialMode) {
    lastMove = JGenerous.tutorialLastMove;
  } else {
    lastMove = JGenerous.returnData.lastMove;
  }
  // blink the player node and, immediately after, show the results of the choice
  JGenerous.player.node.animate({
    "0%" : {opacity : 1},
    "25%" : {opacity : 0},
    "50%" : {opacity : 1},
    "75%" : {opacity : 0},
    "100%" : {opacity : 1, callback : function() {

        for (var i = 0; i < JGenerous.neighbors.length; i++) {
          if (JGenerous.neighbors[i].connected) {
            if (lastMove == 1) {// Player is cooperating
              animateBonus(JGenerous.returnData.payOff, JGenerous.neighbors[i].cX, JGenerous.neighbors[i].cY);
            } else {
              animateBonus(0, JGenerous.neighbors[i].cX, JGenerous.neighbors[i].cY);
            }
          }
        }
        if (lastMove == 1) { // Player is cooperating
          animateBonus(JGenerous.returnData.payOff, JGenerous.player.cX, JGenerous.player.cY);
          JGenerous.bonusText.remove();
          if (JGenerous.startingBonus == undefined) {
            JGenerous.bonusText = JGenerous.drawCanvas.text(JGenerous.player.cX, JGenerous.player.cY, JGenerous.returnData.bonus);
          } else {
            JGenerous.startingBonus = JGenerous.startingBonus + JGenerous.returnData.payOff;
            JGenerous.bonusText = JGenerous.drawCanvas.text(JGenerous.player.cX, JGenerous.player.cY, JGenerous.startingBonus);
          }

          JGenerous.bonusText.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "16", "font-weight" : "bold"});
          JGenerous.bonusText.toFront();
        } else {
          animateBonus(0, JGenerous.player.cX, JGenerous.player.cY);
        }
        if (JGenerous.startingBonus == undefined) {
          JGenerous.resultsTimeout = setTimeout("showNeighborAction(0, false)", 1500);
        } else {
          JGenerous.resultsTimeout = setTimeout("showNeighborAction(0, true)", 1500);
        }
      }}
    }, 1000);
}

function showNeighborActionSlow(neighborNumber, useLocal) {
  if ( (neighborNumber + 1) > JGenerous.neighbors.length ) {
    if (JGenerous.tutorialMode) {
      if (JGenerous.tutorialStep == 7) {
        var x1 = 272;
        var x2 = 249;
        var y1 = 245;
        var y2 = 172;
        var a = arrow(JGenerous.drawCanvas, x1, y1, x2, y2, 5, "#555555");
        $("#draw").append("<div id='help' style='margin-left: 209px;position: absolute;text-align: center;top: 246px;width: 136px;'>" +
        		"Your new balance after this round <br/><button id='gotit'>Got it!</button></div>")
        $('#gotit').click(function(){
          $('#gotit').attr("disabled", true);
          track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Got it!", 1);
          $("#begin").remove();
          $("#help").remove();
          $('#right').show();
          a[0].remove();a[1].remove();
        });
      } else if (JGenerous.tutorialStep == 8) {
        $("#begin").remove();
        $('#right').show();
      } else if (JGenerous.tutorialStep == 9) {
        JGenerous.practiceRounds++;
        if (JGenerous.practiceRounds > 3) {
          $("#begin").remove();
          $('#right').show();
        } else {
          $("#help").remove();
          plotClient(JGenerous.tutorialRelationships, JGenerous.tutorialLastMove);
          cooperationStep6();
        }
      }
    } else {
      if (!JGenerous.shownFinalResults) {
        $('#right').css("visibility", "visible");
        $('#right').click(function(){
          $('#left').css("visibility", "hidden");
          $('#right').css("visibility", "hidden");
          $.ajax({
            type: "POST",
            url: appURL + "/server",
            data: "serverid=" + JGenerous.serverId + "&clientid=" + JGenerous.clientId + "&action=ShowPayoff&round=" + JGenerous.returnData.round
          });
        });
      }
    }
  } else {
    if (JGenerous.neighbors[neighborNumber].connected) {
      var x1 = JGenerous.neighbors[neighborNumber].cX;
      var y1 = JGenerous.neighbors[neighborNumber].cY + 100;
      temp = [];
      if (JGenerous.neighbors[neighborNumber].cooperating) {
        $("#draw").append("<div id='help' style='margin-left: " + (x1 - 100) + "px;position: absolute;text-align: center;top: " + y1 + "px;width: 170px;'>" +
            "This player picked an <span class='orange'>orange ring</span> and it will add <b>" + JGenerous.returnData.payOff 
            + "</b> tokens to both of you<br/><button id='gotit'>Got it!</button></div></div>");
      } else {
        $("#draw").append("<div id='help' style='margin-left: " + (x1 - 100) + "px;position: absolute;text-align: center;top: " + y1 + "px;width: 170px;'>" +
            "This player picked a <span class='blue'>blue ring</span> and it will add <b>0</b> tokens to both of you<br/><button id='gotit'>Got it!</button></div></div>");
      }
      temp[0] = $("#help");
      var x2;
      if (x1 < JGenerous.player.cX) {
        x2 = JGenerous.player.cX - 60;
      } else {
        x2 = JGenerous.player.cX + 60;
      }
      var y2 = JGenerous.player.cY + 5;
      var a = arrow(JGenerous.drawCanvas, x1, y1, x2, y2, 5, "#555555");
      temp[temp.length] = a[0];temp[temp.length] = a[1];
      x2 = JGenerous.neighbors[neighborNumber].cX;
      y2 = JGenerous.neighbors[neighborNumber].cY + 20;
      a = arrow(JGenerous.drawCanvas, x1, y1, x2, y2, 5, "#555555");
      temp[temp.length] = a[0];temp[temp.length] = a[1];
      $('#gotit').click(function(){
        $('#gotit').attr("disabled", true);
        track("Tutorial", (JGenerous.tutorialStep - 1) + "/9 Got it!", 1);
        JGenerous.neighbors[neighborNumber].node.animate({
          "0%" : {opacity : 1},
          "25%" : {opacity : 0},
          "50%" : {opacity : 1},
          "75%" : {opacity : 0},
          "100%" : {opacity : 1, callback : function() {
            if (JGenerous.neighbors[neighborNumber].cooperating) {
              animateBonus(JGenerous.returnData.payOff, JGenerous.player.cX, JGenerous.player.cY);
              animateBonus(JGenerous.returnData.payOff, JGenerous.neighbors[neighborNumber].cX,  JGenerous.neighbors[neighborNumber].cY);
              if (useLocal) {
                // Also show the bonus applied to the player themselves if this is the Liscovich Game
                JGenerous.startingBonus += JGenerous.returnData.payOff;
              } else {
                JGenerous.startingBonus = JGenerous.returnData.bonus;
              }
              JGenerous.bonusText.remove();
              JGenerous.bonusText = JGenerous.drawCanvas.text(JGenerous.player.cX, JGenerous.player.cY, JGenerous.startingBonus);
              JGenerous.bonusText.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "16", "font-weight" : "bold"});
              JGenerous.bonusText.toFront();
            } else {
              animateBonus(0, JGenerous.player.cX, JGenerous.player.cY);
              animateBonus(0, JGenerous.neighbors[neighborNumber].cX,  JGenerous.neighbors[neighborNumber].cY);
            }
            setTimeout("showNeighbor(" + (neighborNumber + 1) + ", " + useLocal + ")", 1500);
          }}
        }, 1000);
      });
    }
  }
}

function showNeighborAction(neighborNumber, useLocal) {
  if (neighborNumber + 1> JGenerous.neighbors.length) {
    if (JGenerous.tutorialMode) {
      if (JGenerous.tutorialStep == 9) {
        JGenerous.practiceRounds++;
        if (JGenerous.practiceRounds > 3) {
          $("#begin").remove();
          $('#right').show();
          $("#help").remove();
        } else {
          $("#help").remove();
          plotClient(JGenerous.tutorialRelationships, JGenerous.tutorialLastMove);
          cooperationStep6();
        }
      }
    } else {
      if (!JGenerous.shownFinalResults) {
        $('#navi').html("<div class='navi'></div>")
        spinem('sm_end', JGenerous.returnData.roundPoe, JGenerous.returnData.poe, "shownPayoff()");
      }
    }
  } else {
    if (JGenerous.neighbors[neighborNumber].connected) {
      JGenerous.neighbors[neighborNumber].node.animate({
        "0%" : {opacity : 1},
        "25%" : {opacity : 0},
        "50%" : {opacity : 1},
        "75%" : {opacity : 0},
        "100%" : {opacity : 1, callback : function() {
          if (JGenerous.neighbors[neighborNumber].cooperating) {
            animateBonus(JGenerous.returnData.payOff, JGenerous.player.cX, JGenerous.player.cY);
            animateBonus(JGenerous.returnData.payOff, JGenerous.neighbors[neighborNumber].cX,  JGenerous.neighbors[neighborNumber].cY);
            if (useLocal) {
              // Also show the bonus applied to the player themselves if this is the Liscovich Game
              JGenerous.startingBonus += JGenerous.returnData.payOff;
            } else {
              JGenerous.startingBonus = JGenerous.returnData.bonus;
            }
            JGenerous.bonusText.remove();
            JGenerous.bonusText = JGenerous.drawCanvas.text(JGenerous.player.cX, JGenerous.player.cY, JGenerous.startingBonus);
            JGenerous.bonusText.attr({"font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "16", "font-weight" : "bold"});
            JGenerous.bonusText.toFront();
          } else {
            animateBonus(0, JGenerous.player.cX, JGenerous.player.cY);
            animateBonus(0, JGenerous.neighbors[neighborNumber].cX,  JGenerous.neighbors[neighborNumber].cY);
          }

          setTimeout("showNeighborAction(" + (neighborNumber + 1) + ", " + useLocal + ")", 1500);
        }}
      }, 1000);
    } else {
      // skip to next neighbor
      showNeighborAction(neighborNumber + 1, useLocal);
    }
  }
}

function animateBonus(amount, nodeX, nodeY, fn, speed) {
  if (JGenerous.drawCanvas !== null) {
    var bonusText = "";
    if (amount <= 0){
      bonusText = amount;
    } else {
      bonusText = "+" + amount;
    }

    var bonus = JGenerous.drawCanvas.text(nodeX, nodeY, bonusText);
    bonus.attr({opacity : 1, "font-family" : "Verdana, Helvetica, sans-serif", "font-size" : "16", "font-weight" : "bold", "color" : "#78b447"});
    bonus.animate({opacity:0, x:(nodeX-35), y:(nodeY-35)}, speed || 1000, function(){
      bonus.remove();
      if (fn != undefined) {
        fn();
      }
    });
  }
}
function intro2() {
  $("#statusDiv").html("");
  if (JGenerous.previousStatus == 'A') {
    $("#status").remove();
    $("#title").html("Last round");
    $("#message").html("<p>Round <b>" + JGenerous.returnData.lastRound + "</b> turned out to be the last one in this part</p>"
        + "<p>You have earned <b>" + JGenerous.returnData.firstBonus + "</b> tokens.</p>"
        + "<p>You will now proceed to the final part.</p>");
    $("#navi").html("<div class='navi'><div class='begin'><button id='begin'>Sure!</button></div></div>");
    JGenerous.previousStatus = 'BB';
    $('#begin').click(function(){
      track("Set 1, Round " + JGenerous.returnData.lastRound, "Sure!", 3); 
      $('#begin').attr("disabled", true);
      intro2();
    }); 
    return;
  }
  
  if (JGenerous.returnData.eli == "Yes") {
    $("#title").html("Part 3: Another Try");
    $("#message").html("<p>Ready for another try? You will now be connected to a new pair of MTurk players.</p>"
        + "<p>Just as before, you play a series of rounds, after each round there is a  <b>" 
        + (100 - JGenerous.returnData.poe * 100) 
        + "%</b> chance that the game will continue to the next round, and a  <b>" 
        + (JGenerous.returnData.poe * 100) 
        + "%</b> chance that it will end."
        + "<p>After this part you will receive the results of your robot's performance and your total earnings for all three parts.</p>");
  } else {
    $("#title").html("Part 2: Another Try");
    $("#message").html("<p>Ready for another try? You will now be connected to a new pair of MTurk players.</p>"
        + "<p>Just as before, you play a series of rounds, after each round there is a  <b>" 
        + (100 - JGenerous.returnData.poe * 100) 
        + "%</b> chance that the game will continue to the next round, and a  <b>" 
        + (JGenerous.returnData.poe * 100) 
        + "%</b> chance that it will end."
        + "<p>After this part you will receive your completion bonus based your total earnings from both parts.</p>");
  }
  $("#navi").html("<div class='navi'><div class='begin'><button id='begin'>Let's go!</button></div></div>");
  $("#draw").hide();
  $('#begin').click(function(){
    $('#begin').attr("disabled", true);
    waitOtherPlayer();
    $.ajax({
        type: "POST",
        url: appURL + "/server",
        data: "serverid=" + JGenerous.serverId + "&clientid=" + JGenerous.clientId + "&action=ViewIntro",
        success: function() {
          roundB();
        }
    });
  }); 
}
function intro() {
  JGenerous.geometry["radius"] = 200;
  JGenerous.geometry["myBoxHeight"] = 109
  JGenerous.geometry["myBoxWidth"] = 109; 
  $(".container").parent().parent().show();
  if (JGenerous.returnData.eli == "Yes") {
    $("#title").html("Part 2: Your debut");
    $("#message").html("<p>Terrific! Once all other players finish creating their robots we will connect them and simulate the robot coloring game.</p>"
        + "<p>And now it's your turn! In part 2 you will play the same coloring game with other MTurk players.</p>"
        + "<p>The rules remain unchanged: you play a series of rounds, after each round there is a <b>" 
        + (100 - JGenerous.returnData.poe * 100) 
        + "%</b> chance that the game will continue to the next round, and a <b>" 
        + (JGenerous.returnData.poe * 100) 
        + "%</b> chance that it will end, in which case you would proceed to part 3."
        + "<p>Part 3 is identical to part 2, except that you will be connected to different players.</p>"
        + "<p>Your total earnings will be the sum of your earnings in parts 1, 2, and 3.</p>");
  } else {
    $("#title").html("Part 1: Your debut");
    $("#message").html("<p>In part 1 you play the coloring game with other MTurk players in a series of rounds.</p>"
        + "<p>After each round there is a <b>" 
        + (100 - JGenerous.returnData.poe * 100) 
        + "%</b> chance that the game will continue to the next round, and a <b>" 
        + (JGenerous.returnData.poe * 100) 
        + "%</b> chance that it will end, in which case you would proceed to part 2."
        + "<p>Part 2 is identical to part 1, except that you will be connected to different players.</p>"
        + "<p>Your total earnings will be the sum of your earnings in parts 1 and 2.</p>");
  }
  $("#navi").html("<div class='navi'><div class='begin'><button id='begin'>I'm ready!</button></div></div>");
  $('#begin').click(function(){
    $('#begin').attr("disabled", true);
    waitOtherPlayer();
    $.ajax({
        type: "POST",
        url: appURL + "/server",
        data: "serverid=" + JGenerous.serverId + "&clientid=" + JGenerous.clientId + "&action=ViewIntro",
        success: function() {
          roundA();
        }
    });
  }); 
}
function waitOtherPlayer() {
  if ($("#status").length == 0) {
    $("body").append("<div id='status' class='waiting'>Waiting for the other players...</div>");
  }
  waitingOtherMove = true;
}
function roundA() {
  $("#statusDiv").html("");
  if (JGenerous.returnData.gameStatus == "COOPERATION_ROUND_A") {
    waitToStart = false;
    realRoundA();
  } else {
    waitOtherPlayer();
    waitToStart = true;
    if (JGenerous.returnData.waitTime > 0) {
      JGenerous.waitTime = JGenerous.returnData.waitTime;
      $("#status").append("<br/>(no more than <span id='countdown'>" + JGenerous.returnData.waitTime + "</span> sec)");
      setTimeout("updateWaitTime()", 1000);
    }
  }
}

function roundB() {
  $("#statusDiv").html("");
  if (JGenerous.returnData.gameStatus == "COOPERATION_ROUND_B") {
    waitToStart = false;
    realRoundB();
  } else {
    waitToStart = true;
    waitOtherPlayer();
  }
}

function realRoundA() {
  JGenerous.previousStatus = 'A';
  $("#title").html("Round " + JGenerous.returnData.round);
  if (JGenerous.returnData.round == 1) {
    $("#message").html("<div style='text-align:center'><p>You are now connected to two MTurk players.</p><br/>" +
      "<p>Please choose your first move.</p></div>");
    $("#navi").html("<div class='navi'></div>");
  } else {
    $("#message").html("<div style='text-align:center;'><p>Results of the previous round:</p>");
    var earn = 0;
    var spent = 0;
    var gain = 0;
    for (i=0; i < JGenerous.returnData.relationships.length; i++) {
      if (JGenerous.returnData.relationships[i].lastDecision == 1) {
        earn += JGenerous.returnData.payOff;
      }
    }
    if (JGenerous.returnData.lastMove == 1) {
      earn += JGenerous.returnData.payOff;
      spent = JGenerous.returnData.coc
    }
    gain = earn - spent;
    $("#message").append("<div style='float:left;padding-left: 100px;text-align: left;width: 80px;'>Spent</div><div style='float:left;'><span style='font-weight:bold;'>" + spent + "</span> tokens</div>"); 
    $("#message").append("<div style='clear:left;float:left;padding-left: 100px;text-align: left;width: 80px;'>Received</div><div style='float:left;'><span style='font-weight:bold;'>" + earn + "</span> tokens</div>"); 
    $("#message").append("<div style='clear:left;float:left;padding-left: 100px;text-align: left;width: 80px;'>Net gain</div><div style='float:left;'><span style='font-weight:bold;'>" + gain + "</span> tokens</div>"); 
    $("#message").append("<p style='clear:left;text-align: center;'>Please choose the ring color now.</p></div>");
    $("#navi").html("<div class='navi'></div>");
  }
  plotClient();
  
  if (!JGenerous.returnData.decidedCooperate) {
    cooperationStep();
  } else {
    waitOtherPlayer();
  }
}
function realRoundB() {
  $("#draw").show();
  JGenerous.previousStatus = 'B';
  $("#title").html("Round " + JGenerous.returnData.round);
  if (JGenerous.returnData.round == 1) {
    $("#message").html("<div style='text-align:center'><p>You are now connected to two MTurk players.</p><br/>" +
      "<p>Please choose your first move.</p></div>");
    $("#navi").html("<div class='navi'></div>");
  } else {
    $("#message").html("<div style='text-align:center;'><p>Results of the previous round:</p>");
    var earn = 0;
    var spent = 0;
    var gain = 0;
    for (i=0; i < JGenerous.returnData.relationships.length; i++) {
      if (JGenerous.returnData.relationships[i].lastDecision == 1) {
        earn += JGenerous.returnData.payOff;
      }
    }
    if (JGenerous.returnData.lastMove == 1) {
      earn += JGenerous.returnData.payOff;
      spent = JGenerous.returnData.coc
    }
    gain = earn - spent;
    $("#message").append("<div style='float:left;padding-left: 100px;text-align: left;width: 80px;'>Spent</div><div style='float:left;'><span style='font-weight:bold;'>" + spent + "</span> tokens</div>"); 
    $("#message").append("<div style='clear:left;float:left;padding-left: 100px;text-align: left;width: 80px;'>Received</div><div style='float:left;'><span style='font-weight:bold;'>" + earn + "</span> tokens</div>"); 
    $("#message").append("<div style='clear:left;float:left;padding-left: 100px;text-align: left;width: 80px;'>Net gain</div><div style='float:left;'><span style='font-weight:bold;'>" + gain + "</span> tokens</div>"); 
    $("#message").append("<p style='clear:left;text-align: center;'>Please choose the ring color now.</p></div>");
    $("#navi").html("<div class='navi'></div>");
  }
  plotClient();
  
  if (! JGenerous.returnData.decidedCooperate) {
    cooperationStep();
  } else {
    waitOtherPlayer();
  }
}

function finish() {
  if (JGenerous.returnData.progress == 'feedback'
    || JGenerous.returnData.progress == 'SentFeedback') {
    leaveFeedback();
  } else {
    $("#statusDiv").html("");
    if (JGenerous.previousStatus == 'B') {
      $("#status").remove();
      $("#title").html("Last round");
      $("#message").html("<p>Round <b>" + JGenerous.returnData.lastRound + "</b> turned out to be the last one in this part</p>"
          + "<p>You have earned <b>" + JGenerous.returnData.secondBonus + "</b> tokens.</p>"
          + "<p>Time to get your completion bonus!</p>");
      $("#navi").html("<div class='navi'><div class='begin'><button id='begin'>At last!</button></div></div>");
      $('#begin').click(function(){
        $('#begin').attr("disabled", true);
        track("Set " + (JGenerous.returnData.firstAllocationFinished ? "2" : "1") 
            + ", Round " + JGenerous.returnData.lastRound, "At last!", 3); 
        JGenerous.previousStatus = 'F';
        finish();
      }); 
      return;
    }
    $("#title").html("The End!");
    if (JGenerous.returnData.eli == "Yes") {
      var roundNumber = JGenerous.returnData.minRound + Math.round(Math.random() * 6 - 3);
      var total = JGenerous.returnData.firstBonus + JGenerous.returnData.secondBonus + JGenerous.returnData.bonus;
      $("#message").html("<p>Good news, in a series of <b>" + (JGenerous.returnData.minRound <= 3 ? JGenerous.returnData.minRound : roundNumber) 
          + "</b> rounds of play, your robot "
          + (JGenerous.returnData.robotName || name || 'Robo')
          + " has earned <b>" + JGenerous.returnData.bonus + "</b> tokens.</p>"
          + "<p>Your total earnings, therefore, add up to</p>"
          + "<p style='text-align:center;'><b>" + JGenerous.returnData.firstBonus + " + " + JGenerous.returnData.secondBonus + " + " + JGenerous.returnData.bonus + " = " 
          + (total) + "</b> tokens</p>"
          + "<p>As promised, a completion bonus of</p>"
          + "<p style='text-align:center;'><b>" + total + "</b> tokens x <b>$" 
          + (JGenerous.returnData.exchangeRate) + "</b>/token = <b>" + displayCents(total)
          + "</b></p><p>will be added to your account in addition to the MTurk reward within 14 business days.</p>");
    } else {
      var total = JGenerous.returnData.firstBonus + JGenerous.returnData.bonus;
      $("#message").html("<p>Your total earnings for both parts add up to</p>"
          + "<p style='text-align:center;'><b>" + JGenerous.returnData.firstBonus + " + " + JGenerous.returnData.bonus + " = " 
          + (total) + "</b> tokens</p>"
          + "<p>As promised, a completion bonus of</p>" 
          + "<p style='text-align:center;'><b>" + total + "</b> tokens x <b>$" 
          + (JGenerous.returnData.exchangeRate) + "</b>/token = <b>" + displayCents(total)
          + "</b></p><p> will be added to your account in addition to the MTurk reward within 14 business days.</p>");
    }
    $("#message").append("<p>Please contact us at mturkgroup@gmail.com with any questions or concerns about the game.</p>");
    $("#message").append("<p style='text-align:center;'>Thank you for playing!</p>");
    $("#navi").html("<div class='navi'><div class='begin'><button id='begin'>Leave feedback</button></div></div>");
    $('#begin').click(function(){
      track("Leave feedback", "", 4); 
      $('#begin').attr("disabled", true);
      leaveFeedback();
      progress='feedback';
    });
    JGenerous.shownFinalResults = true;
  }
  $("#draw").hide();
}

function leaveFeedback() {
  $(".container").parent().css("width", "698px");
  $("#title").html("Your Feedback");
  $("#message").html("<p>Please let us know about your experiences during the game. </p>"
      + "<div><div class='fb_left'>How clear were the instructions?</div><div class='fb_right'><div id='fb_instr'></div><span class='leftSliderValue'>Not at all</span><span class='rightSliderValue'>Very clear</span></div></div>"
      + "<div><div class='fb_left'>Did you find the game interesting? </div><div class='fb_right'><div id='fb_inter'></div><span class='leftSliderValue'>Not at all</span><span class='rightSliderValue'>Very interesting</span></div></div>"
      + "<div><div class='fb_left'>How would you characterize the pace of the game? </div><div class='fb_right'><div id='fb_speed'></div><span class='leftSliderValue'>Too slow</span><span class='rightSliderValue'>Too fast</span></div></div>"
      + "<div><div class='fb_left'>What was your strategy during the game? </div><div class='fb_right'><input type='text' id='fb_strat' style='width:400px;'/></div></div>"
      + "<p>What other thoughts do you have about the game? </p>"
      + "<div><textarea id='fb_think' cols='80' rows='5'></textarea></div>"
      + "<div style='clear:both'></div>");
  
  if (JGenerous.returnData.progress == 'SentFeedback') {
    $("#title").html("");
    $("#message").html("<p style='font-size: 18px;font-weight: bold;height: 23px;text-align: center;'>Thank you for your feedback!</p>");
    $("#navi").html("<div class='navi'></div>");
  } else {
    $("#navi").html("<div class='navi'><div class='begin'><button id='begin'>Submit</button></div></div>");
    $('#begin').click(function(){
      progress = 'SentFeedback';
      updateClient();
      track("Submit feedback", "", 5);
      $('#begin').attr("disabled", true);
      var instr = encodeURIComponent($("#fb_instr").slider("option", "value"));
      var inter = encodeURIComponent($("#fb_inter").slider("option", "value"));
      var speed = encodeURIComponent($("#fb_speed").slider("option", "value"));
      var strat = encodeURIComponent($("#fb_strat").val());
      var think = encodeURIComponent($("#fb_think").val());
      $.ajax({
        type: "POST",
        url: appURL + "/server",
        data: "serverid=" + JGenerous.serverId + "&clientid=" + JGenerous.clientId + "&action=SendFeedback"
          + "&instr=" + instr + "&inter=" + inter + "&speed=" + speed + "&strat=" + strat + "&think=" + think ,
        success: function(returnData){
          $("#title").html("");
          $("#message").html("<p style='font-size: 18px;font-weight: bold;height: 23px;text-align: center;'>Thank you for your feedback!</p>");
          $("#navi").html("<div class='navi'></div>");
        }
      });
    });
  }
  var sliderOption = { min: 1, max: 5, value: 1, step: 1 };
  $("#fb_instr").slider(sliderOption);
  $("#fb_inter").slider(sliderOption);
  $("#fb_speed").slider(sliderOption);
}
function track(category, event, weight, order) {
  var trackValue = category;
  if (order != undefined) {
    if (order < 10) {
      trackValue = trackValue + ' 0';
    } else {
      trackValue = trackValue + ' ';
    }
    trackValue = trackValue + order;
  }
  trackValue = trackValue + ' ' + event;
  
  $.ajax({
    type: "POST",
    url: appURL + "/server",
    data: "serverid=" + JGenerous.serverId + "&clientid=" + JGenerous.clientId 
      + "&action=Track" + "&v=" + encodeURIComponent(trackValue)
      + "&w=" + encodeURIComponent(weight)
  });
}
function showEli() {
  if ($("#eli_navi").length == 0) {
    $("#status").remove();
    $("body").append("<div id='status'><div style='margin: 10px auto 0; width: 800px;position:relative;'><div id='eliContainer'>"
      + showBubble("question", "question")
      + "<div class='light' id='light'></div>"
      + showBubbleAnswer("answer", "answer")
      + "<div class='eli_draw' id='eli_draw'></div>"
      + "<div class='robotPoint'><img src='images/robo_show_transp_small.png' style='position:absolute; left: 27px;'/>"
        + "<div style='margin: 194px 0pt 0pt; width: 350px;'>"
          + "<div class='titlel'></div><div class='titler'></div><div id='eli_title' class='title'></div>"
          + "<table cellpadding='0' cellspacing='0' border='0' width='100%'><tr>"
            + "<td class='bordersidel'></td>"
            + "<td><div style='height:80px;background:#f5f5f5;'></div></td>"
            + "<td class='bordersider'></td></tr></table>"
          + "<div class='navil'></div><div class='navir'></div><div id='navi'><div class='navi'></div></div>"
      + "</div></div>"
      + "<div class='orangeBox' style='top:107px;'>"
          + "<div class='titlel'></div><div class='titler'></div><div id='eli_title' class='title'></div>"
          + "<table cellpadding='0' cellspacing='0' border='0' width='100%'><tr>"
            + "<td class='bordersidel'></td>"
            + "<td style='background:#f5f5f5;font-size:16px;text-align:center;white-space:nowrap;'><div style='height:60px;'><img src='images/orange_ring_big_shadow_tr.png'/></div>&mdash;Pick Orange!</td>"
            + "<td class='bordersider'></td></tr></table>"
          + "<div class='navil'></div><div class='navir'></div><div id='navi'><div class='navi'></div></div>"
      + "</div><div  class='blueBox' style='top:287px;'>"
          + "<div class='titlel'></div><div class='titler'></div><div id='eli_title' class='title'></div>"
          + "<table cellpadding='0' cellspacing='0' border='0' width='100%'><tr>"
            + "<td class='bordersidel'></td>"
            + "<td style='background:#f5f5f5;font-size:16px;text-align:center;'><div style='height:60px;'><img src='images/blue_ring_big_shadow_tr.png'/></div>&mdash;Pick Blue!</td>"
            + "<td class='bordersider'></td></tr></table>"
          + "<div class='navil'></div><div class='navir'></div><div id='navi'><div class='navi'></div></div>"
        + "</div></div>"
        + "<div id='eli_navi'>"
          + "<div id='back' class='back'></div>"
          + "<div class='outerCell'><div class='caption'>First Move</div><div id='cell1' class='cell' style='cursor:pointer;'></div></div>"
          + "<div class='outerCell'><div class='caption'>Case 1</div><div id='cell2' class='cell'></div></div>"
          + "<div class='outerCell'><div class='caption'>Case 2</div><div id='cell3' class='cell'></div></div>"
          + "<div class='outerCell'><div class='caption'>Case 3</div><div id='cell4' class='cell'></div></div>"
          + "<div class='outerCell'><div class='caption'>Case 4</div><div id='cell5' class='cell'></div></div>"
          + "<div class='outerCell'><div class='caption'>Case 5</div><div id='cell6' class='cell'></div></div>"
          + "<div class='outerCell'><div class='caption'>Case 6</div><div id='cell7' class='cell'></div></div>"
          + "<div class='outerCell'><div class='caption'>Case 7</div><div id='cell8' class='cell'></div></div>"
          + "<div class='outerCell'><div class='caption'>Case 8</div><div id='cell9' class='cell'></div></div>"
          + "<div id='next' class='next'></div>"
        + "</div>"
      + "</div></div>");
    $("#answer").hide();
    $(".orangeBox").click(function(){
      var eli = 22 - JGenerous.tutorialStep;
      $(".orangeBox").hide();
      $(".blueBox").hide();
      $("#question").hide();
      $("#light").html("<img src='images/orange_ring_big_shadow.png'/>");
      $("#light").show();
      $("#answer").show();
      setTimeout("$(\"#next\").attr(\"class\", \"next blink\");", 1000);
      if (JGenerous.tutorialStep == 14) {
        track("Elicitation", "First Move: Cooperate", 2, (JGenerous.tutorialStep - 10));
        JGenerous.eliFirstMove = 1;
      } else {
        track("Elicitation", "Case " + (8 - eli) + " Cooperate", 2, (JGenerous.tutorialStep - 10));
        JGenerous.eliMemoryMinus1[8 - eli - 1] = 1;
      }
      $("#next").css("cursor", "pointer");
      
      if (JGenerous.tutorialStep == 14) {
        $("#cell1").css("cursor", "pointer");
        $("#cell1").click(function() {
          tutorialRevise(14);
        });
        if (JGenerous.eliFirstMove == 1) {
          $("#cell1").css("backgroundPosition", "0 -80px"); 
        } else {
          $("#cell1").css("backgroundPosition", "0 0"); 
        }
      } else if (maxTutorial >= 15 && maxTutorial <= 22){
        $("#cell" + (8 - eli +1)).css("cursor", "pointer");
        $("#cell" + (8 - eli +1)).click(function() {
          tutorialRevise(14 + (8 - eli));
        });
        if (JGenerous.eliMemoryMinus1[8 - eli - 1] == 1) {
          $("#cell" + (8 - eli + 1)).css("backgroundPosition", ((8 - eli) * -68) + "px -80px"); 
        } else {
          $("#cell" + (8 - eli + 1)).css("backgroundPosition", ((8 - eli) * -68) + "px 0"); 
        } 
      }
      
      if (JGenerous.tutorialStep == maxTutorial && maxTutorial < 22) {
        // make the first blank cell clickable
        var step = JGenerous.tutorialStep + 1;
        $("#cell" + (maxTutorial - 12)).css("cursor", "pointer");
        $("#cell" + (maxTutorial - 12)).click(function() {
          tutorial(step);
        });
      }
    });

    $(".blueBox").click(function(){
      var eli = 22 - JGenerous.tutorialStep;
      $(".orangeBox").hide();
      $(".blueBox").hide();
      $("#question").hide();
      $("#light").html("<img src='images/blue_ring_big_shadow.png'/>");
      $("#light").show();
      $("#answer").show();
      setTimeout("$(\"#next\").attr(\"class\", \"next blink\");", 1000);
      if (JGenerous.tutorialStep == 14) {
        track("Elicitation", "First Move: DoNotCooperate", 2, (JGenerous.tutorialStep - 10));
        JGenerous.eliFirstMove = 0;
      } else {
        track("Elicitation", "Case " + (8 - eli) + " DoNotCooperate", 2, (JGenerous.tutorialStep - 10));
        JGenerous.eliMemoryMinus1[8 - eli - 1] = 0;
      }
      $("#next").css("cursor", "pointer");
      
      if (JGenerous.tutorialStep == 14) {
        $("#cell1").css("cursor", "pointer");
        $("#cell1").click(function() {
          tutorialRevise(14);
        });
        if (JGenerous.eliFirstMove == 1) {
          $("#cell1").css("backgroundPosition", "0 -80px"); 
        } else {
          $("#cell1").css("backgroundPosition", "0 0"); 
        }
      } else if (maxTutorial >= 15 && maxTutorial <= 22){
        $("#cell" + (8 - eli +1)).css("cursor", "pointer");
        $("#cell" + (8 - eli +1)).click(function() {
          tutorialRevise(14 + (8 - eli));
        });
        if (JGenerous.eliMemoryMinus1[8 - eli - 1] == 1) {
          $("#cell" + (8 - eli + 1)).css("backgroundPosition", ((8 - eli) * -68) + "px -80px"); 
        } else {
          $("#cell" + (8 - eli + 1)).css("backgroundPosition", ((8 - eli) * -68) + "px 0"); 
        } 
      }
      
      if (JGenerous.tutorialStep == maxTutorial && maxTutorial < 22) {
        // make the first blank cell clickable
        var step = JGenerous.tutorialStep + 1;
        $("#cell" + (maxTutorial - 12)).css("cursor", "pointer");
        $("#cell" + (maxTutorial - 12)).click(function() {
          tutorial(step);
        });
      }
    });
    
    $("#next").click(function() {
      if (JGenerous.tutorialStep + 1 < maxTutorial) { // reviewing state
        tutorialRevise(JGenerous.tutorialStep + 1)
      } else if (JGenerous.tutorialStep + 1 == maxTutorial) { // state not sure
        var eli = 22 - (JGenerous.tutorialStep + 1);
        if (JGenerous.eliMemoryMinus1[8 - eli - 1] == undefined) {
          $("#light").hide();
          $("#answer").hide();
          tutorial(JGenerous.tutorialStep + 1);
          $(".orangeBox").show();
          $(".blueBox").show();
          $("#question").show();
        } else {
          tutorialRevise(JGenerous.tutorialStep + 1)
        }
      } else { // state newest
        if (JGenerous.tutorialStep == 14) {
          if (JGenerous.eliFirstMove != undefined) {// only move next if user entered data
            $("#next").attr("class", "next");
            
            $("#light").hide();
            $("#answer").hide();
            tutorial(JGenerous.tutorialStep + 1);
            $(".orangeBox").show();
            $(".blueBox").show();
            $("#question").show();
            
            if (JGenerous.eliMemoryMinus1[8 - eli - 1] == 1) {
              $("#cell" + (8 - eli + 1)).css("backgroundPosition", ((8 - eli) * -68) + "px -80px"); 
            } else {
              $("#cell" + (8 - eli + 1)).css("backgroundPosition", ((8 - eli) * -68) + "px 0"); 
            } 
          }
        } else if (maxTutorial >= 15 && maxTutorial <= 22){
          var eli = 22 - JGenerous.tutorialStep;
          if (JGenerous.eliMemoryMinus1[8 - eli - 1] != undefined) {// only move next if user entered data
            $("#next").attr("class", "next");
            
            $("#light").hide();
            $("#answer").hide();
            tutorial(JGenerous.tutorialStep + 1);
            $(".orangeBox").show();
            $(".blueBox").show();
            $("#question").show();
          }
        }
      }
    });
    
    $("#back").click(function() {
      if (JGenerous.tutorialStep - 1 < 14) { 
        return;
      } 
      tutorialRevise(JGenerous.tutorialStep - 1)
    });
  }
  
  if (JGenerous.tutorialStep == 14) {
    $("#back").css("visibility", "hidden");
  } else {
    $("#back").css("visibility", "visible");
  }
  
  $("#light").hide();
  $("#next").show();
  $("#question").attr("class", "question");
  $("#question").width(400);
  $("#question").show();
  $("#answer").hide();
  $(".orangeBox").show();
  $(".blueBox").show();
  $("#eli_navi").attr("class", "step" + (9 - (22 - JGenerous.tutorialStep)));
}
function escapeHTML(s) {
  var MAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&#34;',
    "'": '&#39;'
  };
  s = s.replace(/&/g, '&amp;');
  s = s.replace(/</g, '&lt;');
  s = s.replace(/>/g, '&gt;');
  s = s.replace(/'/g, '&#34;');
  s = s.replace(/"/g, '&#39;');
  return s;
}
function showBubble(className, id) {
  var r = "<div class='" + className + "' id='" + id + "'>"
  + "<div class='titlelessl'></div><div class='titlelessr'></div><div id='title' class='titleless'></div>"
  + "<table cellpadding='0' cellspacing='0' border='0' width='100%' style='background:#f5f5f5;'><tr>"
    + "<td class='bordersidel'></td>"
    + "<td><div id='" + id + "_content'></div></td>"
    + "<td class='bordersider'></td>"
  + "</tr></table>"
  + "<div class='bubblel'></div><div class='bubbler'></div><div class='bubble'></div>"
  + "</div>";
  return r;
}
function showBubbleAnswer(className, id) {
  var r = "<div class='" + className + "' id='" + id + "'>"
  + "<table cellpadding='0' cellspacing='0' border='0' width='100%'><tr>"
    + "<td class='bordersidel'></td>"
    + "<td class='bordersidec'><div id='" + id + "_content'></div></td>"
    + "<td class='bordersider'></td>"
  + "</tr></table>"
  + "</div>";
  return r;
}

originalTitle=document.title;
titleBlinking = false;
//functions to blink the title of the page with a message
function blinkTitle(message) {
  blinkingTitle(message, true);
}
function blinkingTitle(message, blink) {
  if (waitingUserMove && !waitingOtherMove) {
    if (blink) {
      document.title = message;
    } else {
      document.title = originalTitle;
    }
    blinkTimer = setTimeout("blinkingTitle('" + message + "', "
        + !blink + ")", 1000);
    titleBlinking = true;
  } else {
    titleBlinking = false;
    document.title = originalTitle;
  }
}

function updateWaitTime() {
  if ($("#countdown").length > 0) {
    $("#countdown").html(--JGenerous.waitTime);
    setTimeout("updateWaitTime()", 1000);
  }
}

function preloadImages() {
  if ($("#preloadImage").length == 0 && JGenerous.returnData.eli == "Yes") {
    $("body").append("<div id='preloadImage' style='display:none;'></div>");
    $("#preloadImage").append("<img src='images/robo_hi_small.jpg'/>");
    $("#preloadImage").append("<img src='images/robo_show_transp_small.png'/>");
    $("#preloadImage").append("<img src='images/robo_side_small.jpg'/>");
    $("#preloadImage").append("<img src='images/robo_zen_small.jpg'/>");
    $("#preloadImage").append("<img src='images/eli.png'/>");
  }
}
function firstStep() {
  progress = 1;
  // Generate a network with three nodes
  JGenerous.returnData.relationships = [{id:1, lastDecision:-1, connected: true, change: false}, {id: 2, lastDecision:-1, connected:true, change:false}];
  $("#message").html("<div style='text-align:center'>" +
      "<p> This tutorial will quickly teach you how to play.</p></div>");
  $("#navi").html("<div class='navi'><div class='begin'><button id='begin'>Begin</button></div></div>");
  $("body").append('<div class="welcome" id="status"><p style="padding-bottom: 20px; font-size: 18px;">'
      + 'Welcome to the</p><p style="font-weight: bold; font-size: 21px;">Network <span class="orange">Coloring</span> <span class="blue">Game</span>!</p></div>');
  $('#begin').click(function(){
    track("Tutorial", "0 Begin", 1);
    $('#begin').attr("disabled", true);
    JGenerous.tutorialStep++;
    tutorial(JGenerous.tutorialStep);
    $("#status").remove();
  });
}
function initSlotMachine(slotMachine, header, threshold) {
  var w = 162;
  var curlyLimit = 18;
  var thresholdInt = parseInt(threshold, 10);
  for (var a = 1; a <= 3; a++) {
    $("#" + slotMachine + " #slot" + a).css("backgroundColor", "");
    $("#" + slotMachine + " #slot" + a).css("color", "#909090");
    $("#" + slotMachine + " #slot" + a).html("0");
  }
  $("#" + slotMachine).attr("class", "slotMachine inactive");
  $("#" + slotMachine + " .scaleNo").attr("class", "scaleNo");
  $("#" + slotMachine + " #curlyNo").attr("class", "curly");
  $("#" + slotMachine + " .no").attr("class", "no");
  $("#" + slotMachine + " .scaleYes").attr("class", "scaleYes");
  $("#" + slotMachine + " #curlyYes").attr("class", "curly");
  $("#" + slotMachine + " .yes").attr("class", "yes");
  
  $("#" + slotMachine + " #header1").html(header);
  $("#" + slotMachine + " .thresholdChance").html(threshold);
  
  var thresholdLeft = thresholdInt / 1000 * w;
  $("#" + slotMachine + " .thresholdChance").css("left", (thresholdLeft + 2) + "px");
  $("#" + slotMachine + " .scaleNo").width(thresholdLeft + "px");
  $("#" + slotMachine + " #curlyNo").width(thresholdLeft + "px");
  if (thresholdLeft >= curlyLimit) {
    $("#" + slotMachine + " #curlyNo").attr("class", "curly");
  } else {
    $("#" + slotMachine + " #curlyNo").attr("class", "curly vertical");
  }
  $("#" + slotMachine + " .no").css("left", (thresholdLeft / 2) + "px");
  $("#" + slotMachine + " .scaleYes").width((w - thresholdLeft) + "px");
  $("#" + slotMachine + " #curlyYes").width((w - thresholdLeft) + "px");
  if (w - thresholdLeft >= curlyLimit) {
    $("#" + slotMachine + " #curlyYes").attr("class", "curly");
  } else {
    $("#" + slotMachine + " #curlyYes").attr("class", "curly vertical");
  }
  thresholdLeft += 3;// the white stick width is 3px;
  $("#" + slotMachine + " .scaleYes").css("left", (thresholdLeft) + "px");
  $("#" + slotMachine + " #curlyYes").css("left", (thresholdLeft) + "px");
  $("#" + slotMachine + " .yes").css("left", (thresholdLeft + (w - thresholdLeft) / 2) + "px");
  $("#" + slotMachine).show();
}
function spinem(slotMachine, number, chance, statement) {
  var occur = parseInt(number, 10) >= chance * 1000;
  var times = [];
  for (var a = 1; a <= 3; a++) {
    times[a] = (4 - a) * 10 + parseInt(number.substring(a - 1, a), 10);
  }
  for (var a = 1; a <= 3; a++) {
    spinChangeImage(slotMachine, number, parseInt(number.substring(a - 1, a), 10), times[a], a, occur, statement);
  }
}
function spinChangeImage(slotMachine, number, current, turns, digit, occur, statement) {
  $("#" + slotMachine + " #slot" + digit).html(current % 10);
  if (current + 1 <= turns) {
    setTimeout("spinChangeImage('" + slotMachine + "', " + number + "," + (current + 1) + ", " + turns + ", '" + digit + "'," + occur + ",'" + statement + "')", 50);
  } else {
    $("#" + slotMachine + " #slot" + digit).css("color", "black");
    if (digit == 1) {
      colorSlotMachine(slotMachine, occur, number, statement);
    }
  }
}
function colorSlotMachine(slotMachine, occur, number, statement) {
  $("#" + slotMachine + " .realChance").html(number);
  var w = 162;
  var realChanceInt = parseInt(number, 10);
  var realChanceLeft = realChanceInt / 1000 * w + 1;
  $("#" + slotMachine + " .realChance").css("left", realChanceLeft + "px");
  if (occur) {
    $("#" + slotMachine + " #curlyYes").toggleClass("occur");
    $("#" + slotMachine + " .yes").toggleClass("occur");
    $("#" + slotMachine + " .scaleYes").toggleClass("occur");
  } else {
    $("#" + slotMachine + " #curlyNo").toggleClass("occur");
    $("#" + slotMachine + " .no").toggleClass("occur");
    $("#" + slotMachine + " .scaleNo").toggleClass("occur");
  }
  $("#" + slotMachine).toggleClass("inactive", false);
  $("#" + slotMachine).toggleClass("active", true);
  statement && setTimeout("" + statement, 1000);
}
function showCurrentRoundChoice() {
  var earn = 0;
  var spent = 0;
  var gain = 0;
  for (i=0; i < JGenerous.returnData.relationships.length; i++) {
    if (JGenerous.returnData.relationships[i].lastDecision == 1) {
      earn += JGenerous.returnData.payOff;
    }
  }
  if (JGenerous.returnData.lastMove == 1) {
    earn += JGenerous.returnData.payOff;
    spent = JGenerous.returnData.coc
  }
  gain = earn - spent;
  $("#title").append("Round " + JGenerous.returnData.round); 
  $("#message").append("<p style='clear:left;text-align: center;'>You chose the " + (JGenerous.returnData.lastMove == 1 ? "<span class='orange'>orange</span>" : "<span class='blue'>blue</span>") + " ring.</p>"); 
  $("#message").append("<div style='float:left;padding-left: 100px;text-align: left;width: 80px;'>Spent</div><div style='float:left;'><span style='font-weight:bold;'>" + spent + "</span> tokens</div>"); 
  $("#message").append("<div style='clear:left;float:left;padding-left: 100px;text-align: left;width: 80px;'>Received</div><div style='float:left;'><span style='font-weight:bold;'>" + earn + "</span> tokens</div>"); 
  $("#message").append("<div style='clear:left;float:left;padding-left: 100px;text-align: left;width: 80px;'>Net gain</div><div style='float:left;'><span style='font-weight:bold;'>" + gain + "</span> tokens</div>"); 
  $("#navi").html("<div class='navi'></div>");
}
function shownPayoff() {
  $.ajax({
      type: "POST",
      url: appURL + "/server",
      data: "serverid=" + JGenerous.serverId + "&clientid=" + JGenerous.clientId + "&action=ShowPayoff&round=" + JGenerous.returnData.round
  });
}
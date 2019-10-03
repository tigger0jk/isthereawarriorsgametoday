var teamName = 'Warriors';
basePath = './';

// Try to auto-detect if we're in a different subdomain to load a different team
teamPath = window.location.pathname.replace(/\//g, "");
if(teamPath.length > 0) {
  // if our team name has a space (lookin at you Trail Blazers) we need to convert the %20 to a space
  teamName = decodeURIComponent(teamPath);
  // currently other teams are site.com/teamName instead of just site.com
  // so our path is up one level from normal
  basePath = '../';
  // console.log(teamName);
}

// Compare just the year/month/day part of the date, ignore time of day
function isDateLaterThan(a, b) {
  if(a.getYear() != b.getYear()) {
    return a.getYear() > b.getYear();
  }
  if(a.getMonth() != b.getMonth()) {
    return a.getMonth() > b.getMonth();
  }
  if(a.getDate() != b.getDate()) {
    return a.getDate() > b.getDate();
  }
  return false;
}

function GetFormattedDate(date) {
  month = date.getMonth() + 1;
  dayOfMonth = date.getDate();
  return month+ "/" + dayOfMonth;
}

function GetFormattedDateWithWeekday(date) {
  var weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  dayOfWeek = weekdays[date.getDay()];
  return dayOfWeek + ", " + GetFormattedDate(date);
}

function GetTimeFromDate(date) {
  function pad(n){return n<10 ? '0'+n : n;}
  hour = date.getHours();
  minute = date.getMinutes();
  period = "am";
  if (hour >= 12) {
    period = "pm";
  }
  if (hour > 12) {
    hour = hour % 12;
  }
  if(hour == 0) {
    // midnight, hope there aren't games at this time
    hour = 12;
    period = "am";
  }
  return hour + ":" + pad(minute) + period;
}

function populateNextGame(nextGame) {
  if (nextGame.hn == teamName) {
    // next game is home
    $("#next .myteam").text(nextGame.hn);
    $("#next .homeawayvs").text(" at home vs the ");
    $("#next .opponent").text(nextGame.vn);
  } else {
    $("#next .myteam").text(nextGame.vn);
    $("#next .homeawayvs").text(" away at the ");
    $("#next .opponent").text(nextGame.hn);
  }
  //add small text for next game
  $("#next .next-location").text(nextGame.an);
  $("#next .nstart").text(nextGame.time);
  $("#next .next-day").text(GetFormattedDateWithWeekday(nextGame.date));
  $("#next").show();
}

$(document).ready(function(){
  var url = basePath + 'data/' + teamName + '_schedule.json';

  var today = new Date();
  // var today = new Date(2019, 9, 5, 0, 0, 0, 0); // preseason :o
  // var today = new Date(2019, 9, 7, 0, 0, 0, 0); // preseason :o
  // var today = new Date(2019, 9, 8, 0, 0, 0, 0); // preseason :o
  // var today = new Date(2019, 9, 10, 0, 0, 0, 0); // preseason :o
  // var today = new Date(2019, 9, 11, 0, 0, 0, 0); // preseason :o
  // var today = new Date(2019, 9, 22, 0, 0, 0, 0); // raptors first game day for testing
  // var today = new Date(2019, 9, 23, 0, 0, 0, 0); // blazers first game day for testing
  // var today = new Date(2019, 9, 24, 0, 0, 0, 0); // first game day for testing
  // var today = new Date(2019, 9, 25, 0, 0, 0, 0); // after first game day for testing
  // var today = new Date(2019, 9, 26, 0, 0, 0, 0); // after first game day for testing
  // var today = new Date(2019, 9, 27, 8, 0, 0, 0); // second game day for testing
  // var today = new Date(2019, 9, 30, 8, 0, 0, 0); // wizards first home game this far out :o
  // var today = new Date(2020, 0, 24, 0, 0, 0, 0); // 2020 Paris Game, Bucks vs Hornets - game is at 8PM CET (3PM EST, 2PM Central)
  var nextGame = null;
  var todaysGame = null;

  // Check for game today
  $.getJSON(url, function(json){
    var nextGameDate;

    $.each(json.games,function(i,game){
      game.date = new Date(game.d);
      game.time = GetTimeFromDate(game.date);
      nextGameDate = game.date;

      // Uncomment for debugging
      // console.log("Today: " + today + " - Looking at game: " + nextGameDate);

      if (!nextGame && isDateLaterThan(nextGameDate, today)){
        nextGame = game;
        // console.log("set first game: ");
        // console.log(nextGame);
        return false; // break the loop
      }

      if(today.getYear() == nextGameDate.getYear() && today.getMonth() == nextGameDate.getMonth() && today.getDate() == nextGameDate.getDate()) {
        todaysGame = game;
        nextGame = json.games[i+1];
        nextGame.date = new Date(nextGame.d);
        nextGame.time = GetTimeFromDate(nextGame.date);
        // console.log("set a different game: ");
        // console.log(todaysGame);
        // console.log(nextGame);
        return false; // break the loop
      }
    });


    if (todaysGame) {
      $(".fill-in").text("YES");
      $("#game .location").text(todaysGame.an);
      $("#yesno .tstart").text(todaysGame.time);

      if (todaysGame.hn == teamName) {
        // today's game is a home game, since our team is home the visitors are who we play
        $("body").addClass("home");
        $("#yesno .homeaway").text("At home");
        $("#yesno .opponent").text(todaysGame.vn);
      } else {
        $(".separator").toggleClass("separator").toggleClass("awayseparator");
        $(".homelink").toggleClass("homelink").toggleClass("awaylink");
        $("body").toggleClass("away");
        // away game, since our team is away the home team is who we play
        $("body").addClass("away");
        $("#yesno .homeaway").text("Away");
        $("#yesno .opponent").text(todaysGame.hn);
      }
      $("#yesno .vsthe").text(" vs the ");
      $("#yesno .attime").text(" at ");
      $("#game").show();
      populateNextGame(nextGame);
    } else {
      $(".separator").toggleClass("separator").toggleClass("awayseparator");
      $(".homelink").toggleClass("homelink").toggleClass("awaylink");
      $("body").toggleClass("away");
      $(".fill-in").text("NO");
      $("#yesno .todaydesc").remove();
      populateNextGame(nextGame);
    }
  });
});

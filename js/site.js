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

function GetFormattedDateWithWeekday(moment) {
  return moment.format('dddd, MM/DD')
}

function GetTimeFromDate(moment) {
  return moment.format('h:mma')
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

  var today = moment();
  var nextGame = null;
  var todaysGame = null;

  // Check for game today
  $.getJSON(url, function(json){
    var nextGameDate;

    $.each(json.games,function(i,game){
      game.date = moment(game.d);
      game.time = GetTimeFromDate(game.date);
      nextGameDate = game.date;

      // Uncomment for debugging
      // console.log("Today: " + today + " - Looking at game: " + nextGameDate);

      if (!nextGame && nextGameDate.isAfter(today)){
        nextGame = game;
        // console.log("set first game: ");
        // console.log(nextGame);
        return false; // break the loop
      }

      if(today.isSame(nextGameDate, 'day')) {
        todaysGame = game;
        nextGame = json.games[i+1];
        nextGame.date = moment(nextGame.d);
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

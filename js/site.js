var teamName = 'Warriors';

function isDateLaterThan(a, b) {
  if(a.getYear() > b.getYear()) {
    return true;
  }
  if(a.getMonth() > b.getMonth()) {
    return true;
  }
  if(a.getDate() > b.getDate()) {
    return true;
  }
  return false;
}

/* from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date */
function ISODateString(d){
    function pad(n){return n<10 ? '0'+n : n;}
    return d.getUTCFullYear()+'-'+ pad(d.getUTCMonth()+1)+'-'+ pad(d.getUTCDate());
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
  $("#next .nstart").text(nextGame.time);// todo should this say "at X:XX"?
  $("#next .next-day").text(GetFormattedDateWithWeekday(nextGame.date));
  $("#next").show();
}

$(document).ready(function(){
    var url = 'data/' + teamName + '_schedule.json';

    var today = new Date();
    // TODO remove some of these
    // var today = new Date(2019, 9, 24, 0, 0, 0, 0); //first game day for testing
    // var today = new Date(2019, 9, 25, 0, 0, 0, 0); //after first game day for testing
    // var today = new Date(2019, 9, 27, 8, 0, 0, 0); //second game day for testing
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
            console.log("Today: " + today + " - Looking at game: " + nextGameDate);

          if (!nextGame && isDateLaterThan(nextGameDate, today)){
            nextGame = game;
            console.log("set first game: ");
            console.log(nextGame);
            return false; // break the loop
          }

            if(today.getYear() == nextGameDate.getYear() && today.getMonth() == nextGameDate.getMonth() && today.getDate() == nextGameDate.getDate()) {
              todaysGame = game;
              nextGame = json.games[i+1];
              nextGame.date = new Date(nextGame.d);
              nextGame.time = GetTimeFromDate(nextGame.date);
              console.log("set a different game: ");
              console.log(todaysGame);
              console.log(nextGame);
              return false; // break the loop
            }
        });


        if (todaysGame) {
            $(".fill-in").text("YES");
            $("#game .location").text(todaysGame.an);
            $("#yesno .tstart").text(todaysGame.time);

            $("#game abbr").attr('title', ISODateString(nextGame.date));
            if (todaysGame.hn == teamName) {
                // today's game is a home game, since our team is home the visitors are who we play
                $("body").addClass("home");
                $("#yesno .homeaway").text("At home");
                $("#yesno .opponent").text(todaysGame.vn);
             }
             else {
                // away game, since our team is away the home team is who we play
                $("body").addClass("away");
                $("#yesno .homeaway").text("Away");
                $("#yesno .opponent").text(todaysGame.hn);
                $("#yesno").css("border-color", "#000"); // todo shouldn't this #000 be in css somewhere?
             }
            $("#yesno .vsthe").text(" vs the ");
            $("#yesno .attime").text(" at ");
            $("#game").show();
            populateNextGame(nextGame);
        }
        else {
          $(".fill-in").text("NO");
          $("#yesno .todaydesc").remove();
          populateNextGame(nextGame);
        }
    });
});

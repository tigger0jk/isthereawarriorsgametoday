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

$(document).ready(function(){
    var url = 'data/' + teamName + '_schedule.json';

    var today = new Date();
    // TODO remove some of these
    // var today = new Date(2019, 9, 24, 0, 0, 0, 0); //first game day for testing
    // var today = new Date(2019, 9, 25, 0, 0, 0, 0); //after first game day for testing
    // var today = new Date(2019, 9, 27, 8, 0, 0, 0); //second game day for testing
    var nextGame = null;
    var todaysGame = null;

    // TODO clean this up?
    // Format date as MM/DD/YY
    // var curr_date = today.getDate();
    // var curr_month = today.getMonth() + 1;
    // var curr_year = today.getFullYear();
    // var dateString = curr_month + "/" + curr_date + "/" + curr_year;

    // Create datepicker
    // $("#datecheck").html('Checking <input id="datepicker" type="text">');
    // $("#datepicker").datepicker();
// 
    // $(".datepicker").datepicker.("setDate", dateString);

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
            $("#game .tstart").text(todaysGame.time);

            $("#game abbr").attr('title', ISODateString(nextGame.date));
            if (todaysGame.hn == teamName) {
                // home game, since our team is home the visitors are who we play
                $("#game .summary").text(teamName + " play the " + todaysGame.vn);
                $("body").addClass("home");
                $("#yesno .homeaway").text("At home");
             }
             else {
                // away game, since our team is away the home team is who we play
                $("#game .summary").text(teamName + " play the " + todaysGame.hn);
                $("body").addClass("away");
                $("#yesno .homeaway").text("Away");
                $("#yesno").css("border-color", "#000");
             }
            $("#game").show();

            //add small text for next game
            $("#next .next-location").text(nextGame.an);
            $("#next .nstart").text(nextGame.time);
            $("#next .next-day").text(GetFormattedDateWithWeekday(nextGame.date));
            $("#next").show();

        }
        else {
          $(".fill-in").text("NO");
          // console.log(ISODateString(nextGame.date));
          // $("#game .date").text(ISODateString(nextGame.date)); // TODO this is unused??
          if (nextGame.hn == teamName) {
            // home game, since our team is home the visitors are who we play
            $("#game .summary").text(teamName + " will play the " + nextGame.vn);
            // $("#nextgame .location").addClass("homegame");
            // $("body").addClass("homegame-bg");
          } else {
            // away game, since our team is away the home team is who we play
            $("#game .summary").text(teamName + " will play the " + nextGame.hn);
          }
          $("#game .location").text(nextGame.an);

          $("#game .day").text("on " + GetFormattedDateWithWeekday(nextGame.date));
          $("#game .tstart").text(nextGame.time);
          $("#game").show();
        }
    });
});

# Is there a Warriors game tonight?

This readme shares some content from the project it's forked from, http://github.com/lforrest/isthereagiantsgametoday

Big thanks to that project for inspiring and easing the creation of this one

## Getting the code

To get a local copy of the current code, clone it using git:

    $ git clone git://github.com/tigger0jk/isthereawarriorsgametonight.git isthereawarriorsgametonight

    $ cd isthereawarriorsgametonight

## Running the code

Open the JavaScript console in Google Chrome:

option + command + J

If you get this error:

XMLHttpRequest cannot load file:/// ... Warriors_schedule.json. Origin null is not allowed by Access-Control-Allow-Origin.

It's because you're trying to open the page without a web server running. To test your changes locally, you will need to start up Apache. If you're on OS X, you probably already have it preinstalled. You can also try MAMP.

To update the schedule(s), run `python updateSchedules.py` (see comments in that file, the year may need to be updated). This will pull the schedule from the NBA and put it into a better format for us. If you're running your own version of the site, you may want to do this semi-regularly on a cron to pick up scheduling changes (especially during playoffs).

## Things that you need to do to run a single serving site for your specific team:
Maybe you paid for your own single serving domain or just don't like the version I'm running at http://isthereagametonight.com/<yourTeam>, here's what you can do if you only care about running your specific team at the root (like I'm doing at http://isthereawarriorsgametonight.com)
* Modify the `makeTeamRoot.py` script with your relevant site name, about URI and team info
* Run the script `python3.5 makeTeamRoot.py`
* Change the `teamName` var in `js/site.js` at the top to be your team name
* Make your own about page that you referenced above or modify one of the existing ones
* If you're on your own fork you can commit and push those changes

The times listed on the site show the game time in the chosen team's home time zone, even for away games. This works automatically even if you change the team, their local home time is in the NBA data set.

## Contributing

isthereawarriorsgametonight.com is a community-driven project, so contributors are always welcome. Simply fork our repo and contribute away. Feel free to make a fork for your favorite team!

Log issues (or look to address them 😮) in our issues page:
    https://github.com/tigger0jk/isthereawarriorsgametonight/issues

If you don't want to hack on the project or have little spare time, you still can help! Just open http://isthereawarriorsgametonight.com report any issues you see.

## TODOs
* TODO ;)
* Move TODOs / issues from my own notes into here / github issues page
* In `updateSchedules.py` the schedule year is hardcoded as 2019, see TODO in that class.

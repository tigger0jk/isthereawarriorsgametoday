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

## Things that are currently hardcoded for the Warriors / things you have to do for another team:
* Add or replace the team in the `updateSchedules.py` variable `TEAMS_TO_UPDATE_NAMES_AND_SITES` - this name must match the exact NBA json team name
* run `python updateSchedules.py` to generate the schedule for your team
* Make a subdirectory for your team with the name exactly matching the exact NBA json team name
* add a css override for your team in `css/<team>.css` - copy paste an existing one or rename it and swap the colors and font (the default font probably makes more sense than copperplate unless you're the warriors). Can override other stuff as desired
* copy `index.html` from /Warriors/ or another team directory into your subdirectory.
* modify that `index.html` to remove references to warriors or that team - most of the meta attributes need to change and a few hardcoded pieces of text
* include your css file in your new `index.html` instead of the warriors css
* update `about.html`
* update `manifest.webapp` - TODO this should be in subdirectories I think

The times listed on the site show the game time in the chosen team's home time zone, even for away games. This works automatically even if you change the team, their local home time is in the NBA data set.

## Contributing

isthereawarriorsgametonight.com is a community-driven project, so contributors are always welcome. Simply fork our repo and contribute away. Feel free to make a fork for your favorite team!

Log issues (or look to address them 😮) in our issues page:
    https://github.com/tigger0jk/isthereawarriorsgametonight/issues

If you don't want to hack on the project or have little spare time, you still can help! Just open http://isthereawarriorsgametonight.com report any issues you see.

## TODOs
* TODO ;)
* Move TODOs / issues from my own notes into here / github issues page

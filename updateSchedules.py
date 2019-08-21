# This script downloads the NBA json schedule from their website
# and parses out the data we care about into a better format for us
# It generates a JSON schedule in our own format for the teams we want,
# see the TEAMS_TO_UPDATE_NAMES_AND_SITES variable and add/change teams

# this script currently is hardcoded for the 2019 season, see the seasonYear variable

# Output format notes:
# See the committed data/Warriors_schedule.json for an example
# The "games" exported are in order sorted by datetime

import urllib.request, json, sys, collections, copy

FILE_PATH = "data/"

# relevant NBA json keys from their data
# there are many more subkeys that we're not currently using that aren't defined here
NBA_LEAGUE_SCHEDULE_KEY = 'lscd'
NBA_MONTHLY_SCHEDULE_KEY = 'mscd'
NBA_GAMES_KEY = 'g'

# NBA json keys for each game
NBA_HOME_TIME_KEY = 'htm' # datetime of the game in the home team's time zone
NBA_VISITOR_TIME_KEY = 'vtm' # datetime of the game in the visiting team's time zone
NBA_ARENA_NAME_KEY = 'an' # name of the arena where the game will be played
NBA_HOME_KEY = 'h'
NBA_VISITOR_KEY = 'v'
# NBA subkeys for each team in the game, both home and away
NBA_TEAM_NAME_KEY = 'tn'
NBA_TEAM_CITY_KEY = 'tc'
NBA_TEAM_ABBREVIATION_KEY = 'ta'


# exported schedule json keys
TITLE_KEY = 'title'
LINK_KEY = 'link'
GAMES_KEY = 'games'
# subkeys for each game
HOME_TEAM_NAME_KEY = 'hn'
HOME_TEAM_CITY_KEY = 'hc'
VISITOR_TEAM_NAME_KEY = 'vn'
VISITOR_TEAM_CITY_KEY = 'vc'
ARENA_NAME_KEY = 'an'
DATE_KEY = 'd' # datetime of the game in the desired team's time zone

teams = ["Bucks", "Bulls", "Cavaliers", "Celtics", "Clippers", "Grizzlies", "Hawks", "Heat", "Hornets", "Jazz", "Kings", "Knicks", "Lakers", "Magic", "Mavericks", "Nets", "Nuggets", "Pacers", "Pelicans", "Pistons", "Raptors", "Rockets", "76ers", "Spurs", "Suns", "Thunder", "Timberwolves", "Trail Blazers", "Warriors", "Wizards"]

# list of all the teams that we want to save the schedules for with their associated website(s)
# this could use team ids (tid) instead of names but I think names might actually be more robust
# these names or tids could be looked up or converted from the team data in http://data.nba.com/
# if that was desireable
TEAMS_TO_UPDATE_NAMES_AND_SITES = {}
for team in teams:
    if team == 'Warriors':
        TEAMS_TO_UPDATE_NAMES_AND_SITES[team] = 'http://isthereawarriorsgametonight.com'
    else:
        TEAMS_TO_UPDATE_NAMES_AND_SITES[team] = 'http://isthereagametonight.com/' + urllib.parse.quote(team)

schedulesToExport = {}
for teamName, website in TEAMS_TO_UPDATE_NAMES_AND_SITES.items():
    schedulesToExport[teamName] = collections.OrderedDict()
    schedulesToExport[teamName][TITLE_KEY] = teamName + " Game Schedule"
    schedulesToExport[teamName][LINK_KEY] = website
    schedulesToExport[teamName][GAMES_KEY] = []

# TODO in theory this shouldn't be hardcoded
# We could check if it's currently August or later, and if so use that year, otherwise use the previous year
# Also possible that the NBA would change their data format for a new season though and this script would need other fixes
seasonYear = "2019"

scheduleUrl = "http://data.nba.com/data/10s/v2015/json/mobile_teams/nba/" + seasonYear + "/league/00_full_schedule.json"
scheduleResponse = urllib.request.urlopen(scheduleUrl)
jsonString = scheduleResponse.read().decode('utf-8')
scheduleData = json.loads(jsonString)

# print(scheduleData) # we getting good data from the NBA site?

# To test our data validation, deleting misc keys to verify we get a failure
# del scheduleData[NBA_LEAGUE_SCHEDULE_KEY]
# del scheduleData[NBA_LEAGUE_SCHEDULE_KEY][2][NBA_MONTHLY_SCHEDULE_KEY]
# del scheduleData[NBA_LEAGUE_SCHEDULE_KEY][2][NBA_MONTHLY_SCHEDULE_KEY][NBA_GAMES_KEY]
# del scheduleData[NBA_LEAGUE_SCHEDULE_KEY][2][NBA_MONTHLY_SCHEDULE_KEY][NBA_GAMES_KEY][2][NBA_HOME_KEY]
# del scheduleData[NBA_LEAGUE_SCHEDULE_KEY][2][NBA_MONTHLY_SCHEDULE_KEY][NBA_GAMES_KEY][2][NBA_VISITOR_TIME_KEY]
# del scheduleData[NBA_LEAGUE_SCHEDULE_KEY][2][NBA_MONTHLY_SCHEDULE_KEY][NBA_GAMES_KEY][2][NBA_VISITOR_KEY][NBA_TEAM_CITY_KEY]

# these functions help us make sure we have the data format we're expecting
# if these fail they will halt all processing and you will have to debug why the data is bad
# more logging may need to be added to understand the context
def assertDictHasKey( dict, key, dictName = "dict" ):
    if key not in dict:
        print("key '" + key + "' is missing in " + dictName + ":")
        print(dict)
        sys.exit(1)

def assertDictHasKeys( dict, keys, dictName = "dict" ):
    for key in keys:
        assertDictHasKey(dict, key, dictName)

assertDictHasKey(scheduleData, NBA_LEAGUE_SCHEDULE_KEY, 'scheduleData')
leagueSchedule = scheduleData[NBA_LEAGUE_SCHEDULE_KEY]

for subSchedule in leagueSchedule:
    assertDictHasKey(subSchedule, NBA_MONTHLY_SCHEDULE_KEY, 'subSchedule')
    monthlySchedule = subSchedule[NBA_MONTHLY_SCHEDULE_KEY]

    assertDictHasKey(monthlySchedule, NBA_GAMES_KEY, 'monthlySchedule')
    games = monthlySchedule[NBA_GAMES_KEY]

    for game in games:
        # validate the game has the data we need
        assertDictHasKeys(game, [NBA_HOME_KEY, NBA_VISITOR_TIME_KEY, NBA_ARENA_NAME_KEY, NBA_HOME_KEY, NBA_VISITOR_KEY], 'game')
        homeTeam = game[NBA_HOME_KEY]
        visitorTeam = game[NBA_VISITOR_KEY]
        assertDictHasKeys(homeTeam, [NBA_TEAM_NAME_KEY, NBA_TEAM_CITY_KEY], 'homeTeam')
        assertDictHasKeys(visitorTeam, [NBA_TEAM_NAME_KEY, NBA_TEAM_CITY_KEY], 'visitorTeam')

        # this is the data we will save for the game if we need to, it will be keyed on time below
        gameDataToExport = collections.OrderedDict()
        gameDataToExport[HOME_TEAM_NAME_KEY] = homeTeam[NBA_TEAM_NAME_KEY]
        gameDataToExport[HOME_TEAM_CITY_KEY] = homeTeam[NBA_TEAM_CITY_KEY]
        gameDataToExport[VISITOR_TEAM_NAME_KEY] = visitorTeam[NBA_TEAM_NAME_KEY]
        gameDataToExport[VISITOR_TEAM_CITY_KEY] = visitorTeam[NBA_TEAM_CITY_KEY]
        gameDataToExport[ARENA_NAME_KEY] = game[NBA_ARENA_NAME_KEY]

        homeTeamName = homeTeam[NBA_TEAM_NAME_KEY]
        visitorTeamName = visitorTeam[NBA_TEAM_NAME_KEY]

        if homeTeamName in schedulesToExport:
            # we do a deep copy here such that in case we export this game for both the home AND away team,
            # they have different datetimes and we don't modify the same version of the data
            homeGameDataToExport = copy.deepcopy(gameDataToExport)
            homeGameDataToExport[DATE_KEY] = game[NBA_HOME_TIME_KEY]
            schedulesToExport[homeTeamName][GAMES_KEY].append(homeGameDataToExport)

        if visitorTeamName in schedulesToExport:
            visitorGameDataToExport = copy.deepcopy(gameDataToExport)
            visitorGameDataToExport[DATE_KEY] = game[NBA_VISITOR_TIME_KEY]
            schedulesToExport[visitorTeamName][GAMES_KEY].append(visitorGameDataToExport)

# print(json.dumps(schedulesToExport)) # enable for better debugging

for teamName, schedule in schedulesToExport.items():
    # sort the games by date in case the nba data isn't sorted
    # I think this just does a string compare but that's fine for this date format
    schedule[GAMES_KEY].sort(key=lambda game: game[DATE_KEY])

    # print out how many games we have per team, would expect 82 until playoffs data is added to the JSON
    print(teamName + " games: " + str(len(schedule[GAMES_KEY])))

    # write out the json
    fileName = teamName + "_schedule.json"
    with open(FILE_PATH + fileName, 'w') as outfile:
        json.dump(schedule, outfile)


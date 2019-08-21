import sys, os

# call this function with args like "Los Angeles" "Lakers" "LAL"
# this script will overwrite existing files if they exist in the output dir
# but will not recreate the dir itself
# it should work fine in either case
def makeTeamDirFromTemplate(teamCity, teamName, teamAcronym):
    # the team city i.e. "San Francisco"
    print("Team city: " + teamCity)
    # team name should match the NBA dataset exactly, i.e. "Warriors" / "Trail Blazers"
    print("Team name: " + teamName)
    print("Team acroynm: " + teamAcronym)
    FILE_PATH = os.getcwd()
    dirPath = FILE_PATH + "/" + teamName

    try:
        os.mkdir(dirPath)
    except OSError as e:
        print ("Creation of the directory %s failed: " % dirPath + str(e))
        # TODO sys.exit() here? maybe no need...
        # some failures are because the folder already exists, which is fine.
        # We could parse that error or just storm ahead hopefully, storming ahead
    else:
        print ("Successfully created the directory %s " % dirPath)

    templateDir = "TeamTemplate/"
    templateFilePaths = ["index.html", "manifest.webapp"]

    for templateFilePath in templateFilePaths:
        with open(templateDir + templateFilePath, 'r') as templateFile:
            with open(teamName + "/" + templateFilePath, 'w') as outputFile:
                for cnt, line in enumerate(templateFile):
                    outLine = line;
                    # Template replacements are thus
                    # %TEAM_NAME% # Warriors
                    # %TEAM_NAME_LOWER% # warriors (or trail blazers)
                    # %TEAM_NAME_LOWER_NO_SPACE% # warriors (or trailblazers)
                    # %TEAM_CITY_LOWER% # golden state
                    # %TEAM_ACRONYM_LOWER% # gsw
                    outLine = outLine.replace("%TEAM_NAME%", teamName)
                    outLine = outLine.replace("%TEAM_NAME_LOWER%", teamName.lower())
                    outLine = outLine.replace("%TEAM_NAME_LOWER_NO_SPACE%", teamName.lower().replace(" ", ""))
                    outLine = outLine.replace("%TEAM_CITY_LOWER%", teamCity.lower())
                    outLine = outLine.replace("%TEAM_ACRONYM_LOWER%", teamAcronym.lower())
                    outputFile.write(outLine)

# copied this from https://en.wikipedia.org/wiki/Wikipedia:WikiProject_National_Basketball_Association/National_Basketball_Association_team_abbreviations
teams = [
    ["ATL", "Atlanta", "Hawks"]
    ["BKN", "Brooklyn", "Nets"]
    ["BOS", "Boston", "Celtics"]
    ["CHA", "Charlotte", "Hornets"]
    ["CHI", "Chicago", "Bulls"]
    ["CLE", "Cleveland", "Cavaliers"]
    ["DAL", "Dallas", "Mavericks"]
    ["DEN", "Denver", "Nuggets"]
    ["DET", "Detroit", "Pistons"]
    ["GSW", "Golden State", "Warriors"]
    ["HOU", "Houston", "Rockets"]
    ["IND", "Indiana", "Pacers"]
    ["LAC", "Los Angeles", "Clippers"]
    ["LAL", "Los Angeles", "Lakers"]
    ["MEM", "Memphis", "Grizzlies"]
    ["MIA", "Miami", "Heat"]
    ["MIL", "Milwaukee", "Bucks"]
    ["MIN", "Minnesota", "Timberwolves"]
    ["NOP", "New Orleans", "Pelicans"]
    ["NYK", "New York", "Knicks"]
    ["OKC", "Oklahoma City", "Thunder"]
    ["ORL", "Orlando", "Magic"]
    ["PHI", "Philadelphia", "76ers"]
    ["PHX", "Phoenix", "Suns"]
    ["POR", "Portland", "Trail Blazers"]
    ["SAC", "Sacramento", "Kings"]
    ["SAS", "San Antonio", "Spurs"]
    ["TOR", "Toronto", "Raptors"]
    ["UTA", "Utah", "Jazz"]
    ["WAS", "Washington", "Wizards"]
]

for teamAcronym, teamCity, teamName in teams:
    makeTeamDirFromTemplate(teamCity, teamName, teamAcronym)


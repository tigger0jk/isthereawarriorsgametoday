import sys, os

# call this function with args like "Los Angeles" "Lakers" "LAL"
# this script will overwrite existing files if they exist in the output dir
# but will not recreate the dir itself
# it should work fine in either case
def makeTeamDirFromTemplate(teamCity, teamName, teamAcronym, siteUrl, aboutUri, isInBaseDir = False):
    # the team city i.e. "San Francisco"
    print("Team city: " + teamCity)
    # team name should match the NBA dataset exactly, i.e. "Warriors" / "Trail Blazers"
    print("Team name: " + teamName)
    print("Team acroynm: " + teamAcronym)

    FILE_PATH = os.getcwd()
    if isInBaseDir:
        dirPath = FILE_PATH
    else:
        pathSuffix = "/" + teamName
        dirPath = FILE_PATH + pathSuffix
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
            with open(dirPath + "/" + templateFilePath, 'w') as outputFile:
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
                    outLine = outLine.replace("%SITE_URL%", siteUrl)
                    outLine = outLine.replace("%ABOUT_URI%", aboutUri)
                    outputFile.write(outLine)


import makeTeamDir

# copied this from https://en.wikipedia.org/wiki/Wikipedia:WikiProject_National_Basketball_Association/National_Basketball_Association_team_abbreviations
teams = [
    ["ATL", "Atlanta", "Hawks"],
    ["BKN", "Brooklyn", "Nets"],
    ["BOS", "Boston", "Celtics"],
    ["CHA", "Charlotte", "Hornets"],
    ["CHI", "Chicago", "Bulls"],
    ["CLE", "Cleveland", "Cavaliers"],
    ["DAL", "Dallas", "Mavericks"],
    ["DEN", "Denver", "Nuggets"],
    ["DET", "Detroit", "Pistons"],
    ["GSW", "Golden State", "Warriors"],
    ["HOU", "Houston", "Rockets"],
    ["IND", "Indiana", "Pacers"],
    ["LAC", "Los Angeles", "Clippers"],
    ["LAL", "Los Angeles", "Lakers"],
    ["MEM", "Memphis", "Grizzlies"],
    ["MIA", "Miami", "Heat"],
    ["MIL", "Milwaukee", "Bucks"],
    ["MIN", "Minnesota", "Timberwolves"],
    ["NOP", "New Orleans", "Pelicans"],
    ["NYK", "New York", "Knicks"],
    ["OKC", "Oklahoma City", "Thunder"],
    ["ORL", "Orlando", "Magic"],
    ["PHI", "Philadelphia", "76ers"],
    ["PHX", "Phoenix", "Suns"],
    ["POR", "Portland", "Trail Blazers"],
    ["SAC", "Sacramento", "Kings"],
    ["SAS", "San Antonio", "Spurs"],
    ["TOR", "Toronto", "Raptors"],
    ["UTA", "Utah", "Jazz"],
    ["WAS", "Washington", "Wizards"]
]

siteUrl = "http://isthereagametonight.com" # TODO make this https once https is up
aboutUri = "about.html"
for teamAcronym, teamCity, teamName in teams:
    makeTeamDir.makeTeamDirFromTemplate(teamCity, teamName, teamAcronym, siteUrl, aboutUri)


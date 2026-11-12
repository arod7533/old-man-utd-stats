# Old Man United

A single mobile-friendly team dashboard. Season is the only control. Includes team record, goals for and against, goal difference, team clean sheets, results, Golden Boot with shared places for ties, and individual goals and clean sheets.

- Website: https://arod7533.github.io/old-man-utd-stats/
- Data: https://docs.google.com/spreadsheets/d/1NqPn-ITqqSmdQCIaYEXAGHexqogpM-MkU0QbmYlYdxg/edit
- League: https://www.tampabayclubsport.com/team/1067968
- Deploy branch: `Development`, folder `/docs`.

## Update stats

Edit the single `Data` tab in the Google Sheet. Each row represents one player in one match:

| Season | Match ID | Date | Opponent | Goals for | Goals against | Player | Goals | Clean sheet |
|---|---|---|---|---|---|---|---|---|
| Fall 2026 | M001 | 2026-10-21 | Walking Reds | 3 | 0 | Tim | 0 | TRUE |

1. Use one unique Match ID per game, including across seasons. Repeat the match's season, ID, date, opponent and final score on each player's row.
2. Enter player goals as numbers, including zero. Clean sheet is a boolean checkbox (`TRUE` or `FALSE`), not a number. Include a row with zero goals for any player you want listed.
3. Use the same player spelling consistently. Seed data uses Javier (Javi) and Conor (also written Connor in the request).
4. Add a new season simply by entering its name in the Season column. It appears in the website selector automatically.
5. Enter dates as `YYYY-MM-DD`. No yellow or red cards are tracked.

The site deduplicates matches by Match ID before computing team totals. Player clean sheets are summed from checked booleans, independently of the team's clean-sheet total. Match rows are event records, not proof of attendance.

The website reads the Google Sheet on load and every 60 seconds. Google's cache may introduce additional delay. It refuses conflicting scores/dates for a match, duplicate match/player rows, invalid counts, or invalid clean-sheet values. On refresh failure it keeps the last successful in-memory view with a visible warning. There is no silent sample-data fallback.

## Access and cost

GitHub Pages serves these static files for free from this public repository. The Google Sheet is public **Viewer** access; only the owner has edit access. The website contains no write API, credentials, admin screen, or paid services. Anyone with the link can read the stats and source. To grant a captain editing rights, explicitly share the Sheet with that person's email as Editor; never give general link visitors Editor access.

## Local development

No installation or build step is needed. Run `npm start` (Python 3 required), then open http://localhost:4173. Run `npm test` with Node 20+ for aggregation and season-isolation checks.

`docs/model.js` computes stats, `docs/app.js` reads the public Sheet, and `docs/style.css` defines the responsive layout. `data/seed.json` archives the initial rows for tests; production reads the live Sheet, not that file.

Initial scores and scorer records came from the team chat. Dates and the season label Fall 2026 were verified against the linked league page on November 12, 2026. Recorded games: October 21 (3–0), October 28 (6–1), November 4 (6–2), November 11 (2–2).

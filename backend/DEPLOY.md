# Deploying the event duties backend

Mirrors the motorover and invoices backends: AWS SAM → HTTP API → Lambda
(Node 24, arm64) → DynamoDB, in ap-south-1 (Mumbai), same account. Its own
stack (`lawpark-event-duties`) and table (`lawpark-event-duties`); it never
touches the other projects' tables. No secrets: the app has no passwords by
design, and only the event site's origin may call the API.

## One-time setup

```sh
cd backend
sam build
sam deploy --guided \
  --stack-name lawpark-event-duties \
  --region ap-south-1 \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    AllowedOrigins='https://journey.lawparkeducationaltrust.org,http://localhost:8789'
```

`--guided` writes `samconfig.toml` (git-ignored). Later deploys are just
`sam build && sam deploy`.

The first request after deploy copies in the starting schedule (23 activities,
131 tasks) and duty task lists (171 tasks). That happens once per table.

## Load the team roster

The roster is people's mobile numbers, so it is not in this public repo. Keep
`team-roster.json` at the repo root (git-ignored), then:

```sh
cd backend && npm install && npm run load-roster
```

Safe to run again: numbers already there keep the name their owner chose.

## Wire up the website

Take the `DutiesApiUrl` stack output and set it in the Cloudflare Pages project
(Settings → Environment variables, Production and Preview):

```
NEXT_PUBLIC_DUTIES_API=https://xxxxxxxx.execute-api.ap-south-1.amazonaws.com/duties
```

Then redeploy the site. Without it the page shows "not connected".

## Smoke test

```sh
API=<DutiesApiUrl>
curl -s $API | head -c 300                                        # 200, JSON
curl -s -H "Origin: https://evil.example" $API                    # 403
curl -s -X POST -H "Origin: https://journey.lawparkeducationaltrust.org" \
  -H "content-type: text/plain" -d '{}' $API                      # 415
```

## Local development (no AWS)

```sh
cd backend && npm install && npm run dev      # API on http://localhost:8790/duties, in memory
cd website && echo 'NEXT_PUBLIC_DUTIES_API=http://localhost:8790/duties' > .env.local
npm run build && npm run preview:duties       # page on http://localhost:8789/event-duties
```

The dev server runs the real handler on an in-memory store and loads
`team-roster.json` if present. Data resets when it stops.

## Backups and removal

Point-in-time recovery is on (restore to any second in the last 35 days).
The table has `DeletionPolicy: Retain`: deleting the stack leaves the team's
data in place; delete the table by hand only when you mean to.

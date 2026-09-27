# Law Park Educational Trust — 10 Years Journey

Anniversary microsite showcasing the 10-year journey of Law Park Educational Trust. Separate from the main NGO website at [lawparkeducationaltrust.org](https://www.lawparkeducationaltrust.org).

**Intended domain:** `journey.lawparkeducationaltrust.org`

## Tech Stack

- **Next.js 16** (App Router, static export)
- **React 19** + **TypeScript**
- **Tailwind CSS 4**

## Getting Started

### Prerequisites

- Node.js 20.9.0 or higher

### Development

```bash
cd website
npm install
npm run dev
# open http://localhost:3000
```

### Production Build

```bash
cd website
npm run build
# static output in website/out/
npx serve out
```

## Project Structure

Two independent projects share one repository and one photo library.

```
law-park-educational-trust-10-years/
├── website/          # the Next.js microsite (this is the deployed app)
│   ├── app/              # routes (/, /content/*, /invite)
│   ├── components/       # React components (layout, sections, ui)
│   ├── data/             # milestones, activities, website content
│   ├── public/           # served static assets
│   └── scripts/          # image optimization, face extraction
├── video/            # the anniversary film project
│   ├── production/       # Kannada film: script, tools, render chain
│   ├── research/         # research and bilingual briefs
│   ├── event-day/        # event playback material
│   └── scripts/          # handoff sync, asset-drop builder
├── assets/           # master photo library, shared by both projects
│                     # the ONLY tracked copy of every photograph
└── docs/             # project notes and status
```

### Images

`assets/` is the single source of truth for photographs. The images the site
serves are generated into `website/public/` before every build, from the map in
`website/image-manifest.json`, and are git-ignored rather than committed twice.
Served paths are unchanged from when they were committed, so no image URL moves.

The film's shot-id photo pack is generated the same way:

```bash
node video/scripts/sync-photo-pack.mjs   # video/production/photo-pack-10-years/
```

Its `enhanced/` renders are the exception and stay tracked, because they exist
nowhere else.

To add or replace an image: put it in `assets/`, add the served path to the
relevant manifest (`website/image-manifest.json` or the pack's
`photo-manifest.json`), then run the sync. The website's runs automatically
before every build. A manifest entry whose source is missing fails loudly rather
than leaving a gap.

The website build no longer touches the film project. To republish the film
handoff page at its public URL, run the sync deliberately:

```bash
cd website && npm run sync:kannada-handoff
```

## Deploy (Cloudflare Pages)

Connect repo in **Workers & Pages** → **Create** → **Pages** → **Connect to Git**:

| Setting | Value |
|---------|--------|
| Production branch | `main` |
| Framework preset | **Next.js (Static HTML Export)** |
| Root directory | `website` |
| Build command | `npm ci && npm run build` |
| Build output directory | `out` |

If the Pages project predates the `website/` split, set **Root directory** to
`website` in the build configuration. Without it the build runs at the repo
root, finds no `package.json`, and fails.

Add custom domain: `journey.lawparkeducationaltrust.org`.

No environment variables required.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | 10-year journey landing (timeline, gallery, awards, testimonials) |
| `/content` | Shareable content hub |
| `/content/magazine` | Magazine assets |
| `/content/donor-invite` | Donor invite letter |
| `/content/award` | Award social media content |
| `/invite` | Event invite |

## License

Private and proprietary.

## Event day duties app (`/event-duties`)

A team sign-up sheet for the celebration on 4 October 2026, installable as an
app from the phone browser (Add to Home Screen). Visitors enter their name and
mobile number once; the browser remembers both. They then add one or more names
to each duty, or add a duty that is missing. The **Schedule** tab holds the event
activities: anyone can add, edit or remove one (date, time, title, description)
and put people in charge of it. Each activity and each duty has a task list at
micro level (131 tasks on the schedule and 171 on 37 duties to start with; a
duty's list is folded behind a Tasks button). Any task can be given to a team member,
moved through Not started, Working on it, Need help and Done, and commented on.
**My tasks**, the first tab, shows each person only what is theirs, anyone who
needs help, tasks on their activities with no one yet, and tasks they could
pick up. A short tour is offered on a phone's first sign-in, and again from Help.
A− and A+ enlarge all text (up to 150%), a moon or sun button switches dark
mode, and pinch zoom stays available. No passwords, by
design: every change is logged with the name of whoever made it.

Sign-in is one search box: people type their name or any part of their mobile
number (with or without the country code) and pick themselves from the team
list, or add themselves if they are not on it. Mobiles are stored with the
country code, so numbers outside India work. Anyone can change their own name;
it changes on every duty and activity they are on.

| Piece | File |
|-------|------|
| Page | `website/app/event-duties/page.tsx`, `website/components/pages/EventDutiesPage.tsx` |
| Duty list, pillar groups, starting schedule | `website/data/eventDuties.ts` |
| Starting team roster (server only) | `website/data/eventTeam.ts` |
| Sign-in screen | `website/components/event-duties/SignIn.tsx` |
| Schedule tab | `website/components/event-duties/Schedule.tsx` |
| Tasks, and the My tasks tab | `website/components/event-duties/Tasks.tsx`, `MyTasks.tsx` |
| First-time tour; text size and theme | `website/components/event-duties/Tour.tsx`, `Preferences.tsx` |
| API (Cloudflare Pages Function) | `website/functions/api/duties.js` |
| Database schema (Cloudflare D1) | `website/migrations/0001_event_duties.sql` |
| App manifest and service worker | `website/public/event-duties.webmanifest`, `website/public/event-duties-sw.js` |
| Build stamp for the refresh button | `website/scripts/write-build-version.mjs` (runs in prebuild) |

The starting schedule (`SEED_ACTIVITIES`), duty task lists (`SEED_DUTY_TASKS`)
and team roster (`SEED_MEMBERS`) are each copied into D1 once, on first use.
After that the page is the only place to change it: editing the seed list does
nothing to a database that already has a schedule.

**One-time Cloudflare setup** (the function creates its tables on first use):

1. Create the database: `npx wrangler d1 create lawpark-event-duties`
   (or Cloudflare dashboard, Storage and Databases, D1).
2. In the Pages project, Settings, Bindings, add a **D1 database** binding named
   `DB` pointing at `lawpark-event-duties`, for Production (and Preview if wanted).
3. Redeploy. Until the binding exists, the page shows "Database is not connected yet."

**Local run with a local D1:**

```bash
cd website
npm run build
npm run preview:duties   # http://localhost:8789/event-duties
```

**New code on phones:** every build writes a new version. An open or installed
copy checks for it every minute and shows "Update now"; the round refresh icon in
the header always clears the app's cache and loads the latest version.

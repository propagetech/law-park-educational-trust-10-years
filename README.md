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
└── docs/             # project notes and status
```

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

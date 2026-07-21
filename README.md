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
npm install
npm run dev
# open http://localhost:3000
```

### Production Build

```bash
npm run build
# static output in out/
npx serve out
```

## Project Structure

```
law-park-educational-trust-10-years/
├── app/              # Next.js routes (/, /content/*, /invite)
├── components/       # React components (layout, sections, ui)
├── data/             # Milestones, activities, website content
├── public/           # Static assets (images, magazine templates)
├── assets/           # Processed image manifest
└── scripts/          # Image optimization, face extraction, etc.
```

## Deploy (Cloudflare Pages)

Connect repo in **Workers & Pages** → **Create** → **Pages** → **Connect to Git**:

| Setting | Value |
|---------|--------|
| Production branch | `main` |
| Framework preset | **Next.js (Static HTML Export)** |
| Build command | `npm ci && npm run build` |
| Build output directory | `out` |

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

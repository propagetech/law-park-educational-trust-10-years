# 00 · Project Map

**Repository:** `law-park-educational-trust-10-years`
**Purpose of repo:** 10-year anniversary microsite for Law Park Educational Trust (LPET), separate from the main NGO site.
**Audit date:** 8 September 2026
**Audited by:** Repository Auditor and Content Archivist role, anniversary welcome-video pre-production.

> This document is a read-only map. No production file, media file, or configuration was modified during this audit.

---

## 1. Technology stack

| Item | Value | Source |
|---|---|---|
| Framework | Next.js 16, App Router, static export (`output: 'export'`) | [next.config.js](next.config.js), [package.json](package.json) |
| UI | React 19, TypeScript 5.9 | [package.json](package.json) |
| Styling | Tailwind CSS 4 + PostCSS, one global stylesheet | [tailwind.config.js](tailwind.config.js), [app/globals.css](app/globals.css) |
| Icons | `lucide-react` (in-app), Material Symbols Rounded (magazine HTML only) | [data/activities.tsx](data/activities.tsx), [public/magazine/template-06.html](public/magazine/template-06.html) |
| Image pipeline | `sharp` via `scripts/optimize-images.mjs`; images served `unoptimized` | [package.json](package.json), [next.config.js](next.config.js) |
| Build | `npm run build` to `out/` | [README.md](README.md) |
| Hosting | Cloudflare Pages, custom domain `journey.lawparkeducationaltrust.org` | [README.md](README.md), [public/CNAME](public/CNAME) |
| Node | >= 20.9.0 | [package.json](package.json) |
| CMS / API | **None.** All content is hard-coded TypeScript in `data/` plus one static HTML magazine. No CMS export, no API endpoint, no MDX. | audit |

---

## 2. Routes and their source files

| Route | Page file | Renders | Anniversary relevance |
|---|---|---|---|
| `/` | [app/page.tsx](app/page.tsx) | Hero, ImpactOverview, Activities, Process, Timeline, ChildrenStories, Gallery, Awards, Trustees, SupportersAndPartners, Testimonials, CTASection | **Primary evidence source** |
| `/content` | [app/content/page.tsx](app/content/page.tsx) | [ContentLandingPage](components/pages/ContentLandingPage.tsx) | Content hub index |
| `/content/magazine` | [app/content/magazine/page.tsx](app/content/magazine/page.tsx) | Link out to print magazine | Points to `public/magazine/template-06.html` |
| `/content/donor-invite` | [app/content/donor-invite/page.tsx](app/content/donor-invite/page.tsx) | [DonorInviteContentPage](components/pages/DonorInviteContentPage.tsx) | **Founding-year evidence**, event narrative |
| `/content/award` | [app/content/award/page.tsx](app/content/award/page.tsx) | [SocialMediaContentPage](components/pages/SocialMediaContentPage.tsx) | Award facts |
| `/content/event-plan` | [app/content/event-plan/page.tsx](app/content/event-plan/page.tsx) | [EventPlanPage](components/pages/EventPlanPage.tsx) | **Names the 5 to 7 min anniversary video slot** |
| `/content/webpage` | [app/content/webpage/page.tsx](app/content/webpage/page.tsx) | [WebpageContentPage](components/pages/WebpageContentPage.tsx) | Sponsorship copy |
| `/content/sudha-murthy-invite` | [app/content/sudha-murthy-invite/page.tsx](app/content/sudha-murthy-invite/page.tsx) | [SudhaMurthyInviteLetter](components/pages/SudhaMurthyInviteLetter.tsx) | Chief-guest invitation, beneficiary categories |
| `/invite` | [app/invite/page.tsx](app/invite/page.tsx) | [InviteWebpage](components/pages/InviteWebpage.tsx) | Event invite |
| `/sitemap.xml` | [app/sitemap.ts](app/sitemap.ts) | Static sitemap | Not content |

Global chrome: [app/layout.tsx](app/layout.tsx) (metadata + three schema.org JSON-LD blocks), [components/layout/Header.tsx](components/layout/Header.tsx), [components/layout/Footer.tsx](components/layout/Footer.tsx), [components/shared/WhatsAppButton.tsx](components/shared/WhatsAppButton.tsx).

---

## 3. Content source map (where every fact lives)

| Content domain | Source of truth in repo | Notes |
|---|---|---|
| Impact statistics | [data/stats.ts](data/stats.ts) | Contradicted by Hero and by two markdown docs. See `06`. |
| Year-by-year timeline | [data/milestones.ts](data/milestones.ts) | 10 entries, 2016 to 2025. No 2026 entry. |
| Programmes / activities | [data/activities.tsx](data/activities.tsx) | 9 activities |
| Four-step method | [data/websiteContent.ts](data/websiteContent.ts) `process` | Identify, Validate, Embrace, Incubate |
| Trustees | [data/websiteContent.ts](data/websiteContent.ts) `trustees` | 2 people, full bios |
| Testimonials | [data/websiteContent.ts](data/websiteContent.ts) `testimonials` | 28 entries, sourced from `public/magazine/testimany with pic.docx` |
| Supporters (volunteers + donors, with descriptions) | [data/websiteContent.ts](data/websiteContent.ts) `supporters` | 20 with bios and quotes, ~90 name-only donors |
| Team roster | [data/websiteContent.ts](data/websiteContent.ts) `teamMembers` | 27 first names |
| Donor roll | [data/websiteContent.ts](data/websiteContent.ts) `donors` | ~110 name plus city strings |
| Partner NGOs | [data/websiteContent.ts](data/websiteContent.ts) `partnerNGOs` | 6 entries, **3 of which are template placeholders**. See `06`. |
| Awards | [data/websiteContent.ts](data/websiteContent.ts) `awards` | 1 award, corroborated by certificate scan |
| Children's case summaries | [data/childrenStories.ts](data/childrenStories.ts) | 10 anonymised summaries. **Privacy-sensitive.** |
| Donation channel | [data/constants.ts](data/constants.ts) | Razorpay page |
| Contact and address | [components/layout/Footer.tsx](components/layout/Footer.tsx), [app/layout.tsx](app/layout.tsx) JSON-LD | Consistent |
| Long-form narrative | [public/magazine/template-06.html](public/magazine/template-06.html) | 24-page print magazine, richest prose source |
| Award social copy | [SOCIAL_MEDIA_CONTENT.md](SOCIAL_MEDIA_CONTENT.md) | Corroborates award |
| Event plan | [components/pages/EventPlanPage.tsx](components/pages/EventPlanPage.tsx) | Programme flow and logistics |
| Founding-year detail | [components/pages/DonorInviteContentPage.tsx](components/pages/DonorInviteContentPage.tsx) | "started this Trust in 2012 (registered 2016)" |
| Stale project notes | [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md), [CLIENT_FEEDBACK_STATUS.md](CLIENT_FEEDBACK_STATUS.md), [MIGRATION_TO_NEXTJS.md](MIGRATION_TO_NEXTJS.md), [LIGHTHOUSE_OPTIMIZATION.md](LIGHTHOUSE_OPTIMIZATION.md) | Historical. Do not quote as current fact. |

---

## 4. Media directories

| Directory | Files | Contents |
|---|---|---|
| `public/images/` | 157 | Timeline `slide_XX_*` photos (jpg + webp pairs), hero image, logo variants, award images, children-story portraits, UPI QR |
| `public/images/Magazine photos/` | 19 | `mag_01` to `mag_19`, magazine layout photography |
| `public/images/magazine-gallery/` | 3 | Charulatha portrait, trustee portrait, child photo |
| `public/images/mosaic-spread/` | 12 | Curated mosaic photos for the print spread |
| `public/images/children-stories-processed/` | 6 | 2160x3840 processed portraits, black and white |
| `public/magazine/NGO_Processed_Images/` | 25 | Processed testimonial portraits |
| `public/magazine/testimonial-images/` | 25 | Testimonial portraits referenced by `websiteContent.ts` |
| `public/magazine/print/` | 27 + manifest | Named testimonial portraits extracted from the source docx |
| `public/illustrations/` | 13 | Flat SVG concept illustrations |
| `assets/images/` | 243 | Centralised, **descriptively renamed** copy of the above. `timeline/` subfolder is the single most useful folder for video: 122 files named `YYYY-what-is-happening.ext` |
| `public/magazine/` | 2 HTML + 1 docx | `template-06.html` (24pp), `template-06-22p-no-filler.html`, `testimany with pic.docx` |

**Total media files scanned: 552** (518 raster images, 30 SVG, 2 PDF, 2 DOCX).
**No video and no audio assets exist in the repository.**

The `assets/images/manifest.json` maps every original path to its renamed copy. Byte-identical duplication between `public/` and `assets/` is by design (`assets/images/README.md`: "Originals were left in place; these are copied assets for reuse").

---

## 5. Brand tokens found in code

| Token | Value | Source |
|---|---|---|
| Navy (primary) | `#1c1c2e`, mid `#2d2d44` | [tailwind.config.js](tailwind.config.js), section components |
| Gold (accent) | `#c9903e`, light `#e0b06a` | [tailwind.config.js](tailwind.config.js) |
| Cream (ground) | `#faf8f3` | [components/sections/Trustees.tsx](components/sections/Trustees.tsx) |
| Display / serif | Playfair Display | [app/globals.css](app/globals.css) |
| Body / sans | Quicksand (site), Inter (magazine) | [app/globals.css](app/globals.css), magazine HTML |
| Stale token | `theme_color: #15803d` (green) in [public/site.webmanifest](public/site.webmanifest) and `<meta name="theme-color">` in [app/layout.tsx](app/layout.tsx) | Pre-rebrand leftover. Do not use in video. |

Neither Playfair Display nor Quicksand nor Inter ships Kannada glyphs. See `07` for the bilingual type recommendation.

---

## 6. Files with no anniversary value

`node_modules/`, `.next/`, `package-lock.json`, `eslint.config.mjs`, `postcss.config.js`, `tsconfig.json`, `next-env.d.ts`, `types/index.ts`, `utils/image.ts`, `components/ui/*`, `components/shared/*`, `scripts/*`, `.cursorrules`, `.DS_Store` files (5 present, should be gitignored).

# Share pack · Kannada film team handoff

## Open this first

**[The hand-off page](https://journey.lawparkeducationaltrust.org/anniversary-video-production/kannada/team-handoff)** . One page for the NGO owner, director, narrator, designer and producer. It is the live page, not a file in this pack: the pack is what the page hands out, so there is only ever one copy of it to keep current.

It includes the animatic player with Kannada subtitles, role briefs, the trustee decision checklist with owner and date fields, the full shot list with per-shot consent status, the end-roll name gate, design tokens, and links to every document in the pack.

## Two things the handoff page now does on its own

**Trustee feedback, section 02.** The founder and the trustees watch the
reference cut, fill in a form scoped to the five acts and the five open gates,
and press one button. The page shows them exactly what the PDF will say, then
builds the PDF on their own device and hands it to WhatsApp. Nothing is posted
to a server, because this page is a static file and a form POST would have
nowhere to go. Kannada typed into the form comes out correctly in the PDF: it
is rendered through the browser, which has Noto Sans Kannada loaded, rather
than through a PDF library's Latin-only built-in fonts.

On a phone the share sheet passes the PDF straight into WhatsApp. On a
computer it cannot: no URL scheme attaches a file, so the page downloads the
PDF, opens WhatsApp with the summary already typed, and says to attach the
file. If the two CDN libraries cannot be reached, it falls back to the
browser's own print-to-PDF, which needs no network.

**Creative resources, section 03.** Every committed source file the team needs
to re-cut, re-grade, re-score or re-subtitle the film, grouped and linked, plus
a table of what is deliberately not in the repository and the command that
rebuilds each missing thing. The video is labelled a reference cut throughout,
in the player note, in the formats table and in the footer of every feedback
PDF, because it is not a final render and someone will otherwise treat it as
one.

## The three versions of the film

| File | Resolution | For | In git |
|---|---|---|---|
| `08-kannada-animatic-preview.mp4` | 1920x1080, subtitles burned in | Local review, phone-sized | no |
| `kannada-2160p-review.mp4` | 3840x2160, ElevenLabs narration, no burned subtitles | Projection test, quality review | no |
| `kannada-2160p-youtube-master.mp4` | 3840x2160, human narration | The YouTube upload | does not exist yet |

**No video is committed to this repository.** `.gitignore` excludes `*.mp4`,
`*.mov`, `*.mkv` and `*.webm` outright. The handoff page streams the review cut
from YouTube instead, and every render is reproducible in about 13 minutes:

```bash
cd video/production/kannada/tools
python3 gfx.py ../05-kannada-subtitles.srt --scale 2
python3 master.py
```

`python3 tools/master.py --check` lists the five clearances that block a YouTube
upload. The script refuses to build a release master while any of them is open.

**On 4K:** the Kannada type is genuinely rendered at 3840x2160, the photography is
not (largest source still is 1920x1446). The reason to deliver 4K is that YouTube
gives a 2160p upload a better codec and bitrate, so even 1080p viewers see a
cleaner picture. Details in `08-kannada-animatic-notes.md` section 9.

## Do not hand-zip this any more

The pack is published as a **GitHub release** and the hand-off page links to it.
Nobody assembles a zip by hand, nobody attaches 110 MB to an email, and nobody
is given the repository.

**The release:** `film-pack` on
`propagetech/law-park-educational-trust-10-years`. It carries
`kannada-film-pack.zip` (11 MB: every document, the build scripts,
`timeline.json` and all 34 source photographs), `kannada-photographs.zip`
(9.9 MB), and each document again as its own file so that every link on the
hand-off page resolves to one download.

**To rebuild and re-upload it** after any document or tool changes:

```bash
bash scripts/build-asset-drop.sh     # stages .asset-drop/, prints the upload command
```

The filenames never change, so every link on the hand-off page keeps working and
the site does not need a redeploy. `build-asset-drop.sh` refuses to run if two
files ever share a basename, because release assets are flat.

**What the site serves:** `team-handoff.html` and its favicon, and nothing else.
`scripts/sync-kannada-handoff.sh` copies only those two and fails the build if
the page has picked up a relative asset link, which would 404 in production.

**Send one link, not a zip:** the hand-off page. It is the only door. The
reference cut streams into it from YouTube and every file downloads from it out
of the release, with no account, invitation or repository access.

## Do not include

- `~/.elevenlabs_key` or any API keys
- Optional: `tools/vo_eleven/` (abandoned synthetic audition)

## What is in the pack

**Kannada production** (`video/production/kannada/`)

| File | For |
|---|---|
| `team-handoff.html` | Everyone, open first. Carries the reference-cut player, the trustee feedback form and the creative-team resource list |
| `01-kannada-final-script.md` | Narrator, booth |
| `02-kannada-voice-audition-plan.md` | Casting, audio |
| `03-kannada-storyboard.md` | Director, editor |
| `04-kannada-onscreen-text.md` | Designer |
| `05-kannada-subtitles.srt` | Editor |
| `05-kannada-subtitles.vtt` | The handoff page player only |
| `06-kannada-edit-decision-list.md` | Editor |
| `07-final-rights-and-approval-checklist.md` | Trust, producer |
| `08-kannada-animatic-poster.jpg` | Poster frame, kept for slides and thumbnails |
| `favicon-32x32.png` | Browser tab icon for the handoff page |
| `08-kannada-animatic-notes.md` | Everyone |
| `09-elevenlabs-narration-guide.md` | Interim scratch read only |
| `10-cursor-elevenlabs-prompt.md` | Whoever runs the TTS |
| `11-kannada-sound-design-and-sfx-sources.md` | Sound designer, editor. Sourcing and licence discipline. Superseded in part by the four documents below |
| `12-cursor-event-master-prompt.md` | Whoever builds the hall master |
| `Kannada-cinematic-audio-direction.md` | **Composer, sound designer, mixer, open first.** The five-act direction, the effect palette and the two open gates |
| `Kannada-music-map.md` | Composer or music supplier. Palette, motif, intensity curve, deliverables |
| `Kannada-cue-sheet.csv` | Composer, sound designer, mixer. 46 music cues and 28 effect events at generated timecodes. **This, not `06` section 7** |
| `Kannada-final-mix-checklist.md` | Re-recording mixer, producer. Mix, master, quality test, sign-off |
| `Kannada-sfx-licence-log.csv` | Producer. 14 rows, every one still NOT CAPTURED against `07` 5.9 |
| `tools/timeline.json` | Timing source of truth |
| `tools/README.md` | How to re-run the build |
| `tools/make_vtt.py` | Regenerates the `.vtt` after `make_srt.py` |
| `tools/master.py` | Builds the 2160p master, checks the publishing gates |
| `tools/cue.py` | Regenerates the cue sheet, and audits the timecodes typed into the audio documents |
| `tools/log.py` | Regenerates the licence log, preserving every field a person filled in |
| `tools/mix.py` | Builds the stems, the two masters and the four previews |

**Research and bilingual** (`video/research/`): `00` project map, `01` source of truth, `02` evidence table, `03` impact and milestone data, `04` media inventory, `05` asset audit and gaps, `06` trustee questions, `07` creative brief, `08` English script, `09` Kannada source script, `10` bilingual storyboard, `11` short teaser scripts, `12` onscreen text and lower thirds, `13` credits and acknowledgements, `14` rights and publishing checklist.

## Five gates before anything goes public

`python3 tools/master.py --check` prints these and refuses to build a release
master while any is open:

1. **Narration** is still the macOS scratch voice, not a human Kannada read.
2. **Consent** for 22 of 46 shots with identifiable children or partners.
3. **Copyright** on K36, the Udayavani newspaper clipping, with no written permission on file.
4. **Music licence** for event plus YouTube plus web.
5. **End-roll names** not spelling-verified, consent to be named not recorded.

## The two with the longest lead time

1. **Guardian and partner consent** for the 22 consent-blocked shots. Visible per shot in the handoff page shot list, worklist in `07`.
2. **End-roll name verification.** No name goes on screen until a trustee confirms its spelling and the person agrees to be named. List in `video/research/13-credits-and-acknowledgements.md`, section 4.

Both are long-lead items. Start them the day you send this pack.

## After the human narration arrives

Deliver WAV stems to the editor; re-time from `tools/timeline.json` as documented in `01` / `09` / `tools/README.md`. Picture master stays; only the narration stem changes. Regenerate `05-kannada-subtitles.srt` with `tools/make_srt.py`, then regenerate the `.vtt` from it so the handoff page stays in step.

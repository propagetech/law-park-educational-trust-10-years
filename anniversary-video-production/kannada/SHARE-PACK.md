# Share pack · Kannada film team handoff

## Open this first

**[`team-handoff.html`](team-handoff.html)** . One page for the NGO owner, director, narrator, designer and producer.

It includes the animatic player with Kannada subtitles, role briefs, the trustee decision checklist with owner and date fields, the full shot list with per-shot consent status, the end-roll name gate, design tokens, and links to every document in the pack.

## Size warning: read before you attach anything

The animatic is **105 MB**, so a full zip lands at about **110 MB**. That is over the limit almost everywhere:

| Channel | Limit |
|---|---|
| Gmail | 25 MB |
| Outlook / Microsoft 365 | 20 MB |
| WhatsApp (document) | about 100 MB |
| Google Drive / WeTransfer / shared folder | fine |

Send the pack on Drive, WeTransfer or a shared folder. If you must email it, zip **without** the MP4 and share the animatic separately as an unlisted upload.

## Make a zip for external creatives

From the **repository root**:

```bash
zip -r LPET-kannada-film-handoff.zip \
  anniversary-video-production/kannada \
  anniversary-video-research \
  assets/images/timeline \
  -x "*.DS_Store" \
  -x "anniversary-video-production/kannada/tools/vo_eleven/*" \
  -x "anniversary-video-production/kannada/tools/__pycache__/*"
```

To exclude the animatic for an email-sized zip, add:

```bash
  -x "anniversary-video-production/kannada/08-kannada-animatic-preview.mp4"
```

Then tell recipients:

> Open `anniversary-video-production/kannada/team-handoff.html` in a browser.

Recipients must **unzip first**. Opening the page from inside a zip viewer breaks the relative links, the video and the subtitle track.

## Do not include

- `~/.elevenlabs_key` or any API keys
- Optional: `tools/vo_eleven/` (abandoned synthetic audition)

## What is in the pack

**Kannada production** (`anniversary-video-production/kannada/`)

| File | For |
|---|---|
| `team-handoff.html` | Everyone, open first |
| `01-kannada-final-script.md` | Narrator, booth |
| `02-kannada-voice-audition-plan.md` | Casting, audio |
| `03-kannada-storyboard.md` | Director, editor |
| `04-kannada-onscreen-text.md` | Designer |
| `05-kannada-subtitles.srt` | Editor |
| `05-kannada-subtitles.vtt` | The handoff page player only |
| `06-kannada-edit-decision-list.md` | Editor |
| `07-final-rights-and-approval-checklist.md` | Trust, producer |
| `08-kannada-animatic-preview.mp4` | Everyone |
| `08-kannada-animatic-poster.jpg` | Player poster frame |
| `favicon-32x32.png` | Browser tab icon for the handoff page |
| `08-kannada-animatic-notes.md` | Everyone |
| `09-elevenlabs-narration-guide.md` | Interim scratch read only |
| `10-cursor-elevenlabs-prompt.md` | Whoever runs the TTS |
| `tools/timeline.json` | Timing source of truth |
| `tools/README.md` | How to re-run the build |
| `tools/make_vtt.py` | Regenerates the `.vtt` after `make_srt.py` |

**Research and bilingual** (`anniversary-video-research/`): `00` project map, `01` source of truth, `02` evidence table, `03` impact and milestone data, `04` media inventory, `05` asset audit and gaps, `06` trustee questions, `07` creative brief, `08` English script, `09` Kannada source script, `10` bilingual storyboard, `11` short teaser scripts, `12` onscreen text and lower thirds, `13` credits and acknowledgements, `14` rights and publishing checklist.

## Two gates that need trustees, not creatives

1. **Guardian and partner consent** for the 22 consent-blocked shots. Visible per shot in the handoff page shot list, worklist in `07`.
2. **End-roll name verification.** No name goes on screen until a trustee confirms its spelling and the person agrees to be named. List in `anniversary-video-research/13-credits-and-acknowledgements.md`, section 4.

Both are long-lead items. Start them the day you send this pack.

## After the human narration arrives

Deliver WAV stems to the editor; re-time from `tools/timeline.json` as documented in `01` / `09` / `tools/README.md`. Picture master stays; only the narration stem changes. Regenerate `05-kannada-subtitles.srt` with `tools/make_srt.py`, then regenerate the `.vtt` from it so the handoff page stays in step.

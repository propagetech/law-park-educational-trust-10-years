# Share pack · Kannada film team handoff

## Open this first

**[`team-handoff.html`](team-handoff.html)** — one page for the NGO owner, director, narrator, designer and producer.

It includes the animatic player, role briefs, trustee decision checklist, full shot/narration table, design tokens, and links into the production docs.

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

Then tell recipients:

> Open `anniversary-video-production/kannada/team-handoff.html` in a browser.

## Do not include

- `~/.elevenlabs_key` or any API keys
- Optional: `tools/vo_eleven/` (abandoned synthetic audition)

## After the human narration arrives

Deliver WAV stems to the editor; re-time from `tools/timeline.json` as documented in `01` / `09` / `tools/README.md`. Picture master stays; only the narration stem changes.

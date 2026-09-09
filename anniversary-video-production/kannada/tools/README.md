# Timeline and render tools

Eight scripts. Together they rebuild the Kannada cut from the repository photographs
and the Kannada script, with no manual step.

```bash
python3 build_timeline.py timeline.json            # the timing table + consent register
python3 make_srt.py timeline.json ../05-kannada-subtitles.srt
python3 make_vtt.py                                # WebVTT for team-handoff.html
python3 gfx.py ../05-kannada-subtitles.srt         # 133 Kannada graphics, via Chrome
python3 vo.py                                      # scratch narration, fitted per line
python3 film.py silent.mp4                         # 7,596 frames, ~3.5 min
python3 film.py out.mp4 --stills                   # one PNG per shot, fast
python3 film.py out.mp4 --range 30 45              # one stretch only
```

For the 2160p delivery master (see `master.py`):

```bash
python3 gfx.py ../05-kannada-subtitles.srt --scale 2   # 133 graphics at 3840x2160
python3 master.py --check                              # the publishing gates
python3 master.py                                      # 4K review master
```

then mux the audio (see `08-kannada-animatic-notes.md` section 8).

Requires `ffmpeg`, Pillow, Playwright with Chromium, and the macOS `say` command
with the Kannada voice Soumya.

## build_timeline.py

Holds the shot list, the narration, the crops, the per-shot direction and the
consent register. `WPM = 105` at the top sets the film's TOTAL speech time; that
total is then shared out between lines by **display cluster count**, with digits
weighted at 3.25 clusters each because a year is spoken as Kannada number words.
Word count was the original model and it was wrong: see `08` section 2 for the
measurements that replaced it. Writes `timeline.json`, which is the single source of
timing truth for deliverables `01`, `03`, `05` and `06`. **If a narration line
changes, re-derive. Do not hand-edit the timecodes in four documents.**

## make_srt.py

Enforces the Kannada caption rules and refuses to emit a file quietly: it prints
`no violations`, or it prints every line over 32 display clusters and every cue
under 1.8 s. It also holds the whitelist of Kannada initials and the two personal
names that must never be split across a line break.

`--scale N` raises Chrome's `device_scale_factor` to N and writes to `gfx@Nx/`.
The CSS layout stays 1920x1080 CSS pixels, so no card needs editing and all type
is drawn natively at the higher resolution. `film.py --scale N` reads `gfx@Nx/`.

## make_vtt.py

Converts the `.srt` into `../05-kannada-subtitles.vtt`. The `.srt` remains the
editor deliverable; this exists only because browsers cannot read SRT, and
`team-handoff.html` loads the `.vtt` as the player subtitle track. Takes no
arguments and always writes next to the `.srt`. Re-run it after every
`make_srt.py` run, or the handoff page will show stale captions.

## master.py

Builds the 2160p delivery master: picture at `--scale 2` with no burned-in
subtitles, then the narration muxed and encoded to YouTube's recommended shape
(H.264 High, yuv420p, bt709, AAC 320k at 48 kHz, audio mastered to -14 LUFS,
which is YouTube's own normalisation target).

`--check` prints the five open publishing gates and builds nothing. `--release`
refuses to run while any gate is unwaived, and refuses outright if the narration
is still the scratch track. Pass the human read with `--vo path/to/narration.wav`.

**On 4K and this photo library.** The Kannada type is genuinely 4K, because
`gfx.py --scale 2` re-renders it in Chrome at the target resolution. The
photography is not: the largest still is 1920x1446 and 29 of 34 unique files are
under 1920px, so at 2160p the stills are Lanczos-enlarged 2x to 4x. The reason
to deliver 4K anyway is that YouTube gives a 2160p upload a better codec and
bitrate than a 1080p one, so even 1080p viewers see a cleaner picture. Judge the
master on type crispness, not on photographic detail.

Subtitles are deliberately **not** burned into the master. Upload
`05-kannada-subtitles.srt` as a YouTube caption track so it stays toggleable,
searchable and translatable.

## gfx.py

Renders every Kannada graphic through **headless Chrome**, which shapes complex
scripts via HarfBuzz. This is not a stylistic choice. On this machine
`ffmpeg` has no `drawtext` or `libass`, and Pillow reports `raqm: False`, so
neither can shape Kannada: they would break conjuncts and misplace vowel signs
without raising an error, which is the silent failure `14` item 7.8 is about.
**Never move Kannada text rendering to PIL or to ffmpeg.**

Noto Serif Kannada is not installed here, so display titles use Noto Sans
Kannada 700, the fallback `07` section 9 nominates. Install the serif and
re-render before the graded master; the layouts will not move.

## film.py

Composites the photography frame by frame and pipes raw RGB24 to ffmpeg. `G`
holds the per-shot geometry (crop window, placement, push); `OV` holds the
overlay timing. Photography is handled by PIL; all text arrives as pre-rendered
PNGs from `gfx.py`.

Card-to-card transitions dip through the shared navy rather than cross-dissolving,
because cross-dissolving two typographic cards overlays two blocks of Kannada.

## vo.py

Builds the **scratch** narration with the macOS Kannada voice Soumya (kn_IN), fitting
each line to the exact speech allocation its shot already has by iterating the `say`
rate. Picture never moves to accommodate audio. Prints the rate range and the
worst-fitting line, which is the diagnostic that caught the timing-model error:
a wide rate range means the allocations do not match how long the Kannada takes to say.

**This is a temp track, not the narration.** `14` items 5.5 and 7.1 and `02` section 7
all gate the real recording.

## tts_eleven.py

Generates the narration with ElevenLabs, one file per line, and measures what came
back. **Kannada is supported by `eleven_v3` only** (not Multilingual v2, not Flash
or Turbo v2.5, which are the default in most examples), so `MODEL` is pinned and
must stay pinned. Reads the key from `ELEVENLABS_API_KEY`; never hardcode it.

v3 has no speed control, so once a voice is cast the narration leads and the
picture follows: `build_timeline.py --from-audio <durations.json>` re-times the
whole film to the real read. Full instructions in
`09-elevenlabs-narration-guide.md`.

    python3 tts_eleven.py --voices
    python3 tts_eleven.py --audition <VOICE_ID>      # 288 characters
    python3 tts_eleven.py --render <VOICE_ID>        # 3,585 characters

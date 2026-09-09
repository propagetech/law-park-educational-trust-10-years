# Timeline and render tools

Eighteen scripts. Together they rebuild the Kannada cut from the repository
photographs and the Kannada script, with no manual step.

```bash
python3 build_timeline.py timeline.json            # the timing table + consent register
python3 make_srt.py timeline.json ../05-kannada-subtitles.srt
python3 make_vtt.py                                # WebVTT for team-handoff.html
python3 gfx.py ../05-kannada-subtitles.srt         # 133 Kannada graphics, via Chrome
python3 vo.py                                      # scratch narration, fitted per line
python3 stem.py <VOICE_ID>                         # ElevenLabs lines -> one aligned WAV
python3 sfx.py --check                             # validate sound-effect placements
python3 sfx_voicecheck.py sfx/<file>.mp3           # screen an ambience bed for human voice
python3 make_logo.py                               # recover the 976px logo from the purple lockup
python3 cue.py                                     # regenerate the cinematic cue sheet
python3 cue.py --audit-docs                        # timecodes typed into the audio docs
python3 log.py                                     # regenerate the SFX licence log
python3 mix.py --check                             # measure effects against the narration
python3 mix.py --calibrate                         # stems, masters and previews -> mix/
python3 film.py silent.mp4                         # full warm cut, burned subs
python3 film.py silent-fallback.mp4 --fallback     # Part 12 consent fallback
python3 film.py out.mp4 --stills                   # one PNG per shot, fast
python3 film.py out.mp4 --range 30 45              # one stretch only
python3 wcag_audit.py                              # contrast, title safe, subtitle timing
python3 frame_audit.py                             # enlargement and frame use per shot
python3 rebuild_deliverables.py                    # re-mux the four deliverables
```

`wcag_audit.py` and `frame_audit.py` are the two that answer "is this good
enough to show". The first measures every glyph against the background it really
sits on, checks all type is inside the 90 percent title-safe box, and checks
subtitle reading speed; it exits non-zero on any failure. The second reports how
hard each shot's photography is enlarged and how much of the frame is
photograph, which are the two numbers a framing decision trades against.

`--fallback` keeps the full narration timing and swaps every consent-blocked /
Udayavani shot for a face-free still. Use it when `07` item 1.1 is unsigned;
see `12-cursor-event-master-prompt.md` and `13-event-playback-notes.md`.

**Re-render the graphics for the scale you are rendering.** `gfx/` and `gfx@2x/`
are separate caches, and a 4K render against a stale `gfx@2x/` silently ships
the previous version of every card. `film.py` refuses if `gfx.py` is newer than
the manifest of the directory it is about to read.

No video is committed to this repository: `.gitignore` excludes `*.mp4` and the
other video containers. Every render below is reproducible from `timeline.json`
plus the repository photographs, so rebuild rather than hunt for a file.

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

The render cache is keyed on the **HTML of each card**, recorded in
`gfx/.manifest.json`, not on the filename. Filename-only caching is a silent
failure: `SUB_NNN` is an index into the cue list, so any re-time that changes
where cues split renumbers them, and every old PNG then sits under a new index
carrying the previous cue's Kannada. The film renders clean and the burned
subtitles are simply the wrong lines. That is exactly what the ElevenLabs
re-time did, growing the cue list from 80 to 83 so that only 3 graphics looked
new. Orphaned PNGs whose card no longer exists are deleted on each run. If the
manifest is missing, every graphic is re-rendered once so the cache and the cue
list cannot disagree.

Noto Serif Kannada is not installed here, so display titles use Noto Sans
Kannada 700, the fallback `07` section 9 nominates. Install the serif and
re-render before the graded master; the layouts will not move.

## stem.py

Assembles the per-line ElevenLabs MP3s into one timeline-aligned narration WAV,
which is what `master.py --vo` and the animatic mux both want. `vo.py` already
does this for the scratch track; this is its ElevenLabs counterpart.

Run it only **after** `build_timeline.py --from-audio`, or the shots still carry
the predicted allocations and every line after the first drift sits wrong. It
refuses to build if any narrating shot has no MP3, and it reports any line that
runs past its shot and bleeds over the cut.

The voice is named on the command line rather than discovered, because
`sorted(glob("vo_eleven/*/durations.json"))[-1]` silently loses to any sibling
directory that sorts later: an audition backup, a second voice, `VOICE_ID_HERE`.
That would build a stem from five lines out of forty-three and still print
success. Run `python3 stem.py` with no argument to list what is there.

## cue.py

Builds `../Kannada-cue-sheet.csv` from `timeline.json` and `sfx/placements.csv`:
46 music cues and 14 effect events, one row each, sorted by timecode.

`--check` validates the cue table without writing: every shot has exactly one
music cue, no cue sits inside a silence cue, no effect's fade-out crosses into
one, the 14-effect cap holds, and every placement has a cue row and vice versa.
It prints the clearance in seconds from each effect's tail to the next silence
cue.

`--audit-docs` reads the three audio markdown documents and checks every
shot-and-timecode pair typed into their prose against `timeline.json`. Prose
cannot be generated, so those numbers go stale on a re-time; three of them had
already drifted when this check was written. Run it after any re-time.

## log.py

Rebuilds `../Kannada-sfx-licence-log.csv` from `sfx/placements.csv`, keeping
every column a person filled in: download date, licence text captured that day,
evidence file, approval and notes are carried across by `cue_key`, and the
timecodes, levels, gains and fades are derived fresh. `--check` reports which
rows still have no licence evidence, which `07` item 5.9 is about, and writes
nothing.

## mix.py

Builds the audio deliverables into `mix/`: the dialogue stem, the effects stem,
a music stem when `--music` names a bed, an event master at -23 LUFS
high-passed at 65 Hz, an online master at -16 LUFS, and four previews. Both
masters are two-pass `loudnorm` with a -3 dBTP ceiling.

It measures the narration's speech RMS with the silences removed, then measures
each trimmed and faded excerpt and derives the gain that lands it on the level
`placements.csv` asks for in `level_rel_narr_db`. `--calibrate` writes those
gains back into the `gain_db` column so `sfx.py` cannot disagree with it.
`--check` prints the whole measurement table and writes nothing.

After every build it measures `K06`, `K12`, `K27` and `K34` in the built stems
and refuses to finish if any is above -70 dBFS, and it checks that every stem
and master is exactly the length of the picture. Without `--music` the output is
stamped `NOMUSIC`, and the effects stem and everything containing it is stamped
`UNAPPROVED`, because `07` items 5.1 and 5.8 are both open.

## sfx.py

Mixes sound effects from `sfx/` into the narration stem, per `sfx/placements.csv`.
Offsets are measured from each shot's `t_in`, so placements survive a re-time.

It refuses more than it accepts, on purpose. No placement may land in the
silence cues `K06`, `K12`, `K27` or `K34`; `K37` and `K43` warn, and fail under
`--strict`; and the effects BUS, not each effect on its own, is held 12 dB under
the voice, measured in the window each effect occupies rather than across the
whole film. An effect playing where there is no voice takes a stated solo level
instead. Beds are looped with a crossfade and have the silence cues carved out
of them with a 0.40s fade either side. An effect with no
row in `Kannada-sfx-licence-log.csv` warns, because `07` item 5.9 makes the
log the record of what shipped.

`06` section 7 builds this film's audio around its silences. An effect dropped
into one renders cleanly and is still wrong, which is the same silent-failure
shape as the old gfx cache, so the rules are enforced in code rather than left
to the mix.

**Output is a LEARNING mix.** `07` item 5.7 forbids sound effects and 5.8 is
unsigned, so this writes `narration_plus_sfx_LEARNING.wav` and never touches the
narration stem or a master.

## film.py

Composites the photography frame by frame and pipes raw RGB24 to ffmpeg. `G`
holds the per-shot geometry (crop window, placement, push); `OV` holds the
overlay timing. Photography is handled by PIL; all text arrives as pre-rendered
PNGs from `gfx.py`.

Card-to-card transitions dip through the shared navy rather than cross-dissolving,
because cross-dissolving two typographic cards overlays two blocks of Kannada.

## wcag_audit.py

Composites every graphic over its own shot at full opacity and reports the
contrast of each run of type against the background it is really sitting on.
Then checks that all type is inside the 90 percent title-safe box, and that
subtitle reading speed and duration are inside the Netflix Kannada guideline.
Exits non-zero on any failure. `--scale 2` audits the 4K set.

It measures rather than reasons because a palette check missed two real
failures: the K31 and K32 labels, which were navy type over bare photography
after those shots went full-bleed, and the logo, three quarters of whose pixels
are 1.04:1 against navy while the two colours anyone would check passed easily.

It has to tell type from scrims and rules, which share the type's colours, so it
classifies by shape: a scrim fills 0.86 to 0.90 of its own bounding box and
glyphs fill 0.15 to 0.19.

## frame_audit.py

Per shot, how far the photography is enlarged including `push`, and how much of
the frame is photograph. Those are the two numbers a framing decision trades
against, and the card treatment traded them without saying so: it never enlarged
its photograph and left up to 79.5 percent of the frame flat.

## make_logo.py

Keys the flat purple ground out of `logo-purple.png` and writes
`tools/logo-hires.png` at 976x833. The repository's `logo.png` is 300x257, and
gfx.py draws the mark at 238 CSS px, which at `--scale 2` is 476 device pixels;
the two files are the same artwork, matching to a mean of 3.8/255 when logo.png
is composited over that purple.

## rebuild_deliverables.py

Re-muxes the four deliverables onto whatever audio and picture are on disk,
stream-copying the video, which is four minutes rather than forty. Each output
is measured once and given a single fixed gain, because single-pass loudnorm is
dynamic and would lift the noise floor inside K06, K12, K27 and K34. Bounded by
`-t` from the picture's own duration and not by `-shortest`, which took the 4K
master to 350.88s and lost its whole end card, because a subtitle stream ends at
its last cue.

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

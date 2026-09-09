# 12 · Cursor prompt · Build the event master for hall projection

Paste section A into Cursor with this repository open. Section B is the
background it refers to.

---

## A · The prompt to paste

```text
You are working in the Kannada anniversary film pack at
anniversary-video-production/kannada/ in this repository. Read before you act:
tools/README.md, 06-kannada-edit-decision-list.md section 7,
07-final-rights-and-approval-checklist.md, and
../anniversary-video-research/14-rights-consent-and-publishing-checklist.md.

GOAL
Build an EVENT MASTER for projection in a hall, from the existing picture and
the existing ElevenLabs narration. The film is 336.04 s, 00:05:36:01, 46 shots,
25 fps. Do not re-time it and do not re-render the picture unless a step below
tells you to.

STEP 0. THE CONSENT GATE. Do this first and stop if it fails.
Open 07 Part 1 item 1.1. It lists 22 shots containing identifiable children:
K02 K03 K11 K13 K14 K15 K16 K19 K20 K23 K24 K28 K30 K32 K33 K39 K40 K41 K42
K43 K44 K45. 07 line 13 states the film cannot be screened anywhere, including
the Trust's own event, until written guardian consent exists for those children,
Udayavani permits the K36 clipping, and a music licence is in place.

Print the status of 07 items 1.1, 1.12, 4.x (Udayavani) and 5.1 and ASK THE
OPERATOR which of these is signed. Do not infer, do not assume, do not proceed
on silence.
  - If 1.1 is signed: continue to STEP 1 and build the full cut.
  - If 1.1 is NOT signed: do NOT build the full cut for the event. Build the
    fallback described in 14 Part 12 instead: a cut using only the school
    exteriors with no people, supplies and stationery details, empty library
    shelves, the car boot, the two posters, the certificate, the trustee
    portraits and the typographic cards. It carries the entire narration.
    Report which shots you dropped and the resulting duration, then stop and
    let the operator decide.

STEP 1. AUDIO. The hall spec is different from the online spec.
14 item 8.7: event -23 LUFS, online -16 LUFS, peaks no higher than -3 dBTP,
music at least 12 dB below narration. Every existing render is at the ONLINE or
YOUTUBE level and is wrong for a hall:
  08-kannada-animatic-preview.mp4   -16.7 LUFS
  08-kannada-sfx-learning-mix.mp4   -16.7 LUFS
  kannada-2160p-review.mp4          -14.9 LUFS

Use TWO-PASS loudnorm, not one. Single-pass lands roughly 0.6 LU off target,
which was measured on this pack. Measure first:

  ffmpeg -i <input audio> -af loudnorm=I=-23:TP=-3.0:LRA=11:print_format=json \
    -f null - 2>&1 | tail -20

then apply the measured_I, measured_TP, measured_LRA and measured_thresh values
in a second pass with linear=true.

Also apply a gentle high-pass at 60 Hz before the loudnorm. 11 section 2 asks
for reduced bass on auditorium playback, and hall subwoofers exaggerate the
low end of the boom and riser effects. Do not remove more than this: a steep
filter will thin the narration.

STEP 2. SUBTITLES MUST BE BURNED IN.
A projector has no caption track. kannada-2160p-review.mp4 was built with
--no-subs because it was aimed at YouTube. For the hall, build the picture WITH
burned-in subtitles, which is film.py's default. Verify the burned cues match
subs.json before you trust them: gfx.py caches on the HTML of each card, so a
stale cache previously burned the wrong lines while rendering cleanly. Run
gfx.py first and confirm it reports 0 to render, or re-renders knowingly.

STEP 3. BUILD.
Deliver 1920x1080, not 2160p. House projectors and event laptops handle 1080p
H.264 reliably; a 4K file is a risk on unknown hardware for no visible gain at
projection distance. Keep kannada-2160p-review.mp4 as the backup.

  cd anniversary-video-production/kannada/tools
  python3 gfx.py ../05-kannada-subtitles.srt
  python3 film.py silent.mp4
  # then two-pass loudnorm the narration and mux, per STEP 1

Name the output:
  anniversary-video-production/kannada/kannada-1080p-EVENT-master.mp4
Set the metadata title to include "EVENT MASTER" and the date.
Encode: H.264 High, yuv420p, 25 fps, CRF 18 or 20 Mbps CBR, and tag colour
explicitly with -colorspace bt709 -color_primaries bt709 -color_trc bt709.
The existing masters tag only the matrix and leave primaries and transfer
unknown, which makes some players guess.
Audio: AAC 320k, 48 kHz, STEREO. Many hall systems feed only one channel from a
mono file. Duplicate the mono narration into both channels.
Add -movflags +faststart.

STEP 4. VERIFY, AND REPORT NUMBERS RATHER THAN ASSURANCES.
Print each of these as a measured value:
  a. ffmpeg -v error -i <out> -f null -   must produce no output
  b. integrated loudness within 0.5 LU of -23, true peak at or below -3.0 dBFS
  c. duration 336.04 s and 8401 video frames, or the fallback's own figures
  d. both audio channels non-silent and identical
  e. no black frames longer than 0.5 s (blackdetect)
  f. burned subtitle identity: for every cue in subs.json, extract the frame at
     the cue midpoint, mask the white glyph pixels in the region occupied by
     gfx/SUB_NNN.png, and confirm containment above 0.6 against its own card
     and clearly lower against the neighbouring card. Report the count, not a
     sample. A wrong caption is still valid Kannada and looks correct.
  g. K06 must measure silence across 30.42 to 36.42 s. K12, K27 and K34 must
     carry narration only, with no effect energy. 06 section 7.

STEP 5. HAND-OFF NOTES.
Write anniversary-video-production/kannada/13-event-playback-notes.md with:
  - the exact file to play and its SHA-256
  - a second copy on a different USB stick, and the 2160p file as the backup
  - play from a local file, never from a browser, never from Drive
  - test on the actual PA at the actual volume before the audience is seated,
    because -23 LUFS sounds quiet on a laptop and correct in a hall
  - confirm 16:9, no letterboxing, no player UI visible
  - who is operating playback and who is standing by

WHAT NOT TO DO
- Do not re-time the film. timeline.json is derived from the ElevenLabs read.
- Do not hand-edit timecodes in 01, 03, 04 or 06.
- Do not place any sound effect in K06, K12, K27 or K34, no fanfare at K37, no
  climax at K43. Use tools/sfx.py, which enforces this.
- Do not mark any 07 gate as signed. Only the Trust signs those.
- Do not upload anything anywhere.
```

---

## B · Why each instruction is there

**The consent gate is step 0 because a stage is a screening.** `07` line 13
names the Trust's own event explicitly. 22 of 46 shots contain identifiable
children without written guardian consent, and `07` item 1.12 additionally
requires a named safeguarding contact to view the final cut before any release,
the event included. `14` Part 12 exists precisely for this situation and says
the fallback is colder but publishable.

**-23 LUFS, not -16.** `14` item 8.7 sets two different targets and every file
currently in the pack is at the online or YouTube one. A film mastered at -14
LUFS into a hall PA is roughly 9 dB hot, which on a compressed system means the
narration will sound harsh and the quiet cues will not read as quiet.

**Two-pass loudnorm** because single-pass on this pack measured -16.6 and -14.9
against -16 and -14 targets. At -23 that error matters more, since the whole
point is that the three silence cues sit far below the speech.

**Burned-in subtitles** because a projector plays a file, not a caption track.
The `.srt` is for YouTube.

**1080p rather than 2160p** because the gain from 4K here is codec headroom on
YouTube, not detail: the largest source still is 1920x1446 and 29 of 34 unique
files are under 1920 px. On a hall projector at 25 m there is nothing to see
that 1080p does not carry, and an unknown event laptop is far more likely to
stumble on a 4K file.

**Stereo, not mono.** Every render so far is mono, and hall systems routinely
take only the left channel from a stereo path.

**Verification f** is written out in full because this pack has already shipped
a file with the wrong captions burned in. `gfx.py` cached on filename, the cue
list grew from 80 to 83, every index shifted, and the render was clean. The
cache is content-addressed now, but the check is cheap and the failure is
invisible.

---

## C · The judgement call this prompt cannot make for you

The narration is **ElevenLabs, not a human voice**. `02` governs casting and
`07` item 5.5 requires a signed narrator release. For a private review that is
a reasonable stand-in. In a hall, in Kannada, in front of an audience that
includes a celebrated Kannada writer, a synthetic read is likely to be noticed,
and being noticed is the risk: the film's whole argument is that this work is
unshowy and real.

There is also **no music bed**. `06` section 7 specifies 26 cues of bansuri and
drone with three structural silences, and none of it is sourced or licensed.
Narration plus eight effects over silence will feel sparse on a large system in
a way it does not on headphones.

Neither is a technical defect and neither is something a build script can fix.
Both are worth a decision before the date rather than on it.

# Drop effect files here

`sfx.py` reads every file named in `placements.csv` from this directory.
MP3 or WAV, whatever Pixabay gives you. Nothing here is committed: `.gitignore`
excludes audio, and the licence record lives in
`../../Kannada-sfx-licence-log.csv`, not in the filenames.

Workflow:

1. Download 2 to 3 candidates per category from the searches in `11`.
2. Save the asset page as PDF or screenshot on the same day. `07` item 5.9.
3. Add a row per effect to `Kannada-sfx-licence-log.csv`.
4. List placements in `placements.csv`, then `python3 sfx.py --check`.

`sfx.py` refuses to place anything in `K06`, `K12`, `K27` or `K34`, warns on
`K37` and `K43`, caps the film at 14 effects, and pulls any effect that would
sit less than 12 dB under the narration.

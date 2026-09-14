# -*- coding: utf-8 -*-
"""
The single source of truth for the 30-photo cut.

One entry per shot. Every deliverable in this folder is generated from this
file: the timeline, both transcripts, both subtitle sets, the on-screen text
sheet and the sound-effect placements. If a line changes here, re-run
`build.py` and every document moves together. Do not hand-edit a generated file.

Format of a shot:

  sid       shot id, S01 to S30, and the running order
  kid       the shot id the approved Kannada EDL gave this photograph
  act       act number and title, English then Kannada
  photo     file name inside photo-pack-10-years/enhanced/
  dur       shot duration in seconds. The picture cut is identical in both
            languages, so both narrations are written to fit this number
  see       what the photograph actually shows, read off the frame
  head_en   foreground heading, English. "//" is a line break
  head_kn   foreground heading, Kannada
  role      heading register: title, quote, year, fact, name, partners, end
  vo_en     English narration for this shot
  vo_kn     Kannada narration for this shot
  claim     claim ids from research/02-evidence-table.csv
  consent   consent state carried forward from the approved register
  note      direction for the editor
"""

FPS = 25
TOTAL = 300.0  # seconds. 7,500 frames at 25 fps.

# English is written to 140 wpm, the pace 08-english-five-minute-script.md sets.
WPM_EN = 140

ACTS = [
    (1, "The walk to school", "ಶಾಲೆಗೆ ನಡಿಗೆ"),
    (2, "How it started", "ಹೇಗೆ ಶುರುವಾಯಿತು"),
    (3, "A decade of showing up", "ಹತ್ತು ವರ್ಷ ಜೊತೆಗಿದ್ದದ್ದು"),
    (4, "The way the work is done", "ಕೆಲಸ ನಡೆಯುವ ರೀತಿ"),
    (5, "The widening circle", "ಹಿಗ್ಗುತ್ತಿರುವ ವೃತ್ತ"),
    (6, "Gratitude, and the next ten", "ಕೃತಜ್ಞತೆ, ಮತ್ತು ಮುಂದಿನ ಹತ್ತು"),
]

SHOTS = [
    # ------------------------------------------------------------------ ACT 1
    dict(
        sid="S01", kid="K04", act=1, dur=9.0,
        photo="2025-colorful-school-building-mantihadi__K04-enhanced.png",
        see="Government Higher Primary School, Mantihadi. Yellow and red painted "
            "front, green doors, coconut palms behind, Kannada name board across "
            "the facade. One adult in the lower left corner.",
        role="title",
        head_en="LAW PARK EDUCATIONAL TRUST // Ten Years · 2016 to 2026",
        head_kn="ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ // ಹತ್ತು ವರ್ಷ · 2016 ರಿಂದ 2026",
        vo_en="Every year, in villages across Karnataka, children walk to a school like this one.",
        vo_kn="ಪ್ರತಿ ವರ್ಷ, ಕರ್ನಾಟಕದ ಹಳ್ಳಿಗಳಲ್ಲಿ, ಮಕ್ಕಳು ಇಂಥದೇ ಒಂದು ಶಾಲೆಗೆ ನಡೆದು ಬರುತ್ತಾರೆ.",
        claim="[ORG-13]",
        consent="CLEAR after a crop above the adult at lower left",
        note="Hold the frame still for the first 3s so the title can be read, then "
             "a 3 percent push toward the name board. Verify the Mantihadi board "
             "lettering on the enhanced render before picture lock.",
    ),
    dict(
        sid="S02", kid="K02/K43", act=1, dur=10.0,
        photo="2025-schoolwide-supplies-group-photo__K02-K43-enhanced.png",
        see="The whole school outdoors on grass in front of the same Mantihadi "
            "building. Roughly fifty children and adults, children holding wrapped "
            "bags and orange notebooks.",
        role="fact",
        head_en="Everything they own, // in one bag",
        head_kn="ಇರುವುದೆಲ್ಲವೂ // ಒಂದೇ ಚೀಲದಲ್ಲಿ",
        vo_en="They carry everything they own in one bag. They are bright, and they are ready to learn.",
        vo_kn="ತಮ್ಮ ಬಳಿ ಇರುವುದೆಲ್ಲವನ್ನೂ ಒಂದೇ ಚೀಲದಲ್ಲಿ ಹೊತ್ತು ಬರುತ್ತಾರೆ. ಅವರಿಗೆ ಬುದ್ಧಿ ಇದೆ, ಕಲಿಯುವ ಹಂಬಲ ಇದೆ.",
        claim="",
        consent="BLOCKING · approximately 60 identifiable children and adults",
        note="Heading sits lower left, clear of the faces. 3 percent push in.",
    ),
    dict(
        sid="S03", kid="K03", act=1, dur=8.0,
        photo="2025-child-with-school-kit-close-up__K03-enhanced.png",
        see="Two children in profile, laughing, holding wrapped maroon bags and a "
            "geometry and craft kit. A painted fruit chart in Kannada behind them, "
            "women standing at the back.",
        role="fact",
        head_en="A school fee decides.",
        head_kn="ಶಾಲಾ ಶುಲ್ಕ ತೀರ್ಮಾನಿಸುತ್ತದೆ.",
        vo_en="And somewhere between that walk and the classroom, a school fee decides.",
        vo_kn="ಆ ನಡಿಗೆಗೂ ತರಗತಿಗೂ ನಡುವೆ, ಶಾಲಾ ಶುಲ್ಕ ಒಂದು ತೀರ್ಮಾನ ತೆಗೆದುಕೊಂಡು ಬಿಡುತ್ತದೆ.",
        claim="",
        consent="BLOCKING · two children in close-up, fully identifiable. Highest "
                "priority release in the film",
        note="No push. The laugh sits still. The heading fades up only on the word "
             "'decides' and the last 2.5s are dry: room tone, one piano note, "
             "nothing else.",
    ),
    dict(
        sid="S04", kid="K40", act=1, dur=9.0,
        photo="2025-schoolchildren-showing-bags-on-veranda__K40-enhanced.png",
        see="Teal and red school veranda. About twenty children holding wrapped "
            "bags printed LAW PARK EDUCATIONAL TRUST, a blackboard at right.",
        role="quote",
        head_en="“When it comes to education, no child // deserves to be left behind.” "
                "// Charulatha M. R., Founder",
        head_kn="“ಶಿಕ್ಷಣದ ವಿಷಯದಲ್ಲಿ ಯಾವ ಮಗುವೂ // ಹಿಂದೆ ಉಳಿಯಬಾರದು.” "
                "// ಚಾರುಲತಾ ಎಂ. ಆರ್., ಸಂಸ್ಥಾಪಕಿ",
        vo_en="For ten years, one Trust has stood at exactly that point, one child at a time.",
        vo_kn="ಹತ್ತು ವರ್ಷಗಳಿಂದ, ಒಂದು ಟ್ರಸ್ಟ್ ಸರಿಯಾಗಿ ಅಲ್ಲಿಯೇ ಬಂದು ನಿಂತಿದೆ. ಒಂದೊಂದೇ ಮಗುವಿಗೆ.",
        claim="[ORG-13, NUM-08, MIS-02]",
        consent="BLOCKING · approximately 20 identifiable children",
        note="The quote is the act seal. It holds for the last 3s over the "
             "photograph with the narration already out.",
    ),
    # ------------------------------------------------------------------ ACT 2
    dict(
        sid="S05", kid="K08", act=2, dur=11.0,
        photo="founders-charulatha-mr-founder-portrait__K08-enhanced.png",
        see="Charulatha M. R. at a white office desk, sari, monitor at left, "
            "papers and two succulents on the desk.",
        role="name",
        head_en="Charulatha M. R. // Founder",
        head_kn="ಚಾರುಲತಾ ಎಂ. ಆರ್. // ಸಂಸ್ಥಾಪಕಿ",
        vo_en="The Trust was founded by Charulatha M. R. She had been paying school fees "
              "for neighbourhood children long before there was a Trust.",
        vo_kn="ಟ್ರಸ್ಟ್ ಸ್ಥಾಪಿಸಿದವರು ಚಾರುಲತಾ ಎಂ. ಆರ್. ಟ್ರಸ್ಟ್ ಶುರುವಾಗುವ ಮೊದಲೇ ಅವರು ತಮ್ಮ "
              "ಬಡಾವಣೆಯ ಮಕ್ಕಳ ಶಾಲಾ ಶುಲ್ಕವನ್ನು ತಾವೇ ಕಟ್ಟುತ್ತಿದ್ದರು.",
        claim="[PPL-01, ORG-04, ORG-05]",
        consent="CLEAR · trustee, consent on file",
        note="Portrait. No effect on this shot and the next: two faces, two names, "
             "let them be quiet.",
    ),
    dict(
        sid="S06", kid="K09", act=2, dur=10.0,
        photo="founders-trustee-sm-manjunatha-portrait__K09-enhanced.png",
        see="S. M. Manjunatha at a wooden office desk in a suit, monitor and "
            "printer at left, calculator and desk phone at right.",
        role="name",
        head_en="S. M. Manjunatha // Trustee · Sadenahalli",
        head_kn="ಎಸ್. ಎಂ. ಮಂಜುನಾಥ // ಟ್ರಸ್ಟಿ · ಸಾದೇನಹಳ್ಳಿ",
        vo_en="She was joined by S. M. Manjunatha of Sadenahalli, the first in his family "
              "to leave the village to study.",
        vo_kn="ಅವರ ಜೊತೆಗೂಡಿದವರು ಸಾದೇನಹಳ್ಳಿಯ ಎಸ್. ಎಂ. ಮಂಜುನಾಥ. ಓದಲೆಂದು ಊರು ಬಿಟ್ಟು "
              "ನಗರಕ್ಕೆ ಬಂದ ತಮ್ಮ ಕುಟುಂಬದ ಮೊದಲ ವ್ಯಕ್ತಿ.",
        claim="[PPL-02]",
        consent="CLEAR · trustee, consent on file",
        note="Source is WebP only. Request a JPEG original before the 4K master.",
    ),
    dict(
        sid="S07", kid="K11", act=2, dur=11.0,
        photo="2016-chikkaballapur-first-school-visit-founder-teaching__K11-enhanced.png",
        see="A rural classroom. The founder stands addressing about thirty children "
            "seated on the floor. Blackboard with arithmetic behind her, anatomy "
            "and map charts on green walls, three men on chairs at the side.",
        role="year",
        head_en="2016 · Chickaballapur // First school visit. First scholarship.",
        head_kn="2016 · ಚಿಕ್ಕಬಳ್ಳಾಪುರ // ಮೊದಲ ಶಾಲಾ ಭೇಟಿ. ಮೊದಲ ವಿದ್ಯಾರ್ಥಿವೇತನ.",
        vo_en="In 2016 they made their first school visit. Chickaballapur. One child. One scholarship.",
        vo_kn="2016ರಲ್ಲಿ ಅವರು ಮೊದಲ ಶಾಲಾ ಭೇಟಿ ಮಾಡಿದರು. ಚಿಕ್ಕಬಳ್ಳಾಪುರ. ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ.",
        claim="[TML-2016, NUM-02]",
        consent="BLOCKING · approximately 30 identifiable children and 4 adults",
        note="The origin beat. One page turn on the cut, then the last 4s are silent "
             "under 'One child. One scholarship.'",
    ),
    dict(
        sid="S08", kid="K13", act=2, dur=9.0,
        photo="2016-steel-plates-and-glasses-distribution-150-students__K13-enhanced.png",
        see="Children seated in a long row along a veranda wall, hands folded, a "
            "steel plate and a green water bottle set in front of each one. The "
            "row runs the full depth of the frame.",
        role="fact",
        head_en="150 students // steel plates and steel glasses",
        head_kn="150 ವಿದ್ಯಾರ್ಥಿಗಳು // ಸ್ಟೀಲ್ ತಟ್ಟೆ ಮತ್ತು ಲೋಟ",
        vo_en="On the same visit, a hundred and fifty students received steel plates and steel glasses.",
        vo_kn="ಅದೇ ಭೇಟಿಯಲ್ಲಿ ನೂರೈವತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸ್ಟೀಲ್ ತಟ್ಟೆ ಮತ್ತು ಲೋಟ ವಿತರಿಸಲಾಯಿತು.",
        claim="[TML-2016, NUM-01]",
        consent="BLOCKING · approximately 15 identifiable children",
        note="Push along the line of plates, not into the faces. The 150 numeral "
             "carries the heading; set it in the display face.",
    ),
    dict(
        sid="S09", kid="K14", act=2, dur=10.0,
        photo="2017-scholarship-group-photo-school-veranda-10-students__K14-enhanced.png",
        see="A tiled school veranda open to a garden. Twelve adults and two "
            "children standing for a group photograph.",
        role="year",
        head_en="2017 · One became ten",
        head_kn="2017 · ಒಂದು ಹತ್ತಾಯಿತು",
        vo_en="In 2017, one became ten. Ten students received scholarships, and the work simply continued.",
        vo_kn="2017ರಲ್ಲಿ ಒಂದು ಹತ್ತಾಯಿತು. ಹತ್ತು ಮಕ್ಕಳಿಗೆ ವಿದ್ಯಾರ್ಥಿವೇತನ. ಕೆಲಸ ಹಾಗೇ ಮುಂದುವರಿಯಿತು.",
        claim="[TML-2017, NUM-03]",
        consent="BLOCKING · 14 identifiable people including 2 children",
        note="Act 2 into act 3. The whoosh sits on the last 2s, under no narration.",
    ),
    # ------------------------------------------------------------------ ACT 3
    dict(
        sid="S10", kid="K15a", act=3, dur=8.0,
        photo="2018-classroom-presentation-session__K15a-enhanced.png",
        see="A classroom. Blackboard headed Social Science and dated. A woman in a "
            "maroon sari stands, a man at right reads from a sheet, two men seated "
            "on red plastic chairs, children's heads across the foreground.",
        role="year",
        head_en="2018 · The same roads",
        head_kn="2018 · ಅದೇ ದಾರಿಗಳು",
        vo_en="Year after year, the same roads, the same schools, and more children.",
        vo_kn="ವರ್ಷದಿಂದ ವರ್ಷಕ್ಕೆ. ಅದೇ ದಾರಿಗಳು, ಅದೇ ಶಾಲೆಗಳು, ಇನ್ನಷ್ಟು ಮಕ್ಕಳು.",
        claim="[TML-2018]",
        consent="BLOCKING · 4 identifiable adults, children in foreground from behind",
        note="Act 3 opens. The open field wind bed comes in here and runs to S16.",
    ),
    dict(
        sid="S11", kid="K15b", act=3, dur=9.0,
        photo="2019-community-group-photo-outdoors__K15b-enhanced.png",
        see="A group of about fifteen adults and children under a large tree beside "
            "a small painted village temple, bunting overhead, a dirt yard.",
        role="year",
        head_en="2019 · The ordinary years",
        head_kn="2019 · ಸಾಮಾನ್ಯ ವರ್ಷಗಳು",
        vo_en="Nobody photographs the ordinary years. These are the years the work is made of.",
        vo_kn="ಸಾಮಾನ್ಯ ವರ್ಷಗಳನ್ನು ಯಾರೂ ಫೋಟೋ ತೆಗೆಯುವುದಿಲ್ಲ. ಆದರೆ ಕೆಲಸ ಕಟ್ಟಿರುವುದು ಆ ವರ್ಷಗಳಿಂದಲೇ.",
        claim="[TML-2019]",
        consent="BLOCKING · approximately 15 identifiable people",
        note="No effect. The bed carries it.",
    ),
    dict(
        sid="S12", kid="K16", act=3, dur=11.0,
        photo="2021-scholarship-distribution-crowd__K16-enhanced.png",
        see="A large crowd, well over a hundred people, on grass outside an old "
            "school building under a bright blue sky. Red plastic chairs, papers "
            "being held up.",
        role="year",
        head_en="2020 to 2021 · Pandemic relief // The help did not stop",
        head_kn="2020 ರಿಂದ 2021 · ಸಾಂಕ್ರಾಮಿಕ ನೆರವು // ನೆರವು ನಿಲ್ಲಲಿಲ್ಲ",
        vo_en="In 2020 schools closed and families lost work. The Trust published a single "
              "page, and the help did not stop.",
        vo_kn="2020ರಲ್ಲಿ ಶಾಲೆಗಳು ಮುಚ್ಚಿದವು, ದುಡಿಮೆ ನಿಂತಿತು. ಟ್ರಸ್ಟ್ ಒಂದೇ ಪುಟದ ಪ್ರಕಟಣೆ "
              "ಹೊರಡಿಸಿತು. ನೆರವು ನಿಲ್ಲಲಿಲ್ಲ.",
        claim="[TML-2020b, TML-2021]",
        consent="BLOCKING · a crowd, many identifiable faces",
        note="The 2020 relief poster is text-critical and deliberately not in the "
             "enhanced pack, so this 2021 crowd carries the 2020 to 2021 beat. The "
             "heading says both years so picture and text do not disagree. If the "
             "Trust wants the poster itself, use the un-enhanced K17 from the pack root.",
    ),
    dict(
        sid="S13", kid="K18", act=3, dur=10.0,
        photo="2022-rural-school-library-bookshelves__K18-enhanced.png",
        see="A wall of plywood and white shelving, six bays wide and six shelves "
            "high, full of books. A bench and two white plastic chairs below.",
        role="year",
        head_en="2022 · Libraries in rural schools",
        head_kn="2022 · ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಲ್ಲಿ ಗ್ರಂಥಾಲಯಗಳು",
        vo_en="In 2022 the shelves went up. Libraries in rural schools, filled with donated "
              "story books and academic books.",
        vo_kn="2022ರಲ್ಲಿ ಕಪಾಟುಗಳು ಎದ್ದವು. ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಲ್ಲಿ ಗ್ರಂಥಾಲಯಗಳು, ದಾನದ "
              "ಪುಸ್ತಕಗಳಿಂದ ತುಂಬಿದವು.",
        claim="[TML-2022, PRG-07]",
        consent="CLEAR · no identifiable person",
        note="NO FACES. The one shot in act 3 that can take a slow push across the "
             "full width without a consent question.",
    ),
    dict(
        sid="S14", kid="K19", act=3, dur=9.0,
        photo="2022-students-in-school-library__K19-enhanced.png",
        see="The same kind of shelving, filled with colour-coded textbooks. A man "
            "sits reading at the left edge, a group of five stands browsing at the "
            "right, one with an orange backpack.",
        role="fact",
        head_en="Books the children can reach",
        head_kn="ಮಕ್ಕಳ ಕೈಗೆಟುಕುವ ಪುಸ್ತಕಗಳು",
        vo_en="And unused notebooks, because a book nobody opens is not a library.",
        vo_kn="ಬಳಸದೇ ಉಳಿದ ನೋಟ್‌ಬುಕ್‌ಗಳು ಕೂಡ. ಯಾರೂ ತೆರೆಯದ ಪುಸ್ತಕ ಗ್ರಂಥಾಲಯ ಆಗುವುದಿಲ್ಲ.",
        claim="[TML-2022, PRG-07]",
        consent="REVIEW · 6 identifiable adults, no children",
        note="Heading goes bottom left, on the empty shelf, not over the people.",
    ),
    dict(
        sid="S15", kid="K21", act=3, dur=11.0,
        photo="2023-career-guidance-chart-volunteers__K21-enhanced.png",
        see="A large printed Academics and Career Guidance Chart hung as a banner. "
            "Two men stand at the left, three women at the right, a laptop and a "
            "water bottle on a desk in the corner.",
        role="year",
        head_en="2023 · Career guidance // 9th and 10th standard",
        head_kn="2023 · ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ // 9 ಮತ್ತು 10ನೇ ತರಗತಿ",
        vo_en="In 2023, career guidance for ninth and tenth standard students, at the age "
              "when a decision quietly gets made.",
        vo_kn="2023ರಲ್ಲಿ ಒಂಬತ್ತು ಮತ್ತು ಹತ್ತನೇ ತರಗತಿಗೆ ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ. ಬದುಕಿನ ದಾರಿ ಸದ್ದಿಲ್ಲದೆ "
              "ನಿರ್ಧಾರವಾಗುವ ವಯಸ್ಸು ಅದು.",
        claim="[TML-2023, PRG-06]",
        consent="REVIEW · 5 identifiable adults, no children",
        note="The chart carries a third-party project mark. Crop it out or clear it "
             "before picture lock: 14 item 2.2.",
    ),
    dict(
        sid="S16", kid="K20", act=3, dur=9.0,
        photo="2023-mysore-hd-kote-tribal-school-hall__K20-enhanced.png",
        see="About forty-five children and eight adults packed under an open hall "
            "with a bamboo and timber roof, woven mats on the earth floor, craft "
            "work laid out in the foreground.",
        role="year",
        head_en="2023 · Mysuru · H.D. Kote",
        head_kn="2023 · ಮೈಸೂರು · ಎಚ್.ಡಿ. ಕೋಟೆ",
        vo_en="The same year the map widened. Mysore. H.D. Kote. And the tribal schools beyond them.",
        vo_kn="ಅದೇ ವರ್ಷ ವ್ಯಾಪ್ತಿ ಹಿಗ್ಗಿತು. ಮೈಸೂರು. ಎಚ್.ಡಿ. ಕೋಟೆ. ಮತ್ತು ಅಲ್ಲಿನ ಬುಡಕಟ್ಟು ಶಾಲೆಗಳು.",
        claim="[TML-2023]",
        consent="BLOCKING · approximately 45 identifiable children",
        note="The swell into act 4 sits on the last 3s, under no narration.",
    ),
    # ------------------------------------------------------------------ ACT 4
    dict(
        sid="S17", kid="K26", act=4, dur=12.0,
        photo="method-scholarship-interview-hands-form__K26-enhanced.png",
        see="A school office. Blue walls, green steel cupboards, a Kannada honours "
            "board on the wall. A woman in a sari writes on a form at a wooden "
            "table, a girl in glasses sits beside her, a boy stands, a man sits "
            "opposite, a mother waits at the right holding a book.",
        role="fact",
        head_en="Identify · Validate // Embrace · Incubate",
        head_kn="ಗುರುತಿಸುವುದು · ಪರಿಶೀಲಿಸುವುದು // ಅಪ್ಪಿಕೊಳ್ಳುವುದು · ಬೆಳೆಸುವುದು",
        vo_en="None of this happens from an office. A principal or a neighbour puts a name "
              "forward. The team drives out and sits with the family.",
        vo_kn="ಇದೆಲ್ಲ ಕಚೇರಿಯಲ್ಲಿ ಕುಳಿತು ಆಗುವುದಲ್ಲ. ಮುಖ್ಯೋಪಾಧ್ಯಾಯರೋ ನೆರೆಹೊರೆಯವರೋ ಒಂದು ಹೆಸರು "
              "ಹೇಳುತ್ತಾರೆ. ತಂಡ ಅಲ್ಲಿಗೆ ಹೋಗಿ ಕುಟುಂಬದ ಜೊತೆ ಕೂರುತ್ತದೆ.",
        claim="[PRC-01, PRC-02]",
        consent="BLOCKING · 2 identifiable children and 3 adults",
        note="The storyboard crops this to the hands and the form. Keep that crop: "
             "it removes the consent question and it is the better picture.",
    ),
    dict(
        sid="S18", kid="K30", act=4, dur=10.0,
        photo="2025-volunteer-outdoor-activity-with-children__K30-enhanced.png",
        see="A volunteer crouches on red earth beside a boy, guiding his hand over "
            "a worksheet, paint pot open. A toddler in yellow watches. Adults' feet "
            "at the frame edges.",
        role="fact",
        head_en="Up to 75% of the school fee // Paid directly to the school",
        head_kn="ಶಾಲಾ ಶುಲ್ಕದ ಶೇ. 75ರವರೆಗೆ // ನೇರವಾಗಿ ಶಾಲೆಗೆ ಪಾವತಿ",
        vo_en="The Trust covers up to seventy-five per cent of the school fee. Not all of it. "
              "The family carries the rest.",
        vo_kn="ಟ್ರಸ್ಟ್ ಶಾಲಾ ಶುಲ್ಕದ ಶೇಕಡಾ ಎಪ್ಪತ್ತೈದರಷ್ಟನ್ನು ಭರಿಸುತ್ತದೆ. ಪೂರ್ತಿ ಅಲ್ಲ. ಉಳಿದದ್ದನ್ನು "
              "ಕುಟುಂಬ ಹೊರುತ್ತದೆ.",
        claim="[PRC-03, PRC-04, NUM-07, MIS-03, MIS-04]",
        consent="BLOCKING · 2 identifiable children",
        note="SILENCE CUE. Everything drops out under 'Not all of it'. No bed, no "
             "effect, room tone only, for 1.5s. The dignity rule: the 25 per cent "
             "the family pays is the point of the sentence.",
    ),
    dict(
        sid="S19", kid="K31", act=4, dur=10.0,
        photo="2025-stationery-and-snacks-arranged__K31-enhanced.png",
        see="Overhead view of a tiled floor laid out with crayon packs, watercolour "
            "sets, pencils, erasers, sharpeners, geometry boxes and a stack of "
            "drawing books, counted into piles.",
        role="fact",
        head_en="What goes into one bag",
        head_kn="ಒಂದು ಚೀಲದೊಳಗೆ ಏನಿರುತ್ತದೆ",
        vo_en="A scholarship on its own is not an education. So there are bags, notebooks, "
              "stationery and drawing kits.",
        vo_kn="ವಿದ್ಯಾರ್ಥಿವೇತನ ಒಂದೇ ಶಿಕ್ಷಣ ಆಗುವುದಿಲ್ಲ. ಹಾಗಾಗಿ ಚೀಲ, ನೋಟ್‌ಬುಕ್, ಲೇಖನ ಸಾಮಗ್ರಿ "
              "ಮತ್ತು ಚಿತ್ರಕಲೆ ಸಾಮಗ್ರಿಗಳೂ ಇವೆ.",
        claim="[PRG-03]",
        consent="CLEAR · no identifiable person",
        note="NO FACES. Brand packaging is visible on the crayon and watercolour "
             "packs. Grade it down or crop past it: neighbouring assets were cut "
             "from the film for exactly this.",
    ),
    dict(
        sid="S20", kid="K22", act=4, dur=12.0,
        photo="2024-mm-hills-200-school-bags-car-trunk__K22-enhanced.png",
        see="The open boot of an estate car, filled end to end with stacked "
            "notebooks and textbooks, the rear seats and a headrest screen visible "
            "through the cabin.",
        role="year",
        head_en="2024 · M.M. Hills // 200 school bags",
        head_kn="2024 · ಎಂ.ಎಂ. ಹಿಲ್ಸ್ // 200 ಶಾಲಾ ಚೀಲ",
        vo_en="In 2024 the Trust opened the school year at the tribal schools of M.M. Hills, "
              "with two hundred school bags, notebooks and stationery.",
        vo_kn="2024ರಲ್ಲಿ ಎಂ.ಎಂ. ಹಿಲ್ಸ್‌ನ ಬುಡಕಟ್ಟು ಶಾಲೆಗಳಲ್ಲಿ ಇನ್ನೂರು ಶಾಲಾ ಚೀಲ, ನೋಟ್‌ಬುಕ್ ಮತ್ತು "
              "ಲೇಖನ ಸಾಮಗ್ರಿಗಳಿಂದ ಶಾಲಾ ವರ್ಷ ಶುರುವಾಯಿತು.",
        claim="[TML-2024, NUM-04]",
        consent="CLEAR · no identifiable person",
        note="NO FACES. Portrait source, so crop to the boot opening and let the "
             "200 numeral sit in the dark of the car body.",
    ),
    dict(
        sid="S21", kid="K42", act=4, dur=7.0,
        photo="2024-children-with-supplies-outdoors__K42-enhanced.png",
        see="About thirty children in front of a blue two-storey house under an "
            "overcast sky, holding wrapped bags. Six adults behind them, coconut "
            "palms and a hillside at the back.",
        role="fact",
        head_en="Carried in by hand",
        head_kn="ಕೈಯಲ್ಲೇ ಹೊತ್ತು ತಂದದ್ದು",
        vo_en="Loaded into a car boot in the city. Carried in by hand.",
        vo_kn="ನಗರದಲ್ಲಿ ಕಾರಿನ ಡಿಕ್ಕಿಯಲ್ಲಿ ತುಂಬಿ, ಕೈಯಲ್ಲೇ ಹೊತ್ತು ತಂದದ್ದು.",
        claim="[TML-2024]",
        consent="BLOCKING · approximately 30 identifiable children",
        note="Short shot, deliberately. It is the answer to the car boot, not a "
             "beat of its own.",
    ),
    # ------------------------------------------------------------------ ACT 5
    dict(
        sid="S22", kid="K23", act=5, dur=10.0,
        photo="2025-hd-kote-300-school-bags-under-tree__K23-enhanced.png",
        see="A very large spreading tree over a bare earth clearing. Eighteen "
            "people, children in the middle holding wrapped bags, volunteers at "
            "both ends. A dog at the left, thatched huts behind.",
        role="year",
        head_en="2025 · H.D. Kote // 300 school bags",
        head_kn="2025 · ಎಚ್.ಡಿ. ಕೋಟೆ // 300 ಶಾಲಾ ಚೀಲ",
        vo_en="And in 2025, in H.D. Kote, three hundred. This time with Nisarga Foundation beside us.",
        vo_kn="ಮತ್ತು 2025ರಲ್ಲಿ, ಎಚ್.ಡಿ. ಕೋಟೆಯಲ್ಲಿ, ಮುನ್ನೂರು. ಈ ಬಾರಿ ನಿಸರ್ಗ ಫೌಂಡೇಶನ್ ಜೊತೆಯಾಗಿ.",
        claim="[TML-2025, NUM-05, PTR-01]",
        consent="BLOCKING · approximately 8 identifiable children and 10 adults",
        note="The film's high point. One soft low land on the number, then the "
             "remaining 3.5s stay clean. No swell on top of it.",
    ),
    dict(
        sid="S23", kid="K41", act=5, dur=8.0,
        photo="2025-children-showing-school-bags-outdoors__K41-enhanced.png",
        see="Thirty children standing on green grass holding wrapped bags and "
            "orange notebooks, four volunteers behind them, a school compound wall "
            "and a painted sign in the distance.",
        role="fact",
        head_en="A bag for every child",
        head_kn="ಪ್ರತಿ ಮಗುವಿಗೂ ಒಂದು ಚೀಲ",
        vo_en="No stage. No handover photograph. Just a field, and a bag for every child.",
        vo_kn="ವೇದಿಕೆ ಇಲ್ಲ. ಹಸ್ತಾಂತರದ ಫೋಟೋ ಇಲ್ಲ. ಒಂದು ಬಯಲು, ಪ್ರತಿ ಮಗುವಿಗೂ ಒಂದು ಚೀಲ.",
        claim="[TML-2025]",
        consent="BLOCKING · approximately 30 identifiable children",
        note="Crop the animal out of the lower right corner.",
    ),
    dict(
        sid="S24", kid="K44/K45", act=5, dur=11.0,
        photo="2025-classroom-children-with-supplies__K44-K45-enhanced.png",
        see="A yellow classroom with the English alphabet and Kannada letters "
            "painted on the walls. About thirty-five children sit on mats with new "
            "bags in front of them, hands raised, a volunteer seated at the right.",
        role="fact",
        head_en="The team stays a few days",
        head_kn="ತಂಡ ಕೆಲವು ದಿನ ಉಳಿಯುತ್ತದೆ",
        vo_en="With the children at the tribal schools, the team stays a few days. They teach, "
              "they learn, and then the bags are handed over.",
        vo_kn="ಬುಡಕಟ್ಟು ಶಾಲೆಗಳ ಮಕ್ಕಳ ಜೊತೆ ತಂಡ ಕೆಲವು ದಿನ ಉಳಿಯುತ್ತದೆ. ಕಲಿಸುತ್ತದೆ. ಕಲಿಯುತ್ತದೆ. "
              "ಆಮೇಲೆ ಚೀಲಗಳು ಕೈ ಸೇರುತ್ತವೆ.",
        claim="[EVT-05]",
        consent="BLOCKING · approximately 35 identifiable children. Consent critical",
        note="A second zip, deliberately a different recording from S20, so the pair "
             "does not read as one sound used twice.",
    ),
    dict(
        sid="S25", kid="K32", act=5, dur=8.0,
        photo="programs-kids-craft-learning-games__K32-enhanced.png",
        see="Seven children sitting on a veranda floor against a lime and charcoal "
            "wall, each holding up a folded paper triangle in blue, yellow, pink or "
            "green. One child in the foreground reaching up from behind.",
        role="fact",
        head_en="Games, drawing, reading, // a stage of their own",
        head_kn="ಆಟ, ಚಿತ್ರಕಲೆ, ಓದು, // ಅವರದೇ ಒಂದು ವೇದಿಕೆ",
        vo_en="There are games, drawing, reading, and a stage on which children sing and dance.",
        vo_kn="ಆಟ, ಚಿತ್ರಕಲೆ, ಓದು, ಮತ್ತು ಮಕ್ಕಳು ಹಾಡಿ ಕುಣಿಯುವ ಒಂದು ವೇದಿಕೆ.",
        claim="[PRG-04, PRG-05, PRG-08]",
        consent="BLOCKING · 7 identifiable children",
        note="Portrait source. Crop to the row of raised hands.",
    ),
    dict(
        sid="S26", kid="K28", act=5, dur=11.0,
        photo="2025-classroom-beneficiary-families__K28-enhanced.png",
        see="A blue hall. A banner across the back names Law Park Educational Trust "
            "with Belaku Trust and, in Kannada, Soukhya Samrudhi Samsthe. About "
            "sixty people: volunteers standing behind a row of new bags, mothers "
            "and children seated on the floor.",
        role="partners",
        head_en="In partnership with // Nisarga Foundation · Belaku Trust, Bangarpet // "
                "Soukhya Samrudhi Samsthe, Kolar // District Health and Family Welfare "
                "Department, Kolar",
        head_kn="ಸಹಯೋಗದಲ್ಲಿ // ನಿಸರ್ಗ ಫೌಂಡೇಶನ್ · ಬೆಳಕು ಟ್ರಸ್ಟ್, ಬಂಗಾರಪೇಟೆ // "
                "ಸೌಖ್ಯ ಸಮೃದ್ಧಿ ಸಂಸ್ಥೆ, ಕೋಲಾರ // ಜಿಲ್ಲಾ ಆರೋಗ್ಯ ಮತ್ತು ಕುಟುಂಬ ಕಲ್ಯಾಣ ಇಲಾಖೆ, ಕೋಲಾರ",
        vo_en="And the work reaches children it would have been easier not to reach. Children "
              "of single parents. Children from HIV-affected families.",
        vo_kn="ತಲುಪಲು ಕಷ್ಟವಾದ ಮಕ್ಕಳನ್ನೂ ಈ ಕೆಲಸ ತಲುಪುತ್ತದೆ. ಒಂಟಿ ಪೋಷಕರ ಮಕ್ಕಳು. ಎಚ್.ಐ.ವಿ. ಬಾಧಿತ "
              "ಕುಟುಂಬಗಳ ಮಕ್ಕಳು.",
        claim="[MIS-05, PTR-01, PTR-02, PTR-03, PTR-04]",
        consent="BLOCKING · approximately 60 identifiable people including children. "
                "A health-status claim is spoken over this frame",
        note="TRUSTEE CONFIRMATION REQUIRED for permission to display each partner's "
             "name. Do not name any child over this frame, and do not let the "
             "narration line and any single face read as attached to each other: "
             "hold wide, no push.",
    ),
    # ------------------------------------------------------------------ ACT 6
    dict(
        sid="S27", kid="K38", act=6, dur=11.0,
        photo="2025-volunteer-group-at-school-garden__K38-enhanced.png",
        see="Fourteen volunteers standing in a school garden in front of a painted "
            "rural school, a tiled porch at the left, a motorbike parked behind.",
        role="fact",
        head_en="The volunteers",
        head_kn="ಸ್ವಯಂಸೇವಕರು",
        vo_en="The record that matters is a list of names. Volunteers who are advocates, "
              "engineers, counsellors, doctors and homemakers.",
        vo_kn="ಮುಖ್ಯವಾದ ದಾಖಲೆ ಒಂದು ಹೆಸರುಗಳ ಪಟ್ಟಿ. ವಕೀಲರು, ಇಂಜಿನಿಯರ್‌ಗಳು, ಆಪ್ತಸಮಾಲೋಚಕರು, "
              "ವೈದ್ಯರು, ಗೃಹಿಣಿಯರು: ಎಲ್ಲರೂ ಸ್ವಯಂಸೇವಕರು.",
        claim="[PPL-05]",
        consent="REVIEW · 14 identifiable adults and 2 young people",
        note="Act 6 opens. The warm pad comes in here and carries to the end card.",
    ),
    dict(
        sid="S28", kid="K39", act=6, dur=10.0,
        photo="2025-hall-volunteers-and-children__K39-enhanced.png",
        see="A crowded hall, about seventy people, adults standing at the back and "
            "children seated on the floor in front. A banner overhead names Law "
            "Park Educational Trust and Belaku Trust.",
        role="fact",
        head_en="The donors, the teachers, // the parents who paid their share",
        head_kn="ದಾನಿಗಳು, ಶಿಕ್ಷಕರು, // ತಮ್ಮ ಪಾಲು ಕಟ್ಟಿದ ಪೋಷಕರು",
        vo_en="Donors in Bengaluru and Chennai, in America, Britain, Germany, Denmark and "
              "Dubai. Teachers who picked up a phone about one child.",
        vo_kn="ಬೆಂಗಳೂರು, ಚೆನ್ನೈ, ಅಮೆರಿಕ, ಬ್ರಿಟನ್, ಜರ್ಮನಿ, ಡೆನ್ಮಾರ್ಕ್ ಮತ್ತು ದುಬೈನ ದಾನಿಗಳು. "
              "ಒಂದು ಮಗುವಿಗಾಗಿ ಫೋನ್ ಮಾಡಿದ ಶಿಕ್ಷಕರು.",
        claim="[PPL-06, PPL-05]",
        consent="BLOCKING · approximately 70 identifiable people including children",
        note="A third-party school name is legible on the banner. Clear it or crop "
             "it before picture lock.",
    ),
    dict(
        sid="S29", kid="K24", act=6, dur=13.0,
        photo="2025-school-front-group-photo__K24-enhanced.png",
        see="A pink arcaded school building with mango branches across the frame. "
            "About thirty-five people, children seated on the sand in front, adults "
            "standing along the veranda.",
        role="fact",
        head_en="Udayavani · 19 June 2024 // Bharat Shiksha Ratan Award · 19 December 2025 · "
                "New Delhi // Economic and Social Development Foundation",
        head_kn="ಉದಯವಾಣಿ · 19 ಜೂನ್ 2024 // ಭಾರತ ಶಿಕ್ಷಾ ರತ್ನ ಪ್ರಶಸ್ತಿ · 19 ಡಿಸೆಂಬರ್ 2025 · "
                "ನವದೆಹಲಿ // ಎಕನಾಮಿಕ್ ಅಂಡ್ ಸೋಶಿಯಲ್ ಡೆವಲಪ್‌ಮೆಂಟ್ ಫೌಂಡೇಶನ್",
        vo_en="In June 2024 a Kannada daily carried the work from Mulbagal. In December 2025 "
              "the Founder received the Bharat Shiksha Ratan Award.",
        vo_kn="2024ರ ಜೂನ್‌ನಲ್ಲಿ ಕನ್ನಡ ಪತ್ರಿಕೆಯೊಂದು ಈ ಕೆಲಸವನ್ನು ವರದಿ ಮಾಡಿತು. ಮುಂದಿನ ವರ್ಷ "
              "ಸಂಸ್ಥಾಪಕಿಗೆ ಭಾರತ ಶಿಕ್ಷಾ ರತ್ನ ಪ್ರಶಸ್ತಿ ಸಂದಿತು.",
        claim="[MED-01, MED-02, AWD-01]",
        consent="BLOCKING · approximately 35 identifiable people including children",
        note="NO FANFARE. The newspaper clipping and the certificate are both "
             "text-critical and deliberately absent from the enhanced pack, so the "
             "recognition is carried as text over a school, which is where the work "
             "actually happened. Do not name presenting ministers.",
    ),
    dict(
        sid="S30", kid="K33", act=6, dur=13.0,
        photo="2025-large-community-celebration-group__K33-enhanced.png",
        see="An auditorium with a curtained stage and a chandelier. About eighty "
            "people, many with both hands raised, children kneeling along the front "
            "on a red carpet runner.",
        role="end",
        head_en="Ten Years · 2016 to 2026 // LAW PARK EDUCATIONAL TRUST // Welcome",
        head_kn="ಹತ್ತು ವರ್ಷ · 2016 ರಿಂದ 2026 // ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ // ಸ್ವಾಗತ",
        vo_en="Ten years. One promise, kept quietly, one child at a time. Welcome to the "
              "tenth anniversary of Law Park Educational Trust.",
        vo_kn="ಹತ್ತು ವರ್ಷ. ಸದ್ದಿಲ್ಲದೆ ಕಾಪಾಡಿಕೊಂಡ ಒಂದು ಮಾತು. ಒಂದೊಂದೇ ಮಗು. ಲಾ ಪಾರ್ಕ್ "
              "ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್‌ನ ಹತ್ತನೇ ವರ್ಷದ ಸಂಭ್ರಮಕ್ಕೆ ನಿಮ್ಮೆಲ್ಲರಿಗೂ ಆತ್ಮೀಯ ಸ್ವಾಗತ.",
        claim="[ORG-13]",
        consent="BLOCKING · approximately 80 identifiable people including children",
        note="The last 4s hold with the narration out: heading, applause low, one "
             "piano note to resolve, then fade to black over 20 frames.",
    ),
]

# ---------------------------------------------------------------------------
# Sound. Two layers: beds that run under an act, and accents that land on a beat.
#
# Every file below is already in the licence log at
# ../kannada/Kannada-sfx-licence-log.csv and is cleared for this project.
# `level` is dB relative to the narration's own speech RMS, the unit the house
# cue sheet uses. Nothing sits closer than 12 dB under the voice.
# ---------------------------------------------------------------------------

SFX_DIR = "../../kannada/tools/sfx"

BEDS = [
    dict(key="bed-floor", file="kai_audio-bedroom-room-tone-446021.mp3",
         shot="S01", offset=0.0, dur=300.0, level=-20, fade_in=2.0, fade_out=3.0,
         note="The floor under the whole film so no shot sits in a vacuum. Speech-band "
              "energy measures 0.00, so it carries no voice. Carved at the two silence "
              "cues with a 0.40s fade either side."),
    dict(key="bed-act1-morning", file="dbsound-countryside-morning-sounds-246032.mp3",
         shot="S01", offset=0.0, dur=39.0, level=-15, fade_in=2.5, fade_out=2.0,
         note="ACT 1. A Karnataka village morning, before the narration names the Trust."),
    dict(key="bed-act2-village", file="dbsound-countryside-morning-sounds-246032.mp3",
         shot="S05", offset=0.0, dur=52.0, level=-16, fade_in=2.0, fade_out=2.5,
         note="ACT 2. The same recording 1 dB further down, so 2016 stays in the same "
              "place as the opening."),
    dict(key="bed-act3-field", file="freesound_community-open_field_winds_summer_ambience-64761.mp3",
         shot="S10", offset=0.0, dur=67.0, level=-15, fade_in=2.5, fade_out=2.5,
         note="ACT 3. Open field wind. sfx_voicecheck.py puts its 3 to 8 Hz modulation "
              "at 0.151 peak with no syllable rate anywhere: this is wind, not people."),
    dict(key="bed-act4-insects", file="dbsound-insects-birds-field-596099.mp3",
         shot="S17", offset=0.0, dur=52.0, level=-17, fade_in=3.0, fade_out=3.0,
         note="ACT 4. Excerpt taken from 100s, clear of the 89 to 97s cluster where the "
              "speech band rises."),
    dict(key="bed-act4-village", file="ranjit_foley-indian-village-ambience-219221.mp3",
         shot="S21", offset=0.0, dur=8.0, level=-21, fade_in=2.0, fade_out=2.0,
         note="ACT 4 depth. CUT ONLY FROM 268.0s in the source, the one window "
              "sfx_voicecheck.py cleared of speech. A human must still confirm by ear."),
    dict(key="bed-act5-spring", file="tape-echo-spring-spring-is-coming_25sec-596343.mp3",
         shot="S22", offset=0.0, dur=28.0, level=-20, fade_in=3.0, fade_out=3.0,
         note="ACT 5. Tonal lift through the 300 bags and the classroom, handing over "
              "to the pad."),
    dict(key="bed-act6-pad", file="gigidelaromusic-warm-pad-fragment-short-450964.mp3",
         shot="S27", offset=0.0, dur=45.0, level=-15, fade_in=3.0, fade_out=4.5,
         note="ACT 6. Warm pad under gratitude and the end card. Pixabay marks this "
              "file AI generated."),
]

ACCENTS = [
    dict(key="s01-bell", file="universfield-school-bell-199584.mp3",
         shot="S01", offset=1.40, level=-16, solo=-20, in_s=0.30, dur=2.20,
         fade_in=0.05, fade_out=1.20,
         note="A distant bell over the school building, under no narration. The only "
              "bell in the film."),
    dict(key="s03-piano", file="freesound_community-1-note-piano-104171.mp3",
         shot="S03", offset=4.60, level=-16, solo=-24, in_s=0.0, dur=1.90,
         fade_in=0.02, fade_out=0.90,
         note="One note on the word 'decides', resolving into the 2.5s of dry air that "
              "closes the shot."),
    dict(key="s04-riser", file="black_kumizhi-dreamy-cinematic-riser-523158.mp3",
         shot="S04", offset=0.00, level=-13, solo=None, in_s=7.10, dur=2.20,
         fade_in=0.60, fade_out=0.40,
         note="Warm tonal riser resolving into the founder quote at S04 +0.6s."),
    dict(key="s04-impact", file="universfield-cinematic-low-hit-291095.mp3",
         shot="S04", offset=1.60, level=-14, solo=None, in_s=0.0, dur=1.60,
         fade_in=0.02, fade_out=0.70,
         note="Soft low impact as the quote settles. It lands, it does not boom. "
              "Impact 1 of 2 in the film."),
    dict(key="s07-page", file="creatorshome-turn-a-page-336933.mp3",
         shot="S07", offset=0.20, level=-13, solo=None, in_s=0.0, dur=0.0,
         fade_in=0.0, fade_out=0.0,
         note="The 2016 first school visit. One dry page turn, the archive beat. The "
              "loudest accent in the film relative to the voice, because it carries a "
              "story beat on its own."),
    dict(key="s09-whoosh", file="lesiakower-gentle-amp-echoing-whoosh-sound-effect-451056.mp3",
         shot="S09", offset=8.10, level=-18, solo=-23, in_s=0.0, dur=2.00,
         fade_in=0.20, fade_out=0.80,
         note="Act 2 into act 3, under no narration. Whoosh 1 of 3."),
    dict(key="s12-rustle", file="spinopel-paper-rustle-345748.mp3",
         shot="S12", offset=0.30, level=-14, solo=None, in_s=4.20, dur=2.60,
         fade_in=0.30, fade_out=1.00,
         note="The single-page pandemic announcement. 2.6s of rustle rather than a "
              "turn, so it does not read as a second page turn."),
    dict(key="s13-book", file="creatorshome-turn-a-page-336933.mp3",
         shot="S13", offset=0.40, level=-15, solo=None, in_s=0.0, dur=0.0,
         fade_in=0.0, fade_out=0.0,
         note="Library shelves. The page turn stands in as the book proxy until a real "
              "book file is auditioned."),
    dict(key="s16-riser", file="audiopapkin-riser-hit-sfx-001-289802.mp3",
         shot="S16", offset=5.90, level=-15, solo=None, in_s=0.0, dur=2.80,
         fade_in=0.50, fade_out=0.60,
         note="Act 3 into act 4. Kept under the whoosh family in level so it reads as a "
              "swell and not as a trailer cue."),
    dict(key="s17-thud", file="soundreality-hit-windy-thud-399086.mp3",
         shot="S17", offset=0.20, level=-17, solo=None, in_s=0.60, dur=2.40,
         fade_in=0.10, fade_out=1.20,
         note="The act 4 turn gets one soft windy landing and nothing else."),
    dict(key="s19-rustle", file="spinopel-paper-rustle-345748.mp3",
         shot="S19", offset=0.50, level=-16, solo=None, in_s=1.00, dur=1.80,
         fade_in=0.20, fade_out=0.80,
         note="Packets and paper being counted out. Lower than S12 so the announcement "
              "keeps its weight."),
    dict(key="s20-zip", file="freesound_community-backpack-34942.mp3",
         shot="S20", offset=0.50, level=-13, solo=None, in_s=3.20, dur=2.00,
         fade_in=0.10, fade_out=0.60,
         note="Two hundred school bags at M.M. Hills, under a supplies close-up only."),
    dict(key="s22-impact", file="universfield-cinematic-low-hit-291095.mp3",
         shot="S22", offset=6.30, level=-13, solo=None, in_s=0.0, dur=1.40,
         fade_in=0.02, fade_out=0.60,
         note="Soft low land under 'three hundred', then the 3.5s hold after it stays "
              "clean. Impact 2 of 2, and the film's last impact."),
    dict(key="s24-zip", file="mrstokes302-backpack-zipper-sfx-mrstokes302-585349.mp3",
         shot="S24", offset=0.40, level=-14, solo=None, in_s=0.40, dur=1.80,
         fade_in=0.10, fade_out=0.70,
         note="The classroom of children with bags. A different zip recording from S20 "
              "so the pair does not read as one sound used twice."),
    dict(key="s26-whoosh", file="lesiakower-gentle-amp-echoing-whoosh-sound-effect-451056.mp3",
         shot="S26", offset=0.20, level=-15, solo=None, in_s=0.0, dur=2.60,
         fade_in=0.0, fade_out=0.80,
         note="On the partners heading as it draws on, not on the cut. Whoosh 2 of 3."),
    dict(key="s27-whoosh", file="lesiakower-gentle-amp-echoing-whoosh-sound-effect-451056.mp3",
         shot="S27", offset=0.15, level=-18, solo=None, in_s=0.0, dur=2.60,
         fade_in=0.0, fade_out=0.80,
         note="Act 6 opens. Whoosh 3 of 3, the lowest of the three."),
    dict(key="s29-lift", file="edr-electronic-impact-soft-10019.mp3",
         shot="S29", offset=0.20, level=-18, solo=None, in_s=0.30, dur=1.60,
         fade_in=0.02, fade_out=0.80,
         note="One gentle lift as the recognition heading appears, then settle. NO "
              "FANFARE: the soft impact was chosen over the low hit so the film keeps "
              "exactly two impacts."),
    dict(key="s30-applause", file="vvqne-applause-383901.mp3",
         shot="S30", offset=8.60, level=-20, solo=-26, in_s=2.40, dur=4.40,
         fade_in=1.20, fade_out=2.60,
         note="End card only, low, never under speech. This is the one home applause "
              "has in this film."),
    dict(key="s30-resolve", file="freesound_community-1-note-piano-104171.mp3",
         shot="S30", offset=11.20, level=-18, solo=-26, in_s=0.0, dur=1.80,
         fade_in=0.02, fade_out=1.40,
         note="One piano note to resolve the film, answering the note on 'decides' at "
              "S03. Stands in until a warm non-electronic chime is auditioned."),
]

# Windows where nothing plays but the room tone, and the room tone is carved to
# true silence. Offsets are measured from the shot's t_in.
SILENCE = [
    dict(shot="S03", offset=6.60, dur=1.40, voice=False,
         reason="After the piano note, at the end of 'a school fee decides'. The "
                "film's premise lands dry: bed carved, no effect, no voice."),
    dict(shot="S07", offset=9.10, dur=1.90, voice=False,
         reason="'One child. One scholarship.' has finished. The line is left to "
                "stand on its own, as it does in the approved Kannada cut."),
    dict(shot="S18", offset=6.40, dur=1.50, voice=True,
         reason="Score out under 'Not all of it'. The voice keeps running; the bed "
                "and every effect drop away beneath it. The dignity rule: the 25 per "
                "cent the family pays is the point of the sentence."),
    dict(shot="S29", offset=2.00, dur=11.00, voice=True,
         reason="NO FANFARE under the award. One soft lift on the heading in the "
                "first 1.8s, then nothing builds for the rest of the shot. The voice "
                "keeps running. See 11 section 1."),
]

# Effects the film wants and the library does not have. Source, log, then place.
TO_SOURCE = [
    ("Steel plate set down, single, soft", "S08",
     "One plate meeting a stone floor, dry, no ring-out. Currently unscored.",
     "https://pixabay.com/sound-effects/search/metal%20plate/"),
    ("Car boot closing, distant", "S20",
     "Faint realism under the supplies load. No engine, no alarm chirp.",
     "https://pixabay.com/sound-effects/search/car%20ambience/"),
    ("Gentle warm chime, non-electronic", "S30",
     "To replace the piano note on the end card if a warmer resolve is wanted. Must "
     "not sound like a phone notification.",
     "https://pixabay.com/sound-effects/search/gentle%20chime/"),
]

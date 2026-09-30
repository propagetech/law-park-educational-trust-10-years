// Speeches for the 10-year celebration, from the trust's speeches PDF
// (video/research/LawPark_10Years_Speeches_and_Event_Schedule-v1.pdf).
// Text is as written, with its blanks filled in: filled parts are wrapped in
// {{ }} and shown highlighted, so the speaker can check them. A paragraph
// starting "OPTIONAL: " is shown as an optional box.

export interface Speech {
  slug: string
  title: string
  speaker: string // as the team list has them, for the task and My tasks
  speakerFull: string
  activityId: string // the Schedule activity this is read at
  when: string
  length: string
  language: string
  notes: string[]
  paragraphs: string[]
}

export const SPEECHES: Speech[] = [
  {
    slug: 'founder-address',
    title: "Founder's address",
    speaker: 'Charulatha',
    speakerFull: 'Smt. Charulatha M. R., Founder and Managing Trustee',
    activityId: 'e-seed-founder',
    when: '4 October, 10:26 AM, just before the chief guests speak',
    length: 'About 3 to 4 minutes',
    language: 'English with Kannada',
    notes: [
      'The chief guests are filled in, in honouring order, and highlighted. Please check the names.',
      'The optional box is a place for one memory of your own, in your words. Skip it if you like.',
    ],
    paragraphs: [
      "ಎಲ್ಲರಿಗೂ ನಮಸ್ಕಾರ. Good morning, everyone.",
      "Our respected chief guests, {{Hon'ble Justice H. P. Sandesh, Smt. Divya Prabhu G. R. J. and Dr. Bheemashankar S. Guled}}, distinguished guests, my fellow trustee Shri S. M. Manjunatha, our donors, volunteers, parents, and my dear children... ಎಲ್ಲರಿಗೂ ಹೃತ್ಪೂರ್ವಕ ಸ್ವಾಗತ.",
      "Today, my heart is full. ಇಂದು ನನ್ನ ಮನಸ್ಸು ತುಂಬಿ ಬಂದಿದೆ.",
      "Ten years ago, in 2016, we walked into a school in Chickaballapur with one scholarship and a lot of belief. The light in that one child's eyes... ಆ ಒಂದು ಮಗುವಿನ ಕಣ್ಣಲ್ಲಿ ಕಂಡ ಹೊಳಪು... has carried us through these ten years.",
      "When I was young, I used to teach children in our neighbourhood who could not afford tuition. That is when I understood something very simple: talent is everywhere, but opportunity is not. ಬುದ್ಧಿವಂತಿಕೆಗೆ ಬಡತನ ಇಲ್ಲ, ಆದರೆ ಅವಕಾಶಕ್ಕೆ ಇದೆ. No child who wants to study should leave school only because the fees could not be paid. That one thought became Law Park Educational Trust.",
      "Over these ten years, we have sat in one-room homes and listened to parents. We have met children who lost their parents, mothers who work daily wages even through illness to keep their children in school, and grandmothers who still work in their old age for their grandchildren. ನಿಜವಾದ ಧೈರ್ಯ ಏನು ಅಂತ ನಾನು ಕಲಿತದ್ದು ಇವರಿಂದಲೇ.",
      "OPTIONAL: Share one memory close to your heart here, in 2 to 3 sentences.",
      "Last December in New Delhi, when I received the Bharat Shiksha Ratan award, all I could see were our children's faces. That award is not mine. It belongs to every child who dared to dream, every parent who trusted us, and every one of you who said, \"Yes, let's do this together.\" ಈ ಪ್ರಶಸ್ತಿ ನಮ್ಮೆಲ್ಲರದು.",
      "And this year, in our tenth year, our support for children's school fees is the biggest it has ever been. From one child's fees in 2016 to where we stand today... every rupee paid directly to the school, and every rupee a child's seat in a classroom.",
      "To our donors: what you gave was not just money. It was a child's full year of school, and a family's future. To our volunteers and our team: behind every visit, every interview and every school bag, there is your hard work. To our partner organisations and headmasters: without you, we could never have reached these children. ನಿಮ್ಮೆಲ್ಲರಿಗೂ ನನ್ನ ಹೃದಯಪೂರ್ವಕ ಧನ್ಯವಾದಗಳು.",
      "ಮಕ್ಕಳೇ, ನಿಮಗೆ ಒಂದೇ ಮಾತು... study well, and dream big. And one day, hold another child's hand, just as someone held yours. That will be the biggest gift you can give us.",
      "Ten years are complete, but our journey has only just begun. More districts, more libraries, more children. Because... ಶಿಕ್ಷಣದ ವಿಷಯದಲ್ಲಿ, ಯಾವ ಮಗುವೂ ಹಿಂದೆ ಉಳಿಯಬಾರದು. No child should be left behind.",
      "Thank you. ಧನ್ಯವಾದಗಳು.",
    ],
  },
  {
    slug: 'vote-of-thanks',
    title: 'Vote of thanks',
    speaker: 'Manjunath',
    speakerFull: 'Shri S. M. Manjunatha, Trustee',
    activityId: 'e-seed-thanks',
    when: '4 October, 12:00 PM, just before the National Anthem',
    length: 'About 3 minutes',
    language: 'Kannada',
    notes: [
      'The chief guests and the venue are filled in and highlighted. Please check the spelling of the names in Kannada.',
      'Add or remove names on the day if someone special attends.',
    ],
    paragraphs: [
      "ಎಲ್ಲರಿಗೂ ನಮಸ್ಕಾರ.",
      "ಇಂದಿನ ಈ ಹತ್ತು ವರ್ಷಗಳ ಸಂಭ್ರಮದ ಕೊನೆಯಲ್ಲಿ, ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ ಪರವಾಗಿ ವಂದನಾರ್ಪಣೆ ಮಾಡುವ ಅವಕಾಶ ನನಗೆ ಸಿಕ್ಕಿರುವುದು ನನ್ನ ಸೌಭಾಗ್ಯ.",
      "ನಾನು ಗೌರಿಬಿದನೂರು ತಾಲ್ಲೂಕಿನ ಸಾದೇನಹಳ್ಳಿ ಎಂಬ ಪುಟ್ಟ ಹಳ್ಳಿಯಿಂದ ಬಂದವನು. ಒಂದು ಪುಸ್ತಕ, ಒಂದು ಶುಲ್ಕ, ಒಬ್ಬರ ಪ್ರೋತ್ಸಾಹದ ಮಾತು... ಇವು ಒಂದು ಮಗುವಿನ ಬದುಕನ್ನು ಹೇಗೆ ಬದಲಿಸುತ್ತವೆ ಎಂದು ನಾನು ನನ್ನ ಜೀವನದಲ್ಲೇ ಕಂಡಿದ್ದೇನೆ. ಅದಕ್ಕೇ ಇಂದು ನಾನು ಹೇಳುವ ಪ್ರತಿ \"ಧನ್ಯವಾದ\" ನನ್ನ ಹೃದಯದಿಂದ ಬರುತ್ತಿದೆ.",
      "ಮೊದಲಿಗೆ, ತಮ್ಮ ಅಮೂಲ್ಯ ಸಮಯ ಮಾಡಿಕೊಂಡು ಬಂದು, ದೀಪ ಬೆಳಗಿಸಿ, ನಮ್ಮ ಆಧಾರಸ್ತಂಭಗಳನ್ನು ಗೌರವಿಸಿ, ನಮ್ಮ ಮಕ್ಕಳಿಗೆ ಪ್ರೇರಣೆಯ ಮಾತುಗಳನ್ನಾಡಿದ ನಮ್ಮ ಗೌರವಾನ್ವಿತ ಮುಖ್ಯ ಅತಿಥಿಗಳಾದ {{ನ್ಯಾಯಮೂರ್ತಿ ಎಚ್. ಪಿ. ಸಂದೇಶ್, ಶ್ರೀಮತಿ ದಿವ್ಯಾ ಪ್ರಭು ಜಿ. ಆರ್. ಜೆ. ಮತ್ತು ಡಾ. ಭೀಮಾಶಂಕರ್ ಎಸ್. ಗುಳೇದ}} ಅವರಿಗೆ ನಮ್ಮ ಹೃತ್ಪೂರ್ವಕ ಧನ್ಯವಾದಗಳು. ಇಂದು ನಮ್ಮೊಂದಿಗೆ ಉಪಸ್ಥಿತರಿರುವ ಎಲ್ಲಾ ಗಣ್ಯರಿಗೂ ಧನ್ಯವಾದಗಳು.",
      "ನಮ್ಮ ಸಂಸ್ಥಾಪಕಿ ಶ್ರೀಮತಿ ಚಾರುಲತಾ ಅವರಿಗೆ... ಹತ್ತು ವರ್ಷಗಳ ಹಿಂದೆ ನೀವು ಕಂಡ ಒಂದು ಕನಸು, ಇಂದು ಅನೇಕ ಮಕ್ಕಳ ಕನಸಾಗಿ ಬೆಳೆದಿದೆ. ನಿಮ್ಮ ದೃಢತೆಗೆ ನಮ್ಮೆಲ್ಲರ ನಮನ.",
      "ನಮ್ಮ ಆಧಾರಸ್ತಂಭಗಳಾದ ದಾನಿಗಳಿಗೆ... ಬೆಂಗಳೂರು, ಚೆನ್ನೈನಿಂದ ಹಿಡಿದು ವಿದೇಶಗಳವರೆಗೆ, ವರ್ಷದಿಂದ ವರ್ಷಕ್ಕೆ ನಮ್ಮ ಮೇಲೆ ನಂಬಿಕೆ ಇಟ್ಟು ಕೈಜೋಡಿಸಿದ್ದೀರಿ. ನೀವು ಕೊಟ್ಟದ್ದು ಕೇವಲ ಹಣವಲ್ಲ, ಒಂದು ಮಗುವಿನ ಭವಿಷ್ಯ.",
      "ನಮ್ಮ ಸಹಭಾಗಿ ಸಂಸ್ಥೆಗಳಾದ ನಿಸರ್ಗ ಫೌಂಡೇಶನ್, ಬೆಳಕು ಟ್ರಸ್ಟ್, ಸೌಖ್ಯ ಸಮೃದ್ಧಿ ಸಂಸ್ಥೆ, ಕೋಲಾರ ಜಿಲ್ಲಾ ಆರೋಗ್ಯ ಮತ್ತು ಕುಟುಂಬ ಕಲ್ಯಾಣ ಇಲಾಖೆ, ಹಾಗೂ ನಮ್ಮೊಂದಿಗೆ ಕೆಲಸ ಮಾಡುವ ಎಲ್ಲಾ ಶಾಲೆಗಳ ಮುಖ್ಯೋಪಾಧ್ಯಾಯರು ಮತ್ತು ಶಿಕ್ಷಕರಿಗೆ ಧನ್ಯವಾದಗಳು.",
      "ನಮ್ಮನ್ನು ನಂಬಿ ತಮ್ಮ ಮಕ್ಕಳ ಶಿಕ್ಷಣದಲ್ಲಿ ಕೈಜೋಡಿಸಿದ ಪೋಷಕರಿಗೆ, ಮತ್ತು ಇಂದು ತಮ್ಮ ಸುಂದರ ಕಾರ್ಯಕ್ರಮಗಳಿಂದ ನಮ್ಮೆಲ್ಲರ ಮನಸ್ಸು ಗೆದ್ದ ನಮ್ಮ ಪ್ರೀತಿಯ ಮಕ್ಕಳಿಗೆ ವಿಶೇಷ ಧನ್ಯವಾದಗಳು.",
      "ಈ ಕಾರ್ಯಕ್ರಮದ ಯಶಸ್ಸಿಗಾಗಿ ಹಗಲು-ರಾತ್ರಿ ಶ್ರಮಿಸಿದ ನಮ್ಮ ತಂಡ ಮತ್ತು ಸ್ವಯಂಸೇವಕರಿಗೆ, ನಮ್ಮ ಪಯಣವನ್ನು ವಿಡಿಯೋ ಮತ್ತು ಚಿತ್ರಗಳಲ್ಲಿ ಸೆರೆಹಿಡಿದವರಿಗೆ, ಹಾಗೂ ಈ ಸ್ಥಳವನ್ನು ಒದಗಿಸಿದ {{ಆರ್. ವಿ. ಟೀಚರ್ಸ್ ಕಾಲೇಜು}} ಅವರಿಗೆ ಧನ್ಯವಾದಗಳು.",
      "ಕೊನೆಯದಾಗಿ ಒಂದು ವಿನಂತಿ. ನಿಮಗೆ ಗೊತ್ತಿರುವ ಯಾವುದಾದರೂ ಹಳ್ಳಿಯಲ್ಲಿ, ಓದಲು ಆಸೆ ಇದ್ದೂ ಹಣದ ಕೊರತೆಯಿಂದ ಕಷ್ಟಪಡುತ್ತಿರುವ ಮಗು ಇದ್ದರೆ, ನಮಗೆ ತಿಳಿಸಿ. ಒಬ್ಬರು ಒಂದು ಮಗುವಿನ ಕೈ ಹಿಡಿದರೆ ಸಾಕು... ಒಂದು ಕುಟುಂಬದ ಕಥೆಯೇ ಬದಲಾಗುತ್ತದೆ.",
      "ಯಾರನ್ನಾದರೂ ಹೆಸರಿಸಲು ಮರೆತಿದ್ದರೆ ದಯವಿಟ್ಟು ಕ್ಷಮಿಸಿ. ನಿಮ್ಮೆಲ್ಲರ ಪಾತ್ರ ನಮಗೆ ಅಷ್ಟೇ ಮುಖ್ಯ. ನಿಮ್ಮೆಲ್ಲರ ಪ್ರೀತಿ ಮತ್ತು ಬೆಂಬಲ ಹೀಗೆಯೇ ಇರಲಿ.",
      "ಎಲ್ಲರಿಗೂ ಮತ್ತೊಮ್ಮೆ ಧನ್ಯವಾದಗಳು.",
    ],
  },
]

export const SPEECH_FOR_ACTIVITY: Record<string, string> = Object.fromEntries(SPEECHES.map((s) => [s.activityId, s.slug]))

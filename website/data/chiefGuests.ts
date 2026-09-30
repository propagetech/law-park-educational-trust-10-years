// Chief guests for the 10-year celebration on 4 October 2026, in protocol
// order, which is also the honouring order. Each has a profile page at
// /event-duties/guests/<slug>. Only facts the trust has been given are here;
// profiles marked incomplete show that on the page.

export interface ChiefGuest {
  slug: string
  name: string // as printed on name plates and read by the emcee
  short: string // in the header's list
  role: string
  honourOrder: number
  complete: boolean
  glance: [string, string][]
  career?: { position: string; where: string; when: string }[]
  sections?: { title: string; items: string[] }[]
  emceeIntro: string
  // A source without a url was given only as a site name.
  sources?: { label: string; url?: string }[]
}

export const CHIEF_GUESTS: ChiefGuest[] = [
  {
    slug: 'justice-h-p-sandesh',
    name: "Hon'ble Justice H. P. Sandesh",
    short: 'Justice H. P. Sandesh',
    role: 'Judge, High Court of Karnataka',
    honourOrder: 1,
    complete: true,
    glance: [
      ['Full name', 'Justice Hethur Puttaswamygowda Sandesh'],
      ['Known as', 'Justice H. P. Sandesh'],
      ['Office', 'Judge of the High Court of Karnataka: Additional Judge from 3 November 2018, Permanent Judge from 26 February 2020'],
      ['From', 'Hethur, Sakaleshpur Taluk, Hassan District, Karnataka'],
      ['Schooling', 'Hethur and Sakaleshpur; Pre-University Government College, Sakaleshpur'],
      ['Law degree', 'Five-year law degree, M. Krishna Law College, University of Mysore (1987 to 1992)'],
    ],
    career: [
      { position: 'Judge (permanent)', where: 'High Court of Karnataka', when: '26 February 2020 to now' },
      { position: 'Additional Judge', where: 'High Court of Karnataka', when: '3 November 2018 to February 2020' },
      { position: 'District and Sessions Judge (direct recruit)', where: 'District judiciary, Karnataka', when: '2002 to 2018' },
      { position: 'Advocate', where: 'High Court and district courts, Bengaluru', when: '1994 to 2002' },
      { position: 'Advocate, civil and criminal law', where: 'Hassan, with senior advocate Sri K. Anantharamaiah', when: '1992 to 1994' },
    ],
    sections: [
      {
        title: 'Posts in the district judiciary, 2002 to 2018',
        items: [
          'Principal District and Sessions Judge, Mysuru and Haveri.',
          "Principal Secretary to the Hon'ble Chief Justice.",
          'Registrar (Administration), Registrar (Infrastructure) and Registrar (Vigilance), High Court of Karnataka.',
          'Chief Judge, Court of Small Causes.',
        ],
      },
      {
        title: 'Areas of his judgments',
        items: [
          'Criminal law: petitions to quash proceedings under Section 482 of the CrPC, bail, and circumstantial evidence.',
          'Civil and commercial disputes: cheque cases under Section 138 of the Negotiable Instruments Act, time-barred debts, rejection of plaints under the Civil Procedure Code, and the Hindu Succession Act.',
          'Motor Vehicles Act: compensation for dependants and insurance liability.',
        ],
      },
    ],
    emceeIntro:
      "Our chief guest, the Hon'ble Justice H. P. Sandesh, is a Judge of the High Court of Karnataka. Born in Hethur in Sakaleshpur taluk of Hassan district, he studied law at M. Krishna Law College, University of Mysore, and practised as an advocate in Hassan and Bengaluru. Selected directly as a District and Sessions Judge in 2002, he served as Principal District and Sessions Judge in Mysuru and Haveri and as Registrar at the High Court, before his elevation to the High Court in 2018. Please join me in welcoming him with a warm round of applause.",
    sources: [
      { label: 'dharwad.dcourts.gov.in' },
      { label: 'lekhanews.in' },
      { label: 'barandbench.com' },
      { label: 'dakshalegal.blog' },
      { label: 'timesofindia.indiatimes.com' },
      { label: 'Facebook and Instagram posts' },
    ],
  },
  {
    slug: 'divya-prabhu',
    name: 'Smt. Divya Prabhu G. R. J., IAS',
    short: 'Divya Prabhu G R J, IAS',
    role: 'Managing Director, KREDL, and Commissioner for Rural Development, Bengaluru',
    honourOrder: 2,
    complete: true,
    glance: [
      ['Service', 'Indian Administrative Service, 2014 batch, Karnataka cadre'],
      ['Entry', 'Direct recruit; rank 82 in the UPSC Civil Services Examination 2013'],
      ['Before the IAS', 'Indian Forest Service, 2010 batch'],
      ['Education', 'B.Sc. Agriculture, Tamil Nadu Agricultural University, Coimbatore; Master of Business Laws (M.B.L.)'],
      ['Home state', 'Tamil Nadu'],
      ['Now', 'Managing Director, Karnataka Renewable Energy Development Limited (KREDL), from 17 July 2026, and Commissioner for Rural Development, Bengaluru'],
    ],
    career: [
      { position: 'Managing Director', where: 'Karnataka Renewable Energy Development Limited (KREDL)', when: 'July 2026 to now' },
      { position: 'Commissioner', where: 'Rural Development Department, Bengaluru', when: 'June 2026 to now' },
      { position: 'Deputy Commissioner', where: 'Dharwad District', when: 'January 2024 to February 2026' },
      { position: 'Deputy Commissioner', where: 'Chitradurga District', when: 'October 2022 to January 2024' },
      { position: 'Chief Executive Officer', where: 'Zilla Panchayat, Mandya', when: 'April 2021 to October 2022' },
      { position: 'Controller of Examinations', where: 'Karnataka Public Service Commission (KPSC)', when: 'July 2019 to April 2021' },
    ],
    sections: [
      {
        title: 'Recognition',
        items: [
          'As Deputy Commissioner of Dharwad, launched Mission Vidyakashi to improve school buildings and the quality of teaching in public schools.',
          'Best Deputy Commissioner Award.',
          'National Award for Best Electoral Practices.',
        ],
      },
    ],
    emceeIntro:
      'Our chief guest, Smt. Divya Prabhu G. R. J., is an officer of the Indian Administrative Service, 2014 batch, Karnataka cadre. Today she serves as Managing Director of the Karnataka Renewable Energy Development Limited and as Commissioner for Rural Development. As Deputy Commissioner of Dharwad, she launched Mission Vidyakashi to strengthen public schools, and she has received the Best Deputy Commissioner Award and the National Award for Best Electoral Practices. Please join me in welcoming her with a warm round of applause.',
    sources: [
      { label: 'StockLens officer profile', url: 'https://www.stocklens.co.in/ias/officer/divya-prabhu-g-r-j-3k05' },
      { label: 'IAS Exam Portal: rank 82, CSE 2013', url: 'https://iasexamportal.com/success-story/divya-prabhu-air-rank-82-for-civil-services-examination-2013' },
      { label: 'KREDL on LinkedIn: assumed charge', url: 'https://www.linkedin.com/posts/kredl-gok_smt-divya-prabhu-grj-ias-assumed-charge-activity-7483885290777108481-bBpa' },
      { label: 'YouTube', url: 'https://www.youtube.com/watch?v=Pxeqq1adADY' },
      { label: 'Whispers in the Corridors: posted as Commissioner, Rural Development', url: 'https://whispersinthecorridors.com/news/karnataka-govt-posts-divya-prabhu-as-commissioner-rural-development-bengaluru-161805' },
      { label: 'The Secretariat: postings', url: 'https://thesecretariat.in/bureautrack/divya-prabhu-g-r-j-01kn113k05' },
      { label: 'Instagram: Mission Vidyakashi', url: 'https://www.instagram.com/p/DC6055IMrxR/' },
    ],
  },
  {
    slug: 'bheemashankar-s-guled',
    name: 'Dr. Bheemashankar S. Guled, IPS',
    short: 'Dr. Bheemashankar S. Guled, IPS',
    role: 'Deputy Inspector General of Police, CID Economic Offences, Bengaluru',
    honourOrder: 3,
    complete: true,
    glance: [
      ['Service', 'Indian Police Service, 2012 batch, Karnataka cadre'],
      ['Entry', 'Direct recruit through the UPSC Civil Services Examination; joined on 24 December 2012'],
      ['Now', 'Deputy Inspector General of Police (DIGP), CID Economic Offences, Bengaluru, from January 2026'],
      ['Education', 'MBBS, Mysore Medical College and Research Institute (2002 to 2007)'],
      ['From', 'Kalaburagi (Gulbarga), Karnataka'],
    ],
    career: [
      { position: 'Deputy Inspector General of Police', where: 'CID Economic Offences, Bengaluru', when: 'January 2026 to now' },
      { position: 'Superintendent of Police', where: 'Belagavi District', when: 'From September 2023' },
      { position: 'Deputy Commissioner of Police', where: 'North East and North West Divisions, Bengaluru City', when: 'Earlier' },
      { position: 'Superintendent of Police', where: 'Bengaluru Rural', when: 'Earlier' },
      { position: 'Superintendent of Police', where: 'Railways', when: 'Earlier' },
      { position: 'Assistant Superintendent / Superintendent of Police', where: 'Davanagere', when: 'Early career' },
    ],
    sections: [
      {
        title: 'Public safety work',
        items: [
          'A medical doctor who joined the police service.',
          'As Deputy Commissioner of Police in Bengaluru, started public safety drives such as the "Crime Prevention Month" cycle rallies.',
        ],
      },
    ],
    emceeIntro:
      'Our chief guest, Dr. Bheemashankar S. Guled, is an officer of the Indian Police Service, 2012 batch, Karnataka cadre. A doctor by training, he studied medicine at Mysore Medical College before joining the police service. He has led the district police in Bengaluru Rural and Belagavi, served as Deputy Commissioner of Police in Bengaluru, and is now Deputy Inspector General of Police, CID Economic Offences. Please join me in welcoming him with a warm round of applause.',
    sources: [
      { label: 'LinkedIn profile', url: 'https://in.linkedin.com/in/bheemashankar-s-guled-1ab71b199' },
      { label: 'stocklens.co.in' },
      { label: 'thehindu.com' },
      { label: 'bheemashankarguled.blogspot.com' },
      { label: 'slideshare.net and slideserve.com' },
    ],
  },
]

export const ORDINAL = ['', '1st', '2nd', '3rd']

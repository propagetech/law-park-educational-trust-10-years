// Event day duties for the 10-year celebration, 3 and 4 October 2026.
// The duties below are the fixed list everyone signs up against. Names are
// stored in D1 (functions/api/duties.js); team-added duties live there too.

export interface Duty {
  id: string
  title: string
  when?: string
  detail: string
  need: number
}

export interface DutySection {
  id: string
  title: string
  when: string
  duties: Duty[]
}

export const EVENT_FACTS = {
  venue: 'RV Auditorium, RV Teachers College, Bengaluru',
  mapUrl: 'https://maps.app.goo.gl/B82AwW84oyqZh9yZ9',
  setupDay: 'Saturday 3 October 2026',
  eventDay: 'Sunday 4 October 2026',
  coreTeam: 'Core team assembles at the venue between 8 and 9 AM on 4 October',
  chiefGuests: [
    'Divya Prabhu G R J, IAS (2014 batch, Karnataka cadre)',
    'Bheemashankar S Guled, IPS (2012 batch, Karnataka cadre), DIG, CID Economic Offences, Bengaluru',
    'Sitting Judge (to be confirmed)',
  ],
}

export interface PillarGroup {
  pillar: string
  ngo?: string
  location: string
  children?: number
  adults?: number
  toppers?: number
}

// As shared by the team. Toppers are counted within children.
export const PILLAR_GROUPS: PillarGroup[] = [
  { pillar: 'Radhamani', ngo: 'Beluku', location: 'Srinivasapura, Mulbagal, KGF, Kolar', children: 80, adults: 6, toppers: 10 },
  { pillar: 'Prabhu', ngo: 'Nisarga', location: 'HD Kote', children: 50, adults: 10, toppers: 4 },
  { pillar: 'Komathi', location: 'KGF', children: 16, adults: 2, toppers: 0 },
  { pillar: 'Rufus', location: 'KGF', children: 3, adults: 3, toppers: 0 },
  { pillar: 'Rani', location: 'KGF', children: 9, adults: 7, toppers: 0 },
  { pillar: 'Suma', location: 'Pandavapura' },
  { pillar: 'Sumesh', location: 'KGF', children: 17, adults: 5, toppers: 2 },
  { pillar: 'Mangala Gowri', location: 'KGF' },
]

export interface SeedActivity {
  id: string
  date: string // YYYY-MM-DD
  time: string // HH:MM, 24-hour; '' for any time
  title: string
  description: string
  todos: string[]
}

// The starting schedule. It is copied into D1 once, the first time the API
// runs; after that the team edits it on the page and this list is not read.
export const SEED_ACTIVITIES: SeedActivity[] = [
  {
    id: 'e-seed-setup', date: '2026-10-03', time: '15:00', title: 'Venue setup',
    description: 'Stage, LED, flex, photo booth, donation counter, gifts and other distribution items.',
    todos: [
      'Collect the hall keys from RV Teachers College by 2:45 PM',
      'Check power points near the stage and the LED screen',
      'Receive the LED team and show them where the screen goes',
      'Put up the main flex behind the stage',
      'Put up the entrance banner',
      'Stick direction signs: entrance, toilets, lunch, registration',
      'Set chairs on stage for the chief guests and trustees',
      'Place the podium and test that it does not wobble',
      'Set up the photo booth frame and props near the entrance',
      'Set up the donation counter table with a cash box',
      'Place the UPI QR standee on the donation table',
      'Keep the receipt book (with 80G details) and 2 pens at the counter',
      'Receive gifts and distribution items, count them against the list',
      'Lock gifts, kits and mementos in the storeroom',
      'Stick "Reserved" labels on the front rows for guests',
      'Label rows for each children’s group',
      'Take photos of the finished hall and share in the team group',
    ],
  },
  {
    id: 'e-seed-rehearsal', date: '2026-10-03', time: '18:00', title: 'Run-through and sound check',
    description: 'Emcee, stage manager, AV and cultural items walk through the programme.',
    todos: [
      'Play the welcome video once, full length, with sound',
      'Check the video is readable from the last row',
      'Test both cordless mics and the podium mic',
      'Keep spare batteries for the mics',
      'Emcee reads the full script once on stage',
      'Practise calling up one scholarship batch by name',
      'Children rehearse the prayer and cultural items',
      'Agree light cues with the AV person: dim for the video, full for the stage',
      'Walk the guard of honour route with the NCC officer',
      'Confirm everyone’s reporting time for tomorrow',
    ],
  },
  {
    id: 'e-seed-stay', date: '2026-10-03', time: '20:00', title: 'HD Kote group settles at the church, Chandapura',
    description: '60 people stay the night.',
    todos: [
      'Confirm arrival time with the HD Kote group captains',
      'Receive the group at the church and count heads',
      'Show separate sleeping areas for girls and boys',
      'Hand out mats and blankets',
      'Show toilets and drinking water',
      'Serve dinner',
      'Share the night in-charge phone number with the group',
      'Set alarms for the morning',
      'Confirm breakfast time with the cook',
    ],
  },
  {
    id: 'e-seed-stay-leave', date: '2026-10-04', time: '07:30', title: 'HD Kote group leaves Chandapura',
    description: 'Call the arrival desk when 30 minutes away.',
    todos: [
      'Wake everyone by 6:00 AM',
      'Serve breakfast by 6:45 AM',
      'Check the rooms for forgotten bags',
      'Count heads before boarding',
      'Call the arrival desk when 30 minutes away',
    ],
  },
  {
    id: 'e-seed-core', date: '2026-10-04', time: '08:00', title: 'Core team assembles at the venue',
    description: 'Between 8 and 9 AM, in dress code.',
    todos: [
      'Tick the roll call as each core member arrives',
      'Hand out the printed contact sheet',
      'Walk the hall once to check setup from yesterday',
      'Confirm the caterer arrival time',
      'Confirm LED, sound and photographer have reported',
      'Registration desk ready with name tags by 9:00 AM',
    ],
  },
  {
    id: 'e-seed-arrival', date: '2026-10-04', time: '09:15', title: 'Guest arrival, registration, tea',
    description: 'Volunteers at the entrance. Groups arriving from far away eat first.',
    todos: [
      'Two volunteers at the entrance to greet guests',
      'Registration: sign-in sheet and name tags',
      'Hand each guest a programme sheet',
      'Tea and snacks ready by 9:15 AM',
      'Groups who travelled far eat first',
      'Show each group to its labelled row',
      'Keep a lost child point at the registration desk',
    ],
  },
  {
    id: 'e-seed-guard', date: '2026-10-04', time: '09:40', title: 'Chief guests arrive, NCC guard of honour',
    description: '30 NCC cadets at the entrance. Each guest is met by their escort.',
    todos: [
      'NCC cadets in position at the entrance by 9:30 AM',
      'Keep the chief guests’ parking spots free',
      'Escorts wait at the gate from 9:30 AM',
      'Signal the NCC officer as each guest’s car arrives',
      'Walk each guest to the guest lounge',
      'Offer water or tea in the lounge',
      'Tell the emcee when all guests are seated',
    ],
  },
  {
    id: 'e-seed-open', date: '2026-10-04', time: '10:00', title: 'Emcee opens the programme',
    description: 'Short welcome; asks guests to be seated and phones on silent.',
    todos: [
      'Emcee checks the mic before walking on',
      'Ask guests to be seated and phones on silent',
      'Welcome the chief guests by name',
    ],
  },
  {
    id: 'e-seed-prayer', date: '2026-10-04', time: '10:03', title: 'Prayer / Nada Geethe',
    description: 'Sung by children. Audience stands.',
    todos: [
      'Children ready in the wings by 9:55 AM',
      'Keep the prayer audio ready as a backup',
      'Emcee asks the audience to stand',
    ],
  },
  {
    id: 'e-seed-video', date: '2026-10-04', time: '10:08', title: '10-Year Journey welcome video',
    description: 'Chief guests watch from the front row. Dim the lights.',
    todos: [
      'Keep the video open and paused on the laptop',
      'Keep a backup copy on a pen drive',
      'Dim the hall lights on cue',
      'Check the volume in the first 10 seconds',
      'Bring the lights back up when the video ends',
    ],
  },
  {
    id: 'e-seed-lamp', date: '2026-10-04', time: '10:14', title: 'Lamp lighting',
    description: 'Emcee invites the chief guests and dignitaries to the stage. They light the lamp with both trustees.',
    todos: [
      'Buy or bring the brass lamp (kuthu vilakku)',
      'Buy lamp oil (1 litre) and cotton wicks',
      'Keep a candle, matchbox and a lighter as backup',
      'Keep a plate of flowers and a small towel',
      'Place the lamp centre stage on a stand, on a cloth, away from the curtain',
      'Fill oil and set 5 wicks before 9:30 AM',
      'Keep a bucket of water or sand behind the stage',
      'Light the candle when the emcee calls the guests up',
      'Hand the candle to the chief guest',
      'Photographer ready at the side of the stage',
      'After the programme, put the lamp out and store it safely',
    ],
  },
  {
    id: 'e-seed-honour', date: '2026-10-04', time: '10:19', title: 'Welcoming and honouring the chief guests',
    description: 'Shawl, bouquet or memento, by the trustees. Emcee reads a short introduction of each guest.',
    todos: [
      'Shawls, bouquets and mementos in calling order on a side table',
      'One volunteer hands each item to the trustees',
      'Introductions printed for the emcee',
      'Check the spelling of every guest name on the mementos',
    ],
  },
  {
    id: 'e-seed-founder', date: '2026-10-04', time: '10:26', title: "Founder's address, Charulatha M. R.",
    description: '3 to 4 minutes, just before the chief guests speak.',
    todos: [
      'Print the founder’s speech in large font',
      'Keep water at the podium',
      'Timekeeper signals at 3 minutes',
    ],
  },
  {
    id: 'e-seed-guests', date: '2026-10-04', time: '10:30', title: "Chief guests' address",
    description: 'Each guest is told in advance they have about 15 to 20 minutes.',
    todos: [
      'Tell each guest their speaking time in advance',
      'Keep water at the podium',
      'Timekeeper signals at one minute left',
    ],
  },
  {
    id: 'e-seed-teamphoto', date: '2026-10-04', time: '10:50', title: 'Team photo with the chief guests',
    description: 'Whole team on stage in dress code.',
    todos: [
      'Plan the standing order for the team',
      'Team waits at the side of the stage in dress code',
      'Photographer ready with the wide lens',
      'Take 3 shots, then clear the stage quickly',
    ],
  },
  {
    id: 'e-seed-cultural', date: '2026-10-04', time: '10:55', title: "Children's cultural programme",
    description: '2 to 4 short items (song, dance, skit), each under 6 minutes.',
    todos: [
      'Final list of items and the order they go in',
      'Each item under 6 minutes',
      'Music for each item on the laptop and a pen drive',
      'A room for children to change and wait',
      'One volunteer with the children at all times',
    ],
  },
  {
    id: 'e-seed-scholarship', date: '2026-10-04', time: '11:20', title: 'Scholarship and school-kit distribution',
    description: 'By the chief guests and trustees. Children called in batches with names read out. If a chief guest has to leave early, move this and the felicitation up to follow the team photo.',
    todos: [
      'Kits packed one per child with the name on it',
      'Kits sorted by group and calling order',
      'Printed name list for the emcee',
      'Two volunteers hand kits to the guests in order',
      'Call children up in batches of 10',
      'Photographer takes one photo per batch',
      'Tick each child’s name as they receive the kit',
    ],
  },
  {
    id: 'e-seed-felicitation', date: '2026-10-04', time: '11:45', title: 'Felicitation of our pillars',
    description: 'Donors, partners and key volunteers, felicitated by the chief guests with the trustees.',
    todos: [
      'Printed list of pillars to felicitate',
      'Shawls and mementos in the same order as the list',
      'Call each pillar by name',
    ],
  },
  {
    id: 'e-seed-thanks', date: '2026-10-04', time: '12:00', title: 'Vote of thanks, S. M. Manjunatha',
    description: 'About 3 minutes.',
    todos: [
      'Print the vote of thanks in large font',
      'Add any special guest who came on the day',
    ],
  },
  {
    id: 'e-seed-anthem', date: '2026-10-04', time: '12:04', title: 'National Anthem',
    description: 'Audience stands.',
    todos: [
      'Audio ready as a backup',
      'Emcee asks everyone to stand',
    ],
  },
  {
    id: 'e-seed-groupphotos', date: '2026-10-04', time: '12:06', title: 'Group photos',
    description: 'Chief guests, trustees, children, donors.',
    todos: [
      'Chief guests with trustees',
      'Chief guests with all the children',
      'Donors and partners with the chief guests',
      'Whole team photo',
    ],
  },
  {
    id: 'e-seed-lunch', date: '2026-10-04', time: '12:20', title: 'Lunch',
    description: 'Children served first.',
    todos: [
      'Caterer ready by 12:15 PM',
      'Serve children first',
      'Separate table for the chief guests',
      'Drinking water at every table',
      'Two volunteers keep the queue moving',
      'Food for NCC cadets',
    ],
  },
  {
    id: 'e-seed-departures', date: '2026-10-04', time: '13:30', title: 'Groups leave',
    description: 'HD Kote group leaves first, it has the longest trip.',
    todos: [
      'HD Kote group leaves first',
      'Each captain counts heads before the vehicle leaves',
      'Hand each group their leftover kits or gifts',
      'Check the hall for forgotten bags',
      'Each captain messages the team group when home',
    ],
  },
]

export const DUTY_SECTIONS: DutySection[] = [
  {
    id: 'before',
    title: 'Before the day',
    when: 'Now to 2 October',
    duties: [
      { id: 'event-lead', title: 'Overall event lead', detail: 'Has the final say on the day. Every problem that a duty owner cannot solve comes here.', need: 1 },
      { id: 'deputy-lead', title: 'Deputy event lead', detail: 'Runs the floor whenever the lead is on stage or with the chief guests.', need: 1 },
      { id: 'judge-confirm', title: 'Confirm the sitting judge', detail: 'Get a yes, the exact name and designation, and arrival time. Then update the flex, emcee script and mementos.', need: 1 },
      { id: 'guest-brief', title: 'Send the chief guests a one-page note', detail: 'Founding year, districts, student count, the award and the website link, a few days ahead. Tell each guest they have about 15 to 20 minutes.', need: 1 },
      { id: 'venue-booking', title: 'Venue confirmation with RV Teachers College', detail: 'Hall access from 3 PM on 3 October, power backup, AC, parking for buses and guest cars, clean toilets, the venue contact person, payment done.', need: 1 },
      { id: 'invites-rsvp', title: 'Invitations and RSVP calls', detail: 'Donors, partners, headmasters, parents. Get a final number by 30 September so food and seating can be fixed.', need: 2 },
      { id: 'headcount', title: 'Final headcount from every pillar', detail: 'Children, adults and toppers per group. Suma and Mangala Gowri numbers are still pending, and the adults column needs a recheck.', need: 1 },
      { id: 'transport-confirm', title: "Confirm the children's transport", detail: 'Transport is already arranged. Get each driver name and phone, the vehicle number, pickup point and departure time, and share them with the group captains.', need: 1 },
      { id: 'catering', title: 'Caterer: tea, snacks and lunch', detail: 'Final plate count (children, adults, team, guests, NCC cadets), menu, serving counters, plates, drinking water.', need: 2 },
      { id: 'printing', title: 'Printing', detail: 'Flex and banners, direction signs (entrance, toilets, lunch), seat labels, programme sheet, certificates, and the printed name lists the emcee reads from.', need: 1 },
      { id: 'mementos', title: 'Mementos, shawls and bouquets', detail: 'For the chief guests, pillars, partners and toppers. Labelled and kept in the order the names are called.', need: 2 },
      { id: 'kits', title: 'Scholarship letters and school kits', detail: 'One named pack per child, sorted by group and call order, packed the evening before.', need: 3 },
      { id: 'toppers', title: 'Topper recognition (16 toppers)', detail: 'Certificates or medals with names checked against each pillar.', need: 1 },
      { id: 'consent', title: 'Photo consent from parents', detail: 'Every child on stage, in photos or in social posts needs a parent’s consent. Collect it group by group, through the pillars.', need: 2 },
      { id: 'dress-code', title: 'Team dress code', detail: 'Decide it and send it to everyone this week.', need: 1 },
      { id: 'ncc', title: 'NCC cadets (30) for the guard of honour', detail: 'Confirm with the NCC officer: reporting time, rehearsal, where they stand, water, snacks and lunch, and a thank-you certificate.', need: 1 },
      { id: 'video-ready', title: 'Welcome video and slides ready', detail: 'Final files on a pen drive and a laptop, tested on the venue projector.', need: 1 },
      { id: 'emcee-script', title: 'Emcee script', detail: 'Chief guest introductions, the pillar felicitation list, and the scholarship batches with names.', need: 1 },
      { id: 'budget', title: 'Budget, cash float and bills', detail: 'Keep a small cash float for the day and a receipt for every expense.', need: 1 },
      { id: 'contact-sheet', title: 'One-page contact sheet', detail: 'Phone numbers of every duty owner, drivers, venue, caterer, NCC officer and the nearest hospital. Print ten copies.', need: 1 },
    ],
  },
  {
    id: 'setup',
    title: 'Venue setup',
    when: 'Saturday 3 October, from 3 PM',
    duties: [
      { id: 'setup-lead', title: 'Setup lead', detail: 'Owns the setup checklist and signs it off before leaving the venue.', need: 1 },
      { id: 'stage', title: 'Stage', detail: 'Backdrop, chairs for guests on stage, podium, lamp position, a table for mementos and kits.', need: 2 },
      { id: 'led', title: 'LED screen team', detail: 'Receive the LED team, check the screen plays the video, agree their reporting time for 4 October.', need: 1 },
      { id: 'flex', title: 'Flex, banners and direction signs', detail: 'Main flex, entrance banner, signs to toilets, lunch and the registration desk.', need: 2 },
      { id: 'photo-booth', title: 'Photo booth', detail: 'Frame, props, good light, and a spot that does not block the entrance.', need: 2 },
      { id: 'donation-setup', title: 'Donation counter setup', detail: 'Table, receipt book with 80G details, UPI QR standee, a lockable cash box.', need: 1 },
      { id: 'gifts-store', title: 'Gifts and distribution items', detail: 'Receive, count and store in a locked room. Arrange in the order they go on stage.', need: 2 },
      { id: 'sound-check', title: 'Sound, mic and projector check', detail: 'Two cordless mics and a podium mic, spare batteries, the full video once with sound.', need: 1 },
      { id: 'seating', title: 'Seating plan and reserved rows', detail: 'Front row for chief guests, then children by group, donors, parents. Label the reserved seats.', need: 2 },
      { id: 'lamp', title: 'Lamp lighting items', detail: 'Lamp, oil, wicks, candle, matchbox and a flower plate, kept on stage.', need: 1 },
      { id: 'rehearsal', title: 'Evening run-through', detail: 'Emcee, stage manager, AV and cultural items walk through the programme. Walk the guard of honour route.', need: 1 },
    ],
  },
  {
    id: 'night',
    title: 'Night stay, HD Kote group',
    when: 'Saturday 3 October night, church at Chandapura (60 people)',
    duties: [
      { id: 'stay-coord', title: 'Stay coordinator', detail: 'Confirm with the church: arrival time, rooms, headcount. First point of contact for the group that night.', need: 1 },
      { id: 'stay-bedding', title: 'Bedding, toilets and drinking water', detail: 'Mats and blankets for 60. Separate sleeping areas for girls and boys, with women adults for the girls.', need: 2 },
      { id: 'stay-food', title: 'Dinner on 3 October, breakfast on 4 October', detail: 'Food for 60 people, breakfast early enough to leave on time.', need: 1 },
      { id: 'stay-night', title: 'Adults staying the night', detail: 'Stay with the children overnight and keep a torch, first aid kit and the contact sheet.', need: 2 },
      { id: 'stay-morning', title: 'Morning move to the venue', detail: 'Headcount before boarding, leave Chandapura by 7:30 AM, call the arrival desk when 30 minutes away.', need: 1 },
    ],
  },
  {
    id: 'travel',
    title: 'Group captains',
    when: 'Sunday 4 October, to and from the venue',
    duties: [
      { id: 'captain-radhamani', title: 'Radhamani group (Beluku)', when: 'Srinivasapura, Mulbagal, KGF, Kolar · 86 people', detail: 'Headcount at boarding and at arrival, water and snacks on the vehicle, call the arrival desk when 30 minutes away, same count before leaving.', need: 2 },
      { id: 'captain-prabhu', title: 'Prabhu group (Nisarga)', when: 'HD Kote · 60 people, staying overnight', detail: 'Same as every captain. This group has the longest trip home, so it leaves first after lunch.', need: 2 },
      { id: 'captain-komathi', title: 'Komathi group', when: 'KGF · 18 people', detail: 'Headcount at boarding, arrival and departure.', need: 1 },
      { id: 'captain-rufus', title: 'Rufus group', when: 'KGF · 6 people', detail: 'Headcount at boarding, arrival and departure.', need: 1 },
      { id: 'captain-rani', title: 'Rani group', when: 'KGF · 16 people', detail: 'Headcount at boarding, arrival and departure.', need: 1 },
      { id: 'captain-suma', title: 'Suma group', when: 'Pandavapura · numbers pending', detail: 'Headcount at boarding, arrival and departure.', need: 1 },
      { id: 'captain-sumesh', title: 'Sumesh group', when: 'KGF · 17 children, 5 adults', detail: 'Headcount at boarding, arrival and departure.', need: 1 },
      { id: 'captain-mangala', title: 'Mangala Gowri group', when: 'KGF · numbers pending', detail: 'Headcount at boarding, arrival and departure.', need: 1 },
      { id: 'bus-marshal', title: 'Bus drop-off and parking marshal', detail: 'Guides each vehicle to the drop point and parking, keeps the entrance clear for the chief guests.', need: 1 },
    ],
  },
  {
    id: 'floor',
    title: 'At the venue',
    when: 'Sunday 4 October, from 8 AM',
    duties: [
      { id: 'roll-call', title: 'Core team roll call at 8 AM', detail: 'Tick who has arrived, hand out the contact sheet, fill gaps from this page.', need: 1 },
      { id: 'registration', title: 'Registration and welcome desk', when: 'From 9:15', detail: 'Sign-in, name tags, programme sheet. Also the lost child and lost and found point.', need: 3 },
      { id: 'arrival-desk', title: 'Group arrival desk', detail: 'Receive each group, match the captain’s headcount, walk them to their rows.', need: 2 },
      { id: 'tea', title: 'Tea and snacks on arrival', when: '9:15 to 10:00', detail: 'Groups arriving from far away eat first.', need: 2 },
      { id: 'water', title: 'Drinking water', detail: 'Water points in the hall and near the stage, refilled all day.', need: 1 },
      { id: 'ushers', title: 'Ushers inside the hall', detail: 'Seat people, keep reserved rows free, keep aisles clear.', need: 4 },
      { id: 'child-safety', title: 'Child safety and toilet escorts', detail: 'No child leaves the hall alone. Women volunteers escort girls.', need: 3 },
      { id: 'first-aid', title: 'First aid', detail: 'Kit with ORS and basic medicines, the route to the nearest hospital, one car on standby.', need: 1 },
      { id: 'donation-counter', title: 'Donation counter', detail: 'Two people at all times. Receipt for every donation. Cash counted and signed by two people at close.', need: 2 },
      { id: 'photo-booth-host', title: 'Photo booth host', detail: 'Keeps the queue moving and takes photos on guests’ phones.', need: 1 },
      { id: 'storeroom', title: 'Storeroom keeper', detail: 'Holds the key to the gifts, kits and mementos. Hands items to the stage in order.', need: 1 },
      { id: 'vip-parking', title: 'Guest car parking', detail: 'Reserved spots near the entrance for the chief guests’ cars.', need: 1 },
      { id: 'cleaning', title: 'Cleanliness during the event', detail: 'Bins in place, toilets checked every hour, spills handled.', need: 2 },
    ],
  },
  {
    id: 'protocol',
    title: 'Chief guests and protocol',
    when: 'Sunday 4 October, from arrival to send-off',
    duties: [
      { id: 'escort-divya', title: 'Escort for Divya Prabhu G R J, IAS', detail: 'Meets the car, walks through the guard of honour, seats, cues to stage, lunch, and sees off.', need: 1 },
      { id: 'escort-guled', title: 'Escort for Bheemashankar S Guled, IPS', detail: 'Meets the car, walks through the guard of honour, seats, cues to stage, lunch, and sees off.', need: 1 },
      { id: 'escort-judge', title: 'Escort for the sitting judge', detail: 'Name to be confirmed. Same duties as the other escorts.', need: 1 },
      { id: 'guard-of-honour', title: 'Guard of honour with the NCC cadets', detail: 'Places the 30 cadets at the entrance and gives the cue as each guest arrives.', need: 1 },
      { id: 'guest-lounge', title: 'Guest lounge', detail: 'A quiet room with water, tea and a washroom for the chief guests before and after the stage.', need: 1 },
    ],
  },
  {
    id: 'programme',
    title: 'Programme and stage',
    when: 'Sunday 4 October, 10:00 AM start',
    duties: [
      { id: 'emcee', title: 'Emcee', detail: 'Runs the programme in Kannada and English from the script.', need: 2 },
      { id: 'stage-manager', title: 'Stage manager', detail: 'Moves people on and off the stage, keeps the next item ready in the wings.', need: 1 },
      { id: 'timekeeper', title: 'Timekeeper', detail: 'Signals each speaker when one minute is left. Tells the emcee when to cut an item.', need: 1 },
      { id: 'av', title: 'AV operator', detail: 'Video, mics and lights. Backup copy on a pen drive and a laptop.', need: 1 },
      { id: 'prayer-anthem', title: 'Prayer, Nada Geethe and National Anthem', detail: 'Children ready in time, with an audio backup.', need: 1 },
      { id: 'cultural', title: "Children's cultural programme", detail: 'Two to four items, each under 6 minutes. A place for children to change and wait.', need: 2 },
      { id: 'scholarship-distribution', title: 'Scholarship and kit distribution', detail: 'Calls children up in batches by name and hands each pack to the guests in order.', need: 3 },
      { id: 'felicitation', title: 'Felicitation of pillars', detail: 'Printed list for the emcee, shawls and mementos handed to the guests in order.', need: 2 },
      { id: 'photo-video', title: 'Photographer and videographer', detail: 'Cover every stage moment, the guard of honour and the team photo.', need: 2 },
      { id: 'team-photo', title: 'Team and group photos', detail: 'Plan the standing order in advance and call people to the stage quickly.', need: 1 },
      { id: 'social-media', title: 'Social media', detail: 'Posts during the day, only of children whose parents gave consent.', need: 1 },
    ],
  },
  {
    id: 'after',
    title: 'Lunch and wrap-up',
    when: 'Sunday 4 October, from 12:20 PM',
    duties: [
      { id: 'lunch', title: 'Lunch service', detail: 'Children first, queue marshals, guests served separately.', need: 3 },
      { id: 'departures', title: 'Group departures', detail: 'Each captain confirms the same headcount before the vehicle leaves. HD Kote leaves first.', need: 1 },
      { id: 'pack-up', title: 'Pack up and returns', detail: 'LED, flex, photo booth, leftover kits and gifts counted and returned.', need: 2 },
      { id: 'venue-handover', title: 'Venue handover', detail: 'Hall cleaned and handed back to RV Teachers College.', need: 1 },
      { id: 'accounts', title: 'Accounts', detail: 'Donation total, bills paid, receipts filed.', need: 1 },
      { id: 'photos-collect', title: 'Collect every photo and video', detail: 'One shared folder, within two days.', need: 1 },
      { id: 'thank-you', title: 'Thank-you messages', detail: 'Chief guests, NCC, venue, caterer, donors and partners, within two days.', need: 1 },
    ],
  },
]

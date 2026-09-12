# 06 · Fact Check and Trustee Questions

Everything a trustee must decide before the film can be locked.
Ordered by consequence. Claim IDs resolve in [02-evidence-table.csv](02-evidence-table.csv).

---

## Part A · Contradictions found in the repository

### A1. The impact numbers do not agree with each other. Four versions exist.

| Source | Students | Geography unit | Value |
|---|---|---|---|
| [data/stats.ts](../../website/data/stats.ts) and [public/magazine/template-06.html](../../website/public/magazine/template-06.html) | 1000+ | villages / districts | 150+ / 10+ |
| [components/sections/Hero.tsx](../../website/components/sections/Hero.tsx) | 500+ | districts | 5+, "Across Karnataka" |
| [CLIENT_FEEDBACK_STATUS.md](../../docs/CLIENT_FEEDBACK_STATUS.md) | 500+ | schools | 150+ |
| [PROJECT_SUMMARY.md](../../docs/PROJECT_SUMMARY.md) | 550+ | locations | 8+ |

Three problems compound here.

1. **The homepage contradicts itself.** A visitor reads "500+ Students Supported" in the hero, scrolls one section, and reads "1000+ Students Supported". Both are on the same page today.
2. **150+ is attached to two different units.** `stats.ts` calls it villages. The client-feedback record calls it schools. One of the two is a transcription error, and nobody can tell which from inside the repository.
3. **The district count is not supported by the timeline.** Across all ten milestone entries, only nine distinct places are ever named: Chickaballapur, KGF, Kolar, Mandya, Mysore, H.D. Kote, MM Hills, Mulbagal, Pandavapura. Several of these are towns or hill ranges inside the same district. A defensible district count derived from the timeline is closer to five or six than to ten.

There is also a scope contradiction: the mission line says "children from rural areas **across India**", the hero stat says "**Across Karnataka**", and every single named location in the timeline is in Karnataka.

**Decision required.** Until this is settled, both scripts in `08` and `09` deliberately state **no cumulative student total**. They carry only the year-specific numbers that nothing in the repository contradicts: 1, 150, 10, 200, 300, 20, and 75 percent. This is a stronger film anyway. "Three hundred school bags in H.D. Kote" is concrete and unarguable; "1000+ students supported" invites a question the trust cannot currently answer.

---

### A2. The founding year is disputed inside the repository.

- [app/layout.tsx](../../website/app/layout.tsx) schema.org: `foundingDate: '2016'`
- Magazine: "Since 2016, we have been travelling to rural areas"
- [components/pages/DonorInviteContentPage.tsx](../../website/components/pages/DonorInviteContentPage.tsx), the founder's own donor letter: *"Along with my husband Mr. Manjunatha S. M we started this Trust in **2012** (registered **2016**)."*

**This is the premise of the entire film.** If the work began in 2012 and registration followed in 2016, then 2026 is the tenth year of the registered Trust and the fourteenth year of the work. That is a better story, not a worse one, but it must be told deliberately rather than tripped over.

Note also that the magazine's own front cover says "2016 - 2026" while its back cover says "2016-2025".

---

### A3. Milestone locations conflict between the data and the magazine.

| Year | [data/milestones.ts](../../website/data/milestones.ts) | Magazine |
|---|---|---|
| 2019 | KGF | Chickaballapur |
| 2020 | Chickaballapur, KGF | Chickaballapur |
| 2021 | KGF | Chickaballapur |

The magazine also adds narrative detail for 2018 to 2021 that exists nowhere in the data: "renewing scholarships for every continuing student", "personal home visits and parent interviews", "students from single-parent and daily-wage families", "fees were honoured for every enrolled child". These read as copy written to fill a spread for years with thin records. Plausible, possibly true, but unevidenced.

The scripts avoid naming a location for 2018 to 2021 and instead treat those years as one continuous stretch, which is both safer and better paced.

---

### A4. Three of the six listed partner NGOs appear to be template placeholders.

`partnerNGOs` in [data/websiteContent.ts](../../website/data/websiteContent.ts) lists:

1. "Rural Education Foundation", focus "Rural Education & Infrastructure", claims "scholarship programs in over 15 villages"
2. "Children Welfare Society", focus "Child Welfare & Development"
3. "Education for All Initiative", focus "Accessible Education"
4. Belaku Trust, Bangarpet
5. Soukhya Samrudhi Samsthe, Kolar
6. District Health & Family Welfare Department, Kolar

Entries 4, 5 and 6 carry a specific place, a specific focus, and appear in the print magazine's partner section. Entries 1, 2 and 3 carry generic names, generic prose, no location, no contact, no photograph, and **do not appear in the magazine's partner section at all**. The magazine instead names Nisarga Foundation, which is missing from the code.

Treat 1, 2 and 3 as unverified template content. They are excluded from both scripts. The "over 15 villages" figure attached to entry 1 is excluded with them.

---

### A5. Twenty first-person supporter quotes have no source document.

`websiteContent.ts` `supporters[].quote` carries lines such as *"Distance doesn't dilute purpose. From across the world, I've watched one scholarship at a time quietly rewrite a family's story."* attributed to a named, real donor.

The 28 entries in `testimonials` trace cleanly to `public/magazine/testimany with pic.docx`, with a per-image `extraction-manifest.json` recording which paragraph each portrait came from. **The 20 `quote` fields have no equivalent source anywhere in the repository.** They share a uniform, polished, comma-spliced cadence across twenty different people from twenty different backgrounds.

Attributing invented words to a named real person in a published film is defamatory in principle and embarrassing in practice. **Excluded from both scripts.** The 28 sourced testimonials are used instead.

---

### A6. The "Children's Voices" stories in the magazine are composites.

Pages 12 of the magazine carries "Meena's Story", "Raju's Story" and "Sunita's Story", including quoted dialogue such as *"A teacher," she said quietly.* The magazine labels the section honestly: *"Stories inspired by the real children we have met and supported. Names have been changed to protect privacy."*

In a printed magazine, with that label visible on the same page, this is a legitimate editorial device. In a documentary film, where the label cannot travel with a clip that gets shared, it is not. **Excluded.** Neither script uses a named child.

---

### A7. Stale documents that should not be quoted as current.

- `PROJECT_SUMMARY.md` describes a Vite / TanStack Router build that no longer exists, and statistics (550+, 8+ locations, 500+ bags) that were superseded by client feedback.
- `CLIENT_FEEDBACK_STATUS.md` is a change log from an earlier round. Its statistics section is useful only as evidence of what the client once corrected.
- `public/site.webmanifest` and `app/layout.tsx` still carry `theme_color: #15803d`, a green from a previous brand. The current brand is navy `#1c1c2e` and gold `#c9903e`.

---

## Part B · The five questions that must be answered first

These block the script lock. Everything else can be resolved during the edit.

> **Q1. What is the correct cumulative number of students LPET has supported, and what is the correct geographic figure and unit?**
> Your own materials currently say 500+, 550+ and 1000+ students in three places, and "150+" is labelled villages in one place and schools in another. We will put whichever figure you confirm on screen, or we will put none. Please also confirm whether the correct phrase is "across Karnataka" or "across India", since every location in your ten-year timeline is in Karnataka.

> **Q2. Did the Trust's work begin in 2012 and get registered in 2016, or did it begin in 2016?**
> Your donor letter says "we started this Trust in 2012 (registered 2016)". Everything else says 2016. This decides whether the film says "ten years" or "ten years since registration, fourteen years of this work". We can tell either story well, but we need to know which is true.

> **Q3. May we name Mr. Kamal Singh Negi and Mr. Dinesh Upadhyay as the Union Ministers who presented the Bharat Shiksha Ratan Award, and may we say the award was one of 25?**
> Neither detail appears on the certificate, and there are no ceremony photographs. Our recommendation is to state only what the certificate itself records: the award name, the recipient, the awarding body, the National Summit, 19 December 2025, New Delhi. If you have a ceremony photograph or programme, we will happily include more.

> **Q4. Which children may appear on screen, and do you hold a signed parent or guardian release for each of them?**
> Every photograph in the film shows identifiable minors. Several were taken at tribal schools, at HIV-support sessions, and during scholarship interviews with families present. We need, in writing: which photographs are cleared for public use, whether the schools have given permission, and whether any specific child must be excluded. Without this the film cannot be published anywhere. This is the longest lead-time item in the project.

> **Q5. What happened in 2026, and what would you like the film to promise for the next decade?**
> Your timeline stops at 2025 but the anniversary is 2026. We have your plan to bring all the children under your care to Bengaluru for the celebration. Is there anything else from 2026 that belongs in the film, and is there a specific commitment for the years ahead that you want stated on camera?

---

## Part C · Second-tier questions, needed before picture lock

**Numbers and facts**
6. In 2019, 2020 and 2021, was the work in Chickaballapur, in KGF, or in both? Your data file and your magazine disagree.
7. Is the Trust registered under Section 80G? Your magazine back cover says so; nothing else does. If yes, please supply the certificate and the current validity date, since we would be publishing a tax claim.
8. In 2021 a specific number was deliberately removed from the milestone at your request. Should the film say anything numerical about 2021, or leave it as a year of quiet continuity?
9. Roughly how many children are under LPET's care right now, in 2026? A current figure is often more compelling than a cumulative one, and it is easier to stand behind.

**People and names**
10. Please confirm the exact spelling and honorific for the founder. Your materials use "Charulatha M. R.", "Charulatha. M. R", "Charulata ji" and "Charu".
11. Please confirm the same for the second trustee: "S.M. MANJUNATHA", "S. M. Manjunatha", "Manjunath ji", "Mr. Manjunatha S. M".
12. Your donor letter describes the two trustees as husband and wife. May we say so on screen, or would you prefer we do not?
13. Your team list has 27 first names with no roles or surnames. For an end credit we need full names, correct spellings, and permission from each person to be named.
14. Your donor list has near-duplicates: "Raman ChandraShekar" and "Raman Chandra Shekar", "Swapna Sridhar Murthy" and "Swapna Sreedhar Murthy", "Veena" twice, "Ganesh" three times with different cities. Please supply one clean, de-duplicated list for the credit roll.
15. The 20 short quotes attached to volunteers and donors on the website have no source we can find. Did each named person actually say those words? If not, we will not use them, and we suggest removing them from the website too.

**Partners and third parties**
16. Are "Rural Education Foundation", "Children Welfare Society" and "Education for All Initiative" real partners of LPET? They appear in your website code but not in your magazine, and they carry no location or contact. We have excluded them.
17. Nisarga Foundation appears in your magazine and in your 2025 milestone but not in your website's partner list. Please confirm the correct name and whether we may use their logo.
18. The 2022 library poster names "Grameena Mahaila Okutta (Part of Gram Vikas NGO)". Is the correct spelling "Grameena Mahila Okkuta"? Are they a continuing partner?
19. May we show the name and building of DMS Jnana Kuteera School? Do we have the school's permission?
20. May we display the emblem or name of the District Health and Family Welfare Department, Kolar? A government mark needs departmental clearance.

**Media and evidence**
21. The Udayavani clipping of 19 June 2024 names the school in Muttalapete, Mulbagal, but the scan is not fully legible. What is the school's exact name? We would like to use this clipping on screen, since it is the only independent press verification we have.
22. Do you have permission from Udayavani to reproduce the clipping in a published film?
23. Do you have any photographs or video from the award ceremony in New Delhi? Your website code has empty placeholders for both.
24. Do you have the original, full-resolution photographs from 2016 to 2021? What is in the repository is mostly extracted from a slide deck at 960x540, which is below broadcast quality.
25. Do you have a transparent-background or vector version of the logo? Every copy we have sits on a solid black or purple rectangle.

**Event and forward-looking**
26. Has the chief guest for the anniversary event been confirmed? The film must not name or imply a guest who has not accepted.
27. When and where is the event, and by what date do you need the final file?
28. Should the film end with a donation call to action, a "nominate a child" call to action, or simply a thank you? Our recommendation is "nominate a child" first and the website second, since it is the least transactional and is genuinely how children reach you.

---

## Part D · Sign-off record

| # | Question | Decision | Decided by | Date |
|---|---|---|---|---|
| 1 | Cumulative students and geography | | | |
| 2 | Founding year, 2012 or 2016 | | | |
| 3 | Award ministers and "one of 25" | | | |
| 4 | Children cleared to appear, releases held | | | |
| 5 | 2026 content and next-decade commitment | | | |
| 6-28 | See Part C | | | |

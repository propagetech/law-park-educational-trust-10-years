'use client'

/**
 * A4 letter: Invitation to Mrs. Sudha Murthy
 * For PDF save and print on letterhead. Use browser Print → Save as PDF.
 */

export default function SudhaMurthyInviteLetter() {
  return (
    <div className="sudha-invite-letter a4-letter-page w-full max-w-[210mm] mx-auto bg-white text-gray-900 print:max-w-none print:shadow-none">
      {/* Space for standard letterhead: header area at top, footer area at bottom */}
      <div className="px-[16mm] pt-[10mm] pb-[10mm] print:pt-[35mm] print:pb-[30mm]">
        {/* Date line — right-aligned, blank for filling */}
        <p className="text-right text-[10pt] font-serif mb-2">
          ______________ 2026
        </p>

        {/* To / Addressee */}
        <div className="mb-2 font-serif text-[10pt] leading-tight">
          <p className="mb-0">To</p>
          <p className="font-semibold mt-1">Mrs. Sudha Murthy</p>
          <p className="text-gray-700 leading-tight">Hon&apos;ble Member of Parliament (Rajya Sabha)</p>
          <p className="text-gray-700 leading-tight">Padma Bhushan</p>
          <p className="leading-tight">Infosys</p>
          <p className="leading-tight">Bengaluru</p>
        </div>

        {/* Subject */}
        <p className="font-serif text-[10pt] mb-1.5">
          <span className="font-semibold">SUB :</span> Invitation to Law Park Educational Trust&apos;s 10-Year Celebration &amp; Interaction Session with Children from Rural and Tribal Areas
        </p>

        {/* Salutation */}
        <p className="font-serif text-[10pt] mb-1.5">Respected Madam,</p>

        {/* Body — compact so it fits one A4 */}
        <div className="font-serif text-[9.5pt] leading-[1.4] space-y-1.5 text-justify">
          <p>
            With all respect I introduce myself as Charulatha. M. R, Founder of Law Park Educational Trust, Bengaluru. We as a team are helping children across India for their education. We have been helping children residing in the rural sector, children of HIV patients, children of acid-attack victims, tribal children and many such children. We help these children by paying their school fees so no child under our care is left unschooled.
          </p>
          <p>
            With tribal children, we stay with the children for a few days and we teach and learn many activities and finally distribute school essentials to these children.
          </p>
          <p>
            We now want to create an opportunity for these little ones to meet and interact with you. Not everybody gets a chance to meet you, but we are putting our best efforts to organize an event where children from several districts come together and have their most treasured, memorable time with you. This will be their life achievement.
          </p>
          <p>
            Thus on ______________ we would like to invite you to our 10 years of our noble service in the field of education for mankind and to organize an interaction session with children from rural and tribal areas, children of HIV patients and many children longing to meet you.
          </p>
          <p>
            We will be immensely happy to receive you and our goal achieved in creating this event where little ones with extraordinary intelligence interact with you.
          </p>
        </div>

        {/* Closing */}
        <p className="font-serif text-[10pt] mt-2 mb-0">Thank You</p>
        <p className="font-serif text-[10pt] mb-0.5">Regards</p>
        <p className="font-serif text-[10pt] font-semibold">Charulatha. M.R.</p>
        <p className="font-serif text-[9pt] text-gray-700 leading-tight">
          Founder and also Representing our entire Law Park Educational Trust&apos;s Team.
        </p>
        <p className="font-serif text-[9pt] mt-0.5">+91 99456 65379</p>

        {/* Footer block — for when printed on letterhead */}
        <div className="mt-4 pt-2 border-t border-gray-300 font-serif text-[8.5pt] text-gray-600 leading-tight">
          <p className="mb-0.5">No.19/A-1, 14th B Cross, 2nd A Main, 6th Sector HSR Layout, Bengaluru 560102</p>
          <p className="mb-0">Contact +91 99456 65379 &nbsp;|&nbsp; e-mail: lawparktrust@gmail.com</p>
        </div>
      </div>
    </div>
  )
}

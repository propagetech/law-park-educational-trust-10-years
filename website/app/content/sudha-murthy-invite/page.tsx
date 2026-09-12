import type { Metadata } from 'next'
import SudhaMurthyInviteLetter from '@/components/pages/SudhaMurthyInviteLetter'

export const metadata: Metadata = {
  title: 'Invitation Letter – Mrs. Sudha Murthy',
  description: 'Formal invitation letter to Mrs. Sudha Murthy for Law Park Educational Trust 10-year celebration. Save as PDF or print on letterhead.',
  openGraph: {
    title: 'Invitation Letter | Law Park Educational Trust',
    description: 'Formal invitation to Mrs. Sudha Murthy for the 10-year celebration event.',
  },
}

export default function SudhaMurthyInvitePage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 print:py-0 print:bg-white">
      <div className="container-custom max-w-[210mm] print:max-w-none">
        {/* On-screen only: instructions and letter */}
        <div className="mb-6 rounded-lg bg-primary-800 text-white px-4 py-3 text-sm print:hidden">
          <p className="font-semibold mb-1">Save as PDF / Print on letterhead</p>
          <p className="opacity-95">
            Use your browser: <strong>File → Print</strong> (or Ctrl+P / Cmd+P), then choose &quot;Save as PDF&quot; or print on your letterhead paper. Header and footer of the site will be hidden when printing.
          </p>
        </div>
        <SudhaMurthyInviteLetter />
      </div>
    </div>
  )
}

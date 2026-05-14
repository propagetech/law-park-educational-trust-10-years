'use client'

interface IllustrationProps {
  name: string
  color?: string
  className?: string
}

// unDraw illustrations with customizable colors
// Using unDraw illustrations - download from https://undraw.co with custom color (#16a34a)
// and place them in public/illustrations/ folder
export function Illustration({ name, className = '' }: IllustrationProps) {
  // In Next.js, files in public folder are served from root
  const localPath = `/illustrations/${name}.svg`
  
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export; illustrations from public */}
      <img
      src={localPath}
      alt=""
      className={className}
      loading="lazy"
      aria-hidden="true"
    />
    </>
  )
}

// Pre-configured illustrations for common use cases
// Using relevant unDraw illustration names for education/charity themes
export function EducationIllustration({ className = '' }: { className?: string }) {
  return (
    <Illustration
      name="educator"
      color="16a34a"
      className={className}
    />
  )
}

export function CommunityIllustration({ className = '' }: { className?: string }) {
  return (
    <Illustration
      name="community"
      color="16a34a"
      className={className}
    />
  )
}

export function ImpactIllustration({ className = '' }: { className?: string }) {
  return (
    <Illustration
      name="growth"
      color="16a34a"
      className={className}
    />
  )
}

export function VolunteerIllustration({ className = '' }: { className?: string }) {
  return (
    <Illustration
      name="team"
      color="ffffff"
      className={className}
    />
  )
}

export function DonationIllustration({ className = '' }: { className?: string }) {
  return (
    <Illustration
      name="donation"
      color="16a34a"
      className={className}
    />
  )
}

export function ScholarshipIllustration({ className = '' }: { className?: string }) {
  return (
    <Illustration
      name="graduation"
      color="16a34a"
      className={className}
    />
  )
}

export function ChildrenIllustration({ className = '' }: { className?: string }) {
  return (
    <Illustration
      name="children"
      color="16a34a"
      className={className}
    />
  )
}

export function BooksIllustration({ className = '' }: { className?: string }) {
  return (
    <Illustration
      name="books"
      color="16a34a"
      className={className}
    />
  )
}

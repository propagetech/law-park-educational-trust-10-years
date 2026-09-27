'use client'

import { usePathname } from 'next/navigation'

// Routes that run as a standalone app (installed PWA) skip the site chrome.
const APP_ROUTES = ['/event-duties']

function HideOnApp({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || ''
  if (APP_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`))) return null
  return <>{children}</>
}

export default HideOnApp

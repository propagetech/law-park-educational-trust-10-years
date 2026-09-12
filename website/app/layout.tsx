import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SkipLink from '@/components/shared/SkipLink'
import WhatsAppButton from '@/components/shared/WhatsAppButton'

export const metadata: Metadata = {
  metadataBase: new URL('https://journey.lawparkeducationaltrust.org'),
  title: {
    default: 'Law Park Educational Trust - 10 Years of Transforming Lives',
    template: '%s | Law Park Educational Trust',
  },
  description: 'Law Park Educational Trust helps children from rural areas across India get their right to education through funded scholarships. Join us in making a difference.',
  keywords: ['education', 'scholarships', 'rural education', 'India', 'NGO', 'educational trust', 'children education', 'charity'],
  authors: [{ name: 'Law Park Educational Trust' }],
  robots: {
    index: true,
    follow: true,
  },
  referrer: 'strict-origin-when-cross-origin',
  openGraph: {
    type: 'website',
    url: 'https://journey.lawparkeducationaltrust.org/',
    title: 'Law Park Educational Trust - 10 Years of Transforming Lives',
    description: 'Law Park Educational Trust helps children from rural areas across India get their right to education through funded scholarships. Join us in making a difference.',
    siteName: 'Law Park Educational Trust',
    locale: 'en_US',
    images: [
      {
        url: '/images/slide_03_Picture_1_00.webp',
        width: 960,
        height: 540,
        alt: 'Law Park Educational Trust - 10 Years of Transforming Lives',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Law Park Educational Trust - 10 Years of Transforming Lives',
    description: 'Law Park Educational Trust helps children from rural areas across India get their right to education through funded scholarships.',
    images: ['/images/slide_03_Picture_1_00.webp'],
  },
  alternates: {
    canonical: 'https://journey.lawparkeducationaltrust.org/',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
}

// Organization Schema.org structured data
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Law Park Educational Trust',
  url: 'https://journey.lawparkeducationaltrust.org/',
  logo: 'https://journey.lawparkeducationaltrust.org/logo.webp',
  description: 'Law Park Educational Trust helps children from rural areas across India get their right to education through funded scholarships.',
  foundingDate: '2016',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'lawparktrust@gmail.com',
    telephone: '+91-9945-665-379',
    address: {
      '@type': 'PostalAddress',
      streetAddress: "No 19/A-1, 14th 'B' Cross, 2nd A Main Rd, 6th Sector, HSR Layout",
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      postalCode: '560102',
      addressCountry: 'IN',
    },
  },
  sameAs: [],
}

// WebSite Schema.org structured data
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Law Park Educational Trust',
  url: 'https://journey.lawparkeducationaltrust.org/',
  description: '10 Years of Transforming Lives - Helping children from rural areas across India get their right to education through funded scholarships.',
}

// WebPage Schema.org structured data
const webpageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Law Park Educational Trust - 10 Years of Transforming Lives',
  description: 'Law Park Educational Trust helps children from rural areas across India get their right to education through funded scholarships.',
  url: 'https://journey.lawparkeducationaltrust.org/',
  inLanguage: 'en-US',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Law Park Educational Trust',
    url: 'https://journey.lawparkeducationaltrust.org/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#15803d" />
        <meta name="msapplication-navbutton-color" content="#15803d" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preload" href="/images/steel-plate-and-glass-distributed-to-these-children.webp" as="image" type="image/webp" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
        />
      </head>
      <body>
        <SkipLink />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <WhatsAppButton />
      </body>
    </html>
  )
}

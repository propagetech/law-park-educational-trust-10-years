'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  function scrollToSection(id: string) {
    if (!isHome) return
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  function closeMenuAndScroll(id: string) {
    setIsMenuOpen(false)
    scrollToSection(id)
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <img
              src="/images/logo-copy.png"
              alt="Law Park Educational Trust"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              href="/"
              className="text-gray-900 transition-colors hover:text-primary-600"
            >
              Home
            </Link>
            {isHome ? (
              <>
                <a
                  href="#impact"
                  className="text-gray-900 transition-colors hover:text-primary-600"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('impact')
                  }}
                >
                  Impact
                </a>
                <a
                  href="#activities"
                  className="text-gray-900 transition-colors hover:text-primary-600"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('activities')
                  }}
                >
                  Activities
                </a>
                <a
                  href="#process"
                  className="text-gray-900 transition-colors hover:text-primary-600"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('process')
                  }}
                >
                  Process
                </a>
                <a
                  href="#journey"
                  className="text-gray-900 transition-colors hover:text-primary-600"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('journey')
                  }}
                >
                  Journey
                </a>
                <a
                  href="#gallery"
                  className="text-gray-900 transition-colors hover:text-primary-600"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('gallery')
                  }}
                >
                  Gallery
                </a>
                <a
                  href="#trustees"
                  className="text-gray-900 transition-colors hover:text-primary-600"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('trustees')
                  }}
                >
                  Trustees
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-900 transition-colors hover:text-primary-600"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('testimonials')
                  }}
                >
                  Testimonials
                </a>
                <Link
                  href="/content"
                  className="text-gray-900 transition-colors hover:text-primary-600"
                >
                  Content
                </Link>
                <a
                  href="#get-involved"
                  className="rounded-md bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('get-involved')
                  }}
                >
                  Get Involved
                </a>
              </>
            ) : (
              <>
                <Link href="/#impact" className="text-gray-900 transition-colors hover:text-primary-600">
                  Impact
                </Link>
                <Link href="/#activities" className="text-gray-900 transition-colors hover:text-primary-600">
                  Activities
                </Link>
                <Link href="/#process" className="text-gray-900 transition-colors hover:text-primary-600">
                  Process
                </Link>
                <Link href="/#journey" className="text-gray-900 transition-colors hover:text-primary-600">
                  Journey
                </Link>
                <Link href="/#gallery" className="text-gray-900 transition-colors hover:text-primary-600">
                  Gallery
                </Link>
                <Link href="/#trustees" className="text-gray-900 transition-colors hover:text-primary-600">
                  Trustees
                </Link>
                <Link href="/#testimonials" className="text-gray-900 transition-colors hover:text-primary-600">
                  Testimonials
                </Link>
                <Link
                  href="/content"
                  className="text-gray-900 transition-colors hover:text-primary-600"
                >
                  Content
                </Link>
                <Link
                  href="/#get-involved"
                  className="rounded-md bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
                >
                  Get Involved
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden text-gray-900"
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              <Link
                href="/"
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {isHome ? (
                <>
                  <a
                    href="#impact"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                    onClick={(e) => {
                      e.preventDefault()
                      closeMenuAndScroll('impact')
                    }}
                  >
                    Impact
                  </a>
                  <a
                    href="#activities"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                    onClick={(e) => {
                      e.preventDefault()
                      closeMenuAndScroll('activities')
                    }}
                  >
                    Activities
                  </a>
                  <a
                    href="#process"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                    onClick={(e) => {
                      e.preventDefault()
                      closeMenuAndScroll('process')
                    }}
                  >
                    Process
                  </a>
                  <a
                    href="#journey"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                    onClick={(e) => {
                      e.preventDefault()
                      closeMenuAndScroll('journey')
                    }}
                  >
                    Journey
                  </a>
                  <a
                    href="#gallery"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                    onClick={(e) => {
                      e.preventDefault()
                      closeMenuAndScroll('gallery')
                    }}
                  >
                    Gallery
                  </a>
                  <a
                    href="#trustees"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                    onClick={(e) => {
                      e.preventDefault()
                      closeMenuAndScroll('trustees')
                    }}
                  >
                    Trustees
                  </a>
                  <a
                    href="#testimonials"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                    onClick={(e) => {
                      e.preventDefault()
                      closeMenuAndScroll('testimonials')
                    }}
                  >
                    Testimonials
                  </a>
                  <Link
                    href="/content"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Content
                  </Link>
                  <a
                    href="#get-involved"
                    className="block rounded-md bg-primary-600 px-3 py-2 text-base font-medium text-white hover:bg-primary-700"
                    onClick={(e) => {
                      e.preventDefault()
                      closeMenuAndScroll('get-involved')
                    }}
                  >
                    Get Involved
                  </a>
                </>
              ) : (
                <>
                  <Link
                    href="/#impact"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Impact
                  </Link>
                  <Link
                    href="/#activities"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Activities
                  </Link>
                  <Link
                    href="/#process"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Process
                  </Link>
                  <Link
                    href="/#journey"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Journey
                  </Link>
                  <Link
                    href="/#gallery"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Gallery
                  </Link>
                  <Link
                    href="/#trustees"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Trustees
                  </Link>
                  <Link
                    href="/#testimonials"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Testimonials
                  </Link>
                  <Link
                    href="/content"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Content
                  </Link>
                  <Link
                    href="/#get-involved"
                    className="block rounded-md bg-primary-600 px-3 py-2 text-base font-medium text-white hover:bg-primary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Involved
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#e0b06a]">Law Park Educational Trust</h3>
            <p className="text-gray-400">
              Helping children from rural areas across India get their right to education through funded scholarships.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#e0b06a]">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#journey" className="hover:text-white transition-colors">
                  Our Journey
                </a>
              </li>
              <li>
                <a href="#activities" className="hover:text-white transition-colors">
                  Activities
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#get-involved" className="hover:text-white transition-colors">
                  Get Involved
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#e0b06a]">Contact</h3>
            <div className="space-y-3 text-gray-400">
              <div>
                <p className="font-semibold text-white mb-1">Address</p>
                <p>
                  No 19/A-1, 14th &apos;B&apos; Cross, 2nd A Main Rd, 6th Sector, HSR Layout, Bengaluru, Karnataka 560102
                </p>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Phone</p>
                <a href="tel:+91945665379" className="hover:text-white transition-colors">
                  +91-9945-665-379
                </a>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Email</p>
                <a href="mailto:lawparktrust@gmail.com" className="hover:text-white transition-colors">
                  lawparktrust@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Law Park Educational Trust. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

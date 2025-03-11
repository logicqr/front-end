import React from 'react'

export default function Footer() {
  return (
    <footer className="text-white relative bg-cover bg-center bg-gradient-to-r from-gray-900 to-black">
      <div className="container mx-auto py-12 px-4">
        {/* Brand Name */}
        <h2 className="text-3xl text-yellow-500 font-bold text-center mb-8">LogicQR</h2>

        {/* Navigation Links */}
        <div className="flex flex-row justify-center items-center gap-4 md:gap-8 mb-8">
          <a href="/" className="text-base md:text-lg hover:text-yellow-500 transition-colors duration-300">Home</a>
          <a href="/docs" className="text-base md:text-lg hover:text-yellow-500 transition-colors duration-300">Documents</a>
          <a href="/features" className="text-base md:text-lg hover:text-yellow-500 transition-colors duration-300">Features</a>
        </div>

        {/* Terms and Conditions */}
        <div className="text-center mb-8">
          <a href="/terms-condition" className=" text-gray-400 hover:text-yellow-500 text-sm transition-colors duration-300">
            Terms and Conditions
          </a>

        </div>

        <hr className="border-gray-700 mx-auto w-3/4 mb-8" />

        {/* <div className='space-y-1'>
          <div className="text-center  ">
            <p className="text-gray-400 text-sm">💬 Help & Support</p>
          </div>
          <div className="text-center flex flex-col  space-x-3">
          <div>
            <a className="text-gray-400 hover:text-yellow-500 text-sm transition-colors duration-300">
              📞 +91 91501 82615
            </a>
            </div>
            <div>
            <a className="text-gray-400 hover:text-yellow-500 text-sm transition-colors duration-300">
              ✉️ thelogicqr@gmail.com
            </a>
            </div>
            
            <div>
            <a className="text-gray-400 hover:text-yellow-500 text-sm transition-colors duration-300">
            📍 Pandiyan Street, Velachery, Chennai-600042
            </a>
            </div>
           
          </div>

        </div> */}
        {/* Copyright */}
        <p className="text-center text-gray-400 text-sm pt-2">
          © {new Date().getFullYear()} LogicQR. All rights reserved.<br className="md:hidden" />
          <span className="md:mx-2">Developed with</span>
          <span className="text-red-500 mx-1">❤</span>
          <span className="md:mx-2">by</span>
          <a href="https://webzspot.com" className="text-yellow-500 hover:underline ml-1">
            Webzspot Technologies
          </a>
        </p>
      </div>
    </footer>
  )
}
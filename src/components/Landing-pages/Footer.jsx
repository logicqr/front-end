import React from 'react'

export default function Footer() {
  return (
    <footer className="text-white relative bg-cover bg-center bg-gradient-to-r from-gray-900 to-black">
      <div className="container mx-auto py-12 px-4">
        {/* Brand Name */}
        <h2 className="text-3xl text-yellow-500 font-bold text-center mb-8">LogicQR</h2>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
          <a href="/" className="text-lg hover:text-yellow-500 transition-colors duration-300">Home</a>
          <a href="/docs" className="text-lg hover:text-yellow-500 transition-colors duration-300">Documents</a>
          <a href="/features" className="text-lg hover:text-yellow-500 transition-colors duration-300">Features</a>
        </div>

        {/* Terms and Conditions */}
        <div className="text-center mb-8">
          <a href="/terms-condition" className=" text-gray-400 hover:text-yellow-500 text-sm transition-colors duration-300">
            Terms and Conditions
          </a>
        </div>

        <hr className="border-gray-700 mx-auto w-3/4 mb-8" />

        {/* Copyright */}
        <p className="text-center text-gray-400 text-sm">
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
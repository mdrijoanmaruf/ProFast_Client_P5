import React from 'react'
import Logo from '../Logo/Logo'
import { FaLinkedinIn, FaTwitter, FaFacebookF, FaGithub, FaInstagram } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'

const Footer = () => {
  return (
    <footer className="bg-[#0B0B0B] rounded-2xl text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Logo and Description */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to
            business shipments — we deliver on time, every time.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <a href="/services" className="text-gray-300 hover:text-white transition-colors duration-200">
            Services
          </a>
          <a href="/coverage" className="text-gray-300 hover:text-white transition-colors duration-200">
            Coverage
          </a>
          <a href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
            About Us
          </a>
          <a href="/pricing" className="text-gray-300 hover:text-white transition-colors duration-200">
            Pricing
          </a>
          <a href="/blog" className="text-gray-300 hover:text-white transition-colors duration-200">
            Blog
          </a>
          <a href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">
            Contact
          </a>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-4 mb-8">
          <a
            href="https://www.linkedin.com/in/mdrijoanmaruf/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
          >
            <FaLinkedinIn className="w-5 h-5 text-white" />
          </a>

          <a
            href="https://x.com/rijianmaruf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
          >
            <FaTwitter className="w-5 h-5 text-white" />
          </a>

          <a
            href="https://www.facebook.com/md.rijoanmaruf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
          >
            <FaFacebookF className="w-5 h-5 text-white" />
          </a>

          <a
            href="https://github.com/mdrijoanmaruf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
          >
            <FaGithub className="w-5 h-5 text-white" />
          </a>

          <a
            href="https://www.instagram.com/rijoanmaruf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors duration-200"
          >
            <FaInstagram className="w-5 h-5 text-white" />
          </a>

          <a
            href="https://leetcode.com/u/mdrijoanmaruf/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center hover:bg-yellow-700 transition-colors duration-200"
          >
            <SiLeetcode className="w-5 h-5 text-white" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            © 2025 ProFast. All rights reserved. | Developed by <a className='underline' href="https://rijoan.com">Rijoan Maruf</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
import React from 'react';
import Link from 'next/link';

export default function WhatsAppButton() {
  return (
    <div className="fixed z-50 bottom-[50vh]">
      <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.8/css/line.css" />
      <Link
        href="https://wa.me/28700199"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-500 rounded-e-full shadow-lg hover:bg-green-600 transition-all duration-300"
        aria-label="Contact us on WhatsApp"
      >
        <i className="uil uil-whatsapp text-2xl sm:text-3xl text-white"></i>
      </Link>
    </div>
  );
}
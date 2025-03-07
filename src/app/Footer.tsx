"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faInstagram,
  faTiktok,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import { loadTranslations } from '../utils/loadTranslations';

export default function Footer() {
  const [translations, setTranslations] = useState<{
    footer: {
      follow_us: string;
      contact_us: string;
      customer_service: string;
      customer_number:string;
      email: string;
      location: string;
      address: string;
      copyright: string;
      developed_by: string;
    };
  }>({
    footer: {
      follow_us: "Suivez-nous",
      contact_us: "Contactez-nous",
      customer_service: "Service client:",
      customer_number:"71 865 319  / 27 870 016",
      email: "Email:",
      location:"km 13 av Fatouma Bourguiba, La Soukra 2036, en face UTC",
      address: "Adresse:",
      copyright: "© 2025 Fildair Freres. Tous droits réservés.",
      developed_by: "Développé par Fildair Freres",
    },
  });

  useEffect(() => {
    // Detect the user's browser language
    const userLanguage = navigator.language || "en";
    const loadedTranslations = loadTranslations(userLanguage);
    setTranslations(loadedTranslations);
  }, []);



  return (
    <footer className="font-sans pt-16 pb-10 space-y-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
          <div className="text-left">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              {translations.footer.follow_us}
            </h2>
            <ul className="space-y-3">
              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.facebook.com/share/18cy9Avd15/?mibextid=wwXIfr"
                  className="text-gray-600 hover:text-blue-500 transition flex items-center space-x-2"
                  aria-label="Suivez-nous sur Facebook"
                >
                  <FontAwesomeIcon icon={faFacebook} className="w-5 h-5" />
                  <span>Facebook</span>
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.instagram.com/fildair_bilel_abassi/"
                  className="text-gray-600 hover:text-blue-500 transition flex items-center space-x-2"
                  aria-label="Suivez-nous sur Instagram"
                >
                  <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
                  <span>Instagram</span>
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.tiktok.com/@fildairbilelabass"
                  className="text-gray-600 hover:text-blue-500 transition flex items-center space-x-2"
                  aria-label="Suivez-nous sur TikTok"
                >
                  <FontAwesomeIcon icon={faTiktok} className="w-5 h-5" />
                  <span>TikTok</span>
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://wa.me/28700199"
                  className="text-gray-600 hover:text-blue-500 transition flex items-center space-x-2"
                  aria-label="Contactez-nous sur WhatsApp"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
                  <span>WhatsApp</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-left">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              {translations.footer.contact_us}
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li>
                <span className="font-medium">
                  {translations.footer.customer_service}
                </span>{" "}
                <span className="hover:text-blue-500 transition">
                  {translations.footer.customer_number}
                </span>
              </li>
              <li>
                <span className="font-medium">{translations.footer.email}</span>{" "}
                <a
                  href="mailto:fildairfreres@gmail.com"
                  className="hover:text-blue-500 transition"
                >
                  fildairfreres@gmail.com
                </a>
              </li>
              <li>
                <span className="font-medium">{translations.footer.address}</span> {translations.footer.location}
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-300 mt-10" />

        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0 mt-6">
          <span className="text-gray-500">
            {translations.footer.copyright}
          </span>
          <span className="text-gray-500">
            {translations.footer.developed_by}
          </span>
        </div>
      </div>
    </footer>
  );
}
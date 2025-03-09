"use client";
import Link from 'next/link';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faInstagram,
  faTiktok,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';

export default function Footer() {

  return (
    <footer className="font-sans pt-16 pb-10 space-y-10 bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
          <div className="text-left">
            <h2 className="text-xl font-semibold text-accent mb-4">
              Suivez-nous
            </h2>
            <ul className="space-y-3">
              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.facebook.com/share/18cy9Avd15/?mibextid=wwXIfr"
                  className="text-gray-600 hover:text-accent transition flex items-center space-x-2"
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
                  className="text-gray-600 hover:text-accent transition flex items-center space-x-2"
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
                  className="text-gray-600 hover:text-accent transition flex items-center space-x-2"
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
                  className="text-gray-600 hover:text-accent transition flex items-center space-x-2"
                  aria-label="Contactez-nous sur WhatsApp"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
                  <span>WhatsApp</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-left">
            <h2 className="text-xl font-semibold text-accent mb-4">
              Contactez-nous
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li>
                <span className="font-medium">Service client:</span>{" "}
                <span className="hover:text-accent transition">
                  71 865 319 / 27 870 016
                </span>
              </li>
              <li>
                <span className="font-medium">Email:</span>{" "}
                <a
                  href="mailto:fildairfreres@gmail.com"
                  className="hover:text-accent transition"
                >
                  fildairfreres@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-300 mt-10" />

        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0 mt-6">
          <span className="text-gray-500">
            © 2025 Cave Aux Merveilles. Tous droits réservés.
          </span>
          <span className="text-gray-500">
            Développé par Cave Aux Merveilles
          </span>
        </div>
      </div>
    </footer>
  );
}
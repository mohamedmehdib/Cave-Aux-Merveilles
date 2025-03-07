"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { loadTranslations } from "../utils/loadTranslations";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [translations, setTranslations] = useState<{
    navbar: {
      home: string;
      services: string;
      custom_pool_design: string;
      pool_maintenance: string;
      wholesale_sales: string;
      heating_cooling: string;
      projects: string;
      contact: string;
      account: string;
    };
  }>({
    navbar: {
      home: "Accueil",
      services: "Services",
      custom_pool_design: "Conception de piscine sur mesure",
      pool_maintenance: "Entretien Piscine & SAV",
      wholesale_sales: "Vente en gros matériel Piscines & Mosaïque",
      heating_cooling: "Chauffage & Climatisation",
      projects: "Projets",
      contact: "Contact",
      account: "Compte",
    },
  });

  useEffect(() => {
    const userLanguage = navigator.language || "fr";
    const loadedTranslations = loadTranslations(userLanguage);
    setTranslations(loadedTranslations);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <nav
      className={`bg-[#274e9d] z-20 duration-500 fixed w-full flex justify-between items-center ${
        isScrolled ? "h-20 shadow-lg px-4 md:px-10 lg:px-12" : "h-24 px-3 md:px-6 lg:px-16"
      } transition-all`}
    >
      <Link href="/" className="w-16">
        <Image src="/logo.png" alt="Logo" width={500} height={500} />
      </Link>
      <button
        onClick={toggleMenu}
        className="md:hidden text-white focus:outline-none"
      >
        {isMenuOpen ? (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        )}
      </button>
      <ul className="hidden md:flex space-x-8 text-lg text-white">
        <li>
          <button
            onClick={() => scrollToSection("accueil")}
            className="hover:text-indigo-300 transition-colors"
          >
            {translations.navbar.home}
          </button>
        </li>
        <li className="relative group">
          <button
            onClick={() => scrollToSection("services")}
            className="hover:text-indigo-300 transition-colors"
          >
            {translations.navbar.services}
          </button>
          <ul className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-[#274e9d] shadow-lg rounded-lg mt-2 py-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <li>
              <Link
                href="/Conception-de-piscine-sur-mesure"
                className="block w-full text-left px-4 py-2 hover:bg-[#305eb8]"
              >
                {translations.navbar.custom_pool_design}
              </Link>
            </li>
            <li>
              <Link
                href="/Entretien-Piscine-&-SAV"
                className="block w-full text-left px-4 py-2 hover:bg-[#305eb8]"
              >
                {translations.navbar.pool_maintenance}
              </Link>
            </li>
            <li>
              <Link
                href="/Vente-en-gros-materiel-Piscines-&-Mosaique"
                className="block w-full text-left px-4 py-2 hover:bg-[#305eb8]"
              >
                {translations.navbar.wholesale_sales}
              </Link>
            </li>
            <li>
              <Link
                href="/Chauffage-&-climatisation"
                className="block w-full text-left px-4 py-2 hover:bg-[#305eb8]"
              >
                {translations.navbar.heating_cooling}
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <button
            onClick={() => scrollToSection("projects")}
            className="hover:text-indigo-300 transition-colors"
          >
            {translations.navbar.projects}
          </button>
        </li>
        <li>
          <button
            onClick={() => scrollToSection("contact")}
            className="hover:text-indigo-300 transition-colors"
          >
            {translations.navbar.contact}
          </button>
        </li>
      </ul>
      <Link
        href="/Account"
        className="hidden md:block bg-white text-[#274e9d] rounded-lg text-lg font-medium px-4 py-2 border-2 border-white hover:bg-[#274e9d] hover:text-white transition-colors"
      >
        {translations.navbar.account}
      </Link>
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-[#274e9d] shadow-lg overflow-hidden transition-all duration-500 ${
          isMenuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col items-center space-y-4 py-4 text-white">
          <li>
            <button
              onClick={() => scrollToSection("accueil")}
              className="hover:text-indigo-300 transition-colors"
            >
              {translations.navbar.home}
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("services")}
              className="hover:text-indigo-300 transition-colors"
            >
              {translations.navbar.services}
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("projects")}
              className="hover:text-indigo-300 transition-colors"
            >
              {translations.navbar.projects}
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("contact")}
              className="hover:text-indigo-300 transition-colors"
            >
              {translations.navbar.contact}
            </button>
          </li>
          <li>
            <Link
              href="/Account"
              className="bg-white text-[#274e9d] rounded-lg text-lg font-medium px-4 py-2"
            >
              {translations.navbar.account}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
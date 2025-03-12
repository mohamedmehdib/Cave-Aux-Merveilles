"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const menuItems = [
  { id: "accueil", label: "Categorie 1" },
  {
    id: "services",
    label: "Categorie 2",
    dropdown: [
      { href: "/", label: "Sous categorie 1" },
      { href: "/", label: "Sous categorie 2" },
      { href: "/", label: "Sous categorie 3" },
      { href: "/", label: "Sous categorie 4" },
    ],
  },
  { id: "projects", label: "Categorie 3" },
];

const DesktopNavbar: React.FC = () => {
  const [isTopSectionVisible, setIsTopSectionVisible] = useState<boolean>(true);
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show top section when scrolling up
      if (currentScrollY < lastScrollY.current) {
        setIsTopSectionVisible(true);
      }
      // Hide top section when scrolling down
      else if (currentScrollY > lastScrollY.current) {
        setIsTopSectionVisible(false);
      }

      // Update last scroll position
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "instant" });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unicons.iconscout.com/release/v4.0.8/css/line.css"
      />

      {/* Top Part */}
      <div
        className={`bg-primary z-30 w-full fixed top-0 transition-transform duration-300 ease-in-out ${
          isTopSectionVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center h-32 px-10">
          {/* Left: Search Bar */}
          <div className="flex items-center flex-1">
            <input
              type="text"
              placeholder="Recherche..."
              className="bg-white text-primary rounded-lg px-4 py-2 focus:outline-none w-full max-w-xs shadow-sm"
            />
          </div>

          {/* Center: Logo */}
          <Link href="/" className="flex items-center justify-center flex-1">
            <div className="relative h-24 w-24">
              <Image
                src="/logo.jpeg"
                alt="Logo"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </Link>

          {/* Right: Account and Cart */}
          <div className="flex items-center space-x-4 justify-end flex-1">
            <Link
              href="/Account"
              className="rounded-lg text-lg font-medium px-4 py-2 border-2 border-accent hover:bg-accent hover:text-white duration-300"
            >
              Compte
            </Link>
            <button className="text-accent">
              <i className="uil uil-shopping-cart text-2xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Second Part: Fixed Navbar */}
      <div className="bg-primary z-20 w-full fixed top-0 shadow-lg">
        <div
          className={`flex justify-center items-center h-16 px-10 transition-margin duration-300 ease-in-out ${
            isTopSectionVisible ? "mt-32" : "mt-0"
          }`}
        >
          {/* Menu Navigation Links */}
          <ul className="flex space-x-8 text-lg text-accent">
            {menuItems.map((item) => (
              <li key={item.id} className="relative group">
                {item.dropdown ? (
                  <>
                    <button className="hover:text-indigo-300 flex items-center gap-1">
                      {item.label}
                      <i className="uil uil-angle-down text-sm"></i>{" "}
                      {/* Chevron Down Icon */}
                    </button>
                    <ul className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-primary shadow-lg rounded-lg mt-2 py-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                      {item.dropdown.map((dropdownItem, index) => (
                        <li key={index}>
                          <Link
                            href={dropdownItem.href}
                            className="block w-full text-left px-4 py-2 hover:bg-accent hover:text-primary transition-colors duration-300 ease-in-out"
                          >
                            {dropdownItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="hover:text-indigo-300"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default DesktopNavbar;
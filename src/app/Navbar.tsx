"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Define the menu items
const menuItems = [
  { id: "accueil", label: "Categorie 1" },
  { id: "services", label: "Categorie 2", dropdown: [
    { href: "/", label: "Sous categorie 1" },
    { href: "/", label: "Sous categorie 2" },
    { href: "/", label: "Sous categorie 3" },
    { href: "/", label: "Sous categorie 4" },
  ]},
  { id: "projects", label: "Categorie 3" },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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

      {/* Top Part (Visible at the beginning, hides on scroll) */}
      <div
        className={`bg-primary z-20 w-full transition-all duration-500 ease-in-out ${
          isScrolled ? "opacity-0 h-0" : "opacity-100 h-20 md:h-32"
        }`}
      >
        <div className="flex justify-between items-center h-20 md:h-32 px-4 md:px-10 lg:px-16">
          {/* Left: Search Bar (Desktop) */}
          <div className="hidden md:flex items-center flex-1">
            <input
              type="text"
              placeholder="Search..."
              className="bg-white text-primary rounded-lg px-4 py-2 focus:outline-none w-full max-w-xs shadow-sm transition-all duration-300 ease-in-out focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Center: Logo */}
          <Link href="/" className="md:flex items-center justify-center flex-1">
            <div className="relative h-16 w-16 md:h-24 md:w-24"> {/* Smaller logo for mobile */}
              <Image
                src="/test.jpg"
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>
          </Link>

          {/* Right: Icons (Mobile) and Account/Cart (Desktop) */}
          <div className="flex items-center space-x-4 justify-end flex-1">
            {/* Search Icon (Mobile) */}
            <button
              onClick={toggleSearch}
              className="md:hidden text-accent focus:outline-none"
            >
              <i className="uil uil-search text-2xl"></i>
            </button>

            {/* Cart Icon (Mobile) */}
            <button className="md:hidden text-accent">
              <i className="uil uil-shopping-cart text-2xl"></i>
            </button>

            {/* Account Icon (Mobile) */}
            <Link
              href="/Account"
              className="md:hidden text-accent focus:outline-none"
            >
              <i className="uil uil-user text-2xl"></i> {/* User Icon */}
            </Link>

            {/* Account Button (Desktop) */}
            <Link
              href="/Account"
              className="hidden md:block bg-sectext-accent text-prbg-primary rounded-lg text-lg font-medium px-4 py-2 border-2 border-sectext-accent hover:bg-primary hover:text-accent transition-colors duration-300 ease-in-out"
            >
              Account
            </Link>

            {/* Cart Icon (Desktop) */}
            <button className="hidden md:block text-accent">
              <i className="uil uil-shopping-cart text-2xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Search Input Overlay (Mobile) */}
      {isSearchOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-30 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 transition-all duration-500 ease-in-out">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-white text-primary rounded-lg px-4 py-2 focus:outline-none shadow-sm transition-all duration-300 ease-in-out focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <button
              onClick={toggleSearch}
              className="mt-2 text-accent hover:text-indigo-300 transition-colors duration-300 ease-in-out"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Second Part: Sticky Menu Navigation (Visible at the beginning and sticks on scroll) */}
      <div
        className={`bg-primary z-20 sticky top-0 w-full shadow-lg transition-all duration-500 ease-in-out ${
          isScrolled ? "h-16" : "h-16"
        }`}
      >
        <div className="flex justify-center items-center h-full px-4 md:px-10 lg:px-16">
          {/* Menu Navigation Links (Mobile and Desktop) */}
          <ul className="flex space-x-4 md:space-x-8 text-sm md:text-lg text-accent">
            {menuItems.map((item) => (
              <li key={item.id} className="relative group">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={toggleDropdown}
                      className="hover:text-indigo-300 transition-colors duration-300 ease-in-out"
                    >
                      {item.label}
                    </button>
                    <ul
                      className={`absolute top-10 left-1/2 transform -translate-x-1/2 bg-primary shadow-lg rounded-lg mt-2 py-2 w-72 opacity-0 invisible ${
                        isDropdownOpen ? "opacity-100 visible" : "group-hover:opacity-100 group-hover:visible"
                      } transition-all duration-300 ease-in-out`}
                    >
                      {item.dropdown.map((dropdownItem, index) => (
                        <li key={index}>
                          <Link
                            href={dropdownItem.href}
                            className="block w-full text-left px-4 py-2 hover:bg-[#305eb8] transition-colors duration-300 ease-in-out"
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
                    className="hover:text-indigo-300 transition-colors duration-300 ease-in-out"
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

export default Navbar;
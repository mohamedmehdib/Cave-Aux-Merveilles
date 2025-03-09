"use client";
import React, { useState } from "react";
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

const MobileNavbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenDropdownId(null); // Reset dropdown state when mobile menu is toggled
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
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

      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full h-20 bg-primary z-50 shadow-lg">
        <div className="flex justify-between items-center h-20 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-start flex-1">
            <div className="relative h-16 w-16">
              <Image
                src="/logo.jpeg"
                alt="Logo"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </Link>

          {/* Icons */}
          <div className="flex items-center space-x-4 justify-end flex-1">
            {/* Hamburger Menu Icon */}
            <button
              onClick={toggleMobileMenu}
              className="text-accent focus:outline-none"
            >
              <i className="uil uil-bars text-2xl"></i>
            </button>

            {/* Search Icon */}
            <button
              onClick={toggleSearch}
              className="text-accent focus:outline-none"
            >
              <i className="uil uil-search text-2xl"></i>
            </button>

            {/* Cart Icon */}
            <button className="text-accent">
              <i className="uil uil-shopping-cart text-2xl"></i>
            </button>

            {/* Account Icon */}
            <Link
              href="/Account"
              className="text-accent focus:outline-none"
            >
              <i className="uil uil-user text-2xl"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Box */}
      {isSearchOpen && (
        <div className="fixed top-0 left-0 w-full z-50 h-20 bg-white shadow-lg">
          <div className="flex items-center gap-2 h-full px-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-100 text-primary rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 ease-in-out placeholder-gray-500"
            />
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-600 hover:text-accent transition-colors duration-300 ease-in-out"
            >
              <i className="uil uil-times text-2xl"></i>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <>
        {/* Dark Background Overlay */}
        <div
          className={`fixed top-0 left-0 w-full h-full bg-black z-40 transition-opacity duration-500 ease-in-out ${
            isMobileMenuOpen ? "opacity-50" : "opacity-0"
          } ${isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
          onClick={toggleMobileMenu}
        />

        {/* Mobile Menu Content */}
        <div
          className={`fixed top-0 right-0 w-3/4 h-full bg-primary border-r-2 border-accent z-50 transition-transform duration-500 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4">
            <button
              onClick={toggleMobileMenu}
              className="text-accent hover:text-indigo-300 transition-colors duration-300 ease-in-out"
            >
              <i className="uil uil-times text-2xl"></i>
            </button>
            <ul className="mt-4 space-y-4">
              {menuItems.map((item) => (
                <li key={item.id} className="relative">
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.id)}
                        className="w-full text-left text-accent hover:text-indigo-300 transition-colors duration-300 ease-in-out flex items-center justify-between"
                      >
                        <span>{item.label}</span>
                        <i
                          className={`uil uil-angle-${
                            openDropdownId === item.id ? "up" : "down"
                          } text-xl`}
                        ></i>
                      </button>
                      <ul
                        className={`pl-4 mt-2 space-y-2 ${
                          openDropdownId === item.id ? "block" : "hidden"
                        }`}
                      >
                        {item.dropdown.map((dropdownItem, index) => (
                          <li key={index}>
                            <Link
                              href={dropdownItem.href}
                              className="block w-full text-left text-accent hover:text-indigo-300 transition-colors duration-300 ease-in-out"
                            >
                              {dropdownItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        scrollToSection(item.id);
                        toggleMobileMenu();
                      }}
                      className="w-full text-left text-accent hover:text-indigo-300 transition-colors duration-300 ease-in-out"
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

      {/* Add padding to the top of the page to account for the fixed navbar */}
      <style>{`
        body {
          padding-top: 5rem; /* Adjust this value based on the height of your navbar */
        }
      `}</style>
    </>
  );
};

export default MobileNavbar;
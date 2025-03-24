"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client

interface MenuItem {
  id: string;
  label: string;
  href: string; // URL for the category page
  dropdown?: { href: string; label: string }[]; // Optional dropdown items
}

const Navbar: React.FC = () => {
  const [isTopSectionVisible, setIsTopSectionVisible] = useState<boolean>(true);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [cartCount, setCartCount] = useState<number>(0); // State for cart count
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]); // State for menu items
  const lastScrollY = useRef<number>(0);
  const router = useRouter(); // Initialize useRouter

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    e.stopPropagation(); // Stop event bubbling
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // Fetch categories from Supabase
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories") // Replace with your table name
        .select("id, name, subcategories");

      if (error) {
        throw error;
      }

      console.log("Fetched data:", data); // Debugging: Log fetched data

      // Transform data into the format expected by menuItems
      const transformedData = data.map((category) => {
        const menuItem: MenuItem = {
          id: category.id,
          label: category.name,
          href: `/category/${encodeURIComponent(
            category.name.replace(/\s+/g, "-")
          )}`, // Set href for all categories
        };

        // If subcategories exist, add dropdown
        if (category.subcategories && category.subcategories.length > 0) {
          menuItem.dropdown = category.subcategories.map((subcategory: string) => ({
            // Include the subcategory name in the URL and replace spaces with hyphens
            href: `/category/${encodeURIComponent(
              category.name.replace(/\s+/g, "-")
            )}/${encodeURIComponent(subcategory.replace(/\s+/g, "-"))}`,
            label: subcategory, // Use the string directly as the label
          }));
        }

        return menuItem;
      });

      setMenuItems(transformedData);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch cart count from localStorage
  const fetchCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  };

  // Fetch cart count every 3 seconds
  useEffect(() => {
    fetchCartCount(); // Initial fetch
    const interval = setInterval(fetchCartCount, 500); // Refresh every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY.current) {
        setIsTopSectionVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsTopSectionVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenDropdownId(null);
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`); // Redirect to search/article
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unicons.iconscout.com/release/v4.0.8/css/line.css"
      />

      {/* Mobile Navbar (visible on small screens) */}
      <div className="md:hidden fixed top-0 left-0 w-full h-20 bg-primary z-50 shadow-lg">
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
            <Link href="/Votre-Panier" className="text-accent relative">
              <i className="uil uil-shopping-cart text-2xl"></i>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Box (Mobile) */}
      {isSearchOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full z-50 h-20 bg-white shadow-lg">
          <form onSubmit={handleSearch} className="flex items-center gap-2 h-full px-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 ease-in-out placeholder-gray-500"
            />
            <button
              type="submit"
              className="p-2 text-gray-600 hover:text-accent transition-colors duration-300 ease-in-out"
            >
              <i className="uil uil-search text-2xl"></i>
            </button>
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-600 hover:text-accent transition-colors duration-300 ease-in-out"
            >
              <i className="uil uil-times text-2xl"></i>
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <>
        {/* Dark Background Overlay */}
        <div
          className={`md:hidden fixed top-0 left-0 w-full h-full bg-black z-40 transition-opacity duration-500 ease-in-out ${
            isMobileMenuOpen ? "opacity-50" : "opacity-0"
          } ${
            isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
          onClick={toggleMobileMenu}
        />

        {/* Mobile Menu Content */}
        <div
        className={`md:hidden fixed top-0 right-0 w-3/4 h-full bg-primary border-r-2 border-accent z-50 transition-transform duration-500 ease-in-out ${
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
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    className="text-left text-accent hover:text-indigo-300 transition-colors duration-300 ease-in-out"
                  >
                    {item.label}
                  </Link>
                  {item.dropdown && (
                    <button
                      onClick={(e) => toggleDropdown(item.id, e)}
                      className="text-accent hover:text-indigo-300 transition-colors duration-300 ease-in-out p-2"
                    >
                      <i
                        className={`uil uil-angle-${
                          openDropdownId === item.id ? "up" : "down"
                        } text-xl`}
                      ></i>
                    </button>
                  )}
                </div>
                {item.dropdown && (
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
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      </>

      {/* Desktop Navbar (visible on medium screens and above) */}
      <>
        {/* Top Part */}
        <div
          className={`hidden md:block bg-primary z-30 w-full fixed top-0 transition-transform duration-300 ease-in-out ${
            isTopSectionVisible ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="flex justify-between items-center h-32 px-10">
            {/* Left: Search Bar */}
            <div className="flex items-center flex-1">
              <form onSubmit={handleSearch} className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="Recherche..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white rounded-lg px-4 py-2 focus:outline-none w-full shadow-sm pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-accent transition-colors duration-300 ease-in-out"
                >
                  <i className="uil uil-search text-xl"></i>
                </button>
              </form>
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
              <Link href="/Votre-Panier" className="text-accent relative">
                <i className="uil uil-shopping-cart text-2xl"></i>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {cartCount}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Second Part: Fixed Navbar */}
        <div className="hidden md:block bg-primary z-20 w-full fixed top-0 shadow-lg">
          <div
            className={`flex justify-center items-center h-16 px-10 transition-margin duration-300 ease-in-out ${
              isTopSectionVisible ? "mt-32" : "mt-0"
            }`}
          >
            {/* Menu Navigation Links */}
            <ul className="flex space-x-8 text-lg text-accent">
              {menuItems.map((item) => (
                <li key={item.id} className="relative group">
                  <Link
                    href={item.href} // Redirect to the category page
                    className="hover:text-indigo-300 flex items-center gap-1"
                  >
                    {item.label}
                    {item.dropdown && ( // Show dropdown icon if subcategories exist
                      <i className="uil uil-angle-down text-sm"></i>
                    )}
                  </Link>
                  {item.dropdown && ( // Check if dropdown exists
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
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    </>
  );
};

export default Navbar;
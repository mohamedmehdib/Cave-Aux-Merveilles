"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface MenuItem {
  id: string;
  label: string;
  href: string;
  dropdown?: { href: string; label: string }[];
}

const Navbar: React.FC = () => {
  const [isTopSectionVisible, setIsTopSectionVisible] = useState<boolean>(true);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cartCount, setCartCount] = useState<number>(0);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const lastScrollY = useRef<number>(0);
  const router = useRouter();

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name");
      if (error) {
        throw error;
      }
      console.log("Fetched data:", data);
      const transformedData = data.map((category) => {
        const menuItem: MenuItem = {
          id: category.id,
          label: category.name,
          href: `/category/${encodeURIComponent(
            category.name.replace(/\s+/g, "-")
          )}`,
        };
        return menuItem;
      });
      setMenuItems(transformedData);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  };

  useEffect(() => {
    fetchCartCount();
    const interval = setInterval(fetchCartCount, 500);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unicons.iconscout.com/release/v4.0.8/css/line.css"
      />
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
          className={`md:hidden fixed top-0 left-0 w-full h-full bg-black z-40 transition-opacity duration-300 ease-in-out ${
            isMobileMenuOpen ? "opacity-50" : "opacity-0"
          } ${
            isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
          onClick={toggleMobileMenu}
        />
        {/* Mobile Menu Content */}
        <div
          className={`md:hidden fixed top-0 right-0 w-3/4 h-full bg-primary border-r-2 border-accent z-50 transition-transform duration-300 ease-in-out ${
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
              <li>
                <Link href="/">Acceuil</Link>
              </li>
              <li className="relative">
                <div className="flex items-center justify-between">
                  <span
                    className="text-left text-accent hover:text-indigo-300 transition-colors duration-300 ease-in-out cursor-pointer"
                    onClick={(e) => toggleDropdown("nos-collections", e)}
                  >
                    Collections
                  </span>
                  <button
                    onClick={(e) => toggleDropdown("nos-collections", e)}
                    className="text-accent hover:text-indigo-300 transition-colors duration-300 ease-in-out p-2"
                  >
                    <i
                      className={`uil uil-angle-${
                        openDropdownId === "nos-collections" ? "up" : "down"
                      } text-xl transition-transform duration-300`}
                    ></i>
                  </button>
                </div>
                {openDropdownId === "nos-collections" && (
                  <div className="overflow-hidden transition-all duration-300 ease-in-out max-h-96">
                    <ul className="pl-4 mt-2 space-y-2">
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
                                  } text-xl transition-transform duration-300`}
                                ></i>
                              </button>
                            )}
                          </div>
                          {item.dropdown && (
                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                openDropdownId === item.id ? "max-h-96" : "max-h-0"
                              }`}
                            >
                              <ul className="pl-4 mt-2 space-y-2">
                                {item.dropdown.map((dropdownItem, index) => (
                                  <li key={index}>
                                    <Link
                                      href={dropdownItem.href}
                                      className="block w-full text-left text-accent hover:text-indigo-300 transition-colors duration-300 ease-in-out py-1"
                                    >
                                      {dropdownItem.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
              <li>
                <Link href="/Promo">Promo</Link>
              </li>
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
              <li>
                <Link href="/">Acceuil</Link>
              </li>
              <li className="relative group">
                <span
                  className="hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  onClick={(e) => toggleDropdown("nos-collections", e)}
                >
                  Collections
                  <i className="uil uil-angle-down text-sm"></i>
                </span>
                <ul
                  className={`absolute top-10 left-1/2 transform -translate-x-1/2 bg-primary shadow-lg rounded-lg mt-2 py-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out`}
                >
                  {menuItems.map((item) => (
                    <li key={item.id} className="relative">
                      <Link
                        href={item.href}
                        className="block w-full text-left px-4 py-2 hover:bg-accent hover:text-primary transition-colors duration-300 ease-in-out"
                      >
                        {item.label}
                      </Link>
                      {item.dropdown && (
                        <ul className="pl-4 mt-2 space-y-2">
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
              </li>
              <li>
                <Link href="/Promo">Promo</Link>
              </li>
            </ul>
          </div>
        </div>
      </>
    </>
  );
};

export default Navbar;
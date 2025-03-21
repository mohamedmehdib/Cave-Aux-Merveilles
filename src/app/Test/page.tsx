"use client"

import Link from 'next/link';
import { useState } from 'react';

const DropdownMenu = () => {
  // State to track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Toggle dropdown visibility
  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <div>
      <h1 className="text-white text-5xl font-thin text-center py-16">
        Solution for Long Drop Down Items
      </h1>

      <nav className="w-[750px] mx-auto">
        <ul className="dropdown list-none p-0 m-0 relative">
          {/* Really Tall Menu */}
          <li
            className="drop float-left w-[180px] relative bg-[#ecf0f1]"
            onMouseEnter={() => toggleDropdown('Really Tall Menu')}
            onMouseLeave={() => toggleDropdown('Really Tall Menu')}
          >
            <Link
              href="#"
              className="block py-5 px-2 text-[#34495e] text-center font-light no-underline hover:bg-[#3498db] hover:text-white relative"
            >
              Really Tall Menu
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 border-l-5 border-t-5 border-r-5 border-transparent border-t-[#333]"></span>
            </Link>
            {openDropdown === 'Really Tall Menu' && (
              <ul className="sub_menu absolute top-full left-0 w-[180px] bg-[#f6f6f6] z-1000">
                {Array.from({ length: 22 }).map((_, index) => (
                  <li key={index} className="border-b border-[#ccc]">
                    <Link
                      href="#"
                      className="block py-2 px-2 text-[#34495e] no-underline hover:bg-[#3498db] hover:text-white"
                    >
                      Item {index + 1}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Kinda Tall Menu */}
          <li
            className="drop float-left w-[180px] relative bg-[#ecf0f1]"
            onMouseEnter={() => toggleDropdown('Kinda Tall Menu')}
            onMouseLeave={() => toggleDropdown('Kinda Tall Menu')}
          >
            <Link
              href="#"
              className="block py-5 px-2 text-[#34495e] text-center font-light no-underline hover:bg-[#3498db] hover:text-white relative"
            >
              Kinda Tall Menu
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 border-l-5 border-t-5 border-r-5 border-transparent border-t-[#333]"></span>
            </Link>
            {openDropdown === 'Kinda Tall Menu' && (
              <ul className="sub_menu absolute top-full left-0 w-[180px] bg-[#f6f6f6] z-1000">
                {Array.from({ length: 15 }).map((_, index) => (
                  <li key={index} className="border-b border-[#ccc]">
                    <Link
                      href="#"
                      className="block py-2 px-2 text-[#34495e] no-underline hover:bg-[#3498db] hover:text-white"
                    >
                      Item {index + 1}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Average Menu */}
          <li
            className="drop float-left w-[180px] relative bg-[#ecf0f1]"
            onMouseEnter={() => toggleDropdown('Average Menu')}
            onMouseLeave={() => toggleDropdown('Average Menu')}
          >
            <Link
              href="#"
              className="block py-5 px-2 text-[#34495e] text-center font-light no-underline hover:bg-[#3498db] hover:text-white relative"
            >
              Average Menu
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 border-l-5 border-t-5 border-r-5 border-transparent border-t-[#333]"></span>
            </Link>
            {openDropdown === 'Average Menu' && (
              <ul className="sub_menu absolute top-full left-0 w-[180px] bg-[#f6f6f6] z-1000">
                {Array.from({ length: 5 }).map((_, index) => (
                  <li key={index} className="border-b border-[#ccc]">
                    <Link
                      href="#"
                      className="block py-2 px-2 text-[#34495e] no-underline hover:bg-[#3498db] hover:text-white"
                    >
                      Item {index + 1}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* No Menu */}
          <li className="float-left w-[180px] relative bg-[#ecf0f1]">
            <Link
              href="#"
              className="block py-5 px-2 text-[#34495e] text-center font-light no-underline hover:bg-[#3498db] hover:text-white"
            >
              No Menu
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default DropdownMenu;
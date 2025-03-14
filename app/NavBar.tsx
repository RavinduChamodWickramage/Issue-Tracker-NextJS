"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FaBug } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import AuthStatus from "./components/AuthStatus";

const NavBar = () => {
  const currentPath = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const links = [
    { label: "Home Page", href: "/" },
    { label: "Issues", href: "/issues" },
  ];

  return (
    <nav className="flex items-center justify-between border-b mb-5 px-5 h-14 bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-gray-200 dark:border-gray-600">
      <Link href="/" className="text-2xl text-green-500">
        <FaBug />
      </Link>

      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          type="button"
          className="text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg text-sm p-2"
          aria-controls="navbar-sticky"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <IoMdClose className="w-6 h-6" />
          ) : (
            <RxHamburgerMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      <div className="hidden md:flex items-center">
        <ul className="flex space-x-6 font-medium">
          {links.map((link) => (
            <li key={link.href} className="relative group">
              <Link href={link.href} className="relative">
                <span
                  className={`transition-colors duration-300 ${
                    link.href === currentPath
                      ? "text-green-500 hover:text-green-700"
                      : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
                  }`}
                >
                  {link.label}
                </span>
                <span
                  className={`absolute left-0 bottom-0 h-0.5 transition-all duration-300 ${
                    link.href === currentPath
                      ? "w-full bg-green-500"
                      : "w-0 bg-zinc-500 dark:bg-zinc-100 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } absolute top-14 left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-600 md:hidden`}
        id="navbar-sticky"
      >
        <ul className="flex flex-col font-medium p-4">
          {links.map((link) => (
            <li key={link.href} className="py-2">
              <Link
                href={link.href}
                className="block"
                onClick={() => setIsMenuOpen(false)}
              >
                <span
                  className={`transition-colors duration-300 ${
                    link.href === currentPath
                      ? "text-green-500 hover:text-green-700"
                      : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <AuthStatus />
    </nav>
  );
};

export default NavBar;

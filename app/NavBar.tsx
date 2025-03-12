"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaBug } from "react-icons/fa";

const NavBar = () => {
  const currentPath = usePathname();

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues" },
  ];

  return (
    <nav className="flex justify-center space-x-6 border-b mb-5 px-5 h-14 items-center bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div
        className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
        id="navbar-sticky"
      >
        <Link href="/" className="text-2xl text-green-500 pr-5">
          <FaBug />
        </Link>
        <ul className="flex space-x-6 flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          {links.map((link) => (
            <li key={link.href} className="relative group">
              <Link href={link.href} className="relative">
                <span
                  className={`transition-colors duration-300 ${
                    link.href === currentPath
                      ? "text-green-500 hover:text-green-700"
                      : "text-zinc-100 hover:text-zinc-300"
                  }`}
                >
                  {link.label}
                </span>
                <span
                  className={`absolute left-0 bottom-0 h-0.5 transition-all duration-300 ${
                    link.href === currentPath
                      ? "w-full bg-green-500"
                      : "w-0 bg-zinc-100 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;

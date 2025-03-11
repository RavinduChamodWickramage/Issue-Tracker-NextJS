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
    <nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center">
      <Link href="/" className="text-2xl text-green-700">
        <FaBug />
      </Link>
      <ul className="flex space-x-6">
        {links.map((link) => (
          <li key={link.href} className="relative group">
            <Link href={link.href} className="relative">
              <span
                className={`transition-colors duration-300 ${
                  link.href === currentPath
                    ? "text-green-700 hover:text-green-900"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {link.label}
              </span>
              <span
                className={`absolute left-0 bottom-0 h-0.5 transition-all duration-300 ${
                  link.href === currentPath
                    ? "w-full bg-green-700"
                    : "w-0 bg-zinc-900 group-hover:w-full"
                }`}
              ></span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;

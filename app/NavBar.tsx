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
      <Link href="/">
        <FaBug />
      </Link>
      <ul className="flex space-x-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              link.href === currentPath
                ? "text-green-700 hover:text-green-900 group relative transition-colors duration-300"
                : "text-zinc-500 hover:text-zinc-900 group relative transition-colors duration-300"
            }
          >
            {link.label}
            <span
              className={`absolute left-0 bottom-0 h-0.5 transition-all duration-300 ${
                link.href === currentPath
                  ? "w-full bg-green-700"
                  : "w-0 group-hover:w-full bg-zinc-900"
              }`}
            ></span>
          </Link>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;

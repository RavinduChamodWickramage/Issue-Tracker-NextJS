import "@radix-ui/themes/styles.css";
import "./theme-config.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./NavBar";
import { Theme } from "@radix-ui/themes";
import AuthProvider from "./components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Issue Tracker",
  description: "Author: Ravindu Wickramage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <AuthProvider>
          <Theme appearance="light" accentColor="violet">
            <NavBar />
            <main className="p-5 pt-20">{children}</main>
          </Theme>
        </AuthProvider>
      </body>
    </html>
  );
}

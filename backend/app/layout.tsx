// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import NavbarClient from "@/app/components/navbar/NavbarClient";
import NavbarWrapper from "@/app/components/navbar/NavbarWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Security-Verifier",
  description: "Admin panel for Security-Verifier system",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          min-h-screen
          text-slate-900
          antialiased
        `}
      >
        {/* Navbar (hidden on home page) */}
        <NavbarWrapper>
          <NavbarClient />
        </NavbarWrapper>

        {/* Page Content */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

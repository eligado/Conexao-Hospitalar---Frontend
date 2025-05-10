"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./global.css";
import Header from "../components/Header";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const hideHeaderRoutes = ["/login", "/register"];
    setShowHeader(!hideHeaderRoutes.includes(pathname));
  }, [pathname]);

  return (
      <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      {showHeader && <Header />}
      {children}
      </body>
      </html>
  );
}
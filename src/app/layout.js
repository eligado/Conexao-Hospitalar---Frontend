// src/app/layout.js
"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./global.css";
import Header from "../components/Header";
import { usePathname } from "next/navigation";

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
  const hideHeaderRoutes = ["/login", "/register"];

  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {!hideHeaderRoutes.includes(pathname) && <Header />}
        {children}
      </body>
    </html>
  );
}
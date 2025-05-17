"use client";
import "./global.css";
import Header from "../components/Header";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";


export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [showHeader, setShowHeader] = useState(false);

    useEffect(() => {
        if (pathname) {
            const hideHeaderRoutes = ["/login", "/register"];
            setShowHeader(!hideHeaderRoutes.includes(pathname));
        }
    }, [pathname]);
  return (
      <html lang="pt-br">
      <body>
      {showHeader && <Header />}
      {children}
      </body>
      </html>
  );
}
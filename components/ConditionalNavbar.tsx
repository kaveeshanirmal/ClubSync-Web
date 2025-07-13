"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Define routes where navbar should be hidden
  const hideNavbarRoutes = ["/login", "/register", "/auth", "/admin"];

  // Check if current route should hide navbar
  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    pathname.startsWith(route),
  );

  return shouldHideNavbar ? null : <Navbar />;
}

"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Define routes where footer should be hidden
  const hideFooterRoutes = ["/login", "/register", "/auth", "/admin"];

  // Check if current route should hide footer
  const shouldHideFooter = hideFooterRoutes.some((route) =>
    pathname.startsWith(route),
  );

  return shouldHideFooter ? null : <Footer />;
}

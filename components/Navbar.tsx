"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { status, data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-40 transition-all duration-500 ${
        scrollY > 50
          ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200 transform"
          : "bg-white transform"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-black group-hover:text-orange-500 transition-colors duration-300">
              <Link href="/">ClubSync</Link>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {["Home", "About", "Contact"].map((item, index) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-700 hover:text-orange-500 transition-all duration-300 font-medium relative group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            {status === "unauthenticated" && (
              <Link href="/register">
                <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium transform hover:scale-105 hover:shadow-lg">
                  Get Started
                </button>
              </Link>
            )}
            {status === "authenticated" && (
              <div className="flex items-center space-x-3">
                <img
                  src={session.user?.image || "/default-avatar.png"}
                  alt={session.user?.name || "User"}
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                />
                <span className="text-gray-700 font-medium">
                  {session.user?.name || "User"}
                </span>
              </div>
            )}
          </div>
          {/*logout*/}
          {status === "authenticated" && (
            <Link href="/api/auth/signout">
              <button className="hidden md:block ml-4 bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition-all duration-300 font-medium text-sm">
                Logout
              </button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden transform transition-transform duration-200 hover:scale-110"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-4 pt-4 pb-4 border-t border-gray-200">
            {["Features", "Demo", "Community"].map((item, index) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-700 hover:text-orange-500 transition-all duration-300 font-medium transform hover:translate-x-2"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  transform: mobileMenuOpen
                    ? "translateX(0)"
                    : "translateX(-20px)",
                }}
              >
                {item}
              </a>
            ))}
            <Link href="/register">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium w-fit transform hover:scale-105">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

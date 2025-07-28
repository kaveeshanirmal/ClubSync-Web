import React from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white relative z-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">ClubSync</span>
          </div>

          <div className="flex flex-wrap gap-8">
            <Link href="/clubs" className="text-gray-300 hover:text-orange-400 transition-colors">
              Clubs
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-orange-400 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-orange-400 transition-colors">
              Contact
            </Link>
            <Link href="/club-admin" className="text-gray-300 hover:text-orange-400 transition-colors">
              Admin
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} ClubSync. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="space-x-6">
          <Link href="/" legacyBehavior>
            <a className="text-slate-50 hover:text-white">Home</a>
          </Link>
          <Link href="/privacy" legacyBehavior>
            <a className="text-slate-50 hover:text-white">Privacy Policy</a>
          </Link>
          <Link href="/terms" legacyBehavior>
            <a className="text-slate-50 hover:text-white">Terms of Service</a>
          </Link>
          <Link href="/contact" legacyBehavior>
            <a className="text-slate-50 hover:text-white">Contact</a>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

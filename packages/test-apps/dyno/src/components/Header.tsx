import Link from 'next/link';
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="shadow-md bg-slate-900">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" legacyBehavior>
          <p className="text-2xl font-bold text-slate-50 cursor-pointer">Dyno</p>
        </Link>
        <nav className="space-x-6">
          <Link href="/" legacyBehavior>
            <a className="text-slate-50 hover:text-emerald-200">Home</a>
          </Link>
          <Link href="/products" legacyBehavior>
            <a className="text-slate-50 hover:text-emerald-200">Products</a>
          </Link>
          <Link href="/about" legacyBehavior>
            <a className="text-slate-50 hover:text-emerald-200">About Us</a>
          </Link>
          <Link href="/contact" legacyBehavior>
            <a className="text-slate-50 hover:text-emerald-200">Contact</a>
          </Link>
          <Link href="/cart" legacyBehavior>
            <a className="text-slate-50 hover:text-emerald-200">Cart</a>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

import Link from "next/link";
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">JapanLingo</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:underline">Home</Link>
          </li>
          <li>
            <Link href="/signin" className="hover:underline">Sign In</Link>
          </li>
          <li>
            <Link href="/signup" className="hover:underline">Sign Up</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

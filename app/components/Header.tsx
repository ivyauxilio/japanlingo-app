"use client"
import Link from "next/link";
import { useState } from 'react';
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { logout } from "../redux/authSlice";
import { motion,AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const { user,loading } = useAuth(); // Get auth status
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      dispatch(logout());
      console.log("Sign-out successful.");
    }).catch((error) => {
      console.log(error)
    });

  };
  if (loading) return;
  return (
    <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
      <div className="flex">
      <h1 className="text-2xl font-bold">JapanLingo</h1>
      <p className="text-sm">V1</p>
      </div>
      <nav className="hidden md:flex ">
        <ul className="flex items-center space-x-4">
          <li>
            <Link href="/" className="hover:underline">Home</Link>
          </li>
          {!user ? 
          (<><li>
            <Link href="/signin" className="hover:underline">Sign In</Link>
          </li>
          <li>
            <Link href="/signup" className="hover:underline">Sign Up</Link>
          </li> </>)
          : (
            <>
            <li>
              <Link href="/admin" className="hover:underline">Admin</Link>
            </li>
            <li>
              <Link href="/learning" className="hover:underline">Learning</Link>
            </li>
            <li>
              <div className="flex items-center gap-4">
                <span>Welcome, {user.displayName || user.email}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-black rounded"
                >
                  Logout
                </button>
            </div>
          </li>
            </>
        ) }
        </ul>
      </nav>
      <button className="md:hidden" onClick={() => setIsOpen(true)}>
          Menu
      </button>
      <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 right-0 w-64 h-full bg-blue-700 text-white shadow-lg p-6 flex flex-col space-y-6 md:hidden"
        >
          <button className="self-end" onClick={() => setIsOpen(false)}>
            X
          </button>
          {/* <Link href="/" className="hover:underline" onClick={() => setIsOpen(false)}>Home</Link> */}
          <Link href="/admin" className="hover:underline" onClick={() => setIsOpen(false)}>Admin</Link>
          <Link href="/learning" className="hover:underline" onClick={() => setIsOpen(false)}>Learning</Link>
          <Link href="/logout" className="hover:underline" onClick={() => setIsOpen(false)}>Logout</Link>
          {/* <div className="flex items-center gap-4">
                <span>Welcome, {user.displayName || user.email}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-black rounded"
                >
                  Logout
                </button>
            </div> */}
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

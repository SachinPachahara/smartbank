import React, { useRef, useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdOutlineSecurity, MdVerifiedUser } from "react-icons/md";
import { IoLogIn } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Logo } from "../../../shared/Logo";

export default function Navbar({ onOpenLegal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [navbar, setNavbar] = useState(false);

  const navRef = useRef(null);
  const openBtnRef = useRef(null);

  useEffect(() => {
    const changeBackground = () => {
      if (window.scrollY > 40) {
        setNavbar(true);
      } else {
        setNavbar(false);
      }
    };
    window.addEventListener("scroll", changeBackground);

    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  useEffect(() => {
    const closeNavbar = (e) => {
      if (
        !navRef?.current?.contains(e.target) &&
        !openBtnRef?.current?.contains(e.target) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", closeNavbar);

    return () => {
      document.removeEventListener("click", closeNavbar);
    };
  }, [isOpen]);

  const navLinks = [
    { label: "Home", href: "#Home" },
    { label: "About", href: "#about" },
    { label: "Security & Trust", href: "#security" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <div
      className={`${
        navbar
          ? "bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-800"
          : "bg-slate-900/75 backdrop-blur-sm"
      } fixed z-40 top-0 w-full transition-all duration-300 ease-in-out`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Logo bg={false} textSize="text-xl sm:text-2xl" />
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-teal-900/80 text-teal-300 border border-teal-700/50">
            Enterprise
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-300">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-teal-400 transition py-1"
            >
              {item.label}
            </a>
          ))}
          {onOpenLegal && (
            <button
              onClick={() => onOpenLegal("terms")}
              className="hover:text-teal-400 transition py-1 flex items-center gap-1.5 text-slate-300"
            >
              <MdVerifiedUser size={15} className="text-teal-400" />
              Compliance
            </button>
          )}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/admins/login"
            className="text-xs text-slate-400 hover:text-slate-200 transition px-2 py-1"
          >
            Admin Portal
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition"
          >
            <IoLogIn size={16} className="text-teal-400" />
            <span>Sign In</span>
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-lg shadow-md transition"
          >
            Open Account
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          ref={openBtnRef}
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <AiFillCloseCircle size={26} /> : <GiHamburgerMenu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          ref={navRef}
          className="lg:hidden bg-slate-900 border-b border-slate-800 px-6 py-5 space-y-4 animate-fadeIn"
        >
          <div className="flex flex-col space-y-3 font-semibold text-slate-300">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="py-1 hover:text-teal-400 transition"
              >
                {item.label}
              </a>
            ))}
            {onOpenLegal && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenLegal("terms");
                }}
                className="py-1 text-left hover:text-teal-400 transition flex items-center gap-2"
              >
                <MdVerifiedUser size={16} className="text-teal-400" />
                Legal & Compliance Center
              </button>
            )}
          </div>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 text-center text-sm font-bold text-white bg-slate-800 rounded-lg border border-slate-700"
            >
              User Login
            </Link>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 text-center text-sm font-bold text-white bg-teal-600 rounded-lg"
            >
              Open Account
            </Link>
            <Link
              to="/admins/login"
              onClick={() => setIsOpen(false)}
              className="w-full py-1 text-center text-xs text-slate-400 hover:text-slate-200"
            >
              Go to Admin Dashboard &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

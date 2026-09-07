import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../../shared/Logo";
import {
  MdOutlineSecurity,
  MdVerifiedUser,
  MdLock,
  MdHelpOutline,
} from "react-icons/md";
import { BsShieldCheck } from "react-icons/bs";

export default function Footer({ onOpenLegal }) {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Logo bg={false} textSize="text-2xl" />
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              SmartBank is an enterprise-grade digital banking platform engineered for maximum financial resilience,
              zero-loss ACID transactions, and cryptographic data privacy.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-teal-400 font-semibold">
              <BsShieldCheck size={16} />
              <span>256-Bit SSL • PCI-DSS Aligned • Zero-Trust Access</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#Home" className="hover:text-teal-400 transition">
                  Home Overview
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-teal-400 transition">
                  About SmartBank
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-teal-400 transition">
                  Security Architecture
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-teal-400 transition">
                  Help & FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Legal & Trust</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onOpenLegal && onOpenLegal("terms")}
                  className="hover:text-teal-400 transition text-left"
                >
                  Terms of Service (ToC)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal && onOpenLegal("privacy")}
                  className="hover:text-teal-400 transition text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal && onOpenLegal("security")}
                  className="hover:text-teal-400 transition text-left"
                >
                  Fund Safety & AML
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal && onOpenLegal("terms")}
                  className="hover:text-teal-400 transition text-left text-teal-400 font-medium"
                >
                  Compliance Center &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Access Portals */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Portals</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/login" className="hover:text-teal-400 transition flex items-center gap-1.5">
                  <MdLock size={14} className="text-teal-400" />
                  <span>Customer Login</span>
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-teal-400 transition flex items-center gap-1.5">
                  <MdVerifiedUser size={14} className="text-teal-400" />
                  <span>Register Account</span>
                </Link>
              </li>
              <li>
                <Link to="/admins/login" className="hover:text-teal-400 transition flex items-center gap-1.5">
                  <MdOutlineSecurity size={14} className="text-amber-400" />
                  <span>Admin & Owner Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimers & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 space-y-4">
          <p className="leading-relaxed">
            <strong>Regulatory & Compliance Notice:</strong> SmartBank simulations strictly follow modern financial
            software specifications including dual-entry ledger tracking, atomic conditional concurrency execution,
            and cryptographic authorization. Account holders agree to respect local electronic money transfer laws.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} SmartBank Systems Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => onOpenLegal && onOpenLegal("privacy")}
                className="hover:text-slate-300 transition"
              >
                Privacy
              </button>
              <span>•</span>
              <button
                onClick={() => onOpenLegal && onOpenLegal("terms")}
                className="hover:text-slate-300 transition"
              >
                Terms
              </button>
              <span>•</span>
              <button
                onClick={() => onOpenLegal && onOpenLegal("security")}
                className="hover:text-slate-300 transition"
              >
                Security
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

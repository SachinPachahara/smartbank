import React from "react";
import { Link } from "react-router-dom";
import { FaQuoteLeft, FaQuoteRight, FaCode, FaGithub } from "react-icons/fa";
import { BsShieldCheck, BsTerminal, BsCpu } from "react-icons/bs";
import { MdVerified } from "react-icons/md";

export default function Reviews() {
  return (
    <section
      id="vision"
      className="relative overflow-hidden py-24 bg-gradient-to-b from-slate-50 via-white to-slate-100 border-t border-slate-200"
    >
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-4">
            <FaCode size={13} /> Engineering Vision & Core Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered with Purpose: <span className="text-teal-700">The Why Behind SmartBank</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            A deliberate focus on resolving the most critical engineering hurdles in modern digital finance:
            concurrency safety, double-spend immunity, and zero-trust identity isolation.
          </p>
        </div>

        {/* Architect Statement Card */}
        <div className="relative bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 via-indigo-500 to-amber-500"></div>

          <div className="flex flex-col items-center text-center">
            {/* Engineer Avatar Badge */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-teal-400 flex items-center justify-center shadow-lg border-2 border-slate-700 mb-6 relative">
              <BsCpu size={38} />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow">
                <MdVerified size={14} />
              </div>
            </div>

            {/* Architecture Quote */}
            <blockquote className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-3xl mb-8 relative">
              <span className="text-teal-600 inline-block mr-1">
                <FaQuoteLeft size={16} />
              </span>
              In traditional software, an unhandled database exception is a minor bug. In financial systems,
              a millisecond race condition or an unisolated transfer can result in permanent loss or duplication of funds.
              SmartBank was built to challenge generic CRUD tutorials by implementing <strong>multi-document ACID transactions</strong>,
              <strong> atomic conditional execution</strong>, and an <strong>immutable double-entry ledger</strong>.
              Every rupee transferred is mathematically verified, auditable, and rollback-protected.
              <span className="text-teal-600 inline-block ml-1">
                <FaQuoteRight size={16} />
              </span>
            </blockquote>

            {/* Author Credentials */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <cite className="font-bold text-lg text-slate-900 not-italic">
                  Lead Software Architect & Engineer
                </cite>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-100 text-teal-800">
                  Creator
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-mono">
                Full-Stack Systems • FinTech Specialization
              </p>
            </div>

            {/* Architecture Highlights Pill Row */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-semibold text-slate-600">
              <span className="px-3 py-1 bg-slate-100 rounded-lg flex items-center gap-1.5">
                <BsTerminal size={13} className="text-indigo-600" />
                MERN Stack
              </span>
              <span className="px-3 py-1 bg-slate-100 rounded-lg flex items-center gap-1.5">
                <BsShieldCheck size={13} className="text-teal-600" />
                ACID Session Engine
              </span>
              <span className="px-3 py-1 bg-slate-100 rounded-lg flex items-center gap-1.5">
                <FaCode size={13} className="text-amber-600" />
                Atomic Concurrency
              </span>
              <span className="px-3 py-1 bg-slate-100 rounded-lg flex items-center gap-1.5">
                <BsShieldCheck size={13} className="text-rose-600" />
                IDOR Hardened
              </span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition duration-200"
          >
            <span>Experience SmartBank Now</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

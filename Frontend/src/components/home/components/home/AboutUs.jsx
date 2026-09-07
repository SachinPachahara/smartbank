import React from "react";
import { BsShieldCheck, BsLightningCharge, BsGraphUp, BsPeople } from "react-icons/bs";

export const AboutUs = () => {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-white to-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 mb-4">
            <BsShieldCheck size={14} /> Our Mission & Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Banking Engineered for <span className="text-teal-700">Resilience & Trust</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            SmartBank was architected to eliminate the common vulnerabilities of traditional banking software.
            By coupling distributed multi-document ACID transactions with immutable ledger auditing, we guarantee that
            every penny is secure, verifiable, and available 24/7.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-teal-100 text-teal-800 rounded-xl flex items-center justify-center mb-5">
              <BsShieldCheck size={26} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Zero-Trust Security</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every request is authenticated against strict role-based access controls (RBAC) and protected against IDOR
              vulnerabilities.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-800 rounded-xl flex items-center justify-center mb-5">
              <BsLightningCharge size={26} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">ACID Double-Entry Ledger</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Atomic operations prevent double spending and race conditions during simultaneous deposits and transfers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center mb-5">
              <BsGraphUp size={26} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Real-Time Auditing</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Instantaneous notifications and transparent balance tracking ensure customers maintain 100% oversight of their money.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-xl flex items-center justify-center mb-5">
              <BsPeople size={26} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Customer First</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Dedicated administrative governance ensures rapid account approval, active verification, and personalized support.
            </p>
          </div>
        </div>

        {/* Live Metrics Showcase */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-5xl font-extrabold text-teal-400">99.99%</div>
              <div className="mt-2 text-xs sm:text-sm font-medium text-slate-400">Service Availability</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-5xl font-extrabold text-indigo-400">0%</div>
              <div className="mt-2 text-xs sm:text-sm font-medium text-slate-400">Fund Discrepancy Rate</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-5xl font-extrabold text-amber-400">&lt;50ms</div>
              <div className="mt-2 text-xs sm:text-sm font-medium text-slate-400">Ledger Settlement</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-5xl font-extrabold text-emerald-400">256-bit</div>
              <div className="mt-2 text-xs sm:text-sm font-medium text-slate-400">AES Bank Encryption</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

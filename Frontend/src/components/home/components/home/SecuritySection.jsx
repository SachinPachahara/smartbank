import React from "react";
import { MdOutlineSecurity, MdVpnKey, MdLockClock, MdFactCheck } from "react-icons/md";
import { FaFingerprint, FaShieldAlt } from "react-icons/fa";

export const SecuritySection = () => {
  const securityFeatures = [
    {
      icon: <MdOutlineSecurity size={28} className="text-teal-600" />,
      title: "Zero-Trust Session Guards",
      desc: "Bearer tokens verified on every transaction. Strict Object-Level authorization prevents cross-user account tampering.",
    },
    {
      icon: <MdLockClock size={28} className="text-indigo-600" />,
      title: "Atomic Concurrency Control",
      desc: "Guaranteed race-condition immunity using conditional updates. Simultaneous requests cannot create negative balances.",
    },
    {
      icon: <MdVpnKey size={28} className="text-amber-600" />,
      title: "Bcrypt Adaptive Password Hashing",
      desc: "Your credentials never touch our database in plain text. Salted hashing prevents rainbow table & brute-force extraction.",
    },
    {
      icon: <MdFactCheck size={28} className="text-emerald-600" />,
      title: "Immutable Transaction Ledger",
      desc: "Audit trail with unique TXN references and idempotency tokens ensures no transaction can be silently modified or lost.",
    },
    {
      icon: <FaFingerprint size={28} className="text-purple-600" />,
      title: "Adaptive Rate-Limiting",
      desc: "Intelligent IP and endpoint throttling filters automated bots and prevents Distributed Denial of Service (DDoS) vectors.",
    },
    {
      icon: <FaShieldAlt size={28} className="text-rose-600" />,
      title: "Segregated Administrative Governance",
      desc: "Strict separation between users, operational staff, and root system owners with multi-tier role verification.",
    },
  ];

  return (
    <section id="security" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-900/60 text-teal-300 border border-teal-700/50 mb-4">
            <MdOutlineSecurity size={14} /> Security by Design
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            High-Security Infrastructure <span className="text-teal-400">You Can Rely On</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            We prioritize the mathematical safety of your money. Every layer of the SmartBank software stack is hardened
            against industry-standard threat models.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityFeatures.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-teal-500/50 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300 border border-slate-700">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Security Compliance Strip */}
        <div className="mt-16 pt-10 border-t border-slate-800 flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-slate-400 text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            256-Bit SSL/TLS Encryption
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
            OWASP Top 10 Hardened
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
            Multi-Document ACID Safety
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            Automated Rollback Engine
          </div>
        </div>
      </div>
    </section>
  );
};

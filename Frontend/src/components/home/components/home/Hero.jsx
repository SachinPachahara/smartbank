import React from "react";
import { Link } from "react-router-dom";
import {
  MdOutlineSecurity,
  MdArrowForward,
  MdLock,
  MdCheckCircle,
  MdSyncAlt,
} from "react-icons/md";
import { BsShieldFillCheck, BsLightningChargeFill } from "react-icons/bs";

export default function Hero({ onOpenLegal }) {
  return (
    <section id="Home" className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-950/80 text-teal-300 border border-teal-500/40 shadow-inner">
              <BsShieldFillCheck size={14} className="text-teal-400" />
              <span>Next-Gen FinTech • ACID Ledger Guaranteed • 256-Bit SSL</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              Smarter, Safer, <br />
              <span className="bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Frictionless Banking
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Experience seamless electronic funds transfer, multi-account ledgering, and real-time fraud mitigation.
              Architected with zero-trust security and atomic transaction guarantees so your funds are never compromised.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white font-bold rounded-xl shadow-lg shadow-teal-900/40 hover:shadow-teal-900/60 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <span>Open Free Account</span>
                <MdArrowForward size={18} className="group-hover:translate-x-1 transition" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold rounded-xl border border-slate-700 hover:border-slate-600 transition duration-200 flex items-center justify-center gap-2"
              >
                <MdLock size={17} className="text-teal-400" />
                <span>Secure User Login</span>
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <MdCheckCircle size={16} className="text-teal-400" />
                <span>Zero Double-Spend Risk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MdCheckCircle size={16} className="text-teal-400" />
                <span>Instant P2P Settlements</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MdCheckCircle size={16} className="text-teal-400" />
                <span>Audit Trail Logging</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual FinTech Interactive Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              {/* Virtual Black Titanium Card */}
              <div className="w-full h-56 sm:h-64 rounded-2xl p-6 sm:p-7 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-slate-700/80 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                {/* Background holographic shimmer */}
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

                {/* Card Header */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center font-bold text-white text-lg">
                      S
                    </div>
                    <span className="font-extrabold tracking-wider text-base text-white">SmartBank</span>
                  </div>
                  <div className="flex items-center gap-1 text-teal-400 text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-950/60 border border-teal-800/60">
                    <BsLightningChargeFill size={12} />
                    <span>PLATINUM DEBIT</span>
                  </div>
                </div>

                {/* EMV Chip & Contactless */}
                <div className="flex items-center gap-3 z-10">
                  <div className="w-10 h-7 rounded-md bg-gradient-to-r from-amber-200 to-amber-400 shadow-inner border border-amber-500/50"></div>
                  <div className="text-slate-500 font-mono text-xs tracking-widest">((( • )))</div>
                </div>

                {/* Card Number & Details */}
                <div className="z-10 space-y-2">
                  <div className="font-mono text-lg sm:text-xl tracking-widest text-slate-200 font-semibold drop-shadow">
                    •••• •••• •••• 5420
                  </div>
                  <div className="flex justify-between items-end text-xs text-slate-400">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Account Holder</div>
                      <div className="font-semibold text-slate-200 uppercase tracking-wider">Verified Customer</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Protection</div>
                      <div className="font-semibold text-teal-400">ACID SECURED</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Real-time Transaction Card */}
              <div className="mt-4 -ml-2 sm:-ml-6 bg-slate-800/95 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <MdSyncAlt size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Instant Wire Transfer Received</div>
                    <div className="text-[11px] text-slate-400">Ref: TXN-2026-98721 • Settled</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">+₹24,500.00</div>
                  <div className="text-[10px] text-slate-500">Atomic Sync</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

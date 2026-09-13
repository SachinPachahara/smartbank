import React from "react";
import { ReactComponent as OnlineIcon } from "../../../../assets/icons/icon-online.svg";
import { ReactComponent as OnboardingIcon } from "../../../../assets/icons/icon-onboarding.svg";
import { ReactComponent as BudgetingIcon } from "../../../../assets/icons/icon-budgeting.svg";
import { ReactComponent as ApiIcon } from "../../../../assets/icons/icon-api.svg";

const simulationFeatures = [
  {
    icon: OnboardingIcon,
    title: "Maker-Checker KYC Onboarding",
    subtitle:
      "Simulate real-world branch approvals. Accounts begin in 'Pending' state and require authorized Admin verification before activation.",
  },
  {
    icon: BudgetingIcon,
    title: "Double-Entry Ledger Engine",
    subtitle:
      "Every financial event generates strictly balanced DEBIT and CREDIT ledger records in integer paise, preventing floating-point inaccuracies.",
  },
  {
    icon: OnlineIcon,
    title: "ACID P2P Fund Transfers",
    subtitle:
      "Multi-document MongoDB transactions guarantee instant fund transfers, deposits, and withdrawals with complete rollback and race-condition safety.",
  },
  {
    icon: ApiIcon,
    title: "Real-Time Audit & Reporting",
    subtitle:
      "Full ledger passbooks, transaction audit logs, PDF statements, and cryptographic OTP verification give 100% financial traceability.",
  },
];

export default function Motivation() {
  return (
    <section id="features" className="py-20 md:py-32 bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-950 text-teal-300 border border-teal-800/60 mb-4">
            FinTech Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Core Capabilities of the{" "}
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              SmartBank Simulation Engine
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Designed to bridge the gap between simple toy tutorials and production-grade banking systems,
            SmartBank models full-lifecycle banking workflows with mathematical accuracy and bank-grade security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {simulationFeatures.map((item) => (
            <div
              key={item.title}
              className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 hover:border-teal-500/50 transition-all duration-300 shadow-md flex flex-col"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center mb-6">
                <item.icon className="w-8 h-8" />
              </div>

              <h3 className="text-lg font-bold text-teal-400 mb-2">
                {item.title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed font-normal">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


import React from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { BsShieldCheck, BsLightningChargeFill } from "react-icons/bs";
import { FcElectroDevices } from "react-icons/fc";
import { Link } from "react-router-dom";

export const NoAccountYet = () => {
  return (
    <div className="max-w-4xl w-full p-8 bg-white border border-slate-200 rounded-3xl shadow-sm my-8 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center mb-5 text-teal-600">
        <FcElectroDevices size={42} />
      </div>

      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200 mb-3">
        <BsShieldCheck size={13} /> Simulation Onboarding • Step 1 of 2
      </span>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-3">
        Welcome to SmartBank Core Banking Simulation
      </h2>

      <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed mb-6">
        In real-world banking workflows, customer accounts are not created automatically without compliance review.
        To begin testing deposits, transfers, and double-entry ledger bookkeeping, submit your account opening request.
      </p>

      {/* Workflow Explainer steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-8 text-left">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">Step 1</div>
          <div className="text-sm font-bold text-slate-800 mb-1">Request Account</div>
          <div className="text-xs text-slate-500">Specify your starting simulated balance and submit for approval.</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Step 2</div>
          <div className="text-sm font-bold text-slate-800 mb-1">Admin Approval</div>
          <div className="text-xs text-slate-500">Bank admin verifies KYC and moves the account from Pending to Active.</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Step 3</div>
          <div className="text-sm font-bold text-slate-800 mb-1">Full Operations</div>
          <div className="text-xs text-slate-500">Deposit, wire transfer, QR pay, and audit transactions in real-time.</div>
        </div>
      </div>

      <Link
        className="inline-flex font-bold text-sm bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg items-center gap-2 transition duration-200"
        to={"/account-request"}
      >
        <span>Submit Account Request</span>
        <BiRightArrowAlt size={20} />
      </Link>
    </div>
  );
};


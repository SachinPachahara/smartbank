import React from "react";
import { BsShieldCheck, BsCalendarCheck, BsPersonCheckFill } from "react-icons/bs";
import { MdVerified, MdAccountBalance } from "react-icons/md";

export default function ProfileSummery({ info }) {
  const accountCount = info?.accounts?.length || 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-700 to-slate-900 text-white flex items-center justify-center font-bold text-2xl shadow-md border-2 border-slate-700">
            {info?.name ? info.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xl font-bold text-slate-900">{info?.name}</h3>
              <MdVerified size={18} className="text-teal-600" />
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{info?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <BsShieldCheck size={13} />
            <span>KYC Verified & Active</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-slate-400 font-semibold uppercase text-[10px]">Client Status</div>
          <div className="font-bold text-slate-800 text-sm mt-1 flex items-center gap-1">
            <BsPersonCheckFill size={14} className="text-teal-600" />
            <span>Good Standing</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-slate-400 font-semibold uppercase text-[10px]">Linked Bank Accounts</div>
          <div className="font-bold text-slate-800 text-sm mt-1 flex items-center gap-1">
            <MdAccountBalance size={14} className="text-indigo-600" />
            <span>{accountCount} Active {accountCount === 1 ? "Account" : "Accounts"}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-slate-400 font-semibold uppercase text-[10px]">Customer Since</div>
          <div className="font-bold text-slate-800 text-sm mt-1 flex items-center gap-1">
            <BsCalendarCheck size={14} className="text-amber-600" />
            <span>{new Date(info.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

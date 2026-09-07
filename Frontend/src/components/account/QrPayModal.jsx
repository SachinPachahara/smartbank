import React, { useState } from "react";
import { MdClose, MdContentCopy, MdCheck, MdQrCodeScanner } from "react-icons/md";
import { BsShieldCheck } from "react-icons/bs";

export const QrPayModal = ({ isOpen, onClose, account, userName = "Customer" }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !account) return null;

  const handleSlug = userName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const smartVpa = `${handleSlug || "user"}@smartbank`;

  const handleCopyVpa = () => {
    navigator.clipboard?.writeText(smartVpa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-100 text-teal-800 rounded-lg">
              <MdQrCodeScanner size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">SmartBank QR & VPA</h3>
              <p className="text-[11px] text-slate-500">Instant Peer-to-Peer Incoming Payment Handle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full transition"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* QR Body */}
        <div className="p-6 text-center space-y-5">
          {/* Simulated High-Res SVG QR Code */}
          <div className="inline-block p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-md">
            <svg
              className="w-48 h-48 mx-auto"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="100" fill="white" />
              {/* Top-Left Finder */}
              <rect x="10" y="10" width="24" height="24" rx="4" fill="#0f172a" />
              <rect x="14" y="14" width="16" height="16" fill="white" />
              <rect x="18" y="18" width="8" height="8" rx="1" fill="#0f766e" />

              {/* Top-Right Finder */}
              <rect x="66" y="10" width="24" height="24" rx="4" fill="#0f172a" />
              <rect x="70" y="14" width="16" height="16" fill="white" />
              <rect x="74" y="18" width="8" height="8" rx="1" fill="#0f766e" />

              {/* Bottom-Left Finder */}
              <rect x="10" y="66" width="24" height="24" rx="4" fill="#0f172a" />
              <rect x="14" y="70" width="16" height="16" fill="white" />
              <rect x="18" y="74" width="8" height="8" rx="1" fill="#0f766e" />

              {/* Data Blocks Simulation */}
              <rect x="42" y="12" width="6" height="6" fill="#0f172a" />
              <rect x="52" y="18" width="6" height="6" fill="#0f172a" />
              <rect x="44" y="28" width="12" height="6" fill="#0f766e" />
              <rect x="12" y="44" width="6" height="12" fill="#0f172a" />
              <rect x="24" y="48" width="8" height="6" fill="#0f172a" />
              <rect x="40" y="42" width="20" height="16" rx="2" fill="#0f172a" />
              <rect x="46" y="48" width="8" height="4" fill="#14b8a6" />
              <rect x="68" y="44" width="18" height="6" fill="#0f172a" />
              <rect x="72" y="56" width="10" height="10" fill="#0f766e" />
              <rect x="42" y="66" width="8" height="8" fill="#0f172a" />
              <rect x="56" y="72" width="12" height="6" fill="#0f172a" />
              <rect x="44" y="82" width="16" height="6" fill="#0f766e" />
              <rect x="70" y="78" width="16" height="10" fill="#0f172a" />
            </svg>
            <div className="text-[10px] text-slate-500 font-mono mt-1 font-semibold uppercase tracking-wider">
              SmartBank Instant VPA
            </div>
          </div>

          {/* VPA Copy Box */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
            <div className="text-left overflow-hidden">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Personal SmartBank VPA
              </div>
              <div className="text-sm font-bold font-mono text-slate-900 truncate">
                {smartVpa}
              </div>
            </div>
            <button
              onClick={handleCopyVpa}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1 shrink-0 transition"
            >
              {copied ? <MdCheck size={14} className="text-emerald-600" /> : <MdContentCopy size={14} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>

          {/* Account Details Strip */}
          <div className="text-xs text-slate-500 flex items-center justify-center gap-2">
            <BsShieldCheck size={15} className="text-teal-600" />
            <span>Direct routing to Account ID: <strong>{account._id}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { BsLightningChargeFill, BsLockFill, BsUnlockFill } from "react-icons/bs";
import { MdSecurity, MdVisibility, MdVisibilityOff } from "react-icons/md";

export const VirtualCardManager = ({ account, userName = "VERIFIED HOLDER" }) => {
  const [isFrozen, setIsFrozen] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [dailyLimit, setDailyLimit] = useState(50000);
  const [copied, setCopied] = useState(false);

  const rawAccountId = account?._id ? account._id.toString() : "202511545300";
  const formattedCardNumber = `4532 •••• •••• ${rawAccountId.slice(-4)}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(rawAccountId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-800">SmartBank Virtual Platinum Debit Card</h3>
          <p className="text-xs text-slate-500">Instant Global Online Payments & Live Security Controls</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              isFrozen
                ? "bg-rose-100 text-rose-800 border border-rose-200"
                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
            }`}
          >
            {isFrozen ? <BsLockFill size={12} /> : <BsUnlockFill size={12} />}
            <span>{isFrozen ? "Card Locked / Frozen" : "Card Active"}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Virtual Card Graphic */}
        <div className="lg:col-span-6">
          <div
            className={`w-full h-56 sm:h-60 rounded-2xl p-6 sm:p-7 transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-xl ${
              isFrozen
                ? "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 opacity-75 grayscale"
                : "bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 border border-teal-500/30"
            }`}
          >
            {/* Hologram Accent */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-teal-400/10 rounded-full blur-2xl pointer-events-none"></div>

            {/* Top row */}
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-wider">SmartBank</span>
                <span className="text-[10px] uppercase font-bold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/60">
                  Debit
                </span>
              </div>
              <div className="text-amber-400 flex items-center gap-1 text-xs font-bold">
                <BsLightningChargeFill size={12} />
                <span>PLATINUM</span>
              </div>
            </div>

            {/* EMV Chip */}
            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-7 rounded bg-gradient-to-r from-amber-200 to-amber-400 shadow border border-amber-500/40"></div>
              <span className="font-mono text-xs text-slate-400 tracking-widest">((( • )))</span>
            </div>

            {/* Card Number & Details */}
            <div className="z-10 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-lg sm:text-xl font-bold tracking-widest text-slate-100">
                  {formattedCardNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-[11px] text-teal-300 hover:text-teal-200 font-semibold bg-white/10 px-2 py-0.5 rounded"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="flex justify-between items-end text-xs text-slate-300 pt-1">
                <div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider">Cardholder</div>
                  <div className="font-bold text-slate-100 uppercase tracking-wider">{userName}</div>
                </div>

                <div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider">Expires</div>
                  <div className="font-mono font-semibold">12/28</div>
                </div>

                <div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider">CVV</div>
                  <div className="font-mono font-bold text-teal-300">
                    {showCvv ? "842" : "•••"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Controls */}
        <div className="lg:col-span-6 space-y-5">
          {/* Freeze / Unfreeze Toggle */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Instant Card Freeze
              </h4>
              <p className="text-[11px] text-slate-500">
                {isFrozen
                  ? "Card is currently locked. All online & POS charges will be declined."
                  : "Lock your card instantly if misplaced or to prevent unauthorized charges."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFrozen(!isFrozen)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isFrozen
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-rose-600 hover:bg-rose-700 text-white"
              }`}
            >
              {isFrozen ? "Unfreeze Card" : "Freeze Card"}
            </button>
          </div>

          {/* Show / Hide CVV */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Sensitive CVV Visibility
              </h4>
              <p className="text-[11px] text-slate-500">
                {showCvv ? "CVV is displayed: 842" : "CVV is hidden for privacy."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCvv(!showCvv)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
            >
              {showCvv ? <MdVisibilityOff size={16} /> : <MdVisibility size={16} />}
              <span>{showCvv ? "Hide CVV" : "Show CVV"}</span>
            </button>
          </div>

          {/* Daily Limit Slider */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Daily Online Spending Limit
              </h4>
              <span className="text-xs font-extrabold text-teal-800">
                ₹{Number(dailyLimit).toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="200000"
              step="5000"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Min: ₹5,000</span>
              <span>Max: ₹2,00,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

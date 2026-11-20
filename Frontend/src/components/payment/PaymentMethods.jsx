import React, { useState } from "react";
import { FaCreditCard, FaUniversity, FaMobileAlt } from "react-icons/fa";
import { MdSecurity, MdCheckCircle, MdQrCodeScanner } from "react-icons/md";
import { BsShieldLockFill, BsCheck2Circle } from "react-icons/bs";
import { SiGooglepay, SiPhonepe, SiPaytm } from "react-icons/si";

export const PaymentMethods = ({
  title = "Secure Payment Gateway",
  selectedMethod: propSelectedMethod,
  onMethodChange,
  selectedBank: propSelectedBank,
  onBankChange,
  upiId: propUpiId,
  onUpiIdChange,
  cardData: propCardData,
  onCardDataChange,
}) => {
  // Fallback internal states for uncontrolled usage
  const [internalMethod, setInternalMethod] = useState("upi");
  const [internalUpiId, setInternalUpiId] = useState("user@okhdfcbank");
  const [internalBank, setInternalBank] = useState("HDFC Bank");
  const [internalCardData, setInternalCardData] = useState({
    number: "4532 8921 4450 1289",
    holder: "CARDHOLDER NAME",
    expiry: "12/28",
    cvv: "842",
  });

  const selectedMethod = propSelectedMethod !== undefined ? propSelectedMethod : internalMethod;
  const setSelectedMethod = (val) => {
    setInternalMethod(val);
    if (onMethodChange) onMethodChange(val);
  };

  const selectedBank = propSelectedBank !== undefined ? propSelectedBank : internalBank;
  const setSelectedBank = (val) => {
    setInternalBank(val);
    if (onBankChange) onBankChange(val);
  };

  const upiId = propUpiId !== undefined ? propUpiId : internalUpiId;
  const setUpiId = (val) => {
    setInternalUpiId(val);
    if (onUpiIdChange) onUpiIdChange(val);
  };

  const cardData = propCardData !== undefined ? propCardData : internalCardData;
  const updateCardField = (field, val) => {
    if (onCardDataChange) {
      onCardDataChange(field, val);
    } else {
      setInternalCardData((prev) => ({ ...prev, [field]: val }));
    }
  };

  const popularBanks = [
    { name: "HDFC Bank", code: "HDFC", color: "from-blue-900 to-indigo-900" },
    { name: "State Bank of India", code: "SBI", color: "from-sky-700 to-blue-900" },
    { name: "ICICI Bank", code: "ICICI", color: "from-amber-700 to-orange-900" },
    { name: "Axis Bank", code: "AXIS", color: "from-rose-800 to-pink-950" },
    { name: "Kotak Mahindra", code: "KOTAK", color: "from-red-700 to-red-950" },
    { name: "Punjab National Bank", code: "PNB", color: "from-yellow-700 to-amber-950" },
  ];

  const otherBanks = [
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "IndusInd Bank",
    "Yes Bank",
    "Federal Bank",
    "IDFC FIRST Bank",
  ];

  const upiPresets = [
    { label: "Google Pay", handle: "user@okaxis", icon: SiGooglepay },
    { label: "PhonePe", handle: "user@ybl", icon: SiPhonepe },
    { label: "Paytm", handle: "user@paytm", icon: SiPaytm },
    { label: "HDFC UPI", handle: "user@okhdfcbank", icon: FaMobileAlt },
  ];

  const presetCards = [
    { name: "Visa Classic", number: "4532 8921 4450 1289", expiry: "12/28", cvv: "842", holder: "DECKER SHAW" },
    { name: "Mastercard World", number: "5241 6390 1284 9012", expiry: "08/29", cvv: "319", holder: "ALEXANDER PIERCE" },
    { name: "RuPay Platinum", number: "6071 8920 4410 5519", expiry: "11/27", cvv: "671", holder: "PRIYA SHARMA" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm my-6">
      {/* Gateway Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
            <BsShieldLockFill size={20} />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-800">{title}</h4>
            <p className="text-xs text-slate-500">PCI-DSS Level 1 Encrypted • Verified Multi-Channel Sandbox</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
          <span>Gateway Active</span>
        </div>
      </div>

      {/* Payment Channel Tabs */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setSelectedMethod("upi")}
          className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-bold transition-all ${
            selectedMethod === "upi"
              ? "border-teal-600 bg-teal-50/70 text-teal-900 shadow-sm ring-2 ring-teal-500/20"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FaMobileAlt size={22} className={`mb-1.5 ${selectedMethod === "upi" ? "text-teal-700" : "text-teal-600"}`} />
          <span>UPI / QR</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMethod("card")}
          className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-bold transition-all ${
            selectedMethod === "card"
              ? "border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-sm ring-2 ring-indigo-500/20"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FaCreditCard size={22} className={`mb-1.5 ${selectedMethod === "card" ? "text-indigo-700" : "text-indigo-600"}`} />
          <span>Credit / Debit Cards</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMethod("netbanking")}
          className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-bold transition-all ${
            selectedMethod === "netbanking"
              ? "border-amber-600 bg-amber-50/70 text-amber-900 shadow-sm ring-2 ring-amber-500/20"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FaUniversity size={22} className={`mb-1.5 ${selectedMethod === "netbanking" ? "text-amber-700" : "text-amber-600"}`} />
          <span>Net Banking</span>
        </button>
      </div>

      {/* --- UPI Details --- */}
      {selectedMethod === "upi" && (
        <div className="space-y-4 animate-fadeIn">
          {/* Quick UPI Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select UPI App or Provider
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {upiPresets.map((preset) => {
                const IconComponent = preset.icon;
                const isSelected = upiId === preset.handle;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setUpiId(preset.handle)}
                    className={`flex items-center justify-center gap-2 p-2 rounded-xl border text-xs font-semibold transition ${
                      isSelected
                        ? "border-teal-600 bg-teal-50 text-teal-800 font-bold"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <IconComponent size={16} />
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Enter / Verify UPI ID (VPA)
            </label>
            <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent">
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@bank"
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 font-mono focus:outline-none"
              />
              <span className="bg-teal-50 text-teal-800 px-3 py-2.5 text-xs font-bold border-l border-slate-300 flex items-center gap-1">
                <BsCheck2Circle size={14} className="text-teal-600" />
                VERIFIED
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports Google Pay, PhonePe, Paytm, BHIM, Cred, and all major UPI handles.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-teal-50/50 rounded-xl border border-teal-200 text-xs text-slate-600">
            <MdQrCodeScanner size={26} className="text-teal-700 shrink-0" />
            <div>
              <span className="font-bold text-slate-800">Instant UPI 2.0 Switch Simulation</span>
              <p className="text-[11px] text-slate-500">
                You will authorize the deposit via UPI MPIN handshake on the next step.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- Card Details --- */}
      {selectedMethod === "card" && (
        <div className="space-y-4 animate-fadeIn">
          {/* Preset Cards for Fast Sandbox Testing */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Quick Test Cards (Sandbox)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {presetCards.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    updateCardField("number", preset.number);
                    updateCardField("expiry", preset.expiry);
                    updateCardField("cvv", preset.cvv);
                    updateCardField("holder", preset.holder);
                  }}
                  className={`p-2 rounded-xl border text-xs text-left transition ${
                    cardData.number === preset.number
                      ? "border-indigo-600 bg-indigo-50 text-indigo-900 font-bold"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="font-bold">{preset.name}</div>
                  <div className="font-mono text-[11px] text-slate-500">•••• {preset.number.slice(-4)}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Card Number
            </label>
            <input
              type="text"
              value={cardData.number}
              onChange={(e) => updateCardField("number", e.target.value)}
              placeholder="4532 8921 4450 1289"
              className="w-full px-3.5 py-2 text-sm text-slate-800 font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                value={cardData.expiry}
                onChange={(e) => updateCardField("expiry", e.target.value)}
                placeholder="MM/YY"
                className="w-full px-3.5 py-2 text-sm text-slate-800 font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                CVV / CVC
              </label>
              <input
                type="password"
                maxLength={4}
                value={cardData.cvv}
                onChange={(e) => updateCardField("cvv", e.target.value)}
                placeholder="•••"
                className="w-full px-3.5 py-2 text-sm text-slate-800 font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardData.holder}
              onChange={(e) => updateCardField("holder", e.target.value)}
              placeholder="CARDHOLDER NAME"
              className="w-full px-3.5 py-2 text-sm text-slate-800 uppercase border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* --- Net Banking Details --- */}
      {selectedMethod === "netbanking" && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Popular Banks
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {popularBanks.map((bank) => {
                const isSelected = selectedBank === bank.name;
                return (
                  <button
                    key={bank.code}
                    type="button"
                    onClick={() => setSelectedBank(bank.name)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-center transition flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? "border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-sm ring-2 ring-amber-500/20"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-bold text-xs">{bank.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">[{bank.code}]</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Other Banks Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Or Select Another Bank
            </label>
            <select
              value={popularBanks.some((b) => b.name === selectedBank) ? "" : selectedBank}
              onChange={(e) => {
                if (e.target.value) setSelectedBank(e.target.value);
              }}
              className="w-full px-3.5 py-2 text-sm text-slate-800 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            >
              <option value="">-- Choose from Other Indian Banks --</option>
              {otherBanks.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <div>
              <span className="text-slate-500">Active Bank Gateway: </span>
              <strong className="text-amber-900 font-bold">{selectedBank}</strong>
            </div>
            <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">
              Direct API
            </span>
          </div>
        </div>
      )}

      {/* Security Assurance */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <MdSecurity size={15} className="text-teal-600" />
          <span>256-bit End-to-End SSL Encryption</span>
        </div>
        <span className="font-semibold text-slate-400">Zero Gateway Surcharge</span>
      </div>
    </div>
  );
};

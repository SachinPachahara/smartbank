import React, { useState } from "react";
import { FaCreditCard, FaUniversity, FaMobileAlt } from "react-icons/fa";
import { MdSecurity, MdCheckCircle, MdQrCodeScanner } from "react-icons/md";
import { BsShieldLockFill } from "react-icons/bs";

export const PaymentMethods = ({ title = "Secure Payment Gateway" }) => {
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [upiId, setUpiId] = useState("user@okhdfcbank");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [cardNumber, setCardNumber] = useState("4532 8921 4450 1289");
  const [cardHolder, setCardHolder] = useState("CARDHOLDER NAME");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("842");

  const popularBanks = [
    { name: "HDFC Bank", code: "HDFC" },
    { name: "State Bank of India", code: "SBI" },
    { name: "ICICI Bank", code: "ICICI" },
    { name: "Axis Bank", code: "AXIS" },
    { name: "Kotak Mahindra", code: "KOTAK" },
    { name: "Punjab National Bank", code: "PNB" },
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
            <p className="text-xs text-slate-500">PCI-DSS Level 1 Encrypted • Verified Sandbox Flow</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
          <span>Gateway Active</span>
        </div>
      </div>

      {/* Payment Tabs */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setSelectedMethod("upi")}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
            selectedMethod === "upi"
              ? "border-teal-600 bg-teal-50/60 text-teal-800 shadow-sm"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FaMobileAlt size={20} className="mb-1.5 text-teal-600" />
          <span>UPI / QR</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMethod("card")}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
            selectedMethod === "card"
              ? "border-teal-600 bg-teal-50/60 text-teal-800 shadow-sm"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FaCreditCard size={20} className="mb-1.5 text-indigo-600" />
          <span>Cards</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMethod("netbanking")}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
            selectedMethod === "netbanking"
              ? "border-teal-600 bg-teal-50/60 text-teal-800 shadow-sm"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FaUniversity size={20} className="mb-1.5 text-amber-600" />
          <span>Net Banking</span>
        </button>
      </div>

      {/* UPI Details */}
      {selectedMethod === "upi" && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Enter UPI ID / VPA
            </label>
            <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent">
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@okhdfcbank"
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none"
              />
              <span className="bg-slate-100 px-3 py-2.5 text-xs text-slate-500 font-semibold border-l border-slate-300 flex items-center">
                VERIFIED
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports Google Pay, PhonePe, Paytm, BHIM, and all banking apps.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <MdQrCodeScanner size={24} className="text-teal-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-800">Direct QR Simulation Enabled</span>
              <p className="text-[11px] text-slate-500">Payment request will be verified instantly upon confirmation.</p>
            </div>
          </div>
        </div>
      )}

      {/* Card Details */}
      {selectedMethod === "card" && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Card Number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4532 8921 4450 1289"
              className="w-full px-3.5 py-2 text-sm text-slate-800 font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="MM/YY"
                className="w-full px-3.5 py-2 text-sm text-slate-800 font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                CVV / CVC
              </label>
              <input
                type="password"
                maxLength={4}
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
                placeholder="•••"
                className="w-full px-3.5 py-2 text-sm text-slate-800 font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Name on Card
            </label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3.5 py-2 text-sm text-slate-800 uppercase border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Net Banking Details */}
      {selectedMethod === "netbanking" && (
        <div className="space-y-4 animate-fadeIn">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select Your Bank
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {popularBanks.map((bank) => (
              <button
                key={bank.code}
                type="button"
                onClick={() => setSelectedBank(bank.name)}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                  selectedBank === bank.name
                    ? "border-teal-600 bg-teal-50 text-teal-800 font-bold"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {bank.name}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Selected: <strong className="text-slate-800">{selectedBank}</strong> (Direct simulated authentication gateway)
          </p>
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

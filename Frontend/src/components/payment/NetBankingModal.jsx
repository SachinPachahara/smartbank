import React, { useState } from "react";
import { MdClose, MdSecurity, MdLock, MdCheckCircle } from "react-icons/md";
import { FaUniversity } from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";

export const NetBankingModal = ({
  isOpen,
  onClose,
  onAuthorize,
  amount,
  bankName = "HDFC Bank",
  isLoading,
}) => {
  const [customerId, setCustomerId] = useState("");
  const [netPassword, setNetPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // Step 1: Netbanking Login, Step 2: Bank OTP

  if (!isOpen) return null;

  const handleAutoFillDemo = () => {
    setCustomerId("98421055");
    setNetPassword("Hdfc@Secure2026");
    setOtp("742910");
    setError("");
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!customerId || !netPassword) {
      setError("Please enter your NetBanking Customer ID and Password.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the 6-digit Bank OTP.");
      return;
    }
    setError("");
    onAuthorize({ customerId, bankName });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Bank Portal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold">
              <FaUniversity size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">{bankName}</h3>
                <span className="text-[10px] bg-teal-900 text-teal-300 px-1.5 py-0.2 rounded font-mono font-bold">
                  SANDBOX
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Official NetBanking Payment Gateway
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-white rounded-full transition"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Amount Summary Bar */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-600 font-medium">Payment to SmartBank:</span>
          <span className="font-extrabold text-teal-800 text-sm">
            ₹{Number(amount || 0).toLocaleString("en-IN")}
          </span>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* Quick Demo Helper */}
          <div className="mb-4 p-2.5 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs">
            <span className="text-teal-800 font-medium text-[11px]">
              Testing sandbox flow?
            </span>
            <button
              type="button"
              onClick={handleAutoFillDemo}
              className="font-bold text-teal-700 hover:text-teal-900 underline text-[11px]"
            >
              Auto-fill Demo Credentials
            </button>
          </div>

          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Customer ID / User ID
                </label>
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="e.g. 98421055"
                  className="w-full px-3.5 py-2 text-sm text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  NetBanking IPIN / Password
                </label>
                <input
                  type="password"
                  value={netPassword}
                  onChange={(e) => setNetPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2 text-sm text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-rose-600 font-semibold">{error}</p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <MdLock size={15} />
                  <span>Login & Continue to OTP</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleFinalSubmit} className="space-y-4 animate-fadeIn">
              <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500">
                  Bank OTP sent to your registered mobile ending in <strong>••• 420</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Enter 6-Digit Bank OTP
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="742910"
                  className="w-full px-3.5 py-2.5 text-center text-lg font-mono font-bold tracking-widest text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-rose-600 font-semibold">{error}</p>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="w-1/3 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                >
                  {isLoading ? (
                    <span>Authorizing with Bank...</span>
                  ) : (
                    <>
                      <MdCheckCircle size={16} />
                      <span>Confirm & Pay ₹{Number(amount || 0).toLocaleString("en-IN")}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Bank Security Notice */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-500">
              <BsShieldCheck size={13} className="text-teal-600" />
              128-bit Encrypted Session
            </span>
            <span>Zero Surcharge</span>
          </div>
        </div>
      </div>
    </div>
  );
};

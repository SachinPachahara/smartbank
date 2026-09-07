import React, { useState, useEffect } from "react";
import { MdSecurity, MdClose, MdLock, MdCheckCircle } from "react-icons/md";
import { BsShieldLockFill } from "react-icons/bs";

export const TwoFactorModal = ({
  isOpen,
  onClose,
  onConfirm,
  amount,
  recipientId,
  isLoading,
  actionType = "Transfer",
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setCountdown(60);
      setError("");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleAutoFillDemo = () => {
    setOtp(["8", "4", "9", "2", "0", "1"]);
    setError("");
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      setError("Please enter complete 6-digit authentication PIN.");
      return;
    }
    setError("");
    onConfirm(enteredOtp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-100 text-teal-800 rounded-lg">
              <BsShieldLockFill size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                2-Factor Security Handshake
              </h3>
              <p className="text-[11px] text-slate-500">
                High-Security Financial Authorization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full transition"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Transfer Details Card */}
        <div className="p-6 space-y-5">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Authorization Type:</span>
              <span className="font-bold text-slate-800 uppercase">{actionType}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Amount to Settle:</span>
              <span className="font-bold text-teal-700 text-sm">
                ₹{Number(amount || 0).toLocaleString("en-IN")}
              </span>
            </div>
            {recipientId && (
              <div className="flex justify-between text-slate-600">
                <span>Beneficiary ID:</span>
                <span className="font-mono font-bold text-slate-800">{recipientId}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
              <span>Anti-Fraud Check:</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <MdCheckCircle size={13} /> Velocity Passed
              </span>
            </div>
          </div>

          {/* OTP Input Fields */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Enter 6-Digit Transaction PIN / OTP
              </label>
              <button
                type="button"
                onClick={handleAutoFillDemo}
                className="text-[11px] font-bold text-teal-700 hover:underline"
              >
                Auto-fill (849201)
              </button>
            </div>

            <div className="flex justify-between gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-12 text-center text-xl font-bold font-mono rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500 focus:outline-none transition shadow-sm text-slate-800"
                />
              ))}
            </div>

            {error && (
              <p className="text-xs text-rose-600 font-semibold mt-1">{error}</p>
            )}

            <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
              <span>
                Code valid for:{" "}
                <strong className="text-slate-700">{countdown}s</strong>
              </span>
              <button
                type="button"
                onClick={() => setCountdown(60)}
                className="text-teal-700 font-semibold hover:underline"
              >
                Resend Code
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleVerify}
              disabled={isLoading}
              className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <span>Settling...</span>
              ) : (
                <>
                  <MdLock size={14} />
                  <span>Verify & Authorize</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

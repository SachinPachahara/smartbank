import React, { useState } from "react";
import axios from "axios";
import {
  FaTimes,
  FaShieldAlt,
  FaKey,
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
} from "react-icons/fa";

export default function ForgotPasswordModal({ isOpen, onClose, userType = "user" }) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password, 3: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [simulatedOtp, setSimulatedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? userType === "admin"
        ? "https://ebank-2t3r.onrender.com/api/admins/"
        : "https://ebank-2t3r.onrender.com/api/users/"
      : userType === "admin"
      ? "http://localhost:5000/api/admins/"
      : "http://localhost:5000/api/users/";

  // Password rules validation
  const hasMinLength = newPassword.length >= 12;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isPasswordValid =
    hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial && passwordsMatch;

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        baseUrl + "forgot-password",
        { email: email.trim() },
        { headers: { "Content-Type": "application/json" } }
      );

      setSimulatedOtp(res.data.simulatedOtp || "");
      setSuccessMsg(res.data.message || "OTP generated successfully");
      setIsLoading(false);
      setStep(2);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(
        err.response?.data || "Unable to process password reset. Please verify your email address."
      );
    }
  };

  // Step 2: Reset Password with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setErrorMsg("Please ensure your new password satisfies all banking security requirements.");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        baseUrl + "reset-password",
        {
          email: email.trim(),
          otp: otp.trim(),
          newPassword,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setIsLoading(false);
      setSuccessMsg(res.data.message || "Password successfully reset!");
      setStep(3);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(
        err.response?.data || "Invalid or expired OTP code. Please verify and try again."
      );
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setSimulatedOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMsg("");
    setSuccessMsg("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden relative">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 text-blue-200 hover:text-white transition p-1"
            title="Close"
          >
            <FaTimes size={18} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-700/50 rounded-xl border border-blue-400/30">
              <FaShieldAlt className="text-emerald-400 text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">SmartBank Security</h3>
              <p className="text-xs text-blue-200 font-medium">
                {userType === "admin" ? "Administrator" : "Customer"} Password Recovery
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs font-semibold">
              <FaExclamationCircle className="mt-0.5 flex-shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Registered Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-800 transition"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Enter your registered account email to receive a secure 6-digit one-time password (OTP).
                </p>
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-1/2 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-1/2 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50"
                >
                  {isLoading ? "Verifying..." : "Send OTP"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: OTP & New Password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {simulatedOtp && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Sandbox Simulation OTP
                    </span>
                    <span className="text-lg font-mono font-extrabold text-emerald-700 tracking-widest">
                      {simulatedOtp}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtp(simulatedOtp)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  6-Digit OTP Code
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <FaKey />
                  </span>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono tracking-widest focus:bg-white focus:outline-none focus:border-blue-600 text-slate-800 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter strong password"
                    required
                    className="w-full px-3 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-blue-600 text-slate-800 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-blue-600 text-slate-800 transition"
                />
              </div>

              {/* Password entropy rules checklist */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[11px]">
                <div className={`flex items-center space-x-1.5 ${hasMinLength ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                  <FaCheckCircle className="text-[10px]" />
                  <span>12+ characters long</span>
                </div>
                <div className={`flex items-center space-x-1.5 ${hasUpper && hasLower ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                  <FaCheckCircle className="text-[10px]" />
                  <span>Uppercase & lowercase letters</span>
                </div>
                <div className={`flex items-center space-x-1.5 ${hasNumber && hasSpecial ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                  <FaCheckCircle className="text-[10px]" />
                  <span>Number & symbol (!@#$%^&*)</span>
                </div>
                <div className={`flex items-center space-x-1.5 ${passwordsMatch ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                  <FaCheckCircle className="text-[10px]" />
                  <span>Passwords match</span>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !isPasswordValid || otp.length !== 6}
                  className="w-2/3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50"
                >
                  {isLoading ? "Updating..." : "Reset Password"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Success State */}
          {step === 3 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 text-2xl shadow-inner">
                <FaCheckCircle />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">Password Reset Successfully!</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Your new credentials are now active. You can log in immediately with your new password.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-md transition"
              >
                Proceed to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

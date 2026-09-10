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
  FaMagic,
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

  // Localhost detection ensures we always hit local port 5000 during dev/testing
  const isLocal =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.port === "3000" ||
      window.location.port === "5173");

  const baseUrl = isLocal
    ? userType === "admin"
      ? "http://localhost:5000/api/admins/"
      : "http://localhost:5000/api/users/"
    : userType === "admin"
    ? "https://ebank-2t3r.onrender.com/api/admins/"
    : "https://ebank-2t3r.onrender.com/api/users/";

  // Password requirements validation (8+ characters with uppercase, lowercase, number, special symbol)
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Generate strong password helper
  const handleGeneratePassword = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generated = `SmartBank@${randomSuffix}!`;
    setNewPassword(generated);
    setConfirmPassword(generated);
    setErrorMsg("");
  };

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg("Please provide your registered account email address.");
      return;
    }

    setIsLoading(true);

    try {
      console.log(`[SmartBank Auth] Requesting OTP for ${cleanEmail} via ${baseUrl}forgot-password`);
      const res = await axios.post(
        baseUrl + "forgot-password",
        { email: cleanEmail },
        { headers: { "Content-Type": "application/json" } }
      );

      const otpCode = res.data?.simulatedOtp ? res.data.simulatedOtp.toString() : "";
      setSimulatedOtp(otpCode);
      if (otpCode) {
        setOtp(otpCode);
      }

      setSuccessMsg(res.data?.message || "OTP generated successfully!");
      setIsLoading(false);
      setStep(2);
    } catch (err) {
      console.error("[SmartBank Auth] Request OTP error:", err);
      setIsLoading(false);
      const errMsg =
        err.response?.data ||
        (typeof err.response?.data === "string" ? err.response.data : err.response?.data?.message) ||
        err.message ||
        "Unable to process request. Please check your email address.";
      setErrorMsg(errMsg);
    }
  };

  // Step 2: Reset Password with OTP
  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      setErrorMsg("Please enter the 6-digit OTP verification code.");
      return;
    }
    if (cleanOtp.length !== 6) {
      setErrorMsg(`OTP code must be exactly 6 digits (currently ${cleanOtp.length} digits).`);
      return;
    }
    if (!newPassword) {
      setErrorMsg("Please enter a new password.");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg(
        `Password must be at least 8 characters long (currently ${newPassword.length} characters).`
      );
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setErrorMsg("Password must contain at least one uppercase letter (A-Z).");
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setErrorMsg("Password must contain at least one lowercase letter (a-z).");
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setErrorMsg("Password must contain at least one number (0-9).");
      return;
    }
    if (!/[!@#$%^&*]/.test(newPassword)) {
      setErrorMsg("Password must contain at least one special character (!@#$%^&*).");
      return;
    }
    if (!confirmPassword) {
      setErrorMsg("Please re-type your password in the Confirm Password field.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify both fields.");
      return;
    }

    setIsLoading(true);

    try {
      console.log(`[SmartBank Auth] Submitting reset password for ${email.trim()} to ${baseUrl}reset-password`);
      const res = await axios.post(
        baseUrl + "reset-password",
        {
          email: email.trim(),
          otp: cleanOtp,
          newPassword,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("[SmartBank Auth] Password reset response:", res.data);
      setIsLoading(false);
      setSuccessMsg(res.data?.message || "Password successfully reset!");
      setStep(3);
    } catch (err) {
      console.error("[SmartBank Auth] Reset Password error:", err);
      setIsLoading(false);
      const errMsg =
        err.response?.data ||
        (typeof err.response?.data === "string" ? err.response.data : err.response?.data?.message) ||
        err.message ||
        "Invalid or expired OTP code. Please verify and try again.";
      setErrorMsg(errMsg);
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Registered Email Address
                  </label>
                  <button
                    type="button"
                    onClick={() => setEmail(userType === "admin" ? "sk2058742@gmail.com" : "s85319748@gmail.com")}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    Use Demo Email
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={userType === "admin" ? "admin@smartbank.com" : "client@example.com"}
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
                  className="w-1/2 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <span>Send OTP</span>
                  )}
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
                    Auto-Fill OTP
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    New Password
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1 hover:underline"
                  >
                    <FaMagic className="text-blue-500" />
                    <span>Suggest Strong Password</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
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
                  placeholder="Re-type new password"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-blue-600 text-slate-800 transition"
                />
              </div>

              {/* Password entropy rules checklist */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[11px]">
                <div className={`flex items-center space-x-1.5 ${hasMinLength ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                  <FaCheckCircle className="text-[10px]" />
                  <span>8+ characters long</span>
                </div>
                <div className={`flex items-center space-x-1.5 ${hasUpper && hasLower ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                  <FaCheckCircle className="text-[10px]" />
                  <span>Uppercase (A-Z) & Lowercase (a-z)</span>
                </div>
                <div className={`flex items-center space-x-1.5 ${hasNumber && hasSpecial ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                  <FaCheckCircle className="text-[10px]" />
                  <span>Number (0-9) & Symbol (!@#$%^&*)</span>
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
                {/* Reset Password button is ALWAYS clickable so an action always occurs */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Resetting Password...</span>
                    </>
                  ) : (
                    <span>Reset Password</span>
                  )}
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

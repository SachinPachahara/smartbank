import React, { useState, useEffect } from "react";
import { MdClose, MdSecurity, MdLock, MdCheckCircle, MdQrCode2 } from "react-icons/md";
import { FaUniversity, FaMobileAlt, FaCreditCard } from "react-icons/fa";
import { BsShieldCheck, BsKeyFill } from "react-icons/bs";
import { SiGooglepay, SiPhonepe } from "react-icons/si";

const BANK_THEMES = {
  "HDFC Bank": {
    code: "HDFC",
    headerBg: "bg-blue-900",
    badgeBg: "bg-blue-950 text-blue-200 border-blue-800",
    primaryBtn: "bg-blue-800 hover:bg-blue-900",
    idLabel: "Customer ID / User ID",
    idPlaceholder: "e.g. 98421055",
    demoUser: "98421055",
    demoPass: "Hdfc@Secure2026",
    demoOtp: "742910",
  },
  "State Bank of India": {
    code: "SBI",
    headerBg: "bg-sky-800",
    badgeBg: "bg-sky-950 text-sky-200 border-sky-700",
    primaryBtn: "bg-sky-700 hover:bg-sky-800",
    idLabel: "SBI INB Username",
    idPlaceholder: "e.g. SBI_RETAIL_9842",
    demoUser: "SBI_RETAIL_9842",
    demoPass: "Sbi@Secure2026",
    demoOtp: "582104",
  },
  "ICICI Bank": {
    code: "ICICI",
    headerBg: "bg-amber-800",
    badgeBg: "bg-amber-950 text-amber-200 border-amber-700",
    primaryBtn: "bg-amber-700 hover:bg-amber-800",
    idLabel: "User ID / Registered Mobile",
    idPlaceholder: "e.g. ICICI_USER_4102",
    demoUser: "ICICI_USER_4102",
    demoPass: "Icici@Net2026",
    demoOtp: "639201",
  },
  "Axis Bank": {
    code: "AXIS",
    headerBg: "bg-rose-900",
    badgeBg: "bg-rose-950 text-rose-200 border-rose-700",
    primaryBtn: "bg-rose-800 hover:bg-rose-900",
    idLabel: "Login ID / Customer ID",
    idPlaceholder: "e.g. AXIS_910452",
    demoUser: "AXIS_910452",
    demoPass: "Axis@Gate2026",
    demoOtp: "419820",
  },
  "Kotak Mahindra": {
    code: "KOTAK",
    headerBg: "bg-red-900",
    badgeBg: "bg-red-950 text-red-200 border-red-700",
    primaryBtn: "bg-red-800 hover:bg-red-900",
    idLabel: "CRN / Nickname / Mobile",
    idPlaceholder: "e.g. CRN_8819204",
    demoUser: "CRN_8819204",
    demoPass: "Kotak@Pass2026",
    demoOtp: "592184",
  },
  "Punjab National Bank": {
    code: "PNB",
    headerBg: "bg-yellow-900",
    badgeBg: "bg-yellow-950 text-yellow-200 border-yellow-700",
    primaryBtn: "bg-yellow-800 hover:bg-yellow-900",
    idLabel: "PNB User ID",
    idPlaceholder: "e.g. PNB_CORP_3391",
    demoUser: "PNB_CORP_3391",
    demoPass: "Pnb@Safe2026",
    demoOtp: "830194",
  },
};

export const NetBankingModal = ({
  isOpen,
  onClose,
  onAuthorize,
  amount,
  method = "netbanking",
  bankName = "HDFC Bank",
  upiId = "user@okhdfcbank",
  cardData = {
    number: "4532 8921 4450 1289",
    holder: "CARDHOLDER NAME",
    expiry: "12/28",
    cvv: "842",
  },
  isLoading,
}) => {
  // NetBanking state
  const [customerId, setCustomerId] = useState("");
  const [netPassword, setNetPassword] = useState("");
  const [nbOtp, setNbOtp] = useState("");

  // UPI state
  const [upiPin, setUpiPin] = useState("");

  // Card state
  const [cardOtp, setCardOtp] = useState("");

  // Shared state
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  // Bank Theme configuration
  const currentBankTheme = BANK_THEMES[bankName] || {
    code: bankName.substring(0, 4).toUpperCase(),
    headerBg: "bg-slate-900",
    badgeBg: "bg-slate-950 text-slate-200 border-slate-700",
    primaryBtn: "bg-teal-700 hover:bg-teal-800",
    idLabel: `${bankName} Customer ID`,
    idPlaceholder: "Enter User / Customer ID",
    demoUser: `${bankName.substring(0, 3).toUpperCase()}_USER_101`,
    demoPass: "Bank@Secure2026",
    demoOtp: "654321",
  };

  // Reset internal states on open or method/bank change
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setError("");
      setCustomerId("");
      setNetPassword("");
      setNbOtp("");
      setUpiPin("");
      setCardOtp("");
    }
  }, [isOpen, method, bankName]);

  if (!isOpen) return null;

  // --- Auto-Fill Handlers ---
  const handleAutoFillNetBanking = () => {
    setCustomerId(currentBankTheme.demoUser);
    setNetPassword(currentBankTheme.demoPass);
    setNbOtp(currentBankTheme.demoOtp);
    setError("");
  };

  const handleAutoFillUpi = () => {
    setUpiPin("482910");
    setError("");
  };

  const handleAutoFillCard = () => {
    setCardOtp("852914");
    setError("");
  };

  // --- Submission Handlers ---
  const handleNetBankingStep1 = (e) => {
    e.preventDefault();
    if (!customerId || !netPassword) {
      setError(`Please enter your ${bankName} credentials.`);
      return;
    }
    setError("");
    setStep(2);
  };

  const handleNetBankingFinal = (e) => {
    e.preventDefault();
    if (!nbOtp) {
      setError("Please enter the 6-digit Bank OTP.");
      return;
    }
    setError("");
    onAuthorize({
      method: "netbanking",
      bankName,
      customerId,
    });
  };

  const handleUpiSubmit = (e) => {
    e.preventDefault();
    if (!upiPin || upiPin.length < 4) {
      setError("Please enter your 4 or 6-digit UPI MPIN.");
      return;
    }
    setError("");
    onAuthorize({
      method: "upi",
      upiId,
      upiPin,
    });
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (!cardOtp || cardOtp.length < 6) {
      setError("Please enter the 6-digit Card 3D Secure OTP.");
      return;
    }
    setError("");
    onAuthorize({
      method: "card",
      cardNumber: cardData.number,
      cardOtp,
    });
  };

  const formattedAmount = `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  const cardLast4 = (cardData.number || "1289").replace(/\s/g, "").slice(-4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">

        {/* ============================================================ */}
        {/* MODAL HEADER - Dynamic according to payment method & bank    */}
        {/* ============================================================ */}
        {method === "upi" ? (
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-800 to-emerald-900 text-white border-b border-teal-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600/80 flex items-center justify-center text-white">
                <FaMobileAlt size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">UPI Payment Gateway</h3>
                  <span className="text-[10px] bg-teal-950 text-teal-300 px-1.5 py-0.5 rounded font-mono font-bold border border-teal-600">
                    NPCI 2.0
                  </span>
                </div>
                <p className="text-[11px] text-teal-200 font-mono">
                  Instant Real-Time Settlement Simulation
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1.5 text-teal-200 hover:text-white rounded-full transition"
            >
              <MdClose size={20} />
            </button>
          </div>
        ) : method === "card" ? (
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-900 to-slate-900 text-white border-b border-indigo-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-700/80 flex items-center justify-center text-white">
                <FaCreditCard size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Card 3D Secure 2.0</h3>
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded font-mono font-bold border border-indigo-700">
                    PCI-DSS
                  </span>
                </div>
                <p className="text-[11px] text-indigo-200 font-mono">
                  Verified by Visa / Mastercard / RuPay
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1.5 text-indigo-200 hover:text-white rounded-full transition"
            >
              <MdClose size={20} />
            </button>
          </div>
        ) : (
          /* NetBanking Header */
          <div className={`flex items-center justify-between px-6 py-4 ${currentBankTheme.headerBg} text-white border-b border-slate-800`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold">
                <FaUniversity size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{bankName}</h3>
                  <span className={`text-[10px] ${currentBankTheme.badgeBg} px-1.5 py-0.5 rounded font-mono font-bold border`}>
                    SANDBOX
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-mono">
                  Official NetBanking Payment Gateway
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1.5 text-slate-300 hover:text-white rounded-full transition"
            >
              <MdClose size={20} />
            </button>
          </div>
        )}

        {/* Amount Summary Bar */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-600 font-medium">Payment to SmartBank:</span>
          <span className="font-extrabold text-teal-800 text-sm">
            {formattedAmount}
          </span>
        </div>

        {/* Modal Form Body */}
        <div className="p-6">

          {/* ============================================================ */}
          {/* METHOD 1: UPI / QR PAYMENT                                   */}
          {/* ============================================================ */}
          {method === "upi" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 block">Paying through UPI VPA:</span>
                  <span className="font-bold text-teal-900 font-mono">{upiId || "user@upi"}</span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillUpi}
                  className="font-bold text-teal-700 hover:text-teal-900 underline text-[11px]"
                >
                  Auto-fill Demo PIN
                </button>
              </div>

              <form onSubmit={handleUpiSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Enter 4 or 6-Digit UPI MPIN
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      maxLength={6}
                      value={upiPin}
                      onChange={(e) => setUpiPin(e.target.value)}
                      placeholder="••••••"
                      className="w-full px-4 py-3 text-center text-xl font-mono font-bold tracking-widest text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
                      required
                    />
                    <div className="absolute right-3 top-3.5 text-slate-400">
                      <BsKeyFill size={18} />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Simulates your UPI app authorization handshake (Google Pay / PhonePe / Paytm).
                  </p>
                </div>

                {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="w-1/3 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-2/3 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    {isLoading ? (
                      <span>Authorizing UPI Switch...</span>
                    ) : (
                      <>
                        <MdCheckCircle size={16} />
                        <span>Authorize & Deposit {formattedAmount}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================ */}
          {/* METHOD 2: CREDIT / DEBIT CARDS 3DS                           */}
          {/* ============================================================ */}
          {method === "card" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 block">Card Ending In:</span>
                  <span className="font-bold text-indigo-900 font-mono">•••• •••• •••• {cardLast4}</span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillCard}
                  className="font-bold text-indigo-700 hover:text-indigo-900 underline text-[11px]"
                >
                  Auto-fill Demo OTP
                </button>
              </div>

              <form onSubmit={handleCardSubmit} className="space-y-4">
                <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-600">
                    3D Secure OTP sent to cardholder's mobile ending in <strong>••• 420</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Enter 6-Digit 3DS OTP
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={cardOtp}
                    onChange={(e) => setCardOtp(e.target.value)}
                    placeholder="852914"
                    className="w-full px-4 py-2.5 text-center text-lg font-mono font-bold tracking-widest text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                    required
                  />
                </div>

                {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="w-1/3 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-2/3 py-2.5 px-4 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    {isLoading ? (
                      <span>Authorizing Card...</span>
                    ) : (
                      <>
                        <MdCheckCircle size={16} />
                        <span>Pay {formattedAmount}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================ */}
          {/* METHOD 3: NET BANKING (BANK-SPECIFIC)                         */}
          {/* ============================================================ */}
          {method === "netbanking" && (
            <div>
              {/* Quick Demo Helper */}
              <div className="mb-4 p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium text-[11px]">
                  Testing {bankName} sandbox?
                </span>
                <button
                  type="button"
                  onClick={handleAutoFillNetBanking}
                  className="font-bold text-teal-700 hover:text-teal-900 underline text-[11px]"
                >
                  Auto-fill Demo Credentials
                </button>
              </div>

              {step === 1 ? (
                <form onSubmit={handleNetBankingStep1} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {currentBankTheme.idLabel}
                    </label>
                    <input
                      type="text"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      placeholder={currentBankTheme.idPlaceholder}
                      className="w-full px-3.5 py-2 text-sm text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {bankName} NetBanking Password
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

                  {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className={`w-full py-2.5 px-4 ${currentBankTheme.primaryBtn} text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5`}
                    >
                      <MdLock size={15} />
                      <span>Login to {bankName} & Proceed</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleNetBankingFinal} className="space-y-4 animate-fadeIn">
                  <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-600">
                      {bankName} High Security OTP sent to your mobile ending in <strong>••• 420</strong>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Enter 6-Digit Bank OTP
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={nbOtp}
                      onChange={(e) => setNbOtp(e.target.value)}
                      placeholder={currentBankTheme.demoOtp}
                      className="w-full px-3.5 py-2.5 text-center text-lg font-mono font-bold tracking-widest text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                      required
                    />
                  </div>

                  {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}

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
                      className={`w-2/3 py-2.5 px-4 ${currentBankTheme.primaryBtn} text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5`}
                    >
                      {isLoading ? (
                        <span>Authorizing with {bankName}...</span>
                      ) : (
                        <>
                          <MdCheckCircle size={16} />
                          <span>Confirm & Pay {formattedAmount}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-500">
              <BsShieldCheck size={13} className="text-teal-600" />
              256-bit Encrypted Banking Session
            </span>
            <span>Zero Surcharge</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export const PaymentGatewayModal = NetBankingModal;

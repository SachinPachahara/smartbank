import React, { useState } from "react";
import { MdClose, MdSecurity, MdGavel, MdPrivacyTip, MdVerifiedUser } from "react-icons/md";

export const LegalModal = ({ isOpen, onClose, initialTab = "terms" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 text-teal-800 rounded-lg">
              <MdVerifiedUser size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">SmartBank Legal & Trust Center</h3>
              <p className="text-xs text-slate-500">Institutional Governance, Security & User Compliance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
            aria-label="Close modal"
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab("terms")}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition ${
              activeTab === "terms"
                ? "border-teal-600 text-teal-700 bg-teal-50/50"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <MdGavel size={18} />
            Terms of Service (ToC)
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition ${
              activeTab === "privacy"
                ? "border-teal-600 text-teal-700 bg-teal-50/50"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <MdPrivacyTip size={18} />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition ${
              activeTab === "security"
                ? "border-teal-600 text-teal-700 bg-teal-50/50"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <MdSecurity size={18} />
            Fund Safety & AML Compliance
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto text-slate-700 text-sm leading-relaxed space-y-4">
          {activeTab === "terms" && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h4>
              <p>
                By creating a SmartBank account or initiating any transaction, you agree to be bound by these
                Terms of Service. SmartBank utilizes distributed ACID transaction controls and atomic ledgers to
                guarantee safe, immutable fund operations.
              </p>

              <h4 className="text-lg font-bold text-slate-900">2. Account Eligibility & Verification</h4>
              <p>
                Every user is verified by authorized administrators. Providing misleading identities, false contact
                numbers, or circumventing authentication protocols will result in immediate account suspension under
                zero-tolerance anti-fraud policies.
              </p>

              <h4 className="text-lg font-bold text-slate-900">3. Electronic Fund Transfers (EFT)</h4>
              <p>
                All deposits, withdrawals, and peer-to-peer transfers are recorded in real-time. SmartBank
                implements automated idempotency controls to prevent double-charging. Users are solely responsible for
                verifying beneficiary account numbers prior to executing irreversible wire transfers.
              </p>

              <h4 className="text-lg font-bold text-slate-900">4. Limitation of Liability</h4>
              <p>
                SmartBank maintains 99.9% uptime with automated database failover. In the rare event of network partition
                during transfer processing, our atomic rollback engine guarantees that no balances are lost or silently deducted.
              </p>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-slate-900">1. Information We Collect</h4>
              <p>
                SmartBank collects only the information required to provide secure financial services: full legal name,
                encrypted email address, verified phone number, and physical mailing address for KYC (Know Your Customer) compliance.
              </p>

              <h4 className="text-lg font-bold text-slate-900">2. Zero Data Selling Commitment</h4>
              <p>
                <strong>We never sell, rent, or trade your personal or financial data.</strong> Your financial records are
                isolated through strict role-based access control (RBAC) and object-level permission validators.
              </p>

              <h4 className="text-lg font-bold text-slate-900">3. Encryption in Transit and at Rest</h4>
              <p>
                Sensitive account records are protected using 256-bit AES encryption at rest and TLS 1.3 in transit.
                Passwords are irreversibly hashed using adaptive bcrypt with randomized salting.
              </p>

              <h4 className="text-lg font-bold text-slate-900">4. Your Data Rights</h4>
              <p>
                You retain full rights to review account statements, request copies of your transactional ledger, and
                close accounts with complete data archival per financial regulatory compliance periods.
              </p>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-slate-900">1. Fund Protection & Segregated Balances</h4>
              <p>
                User funds are recorded in segregated ledger accounts. SmartBank does not engage in speculative lending
                or uncollateralized leverage. 100% of deposited balances are accounted for in liquid real-time reserve ledgers.
              </p>

              <h4 className="text-lg font-bold text-slate-900">2. Anti-Money Laundering (AML) & Sanctions</h4>
              <p>
                SmartBank enforces automated transaction monitoring algorithms that scan for irregular transfer velocity,
                rapid multi-account disbursements, and suspicious high-frequency transfers in compliance with international AML guidelines.
              </p>

              <h4 className="text-lg font-bold text-slate-900">3. Continuous Vulnerability Auditing</h4>
              <p>
                Our infrastructure undergo continuous security audits covering Insecure Direct Object References (IDOR),
                Cross-Site Scripting (XSS), SQL/NoSQL Injection, and race-condition double-spend simulations.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            SmartBank Financial Compliance Standard • Revised 2026
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-teal-800 text-white rounded-lg text-sm font-semibold hover:bg-teal-900 transition"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};

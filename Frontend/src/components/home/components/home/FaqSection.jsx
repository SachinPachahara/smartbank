import React, { useState } from "react";
import { BsChevronDown, BsQuestionCircle } from "react-icons/bs";

export const FaqSection = ({ onOpenLegal }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How safe are my funds and personal records on SmartBank?",
      a: "SmartBank is built with a zero-trust financial architecture. Every deposit and transfer is processed with atomic transactional locks and backed by an immutable ledger. Personal data is isolated through strict object-level validation (IDOR protected), and passwords are encrypted using adaptive bcrypt hashing.",
    },
    {
      q: "How long do transfers take to settle?",
      a: "Transfers between SmartBank accounts settle instantly in real-time (<50 milliseconds). Both sender and beneficiary receive immediate account updates and transaction receipts with verifiable reference codes.",
    },
    {
      q: "Can another user view my account balance or sensitive data?",
      a: "No. SmartBank enforces strict token-based ownership authorization. User profiles, account balances, transaction logs, and personal contact details are completely private and can only be accessed by the authenticated account holder.",
    },
    {
      q: "What happens if my network drops during a transfer?",
      a: "Our backend utilizes an automatic atomic rollback mechanism combined with idempotency key verification. If a network partition interrupts a transfer, the sender's balance is safely refunded with zero fund loss.",
    },
    {
      q: "How do I open an additional checking or savings account?",
      a: "Once logged into your dashboard, click on 'Request Account' and submit your desired initial balance. An authorized bank administrator will review and activate your account within minutes.",
    },
    {
      q: "Where can I review legal terms, privacy commitments, and compliance?",
      a: "You can view our complete Terms of Service, Privacy Policy, and Fund Safety Disclosures anytime by clicking our legal center link or visiting our compliance portal below.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 mb-4">
            <BsQuestionCircle size={14} /> Clear Answers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Everything you need to know about our security guarantees, transfer speed, and account management.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`border rounded-2xl transition-all duration-200 ${
                  isOpen
                    ? "border-teal-500/80 bg-slate-50/50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-slate-800">{faq.q}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-teal-100 text-teal-800" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <BsChevronDown size={14} />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-slate-600 text-sm sm:text-base leading-relaxed animate-fadeIn">
                    <p>{faq.a}</p>
                    {idx === 5 && onOpenLegal && (
                      <button
                        onClick={() => onOpenLegal("terms")}
                        className="mt-3 text-sm font-semibold text-teal-700 hover:text-teal-900 underline flex items-center gap-1"
                      >
                        Open Legal & Compliance Center &rarr;
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Help Card */}
        <div className="mt-12 text-center p-8 bg-slate-50 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Still have questions?</h3>
          <p className="text-sm text-slate-600 mt-1">
            Our 24/7 financial support and customer verification specialists are always ready to assist.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => onOpenLegal && onOpenLegal("security")}
              className="px-5 py-2.5 bg-teal-700 text-white rounded-lg text-sm font-semibold hover:bg-teal-800 transition"
            >
              Review Compliance Policy
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

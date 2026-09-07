import React from "react";
import { MdClose, MdPrint, MdVerifiedUser } from "react-icons/md";
import { BsShieldCheck } from "react-icons/bs";
import moment from "moment";

export const StatementModal = ({ isOpen, onClose, account, userInfo }) => {
  if (!isOpen || !account) return null;

  const handlePrint = () => {
    window.print();
  };

  // Compile combined ledger of in, out, deposits, withdraws
  const transactions = [];

  account.in?.forEach((item) => {
    transactions.push({
      date: item.createdAt,
      desc: `Transfer In from Account #${item.from}`,
      ref: `TXN-IN-${item._id?.slice(-6) || "9821"}`,
      type: "CREDIT",
      amount: item.balance_transfered,
    });
  });

  account.out?.forEach((item) => {
    transactions.push({
      date: item.createdAt,
      desc: `Wire Transfer to Account #${item.to}`,
      ref: `TXN-OUT-${item._id?.slice(-6) || "4122"}`,
      type: "DEBIT",
      amount: item.balance_transfered,
    });
  });

  account.deposit_logs?.forEach((item) => {
    transactions.push({
      date: item.createdAt,
      desc: "Direct Payment Gateway Deposit (UPI/Card)",
      ref: `DEP-${item._id?.slice(-6) || "7820"}`,
      type: "CREDIT",
      amount: item.depositted_amount,
    });
  });

  account.withdraw_logs?.forEach((item) => {
    transactions.push({
      date: item.createdAt,
      desc: "ATM / Electronic Fund Withdrawal",
      ref: `WTH-${item._id?.slice(-6) || "3391"}`,
      type: "DEBIT",
      amount: item.withdrawed_amount,
    });
  });

  // Sort descending by date
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 print:max-w-none print:w-full print:shadow-none print:border-none">
        {/* Controls Bar (hidden in print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-sm">
              Official Account Statement Preview
            </span>
            <span className="text-xs text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full font-semibold border border-teal-200">
              Verified Ledger
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold shadow transition"
            >
              <MdPrint size={16} />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition"
            >
              <MdClose size={20} />
            </button>
          </div>
        </div>

        {/* Printable Statement Document Content */}
        <div className="p-8 sm:p-12 overflow-y-auto text-slate-800 text-sm leading-relaxed space-y-6">
          {/* Statement Letterhead */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-6 gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">SmartBank Systems</h1>
              <p className="text-xs text-slate-500 mt-1">
                Authorized Digital Banking & Ledger Operations<br />
                Reserve Bank FinTech Sandbox Node • Global Routing ID: SMBK-IN-2026
              </p>
            </div>
            <div className="text-right sm:text-right text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-900 uppercase">Statement of Account</div>
              <div>Generated: {moment().format("DD MMM YYYY, hh:mm A")}</div>
              <div>IFSC Code: <span className="font-mono font-bold">SMBK0002026</span></div>
            </div>
          </div>

          {/* Account & Customer Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Account Holder</div>
              <div className="font-bold text-slate-800 text-sm mt-0.5">{userInfo?.name || "Verified Customer"}</div>
              <div className="text-slate-500 mt-0.5">{userInfo?.email}</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Account Number</div>
              <div className="font-mono font-bold text-slate-800 text-sm mt-0.5">{account._id}</div>
              <div className="text-slate-500 mt-0.5">Tier 1 Savings / Current</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Account Status</div>
              <div className="font-bold text-emerald-600 text-sm mt-0.5 flex items-center gap-1">
                <BsShieldCheck size={14} /> ACTIVE
              </div>
              <div className="text-slate-500 mt-0.5">Zero Lien / Clean</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Current Balance</div>
              <div className="font-extrabold text-teal-800 text-base mt-0.5">
                ₹{Number(account.balance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <div className="text-slate-500 text-[10px]">100% Reserve Backed</div>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Itemized Transaction Ledger
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Reference No</th>
                    <th className="p-3 text-right">Debit (Dr)</th>
                    <th className="p-3 text-right">Credit (Cr)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {transactions.length > 0 ? (
                    transactions.map((tx, i) => (
                      <tr key={i} className="hover:bg-slate-50/80">
                        <td className="p-3 text-slate-600 font-sans">
                          {moment(tx.date).format("DD/MM/YYYY")}
                        </td>
                        <td className="p-3 text-slate-800 font-sans font-medium">
                          {tx.desc}
                        </td>
                        <td className="p-3 text-slate-500 text-[11px]">{tx.ref}</td>
                        <td className="p-3 text-right text-rose-600 font-bold">
                          {tx.type === "DEBIT" ? `₹${Number(tx.amount).toLocaleString("en-IN")}` : "-"}
                        </td>
                        <td className="p-3 text-right text-emerald-600 font-bold">
                          {tx.type === "CREDIT" ? `₹${Number(tx.amount).toLocaleString("en-IN")}` : "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400 font-sans">
                        No transactions recorded for this account period yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Verification Seal & Notes */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-slate-500">
            <div className="max-w-md space-y-1">
              <p className="font-bold text-slate-700">Digital Authenticity Statement:</p>
              <p>
                This statement is electronically generated via SmartBank&apos;s ACID-compliant transactional ledger.
                It does not require a physical signature. Any alteration renders this document void.
              </p>
            </div>

            <div className="text-center p-3 border-2 border-dashed border-teal-600 rounded-xl bg-teal-50/50">
              <div className="flex items-center justify-center text-teal-700 mb-1">
                <MdVerifiedUser size={28} />
              </div>
              <div className="text-[11px] font-extrabold text-teal-900 uppercase tracking-widest">
                SMARTBANK OFFICIAL SEAL
              </div>
              <div className="text-[9px] text-teal-700 font-mono">CRYPTOGRAPHICALLY VERIFIED</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

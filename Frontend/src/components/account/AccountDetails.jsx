import React, { useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MdArrowUpward,
  MdArrowDownward,
  MdQrCodeScanner,
  MdReceipt,
  MdAccountBalanceWallet,
} from "react-icons/md";
import { BsShieldCheck, BsLightningChargeFill } from "react-icons/bs";
import { VirtualCardManager } from "./VirtualCardManager";
import { StatementModal } from "./StatementModal";
import { QrPayModal } from "./QrPayModal";

export const AccountDetails = ({ account }) => {
  const { info } = useSelector((state) => state.userData);
  const [isStatementOpen, setIsStatementOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const totalIncoming =
    account.in?.reduce(
      (sum, item) => sum + (item.balance_transfered || 0),
      0
    ) || 0;

  const totalOutgoing =
    account.out?.reduce(
      (sum, item) => sum + (item.balance_transfered || 0),
      0
    ) || 0;

  const totalDeposits =
    account.deposit_logs?.reduce(
      (sum, item) => sum + (item.depositted_amount || 0),
      0
    ) || 0;

  const totalWithdrawals =
    account.withdraw_logs?.reduce(
      (sum, item) => sum + (item.withdrawed_amount || 0),
      0
    ) || 0;

  const formatINR = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <div className="space-y-8 my-6">
      {/* Main Account Balance Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-teal-950 text-teal-300 border border-teal-700/60 flex items-center gap-1">
                <BsShieldCheck size={12} />
                <span>Tier 1 Active Account</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: <strong>{account._id}</strong>
              </span>
            </div>

            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Available Net Balance
            </div>
            <div className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-1">
              {formatINR(account.balance)}
            </div>
            <div className="text-xs text-teal-400 mt-2 flex items-center gap-1.5">
              <BsLightningChargeFill size={12} />
              <span>ACID Multi-Document Isolation • Settled Since {moment(account.createdAt).format("DD MMM YYYY")}</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            <Link
              to={`/account/deposit/${account._id}`}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <MdArrowDownward size={16} />
              <span>Add Funds (Gateway)</span>
            </Link>

            <Link
              to={`/account/transfer/${account._id}`}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <MdArrowUpward size={16} />
              <span>Wire Transfer</span>
            </Link>

            <button
              onClick={() => setIsQrOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
            >
              <MdQrCodeScanner size={16} className="text-teal-400" />
              <span>Receive / QR</span>
            </button>

            <button
              onClick={() => setIsStatementOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
            >
              <MdReceipt size={16} className="text-amber-400" />
              <span>Statement (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Financial Inflow/Outflow Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Incoming P2P</span>
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MdArrowDownward size={14} />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900">
            {formatINR(totalIncoming)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {account.in?.length || 0} transfers received
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Outgoing P2P</span>
            <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
              <MdArrowUpward size={14} />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900">
            {formatINR(totalOutgoing)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {account.out?.length || 0} transfers sent
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Gateway Inflow</span>
            <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
              <MdAccountBalanceWallet size={14} />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900">
            {formatINR(totalDeposits)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {account.deposit_logs?.length || 0} gateway deposits
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Withdrawn</span>
            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <MdArrowUpward size={14} />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900">
            {formatINR(totalWithdrawals)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {account.withdraw_logs?.length || 0} cashouts
          </div>
        </div>
      </div>

      {/* Pillar 3: Virtual Debit Card Manager */}
      <VirtualCardManager account={account} userName={info?.name} />

      {/* Statement Modal Trigger */}
      <StatementModal
        isOpen={isStatementOpen}
        onClose={() => setIsStatementOpen(false)}
        account={account}
        userInfo={info}
      />

      {/* QR Receive Modal Trigger */}
      <QrPayModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        account={account}
        userName={info?.name}
      />
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { RiFileTransferFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  resetAccountStatus,
  transfer,
} from "../../state/features/Account/accountSlice";
import FormButton from "../shared/FormButton";
import MessagesContainer from "../shared/MessagesContainer";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { TwoFactorModal } from "./TwoFactorModal";
import { BsArrowRightCircleFill, BsShieldCheck, BsLightningCharge } from "react-icons/bs";

export const Transfer = () => {
  const [balanceTransfered, setBalanceTransfered] = useState(1000);
  const [password, setPassword] = useState("");
  const [receivingId, setReceivingId] = useState("");
  const [msg, setMsg] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const { account, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.userAccount
  );
  const { user } = useSelector((state) => state.userAuth);
  const { info } = useSelector((state) => state.userData);

  const dispatch = useDispatch();
  const accountId = useLocation()?.pathname?.split("/").at(-1);

  useEffect(() => {
    if (isError) {
      setMsg(message);
      setIsOtpModalOpen(false);
    }

    if (isSuccess) {
      setIsOtpModalOpen(false);
      setMsg(
        `Success! You have transferred ${new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(balanceTransfered)} to Beneficiary Account [${receivingId}] with ACID instant settlement.`
      );
    }
  }, [isError, isSuccess, message, account, balanceTransfered, receivingId]);

  const handleOpenOtpModal = (e) => {
    e.preventDefault();
    setMsg("");
    if (!receivingId) {
      setMsg("Please specify the recipient account ID.");
      return;
    }
    if (balanceTransfered <= 0) {
      setMsg("Transfer amount must be greater than 0.");
      return;
    }
    setIsOtpModalOpen(true);
  };

  const handleExecuteTransfer = (otp) => {
    const transferData = {
      balanceTransfered,
      token: user.token,
      oldPassword: password,
      id: user.id,
      from: accountId,
      to: receivingId,
      idempotencyKey: `TXN-KEY-${user.id}-${Date.now()}`,
    };
    dispatch(transfer(transferData));
  };

  UseResetStatus(() => {
    return () => {
      dispatch(resetAccountStatus());
    };
  });

  return (
    <div className="max-w-4xl w-full mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-700/60 flex items-center justify-center text-indigo-300">
            <BsArrowRightCircleFill size={30} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Instant Wire Transfer</h2>
            <p className="text-xs text-indigo-200 mt-0.5">
              Zero-Fee P2P Transfer • ACID Rollback Protection Guaranteed
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-indigo-300 bg-indigo-950/60 px-3 py-1.5 rounded-lg border border-indigo-800">
          <BsLightningCharge size={14} className="text-amber-400" />
          <span>Settlement &lt;50ms</span>
        </div>
      </div>

      <form onSubmit={handleOpenOtpModal} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Beneficiary & Transfer Details
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              From Account: <strong>{accountId}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Amount */}
            <div>
              <label
                htmlFor="balanceTransfered"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Amount to Transfer (INR ₹)
              </label>
              <div className="relative rounded-lg border border-slate-300 focus-within:ring-2 focus-within:ring-indigo-500">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                <input
                  className="w-full pl-8 pr-4 py-2 text-base font-semibold text-slate-900 rounded-lg focus:outline-none"
                  type="number"
                  name="balanceTransfered"
                  id="balanceTransfered"
                  value={balanceTransfered}
                  onChange={(e) => setBalanceTransfered(e.target.value)}
                  min="50"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Minimum transfer: ₹50. Maximum daily limit: ₹5,00,000.
              </p>
            </div>

            {/* Recipient Account ID */}
            <div>
              <label
                htmlFor="recipientId"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Recipient Account ID
              </label>
              <input
                className="w-full px-4 py-2 text-sm text-slate-900 font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                type="text"
                name="recipientId"
                id="recipientId"
                placeholder="e.g. 202511545301"
                value={receivingId}
                onChange={(e) => setReceivingId(e.target.value)}
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Beneficiary will be verified against the SmartBank customer registry.
              </p>
            </div>

            {/* Password Verification */}
            <div className="md:col-span-2">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Your Account Password
              </label>
              <input
                className="w-full px-4 py-2 text-sm text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                type="password"
                name="password"
                id="password"
                placeholder="Enter password to authorize transfer"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                A 6-digit 2FA security prompt will follow for high-assurance cryptographic settlement.
              </p>
            </div>
          </div>
        </div>

        {/* Security & Policy Assurance Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <BsShieldCheck size={18} className="text-indigo-600" />
            <span>Anti-Double-Spend Concurrency Guard is Active</span>
          </div>
          <span className="font-semibold text-teal-700">Zero Transaction Fees</span>
        </div>

        {/* Error / Success Messages */}
        {(isError || isSuccess) && (
          <MessagesContainer
            msg={msg}
            isSuccess={isSuccess}
            isError={isError}
          />
        )}

        {/* Action Button */}
        <div>
          <FormButton
            text={{
              default: `Proceed to 2FA Verification (₹${Number(balanceTransfered || 0).toLocaleString("en-IN")})`,
              loading: "Connecting to ACID Engine...",
            }}
            isLoading={isLoading}
            icon={<RiFileTransferFill className="ml-1" size={22} />}
          />
        </div>
      </form>

      {/* 2-Factor Authentication Modal */}
      <TwoFactorModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onConfirm={handleExecuteTransfer}
        amount={balanceTransfered}
        recipientId={receivingId}
        isLoading={isLoading}
        actionType="Wire Transfer"
      />
    </div>
  );
};

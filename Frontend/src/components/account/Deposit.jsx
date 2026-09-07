import React, { useState, useEffect } from "react";
import { HiReceiptRefund } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  deposit,
  resetAccountStatus,
} from "../../state/features/Account/accountSlice";
import { PaymentMethods } from "../payment/PaymentMethods";
import { NetBankingModal } from "../payment/NetBankingModal";
import FormButton from "../shared/FormButton";
import MessagesContainer from "../shared/MessagesContainer";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { BsArrowDownCircleFill, BsShieldCheck } from "react-icons/bs";

export const Deposit = () => {
  const [depositAmount, setDepositAmount] = useState(5000);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  const { account, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.userAccount
  );
  const { user } = useSelector((state) => state.userAuth);

  const dispatch = useDispatch();
  const accountId = useLocation().pathname.split("/").at(-1);

  useEffect(() => {
    if (isError) {
      setMsg(message);
      setIsModalOpen(false);
    }

    if (isSuccess) {
      setIsModalOpen(false);
      setMsg(
        `Success! You have deposited ${new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(depositAmount)} via verified ${selectedBank} NetBanking gateway into your SmartBank account.`
      );
    }
  }, [isError, isSuccess, message, account, selectedBank, depositAmount]);

  const handleOpenGateway = (e) => {
    e.preventDefault();
    setMsg("");
    if (!password) {
      setMsg("Please enter your SmartBank account password.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleAuthorizeDeposit = (_authDetails) => {
    const depositData = {
      accountId,
      depositAmount,
      token: user.token,
      oldPassword: password,
      id: user.id,
    };
    dispatch(deposit(depositData));
  };

  UseResetStatus(() => {
    return () => {
      dispatch(resetAccountStatus());
    };
  });

  return (
    <div className="max-w-4xl w-full mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-700/60 flex items-center justify-center text-teal-300">
            <BsArrowDownCircleFill size={30} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Add Funds to SmartBank</h2>
            <p className="text-xs text-teal-200 mt-0.5">
              Instant Atomic Credit • Official NetBanking & Gateway Portal
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-teal-300 bg-teal-900/60 px-3 py-1.5 rounded-lg border border-teal-700">
          <BsShieldCheck size={16} />
          <span>PCI-DSS Level 1</span>
        </div>
      </div>

      <form onSubmit={handleOpenGateway} className="space-y-6">
        {/* Amount & Authorization Inputs Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Deposit Amount & Account Authorization
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="depositAmount"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Deposit Amount (INR ₹)
              </label>
              <div className="relative rounded-lg border border-slate-300 focus-within:ring-2 focus-within:ring-teal-500">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  className="w-full pl-8 pr-4 py-2 text-base font-semibold text-slate-900 rounded-lg focus:outline-none"
                  type="number"
                  name="depositAmount"
                  id="depositAmount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="100"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Minimum deposit: ₹100. Instant ledger settlement.
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                SmartBank Account Password
              </label>
              <input
                className="w-full px-4 py-2 text-sm text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                type="password"
                name="password"
                id="password"
                placeholder="Enter password to authorize"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Authorizes connection to the selected bank gateway.
              </p>
            </div>
          </div>
        </div>

        {/* Realistic Payment Gateway Options */}
        <PaymentMethods
          title="Select Payment Channel (Cards / UPI / NetBanking)"
        />

        {/* Alert Messages */}
        {(isError || isSuccess) && (
          <MessagesContainer
            msg={msg}
            isSuccess={isSuccess}
            isError={isError}
          />
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <FormButton
            text={{
              default: `Proceed to Gateway & Enter Credentials (₹${Number(depositAmount || 0).toLocaleString("en-IN")})`,
              loading: "Connecting to Bank Gateway...",
            }}
            isLoading={isLoading}
            icon={<HiReceiptRefund className="ml-1" size={22} />}
          />
        </div>
      </form>

      {/* NetBanking & Gateway Credential Verification Modal */}
      <NetBankingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAuthorize={handleAuthorizeDeposit}
        amount={depositAmount}
        bankName={selectedBank}
        isLoading={isLoading}
      />
    </div>
  );
};

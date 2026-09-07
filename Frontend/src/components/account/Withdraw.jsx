import React, { useState, useEffect } from "react";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  resetAccountStatus,
  withdraw,
} from "../../state/features/Account/accountSlice";
import { PaymentMethods } from "../payment/PaymentMethods";
import FormButton from "../shared/FormButton";
import MessagesContainer from "../shared/MessagesContainer";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { TwoFactorModal } from "./TwoFactorModal";
import { BsArrowUpCircleFill, BsShieldCheck } from "react-icons/bs";

export const Withdraw = () => {
  const [withdrawAmount, setWithdrawAmount] = useState(1000);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  const { account, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.userAccount
  );
  const { user } = useSelector((state) => state.userAuth);

  const dispatch = useDispatch();
  const accountId = useLocation().pathname.split("/").at(-1);

  useEffect(() => {
    if (isError) {
      setMsg(message);
      setIsOtpOpen(false);
    }

    if (isSuccess) {
      setIsOtpOpen(false);
      setMsg(
        `Success! You have withdrawn ${new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(withdrawAmount)} via direct bank settlement.`
      );
    }
  }, [isError, isSuccess, message, account, withdrawAmount]);

  const handleOpenOtp = (e) => {
    e.preventDefault();
    setMsg("");
    if (withdrawAmount <= 0) {
      setMsg("Withdrawal amount must be greater than 0.");
      return;
    }
    setIsOtpOpen(true);
  };

  const handleConfirmWithdraw = (otp) => {
    const withdrawData = {
      accountId,
      withdrawAmount,
      token: user.token,
      oldPassword: password,
      id: user.id,
    };
    dispatch(withdraw(withdrawData));
  };

  UseResetStatus(() => {
    return () => {
      dispatch(resetAccountStatus());
    };
  });

  return (
    <div className="max-w-4xl w-full mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-700/60 flex items-center justify-center text-amber-300">
            <BsArrowUpCircleFill size={30} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Withdraw Funds</h2>
            <p className="text-xs text-amber-200 mt-0.5">
              Secure Electronic Cashout • Immediate Reserve Deduction
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-700">
          <BsShieldCheck size={16} />
          <span>Encrypted Disbursal</span>
        </div>
      </div>

      <form onSubmit={handleOpenOtp} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Withdrawal Specifications
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="withdrawAmount"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Withdrawal Amount (INR ₹)
              </label>
              <div className="relative rounded-lg border border-slate-300 focus-within:ring-2 focus-within:ring-amber-500">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                <input
                  className="w-full pl-8 pr-4 py-2 text-base font-semibold text-slate-900 rounded-lg focus:outline-none"
                  type="number"
                  name="withdrawAmount"
                  id="withdrawAmount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="100"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Minimum cashout: ₹100. Balance must be available.
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Confirm Account Password
              </label>
              <input
                className="w-full px-4 py-2 text-sm text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                type="password"
                name="password"
                id="password"
                placeholder="Enter account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Required to release funds from escrow.
              </p>
            </div>
          </div>
        </div>

        <PaymentMethods title="Destination Payout Channel (Bank / UPI / Card)" />

        {(isError || isSuccess) && (
          <MessagesContainer
            msg={msg}
            isSuccess={isSuccess}
            isError={isError}
          />
        )}

        <div className="pt-2">
          <FormButton
            text={{
              default: `Authorize & Withdraw ₹${Number(withdrawAmount || 0).toLocaleString("en-IN")}`,
              loading: "Disbursing Funds...",
            }}
            isLoading={isLoading}
            icon={<RiMoneyDollarCircleFill className="ml-1" size={22} />}
          />
        </div>
      </form>

      <TwoFactorModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onConfirm={handleConfirmWithdraw}
        amount={withdrawAmount}
        isLoading={isLoading}
        actionType="Disbursal Cashout"
      />
    </div>
  );
};

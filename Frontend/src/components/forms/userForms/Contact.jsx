import React, { useState, useEffect } from "react";
import { FcServices } from "react-icons/fc";
import { RiMessageFill, RiCustomerService2Fill } from "react-icons/ri";
import { MdCheckCircle, MdError, MdConfirmationNumber } from "react-icons/md";
import { BsShieldCheck } from "react-icons/bs";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config/apiConfig";
import FormButton from "../../shared/FormButton";

export const Contact = () => {
  const { user } = useSelector((state) => state.userAuth);
  const { info } = useSelector((state) => state.userData);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Support");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [ticketId, setTicketId] = useState("");

  // Pre-fill user details if logged in
  useEffect(() => {
    if (info?.name) setName(info.name);
    else if (user?.user_name) setName(user.user_name);

    if (info?.email) setEmail(info.email);
    else if (user?.email) setEmail(user.email);
  }, [info, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    setIsSuccess(false);
    setResponseMsg("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setIsError(true);
      setResponseMsg("Please fill in your Name, Email, and Message.");
      return;
    }

    setIsLoading(true);
    try {
      const fullMessage = subject ? `[${subject}] ${message.trim()}` : message.trim();
      const res = await axios.post(API_ENDPOINTS.CONTACT, {
        name: name.trim(),
        email: email.trim(),
        message: fullMessage,
        userId: user?.id || null,
      });

      setIsSuccess(true);
      setResponseMsg(res.data.message || "Your message has been sent successfully!");
      setTicketId(res.data.ticketId || "");
      setMessage(""); // Clear message box
    } catch (err) {
      setIsError(true);
      const errMsg =
        err.response?.data ||
        "Failed to send your message. Please verify connection and try again.";
      setResponseMsg(typeof errMsg === "string" ? errMsg : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-700/60 flex items-center justify-center text-teal-300">
            <RiCustomerService2Fill size={30} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Contact SmartBank Support</h2>
            <p className="text-xs text-teal-200 mt-0.5">
              Direct Helpdesk • 24/7 Ticketing & Query Resolution
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-teal-300 bg-teal-900/60 px-3 py-1.5 rounded-lg border border-teal-700">
          <BsShieldCheck size={16} />
          <span>Priority Helpdesk</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        {/* Status Alerts */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-start gap-3 animate-fadeIn">
            <MdCheckCircle size={22} className="text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong className="text-emerald-900 block font-bold mb-1">
                Support Request Logged!
              </strong>
              <p className="text-emerald-800 text-xs">{responseMsg}</p>
              {ticketId && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 border border-emerald-300 rounded-lg text-emerald-900 font-mono text-xs font-bold">
                  <MdConfirmationNumber size={14} />
                  <span>Ticket ID: {ticketId}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {isError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-300 rounded-xl flex items-start gap-3 animate-fadeIn">
            <MdError size={22} className="text-rose-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong className="text-rose-900 block font-bold mb-0.5">
                Submission Error
              </strong>
              <p className="text-rose-800 text-xs">{responseMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Your Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                placeholder="e.g. john@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Inquiry Category
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="General Support">General Support & Guidance</option>
              <option value="Account / KYC Inquiry">Account Opening / KYC Verification</option>
              <option value="Deposit / Gateway Issue">Deposit & Payment Gateway Sandbox</option>
              <option value="Fund Transfer & 2FA">Fund Transfer & 2FA Handshake</option>
              <option value="Virtual Debit Card">Virtual Platinum Debit Card Assistance</option>
              <option value="Security / Bug Report">Report a Security Concern or Bug</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Message / Details
            </label>
            <textarea
              name="message"
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your question or issue in detail..."
              className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
              required
            />
          </div>

          <div className="pt-2">
            <FormButton
              text={{
                default: "Submit Support Ticket",
                loading: "Submitting to Helpdesk...",
              }}
              isLoading={isLoading}
              icon={<RiMessageFill className="ml-1" size={20} />}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

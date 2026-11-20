import React, { useState, useEffect } from "react";
import { FcServices } from "react-icons/fc";
import { RiMessageFill, RiCustomerService2Fill } from "react-icons/ri";
import {
  MdCheckCircle,
  MdError,
  MdConfirmationNumber,
  MdSync,
  MdOutlineMarkEmailRead,
} from "react-icons/md";
import { BsShieldCheck, BsClockHistory, BsChatLeftDotsFill } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config/apiConfig";
import FormButton from "../../shared/FormButton";
import { getUser } from "../../../state/features/User/UserData/userSlice";
import moment from "moment";

export const Contact = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userAuth);
  const { info } = useSelector((state) => state.userData);

  const [activeTab, setActiveTab] = useState("newInquiry"); // "newInquiry" | "myTickets"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Support");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [ticketId, setTicketId] = useState("");

  // Customer's ticket list
  const [myTickets, setMyTickets] = useState([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);

  // Pre-fill user details if logged in
  useEffect(() => {
    if (info?.name) setName(info.name);
    else if (user?.user_name) setName(user.user_name);

    if (info?.email) setEmail(info.email);
    else if (user?.email) setEmail(user.email);
  }, [info, user]);

  // Fetch current user's submitted queries
  const fetchMyTickets = async () => {
    if (!user?.token) return;
    setIsLoadingTickets(true);
    try {
      const res = await axios.get(`${API_ENDPOINTS.CONTACT}my`, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      });
      setMyTickets(res.data || []);
      // Also refresh user data for updated notifications
      if (user?.id) {
        dispatch(getUser({ token: user.token, id: user.id }));
      }
    } catch (err) {
      console.warn("Failed to load customer tickets:", err.message);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchMyTickets();
    }
  }, [user]);

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

      // Refresh tickets list
      fetchMyTickets();
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
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-700/60 flex items-center justify-center text-teal-300">
            <RiCustomerService2Fill size={30} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">SmartBank Helpdesk</h2>
            <p className="text-xs text-teal-200 mt-0.5">
              Direct Support & Query Resolution Center
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-teal-300 bg-teal-900/60 px-3 py-1.5 rounded-lg border border-teal-700">
          <BsShieldCheck size={16} />
          <span>Priority Helpdesk</span>
        </div>
      </div>

      {/* Tabs Navigation (New Inquiry vs My Tickets) */}
      {user && (
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("newInquiry")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "newInquiry"
                ? "bg-teal-700 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <RiMessageFill size={15} />
            <span>Submit New Ticket</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("myTickets");
              fetchMyTickets();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "myTickets"
                ? "bg-teal-700 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <BsClockHistory size={14} />
            <span>My Submitted Queries</span>
            {myTickets.length > 0 && (
              <span className="px-1.5 py-0.2 bg-teal-950 text-teal-200 text-[10px] rounded-full font-mono">
                {myTickets.length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* TAB 1: SUBMIT NEW INQUIRY */}
      {activeTab === "newInquiry" && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-fadeIn">
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
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("myTickets")}
                    className="text-xs font-bold text-teal-800 underline hover:text-teal-950"
                  >
                    View Status in "My Submitted Queries" →
                  </button>
                </div>
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
      )}

      {/* TAB 2: MY SUBMITTED INQUIRIES & LIVE STATUS */}
      {activeTab === "myTickets" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h4 className="text-sm font-bold text-slate-800">My Support Tickets</h4>
              <p className="text-xs text-slate-500">
                Track status updates and responses from SmartBank staff.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchMyTickets}
              disabled={isLoadingTickets}
              className="p-2 text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
            >
              <MdSync size={16} className={isLoadingTickets ? "animate-spin" : ""} />
              <span>Refresh Status</span>
            </button>
          </div>

          {isLoadingTickets ? (
            <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-xs text-slate-500 font-semibold">
              Loading your support tickets...
            </div>
          ) : myTickets.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-sm">
              <BsChatLeftDotsFill size={36} className="mx-auto mb-2 text-slate-300" />
              <p className="font-semibold">You have not submitted any queries yet.</p>
              <button
                type="button"
                onClick={() => setActiveTab("newInquiry")}
                className="mt-3 text-xs font-bold text-teal-700 underline"
              >
                Submit a Query Now
              </button>
            </div>
          ) : (
            myTickets.map((ticket) => (
              <div
                key={ticket._id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300 flex items-center gap-1">
                      <MdConfirmationNumber size={13} className="text-slate-500" />
                      {ticket.ticketId}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {moment(ticket.createdAt).format("MMM D, YYYY • h:mm A")}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider self-start sm:self-auto ${
                      ticket.status === "RESOLVED"
                        ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                        : ticket.status === "IN_PROGRESS"
                        ? "bg-sky-100 text-sky-900 border-sky-300"
                        : "bg-amber-100 text-amber-900 border-amber-300"
                    }`}
                  >
                    {ticket.status.replace("_", " ")}
                  </span>
                </div>

                {/* Question */}
                <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Your Inquiry:</span>
                  {ticket.message}
                </div>

                {/* Resolution Note if Resolved */}
                {ticket.status === "RESOLVED" && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1 animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                      <MdOutlineMarkEmailRead size={18} className="text-emerald-700" />
                      <span>Official Bank Resolution / Response:</span>
                    </div>
                    <p className="text-xs text-emerald-800 font-medium pl-6 whitespace-pre-wrap">
                      {ticket.resolutionNote || "Your issue has been resolved by our banking team."}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

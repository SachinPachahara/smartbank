import React, { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/apiConfig";
import {
  MdCheckCircle,
  MdPending,
  MdSync,
  MdSearch,
  MdMail,
  MdConfirmationNumber,
  MdOutlineMarkEmailRead,
} from "react-icons/md";
import { BsShieldCheck, BsChatLeftDotsFill } from "react-icons/bs";
import moment from "moment";

export const SupportTicketsControl = ({ tickets = [], onRefresh, token }) => {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyNote, setReplyNote] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const handleUpdateStatus = async (ticketId, newStatus, note = "") => {
    setUpdatingId(ticketId);
    setFeedbackMsg("");
    try {
      const payload = {
        status: newStatus,
      };
      if (note && note.trim() !== "") {
        payload.resolutionNote = note.trim();
      } else if (newStatus === "RESOLVED") {
        payload.resolutionNote =
          "Thank you for reaching out! Your inquiry has been reviewed and resolved by SmartBank staff.";
      }

      await axios.put(`${API_ENDPOINTS.CONTACT}${ticketId}`, payload, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setFeedbackMsg(`Ticket successfully updated to ${newStatus}. Response sent to customer!`);
      setActiveReplyId(null);
      setReplyNote("");
      if (onRefresh) onRefresh();
    } catch (err) {
      setFeedbackMsg(
        err.response?.data || "Failed to update ticket. Please try again."
      );
    } finally {
      setUpdatingId(null);
      setTimeout(() => setFeedbackMsg(""), 4000);
    }
  };

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const matchesFilter = filter === "ALL" || t.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      t.ticketId?.toLowerCase().includes(q) ||
      t.name?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q) ||
      t.message?.toLowerCase().includes(q) ||
      t.resolutionNote?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const inProgressCount = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED").length;

  return (
    <div className="max-w-5xl w-full mx-auto space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Queries
          </span>
          <span className="text-2xl font-extrabold text-slate-900">
            {totalCount}
          </span>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm text-center">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            Pending / Open
          </span>
          <span className="text-2xl font-extrabold text-amber-900">
            {openCount}
          </span>
        </div>

        <div className="bg-sky-50 p-4 rounded-xl border border-sky-200 shadow-sm text-center">
          <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">
            In Progress
          </span>
          <span className="text-2xl font-extrabold text-sky-900">
            {inProgressCount}
          </span>
        </div>

        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-sm text-center">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Resolved
          </span>
          <span className="text-2xl font-extrabold text-emerald-900">
            {resolvedCount}
          </span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket ID, name, or keyword..."
            className="w-full pl-9 pr-3 py-2 text-xs text-slate-800 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
          <MdSearch size={18} className="absolute left-2.5 top-2.5 text-slate-400" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filter === status
                  ? "bg-blue-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
          <button
            type="button"
            onClick={onRefresh}
            title="Refresh tickets"
            className="p-1.5 ml-1 text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            <MdSync size={18} />
          </button>
        </div>
      </div>

      {/* Alert Feedback */}
      {feedbackMsg && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold rounded-xl animate-fadeIn flex items-center gap-2">
          <BsShieldCheck size={16} className="text-blue-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-sm">
            <BsChatLeftDotsFill size={36} className="mx-auto mb-2 text-slate-300" />
            <p className="font-semibold">No support queries found matching this filter.</p>
          </div>
        ) : (
          filteredTickets.map((t) => {
            const isReplying = activeReplyId === t._id;
            return (
              <div
                key={t._id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 transition hover:shadow-md"
              >
                {/* Ticket Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-900 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                      <MdConfirmationNumber size={14} className="text-slate-500" />
                      {t.ticketId}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {t.name}
                    </span>
                    <a
                      href={`mailto:${t.email}`}
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <MdMail size={13} />
                      <span>{t.email}</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {moment(t.createdAt).format("MMM D, YYYY • h:mm A")}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                        t.status === "RESOLVED"
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : t.status === "IN_PROGRESS"
                          ? "bg-sky-100 text-sky-900 border-sky-300"
                          : "bg-amber-100 text-amber-900 border-amber-300"
                      }`}
                    >
                      {t.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* Customer Query Message */}
                <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1">Customer Query:</span>
                  {t.message}
                </div>

                {/* Current Response Note if already added */}
                {t.resolutionNote && (
                  <div className="text-xs bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-emerald-900 space-y-1 animate-fadeIn">
                    <div className="flex items-center gap-1.5 font-bold">
                      <MdOutlineMarkEmailRead size={16} className="text-emerald-700" />
                      <span>Bank Staff Response (Visible to User):</span>
                    </div>
                    <p className="text-xs text-emerald-800 whitespace-pre-wrap pl-6 font-medium">
                      {t.resolutionNote}
                    </p>
                  </div>
                )}

                {/* Inline Reply / Resolution Note Box */}
                {isReplying && (
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 animate-fadeIn">
                    <label className="block text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                      Write Bank Response (Delivered directly to customer account & notifications):
                    </label>
                    <textarea
                      rows={3}
                      value={replyNote}
                      onChange={(e) => setReplyNote(e.target.value)}
                      placeholder="e.g. We have investigated your account and resolved the issue. Your funds are secure."
                      className="w-full p-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveReplyId(null);
                          setReplyNote("");
                        }}
                        className="px-3 py-1 bg-white border border-slate-300 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={updatingId === t._id}
                        onClick={() =>
                          handleUpdateStatus(t._id, "RESOLVED", replyNote)
                        }
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1"
                      >
                        <MdCheckCircle size={14} />
                        <span>Send Response & Mark Resolved</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="text-slate-400 text-[11px]">
                    {t.userId ? (
                      <span className="text-emerald-700 font-semibold">
                        Registered Customer Account ({t.userId})
                      </span>
                    ) : (
                      <span>Guest Inquiry</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {t.status !== "IN_PROGRESS" && t.status !== "RESOLVED" && (
                      <button
                        type="button"
                        disabled={updatingId === t._id}
                        onClick={() =>
                          handleUpdateStatus(t._id, "IN_PROGRESS")
                        }
                        className="px-2.5 py-1 bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold rounded-lg transition flex items-center gap-1"
                      >
                        <MdPending size={14} />
                        <span>Mark In Progress</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setActiveReplyId(isReplying ? null : t._id);
                        setReplyNote(t.resolutionNote || "");
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition flex items-center gap-1"
                    >
                      <MdCheckCircle size={14} />
                      <span>{t.status === "RESOLVED" ? "Edit Response Note" : "Resolve & Reply"}</span>
                    </button>

                    {t.status === "RESOLVED" && (
                      <button
                        type="button"
                        disabled={updatingId === t._id}
                        onClick={() => handleUpdateStatus(t._id, "OPEN")}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                      >
                        Re-open
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

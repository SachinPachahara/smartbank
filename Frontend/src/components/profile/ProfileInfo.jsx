import React from "react";
import { RiArrowRightLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { MdBadge, MdEmail, MdPhone, MdLocationOn, MdFingerprint } from "react-icons/md";

export default function ProfileInfo({ info }) {
  const nameParts = info?.name ? info.name.split(" ") : ["User"];
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "-";

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <MdBadge size={22} className="text-teal-700" />
          <h3 className="text-base font-bold text-slate-800">
            Confidential Client Demographics
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Customer ID: {info?.id}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-slate-400 font-semibold uppercase text-[10px]">First Name</div>
          <div className="font-bold text-slate-800 text-sm mt-1">{firstName}</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-slate-400 font-semibold uppercase text-[10px]">Last Name</div>
          <div className="font-bold text-slate-800 text-sm mt-1">{lastName}</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
          <div>
            <div className="text-slate-400 font-semibold uppercase text-[10px]">Email Address</div>
            <div className="font-bold text-slate-800 text-sm mt-1">{info.email}</div>
          </div>
          <MdEmail size={18} className="text-slate-400" />
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
          <div>
            <div className="text-slate-400 font-semibold uppercase text-[10px]">Registered Phone</div>
            <div className="font-bold text-slate-800 text-sm mt-1">{info.phone}</div>
          </div>
          <MdPhone size={18} className="text-slate-400" />
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 md:col-span-2 flex items-start justify-between">
          <div>
            <div className="text-slate-400 font-semibold uppercase text-[10px]">Residential Address</div>
            <div className="font-bold text-slate-800 text-sm mt-1">{info.address}</div>
          </div>
          <MdLocationOn size={18} className="text-slate-400" />
        </div>
      </div>

      <div className="flex justify-end items-center mt-6 pt-4 border-t border-slate-100">
        <Link
          to={`/profile/${info.id}/update`}
          className="inline-flex font-bold text-xs bg-slate-800 text-white hover:bg-teal-700 px-4 py-2 rounded-xl transition duration-200 items-center gap-1.5 shadow-sm"
        >
          <span>Update Account Info</span>
          <RiArrowRightLine size={14} />
        </Link>
      </div>
    </div>
  );
}

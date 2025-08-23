import React from "react";
import { useDispatch } from "react-redux";
import { withdrawApplication } from "../../features/Applications/applicationSlice";

const ApplicationItem = ({ application }) => {
  const dispatch = useDispatch();

  if (!application || !application.jobId) {
    return null; // or show a loader/skeleton
  }

  const { jobId, status, createdAt } = application;
  const appliedDate = new Date(createdAt).toLocaleDateString();

  // Dynamic status badge
  const statusClass =
    status === "received"
      ? "bg-yellow-100 text-yellow-600"
      : status === "accepted"
      ? "bg-green-100 text-green-600"
      : "bg-red-100 text-red-600";

  const handleWithdraw = () => {
    // Pass jobId._id (if your backend expects jobId)
    // or application._id (if it expects applicationId)
    dispatch(withdrawApplication(jobId._id));
  };

  return (
    <div className="flex items-center border-b border-gray-100 pb-4 last:border-b-0">
      {/* Company initials */}
      <div className="w-12 h-12 rounded-lg bg-gray-100 text-blue-500 font-bold text-lg flex items-center justify-center mr-4">
        {jobId.company?.charAt(0).toUpperCase()}
        {jobId.company?.charAt(1).toUpperCase()}
      </div>

      {/* Job details */}
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{jobId.title}</h4>
        <p className="text-sm text-gray-500">
          {jobId.company} • Applied on: {appliedDate}
        </p>
      </div>

      {/* Status badge */}
      <span
        className={`py-1 px-3 rounded-full text-xs font-semibold ${statusClass} mr-3`}
      >
        {status}
      </span>

      {/* Withdraw button */}
      <button
        onClick={handleWithdraw}
        className="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded-md text-xs font-medium transition"
      >
        Withdraw
      </button>
    </div>
  );
};

export default ApplicationItem;

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { FaHeart } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import {
  applyToJob,
  unsaveJob,
} from "../../features/Applications/applicationSlice";

const SavedJobCard = ({ job }) => {
  const dispatch = useDispatch();

  if (!job?.jobId) return null;
  const { _id: savedId, jobId } = job;
  const {
    _id: jobIdVal,
    title,
    company,
    location,
    salaryMin,
    salaryMax,
  } = jobId;

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  // 🔹 Unsave job
  const handleUnsave = async () => {
    try {
      await dispatch(unsaveJob(savedId)); // unsave by saved job id
    } catch (error) {
      console.error("Failed to unsave job:", error);
    }
  };

  // 🔹 Toggle apply modal
  const handleApplyToggle = () => setShowApplyForm(!showApplyForm);

  // 🔹 Submit application
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        applyToJob({ jobId: jobIdVal, data: { resumeUrl, coverLetter } })
      );
      setShowApplyForm(false);
      setResumeUrl("");
      setCoverLetter("");
    } catch (error) {
      console.error("Failed to apply:", error);
      alert("Failed to apply!");
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
            <button
              onClick={handleUnsave}
              className="text-red-500 hover:text-red-600 transition-colors"
              aria-label="Unsave Job"
            >
              <FaHeart />
            </button>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-blue-100 text-blue-500 font-bold mr-2 flex items-center justify-center text-xs">
              {company.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong className="text-gray-700 text-sm">{company}</strong>
              <p className="text-xs text-gray-500 flex items-center">
                <MdLocationOn className="mr-1" />
                <span>{location}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 flex justify-between items-center">
          <span className="font-bold text-green-600">
            ${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()}
          </span>
          <button
            onClick={handleApplyToggle}
            className="bg-blue-500 text-white text-sm py-1.5 px-4 rounded-lg hover:bg-blue-600"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* 🔹 Apply Modal */}
      {showApplyForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg">
            <button
              onClick={handleApplyToggle}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-md bg-blue-100 text-blue-500 font-bold flex items-center justify-center mr-3">
                {company.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong className="text-gray-700 text-lg">{company}</strong>
                <p className="text-sm text-gray-500">{location}</p>
              </div>
            </div>

            <hr className="my-4" />

            <h3 className="text-xl font-semibold mb-3">
              Submit Your Application
            </h3>
            <form onSubmit={handleApplySubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Resume URL"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                className="border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              <textarea
                placeholder="Cover Letter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={4}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SavedJobCard;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaClock,
  FaGraduationCap,
  FaStar,
  FaHeart,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import {
  applyToJob,
  saveJob,
  unsaveJob,
} from "../features/Applications/applicationSlice";

const JobCard = ({
                   jobId,
                   title,
                   company,
                   location,
                   type,
                   timeAgo,
                   salary,
                   education,
                   skills = [],
                   isFeatured = false,
                   isSavedInitial = false,
                 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.user);

  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  // Check if user is authenticated
  const isAuthenticated = user && token;

  // Toggle save job - requires authentication
  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          message: "Please login to save jobs",
          returnUrl: window.location.pathname
        }
      });
      return;
    }

    try {
      if (isSaved) {
        await dispatch(unsaveJob(jobId));
      } else {
        await dispatch(saveJob(jobId));
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Failed to update saved jobs:", error);
    }
  };

  // Open apply form or redirect to login if not authenticated
  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          message: "Please login to apply for this job",
          returnUrl: window.location.pathname
        }
      });
      return;
    }
    setShowApplyForm(true);
  };

  // Submit application
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(applyToJob({ jobId, data: { resumeUrl, coverLetter } }));
      setShowApplyForm(false);
      setResumeUrl("");
      setCoverLetter("");
      alert("Application submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to apply! Please try again.");
    }
  };

  return (
      <>
        <div
            className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 relative border ${
                isFeatured ? "border-l-4 border-blue-500" : "border-transparent"
            } flex flex-col h-full`}
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
              <button
                  onClick={handleSaveToggle}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                  aria-label={isSaved ? "Unsave Job" : "Save Job"}
              >
                <FaHeart className={isSaved ? "text-red-500" : "text-gray-400"} />
              </button>
            </div>
            <div className="flex items-center mb-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-100 text-blue-500 font-bold mr-3">
                {company.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong className="text-gray-700">{company}</strong>
                <div className="flex items-center text-sm text-gray-500">
                  <MdLocationOn className="mr-1" />
                  <span>{location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-5 text-gray-600 flex flex-col flex-grow">
            <div className="flex items-center mb-2">
              <FaBriefcase className="text-blue-500 mr-2" />
              <span>{type}</span>
            </div>
            <div className="flex items-center mb-2">
              <FaClock className="text-blue-500 mr-2" />
              <span>Posted {timeAgo}</span>
            </div>
            {education && (
                <div className="flex items-center mb-2">
                  <FaGraduationCap className="text-blue-500 mr-2" />
                  <span>{education}</span>
                </div>
            )}
            {skills.length > 0 && (
                <div className="flex items-center mb-2">
                  <FaStar className="text-blue-500 mr-2" />
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full"
                        >
                    {skill}
                  </span>
                    ))}
                  </div>
                </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 flex justify-between items-center mt-auto">
            {salary && (
                <div className="text-lg font-bold text-green-600">{salary}</div>
            )}
            <button
                onClick={handleApplyClick}
                className="bg-blue-500 text-white font-medium py-2 px-5 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Apply Now
            </button>
          </div>
        </div>

        {/* Apply Form Modal - Only shown if user is authenticated */}
        {showApplyForm && isAuthenticated && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg">
                {/* Close button */}
                <button
                    onClick={() => setShowApplyForm(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>

                {/* Job details in the modal */}
                <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-100 text-blue-500 font-bold mr-3">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resume URL *
                    </label>
                    <input
                        type="url"
                        placeholder="https://example.com/your-resume.pdf"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                        className="border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Paste a link to your resume (Google Drive, Dropbox, etc.)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Letter
                    </label>
                    <textarea
                        placeholder="Why are you interested in this position?"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                        rows={4}
                    ></textarea>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                        type="button"
                        onClick={() => setShowApplyForm(false)}
                        className="flex-1 bg-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </>
  );
};

export default JobCard;
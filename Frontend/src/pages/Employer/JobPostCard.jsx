import React from "react";
import {
  FaDollarSign,
  FaMapMarkerAlt,
  FaClock,
  FaFileAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

const getStatusClass = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-600";
    case "Inactive":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const JobCard = ({
  job,
  showActions,
  handleViewApps,
  handleEditJob,
  handleDeleteJob,
}) => {
  return (
    <div className="job-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
        <div className="flex flex-wrap items-center text-gray-500 text-sm mt-2">
          <span className="flex items-center mr-4">
            <MdLocationOn className="mr-1 text-blue-500" /> {job.location}
          </span>
          <span className="flex items-center mr-4">
            <FaDollarSign className="mr-1 text-blue-500" /> {job.salary}
          </span>
          <span className="flex items-center">
            <FaClock className="mr-1 text-blue-500" /> {job.jobType}
          </span>
        </div>
      </div>
      <div className="p-4 flex-grow">
        <div className="flex items-center text-blue-500 font-medium mb-3">
          <FaFileAlt className="mr-2" /> {job.applicationsCount || 0}{" "}
          Applications
        </div>
        <p className="text-gray-600 text-sm">{job.description}</p>
      </div>
      {showActions && (
        <div className="p-4 bg-gray-50 flex justify-between items-center">
          <span
            className={`py-1 px-3 rounded-full text-xs font-semibold ${getStatusClass(
              job.status
            )}`}
          >
            {job.status}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleViewApps(job._id)}
              className="bg-white text-blue-500 border border-blue-500 py-1.5 px-3 rounded-lg text-sm hover:bg-blue-500 hover:text-white transition-colors"
            >
              View Apps
            </button>
            <button
              onClick={() => handleEditJob(job._id)}
              className="bg-white text-gray-500 border border-gray-300 py-1.5 px-3 rounded-lg text-sm hover:bg-gray-100 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteJob(job._id)}
              className="bg-red-500 text-white py-1.5 px-3 rounded-lg text-sm hover:bg-red-600"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;

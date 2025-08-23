import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { viewApplications, deleteJob } from "../../features/Jobs/jobSlice";
import JobCard from "./JobPostCard";

const JobPostsContent = ({ jobs }) => {
  const dispatch = useDispatch();
  const handlePostJob = () => alert("Redirecting to Post New Job page...");

  const handleViewApps = (jobId) => {
    dispatch(viewApplications({ jobId, token: "YOUR_TOKEN" }));
    // You would likely also navigate to the applications view here
    alert(`Viewing applications for job ${jobId}`);
  };

  const handleEditJob = (jobId) => alert(`Editing job ${jobId}`);

  const handleDeleteJob = (jobId) => {
    if (window.confirm("Are you sure you want to delete this job post?")) {
      dispatch(deleteJob({ id: jobId, token: "YOUR_TOKEN" }));
    }
  };

  return (
    <div className="dashboard-card bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
        <h3 className="text-xl font-semibold">My Job Posts</h3>
        <button
          onClick={handlePostJob}
          className="bg-blue-500 text-white py-2 px-5 rounded-lg text-sm hover:bg-blue-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Post New Job
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            handleViewApps={handleViewApps}
            handleEditJob={handleEditJob}
            handleDeleteJob={handleDeleteJob}
            showActions={true} // A prop to show/hide edit/delete buttons
          />
        ))}
      </div>
    </div>
  );
};

export default JobPostsContent;

import React from "react";
import { FaBriefcase, FaFileAlt, FaEye, FaUsers, FaPlus } from "react-icons/fa";
import JobCard from "./JobPostCard";
import ApplicationCard from "./ApplicationCard";

const DashboardContent = ({
  jobs,
  applications,
  employer,
  setActiveSection,
}) => {
  const handlePostJob = () => alert("Redirecting to Post New Job page...");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-bold">Employer Dashboard</h2>
          <p className="text-gray-500 mt-1">
            Welcome back, {employer?.name || "Recruiter"}! Here's your hiring
            overview.
          </p>
        </div>
        <button
          onClick={handlePostJob}
          className="bg-blue-500 text-white font-medium py-2 px-5 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center"
        >
          <FaPlus className="mr-2" /> Post New Job
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-blue-100 text-blue-500 text-2xl">
            <FaBriefcase />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{jobs.length}</h3>
            <p className="text-gray-500 text-sm">Active Jobs</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-green-100 text-green-500 text-2xl">
            <FaFileAlt />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{applications.length}</h3>
            <p className="text-gray-500 text-sm">Total Applications</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-purple-100 text-purple-500 text-2xl">
            <FaEye />
          </div>
          <div>
            <h3 className="text-2xl font-bold">256</h3>
            <p className="text-gray-500 text-sm">Profile Views</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-yellow-100 text-yellow-500 text-2xl">
            <FaUsers />
          </div>
          <div>
            <h3 className="text-2xl font-bold">24</h3>
            <p className="text-gray-500 text-sm">New Candidates</p>
          </div>
        </div>
      </div>

      {/* Recent Job Posts */}
      <div className="dashboard-card bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
          <h3 className="text-xl font-semibold">Recent Job Posts</h3>
          <a
            href="#"
            onClick={() => setActiveSection("jobPosts")}
            className="text-blue-500 text-sm hover:underline"
          >
            View All
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.slice(0, 2).map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="dashboard-card bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
          <h3 className="text-xl font-semibold">Recent Applications</h3>
          <a
            href="#"
            onClick={() => setActiveSection("applications")}
            className="text-blue-500 text-sm hover:underline"
          >
            View All
          </a>
        </div>
        <div className="list-none space-y-4">
          {applications.slice(0, 2).map((app) => (
            <ApplicationCard key={app._id} application={app} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;

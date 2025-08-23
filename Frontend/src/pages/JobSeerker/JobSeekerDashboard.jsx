import React, { useEffect, useState } from "react";
import { FaBriefcase, FaHeart, FaEye, FaBuilding } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import JobCard from "./JobCard";
import ApplicationItem from "./ApplicationItem.jsx";
import {
  getMyApplications,
  getSavedJobs,
  updateProfile,
} from "../../features/Applications/applicationSlice.js";
import { getProfile } from "../../features/Users/userSlice.js";
import Profile from "./Profile.jsx";

const JobSeekerDashboard = () => {
  const dispatch = useDispatch();

  // 🔹 Access Redux state
  const { applications, savedJobs, profile, isLoading, isError, message } =
    useSelector((state) => state.applications);

  const { user } = useSelector((state) => state.user);

  const [activeSection, setActiveSection] = useState("dashboard");

  // 🔹 Fetch applications + saved jobs on mount
  useEffect(() => {
    dispatch(getMyApplications());
    dispatch(getSavedJobs());
    dispatch(getProfile());
  }, [dispatch]);

  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold">Job Seeker Dashboard</h2>
                <p className="text-gray-500 mt-1">
                  Welcome back! Here's the latest activity on your account.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
                <div className="w-12 h-12 flex items-center justify-center mr-4 bg-blue-100 text-blue-500 text-2xl rounded-lg">
                  <FaBriefcase />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {applications?.length || 0}
                  </h3>
                  <p className="text-gray-500 text-sm">Jobs Applied</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
                <div className="w-12 h-12 flex items-center justify-center mr-4 bg-green-100 text-green-500 text-2xl rounded-lg">
                  <FaHeart />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {savedJobs?.length || 0}
                  </h3>
                  <p className="text-gray-500 text-sm">Saved Jobs</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
                <div className="w-12 h-12 flex items-center justify-center mr-4 bg-purple-100 text-purple-500 text-2xl rounded-lg">
                  <FaEye />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{profile?.views || 0}</h3>
                  <p className="text-gray-500 text-sm">Profile Views</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
                <div className="w-12 h-12 flex items-center justify-center mr-4 bg-yellow-100 text-yellow-500 text-2xl rounded-lg">
                  <FaBuilding />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {profile?.interviews || 0}
                  </h3>
                  <p className="text-gray-500 text-sm">Interviews</p>
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="dashboard-card bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                <h3 className="text-xl font-semibold">Recent Applications</h3>
              </div>
              <div className="list-none space-y-4">
                {applications?.length > 0 ? (
                  applications
                    .filter((app) => app.jobId) // make sure jobId exists
                    .map((app) => (
                      <ApplicationItem key={app._id} application={app} />
                    ))
                ) : (
                  <p className="text-gray-500">No applications yet</p>
                )}
              </div>
            </div>
          </div>
        );

      case "profile":
        return <Profile />;

      case "applications":
        return (
          <div className="dashboard-card bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">My Applications</h3>
            <div className="list-none space-y-4">
              {applications?.length > 0 ? (
                applications
                  .filter((app) => app.jobId) // guard
                  .map((app) => (
                    <ApplicationItem key={app._id} application={app} />
                  ))
              ) : (
                <p className="text-gray-500">No applications yet</p>
              )}
            </div>
          </div>
        );

      case "saved":
        return (
          <div className="dashboard-card bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">My Saved Jobs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedJobs?.length > 0 ? (
                savedJobs
                  .filter((job) => job.jobId) // guard
                  .map((job) => <JobCard key={job._id} job={job} />)
              ) : (
                <p className="text-gray-500">No saved jobs yet</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar
            user={user || { name: "Guest" }}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
          <div className="main-content flex-1">
            {isLoading ? <p>Loading...</p> : renderMainContent()}
            {isError && <p className="text-red-500">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;

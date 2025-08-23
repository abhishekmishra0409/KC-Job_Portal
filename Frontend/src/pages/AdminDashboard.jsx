import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaUsers,
  FaBriefcase,
  FaChartBar,
  FaFlag,
  FaCog,
  FaSignOutAlt,
  FaSyncAlt,
  FaSearch,
  FaFileAlt,
} from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStats,
  fetchUsers,
  fetchJobs,
  banUser,
  removeJob,
} from "../features/Admin/adminSlice";

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-600";
    case "banned":
      return "bg-red-100 text-red-600";
    case "closed":
      return "bg-gray-100 text-gray-600";
    case "pending":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, users, jobs, isLoading } = useSelector((state) => state.admin);

  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isRemoveJobModalOpen, setIsRemoveJobModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchUsers());
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleBanUser = () => {
    if (selectedUser) {
      dispatch(banUser(selectedUser._id));
      setIsBanModalOpen(false);
    }
  };

  const handleRemoveJob = () => {
    if (selectedJob) {
      dispatch(removeJob(selectedJob._id));
      setIsRemoveJobModalOpen(false);
    }
  };

  return (
    <div className="bg-gray-100 font-sans min-h-screen">
      <div className="container mx-auto p-8 lg:p-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 bg-white rounded-xl shadow-md p-6 h-fit">
            <div className="text-center pb-5 border-b border-gray-200 mb-5">
              <div className="w-20 h-20 rounded-full bg-blue-500 text-white text-3xl font-bold flex items-center justify-center mx-auto mb-4">
                A
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Admin</h3>
              <p className="text-sm text-gray-500">System Administrator</p>
              <div className="mt-4 text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>Total Users</span>
                  <span className="font-semibold text-blue-500">
                    {stats?.totalUsers || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Job Posts</span>
                  <span className="font-semibold text-blue-500">
                    {stats?.totalJobs || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Applications</span>
                  <span className="font-semibold text-blue-500">
                    {stats?.totalApplications || 0}
                  </span>
                </div>
              </div>
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="flex items-center p-3 rounded-lg bg-blue-500 text-white"
                >
                  <FaHome className="mr-3 w-5" /> Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/logout"
                  className="flex items-center p-3 rounded-lg hover:bg-blue-100 text-gray-700 hover:text-blue-500"
                >
                  <FaSignOutAlt className="mr-3 w-5" /> Logout
                </a>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Admin Dashboard
                </h2>
                <p className="text-gray-500 mt-1">
                  Welcome back, Admin. Here's the system overview.
                </p>
              </div>
              <button
                onClick={() => {
                  dispatch(fetchStats());
                  dispatch(fetchUsers());
                  dispatch(fetchJobs());
                }}
                className="bg-blue-500 text-white py-2 px-5 rounded-lg flex items-center"
              >
                <FaSyncAlt className="mr-2" /> Refresh Data
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
                <div className="w-12 h-12 flex items-center justify-center mr-4 bg-gray-100 text-blue-500 text-2xl">
                  <FaUsers />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {stats?.totalUsers || 0}
                  </h3>
                  <p className="text-gray-500 text-sm">Total Users</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
                <div className="w-12 h-12 flex items-center justify-center mr-4 bg-gray-100 text-green-500 text-2xl">
                  <FaBriefcase />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {stats?.totalJobs || 0}
                  </h3>
                  <p className="text-gray-500 text-sm">Job Posts</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
                <div className="w-12 h-12 flex items-center justify-center mr-4 bg-gray-100 text-purple-500 text-2xl">
                  <FaFileAlt />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {stats?.totalApplications || 0}
                  </h3>
                  <p className="text-gray-500 text-sm">Applications</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
                <div className="w-12 h-12 flex items-center justify-center mr-4 bg-gray-100 text-yellow-500 text-2xl">
                  <FaFlag />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">0</h3>
                  <p className="text-gray-500 text-sm">Reports</p>
                </div>
              </div>
            </div>

            {/* User Management */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">User Management</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-left">Email</th>
                      <th className="py-3 px-4 text-left">Role</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">{user.name}</td>
                        <td className="py-4 px-4">{user.email}</td>
                        <td className="py-4 px-4 capitalize">{user.role}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`py-1 px-3 rounded-full text-xs font-medium ${
                              user.status === "banned"
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {user.status === "banned" ? "Banned" : "Active"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsBanModalOpen(true);
                            }}
                            className="bg-yellow-500 text-white py-1 px-3 rounded-lg text-sm hover:bg-yellow-600"
                          >
                            {user.status === "banned" ? "Unban" : "Ban"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Job Management */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Job Management</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-3 px-4 text-left">Title</th>
                      <th className="py-3 px-4 text-left">Employer</th>
                      <th className="py-3 px-4 text-left">Location</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs?.map((job) => (
                      <tr
                        key={job._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">{job.title}</td>
                        <td className="py-4 px-4">{job.employerId?.name}</td>
                        <td className="py-4 px-4">{job.location}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`py-1 px-3 rounded-full text-xs font-medium ${getStatusClass(
                              job.status
                            )}`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => {
                              setSelectedJob(job);
                              setIsRemoveJobModalOpen(true);
                            }}
                            className="bg-red-500 text-white py-1 px-3 rounded-lg text-sm hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ban Modal */}
      {isBanModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Confirm Ban</h2>
              <button
                onClick={() => setIsBanModalOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <RiCloseCircleFill className="text-3xl" />
              </button>
            </div>
            <p className="py-6">
              Are you sure you want to{" "}
              {selectedUser?.isBanned ? "unban" : "ban"}{" "}
              <strong>{selectedUser?.name}</strong>?
            </p>
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsBanModalOpen(false)}
                className="bg-white text-gray-500 border border-gray-300 py-2 px-4 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleBanUser}
                className="bg-red-500 text-white py-2 px-4 rounded-lg text-sm ml-2"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Job Modal */}
      {isRemoveJobModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Confirm Job Removal</h2>
              <button
                onClick={() => setIsRemoveJobModalOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <RiCloseCircleFill className="text-3xl" />
              </button>
            </div>
            <p className="py-6">
              Are you sure you want to remove{" "}
              <strong>{selectedJob?.title}</strong>?
            </p>
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsRemoveJobModalOpen(false)}
                className="bg-white text-gray-500 border border-gray-300 py-2 px-4 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveJob}
                className="bg-red-500 text-white py-2 px-4 rounded-lg text-sm ml-2"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

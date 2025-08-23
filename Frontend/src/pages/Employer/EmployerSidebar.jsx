import React from "react";
import {
  FaBriefcase,
  FaHome,
  FaBuilding,
  FaSearch,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaFileAlt,
} from "react-icons/fa";

const Sidebar = ({
  employer,
  jobsCount,
  applicationsCount,
  activeSection,
  setActiveSection,
  isMobileSidebarOpen,
}) => {
  return (
    <div
      className={`w-full lg:w-64 flex-shrink-0 bg-white rounded-xl shadow-md p-6 h-fit ${
        isMobileSidebarOpen ? "block" : "hidden"
      } lg:block transition-all duration-300`}
    >
      <div className="company-summary text-center pb-5 border-b border-gray-200 mb-5">
        <div className="w-20 h-20 rounded-lg bg-blue-500 text-white text-3xl font-bold flex items-center justify-center mx-auto mb-4">
          {employer?.name ? employer.name.charAt(0) : "TC"}
        </div>
        <h3 className="text-xl font-semibold">
          {employer?.name || "TechCorp Inc."}
        </h3>
        <p className="text-sm text-gray-500">
          {employer?.tagline || "Technology • 50-200 employees"}
        </p>
        <div className="stats mt-4">
          <div className="stat-item flex justify-between text-sm text-gray-600 mb-2">
            <span>Job Posts</span>
            <span className="font-semibold text-blue-500">{jobsCount}</span>
          </div>
          <div className="stat-item flex justify-between text-sm text-gray-600">
            <span>Applications</span>
            <span className="font-semibold text-blue-500">
              {applicationsCount}
            </span>
          </div>
        </div>
      </div>

      <ul className="menu-items list-none space-y-2">
        <li>
          <a
            href="#"
            onClick={() => setActiveSection("dashboard")}
            className={`flex items-center p-3 rounded-lg transition-colors ${
              activeSection === "dashboard"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
            }`}
          >
            <FaHome className="mr-3" /> Dashboard
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => setActiveSection("companyProfile")}
            className={`flex items-center p-3 rounded-lg transition-colors ${
              activeSection === "companyProfile"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
            }`}
          >
            <FaBuilding className="mr-3" /> Company Profile
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => setActiveSection("jobPosts")}
            className={`flex items-center p-3 rounded-lg transition-colors ${
              activeSection === "jobPosts"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
            }`}
          >
            <FaBriefcase className="mr-3" /> Job Posts
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => setActiveSection("applications")}
            className={`flex items-center p-3 rounded-lg transition-colors ${
              activeSection === "applications"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
            }`}
          >
            <FaFileAlt className="mr-3" /> Applications
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => setActiveSection("findCandidates")}
            className={`flex items-center p-3 rounded-lg transition-colors ${
              activeSection === "findCandidates"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
            }`}
          >
            <FaSearch className="mr-3" /> Find Candidates
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => setActiveSection("messages")}
            className={`flex items-center p-3 rounded-lg transition-colors ${
              activeSection === "messages"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
            }`}
          >
            <FaEnvelope className="mr-3" /> Messages
          </a>
        </li>
        <li>
          <a
            href="#"
            className="flex items-center p-3 rounded-lg transition-colors text-gray-700 hover:bg-blue-100 hover:text-blue-500"
          >
            <FaCog className="mr-3" /> Settings
          </a>
        </li>
        <li>
          <a
            href="#"
            className="flex items-center p-3 rounded-lg transition-colors text-gray-700 hover:bg-blue-100 hover:text-blue-500"
          >
            <FaSignOutAlt className="mr-3" /> Logout
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

import React from "react";
import { FaBriefcase, FaHeart, FaUser, FaSignOutAlt } from "react-icons/fa";
import { FaHome } from "react-icons/fa";

// ProfileSummary Component (nested)
const ProfileSummary = ({ user }) => (
  <div className="text-center pb-5 border-b border-gray-200 mb-5">
    <div className="w-20 h-20 rounded-full bg-blue-500 text-white text-3xl font-bold flex items-center justify-center mx-auto mb-4">
      {user.name
        .split(" ")
        .map((n) => n[0])
        .join("")}
    </div>
    <h3 className="text-xl font-semibold">{user.name}</h3>
    <p className="text-sm text-gray-500">{user.title}</p>
  </div>
);

// SidebarMenu Component (nested)
const SidebarMenu = ({ activeSection, setActiveSection }) => (
  <ul className="menu-items list-none space-y-2">
    <li>
      <a
        href="#"
        className={`flex items-center p-3 rounded-lg transition-colors ${
          activeSection === "dashboard"
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
        }`}
        onClick={() => setActiveSection("dashboard")}
      >
        <FaHome className="mr-3" /> Dashboard
      </a>
    </li>
    <li>
      <a
        href="#"
        className={`flex items-center p-3 rounded-lg transition-colors ${
          activeSection === "profile"
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
        }`}
        onClick={() => setActiveSection("profile")}
      >
        <FaUser className="mr-3" /> My Profile
      </a>
    </li>
    <li>
      <a
        href="#"
        className={`flex items-center p-3 rounded-lg transition-colors ${
          activeSection === "applications"
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
        }`}
        onClick={() => setActiveSection("applications")}
      >
        <FaBriefcase className="mr-3" /> Job Applications
      </a>
    </li>
    <li>
      <a
        href="#"
        className={`flex items-center p-3 rounded-lg transition-colors ${
          activeSection === "saved"
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
        }`}
        onClick={() => setActiveSection("saved")}
      >
        <FaHeart className="mr-3" /> Saved Jobs
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
);

const Sidebar = ({ user, activeSection, setActiveSection }) => {
  return (
    <div className="w-full lg:w-64 flex-shrink-0 bg-white rounded-xl shadow-md p-6 h-fit">
      <ProfileSummary user={user} />
      <SidebarMenu
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
    </div>
  );
};

export default Sidebar;

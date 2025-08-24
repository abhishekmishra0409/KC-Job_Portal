import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaBriefcase,
  FaHome,
  FaBuilding,
  FaSearch,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaFileAlt,
  FaEye,
  FaUsers,
  FaPlus,
  FaDollarSign,
  FaMapMarkerAlt,
  FaClock,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";
// Import Redux actions
import {
  updateCompanyProfile,
  createJob,
  browseJobs,
  getJobById,
  viewApplications,
  searchJobSeekers,
  updateJob,
  deleteJob,
} from "../../features/Jobs/jobSlice";
import { logout, getProfile } from "../../features/Users/userSlice";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.user);
  const {
    jobs,
    job,
    applications,
    seekers,
    employer,
    isLoading,
    isSuccess,
    isError,
    message,
  } = useSelector((state) => state.jobs);


  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [newJobData, setNewJobData] = useState({
    title: "",
    description: "",
    location: "",
    type: "Full-time",
    salaryMin: "",
    salaryMax: "",
    requiredSkills: [],
    requiredExperience: "",
    isRemote: false,
  });
  const [companyProfileData, setCompanyProfileData] = useState({
    name: "",
    website: "",
    about: "",
    location: "",
    logoUrl: "",
  });
  const [searchFilters, setSearchFilters] = useState({
    skills: "",
    city: "",
    country: "",
  });
  const [skillsInput, setSkillsInput] = useState("");

  // Load user profile and employer data on mount
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user && user.role === "employer") {
      // Load employer data and jobs when component mounts
      dispatch(browseJobs({ employerId: user._id }));

      // Set company profile data if available
      if (user.company) {
        setCompanyProfileData({
          name: user.company.name || "",
          website: user.company.website || "",
          about: user.company.about || "",
          location: user.company.location || "",
          logoUrl: user.company.logoUrl || "",
        });
      }
    }
  }, [dispatch, user]);

  // Handle job creation
  // Handle job creation
  const handleCreateJob = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!newJobData.title || !newJobData.description) {
      alert("Please fill in all required fields (title and description)");
      return;
    }

    try {
      // Prepare the complete job data with all required fields
      const completeJobData = {
        title: newJobData.title,
        description: newJobData.description,
        location: newJobData.location || '',
        type: newJobData.type || 'Full-time',
        salaryMin: newJobData.salaryMin ? parseInt(newJobData.salaryMin) : null,
        salaryMax: newJobData.salaryMax ? parseInt(newJobData.salaryMax) : null,
        requiredSkills: newJobData.requiredSkills || [],
        requiredExperience: newJobData.requiredExperience ? parseInt(newJobData.requiredExperience) : null,
        isRemote: newJobData.isRemote || false,
      };

      await dispatch(createJob(completeJobData )).unwrap();

      // Reset form
      setNewJobData({
        title: "",
        description: "",
        location: "",
        type: "Full-time",
        salaryMin: "",
        salaryMax: "",
        requiredSkills: [],
        requiredExperience: "",
        isRemote: false,
      });
      setSkillsInput("");

      alert("Job posted successfully!");
      setActiveSection("dashboard");
    } catch (error) {
      console.error("Job creation error:", error);
      alert(`Failed to post job: ${error.response?.data?.message || error.message}`);
    }
  };

  // Handle company profile update
  const handleUpdateCompanyProfile = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
          updateCompanyProfile(companyProfileData )
      ).unwrap();
      alert("Company profile updated successfully!");
      dispatch(getProfile()); // Refresh user data
    } catch (error) {
      alert(`Failed to update company profile: ${error.message}`);
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await dispatch(deleteJob( jobId )).unwrap();
        alert("Job deleted successfully!");
        dispatch(browseJobs( user._id )); // Refresh jobs list
      } catch (error) {
        alert(`Failed to delete job: ${error.message}`);
      }
    }
  };

  // Handle searching for candidates
  const handleSearchCandidates = async (e) => {
    e.preventDefault();
    try {
      // Convert skills input to comma-separated string for the API
      const filters = {
        skills: searchFilters.skills,
        city: searchFilters.city,
        country: searchFilters.country
      };

      await dispatch(searchJobSeekers( filters )).unwrap();
    } catch (error) {
      alert(`Failed to search candidates: ${error.message}`);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Add skill to the job requirements
  const addSkill = () => {
    if (skillsInput.trim() && !newJobData.requiredSkills.includes(skillsInput.trim())) {
      setNewJobData({
        ...newJobData,
        requiredSkills: [...newJobData.requiredSkills, skillsInput.trim()]
      });
      setSkillsInput("");
    }
  };

  // Remove skill from job requirements
  const removeSkill = (index) => {
    const updatedSkills = [...newJobData.requiredSkills];
    updatedSkills.splice(index, 1);
    setNewJobData({
      ...newJobData,
      requiredSkills: updatedSkills
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "paused":
        return "bg-yellow-100 text-yellow-600";
      case "closed":
        return "bg-red-100 text-red-600";
      case "active":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatSalary = (min, max) => {
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    } else if (min) {
      return `From $${min.toLocaleString()}`;
    } else if (max) {
      return `Up to $${max.toLocaleString()}`;
    }
    return "Negotiable";
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                {/* Left Section */}
                <div>
                  <h2 className="text-xl md:text-3xl font-bold">Employer Dashboard</h2>
                  <p className="text-gray-500 mt-1 text-sm md:text-base">
                    Welcome back, {user?.name}! Here's your hiring overview.
                  </p>
                </div>

                {/* Right Section */}
                <button
                    onClick={() => setActiveSection("postJob")}
                    className="bg-blue-500 text-white font-medium py-2 px-4 md:px-5 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center self-stretch md:self-auto"
                >
                  <FaPlus className="mr-2"/>
                  <span className="text-sm md:text-base">Post New Job</span>
                </button>
              </div>


              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
                  <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-blue-100 text-blue-500 text-2xl">
                    <FaBriefcase/>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{jobs?.length || 0}</h3>
                    <p className="text-gray-500 text-sm">Active Jobs</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
                  <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-green-100 text-green-500 text-2xl">
                    <FaFileAlt/>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {jobs?.reduce((total, job) => total + (job.applicationsCount || 0), 0) || 0}
                    </h3>
                    <p className="text-gray-500 text-sm">Total Applications</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
                  <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-purple-100 text-purple-500 text-2xl">
                    <FaEye/>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">0</h3>
                    <p className="text-gray-500 text-sm">Profile Views</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
                  <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-yellow-100 text-yellow-500 text-2xl">
                    <FaUsers/>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{seekers?.length || 0}</h3>
                    <p className="text-gray-500 text-sm">Candidates Found</p>
                  </div>
                </div>
              </div>

              {/* Recent Job Posts */}
              <div className="dashboard-card bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                  <h3 className="text-xl font-semibold">Recent Job Posts</h3>
                  <button
                      onClick={() => setActiveSection("jobPosts")}
                      className="text-blue-500 text-sm hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs && jobs.slice(0, 2).map((job) => (
                      <div
                          key={job._id}
                          className="job-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="p-4 border-b border-gray-100">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center text-gray-500 text-sm mt-2">
                        <span className="flex items-center mr-4">
                          <MdLocationOn className="mr-1 text-blue-500"/>{" "}
                          {job.isRemote ? "Remote" : job.location}
                        </span>
                            <span className="flex items-center mr-4">
                          <FaDollarSign className="mr-1 text-blue-500"/>{" "}
                              {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                            <span className="flex items-center">
                          <FaClock className="mr-1 text-blue-500"/>{" "}
                              {job.type}
                        </span>
                          </div>
                        </div>
                        <div className="p-4 flex-grow">
                          <div className="flex items-center text-blue-500 font-medium mb-3">
                            <FaFileAlt className="mr-2"/>{" "}
                            {job.applicationsCount || 0} Applications
                          </div>
                          <p className="text-gray-600 text-sm">
                            {job.description.substring(0, 100)}...
                          </p>
                          {job.requiredSkills && job.requiredSkills.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700">Skills:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {job.requiredSkills.slice(0, 3).map((skill, index) => (
                                      <span
                                          key={index}
                                          className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs"
                                      >
                                {skill}
                              </span>
                                  ))}
                                  {job.requiredSkills.length > 3 && (
                                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                +{job.requiredSkills.length - 3} more
                              </span>
                                  )}
                                </div>
                              </div>
                          )}
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-between items-center">
                      <span
                          className={`py-1 px-3 rounded-full text-xs font-semibold ${getStatusClass(
                              job.status
                          )}`}
                      >
                        {job.status || "active"}
                      </span>
                          {/*<div className="flex gap-2">*/}
                          {/*  <button*/}
                          {/*      onClick={() => setActiveSection("editJob")}*/}
                          {/*      className="bg-white text-gray-500 border border-gray-300 py-1.5 px-3 rounded-lg text-sm hover:bg-gray-100 transition-colors"*/}
                          {/*  >*/}
                          {/*    Edit*/}
                          {/*  </button>*/}
                          {/*</div>*/}
                        </div>
                      </div>
                  ))}
                  {(!jobs || jobs.length === 0) && (
                      <p className="text-gray-500">No jobs posted yet.</p>
                  )}
                </div>
              </div>
            </div>
        );

      case "postJob":
        return (
            <div className="dashboard-card bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                <h3 className="text-xl font-semibold">Post New Job</h3>
              </div>
              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Title *
                  </label>
                  <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      value={newJobData.title}
                      onChange={(e) =>
                          setNewJobData({ ...newJobData, title: e.target.value })
                      }
                      required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                      rows="4"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      value={newJobData.description}
                      onChange={(e) =>
                          setNewJobData({
                            ...newJobData,
                            description: e.target.value,
                          })
                      }
                      required
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                        value={newJobData.location}
                        onChange={(e) =>
                            setNewJobData({ ...newJobData, location: e.target.value })
                        }
                        disabled={newJobData.isRemote}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Job Type
                    </label>
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                        value={newJobData.type}
                        onChange={(e) =>
                            setNewJobData({ ...newJobData, type: e.target.value })
                        }
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Minimum Salary ($)
                    </label>
                    <input
                        type="number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                        value={newJobData.salaryMin}
                        onChange={(e) =>
                            setNewJobData({ ...newJobData, salaryMin: e.target.value })
                        }
                        placeholder="e.g. 50000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Maximum Salary ($)
                    </label>
                    <input
                        type="number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                        value={newJobData.salaryMax}
                        onChange={(e) =>
                            setNewJobData({ ...newJobData, salaryMax: e.target.value })
                        }
                        placeholder="e.g. 70000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Required Experience (years)
                    </label>
                    <input
                        type="number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                        value={newJobData.requiredExperience}
                        onChange={(e) =>
                            setNewJobData({ ...newJobData, requiredExperience: e.target.value })
                        }
                        placeholder="e.g. 3"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isRemote"
                        className="mr-2"
                        checked={newJobData.isRemote}
                        onChange={(e) =>
                            setNewJobData({ ...newJobData, isRemote: e.target.checked })
                        }
                    />
                    <label htmlFor="isRemote" className="text-sm font-medium text-gray-700">
                      Remote Position
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Required Skills
                  </label>
                  <div className="flex gap-2 mt-1">
                    <input
                        type="text"
                        className="flex-1 rounded-md border-gray-300 shadow-sm p-2"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        placeholder="e.g. React, Node.js"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                    />
                    <button
                        type="button"
                        onClick={addSkill}
                        className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newJobData.requiredSkills.map((skill, index) => (
                        <span
                            key={index}
                            className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm flex items-center"
                        >
                      {skill}
                          <button
                              type="button"
                              onClick={() => removeSkill(index)}
                              className="ml-1 text-red-500 hover:text-red-700"
                          >
                        ×
                      </button>
                    </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                      type="button"
                      onClick={() => setActiveSection("dashboard")}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isLoading ? "Posting..." : "Post Job"}
                  </button>
                </div>
              </form>
            </div>
        );

      case "jobPosts":
        return (
            <div className="dashboard-card bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                <h3 className="text-xl font-semibold">My Job Posts</h3>
                <button
                    onClick={() => setActiveSection("postJob")}
                    className="bg-blue-500 text-white py-2 px-5 rounded-lg text-sm hover:bg-blue-600 flex items-center"
                >
                  <FaPlus className="mr-2" /> Post New Job
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs &&
                    jobs.map((job) => (
                        <div
                            key={job._id}
                            className="job-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="p-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap items-center text-gray-500 text-sm mt-2">
                        <span className="flex items-center mr-4">
                          <MdLocationOn className="mr-1 text-blue-500" />{" "}
                          {job.isRemote ? "Remote" : job.location}
                        </span>
                              <span className="flex items-center mr-4">
                          <FaDollarSign className="mr-1 text-blue-500" />{" "}
                                {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                              <span className="flex items-center">
                          <FaClock className="mr-1 text-blue-500" /> {job.type}
                        </span>
                            </div>
                          </div>
                          <div className="p-4 flex-grow">
                            <div className="flex items-center text-blue-500 font-medium mb-3">
                              <FaFileAlt className="mr-2" />{" "}
                              {job.applicationsCount || 0} Applications
                            </div>
                            <p className="text-gray-600 text-sm">
                              {job.description.substring(0, 100)}...
                            </p>
                            {job.requiredSkills && job.requiredSkills.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm font-medium text-gray-700">Skills:</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {job.requiredSkills.slice(0, 4).map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs"
                                        >
                                {skill}
                              </span>
                                    ))}
                                    {job.requiredSkills.length > 4 && (
                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                +{job.requiredSkills.length - 4} more
                              </span>
                                    )}
                                  </div>
                                </div>
                            )}
                            {job.requiredExperience && (
                                <p className="text-sm text-gray-500 mt-2">
                                  Experience: {job.requiredExperience} years
                                </p>
                            )}
                          </div>
                          <div className="p-4 bg-gray-50 flex justify-between items-center">
                      <span
                          className={`py-1 px-3 rounded-full text-xs font-semibold ${getStatusClass(
                              job.status
                          )}`}
                      >
                        {job.status || "active"}
                      </span>
                            <div className="flex gap-2">
                              {/*<button*/}
                              {/*    onClick={() => setActiveSection("editJob")}*/}
                              {/*    className="bg-white text-gray-500 border border-gray-300 py-1.5 px-3 rounded-lg text-sm hover:bg-gray-100 transition-colors"*/}
                              {/*>*/}
                              {/*  Edit*/}
                              {/*</button>*/}
                              <button
                                  onClick={() => handleDeleteJob(job._id)}
                                  className="bg-red-500 text-white py-1.5 px-3 rounded-lg text-sm hover:bg-red-600"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                    ))}
                {(!jobs || jobs.length === 0) && (
                    <p className="text-gray-500">No jobs posted yet.</p>
                )}
              </div>
            </div>
        );

      case "companyProfile":
        return (
            <div className="dashboard-card bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                <h3 className="text-xl font-semibold">Company Profile</h3>
                <button
                    onClick={handleUpdateCompanyProfile}
                    disabled={isLoading}
                    className="bg-blue-500 text-white py-2 px-5 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      value={companyProfileData.name}
                      onChange={(e) =>
                          setCompanyProfileData({
                            ...companyProfileData,
                            name: e.target.value,
                          })
                      }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <input
                      type="url"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      placeholder="https://www.company.com"
                      value={companyProfileData.website}
                      onChange={(e) =>
                          setCompanyProfileData({
                            ...companyProfileData,
                            website: e.target.value,
                          })
                      }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    About Us
                  </label>
                  <textarea
                      rows="4"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      value={companyProfileData.about}
                      onChange={(e) =>
                          setCompanyProfileData({
                            ...companyProfileData,
                            about: e.target.value,
                          })
                      }
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      value={companyProfileData.location}
                      onChange={(e) =>
                          setCompanyProfileData({
                            ...companyProfileData,
                            location: e.target.value,
                          })
                      }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Logo URL
                  </label>
                  <input
                      type="url"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      placeholder="https://example.com/logo.png"
                      value={companyProfileData.logoUrl}
                      onChange={(e) =>
                          setCompanyProfileData({
                            ...companyProfileData,
                            logoUrl: e.target.value,
                          })
                      }
                  />
                </div>
              </form>
            </div>
        );

      case "findCandidates":
        return (
            <div className="dashboard-card bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                <h3 className="text-xl font-semibold">Find Candidates</h3>
              </div>
              {/* Search Section */}
              <form onSubmit={handleSearchCandidates} className="space-y-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Skills (comma separated)
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. React, Python"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                        value={searchFilters.skills}
                        onChange={(e) =>
                            setSearchFilters({
                              ...searchFilters,
                              skills: e.target.value,
                            })
                        }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. New York"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                        value={searchFilters.city}
                        onChange={(e) =>
                            setSearchFilters({
                              ...searchFilters,
                              city: e.target.value,
                            })
                        }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. USA"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                        value={searchFilters.country}
                        onChange={(e) =>
                            setSearchFilters({
                              ...searchFilters,
                              country: e.target.value,
                            })
                        }
                    />
                  </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-500 text-white py-2 px-5 rounded-lg text-sm hover:bg-blue-600 flex items-center disabled:opacity-50"
                >
                  <FaSearch className="mr-2" /> Search Candidates
                </button>
              </form>

              {/* Search Results */}
              {seekers && seekers.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-4">
                      Search Results ({seekers.length})
                    </h4>
                    <div className="list-none space-y-4">
                      {seekers.map((seeker) => (
                          <div
                              key={seeker._id}
                              className="candidate-item flex items-center border-b border-gray-100 pb-4 last:border-b-0"
                          >
                            <div className="w-12 h-12 rounded-full bg-gray-100 text-blue-500 font-bold text-lg flex items-center justify-center mr-4">
                              {seeker.name?.charAt(0) || "J"}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">
                                {seeker.name}
                              </h4>
                              <p className="text-sm text-gray-500">{seeker.email}</p>
                              {seeker.location && (
                                  <p className="text-sm text-gray-500">
                                    {seeker.location.city && `${seeker.location.city}, `}
                                    {seeker.location.country}
                                  </p>
                              )}
                              <div className="flex flex-wrap gap-1 mt-1">
                                {seeker.skills &&
                                    seeker.skills.slice(0, 5).map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs"
                                        >
                                {skill}
                              </span>
                                    ))}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button className="bg-blue-500 text-white py-1.5 px-3 rounded-lg text-sm hover:bg-blue-600">
                                View Profile
                              </button>
                              <button className="bg-green-500 text-white py-1.5 px-3 rounded-lg text-sm hover:bg-green-600">
                                Contact
                              </button>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
              )}
            </div>
        );

      default:
        return (
            <div className="dashboard-card bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold">Employer Dashboard</h3>
              <p className="text-gray-500 mt-2">
                Select an option from the sidebar to get started.
              </p>
            </div>
        );
    }
  };

  if (!user || user.role !== "employer") {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
            <p className="text-gray-600">
              This page is only accessible to employers.
            </p>
          </div>
        </div>
    );
  }

  return (
      <div className="font-sans text-gray-800 bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Toggle for Mobile */}
            {/*<button*/}
            {/*    onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}*/}
            {/*    className="lg:hidden w-full p-3 bg-blue-500 text-white rounded-md mb-4 flex items-center justify-center"*/}
            {/*>*/}
            {/*  <FaBriefcase className="mr-2" /> Menu*/}
            {/*</button>*/}

            {/* Sidebar */}
            <div
                className={`w-full lg:w-64 flex-shrink-0 bg-white rounded-xl shadow-md p-6 h-fit  lg:block transition-all duration-300`}
            >
              <div className="company-summary text-center pb-5 border-b border-gray-200 mb-5">
                <div className="w-20 h-20 rounded-lg bg-blue-500 text-white text-3xl font-bold flex items-center justify-center mx-auto mb-4">
                  {user.company?.name?.charAt(0) || user.name?.charAt(0) || "C"}
                </div>
                <h3 className="text-xl font-semibold">
                  {user.company?.name || user.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {user.company?.about || "Employer"}
                </p>
                <div className="stats mt-4">
                  <div className="stat-item flex justify-between text-sm text-gray-600 mb-2">
                    <span>Job Posts</span>
                    <span className="font-semibold text-blue-500">
                    {jobs?.length || 0}
                  </span>
                  </div>
                  <div className="stat-item flex justify-between text-sm text-gray-600">
                    <span>Applications</span>
                    <span className="font-semibold text-blue-500">
                    {jobs?.reduce((total, job) => total + (job.applicationsCount || 0), 0) || 0}
                  </span>
                  </div>
                </div>
              </div>

              <ul className="menu-items list-none space-y-2">
                <li>
                  <button
                      onClick={() => setActiveSection("dashboard")}
                      className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                          activeSection === "dashboard"
                              ? "bg-blue-500 text-white"
                              : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
                      }`}
                  >
                    <FaHome className="mr-3" /> Dashboard
                  </button>
                </li>
                <li>
                  <button
                      onClick={() => setActiveSection("companyProfile")}
                      className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                          activeSection === "companyProfile"
                              ? "bg-blue-500 text-white"
                              : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
                      }`}
                  >
                    <FaBuilding className="mr-3" /> Company Profile
                  </button>
                </li>
                <li>
                  <button
                      onClick={() => setActiveSection("jobPosts")}
                      className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                          activeSection === "jobPosts"
                              ? "bg-blue-500 text-white"
                              : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
                      }`}
                  >
                    <FaBriefcase className="mr-3" /> Job Posts
                  </button>
                </li>
                <li>
                  <button
                      onClick={() => setActiveSection("findCandidates")}
                      className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                          activeSection === "findCandidates"
                              ? "bg-blue-500 text-white"
                              : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
                      }`}
                  >
                    <FaSearch className="mr-3" /> Find Candidates
                  </button>
                </li>
                <li>
                  <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center p-3 rounded-lg transition-colors text-gray-700 hover:bg-blue-100 hover:text-blue-500"
                  >
                    <FaSignOutAlt className="mr-3" /> Logout
                  </button>
                </li>
              </ul>
            </div>

            {/* Main Content */}
            <div className="main-content flex-1">{renderMainContent()}</div>
          </div>
        </div>
      </div>
  );
};

export default EmployerDashboard;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";

import { FaUser, FaSearch, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import { browseJobs } from "../features/Jobs/jobSlice";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("jobSeekers");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { jobs, isLoading } = useSelector((state) => state.jobs);

  useEffect(() => {
    // Fetch first page of jobs (limit 3 for featured)
    dispatch(browseJobs({ page: 1, limit: 3 }));
  }, [dispatch]);

  // console.log(jobs);
  return (
    <div className="font-sans text-gray-800 bg-gray-100 min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-gray-800 text-white py-20 text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-5">
                Find Your Dream Job Today
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                Discover thousands of job opportunities from top companies
                around the world
              </p>
              <div className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden shadow-xl">
                <input
                  type="text"
                  className="flex-1 p-4 md:px-6 md:py-4 text-gray-800 outline-none"
                  placeholder="Job title, keywords, or company"
                />
                <input
                  type="text"
                  className="flex-1 p-4 md:px-6 md:py-4 text-gray-800 outline-none border-t md:border-t-0 md:border-l border-gray-200"
                  placeholder="City, state, or remote"
                />
                <button className="bg-blue-500 text-white font-medium py-4 px-8 md:rounded-r-lg hover:bg-blue-600 transition-colors duration-300 mt-2 md:mt-0">
                  Search Jobs
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-3">
                How It Works
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Our platform makes job hunting simple and efficient for both job
                seekers and employers
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl p-8 text-center hover:translate-y-[-5px] transition-transform duration-300 hover:shadow-lg">
                <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
                  <FaUser />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Create Profile
                </h3>
                <p className="text-gray-600">
                  Build your professional profile and upload your resume to get
                  noticed by employers.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-8 text-center hover:translate-y-[-5px] transition-transform duration-300 hover:shadow-lg">
                <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
                  <FaSearch />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Search Jobs
                </h3>
                <p className="text-gray-600">
                  Browse through thousands of job listings with advanced filters
                  to find your perfect match.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-8 text-center hover:translate-y-[-5px] transition-transform duration-300 hover:shadow-lg">
                <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
                  <FaPaperPlane />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Apply
                </h3>
                <p className="text-gray-600">
                  Apply to jobs with a single click and track your applications
                  in your dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="bg-gray-100 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-3">
                Featured Jobs
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Browse through our latest job openings from top companies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.slice(0, 3).map((job) => (
                <JobCard
                  key={job._id}
                  jobId={job._id}
                  title={job.title}
                  company={
                      job.employerId?.company?.name || job.employerId?.email
                  }
                  location={job.location}
                  type={job.type}
                  timeAgo={new Date(job.updatedAt).toLocaleDateString()} // you can format nicely
                  salary={`$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`}
                  education={`${job.requiredExperience} yrs experience`}
                  skills={job.requiredSkills}
                  isFeatured={true}
                />
              ))}
            </div>

            <div className="text-center mt-10">
              <button
                onClick={() => navigate("/jobs")}
                className="bg-white text-blue-500 border-2 border-blue-500 font-medium py-3 px-8 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                View All Jobs
              </button>
            </div>
          </div>
        </section>

        {/* Tabs Section (Job Seekers / Employers / Admin) */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-3">
                For Everyone
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Our platform serves both job seekers and employers with powerful
                tools
              </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-10">
              <button
                className={`py-4 px-8 font-medium text-lg rounded-lg transition-colors duration-300 ${
                  activeTab === "jobSeekers"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("jobSeekers")}
              >
                Job Seekers
              </button>

              <button
                className={`py-4 px-8 font-medium text-lg rounded-lg transition-colors duration-300 ${
                  activeTab === "employers"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("employers")}
              >
                Employers
              </button>

              <button
                className={`py-4 px-8 font-medium text-lg rounded-lg transition-colors duration-300 ${
                  activeTab === "admin"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => navigate("/admin-login")} // redirect instead of setActiveTab
              >
                Admin
              </button>
            </div>

            {/* Tab Content */}
            <div className="max-w-xl mx-auto">
              {activeTab === "jobSeekers" && (
                <ul className="list-none space-y-4">
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-500 text-xl mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <strong className="block text-gray-800">
                        Create a Professional Profile
                      </strong>
                      <p className="text-gray-600">
                        Showcase your skills, experience, and education to
                        attract employers.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-500 text-xl mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <strong className="block text-gray-800">
                        Advanced Job Search
                      </strong>
                      <p className="text-gray-600">
                        Filter jobs by location, salary, experience level, and
                        job type.
                      </p>
                    </div>
                  </li>
                </ul>
              )}

              {activeTab === "employers" && (
                <ul className="list-none space-y-4">
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-500 text-xl mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <strong className="block text-gray-800">
                        Post Job Openings
                      </strong>
                      <p className="text-gray-600">
                        Reach thousands of qualified candidates by posting jobs.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-500 text-xl mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <strong className="block text-gray-800">
                        Manage Applications
                      </strong>
                      <p className="text-gray-600">
                        Review, shortlist, and manage applications in one place.
                      </p>
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;

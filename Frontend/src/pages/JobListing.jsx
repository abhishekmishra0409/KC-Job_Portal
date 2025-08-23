import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { browseJobs } from "../features/Jobs/jobSlice";
import JobCard from "../components/JobCard";
import { FaFilter, FaChevronRight } from "react-icons/fa";

const JobListingsPage = () => {
  const dispatch = useDispatch();
  const { jobs, isLoading, pagination } = useSelector((state) => state.jobs);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [jobType, setJobType] = useState([]);
  const [salaryMax, setSalaryMax] = useState(200000);
  const [page, setPage] = useState(1);

  // Fetch jobs from backend
  const fetchJobs = () => {
    dispatch(
      browseJobs({
        keyword: searchQuery,
        location: searchLocation,
        type: jobType.join(","),
        maxSalary: salaryMax,
        page,
        limit: 10,
      })
    );
  };

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, searchLocation, jobType, salaryMax, page]);

  const handleTypeChange = (type) => {
    setJobType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handlePageChange = (p) => {
    setPage(p);
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-100 min-h-screen">
      {/* Search Section */}
      <section className="bg-gradient-to-r from-blue-500 to-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-3">Find Your Dream Job</h2>
          <p className="opacity-90 mb-6">
            Search from thousands of jobs from top companies
          </p>

          <div className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden shadow-xl mb-4">
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-4 text-gray-800 outline-none"
            />
            <input
              type="text"
              placeholder="City, state, or remote"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="md:w-60 p-4 text-gray-800 outline-none border-t md:border-t-0 md:border-l border-gray-200"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8 py-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold pb-4 mb-4 border-b border-gray-200">
              Filters
            </h3>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Job Type</h4>
              {[
                "Full-time",
                "Part-time",
                "Contract",
                "Internship",
                "Remote",
              ].map((type) => (
                <label key={type} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={jobType.includes(type)}
                    onChange={() => handleTypeChange(type)}
                  />
                  {type}
                </label>
              ))}
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Salary Max</h4>
              <input
                type="range"
                min="20000"
                max="200000"
                step="5000"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>$20K</span>
                <span>${salaryMax.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Job Listings */}
        <main className="flex-1">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-center text-gray-500">No jobs found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  jobId={job._id}
                  title={job.title}
                  company={
                    job.employerId?.company?.name || job.employerId?.email
                  }
                  location={job.location}
                  type={job.type}
                  timeAgo={new Date(job.updatedAt).toLocaleDateString()}
                  salary={`$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`}
                  education={`${job.requiredExperience} yrs experience`}
                  skills={job.requiredSkills}
                  isFeatured={false}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <ul className="flex justify-center mt-10 space-x-2">
            {Array.from({ length: pagination?.totalPages || 1 }, (_, i) => (
              <li key={i}>
                <button
                  onClick={() => handlePageChange(i + 1)}
                  className={`flex items-center justify-center w-10 h-10 rounded-md border ${
                    page === i + 1
                      ? "bg-blue-500 text-white"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= (pagination?.totalPages || 1)}
                className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
              >
                <FaChevronRight />
              </button>
            </li>
          </ul>
        </main>
      </div>
    </div>
  );
};

export default JobListingsPage;

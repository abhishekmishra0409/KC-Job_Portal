import React from "react";
import { FaSearch } from "react-icons/fa";

const FindCandidatesContent = () => {
  // In a real app, you would have form state here and dispatch searchJobSeekers
  return (
    <div className="dashboard-card bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
        <h3 className="text-xl font-semibold">Find Candidates</h3>
      </div>
      {/* Search Section */}
      <div className="space-y-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Skills
            </label>
            <input
              type="text"
              placeholder="e.g. React, Python"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. New York"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Experience Level
            </label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Any</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
            </select>
          </div>
        </div>
        <button className="bg-blue-500 text-white py-2 px-5 rounded-lg text-sm hover:bg-blue-600 flex items-center">
          <FaSearch className="mr-2" /> Search Candidates
        </button>
      </div>
    </div>
  );
};

export default FindCandidatesContent;

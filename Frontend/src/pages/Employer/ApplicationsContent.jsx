import React from "react";
import ApplicationCard from "./ApplicationCard";

const ApplicationsContent = ({ applications }) => {
  return (
    <div className="dashboard-card bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">All Applications</h3>
      <div className="list-none space-y-4">
        {applications.map((app) => (
          <ApplicationCard key={app._id} application={app} />
        ))}
      </div>
    </div>
  );
};

export default ApplicationsContent;

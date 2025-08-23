import React from "react";

const getStatusClass = (status) => {
  switch (status) {
    case "Under Review":
      return "bg-yellow-100 text-yellow-600";
    case "Interview":
      return "bg-green-100 text-green-600";
    case "Not Selected":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const ApplicationCard = ({ application }) => {
  return (
    <div className="application-item flex items-center border-b border-gray-100 pb-4 last:border-b-0">
      <div className="w-12 h-12 rounded-full bg-gray-100 text-blue-500 font-bold text-lg flex items-center justify-center mr-4">
        {application.name.charAt(0)}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{application.name}</h4>
        <p className="text-sm text-gray-500">
          Applied for: {application.appliedFor.title}
        </p>
        <div className="flex flex-wrap gap-1 mt-1">
          {application.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      <span
        className={`py-1 px-3 rounded-full text-xs font-semibold ${getStatusClass(
          application.status
        )}`}
      >
        {application.status}
      </span>
      <div className="flex gap-2 ml-4">
        <button className="bg-blue-500 text-white py-1.5 px-3 rounded-lg text-sm hover:bg-blue-600">
          Profile
        </button>
        <button className="bg-green-500 text-white py-1.5 px-3 rounded-lg text-sm hover:bg-green-600">
          Contact
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;

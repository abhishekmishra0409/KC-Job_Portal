import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCompanyProfile } from "../../features/Jobs/jobSlice";

const CompanyProfileContent = ({ employer }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    about: "",
    location: "",
    logo: null,
  });

  useEffect(() => {
    if (employer) {
      setFormData({
        name: employer.name || "",
        website: employer.website || "",
        about: employer.about || "",
        location: employer.location || "",
        logo: employer.logo || null,
      });
    }
  }, [employer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateCompanyProfile({ data: formData, token: "YOUR_TOKEN" }));
  };

  return (
    <div className="dashboard-card bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
        <h3 className="text-xl font-semibold">Company Profile</h3>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-5 rounded-lg text-sm hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={formData.name}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        {/* ... other form fields using formData and handleChange ... */}
      </form>
    </div>
  );
};

export default CompanyProfileContent;

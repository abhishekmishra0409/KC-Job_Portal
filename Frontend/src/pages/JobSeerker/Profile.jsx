// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, updateProfile } from "../../features/Users/userSlice.js";
import {
  FaUser,
  FaGraduationCap,
  FaBriefcase,
  FaFileAlt,
  FaEdit,
  FaTimes,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading, error, isLoading } = useSelector(
    (state) => state.user
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: {
      city: "",
      country: "",
    },
    skills: [],
    education: [],
    experience: [],
    resumeUrl: "",
  });
  const [newSkill, setNewSkill] = useState("");
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    startDate: "",
    endDate: "",
  });
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  useEffect(() => {
    if (!user) {
      dispatch(getProfile());
    } else {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || { city: "", country: "" },
        skills: user.skills || [],
        education: user.education || [],
        experience: user.experience || [],
        resumeUrl: user.resumeUrl || "",
      });
    }
  }, [dispatch, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      education: updatedEducation,
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      experience: updatedExperience,
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setFormData((prev) => ({
        ...prev,
        education: [...prev.education, { ...newEducation }],
      }));
      setNewEducation({
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      });
    }
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addExperience = () => {
    if (newExperience.title && newExperience.company) {
      setFormData((prev) => ({
        ...prev,
        experience: [...prev.experience, { ...newExperience }],
      }));
      setNewExperience({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    }
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
      setEditSection(null);
      dispatch(getProfile()); // Refresh profile data
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditSection(null);
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || { city: "", country: "" },
        skills: user.skills || [],
        education: user.education || [],
        experience: user.experience || [],
        resumeUrl: user.resumeUrl || "",
      });
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return <div className="p-6 text-center">No profile found.</div>;
  }

  return (
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4 sm:gap-0">

          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <div
                className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold">
              {user.name?.charAt(0)}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-500 text-sm sm:text-base">{user.email}</p>
            </div>
          </div>

          {/* Button */}
          <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full sm:w-auto"
          >
            {isEditing ? "Cancel Editing" : "Edit Profile"}
          </button>
        </div>


        <form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <section className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center text-lg font-semibold text-gray-800">
                <FaUser className="mr-2 text-blue-500"/> Personal Information
              </h2>
              {isEditing && (
                  <button
                      type="button"
                      onClick={() =>
                          setEditSection(editSection === "personal" ? null : "personal")
                      }
                      className="text-blue-500 hover:text-blue-700"
                  >
                    {editSection === "personal" ? <FaTimes/> : <FaEdit/>}
                  </button>
              )}
            </div>

            {editSection === "personal" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                        type="text"
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <input
                        type="text"
                        name="location.country"
                        value={formData.location.country}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
            ) : (
                <div>
                  <p>
                    <span className="font-semibold">Role:</span> {user.role}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {user.phone || "Not provided"}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span> {user.status}
                  </p>
                  <p>
                    <span className="font-semibold">Verified:</span>{" "}
                    {user.isVerified ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {user.location?.city && user.location?.country
                        ? `${user.location.city}, ${user.location.country}`
                        : "Not provided"}
                  </p>
                </div>
            )}
          </section>

          {/* Skills */}
          <section className="bg-white p-6 my-3 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center text-lg font-semibold text-gray-800">
                <FaUser className="mr-2 text-blue-500"/> Skills
              </h2>
              {isEditing && (
                  <button
                      type="button"
                      onClick={() =>
                          setEditSection(editSection === "skills" ? null : "skills")
                      }
                      className="text-blue-500 hover:text-blue-700"
                  >
                    {editSection === "skills" ? <FaTimes/> : <FaEdit/>}
                  </button>
              )}
            </div>

            {editSection === "skills" ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill"
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                    />
                    <button
                        type="button"
                        onClick={addSkill}
                        className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      <FaPlus/>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full"
                        >
                          {skill}
                          <button
                              type="button"
                              onClick={() => removeSkill(idx)}
                              className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash size={12}/>
                          </button>
                        </div>
                    ))}
                  </div>
                </div>
            ) : user.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, idx) => (
                      <span
                          key={idx}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full"
                      >
                  {skill}
                </span>
                  ))}
                </div>
            ) : (
                <p className="text-gray-500">No skills added.</p>
            )}
          </section>

          {/* Education */}
          <section className="bg-white p-6 my-3 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center text-lg font-semibold text-gray-800">
                <FaGraduationCap className="mr-2 text-blue-500"/> Education
              </h2>
              {isEditing && (
                  <button
                      type="button"
                      onClick={() =>
                          setEditSection(
                              editSection === "education" ? null : "education"
                          )
                      }
                      className="text-blue-500 hover:text-blue-700"
                  >
                    {editSection === "education" ? <FaTimes/> : <FaEdit/>}
                  </button>
              )}
            </div>

            {editSection === "education" ? (
                <div className="space-y-6">
                  {formData.education.map((edu, idx) => (
                      <div key={idx} className="p-4 border rounded-md space-y-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">Education #{idx + 1}</h3>
                          <button
                              type="button"
                              onClick={() => removeEducation(idx)}
                              className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash/>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Degree
                            </label>
                            <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) =>
                                    handleEducationChange(idx, "degree", e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Institution
                            </label>
                            <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) =>
                                    handleEducationChange(
                                        idx,
                                        "institution",
                                        e.target.value
                                    )
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Start Date
                            </label>
                            <input
                                type="date"
                                value={edu.startDate?.substring(0, 10)}
                                onChange={(e) =>
                                    handleEducationChange(
                                        idx,
                                        "startDate",
                                        e.target.value
                                    )
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              End Date
                            </label>
                            <input
                                type="date"
                                value={edu.endDate?.substring(0, 10)}
                                onChange={(e) =>
                                    handleEducationChange(idx, "endDate", e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                  ))}

                  <div className="p-4 border-2 border-dashed rounded-md space-y-3">
                    <h3 className="font-semibold">Add New Education</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Degree
                        </label>
                        <input
                            type="text"
                            value={newEducation.degree}
                            onChange={(e) =>
                                setNewEducation({
                                  ...newEducation,
                                  degree: e.target.value,
                                })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Institution
                        </label>
                        <input
                            type="text"
                            value={newEducation.institution}
                            onChange={(e) =>
                                setNewEducation({
                                  ...newEducation,
                                  institution: e.target.value,
                                })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <input
                            type="date"
                            value={newEducation.startDate}
                            onChange={(e) =>
                                setNewEducation({
                                  ...newEducation,
                                  startDate: e.target.value,
                                })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <input
                            type="date"
                            value={newEducation.endDate}
                            onChange={(e) =>
                                setNewEducation({
                                  ...newEducation,
                                  endDate: e.target.value,
                                })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <button
                        type="button"
                        onClick={addEducation}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Add Education
                    </button>
                  </div>
                </div>
            ) : user.education?.length > 0 ? (
                <ul className="space-y-3">
                  {user.education.map((edu, idx) => (
                      <li key={idx} className="border-b pb-2">
                        <p className="font-semibold">{edu.degree}</p>
                        <p className="text-gray-500">{edu.institution}</p>
                        <p className="text-sm text-gray-400">
                          {edu.startDate?.substring(0, 10)} -{" "}
                          {edu.endDate?.substring(0, 10)}
                        </p>
                      </li>
                  ))}
                </ul>
            ) : (
                <p className="text-gray-500">No education details added.</p>
            )}
          </section>

          {/* Experience */}
          <section className="bg-white p-6 my-3 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center text-lg font-semibold text-gray-800">
                <FaBriefcase className="mr-2 text-blue-500"/> Experience
              </h2>
              {isEditing && (
                  <button
                      type="button"
                      onClick={() =>
                          setEditSection(
                              editSection === "experience" ? null : "experience"
                          )
                      }
                      className="text-blue-500 hover:text-blue-700"
                  >
                    {editSection === "experience" ? <FaTimes/> : <FaEdit/>}
                  </button>
              )}
            </div>

            {editSection === "experience" ? (
                <div className="space-y-6">
                  {formData.experience.map((exp, idx) => (
                      <div key={idx} className="p-4 border rounded-md space-y-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">Experience #{idx + 1}</h3>
                          <button
                              type="button"
                              onClick={() => removeExperience(idx)}
                              className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash/>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Title
                            </label>
                            <input
                                type="text"
                                value={exp.title}
                                onChange={(e) =>
                                    handleExperienceChange(idx, "title", e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Company
                            </label>
                            <input
                                type="text"
                                value={exp.company}
                                onChange={(e) =>
                                    handleExperienceChange(idx, "company", e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Start Date
                            </label>
                            <input
                                type="date"
                                value={exp.startDate?.substring(0, 10)}
                                onChange={(e) =>
                                    handleExperienceChange(
                                        idx,
                                        "startDate",
                                        e.target.value
                                    )
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              End Date
                            </label>
                            <input
                                type="date"
                                value={exp.endDate?.substring(0, 10)}
                                onChange={(e) =>
                                    handleExperienceChange(idx, "endDate", e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <textarea
                                value={exp.description}
                                onChange={(e) =>
                                    handleExperienceChange(
                                        idx,
                                        "description",
                                        e.target.value
                                    )
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows="3"
                            />
                          </div>
                        </div>
                      </div>
                  ))}

                  <div className="p-4 border-2 border-dashed rounded-md space-y-3">
                    <h3 className="font-semibold">Add New Experience</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                            type="text"
                            value={newExperience.title}
                            onChange={(e) =>
                                setNewExperience({
                                  ...newExperience,
                                  title: e.target.value,
                                })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Company
                        </label>
                        <input
                            type="text"
                            value={newExperience.company}
                            onChange={(e) =>
                                setNewExperience({
                                  ...newExperience,
                                  company: e.target.value,
                                })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <input
                            type="date"
                            value={newExperience.startDate}
                            onChange={(e) =>
                                setNewExperience({
                                  ...newExperience,
                                  startDate: e.target.value,
                                })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <input
                            type="date"
                            value={newExperience.endDate}
                            onChange={(e) =>
                                setNewExperience({
                                  ...newExperience,
                                  endDate: e.target.value,
                                })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                            value={newExperience.description}
                            onChange={(e) =>
                                setNewExperience({
                                  ...newExperience,
                                  description: e.target.value,
                                })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows="3"
                        />
                      </div>
                    </div>
                    <button
                        type="button"
                        onClick={addExperience}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Add Experience
                    </button>
                  </div>
                </div>
            ) : user.experience?.length > 0 ? (
                <ul className="space-y-3">
                  {user.experience.map((exp, idx) => (
                      <li key={idx} className="border-b pb-2">
                        <p className="font-semibold">{exp.title}</p>
                        <p className="text-gray-500">{exp.company}</p>
                        <p className="text-sm text-gray-400">
                          {exp.startDate?.substring(0, 10)} -{" "}
                          {exp.endDate?.substring(0, 10)}
                        </p>
                        <p className="text-gray-600 text-sm">{exp.description}</p>
                      </li>
                  ))}
                </ul>
            ) : (
                <p className="text-gray-500">No experience details added.</p>
            )}
          </section>

          {/* Resume */}
          <section className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center text-lg font-semibold text-gray-800">
                <FaFileAlt className="mr-2 text-blue-500"/> Resume
              </h2>
              {isEditing && (
                  <button
                      type="button"
                      onClick={() =>
                          setEditSection(editSection === "resume" ? null : "resume")
                      }
                      className="text-blue-500 hover:text-blue-700"
                  >
                    {editSection === "resume" ? <FaTimes/> : <FaEdit/>}
                  </button>
              )}
            </div>

            {editSection === "resume" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Resume URL
                  </label>
                  <input
                      type="url"
                      name="resumeUrl"
                      value={formData.resumeUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/your-resume.pdf"
                      className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Paste the URL to your resume (Google Drive, Dropbox, etc.)
                  </p>
                </div>
            ) : user.resumeUrl ? (
                <a
                    href={user.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                  View Resume
                </a>
            ) : (
                <p className="text-gray-500">No resume uploaded.</p>
            )}
          </section>

          {isEditing && (
              <div className="flex justify-end space-x-4 mt-6">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
          )}
        </form>
      </div>
  );
};

export default ProfilePage;

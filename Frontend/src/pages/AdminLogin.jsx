import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../features/Users/userSlice";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.user
  );

  // Toggle password
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form login
  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ ...formData, role: "admin" })); // force role admin
  };

  // Redirect after login
  useEffect(() => {
    if (isSuccess && user && token) {
      if (user.role === "admin") {
        navigate("/admin-dashboard"); // redirect admin only
      }
      dispatch(reset());
    }
    if (isError) {
      console.error("Login Error:", message);
    }
  }, [isSuccess, isError, user, token, message, navigate, dispatch]);

  return (
    <div className="font-sans text-gray-800 bg-gray-100 min-h-screen flex flex-col">
      <div className="flex flex-1 items-center justify-center p-10">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-gray-800 text-white p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
            <p className="opacity-90">Sign in to manage the platform</p>
          </div>

          <div className="p-8">
            {/* Form */}
            <form onSubmit={handleLogin}>
              <div className="mb-5">
                <label htmlFor="email" className="block mb-2 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="email"
                  placeholder="Enter admin email"
                  required
                />
              </div>

              <div className="mb-5 relative">
                <label htmlFor="password" className="block mb-2 font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                    id="password"
                    placeholder="Enter password"
                    required
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>

            {isError && (
              <p className="text-red-500 text-center mt-4">{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

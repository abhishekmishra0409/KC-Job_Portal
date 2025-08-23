import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { login, googleAuth, reset } from "../features/Users/userSlice";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("jobSeeker");
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
    dispatch(login(formData));
  };

  // Handle Google login
  const handleGoogleSuccess = (credentialResponse) => {
    dispatch(googleAuth(credentialResponse.credential));
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Error:", error);
  };

  // Redirect after login
  useEffect(() => {
    if (isSuccess && user && token) {
      navigate("/"); // redirect to home or dashboard
      dispatch(reset());
    }
    if (isError) {
      console.error("Login Error:", message);
    }
  }, [isSuccess, isError, user, token, message, navigate, dispatch]);

  return (
    <div className="font-sans text-gray-800 bg-gray-100 min-h-screen flex flex-col">
      {/* Auth Container */}
      <div className="flex flex-1 items-center justify-center p-10">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-gray-800 text-white p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="opacity-90">
              Sign in to access your CareerConnect account
            </p>
          </div>

          <div className="p-8">
            {/* Tabs */}
            <div className="flex mb-6 border-b border-gray-200">
              <div
                className={`flex-1 text-center py-4 cursor-pointer font-medium text-gray-500 transition-all duration-300 ${
                  activeTab === "jobSeeker"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : ""
                }`}
                onClick={() => setActiveTab("jobSeeker")}
              >
                Job Seeker
              </div>
              <div
                className={`flex-1 text-center py-4 cursor-pointer font-medium text-gray-500 transition-all duration-300 ${
                  activeTab === "employer"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : ""
                }`}
                onClick={() => setActiveTab("employer")}
              >
                Employer
              </div>
            </div>

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
                  placeholder="Enter your email"
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
                    placeholder="Enter your password"
                    required
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <a
                  href="/forgot-password"
                  className="block text-right text-blue-500 text-sm mt-1 hover:underline"
                >
                  Forgot Password?
                </a>
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

            {/* Divider */}
            <div className="flex items-center my-6 text-gray-400">
              <span className="flex-1 h-px bg-gray-200"></span>
              <span className="px-4">Or continue with</span>
              <span className="flex-1 h-px bg-gray-200"></span>
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
              />
            </div>

            <div className="text-center mt-6 pt-5 border-t border-gray-200">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-blue-500 font-medium hover:underline"
              >
                Sign up now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

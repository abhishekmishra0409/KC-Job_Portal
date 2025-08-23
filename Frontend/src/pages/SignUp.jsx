import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { register, verifyOTP, resendOTP } from "../features/Users/userSlice";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isLoading,
    isError,
    message,
    isRegistered,
    isOTPVerified,
    isOTPSent,
  } = useSelector((state) => state.user);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("jobSeeker");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  useEffect(() => {
    if (isRegistered) {
      setShowOtpVerification(true);
    }
  }, [isRegistered]);

  useEffect(() => {
    if (isOTPVerified) {
      navigate("/login"); // ✅ redirect after OTP verification
    }
  }, [isOTPVerified, navigate]);

  useEffect(() => {
    if (isOTPSent) {
      // Start countdown for resend OTP (60 seconds)
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOTPSent]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const userData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      role: activeTab === "jobSeeker" ? "seeker" : "employer",
    };

    dispatch(register(userData));
  };

  const handleOtpVerification = (e) => {
    e.preventDefault();
    setOtpError("");

    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    dispatch(
      verifyOTP({
        email: formData.email,
        otp,
      })
    );
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;

    dispatch(
      resendOTP({
        email: formData.email,
      })
    );
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const renderSignupForm = () => (
    <>
      <form onSubmit={handleSignup}>
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          <div className="flex-1">
            <label htmlFor="firstName" className="block mb-2 font-medium">
              {activeTab === "jobSeeker" ? "First Name" : "First Name"}
            </label>
            <input
              type="text"
              id="firstName"
              required
              className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="lastName" className="block mb-2 font-medium">
              {activeTab === "jobSeeker" ? "Last Name" : "Last Name"}
            </label>
            <input
              type="text"
              id="lastName"
              required
              className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 font-medium">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            required
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-5 relative">
          <label htmlFor="password" className="block mb-2 font-medium">
            Password
          </label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              required
              className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="mb-5 relative">
          <label htmlFor="confirmPassword" className="block mb-2 font-medium">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              id="confirmPassword"
              required
              className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
              onClick={toggleConfirmPasswordVisibility}
            >
              {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="flex items-start mb-5">
          <input type="checkbox" id="terms" className="mt-1 mr-3" required />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the{" "}
            <a href="#" className="text-blue-500 font-medium hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-500 font-medium hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-300 disabled:opacity-70"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
          {isError && (
            <p className="text-red-500 text-center mt-3">{message}</p>
          )}
        </div>
      </form>
      <div className="flex items-center my-6 text-gray-400">
        <span className="flex-1 h-px bg-gray-200"></span>
        <span className="px-4">Or sign up with</span>
        <span className="flex-1 h-px bg-gray-200"></span>
      </div>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          console.log("Google login successful:", credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      <div className="text-center mt-6 pt-5 border-t border-gray-200">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500 font-medium hover:underline">
          Sign in
        </a>
      </div>
    </>
  );

  const renderOtpForm = () => (
    <>
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Verify Your Account</h2>
        <p className="text-gray-600 mb-6">
          An OTP has been sent to your email at{" "}
          <span className="font-semibold">{formData.email}</span>. Please enter
          it below to verify your account.
        </p>
        <form onSubmit={handleOtpVerification}>
          <div className="mb-5">
            <label htmlFor="otp" className="block mb-2 font-medium text-left">
              OTP Code
            </label>
            <input
              type="text"
              id="otp"
              required
              maxLength="6"
              pattern="[0-9]{6}"
              className="w-full p-3 border border-gray-200 rounded-md text-center text-lg tracking-widest focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="123456"
            />
          </div>
          {otpError && <p className="text-red-500 text-sm mb-4">{otpError}</p>}
          {isError && <p className="text-red-500 text-sm mb-4">{message}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-300 disabled:opacity-70"
          >
            {isLoading ? "Verifying..." : "Verify Account"}
          </button>
          <button
            type="button"
            className={`mt-4 text-sm hover:underline ${
              countdown > 0 ? "text-gray-400" : "text-blue-500"
            }`}
            onClick={handleResendOTP}
            disabled={countdown > 0}
          >
            {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
          </button>
        </form>
      </div>
    </>
  );

  return (
    <div className="font-sans text-gray-800 bg-gray-100 min-h-screen flex items-center justify-center p-10">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-gray-800 text-white p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            {showOtpVerification ? "Verify Your Account" : "Create Account"}
          </h1>
          <p className="opacity-90">
            {showOtpVerification
              ? "A one-time password has been sent to your email."
              : "Join CareerConnect to find your dream job or talent"}
          </p>
        </div>

        <div className="p-8">
          {!showOtpVerification && (
            <div className="flex mb-6 border-b border-gray-200">
              <div
                className={`flex-1 text-center py-4 cursor-pointer font-medium text-gray-500 transition-all duration-300 ${
                  activeTab === "jobSeeker"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : ""
                }`}
                onClick={() => handleTabChange("jobSeeker")}
              >
                Job Seeker
              </div>
              <div
                className={`flex-1 text-center py-4 cursor-pointer font-medium text-gray-500 transition-all duration-300 ${
                  activeTab === "employer"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : ""
                }`}
                onClick={() => handleTabChange("employer")}
              >
                Employer
              </div>
            </div>
          )}
          {showOtpVerification ? renderOtpForm() : renderSignupForm()}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { forgotPassword, resetPassword } from "../features/Users/userSlice";

const ForgotPasswordPage = () => {
    const dispatch = useDispatch();
    const { isLoading, isError, message, isOTPSent } = useSelector((state) => state.user);

    const [step, setStep] = useState(1); // 1: Email input, 2: OTP verification, 3: New password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validateEmail = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateOTP = () => {
        const newErrors = {};
        if (!otp) {
            newErrors.otp = "OTP is required";
        } else if (otp.length !== 6) {
            newErrors.otp = "OTP must be 6 digits";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePassword = () => {
        const newErrors = {};
        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (validateEmail()) {
            try {
                await dispatch(forgotPassword(email)).unwrap();
                setStep(2);
            } catch (error) {
                console.error("Failed to send OTP:", error);
            }
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (validateOTP()) {
            setStep(3);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (validatePassword()) {
            try {
                await dispatch(resetPassword({ email, otp, newPassword: password })).unwrap();
                alert("Password reset successfully! You can now login with your new password.");
                window.location.href = "/login";
            } catch (error) {
                console.error("Failed to reset password:", error);
            }
        }
    };

    const handleResendOTP = async () => {
        try {
            await dispatch(forgotPassword(email)).unwrap();
            alert("New OTP has been sent to your email.");
        } catch (error) {
            console.error("Failed to resend OTP:", error);
        }
    };

    const renderStep1 = () => (
        <>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
                <p className="text-gray-600 mt-2">
                    Enter your email address and we'll send you an OTP to reset your password.
                </p>
            </div>

            <form onSubmit={handleSendOTP}>
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                            type="email"
                            id="email"
                            className={`w-full pl-10 pr-3 py-3 border rounded-md focus:outline-none focus:ring-1 ${
                                errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                            }`}
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-300 disabled:opacity-70"
                >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>

                {isError && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {message}
                    </div>
                )}
            </form>

            <div className="text-center mt-6">
                <a
                    href="/login"
                    className="text-blue-500 font-medium hover:underline flex items-center justify-center"
                >
                    <FaArrowLeft className="mr-2" /> Back to Login
                </a>
            </div>
        </>
    );

    const renderStep2 = () => (
        <>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
                <p className="text-gray-600 mt-2">
                    We've sent a 6-digit verification code to <span className="font-semibold">{email}</span>
                </p>
            </div>

            <form onSubmit={handleVerifyOTP}>
                <div className="mb-5">
                    <label htmlFor="otp" className="block mb-2 font-medium text-gray-700">
                        Verification Code
                    </label>
                    <input
                        type="text"
                        id="otp"
                        maxLength="6"
                        className={`w-full p-3 border rounded-md text-center text-lg tracking-widest focus:outline-none focus:ring-1 ${
                            errors.otp ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                        }`}
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                    {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full py-3 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-300"
                >
                    Verify Code
                </button>
            </form>

            <div className="text-center mt-4">
                <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-blue-500 text-sm hover:underline"
                    disabled={isLoading}
                >
                    Didn't receive the code? Resend OTP
                </button>
            </div>

            <div className="text-center mt-6">
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-blue-500 font-medium hover:underline flex items-center justify-center"
                >
                    <FaArrowLeft className="mr-2" /> Use a different email
                </button>
            </div>
        </>
    );

    const renderStep3 = () => (
        <>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Create New Password</h2>
                <p className="text-gray-600 mt-2">
                    Please create a new password for your account.
                </p>
            </div>

            <form onSubmit={handleResetPassword}>
                <div className="mb-5 relative">
                    <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
                        New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className={`w-full pl-10 pr-10 py-3 border rounded-md focus:outline-none focus:ring-1 ${
                                errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                            }`}
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div className="mb-5 relative">
                    <label htmlFor="confirmPassword" className="block mb-2 font-medium text-gray-700">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                        </div>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            className={`w-full pl-10 pr-10 py-3 border rounded-md focus:outline-none focus:ring-1 ${
                                errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                            }`}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-300 disabled:opacity-70"
                >
                    {isLoading ? "Resetting Password..." : "Reset Password"}
                </button>

                {isError && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {message}
                    </div>
                )}
            </form>

            <div className="text-center mt-6">
                <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-blue-500 font-medium hover:underline flex items-center justify-center"
                >
                    <FaArrowLeft className="mr-2" /> Back to OTP verification
                </button>
            </div>
        </>
    );

    return (
        <div className="font-sans text-gray-800 bg-gray-100 min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-gray-800 text-white p-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">
                        {step === 1 ? "Reset Password" : step === 2 ? "Verify Account" : "Create New Password"}
                    </h1>
                    <p className="opacity-90">
                        {step === 1
                            ? "Enter your email to get started"
                            : step === 2
                                ? "Enter the verification code sent to your email"
                                : "Create a strong, secure password"}
                    </p>
                </div>

                <div className="p-8">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
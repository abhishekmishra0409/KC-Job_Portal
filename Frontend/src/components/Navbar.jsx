import React, { useEffect, useState } from "react";
import { FaBriefcase } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/Users/userSlice";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user from Redux store
  const reduxUser = useSelector((state) => state.user.user);
  const reduxToken = useSelector((state) => state.user.token);

  // Load user from localStorage and sync with Redux
  const loadUser = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    // Listen to localStorage changes (e.g., logout in another tab)
    const handleStorageChange = () => loadUser();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Sync with Redux state when it changes
  useEffect(() => {
    if (reduxUser && reduxToken) {
      setUser({ user: reduxUser, token: reduxToken });
    } else {
      setUser(null);
    }
  }, [reduxUser, reduxToken]);

  const handleLogout = () => {
    dispatch(logout()); // Use Redux logout action
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (!user) return;
    if (user.user.role === "seeker") {
      navigate("/seeker-dashboard");
    } else if (user.user.role === "employer") {
      navigate("/employer-dashboard");
    } else {
      navigate("/admin-dashboard");
    }
  };

  return (
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <Link
              to="/"
              className="flex items-center text-3xl font-bold text-blue-500"
          >
            <FaBriefcase className="mr-2" />
            CareerConnect
          </Link>

          {/* Navigation */}
          <nav className="my-4 md:my-0">
            <ul className="flex flex-wrap justify-center md:justify-start space-x-4">
              <li>
                <Link
                    to="/"
                    className="text-gray-700 hover:text-blue-500 font-medium transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                    to="/jobs"
                    className="text-gray-700 hover:text-blue-500 font-medium transition-colors duration-300"
                >
                  Jobs
                </Link>
              </li>
              <li>
                <Link
                    to="#"
                    className="text-gray-700 hover:text-blue-500 font-medium transition-colors duration-300"
                >
                  Companies
                </Link>
              </li>
              <li>
                <Link
                    to="#"
                    className="text-gray-700 hover:text-blue-500 font-medium transition-colors duration-300"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                    to="#"
                    className="text-gray-700 hover:text-blue-500 font-medium transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Auth / Profile */}
          <div className="flex items-center mt-4 md:mt-0 space-x-3">
            {user ? (
                <>
                  <button
                      onClick={handleProfileClick}
                      className="bg-white text-blue-500 border-2 border-blue-500 font-medium py-2 px-4 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
                  >
                    Profile
                  </button>
                  <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300"
                  >
                    Logout
                  </button>
                </>
            ) : (
                <>
                  <Link
                      to="/login"
                      className="bg-white text-blue-500 border-2 border-blue-500 font-medium py-2 px-4 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                      to="/signup"
                      className="bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    Sign Up
                  </Link>
                </>
            )}
          </div>
        </div>
      </header>
  );
};

export default Navbar;
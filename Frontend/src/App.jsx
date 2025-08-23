import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import JobListingsPage from "./pages/JobListing";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import JobSeekerDashboard from "./pages/JobSeerker/JobSeekerDashboard";
import EmployerDashboard from "./pages/Employer/EmployerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/Forgot-Password";

function App() {
  return (
    <div>
      <main>
        <Router>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Job Listings */}
            <Route path="/jobs" element={<JobListingsPage />} />
            <Route path="/seeker-dashboard" element={<JobSeekerDashboard />} />
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </main>
      <Footer />
    </div>
  );
}

export default App;

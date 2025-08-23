import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-blue-500 mb-4">CareerConnect</h3>
                        <p className="text-gray-400 text-sm">Connecting talent with opportunity. Our mission is to help people find their dream jobs and companies find perfect candidates.</p>
                        <div className="flex space-x-4 mt-6">
                            <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-500 transition-colors duration-300">
                                <FaFacebookF />
                            </a>
                            <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-500 transition-colors duration-300">
                                <FaTwitter />
                            </a>
                            <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-500 transition-colors duration-300">
                                <FaLinkedinIn />
                            </a>
                            <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-500 transition-colors duration-300">
                                <FaInstagram />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-blue-500 mb-4">For Job Seekers</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-blue-500 transition-colors duration-300">Browse Jobs</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors duration-300">Create Profile</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors duration-300">Job Alerts</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors duration-300">Career Advice</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors duration-300">Upload Resume</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-blue-500 mb-4">For Employers</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-blue-500 transition-colors duration-300">Post a Job</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors duration-300">Search Candidates</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors duration-300">Pricing Plans</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors duration-300">Employer Resources</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors duration-300">Recruitment Solutions</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-blue-500 mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li className="flex items-start"><FaMapMarkerAlt className="mt-1 mr-2" /> <span>123 Main St, New York, NY 10001</span></li>
                            <li className="flex items-center"><FaPhone className="mr-2" /> <span>+1 (555) 123-4567</span></li>
                            <li className="flex items-center"><FaEnvelope className="mr-2" /> <span>info@careerconnect.com</span></li>
                        </ul>
                    </div>
                </div>
                <div className="text-center pt-8 border-t border-gray-700">
                    <p className="text-gray-400 text-sm">&copy; 2025 CareerConnect. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
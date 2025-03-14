"use client";


import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaSignOutAlt, FaShoppingCart, FaFileAlt, FaCog, FaMoon, FaSun } from "react-icons/fa"; // ✅ Fixed Importimport "./Sidebar.css"; // Make sure this file exists
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Ensure Sidebar styling exists
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig"; // ✅ Import Firebase Auth
import { signOut } from "firebase/auth";
import { useLocation } from "react-router-dom";








const Sidebar = ({ onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await signOut(auth); // ✅ Log out the user

            navigate("/"); // ✅ Redirect to Login page
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Failed to log out. Please try again.");
        }
    };


    const [isOpen, setIsOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        // ✅ Load theme from localStorage on initial render
        return localStorage.getItem("theme") === "dark";
    });

    // Toggle Sidebar
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };


    // Toggle Dark Mode
    const toggleDarkMode = () => {
        if (typeof window === "undefined" || typeof document === "undefined") return; // ✅ Prevents SSR error

        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");

        // ✅ Use `.add()` or `.remove()` instead of `.toggle()` for reliability
        if (newMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };




    useEffect(() => {
        const handleResize = () => {
            setIsOpen(window.innerWidth > 768); // Auto-close on small screens
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    // Load Dark Mode preference from localStorage
    useEffect(() => {
        if (typeof window !== "undefined" && typeof document !== "undefined") {
            const savedTheme = localStorage.getItem("theme") === "dark";
            setDarkMode(savedTheme);
    
            if (savedTheme) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    }, []);
    


    // Close sidebar when clicking outside
    useEffect(() => {
    if (typeof document === "undefined") return; // ✅ Prevents SSR error

    const handleOutsideClick = (event) => {
        if (isOpen && !event.target.closest(".sidebar") && !event.target.closest(".sidebar-toggle")) {
            setIsOpen(false);
        }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
}, [isOpen]);


    return (
        <>
            {/* Sidebar Toggle Button */}
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                {isOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
            </button>

            {/* Overlay (closes sidebar when clicked) */}
            {isOpen && <div className="sidebar-overlay"></div>}

            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <h2 className="sidebar-title">Bilanzo</h2>
                <ul className="sidebar-menu">
                    <li>
                        <Link to="/" className="sidebar-link">
                            🏠 Dashboard
                        </Link>
                    </li>
                    <li>
                        <a href="#" className="sidebar-link">
                            <FaShoppingCart /> Sales
                        </a>
                    </li>
                    <li>
                        <a href="#" className="sidebar-link">
                            <FaFileAlt /> Reports
                        </a>
                    </li>
                    <li>
                        <a href="#" className="sidebar-link">
                            <FaCog /> Settings
                        </a>
                    </li>
                    <li>
                        <Link to="/categories" className="sidebar-link">🏷 Manage Categories</Link>

                    </li>
                </ul>

                {/* Dark Mode Toggle - Added above Logout */}
                <div className="dark-mode-toggle">
                    <button onClick={toggleDarkMode} className="toggle-btn">
                        {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                        <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                    </button>
                </div>

                {/* Logout Button */}
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                </button>
            </div>
        </>
    );
};

export default Sidebar;

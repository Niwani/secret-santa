import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase.js";
import { Gift, Bell, ChevronDown, LogOut, User, Menu, X, Settings, HelpCircle } from "lucide-react";
import NotificationBell from "./NotificationBell";
import classes from "./NavBar.module.css";

export default function Navbar({ userName }) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Failed to log out");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <>
        <nav className={classes.navbar}>
        {/* Left: Logo */}
        <div className={classes.logoGroup} onClick={() => navigate("/dashboard")}>
            <Gift size={28} color="#db2777" strokeWidth={2.5} />
            <span className={classes.logoText}>Gifterly</span>
        </div>

        {/* Center: Links (Desktop) */}
        <div className={classes.navSection}>
            <Link to="/dashboard" className={classes.navLink}>Dashboard</Link>
            <Link to="/pricing" className={classes.navLink}>Upgrade</Link>
            <Link to="/resources" className={classes.navLink}>Resources</Link>
        </div>

        {/* Right: Actions */}
        <div className={classes.actions}>
            <NotificationBell />
            {/* Profile Dropdown */}
            <div className={classes.profileWrapper} ref={profileRef}>
                <button 
                    className={classes.profileBtn}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                    <div className={classes.avatar}>
                        {getInitials(userName || "User")}
                    </div>
                    <span className={classes.userName}>{userName || "User"}</span>
                    <ChevronDown size={14} color="#6b7280" />
                </button>

                {isProfileOpen && (
                    <div className={classes.dropdown}>
                        <div className={classes.dropdownItem} onClick={() => navigate("/profile")}>
                            <User size={16} /> Profile
                        </div>
                        <div className={classes.dropdownItem} onClick={() => navigate("/pricing")}>
                            <Settings size={16} /> Subscription
                        </div>
                        <div className={classes.dropdownItem} onClick={() => navigate("/help")}>
                            <HelpCircle size={16} /> Help Center
                        </div>
                        <div className={classes.dropdownItem} onClick={() => navigate("/resources")}>
                            <BookOpen size={16} /> Resources
                        </div>
                        <div className={classes.divider}></div>
                        <button className={classes.dropdownItem} onClick={handleLogout} style={{ color: "#ef4444" }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
            className={classes.mobileMenuBtn}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMobileOpen && (
            <div className={classes.mobileOverlay}>
                <Link to="/dashboard" className={classes.navLink} onClick={() => setIsMobileOpen(false)}>Dashboard</Link>
                <Link to="/pricing" className={classes.navLink} onClick={() => setIsMobileOpen(false)}>Upgrade Plan</Link>
                <Link to="/resources" className={classes.navLink} onClick={() => setIsMobileOpen(false)}>Resources</Link>
                <div className={classes.divider}></div>
                <button 
                    className={classes.dropdownItem} 
                    onClick={handleLogout}
                    style={{ color: "#ef4444", justifyContent: "center" }}
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
        )}
    </>
  );
}

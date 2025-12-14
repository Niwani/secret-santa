// src/components/loggedIn/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase.js";

export default function Navbar({ userName }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // redirect to login page
    } catch (err) {
      console.error(err);
      alert("Failed to log out: " + err.message);
    }
  };
  

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo} onClick={() => navigate("/dashboard")}>
        <a href="/">🎁 Secret Santa</a>
      </div>
      <div style={styles.userSection}>
        <span style={styles.welcome}>Welcome, {userName}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#e53935",
    color: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logo: {
    fontWeight: "bold",
    fontSize: 20,
    cursor: "pointer",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: 15,
  },
  welcome: {
    fontSize: 16,
  },
  logoutBtn: {
    padding: "6px 12px",
    background: "#f9a825",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.2s",
  },
};

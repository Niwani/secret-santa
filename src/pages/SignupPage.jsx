import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import "./SignupPage.css";

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    groupType: "",
    organization: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  
    if (!formData.agree) {
      alert("Please agree to the terms and privacy policy");
      return;
    }
  
    try {
      // 🔐 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
  
      const user = userCredential.user;
  
      // 📄 2. Save user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        groupType: formData.groupType,
        organization: formData.organization || "",
        role: "creator",
        createdAt: serverTimestamp(),
      });
  
      // 🚀 3. Redirect to Create Event page
      navigate("/admin/create-event");
  
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message);
    }
  };
  

  return (
    <div className="signup-page">
      <Link to="/" className="back-home">← Back to Home</Link>

      <div className="signup-overlay">
        <div className="signup-container">
          <h1>Create Your Account</h1>
          <p>Start organizing joyful gift exchanges in minutes 🎁</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <select
              name="groupType"
              value={formData.groupType}
              onChange={handleChange}
            >
              <option value="">How will you use this platform?</option>
              <option value="family">Family</option>
              <option value="friends">Friends</option>
              <option value="company">Company / Team</option>
            </select>

            <input
              type="text"
              name="organization"
              placeholder="Organization / Family Name (optional)"
              value={formData.organization}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <div className="terms">
              <label className="checkbox">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="box"
                />
                <p>I agree to the <Link to="/terms">Terms</Link> and{" "}
                <Link to="/privacy">Privacy Policy</Link></p>
              </label>
            </div>
            

            <button type="submit" className="btn-signup">
              Create Accoun & Event
            </button>
          </form>

          <div className="signup-footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

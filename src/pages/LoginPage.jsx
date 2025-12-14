import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // make sure your auth is exported
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Set Firebase persistence based on checkbox
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      // Sign in
      await signInWithEmailAndPassword(auth, email, password);

      // Redirect after login
      navigate("/dashboard"); // change to your dashboard route
    } catch (err) {
      console.error(err);
      alert("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Link to="/" className="back-home">← Back to Home</Link>
      <div className="login-overlay">
        <div className="login-container">
          <h1>Welcome Back!</h1>
          <p>Login to continue organizing your Secret Santa events</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Remember Me */}
            <div className="rememberMe">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Remember Me</label>
            </div>

            <button type="submit" className="btn-login">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="login-footer">
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
            <p><Link to="/forgot-password">Forgot Password?</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

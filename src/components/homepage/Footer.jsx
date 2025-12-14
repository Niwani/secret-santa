import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
          <h3>Secret Santa</h3>
          <p>Create and manage gift exchange events with ease.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/pricing">Pricing</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/create-event">Create Event</a></li>
            <li><a href="/login">Login</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@secretsanta.com</p>
          <p>Phone: +234 813 000 0000</p>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="socials">
            <a href="#">FB</a>
            <a href="#">IG</a>
            <a href="#">X</a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Secret Santa — All Rights Reserved.
      </div>
    </footer>
  );
}

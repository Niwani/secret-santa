import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { Gift } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
          <div className="footer-logo">
            <Gift size={30} color="#e91e63" strokeWidth={2.5} style={{ marginTop: 2, display: "block" }} />
            <h3>GiftEx</h3>
          </div>
          <p>Making gift-giving joyful agiain for 
          families, friends, and companies worldwide.</p>
        </div>

        <div className="footer-section">
          <h4>Products</h4>
          <ul>
            <li><a href="/pricing">Pricing</a></li>
            <li><a href="/demo">Demo</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="/pricing">Blog</a></li>
            <li><Link to="/terms">Terms & Condition</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@giftex.com</p>
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
        © {new Date().getFullYear()} GiftEx — All Rights Reserved.
      </div>
    </footer>
  );
}

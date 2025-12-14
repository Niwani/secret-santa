import React from "react";
import "./Pricing.css";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function Pricing() {
  return (
    <div>
      <NavBar />
      <div  className="pricing-page">
        <h1 className="pricing-title">Simple, Transparent Pricing</h1>
        <p className="pricing-subtitle">Choose a plan that fits your event size</p>

        <div className="pricing-grid">

          {/* FREE PLAN */}
          <div className="price-card">
            <h3>Free</h3>
            <p className="price">$0</p>
            <p className="price-desc">Perfect for small groups and families</p>

            <ul className="price-features">
              <li>Up to 10 participants</li>
              <li>Random assignment</li>
              <li>Email notifications</li>
              <li>Basic support</li>
            </ul>

            <button className="price-btn">Get Started</button>
          </div>

          {/* PRO PLAN (Popular) */}
          <div className="price-card popular">
            <div className="popular-badge">Most Popular</div>

            <h3>Pro</h3>
            <p className="price">$9.99</p>
            <p className="price-desc">Great for offices, churches, and events</p>

            <ul className="price-features">
              <li>Up to 100 participants</li>
              <li>Custom event themes</li>
              <li>Automated email reminders</li>
              <li>Priority support</li>
            </ul>

            <button className="price-btn primary">Upgrade Now</button>
          </div>

          {/* BUSINESS PLAN */}
          <div className="price-card">
            <h3>Business</h3>
            <p className="price">$29.99</p>
            <p className="price-desc">Ideal for large companies & organizations</p>

            <ul className="price-features">
              <li>Unlimited participants</li>
              <li>Advanced reporting</li>
              <li>Multiple event managers</li>
              <li>Dedicated support</li>
            </ul>

            <button className="price-btn">Contact Sales</button>
          </div>

        </div>
      </div>
      <div className="foot">
        <Footer />
      </div>
    </div>
  );
}

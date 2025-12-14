import React from "react";
import "./AboutPage.css";

import NavBar from "../components/homepage/NavBar";
import Footer from "../components/homepage/Footer";

export default function AboutPage() {
  return (
    <div className="about-wrapper">
      <div>
        <NavBar />
      </div>
      {/* HERO SECTION */}
      <section className="about-hero">
        <h1>About Secret Santa</h1>
        <p>
          Secret Santa is a fun, simple, and stress-free platform designed to 
          help families, friends, schools, and companies organize gift-exchange 
          events with zero hassle.
        </p>

        {/* <div className="about-buttons">
          <a className="btn primary" href="/create-event">Create Event</a>
          <a className="btn" href="/pricing">Pricing</a>
          <a className="btn" href="/contact">Contact</a>
          <a className="btn" href="/login">Login</a>
        </div> */}
      </section>

      {/* COMPANY STORY SECTION */}
      <section className="about-content">
        <h2>Who We Are</h2>
        <p>
          We built this platform to remove the confusion and stress from 
          organizing gift swaps. No more writing names on paper, no more 
          manual matching, and no more mix-ups. Our smart system randomly 
          assigns giftees to each participant while keeping everything fair 
          and anonymous.
        </p>

        <p>
          From small families to international organizations, we serve 
          thousands of people every year. Our mission is simple: 
          <strong>make gift-giving joyful again.</strong>
        </p>
      </section>

      {/* VALUES SECTION */}
      <section className="about-values">
        <h2>Our Values</h2>

        <div className="values-grid">
          <div className="value-card">
            <h3>Simplicity</h3>
            <p>Everything should be easy. Create an event in minutes.</p>
          </div>

          <div className="value-card">
            <h3>Fairness</h3>
            <p>Every participant gets a fair, anonymous gift partner.</p>
          </div>

          <div className="value-card">
            <h3>Joy</h3>
            <p>We designed the experience to bring smiles and excitement.</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

// src/pages/HomePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/homepage/NavBar.jsx";
import Hero from "../components/homepage/Hero.jsx";
import Features from "../components/homepage/Features.jsx";
import Pricing from "../components/homepage/Pricing.jsx";
import Footer from "../components/homepage/Footer.jsx";
import HowItWorks from "../components/homepage/HIW.jsx";

export default function HomePage() {
  

  return (
    <div className="wrapper">
      <NavBar />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}

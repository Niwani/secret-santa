// src/pages/HomePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/homepage/NavBar.jsx";
import Hero from "../components/homepage/Hero.jsx";
import Features from "../components/homepage/Features.jsx";
import Blog from "../components/homepage/Blog.jsx";
import About from "../components/homepage/About.jsx";
import Footer from "../components/homepage/Footer.jsx";

export default function HomePage() {
  

  return (
    <div className="wrapper">
      <NavBar />
      <Hero />
      <Features />
      <Blog />
      <About />
      <Footer />
    </div>
  );
}

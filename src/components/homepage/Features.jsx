import React, { useEffect, useState } from "react";
import "./Features.css";

const features = [
  {
    title: "Automatic random assignment",
    desc: "No manual draws — let us handle matching.",
    img: "/technology.png",
  },
  {
    title: "Up to 30 participants",
    desc: "Perfect for groups, teams, and families.",
    img: "/crowd.png",
  },
  {
    title: "Sharable Event Link",
    desc: "Send a unique link to all participants.",
    img: "/share.png",
  },
  {
    title: "Perfect for any exchange",
    desc: "Secret Santa, Valentine, birthdays, etc.",
    img: "/versatile.png",
  },
  {
    title: "Mobile-friendly",
    desc: "Smooth experience on any device.",
    img: "/mobile.png",
  },
];

export default function Features() {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const visibleSlides = isMobile ? 1 : 3; // number of cards visible
  const totalSlides = features.length;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Slider interval
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % (totalSlides - visibleSlides + 1));
    }, 3000); // slower speed for mobile

    return () => clearInterval(interval);
  }, [totalSlides, visibleSlides]);

  return (
    <div className="slider-container">
      <div className="slider-window">
        <div
          className="slider-track"
          style={{
            width: `${(100 / visibleSlides) * totalSlides}%`,
            transform: `translateX(-${(index * 100) / totalSlides}%)`,
          }}
        >
          {features.map((f, i) => (
            <div
              className="feature-card"
              key={i}
              style={{ flex: `0 0 ${100 / totalSlides}%` }}
            >
              <img src={f.img} alt={f.title} className="feature-img" />
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="dots-wrapper">
        {Array.from({ length: totalSlides - visibleSlides + 1 }).map(
          (_, i) => (
            <div
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            ></div>
          )
        )}
      </div>
    </div>
  );
}

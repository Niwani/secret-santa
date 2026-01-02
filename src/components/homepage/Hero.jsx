import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import classes from "./Hero.module.css";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className={classes.hero}>
      <div className={classes.heroImageWrapper}>
        <img src="/pinky.jpg" className={classes.heroImage} />

        <div className={classes.heroContent}>
          <div className={classes.sparkles}>
            <Sparkles />
            Trusted by thousands worldwide
          </div>
          <h1 className={classes.heroTitle}>
            Gifting Made <span className={classes.simple}>Simple </span>
          </h1>
          <p className={classes.heroSubtitle}>
            No more paper slips. No more mix-ups. Organize perfect gift exchanges for 
            <br />
            families, friends, schools, and companies with zero hassle.
          </p>
          <div className={classes.buttons}>
            <button
              className={classes.heroButton}
              onClick={() => navigate("/login")}
            >
              Create Free Event →
            </button>
            <button
              className={classes.demoButton}
              onClick={() => navigate("/demo")}
            >
              Try Demo
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Hero.module.css";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className={classes.hero}>
      <div className={classes.heroImageWrapper}>
        <img src="/tinybox.jpg" className={classes.heroImage} />

        <div className={classes.heroContent}>
          <h1 className={classes.heroTitle}>
            Organize a Secret Santa Event <br />
            in minutes
          </h1>
          <p className={classes.heroSubtitle}>
            Works great for families, friends, or company teams. <br />
            — no stress, just fun.
          </p>
          <button
            className={classes.heroButton}
            onClick={() => navigate("/admin/create-event")}
          >
            Start an Event →
          </button>
        </div>
      </div>
    </section>
  );
}

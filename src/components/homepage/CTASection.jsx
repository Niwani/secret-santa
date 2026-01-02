import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CTASection.module.css';

export default function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Ready to Make Gift-Giving Joyful Again?
        </h2>
        <p className={styles.subtitle}>
          Join thousands organizing stress-free Secret Santa events
        </p>
        
        <Link to="/create-event" className={styles.ctaButton}>
          Start Free Event Now
        </Link>
      </div>
    </section>
  );
}
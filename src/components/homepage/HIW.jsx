import React from 'react';
import { Users, Shuffle, Gift } from 'lucide-react';
import styles from './HIW.module.css';

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>How It Works</h2>
      
      <div className={styles.grid}>
        {/* Step 1 */}
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={`${styles.iconWrapper} ${styles.redIcon}`}>
              <Users size={32} />
            </div>
            <h3 className={styles.cardTitle}>Add Participants</h3>
            <p className={styles.cardText}>
              Invite people via email or share a simple link. They join with one click.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={`${styles.iconWrapper} ${styles.greenIcon}`}>
              <Shuffle size={32} />
            </div>
            <h3 className={styles.cardTitle}>Smart Matching</h3>
            <p className={styles.cardText}>
              Our algorithm randomly pairs everyone. Fair, anonymous, and instant.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={`${styles.iconWrapper} ${styles.blueIcon}`}>
              <Gift size={32} />
            </div>
            <h3 className={styles.cardTitle}>Exchange Gifts</h3>
            <p className={styles.cardText}>
              Everyone gets notified of their match. Add wishlists for perfect gifts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
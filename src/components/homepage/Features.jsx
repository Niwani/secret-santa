import React from 'react';
import { Zap, Shield, Mail, Users } from 'lucide-react';
import styles from './Features.module.css';

const FEATURES = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Create an event in under 60 seconds' },
  { icon: Shield, title: '100% Anonymous', desc: 'Nobody sees who has who until reveal day' },
  { icon: Mail, title: 'Auto Notifications', desc: 'Emails sent automatically to all participants' },
  { icon: Users, title: 'Any Group Size', desc: 'From 3 to 3,000 people' }
];

export default function Features() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Why Gifterly?</h2>
        
        <div className={styles.grid}>
          {FEATURES.map((item, i) => (
            <div key={i} className={styles.featureItem}>
              <div className={styles.iconBox}>
                <item.icon size={24} />
              </div>
              <div>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <p className={styles.itemDesc}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
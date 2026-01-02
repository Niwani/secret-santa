import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Pricing.module.css';

const PLANS = [
  { name: 'Free', price: '₦0', desc: 'Perfect for small groups', features: ['Up to 20 participants', 'Basic matching', 'Email notifications'] },
  { name: 'Per Event', price: '₦3,000', desc: 'One-time pro features', features: ['Unlimited participants', 'Custom branding', 'Priority support'], popular: false },
  { name: 'Pro', price: '₦15,000', desc: 'Per year', features: ['Unlimited events', 'All pro features', 'Analytics dashboard'], popular: true },
  { name: 'Business', price: '₦25,000', desc: 'Per year', features: ['Everything in Pro', 'API access', 'Dedicated support'], popular: false }
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.sectionContent}>
        <div className={styles.header}>
          <h2 className={styles.title}>Simple Pricing</h2>
          <p className={styles.subtitle}>Choose the plan that works for you</p>
        </div>

        <div className={styles.grid}>
          {PLANS.map((plan, i) => (
            <div 
              key={i} 
              className={`${styles.card} ${plan.popular ? styles.popularCard : ''}`}
            >
              {plan.popular && (
                <div className={styles.popularBadge}>Popular</div>
              )}
              
              <h3 className={styles.planName}>{plan.name}</h3>
              <div className={styles.priceContainer}>
                <span className={styles.priceValue}>{plan.price}</span>
              </div>
              <p className={styles.planDesc}>{plan.desc}</p>
              
              <ul className={styles.featureList}>
                {plan.features.map((feature, j) => (
                  <li key={j} className={styles.featureItem}>
                    <div className={styles.featureDot} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <button className={styles.button} onClick={() => (navigate("/pricing"))}>
            View Full Pricing
          </button>
        </div>
      </div>
      
    </section>
  );
}
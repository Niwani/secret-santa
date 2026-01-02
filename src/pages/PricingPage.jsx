import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import styles from './PricingPage.module.css';
import NavBar from '../components/homepage/NavBar';
import Footer from '../components/homepage/Footer';

export default function Pricing() {
    const plans = [
        {
          name: 'Free',
          price: '₦0',
          period: 'Forever',
          description: 'Perfect for small family gatherings',
          features: [
            'Up to 20 participants per event',
            'Basic random matching',
            'Email notifications',
            'Wishlist feature',
            'Event management dashboard',
            'Mobile responsive'
          ],
          limitations: [
            'No custom branding',
            'Standard support'
          ],
          buttonText: 'Start Free',
          buttonVariant: 'outline'
        },
        {
          name: 'Pay Per Event',
          price: '₦3,000',
          period: 'One-time payment',
          description: 'Pro features for a single event',
          features: [
            'Unlimited participants',
            'Everything in Free',
            'Custom event branding',
            'Remove Secret Santa watermark',
            'Advanced matching rules',
            'Priority email support',
            'Event analytics',
            'Custom domain option'
          ],
          popular: false,
          buttonText: 'Buy for One Event',
          buttonVariant: 'default'
        },
        {
          name: 'Pro',
          price: '₦15,000',
          period: 'Per year',
          description: 'Best value for regular organizers',
          features: [
            'Unlimited events per year',
            'Unlimited participants per event',
            'Everything in Pay Per Event',
            'Advanced analytics dashboard',
            'Export participant data',
            'Custom email templates',
            'Event history & templates',
            'Priority support',
            'Early access to new features'
          ],
          popular: true,
          buttonText: 'Get Pro',
          buttonVariant: 'default'
        },
        {
          name: 'Business',
          price: '₦25,000',
          period: 'Per year',
          description: 'For companies and large organizations',
          features: [
            'Everything in Pro',
            'API access for integrations',
            'Multiple team admins',
            'White-label options',
            'Dedicated account manager',
            'Custom integrations',
            'Advanced security features',
            'SSO support',
            '99.9% uptime SLA',
            'Phone support'
          ],
          buttonText: 'Contact Sales',
          buttonVariant: 'default'
        }
      ];
    

  return (
    <div>
        <NavBar />
        <div className={styles.pageWrapper}>
        <div className={styles.container}>
            
            {/* Header */}
            <div className={styles.header}>
            <h1 className={styles.title}>Simple, Transparent Pricing</h1>
            <p className={styles.subtitle}>
                Choose the plan that fits your needs. No hidden fees, cancel anytime.
            </p>
            </div>

            {/* Pricing Cards */}
            <div className={styles.pricingGrid}>
            {plans.map((plan, index) => (
                <div 
                key={index} 
                className={`${styles.card} ${plan.popular ? styles.popularCard : ''}`}
                >
                {plan.popular && (
                    <div className={styles.popularBadge}>
                    <Sparkles size={16} /> Most Popular
                    </div>
                )}
                
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{plan.name}</h2>
                <div style={{ margin: '16px 0' }}>
                    <span style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>{plan.price}</span>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{plan.period}</p>
                </div>
                
                <button className={`plan.popular ? ${styles.btnRedFull} : ${styles.btnOutlineFull}`}>
                    {plan.buttonText}
                </button>

                <div className={styles.featureList}>
                    {plan.features.map((feature, i) => (
                    <div key={i} className={styles.featureItem}>
                        <Check size={18} color="#16a34a" />
                        <span>{feature}</span>
                    </div>
                    ))}
                </div>
                </div>
            ))}
            </div>

            {/* CTA Section */}
            <div className={styles.ctaCard}>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Still not sure? Try our demo!</h2>
            <p style={{ color: '#fee2e2' }}>Test all features before committing</p>
            <Link to="/admin/create-event?mode=demo" className={styles.ctaButton}>Try Demo Now</Link>
            </div>

        </div>
        </div>
        <Footer />
    </div>
  );
}
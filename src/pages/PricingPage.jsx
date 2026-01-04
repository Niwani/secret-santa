import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import styles from './PricingPage.module.css';
import PublicNavBar from '../components/homepage/NavBar';
import Footer from '../components/homepage/Footer';

export default function Pricing() {
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState("");

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Try to get fullName from firestore for consistency, fallback to displayName
                try {
                    const docRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists() && docSnap.data().fullName) {
                        setDisplayName(docSnap.data().fullName);
                    } else {
                        setDisplayName(currentUser.displayName);
                    }
                } catch (e) {
                    setDisplayName(currentUser.displayName);
                }
            }
        });
        return () => unsubscribe();
    }, []);

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
          buttonText: user ? 'Go to Dashboard' : 'Start Free',
          buttonVariant: 'outline',
          link: '/dashboard'
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
          buttonVariant: 'default',
          link: 'https://project-x-merchant.k8.isw.la/paymentgateway/link/pay/SantaExDlIA7'
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
          buttonVariant: 'default',
          link: 'https://project-x-merchant.k8.isw.la/paymentgateway/link/pay/SantaExcDR5q'
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
          buttonText: 'Coming Soon',
          buttonVariant: 'outline',
          link: null, // Disabled
          disabled: true
        }
      ];
    

  return (
    <div>
        <PublicNavBar />
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
                
                <div className={styles.featureList}>
                    {plan.features.map((feature, i) => (
                    <div key={i} className={styles.featureItem}>
                        <Check size={18} color="#16a34a" />
                        <span>{feature}</span>
                    </div>
                    ))}
                </div>

                {plan.disabled ? (
                     <button className={styles.btnDisabledFull} disabled>
                        {plan.buttonText}
                     </button>
                ) : plan.link ? (
                    plan.link.startsWith('http') ? (
                        <a 
                            href={plan.link} 
                            target="_blank" 
                            rel="noreferrer"
                            className={plan.popular ? styles.btnPrimaryFull : styles.btnOutlineFull}
                            style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
                        >
                            {plan.buttonText}
                        </a>
                    ) : (
                         <Link to={plan.link} className={plan.popular ? styles.btnPrimaryFull : styles.btnOutlineFull} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                             {plan.buttonText}
                         </Link>
                    )
                ) : (
                    <button className={plan.popular ? styles.btnPrimaryFull : styles.btnOutlineFull}>
                        {plan.buttonText}
                    </button>
                )}
                </div>
            ))}
            </div>

            {/* CTA Section */}
            {!user && (
                <div className={styles.ctaCard}>
                <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Still not sure? Try our demo!</h2>
                <p style={{ color: '#fee2e2' }}>Test all features before committing</p>
                <Link to="/admin/create-event?mode=demo" className={styles.ctaButton}>Try Demo Now</Link>
                </div>
            )}

        </div>
        </div>
        <Footer />
    </div>
  );
}
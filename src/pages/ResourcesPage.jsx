import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import PublicNavBar from "../components/homepage/NavBar";
import LoggedInNavBar from "../components/loggedIn/NavBar";
import Footer from "../components/homepage/Footer";
import { BookOpen, HelpCircle, Gift, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import classes from "./ResourcesPage.module.css";

export default function ResourcesPage() {
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState("");

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
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

    const resources = [
        {
            icon: <BookOpen size={28} />,
            title: "Gifterly Blog",
            desc: "Explore tips, tricks, and heartwarming stories from the Gifterly community.",
            link: "/blog",
            linkText: "Read the Blog"
        },
        {
            icon: <HelpCircle size={28} />,
            title: "Help Center",
            desc: "Stuck? Find answers to common questions about setting up your event.",
            link: "/help",
            linkText: "Visit Help Center"
        },
        {
            icon: <ShieldCheck size={28} />,
            title: "Privacy & Security",
            desc: "Learn how we protect your data and ensure a safe gift exchange.",
            link: "/privacy", // Assuming exist or placeholder
            linkText: "Read Policy"
        },
        {
            icon: <Sparkles size={28} />,
            title: "Pro Features",
            desc: "Discover the advanced tools available for power organizers.",
            link: "/pricing",
            linkText: "View Pricing"
        }
    ];

    return (
        <div>
            {user ? <LoggedInNavBar userName={displayName} /> : <PublicNavBar />}
            
            <div className={classes.pageWrapper}>
                <div className={classes.container}>
                    
                    {/* Hero */}
                    <div className={classes.hero}>
                        <h1 className={classes.heroTitle}>Master the Art of Gifting</h1>
                        <p className={classes.heroSubtitle}>Everything you need to organize the perfect Secret Santa event, all in one place.</p>
                    </div>

                    {/* Resources Grid */}
                    <div className={classes.grid}>
                        {resources.map((item, index) => (
                            <Link to={item.link} key={index} className={classes.card}>
                                <div className={classes.iconWrapper}>
                                    {item.icon}
                                </div>
                                <h3 className={classes.cardTitle}>{item.title}</h3>
                                <p className={classes.cardDesc}>{item.desc}</p>
                                <div className={classes.cardAction}>
                                    {item.linkText} <ArrowRight size={16} />
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Rules Section */}
                    <div className={classes.section}>
                        <h2 className={classes.sectionTitle}>Official Secret Santa Rules</h2>
                        <div className={classes.rulesContainer}>
                            <div className={classes.ruleItem}>
                                <div className={classes.ruleNum}>01</div>
                                <div className={classes.ruleContent}>
                                    <h4>Set the Budget</h4>
                                    <p>Agree on a spending limit so everyone receives a gift of similar value.</p>
                                </div>
                            </div>
                            <div className={classes.ruleItem}>
                                <div className={classes.ruleNum}>02</div>
                                <div className={classes.ruleContent}>
                                    <h4>Draw Names</h4>
                                    <p>Use Gifterly to randomly assign a "Giftee" to each "Gifter". No one draws themselves!</p>
                                </div>
                            </div>
                            <div className={classes.ruleItem}>
                                <div className={classes.ruleNum}>03</div>
                                <div className={classes.ruleContent}>
                                    <h4>Keep it Secret</h4>
                                    <p>Shh! Don't reveal who you have until the exchange party (or ever, if you're hardcore).</p>
                                </div>
                            </div>
                            <div className={classes.ruleItem}>
                                <div className={classes.ruleNum}>04</div>
                                <div className={classes.ruleContent}>
                                    <h4>Wishlists Help</h4>
                                    <p>Encourage participants to create wishlists so they get something they actually want.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
            <Footer />
        </div>
    );
}

import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import PublicNavBar from "../components/homepage/NavBar";
import LoggedInNavBar from "../components/loggedIn/NavBar";
import { Search, ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail } from "lucide-react";
import classes from "./HelpCenterPage.module.css";

const FAQS = [
    {
        question: "How do I create a new event?",
        answer: "Simply navigate to your Dashboard and click the 'Create New Event' button. You'll be asked to set a budget, date, and add participants."
    },
    {
        question: "Can I add participants after creating an event?",
        answer: "Yes! Go to 'My Events' on your dashboard, select the event, and use the 'Add Participant' button. However, once the draw has happened, you cannot add new people."
    },
    {
        question: "How does the matching work?",
        answer: "Our algorithm randomly pairs participants while ensuring no one draws themselves. If you're on the Pro plan, you can also set specific exclusion rules (e.g., couples who shouldn't match)."
    },
    {
        question: "Is Gifterly free to use?",
        answer: "Yes! The Free plan allows up to 20 participants per event. For larger events, unlimited history, and premium features like data export, check out our Pro plans."
    },
    {
        question: "How do I share the draw results?",
        answer: "After the draw is complete, each participant gets a unique link. As the organizer, you can copy the 'Draw Link' from the Event Details and share it with your group via WhatsApp or Email."
    },
    {
        question: "What if someone forgets their password?",
        answer: "On the login page, click 'Forgot Password'. We'll send a secure link to reset it. If you're logged in, you can also reset it from your Profile page."
    }
];

export default function HelpCenterPage() {
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState("");
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

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

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const filteredFAQs = FAQS.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={classes.pageWrapper}>
            {user ? <LoggedInNavBar userName={displayName} /> : <PublicNavBar />}
            
            <div className={classes.container}>
                
                {/* Header */}
                <div className={classes.header}>
                    <h1 className={classes.title}>How can we help?</h1>
                    <p className={classes.subtitle}>Search our knowledge base or browse frequently asked questions below.</p>
                    
                    <div className={classes.searchBox}>
                        <Search size={20} color="#9ca3af" />
                        <input 
                            type="text" 
                            className={classes.searchInput} 
                            placeholder="Search for answers..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className={classes.searchBtn}>Search</button>
                    </div>
                </div>

                {/* FAQs */}
                <h2 className={classes.sectionTitle}>
                    <HelpCircle size={24} color="#db2777" /> Frequently Asked Questions
                </h2>

                <div className={classes.faqGrid}>
                    {filteredFAQs.length > 0 ? (
                        filteredFAQs.map((faq, index) => (
                            <div 
                                key={index} 
                                className={`${classes.faqItem} ${activeIndex === index ? classes.active : ""}`}
                            >
                                <div className={classes.faqQuestion} onClick={() => toggleFAQ(index)}>
                                    {faq.question}
                                    {activeIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                                {activeIndex === index && (
                                    <div className={classes.faqAnswer}>
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p style={{textAlign: "center", color: "#6b7280", padding: 20}}>
                            No results found for "{searchQuery}". Try a different keyword.
                        </p>
                    )}
                </div>

                {/* Contact Card */}
                <div className={classes.contactCard}>
                    <h3 className={classes.contactTitle}>Still need help?</h3>
                    <p className={classes.contactText}>Our team is available 24/7 to assist you with any issues.</p>
                    <button className={classes.contactBtn} onClick={() => window.location.href = "mailto:support@gifterly.com"}>
                        <Mail size={18} style={{marginRight: 8, verticalAlign: "middle"}} />
                        Contact Support
                    </button>
                </div>

            </div>
        </div>
    );
}

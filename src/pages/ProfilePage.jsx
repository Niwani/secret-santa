import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, onValue } from "firebase/database";
import { db, database } from "../firebase";
import NavBar from "../components/loggedIn/NavBar";
import PricingModal from "../components/loggedIn/PricingModal";
import { User, Mail, Shield, CreditCard, Edit2, Check, BarChart3, KeyRound, AlertTriangle, Save, Loader } from "lucide-react";
import classes from "./ProfilePage.module.css";

export default function ProfilePage() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Stats
  const [stats, setStats] = useState({ events: 0, participants: 0 });

  // Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  
  // Pricing Modal
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setNewName(currentUser.displayName || "");

        // Fetch Firestore Data (Subscription)
        try {
            const docRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setProfileData(data);
                if (data.fullName) {
                    setNewName(data.fullName);
                }
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }

        // Fetch Realtime DB Data (Stats)
        const eventsRef = ref(database, `secretSanta/users/${currentUser.uid}/events`);
        onValue(eventsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const eventsList = Object.values(data);
                const totalEvents = eventsList.length;
                const totalParticipants = eventsList.reduce((acc, curr) => {
                    return acc + (curr.participants ? curr.participants.length : 0);
                }, 0);
                setStats({ events: totalEvents, participants: totalParticipants });
            }
        });

        setLoading(false);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  const handleSaveName = async () => {
      if (!newName.trim()) return;
      try {
          await updateProfile(auth.currentUser, { displayName: newName });
          // Update Firestore too if you store it there
          const docRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(docRef, { fullName: newName });
          
          setUser({ ...auth.currentUser, displayName: newName });
          setIsEditing(false);
          alert("Profile updated successfully!");
      } catch (err) {
          console.error("Error updating profile:", err);
          alert("Failed to update profile.");
      }
  };

  const handlePasswordReset = async () => {
      if (!user.email) return;
      if (window.confirm(`Send password reset email to ${user.email}?`)) {
          try {
              await sendPasswordResetEmail(auth, user.email);
              alert("Password reset email sent! Check your inbox.");
          } catch (err) {
              console.error(err);
              alert("Error sending reset email: " + err.message);
          }
      }
  };

  if (loading) return (
      <div style={{minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <Loader size={32} className={classes.loader} />
      </div>
  );

  const displayName = profileData.fullName || user.displayName || "User";
  const initials = (displayName || user.email || "U").charAt(0).toUpperCase();
  const subscriptionLevel = profileData.subscriptionLevel || "free";

  return (
    <div className={classes.pageWrapper}>
      <NavBar userName={displayName} />
      
      <div className={classes.container}>
        
        {/* HEADER */}
        <div className={classes.headerCard}>
            <div className={classes.avatarSection}>
                <div className={classes.avatar}>{initials}</div>
            </div>
            <div className={classes.infoSection}>
                <div className={classes.nameGroup}>
                    {isEditing ? (
                        <input 
                            className={classes.nameInput}
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            autoFocus
                        />
                    ) : (
                        <h1 className={classes.name}>{displayName}</h1>
                    )}
                    
                    {isEditing ? (
                        <button className={classes.editBtn} onClick={handleSaveName} title="Save">
                            <Save size={18} color="#10b981" />
                        </button>
                    ) : (
                        <button className={classes.editBtn} onClick={() => setIsEditing(true)} title="Edit Name">
                            <Edit2 size={18} />
                        </button>
                    )}
                </div>
                <div className={classes.email}>
                    <Mail size={16} /> {user.email}
                </div>
            </div>
        </div>

        <div className={classes.grid}>
            
            {/* STATS CARD */}
            <div className={classes.card}>
                <div>
                    <h3 className={classes.cardTitle}>
                        <BarChart3 size={20} color="#db2777" /> 
                        Your Impact
                    </h3>
                    <div className={classes.statRow}>
                        <span className={classes.statLabel}>Events Hosted</span>
                        <span className={classes.statValue}>{stats.events}</span>
                    </div>
                    <div className={classes.statRow}>
                        <span className={classes.statLabel}>Happy Gifters</span>
                        <span className={classes.statValue}>{stats.participants}</span>
                    </div>
                    <div className={classes.statRow}>
                        <span className={classes.statLabel}>Joined</span>
                        <span className={classes.statValue}>
                            {new Date(user.metadata.creationTime).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* SUBSCRIPTION CARD */}
            <div className={classes.card}>
                <div>
                    <h3 className={classes.cardTitle}>
                        <CreditCard size={20} color="#db2777" /> 
                        Subscription
                    </h3>
                    <div className={`${classes.planBadge} ${subscriptionLevel === "free" ? classes.planFree : classes.planPro}`}>
                        {subscriptionLevel === "free" ? "Free Plan" : "Pro Plan"}
                    </div>
                    
                    {subscriptionLevel === "free" ? (
                        <ul className={classes.planList}>
                            <li><Check size={16} color="#10b981" /> Up to 20 Participants</li>
                            <li style={{opacity: 0.5}}><Check size={16} /> Data Exports</li>
                            <li style={{opacity: 0.5}}><Check size={16} /> Email Invites</li>
                        </ul>
                    ) : (
                        <ul className={classes.planList}>
                            <li><Check size={16} color="#10b981" /> Unlimited Participants</li>
                            <li><Check size={16} color="#10b981" /> Data Exports</li>
                            <li><Check size={16} color="#10b981" /> Priority Support</li>
                        </ul>
                    )}
                </div>
                
                {subscriptionLevel === "free" && (
                    <button className={classes.upgradeBtn} onClick={() => setShowPricing(true)}>
                        Upgrade to Pro
                    </button>
                )}
            </div>

            {/* SECURITY CARD */}
            <div className={classes.card}>
                <div>
                    <h3 className={classes.cardTitle}>
                        <Shield size={20} color="#db2777" /> 
                        Security
                    </h3>
                    <button className={`${classes.securityBtn} ${classes.resetBtn}`} onClick={handlePasswordReset}>
                        <KeyRound size={18} /> Reset Password
                    </button>
                    <div style={{marginTop: 20}}></div>
                    <button className={`${classes.securityBtn} ${classes.deleteBtn}`} onClick={() => alert("Please contact support to delete your account.")}>
                        <AlertTriangle size={18} /> Delete Account
                    </button>
                </div>
            </div>

        </div>
      </div>

      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
    </div>
  );
}

import { X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PricingModal({ onClose }) {
  const navigate = useNavigate();
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.recommendedBadge}>Recommended</div>
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={24} />
        </button>
        
        <div style={styles.header}>
            <h2 style={styles.title}>Unlock Premium 🎄</h2>
            <p style={styles.subtitle}>Supercharge your Secret Santa event</p>
        </div>

        <div style={styles.priceTag}>
            <span style={styles.currency}>₦</span>
            <span style={styles.amount}>5,000</span>
            <span style={styles.period}>/ event</span>
        </div>

        <ul style={styles.features}>
            <li style={styles.featureItem}>
                <div style={styles.iconBox}><Check size={16} strokeWidth={3} /></div>
                <span>Unlimited Participants</span>
            </li>
            <li style={styles.featureItem}>
                <div style={styles.iconBox}><Check size={16} strokeWidth={3} /></div>
                <span>Email Notifications</span>
            </li>
            <li style={styles.featureItem}>
                <div style={styles.iconBox}><Check size={16} strokeWidth={3} /></div>
                <span>Wishlist Support</span>
            </li>
             <li style={styles.featureItem}>
                <div style={styles.iconBox}><Check size={16} strokeWidth={3} /></div>
                <span>Priority Support</span>
            </li>
        </ul>

        <button style={styles.payBtn} onClick={() => alert("Paystack Integration coming soon!")}>
            Pay Now
        </button>
        
        <p style={styles.secureText}>🔒 Secured by Paystack</p>

        <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #f3f4f6" }}>
            <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "8px" }}>Not what you're looking for?</p>
            <button 
                onClick={() => navigate("/pricing")}
                style={{ background: "none", border: "none", color: "#6366f1", fontWeight: "600", cursor: "pointer", fontSize: "0.95rem" }}
            >
                View all pricing options →
            </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modal: {
    background: "#fff",
    borderRadius: "24px",
    padding: "40px",
    width: "90%",
    maxWidth: "400px",
    position: "relative",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    textAlign: "center",
    marginTop: "20px",
  },
  recommendedBadge: {
      position: "absolute",
      top: "-12px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "white",
      padding: "6px 16px",
      borderRadius: "999px",
      fontSize: "0.85rem",
      fontWeight: "700",
      boxShadow: "0 4px 6px rgba(16, 185, 129, 0.2)",
      zIndex: 10,
  },
  closeBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9ca3af",
  },
  header: {
      marginBottom: "24px",
  },
  title: {
      fontSize: "1.75rem",
      fontWeight: "800",
      color: "#111827",
      marginBottom: "8px",
  },
  subtitle: {
      color: "#6b7280",
      fontSize: "1rem",
  },
  priceTag: {
      marginBottom: "32px",
      display: "flex",
      alignItems: "baseline",
      justifyContent: "center",
      gap: "4px",
  },
  currency: {
      fontSize: "1.5rem",
      fontWeight: "600",
      color: "#374151",
  },
  amount: {
      fontSize: "3.5rem",
      fontWeight: "800",
      color: "#111827",
      lineHeight: "1",
  },
  period: {
      color: "#6b7280",
      fontWeight: "500",
  },
  features: {
      listStyle: "none",
      padding: 0,
      margin: "0 0 32px 0",
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
  },
  featureItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      color: "#374151",
      fontSize: "1rem",
      fontWeight: "500",
  },
  iconBox: {
      background: "#dcfce7",
      color: "#16a34a",
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
  },
  payBtn: {
      width: "100%",
      padding: "16px",
      background: "#00c3f5", // Paystack blue-ish or custom branding
      color: "white",
      fontWeight: "700",
      fontSize: "1.1rem",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      transition: "transform 0.1s",
      marginBottom: "16px",
  },
  secureText: {
      fontSize: "0.8rem",
      color: "#9ca3af",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
  }
};

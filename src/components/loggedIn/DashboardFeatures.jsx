import React from "react";
import { Lock, Check, Zap, Mail, LayoutList, BarChart3, HelpCircle, Shuffle } from "lucide-react";

export default function DashboardFeatures({ subscriptionLevel = "free" }) {
  // Map levels to numeric values for easy comparison
  const levels = { free: 0, pro: 1, business: 2 };
  const currentLevel = levels[subscriptionLevel] || 0;

  const features = [
    {
      id: 1,
      name: "Smart Matching",
      description: "Basic random assignment without conflicts.",
      icon: <Shuffle size={24} />,
      minPlan: "free",
      color: "#3b82f6", // Blue
    },
    {
      id: 2,
      name: "Wishlists",
      description: "Allow participants to add gift preferences.",
      icon: <LayoutList size={24} />,
      minPlan: "pro",
      color: "#ec4899", // Pink
    },
    {
      id: 3,
      name: "Email Notifications",
      description: "Auto-send matches to participants.",
      icon: <Mail size={24} />,
      minPlan: "pro",
      color: "#10b981", // Green
    },
    {
      id: 4,
      name: "Unlimited Participants",
      description: "Remove the 20-person limit per event.",
      icon: <Zap size={24} />,
      minPlan: "pro",
      color: "#f59e0b", // Amber
    },
    {
      id: 5,
      name: "Analytics Dashboard",
      description: "Track opens, clicks, and event engagement.",
      icon: <BarChart3 size={24} />,
      minPlan: "business",
      color: "#8b5cf6", // Violet
    },
    {
      id: 6,
      name: "Priority Email & Chat Support",
      description: "24/7 dedicated support line.",
      icon: <HelpCircle size={24} />,
      minPlan: "business",
      color: "#ef4444", // Red
    },
  ];

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Your Feature Hub</h3>
      <div style={styles.grid}>
        {features.map((feature) => {
          const isUnlocked = currentLevel >= levels[feature.minPlan];
          
          return (
            <div 
              key={feature.id} 
              style={{
                ...styles.card,
                ...(isUnlocked ? {} : styles.lockedCard),
              }}
            >
              {!isUnlocked && (
                <div style={styles.lockOverlay}>
                  <Lock size={20} color="#6b7280" />
                </div>
              )}

              <div 
                style={{
                  ...styles.iconBox,
                  backgroundColor: isUnlocked ? `${feature.color}20` : "#f3f4f6", // 20% opacity or gray
                  color: isUnlocked ? feature.color : "#9ca3af",
                }}
              >
                {feature.icon}
              </div>

              <div>
                <h4 style={{ ...styles.title, color: isUnlocked ? "#1f2937" : "#6b7280" }}>
                  {feature.name}
                </h4>
                <p style={styles.description}>
                  {feature.description}
                </p>
              </div>

              {isUnlocked && (
                <div style={styles.statusBadge}>
                  <Check size={12} strokeWidth={3} /> Active
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: 40,
    marginBottom: 40,
  },
  header: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#374151",
    marginBottom: 16,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fil, minmax(300px, 1fr))",
    gap: 16,
    // responsive grid handled by grid-template-columns usually, but inline styles are tricky for media queries.
    // relying on flex-wrap behaviour if needed or simple column count
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    display: "flex",
    alignItems: "flex-start",
    gap: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    border: "1px solid #e5e7eb",
    position: "relative",
    transition: "transform 0.2s",
  },
  lockedCard: {
    background: "#f9fafb", // slightly grey background
    borderColor: "#e5e7eb",
    filter: "grayscale(100%)", // Make it black and white
    opacity: 0.7,
    cursor: "not-allowed",
  },
  lockOverlay: {
    position: "absolute",
    top: 12,
    right: 12,
    background: "white",
    borderRadius: "50%",
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    zIndex: 10,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: 4,
  },
  description: {
    fontSize: "0.85rem",
    color: "#6b7280",
    lineHeight: 1.4,
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "#16a34a",
    background: "#dcfce7",
    padding: "4px 8px",
    borderRadius: 99,
    display: "flex",
    alignItems: "center",
    gap: 4,
  }
};

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { motion } from "framer-motion";
import { Users, Calendar, TrendingUp, Trophy } from "lucide-react";

export default function AnalyticsDashboard({ events = [] }) {
  // 1. Calculate Stats
  const totalEvents = events.length;
  
  const totalParticipants = events.reduce((sum, ev) => {
    // Participants can be objects or strings
    const count = Array.isArray(ev.participants) ? ev.participants.length : 0;
    return sum + count;
  }, 0);

  const avgParticipants = totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0;

  // Find most popular event (max participants)
  const sortedByPop = [...events].sort((a, b) => {
    const lenA = Array.isArray(a.participants) ? a.participants.length : 0;
    const lenB = Array.isArray(b.participants) ? b.participants.length : 0;
    return lenB - lenA;
  });
  const mostPopular = sortedByPop[0];
  const mostPopularName = mostPopular ? (mostPopular.name || "N/A") : "N/A";
  const mostPopularCount = mostPopular ? (Array.isArray(mostPopular.participants) ? mostPopular.participants.length : 0) : 0;

  // 2. Prepare Chart Data
  const data = events.map(ev => ({
    name: ev.name || "Event",
    participants: Array.isArray(ev.participants) ? ev.participants.length : 0,
  }));

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={styles.container}
    >
      {/* Stats Grid */}
      <div style={styles.grid}>
        <StatCard 
            title="Total Events" 
            value={totalEvents} 
            icon={<Calendar size={24} color="#e11d48" />} 
            color="#ffe4e6"
            variants={itemVariants}
        />
        <StatCard 
            title="Total Participants" 
            value={totalParticipants} 
            icon={<Users size={24} color="#9333ea" />} 
            color="#f3e8ff"
            variants={itemVariants}
        />
        <StatCard 
            title="Avg. Group Size" 
            value={avgParticipants} 
            icon={<TrendingUp size={24} color="#059669" />} 
            color="#d1fae5"
            variants={itemVariants}
        />
        <StatCard 
            title="Biggest Event" 
            value={mostPopularCount} 
            subValue={mostPopularName}
            icon={<Trophy size={24} color="#d97706" />} 
            color="#fef3c7"
            variants={itemVariants}
        />
      </div>

      {/* Chart Section */}
      <motion.div variants={itemVariants} style={styles.chartCard}>
        <h3 style={styles.chartTitle}>Participant Distribution</h3>
        <div style={{ width: "100%", height: 220 }}>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis 
                            dataKey="name" 
                            stroke="#6b7280" 
                            tick={{fontSize: 12}} 
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis 
                            stroke="#6b7280" 
                            tick={{fontSize: 12}} 
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="participants" radius={[6, 6, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#f43f5e" : "#fb7185"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div style={styles.emptyState}>No Data to Display</div>
            )}
        </div>
      </motion.div>

    </motion.div>
  );
}

// Sub-component for Cards
function StatCard({ title, value, subValue, icon, color, variants }) {
    return (
        <motion.div variants={variants} style={{ ...styles.card, borderBottom: `4px solid ${color}` }}>
            <div style={{ ...styles.iconBox, background: color }}>
                {icon}
            </div>
            <div>
                <p style={styles.cardTitle}>{title}</p>
                <h2 style={styles.cardValue}>{value}</h2>
                {subValue && <span style={styles.cardSub}>{subValue}</span>}
            </div>
        </motion.div>
    );
}

const styles = {
    container: {
        paddingTop: 20,
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", // auto-fill Prevents stretching
        gap: 20,
        marginBottom: 30,
    },
    card: {
        background: "white",
        borderRadius: 16,
        padding: 16, // Reduced padding
        display: "flex",
        alignItems: "center",
        gap: 16, // Reduced gap
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        transition: "transform 0.2s",
    },
    iconBox: {
        width: 42, // Smaller icon box
        height: 42,
        borderRadius: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    cardTitle: {
        margin: 0,
        color: "#6b7280",
        fontSize: 13, // Slightly smaller
        fontWeight: 500,
    },
    cardValue: {
        margin: "2px 0 0 0",
        color: "#1f2937",
        fontSize: 20, // Smaller value text
        fontWeight: 700,
    },
    cardSub: {
        fontSize: 12,
        color: "#9ca3af",
    },
    chartCard: {
        background: "white",
        borderRadius: 16,
        padding: 16, // Compact padding
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    chartTitle: {
        margin: "0 0 15px 0", // Reduced margin
        color: "#374151",
        fontSize: 16, // Smaller title
        fontWeight: 600,
    },
    emptyState: {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#9ca3af",
    }
};

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function DemoDraw() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    navigate("/");
    return null;
  }

  const { eventName, participants } = state;
  const [pairs, setPairs] = useState([]);

  const shuffleAndPair = () => {
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const grouped = [];

    for (let i = 0; i < shuffled.length; i += 2) {
      grouped.push([shuffled[i], shuffled[i + 1]]);
    }

    setPairs(grouped);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>{eventName}</h1>
        <p>Demo Mode — Not Saved</p>

        <button style={styles.primaryBtn} onClick={shuffleAndPair}>
          🔄 Shuffle & Draw
        </button>

        {pairs.length > 0 && (
          <div style={styles.pairs}>
            {pairs.map((pair, index) => (
              <div key={index} style={styles.pairCard}>
                🎁 {pair[0]} ↔ {pair[1]}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f5f5",
      padding: 20,
    },
    card: {
      background: "#fff",
      padding: 30,
      borderRadius: 12,
      width: "100%",
      maxWidth: 450,
      boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    },
    primaryBtn: {
      width: "100%",
      padding: 14,
      background: "#e65100",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      marginBottom: 20,
    },
    pairs: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
    },
    pairCard: {
      padding: 12,
      background: "#f0f0f0",
      borderRadius: 6,
      textAlign: "center",
      fontWeight: "bold",
    },
  };
  
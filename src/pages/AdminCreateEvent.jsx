import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ref, push, set } from "firebase/database";
import { database } from "../firebase";
import { getAuth } from "firebase/auth";
import { Sparkles } from "lucide-react";

export default function AdminCreateEvent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isDemo = searchParams.get("mode") === "demo";
  const MAX_PARTICIPANTS = isDemo ? 10 : 30;

  const [eventName, setEventName] = useState("");
  const [participants, setParticipants] = useState([""]);
  const [loading, setLoading] = useState(false);

  const cleaned = participants.filter((p) => p.trim() !== "");
  const isEven = cleaned.length % 2 === 0;

  const auth = getAuth();

  const addParticipant = () => {
    if (participants.length >= MAX_PARTICIPANTS) {
      alert(`Maximum ${MAX_PARTICIPANTS} participants allowed.`);
      return;
    }
    setParticipants([...participants, ""]);
  };

  const removeParticipant = (index) => {
    if (participants.length === 1) return;
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const updateParticipant = (index, value) => {
    const updated = [...participants];
    updated[index] = value;
    setParticipants(updated);
  };

  const handleCreateEvent = async () => {
    const cleaned = participants.filter((p) => p.trim() !== "");
  
    // 1️⃣ VALIDATIONS
    if (!eventName.trim()) {
      alert("Event name is required");
      return;
    }
  
    if (cleaned.length < 2) {
      alert("At least 2 participants required");
      return;
    }
  
    if (cleaned.length % 2 !== 0) {
      alert("Participants must be an even number.");
      return;
    }
  
    // 2️⃣ DEMO MODE → NO AUTH, NO FIREBASE
    if (isDemo) {
      navigate("/demo/draw", {
        state: {
          eventName,
          participants: cleaned,
        },
      });
      return;
    }
  
    // 3️⃣ REAL MODE → REQUIRE LOGIN
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to create an event");
      return;
    }
  
    setLoading(true);
  
    try {
      const uid = user.uid;
  
      const eventRef = push(
        ref(database, `secretSanta/users/${uid}/events`)
      );
  
      await set(eventRef, {
        eventName,
        participants: cleaned,
        createdAt: Date.now(),
        owner: uid,
      });
  
      navigate(`/event/${eventRef.key}/draw`);
    } catch (error) {
      console.error(error);
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>Create Secret Santa Event</h1>

        {/* 🔔 DEMO NOTICE */}
        {isDemo && <div>Demo Mode is Active</div>}

        {isDemo && (
          <div className={styles.headerContainer}>
          <div className={styles.badge}>
            <Sparkles size={16} />
            Demo Mode - Nothing is saved
          </div>
          
          <h1 className={styles.title}>
            Try Secret Santa Demo
          </h1>
          
          <p className={styles.subtitle}>
            Test the magic with up to 10 participants (demo only)
          </p>
        </div>
          // <div style={styles.demoNotice}>
          //   <strong>Demo Mode:</strong> This event will not be saved.
          //   <br />
          //   <span>
          //     Log in before creating an event to save it permanently.
          //   </span>

          //   <button
          //     style={styles.loginBtn}
          //     onClick={() => navigate("/login")}
          //   >
          //     Log In
          //   </button>
          // </div>
        )}

        <input
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          style={styles.input}
        />

        <h3>
          Participants ({participants.length}/{MAX_PARTICIPANTS})
        </h3>

        {participants.map((name, index) => (
          <div key={index} style={styles.participantRow}>
            <input
              placeholder={`Participant ${index + 1}`}
              value={name}
              onChange={(e) =>
                updateParticipant(index, e.target.value)
              }
              style={{ ...styles.input, marginBottom: 0 }}
            />

            <button
              style={styles.removeBtn}
              onClick={() => removeParticipant(index)}
              disabled={participants.length === 1}
              title="Remove participant"
            >
              ✕
            </button>
          </div>
        ))}

        <button onClick={addParticipant} style={styles.secondaryBtn}>
          + Add Participant
        </button>

        <button onClick={handleCreateEvent} 
          style={{...styles.primaryBtn, 
              opacity: isEven ? 1 : 0.5,
              cursor: isEven ? "pointer" : "not-allowed"
            }}>
          {loading ? "Creating..." : "Create Event"}
        </button>
        {!isEven && cleaned.length > 0 && (
          <p style={{ color: "red", marginTop: 8 }}>
            Participants must be an even number to continue
          </p>
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
    padding: 20,
    background: "#f5f5f5",
  },
  card: {
    width: "100%",
    maxWidth: 450,
    background: "#fff",
    padding: 25,
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  },
  demoNotice: {
    background: "#fff3cd",
    border: "1px solid #ffeeba",
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    fontSize: 14,
  },
  loginBtn: {
    marginTop: 10,
    padding: "8px 12px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  participantRow: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  removeBtn: {
    padding: "10px 12px",
    background: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  primaryBtn: {
    width: "100%",
    padding: 14,
    marginTop: 10,
    background: "#e65100",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 16,
    cursor: "pointer",
  },
  secondaryBtn: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    background: "#eee",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database, auth, db } from "../firebase.js";
import { ref, push, set, onValue } from "firebase/database";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import Navbar from "../components/loggedIn/NavBar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [eventName, setEventName] = useState("");
  const [participants, setParticipants] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserName(userDoc.data().fullName);
      }
    };
    fetchUser();
  }, []);

  // Fetch all events
  useEffect(() => {
    const eventsRef = ref(database, "secretSanta/events");
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formatted = Object.entries(data).map(([id, event]) => ({
          id,
          ...event,
        }));
        setEvents(formatted.reverse());
      } else {
        setEvents([]);
      }
    });
  }, []);

  const handleAddParticipant = () => {
    if (participants.length < 30) setParticipants([...participants, ""]);
  };

  const handleParticipantChange = (index, value) => {
    const updated = [...participants];
    updated[index] = value;
    setParticipants(updated);
  };

  const handleCreateEvent = async () => {
    if (!eventName.trim()) return alert("Event name is required!");
    setLoading(true);

    try {
      const newEventRef = push(ref(database, "secretSanta/events"));
      await set(newEventRef, {
        name: eventName,
        participants: participants.filter((p) => p.trim() !== ""),
      });

      await setDoc(doc(db, "events", newEventRef.key), {
        name: eventName,
        participants: participants.filter((p) => p.trim() !== ""),
        creatorId: auth.currentUser.uid,
        createdAt: new Date(),
      });

      setEventName("");
      setParticipants([""]);
      navigate(`/event/${newEventRef.key}/draw`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Navbar userName={userName} />
      <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
        {/* Create Event Section */}
        <div style={styles.card}>
          <h2>Create New Event</h2>
          <input
            style={styles.input}
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
          {participants.map((p, idx) => (
            <input
              key={idx}
              style={styles.input}
              type="text"
              placeholder={`Participant ${idx + 1}`}
              value={p}
              onChange={(e) => handleParticipantChange(idx, e.target.value)}
            />
          ))}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={styles.addBtn} onClick={handleAddParticipant}>
              + Add Participant
            </button>
            <button style={styles.createBtn} onClick={handleCreateEvent}>
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </div>

        {/* Events Section */}
        <h2 style={{ marginTop: 40, marginBottom: 20 }}>All Events</h2>
        <div style={{ display: "grid", gap: 20 }}>
          {events.map((ev) => (
            <div key={ev.id} style={styles.eventCard}>
              <h3>{ev.name}</h3>
              <p>Participants: {ev.participants.length}</p>
              <p>Creator: {ev.creatorId}</p>
              <button
                style={styles.drawBtn}
                onClick={() => navigate(`/event/${ev.id}/draw`)}
              >
                Go to Draw
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: 30,
    borderRadius: 15,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  input: {
    padding: 12,
    marginBottom: 10,
    width: "100%",
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 16,
  },
  addBtn: {
    padding: "10px 20px",
    background: "#f9a825",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.2s",
  },
  createBtn: {
    padding: "10px 20px",
    background: "#e53935",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.2s",
  },
  eventCard: {
    background: "#fff",
    padding: 20,
    borderRadius: 15,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  drawBtn: {
    marginTop: 10,
    padding: "8px 16px",
    background: "#43a047",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
};

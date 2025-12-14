import { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, get, set } from "firebase/database";
import { useParams } from "react-router-dom";

export default function SecretSantaApp() {
  const { eventId } = useParams();
  const [eventName, setEventName] = useState("");
  const [participants, setParticipants] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      const eventSnap = await get(ref(database, `secretSanta/events/${eventId}`));
      if (eventSnap.exists()) {
        const eventData = eventSnap.val();
        setEventName(eventData.name);
        setParticipants(eventData.participants || []);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleAssign = async () => {
    const userName = nameInput.trim();
    if (!userName) {
      alert("Please enter your name.");
      return;
    }
    if (!participants.includes(userName)) {
      alert("Your name is not in the participant list for this event!");
      return;
    }

    setLoading(true);

    const assignedRef = ref(database, `secretSanta/${eventId}/assignedNames/${userName}`);
    const takenRef = ref(database, `secretSanta/${eventId}/takenRecipients`);

    const assignedSnap = await get(assignedRef);

    // Already assigned
    if (assignedSnap.exists()) {
      setResult(`You already picked: ${assignedSnap.val()}`);
      setLoading(false);
      return;
    }

    // Get all taken recipients
    const takenSnap = await get(takenRef);
    const taken = takenSnap.exists() ? Object.keys(takenSnap.val()) : [];

    // Build available pool
    const available = participants.filter(p => p !== userName && !taken.includes(p));

    if (available.length === 0) {
      setResult("No more names available!");
      setLoading(false);
      return;
    }

    // Pick random recipient
    const randomRecipient = available[Math.floor(Math.random() * available.length)];

    // Save to Firebase
    await set(ref(database, `secretSanta/${eventId}/assignedNames/${userName}`), randomRecipient);
    await set(ref(database, `secretSanta/${eventId}/takenRecipients/${randomRecipient}`), true);

    setResult(`Your Secret Santa is: ${randomRecipient}`);
    setLoading(false);
  };

  return (
    <div
      style={{
        backgroundImage: "url('/boxes.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "40px",
        paddingLeft: "10px",
        paddingRight: "10px"
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.6)",
          padding: "25px",
          borderRadius: "15px",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          color: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          marginTop: "15px"
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 20, fontWeight: "bold" }}>
          🎅 {eventName || "Secret Santa Draw"} 🎁
        </h1>

        <input
          type="text"
          placeholder="Enter your name..."
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          style={{
            padding: "12px",
            width: "100%",
            borderRadius: "8px",
            fontSize: "16px",
            boxSizing: "border-box",
            marginBottom: "20px",
            marginTop: "5px"
          }}
        />

        <button
          onClick={handleAssign}
          disabled={loading}
          style={{
            padding: "12px 0",
            width: "100%",
            borderRadius: "8px",
            background: "#d32f2f",
            color: "white",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            marginBottom: "15px"
          }}
        >
          {loading ? "Assigning..." : "Get Secret Santa"}
        </button>

        <h2
          style={{
            marginTop: "10px",
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "bold",
            wordBreak: "break-word"
          }}
        >
          {result}
        </h2>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, get, set } from "firebase/database";
import { useParams } from "react-router-dom";

export default function SecretSantaApp() {
  const { creatorId, eventId } = useParams();
  const [eventName, setEventName] = useState("");
  const [participants, setParticipants] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      // Fetch from the user's specific path
      const eventSnap = await get(ref(database, `secretSanta/users/${creatorId}/events/${eventId}`));
      if (eventSnap.exists()) {
        const eventData = eventSnap.val();
        setEventName(eventData.name);
        setParticipants(eventData.participants || []);
      }
    };
    fetchEvent();
  }, [creatorId, eventId]);

  const handleAssign = async () => {
    const userNameInput = nameInput.trim();
    if (!userNameInput) {
      alert("Please enter your name.");
      return;
    }

    // Find exact match case-insensitively
    const matchedName = participants.find(
        p => p.trim().toLowerCase() === userNameInput.toLowerCase()
    );

    if (!matchedName) {
      alert("Your name is not in the participant list for this event!");
      return;
    }

    // Use the correctly cased name from the list
    const userName = matchedName;

    setLoading(true);

    // Update paths to include users/${creatorId}
    const assignedRef = ref(database, `secretSanta/users/${creatorId}/events/${eventId}/assignedNames/${userName}`);
    const takenRef = ref(database, `secretSanta/users/${creatorId}/events/${eventId}/takenRecipients`);

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
    await set(ref(database, `secretSanta/users/${creatorId}/events/${eventId}/assignedNames/${userName}`), randomRecipient);
    await set(ref(database, `secretSanta/users/${creatorId}/events/${eventId}/takenRecipients/${randomRecipient}`), true);

    setResult(`Your Gift Match is: ${randomRecipient}`);
    setLoading(false);
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #fce4ec, #f8bbd0)", // Soft Pink Gradient
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
          💘 {eventName || "GiftEx Draw"} 🎁
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
            background: "#e91e63", // Valentine Pink
            color: "white",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            marginBottom: "15px"
          }}
        >
          {loading ? "Matching..." : "Find Your Match"}
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
          {result ? result.replace("Secret Santa", "Gift Match") : ""}
        </h2>
      </div>
    </div>
  );
}

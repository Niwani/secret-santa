import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/loggedIn/NavBar";
import { auth, database, db } from "../firebase";
import { ref, push, set, onValue, remove } from "firebase/database";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [eventName, setEventName] = useState("");
  const [participants, setParticipants] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null)

  // Fetch user name
  useEffect(() => {
    const fetchUser = async () => {
      if (!auth.currentUser) return;
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) setUserName(userDoc.data().fullName);
      else setUserName(auth.currentUser.email);
    };
    fetchUser();
  }, []);

  // Fetch all events
  useEffect(() => {
    const eventsRef = ref(database, "secretSanta/events");
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formatted = Object.entries(data).map(([id, ev]) => ({
          id,
          ...ev,
        }));
        setEvents(formatted.reverse());
      } else setEvents([]);
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
        creatorId: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
        drawn: false, // tracks if draw has been done
      });

      await setDoc(doc(db, "events", newEventRef.key), {
        name: eventName,
        participants: participants.filter((p) => p.trim() !== ""),
        creatorId: auth.currentUser.uid,
        createdAt: new Date(),
        drawn: false,
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

  // Delete an event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await remove(ref(database, `secretSanta/events/${id}`));
      alert("Event deleted!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
  
      // Split by line breaks or commas
      const names = content
        .split(/\r?\n|,/)
        .map((name) => name.trim())
        .filter((name) => name !== "");
  
      // Combine with existing participants and limit to 30
      const combined = [...participants, ...names].slice(0, 30);
      setParticipants(combined);
    };
    reader.readAsText(file);
  };
  
  

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Navbar userName={userName} />

      <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
        {/* Create Event Card */}
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
                <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                        style={{ ...styles.input }}
                        type="text"
                        placeholder={`Participant ${idx + 1}`}
                        value={p}
                        onChange={(e) => handleParticipantChange(idx, e.target.value)}
                    />
                    {participants.length > 1 && (
                    <button
                        style={styles.removeBtn}
                        onClick={() => {
                        const updated = participants.filter((_, i) => i !== idx);
                        setParticipants(updated);
                        }}
                        >
                        ❌
                    </button>
                )}
            </div>
        ))}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={styles.addBtn} onClick={handleAddParticipant}>
              + Add Participant
            </button>
            <button style={styles.createBtn} onClick={handleCreateEvent} disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </button>
            <div style={{ marginBottom: 10 }}>
                <label style={{ fontWeight: 600 }}>Upload Participants File:</label>
                <input
                    type="file"
                    accept=".txt,.csv"
                    onChange={handleFileUpload}
                    style={{ marginTop: 5 }}
                />
            </div>
          </div>
        </div>

        {/* Preview of participants */}
        {participants.length > 0 && (
        <div style={{ marginTop: 10 }}>
            <h4 style={{ marginBottom: 5 }}>Participants Preview:</h4>
            <ul style={{ paddingLeft: 20 }}>
            {participants.map((name, idx) => (
                <li key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>{name}</span>
                {participants.length > 1 && (
                    <button
                    style={styles.removeBtn}
                    onClick={() => {
                        const updated = participants.filter((_, i) => i !== idx);
                        setParticipants(updated);
                    }}
                    >
                    ❌
                    </button>
                )}
                </li>
            ))}
            </ul>
        </div>
        )}

        {/* Events Grid */}
        <h2 style={{ marginTop: 40, marginBottom: 20 }}>All Events</h2>
        <div style={styles.grid}>
        {events.map((ev) => {
            const isEditable = !ev.drawn; // only editable if draw hasn't happened
            return (
            <div key={ev.id} style={styles.eventCard}>
                <h3 style={{ fontSize: 16 }}>{ev.name}</h3>
                <p style={{ fontSize: 14 }}>Participants: {ev.participants.length}</p>
                <p style={{ fontSize: 14 }}>Creator: {ev.creatorId}</p>
                <p style={{ fontSize: 12 }}> 
                  Drawn: {ev.drawnParticipants || 0} / {ev.participants.length}
                </p>

                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                <button
                    style={{ ...styles.drawBtn, background: "#43a047" }}
                    onClick={() => navigate(`/event/${ev.id}/draw`)}
                >
                    Go to Draw
                </button>
                <button
                    style={{
                        ...styles.drawBtn,
                        background: isEditable ? "#1e88e5" : "#aaa",
                        cursor: isEditable ? "pointer" : "not-allowed",
                    }}
                    onClick={() => {
                        if (isEditable) setEditingEvent(ev); // open modal
                    }}
                    >
                    Edit
                </button>

                <button
                    style={{ ...styles.drawBtn, background: "#e53935" }}
                    onClick={() => handleDelete(ev.id)}
                >
                    Delete
                </button>
                </div>
            </div>
            );
        })}
        </div>
      </div>
      {/* Edit Event Modal */}
      {editingEvent && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Edit Event: {editingEvent.name}</h2>

            <input
              style={styles.input}
              type="text"
              value={editingEvent.name}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, name: e.target.value })
              }
            />

            <h4>Participants:</h4>
            {editingEvent.participants.map((p, idx) => (
              <div
                key={idx}
                style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}
              >
                <input
                  style={{ ...styles.input, flex: 1 }}
                  type="text"
                  value={p}
                  onChange={(e) => {
                    const updated = [...editingEvent.participants];
                    updated[idx] = e.target.value;
                    setEditingEvent({ ...editingEvent, participants: updated });
                  }}
                />
                <button
                  style={styles.removeBtn}
                  onClick={() => {
                    const updated = editingEvent.participants.filter((_, i) => i !== idx);
                    setEditingEvent({ ...editingEvent, participants: updated });
                  }}
                >
                  ❌
                </button>
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
              <button
                style={styles.createBtn}
                onClick={async () => {
                  try {
                    // Update in Realtime Database
                    await set(ref(database, `secretSanta/events/${editingEvent.id}`), editingEvent);

                    // Update in Firestore
                    await setDoc(doc(db, "events", editingEvent.id), editingEvent);

                    alert("Event updated!");
                    setEditingEvent(null); // close modal
                  } catch (err) {
                    console.error(err);
                    alert(err.message);
                  }
                }}
              >
                Save
              </button>
              <button style={styles.addBtn} onClick={() => setEditingEvent(null)}>
                Cancel
              </button>
              <button
                style={{ ...styles.addBtn, marginBottom: 10 }}
                onClick={() =>
                  setEditingEvent({
                    ...editingEvent,
                    participants: [...editingEvent.participants, ""],
                  })
                }
              >
                + Add Participant
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
    card: {
      background: "#fff",
      padding: 30,
      borderRadius: 15,
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    },
    input: {
      padding: 12,
      marginBottom: 10,
      width: "90%",
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
    },
    createBtn: {
      padding: "10px 20px",
      background: "#e53935",
      border: "none",
      borderRadius: 8,
      color: "#fff",
      cursor: "pointer",
      fontWeight: 600,
    },

    removeBtn: {
        padding: "6px 10px",
        background: "white",
        border: "none",
        borderRadius: 6,
        color: "#fff",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 14,
      },
      
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 20,
      justifyItems: "center",
    },
    eventCard: {
      background: "#fff",
      padding: 15,
      borderRadius: 12,
      boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      width: 250, // compact width for 3 cards per row
    },
    drawBtn: {
      marginTop: 5,
      padding: "6px 10px",
      border: "none",
      borderRadius: 6,
      color: "#fff",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: 12,
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)", // blur/dark overlay
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)", // optional: adds blur effect
      },
      modalContent: {
        background: "#fff",
        padding: 25,
        borderRadius: 15,
        width: "90%",
        maxWidth: 500,
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
      },      
  };
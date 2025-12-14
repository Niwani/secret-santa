import { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";

// Placeholder images array (Christmas themed)
const placeholderImages = [
  "/images/christmas1.jpg",
  "/images/christmas2.jpg",
  "/images/christmas3.jpg",
  "/images/christmas4.jpg"
];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name"); // or "date"

  useEffect(() => {
    const eventsRef = ref(database, "events");

    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const formatted = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
          imageUrl: placeholderImages[Math.floor(Math.random() * placeholderImages.length)]
        }));

        setEvents(formatted);
      }
      setLoading(false);
    });
  }, []);

  // Filter events by search
  const filteredEvents = events.filter((ev) =>
    ev.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sort events
  const sortedEvents = filteredEvents.sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "date") return (b.createdAt || 0) - (a.createdAt || 0);
    return 0;
  });

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p style={{ color: "white", fontSize: 18 }}>Loading events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <p style={{ color: "white", fontSize: 18 }}>No events available yet.</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>🎄 Secret Santa Events</h1>

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={styles.sortSelect}
        >
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Newest</option>
        </select>
      </div>

      <div style={styles.grid}>
        {sortedEvents.map((ev, index) => (
          <Link to={`/event/${ev.id}`} key={ev.id} style={styles.card}>
            <img
              src={ev.imageUrl}
              alt={ev.name}
              style={styles.cardImage}
            />
            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>{ev.name}</h3>
              <p style={styles.participants}>
                Participants: {ev.participants?.length || 0}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "20px",
    background: "linear-gradient(to bottom, #b71c1c, #d32f2f)",
    minHeight: "100vh",
    color: "white"
  },
  pageTitle: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 28,
    fontWeight: "bold"
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: 20
  },
  searchInput: {
    padding: "10px",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    width: "200px"
  },
  sortSelect: {
    padding: "10px",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    background: "#f44336",
    color: "white",
    cursor: "pointer"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px"
  },
  card: {
    background: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    textDecoration: "none",
    color: "white",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s",
  },
  cardImage: {
    width: "100%",
    height: "140px",
    objectFit: "cover"
  },
  cardContent: {
    padding: "10px",
    textAlign: "center"
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold"
  },
  participants: {
    fontSize: 14,
    opacity: 0.8
  },
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};

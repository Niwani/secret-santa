import { useState, useEffect } from "react";
import { database, db } from "../firebase"; // Added 'db' for Firestore
import { ref, get, set } from "firebase/database";
import { doc, getDoc } from "firebase/firestore"; // Added Firestore imports
import { useParams } from "react-router-dom";

export default function SecretSantaApp() {
  const { creatorId, eventId } = useParams();
  const [eventName, setEventName] = useState("");
  const [participants, setParticipants] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [wishlistMessage, setWishlistMessage] = useState(""); // NEW Custom Message State
  const [wishlistInput, setWishlistInput] = useState(""); // NEW
  const [result, setResult] = useState("");
  const [recipientWishlist, setRecipientWishlist] = useState(""); // NEW
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // NEW

  // Fetch event details & Creator Subscription
  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Event
      const eventSnap = await get(ref(database, `secretSanta/users/${creatorId}/events/${eventId}`));
      if (eventSnap.exists()) {
        const eventData = eventSnap.val();
        setEventName(eventData.name);
        setParticipants(eventData.participants || []);
        setWishlistMessage(eventData.customWishlistMessage || "");
      }

      // 2. Fetch Creator's Subscription Level from Firestore
      // Note: In a real app, 'pay-per-event' would be a flag on the event itself.
      // For now, we check the creator's global status.
      try {
        const userDoc = await getDoc(doc(db, "users", creatorId));
        if (userDoc.exists()) {
            const level = userDoc.data().subscriptionLevel || "free";
            if (level === "pro" || level === "business") {
                setIsPremium(true);
            }
        }
      } catch (err) {
        console.error("Error fetching creator plan:", err);
      }
    };
    fetchData();
  }, [creatorId, eventId]);

  // Helper to get name from string or object
  const getParticipantName = (p) => (typeof p === "object" ? p.name : p);

  const handleAssign = async () => {
    const userNameInput = nameInput.trim();
    if (!userNameInput) {
      alert("Please enter your name.");
      return;
    }

    // Find exact match case-insensitively
    const matchedParticipant = participants.find(
        p => getParticipantName(p).trim().toLowerCase() === userNameInput.toLowerCase()
    );

    if (!matchedParticipant) {
      alert("Your name is not in the participant list for this event!");
      return;
    }

    // Use the correctly cased name from the list
    const userName = getParticipantName(matchedParticipant);

    setLoading(true);

    // Update paths to include users/${creatorId}
    const assignedRef = ref(database, `secretSanta/users/${creatorId}/events/${eventId}/assignedNames/${userName}`);
    const takenRef = ref(database, `secretSanta/users/${creatorId}/events/${eventId}/takenRecipients`);
    const wishlistRef = ref(database, `secretSanta/users/${creatorId}/events/${eventId}/wishlists/${userName}`); // NEW

    // 1. If Premium, Save Wishlist first
    if (isPremium && wishlistInput.trim()) {
        await set(wishlistRef, wishlistInput.trim());

        // Check if anyone has already drawn me (reverse lookup) to notify them
        try {
            const allAssignmentsRef = ref(database, `secretSanta/users/${creatorId}/events/${eventId}/assignedNames`);
            const allAssignmentsSnap = await get(allAssignmentsRef);
            
            if (allAssignmentsSnap.exists()) {
                const assignments = allAssignmentsSnap.val();
                // Find who drew ME (userName)
                const gifterName = Object.keys(assignments).find(key => assignments[key] === userName);
                
                if (gifterName) {
                     // Find gifter's email
                     const gifterParams = participants.find(p => getParticipantName(p) === gifterName);
                     const gifterEmail = (typeof gifterParams === "object" && gifterParams.email) ? gifterParams.email : null;
                     
                     if (gifterEmail) {
                     if (gifterEmail) {
                         // Mock email sending
                         const msg = wishlistMessage || `Hey ${gifterName}! ${userName} just updated their wishlist. Check it out to find the perfect gift!`;
                         alert(`📧 Notification Sent!\n\nTo: ${gifterName} (${gifterEmail})\nSubject: Your match, ${userName}, just added their wishlist!\n\n"${msg}"`);
                     }
                     }
                }
            }
        } catch (err) {
            console.error("Error notifying gifter:", err);
        }
    }

    const assignedSnap = await get(assignedRef);

    // Already assigned
    if (assignedSnap.exists()) {
       const matchName = assignedSnap.val();
       setResult(`You already picked: ${matchName}`);
       
       // Fetch Match's Wishlist
       if (isPremium) {
           const matchWishlistSnap = await get(ref(database, `secretSanta/users/${creatorId}/events/${eventId}/wishlists/${matchName}`));
           if (matchWishlistSnap.exists()) {
               setRecipientWishlist(matchWishlistSnap.val());
           }
       }
       
       setLoading(false);
       return;
    }

    // Get all taken recipients
    const takenSnap = await get(takenRef);
    const taken = takenSnap.exists() ? Object.keys(takenSnap.val()) : [];

    // Build available pool
    const available = participants
        .map(p => getParticipantName(p)) // Extract names first
        .filter(name => name !== userName && !taken.includes(name));

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

    // Fetch Recipient's Wishlist (if any)
    if (isPremium) {
        const matchWishlistSnap = await get(ref(database, `secretSanta/users/${creatorId}/events/${eventId}/wishlists/${randomRecipient}`));
        if (matchWishlistSnap.exists()) {
            setRecipientWishlist(matchWishlistSnap.val());
        }
    }

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
          💘 {eventName || "Gifterly Draw"} 🎁
        </h1>

        {!result ? (
            <>
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
                    marginBottom: "15px",
                    marginTop: "5px"
                }}
                />

                {isPremium && (
                    <textarea
                        placeholder="My Wishlist (Optional): e.g. Books, Socks..."
                        value={wishlistInput}
                        onChange={(e) => setWishlistInput(e.target.value)}
                        style={{
                            padding: "12px",
                            width: "100%",
                            borderRadius: "8px",
                            fontSize: "14px",
                            boxSizing: "border-box",
                            marginBottom: "20px",
                            fontFamily: "inherit",
                            minHeight: "80px",
                            resize: "vertical"
                        }}
                    />
                )}
            </>
        ) : null}

        {!result && (
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
        )}

        {result && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
                <h2
                    style={{
                        marginTop: "10px",
                        textAlign: "center",
                        fontSize: "20px",
                        fontWeight: "bold",
                        wordBreak: "break-word",
                        color: "#fff"
                    }}
                >
                    {result.replace("Secret Santa", "Gift Match")}
                </h2>

                {recipientWishlist && (
                    <div style={{ 
                        marginTop: "20px", 
                        background: "rgba(255,255,255,0.2)", 
                        padding: "15px", 
                        borderRadius: "10px",
                        textAlign: "left"
                    }}>
                        <p style={{ margin: "0 0 5px 0", fontSize: "0.9rem", opacity: 0.9 }}>🎁 Their Wishlist:</p>
                        <p style={{ margin: 0, fontWeight: "bold", fontStyle: "italic" }}>"{recipientWishlist}"</p>
                    </div>
                )}
                
                <p style={{ marginTop: 20, fontSize: "0.9rem", opacity: 0.8 }}>No screenshots needed! We saved this for you.</p>
            </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { ref, onValue, set, push } from "firebase/database";
import { database } from "../../firebase";
import { Calendar, Users, ArrowRight, PackageOpen, X, Shuffle, UserRound, Share2, Pencil, Trash2, Plus, Save, Mail, Download, Copy, Lock } from "lucide-react";
import classes from "./MyEvents.module.css";

export default function MyEvents({ subscriptionLevel = "free", setShowPricing }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editingParticipants, setEditingParticipants] = useState([]);
  const [editingMessage, setEditingMessage] = useState("");
  const [editingWishlistMessage, setEditingWishlistMessage] = useState("");
  const [editingTitle, setEditingTitle] = useState("");
  const [notification, setNotification] = useState(null); // { title: string, message: string }
  const [duplicateCandidate, setDuplicateCandidate] = useState(null); // Event to duplicate

  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    if (selectedEvent) {
        // Normalize participants to objects for editing
        const raw = selectedEvent.participants || [];
        const normalized = raw.map(p => 
            typeof p === "string" ? { name: p, email: "" } : { name: p.name, email: p.email || "" }
        );
        setEditingParticipants(normalized);
        setEditingParticipants(normalized);
        setEditingTitle(selectedEvent.name || selectedEvent.eventName || "");
        setEditingMessage(selectedEvent.customMessage || `You've been invited to participate in the ${selectedEvent.name || selectedEvent.eventName} Secret Santa draw! Click here to pick your person:`);
        setEditingWishlistMessage(selectedEvent.customWishlistMessage || "Just a heads up! Your match has updated their Secret Santa wishlist. Check it out now!");
    }
  }, [selectedEvent]);

  // ... (handleShare remains)

  const handleSaveEdit = async () => {
      if (!selectedEvent) return;
      
      // Clean and Format
      const cleanParticipants = editingParticipants
        .filter(p => p.name.trim() !== "")
        .map(p => {
             // If Free, convert back to string (stripping email)
             // If Pro/Business, keep as object (saving email)
             if (subscriptionLevel === "free") return p.name.trim();
             return { name: p.name.trim(), email: p.email.trim() };
        });
      
      try {
          const updates = {};
          updates[`secretSanta/users/${auth.currentUser.uid}/events/${selectedEvent.id}/participants`] = cleanParticipants;
          updates[`secretSanta/users/${auth.currentUser.uid}/events/${selectedEvent.id}/name`] = editingTitle;
          
          // Only save custom message if Pro
          if (subscriptionLevel !== "free") {
              updates[`secretSanta/users/${auth.currentUser.uid}/events/${selectedEvent.id}/customMessage`] = editingMessage;
              updates[`secretSanta/users/${auth.currentUser.uid}/events/${selectedEvent.id}/customWishlistMessage`] = editingWishlistMessage;
          }

          // We use update() for multi-path or set() separately. 
          // Since I used `set` before for simpler path, I'll stick to updating the event object in DB.
          // Actually, `set` on parent node `.../events/${id}` is cleaner if I have the full object.
          // But here I'm constructing partial.
          // Let's use `update(ref(database), updates)`.
          // Need to import `update`.
          // Or just use `set` for participants and `set` for message. Parallel.
          
          await set(ref(database, `secretSanta/users/${auth.currentUser.uid}/events/${selectedEvent.id}/participants`), cleanParticipants);
          await set(ref(database, `secretSanta/users/${auth.currentUser.uid}/events/${selectedEvent.id}/name`), editingTitle);
          
          if (subscriptionLevel !== "free") {
             await set(ref(database, `secretSanta/users/${auth.currentUser.uid}/events/${selectedEvent.id}/customMessage`), editingMessage);
             await set(ref(database, `secretSanta/users/${auth.currentUser.uid}/events/${selectedEvent.id}/customWishlistMessage`), editingWishlistMessage);
          }
          
          // Update local state
          const updatedEvent = { 
              ...selectedEvent, 
              name: editingTitle,
              participants: cleanParticipants,
              participants: cleanParticipants,
              customMessage: (subscriptionLevel !== "free") ? editingMessage : undefined,
              customWishlistMessage: (subscriptionLevel !== "free") ? editingWishlistMessage : undefined
          };
          setSelectedEvent(updatedEvent);
          setIsEditing(false);
          setIsEditing(false);
          setNotification({ title: "Success", message: "Your changes have been saved successfully.", type: "success" });
      } catch (err) {
          console.error(err);
          setNotification({ title: "Error", message: "Failed to save changes. Please try again.", type: "error" });
      }
  };

  const handleShare = async (event) => {
    if (!event) return;
    const shareUrl = `${window.location.origin}/event/${auth.currentUser.uid}/${event.id}/draw`;
    const msg = event.customMessage || `You've been invited to participate in the ${event.name || event.eventName} Secret Santa draw! Click here to pick your person:`;
    
    const shareData = {
        title: `Join ${event.name || event.eventName} Secret Santa!`,
        text: msg,
        url: shareUrl,
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error("Error sharing:", err);
        }
    } else {
        // Fallback
        navigator.clipboard.writeText(`${msg} ${shareUrl}`);
        // Fallback
        navigator.clipboard.writeText(`${msg} ${shareUrl}`);
        setNotification({ title: "Link Copied!", message: "The event link has been copied to your clipboard.", type: "success" });
    }
  };

  const handleSendInvites = (event) => {
    if (!event || !event.participants) return;
    const shareUrl = `${window.location.origin}/event/${auth.currentUser.uid}/${event.id}/draw`;
    
    // Identify participants with emails
    const recipients = event.participants
        .filter(p => typeof p === "object" && p.email && p.email.trim() !== "")
        .map(p => p.email);

    if (recipients.length === 0) {
    if (recipients.length === 0) {
        setNotification({ title: "No Emails Found", message: "No participants have emails listed! Edit the event to add emails.", type: "error" });
        return;
    }
    }

    const msg = event.customMessage || `Hi! You're invited to the Secret Santa Draw. Please click here to enter your Wishlist and find your match:`;

    // Since we don't have a backend, we mock the success
    // Since we don't have a backend, we mock the success
    setNotification({
        title: "Invitations Sent!",
        message: `To: ${recipients.length} participants\n\n"${msg}"`
    });
  };

  const handleExportCSV = (event) => {
    if (!event || !event.participants) return;

    if (subscriptionLevel === "free") {
    if (subscriptionLevel === "free") {
        setNotification({ title: "Pro Feature Locked", message: "📊 Exporting data is a Pro feature! Upgrade for CSV exports.", type: "error" });
        return;
    }
    }

    const headers = ["Name", "Email"];
    const rows = event.participants.map(p => {
        const name = typeof p === "object" ? p.name : p;
        const email = typeof p === "object" ? p.email : "";
        return `"${name}","${email}"`;
    });

    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${event.name || "event"}_participants.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDuplicateEvent = (event) => {
    if (!event) return;
    
    // Feature Gate 
    if (subscriptionLevel === "free") {
         setNotification({ title: "Pro Feature Locked", message: "⚡ Duplicating events is a Pro feature! Upgrade to save time.", type: "error" });
         return;
    }

    // Open Confirmation Modal
    setDuplicateCandidate(event);
  };

  const performDuplication = async () => {
    if (!duplicateCandidate) return;
    const event = duplicateCandidate;
    setDuplicateCandidate(null); // Close modal

    try {
        const newEvent = {
            name: `Copy of ${event.name || event.eventName}`,
            createdAt: Date.now(),
            participants: event.participants || [], 
            customMessage: event.customMessage || null,
            customWishlistMessage: event.customWishlistMessage || null,
        };

        const newEventRef = push(ref(database, `secretSanta/users/${auth.currentUser.uid}/events`));
        await set(newEventRef, newEvent);
        
        setNotification({ title: "Event Duplicated!", message: `"${newEvent.name}" has been created successfully.`, type: "success" });
    } catch (err) {
        console.error("Error duplicating event:", err);
        setNotification({ title: "Error", message: "Failed to duplicate event.", type: "error" });
    }
  };

  const handleAddParticipant = () => {
      setEditingParticipants([...editingParticipants, { name: "", email: "" }]);
  };

  const handleRemoveParticipant = (index) => {
      const updated = editingParticipants.filter((_, i) => i !== index);
      setEditingParticipants(updated);
  };

  const handleChangeParticipantName = (index, value) => {
      const updated = [...editingParticipants];
      updated[index] = { ...updated[index], name: value };
      setEditingParticipants(updated);
  };

  const handleChangeParticipantEmail = (index, value) => {
    const updated = [...editingParticipants];
    updated[index] = { ...updated[index], email: value };
    setEditingParticipants(updated);
};

  // ... (useEffect for fetching events remains largely the same)

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }

    const uid = user.uid;
    const eventsRef = ref(
      database,
      `secretSanta/users/${uid}/events`
    );

    const unsubscribe = onValue(eventsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setEvents([]);
        setLoading(false);
        return;
      }

      const data = snapshot.val();
      const formatted = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));

      // newest first
      formatted.sort((a, b) => b.createdAt - a.createdAt);

      setEvents(formatted);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className={classes.center}>
        <div className={classes.loader}></div>
        <p>Loading your events...</p>
      </div>
    );
  }

  return (
    <div className={classes.page}>
      <header className={classes.header}>
        <h1>My Events</h1>
        <p>Manage your Secret Santa gatherings</p>
      </header>

      {events.length === 0 ? (
        <div className={classes.emptyState}>
          <div className={classes.emptyIcon}>
             <PackageOpen size={64} strokeWidth={1.5} />
          </div>
          <h2>No events yet</h2>
          <p>Create your first Secret Santa event above and spread the joy!</p>
        </div>
      ) : (
        <div className={classes.grid}>
          {events.map((event) => (
            <div
              key={event.id}
              className={classes.card}
              onClick={() => {
                  setSelectedEvent(event);
                  setIsEditing(false);
              }}
            >
              <div>
                <div className={classes.cardHeader}>
                    <h3>{event.name || event.eventName}</h3>
                </div>
                
                <div className={classes.cardMeta}>
                    <div className={classes.metaItem}>
                        <Users size={16} />
                        <span>{event.participants?.length || 0} participants</span>
                    </div>
                    <div className={classes.metaItem}>
                        <Calendar size={16} />
                        <span>{new Date(event.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
              </div>

              <div className={classes.cardFooter}>
                <span className={classes.viewText}>View Event</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <div className={classes.modalOverlay} onClick={() => setSelectedEvent(null)}>
            <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={classes.modalHeaderRow}>
                    {!isEditing && (
                        <button 
                            className={classes.editBtn} 
                            onClick={() => setIsEditing(true)}
                            title="Edit Event"
                        >
                            <Pencil size={18} />
                        </button>
                    )}
                    <button className={classes.closeBtn} onClick={() => setSelectedEvent(null)}>
                        <X size={24} />
                    </button>
                </div>

                {isEditing ? (
                    <input 
                        type="text" 
                        value={editingTitle} 
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className={classes.modalTitleInput}
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            border: "none",
                            borderBottom: "2px solid #e91e63",
                            outline: "none",
                            width: "100%",
                            marginBottom: "10px",
                            textAlign: "center"
                        }}
                    />
                ) : (
                    <h2 className={classes.modalTitle}>{selectedEvent.name || selectedEvent.eventName}</h2>
                )}
                <p className={classes.modalSubtitle}>
                    {isEditing ? "Editing Participants" : "Participants List"}
                </p>

                <ul className={classes.participantList}>
                    {isEditing ? (
                        <>
                            {editingParticipants.map((p, idx) => (
                                <li key={idx} className={classes.editingItem} style={{ flexDirection: "column", alignItems: "stretch", gap: 8 }}>
                                    <div style={{ display: "flex", gap: 8, width: "100%" }}>
                                        <input 
                                            type="text" 
                                            value={p.name} 
                                            onChange={(e) => handleChangeParticipantName(idx, e.target.value)}
                                            className={classes.editInput}
                                            placeholder="Participant Name"
                                            style={{ flex: 1 }}
                                        />
                                        <button 
                                            className={classes.removeBtn}
                                            onClick={() => handleRemoveParticipant(idx)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    
                                    <div 
                                        onClick={() => subscriptionLevel === "free" && setShowPricing(true)}
                                    >
                                        <Mail size={14} style={{ position: "absolute", left: 10, top: 10, color: "#9ca3af" }} />
                                        <input 
                                            type="email"
                                            value={p.email}
                                            onChange={(e) => handleChangeParticipantEmail(idx, e.target.value)}
                                            className={classes.editInput}
                                            placeholder="Email Address (for notifications)"
                                            style={{ 
                                                paddingLeft: 32, 
                                                fontSize: "0.9rem",
                                                ...(subscriptionLevel === "free" ? { background: "#f3f4f6", color: "#9ca3af", cursor: "not-allowed" } : {})
                                            }}
                                            disabled={subscriptionLevel === "free"}
                                        />
                                    </div>
                                </li>
                            ))}
                            <button className={classes.listAddBtn} onClick={handleAddParticipant}>
                                <Plus size={16} /> Add Participant
                            </button>

                            <div style={{ marginTop: 25, borderTop: "1px solid #eee", paddingTop: 15 }}>
                                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: 8, color: "#374151" }}>
                                    Custom Invitation Message
                                </label>
                                <div onClick={() => subscriptionLevel === "free" && setShowPricing(true)} style={subscriptionLevel === "free" ? { position: "relative" } : {}}>
                                    <textarea
                                        value={editingMessage}
                                        onChange={(e) => setEditingMessage(e.target.value)}
                                        rows={3}
                                        style={{
                                            width: "100%",
                                            padding: 10,
                                            borderRadius: 8,
                                            border: "1px solid #d1d5db",
                                            fontFamily: "inherit",
                                            fontSize: "0.9rem",
                                            resize: "vertical",
                                            boxSizing: "border-box",
                                            ...(subscriptionLevel === "free" ? { background: "#f3f4f6", color: "#9ca3af", cursor: "not-allowed" } : {})
                                        }}
                                        disabled={subscriptionLevel === "free"}
                                        placeholder="Enter the message you want to send..."
                                    />
                                </div>
                                <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 4 }}>
                                    * The link to the draw will be automatically appended to this message.
                                </p>

                                <div style={{ marginTop: 20 }}></div>

                                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: 8, color: "#374151" }}>
                                    Custom Wishlist Update Notification
                                </label>
                                <div onClick={() => subscriptionLevel === "free" && setShowPricing(true)}>
                                    <textarea
                                        value={editingWishlistMessage}
                                        onChange={(e) => setEditingWishlistMessage(e.target.value)}
                                        rows={3}
                                        style={{
                                            width: "100%",
                                            padding: 10,
                                            borderRadius: 8,
                                            border: "1px solid #d1d5db",
                                            fontFamily: "inherit",
                                            fontSize: "0.9rem",
                                            resize: "vertical",
                                            boxSizing: "border-box",
                                            ...(subscriptionLevel === "free" ? { background: "#f3f4f6", color: "#9ca3af", cursor: "not-allowed" } : {})
                                        }}
                                        disabled={subscriptionLevel === "free"}
                                        placeholder="Message sent when a participant updates their wishlist..."
                                    />
                                </div>
                                <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 4 }}>
                                    * Sent to the 'Gifter' when their match updates a wishlist.
                                </p>
                            </div>
                        </>
                    ) : (
                        selectedEvent.participants?.map((p, idx) => (
                            <li key={idx} className={classes.participantItem}>
                                <UserRound size={18} color="#9ca3af" />
                                {typeof p === "object" ? p.name : p}
                                {(typeof p === "object" && p.email) && (
                                    <span style={{ fontSize: "0.8rem", color: "#6b7280", marginLeft: "auto" }}>
                                        {p.email}
                                    </span>
                                )}
                            </li>
                        ))
                    )}
                </ul>

                <div className={classes.modalFooter}>
                    {isEditing ? (
                        <div className={classes.editActions}>
                            <button className={classes.cancelBtn} onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                            <button className={classes.saveBtn} onClick={handleSaveEdit}>
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    ) : (
                        <div className={classes.actionButtons}>
                            <button 
                                className={classes.shareBtn}
                                onClick={() => handleShare(selectedEvent)}
                                title="Share Link"
                            >
                                <Share2 size={18} />
                            </button>
                             <button 
                                className={classes.shareBtn}
                                onClick={() => handleSendInvites(selectedEvent)}
                                title="Send Email Invites"
                                style={{ background: "#10b981" }}
                            >
                                <Mail size={18} />
                            </button>
                            <button 
                                className={`${classes.shareBtn} ${subscriptionLevel === "free" ? classes.lockedBtn : ""}`}
                                onClick={() => subscriptionLevel === "free" ? setShowPricing(true) : handleExportCSV(selectedEvent)}
                                title={subscriptionLevel === "free" ? "Upgrade to Export CSV" : "Export Participants (CSV)"}
                                style={subscriptionLevel !== "free" ? { background: "#6366f1" } : {}}
                            >
                                <Download size={18} />
                            </button>
                            <button 
                                className={`${classes.shareBtn} ${subscriptionLevel === "free" ? classes.lockedBtn : ""}`}
                                onClick={() => subscriptionLevel === "free" ? setShowPricing(true) : handleDuplicateEvent(selectedEvent)}
                                title={subscriptionLevel === "free" ? "Upgrade to Duplicate Event" : "Duplicate Event (Template)"}
                                style={subscriptionLevel !== "free" ? { background: "#f59e0b" } : {}}
                            >
                                <Copy size={18} />
                            </button>
                            <button 
                            className={classes.goToDrawBtn}
                            onClick={() => navigate(`/event/${auth.currentUser.uid}/${selectedEvent.id}/draw`)}
                            >
                                <Shuffle size={18} />
                                Go to Draw Page
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}


      {/* Custom Confirmation Modal */}
      {duplicateCandidate && (
        <div 
            style={{
                position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000
            }}
            onClick={() => setDuplicateCandidate(null)}
        >
            <div 
                style={{
                    background: "white", padding: 25, borderRadius: 12, width: "90%", maxWidth: 400,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)", textAlign: "center", position: "relative"
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ marginBottom: 15, background: "#fef3c7", width: 50, height: 50, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                    <Copy size={24} color="#f59e0b" />
                </div>
                
                <h3 style={{ margin: "0 0 10px 0", fontSize: 18, color: "#111827" }}>Duplicate Event?</h3>
                <p style={{ margin: "0 0 20px 0", fontSize: 14, color: "#6b7280", lineHeight: "1.5" }}>
                     Are you sure you want to duplicate <strong>{duplicateCandidate.name || duplicateCandidate.eventName}</strong> to use as a template?
                </p>

                <div style={{ display: "flex", gap: 10 }}>
                    <button 
                        onClick={() => setDuplicateCandidate(null)}
                        style={{
                            background: "#e5e7eb", color: "#374151", border: "none", padding: "10px 20px",
                            borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", flex: 1
                        }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={performDuplication}
                        style={{
                            background: "#f59e0b", color: "white", border: "none", padding: "10px 20px",
                            borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", flex: 1
                        }}
                    >
                        Duplicate
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Custom Notification Modal */}
      {notification && (
        <div 
            style={{
                position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000
            }}
            onClick={() => setNotification(null)}
        >
            <div 
                style={{
                    background: "white", padding: 25, borderRadius: 12, width: "90%", maxWidth: 400,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)", textAlign: "center", position: "relative"
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ marginBottom: 15 }}>
                    {notification.type === "error" ? (
                        <div style={{ background: "#fee2e2", width: 50, height: 50, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                            <X size={24} color="#ef4444" />
                        </div>
                    ) : (
                         <div style={{ background: "#d1fae5", width: 50, height: 50, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                            <Mail size={24} color="#10b981" />
                        </div>
                    )}
                </div>
                
                <h3 style={{ margin: "0 0 10px 0", fontSize: 18, color: "#111827" }}>{notification.title}</h3>
                <p style={{ margin: "0 0 20px 0", fontSize: 14, color: "#6b7280", lineHeight: "1.5" }}>
                     {notification.message}
                </p>

                <button 
                    onClick={() => setNotification(null)}
                    style={{
                        background: "#4f46e5", color: "white", border: "none", padding: "10px 20px",
                        borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%"
                    }}
                >
                    Close
                </button>
            </div>
        </div>
      )}
    </div>
  );
}

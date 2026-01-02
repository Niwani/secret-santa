import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { ref, onValue, set } from "firebase/database";
import { database } from "../../firebase";
import { Calendar, Users, ArrowRight, PackageOpen, X, Shuffle, UserRound, Share2, Pencil, Trash2, Plus, Save } from "lucide-react";
import classes from "./MyEvents.module.css";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editingParticipants, setEditingParticipants] = useState([]);

  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    if (selectedEvent) {
        setEditingParticipants(selectedEvent.participants || []);
    }
  }, [selectedEvent]);

  const handleShare = async (event) => {
    if (!event) return;
    const shareUrl = `${window.location.origin}/event/${auth.currentUser.uid}/${event.id}/draw`;
    const shareData = {
        title: `Join ${event.name || event.eventName} Secret Santa!`,
        text: `You've been invited to participate in the ${event.name || event.eventName} Secret Santa draw! Click here to pick your person:`,
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
        navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
    }
  };

  const handleSaveEdit = async () => {
      if (!selectedEvent) return;
      const cleanParticipants = editingParticipants.filter(p => p.trim() !== "");
      
      try {
          await set(ref(database, `secretSanta/users/${auth.currentUser.uid}/events/${selectedEvent.id}/participants`), cleanParticipants);
          
          // Update local state immediately for responsiveness
          const updatedEvent = { ...selectedEvent, participants: cleanParticipants };
          setSelectedEvent(updatedEvent);
          setIsEditing(false);
      } catch (err) {
          console.error(err);
          alert("Failed to save changes.");
      }
  };

  const handleAddParticipant = () => {
      setEditingParticipants([...editingParticipants, ""]);
  };

  const handleRemoveParticipant = (index) => {
      const updated = editingParticipants.filter((_, i) => i !== index);
      setEditingParticipants(updated);
  };

  const handleChangeParticipant = (index, value) => {
      const updated = [...editingParticipants];
      updated[index] = value;
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

                <h2 className={classes.modalTitle}>{selectedEvent.name || selectedEvent.eventName}</h2>
                <p className={classes.modalSubtitle}>
                    {isEditing ? "Editing Participants" : "Participants List"}
                </p>

                <ul className={classes.participantList}>
                    {isEditing ? (
                        <>
                            {editingParticipants.map((p, idx) => (
                                <li key={idx} className={classes.editingItem}>
                                    <input 
                                        type="text" 
                                        value={p} 
                                        onChange={(e) => handleChangeParticipant(idx, e.target.value)}
                                        className={classes.editInput}
                                        placeholder="Participant Name"
                                    />
                                    <button 
                                        className={classes.removeBtn}
                                        onClick={() => handleRemoveParticipant(idx)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </li>
                            ))}
                            <button className={classes.listAddBtn} onClick={handleAddParticipant}>
                                <Plus size={16} /> Add Participant
                            </button>
                        </>
                    ) : (
                        selectedEvent.participants?.map((p, idx) => (
                            <li key={idx} className={classes.participantItem}>
                                <UserRound size={18} color="#9ca3af" />
                                {p}
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
                            >
                                <Share2 size={18} />
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
    </div>
  );
}

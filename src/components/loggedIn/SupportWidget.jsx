import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, Lock } from "lucide-react";
import { getAuth } from "firebase/auth";
import { ref, push, onValue, serverTimestamp } from "firebase/database";
import { database } from "../../firebase";

export default function SupportWidget({ subscriptionLevel = "free", setShowPricing }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  
  const auth = getAuth();
  const user = auth.currentUser;
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const chatRef = ref(database, `support_chats/${user.uid}/messages`);
    
    // Subscribe to messages
    const unsubscribe = onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const list = Object.values(data).sort((a,b) => a.timestamp - b.timestamp);
            setMessages(list);
        } else {
            // Initial Welcome Message if empty
            if (messages.length === 0) {
                 setMessages([{
                     text: "Hi there! 👋 \nHow can we help you with your Secret Santa event today?",
                     sender: "admin",
                     timestamp: Date.now()
                 }]);
            }
        }
    });
    return () => unsubscribe();
  }, [user]);

  // Auto-scroll to bottom
  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const toggleOpen = () => {
    if (subscriptionLevel === "free") {
        setShowPricing(true);
        return;
    }
    setIsOpen(!isOpen);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !user) return;
    
    setLoading(true);
    try {
        const chatRef = ref(database, `support_chats/${user.uid}/messages`);
        await push(chatRef, {
            text: message,
            sender: "user",
            timestamp: serverTimestamp(), // Use server timestamp
            userEmail: user.email, // Denormalize for easy admin reading
            userName: user.displayName || "User"
        });
        setMessage("");
        setHasSent(true);
        // We don't need to manually add to state, onValue will trigger
    } catch (err) {
        console.error("Error sending message:", err);
    } finally {
        setLoading(false);
    }
  };

  const isPro = subscriptionLevel === "business"; // Maybe prioritize Business?

  return (
    <div style={styles.wrapper}>
      {/* Chat Window */}
      {isOpen && (
        <div style={styles.chatWindow}>
            <div style={styles.header}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={styles.avatar}>
                        <User size={16} />
                    </div>
                    <div>
                        <h4 style={styles.headerTitle}>Gifterly Support</h4>
                        <span style={styles.status}>
                            <span style={styles.dot}></span> We typically reply in 5m
                        </span>
                    </div>
                </div>
                <button onClick={toggleOpen} style={styles.closeBtn}>
                    <X size={18} />
                </button>
            </div>

            <div style={styles.body}>
                {messages.map((msg, idx) => (
                    <div 
                        key={idx} 
                        style={msg.sender === "admin" ? styles.botMessage : styles.userMessage}
                    >
                        {msg.text.split("\n").map((line, i) => (
                            <span key={i}>{line}<br/></span>
                        ))}
                         <span style={{ fontSize: "0.65rem", display: "block", marginTop: 4, opacity: 0.7, textAlign: "right" }}>
                            {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                <div ref={chatEndRef}></div>
            </div>

            <div style={styles.footer}>
                <form onSubmit={handleSend} style={styles.inputGroup}>
                    <input 
                        style={styles.input}
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={loading}
                    />
                    <button 
                        type="submit" 
                        style={{ ...styles.sendBtn, opacity: message.trim() ? 1 : 0.5 }}
                        disabled={!message.trim() || loading}
                    >
                        {loading ? "..." : <Send size={16} />}
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={toggleOpen}
        style={{
            ...styles.fab,
            transform: isOpen ? "scale(0.9)" : "scale(1)",
            background: subscriptionLevel === "free" ? "#9ca3af" : "linear-gradient(135deg, #db2777 0%, #be185d 100%)",
        }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {(!isOpen && subscriptionLevel !== "free") && <span style={styles.badge}>1</span>}
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "15px",
  },
  fab: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #db2777 0%, #be185d 100%)", // Brand Pink
    color: "white",
    border: "none",
    boxShadow: "0 4px 15px rgba(219, 39, 119, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: "-2px",
    right: "-2px",
    background: "#ef4444",
    color: "white",
    fontSize: "0.75rem",
    fontWeight: "bold",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "2px solid white",
  },
  chatWindow: {
    width: "350px",
    height: "450px",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    animation: "slideUp 0.3s ease-out",
    border: "1px solid #f3f4f6",
  },
  header: {
    padding: "16px",
    background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 600,
  },
  status: {
    fontSize: "0.75rem",
    opacity: 0.8,
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  dot: {
    width: "6px",
    height: "6px",
    background: "#10b981",
    borderRadius: "50%",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    opacity: 0.7,
  },
  body: {
    flex: 1,
    padding: "20px",
    background: "#f9fafb",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    overflowY: "auto",
  },
  botMessage: {
    alignSelf: "flex-start",
    background: "white",
    padding: "12px 16px",
    borderRadius: "12px 12px 12px 0",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    fontSize: "0.9rem",
    color: "#374151",
    lineHeight: "1.4",
  },
  userMessage: {
    alignSelf: "flex-end",
    background: "#db2777",
    color: "white",
    padding: "12px 16px",
    borderRadius: "12px 12px 0 12px",
    boxShadow: "0 2px 5px rgba(219, 39, 119, 0.2)",
    fontSize: "0.9rem",
    lineHeight: "1.4",
    maxWidth: "80%",
  },
  footer: {
    padding: "16px",
    background: "white",
    borderTop: "1px solid #f3f4f6",
  },
  inputGroup: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "20px",
    border: "1px solid #e5e7eb",
    fontSize: "0.9rem",
    outline: "none",
  },
  sendBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#db2777",
    color: "white",
    border: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  sentState: {
    textAlign: "center",
  },
  newChatBtn: {
    marginTop: "8px",
    background: "none",
    border: "none",
    color: "#6b7280",
    textDecoration: "underline",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
};

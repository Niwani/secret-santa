import React, { useState, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import { ref, onValue, push, serverTimestamp } from "firebase/database";
import { database } from "../firebase";
import { Send, User, ArrowLeft, RefreshCw, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sendNotification } from "../utils/notificationUtils";

export default function AdminSupportPage() {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [reply, setReply] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Fetch all chats
  useEffect(() => {
    const chatsRef = ref(database, "support_chats");
    const unsubscribe = onValue(chatsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Transform data: { uid: { messages: {...} } } -> array
            const list = Object.entries(data).map(([uid, content]) => {
                const msgs = content.messages ? Object.values(content.messages) : [];
                // Sort messages to get latest info
                msgs.sort((a,b) => (a.timestamp || 0) - (b.timestamp || 0));
                const lastMsg = msgs[msgs.length - 1];
                
                return {
                    uid,
                    messages: msgs,
                    lastMessage: lastMsg,
                    userEmail: lastMsg?.userEmail || "Unknown",
                    userName: lastMsg?.userName || "User"
                };
            });

            // Sort by latest activity
            list.sort((a, b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0));
            setChats(list);
        } else {
            setChats([]);
        }
    });

    return () => unsubscribe();
  }, []);

  // Scroll on selection or new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChatId, chats]);

  const handleSendReply = async (e) => {
      e.preventDefault();
      if (!selectedChatId || !reply.trim()) return;

      try {
          const chatRef = ref(database, `support_chats/${selectedChatId}/messages`);
          await push(chatRef, {
              text: reply,
              sender: "admin",
              timestamp: serverTimestamp(),
              userName: "Support Team" 
          });
          setReply("");
          
          // Send notification to user
          await sendNotification(
              selectedChatId, 
              "New Support Message", 
              "You received a reply from the Gifterly Support Team.", 
              "sucsess"
          );
      } catch (err) {
          console.error(err);
          alert("Failed to send reply");
      }
  };

  const activeChat = chats.find(c => c.uid === selectedChatId);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f3f4f6" }}>
        {/* Sidebar */}
        <div style={{ width: "300px", background: "white", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: 20, borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <ArrowLeft size={20} />
                </button>
                <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Support Inbox</h2>
            </div>
            
            <div style={{ flex: 1, overflowY: "auto" }}>
                {chats.map(chat => (
                    <div 
                        key={chat.uid}
                        onClick={() => setSelectedChatId(chat.uid)}
                        style={{
                            padding: "15px 20px",
                            borderBottom: "1px solid #f3f4f6",
                            cursor: "pointer",
                            background: selectedChatId === chat.uid ? "#f0f9ff" : "white",
                            borderLeft: selectedChatId === chat.uid ? "4px solid #0284c7" : "4px solid transparent"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{chat.userName}</span>
                            <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                                {chat.lastMessage?.timestamp ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                            </span>
                        </div>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {chat.lastMessage?.sender === "admin" ? "You: " : ""}{chat.lastMessage?.text || "No messages"}
                        </p>
                    </div>
                ))}
                {chats.length === 0 && (
                    <div style={{ padding: 20, textAlign: "center", color: "#9ca3af" }}>No active chats</div>
                )}
            </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {selectedChatId ? (
                <>
                    <div style={{ padding: "15px 30px", background: "white", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 15 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <User size={20} color="#6366f1" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>{activeChat?.userName}</h3>
                            <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>{activeChat?.userEmail}</span>
                        </div>
                    </div>

                    <div style={{ flex: 1, padding: 30, overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
                        {activeChat?.messages.map((msg, idx) => (
                            <div 
                                key={idx} 
                                style={{ 
                                    alignSelf: msg.sender === "admin" ? "flex-end" : "flex-start",
                                    maxWidth: "60%",
                                    background: msg.sender === "admin" ? "#6366f1" : "white",
                                    color: msg.sender === "admin" ? "white" : "#1f2937",
                                    padding: "15px 20px",
                                    borderRadius: msg.sender === "admin" ? "20px 20px 0 20px" : "20px 20px 20px 0",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                                }}
                            >
                                <p style={{ margin: 0, lineHeight: 1.5 }}>
                                    {msg.text.split("\n").map((line, i) => <span key={i}>{line}<br/></span>)}
                                </p>
                                <span style={{ fontSize: "0.75rem", opacity: 0.7, display: "block", marginTop: 5, textAlign: "right" }}>
                                    {new Date(msg.timestamp).toLocaleString()}
                                </span>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div style={{ padding: 20, background: "white", borderTop: "1px solid #e5e7eb" }}>
                        <form onSubmit={handleSendReply} style={{ display: "flex", gap: 15 }}>
                            <input 
                                style={{ 
                                    flex: 1, padding: "15px", borderRadius: 12, border: "1px solid #e5e7eb", 
                                    fontSize: "1rem", outline: "none", background: "#f9fafb" 
                                }}
                                placeholder="Type your reply..."
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                            />
                            <button 
                                type="submit" 
                                style={{ 
                                    background: "#6366f1", color: "white", border: "none", padding: "0 25px", 
                                    borderRadius: 12, fontWeight: 600, cursor: "pointer",
                                    opacity: reply.trim() ? 1 : 0.5
                                }}
                                disabled={!reply.trim()}
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </>
            ) : (
                <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", color: "#9ca3af", flexDirection: "column", gap: 20 }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <MessageCircle size={40} color="#9ca3af" />
                    </div>
                    <p style={{ fontSize: "1.2rem" }}>Select a conversation to start replying</p>
                </div>
            )}
        </div>
    </div>
  );
}

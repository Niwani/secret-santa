import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2, Info } from "lucide-react";
import { getAuth } from "firebase/auth";
import { ref, onValue, update, remove } from "firebase/database";
import { database } from "../../firebase";
import styles from "./NavBar.module.css"; // Reuse navbar styles for consistency? Or creating new.

// Inline styles for speed and isolation
const bellStyles = {
    wrapper: { position: "relative" },
    btn: { 
        background: "none", 
        border: "none", 
        cursor: "pointer", 
        padding: 8, 
        color: "#6b7280",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        transition: "background 0.2s"
    },
    badge: {
        position: "absolute",
        top: 2,
        right: 2,
        background: "#ef4444",
        color: "white",
        fontSize: "0.65rem",
        fontWeight: "bold",
        width: 16,
        height: 16,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid white"
    },
    dropdown: {
        position: "absolute",
        top: "120%",
        right: -50, // Shift right slightly or 0
        width: 320,
        background: "white",
        borderRadius: 16,
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        border: "1px solid #f3f4f6",
        padding: 0,
        zIndex: 1000,
        overflow: "hidden",
        animation: "fadeSlide 0.2s ease-out"
    },
    header: {
        padding: "15px 20px",
        borderBottom: "1px solid #f3f4f6",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    title: { fontWeight: 700, fontSize: "0.95rem", color: "#1f2937" },
    markRead: { color: "#db2777", fontSize: "0.8rem", cursor: "pointer", border: "none", background: "none" },
    list: { maxHeight: 400, overflowY: "auto" },
    item: {
        padding: "15px 20px",
        borderBottom: "1px solid #f9fafb",
        display: "flex",
        gap: 12,
        transition: "background 0.1s",
        position: "relative"
    },
    unreadDot: {
        width: 8, height: 8, background: "#db2777", borderRadius: "50%", marginTop: 6, flexShrink: 0
    },
    content: { flex: 1 },
    itemTitle: { fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: 2 },
    itemMsg: { fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.4 },
    itemDate: { fontSize: "0.7rem", color: "#9ca3af", marginTop: 4 },
    empty: { padding: 40, textAlign: "center", color: "#9ca3af", fontSize: "0.9rem" }
};

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]); // Array of objects
    const [open, setOpen] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const notifRef = ref(database, `secretSanta/users/${user.uid}/notifications`);
        
        const unsubscribe = onValue(notifRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list = Object.entries(data).map(([id, val]) => ({
                    id,
                    ...val
                }));
                // Sort by date desc
                list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setNotifications(list);
            } else {
                setNotifications([]);
            }
        });

        // Close dropdown when clicking outside (simple hack or use listener)
        const handleClickOutside = (e) => {
            if (!e.target.closest("#notif-bell-container")) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            unsubscribe();
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAllRead = async () => {
        const updates = {};
        notifications.forEach(n => {
            if (!n.read) {
                updates[`secretSanta/users/${auth.currentUser.uid}/notifications/${n.id}/read`] = true;
            }
        });
        if (Object.keys(updates).length > 0) {
            await update(ref(database), updates);
        }
    };

    const handleItemClick = async (notif) => {
        if (!notif.read) {
            await update(ref(database), {
                [`secretSanta/users/${auth.currentUser.uid}/notifications/${notif.id}/read`]: true
            });
        }
        // Navigate if link exists (future)
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        await remove(ref(database, `secretSanta/users/${auth.currentUser.uid}/notifications/${id}`));
    };

    return (
        <div id="notif-bell-container" style={bellStyles.wrapper}>
            <button 
                style={bellStyles.btn} 
                onClick={() => setOpen(!open)}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span style={bellStyles.badge}>
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div style={bellStyles.dropdown}>
                    <div style={bellStyles.header}>
                        <span style={bellStyles.title}>Notifications</span>
                        {unreadCount > 0 && (
                            <button style={bellStyles.markRead} onClick={handleMarkAllRead}>
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div style={bellStyles.list}>
                        {notifications.length === 0 ? (
                            <div style={bellStyles.empty}>
                                <div style={{background: "#f3f4f6", width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px auto"}}>
                                    <Bell size={20} color="#9ca3af" />
                                </div>
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div 
                                    key={notif.id} 
                                    style={{
                                        ...bellStyles.item,
                                        background: notif.read ? "white" : "#fff1f2"
                                    }}
                                    onClick={() => handleItemClick(notif)}
                                >
                                    {!notif.read && <div style={bellStyles.unreadDot}></div>}
                                    <div style={bellStyles.content}>
                                        <div style={bellStyles.itemTitle}>{notif.title}</div>
                                        <div style={bellStyles.itemMsg}>{notif.message}</div>
                                        <div style={bellStyles.itemDate}>
                                            {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : ""}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => handleDelete(e, notif.id)}
                                        style={{background: "none", border: "none", cursor: "pointer", color: "#d1d5db"}}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

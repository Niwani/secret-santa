import { ref, push } from "firebase/database";
import { database } from "../firebase";

/**
 * Sends a notification to a specific user.
 * @param {string} userId - The UID of the recipient.
 * @param {string} title - The title of the notification.
 * @param {string} message - The body text.
 * @param {string} type - Optional type (e.g., 'info', 'success', 'warning').
 */
export const sendNotification = async (userId, title, message, type = "info") => {
    if (!userId) return;

    try {
        const notifRef = ref(database, `secretSanta/users/${userId}/notifications`);
        await push(notifRef, {
            title,
            message,
            type,
            read: false,
            createdAt: new Date().toISOString()
        });
    } catch (error) {
        console.error("Failed to send notification:", error);
    }
};

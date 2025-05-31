import { useState, useCallback } from "react";
import { sendMessage } from "../services/chatService";

export const useSendMessages = (chatRoomId, callback) => {
  const [loading, setLoading] = useState(false);

  const handleSend = useCallback(
    async (message) => {
      if (!chatRoomId || !message.trim()) {
        console.log("Cannot send message: no room or empty message");
        return;
      }
      setLoading(true);
      try {
        const response = await sendMessage(chatRoomId, message);
        console.log("Message sent:", response.data);
        if (callback) {
          callback(response.data);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setLoading(false);
      }
    },
    [chatRoomId, callback]
  );

  return { handleSend, loading };
};
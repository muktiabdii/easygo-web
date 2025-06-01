import { useState, useCallback } from "react";
import { sendMessage } from "../services/chatService";

export const useSendMessages = (chatRoomId, callback, updateMessages) => {
  const [loading, setLoading] = useState(false);

  const handleSend = useCallback(
    async (roomId, message) => {
      if (!roomId || !message?.trim()) {
        console.log("Cannot send message: no room or empty message", {
          roomId,
          message,
        });
        throw new Error("Invalid room ID or empty message");
      }
      setLoading(true);
      try {
        console.log("Sending message to backend:", { roomId, message });
        const response = await sendMessage(roomId, message);
        console.log("Backend response:", response.data);
        if (callback) {
          callback(response.data);
        }
        if (updateMessages && response.data) {
          const {
            id,
            sender_id,
            message: msg,
            created_at,
            time,
          } = response.data;
          console.log("Updating messages state with:", {
            id,
            sender_id,
            message: msg,
            created_at,
            time,
          });
          updateMessages({ id, sender_id, message: msg, created_at, time });
        }
        return response.data;
      } catch (error) {
        console.error("Error sending message:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [chatRoomId, callback, updateMessages]
  );

  return { handleSend, loading };
};

import { useState } from "react";
import { createChatRoom } from "../services/chatService";

export const useCreateRoom = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createRoom = async (userId, callback) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createChatRoom(userId);
      console.log("Room created:", response.data);
      if (callback) {
        callback(response.data);
      }
      return response.data;
    } catch (err) {
      console.error("Error creating room:", err);
      setError(err.message || "Failed to create room");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createRoom, loading, error };
};
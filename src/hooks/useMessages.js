import { useState, useEffect, useCallback, useMemo } from "react";
import { getMessages } from "../services/chatService";
import { usePusher } from "./usePusher";
import { useCurrentUser } from "./useCurrentUser";
import { format, isToday, isYesterday } from "date-fns";
import id from "date-fns/locale/id";

export const useMessages = (chatRoomId) => {
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const cache = useMemo(() => new Map(), []);
  const { user } = useCurrentUser();

  const fetchMessages = useCallback(
    async (forceRefresh = false) => {
      if (!chatRoomId) {
        setMessages({});
        setLoading(false);
        return;
      }

      if (!forceRefresh && cache.has(chatRoomId)) {
        console.log("Using cached messages for room:", chatRoomId);
        setMessages(cache.get(chatRoomId));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching messages for room:", chatRoomId);
        const res = await getMessages(chatRoomId);
        if (!res.data || typeof res.data !== "object") {
          console.error("Invalid messages format:", res.data);
          setMessages({});
          return;
        }
        console.log("Messages fetched:", res.data);
        cache.set(chatRoomId, res.data);
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setMessages({});
      } finally {
        setLoading(false);
      }
    },
    [chatRoomId, cache]
  );

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const updateMessages = useCallback(
    (newMsg) => {
      setMessages((prev) => {
        if (!newMsg.created_at) {
          console.warn("Missing created_at in new message:", newMsg);
          return prev;
        }
        const date = new Date(newMsg.created_at);
        if (isNaN(date)) {
          console.warn("Invalid created_at in new message:", newMsg.created_at);
          return prev;
        }

        // Tentukan kunci grup berdasarkan created_at
        let dateKey;
        if (isToday(date)) {
          dateKey = "Hari Ini";
        } else if (isYesterday(date)) {
          dateKey = "Kemarin";
        } else {
          dateKey = format(date, "iiii, d MMMM yyyy", { locale: id }); // Misal: Jumat, 16 Mei 2025
        }

        const dateMessages = prev[dateKey] || [];
        if (dateMessages.some((msg) => msg.id === newMsg.id)) {
          console.log("Duplicate message detected:", newMsg.id);
          return prev;
        }

        const updatedMessages = {
          ...prev,
          [dateKey]: [...dateMessages, newMsg],
        };
        console.log("Updating cache with new message:", newMsg);
        cache.set(chatRoomId, updatedMessages);
        return updatedMessages;
      });
    },
    [chatRoomId, cache]
  );

  usePusher(
    chatRoomId ? `chat-room-message.${chatRoomId}` : null,
    "new-message",
    (data) => {
      if (!chatRoomId) {
        console.log("No chat room selected, ignoring Pusher event");
        return;
      }
      console.log("Received Pusher event data:", data);
      if (data?.message && data.message.sender_id !== user?.userId) {
        console.log("Processing new message from Pusher:", data.message);
        const { id, sender_id, message, created_at } = data.message;
        const date = new Date(created_at);
        if (isNaN(date)) {
          console.warn("Invalid created_at in Pusher message:", created_at);
          return;
        }
        const time = format(date, "HH:mm", { locale: id });
        const newMsg = { id, sender_id, message, created_at, time };
        updateMessages(newMsg);
      } else {
        console.log("Ignoring Pusher event: Invalid data or own message", data);
      }
    },
    [chatRoomId, user?.userId, updateMessages]
  );

  return { messages, loading, refetch: fetchMessages, updateMessages };
};
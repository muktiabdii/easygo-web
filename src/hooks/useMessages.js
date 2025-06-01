import { useState, useEffect, useCallback, useMemo } from "react";
import { getMessages } from "../services/chatService";
import { usePusher } from "./usePusher";
import { useCurrentUser } from "./useCurrentUser";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import id from "date-fns/locale/id";

export const useMessages = (chatRoomId) => {
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cache = useMemo(() => new Map(), []);
  const { user } = useCurrentUser();

  const fetchMessages = useCallback(
    async (forceRefresh = false) => {
      if (!chatRoomId) {
        console.log("No chatRoomId, clearing messages");
        setMessages({});
        setLoading(false);
        setError(null);
        return;
      }

      if (!forceRefresh && cache.has(chatRoomId)) {
        console.log("Using cached messages for room:", chatRoomId);
        setMessages(cache.get(chatRoomId));
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching messages for room:", chatRoomId);
        const res = await getMessages(chatRoomId);
        if (!res.data || typeof res.data !== "object") {
          console.error("Invalid messages format:", res.data);
          setMessages({});
          setError("Invalid messages format");
          return;
        }
        console.log("Messages fetched:", JSON.stringify(res.data, null, 2));
        cache.set(chatRoomId, res.data);
        setMessages(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError(err.response?.data?.error || "Failed to load messages");
        setMessages({});
      } finally {
        setLoading(false);
      }
    },
    [chatRoomId, cache]
  );

  const updateMessages = useCallback(
    (newMsg) => {
      console.log(
        "Attempting to update messages with:",
        JSON.stringify(newMsg, null, 2)
      );
      if (!newMsg?.id || !newMsg?.created_at || !newMsg?.chat_room_id) {
        console.warn("Invalid message data:", newMsg);
        return;
      }
      if (newMsg.chat_room_id != chatRoomId) {
        console.log("Message for different chat room:", {
          received: newMsg.chat_room_id,
          expected: chatRoomId,
        });
        return;
      }
      setMessages((prev) => {
        const date = parseISO(newMsg.created_at);
        if (isNaN(date)) {
          console.warn("Invalid created_at:", newMsg.created_at);
          return prev;
        }

        let dateKey;
        if (isToday(date)) {
          dateKey = "Hari Ini";
        } else if (isYesterday(date)) {
          dateKey = "Kemarin";
        } else {
          dateKey = format(date, "iiii, d MMMM yyyy", { locale: id });
        }

        const dateMessages = Array.isArray(prev[dateKey])
          ? [...prev[dateKey]]
          : [];
        if (dateMessages.some((msg) => msg.id === newMsg.id)) {
          console.log("Duplicate message detected:", newMsg.id);
          return prev;
        }

        const updatedMessages = {
          ...prev,
          [dateKey]: [...dateMessages, newMsg],
        };
        console.log(
          "Updated messages state:",
          JSON.stringify(updatedMessages, null, 2)
        );
        cache.set(chatRoomId, updatedMessages);

        // Optimize: Return prev if no changes to prevent re-renders
        if (JSON.stringify(prev) === JSON.stringify(updatedMessages)) {
          console.log("No changes in messages state, skipping update");
          return prev;
        }
        return updatedMessages;
      });
    },
    [chatRoomId, cache]
  );

  usePusher(
    chatRoomId ? `chat-room-message.${chatRoomId}` : null,
    "new-message",
    (data) => {
      console.log("Pusher data received:", JSON.stringify(data, null, 2));
      if (!chatRoomId) {
        console.log("No chat room selected, ignoring Pusher event");
        return;
      }
      if (data?.message) {
        console.log(
          "Processing new message from Pusher:",
          JSON.stringify(data.message, null, 2)
        );
        const { id, sender_id, message, created_at, time, chat_room_id } =
          data.message;
        const date = new Date(created_at);
        if (isNaN(date)) {
          console.warn("Invalid created_at:", created_at);
          return;
        }
        const formattedTime = time || format(date, "HH:mm", { locale: id });
        const newMsg = {
          id,
          sender_id,
          message,
          created_at,
          time: formattedTime,
          chat_room_id,
        };
        updateMessages(newMsg);
      } else {
        console.warn("Invalid Pusher data:", data);
      }
    },
    [chatRoomId, updateMessages]
  );

  useEffect(() => {
    console.log("useMessages setup:", {
      chatRoomId,
      channel: chatRoomId ? `chat-room-message.${chatRoomId}` : null,
    });
    fetchMessages();
  }, [fetchMessages]);

  return { messages, loading, error, refetch: fetchMessages, updateMessages };
};

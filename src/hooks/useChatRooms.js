import { useState, useEffect, useCallback } from "react";
import { getChatRooms } from "../services/chatService";
import { getPusherInstance } from "../utils/pusher";

export const useChatRooms = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateChatRoom = useCallback((newMessage) => {
    setChatRooms((prevRooms) => {
      const updatedRooms = prevRooms.map((room) => {
        if (room.chat_room_id === newMessage.chat_room_id) {
          return {
            ...room,
            last_message: {
              message: newMessage.message,
              created_at: newMessage.created_at,
              sender_id: newMessage.sender_id,
            },
          };
        }
        return room;
      });

      // Sort by latest created_at
      return updatedRooms.sort((a, b) => {
        const dateA = a.last_message?.created_at
          ? new Date(a.last_message.created_at)
          : new Date(0);
        const dateB = b.last_message?.created_at
          ? new Date(b.last_message.created_at)
          : new Date(0);
        return dateB - dateA; // Latest first
      });
    });
  }, []);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        setLoading(true);
        const res = await getChatRooms();
        // Validate and filter rooms
        const validRooms = res.data.filter((room) => {
          if (!room.chat_room_id) {
            console.warn("Invalid room detected:", room);
            return false;
          }
          return true;
        });
        setChatRooms(
          validRooms.sort((a, b) => {
            const dateA = a.last_message?.created_at
              ? new Date(a.last_message.created_at)
              : new Date(0);
            const dateB = b.last_message?.created_at
              ? new Date(b.last_message.created_at)
              : new Date(0);
            return dateB - dateA;
          })
        );
      } catch (err) {
        console.error("Error fetching chat rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  useEffect(() => {
    const pusher = getPusherInstance();
    const channels = {};

    // Subscribe to each valid chat room channel
    chatRooms.forEach((room) => {
      if (!room.chat_room_id) {
        console.warn("Skipping subscription for invalid room:", room);
        return;
      }
      const channelName = `chat-room-message.${room.chat_room_id}`;
      channels[channelName] = pusher.subscribe(channelName);

      channels[channelName].bind("new-message", (data) => {
        console.log("Pusher event for chat room:", room.chat_room_id, data);
        if (data?.message) {
          updateChatRoom({
            chat_room_id: room.chat_room_id,
            message: data.message.message,
            created_at: data.message.created_at,
            sender_id: data.message.sender_id,
          });
        }
      });

      console.log("Subscribed to channel:", channelName);
    });

    // Cleanup subscriptions
    return () => {
      Object.keys(channels).forEach((channelName) => {
        channels[channelName].unbind_all();
        pusher.unsubscribe(channelName);
        console.log("Unsubscribed from channel:", channelName);
      });
    };
  }, [chatRooms, updateChatRoom]);

  return { chatRooms, loading, updateChatRoom };
};
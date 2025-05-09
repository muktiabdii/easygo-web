import { useState, useEffect, useCallback } from 'react';
import { getChatRooms, createChatRoom, getMessages, sendMessage } from '../services/ChatService';
import Pusher from 'pusher-js';

export const useChat = (chatRoomId = null) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Inisialisasi Pusher
  const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
  });

  const channel = pusher.subscribe('chat-channel'); // Nama channel sesuai dengan event di backend

  // Ambil daftar chat room
  const fetchChatRooms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getChatRooms();
      setChatRooms(data);
    } catch (error) {
      console.error('Gagal mengambil chat rooms:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ambil pesan berdasarkan chatRoomId
  const fetchMessages = useCallback(async () => {
    if (!chatRoomId) return;
    setLoading(true);
    try {
      const data = await getMessages(chatRoomId);
      setMessages(data);
    } catch (error) {
      console.error('Gagal mengambil pesan:', error);
    } finally {
      setLoading(false);
    }
  }, [chatRoomId]);

  // Kirim pesan
  const handleSendMessage = async (content) => {
    if (!chatRoomId || !content) return;
    try {
      const message = await sendMessage(chatRoomId, content);
      setMessages((prev) => [...prev, message]);
    } catch (error) {
      console.error('Gagal mengirim pesan:', error);
    }
  };

  // Buat chat room baru
  const handleCreateRoom = async (receiverId) => {
    try {
      const room = await createChatRoom(receiverId);
      await fetchChatRooms(); // refresh list
      return room;
    } catch (error) {
      console.error('Gagal membuat chat room:', error);
    }
  };

  // Mendengarkan pesan baru di channel Pusher
  useEffect(() => {
    if (chatRoomId) {
      const messageHandler = (newMessage) => {
        if (newMessage.chatRoomId === chatRoomId) {
          setMessages((prev) => [...prev, newMessage]);
        }
      };

      channel.bind('message-sent', messageHandler);

      // Cleanup pada unmount untuk menghindari memory leaks
      return () => {
        channel.unbind('message-sent', messageHandler);
      };
    }
  }, [chatRoomId, channel]);

  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    chatRooms,
    messages,
    loading,
    fetchChatRooms,
    fetchMessages,
    handleSendMessage,
    handleCreateRoom,
  };
};

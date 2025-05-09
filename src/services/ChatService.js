import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/chat';

// Ambil daftar chat room user saat ini
export const getChatRooms = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Buat chat room baru
export const createChatRoom = async (user2_id) => {
  try {
    const response = await axios.post(BASE_URL, { user2_id });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Ambil semua pesan dari chat room tertentu
export const getMessages = async (chatRoomId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${chatRoomId}/messages`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Kirim pesan ke chat room tertentu
export const sendMessage = async (chatRoomId, message) => {
  try {
    const response = await axios.post(`${BASE_URL}/${chatRoomId}/messages`, {
      message,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

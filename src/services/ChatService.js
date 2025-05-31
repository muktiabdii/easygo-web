import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const auth_header = localStorage.getItem('auth_header');
  return {
    headers: {
      Authorization: `Bearer ${auth_header}`,
    },
  };
};

export const getChatRooms = () => {
  return axios.get(`${API_URL}/chat`, getAuthHeaders());
};

export const createChatRoom = (userId) => {
  return axios.post(`${API_URL}/chat`, { user_id: userId }, getAuthHeaders());
};

export const getMessages = (chatRoomId) => {
  return axios.get(`${API_URL}/chat/${chatRoomId}/messages`, getAuthHeaders());
};

export const sendMessage = (chatRoomId, message) => {
  return axios.post(`${API_URL}/chat/${chatRoomId}/messages`, { message }, getAuthHeaders());
};

export const searchMessages = (keyword) => {
  return axios.post(`${API_URL}/chat/messages/search`, { keyword }, getAuthHeaders());
};
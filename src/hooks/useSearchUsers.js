// src/hooks/useSearchUsers.js
import { useState, useCallback } from "react";
import api from "../services/authService";

export const useSearchUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchUsers = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_header");
      console.log("Sending request with token:", token);
      console.log("Filters:", filters);
      const response = await api.get("/users/search", { params: filters });
      console.log("Search users response:", response.data);
      setUsers(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Gagal mencari pengguna";
      setError(errorMessage);
      console.error("Search users error:", err, "Response:", err.response);
    } finally {
      setLoading(false);
    }
  }, []);

  return { users, searchUsers, loading, error };
};

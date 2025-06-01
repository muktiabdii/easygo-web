import { useState, useEffect } from "react";
import { getCurrentUser } from "../services/authService";

export const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const { userId, data } = await getCurrentUser();
        setUser({ userId, ...data });
      } catch (err) {
        setError(err.message || "Gagal memuat data pengguna");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};

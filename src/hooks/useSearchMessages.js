import { useState, useCallback } from 'react';
import { searchMessages } from '../services/chatService';

export const useSearchMessages = () => {
  const [searchedMessages, setSearchedMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (keyword) => {
    if (!keyword || keyword.trim() === '') {
      setSearchedMessages({});
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await searchMessages(keyword);
      setSearchedMessages(response.data);
    } catch (err) {
      setError('Gagal mencari pesan');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchedMessages({});
    setError(null);
  }, []);

  return { searchedMessages, search, clearSearch, loading, error };
};
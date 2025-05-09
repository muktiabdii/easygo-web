// Updated authUtils.js
import axios from 'axios';
import Cookies from 'js-cookie';

// waktu kadaluarsa token
const TOKEN_EXPIRATION = 24 * 60 * 60 * 1000;

// cek jika token ada di http-only cookie
export const isAuthenticated = () => {
  return !!Cookies.get('auth_session');
};

// cek token validity
export const checkTokenValidity = () => {
  const authSession = Cookies.get('auth_session');
  
  if (authSession) {
    const tokenTimestamp = Cookies.get('auth_timestamp');
    
    if (tokenTimestamp) {
      const currentTime = new Date().getTime();
      const tokenTime = parseInt(tokenTimestamp);

      if (currentTime - tokenTime > TOKEN_EXPIRATION) {
        logout();
        return false;
      }
      return true;
    }
    return true;
  }
  
  return false;
};

// data autentikasi
export const setAuth = (token) => {
  Cookies.set('auth_session', 'true', { sameSite: 'strict' });
  Cookies.set('auth_timestamp', new Date().getTime().toString(), { sameSite: 'strict' });
  
  // atur authorization header untuk sesi saat ini
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// hapus data autentikasi
export const logout = async () => {
  try {
    // panggilan API untuk logout
    await axios.post('http://localhost:8000/api/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    Cookies.remove('auth_session');
    Cookies.remove('auth_timestamp');
    
    // hapus authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    // arah ke halaman login jika tidak berada di halaman login
    if (window.location.pathname !== '/login' && 
        window.location.pathname !== '/' && 
        window.location.pathname !== '/register-step-one' &&
        !window.location.pathname.includes('/forgot-password')) {
      window.location.href = '/login';
    }
  }
};

// request interceptor untuk menambahkan token ke header dan mengirimkan cookie HTTP-only
axios.interceptors.request.use(
  config => {
    if (isAuthenticated() && !config.headers.Authorization) {
      config.withCredentials = true;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// respon interceptor untuk menangani error
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);

// cek validasi token
export const validateTokenWithBackend = async () => {
  if (!isAuthenticated()) return false;
  
  try {
    // endpoint untuk memvalidasi token
    const response = await axios.get('http://localhost:8000/api/auth/validate-token', {
      withCredentials: true 
    });
    
    return response.data.valid === true;
  } catch (error) {
    console.error('Token validation error:', error);
    logout();
    return false;
  }
};

// fungsi untuk login
export const login = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:8000/api/auth/login', 
      { email, password },
      { withCredentials: true } 
    );
    
    // atur client-side auth state
    if (response.data && response.data.token) {
      setAuth(response.data.token);
    }
    
    return response.data; 
  } catch (error) {
    throw error.response ? error.response.data : error.message; 
  }
};

// fungsi untuk register
export const register = async (data) => {
  try {
    const response = await axios.post('http://localhost:8000/api/auth/register', 
      data, 
      { withCredentials: true }
    );
    
    // atur client-side auth state
    if (response.data && response.data.token) {
      setAuth(response.data.token);
    }
    
    return response.data; 
  } catch (error) {
    throw error.response ? error.response.data : error.message; 
  }
};
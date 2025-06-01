import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, adminLogin } from '../services/authService'; // No need to import setAuth

export const useLogin = (isAdminLogin = false) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loginUser = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const loginFunction = isAdminLogin ? adminLogin : login;
            const data = await loginFunction(email, password);

            if (data.token) {
                localStorage.setItem('user_role', data.user.role);
                const from = location.state?.from || (data.user.role === 'admin' ? '/admin-panel' : '/dashboard');
                navigate(from, { replace: true });
                console.log('Login successful, token stored:', localStorage.getItem('auth_header')); // Debug
                return true;
            } else {
                setError('Login gagal: token tidak ditemukan');
                return false;
            }
        } catch (err) {
            console.error('Login error:', err.response || err);
            const errorMessage = err.message || 'Terjadi kesalahan saat login';
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loginUser, loading, error };
};
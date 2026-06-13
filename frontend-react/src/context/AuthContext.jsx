import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email, password) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            
            if (res.status === 401 && data.requiresVerification) {
                alert(data.message);
                return { requiresVerification: true, email: email };
            } else if (res.ok) {
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
                if (data.role === 'admin') navigate('/admin');
                else if (data.role === 'staff') navigate('/staff');
                else navigate('/');
                return { success: true };
            } else {
                alert(data.message || 'Login failed');
                return { success: false };
            }
        } catch (error) {
            console.error('Login error', error);
            return { success: false };
        }
    };

    const register = async (name, email, password, phone) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, phone }),
            });
            const data = await res.json();

            if (res.status === 201 && data.message === 'Verification Required') {
                return { requiresVerification: true, email: data.email };
            } else if (res.ok) {
                // Fallback if they are instantly verified (e.g. old code path)
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
                if (data.role === 'admin') navigate('/admin');
                else if (data.role === 'staff') navigate('/staff');
                else navigate('/');
                return { success: true };
            } else {
                alert(data.message || 'Registration failed');
                return { success: false };
            }
        } catch (error) {
            console.error('Registration error', error);
            return { success: false };
        }
    };

    const verifyEmailCode = async (email, code) => {
        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });
            const data = await res.json();

            if (res.ok) {
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
                if (data.role === 'admin') navigate('/admin');
                else if (data.role === 'staff') navigate('/staff');
                else navigate('/');
                return { success: true };
            } else {
                alert(data.message || 'Verification failed');
                return { success: false };
            }
        } catch (error) {
            console.error('Verification error', error);
            return { success: false };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, verifyEmailCode, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { API_URL } from '@/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
        try {
            const res = await fetch(`${API_URL}/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data.user);
                toast.success('Login successful!');
                return { success: true };
            } else {
                toast.error(data.message || 'Invalid email or password!');
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Server connection error!');
            return { success: false, message: 'Server connection error' };
        }
    };

    const register = async (name, email, photoUrl, password) => {
        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, photoUrl, password }),
                credentials: 'include',
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Registration successful! Please login.');
                return { success: true };
            } else {
                toast.error(data.message || 'Registration failed!');
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Server connection error!');
            return { success: false, message: 'Server connection error' };
        }
    };

    const logout = async () => {
        try {
            const res = await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (res.ok) {
                setUser(null);
                toast.success('Logged out successfully!');
                return { success: true };
            }
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Logout failed!');
        }
        return { success: false };
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, checkUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

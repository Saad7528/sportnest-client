'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { API_URL } from '@/config';

// Simple Fetch Interceptor: Automatically attach the JWT token to requests going to our API
if (typeof window !== 'undefined') {
    const originalFetch = window.fetch;
    window.fetch = async function (url, options = {}) {
        const token = localStorage.getItem('sportnest_token');
        const urlStr = typeof url === 'string' ? url : (url && url.url) || '';
        
        if (token && urlStr.includes(API_URL)) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            };
        }
        return originalFetch(url, options);
    };
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // Instantly restore user session from localStorage on reload to prevent flickering or redirects
    const [user, setUser] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('sportnest_user');
            return savedUser ? JSON.parse(savedUser) : null;
        }
        return null;
    });
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
        try {
            const res = await fetch(`${API_URL}/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important to send cookies
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                localStorage.setItem('sportnest_user', JSON.stringify(data.user));
            } else {
                setUser(null);
                localStorage.removeItem('sportnest_user');
                localStorage.removeItem('sportnest_token');
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            // Don't clear user session on temporary connection/cold start errors to keep reload working
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
                localStorage.setItem('sportnest_user', JSON.stringify(data.user));
                if (data.token) {
                    localStorage.setItem('sportnest_token', data.token);
                }
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

    const loginWithGoogle = async (accessToken) => {
        try {
            const res = await fetch(`${API_URL}/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ access_token: accessToken }),
                credentials: 'include',
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data.user);
                localStorage.setItem('sportnest_user', JSON.stringify(data.user));
                if (data.token) {
                    localStorage.setItem('sportnest_token', data.token);
                }
                toast.success('Login successful with Google!');
                return { success: true };
            } else {
                toast.error(data.message || 'Google Login failed!');
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Google Login error:', error);
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
                localStorage.removeItem('sportnest_user');
                localStorage.removeItem('sportnest_token');
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
        <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout, checkUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '@/config';

export default function LoginPage() {
    const { user, login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const redirectPath = searchParams.get('redirect') || '/';

    useEffect(() => {
        if (user) {
            router.push(redirectPath);
        }
    }, [user, router, redirectPath]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return;

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            router.push(redirectPath);
        }
    };

    const handleGoogleLogin = () => {
        setLoading(true);
        setTimeout(async () => {
            // Mock login as Google User
            const result = await login('googleuser@gmail.com', 'GoogleUser123');
            setLoading(false);
            if (result.success) {
                router.push(redirectPath);
            } else {
                // If the user doesn't exist, register them first, then login
                const regResult = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'Google User',
                        email: 'googleuser@gmail.com',
                        photoUrl: 'https://i.ibb.co.com/5R38XF0/user-placeholder.png',
                        password: 'GoogleUser123'
                    })
                });
                
                if (regResult.ok || regResult.status === 400) { // status 400 means already exists
                    const logResult = await login('googleuser@gmail.com', 'GoogleUser123');
                    if (logResult.success) {
                        router.push(redirectPath);
                    }
                }
            }
        }, 1000);
    };

    return (
        <div className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-background relative grid-pattern">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-md w-full space-y-6 glass border border-glass-border p-8 rounded-xl shadow-sm relative z-10"
            >
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h2>
                    <p className="mt-1.5 text-xs text-muted">
                        Please enter your details to sign in
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-3.5">
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted">
                                    <Mail className="w-4 h-4" />
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="yourname@gmail.com"
                                    className="block w-full pl-9 pr-3 py-2.5 rounded-lg border border-card-border bg-card/40 text-foreground placeholder-muted/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted">
                                    <Lock className="w-4 h-4" />
                                </span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full pl-9 pr-3 py-2.5 rounded-lg border border-card-border bg-card/40 text-foreground placeholder-muted/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-background bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-sm"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Login
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Google Sign-in */}
                <div className="mt-6">
                    <div className="relative flex justify-center text-xs mb-4">
                        <span className="px-2 bg-transparent text-muted uppercase tracking-wider font-bold">Or continue with</span>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        className="w-full flex items-center justify-center px-4 py-2.5 border border-card-border rounded-lg shadow-sm text-sm font-semibold text-foreground bg-card/30 hover:bg-glass-border/30 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="#EA4335"
                                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.57 15.02 1 12 1 7.37 1 3.4 3.66 1.45 7.55l3.86 3c.96-2.88 3.66-5.51 6.69-5.51z"
                            />
                            <path
                                fill="#4285F4"
                                d="M23.49 12.27c0-.81-.07-1.59-.2-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.87c2.16-2 3.72-4.94 3.72-8.69z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.31 14.55c-.24-.73-.38-1.5-.38-2.3s.14-1.57.38-2.3L1.45 6.95C.52 8.81 0 10.87 0 13s.52 4.19 1.45 6.05l3.86-3.5z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.7-2.87c-1.04.7-2.38 1.12-4.26 1.12-3.03 0-5.73-2.63-6.69-5.51L1.45 16.82C3.4 20.34 7.37 23 12 23z"
                            />
                        </svg>
                        Sign in with Google
                    </button>
                </div>

                <div className="text-center mt-4 pt-4 border-t border-glass-border">
                    <p className="text-xs text-muted">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-semibold text-foreground hover:underline inline-flex items-center">
                            Register here <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

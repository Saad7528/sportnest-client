'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Image as ImageIcon, Lock, UserPlus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const validatePassword = (pwd) => {
        if (pwd.length < 6) {
            return "Password must be at least 6 characters long";
        }
        if (!/[A-Z]/.test(pwd)) {
            return "Password must contain at least one uppercase letter";
        }
        if (!/[a-z]/.test(pwd)) {
            return "Password must contain at least one lowercase letter";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Local validation
        const pwdError = validatePassword(password);
        if (pwdError) {
            toast.error(pwdError);
            return;
        }

        setLoading(true);
        const result = await register(name, email, photoUrl, password);
        setLoading(false);

        if (result.success) {
            router.push('/login');
        }
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
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h2>
                    <p className="mt-1.5 text-xs text-muted">
                        Please fill in your details to register
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-3.5">
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Full Name</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted">
                                    <User className="w-4 h-4" />
                                </span>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="block w-full pl-9 pr-3 py-2.5 rounded-lg border border-card-border bg-card/40 text-foreground placeholder-muted/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all text-sm"
                                />
                            </div>
                        </div>

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
                            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Profile Photo URL (Optional)</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted">
                                    <ImageIcon className="w-4 h-4" />
                                </span>
                                <input
                                    type="url"
                                    value={photoUrl}
                                    onChange={(e) => setPhotoUrl(e.target.value)}
                                    placeholder="https://example.com/photo.jpg"
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
                                    placeholder="•••••••• (Min 6 chars, uppercase & lowercase)"
                                    className="block w-full pl-9 pr-3 py-2.5 rounded-lg border border-card-border bg-card/40 text-foreground placeholder-muted/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-background bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-sm"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Register
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4 pt-4 border-t border-glass-border">
                    <p className="text-xs text-muted">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-foreground hover:underline inline-flex items-center">
                            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Login here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

import React from 'react';
import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex-grow flex items-center justify-center min-h-[70vh] px-4">
            <div className="max-w-md w-full text-center p-8 rounded-2xl glass border border-glass-border shadow-lg space-y-6">
                <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-500">
                    <AlertTriangle className="w-12 h-12" />
                </div>
                
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">404 - Page Not Found</h1>
                
                <p className="text-muted text-sm sm:text-base">
                    Sorry! The page you are looking for has been moved or the URL is incorrect. Please return to the homepage.
                </p>

                <div className="pt-2">
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-primary text-background hover:bg-primary-hover font-medium shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        <Home className="w-4 h-4" />
                        <span>Return Home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

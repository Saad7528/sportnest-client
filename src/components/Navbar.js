'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Menu, X, LogOut, PlusCircle, Calendar, Settings } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'All Facilities', href: '/facilities' },
    ];

    const privateLinks = [
        { name: 'My Bookings', href: '/my-bookings', icon: Calendar },
        { name: 'Add Facility', href: '/add-facility', icon: PlusCircle },
        { name: 'Manage Facilities', href: '/manage-facilities', icon: Settings },
    ];

    const isActive = (path) => pathname === path;

    return (
        <nav className="sticky top-0 z-50 w-full glass border-b border-glass-border shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
                                Sport<span className="text-primary font-black">Nest</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-6 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-all ${
                                    isActive(link.href) ? 'text-primary' : 'text-muted hover:text-foreground'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Private links visible inline if logged in */}
                        {user && privateLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-all ${
                                    isActive(link.href) ? 'text-primary' : 'text-muted hover:text-foreground'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right side actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl hover:bg-glass-border/30 transition-colors text-muted hover:text-foreground"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
                        </button>

                        {/* User profile / Login */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center space-x-2.5 focus:outline-none p-1.5 rounded-xl hover:bg-glass-border/30 transition-all border border-transparent hover:border-glass-border"
                                >
                                    {user.photoUrl ? (
                                        <img
                                            src={user.photoUrl}
                                            alt={user.name}
                                            className="w-7 h-7 rounded-lg object-cover ring-1 ring-primary/45"
                                            onError={(e) => {
                                                e.target.src = 'https://i.ibb.co.com/5R38XF0/user-placeholder.png';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="text-xs font-semibold text-foreground">{user.name}</span>
                                </button>

                                {/* Dropdown menu */}
                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-52 rounded-xl shadow-xl py-1 border border-glass-border glass bg-card/95 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150">
                                        <div className="px-4 py-2 border-b border-glass-border">
                                            <p className="text-[10px] uppercase font-bold text-muted tracking-wider">Logged in as</p>
                                            <p className="text-xs font-bold truncate text-foreground mt-0.5">{user.email}</p>
                                        </div>

                                        {privateLinks.map((link) => {
                                            const Icon = link.icon;
                                            return (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center px-4 py-2 text-xs font-medium text-muted hover:text-foreground hover:bg-glass-border/30 transition-colors"
                                                >
                                                    <Icon className="w-3.5 h-3.5 mr-2 text-primary" />
                                                    {link.name}
                                                </Link>
                                            );
                                        })}

                                        <button
                                            onClick={() => {
                                                setProfileOpen(false);
                                                logout();
                                            }}
                                            className="flex items-center w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors border-t border-glass-border"
                                        >
                                            <LogOut className="w-3.5 h-3.5 mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-background font-semibold text-xs shadow-md transition-all"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu button */}
                    <div className="flex md:hidden items-center space-x-2">
                        {/* Theme Toggle Mobile */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl hover:bg-glass-border/30 text-muted"
                        >
                            {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
                        </button>
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 rounded-xl hover:bg-glass-border/30 text-muted focus:outline-none"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden glass border-b border-glass-border py-2 px-4 space-y-1 animate-in slide-in-from-top duration-200">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isActive(link.href) ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-glass-border/30'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {user ? (
                        <>
                            <div className="border-t border-glass-border my-2 pt-2">
                                <p className="px-3 text-[10px] text-muted font-bold tracking-wider uppercase mb-1">
                                    Dashboard
                                </p>
                                {privateLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            isActive(link.href) ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-glass-border/30'
                                        }`}
                                    >
                                        <link.icon className="w-4 h-4 mr-2 text-primary" />
                                        {link.name}
                                    </Link>
                                ))}
                                <button
                                    onClick={() => {
                                        setMobileOpen(false);
                                        logout();
                                    }}
                                    className="flex w-full items-center px-3 py-2 rounded-lg text-sm font-bold text-red-500 hover:bg-red-500/10 mt-1"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="border-t border-glass-border mt-3 pt-3 pb-2">
                            <Link
                                href="/login"
                                onClick={() => setMobileOpen(false)}
                                className="block w-full text-center px-4 py-2 rounded-xl bg-primary text-background text-xs font-semibold shadow-md"
                            >
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}

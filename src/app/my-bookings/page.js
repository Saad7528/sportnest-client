'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CalendarDays, Clock, DollarSign, Trash2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { API_URL } from '@/config';

export default function MyBookingsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            toast.error('Please log in to view your bookings!');
            router.push('/login?redirect=/my-bookings');
            return;
        }

        const fetchBookings = async () => {
            try {
                const res = await fetch(`${API_URL}/bookings`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setBookings(data);
                } else {
                    toast.error('Could not load booking data!');
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
                toast.error('Server connection error!');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchBookings();
        }
    }, [user, authLoading, router]);

    const handleCancelBooking = async (bookingId) => {
        const confirmCancel = window.confirm('Are you sure you want to cancel this booking?');
        if (!confirmCancel) return;

        try {
            const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (res.ok) {
                setBookings(bookings.filter(b => b._id !== bookingId));
                toast.success('Booking canceled successfully!');
            } else {
                const data = await res.json();
                toast.error(data.message || 'Could not cancel booking!');
            }
        } catch (error) {
            console.error('Error canceling booking:', error);
            toast.error('Server connection error!');
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex-grow flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex-grow max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">My Bookings</h1>
                <p className="text-muted text-sm sm:text-base">View and manage all your booked sports facilities and their details.</p>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-20 rounded-2xl glass border border-glass-border space-y-4">
                    <p className="text-lg text-muted font-medium">No booking records found!</p>
                    <button
                        onClick={() => router.push('/facilities')}
                        className="px-6 py-3 rounded-xl bg-primary text-background hover:bg-primary-hover font-semibold text-sm shadow-md transition-all duration-200"
                    >
                        Book Facilities
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking, index) => (
                        <motion.div
                            key={booking._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="rounded-2xl glass border border-glass-border p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all"
                        >
                            {/* Card Header */}
                            <div className="space-y-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                    booking.status === 'confirmed' 
                                        ? 'bg-emerald-500/10 text-emerald-500' 
                                        : 'bg-amber-500/10 text-amber-500'
                                }`}>
                                    {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                </span>
                                <h3 className="text-xl font-bold tracking-tight line-clamp-1 text-foreground">
                                    {booking.facility_name}
                                </h3>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 pt-2 border-t border-glass-border/40 text-sm text-muted">
                                <div className="flex items-center space-x-2">
                                    <CalendarDays className="w-4 h-4 text-primary" />
                                    <span>Date: {booking.booking_date}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span>Time: {booking.time_slot} ({booking.hours} {booking.hours === 1 ? 'hour' : 'hours'})</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <DollarSign className="w-4 h-4 text-primary" />
                                    <span>Total Price: <strong className="text-foreground">৳ {booking.total_price}</strong></span>
                                </div>
                            </div>

                            {/* Footer cancel action */}
                            <div className="pt-4 border-t border-glass-border/40 flex items-center justify-between">
                                <p className="text-xs text-muted flex items-center">
                                    <ShieldAlert className="w-3.5 h-3.5 mr-1 text-amber-500" />
                                    Authorized creator cancel only
                                </p>
                                <button
                                    onClick={() => handleCancelBooking(booking._id)}
                                    className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all border border-red-500/20 hover:border-transparent flex items-center justify-center"
                                    title="Cancel booking"
                                >
                                    <Trash2 className="w-4 h-4 mr-1.5" />
                                    <span className="text-xs font-semibold">Cancel</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

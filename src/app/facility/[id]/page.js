'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MapPin, Users, Calendar, Clock, DollarSign, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { API_URL } from '@/config';

export default function FacilityDetailsPage({ params }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [facility, setFacility] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form states
    const [bookingDate, setBookingDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [hours, setHours] = useState(1);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        // Auth check - Redirect if not logged in and not loading auth
        if (!authLoading && !user) {
            toast.error('Please login first to book this facility!');
            router.push(`/login?redirect=/facility/${id}`);
            return;
        }

        const fetchFacilityDetails = async () => {
            try {
                const res = await fetch(`${API_URL}/facilities/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFacility(data);
                    if (data.available_slots && data.available_slots.length > 0) {
                        setTimeSlot(data.available_slots[0]);
                    }
                } else {
                    toast.error('Facility not found!');
                }
            } catch (error) {
                console.error('Error fetching facility details:', error);
                toast.error('Server connection error!');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchFacilityDetails();
        }
    }, [id, user, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div className="flex-grow flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!facility) {
        return (
            <div className="flex-grow flex items-center justify-center min-h-[60vh]">
                <p className="text-muted font-bold text-base">Facility not found.</p>
            </div>
        );
    }

    const totalPrice = (facility.price_per_hour * hours) || 0;

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!bookingDate) {
            toast.error('Please select a booking date!');
            return;
        }
        if (!timeSlot) {
            toast.error('Please select a booking time slot!');
            return;
        }
        if (hours <= 0) {
            toast.error('Booking hours must be at least 1!');
            return;
        }

        setBookingLoading(true);
        try {
            const res = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    facility_id: id,
                    booking_date: bookingDate,
                    time_slot: timeSlot,
                    hours: parseFloat(hours),
                    total_price: parseFloat(totalPrice)
                }),
                credentials: 'include'
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Booking requested successfully! Pending owner approval.');
                router.push('/my-bookings');
            } else {
                toast.error(data.message || 'Could not complete the booking!');
            }
        } catch (error) {
            console.error('Error making booking:', error);
            toast.error('Server connection error!');
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div className="flex-grow max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full space-y-6 grid-pattern">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="inline-flex items-center text-sm font-semibold text-muted hover:text-primary transition-colors focus:outline-none"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
            </button>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="relative rounded-xl overflow-hidden h-[400px] border border-glass-border shadow-sm bg-muted">
                        <img
                            src={facility.image_url || 'https://images.unsplash.com/photo-1540747737956-37872404a87a?w=800&auto=format&fit=crop&q=60'}
                            alt={facility.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1540747737956-37872404a87a?w=800&auto=format&fit=crop&q=60';
                            }}
                        />
                        <span className="absolute top-4 left-4 inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-primary text-white shadow-sm">
                            {facility.facility_type}
                        </span>
                    </div>

                    <div className="glass border border-glass-border p-8 rounded-xl space-y-6">
                        <h1 className="text-3xl font-extrabold tracking-tight">{facility.name}</h1>
                        
                        <div className="flex flex-wrap gap-6 text-sm text-muted">
                            <div className="flex items-center space-x-1.5">
                                <MapPin className="w-4.5 h-4.5 text-primary" />
                                <span>{facility.location}</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <Users className="w-4.5 h-4.5 text-primary" />
                                <span>Capacity: {facility.capacity} People</span>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-glass-border/40">
                            <h3 className="text-base font-bold text-foreground">Venue Description</h3>
                            <p className="text-muted leading-relaxed text-sm">
                                {facility.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right side booking form */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass border border-glass-border p-6 rounded-xl shadow-sm sticky top-24 space-y-6"
                    >
                        <div className="pb-4 border-b border-glass-border">
                            <h2 className="text-lg font-bold text-foreground">Booking Form</h2>
                            <p className="text-xs text-muted mt-1">Fill in the details below to rent this venue</p>
                        </div>

                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                            {/* Date */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center mb-1">
                                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary" />
                                    Booking Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]} // block past dates
                                    className="block w-full px-3 py-2 text-sm rounded-lg border border-card-border bg-card/40 text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Time slots */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center mb-1">
                                    <Clock className="w-3.5 h-3.5 mr-1.5 text-primary" />
                                    Time Slot
                                </label>
                                <select
                                    required
                                    value={timeSlot}
                                    onChange={(e) => setTimeSlot(e.target.value)}
                                    className="block w-full px-3 py-2 text-sm rounded-lg border border-card-border bg-card/40 text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
                                >
                                    {facility.available_slots && facility.available_slots.map((slot) => (
                                        <option key={slot} value={slot}>
                                            {slot}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Hours */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center mb-1">
                                    <Clock className="w-3.5 h-3.5 mr-1.5 text-primary" />
                                    Number of Hours
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max="12"
                                    value={hours}
                                    onChange={(e) => setHours(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="block w-full px-3 py-2 text-sm rounded-lg border border-card-border bg-card/40 text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Pricing Summary */}
                            <div className="p-4 rounded-lg bg-primary/5 border border-glass-border/30 space-y-2">
                                <div className="flex justify-between text-xs text-muted">
                                    <span>Price per hour:</span>
                                    <span className="font-semibold text-foreground">৳ {facility.price_per_hour}</span>
                                </div>
                                <div className="flex justify-between text-xs text-muted">
                                    <span>Duration:</span>
                                    <span className="font-semibold text-foreground">{hours} {hours === 1 ? 'Hour' : 'Hours'}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-glass-border">
                                    <span className="text-xs font-bold flex items-center uppercase tracking-wider text-muted">
                                        Total Price:
                                    </span>
                                    <span className="text-xl font-black text-foreground">৳ {totalPrice}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={bookingLoading}
                                className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold text-sm shadow-sm transition-all flex justify-center items-center"
                            >
                                {bookingLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    'Confirm Booking'
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

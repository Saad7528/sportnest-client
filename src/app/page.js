'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Trophy, Shield, MapPin, Zap, Flame, Award, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '@/config';
import toast from 'react-hot-toast';

export default function HomePage() {
    const router = useRouter();
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState(0);
    const [mockBooked, setMockBooked] = useState(false);
    const [failedImages, setFailedImages] = useState({});

    const handleImageError = (imgKey) => {
        setFailedImages(prev => ({ ...prev, [imgKey]: true }));
    };

    const handleMockBook = () => {
        setMockBooked(true);
        toast.success("Success! (Simulation) Booking request sent to Dhanmondi Club Turf.", {
            duration: 4000
        });
        setTimeout(() => {
            setMockBooked(false);
        }, 6000);
    };

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const res = await fetch(`${API_URL}/facilities`);
                if (res.ok) {
                    const data = await res.json();
                    setFacilities(data || []);
                } else {
                    setFacilities([]);
                }
            } catch (error) {
                console.error('Error fetching facilities:', error);
                setFacilities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFacilities();
    }, []);

    const handleBookNow = (id) => {
        router.push(`/facility/${id}`);
    };

    return (
        <div className="flex-grow flex flex-col grid-pattern">
            <section className="relative py-12 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-card-border overflow-hidden min-h-[85vh] flex items-center">
                <div className="glow-orb top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
                <div className="glow-orb-secondary bottom-10 right-10 opacity-50"></div>

                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
                    {/* Left Column: Call to Action */}
                    <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold border border-glass-border bg-glass-bg/60 text-secondary backdrop-blur-md shadow-sm">
                                <Flame className="w-3.5 h-3.5 mr-1.5 animate-pulse text-amber-500" />
                                Instant Booking & Verified Venues
                            </span>
                        </motion.div>

                        <div className="space-y-4">
                            <motion.h1
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] text-foreground"
                            >
                                Book Premium Sports <br />
                                <span className="accent-gradient-text">Facilities & Turfs</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.18 }}
                                className="max-w-xl text-muted text-sm sm:text-base leading-relaxed"
                            >
                                Discover, review, and book top football turfs, cricket boxes, swimming pools, and indoor courts near you. Hassle-free booking, instantly.
                            </motion.p>
                        </div>

                        {/* Active Players Social Proof Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.24 }}
                            className="flex items-center gap-3"
                        >
                            <div className="flex -space-x-2.5">
                                {!failedImages['player1'] ? (
                                    <img 
                                        className="w-7 h-7 rounded-full border border-card-border object-cover" 
                                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80" 
                                        alt="Player 1" 
                                        onError={() => handleImageError('player1')}
                                    />
                                ) : (
                                    <div className="w-7 h-7 rounded-full border border-card-border bg-blue-600 font-bold text-[9px] text-white flex items-center justify-center">PB</div>
                                )}
                                {!failedImages['player2'] ? (
                                    <img 
                                        className="w-7 h-7 rounded-full border border-card-border object-cover" 
                                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80" 
                                        alt="Player 2" 
                                        onError={() => handleImageError('player2')}
                                    />
                                ) : (
                                    <div className="w-7 h-7 rounded-full border border-card-border bg-pink-600 font-bold text-[9px] text-white flex items-center justify-center">AM</div>
                                )}
                                {!failedImages['player3'] ? (
                                    <img 
                                        className="w-7 h-7 rounded-full border border-card-border object-cover" 
                                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80" 
                                        alt="Player 3" 
                                        onError={() => handleImageError('player3')}
                                    />
                                ) : (
                                    <div className="w-7 h-7 rounded-full border border-card-border bg-amber-600 font-bold text-[9px] text-white flex items-center justify-center">UB</div>
                                )}
                                <div className="w-7 h-7 rounded-full border border-card-border bg-primary text-background text-[10px] font-black flex items-center justify-center shadow-md">
                                    +5k
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-muted">
                                Join over <strong className="text-foreground font-bold">5,000+ athletes</strong> booking this week!
                            </span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
                        >
                            <Link
                                href="/facilities"
                                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-primary text-background font-bold text-sm hover:opacity-90 active:scale-98 hover:-translate-y-0.5 hover:shadow-primary/15 duration-300 transition-all shadow-md justify-center"
                            >
                                <span>Explore Venues</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl border border-card-border bg-card/65 text-foreground font-bold text-sm hover:bg-glass-border/45 hover:-translate-y-0.5 active:scale-98 duration-300 transition-all justify-center"
                            >
                                <span>Create Account</span>
                            </Link>
                        </motion.div>

                        {/* Quick Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="pt-6 border-t border-card-border/50 flex flex-wrap gap-3 text-xs text-muted"
                        >
                            <div className="flex items-center gap-2 bg-glass-bg/40 border border-glass-border/60 py-1.5 px-3 rounded-full backdrop-blur-sm">
                                <Zap className="w-3.5 h-3.5 text-secondary animate-pulse" />
                                <span className="font-semibold text-foreground/85">Instant Reservation</span>
                            </div>
                            <div className="flex items-center gap-2 bg-glass-bg/40 border border-glass-border/60 py-1.5 px-3 rounded-full backdrop-blur-sm">
                                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="font-semibold text-foreground/85">Secure Payments</span>
                            </div>
                            <div className="flex items-center gap-2 bg-glass-bg/40 border border-glass-border/60 py-1.5 px-3 rounded-full backdrop-blur-sm">
                                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                <span className="font-semibold text-foreground/85">Verified Arenas</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Unique 3D Perspective Sports Collage Showcase */}
                    <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative w-full max-w-[440px] aspect-[4/5] flex items-center justify-center p-4"
                        >
                            {/* Ambient background glows */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/15 rounded-full blur-[80px] -z-10 animate-pulse" style={{ animationDuration: '6s' }}></div>
                            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-secondary/10 rounded-full blur-[60px] -z-10"></div>

                            {/* Outer Perspective Wrapper */}
                            <div className="relative w-full h-full flex items-center justify-center">

                                {/* COLLAGE CARD 1: Underlay card (Indoor Court / Badminton) */}
                                <motion.div
                                    initial={{ opacity: 0, x: -40, rotate: -8 }}
                                    animate={{ opacity: 0.85, x: -30, rotate: -12 }}
                                    whileHover={{ scale: 1.05, rotate: -6, zIndex: 30 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                    className="absolute left-4 top-12 w-[180px] sm:w-[220px] aspect-[3/4] rounded-2xl overflow-hidden border border-glass-border/40 shadow-lg -rotate-12 cursor-pointer z-10"
                                >
                                    <div className="absolute inset-0 bg-black/30 hover:bg-black/10 transition-all z-10"></div>
                                    {!failedImages['hero_badminton'] ? (
                                        <img
                                            src="https://images.unsplash.com/photo-1613918431201-4967b3f21846?w=640&q=80"
                                            alt="Badminton Court"
                                            className="w-full h-full object-cover"
                                            onError={() => handleImageError('hero_badminton')}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-violet-800 flex items-center justify-center">
                                            <Flame className="w-10 h-10 text-white/35 animate-pulse" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-3 left-3 z-20 text-white">
                                        <p className="text-[9px] uppercase font-bold tracking-wider text-slate-300">Indoor Arena</p>
                                        <h4 className="text-xs font-black">Elite Badminton</h4>
                                    </div>
                                </motion.div>

                                {/* COLLAGE CARD 2: Main Featured Turf Card (3D Tilt effect) */}
                                <motion.div
                                    whileHover={{
                                        scale: 1.03,
                                        rotateY: -5,
                                        rotateX: 5,
                                        boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.3)"
                                    }}
                                    transition={{ type: "spring", stiffness: 120, damping: 14 }}
                                    className="relative w-[240px] sm:w-[280px] aspect-[3/4] rounded-3xl overflow-hidden border border-glass-border shadow-2xl z-20 cursor-pointer bg-card/45 backdrop-blur-md"
                                    style={{ perspective: 1000 }}
                                >
                                    {/* Glass border lighting glow overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 via-transparent to-white/10 pointer-events-none z-20"></div>

                                    <div className="relative w-full h-full overflow-hidden">
                                        {!failedImages['hero_turf'] ? (
                                            <img
                                                src="https://images.unsplash.com/photo-1540747737956-37872404a87a?w=640&q=80"
                                                alt="Premium Football Turf"
                                                className="w-full h-full object-cover"
                                                onError={() => handleImageError('hero_turf')}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center">
                                                <Trophy className="w-14 h-14 text-white/35 animate-bounce" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10"></div>

                                        {/* Premium Live Label */}
                                        <span className="absolute top-4 left-4 z-20 bg-secondary px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider text-white shadow-md flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                                            Prime turf
                                        </span>

                                        {/* Card content text */}
                                        <div className="absolute bottom-5 left-5 right-5 z-20 text-white">
                                            <div className="flex items-center gap-1 text-amber-400 mb-1">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <svg key={s} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                                <span className="text-[10px] text-slate-300 font-bold ml-1">5.0 (200+)</span>
                                            </div>
                                            <h3 className="text-base font-extrabold tracking-tight">Dhanmondi Club Turf</h3>
                                            <p className="text-[11px] text-slate-300 mt-0.5">Dhaka, Bangladesh</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* COLLAGE CARD 3: Overlapping visual badge card (Football close-up) */}
                                <motion.div
                                    initial={{ opacity: 0, x: 40, rotate: 6 }}
                                    animate={{ opacity: 0.9, x: 30, rotate: 8 }}
                                    whileHover={{ scale: 1.05, rotate: 4, zIndex: 30 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                    className="absolute right-2 bottom-8 w-[140px] sm:w-[170px] aspect-[4/3] rounded-2xl overflow-hidden border border-glass-border/40 shadow-lg rotate-8 cursor-pointer z-20"
                                >
                                    <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors z-10"></div>
                                    {!failedImages['hero_football'] ? (
                                        <img
                                            src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=640&q=80"
                                            alt="Football Action"
                                            className="w-full h-full object-cover"
                                            onError={() => handleImageError('hero_football')}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-green-600 to-emerald-800 flex items-center justify-center">
                                            <Zap className="w-8 h-8 text-white/35 animate-pulse" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 z-20 bg-emerald-500 text-white font-extrabold text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded">
                                        Active
                                    </div>
                                </motion.div>

                                {/* FLOATING ELEMENT: Glassmorphic interactive stat badge */}
                                <motion.div
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-6 right-6 z-30 glass px-3.5 py-2 rounded-2xl flex items-center gap-2 border border-glass-border shadow-lg"
                                >
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[10px] font-bold text-foreground">50+ Open Arenas</span>
                                </motion.div>

                                {/* FLOATING ELEMENT 2: Live feedback prompt card */}
                                <motion.div
                                    animate={{ y: [0, 6, 0] }}
                                    transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute bottom-6 left-6 z-30 bg-primary/95 text-background px-3.5 py-2.5 rounded-2xl flex items-center gap-2 shadow-xl border border-glass-border/10"
                                >
                                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                                    <span className="text-[10px] font-extrabold tracking-tight">Verified & Secure</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* DYNAMIC FEATURED FACILITIES SECTION (Min 6 cards) */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-card-border">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
                        <span className="text-xs font-bold text-secondary uppercase tracking-wider">Top rated</span>
                        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Popular Venues</h2>
                        <p className="text-muted text-xs sm:text-sm">
                            Browse highly requested sports venues currently open for reservations.
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-[400px] rounded-xl border border-card-border bg-card/50 animate-pulse"></div>
                            ))}
                        </div>
                    ) : facilities.length === 0 ? (
                        <div className="text-center py-20 rounded-xl border border-card-border bg-card/40 space-y-4 max-w-xl mx-auto shadow-sm">
                            <p className="text-base text-muted font-bold">No sports facilities available yet.</p>
                            <p className="text-xs text-muted max-w-sm mx-auto">
                                Please login and navigate to "Add Facility" to list a new sports venue.
                            </p>
                            <Link
                                href="/add-facility"
                                className="inline-flex px-5 py-2.5 rounded-xl bg-primary text-background font-semibold text-xs hover:opacity-90 transition-all"
                            >
                                Add Your First Facility
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {facilities.map((facility, index) => (
                                <motion.div
                                    key={facility._id}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="flex flex-col h-full premium-card overflow-hidden"
                                >
                                    {/* Image Wrapper */}
                                    <div className="relative h-48 overflow-hidden bg-muted border-b border-card-border">
                                        <img
                                            src={facility.image_url || 'https://images.unsplash.com/photo-1540747737956-37872404a87a?w=800&auto=format&fit=crop&q=60'}
                                            alt={facility.name}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1540747737956-37872404a87a?w=800&auto=format&fit=crop&q=60';
                                            }}
                                        />
                                        <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-card text-foreground border border-card-border shadow-sm">
                                            {facility.facility_type}
                                        </span>
                                    </div>

                                    {/* Content Card Body */}
                                    <div className="p-5 flex flex-col flex-grow space-y-4">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold tracking-tight text-foreground truncate">
                                                {facility.name}
                                            </h3>
                                            <div className="flex items-center text-xs text-muted space-x-1">
                                                <MapPin className="w-3.5 h-3.5 text-secondary" />
                                                <span className="truncate">{facility.location}</span>
                                            </div>
                                        </div>

                                        <p className="text-xs text-muted line-clamp-2 flex-grow">
                                            {facility.description}
                                        </p>

                                        {/* Pricing Details */}
                                        <div className="pt-3 border-t border-card-border flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] text-muted uppercase font-bold tracking-wider">Per hour</p>
                                                <p className="text-base font-bold text-foreground">৳ {facility.price_per_hour}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-muted uppercase font-bold tracking-wider">Capacity</p>
                                                <p className="text-xs font-semibold text-foreground">{facility.capacity} People</p>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={() => handleBookNow(facility._id)}
                                            className="w-full py-2.5 px-4 rounded-xl border border-card-border hover:bg-foreground hover:text-background hover:border-transparent text-xs font-semibold transition-all shadow-sm"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CREATIVE STATIC SECTION 1: WHY CHOOSE US? */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-card-border bg-card/10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
                        <span className="text-xs font-bold text-secondary uppercase tracking-wider">Our commitment</span>
                        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Why Book with SportNest?</h2>
                        <p className="text-muted text-xs sm:text-sm">
                            We bridge the gap between players and venue owners, offering a seamless booking process.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Point 1 */}
                        <div className="p-6 rounded-xl border border-card-border bg-card flex flex-col space-y-4 hover:border-glass-border transition-all">
                            <div className="w-10 h-10 rounded-lg bg-secondary/5 flex items-center justify-center text-secondary">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">Instant Booking</h3>
                            <p className="text-xs text-muted leading-relaxed">
                                Avoid phone delays. Reserve slots and confirm bookings in real-time instantly.
                            </p>
                        </div>
                        {/* Point 2 */}
                        <div className="p-6 rounded-xl border border-card-border bg-card flex flex-col space-y-4 hover:border-glass-border transition-all">
                            <div className="w-10 h-10 rounded-lg bg-secondary/5 flex items-center justify-center text-secondary">
                                <Shield className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">Secure Payments</h3>
                            <p className="text-xs text-muted leading-relaxed">
                                Enjoy worry-free transactions protected by encrypted systems and safe APIs.
                            </p>
                        </div>
                        {/* Point 3 */}
                        <div className="p-6 rounded-xl border border-card-border bg-card flex flex-col space-y-4 hover:border-glass-border transition-all">
                            <div className="w-10 h-10 rounded-lg bg-secondary/5 flex items-center justify-center text-secondary">
                                <Award className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">Verified Venues</h3>
                            <p className="text-xs text-muted leading-relaxed">
                                Every venue on our platform is handpicked and verified by our operational team.
                            </p>
                        </div>
                        {/* Point 4 */}
                        <div className="p-6 rounded-xl border border-card-border bg-card flex flex-col space-y-4 hover:border-glass-border transition-all">
                            <div className="w-10 h-10 rounded-lg bg-secondary/5 flex items-center justify-center text-secondary">
                                <HeartHandshake className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">24/7 Support</h3>
                            <p className="text-xs text-muted leading-relaxed">
                                Need help with your reservation? Our responsive team is here round-the-clock.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CREATIVE STATIC SECTION 2: POPULAR SPORTS CATEGORIES */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
                        <span className="text-xs font-bold text-secondary uppercase tracking-wider">Quick search</span>
                        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Choose Your Sport</h2>
                        <p className="text-muted text-xs sm:text-sm">
                            Select a category below to quickly find related venues in your area.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { name: 'Football', img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=640&q=80', count: 12, icon: Trophy, gradient: 'from-emerald-600 to-teal-800' },
                            { name: 'Cricket', img: 'https://images.unsplash.com/photo-1531415080290-bc9b1310278b?w=640&q=80', count: 8, icon: Award, gradient: 'from-rose-600 to-red-800' },
                            { name: 'Badminton', img: 'https://images.unsplash.com/photo-1613918431201-4967b3f21846?w=640&q=80', count: 15, icon: Flame, gradient: 'from-indigo-600 to-violet-800' },
                            { name: 'Swimming', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=640&q=80', count: 6, icon: HeartHandshake, gradient: 'from-sky-500 to-cyan-700' },
                            { name: 'Tennis', img: 'https://images.unsplash.com/photo-1622279457486-62dcc4a4b1fa?w=640&q=80', count: 4, icon: Shield, gradient: 'from-lime-500 to-green-700' },
                            { name: 'Basketball', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=640&q=80', count: 5, icon: Zap, gradient: 'from-amber-600 to-orange-800' }
                        ].map((category) => {
                            const SportIcon = category.icon;
                            const isFailed = failedImages[`category_${category.name}`];
                            return (
                                <Link
                                    key={category.name}
                                    href={`/facilities?type=${encodeURIComponent(category.name)}`}
                                    className="relative rounded-xl overflow-hidden h-36 group border border-card-border shadow-sm transition-all"
                                >
                                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 z-10 transition-colors"></div>
                                    {!isFailed ? (
                                        <img
                                            src={category.img}
                                            alt={category.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            onError={() => handleImageError(`category_${category.name}`)}
                                        />
                                    ) : (
                                        <div className={`w-full h-full bg-gradient-to-br ${category.gradient} transition-transform duration-500 group-hover:scale-105 flex items-center justify-center`}>
                                            <SportIcon className="w-12 h-12 text-white/20 absolute -right-2 -bottom-2 group-hover:scale-110 duration-500 transition-transform" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 text-white">
                                        <h3 className="font-bold text-sm tracking-tight">{category.name}</h3>
                                        <p className="text-[10px] text-slate-300">{category.count}+ Venues</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}

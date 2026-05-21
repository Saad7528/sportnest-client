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
            {/* HERO SECTION */}
            <section className="relative py-12 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-card-border overflow-hidden min-h-[85vh] flex items-center">
                {/* Background glow orbs */}
                <div className="glow-orb top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
                <div className="glow-orb-secondary bottom-10 right-10 opacity-50"></div>
                
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                    {/* Left Column: Call to Action */}
                    <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold border border-glass-border bg-glass-bg/60 text-secondary backdrop-blur-sm shadow-sm">
                                <Flame className="w-3.5 h-3.5 mr-1.5 animate-pulse text-amber-500" />
                                Instant Booking & Verified Venues
                            </span>
                        </motion.div>

                        <div className="space-y-4">
                            <motion.h1
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-foreground"
                            >
                                Book Premium Sports <br />
                                <span className="accent-gradient-text">Facilities & Turfs</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="max-w-xl text-muted text-sm sm:text-base leading-relaxed"
                            >
                                Discover, review, and book top football turfs, cricket boxes, swimming pools, and indoor courts near you. Hassle-free booking, instantly.
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
                        >
                            <Link
                                href="/facilities"
                                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-primary text-background font-bold text-sm hover:opacity-90 active:scale-98 transition-all shadow-md justify-center"
                            >
                                <span>Explore Venues</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl border border-card-border bg-card/65 text-foreground font-bold text-sm hover:bg-glass-border/45 active:scale-98 transition-all justify-center"
                            >
                                <span>Create Account</span>
                            </Link>
                        </motion.div>

                        {/* Quick Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="pt-6 border-t border-card-border/50 flex flex-wrap gap-x-6 gap-y-3.5 text-xs text-muted"
                        >
                            <div className="flex items-center gap-2">
                                <Zap className="w-4.5 h-4.5 text-secondary" />
                                <span>Instant Reservation</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-4.5 h-4.5 text-emerald-500" />
                                <span>Secure Payments</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Trophy className="w-4.5 h-4.5 text-amber-500" />
                                <span>Premium Quality Turfs</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Premium Interactive Widget */}
                    <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="w-full max-w-[380px] glass border border-glass-border rounded-2xl shadow-xl overflow-hidden relative z-10 animate-float"
                        >
                            {/* Card Header Image */}
                            <div className="relative h-44 overflow-hidden bg-muted">
                                <img 
                                    src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=60" 
                                    alt="Stadium Turf" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <span className="absolute top-3 left-3 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-secondary text-white uppercase shadow-sm">
                                    Football
                                </span>
                                <span className="absolute bottom-3 left-3 text-white font-bold text-lg leading-tight">
                                    Dhanmondi Club Turf
                                </span>
                            </div>

                            {/* Widget Interactive Body */}
                            <div className="p-5 space-y-4 text-left">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center text-muted">
                                        <MapPin className="w-3.5 h-3.5 mr-1 text-secondary" />
                                        <span>Satmasjid Rd, Dhaka</span>
                                    </div>
                                    <div className="flex items-center text-amber-500 font-semibold">
                                        <span>★ 4.9</span>
                                        <span className="text-muted ml-0.5 font-normal">(124)</span>
                                    </div>
                                </div>

                                <div className="border-t border-glass-border pt-3.5 space-y-2">
                                    <label className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                                        Select Time Slot
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button 
                                            type="button"
                                            onClick={() => setSelectedSlot(0)}
                                            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all border text-center cursor-pointer ${
                                                selectedSlot === 0 
                                                    ? 'bg-secondary border-secondary text-white shadow-sm' 
                                                    : 'border-card-border bg-card/40 text-foreground hover:bg-glass-border/30'
                                            }`}
                                        >
                                            04:00 PM - 06:00 PM
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setSelectedSlot(1)}
                                            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all border text-center cursor-pointer ${
                                                selectedSlot === 1 
                                                    ? 'bg-secondary border-secondary text-white shadow-sm' 
                                                    : 'border-card-border bg-card/40 text-foreground hover:bg-glass-border/30'
                                            }`}
                                        >
                                            06:00 PM - 08:00 PM
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t border-glass-border pt-3.5 flex items-center justify-between">
                                    <div>
                                        <span className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                                            Est. Total Price
                                        </span>
                                        <span className="text-lg font-black text-foreground">
                                            ৳ {selectedSlot === 0 ? '2,400' : '2,800'}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleMockBook}
                                        disabled={mockBooked}
                                        className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
                                            mockBooked 
                                                ? 'bg-emerald-500 text-white cursor-default' 
                                                : 'bg-primary text-background hover:opacity-90 active:scale-95'
                                        }`}
                                    >
                                        {mockBooked ? 'Booked Successfully!' : 'Instant Book'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                        
                        {/* Decorative background shadow rings */}
                        <div className="absolute -inset-2 rounded-3xl border border-glass-border/50 scale-102 pointer-events-none z-0"></div>
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
                            { name: 'Football', img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&q=80', count: 12 },
                            { name: 'Cricket', img: 'https://images.unsplash.com/photo-1531415080290-bc9b1310278b?w=300&q=80', count: 8 },
                            { name: 'Badminton', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=300&q=80', count: 15 },
                            { name: 'Swimming', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=300&q=80', count: 6 },
                            { name: 'Tennis', img: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=300&q=80', count: 4 },
                            { name: 'Basketball', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&q=80', count: 5 }
                        ].map((category) => (
                            <Link
                                key={category.name}
                                href={`/facilities?type=${encodeURIComponent(category.name)}`}
                                className="relative rounded-xl overflow-hidden h-36 group border border-card-border shadow-sm transition-all"
                            >
                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 z-10 transition-colors"></div>
                                <img
                                    src={category.img}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 text-white">
                                    <h3 className="font-bold text-sm tracking-tight">{category.name}</h3>
                                    <p className="text-[10px] text-slate-300">{category.count}+ Venues</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

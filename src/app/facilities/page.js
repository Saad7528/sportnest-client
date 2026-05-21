'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Search, MapPin, SlidersHorizontal, CalendarDays, Users } from 'lucide-react';
import { motion } from 'framer-motion';

import { API_URL } from '@/config';

const SPORT_TYPES = ['Football', 'Cricket', 'Badminton', 'Swimming', 'Tennis', 'Basketball'];

function FacilitiesContent() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);

    // Initialize filter from query param
    useEffect(() => {
        const typeParam = searchParams.get('type');
        if (typeParam) {
            setSelectedTypes([typeParam]);
        }
    }, [searchParams]);

    const fetchFilteredFacilities = async () => {
        setLoading(true);
        try {
            let url = `${API_URL}/facilities`;
            const params = [];

            if (search) {
                params.push(`search=${encodeURIComponent(search)}`);
            }
            if (selectedTypes.length > 0) {
                params.push(`type=${encodeURIComponent(selectedTypes.join(','))}`);
            }

            if (params.length > 0) {
                url += `?${params.join('&')}`;
            }

            const res = await fetch(url);
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

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchFilteredFacilities();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, selectedTypes]);

    const handleTypeToggle = (type) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter(t => t !== type));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };

    const handleBookNow = (id) => {
        if (!user) {
            router.push(`/login?redirect=/facility/${id}`);
        } else {
            router.push(`/facility/${id}`);
        }
    };

    return (
        <div className="flex-grow max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full space-y-8 grid-pattern">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-foreground">Explore Facilities</h1>
                <p className="text-muted text-xs sm:text-sm">Find and reserve high-quality sports venues near you.</p>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                {/* Left filter side card */}
                <div className="border border-card-border bg-card p-6 rounded-xl space-y-6 lg:col-span-1 shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-card-border">
                        <h3 className="font-bold text-sm flex items-center text-foreground">
                            <SlidersHorizontal className="w-4 h-4 mr-2 text-secondary" />
                            Filters
                        </h3>
                        {(search || selectedTypes.length > 0) && (
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setSelectedTypes([]);
                                }}
                                className="text-xs text-secondary hover:underline font-bold"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    {/* Search Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-muted tracking-wider block">Search</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted">
                                <Search className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Name or location..."
                                className="block w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-card-border bg-background text-foreground placeholder-muted focus:outline-none focus:ring-1 focus:ring-secondary focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Sport type filter list */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase text-muted tracking-wider block">Sports Category</label>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {SPORT_TYPES.map((type) => (
                                <label key={type} className="flex items-center space-x-2.5 text-xs text-muted hover:text-foreground cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={selectedTypes.includes(type)}
                                        onChange={() => handleTypeToggle(type)}
                                        className="rounded border-card-border text-secondary focus:ring-secondary w-3.5 h-3.5"
                                    />
                                    <span>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right facilities list */}
                <div className="lg:col-span-3">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 4].map((i) => (
                                <div key={i} className="h-96 rounded-xl border border-card-border bg-card/50 animate-pulse"></div>
                            ))}
                        </div>
                    ) : facilities.length === 0 ? (
                        <div className="text-center py-20 rounded-xl border border-card-border bg-card space-y-3 shadow-sm">
                            <p className="text-base text-muted font-bold">No facilities found</p>
                            <p className="text-xs text-muted">Try adjusting your search query or categories.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {facilities.map((facility, index) => (
                                <motion.div
                                    key={facility._id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.03 }}
                                    className="flex flex-col premium-card overflow-hidden h-full"
                                >
                                    <div className="relative h-44 bg-muted border-b border-card-border">
                                        <img
                                            src={facility.image_url || 'https://images.unsplash.com/photo-1540747737956-37872404a87a?w=800&auto=format&fit=crop&q=60'}
                                            alt={facility.name}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1540747737956-37872404a87a?w=800&auto=format&fit=crop&q=60';
                                            }}
                                        />
                                        <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-card text-foreground border border-card-border shadow-sm">
                                            {facility.facility_type}
                                        </span>
                                    </div>

                                    <div className="p-5 flex flex-col flex-grow space-y-4">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold text-foreground truncate">
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

                                        <div className="space-y-1.5 pt-3 border-t border-card-border text-xs text-muted">
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center">
                                                    <Users className="w-3.5 h-3.5 mr-1 text-secondary" />
                                                    Capacity: {facility.capacity} People
                                                </span>
                                                <span className="flex items-center">
                                                    <CalendarDays className="w-3.5 h-3.5 mr-1 text-secondary" />
                                                    Bookings: {facility.booking_count || 0}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-2 flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] text-muted uppercase font-bold tracking-wider block">Per hour</span>
                                                <span className="text-base font-bold text-foreground">৳ {facility.price_per_hour}</span>
                                            </div>
                                            <button
                                                onClick={() => handleBookNow(facility._id)}
                                                className="px-4 py-2 rounded-xl bg-primary text-background font-semibold text-xs hover:opacity-90 transition-all"
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function FacilitiesPage() {
    return (
        <Suspense fallback={
            <div className="flex-grow flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-2 border-muted/20 border-t-secondary rounded-full animate-spin"></div>
            </div>
        }>
            <FacilitiesContent />
        </Suspense>
    );
}

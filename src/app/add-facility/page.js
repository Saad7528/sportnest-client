'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PlusCircle, Image as ImageIcon, MapPin, Users, DollarSign, Clock, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { API_URL } from '@/config';

const SPORT_TYPES = ['Football', 'Cricket', 'Badminton', 'Swimming', 'Tennis', 'Basketball'];

const TIME_SLOTS = [
    "08:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
    "06:00 PM - 08:00 PM",
    "08:00 PM - 10:00 PM"
];

export default function AddFacilityPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [name, setName] = useState('');
    const [type, setType] = useState('Football');
    const [location, setLocation] = useState('');
    const [pricePerHour, setPricePerHour] = useState('');
    const [capacity, setCapacity] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedSlots, setSelectedSlots] = useState([]);
    
    const [uploadingImage, setUploadingImage] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            toast.error('Please log in first to add a facility!');
            router.push('/login?redirect=/add-facility');
        }
    }, [user, authLoading, router]);

    const handleSlotToggle = (slot) => {
        if (selectedSlots.includes(slot)) {
            setSelectedSlots(selectedSlots.filter(s => s !== slot));
        } else {
            setSelectedSlots([...selectedSlots, slot]);
        }
    };

    // Imgbb image upload logic
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            // Using a standard free key for client uploads
            const res = await fetch('https://api.imgbb.com/1/upload?key=b87b7a695d736735e2365bf6031dd9ec', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setImageUrl(data.data.url);
                toast.success('Image uploaded successfully!');
            } else {
                toast.error('Could not upload image! Please provide a manual image URL.');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            toast.error('Network error during image upload!');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !location || !pricePerHour || !capacity) {
            toast.error('Please fill in all required fields!');
            return;
        }

        if (selectedSlots.length === 0) {
            toast.error('Please select at least one available slot!');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/facilities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    facility_type: type,
                    location,
                    price_per_hour: parseFloat(pricePerHour),
                    capacity: parseInt(capacity),
                    available_slots: selectedSlots,
                    image_url: imageUrl || 'https://images.unsplash.com/photo-1540747737956-37872404a87a?w=800&q=80',
                    description,
                    owner_email: user.email // Auto-filled from AuthContext
                }),
                credentials: 'include'
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Facility added successfully!');
                router.push('/manage-facilities');
            } else {
                toast.error(data.message || 'Could not add facility!');
            }
        } catch (error) {
            console.error('Error creating facility:', error);
            toast.error('Server connection error!');
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex-grow flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex-grow max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    Add New <span className="accent-gradient-text">Facility</span>
                </h1>
                <p className="text-muted text-sm sm:text-base">Provide details of your venue to list it for booking.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form Column */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-7 glass border border-glass-border p-6 sm:p-8 rounded-2xl shadow-lg"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider block">
                                    Facility Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors duration-200">
                                        <PlusCircle className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Premium Football Turf"
                                        className="block w-full pl-10 pr-4 py-3 rounded-xl border border-glass-border bg-card/25 text-foreground placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200 text-sm shadow-sm hover:bg-card/40"
                                    />
                                </div>
                            </div>

                            {/* Type */}
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider block">
                                    Sport Type <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-3 rounded-xl border border-glass-border bg-card/25 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200 text-sm shadow-sm appearance-none cursor-pointer hover:bg-card/40"
                                    >
                                        {SPORT_TYPES.map((t) => (
                                            <option key={t} value={t} className="bg-card text-foreground">
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider block">
                                    Venue Location <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors duration-200">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. Dhanmondi 15, Dhaka"
                                        className="block w-full pl-10 pr-4 py-3 rounded-xl border border-glass-border bg-card/25 text-foreground placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200 text-sm shadow-sm hover:bg-card/40"
                                    />
                                </div>
                            </div>

                            {/* Capacity */}
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider block">
                                    Capacity (Persons) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors duration-200">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={capacity}
                                        onChange={(e) => setCapacity(e.target.value)}
                                        placeholder="e.g. 14"
                                        className="block w-full pl-10 pr-4 py-3 rounded-xl border border-glass-border bg-card/25 text-foreground placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200 text-sm shadow-sm hover:bg-card/40"
                                    />
                                </div>
                            </div>

                            {/* Price per hour */}
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider block">
                                    Price Per Hour (৳) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors duration-200">
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="number"
                                        required
                                        min="100"
                                        value={pricePerHour}
                                        onChange={(e) => setPricePerHour(e.target.value)}
                                        placeholder="e.g. 1200"
                                        className="block w-full pl-10 pr-4 py-3 rounded-xl border border-glass-border bg-card/25 text-foreground placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200 text-sm shadow-sm hover:bg-card/40"
                                    />
                                </div>
                            </div>                            {/* Image Upload */}
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider block">
                                    Upload Venue Image
                                </label>
                                <div className="relative border-2 border-dashed border-glass-border hover:border-primary/30 rounded-xl p-4 bg-card/15 hover:bg-card/25 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer min-h-[92px] group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex flex-col items-center space-y-2 text-center pointer-events-none">
                                        {uploadingImage ? (
                                            <>
                                                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-xs font-medium text-muted">Uploading to ImgBB...</p>
                                            </>
                                        ) : imageUrl ? (
                                            <>
                                                <div className="p-2 rounded-full bg-success/15 text-success">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <p className="text-xs font-semibold text-success">Image Uploaded!</p>
                                                <p className="text-[10px] text-muted">Click or drag to change image</p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="p-2 rounded-full bg-primary/5 text-primary group-hover:scale-110 transition-transform duration-200">
                                                    <ImageIcon className="w-5 h-5" />
                                                </div>
                                                <p className="text-xs font-semibold text-foreground">Drag & drop or click</p>
                                                <p className="text-[10px] text-muted">Supports JPEG, PNG, WEBP</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Manual Image URL if upload fails */}
                        <div className="space-y-2 group">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider block">
                                Or Provide Direct Image URL
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors duration-200">
                                    <ImageIcon className="w-4 h-4" />
                                </div>
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://images.unsplash.com/photo-..."
                                    className="block w-full pl-10 pr-4 py-3 rounded-xl border border-glass-border bg-card/25 text-foreground placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200 text-sm shadow-sm hover:bg-card/40"
                                />
                            </div>
                            {imageUrl && (
                                <div className="mt-3 flex items-center space-x-3 p-2.5 rounded-xl bg-glass-border/5 border border-glass-border/30 max-w-sm">
                                    <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-glass-border shadow-inner flex-shrink-0">
                                        <img src={imageUrl} alt="Mini Preview" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold text-foreground truncate">Selected Image</p>
                                        <span className="text-[10px] text-muted flex items-center">
                                            <span className="w-1.5 h-1.5 rounded-full bg-success mr-1"></span> Ready to list
                                        </span>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setImageUrl('')}
                                        className="text-muted hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-xs font-medium"
                                    >
                                        Clear
                                    </button>
                                </div>
                            )}
                        </div>                        {/* Available Time Slots */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider block flex items-center">
                                <Clock className="w-4 h-4 mr-1.5 text-primary/70" />
                                Available Time Slots <span className="text-red-500 ml-0.5">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {TIME_SLOTS.map((slot) => {
                                    const selected = selectedSlots.includes(slot);
                                    return (
                                        <button
                                            type="button"
                                            key={slot}
                                            onClick={() => handleSlotToggle(slot)}
                                            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer flex items-center space-x-1.5 ${
                                                selected
                                                    ? 'bg-primary text-background border-transparent shadow-md scale-98'
                                                    : 'glass border-glass-border hover:bg-glass-border/30 text-muted hover:text-foreground'
                                            }`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${selected ? 'bg-background' : 'bg-muted/50'}`}></span>
                                            <span>{slot}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2 group">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider block">
                                Facility Description
                            </label>
                            <div className="relative">
                                <div className="absolute top-3.5 left-3.5 text-muted pointer-events-none">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <textarea
                                    rows="4"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe facility amenities, rules, parking, and details..."
                                    className="block w-full pl-10 pr-4 py-3 rounded-xl border border-glass-border bg-card/25 text-foreground placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200 text-sm shadow-sm hover:bg-card/40 resize-none"
                                />
                            </div>
                        </div>

                        {/* Auto-filled owner info */}
                        <div className="p-4 rounded-xl bg-glass-border/10 border border-glass-border text-xs text-muted">
                            Owner Email: <strong className="text-foreground">{user.email}</strong> (Auto-filled)
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 rounded-xl bg-primary text-background hover:bg-primary-hover font-extrabold text-sm shadow-lg hover:shadow-xl active:scale-98 transition-all duration-200 flex justify-center items-center cursor-pointer group"
                        >
                            {submitting ? (
                                <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <span className="flex items-center justify-center space-x-1.5">
                                    <span>List My Venue</span>
                                    <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* Preview Column */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="lg:col-span-5 lg:sticky lg:top-24 space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted tracking-widest uppercase">Live Preview</span>
                        <div className="flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                            <span className="text-2xs font-semibold text-success uppercase">Auto Syncing</span>
                        </div>
                    </div>

                    <div className="glass border border-glass-border rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-primary/20 group">
                        {/* Image Preview Container */}
                        <div className="relative h-56 w-full overflow-hidden bg-muted/10">
                            <img
                                src={imageUrl || 'https://images.unsplash.com/photo-1540747737956-37872404a87a?w=800&q=80'}
                                alt="Facility Preview"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
                            
                            {/* Sport Type Badge */}
                            <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-background/80 backdrop-blur-md border border-glass-border text-foreground shadow-sm">
                                {type}
                            </span>
                        </div>

                        {/* Details */}
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-foreground line-clamp-1 group-hover:accent-gradient-text transition-colors">
                                    {name || 'Your Premium Venue Name'}
                                </h3>
                                <p className="text-sm text-muted flex items-center">
                                    <MapPin className="w-3.5 h-3.5 mr-1 text-primary/75" />
                                    {location || 'Dhanmondi, Dhaka'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-3 border-y border-glass-border/50 text-xs">
                                <div className="space-y-0.5">
                                    <span className="text-muted block font-medium">Capacity</span>
                                    <span className="font-semibold text-foreground flex items-center">
                                        <Users className="w-3.5 h-3.5 mr-1 text-primary/75" />
                                        {capacity ? `${capacity} Persons` : '--'}
                                    </span>
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-muted block font-medium">Price / Hour</span>
                                    <span className="font-semibold text-foreground flex items-center text-sm">
                                        <DollarSign className="w-3.5 h-3.5 mr-0.5 text-primary/75" />
                                        <span className="text-base font-bold text-foreground">{pricePerHour || '0'}</span>
                                        <span className="text-2xs text-muted font-normal ml-0.5">৳</span>
                                    </span>
                                </div>
                            </div>

                            {/* Description preview */}
                            {description && (
                                <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                                    {description}
                                </p>
                            )}

                            {/* Selected Slots preview */}
                            <div className="space-y-1.5">
                                <span className="text-2xs font-bold text-muted uppercase tracking-wider block">Available Slots ({selectedSlots.length})</span>
                                {selectedSlots.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {selectedSlots.map((slot) => (
                                            <span key={slot} className="px-2 py-0.5 rounded-lg text-3xs font-medium bg-primary/10 text-primary border border-primary/20">
                                                {slot.split(' - ')[0]}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-3xs text-muted italic">No slots selected yet</span>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

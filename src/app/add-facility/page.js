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
        <div className="flex-grow max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Add New Facility</h1>
                <p className="text-muted text-sm sm:text-base">Provide details of your venue to list it for booking.</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass border border-glass-border p-8 rounded-2xl shadow-lg"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-muted flex items-center">
                                <PlusCircle className="w-4 h-4 mr-1.5 text-primary" />
                                Facility Name
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Premium Football Turf Dhanmondi"
                                className="block w-full px-3 py-2.5 rounded-xl border border-card-border bg-card/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                            />
                        </div>

                        {/* Type */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-muted flex items-center">
                                <Clock className="w-4 h-4 mr-1.5 text-primary" />
                                Sport Type
                            </label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="block w-full px-3 py-2.5 rounded-xl border border-card-border bg-card/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                            >
                                {SPORT_TYPES.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Location */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-muted flex items-center">
                                <MapPin className="w-4 h-4 mr-1.5 text-primary" />
                                Venue Location (Address)
                            </label>
                            <input
                                type="text"
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. Dhanmondi 15, Dhaka"
                                className="block w-full px-3 py-2.5 rounded-xl border border-card-border bg-card/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                            />
                        </div>

                        {/* Capacity */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-muted flex items-center">
                                <Users className="w-4 h-4 mr-1.5 text-primary" />
                                Capacity (Persons)
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                placeholder="e.g. 14"
                                className="block w-full px-3 py-2.5 rounded-xl border border-card-border bg-card/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                            />
                        </div>

                        {/* Price per hour */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-muted flex items-center">
                                <DollarSign className="w-4 h-4 mr-1.5 text-primary" />
                                Price Per Hour (৳)
                            </label>
                            <input
                                type="number"
                                required
                                min="100"
                                value={pricePerHour}
                                onChange={(e) => setPricePerHour(e.target.value)}
                                placeholder="e.g. 1200"
                                className="block w-full px-3 py-2.5 rounded-xl border border-card-border bg-card/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-muted flex items-center">
                                <ImageIcon className="w-4 h-4 mr-1.5 text-primary" />
                                Upload Image (ImgBB)
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="block w-full text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                />
                                {uploadingImage && (
                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin self-center"></div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Manual Image URL if upload fails */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted block">Image URL (Direct link if you do not upload)</label>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/photo.jpg"
                            className="block w-full px-3 py-2 rounded-xl border border-card-border bg-card/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                        />
                        {imageUrl && (
                            <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-glass-border">
                                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    {/* Available Time Slots */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted flex items-center">
                            <Clock className="w-4 h-4 mr-1.5 text-primary" />
                            Available Slots (Select at least one)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {TIME_SLOTS.map((slot) => {
                                const selected = selectedSlots.includes(slot);
                                return (
                                    <button
                                        type="button"
                                        key={slot}
                                        onClick={() => handleSlotToggle(slot)}
                                        className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                                            selected
                                                ? 'bg-primary text-background border-transparent'
                                                : 'glass border-glass-border hover:bg-glass-border/30 text-muted'
                                        }`}
                                    >
                                        {slot}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted flex items-center">
                            <FileText className="w-4 h-4 mr-1.5 text-primary" />
                            Facility Description
                        </label>
                        <textarea
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe facility amenities, rules, and details..."
                            className="block w-full px-3 py-2.5 rounded-xl border border-card-border bg-card/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                        />
                    </div>

                    {/* Auto-filled owner info */}
                    <div className="p-4 rounded-xl bg-glass-border/10 border border-glass-border text-xs text-muted">
                        Owner Email: <strong className="text-foreground">{user.email}</strong> (Auto-filled)
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3.5 rounded-xl bg-primary text-background hover:bg-primary-hover font-bold text-sm shadow-md transition-all duration-200 flex justify-center items-center cursor-pointer"
                    >
                        {submitting ? (
                            <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            'Add Facility'
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

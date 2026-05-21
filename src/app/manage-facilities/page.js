'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Edit, Trash2, MapPin, Users, DollarSign, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function ManageFacilitiesPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states for editing
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editFacilityId, setEditFacilityId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editType, setEditType] = useState('Football');
    const [editLocation, setEditLocation] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editCapacity, setEditCapacity] = useState('');
    const [editSlots, setEditSlots] = useState([]);
    const [editDescription, setEditDescription] = useState('');
    const [editImageUrl, setEditImageUrl] = useState('');
    const [editSubmitting, setEditSubmitting] = useState(false);

    const fetchOwnerFacilities = async () => {
        try {
            const res = await fetch(`${API_URL}/facilities`);
            if (res.ok) {
                const data = await res.json();
                // Filter client-side by owner_email to show only owner's items
                const ownerItems = data.filter(item => item.owner_email === user.email);
                setFacilities(ownerItems);
            }
        } catch (error) {
            console.error('Error fetching owner facilities:', error);
            toast.error('Server connection error!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && !user) {
            toast.error('Please log in first to access the management dashboard!');
            router.push('/login?redirect=/manage-facilities');
            return;
        }

        if (user) {
            fetchOwnerFacilities();
        }
    }, [user, authLoading, router]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this facility? This will also remove all associated bookings!');
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${API_URL}/facilities/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (res.ok) {
                setFacilities(facilities.filter(f => f._id !== id));
                toast.success('Facility deleted successfully!');
            } else {
                const data = await res.json();
                toast.error(data.message || 'Could not delete facility!');
            }
        } catch (error) {
            console.error('Error deleting facility:', error);
            toast.error('Server connection error!');
        }
    };

    const openEditModal = (facility) => {
        setEditFacilityId(facility._id);
        setEditName(facility.name);
        setEditType(facility.facility_type);
        setEditLocation(facility.location);
        setEditPrice(facility.price_per_hour);
        setEditCapacity(facility.capacity);
        setEditSlots(facility.available_slots || []);
        setEditDescription(facility.description || '');
        setEditImageUrl(facility.image_url || '');
        setIsEditOpen(true);
    };

    const handleEditSlotToggle = (slot) => {
        if (editSlots.includes(slot)) {
            setEditSlots(editSlots.filter(s => s !== slot));
        } else {
            setEditSlots([...editSlots, slot]);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        if (editSlots.length === 0) {
            toast.error('Please select at least one available slot!');
            return;
        }

        setEditSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/facilities/${editFacilityId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: editName,
                    facility_type: editType,
                    location: editLocation,
                    price_per_hour: parseFloat(editPrice),
                    capacity: parseInt(editCapacity),
                    available_slots: editSlots,
                    description: editDescription,
                    image_url: editImageUrl
                }),
                credentials: 'include'
            });

            if (res.ok) {
                toast.success('Facility details updated successfully!');
                setIsEditOpen(false);
                fetchOwnerFacilities(); // reload list
            } else {
                const data = await res.json();
                toast.error(data.message || 'Could not update facility details!');
            }
        } catch (error) {
            console.error('Error updating facility:', error);
            toast.error('Server connection error!');
        } finally {
            setEditSubmitting(false);
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Manage Your Facilities</h1>
                    <p className="text-muted text-sm sm:text-base">Update or delete sports venues you have listed.</p>
                </div>
                <button
                    onClick={() => router.push('/add-facility')}
                    className="self-start sm:self-center px-5 py-3 rounded-xl bg-primary text-background hover:bg-primary-hover font-semibold text-sm shadow-md transition-all duration-200 cursor-pointer"
                >
                    Add New Facility
                </button>
            </div>

            {facilities.length === 0 ? (
                <div className="text-center py-20 rounded-2xl glass border border-glass-border space-y-4">
                    <p className="text-lg text-muted font-medium">No listed facilities found under your account!</p>
                    <p className="text-sm text-muted">Get started by adding a sports facility.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl glass border border-glass-border shadow-lg">
                    <table className="min-w-full divide-y divide-glass-border/40">
                        <thead className="bg-glass-border/10">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider">
                                    Facility
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider">
                                    Location
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider">
                                    Capacity
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider">
                                    Price / Hr
                                </th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-muted uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-glass-border/30">
                            {facilities.map((facility, index) => (
                                <tr key={facility._id} className="hover:bg-glass-border/10 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-glass-border/40 shadow-sm">
                                                <img 
                                                    src={facility.image_url || 'https://images.unsplash.com/photo-1540747737956-37872404a87a?w=800&auto=format&fit=crop&q=60'} 
                                                    alt={facility.name} 
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = 'https://images.unsplash.com/photo-1540747737956-37872404a87a?w=800&auto=format&fit=crop&q=60';
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-foreground text-sm line-clamp-1">
                                                    {facility.name}
                                                </span>
                                                <span className="inline-flex self-start items-center px-2 py-0.5 mt-1 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                                                    {facility.facility_type}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2 text-sm text-muted font-medium">
                                            <MapPin className="w-4 h-4 text-primary shrink-0" />
                                            <span className="line-clamp-1">{facility.location}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2 text-sm text-muted font-medium">
                                            <Users className="w-4 h-4 text-primary shrink-0" />
                                            <span>{facility.capacity} Persons</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-1.5 text-sm font-semibold text-foreground">
                                            <DollarSign className="w-4 h-4 text-primary shrink-0" />
                                            <span>৳ {facility.price_per_hour} <span className="text-[10px] text-muted font-medium">/ hr</span></span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2.5">
                                            <button
                                                onClick={() => openEditModal(facility)}
                                                className="p-2 px-3 rounded-xl border border-glass-border hover:bg-primary/10 hover:text-primary hover:border-primary/30 text-muted transition-all duration-200 flex items-center cursor-pointer"
                                                title="Edit Facility"
                                            >
                                                <Edit className="w-4 h-4" />
                                                <span className="hidden sm:inline ml-1.5 text-xs font-bold">Edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(facility._id)}
                                                className="p-2 px-3 rounded-xl border border-red-500/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 text-red-400 transition-all duration-200 flex items-center cursor-pointer"
                                                title="Delete Facility"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span className="hidden sm:inline ml-1.5 text-xs font-bold">Delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit modal dialog */}
            <AnimatePresence>
                {isEditOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        ></motion.div>

                        {/* Modal Body */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 25 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 25 }}
                            className="bg-card glass border border-glass-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative z-10 overflow-y-auto max-h-[90vh] space-y-4"
                        >
                            <div className="flex justify-between items-center pb-3 border-b border-glass-border/40">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-foreground">Edit Facility Information</h3>
                                    <p className="text-xs text-muted">Update your listed venue settings.</p>
                                </div>
                                <button
                                    onClick={() => setIsEditOpen(false)}
                                    className="p-1.5 rounded-full hover:bg-glass-border/30 text-muted hover:text-foreground transition-colors cursor-pointer border border-transparent hover:border-glass-border"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-5 pt-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-muted uppercase tracking-wider">Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-glass-border bg-glass-border/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-muted uppercase tracking-wider">Sport Type</label>
                                        <select
                                            value={editType}
                                            onChange={(e) => setEditType(e.target.value)}
                                            className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-glass-border bg-glass-border/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                                        >
                                            {SPORT_TYPES.map((t) => (
                                                <option key={t} value={t} className="bg-card text-foreground">
                                                    {t}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-muted uppercase tracking-wider">Location</label>
                                        <input
                                            type="text"
                                            required
                                            value={editLocation}
                                            onChange={(e) => setEditLocation(e.target.value)}
                                            className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-glass-border bg-glass-border/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-muted uppercase tracking-wider">Capacity (Persons)</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={editCapacity}
                                            onChange={(e) => setEditCapacity(e.target.value)}
                                            className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-glass-border bg-glass-border/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-muted uppercase tracking-wider">Price Per Hour (৳)</label>
                                        <input
                                            type="number"
                                            required
                                            min="100"
                                            value={editPrice}
                                            onChange={(e) => setEditPrice(e.target.value)}
                                            className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-glass-border bg-glass-border/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-muted uppercase tracking-wider">Image URL</label>
                                        <input
                                            type="text"
                                            value={editImageUrl}
                                            onChange={(e) => setEditImageUrl(e.target.value)}
                                            placeholder="https://images.unsplash.com/photo-..."
                                            className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-glass-border bg-glass-border/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                {editImageUrl && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-muted uppercase block tracking-wider">Image Preview</label>
                                        <div className="w-full h-32 rounded-xl overflow-hidden border border-glass-border relative shadow-inner">
                                            <img
                                                src={editImageUrl}
                                                alt="Edit Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1540747737956-37872404a87a?w=800&q=80';
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Edit Available slots */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted uppercase block tracking-wider">Available Slots</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {TIME_SLOTS.map((slot) => {
                                            const selected = editSlots.includes(slot);
                                            return (
                                                <button
                                                    type="button"
                                                    key={slot}
                                                    onClick={() => handleEditSlotToggle(slot)}
                                                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                                                        selected
                                                            ? 'bg-primary text-background border-transparent shadow-md shadow-primary/25 scale-[1.02]'
                                                            : 'glass border-glass-border hover:bg-glass-border/30 text-muted'
                                                    }`}
                                                >
                                                    {slot}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-muted uppercase tracking-wider">Description</label>
                                    <textarea
                                        rows="3"
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-glass-border bg-glass-border/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={editSubmitting}
                                    className="w-full mt-4 py-3.5 rounded-xl bg-primary text-background hover:bg-primary-hover font-extrabold text-sm shadow-md transition-all duration-200 flex justify-center items-center cursor-pointer shadow-primary/25 active:scale-[0.99]"
                                >
                                    {editSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        'Update Facility'
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

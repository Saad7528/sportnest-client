import React from 'react';

export default function Loading() {
    return (
        <div className="flex-grow flex items-center justify-center min-h-[60vh] bg-background">
            <div className="flex flex-col items-center space-y-4 p-8 rounded-2xl glass shadow-md max-w-sm w-full text-center">
                <div className="relative w-16 h-16">
                    {/* Ring loader */}
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-secondary animate-spin"></div>
                </div>
                <h3 className="text-lg font-bold text-foreground">Loading...</h3>
                <p className="text-sm text-muted">Please wait a moment.</p>
            </div>
        </div>
    );
}

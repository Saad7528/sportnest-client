import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-card-border glass bg-card/10 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand Info */}
                    <div className="space-y-3">
                        <span className="text-lg font-bold tracking-tight text-foreground">
                            Sport<span className="text-primary font-black">Nest</span>
                        </span>
                        <p className="text-xs text-muted leading-relaxed">
                            Discover and book premium sports facilities and turfs near you. We connect athletes with high-quality venues for a seamless play experience.
                        </p>
                    </div>

                    {/* Quick Contacts */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold tracking-wider uppercase text-foreground">Contact Us</h3>
                        <ul className="space-y-2 text-xs text-muted">
                            <li>Email: Saad0174742@gmail.com</li>
                            <li>Phone: +880 1851192657</li>
                            <li>Address: Dhaka, Bangladesh</li>
                        </ul>
                    </div>

                    {/* Social links with rebranded X icon */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold tracking-wider uppercase text-foreground">Connect</h3>
                        <div className="flex space-x-4">
                            {/* Facebook */}
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                            
                            {/* Instagram */}
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.008 3.752.052 2.73.124 4.093 1.528 4.218 4.219.043.966.051 1.32.051 3.75 0 2.43-.008 2.784-.051 3.752-.124 2.73-1.528 4.093-4.219 4.218-.966.043-1.32.051-3.75.051-2.43 0-2.784-.008-3.752-.052-2.73-.124-4.093-1.528-4.218-4.219-.043-.966-.051-1.32-.051-3.75 0-2.43.008-2.784.051-3.752.124-2.73 1.528-4.093 4.219-4.218.966-.043 1.32-.051 3.75-.051 2.43 0 2.784.008 3.752.052zm-1.04 19.948v-2.023a8.12 8.12 0 01-.075-1.019c0-.07-.01-.137-.01-.205h-1.282c-.208.572-.378 1.157-.506 1.758a9.49 9.49 0 001.873 1.489zm1.04 0a9.49 9.49 0 001.873-1.49 8.136 8.136 0 01-.506-1.758h-1.282c0 .068-.01.135-.01.205 0 .344-.025.684-.075 1.019v2.024zM12 8a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
                                </svg>
                            </a>

                            {/* X / Twitter (New Rebranded X Icon) */}
                            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors">
                                <span className="sr-only">X (Twitter)</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-glass-border pt-6 flex justify-between items-center flex-col sm:flex-row gap-4">
                    <p className="text-xs text-muted">
                        &copy; {new Date().getFullYear()} SportNest. All rights reserved.
                    </p>
                    <div className="flex space-x-4">
                        <Link href="/privacy" className="text-[10px] uppercase font-bold text-muted hover:text-foreground tracking-wider">Privacy Policy</Link>
                        <Link href="/terms" className="text-[10px] uppercase font-bold text-muted hover:text-foreground tracking-wider">Terms & Conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

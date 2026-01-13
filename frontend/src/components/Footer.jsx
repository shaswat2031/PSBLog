import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="relative bg-stone-900 text-stone-300 py-16 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-purple-500 to-amber-500"></div>
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <Link to="/" className="inline-block">
                            <h2 className="text-2xl font-serif font-bold text-white">
                                PS <span className="text-teal-500">Blogs</span>
                            </h2>
                        </Link>
                        <p className="text-stone-400 max-w-sm leading-relaxed">
                            Your personal journal for technology insights, programming wisdom, and modern web development.
                            Crafted with passion for knowledge sharing.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="hover:text-teal-400 transition-colors block py-1">Home</Link>
                            </li>
                            <li>
                                <Link to="/blogs" className="hover:text-teal-400 transition-colors block py-1">All Articles</Link>
                            </li>
                            <li>
                                <Link to="/admin" className="hover:text-teal-400 transition-colors block py-1">Admin Portal</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Connect</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="https://www.prasadshaswat.tech" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors block py-1 flex items-center gap-2">
                                    <span>Portfolio</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/in/shaswat-prasad-14b147266/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors block py-1 flex items-center gap-2">
                                    <span>LinkedIn</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-stone-500">
                        &copy; {new Date().getFullYear()} Prasad Shaswat. All rights reserved.
                    </p>
                    <div className="text-stone-600 text-sm font-light">
                        Designed & Built with <span className="text-red-500">❤</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer

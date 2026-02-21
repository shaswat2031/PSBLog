import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="relative bg-stone-900 text-stone-300 py-20 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 via-blue-500 via-purple-500 to-amber-500"></div>
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] translate-y-1/2"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-12 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="md:col-span-5 space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
                                Prashant Singh
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className="h-[1px] w-8 bg-teal-500"></span>
                                <h3 className="text-xl font-serif font-bold text-stone-100">
                                    PS <span className="text-teal-500">Blogs</span>
                                </h3>
                            </div>
                        </div>
                        <p className="text-stone-400 max-w-sm text-lg leading-relaxed font-light">
                            Your personal journal for technology insights, programming wisdom, and modern web development.
                            Crafted with passion for knowledge sharing.
                        </p>
                    </div>

                    {/* Links Sections Container */}
                    <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                        {/* Quick Links */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500">Quick Links</h4>
                            <ul className="space-y-4">
                                <li>
                                    <Link to="/" className="text-stone-300 hover:text-teal-400 transition-all duration-300 flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-[1px] bg-teal-400 mr-0 group-hover:mr-2 transition-all"></span>
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/blogs" className="text-stone-300 hover:text-teal-400 transition-all duration-300 flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-[1px] bg-teal-400 mr-0 group-hover:mr-2 transition-all"></span>
                                        All Articles
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin" className="text-stone-300 hover:text-teal-400 transition-all duration-300 flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-[1px] bg-teal-400 mr-0 group-hover:mr-2 transition-all"></span>
                                        Admin Portal
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Connect */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500">Connect</h4>
                            <ul className="space-y-4">
                                <li>
                                    <a href="https://www.prasadshaswat.tech" target="_blank" rel="noopener noreferrer" className="text-stone-300 hover:text-teal-400 transition-all duration-300 flex items-center gap-2 group">
                                        <span>Portfolio</span>
                                        <svg className="w-4 h-4 transform group-hover:-rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.linkedin.com/in/shaswat-prasad-14b147266/" target="_blank" rel="noopener noreferrer" className="text-stone-300 hover:text-teal-400 transition-all duration-300 flex items-center gap-2 group">
                                        <span>LinkedIn</span>
                                        <svg className="w-4 h-4 transform group-hover:-rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-stone-500 text-sm font-medium">
                        &copy; {new Date().getFullYear()} Prasad Shaswat. All rights reserved.
                    </p>
                    <div className="px-5 py-2 bg-stone-800/50 rounded-full border border-white/5 text-stone-500 text-sm font-light">
                        Designed & Built with <span className="text-rose-500 animate-pulse inline-block mx-1 text-base">❤</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer

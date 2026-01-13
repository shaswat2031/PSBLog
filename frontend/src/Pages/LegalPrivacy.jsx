import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".header-animate", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1
        }).from(".content-section", {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1
        }, "-=0.4");

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-stone-50 relative overflow-hidden pt-32 pb-20 px-6 sm:px-12">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-200/20 rounded-full blur-[100px] mix-blend-multiply opacity-60"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-[100px] mix-blend-multiply opacity-60"></div>
            </div>

            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-stone-100 p-8 md:p-12 lg:p-16 relative z-10">
                <div className="header-animate mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-stone-100 text-stone-500 text-xs font-bold tracking-wider uppercase mb-6">
                        Legal
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6 tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-stone-500 font-light leading-relaxed max-w-2xl">
                        At Shaswat Blog, we value your privacy. This policy details how we handle your data, including cookies, analytics, and your rights.
                    </p>
                    <div className="mt-8 w-20 h-1 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"></div>
                </div>

                <div ref={contentRef} className="space-y-12 text-stone-600 leading-loose">
                    <section className="content-section">
                        <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4">1. Information We Collect</h2>
                        <p className="mb-4">
                            We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us. This may include:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 marker:text-teal-500">
                            <li>Name and contact information (email address).</li>
                            <li>Account credentials (username and password).</li>
                            <li>Comments and other innovative content you post.</li>
                        </ul>
                    </section>

                    <section className="content-section">
                        <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4">2. Usage of Cookies & Analytics</h2>
                        <p>
                            We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
                        </p>
                        <p className="mt-4">
                            We may use third-party Service Providers to monitor and analyze the use of our Service (e.g., Google Analytics) to improve user experience.
                        </p>
                    </section>

                    <section className="content-section">
                        <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4">3. Data Usage & Protection</h2>
                        <p>
                            We use the collected data for various purposes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-teal-500">
                            <li>To provide and maintain our Service.</li>
                            <li>To notify you about changes to our Service.</li>
                            <li>To allow you to participate in interactive features when you choose to do so.</li>
                            <li>To provide customer support.</li>
                            <li>To gather analysis or valuable information so that we can improve our Service.</li>
                        </ul>
                        <p className="mt-4">
                            We do not sell your personal data. We implement appropriate technical measures to protect your personal information against unauthorized access or disclosure.
                        </p>
                    </section>

                    <section className="content-section">
                        <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4">4. Updates to This Policy</h2>
                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                        </p>
                    </section>

                    <section className="content-section pt-8 border-t border-stone-100">
                        <p className="text-sm text-stone-400">
                            Last updated: January 2026
                        </p>
                        <div className="mt-8 flex gap-4">
                            <Link to="/" className="text-teal-600 font-medium hover:text-teal-700 underline underline-offset-4 decoration-2">
                                Back to Home
                            </Link>
                            <span className="text-stone-300">|</span>
                            <Link to="/contact" className="text-stone-500 hover:text-stone-800 transition-colors">
                                Contact Support
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

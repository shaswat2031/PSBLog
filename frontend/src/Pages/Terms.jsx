import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

const Terms = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".header-animate", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1
        }).from(".term-block", {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1
        }, "-=0.4");

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-stone-50 relative overflow-hidden pt-32 pb-20 px-6 sm:px-12">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[10%] left-[-5%] w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-[120px] mix-blend-multiply opacity-50"></div>
                <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-teal-200/20 rounded-full blur-[100px] mix-blend-multiply opacity-50"></div>
            </div>

            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-stone-100 p-8 md:p-12 lg:p-16 relative z-10">
                <div className="header-animate mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-stone-100 text-stone-500 text-xs font-bold tracking-wider uppercase mb-6">
                        Agreement
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6 tracking-tight">
                        Terms and Conditions
                    </h1>
                    <p className="text-lg text-stone-500 font-light leading-relaxed max-w-2xl">
                        Welcome to Shaswat Blog. Please read these terms carefully before using our services. By accessing our blog, you agree to be bound by these terms.
                    </p>
                    <div className="mt-8 w-20 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
                </div>

                <div className="space-y-12 text-stone-600 leading-loose">
                    <div className="term-block">
                        <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-sm font-sans text-stone-400">1</span>
                            Acceptance of Terms
                        </h2>
                        <p>
                            By accessing or using Shaswat Blog, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree with any part of these terms, you may not access the service.
                        </p>
                    </div>

                    <div className="term-block">
                        <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-sm font-sans text-stone-400">2</span>
                            Intellectual Property
                        </h2>
                        <p>
                            The Service and its original content, features, and functionality are and will remain the exclusive property of Shaswat Blog and its licensors. Our content is protected by copyright, trademark, and other laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                        </p>
                    </div>

                    <div className="term-block">
                        <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-sm font-sans text-stone-400">3</span>
                            User Comments & Content
                        </h2>
                        <p>
                            Users may post comments and other content as long as the content is not illegal, obscene, threatening, defamatory, invasive of privacy, infringing of intellectual property rights, or otherwise injurious to third parties. We reserve the right (but not the obligation) to remove or edit such content.
                        </p>
                    </div>

                    <div className="term-block">
                        <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-sm font-sans text-stone-400">4</span>
                            Limitation of Liability
                        </h2>
                        <p>
                            In no event shall Shaswat Blog, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                        </p>
                    </div>

                    <div className="term-block">
                        <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-sm font-sans text-stone-400">5</span>
                            Governing Law
                        </h2>
                        <p>
                            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                        </p>
                    </div>

                    <div className="term-block pt-8 border-t border-stone-100">
                        <div className="flex flex-wrap gap-6 items-center">
                            <Link to="/" className="px-8 py-3 bg-stone-900 text-white rounded-full hover:bg-black transition-all shadow-lg hover:-translate-y-1 font-medium">
                                I Agree
                            </Link>
                            <Link to="/" className="text-stone-500 hover:text-stone-800 font-medium">
                                Decline & Go Back
                            </Link>
                        </div>
                        <p className="text-sm text-stone-400 mt-6">
                            Last updated: January 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;

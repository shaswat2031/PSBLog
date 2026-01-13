import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const NotFound = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "elastic.out(1, 0.5)" } });

        tl.from(".code-404", {
            scale: 0.5,
            opacity: 0,
            duration: 1.5,
            y: 50
        })
            .from(".content-fade", {
                opacity: 0,
                y: 20,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            }, "-=1");

        // Floating animation for the 404
        gsap.to(".floating-shape", {
            y: "random(-20, 20)",
            x: "random(-20, 20)",
            rotation: "random(-10, 10)",
            duration: "random(3, 5)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.5
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-stone-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="floating-shape absolute top-[20%] left-[20%] w-32 h-32 bg-teal-200/40 rounded-full blur-xl mix-blend-multiply"></div>
                <div className="floating-shape absolute bottom-[20%] right-[20%] w-40 h-40 bg-purple-200/40 rounded-full blur-xl mix-blend-multiply"></div>
                <div className="floating-shape absolute top-[60%] left-[60%] w-24 h-24 bg-amber-200/40 rounded-full blur-xl mix-blend-multiply"></div>
            </div>

            <div className="text-center relative z-10 max-w-2xl mx-auto">
                <div className="code-404 font-serif font-bold text-[10rem] md:text-[14rem] leading-none text-transparent bg-clip-text bg-gradient-to-br from-stone-800 to-stone-400 opacity-90 select-none">
                    404
                </div>

                <h2 className="content-fade text-3xl md:text-4xl font-bold text-stone-800 mb-6 font-serif">
                    Page Not Found
                </h2>

                <p className="content-fade text-lg text-stone-500 mb-10 max-w-md mx-auto leading-relaxed">
                    Oops! It seems you've wandered into the void. The page you are looking for doesn't exist or has been moved.
                </p>

                <div className="content-fade flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        to="/"
                        className="px-8 py-3 bg-stone-900 text-white rounded-full hover:bg-black hover:shadow-lg transition-all transform hover:-translate-y-1 font-medium w-full sm:w-auto"
                    >
                        Back to Home
                    </Link>
                    <Link
                        to="/blogs"
                        className="px-8 py-3 bg-white text-stone-800 border border-stone-200 rounded-full hover:bg-stone-50 hover:border-stone-300 transition-all font-medium w-full sm:w-auto"
                    >
                        Read Articles
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;

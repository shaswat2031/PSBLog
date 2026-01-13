import React, { useRef } from 'react'
import profile from '../assets/profile.png'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const Aboutme = () => {
  const containerRef = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })

    tl.from('.about-content > *', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    })

    tl.from('.skill-card', {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    }, '-=0.4')

    tl.from('.profile-image', {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, 0)

  }, { scope: containerRef })

  return (
    <section ref={containerRef} id="about" className="py-16">
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-16 shadow-xl border border-white/50 relative overflow-hidden">

        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-100/50 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 order-2 md:order-1 about-content">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-6 relative inline-block">
                About the Author
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-teal-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </h2>
            </div>

            <div className="space-y-6 text-lg text-stone-600 leading-relaxed font-light">
              <p>
                Hello! I'm <span className="font-semibold text-stone-900">Prasad Shaswat</span>, an aspiring Software Engineer pursuing B.Tech in
                Computer Science (4th Year) at <span className="font-semibold text-teal-700">Parul University, Vadodara</span>.
                I specialize in full-stack development with expertise in MERN stack, workflow automation, and building scalable enterprise applications.
              </p>

              <p>
                With hands-on experience in Java, Python, and JavaScript, I've built real-world projects including booking systems,
                collaborative platforms, and inventory management solutions. As Tech Coordinator at the Career Development Cell,
                I've managed tech logistics for 500+ participant events. Through this blog, I share practical insights on modern web
                development, DSA, and problem-solving approaches.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="skill-card p-4 bg-stone-50 rounded-xl border border-stone-100 hover:border-teal-200 hover:bg-teal-50/50 transition-colors group cursor-pointer">
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="font-bold text-stone-800">MERN Stack</h3>
                <p className="text-sm text-stone-500">Full-Stack Development</p>
              </div>

              <div className="skill-card p-4 bg-stone-50 rounded-xl border border-stone-100 hover:border-amber-200 hover:bg-amber-50/50 transition-colors group cursor-pointer">
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="font-bold text-stone-800">Java & Python</h3>
                <p className="text-sm text-stone-500">Core Logic & Scripting</p>
              </div>

              <div className="skill-card p-4 bg-stone-50 rounded-xl border border-stone-100 hover:border-purple-200 hover:bg-purple-50/50 transition-colors group cursor-pointer">
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="font-bold text-stone-800">DSA & System Design</h3>
                <p className="text-sm text-stone-500">Problem Solving</p>
              </div>

              <div className="skill-card p-4 bg-stone-50 rounded-xl border border-stone-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors group cursor-pointer">
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-stone-800">REST APIs</h3>
                <p className="text-sm text-stone-500">Backend Architecture</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="https://www.prasadshaswat.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-full hover:bg-black transition-all duration-300 shadow-md hover:shadow-lg font-medium hover:-translate-y-0.5"
              >
                <span>Visit My Website</span>
                <svg className="w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/shaswat-prasad-14b147266/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-6 py-3 bg-white border border-stone-200 text-stone-700 rounded-full hover:border-blue-500 hover:text-blue-600 transition-all duration-300 shadow-sm hover:shadow-md font-medium hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Connect on LinkedIn
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center order-1 md:order-2">
            <div className="relative group perspective-1000 profile-image">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500 to-amber-500 rounded-[2rem] -rotate-6 scale-105 opacity-20 group-hover:rotate-0 transition-transform duration-500"></div>
              <div className="w-72 h-80 md:w-80 md:h-96 relative bg-white rounded-[2rem] shadow-xl overflow-hidden transform transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-y-6">
                <img
                  src={profile}
                  alt="Prashant Singh"
                  className="w-full h-full object-cover"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Aboutme

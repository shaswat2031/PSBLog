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
      scale: 0.9,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out'
    }, 0)

  }, { scope: containerRef })

  return (
    <section ref={containerRef} id="about" className="py-24">
      <div className="bg-white/90 backdrop-blur-xl rounded-[3rem] p-8 md:p-20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/60 relative overflow-hidden transition-all duration-700 hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.15)]">

        {/* Dynamic Background Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-100/40 rounded-full blur-[100px] -z-10 animate-blob"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-100/40 rounded-full blur-[100px] -z-10 animate-blob animation-delay-2000"></div>

        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Content */}
          <div className="lg:col-span-7 space-y-10 order-2 lg:order-1 about-content">
            <div>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-1.5 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">Founder of Unolinks</span>
                <span className="px-4 py-1.5 bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-widest rounded-full border border-teal-200">Intern at RYM Grenergy</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-8 tracking-tight">
                About the Author
              </h2>
              <div className="w-20 h-1.5 bg-teal-500 rounded-full mb-8"></div>
            </div>

            <div className="space-y-8 text-xl text-stone-600 leading-relaxed font-light">
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-stone-900 first-letter:mr-3 first-letter:float-left">
                Hello! I'm <span className="font-semibold text-stone-900">Prasad Shaswat</span>, an aspiring Software Engineer, <span className="text-stone-900 font-medium">Founder of Unolinks</span> and <span className="text-stone-900 font-medium">Intern at RYM Grenergy</span>.
                I am currently pursuing B.Tech in Computer Science (4th Year) at <span className="font-semibold text-teal-700 underline decoration-teal-200 decoration-4 underline-offset-4">Parul University, Vadodara</span>.
                I specialize in full-stack development with expertise in MERN stack, workflow automation, and building scalable enterprise applications.
              </p>

              <p>
                With hands-on experience in Java, Python, and JavaScript, I've built real-world projects including booking systems,
                collaborative platforms, and inventory management solutions. As Tech Coordinator at the Career Development Cell,
                I've managed tech logistics for 500+ participant events. Through this blog, I share practical insights on modern web
                development, DSA, and problem-solving approaches.
              </p>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
              {[
                { title: 'MERN Stack', desc: 'Full-Stack Development', color: 'teal', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
                { title: 'Java & Python', desc: 'Core Logic & Scripting', color: 'amber', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                { title: 'DSA & System Design', desc: 'Problem Solving', color: 'purple', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' },
                { title: 'REST APIs', desc: 'Backend Architecture', color: 'blue', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
              ].map((skill, i) => (
                <div key={i} className={`skill-card group p-6 bg-stone-50 rounded-2xl border border-stone-100 hover:border-${skill.color}-200 hover:bg-${skill.color}-50/50 transition-all duration-300 cursor-default hover:-translate-y-1`}>
                  <div className={`w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-${skill.color}-600`}>
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={skill.icon} />
                    </svg>
                  </div>
                  <h3 className="font-bold text-stone-900 text-lg mb-1">{skill.title}</h3>
                  <p className="text-stone-500 font-medium">{skill.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-6 pt-6">
              <a
                href="https://www.prasadshaswat.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-8 py-4 bg-stone-900 text-white rounded-full hover:bg-black transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold hover:-translate-y-1 active:scale-95"
              >
                <span>Visit My Website</span>
                <svg className="w-5 h-5 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/shaswat-prasad-14b147266/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-8 py-4 bg-white border-2 border-stone-200 text-stone-800 rounded-full hover:border-blue-500 hover:text-blue-600 transition-all duration-300 shadow-md hover:shadow-lg font-semibold hover:-translate-y-1 active:scale-95"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Connect on LinkedIn
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2 profile-image">
            <div className="relative group perspective-1000">
              <div className="absolute inset-0 bg-teal-500 rounded-[3rem] -rotate-6 scale-100 opacity-20 group-hover:rotate-0 group-hover:scale-105 transition-all duration-700"></div>
              <div className="absolute inset-0 bg-amber-500 rounded-[3rem] rotate-3 scale-100 opacity-20 group-hover:rotate-0 group-hover:scale-105 transition-all duration-700 delay-75"></div>

              <div className="w-[300px] h-[380px] md:w-[400px] md:h-[500px] relative bg-stone-100 rounded-[3rem] shadow-2xl overflow-hidden transform transition-all duration-700 group-hover:shadow-[0_64px_96px_-24px_rgba(0,0,0,0.3)] group-hover:-translate-y-4">
                <img
                  src={profile}
                  alt="Prasad Shaswat"
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                />

                {/* Advanced Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-60"></div>

                {/* Visual Accent */}
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 translate-y-20 group-hover:translate-y-0 transition-transform duration-700">
                  <p className="text-white font-serif italic text-lg text-center">Founder of Unolinks & RYM Intern</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Aboutme

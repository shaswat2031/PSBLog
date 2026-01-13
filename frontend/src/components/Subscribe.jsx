import React, { useState, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const Subscribe = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const containerRef = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })

    tl.from(containerRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
  }, { scope: containerRef })

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '🎉 Successfully subscribed! Check your email for confirmation.' });
        setEmail('');
      } else {
        console.error('Subscription failed:', data);
        setMessage({ type: 'error', text: data.message || 'Failed to subscribe. Please try again.' });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={containerRef} className="py-16 md:py-24 relative overflow-hidden">
      {/* Glassmorphism Card */}
      <div className="relative bg-gradient-to-br from-stone-900 to-stone-800 rounded-[2.5rem] p-8 md:p-16 overflow-hidden shadow-2xl">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
              Stay in the <span className="text-teal-400">Loop</span>
            </h2>
            <p className="text-lg text-stone-300 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
              Get thoughtfully curated articles delivered to your inbox. No spam, just quality content that matters.
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-2 text-stone-400 text-sm">
              <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              <span>Weekly digest</span>
              <span className="w-1 h-1 rounded-full bg-stone-600"></span>
              <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              <span>Exclusive tips</span>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-2xl text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subscribing...
                  </span>
                ) : (
                  "Subscribe Now"
                )}
              </button>

              {message.text && (
                <div className={`text-center text-sm p-3 rounded-lg ${message.type === 'error' ? 'bg-red-500/20 text-red-200' : 'bg-teal-500/20 text-teal-200'} animate-in fade-in slide-in-from-bottom-2`}>
                  {message.text}
                </div>
              )}

              <p className="text-center text-stone-500 text-xs mt-4">
                Join 2,500+ readers who trust our insights
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Subscribe

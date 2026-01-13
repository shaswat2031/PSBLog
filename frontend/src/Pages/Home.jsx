import React from 'react'
import Hero from '../components/Hero'
import Subscribe from '../components/Subscribe'
import Aboutme from '../components/Aboutme'


const Home = () => {
  return (
    <div className="bg-stone-50 min-h-screen bg-noise relative overflow-x-hidden selection:bg-teal-500 selection:text-white">
      <Hero />
      <div className="max-w-6xl mx-auto px-6 space-y-24 pb-24 relative z-10">
        <div className="reveal-on-scroll">
          <Subscribe />
        </div>
        <div className="reveal-on-scroll animation-delay-2000">
          <Aboutme />
        </div>
      </div>

    </div>
  )
}

export default Home

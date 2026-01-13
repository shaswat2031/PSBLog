import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, Sparkles, MeshDistortMaterial, Sphere } from '@react-three/drei'

const AnimatedSphere = () => {
  const meshRef = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    meshRef.current.distort = 0.4 + Math.sin(time) * 0.1
  })

  return (
    <Sphere args={[1, 100, 200]} scale={2.5}>
      <MeshDistortMaterial
        ref={meshRef}
        color="#2dd4bf"
        attach="material"
        distort={0.5}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  )
}

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />

      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <group position={[3, 0, -5]}>
          <AnimatedSphere />
        </group>
      </Float>

      <Sparkles
        count={100}
        scale={12}
        size={4}
        speed={0.4}
        opacity={0.5}
        color="#2dd4bf"
      />
      <Environment preset="city" />
    </>
  )
}

const Hero = () => {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const buttonRef = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from(titleRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.1
    })
      .from(subtitleRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8
      }, '-=0.5')
      .from(buttonRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        scale: 0.9
      }, '-=0.3')
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative py-32 px-6 overflow-hidden min-h-[90vh] flex items-center justify-center">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 h-full w-full opacity-50 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <Scene />
        </Canvas>
      </div>

      {/* Gradient Blobs (Fallback/Layering) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber-200 rounded-full blur-3xl mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Main Heading */}
        <div className="overflow-hidden mb-6">
          <h1 ref={titleRef} className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-stone-900 via-stone-700 to-stone-900 leading-[1.1] tracking-tight drop-shadow-2xl">
            Welcome to <br />
            <span className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 bg-clip-text text-transparent italic">PS Blogs</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p ref={subtitleRef} className="text-xl md:text-2xl text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          Your personal journal for technology insights, programming wisdom, and modern web development.
          Discover thoughtful articles crafted with passion and expertise.
        </p>

        {/* CTA Buttons */}
        <div ref={buttonRef} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link
            to="/blogs"
            className="group relative px-10 py-5 bg-stone-900 text-white rounded-full transition-all duration-300 font-medium shadow-2xl hover:shadow-xl hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10 flex items-center text-lg">
              Explore Articles
              <svg className="w-6 h-6 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-70 hidden md:block">
        <div className="w-6 h-10 border-2 border-stone-400 rounded-full flex justify-center p-1">
          <div className="w-1.5 h-1.5 bg-stone-600 rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  )
}
export default Hero

import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filters, setFilters] = useState({ latest: false, popular: false })
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState("")
  const [sortBy, setSortBy] = useState("latest")

  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const searchRef = useRef(null)
  const gridRef = useRef(null)

  // Debounced search with proper cleanup
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchTerm.length >= 2 || searchTerm === "") {
        fetchBlogs()
      }
    }, 500)
    return () => clearTimeout(delaySearch)
  }, [searchTerm, selectedCategory, filters, sortBy])

  const fetchBlogs = async () => {
    try {
      if (searchTerm) setSearching(true)
      else setLoading(true)
      setError("")

      const params = new URLSearchParams()
      if (selectedCategory !== "all") params.append("category", selectedCategory)
      if (searchTerm) params.append("search", searchTerm)
      if (filters.latest) params.append("sort", "latest")
      if (filters.popular) params.append("sort", "popular")
      params.append("sortBy", sortBy)

      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/blogs?${params}`)
      if (response.ok) {
        const result = await response.json()
        setBlogs(result.data || [])
      } else {
        throw new Error("Failed to fetch blogs")
      }
    } catch (err) {
      setError("Failed to load blogs. Please try again later.")
      console.error("Error fetching blogs:", err)
    } finally {
      setLoading(false)
      setSearching(false)
    }
  }

  const retryFetch = () => {
    setError("")
    setSearchTerm("")
    setSelectedCategory("all")
    fetchBlogs()
  }

  const handleFilterChange = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }))
  }

  // Animation for content
  // Advanced GSAP Animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

    // 1. Hero Text Stagger with 3D reveal
    tl.from(headerRef.current.children, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      skewY: 7,
      ease: "power3.out"
    })

      // 2. Search Bar Elastic Pop
      .from(searchRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        y: 50
      }, "-=0.8")

    // 3. Floating Background Blobs Animation
    gsap.to(".bg-blob", {
      x: "random(-100, 100)",
      y: "random(-50, 50)",
      scale: "random(0.8, 1.2)",
      duration: "random(10, 20)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        amount: 5,
        from: "random"
      }
    })

  }, { scope: containerRef })

  // Grid Stagger Animation
  useEffect(() => {
    if (!loading && blogs.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.blog-card',
          {
            y: 100,
            opacity: 0,
            scale: 0.9
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        )
      }, containerRef)
      return () => ctx.revert()
    }
  }, [loading, blogs])

  // 3D Tilt Effect for Cards
  const handleMouseMove = (e, currentTarget) => {
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) / 25
    const y = (e.clientY - top - height / 2) / 25

    gsap.to(currentTarget, {
      rotateY: x,
      rotateX: -y,
      transformPerspective: 1000,
      duration: 0.4,
      ease: "power2.out"
    })
  }

  const handleMouseLeave = (currentTarget) => {
    gsap.to(currentTarget, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.4,
      ease: "power2.out"
    })
  }


  const sortOptions = [
    { value: "latest", label: "Latest Ideas" },
    { value: "popular", label: "Trending Now" },
    { value: "oldest", label: "Classic Reads" },
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-stone-50/50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="bg-blob absolute top-20 left-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl mix-blend-multiply filter blur-[80px]"></div>
        <div className="bg-blob absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl mix-blend-multiply filter blur-[80px]"></div>
        <div className="bg-blob absolute top-1/2 left-1/2 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl mix-blend-multiply filter blur-[80px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 relative z-10">
          <div className="overflow-hidden">
            <span className="inline-block py-1 px-3 rounded-full bg-stone-100/80 backdrop-blur text-stone-500 text-sm font-medium mb-4 border border-stone-200">
              Explore Our Knowledge Base
            </span>
          </div>
          <div className="overflow-hidden">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-6 tracking-tight leading-none">
              All Articles
            </h1>
          </div>
          <div className="overflow-hidden">
            <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Insights, tutorials, and thoughts on modern web development and technology.
              <br />Curated for the curious mind.
            </p>
          </div>
        </div>

        {/* Premium Search and Filter Bar */}
        <div ref={searchRef} className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 mb-16 relative z-20 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-shadow duration-500">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search Input */}
            <div className="flex-1 w-full relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {searching ? (
                  <svg className="animate-spin h-5 w-5 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-stone-400 group-focus-within:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
              <input
                type="text"
                placeholder="Search for wisdom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-stone-50/50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 focus:bg-white transition-all text-stone-800 placeholder-stone-400 font-medium"
              />
            </div>

            {/* Filters Group */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-6 py-4 bg-stone-50/50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 cursor-pointer hover:bg-white transition-all text-stone-700 font-medium"
              >
                <option value="all">All Categories</option>
                <option value="tech">Technology</option>
                <option value="programming">Programming</option>
                <option value="lifestyle">Lifestyle</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-4 bg-stone-50/50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 cursor-pointer hover:bg-white transition-all text-stone-700 font-medium"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Toggles */}
          <div className="flex items-center gap-6 mt-6 px-1">
            <span className="text-sm font-semibold text-stone-400 uppercase tracking-wider">Filters:</span>
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${filters.latest ? 'bg-teal-500 border-teal-500' : 'border-stone-300 bg-white group-hover:border-teal-400'}`}>
                {filters.latest && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <input type="checkbox" checked={filters.latest} onChange={() => handleFilterChange("latest")} className="hidden" />
              <span className={`text-sm font-medium transition-colors ${filters.latest ? 'text-stone-800' : 'text-stone-500 group-hover:text-stone-700'}`}>Latest</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${filters.popular ? 'bg-teal-500 border-teal-500' : 'border-stone-300 bg-white group-hover:border-teal-400'}`}>
                {filters.popular && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <input type="checkbox" checked={filters.popular} onChange={() => handleFilterChange("popular")} className="hidden" />
              <span className={`text-sm font-medium transition-colors ${filters.popular ? 'text-stone-800' : 'text-stone-500 group-hover:text-stone-700'}`}>Popular</span>
            </label>
          </div>
        </div>

        {/* Content Grid */}
        <div ref={gridRef}>
          {loading ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-[2rem] h-[450px] overflow-hidden animate-pulse border border-stone-100">
                  <div className="h-1/2 bg-stone-200"></div>
                  <div className="p-8 space-y-4">
                    <div className="h-4 bg-stone-200 rounded w-1/4"></div>
                    <div className="h-8 bg-stone-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-stone-200 rounded"></div>
                      <div className="h-4 bg-stone-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-500 mb-4 bg-red-50 inline-block px-4 py-2 rounded-full text-sm font-medium">{error}</div>
              <button
                onClick={retryFetch}
                className="px-8 py-3 bg-stone-900 text-white rounded-full hover:bg-black transition-all shadow-lg hover:-translate-y-1"
              >
                Try Again
              </button>
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 perspective-1000">
              {blogs.map((blog) => (
                <Link
                  key={blog.id || blog._id}
                  to={`/blog/${blog.slug || blog.id || blog._id}`}
                  className="group blog-card block h-full"
                  onMouseMove={(e) => handleMouseMove(e, e.currentTarget.querySelector('article'))}
                  onMouseLeave={(e) => handleMouseLeave(e.currentTarget.querySelector('article'))}
                >
                  <article className="bg-white rounded-[2rem] border border-stone-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 h-full flex flex-col will-change-transform transform-style-3d">

                    {/* Image Container */}
                    <div className="aspect-[4/3] overflow-hidden bg-stone-100 relative">
                      <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 z-10 transition-colors duration-500"></div>
                      {blog.featuredImage?.url || blog.featuredImage || blog.image ? (
                        <img
                          src={blog.featuredImage?.url || blog.featuredImage || blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                          onError={(e) => {
                            e.target.style.display = "none"
                            e.target.nextSibling.style.display = "flex"
                          }}
                        />
                      ) : null}
                      <div className="w-full h-full flex items-center justify-center bg-stone-100 absolute inset-0 -z-10">
                        <svg className="w-12 h-12 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>

                      {/* Floating Category Badge */}
                      <div className="absolute top-6 left-6 z-20">
                        <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-stone-900 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm border border-white/50">
                          {blog.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-xs font-medium text-stone-400 mb-4">
                        <span>{blog.readTime} min read</span>
                        <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                        <time>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</time>
                      </div>

                      <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4 leading-tight group-hover:text-teal-600 transition-colors">
                        {blog.title}
                      </h2>

                      <p className="text-stone-600 leading-relaxed mb-6 line-clamp-3 text-base font-light">
                        {blog.excerpt}
                      </p>

                      <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-600">
                            {(blog.authorName || blog.author?.name || "A")[0]}
                          </div>
                          <span className="text-sm font-medium text-stone-700">
                            {blog.authorName || blog.author?.name || "Anonymous"}
                          </span>
                        </div>
                        <span className="text-teal-500 font-medium text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Read Article
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[2.5rem] border border-stone-100">
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="text-stone-900 font-serif text-2xl font-bold mb-2">No articles found</div>
              <p className="text-stone-500 max-w-md mx-auto">
                We couldn't find any articles matching your search. Try different keywords or browse all categories.
              </p>
              <button onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }} className="mt-6 text-teal-600 font-medium hover:text-teal-700 underline">
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Load More Button - Styled */}
        {blogs.length > 0 && !loading && (
          <div className="text-center mt-20">
            <button className="group relative px-8 py-3 bg-white text-stone-600 rounded-full border border-stone-200 font-medium hover:border-stone-900 hover:text-stone-900 transition-all shadow-sm hover:shadow-lg">
              <span className="relative z-10">Load More Articles</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blogs

import React, { useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/blogService";
import logo from "../assets/image.png";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = authAPI.isAuthenticated();
  const user = authAPI.getUser();
  const navRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    authAPI.logout();
    navigate("/");
  };

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
    });

    ScrollTrigger.create({
      start: "top -20",
      onUpdate: (self) => {
        if (self.direction === 1) { // Scrolling down
          gsap.to(navRef.current, { y: -100, duration: 0.3, ease: "power2.inOut" });
        } else { // Scrolling up
          gsap.to(navRef.current, { y: 0, duration: 0.3, ease: "power2.inOut" });
        }

        if (self.scroll() > 50) {
          navRef.current.classList.add("glass-premium", "shadow-xl", "py-3");
          navRef.current.classList.remove("py-5", "bg-transparent");
        } else {
          navRef.current.classList.remove("glass-premium", "shadow-xl", "py-3");
          navRef.current.classList.add("py-5", "bg-transparent");
        }
      }
    });
  }, { scope: navRef });

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-5 px-6 md:px-12 bg-transparent border-b border-transparent"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-teal-500 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity"></div>
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-10 relative z-10 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-[15deg]"
            />
          </div>
          <span className="text-2xl font-serif font-bold text-stone-900 tracking-tight hidden sm:block group-hover:text-teal-600 transition-colors">
            PS <span className="text-teal-500">Blogs</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {[
            { label: 'Home', path: '/' },
            { label: 'All Blogs', path: '/blogs' }
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-bold tracking-widest uppercase transition-all duration-300 relative group
                ${location.pathname === item.path ? "text-teal-600" : "text-stone-600 hover:text-stone-900"}`}
            >
              {item.label}
              <span className={`absolute -bottom-2 left-0 h-[2px] bg-teal-500 transition-all duration-300 
                ${location.pathname === item.path ? "w-full" : "w-0 group-hover:w-full"}`}></span>
            </Link>
          ))}

          {isAuthenticated && user?.role === "admin" ? (
            <div className="flex items-center gap-4">
              <Link
                to="/admin/manage"
                className="px-6 py-2.5 bg-stone-100 text-stone-800 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-200 transition-all hover:shadow-md"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-rose-50 text-rose-600 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-rose-100 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/admin")}
              className="px-8 py-3 bg-stone-900 text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95"
            >
              Admin Portal
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-stone-900 bg-stone-100 rounded-xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div className={`absolute top-full left-0 w-full transition-all duration-500 overflow-hidden md:hidden
        ${isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-white/95 backdrop-blur-xl border-b border-stone-100 shadow-2xl p-8 flex flex-col gap-6">
          <Link to="/" className="text-xl font-serif font-bold text-stone-900" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/blogs" className="text-xl font-serif font-bold text-stone-900" onClick={() => setIsMenuOpen(false)}>All Blogs</Link>
          <div className="h-[1px] bg-stone-100 w-full"></div>
          {isAuthenticated && user?.role === "admin" ? (
            <>
              <Link to="/admin/manage" className="text-lg font-bold text-teal-600" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-lg font-bold text-rose-500 text-left">Logout</button>
            </>
          ) : (
            <button onClick={() => { navigate("/admin"); setIsMenuOpen(false); }} className="px-8 py-4 bg-stone-900 text-white rounded-2xl font-bold text-center">Admin Portal</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

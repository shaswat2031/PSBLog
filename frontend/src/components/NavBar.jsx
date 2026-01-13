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

  // Use GSAP for animation
  useGSAP(() => {
    // Initial fade in
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });

    // Scroll effect to change background
    // Scroll effect to change background
    ScrollTrigger.create({
      start: "top -50",
      end: 99999,
      onToggle: (self) => {
        if (self.isActive) {
          navRef.current.classList.add("bg-white/90", "shadow-sm", "border-b", "border-stone-100", "backdrop-blur-md");
          navRef.current.classList.remove("bg-white/50", "backdrop-blur-sm", "border-transparent");
        } else {
          navRef.current.classList.remove("bg-white/90", "shadow-sm", "border-b", "border-stone-100", "backdrop-blur-md");
          navRef.current.classList.add("bg-white/50", "backdrop-blur-sm", "border-transparent");
        }
      }
    });
  }, { scope: navRef });

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-12 bg-white/50 backdrop-blur-sm border-b border-transparent"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group gap-3">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-10 transform transition-transform group-hover:scale-105 group-hover:rotate-12"
          />
          <span className="text-xl font-serif font-bold text-stone-800 tracking-tight hidden sm:block">
            PS Blogs
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-teal-600 ${location.pathname === "/" ? "text-teal-600" : "text-stone-600"
              }`}
          >
            Home
          </Link>
          <Link
            to="/blogs"
            className={`text-sm font-medium transition-colors hover:text-teal-600 ${location.pathname === "/blogs" ? "text-teal-600" : "text-stone-600"
              }`}
          >
            All Blogs
          </Link>

          {isAuthenticated && user?.role === "admin" ? (
            <div className="flex items-center gap-4">
              <Link
                to="/admin/manage"
                className="px-5 py-2 bg-stone-100 text-stone-700 rounded-full text-sm font-medium hover:bg-stone-200 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/admin")}
              className="px-6 py-2.5 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Admin Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-stone-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-stone-100 shadow-xl p-6 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-2">
          <Link
            to="/"
            className="text-stone-600 font-medium py-2 border-b border-stone-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/blogs"
            className="text-stone-600 font-medium py-2 border-b border-stone-50"
            onClick={() => setIsMenuOpen(false)}
          >
            All Blogs
          </Link>
          {isAuthenticated && user?.role === "admin" ? (
            <>
              <Link
                to="/admin/manage"
                className="text-stone-600 font-medium py-2 border-b border-stone-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-red-500 font-medium py-2 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                navigate("/admin");
                setIsMenuOpen(false);
              }}
              className="text-stone-600 font-medium py-2 text-left"
            >
              Admin Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;

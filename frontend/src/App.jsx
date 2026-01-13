import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Blogs from './Pages/Blogs'
import BlogId from './Pages/blogid'
import ManageBlog from './Pages/ManageBlog'
import AdminLogin from './Pages/adminlogin'
import WriteAndEditBlog from './Pages/writeandeditblog'
import LegalPrivacy from './Pages/LegalPrivacy'
import Terms from './Pages/Terms'
import NotFound from './Pages/NotFound'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import { AdminRoute } from './components/ProtectedRoute'

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
        <NavBar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<BlogId />} />
          <Route path="/admin" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/manage"
            element={
              <AdminRoute>
                <ManageBlog />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/write"
            element={
              <AdminRoute>
                <WriteAndEditBlog />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <AdminRoute>
                <WriteAndEditBlog />
              </AdminRoute>
            }
          />

          {/* Legal Pages */}
          <Route path="/privacy-policy" element={<LegalPrivacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* 404 - Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App

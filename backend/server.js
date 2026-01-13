require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");
const { connectDatabase } = require("./src/utils/database");
const {
  helmetConfig,
  apiLimiter,
} = require("./src/middleware/security");

// Import routes
const authRoutes = require("./src/routes/auth");
const blogRoutes = require("./src/routes/blogs");
const uploadRoutes = require("./src/routes/upload");
const newsletterRoutes = require("./src/routes/newsletter");

const app = express();
const PORT = process.env.PORT || 3001;

// Helper function
const formatResponse = (success, message, data = null) => ({
  success,
  message,
  data,
  timestamp: new Date().toISOString(),
});

// Initialize application with MongoDB connection
const initializeApp = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();
    console.log("✅ Database connection established");

    // Create uploads directory (still useful for temp files or backups)
    const uploadsDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    console.log("✅ Application initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize application:", error);
    process.exit(1);
  }
};

// Security Middleware
app.use(helmetConfig);
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://psblog.prasadshaswat.tech"]
        : ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting for all API routes
app.use("/api", apiLimiter);

// Serve static files from uploads directory (keeping for backward compatibility)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/newsletter", newsletterRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json(
    formatResponse(true, "Server is running", {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      port: PORT,
    })
  );
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json(formatResponse(false, "Route not found"));
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error:", error);

  res
    .status(error.status || 500)
    .json(formatResponse(false, error.message || "Internal server error"));
});

// Start server with proper error handling
const startServer = async () => {
  try {
    await initializeApp();

    const server = app.listen(PORT, () => {
      console.log(`🚀 PS Blog API Server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api/health`);
    });

    // Handle server errors
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(
          `❌ Port ${PORT} is already in use. Please try a different port.`
        );
        console.log(`💡 You can change the port in the .env file`);
      } else {
        console.error("❌ Server error:", err);
      }
      process.exit(1);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("🛑 Received SIGTERM. Shutting down gracefully...");
      server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("\n🛑 Received SIGINT. Shutting down gracefully...");
      server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

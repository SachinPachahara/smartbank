const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { mongoSanitizeMiddleware } = require("./middlewares/security/mongoSanitize");

const app = express();

// HTTP security headers & clickjacking protection
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

//connect to mongodb
const { connectToMongoose } = require("./config/db");

//middlewares
//express json parser middleware with 50kb payload limit for DoS protection
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

//NoSQL Injection sanitization middleware
app.use(mongoSanitizeMiddleware);

//cors middleware
const { corsProOptions } = require("./config/corsConfig");
app.use(cors(corsProOptions));

// Apply the rate limiting middleware to API calls only
const {
  apiLimiter,
} = require("./middlewares/rateLimitMiddleware/rateLimitMiddleware");
app.use("/api", apiLimiter);

//users Router
const usersRoute = require("./routes/usersRoutes");
app.use("/api/users", usersRoute);

//admins Router
const adminsRoute = require("./routes/adminRoutes");
app.use("/api/admins", adminsRoute);

//account Router
const accountRoute = require("./routes/accountRoutes");
app.use("/api/account", accountRoute);

//account requests Router
const accountRequestRoute = require("./routes/accountRequestRoutes");
app.use("/api/request", accountRequestRoute);

// Health check endpoint for Render and uptime monitoring
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Serve Frontend if build exists, otherwise provide API welcome status
const frontendDist = path.resolve(__dirname, "../Frontend/dist");
if (fs.existsSync(path.join(frontendDist, "index.html"))) {
  app.use(express.static(frontendDist));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(frontendDist, "index.html"))
  );
} else {
  app.get("/", (req, res) =>
    res.status(200).json({
      message: "SmartBank Core Banking Simulation API is running.",
      health: "/api/health",
      documentation: "Connect this backend URL to your Vercel frontend via VITE_API_URL",
    })
  );
}

// Global error handler
app.use((err, req, res, next) => {
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({ error: err.message });
  }
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message,
  });
});

connectToMongoose()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log(err);
  });

// middleware/rateLimiter.js
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter }; // ✅ Must use {}

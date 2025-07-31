const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 5, // limit to an IP
  message: {
    error: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});


const otpGenerationLimit = rateLimit({
  windowMs: 0.5 * 60 * 1000, // 5 minutes
  max: 3, // limits each IP
  message: {
    error: "Too many OTP requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// OTP verification rate limit
const otpVerificationLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: "Too many OTP verification attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter, otpGenerationLimit, otpVerificationLimit }; // ✅ Must use {}

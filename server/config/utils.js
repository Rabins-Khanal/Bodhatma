const userModel = require("../models/users");

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Clean expired OTPs (run this as a cron job)
const cleanExpiredOTPs = async () => {
  try {
    await userModel.updateMany(
      {
        otp_expires_at: { $lt: new Date() }
      },
      {
        $set: {
          otp_secret: null,
          otp_expires_at: null,
          otp_attempts: 0,
          otp_locked_until: null
        }
      }
    );
    console.log('Expired OTPs cleaned');
  } catch (error) {
    console.error('Error cleaning expired OTPs:', error);
  }
};

module.exports = { generateOTP, cleanExpiredOTPs }; 
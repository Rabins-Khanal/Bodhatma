const { toTitleCase, validateEmail } = require("../config/function");
const bcrypt = require("bcryptjs");
const userModel = require("../models/users");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const { sendOTPEmail } = require("../config/emailService");
const { generateOTP } = require("../config/utils");

class Auth {
  async isAdmin(req, res) {
    let { loggedInUserId } = req.body;
    try {
      let loggedInUserRole = await userModel.findById(loggedInUserId);
      res.json({ role: loggedInUserRole.userRole });
    } catch {
      res.status(404);
    }
  }

  async allUser(req, res) {
    try {
      let allUser = await userModel.find({});
      res.json({ users: allUser });
    } catch {
      res.status(404);
    }
  }

  /* User Registration/Signup controller  */
  async postSignup(req, res) {
    let { name, email, password, cPassword } = req.body;
    let error = {};
    if (!name || !email || !password || !cPassword) {
      error = {
        ...error,
        name: "Filed must not be empty",
        email: "Filed must not be empty",
        password: "Filed must not be empty",
        cPassword: "Filed must not be empty",
      };
      return res.json({ error });
    }
    if (name.length < 3 || name.length > 25) {
      error = { ...error, name: "Name must be 3-25 charecter" };
      return res.json({ error });
    } else {
      if (validateEmail(email)) {
        name = toTitleCase(name);
        if ((password.length > 255) | (password.length < 8)) {
          error = {
            ...error,
            password: "Password must be 8 character",
            name: "",
            email: "",
          };
          return res.json({ error });
        } else {
          try {
            password = bcrypt.hashSync(password, 10);
            const data = await userModel.findOne({ email: email });
            if (data) {
              error = {
                ...error,
                password: "",
                name: "",
                email: "Email already exists",
              };
              return res.json({ error });
            } else {
              let newUser = new userModel({
                name,
                email,
                password,
                // ========= Here role 1 for admin signup role 0 for customer signup =========
                userRole: 1, // Field Name change to userRole from role
              });
              newUser
                .save()
                .then((data) => {
                  return res.json({
                    success: "Account create successfully. Please login",
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        error = {
          ...error,
          password: "",
          name: "",
          email: "Email is not valid",
        };
        return res.json({ error });
      }
    }
  }

  /* User Login/Signin controller with 2FA support */
  async postSignin(req, res) {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        error: "Fields must not be empty",
      });
    }
    try {
      const data = await userModel.findOne({ email: email });
      if (!data) {
        return res.json({
          error: "Invalid email or password",
        });
      } else {
        const login = await bcrypt.compare(password, data.password);
        if (login) {
         
          if (data.two_factor_enabled) {
        
            const otp = generateOTP();
            const otpHash = await bcrypt.hash(otp, 10);
            
           
            await userModel.findByIdAndUpdate(data._id, {
              otp_secret: otpHash,
              otp_expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
              otp_attempts: 0
            });
            
            try {
              await sendOTPEmail(data.email, data.name, otp);
            } catch (emailError) {
              console.error('Email sending failed:', emailError);
              return res.json({
                error: "Failed to send verification code. Please try again.",
              });
            }

            return res.json({
              requiresOTP: true,
              message: "Please check your email for OTP verification"
            });
          }

          // // If 2FA is not enabled 
          // const token = jwt.sign(
          //   { _id: data._id, role: data.userRole },
          //   JWT_SECRET
          // );
          // const encode = jwt.verify(token, JWT_SECRET);
          // return res.json({
          //   token: token,
          //   user: encode,
          // });
          returnres.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax"
  // No maxAge or expires
});

        } else {
          return res.json({
            error: "Invalid email or password",
          });
        }
      }
    } catch (err) {
      console.log(err);
      return res.json({
        error: "Internal server error",
      });
    }
  }

  /* OTP Verification controller */
  async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.json({ error: "Email and OTP are required" });
      }

      // Find user
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.json({ error: "User not found" });
      }

      // Check if OTP is expired
      if (user.otp_expires_at < new Date()) {
        return res.json({ error: "OTP has expired" });
      }

      // Check if account is locked
      if (user.otp_locked_until && user.otp_locked_until > new Date()) {
        return res.json({ error: "Account temporarily locked. Please try again later." });
      }

      // Verify OTP
      const isValidOTP = await bcrypt.compare(otp, user.otp_secret);
      if (!isValidOTP) {
        // Increment attempts
        const newAttempts = user.otp_attempts + 1;
        await userModel.findByIdAndUpdate(user._id, {
          otp_attempts: newAttempts,
          otp_locked_until: newAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null // Lock for 15 minutes
        });

        return res.json({ error: "Invalid OTP" });
      }

      // Clear OTP data
      await userModel.findByIdAndUpdate(user._id, {
        otp_secret: null,
        otp_expires_at: null,
        otp_attempts: 0,
        otp_locked_until: null
      });

      // Generate JWT token
      const token = jwt.sign(
        { _id: user._id, role: user.userRole },
        JWT_SECRET
      );
      const encode = jwt.verify(token, JWT_SECRET);

      res.json({
        token,
        user: encode,
      });

    } catch (error) {
      console.error('OTP verification error:', error);
      res.json({ error: "Internal server error" });
    }
  }

  /* Resend OTP controller */
  async resendOTP(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.json({ error: "Email is required" });
      }

      // Find user
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.json({ error: "User not found" });
      }

      // Check if 2FA is enabled
      if (!user.two_factor_enabled) {
        return res.json({ error: "Two-factor authentication is not enabled" });
      }

      // Check rate limiting
      const lastOtpTime = user.otp_expires_at;
      if (lastOtpTime && (new Date() - lastOtpTime) < 60 * 1000) { // 1 minute cooldown
        return res.json({ error: "Please wait before requesting another OTP" });
      }

      // Generate new OTP
      const otp = generateOTP();
      const otpHash = await bcrypt.hash(otp, 10);

      // Update OTP in database
      await userModel.findByIdAndUpdate(user._id, {
        otp_secret: otpHash,
        otp_expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        otp_attempts: 0,
        otp_locked_until: null
      });

      // Send new OTP via email
      try {
        await sendOTPEmail(user.email, user.name, otp);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        return res.json({
          error: "Failed to send verification code. Please try again.",
        });
      }

      res.json({ message: "OTP sent successfully" });

    } catch (error) {
      console.error('Resend OTP error:', error);
      res.json({ error: "Internal server error" });
    }
  }

  /* Enable 2FA controller */
  async enable2FA(req, res) {
    try {
      const userId = req.user._id;

      // Find user
      const user = await userModel.findById(userId);
      if (!user) {
        return res.json({ error: "User not found" });
      }

      // Enable 2FA
      await userModel.findByIdAndUpdate(userId, {
        two_factor_enabled: true
      });

      res.json({ message: "Two-factor authentication enabled successfully" });

    } catch (error) {
      console.error('Enable 2FA error:', error);
      res.json({ error: "Internal server error" });
    }
  }

  /* Disable 2FA controller */
  async disable2FA(req, res) {
    try {
      const userId = req.user._id;

      // Find user
      const user = await userModel.findById(userId);
      if (!user) {
        return res.json({ error: "User not found" });
      }

      // Disable 2FA and clear OTP data
      await userModel.findByIdAndUpdate(userId, {
        two_factor_enabled: false,
        otp_secret: null,
        otp_expires_at: null,
        otp_attempts: 0,
        otp_locked_until: null
      });

      res.json({ message: "Two-factor authentication disabled successfully" });

    } catch (error) {
      console.error('Disable 2FA error:', error);
      res.json({ error: "Internal server error" });
    }
  }
}

const authController = new Auth();
module.exports = authController;

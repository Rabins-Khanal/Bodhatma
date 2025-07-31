// const express = require("express");
// const csrf = require("csurf");
// const router = express.Router();
// const authController = require("../controller/auth");
// const { loginCheck, isAuth, isAdmin } = require("../middleware/auth");
// const { loginLimiter, otpGenerationLimit, otpVerificationLimit } = require("../middleware/rateLimiter");

// const csrfProtection = csrf({ cookie: true });
// router.post("/signin", loginLimiter, csrfProtection, authController.postSignin);

// router.post("/verify-otp", otpVerificationLimit, csrfProtection, authController.verifyOTP);
// router.post("/resend-otp", otpGenerationLimit, csrfProtection, authController.resendOTP);
// router.post("/enable-2fa", loginCheck, isAuth, csrfProtection, authController.enable2FA);
// router.post("/disable-2fa", loginCheck, isAuth, csrfProtection, authController.disable2FA);

// router.post("/isadmin", csrfProtection, authController.isAdmin);
// router.post("/signup", csrfProtection, authController.postSignup);
// router.post("/user", loginCheck, isAuth, isAdmin, csrfProtection, authController.allUser);

// module.exports = router;



const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const { loginCheck, isAuth, isAdmin } = require("../middleware/auth");
const { loginLimiter, otpGenerationLimit, otpVerificationLimit } = require("../middleware/rateLimiter");

// POST /api/signin
router.post("/signin", loginLimiter, authController.postSignin);

// 2FA routes
router.post("/verify-otp", otpVerificationLimit, authController.verifyOTP);
router.post("/resend-otp", otpGenerationLimit, authController.resendOTP);
router.post("/enable-2fa", loginCheck, isAuth, authController.enable2FA);
router.post("/disable-2fa", loginCheck, isAuth, authController.disable2FA);

router.post("/isadmin", authController.isAdmin);
router.post("/signup", authController.postSignup);
router.post("/user", loginCheck, isAuth, isAdmin, authController.allUser);

module.exports = router;

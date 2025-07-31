const express = require("express");
const router = express.Router();
const khaltiController = require("../controller/khalti");

// Khalti webhook endpoint
router.post("/webhook", khaltiController.webhookHandler);

// Manual payment verification endpoint (for testing)
router.post("/verify-payment", khaltiController.verifyPayment);

module.exports = router; 
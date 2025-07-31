const orderModel = require("../models/orders");
const crypto = require("crypto");

class KhaltiController {
  // Verify Khalti webhook signature
  verifyWebhookSignature(payload, signature, secretKey) {
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  // Khalti webhook handler
  async webhookHandler(req, res) {
    try {
      const { 
        token, 
        type, 
        amount, 
        idx, 
        mobile, 
        product_identity, 
        product_name 
      } = req.body;

      const signature = req.headers['khalti-signature'];
      const webhookSecret = process.env.KHALTI_WEBHOOK_SECRET;
      
      if (webhookSecret && signature) {
        const isValid = this.verifyWebhookSignature(req.body, signature, webhookSecret);
        if (!isValid) {
          return res.status(401).json({ success: false, message: 'Invalid signature' });
        }
      }

      if (type === 'CONFIRMATION') {
        const order = await orderModel.findOne({ transactionId: idx });
        
        if (order) {
          if (order.amount * 100 !== amount) { 
            return res.status(400).json({ 
              success: false, 
              message: 'Amount mismatch' 
            });
          }

          order.paymentStatus = 'completed';
          order.khaltiData = req.body;
          await order.save();

          console.log(`Payment completed for order: ${order._id}`);
          return res.status(200).json({ 
            success: true, 
            message: 'Payment verified successfully' 
          });
        } else {
          console.log(`Order not found for transaction ID: ${idx}`);
          return res.status(404).json({ 
            success: false, 
            message: 'Order not found' 
          });
        }
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Khalti webhook error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Verify Khalti payment manually (for testing)
  async verifyPayment(req, res) {
    try {
      const { transactionId } = req.body;
      
      if (!transactionId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Transaction ID is required' 
        });
      }

      const order = await orderModel.findOne({ transactionId });
      
      if (!order) {
        return res.status(404).json({ 
          success: false, 
          message: 'Order not found' 
        });
      }

      // Here you would typically make an API call to Khalti to verify the payment
      // For now, we'll just return the order status
      return res.json({
        success: true,
        order: {
          _id: order._id,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          amount: order.amount,
          transactionId: order.transactionId
        }
      });
    } catch (error) {
      console.error('Payment verification error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
}

const khaltiController = new KhaltiController();
module.exports = khaltiController; 
# Backend Payment Integration Guide

## Overview
The frontend has been updated to support two payment methods:
1. **Cash on Delivery (COD)** - Pay when you receive your order
2. **Khalti Payment Gateway** - Online payment using Khalti

## Required Backend Changes

### 1. Update Order Model

Add the following fields to your Order model:

```javascript
// In your Order schema/model
{
  // ... existing fields ...
  paymentMethod: {
    type: String,
    enum: ['cod', 'khalti'],
    required: true,
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    required: true,
    default: 'pending'
  },
  transactionId: {
    type: String,
    // For Khalti payments, this will store the Khalti transaction ID
  },
  khaltiData: {
    type: Object,
    // Store complete Khalti payment response data
  }
}
```

### 2. Update Create Order API

**Endpoint:** `POST /api/order/create-order`

**Request Body:**
```javascript
{
  allProduct: [
    {
      id: "product_id",
      quantity: 2
    }
  ],
  user: "user_id",
  amount: 1500,
  address: "Delivery address",
  phone: "1234567890",
  paymentMethod: "cod" | "khalti",
  paymentStatus: "pending" | "completed",
  transactionId: "khalti_transaction_id", // Only for Khalti payments
  khaltiData: { /* Khalti response data */ } // Only for Khalti payments
}
```

**Response:**
```javascript
{
  success: true,
  message: "Order created successfully",
  order: {
    // Order object with all fields including payment details
  }
}
```

### 3. Update Order Listing APIs

Update your order listing APIs to include payment information:

**For Admin Orders API:**
```javascript
// Include paymentMethod, paymentStatus, transactionId in the response
{
  _id: "order_id",
  allProduct: [...],
  user: {...},
  amount: 1500,
  address: "...",
  phone: "...",
  paymentMethod: "cod",
  paymentStatus: "pending",
  transactionId: null,
  khaltiData: null,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

**For User Orders API:**
```javascript
// Same structure as admin orders but filtered by user
```

### 4. Update Order Status Management

Add payment status to your order status management:

```javascript
// Order statuses should now include payment status
const orderStatuses = {
  pending: "Order placed, payment pending",
  confirmed: "Order confirmed, payment pending",
  processing: "Order being processed",
  shipped: "Order shipped",
  delivered: "Order delivered",
  cancelled: "Order cancelled"
};

const paymentStatuses = {
  pending: "Payment pending",
  completed: "Payment completed",
  failed: "Payment failed"
};
```

### 5. Remove Braintree Dependencies

Since we're no longer using Braintree, remove these endpoints:
- `POST /api/braintree/get-token`
- `POST /api/braintree/payment`

### 6. Optional: Khalti Webhook (Recommended)

For production, implement a Khalti webhook to verify payments:

**Endpoint:** `POST /api/khalti/webhook`

```javascript
// Khalti webhook handler
app.post('/api/khalti/webhook', async (req, res) => {
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

    // Verify the webhook signature (implement according to Khalti docs)
    
    if (type === 'CONFIRMATION') {
      // Find order by transaction ID (idx)
      const order = await Order.findOne({ transactionId: idx });
      
      if (order) {
        order.paymentStatus = 'completed';
        order.khaltiData = req.body;
        await order.save();
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Khalti webhook error:', error);
    res.status(500).json({ success: false });
  }
});
```

### 7. Database Migration

If you have existing orders, create a migration to add the new payment fields:

```javascript
// Migration script
db.orders.updateMany(
  { paymentMethod: { $exists: false } },
  { 
    $set: { 
      paymentMethod: "cod",
      paymentStatus: "pending",
      transactionId: null,
      khaltiData: null
    } 
  }
);
```

## Testing

### Test Cases for Backend

1. **COD Order Creation:**
   - Create order with `paymentMethod: "cod"`
   - Verify `paymentStatus` is set to "pending"
   - Verify order is created successfully

2. **Khalti Order Creation:**
   - Create order with `paymentMethod: "khalti"`
   - Verify `paymentStatus` is set to "completed"
   - Verify `transactionId` and `khaltiData` are stored
   - Verify order is created successfully

3. **Order Listing:**
   - Verify payment information is included in order listings
   - Verify admin can see all payment details
   - Verify users can see their order payment details

4. **Order Status Updates:**
   - Verify payment status can be updated independently
   - Verify order status and payment status work together

## Frontend Integration Notes

The frontend now sends the following data structure:

```javascript
// For COD orders
{
  allProduct: [...],
  user: "user_id",
  amount: 1500,
  address: "...",
  phone: "...",
  paymentMethod: "cod",
  paymentStatus: "pending"
}

// For Khalti orders
{
  allProduct: [...],
  user: "user_id",
  amount: 1500,
  address: "...",
  phone: "...",
  paymentMethod: "khalti",
  paymentStatus: "completed",
  transactionId: "khalti_transaction_id",
  khaltiData: { /* Khalti response */ }
}
```

## Environment Variables

Make sure your backend has the necessary environment variables:

```env
# Khalti Configuration (for production)
KHALTI_SECRET_KEY=your_khalti_secret_key
KHALTI_PUBLIC_KEY=your_khalti_public_key
KHALTI_WEBHOOK_SECRET=your_webhook_secret

# For testing, use Khalti test keys
KHALTI_SECRET_KEY=test_secret_key
KHALTI_PUBLIC_KEY=test_public_key
```

## Security Considerations

1. **Validate Payment Data:** Always verify Khalti payment data on the backend
2. **Webhook Verification:** Implement proper webhook signature verification
3. **Amount Validation:** Ensure the payment amount matches the order amount
4. **Transaction ID Uniqueness:** Ensure transaction IDs are unique
5. **Error Handling:** Implement proper error handling for payment failures

## Deployment Checklist

- [ ] Update Order model with new payment fields
- [ ] Update create order API to handle payment data
- [ ] Update order listing APIs to include payment info
- [ ] Remove Braintree endpoints
- [ ] Test COD order creation
- [ ] Test Khalti order creation
- [ ] Test order listing with payment data
- [ ] Implement Khalti webhook (optional but recommended)
- [ ] Update admin dashboard to show payment information
- [ ] Update user dashboard to show payment information
- [ ] Test payment status updates
- [ ] Deploy and test in production environment 
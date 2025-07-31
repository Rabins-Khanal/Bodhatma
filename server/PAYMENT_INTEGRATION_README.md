# Payment Integration Documentation

## Overview

This backend has been updated to support two payment methods:
1. **Cash on Delivery (COD)** - Pay when you receive your order
2. **Khalti Payment Gateway** - Online payment using Khalti

## Database Schema Changes

### Order Model Updates

The Order model has been updated with the following new fields:

```javascript
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

## API Endpoints

### 1. Create Order

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

### 2. Get All Orders (Admin)

**Endpoint:** `GET /api/order/get-all-orders`

**Response:**
```javascript
{
  Orders: [
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
      status: "Not processed",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3. Get User Orders

**Endpoint:** `POST /api/order/order-by-user`

**Request Body:**
```javascript
{
  uId: "user_id"
}
```

**Response:** Same structure as admin orders but filtered by user

### 4. Khalti Webhook

**Endpoint:** `POST /api/khalti/webhook`

**Purpose:** Verify Khalti payments and update order status

**Request Body:** Khalti webhook payload
```javascript
{
  token: "khalti_token",
  type: "CONFIRMATION",
  amount: 150000, // Amount in paisa
  idx: "transaction_id",
  mobile: "1234567890",
  product_identity: "product_id",
  product_name: "Product Name"
}
```

**Response:**
```javascript
{
  success: true,
  message: "Payment verified successfully"
}
```

### 5. Verify Payment (Testing)

**Endpoint:** `POST /api/khalti/verify-payment`

**Request Body:**
```javascript
{
  transactionId: "khalti_transaction_id"
}
```

**Response:**
```javascript
{
  success: true,
  order: {
    _id: "order_id",
    paymentStatus: "completed",
    paymentMethod: "khalti",
    amount: 1500,
    transactionId: "khalti_transaction_id"
  }
}
```

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Khalti Configuration (for production)
KHALTI_SECRET_KEY=your_khalti_secret_key
KHALTI_PUBLIC_KEY=your_khalti_public_key
KHALTI_WEBHOOK_SECRET=your_webhook_secret

# For testing, use Khalti test keys
KHALTI_SECRET_KEY=test_secret_key
KHALTI_PUBLIC_KEY=test_public_key
```

## Migration

### Database Migration

Run the migration script to add payment fields to existing orders:

```bash
node migration-add-payment-fields.js
```

This will:
- Add `paymentMethod: "cod"` to all existing orders
- Add `paymentStatus: "pending"` to all existing orders
- Add `transactionId: null` to all existing orders
- Add `khaltiData: null` to all existing orders

### Testing

Run the test script to verify the payment integration:

```bash
node test-payment-integration.js
```

This will:
- Check if payment fields exist in orders
- Count orders by payment method
- Count orders by payment status
- Check for orders with transaction IDs
- Check for orders with Khalti data

## Removed Features

The following Braintree-related endpoints have been removed:
- `POST /api/braintree/get-token`
- `POST /api/braintree/payment`

## Security Considerations

1. **Webhook Verification:** The Khalti webhook includes signature verification
2. **Amount Validation:** Payment amounts are verified against order amounts
3. **Transaction ID Uniqueness:** Each Khalti transaction ID should be unique
4. **Error Handling:** Proper error handling for payment failures

## Testing Scenarios

### 1. COD Order Creation
```javascript
// Frontend sends:
{
  allProduct: [...],
  user: "user_id",
  amount: 1500,
  address: "...",
  phone: "...",
  paymentMethod: "cod",
  paymentStatus: "pending"
}
```

### 2. Khalti Order Creation
```javascript
// Frontend sends:
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

## Deployment Checklist

- [x] Update Order model with new payment fields
- [x] Update create order API to handle payment data
- [x] Update order listing APIs to include payment info
- [x] Remove Braintree endpoints
- [x] Add Khalti webhook endpoint
- [x] Create database migration script
- [x] Create test script
- [ ] Test COD order creation
- [ ] Test Khalti order creation
- [ ] Test order listing with payment data
- [ ] Test Khalti webhook
- [ ] Deploy and test in production environment

## File Structure

```
server/
├── models/
│   └── orders.js (updated with payment fields)
├── controller/
│   ├── orders.js (updated to handle payment data)
│   └── khalti.js (new - webhook and verification)
├── routes/
│   ├── orders.js (existing)
│   └── khalti.js (new)
├── app.js (updated to include Khalti routes)
├── migration-add-payment-fields.js (new)
├── test-payment-integration.js (new)
└── PAYMENT_INTEGRATION_README.md (this file)
```

## Support

For issues or questions regarding the payment integration, please refer to:
1. Khalti API documentation
2. This README file
3. The test scripts for verification 
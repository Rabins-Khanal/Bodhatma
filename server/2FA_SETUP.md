# Two-Factor Authentication (2FA) Setup Guide

This guide explains how to set up and use the 2FA functionality in your Bodhivana backend.

## 🔧 Environment Variables

Add these to your `.env` file:

```env
# Database Configuration
DATABASE=mongodb://localhost:27017/your_database_name

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration for 2FA
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password

# Server Configuration
PORT=8000
```

## 📧 Email Setup

### Gmail Setup:
1. Enable 2-Step Verification on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use the generated password in `EMAIL_PASSWORD`

### Other Email Providers:
Update the `service` field in `config/emailService.js`:
- For Outlook: `service: 'outlook'`
- For Yahoo: `service: 'yahoo'`
- For custom SMTP: Use `host`, `port`, `secure` options

## 🚀 API Endpoints

### 1. Login with 2FA
**POST** `/api/signin`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (2FA enabled):**
```json
{
  "requiresOTP": true,
  "message": "Please check your email for OTP verification"
}
```

**Response (2FA disabled):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "role": 0
  }
}
```

### 2. Verify OTP
**POST** `/api/verify-otp`
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "role": 0
  }
}
```

### 3. Resend OTP
**POST** `/api/resend-otp`
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully"
}
```

### 4. Enable 2FA
**POST** `/api/enable-2fa`
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Two-factor authentication enabled successfully"
}
```

### 5. Disable 2FA
**POST** `/api/disable-2fa`
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Two-factor authentication disabled successfully"
}
```

## 🔒 Security Features

### Rate Limiting:
- **Login attempts:** 5 per 15 minutes
- **OTP generation:** 3 per 15 minutes
- **OTP verification:** 5 per 15 minutes

### Account Lockout:
- After 5 failed OTP attempts, account is locked for 15 minutes

### OTP Expiration:
- OTPs expire after 10 minutes
- Expired OTPs are automatically cleaned up every hour

## 🧪 Testing

### Test with curl:

```bash
# 1. Login (2FA enabled)
curl -X POST https://localhost:8000/api/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# 2. Verify OTP
curl -X POST https://localhost:8000/api/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","otp":"123456"}'

# 3. Enable 2FA (requires authentication)
curl -X POST https://localhost:8000/api/enable-2fa \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 4. Disable 2FA (requires authentication)
curl -X POST https://localhost:8000/api/disable-2fa \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📝 Database Schema

The user model now includes these 2FA fields:

```javascript
{
  two_factor_enabled: Boolean,    // Whether 2FA is enabled
  otp_secret: String,            // Hashed OTP
  otp_expires_at: Date,          // OTP expiration time
  otp_attempts: Number,          // Failed attempt counter
  otp_locked_until: Date         // Account lockout time
}
```

## 🔄 Frontend Integration

Your frontend should handle these scenarios:

1. **Login Response Check:**
   - If `requiresOTP: true`, show OTP input form
   - If not, proceed with normal login flow

2. **OTP Verification:**
   - Send OTP to `/api/verify-otp`
   - On success, store JWT token and redirect

3. **Resend OTP:**
   - Provide option to resend OTP if user doesn't receive it

4. **2FA Management:**
   - Allow users to enable/disable 2FA in settings

## 🚨 Error Handling

Common error responses:

```json
{
  "error": "Invalid OTP"
}
```

```json
{
  "error": "OTP has expired"
}
```

```json
{
  "error": "Account temporarily locked. Please try again later."
}
```

```json
{
  "error": "Too many OTP requests. Please try again later."
}
```

## 🔧 Troubleshooting

### Email not sending:
1. Check email credentials in `.env`
2. Verify 2FA is enabled on email account
3. Use app password instead of regular password
4. Check email provider settings

### OTP not working:
1. Check server logs for email errors
2. Verify OTP expiration time
3. Check rate limiting settings
4. Ensure database connection is working

### Rate limiting issues:
1. Check IP address
2. Wait for rate limit window to reset
3. Adjust rate limit settings in `middleware/rateLimiter.js` 
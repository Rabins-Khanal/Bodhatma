# Backend Two-Factor Authentication Implementation Guide

This document provides a complete implementation guide for adding two-factor authentication (2FA) to your backend API.

## 📋 Table of Contents
1. [Database Schema Updates](#database-schema-updates)
2. [Required Dependencies](#required-dependencies)
3. [API Endpoints Implementation](#api-endpoints-implementation)
4. [Email Service Setup](#email-service-setup)
5. [Security Middleware](#security-middleware)
6. [Complete Code Examples](#complete-code-examples)
7. [Testing Guide](#testing-guide)

## 🗄️ Database Schema Updates

### Add these fields to your users table:

```sql
-- Add 2FA fields to users table
ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN otp_secret VARCHAR(255);
ALTER TABLE users ADD COLUMN otp_expires_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN otp_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN otp_locked_until TIMESTAMP NULL;

-- Create index for better performance
CREATE INDEX idx_users_two_factor_enabled ON users(two_factor_enabled);
CREATE INDEX idx_users_otp_expires_at ON users(otp_expires_at);
```

### Optional: Create a separate OTP table for better security:

```sql
-- Create OTP table for better security
CREATE TABLE user_otps (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    otp_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP NULL
);

CREATE INDEX idx_user_otps_user_id ON user_otps(user_id);
CREATE INDEX idx_user_otps_expires_at ON user_otps(expires_at);
```

## 📦 Required Dependencies

### Node.js/Express Dependencies:
```bash
npm install crypto nodemailer express-rate-limit bcryptjs jsonwebtoken
```

### Python/Django Dependencies:
```bash
pip install cryptography django-ratelimit django-email-verification
```

### PHP Dependencies:
```bash
composer require phpmailer/phpmailer firebase/php-jwt
```

## 🔌 API Endpoints Implementation

### 1. Modified Login Endpoint

#### Node.js/Express Example:
```javascript
// Modified signin endpoint
app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if 2FA is enabled
    if (user.two_factor_enabled) {
      // Generate and send OTP
      const otp = generateOTP();
      const otpHash = await bcrypt.hash(otp, 10);
      
      // Store OTP in database
      await User.update({
        otp_secret: otpHash,
        otp_expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        otp_attempts: 0
      }, { where: { id: user.id } });

      // Send OTP via email
      await sendOTPEmail(user.email, user.name, otp);

      return res.json({
        requiresOTP: true,
        message: 'Please check your email for OTP verification'
      });
    }

    // 2FA not enabled - proceed with normal login
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        twoFactorEnabled: user.two_factor_enabled
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

#### Python/Django Example:
```python
# views.py
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import jwt
import random
import string
from datetime import datetime, timedelta

@csrf_exempt
def signin(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return JsonResponse({'error': 'Email and password are required'}, status=400)
        
        user = authenticate(username=email, password=password)
        if not user:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
        
        # Check if 2FA is enabled
        if user.two_factor_enabled:
            # Generate OTP
            otp = ''.join(random.choices(string.digits, k=6))
            otp_hash = hashlib.sha256(otp.encode()).hexdigest()
            
            # Store OTP
            user.otp_secret = otp_hash
            user.otp_expires_at = datetime.now() + timedelta(minutes=10)
            user.otp_attempts = 0
            user.save()
            
            # Send email
            send_otp_email(user.email, user.first_name, otp)
            
            return JsonResponse({
                'requiresOTP': True,
                'message': 'Please check your email for OTP verification'
            })
        
        # Normal login
        token = jwt.encode(
            {'user_id': user.id, 'email': user.email},
            settings.JWT_SECRET,
            algorithm='HS256'
        )
        
        return JsonResponse({
            'token': token,
            'user': {
                'id': user.id,
                'name': user.first_name,
                'email': user.email,
                'role': user.role,
                'twoFactorEnabled': user.two_factor_enabled
            }
        })
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
```

### 2. OTP Verification Endpoint

#### Node.js/Express Example:
```javascript
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if OTP is expired
    if (user.otp_expires_at < new Date()) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // Check if account is locked
    if (user.otp_locked_until && user.otp_locked_until > new Date()) {
      return res.status(429).json({ error: 'Account temporarily locked. Please try again later.' });
    }

    // Verify OTP
    const isValidOTP = await bcrypt.compare(otp, user.otp_secret);
    if (!isValidOTP) {
      // Increment attempts
      const newAttempts = user.otp_attempts + 1;
      await User.update({
        otp_attempts: newAttempts,
        otp_locked_until: newAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null // Lock for 15 minutes
      }, { where: { id: user.id } });

      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Clear OTP data
    await User.update({
      otp_secret: null,
      otp_expires_at: null,
      otp_attempts: 0,
      otp_locked_until: null
    }, { where: { id: user.id } });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        twoFactorEnabled: user.two_factor_enabled
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### 3. Resend OTP Endpoint

#### Node.js/Express Example:
```javascript
app.post('/api/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if 2FA is enabled
    if (!user.two_factor_enabled) {
      return res.status(400).json({ error: 'Two-factor authentication is not enabled' });
    }

    // Check rate limiting
    const lastOtpTime = user.otp_expires_at;
    if (lastOtpTime && (new Date() - lastOtpTime) < 60 * 1000) { // 1 minute cooldown
      return res.status(429).json({ error: 'Please wait before requesting another OTP' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    // Update OTP in database
    await User.update({
      otp_secret: otpHash,
      otp_expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      otp_attempts: 0,
      otp_locked_until: null
    }, { where: { id: user.id } });

    // Send new OTP via email
    await sendOTPEmail(user.email, user.name, otp);

    res.json({ message: 'OTP sent successfully' });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### 4. Enable 2FA Endpoint

#### Node.js/Express Example:
```javascript
app.post('/api/enable-2fa', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Enable 2FA
    await User.update({
      two_factor_enabled: true
    }, { where: { id: userId } });

    res.json({ message: 'Two-factor authentication enabled successfully' });

  } catch (error) {
    console.error('Enable 2FA error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### 5. Disable 2FA Endpoint

#### Node.js/Express Example:
```javascript
app.post('/api/disable-2fa', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Disable 2FA and clear OTP data
    await User.update({
      two_factor_enabled: false,
      otp_secret: null,
      otp_expires_at: null,
      otp_attempts: 0,
      otp_locked_until: null
    }, { where: { id: userId } });

    res.json({ message: 'Two-factor authentication disabled successfully' });

  } catch (error) {
    console.error('Disable 2FA error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

## 📧 Email Service Setup

### Node.js/Express Email Service:
```javascript
// emailService.js
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send OTP email
const sendOTPEmail = async (email, name, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Login Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Hello ${name},</h2>
        <p>Your verification code is:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          Best regards,<br>
          Your App Team
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = { sendOTPEmail };
```

### Python/Django Email Service:
```python
# email_service.py
from django.core.mail import send_mail
from django.conf import settings

def send_otp_email(email, name, otp):
    subject = 'Your Login Verification Code'
    html_message = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Hello {name},</h2>
        <p>Your verification code is:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px; margin: 0;">{otp}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
            Best regards,<br>
            Your App Team
        </p>
    </div>
    """
    
    send_mail(
        subject,
        f'Your verification code is: {otp}',
        settings.EMAIL_HOST_USER,
        [email],
        html_message=html_message,
        fail_silently=False,
    )
```

## 🔒 Security Middleware

### Rate Limiting Middleware:
```javascript
// rateLimiter.js
const rateLimit = require('express-rate-limit');

// OTP generation rate limit
const otpGenerationLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: 'Too many OTP requests. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// OTP verification rate limit
const otpVerificationLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many OTP verification attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { otpGenerationLimit, otpVerificationLimit };
```

### JWT Authentication Middleware:
```javascript
// authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
```

## 🛠️ Utility Functions

### OTP Generation:
```javascript
// utils.js
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Clean expired OTPs (run this as a cron job)
const cleanExpiredOTPs = async () => {
  try {
    await User.update({
      otp_secret: null,
      otp_expires_at: null,
      otp_attempts: 0,
      otp_locked_until: null
    }, {
      where: {
        otp_expires_at: {
          [Op.lt]: new Date()
        }
      }
    });
    console.log('Expired OTPs cleaned');
  } catch (error) {
    console.error('Error cleaning expired OTPs:', error);
  }
};

module.exports = { generateOTP, cleanExpiredOTPs };
```

## 📝 Complete Implementation Example

### Main App File (Node.js/Express):
```javascript
// app.js
const express = require('express');
const cors = require('cors');
const { authenticateToken } = require('./middleware/authMiddleware');
const { otpGenerationLimit, otpVerificationLimit } = require('./middleware/rateLimiter');
const { sendOTPEmail } = require('./services/emailService');
const { generateOTP, cleanExpiredOTPs } = require('./utils/utils');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.post('/api/signin', otpGenerationLimit, signinHandler);
app.post('/api/verify-otp', otpVerificationLimit, verifyOTPHandler);
app.post('/api/resend-otp', otpGenerationLimit, resendOTPHandler);
app.post('/api/enable-2fa', authenticateToken, enable2FAHandler);
app.post('/api/disable-2fa', authenticateToken, disable2FAHandler);

// Clean expired OTPs every hour
setInterval(cleanExpiredOTPs, 60 * 60 * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 🧪 Testing Guide

### Test Cases:
1. **Login without 2FA**: Should return JWT token directly
2. **Login with 2FA**: Should return `requiresOTP: true`
3. **Valid OTP**: Should return JWT token
4. **Invalid OTP**: Should return error
5. **Expired OTP**: Should return error
6. **Resend OTP**: Should send new OTP
7. **Rate limiting**: Should block after too many attempts
8. **Enable/Disable 2FA**: Should update user settings

### Test Commands:
```bash
# Test login without 2FA
curl -X POST http://localhost:3000/api/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Test login with 2FA
curl -X POST http://localhost:3000/api/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user2fa@example.com","password":"password"}'

# Test OTP verification
curl -X POST http://localhost:3000/api/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user2fa@example.com","otp":"123456"}'
```

## 🔧 Environment Variables

Add these to your `.env` file:
```env
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
DATABASE_URL=your_database_connection_string
```

## 📚 Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [JWT Documentation](https://jwt.io/)
- [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit)
- [Bcrypt Documentation](https://www.npmjs.com/package/bcryptjs)

This implementation provides a secure, scalable, and user-friendly two-factor authentication system that integrates seamlessly with your existing frontend implementation. 
# Two-Factor Authentication (2FA) Implementation

This document outlines the implementation of two-factor authentication (2FA) in the React frontend application using email-based OTP verification.

## Overview

The 2FA system adds an extra layer of security by requiring users to enter a one-time password (OTP) sent to their registered email address after successfully entering their username and password.

## Features Implemented

### 1. OTP Verification Component (`OTPVerification.js`)
- **6-digit OTP input**: Individual input boxes for each digit with auto-focus
- **Paste support**: Users can paste a 6-digit code
- **Resend functionality**: Users can request a new OTP with a 60-second cooldown
- **Error handling**: Proper error messages and validation
- **Responsive design**: Matches the existing application design

### 2. Enhanced Login Flow (`Login.js`)
- **Modified login process**: Now handles 2FA flow
- **Conditional rendering**: Shows OTP verification when required
- **Seamless integration**: Maintains existing login functionality

### 3. Two-Factor Settings (`TwoFactorSettings.js`)
- **Enable/Disable 2FA**: Users can toggle 2FA on/off
- **Visual indicators**: Clear status display
- **User-friendly interface**: Explains benefits and setup process
- **Integration**: Added to user settings page

### 4. Context Management (`TwoFactorContext.js`)
- **Global state management**: Manages 2FA state across the application
- **Provider pattern**: Wraps the application for state access
- **Reducer pattern**: Clean state updates

## API Endpoints Required

The backend needs to implement the following endpoints:

### 1. Modified Login Endpoint
```
POST /api/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "userpassword"
}

Response (2FA enabled):
{
  "requiresOTP": true,
  "message": "Please check your email for OTP verification"
}

Response (2FA disabled):
{
  "token": "jwt_token_here",
  "user": { ... }
}
```

### 2. OTP Verification Endpoint
```
POST /api/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}

Response (success):
{
  "token": "jwt_token_here",
  "user": { ... }
}

Response (error):
{
  "error": "Invalid OTP"
}
```

### 3. Resend OTP Endpoint
```
POST /api/resend-otp
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (success):
{
  "message": "OTP sent successfully"
}

Response (error):
{
  "error": "Too many attempts. Please try again later."
}
```

### 4. Enable 2FA Endpoint
```
POST /api/enable-2fa
Authorization: Bearer <jwt_token>

Response (success):
{
  "message": "Two-factor authentication enabled successfully"
}

Response (error):
{
  "error": "Failed to enable 2FA"
}
```

### 5. Disable 2FA Endpoint
```
POST /api/disable-2fa
Authorization: Bearer <jwt_token>

Response (success):
{
  "message": "Two-factor authentication disabled successfully"
}

Response (error):
{
  "error": "Failed to disable 2FA"
}
```

## Database Schema Updates

The user table should include a new field:

```sql
ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN otp_secret VARCHAR(255);
ALTER TABLE users ADD COLUMN otp_expires_at TIMESTAMP;
```

## OTP Generation and Email Service

### OTP Generation
- Generate a random 6-digit numeric code
- Store the OTP hash in the database with expiration time (5-10 minutes)
- Send the plain OTP via email

### Email Template
```html
Subject: Your Login Verification Code

Hello [User Name],

Your verification code is: [OTP_CODE]

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
[Your App Name] Team
```

## Security Considerations

### 1. Rate Limiting
- Implement rate limiting on OTP generation (max 3 attempts per 15 minutes)
- Implement rate limiting on OTP verification (max 5 attempts per 15 minutes)

### 2. OTP Security
- Use cryptographically secure random number generation
- Hash OTPs before storing in database
- Set appropriate expiration times (5-10 minutes)
- Implement attempt tracking and account lockout

### 3. Email Security
- Use secure email delivery (TLS/SSL)
- Implement email verification for account creation
- Consider using email service providers with high deliverability

## Frontend Implementation Details

### File Structure
```
src/components/shop/auth/
├── Login.js (modified)
├── OTPVerification.js (new)
├── TwoFactorSettings.js (new)
├── TwoFactorContext.js (new)
└── fetchApi.js (modified)
```

### Key Components

#### OTPVerification.js
- Handles 6-digit OTP input with individual boxes
- Auto-focus functionality for better UX
- Paste support for convenience
- Resend functionality with cooldown
- Error handling and validation

#### TwoFactorSettings.js
- Toggle 2FA on/off functionality
- Visual status indicators
- User-friendly explanations
- Integration with user settings

#### TwoFactorContext.js
- Global state management for 2FA
- Provider pattern for app-wide access
- Reducer pattern for clean state updates

### State Management
The application uses React Context for managing 2FA state:
- `is2FAEnabled`: Whether 2FA is enabled for the user
- `isOTPVerified`: Whether the current session has verified OTP
- `pendingEmail`: Email address waiting for OTP verification
- `showOTPModal`: Whether to show the OTP verification modal

## Usage Flow

### 1. User Login with 2FA Enabled
1. User enters email and password
2. Backend validates credentials and checks if 2FA is enabled
3. If 2FA is enabled, backend generates and sends OTP
4. Frontend shows OTP verification screen
5. User enters 6-digit OTP
6. Backend verifies OTP and returns JWT token
7. User is logged in and redirected

### 2. User Login without 2FA
1. User enters email and password
2. Backend validates credentials
3. Backend returns JWT token directly
4. User is logged in and redirected

### 3. Enabling 2FA
1. User goes to Settings page
2. User clicks "Enable Two-Factor Authentication"
3. Backend enables 2FA for the user
4. Frontend updates UI to show 2FA is enabled

### 4. Disabling 2FA
1. User goes to Settings page
2. User clicks "Disable Two-Factor Authentication"
3. Backend disables 2FA for the user
4. Frontend updates UI to show 2FA is disabled

## Testing

### Test Cases
1. **Login with 2FA enabled**: Verify OTP flow works correctly
2. **Login without 2FA**: Verify direct login works
3. **Invalid OTP**: Verify error handling
4. **Expired OTP**: Verify expiration handling
5. **Resend OTP**: Verify resend functionality with cooldown
6. **Enable/Disable 2FA**: Verify settings functionality
7. **Rate limiting**: Verify rate limiting works
8. **Paste functionality**: Verify OTP paste works
9. **Auto-focus**: Verify input auto-focus works
10. **Responsive design**: Verify mobile compatibility

## Dependencies

The implementation uses the following dependencies:
- `react`: Core React library
- `react-router-dom`: For routing
- `notistack`: For notifications
- `axios`: For API calls

## Browser Compatibility

The implementation is compatible with:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Future Enhancements

1. **SMS OTP**: Add SMS-based OTP as an alternative
2. **Authenticator Apps**: Support for TOTP apps like Google Authenticator
3. **Backup Codes**: Generate backup codes for account recovery
4. **Device Trust**: Remember trusted devices
5. **Login History**: Track and display login attempts
6. **Push Notifications**: Send push notifications for login attempts

## Troubleshooting

### Common Issues

1. **OTP not received**: Check email spam folder, verify email address
2. **OTP expired**: Request a new OTP using resend functionality
3. **Rate limited**: Wait for cooldown period to expire
4. **Invalid OTP**: Double-check the 6-digit code from email

### Debug Mode
Enable debug logging by setting `localStorage.setItem('debug', '2fa')` in browser console.

## Support

For technical support or questions about the 2FA implementation, please refer to the project documentation or contact the development team. 
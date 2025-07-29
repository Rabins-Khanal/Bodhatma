const nodemailer = require('nodemailer');

// Create transporter with better error handling
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;
  
  if (!emailUser || !emailPassword) {
    console.error('❌ Email configuration missing! Please set EMAIL_USER and EMAIL_PASSWORD in your .env file');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPassword
    }
  });
};

// Send OTP email
const sendOTPEmail = async (email, name, otp) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    throw new Error('Email transporter not configured. Please check your .env file.');
  }

  const mailOptions = {
    from: '"bodhivana" <' + process.env.EMAIL_USER + '>', // Custom sender name
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
          bodhivana<br>
          Bodhivana Team
        </p>
      </div>
    `
  };

  try {
    console.log(`📧 Attempting to send OTP email to: ${email}`);
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully to:', email);
    console.log('📧 Message ID:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Email sending error:', error);
    
    // Provide specific error messages
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check your EMAIL_USER and EMAIL_PASSWORD in .env file.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Email connection failed. Please check your internet connection.');
    } else {
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }
};

module.exports = { sendOTPEmail }; 
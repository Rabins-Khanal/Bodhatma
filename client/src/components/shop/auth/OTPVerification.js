import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { verifyOTPReq, resendOTPReq } from "./fetchApi";
import { useSnackbar } from 'notistack';
import Navbar from "../partials/Navber";
import { Footer } from "../partials";

const OTPVerification = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);
  
  // Get email from localStorage
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    const storedEmail = localStorage.getItem('otpEmail');
    if (!storedEmail) {
      // If no email found, redirect back to login
      enqueueSnackbar('Please login first', { variant: 'error' });
      history.push('/login');
      return;
    }
    setEmail(storedEmail);
  }, [history, enqueueSnackbar]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      enqueueSnackbar('Please enter a valid 6-digit OTP', { variant: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOTPReq({ email, otp: otpString });
      
      if (response.error) {
        enqueueSnackbar(response.error, { variant: 'error' });
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else if (response.token) {
        enqueueSnackbar('Login successful!', { variant: 'success' });
        localStorage.setItem("jwt", JSON.stringify(response));
        // Clear the stored email
        localStorage.removeItem('otpEmail');
        window.location.href = "/";
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      enqueueSnackbar('Failed to verify OTP. Please try again.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const response = await resendOTPReq({ email });
      if (response.error) {
        enqueueSnackbar(response.error, { variant: 'error' });
      } else {
        enqueueSnackbar('OTP resent successfully!', { variant: 'success' });
        setCountdown(60); // 60 seconds cooldown
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      enqueueSnackbar('Failed to resend OTP. Please try again.', { variant: 'error' });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center mt-20">
        <img
          src={`${process.env.PUBLIC_URL}/prayer.png`} 
          alt="Prayer Flags"
          style={{
            width: "82%",       
            height: "auto",      
            objectFit: "cover",  
          }}
        />
      </div>

      <div className="flex justify-center items-start gap-16 mt-8 px-6" style={{ marginTop: "30px", marginBottom:"100px" }}>
        <div>
          <img
            src={`${process.env.PUBLIC_URL}/buddhag.png`}
            alt="Buddha"
            style={{ width: "620px", height:"420px", borderRadius: '6px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
          />
        </div>

        <div
          style={{ minWidth: 500, minHeight: 400, marginTop: "-10px" }}
          className="bg-white rounded-md py-8 relative"
        >
          <div className="font-bold text-3xl mb-2">Verify OTP</div>
          <div className="text-gray-700 mb-6">
            We've sent a 6-digit code to <span className="font-semibold">{email}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Enter the 6-digit code
              </label>
              <div className="flex gap-3 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    style={{ fontSize: 18 }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              style={{ background: "#FA8256", fontWeight: 500, fontSize: 17 }}
              className="w-full rounded py-3 text-black hover:opacity-90 transition disabled:opacity-50"
              disabled={loading || otp.join('').length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0 || resendLoading}
                className="text-orange-600 hover:text-orange-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {resendLoading 
                  ? 'Sending...' 
                  : countdown > 0 
                    ? `Resend in ${countdown}s` 
                    : "Didn't receive the code? Resend"
                }
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('otpEmail');
                  history.push("/login");
                }}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OTPVerification; 
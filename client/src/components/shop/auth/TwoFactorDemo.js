import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import OTPVerification from './OTPVerification';

const TwoFactorDemo = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [showDemo, setShowDemo] = useState(false);
  const [demoEmail, setDemoEmail] = useState('demo@example.com');

  const handleDemoLogin = () => {
    enqueueSnackbar('Demo: Login successful, redirecting to OTP verification', { variant: 'info' });
    // Store demo email and redirect
    localStorage.setItem('otpEmail', demoEmail);
    window.location.href = '/verify-otp';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Two-Factor Authentication Demo
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            This is a demonstration of the 2FA implementation
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Demo Email
              </label>
              <input
                type="email"
                value={demoEmail}
                onChange={(e) => setDemoEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter demo email"
              />
            </div>
            
            <button
              onClick={handleDemoLogin}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Start 2FA Demo
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800">Demo Instructions:</h3>
            <ul className="mt-2 text-sm text-blue-700 space-y-1">
              <li>• Click "Start 2FA Demo" to simulate login</li>
              <li>• You'll see the OTP verification screen</li>
              <li>• Enter any 6-digit code to test the interface</li>
              <li>• Try the resend functionality</li>
              <li>• Test paste functionality with a 6-digit code</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorDemo; 
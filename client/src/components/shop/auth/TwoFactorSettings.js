import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { enable2FAReq, disable2FAReq } from './fetchApi';

const TwoFactorSettings = ({ isEnabled, onToggle }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleEnable2FA = async () => {
    setLoading(true);
    try {
      const response = await enable2FAReq();
      if (response.error) {
        enqueueSnackbar(response.error, { variant: 'error' });
      } else {
        enqueueSnackbar('Two-factor authentication enabled successfully!', { variant: 'success' });
        onToggle(true);
      }
    } catch (error) {
      console.error('Enable 2FA error:', error);
      enqueueSnackbar('Failed to enable two-factor authentication', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setLoading(true);
    try {
      const response = await disable2FAReq();
      if (response.error) {
        enqueueSnackbar(response.error, { variant: 'error' });
      } else {
        enqueueSnackbar('Two-factor authentication disabled successfully!', { variant: 'success' });
        onToggle(false);
      }
    } catch (error) {
      console.error('Disable 2FA error:', error);
      enqueueSnackbar('Failed to disable two-factor authentication', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add an extra layer of security to your account by requiring a verification code in addition to your password.
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isEnabled 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {isEnabled ? 'Enabled' : 'Disabled'}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900">Enhanced Security</h4>
            <p className="text-sm text-gray-600">
              Receive a one-time code via email whenever you sign in from a new device or browser.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900">Easy Setup</h4>
            <p className="text-sm text-gray-600">
              No additional apps required. Verification codes are sent directly to your registered email address.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900">Instant Protection</h4>
            <p className="text-sm text-gray-600">
              Your account is protected immediately after enabling two-factor authentication.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        {isEnabled ? (
          <button
            onClick={handleDisable2FA}
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Disabling...' : 'Disable Two-Factor Authentication'}
          </button>
        ) : (
          <button
            onClick={handleEnable2FA}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Enabling...' : 'Enable Two-Factor Authentication'}
          </button>
        )}
      </div>

      {isEnabled && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Two-factor authentication is active
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  You'll be required to enter a verification code sent to your email address whenever you sign in.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSettings; 
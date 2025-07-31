import React, { createContext, useContext, useReducer } from 'react';

const TwoFactorContext = createContext();

const initialState = {
  is2FAEnabled: false,
  isOTPVerified: false,
  pendingEmail: null,
  showOTPModal: false,
};

const twoFactorReducer = (state, action) => {
  switch (action.type) {
    case 'ENABLE_2FA':
      return {
        ...state,
        is2FAEnabled: true,
      };
    case 'DISABLE_2FA':
      return {
        ...state,
        is2FAEnabled: false,
        isOTPVerified: false,
      };
    case 'SET_OTP_VERIFIED':
      return {
        ...state,
        isOTPVerified: true,
        showOTPModal: false,
      };
    case 'SET_PENDING_EMAIL':
      return {
        ...state,
        pendingEmail: action.payload,
        showOTPModal: true,
      };
    case 'CLEAR_PENDING_EMAIL':
      return {
        ...state,
        pendingEmail: null,
        showOTPModal: false,
      };
    case 'RESET_2FA_STATE':
      return initialState;
    default:
      return state;
  }
};

export const TwoFactorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(twoFactorReducer, initialState);

  const enable2FA = () => dispatch({ type: 'ENABLE_2FA' });
  const disable2FA = () => dispatch({ type: 'DISABLE_2FA' });
  const setOTPVerified = () => dispatch({ type: 'SET_OTP_VERIFIED' });
  const setPendingEmail = (email) => dispatch({ type: 'SET_PENDING_EMAIL', payload: email });
  const clearPendingEmail = () => dispatch({ type: 'CLEAR_PENDING_EMAIL' });
  const reset2FAState = () => dispatch({ type: 'RESET_2FA_STATE' });

  const value = {
    ...state,
    enable2FA,
    disable2FA,
    setOTPVerified,
    setPendingEmail,
    clearPendingEmail,
    reset2FAState,
  };

  return (
    <TwoFactorContext.Provider value={value}>
      {children}
    </TwoFactorContext.Provider>
  );
};

export const useTwoFactor = () => {
  const context = useContext(TwoFactorContext);
  if (!context) {
    throw new Error('useTwoFactor must be used within a TwoFactorProvider');
  }
  return context;
}; 
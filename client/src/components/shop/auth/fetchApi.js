import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

// Configure axios for mixed content (HTTPS frontend to HTTP backend)
const axiosInstance = axios.create({
  baseURL: apiURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle mixed content
axiosInstance.interceptors.request.use(
  (config) => {
    // Ensure we're using the correct protocol for the backend
    if (config.url && !config.url.startsWith('http')) {
      config.url = `${apiURL}${config.url}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const isAuthenticate = () =>
  localStorage.getItem("jwt") ? JSON.parse(localStorage.getItem("jwt")) : false;

export const isAdmin = () =>
  localStorage.getItem("jwt")
    ? JSON.parse(localStorage.getItem("jwt")).user.role === 1
    : false;

export const loginReq = async ({ email, password }) => {
  const data = { email, password };
  console.log('🌐 Making API call to:', `${apiURL}/api/signin`);
  console.log('📤 Request data:', { email, password: '***' });
  
  try {
    let res = await axiosInstance.post(`/api/signin`, data);
    console.log('📥 API Response:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    throw error;
  }
};

export const signupReq = async ({ name, email, password, cPassword }) => {
  const data = { name, email, password, cPassword };
  try {
    let res = await axiosInstance.post(`/api/signup`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const verifyOTPReq = async ({ email, otp }) => {
  const data = { email, otp };
  try {
    let res = await axiosInstance.post(`/api/verify-otp`, data);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const resendOTPReq = async ({ email }) => {
  const data = { email };
  try {
    let res = await axiosInstance.post(`/api/resend-otp`, data);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const enable2FAReq = async () => {
  try {
    const token = localStorage.getItem("jwt") ? JSON.parse(localStorage.getItem("jwt")).token : null;
    let res = await axiosInstance.post(`/api/enable-2fa`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const disable2FAReq = async () => {
  try {
    const token = localStorage.getItem("jwt") ? JSON.parse(localStorage.getItem("jwt")).token : null;
    let res = await axiosInstance.post(`/api/disable-2fa`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
# HTTPS Frontend + HTTP Backend Setup Guide

## 🎯 **What We've Configured**

✅ **Frontend**: HTTPS (secure)  
✅ **Backend**: HTTP (localhost:8000)  
✅ **API Communication**: Properly configured for mixed content  

## 🚀 **How to Start**

### **Option 1: HTTPS Frontend (Recommended)**
```bash
npm start
```
- Frontend will run on: `https://localhost:3000`
- Backend should be on: `http://localhost:8000`
- SSL certificate: Self-signed (browser will show warning - click "Advanced" → "Proceed")

### **Option 2: HTTP Frontend (Fallback)**
```bash
npm run start:http
```
- Frontend will run on: `http://localhost:3000`
- Backend should be on: `http://localhost:8000`

## 🔧 **What's Been Set Up**

### **1. Environment Configuration**
- Created `.env` file with: `REACT_APP_API_URL=http://localhost:8000`
- This ensures frontend connects to HTTP backend

### **2. SSL Certificate**
- Generated self-signed certificate in `sslcert/` directory
- Certificate: `server.crt`
- Private key: `server.key`

### **3. Package.json Scripts**
- `npm start`: Runs with HTTPS
- `npm run start:http`: Runs with HTTP

### **4. Axios Configuration**
- Updated `fetchApi.js` to handle mixed content
- Properly configured for HTTPS frontend → HTTP backend communication

## 🌐 **Browser Security Warning**

When you first visit `https://localhost:3000`, your browser will show a security warning because we're using a self-signed certificate. This is normal for development.

**To proceed:**
1. Click "Advanced"
2. Click "Proceed to localhost (unsafe)"
3. The site will load normally

## 🧪 **Testing the Setup**

### **1. Start Your Backend**
Make sure your backend is running on `http://localhost:8000`

### **2. Start Frontend with HTTPS**
```bash
npm start
```

### **3. Test API Connection**
- Visit `https://localhost:3000`
- Accept the SSL warning
- Test the 2FA demo: `https://localhost:3000/2fa-demo`
- Test user settings: `https://localhost:3000/user/setting`

### **4. Check Network Tab**
- Open browser DevTools
- Go to Network tab
- Verify API calls are going to `http://localhost:8000`
- No more SSL errors should appear

## 🔍 **Troubleshooting**

### **SSL Certificate Issues**
If you get SSL errors:
1. Delete the `sslcert/` folder
2. Run: `cd sslcert && openssl req -x509 -newkey rsa:2048 -keyout server.key -out server.crt -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"`
3. Restart the frontend

### **API Connection Issues**
If API calls fail:
1. Check that backend is running on `http://localhost:8000`
2. Verify `.env` file contains: `REACT_APP_API_URL=http://localhost:8000`
3. Check browser console for errors

### **Mixed Content Errors**
If you see mixed content warnings:
1. The axios configuration should handle this automatically
2. If issues persist, use `npm run start:http` instead

## 📱 **Production Considerations**

For production:
1. Use proper SSL certificates (Let's Encrypt, etc.)
2. Both frontend and backend should use HTTPS
3. Update environment variables accordingly
4. Configure proper CORS settings

## ✅ **Expected Behavior**

- ✅ Frontend loads on `https://localhost:3000`
- ✅ Backend API calls go to `http://localhost:8000`
- ✅ No SSL errors in console
- ✅ 2FA components work properly
- ✅ All existing functionality preserved

Your setup is now ready for secure frontend development while maintaining HTTP backend connectivity! 
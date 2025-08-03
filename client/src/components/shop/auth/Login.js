import React, { Fragment, useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { loginReq } from "./fetchApi";
import { LayoutContext } from "../index";
import { useSnackbar } from 'notistack';
import Navbar from "../partials/Navber";
import { Footer } from "../partials";
import SimpleCaptcha from "./SimpleCaptcha";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';


const Login = (props) => {
  const { data: layoutData, dispatch: layoutDispatch } = useContext(LayoutContext);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState({
    email: "",
    password: "",
    error: false,
    loading: false,
  });

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const alert = (msg) => <div className="text-xs text-red-500 mt-1">{msg}</div>;

  useEffect(() => {
    if (emailSent) {
      const timer = setTimeout(() => setEmailSent(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [emailSent]);

  const formSubmit = async () => {
    if (!captchaVerified) {
      enqueueSnackbar('Please complete the security verification first', { variant: 'error' });
      return;
    }

    setData({ ...data, loading: true });

    try {
      let response = await loginReq({
        email: data.email,
        password: data.password,
      });

      if (response.error) {
        setData({
          ...data,
          loading: false,
          error: response.error,
          password: "",
        });
      } else if (response.requiresOTP) {
        setData({ ...data, loading: false, error: false });
        enqueueSnackbar('Please check your email for OTP verification', { variant: 'info' });
        localStorage.setItem('otpEmail', data.email);
        history.push('/verify-otp');
      } else if (response.token) {
        setData({ email: "", password: "", loading: false, error: false });
        localStorage.setItem("jwt", JSON.stringify(response));
        enqueueSnackbar('Login Completed Successfully..!', { variant: 'success' });
        window.location.href = "/";
      } else {
        setData({ ...data, loading: false, error: 'Unexpected response from server' });
      }
    } catch (err) {
      setData({ ...data, loading: false });
      if (err.response && err.response.status === 429) {
        enqueueSnackbar(err.response.data.error || "Too many login attempts. Please try again after 30 seconds", {
          variant: "error",
        });
      } else {
        enqueueSnackbar("Too many unsuccessful attempts. Please try again after 1 minute", {
          variant: "error",
        });
      }
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setEmailSent(true);
  };

  return (
    <Fragment>
      <Navbar />

      <div className="flex justify-center items-start gap-16 mt-12 px-6" style={{ marginTop: "150px", marginBottom: "80px" }}>
        <div>
          <img
            src={`${process.env.PUBLIC_URL}/gg.png`}
            alt="Cloth"
            style={{ width: "640px", height: "600px", borderRadius: '5px', boxShadow: '0 20px 12px rgba(0,0,0,0.08)' }}
          />
        </div>

        <div
          style={{ minWidth: 500, minHeight: 400, marginTop: "-2px" }}
          className="bg-white rounded-md py-8"
        >
          <div className="font-bold text-3xl mb-0">Log in</div>
          <div className="text-gray-700 mb-4">Enter your details below</div>

          {layoutData.loginSignupError && (
            <div className="bg-red-200 py-2 px-4 mb-3 rounded text-sm text-red-700">
              You need to login for checkout. Haven't an account? Create a new one.
            </div>
          )}

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              formSubmit();
            }}
          >
            <div>
              <input
                onChange={(e) => {
                  setData({ ...data, email: e.target.value, error: false });
                  layoutDispatch({ type: "loginSignupError", payload: false });
                }}
                value={data.email}
                type="text"
                placeholder="Email"
                id="email"
                className="w-full border-b-2 border-gray-200 focus:border-black outline-none py-2 bg-transparent"
                style={{ fontSize: 16 }}
              />
              {data.error && typeof data.error === 'string' && alert(data.error)}
            </div>

            {/* Password field with toggle */}
            <div className="relative">
              <input
                onChange={(e) => {
                  setData({ ...data, password: e.target.value, error: false });
                  layoutDispatch({ type: "loginSignupError", payload: false });
                }}
                value={data.password}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
                className="w-full border-b-2 border-gray-200 focus:border-black outline-none py-2 bg-transparent pr-10"
                style={{ fontSize: 16 }}
              />
              <button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-0 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
  aria-label="Toggle password visibility"
>
  {showPassword ? (
    <EyeSlashIcon className="h-5 w-5" />
  ) : (
    <EyeIcon className="h-5 w-5" />
  )}
</button>

              {data.error && typeof data.error === 'string' && alert(data.error)}
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => { setShowForgot(true); setEmailSent(false); setForgotEmail(""); }}
                className="text-sm text-yellow-600 hover:underline focus:outline-none"
              >
                Forgot Password?
              </button>
            </div>

            {/* CAPTCHA Component */}
            <div className="mt-4">
              <SimpleCaptcha 
                onCaptchaVerified={setCaptchaVerified}
                onCaptchaChange={(verified) => setCaptchaVerified(verified)}
              />
            </div>

            <button
              type="submit"
              style={{ background: "#2563EB", fontWeight: 500, fontSize: 17 }}
              className={`w-full rounded py-2 text-white mt-3 transition ${
                captchaVerified 
                  ? 'hover:opacity-90' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={data.loading || !captchaVerified}
            >
              {data.loading ? 'Logging in...' : 'Login'}
            </button>

            <button
              type="button"
              className="w-full mt-1 flex items-center justify-center gap-2 border border-gray-300 rounded py-2 bg-white hover:bg-gray-50"
            >
              <img src="../image.png" alt="Google" style={{ width: 24, height: 24 }} />
              <span style={{ fontWeight: 500 }}>Sign in with Google</span>
            </button>
          </form>

          <div className="text-center mt-6 text-gray-700 text-base">
            Don’t have an account?{" "}
            <span
              className="underline cursor-pointer text-black font-medium"
              onClick={() => history.push("/signup")}
            >
              Create account
            </span>
          </div>

          {emailSent && (
            <div className="absolute bottom-full mb-1 left-1/3 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg text-base font-semibold animate-fadeOut z-50 whitespace-nowrap">
              Email sent! Please check your inbox.
            </div>
          )}
        </div>
      </div>

      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md shadow-lg max-w-xl w-full p-8 relative">
            <button
              onClick={() => setShowForgot(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Close modal"
            >
              &#x2715;
            </button>

            <h2 className="text-3xl font-bold mb-6 text-center">Forgot Password</h2>

            <form onSubmit={handleForgotSubmit} className="space-y-6">
              <div>
                <label htmlFor="forgotEmail" className="block mb-2 font-medium text-lg">
                  Enter your email address
                </label>
                <input
                  type="email"
                  id="forgotEmail"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 text-lg"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                className="w-full text-gray font-semibold py-3 rounded transition text-lg hover:opacity-90"
                style={{ backgroundColor: "#FA8256" }}
              >
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />

      <style>
        {`
          @keyframes fadeOut {
            0% {opacity: 1;}
            80% {opacity: 1;}
            100% {opacity: 0;}
          }
          .animate-fadeOut {
            animation: fadeOut 3s forwards;
          }
        `}
      </style>
    </Fragment>
  );
};

export default Login;

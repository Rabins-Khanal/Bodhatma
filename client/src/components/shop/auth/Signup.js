import React, { Fragment, useState } from "react";
import { signupReq } from "./fetchApi";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import Navbar from "../partials/Navber";
import { Footer } from "../partials";
import SimpleCaptcha from "./SimpleCaptcha";

const Signup = (props) => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    cPassword: "",
    error: false,
    loading: false,
    success: false,
  });

  const [passwordStrength, setPasswordStrength] = useState({ label: "", color: "" });
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const alert = (msg, type) => (
    <div className={`text-sm text-${type}-500 mt-1`}>{msg}</div>
  );

  // Password requirements: uppercase, lowercase, number, special char
  const passwordMeetsRequirements = (password) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    return hasUpper && hasLower && hasNumber && hasSpecialChar;
  };

  const evaluatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: "Weak", color: "text-red-500" };
    if (score === 2) return { label: "Medium", color: "text-yellow-500" };
    return { label: "Strong", color: "text-green-600" };
  };

  const formSubmit = async () => {
    if (!captchaVerified) {
      enqueueSnackbar("Please complete the security verification first", { variant: "error" });
      return;
    }

    setData({ ...data, loading: true });

    if (data.cPassword !== data.password) {
      return setData({
        ...data,
        error: {
          cPassword: "Passwords don't match",
          password: "Passwords don't match",
        },
        loading: false,
      });
    }

    if (!passwordMeetsRequirements(data.password)) {
      enqueueSnackbar(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        { variant: "error" }
      );
      setData({ ...data, loading: false });
      return;
    }

    try {
      let responseData = await signupReq({
        name: data.name,
        email: data.email,
        password: data.password,
        cPassword: data.cPassword,
      });

      if (responseData.error) {
        setData({
          ...data,
          loading: false,
          error: responseData.error,
          password: "",
          cPassword: "",
        });
        setPasswordStrength({ label: "", color: "" });
      } else if (responseData.success) {
        setData({
          success: responseData.success,
          name: "",
          email: "",
          password: "",
          cPassword: "",
          loading: false,
          error: false,
        });
        setPasswordStrength({ label: "", color: "" });
        enqueueSnackbar("Account Created Successfully..!", { variant: "success" });
        history.push("/login");
      }
    } catch (error) {
      console.log(error);
      setData({ ...data, loading: false });
    }
  };

  const meetsRequirements = passwordMeetsRequirements(data.password);

  return (
    <Fragment>
      <Navbar />


      <div
        className="flex justify-center items-start gap-12 mt-8 px-2"
        style={{ marginTop: "130px", marginBottom: "50px" }}
      >
        <div>
          <img
            src={`${process.env.PUBLIC_URL}/gg.png`}
            alt="cloth"
            style={{
              width: "650px",
              height: "600px",
              borderRadius: "6px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          />
        </div>

        <div style={{ minWidth: 500, marginTop: "-34px" }} className="bg-white rounded-md py-8 px-6">
          <div className="font-bold text-3xl mb-2">Create an account</div>
          <div className="text-gray-700 mb-6">Enter your details below</div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              formSubmit();
            }}
          >
            {data.success ? alert(data.success, "green") : ""}

            <div>
              <input
                onChange={(e) =>
                  setData({ ...data, success: false, error: {}, name: e.target.value })
                }
                value={data.name}
                placeholder="Name"
                type="text"
                className="w-full border-b-2 border-gray-200 focus:border-black outline-none py-2 bg-transparent"
                style={{ fontSize: 16 }}
              />
              {data.error && data.error.name && alert(data.error.name, "red")}
            </div>

            <div>
              <input
                onChange={(e) =>
                  setData({ ...data, success: false, error: {}, email: e.target.value })
                }
                value={data.email}
                placeholder="Email"
                type="email"
                className="w-full border-b-2 border-gray-200 focus:border-black outline-none py-2 bg-transparent"
                style={{ fontSize: 16 }}
              />
              {data.error && data.error.email && alert(data.error.email, "red")}
            </div>

            {/* Password Field (always visible as plain text) */}
            <div>
              <input
                onChange={(e) => {
                  const password = e.target.value;
                  setData({ ...data, success: false, error: {}, password });
                  setPasswordStrength(evaluatePasswordStrength(password));
                }}
                value={data.password}
                placeholder="Password"
                type="text" // always visible plain text
                className="w-full border-b-2 border-gray-200 focus:border-black outline-none py-2 bg-transparent"
                style={{ fontSize: 16 }}
              />
              {data.error && data.error.password && alert(data.error.password, "red")}
              {data.password && (
                <div className={`mt-1 text-sm font-medium ${passwordStrength.color}`}>
                  Password Strength: {passwordStrength.label}
                </div>
              )}

              {!meetsRequirements && data.password.length > 0 && (
                <div className="mt-2 text-red-500 text-sm">
                  Password must include at least:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number</li>
                    <li>One special character</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password Field (also always visible as plain text) */}
            <div>
              <input
                onChange={(e) =>
                  setData({ ...data, success: false, error: {}, cPassword: e.target.value })
                }
                value={data.cPassword}
                placeholder="Confirm Password"
                type="text" // always visible plain text
                className="w-full border-b-2 border-gray-200 focus:border-black outline-none py-2 bg-transparent"
                style={{ fontSize: 16 }}
              />
              {data.error && data.error.cPassword && alert(data.error.cPassword, "red")}
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
                captchaVerified ? "hover:opacity-90" : "opacity-50 cursor-not-allowed"
              }`}
              disabled={data.loading || !captchaVerified}
            >
              {data.loading ? "Creating Account..." : "Create Account"}
            </button>

            <button
              type="button"
              className="w-full mt-1 flex items-center justify-center gap-2 border border-gray-300 rounded py-2 bg-white hover:bg-gray-50"
            >
              <img src="../image.png" alt="Google" style={{ width: 24, height: 24 }} />
              <span style={{ fontWeight: 500 }}>Sign up with Google</span>
            </button>
          </form>

          <div className="text-center mt-6 text-gray-700 text-base">
            Already have an account?{" "}
            <span
              className="underline cursor-pointer text-black font-medium"
              onClick={() => history.push("/login")}
            >
              Log in
            </span>
          </div>
        </div>
      </div>

      <Footer />
    </Fragment>
  );
};

export default Signup;

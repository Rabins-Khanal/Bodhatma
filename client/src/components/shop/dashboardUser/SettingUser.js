import React, { Fragment, useState, useContext } from "react";
import Layout from "./Layout";
import { handleChangePassword } from "./Action";
import { DashboardUserContext } from "./Layout";

const SettingComponent = () => {
  const { data, dispatch } = useContext(DashboardUserContext);

  const [fData, setFdata] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    success: false,
    error: false,
    passwordView: false,
    type: "password",
  });

  if (fData.success || fData.error) {
    setTimeout(() => {
      setFdata({ ...fData, success: false, error: false });
    }, 1500);
  }

  if (data.loading) {
    return (
      <div className="w-full md:w-9/12 flex items-center justify-center py-16">
        <svg
          className="w-10 h-10 animate-spin text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="flex flex-col w-full my-4 md:my-0 md:w-9/12 md:px-8">
        <div className="shadow-lg border rounded-md bg-white">
          <div className="py-4 px-6 text-lg font-semibold border-b border-orange-500 text-gray-800">
            Change Password
          </div>

          <div className="p-6 flex flex-col space-y-5">
            {fData.success && (
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-sm font-medium">
                {fData.success}
              </div>
            )}
            {fData.error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm font-medium">
                {fData.error}
              </div>
            )}

            {/* Old Password */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="oldPassword" className="text-sm font-medium">
                Old Password
              </label>
              <div className="relative">
                <input
                  onChange={(e) =>
                    setFdata({ ...fData, oldPassword: e.target.value })
                  }
                  value={fData.oldPassword}
                  type={fData.type}
                  id="oldPassword"
                  className="border px-4 py-2 w-full focus:outline-orange-500 rounded"
                />
                <span
                  onClick={() =>
                    setFdata({
                      ...fData,
                      passwordView: !fData.passwordView,
                      type: fData.passwordView ? "password" : "text",
                    })
                  }
                  className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                >
                  {fData.passwordView ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411L21 21"
                      />
                    </svg>
                  )}
                </span>
              </div>
            </div>

            {/* New Password */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </label>
              <input
                onChange={(e) =>
                  setFdata({ ...fData, newPassword: e.target.value })
                }
                value={fData.newPassword}
                type="password"
                id="newPassword"
                className="border px-4 py-2 w-full focus:outline-orange-500 rounded"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <input
                onChange={(e) =>
                  setFdata({ ...fData, confirmPassword: e.target.value })
                }
                value={fData.confirmPassword}
                type="password"
                id="confirmPassword"
                className="border px-4 py-2 w-full focus:outline-orange-500 rounded"
              />
            </div>

            {/* Button */}
            <div className="flex justify-center">
              <button
                onClick={() =>
                  handleChangePassword(fData, setFdata, dispatch)
                }
                className="bg-orange-600 hover:bg-orange-600 text-white text-sm py-2 px-5 rounded transition-all duration-200 font-semibold"

              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const SettingUser = () => {
  return (
    <Fragment>
      <Layout children={<SettingComponent />} />
    </Fragment>
  );
};

export default SettingUser;

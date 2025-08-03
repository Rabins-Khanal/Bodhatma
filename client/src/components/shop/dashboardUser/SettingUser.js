import React, { Fragment, useState, useContext, useEffect } from "react";
import Layout from "./Layout";
import { handleChangePassword } from "./Action";
import { DashboardUserContext } from "./Layout";
import { useSnackbar } from 'notistack';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';


const SettingComponent = () => {
  const { data, dispatch } = useContext(DashboardUserContext);
  const { enqueueSnackbar } = useSnackbar();

  const [fData, setFdata] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    success: false,
    error: false,
    passwordView: false,
    type: "password",
  });

  useEffect(() => {
    if (fData.success || fData.error) {
      const timeout = setTimeout(() => {
        setFdata({ ...fData, success: false, error: false });
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [fData.success, fData.error]);

  return (
    <Fragment>
      <div className="flex flex-col w-full my-4 md:my-0 md:w-9/12 md:px-8 space-y-6">
        {/* Change Password Section */}
        <div className="shadow-lg border rounded-md bg-white">
          <div className="py-4 px-6 text-lg font-semibold border-b border-blue-600 text-gray-800">
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
                <button
  type="button"
  onClick={() =>
    setFdata({
      ...fData,
      passwordView: !fData.passwordView,
      type: fData.passwordView ? "password" : "text",
    })
  }
  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 focus:outline-none"
  aria-label="Toggle password visibility"
>
  {fData.passwordView ? (
    <EyeSlashIcon className="w-5 h-5" />
  ) : (
    <EyeIcon className="w-5 h-5" />
  )}
</button>

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

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                onClick={() =>
                  handleChangePassword(fData, setFdata, dispatch)
                }
                className="bg-blue-600 hover:bg-blue-600 text-white text-sm py-2 px-5 rounded transition-all duration-200 font-semibold"
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

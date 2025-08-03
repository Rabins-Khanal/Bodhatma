import React, { Fragment, useContext, useState, useEffect } from "react";
import Layout from "./Layout";
import { DashboardUserContext } from "./Layout";
import { updatePersonalInformationAction } from "./Action";

const ProfileComponent = () => {
  const { data, dispatch } = useContext(DashboardUserContext);
  const userDetails = data.userDetails !== null ? data.userDetails : "";

  const [fData, setFdata] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    success: false,
  });

  useEffect(() => {
    setFdata({
      ...fData,
      id: userDetails._id,
      name: userDetails.name,
      email: userDetails.email,
      phone: userDetails.phoneNumber,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  const handleSubmit = () => {
    updatePersonalInformationAction(dispatch, fData);
  };

  if (data.loading) {
    return (
      <div className="w-full md:w-9/12 flex items-center justify-center ">
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
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
        <div className="shadow-xl border rounded-xl overflow-hidden">
          <div className="py-4 px-6 text-xl font-semibold bg-blue-100 border-b border-blue-600 text-blue-800">
            Personal Information
          </div>
          <div className="py-6 px-6 md:px-10 flex flex-col space-y-6 bg-white">
            {fData.success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {fData.success}
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
              <input
                onChange={(e) => setFdata({ ...fData, name: e.target.value })}
                value={fData.name}
                type="text"
                id="name"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <input
                value={fData.email}
                readOnly
                type="email"
                id="email"
                className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-700 w-full cursor-not-allowed focus:outline-none"
              />
              <span className="text-xs text-gray-500">
                Email is permanent.
              </span>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="number" className="text-sm font-medium text-gray-700">Phone Number</label>
              <input
                onChange={(e) => setFdata({ ...fData, phone: e.target.value })}
                value={fData.phone}
                type="number"
                id="number"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="w-fit px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition-all duration-200"
              >
                Update Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const UserProfile = () => {
  return (
    <Fragment>
      <Layout children={<ProfileComponent />} />
    </Fragment>
  );
};

export default UserProfile;

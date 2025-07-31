import React, { Fragment, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

const AdminSidebar = (props) => {
  const location = useLocation();
  const history = useHistory();
  const [loadingScriptures, setLoadingScriptures] = useState(false);

  const handleScripturesClick = () => {
    setLoadingScriptures(true);
    setTimeout(() => {
      setLoadingScriptures(false);
      history.push("/admin/dashboard/scriptures");
    }, 1000); // 1 second simulated delay
  };

  return (
    <Fragment>
      <div
        style={{ boxShadow: "1px 1px 8px 0.2px #aaaaaa" }}
        id="sidebar"
        className="hidden md:block sticky top-0 left-0 h-screen md:w-3/12 lg:w-2/12 sidebarShadow bg-white text-gray-600"
      >
        {/* Dashboard */}
        <div
          onClick={() => history.push("/admin/dashboard")}
          className={`${
            location.pathname === "/admin/dashboard"
              ? "border-r-4 border-gray-800 bg-gray-100"
              : ""
          } hover:bg-gray-200 cursor-pointer flex flex-col items-center justify-center py-6`}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-gray-600 hover:text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6"
              />
            </svg>
          </span>
          <span className="hover:text-gray-800">Dashboard</span>
        </div>

        <hr className="border-b border-gray-200" />

        {/* Categories */}
        <div
          onClick={() => history.push("/admin/dashboard/categories")}
          className={`${
            location.pathname === "/admin/dashboard/categories"
              ? "border-r-4 border-gray-800 bg-gray-100"
              : ""
          } hover:bg-gray-200 cursor-pointer flex flex-col items-center justify-center py-6`}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-gray-600 hover:text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11H5m14 4H5m14-8H5m14 12H5a2 2 0 01-2-2V7a2 2 0 002-2h14a2 2 0 012 2v10a2 2 0 01-2 2z"
              />
            </svg>
          </span>
          <span className="hover:text-gray-800">Categories</span>
        </div>

        <hr className="border-b border-gray-200" />

        {/* Products */}
        <div
          onClick={() => history.push("/admin/dashboard/products")}
          className={`${
            location.pathname === "/admin/dashboard/products"
              ? "border-r-4 border-gray-800 bg-gray-100"
              : ""
          } hover:bg-gray-200 cursor-pointer flex flex-col items-center justify-center py-6`}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-gray-600 hover:text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 12l-8-6-8 6 8 6 8-6z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12" />
            </svg>
          </span>
          <span className="hover:text-gray-800">Product</span>
        </div>

        <hr className="border-b border-gray-200" />

        {/* Orders */}
        <div
          onClick={() => history.push("/admin/dashboard/orders")}
          className={`${
            location.pathname === "/admin/dashboard/orders"
              ? "border-r-4 border-gray-800 bg-gray-100"
              : ""
          } hover:bg-gray-200 cursor-pointer flex flex-col items-center justify-center py-6`}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-gray-600 hover:text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h3l2-2 2 2h3a2 2 0 012 2v11a2 2 0 01-2 2z"
              />
            </svg>
          </span>
          <span className="hover:text-gray-800">Order</span>
        </div>

        <hr className="border-b border-gray-200" />

        {/* Scriptures (Activity Log with fake loading) */}
        <div
          onClick={handleScripturesClick}
          className={`${
            location.pathname === "/admin/dashboard/scriptures"
              ? "border-r-4 border-gray-800 bg-gray-100"
              : ""
          } hover:bg-gray-200 cursor-pointer flex flex-col items-center justify-center py-6 relative`}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-8 h-8 ${
                loadingScriptures ? "text-gray-400 animate-spin" : "text-gray-600"
              } hover:text-gray-800`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h3l2-2 2 2h3a2 2 0 012 2v11a2 2 0 01-2 2z"
              />
            </svg>
          </span>
          <span className="hover:text-gray-800">
            {loadingScriptures ? "Loading..." : "Activity Log"}
          </span>
        </div>

        <hr className="border-b border-gray-200" />
      </div>
    </Fragment>
  );
};

export default AdminSidebar;

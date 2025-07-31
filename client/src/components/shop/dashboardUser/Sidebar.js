import React, { Fragment, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { logout } from "./Action";
import { DashboardUserContext } from "./Layout";

const Sidebar = () => {
  const { data } = useContext(DashboardUserContext);
  const history = useHistory();
  const location = useLocation();

  const navItems = [
    { label: "My Orders", path: "/user/orders" },
    { label: "My Account", path: "/user/profile" },
    { label: "Settings", path: "/user/setting" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <Fragment>
      <div className="flex flex-col w-full md:w-3/12 font-medium space-y-4">

        {/* Redesigned User Info Card */}
        <div className="flex items-center space-x-4 bg-white shadow-md border border-gray-200 rounded-lg p-4">
          {/* New icon */}
          <div className="w-14 h-14 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xl font-bold">
            {data.userDetails?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Welcome back,</span>
            <span className="text-gray-900 text-lg font-semibold">
              {data.userDetails?.name || "User"}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="shadow-md rounded overflow-hidden hidden md:flex flex-col bg-white">
          {navItems.map((item, index) => (
            <div
              key={index}
              onClick={() => history.push(item.path)}
              className={`px-5 py-4 cursor-pointer hover:bg-gray-100 transition ${
                isActive(item.path)
                  ? "bg-yellow-100 border-r-4 border-yellow-700 font-semibold"
                  : ""
              }`}
            >
              {item.label}
            </div>
          ))}
          <hr />
          <div
            onClick={logout}
            className="px-5 py-4 cursor-pointer hover:bg-red-100 text-red-700 transition"
          >
            Logout
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Sidebar;

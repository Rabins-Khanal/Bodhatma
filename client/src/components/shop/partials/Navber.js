import React, { Fragment, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./style.css";
import { HomeContext } from "../home/index";
import { isAdmin } from "../auth/fetchApi";
import { LayoutContext } from "../index";
import { logout } from "./Action";
import ProductCategoryDropdown from "../home/ProductCategoryDropdown"; // Adjust path if needed

const Navber = (props) => {
  const history = useHistory();
  const location = useLocation();
  const { data, dispatch } = useContext(LayoutContext);

  const toggle = (type, value) => dispatch({ type, payload: value });

  return (
    <Fragment>
      <nav className="fixed top-0 w-full z-20 shadow-lg lg:shadow-none bg-white">
        <div className="m-4 md:mx-12 md:my-6 grid grid-cols-3 items-center">
          {/* LOGO */}
          <div
            onClick={() => history.push("/")}
            style={{ letterSpacing: "0.2rem" }}
            className="flex items-center text-gray-800 font-bold tracking-widest uppercase text-2xl cursor-pointer col-span-1"
          >
            <img
              src="../logo.png" // Replace with your actual logo path
              alt="Bodhivana Logo"
              className="h-14 w-10 mr-3"
            />
           Bodhatma
          </div>

          {/* NAV LINKS */}
          <div className="hidden lg:flex justify-center col-span-1 text-gray-600 space-x-6">
            {["/", "/scriptures", "/accessories", "/about"].map((path, i) => (
              <span
                key={i}
                className="hover:bg-gray-200 px-4 py-3 rounded-lg font-light tracking-widest hover:text-gray-800 cursor-pointer"
                onClick={() => history.push(path)}
              >
                {path === "/"
                  ? "Home"
                  : path === "/scriptures"
                  ? "Scriptures"
                  : path === "/accessories"
                  ? "Accessories"
                  : "About"}
              </span>
            ))}
          </div>

          {/* BUTTONS: Search, Wishlist, Profile/Login, Cart */}
          <div className="flex items-center justify-end col-span-1 space-x-4">
            {/* 🔍 Search */}
            <div
              onClick={() => toggle("searchDropdown", !data.searchDropdown)}
              className={`hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer ${
                data.searchDropdown ? "text-yellow-700" : ""
              }`}
              title="Search"
            >
              <svg
                className="w-6 h-6 text-gray-600 hover:text-yellow-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* ❤️ Wishlist */}
            <div
              onClick={() => history.push("/wish-list")}
              className="hover:bg-gray-200 rounded-lg px-2 py-2 cursor-pointer"
              title="Wishlist"
            >
              <svg
                className={`${
                  location.pathname === "/wish-list"
                    ? "fill-current text-gray-800"
                    : ""
                } w-6 h-6 text-gray-600`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>

            {/* 👤 Profile / Login */}
            {localStorage.getItem("jwt") ? (
              <div
                className="userDropdownBtn hover:bg-gray-200 px-2 py-2 rounded-lg relative"
                title="Profile"
              >
                {/* Profile Icon (User Circle) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="cursor-pointer w-6 h-6 text-gray-600 hover:text-gray-800"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 8a6 6 0 11-12 0 6 6 0 0112 0zm-6 8a9 9 0 00-7.938 4.588A1 1 0 004 22h16a1 1 0 00.938-1.412A9 9 0 0012 16z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="userDropdown absolute right-0 mt-1 bg-gray-200 rounded">
                  <ul className="flex flex-col text-gray-700 w-48 shadow-lg">
                    {!isAdmin() ? (
                      <>
                        <li
                          onClick={() => history.push("/user/orders")}
                          className="px-6 py-2 hover:bg-gray-400 cursor-pointer"
                        >
                          My Orders
                        </li>
                        <li
                          onClick={() => history.push("/user/profile")}
                          className="px-6 py-2 hover:bg-gray-400 cursor-pointer"
                        >
                          My Account
                        </li>

                        <li
                          onClick={() => history.push("/user/setting")}
                          className="px-6 py-2 hover:bg-gray-400 cursor-pointer"
                        >
                          Settings
                        </li>
                        <li
                          onClick={() => logout()}
                          className="px-6 py-2 hover:bg-gray-400 cursor-pointer"
                        >
                          Logout
                        </li>
                      </>
                    ) : (
                      <>
                        <li
                          onClick={() => history.push("/admin/dashboard")}
                          className="px-6 py-2 hover:bg-gray-400 cursor-pointer"
                        >
                          Admin Panel
                        </li>
                        <li
                          onClick={() => logout()}
                          className="px-6 py-2 hover:bg-gray-400 cursor-pointer"
                        >
                          Logout
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div
                onClick={() => history.push("/login")}
                className="hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer"
                title="Login"
              >
                <svg
                  className="w-6 h-6 text-gray-600 hover:text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </div>
            )}

            {/* 🛒 Cart (now goes to /cart) */}
            <div
              onClick={() => history.push("/cart")}
              className="hover:bg-gray-200 px-2 py-2 rounded-lg relative cursor-pointer"
              title="Cart"
            >
              {/* Realistic Cart Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-gray-600 hover:text-gray-800"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 4h13"
                />
                <circle cx="9" cy="19" r="2" />
                <circle cx="17" cy="19" r="2" />
              </svg>
              <span className="absolute top-0 ml-5 mt-1 bg-yellow-700 rounded px-1 text-white text-xs font-semibold">
                {data.cartProduct?.length || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Show search dropdown when search icon is clicked */}
        {data.searchDropdown && (
          <div className="absolute top-full w-full bg-white shadow-md z-10">
            <ProductCategoryDropdown />
          </div>
        )}

        {/* MOBILE: Hamburger menu remains unchanged */}
      </nav>
    </Fragment>
  );
};

export default Navber;

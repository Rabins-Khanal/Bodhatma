import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const SimpleFooter = () => {
  return (
    <footer
      style={{ backgroundColor: "#BFDBFE" }}
      className="text-black py-12 px-6"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 pointer-events-none">
        <div className="flex flex-col pl-4">
          <h3 className="font-semibold text-lg mb-5">Buy your first wear!</h3>
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-md border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            disabled
          />
        </div>

        <div className="flex flex-col pl-4">
          <h3 className="font-semibold text-lg mb-5">Support</h3>
          <span className="text-base cursor-pointer hover:underline">
            +977 9842242427
          </span>
          <span className="mt-2 text-base cursor-pointer hover:underline">
            support@gmail.com
          </span>
        </div>

        <div className="flex flex-col pl-4">
          <h3 className="font-semibold text-lg mb-5">Account</h3>
          <span className="text-base cursor-pointer hover:underline mb-2">
            Address
          </span>
          <span className="text-base cursor-pointer hover:underline mb-2">
            Dillibazar, Kathmandu
          </span>
          <span className="text-base cursor-pointer hover:underline">
            Softwarica College
          </span>
        </div>

        <div className="flex flex-col pl-4">
          <h3 className="font-semibold text-lg mb-5">Quick Link</h3>
          <span className="text-base cursor-pointer hover:underline mb-2">
            Privacy Policy
          </span>
          <span className="text-base cursor-pointer hover:underline mb-2">
            Terms of Use
          </span>
          <span className="text-base cursor-pointer hover:underline">
            Contact
          </span>
        </div>

        <div className="flex flex-col pl-4">
          <h3 className="font-semibold text-lg mb-5">Socials</h3>
          <div className="flex space-x-6 text-orange-900 text-xl">
            <span
              aria-label="Facebook"
              className="cursor-pointer hover:underline transition duration-200"
            >
              <FaFacebookF />
            </span>
            <span
              aria-label="Instagram"
              className="cursor-pointer hover:underline transition duration-200"
            >
              <FaInstagram />
            </span>
            <span
              aria-label="Twitter"
              className="cursor-pointer hover:underline transition duration-200"
            >
              <FaTwitter />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;

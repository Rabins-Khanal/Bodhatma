import React, { Fragment, useContext } from "react";
import { LayoutContext } from "../layout";

const OrderSuccessMessage = () => {
  const { data, dispatch } = useContext(LayoutContext);

  const handleClose = () => {
    dispatch({ type: "orderSuccess", payload: false });
  };

  return (
    <Fragment>
      {data.orderSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your order. We'll process it and deliver it to you soon.
            </p>
            <button
              onClick={handleClose}
              className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition duration-300"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default OrderSuccessMessage;

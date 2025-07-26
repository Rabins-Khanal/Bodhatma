import React, { Fragment, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../layout";
import { quantity, subTotal, totalCost } from "../partials/Mixins";

import { getUserIdFromToken } from "../../admin/categories/FetchApi";
import { cartListProduct } from "../partials/FetchApi";
import { fetchData, fetchbrainTree } from "./Action";
import { getBrainTreeToken } from "./FetchApi";

import axios from "axios";
import DropIn from "braintree-web-drop-in-react";

const apiURL = process.env.REACT_APP_API_URL;

export const CheckoutComponent = (props) => {
  const history = useHistory();
  const userId = getUserIdFromToken();
  const { data, dispatch } = useContext(LayoutContext);

  const [state, setState] = useState({
    address: "",
    phone: "",
    error: false,
    success: false,
    clientToken: null,
    instance: {},
  });

  useEffect(() => {
    fetchData(cartListProduct, dispatch);
    fetchbrainTree(getBrainTreeToken, setState);
  }, []);

  const handleOrderSubmit = async () => {
    const orderData = {
      allProduct: data.cartProduct.map((product) => ({
        id: product._id,
        quantity: quantity(product._id),
      })),
      user: userId,
      amount: totalCost(data.cartProduct),
      address: state.address,
      phone: state.phone,
    };

    try {
      const response = await axios.post(
        `${apiURL}/api/order/create-order`,
        orderData
      );
      if (response.data.success) {
        history.push("/");
      } else {
        setState({ ...state, error: "Order failed. Please try again." });
      }
    } catch (error) {
      setState({
        ...state,
        error: error.response
          ? error.response.data.message
          : "An error occurred while creating the order",
      });
    }
  };

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
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
        Please wait until finish
      </div>
    );
  }

  return (
    <Fragment>
      <section className="mx-4 mt-20 md:mx-12 md:mt-32 lg:mt-24">
        <div className="text-3xl font-bold text-gray-800 mb-6">Checkout</div>

        {/* Unified Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:space-x-8">
            {/* Left: Product Summary */}
            <div className="md:w-1/2 mb-8 md:mb-0">
              <CheckoutProducts products={data.cartProduct} />
            </div>

            {/* Right: Form + Payment */}
            <div className="md:w-1/2">
              {state.clientToken !== null ? (
                <div onBlur={() => setState({ ...state, error: false })}>
                  {state.error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                      {state.error}
                    </div>
                  )}

                  <div className="mb-4">
                    <label
                      htmlFor="address"
                      className="block font-medium text-gray-700 mb-1"
                    >
                      Delivery Address
                    </label>
                    <input
                      value={state.address}
                      onChange={(e) =>
                        setState({
                          ...state,
                          address: e.target.value,
                          error: false,
                        })
                      }
                      type="text"
                      id="address"
                      className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="Address..."
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="phone"
                      className="block font-medium text-gray-700 mb-1"
                    >
                      Phone No.
                    </label>
                    <input
                      value={state.phone}
                      onChange={(e) =>
                        setState({
                          ...state,
                          phone: e.target.value,
                          error: false,
                        })
                      }
                      type="number"
                      id="phone"
                      className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>

                  <DropIn
                    options={{
                      authorization: state.clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => (state.instance = instance)}
                  />

                  <div className="flex justify-center mt-6">
                    <div
                      onClick={handleOrderSubmit}
                      className="w-full md:w-40 text-center px-4 py-2 text-white font-semibold bg-orange-600 hover:bg-orange-700 rounded-md transition duration-300 cursor-pointer"
                    >
                      Order Now
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
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
              )}
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

const CheckoutProducts = ({ products }) => {
  const history = useHistory();

  return (
    <Fragment>
      <div className="grid grid-cols-1 gap-4">
        {products && products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={index}
              className="bg-gray-50 border rounded-lg p-4 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6"
            >
              <img
                onClick={() => history.push(`/products/${product._id}`)}
                className="w-full h-40 md:w-24 md:h-24 object-cover rounded-md cursor-pointer"
                src={`${apiURL}/uploads/products/${product.pImages[0]}`}
                alt="Product"
              />
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-800 truncate">
                  {product.pName}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Price:{" "}
                  <span className="font-medium">Rs.{product.pPrice}.00</span>
                </div>
                <div className="text-sm text-gray-600">
                  Quantity:{" "}
                  <span className="font-medium">{quantity(product._id)}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Subtotal:{" "}
                  <span className="font-medium">
                    Rs.{subTotal(product._id, product.pPrice)}.00
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No product to checkout</div>
        )}
      </div>
    </Fragment>
  );
};

export default CheckoutComponent;

import React, { Fragment, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../layout";
import { quantity, subTotal, totalCost } from "../partials/Mixins";

import { getUserIdFromToken } from "../../admin/categories/FetchApi";
import { cartListProduct } from "../partials/FetchApi";
import { fetchData } from "./Action";
import { createOrder } from "./FetchApi";
import KhaltiPayment from "./KhaltiPayment";

import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL || 'https://localhost:8000';

export const CheckoutComponent = (props) => {
  const history = useHistory();
  const userId = getUserIdFromToken();
  const { data, dispatch } = useContext(LayoutContext);

  const [state, setState] = useState({
    address: "",
    phone: "",
    error: false,
    success: false,
    paymentMethod: "cod", // Default to COD
    loading: false,
    showKhaltiPayment: false,
  });

  useEffect(() => {
    fetchData(cartListProduct, dispatch);
  }, []);

  const handlePaymentMethodChange = (method) => {
    setState({ ...state, paymentMethod: method, error: false });
  };

  const handleOrderSubmit = async () => {
    if (!state.address) {
      setState({ ...state, error: "Please provide your address" });
      return;
    }
    if (!state.phone) {
      setState({ ...state, error: "Please provide your phone number" });
      return;
    }

    if (state.paymentMethod === "cod") {
      // Handle COD payment
      await handleCODPayment();
    } else if (state.paymentMethod === "khalti") {
      // Show Khalti payment
      setState({ ...state, showKhaltiPayment: true });
    }
  };

  const handleCODPayment = async () => {
    setState({ ...state, loading: true });
    
    const orderData = {
      allProduct: data.cartProduct.map((product) => ({
        id: product._id,
        quantity: quantity(product._id),
      })),
      user: userId,
      amount: totalCost(data.cartProduct),
      address: state.address,
      phone: state.phone,
      paymentMethod: "cod",
      paymentStatus: "pending",
    };

    try {
      const response = await axios.post(
        `${apiURL}/api/order/create-order`,
        orderData
      );
      if (response.data.success) {
        // Clear cart
        localStorage.setItem("cart", JSON.stringify([]));
        dispatch({ type: "cartProduct", payload: null });
        dispatch({ type: "cartTotalCost", payload: null });
        dispatch({ type: "orderSuccess", payload: true });
        
        setState({ ...state, loading: false, success: true });
        history.push("/");
      } else {
        setState({ ...state, loading: false, error: "Order failed. Please try again." });
      }
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: error.response
          ? error.response.data.message
          : "An error occurred while creating the order",
      });
    }
  };

  const handleKhaltiSuccess = async (payload) => {
    setState({ ...state, loading: true });
    
    const orderData = {
      allProduct: data.cartProduct.map((product) => ({
        id: product._id,
        quantity: quantity(product._id),
      })),
      user: userId,
      amount: totalCost(data.cartProduct),
      address: state.address,
      phone: state.phone,
      paymentMethod: "khalti",
      paymentStatus: "completed",
      transactionId: payload.idx,
      khaltiData: payload,
    };

    try {
      const response = await axios.post(
        `${apiURL}/api/order/create-order`,
        orderData
      );
      if (response.data.success) {
        // Clear cart
        localStorage.setItem("cart", JSON.stringify([]));
        dispatch({ type: "cartProduct", payload: null });
        dispatch({ type: "cartTotalCost", payload: null });
        dispatch({ type: "orderSuccess", payload: true });
        
        setState({ ...state, loading: false, success: true, showKhaltiPayment: false });
        history.push("/");
      } else {
        setState({ ...state, loading: false, error: "Order failed. Please try again." });
      }
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: error.response
          ? error.response.data.message
          : "An error occurred while creating the order",
      });
    }
  };

  const handleKhaltiError = (error) => {
    setState({ ...state, error: "Payment failed. Please try again." });
  };

  const handleKhaltiClose = () => {
    setState({ ...state, showKhaltiPayment: false });
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
              <div onBlur={() => setState({ ...state, error: false })}>
                {state.error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                    {state.error}
                  </div>
                )}

                {state.success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                    Order placed successfully!
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

                <div className="mb-6">
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

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <label className="block font-medium text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={state.paymentMethod === "cod"}
                        onChange={(e) => handlePaymentMethodChange(e.target.value)}
                        className="mr-3 text-orange-600 focus:ring-orange-500"
                      />
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-green-600 font-bold text-sm">₹</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Cash on Delivery</div>
                          <div className="text-sm text-gray-500">Pay when you receive your order</div>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="khalti"
                        checked={state.paymentMethod === "khalti"}
                        onChange={(e) => handlePaymentMethodChange(e.target.value)}
                        className="mr-3 text-orange-600 focus:ring-orange-500"
                      />
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-purple-600 font-bold text-sm">K</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Khalti Payment</div>
                          <div className="text-sm text-gray-500">Pay securely with Khalti</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">Rs.{totalCost(data.cartProduct)}.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery:</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-semibold text-gray-800">Total:</span>
                      <span className="font-semibold text-gray-800">Rs.{totalCost(data.cartProduct)}.00</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleOrderSubmit}
                    disabled={state.loading}
                    className="w-full md:w-40 text-center px-4 py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-md transition duration-300 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {state.loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      `Order Now`
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Khalti Payment Component */}
      {state.showKhaltiPayment && (
        <KhaltiPayment
          amount={totalCost(data.cartProduct)}
          onSuccess={handleKhaltiSuccess}
          onError={handleKhaltiError}
          onClose={handleKhaltiClose}
        />
      )}
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

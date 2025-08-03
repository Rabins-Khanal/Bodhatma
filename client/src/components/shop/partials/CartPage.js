import React, { Fragment, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../index";
import { cartListProduct } from "./FetchApi";
import { isAuthenticate } from "../auth/fetchApi";
import { cartList } from "../productDetails/Mixins";
import { subTotal, quantity, totalCost } from "./Mixins";

const apiURL = process.env.REACT_APP_API_URL;

const CartPage = () => {
  const history = useHistory();
  const { data, dispatch } = useContext(LayoutContext);
  const products = data.cartProduct;

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      let responseData = await cartListProduct();
      if (responseData && responseData.Products) {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "cartTotalCost", payload: totalCost() });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeCartProduct = (id) => {
    let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    if (cart.length !== 0) {
      cart = cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(cart));
      fetchData();
      dispatch({ type: "inCart", payload: cartList() });
      dispatch({ type: "cartTotalCost", payload: totalCost() });
    }
    if (cart.length === 0) {
      dispatch({ type: "cartProduct", payload: null });
      fetchData();
      dispatch({ type: "inCart", payload: cartList() });
    }
  };

  return (
    <div>
      

      {/* 🛒 Cart Section */}
      <section className="w-full max-w-4xl mx-auto pt-12 pb-12 flex flex-col bg-white relative z-10 mt-24 rounded shadow space-y-4">
        <div className="border-b border-gray-200 flex justify-between items-center p-6">
          <div className="text-black text-2xl font-semibold">Cart</div>
          <button
            onClick={() => history.push("/")}
            className="px-4 py-2 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Shop More
          </button>
        </div>

        <div className="px-6 py-4">
          {products && products.length !== 0 ? (
            products.map((item, index) => (
              <Fragment key={index}>
                <div className="flex items-center border-b py-4 space-x-4">
                  <img
                    className="w-20 h-20 object-cover object-center rounded"
                    src={`${apiURL}/uploads/products/${item.pImages[0]}`}
                    alt={item.pName}
                  />
                  <div className="flex-grow flex flex-col">
                    <div className="font-semibold text-lg">{item.pName}</div>
                    <div className="flex items-center mt-2 space-x-6">
                      <div className="text-gray-600 text-sm">
                        Quantity:{" "}
                        <span className="font-medium text-gray-900">{quantity(item._id)}</span>
                      </div>
                      <div className="text-gray-600 text-sm">
                        Subtotal:{" "}
                        <span className="font-medium text-gray-900">
                          Rs.{subTotal(item._id, item.pPrice)}.00
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeCartProduct(item._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Remove"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </Fragment>
            ))
          ) : (
            <div className="text-gray-600 text-center py-12 text-xl">Cart is Empty!</div>
          )}
        </div>

        <div className="px-6 py-4 border-t space-y-4">
          {data.cartTotalCost ? (
            isAuthenticate() ? (
              <button
                style={{ backgroundColor: "#3B82F6" }}
                className="w-full px-6 py-3 text-white rounded-lg text-lg font-semibold hover:opacity-90"
                onClick={() => history.push("/checkout")}
              >
                Checkout 
              </button>
            ) : (
              <button
                className="w-full px-6 py-3 bg-[#D05D39] text-white rounded-lg text-lg font-semibold hover:bg-[#b05432]"
                onClick={() => {
                  history.push("/");
                  dispatch({ type: "loginSignupError", payload: !data.loginSignupError });
                  dispatch({ type: "loginSignupModalToggle", payload: !data.loginSignupModal });
                }}
              >
                Checkout 
              </button>
            )
          ) : (
            <button
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold cursor-not-allowed"
              disabled
            >
              Checkout
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default CartPage;

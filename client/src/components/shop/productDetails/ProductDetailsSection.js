import React, { Fragment, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LayoutContext } from "../layout";
import { ProductDetailsContext } from "./index";
import ProductDetailsSectionTwo from "./ProductDetailsSectionTwo";
import Submenu from "./Submenu";

import { cartListProduct } from "../partials/FetchApi";
import { getSingleProduct } from "./FetchApi";

import { isWish, isWishReq, unWishReq } from "../home/Mixins";
import { totalCost } from "../partials/Mixins";
import { addToCart, cartList, updateQuantity } from "./Mixins";

const apiURL = process.env.REACT_APP_API_URL;

const ProductDetailsSection = (props) => {
  let { id } = useParams();

  const { data, dispatch } = useContext(ProductDetailsContext);
  const { data: layoutData, dispatch: layoutDispatch } = useContext(LayoutContext);

  const sProduct = layoutData.singleProductDetail;
  const [pImages, setPimages] = useState(null);
  const [count, setCount] = useState(0);
  const [quantitiy, setQuantitiy] = useState(1);
  const [, setAlertq] = useState(false);
  const [wList, setWlist] = useState(JSON.parse(localStorage.getItem("wishList")));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      let responseData = await getSingleProduct(id);
      setTimeout(() => {
        if (responseData.Product) {
          layoutDispatch({ type: "singleProductDetail", payload: responseData.Product });
          setPimages(responseData.Product.pImages);
          dispatch({ type: "loading", payload: false });
          layoutDispatch({ type: "inCart", payload: cartList() });
        }
        if (responseData.error) console.log(responseData.error);
      }, 500);
    } catch (error) {
      console.log(error);
    }
    fetchCartProduct();
  };

  const fetchCartProduct = async () => {
    try {
      let responseData = await cartListProduct();
      if (responseData && responseData.Products) {
        layoutDispatch({ type: "cartProduct", payload: responseData.Products });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg className="w-12 h-12 animate-spin text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>
    );
  } else if (!sProduct) {
    return <div className="text-center text-gray-700 mt-12 text-xl">No product found.</div>;
  }

  return (
    <Fragment>
      <Submenu
        value={{
          categoryId: sProduct.pCategory._id,
          product: sProduct.pName,
          category: sProduct.pCategory.cName,
        }}
      />

      <section className="m-4 md:mx-16 md:my-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="hidden md:flex flex-col space-y-4 md:col-span-2">
            {pImages && pImages.map((img, idx) => (
              <img
                key={idx}
                onClick={() => setCount(idx)}
                src={`${apiURL}/uploads/products/${img}`}
                alt={`Thumbnail ${idx + 1}`}
                className={`cursor-pointer rounded border transition duration-300 ${
                  count === idx ? "border-yellow-600 opacity-100" : "border-gray-300 opacity-60 hover:opacity-100"
                }`}
              />
            ))}
          </div>

          <div className="md:col-span-5 rounded overflow-hidden shadow-xl">
            <img
              src={`${apiURL}/uploads/products/${pImages ? pImages[count] : sProduct.pImages[0]}`}
              alt="Product"
              className="w-full object-cover aspect-[4/5] rounded max-h-[450px]"
            />
          </div>

          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-wide mb-2 text-gray-800">{sProduct.pName}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-2xl font-bold text-yellow-600">Rs.{sProduct.pPrice}.00</span>
                <button
                  onClick={(e) => isWishReq(e, sProduct._id, setWlist)}
                  className={`${isWish(sProduct._id, wList) ? "hidden" : "inline-block"} text-yellow-600 hover:text-yellow-700`}
                  aria-label="Add to wishlist"
                >
                  ❤️
                </button>
                <button
                  onClick={(e) => unWishReq(e, sProduct._id, setWlist)}
                  className={`${!isWish(sProduct._id, wList) ? "hidden" : "inline-block"} text-yellow-600 hover:text-yellow-700`}
                  aria-label="Remove from wishlist"
                >
                  💛
                </button>
              </div>
              <p className="text-gray-700 mb-6 whitespace-pre-line leading-relaxed">{sProduct.pDescription}</p>

              <div className={`flex justify-between items-center border rounded-md px-4 py-2 ${+quantitiy === +sProduct.pQuantity ? "border-red-500" : "border-gray-300"}`}>
                <span className={`${+quantitiy === +sProduct.pQuantity ? "text-red-500" : "text-gray-800"} font-semibold`}>Quantity</span>
                {sProduct.pQuantity !== 0 ? (
                  layoutData.inCart == null || !layoutData.inCart.includes(sProduct._id) ? (
                    <div className="flex items-center space-x-3 select-none">
                      <button
                        onClick={() => updateQuantity("decrease", sProduct.pQuantity, quantitiy, setQuantitiy, setAlertq)}
                        className="w-7 h-7 rounded border border-gray-300 flex justify-center items-center hover:bg-gray-200 transition"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="text-base font-semibold">{quantitiy}</span>
                      <button
                        onClick={() => updateQuantity("increase", sProduct.pQuantity, quantitiy, setQuantitiy, setAlertq)}
                        className="w-7 h-7 rounded border border-gray-300 flex justify-center items-center hover:bg-gray-200 transition"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 select-none opacity-50 cursor-not-allowed">
                      <span className="w-7 h-7 rounded border border-gray-300 flex justify-center items-center">−</span>
                      <span className="text-base font-semibold">{quantitiy}</span>
                      <span className="w-7 h-7 rounded border border-gray-300 flex justify-center items-center">+</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center space-x-3 select-none opacity-50 cursor-not-allowed">
                    <span className="w-7 h-7 rounded border border-gray-300 flex justify-center items-center">−</span>
                    <span className="text-base font-semibold">{quantitiy}</span>
                    <span className="w-7 h-7 rounded border border-gray-300 flex justify-center items-center">+</span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                {sProduct.pQuantity !== 0 ? (
                  layoutData.inCart && layoutData.inCart.includes(sProduct._id) ? (
                    <button
                      disabled
                      className="w-full py-2 bg-orange-600 text-white text-sm font-semibold opacity-70 cursor-not-allowed rounded-md"
                    >
                      In Cart
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(sProduct._id, quantitiy, sProduct.pPrice, layoutDispatch, setQuantitiy, setAlertq, fetchData, totalCost)}
                      className="w-full py-2 bg-orange-600 text-white text-sm font-semibold rounded-md hover:bg-orange-700 transition"
                    >
                      Add to Cart
                    </button>
                  )
                ) : (
                  <button
                    disabled
                    className="w-full py-2 bg-gray-800 text-white text-sm font-semibold opacity-50 cursor-not-allowed rounded-md"
                  >
                    Not in Stock
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductDetailsSectionTwo />
    </Fragment>
  );
};

export default ProductDetailsSection;

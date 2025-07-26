import React, { Fragment, useContext, useEffect, useState } from "react";
import { getAllCategory } from "../categories/FetchApi";
import { createProduct, getAllProduct } from "./FetchApi";
import { ProductContext } from "./index";

const AddProductDetail = ({ categories }) => {
  const { data, dispatch } = useContext(ProductContext);

  const alert = (msg, type) => (
    <div className={`bg-${type}-200 py-2 px-4 w-full`}>{msg}</div>
  );

  const [fData, setFdata] = useState({
    pName: "",
    pDescription: "",
    pStatus: "Active",
    pImage: null,
    pCategory: "",
    pPrice: "",
    pOffer: 0,
    pQuantity: "",
    success: false,
    error: false,
  });

  const fetchData = async () => {
    let responseData = await getAllProduct();
    setTimeout(() => {
      if (responseData && responseData.Products) {
        dispatch({
          type: "fetchProductsAndChangeState",
          payload: responseData.Products,
        });
      }
    }, 1000);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    e.target.reset();

    if (!fData.pImage) {
      setFdata({ ...fData, error: "Please upload at least 2 image" });
      setTimeout(() => {
        setFdata({ ...fData, error: false });
      }, 2000);
    }

    try {
      let responseData = await createProduct(fData);
      if (responseData.success) {
        fetchData();
        setFdata({
          ...fData,
          pName: "",
          pDescription: "",
          pImage: "",
          pStatus: "Active",
          pCategory: "",
          pPrice: "",
          pQuantity: "",
          pOffer: 0,
          success: responseData.success,
          error: false,
        });
        setTimeout(() => {
          setFdata({
            ...fData,
            pName: "",
            pDescription: "",
            pImage: "",
            pStatus: "Active",
            pCategory: "",
            pPrice: "",
            pQuantity: "",
            pOffer: 0,
            success: false,
            error: false,
          });
        }, 2000);
      } else if (responseData.error) {
        setFdata({ ...fData, success: false, error: responseData.error });
        setTimeout(() => {
          return setFdata({ ...fData, error: false, success: false });
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      {/* Black Overlay */}
      <div
        onClick={(e) => dispatch({ type: "addProductModal", payload: false })}
        className={`${data.addProductModal ? "" : "hidden"} fixed top-0 left-0 z-30 w-full h-full bg-black opacity-50`}
      />
      {/* Modal */}
      <div
        className={`${data.addProductModal ? "" : "hidden"} fixed inset-0 flex items-center z-30 justify-center overflow-auto`}
      >
        <div className="mt-32 md:mt-0 relative bg-white w-11/12 md:w-3/6 shadow-lg flex flex-col items-center space-y-4 px-4 py-4 md:px-8">
          <div className="flex items-center justify-between w-full pt-4">
            <span className="text-left font-semibold text-2xl tracking-wider">Add Product</span>
            <span
              style={{ background: "#303031" }}
              onClick={(e) => dispatch({ type: "addProductModal", payload: false })}
              className="cursor-pointer text-white py-2 px-2 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </div>

          {fData.error ? alert(fData.error, "red") : ""}
          {fData.success ? alert("Product created successfully", "green") : ""}

          <form className="w-full" onSubmit={submitForm}>
            <div className="flex space-x-1 py-4">
              <div className="w-1/2 flex flex-col space-y-1">
                <label>Product Name *</label>
                <input
                  value={fData.pName}
                  onChange={(e) => setFdata({ ...fData, error: false, success: false, pName: e.target.value })}
                  className="px-4 py-2 border focus:outline-none"
                  type="text"
                />
              </div>
              <div className="w-1/2 flex flex-col space-y-1">
                <label>Product Price *</label>
                <input
                  value={fData.pPrice}
                  onChange={(e) => setFdata({ ...fData, error: false, success: false, pPrice: e.target.value })}
                  type="number"
                  className="px-4 py-2 border focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label>Product Description *</label>
              <textarea
                value={fData.pDescription}
                onChange={(e) => setFdata({ ...fData, error: false, success: false, pDescription: e.target.value })}
                className="px-4 py-2 border focus:outline-none"
                rows={2}
              />
            </div>

            <div className="flex flex-col mt-4">
              <label>Product Images *</label>
              <span className="text-gray-600 text-xs">Must upload at least 2 images</span>
              <input
                onChange={(e) => setFdata({ ...fData, error: false, success: false, pImage: [...e.target.files] })}
                type="file"
                accept=".jpg, .jpeg, .png"
                className="px-4 py-2 border focus:outline-none"
                multiple
              />
            </div>

            <div className="flex space-x-1 py-4">
              <div className="w-1/2 flex flex-col space-y-1">
                <label>Product Status *</label>
                <select
                  value={fData.pStatus}
                  onChange={(e) => setFdata({ ...fData, error: false, success: false, pStatus: e.target.value })}
                  className="px-4 py-2 border focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>

              <div className="w-1/2 flex flex-col space-y-1">
                <label>Product Category *</label>
                <select
                  value={fData.pCategory}
                  onChange={(e) => setFdata({ ...fData, error: false, success: false, pCategory: e.target.value })}
                  className="px-4 py-2 border focus:outline-none"
                >
                  <option disabled value="">Select a category</option>
                  {categories.length > 0 &&
                    categories.map((elem) => (
                      <option value={elem._id} key={elem._id}>
                        {elem.cName}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-1 py-4">
              <div className="w-1/2 flex flex-col space-y-1">
                <label>Product in Stock *</label>
                <input
                  value={fData.pQuantity}
                  onChange={(e) => setFdata({ ...fData, error: false, success: false, pQuantity: e.target.value })}
                  type="number"
                  className="px-4 py-2 border focus:outline-none"
                />
              </div>
              <div className="w-1/2 flex flex-col space-y-1">
                <label>Product Offer (%) *</label>
                <input
                  value={fData.pOffer}
                  onChange={(e) => setFdata({ ...fData, error: false, success: false, pOffer: e.target.value })}
                  type="number"
                  className="px-4 py-2 border focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1 w-full pb-4 md:pb-6 mt-4">
              <button
                type="submit"
                style={{ backgroundColor: "#FA8256" }}
                className="rounded-full text-white text-lg font-medium py-2"
              >
                Create product
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

const AddProductModal = () => {
  const [allCat, setAllCat] = useState([]);

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    const responseData = await getAllCategory();
    if (responseData.Categories) {
      setAllCat(responseData.Categories);
    }
  };

  return (
    <Fragment>
      <AddProductDetail categories={allCat} />
    </Fragment>
  );
};

export default AddProductModal;

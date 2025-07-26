import React, { Fragment } from "react";
import Layout from "../layout";
import SingleWishProduct from "./SingleWishProduct";

const WishList = () => {
  return (
    
    <Fragment>
       {/* Banner */}
          <div className="w-full bg-white relative z-0 mt-20">
            <img
              src="/prayer.png"
              alt="Prayer Flag Banner"
              className="w-full object-contain"
              style={{ maxHeight: "120px", display: "block" }}
            />
          </div>

      <Layout children={<SingleWishProduct />} />
    </Fragment>
  );
};

export default WishList;

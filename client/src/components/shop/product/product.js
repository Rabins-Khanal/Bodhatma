import React from "react";
import Navbar from "../partials/Navber";
import Footer from "../partials/Footer";
import Home from "../home";

const Accessories = () => {
  return (
    <>
      <Navbar />
       {/* Banner */}
          <div className="w-full bg-white relative z-0 mt-20">
            <img
              src="/prayer.png"
              alt="Prayer Flag Banner"
              className="w-full object-contain"
              style={{ maxHeight: "130px", display: "block" }}
            />
          </div>

      {/* Added margin-top to create gap between Navbar and Home */}
      <div style={{ marginTop: "-15px" }}>
        <Home hideTop={true} />
      </div>

    </>
  );
};

export default Accessories;

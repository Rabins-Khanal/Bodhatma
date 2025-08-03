import React from "react";
import Navbar from "../partials/Navber";
import Footer from "../partials/Footer";
import Home from "../home";

const Accessories = () => {
  return (
    <>
      <Navbar />
      

      {/* Added margin-top to create gap between Navbar and Home */}
      <div style={{ marginTop: "150px" }}>
        <Home hideTop={true} />
      </div>

    </>
  );
};

export default Accessories;

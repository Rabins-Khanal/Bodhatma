// About.js
import React from "react";
import Footer from "../partials/Footer"; // Adjust the path if needed

const About = () => {
  return (
    <div className="w-full bg-white relative z-0">
      {/* Banner Section */}
      <div className="w-full">
        <img
          src="/prayer.png"
          alt="Prayer Flag Banner"
          className="w-full object-contain"
          style={{ maxHeight: "140px", display: "block" }}
        />
      </div>

      {/* About Page Design Image */}
      <div className="p-6 flex justify-center items-center mt-4">
        <img
          src="/about.png"
          alt="About Page Design"
          style={{ display: "block" }} // Keeps original size without borders
        />
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default About;

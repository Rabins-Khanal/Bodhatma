import React, { Fragment, useContext, useEffect, useState } from "react";
import { sliderImages } from "../../admin/dashboardAdmin/Action";
import { HomeContext } from "./";
import { nextSlide, prevSlide } from "./Mixins";
import OrderSuccessMessage from "./OrderSuccessMessage";

const apiURL = process.env.REACT_APP_API_URL;

const Slider = (props) => {
  const { data, dispatch } = useContext(HomeContext);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    sliderImages(dispatch);
  }, [dispatch]);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prevSlide) =>
        prevSlide + 1 < data.sliderImages.length ? prevSlide + 1 : 0
      );
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [data.sliderImages.length]);

  return (
    <Fragment>
      <div className="relative mt-16 bg-gray-100 border-2 flex justify-center overflow-hidden">
        {data.sliderImages.length > 0 && (
          <div className="w-[300px]  relative" style={{ height: "600px", width: "80%" }}> {/* Smaller Box Size */}
            <img
              className="w-full object-cover  mx-auto rounded-lg shadow-lg" style={{ height: "100%" }}
              src={`${apiURL}/uploads/customize/${data.sliderImages[slide].slideImage}`}
              alt="sliderImage"
            />
          </div>
        )}

        {data.sliderImages.length > 0 && (
          <>
            <svg
              onClick={() => prevSlide(data.sliderImages.length, slide, setSlide)}
              className="z-10 absolute top-1/2 left-4 transform -translate-y-1/2 w-12 h-12 text-gray-700 cursor-pointer hover:text-yellow-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <svg
              onClick={() => nextSlide(data.sliderImages.length, slide, setSlide)}
              className="z-10 absolute top-1/2 right-4 transform -translate-y-1/2 w-12 h-12 text-gray-700 cursor-pointer hover:text-yellow-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </>
        )}
      </div>
      <OrderSuccessMessage />
    </Fragment>
  );
};

export default Slider;

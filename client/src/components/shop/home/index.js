import React, { Fragment, createContext, useReducer, useState } from "react";
import Layout from "../layout";
import { homeState, homeReducer } from "./HomeContext";
import SingleProduct from "./SingleProduct";
import SimpleFooter from "../partials/Footer";
import ScriptureFlipbook from "../partials/ScriptureFlipbook";
import ProductCategory from "./ProductCategory";
import ProductCategoryDropdown from "./ProductCategoryDropdown";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const HomeContext = createContext();

const ImageCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  const images = ["/carousel1.png", "/carousel2.png", "/carousel1.png"];

  return (
    <div className="max-w-7xl mx-auto px-10 sm:px-16 py-6">
      <Slider {...settings}>
        {images.map((src, idx) => (
          <div key={idx} className="px-2">
            <img
              src={src}
              alt={`carousel-slide-${idx}`}
              className="w-full h-72 sm:h-80 md:h-96 object-cover rounded-lg"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

const ScripturesSection = () => {
  const [showFlipbook, setShowFlipbook] = useState(false);

  const scriptures = [
    {
      image: "/bu.png",
      title: "The Dhammapada",
      author: "Gautama Buddha",
    },
    {
      image: "/bud.png",
      title: "Heart Sutra",
      author: "Prajnaparamita",
    },
    {
      image: "/budd.png",
      title: "The Lotus Sutra",
      author: "Kumarajiva",
    },
    {
      image: "/buddh.png",
      title: "The Diamond Sutra",
      author: "Gautama Buddha",
    },
    {
      image: "/buddha.png",
      title: "Metta Sutta",
      author: "Theravāda Canon",
    },
    {
      image: "/bu.png",
      title: "The Bodhicaryavatara",
      author: "Shantideva",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 pt-12 pb-6 bg-white relative z-10">
      <h2 className="text-2xl font-bold mb-8">Scriptures</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 place-items-center">
        {scriptures.map((book, index) => (
          <div
            key={index}
            onClick={() => setShowFlipbook(true)}
            className="cursor-pointer w-52 h-[420px] bg-gray-50 rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col justify-between items-center text-center"
          >
            <img
              src={book.image}
              alt={book.title}
              className="w-30 h-40 object-cover rounded mb-2"
            />
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-base font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
            </div>
            <button
              style={{ backgroundColor: "#F38867" }}
              className="mt-5 text-black px-4 py-1.5 rounded text-sm hover:opacity-90 transition"
            >
              Read Now
            </button>
          </div>
        ))}
      </div>

      {/* Flipbook Modal */}
      {showFlipbook && <ScriptureFlipbook onClose={() => setShowFlipbook(false)} />}
    </section>
  );
};

const HomeComponent = ({ hideTop = false }) => {
  // Conditional margin to lower sections when top parts are visible
  const sectionClass = hideTop
    ? "m-4 md:mx-8 md:my-6"   // Accessories page, smaller margin
    : "m-4 md:mx-8 md:my-12"; // Home page, larger vertical margin

  return (
    <Fragment>
      {/* Hide Top Banner, Carousel, Scriptures when hideTop is true */}
      {!hideTop && (
        <>
          {/* Banner */}
          <div className="w-full bg-white relative z-0 mt-16">
            <img
              src="/prayer.png"
              alt="Prayer Flag Banner"
              className="w-full object-contain"
              style={{ maxHeight: "165px", display: "block" }}
            />
          </div>

          {/* Carousel */}
          <div className="relative z-10">
            <ImageCarousel />
          </div>

          {/* Scriptures */}
          <div className="relative z-10">
            <ScripturesSection />
          </div>
        </>
      )}

      {/* Category, Search & Filter Section */}
      <section className={sectionClass}>
        <ProductCategory />
      </section>

      {/* Product Section */}
      <section className={`${sectionClass} grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}>
        <SingleProduct />
      </section>
    </Fragment>
  );
};

const Home = ({ hideTop }) => {
  const [data, dispatch] = useReducer(homeReducer, homeState);
  return (
    <Fragment>
      <HomeContext.Provider value={{ data, dispatch }}>
        <Layout children={<HomeComponent hideTop={hideTop} />} />
      </HomeContext.Provider>
    </Fragment>
  );
};

export default Home;

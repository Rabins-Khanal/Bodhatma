import React, { Fragment, useState } from "react";
import Navbar from "../partials/Navber"; // Import your Navbar
import Footer from "../partials/Footer"; // Import your Footer
import ScriptureFlipbook from "../partials/ScriptureFlipbook"; // Import your flipbook component


const ScripturesSection = () => {
  const [showFlipbook, setShowFlipbook] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const scriptures = [
    { image: "/bu.png", title: "The Dhammapada", author: "Gautama Buddha", category: "Theravada" },
    { image: "/bud.png", title: "Heart Sutra", author: "Prajnaparamita", category: "Mahayana" },
    { image: "/budd.png", title: "The Lotus Sutra", author: "Kumarajiva", category: "Mahayana" },
    { image: "/buddh.png", title: "The Diamond Sutra", author: "Gautama Buddha", category: "Abhidharma" },
    { image: "/buddha.png", title: "Metta Sutta", author: "Theravāda Canon", category: "Theravada" },
    { image: "/buddha.png", title: "The Bodhicaryavatara", author: "Shantideva", category: "Bajrayana" },
  ];

  const categories = ["All", "Theravada", "Mahayana", "Abhidharma", "Bajrayana"];

  const filteredScriptures = activeCategory === "All"
    ? scriptures
    : scriptures.filter(book => book.category === activeCategory);

  return (
    <section className="w-full px-6 pt-12 pb-6 bg-white relative z-10">
      <div className="flex items-center ml-60 mb-10 gap-16">
        <h2 className="text-3xl font-bold">Scriptures</h2>
        <div className="flex flex-wrap gap-24">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-md text-base font-semibold border-2 transition duration-200 ${
                activeCategory === cat
                  ? "bg-[#F38867] text-black border-[#F38867]"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="ml-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 items-start">
        {filteredScriptures.map((book, index) => (
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

      {showFlipbook && <ScriptureFlipbook onClose={() => setShowFlipbook(false)} />}
    </section>
  );
};

const Scriptures = () => {
  return (
    <Fragment>
      <Navbar />
      {/* Prayer flags */}
      <div className="flex justify-center mt-20">
        <img
          src={`${process.env.PUBLIC_URL}/prayer.png`}
          alt="Prayer Flags"
          style={{
            width: "82%",
            height: "auto",
            objectFit: "cover",
          }}
        />
      </div>
      <ScripturesSection />
      <Footer />
    </Fragment>
  );
};

export default Scriptures;

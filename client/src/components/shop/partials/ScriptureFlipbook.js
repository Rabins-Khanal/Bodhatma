import React from "react";
import HTMLFlipBook from "react-pageflip";

const ScriptureFlipbook = ({ onClose }) => {
  // Unique content for 3 pages, to be repeated
  const uniquePages = [
    `“Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.”\n— Buddha\n\nBuddhism teaches mindfulness and compassion as a path to enlightenment and peace. It encourages understanding the nature of suffering, impermanence, and the interconnectedness of all beings.`,
    `“Peace comes from within. Do not seek it without.”\n— Buddha\n\nThis quote reflects the Buddhist teaching that enlightenment and contentment must be cultivated internally through mindfulness and meditation.`,
    `“Just as a candle cannot burn without fire, men cannot live without a spiritual life.”\n— Buddha\n\nThe spiritual path in Buddhism involves ethical conduct, mental discipline, and wisdom as a means to reach Nirvana.`,
  ];

  // Generate 10 pages by repeating the 3 unique pages cyclically
  const pages = Array.from({ length: 10 }, (_, i) => uniquePages[i % 3]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          backgroundColor: "rgba(250, 245, 240, 0.15)",
        }}
        aria-hidden="true"
      ></div>

      {/* Flipbook wrapper */}
      <div
        className="fixed inset-x-0 z-50 flex flex-col items-center"
        style={{ top: "80px", maxHeight: "85vh", padding: "1.5rem" }}
      >
        {/* Container */}
        <div
          style={{
            width: "500px",
            maxWidth: "90vw",
            fontFamily: "'Georgia', serif",
          }}
        >
          {/* Header Bar */}
          <div
            className="flex justify-between items-center px-4 py-2 rounded-t-md"
            style={{
              backgroundColor: "#f3ede6",
              border: "1px solid #6f4e37",
              borderBottom: "none",
              color: "#5c3a21",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <button
              aria-label="Bookmark this page"
              onClick={() => alert("Bookmark has been placed!")}
              className="hover:text-orange-600 transition-colors"
              style={{ fontSize: "1.5rem" }}
            >
              📑
            </button>
            <div style={{ fontWeight: "600", fontSize: "1.2rem" }}>
              Dhammapada
            </div>
            <button
              onClick={onClose}
              aria-label="Close Flipbook"
              className="rounded-full hover:bg-orange-500 transition-colors"
              style={{
                backgroundColor: "#f8a055",
                color: "white",
                width: "32px",
                height: "32px",
                fontWeight: "bold",
                fontSize: "1.25rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                userSelect: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          {/* Flipbook container */}
          <div
            className="relative bg-[#fdf8f0] rounded-b-md shadow-lg"
            style={{
              border: "3px solid rgba(154, 51, 13, 0.89)",
              width: "100%",
              height: "600px",
              overflow: "hidden",
              fontFamily: "'Georgia', serif",
              boxSizing: "border-box",
              marginTop: "-1px",
            }}
          >
            <HTMLFlipBook
              width={480}
              height={680}
              maxShadowOpacity={0.3}
              showCover={false}
              className="flex-grow"
              style={{ outline: "none" }}
            >
              {pages.map((text, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-center items-center text-center select-text"
                  style={{
                    fontSize: "1.25rem",
                    lineHeight: 1.8,
                    color: "#3a3a3a",
                    minHeight: "650px",
                    userSelect: "text",
                    position: "relative",
                    paddingBottom: "3rem",
                    overflow: "hidden",
                    borderRadius: "12px",
                    width: "100%",
                    height: "100%",
                    boxSizing: "border-box",
                    whiteSpace: "pre-line",
                  }}
                >
                  {/* Solid white background div filling the page */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "white",
                      zIndex: -1,
                      borderRadius: "12px",
                      boxShadow: "0 8px 15px rgba(0,0,0,0.07)",
                    }}
                  />

                  {/* Text content with line breaks */}
                  <p style={{ padding: "3rem", margin: 0 }}>{text}</p>

                  {/* Page number centered at bottom */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 130,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontStyle: "normal",
                      fontSize: "1.3rem",
                      color: "#7a5a3c",
                      userSelect: "none",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {idx + 1} / {pages.length}
                  </div>
                </div>
              ))}
            </HTMLFlipBook>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScriptureFlipbook;

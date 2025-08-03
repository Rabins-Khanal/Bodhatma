const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const http = require("http");
const path = require("path");

// Import Router
const authRouter = require("./routes/auth");
const categoryRouter = require("./routes/categories");
const noticeRoutes = require("./routes/notices");
const productRouter = require("./routes/products");
const khaltiRouter = require("./routes/khalti");
const orderRouter = require("./routes/orders");
const usersRouter = require("./routes/users");
const customizeRouter = require("./routes/customize");
// Import Auth middleware for check user login or not~
const { loginCheck } = require("./middleware/auth");
const CreateAllFolder = require("./config/uploadFolderCreateScript");
const { cleanExpiredOTPs } = require("./config/utils");

/* Create All Uploads Folder if not exists | For Uploading Images */
CreateAllFolder();

// Database Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() =>
    console.log(
      "==============Mongodb Database Connected Successfully=============="
    )
  )
  .catch((err) => console.log("Database Not Connected !!!"));

// Middleware
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/api", authRouter);
app.use("/api/user", usersRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/khalti", khaltiRouter);
app.use("/api/order", orderRouter);
app.use("/api/customize", customizeRouter);
app.use("/api/notice", noticeRoutes);

// Clean expired OTPs every hour
setInterval(cleanExpiredOTPs, 60 * 60 * 1000);

const PORT = process.env.PORT || 8000;

// Check if we should use HTTPS (for production) or HTTP (for development)
const useHTTPS = process.env.NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, "sslcert", "server.key"));

if (useHTTPS) {
  const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, "sslcert", "server.key")),
    cert: fs.readFileSync(path.join(__dirname, "sslcert", "server.cert")),
  };
  
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`✅ HTTPS Server is running at https://localhost:${PORT}`);
  });
} else {
  http.createServer(app).listen(PORT, () => {
    console.log(`✅ HTTP Server is running at https://localhost:${PORT}`);
  });
}


// const express = require("express");
// const app = express();
// require("dotenv").config();
// const mongoose = require("mongoose");
// const morgan = require("morgan");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const fs = require("fs");
// const https = require("https");
// const http = require("http");
// const path = require("path");
// const helmet = require("helmet");
// const mongoSanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");

// // Routers
// const authRouter = require("./routes/auth");
// const categoryRouter = require("./routes/categories");
// const noticeRoutes = require("./routes/notices");
// const productRouter = require("./routes/products");
// const khaltiRouter = require("./routes/khalti");
// const orderRouter = require("./routes/orders");
// const usersRouter = require("./routes/users");
// const customizeRouter = require("./routes/customize");
// const { loginCheck } = require("./middleware/auth");
// const CreateAllFolder = require("./config/uploadFolderCreateScript");
// const { cleanExpiredOTPs } = require("./config/utils");

// /* Create Upload Folders */
// CreateAllFolder();

// // MongoDB Connection
// mongoose
//   .connect(process.env.DATABASE, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() =>
//     console.log("==============MongoDB Connected Successfully==============")
//   )
//   .catch((err) => console.log("❌ Database Not Connected:", err));

// // Middleware
// app.use(morgan("dev"));
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(express.static("public"));

// app.use(helmet()); // Security headers
// app.use(xss()); // Prevent XSS
// app.use(mongoSanitize()); // Prevent NoSQL injection


// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );



// // Routes
// app.use("/api", authRouter);
// app.use("/api/user", usersRouter);
// app.use("/api/category", categoryRouter);
// app.use("/api/product", productRouter);
// app.use("/api/khalti", khaltiRouter);
// app.use("/api/order", orderRouter);
// app.use("/api/customize", customizeRouter);
// app.use("/api/notice", noticeRoutes);

// // Clean expired OTPs every hour
// setInterval(cleanExpiredOTPs, 60 * 60 * 1000);

// // Server Init
// const PORT = process.env.PORT || 8000;

// const useHTTPS =
//   process.env.NODE_ENV === "production" &&
//   fs.existsSync(path.join(__dirname, "sslcert", "server.key"));

// if (useHTTPS) {
//   const sslOptions = {
//     key: fs.readFileSync(path.join(__dirname, "sslcert", "server.key")),
//     cert: fs.readFileSync(path.join(__dirname, "sslcert", "server.cert")),
//   };

//   https.createServer(sslOptions, app).listen(PORT, () => {
//     console.log(`✅ HTTPS Server running at https://localhost:${PORT}`);
//   });
// } else {
//   http.createServer(app).listen(PORT, () => {
//     console.log(`✅ HTTP Server running at http://localhost:${PORT}`);
//   });
// }

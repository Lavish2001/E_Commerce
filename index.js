// index.js
require("./bin/kernel");
let serverless = require("serverless-http");
let express = require("express");
let path = require("path");
let logger = require("morgan");
let cookieParser = require("cookie-parser");
let webRoutes = require("./routes/product_route");
const dotenv = require('dotenv');
let apiRoutes = require("./routes/user_route");
// Import the library:
let cors = require("cors");
let app = express();
const dir = (__dirname + '/Public/Products');


dotenv.config()

// view engine setup

app.set("views", path.join(__dirname, "resources/views"));
app.set("view engine", "ejs"); // either pug,twig etc


// Images

app.use('/Images', express.static(path.join(dir)));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// Then use it before your routes are set up:

app.use(cors({
  credentials: true,
  allowedHeaders: true
}));
app.use("/", webRoutes);
app.use("/", apiRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next({
    status: 404,
    message: "Not Found"
  });
});

// error handler
app.use((err, req, res, next) => {
  if (err.status === 404) {
    return res.status(400).render("errors/404");
  }

  if (err.status === 400) {
    return res.status(400).render("errors/500");
  }

  if (err.status === 500) {
    return res.status(500).render("errors/500");
  }
  next();
});

module.exports = app;
module.exports.handler = serverless(app);
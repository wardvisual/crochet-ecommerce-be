/* Dependencies Imports */
import express from "express";
const logger = require("morgan"); // deprecated when use import from es6, so i used require to import morgan.
import compression from "compression";
import passport from "passport";
import { json, urlencoded } from "body-parser";
import { join, resolve } from "path";
import cookieParser from "cookie-parser";
import chalk from "chalk";
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import historyApiFallback from "connect-history-api-fallback";

import webpackConfig from "../webpack.config";

/* Import Application Configuration */
import { cors, db as connectDB, passport as passportConfig } from "./config/";

/* Router Imports */
import {
  auth,
  order,
  product,
  user,
  category,
  address,
  contact,
  cart,
} from "./routes";

/* Import Application Middlewares */
import errorHandler from "./middleware/errorHandler";
import asyncHandler from "./middleware/asyncHandler";

/* Import Application Constants */
import {
  MONGO_URI,
  NODE_ENV,
  PORT,
  BASE_API_URL,
  BASE_CLIENT_URL,
  PAYPAL_CLIENT_ID,
} from "./constants";

/* Initialize express application */
const app = express();

/* Apply application Middlewares */

cors(app);
app.use(json());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
passportConfig(passport);

/* app.use(csurf({ cookie: true })) ;*/
app.use(urlencoded({ extended: false }));
// app.use(express.static(join(__dirname, "../uploads/userImages")));

/* Set application Headers */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", `${BASE_CLIENT_URL}`);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/* Routes */
app.use(`${BASE_API_URL}/auth`, auth);
app.use(`${BASE_API_URL}/cart`, cart);
app.use(`${BASE_API_URL}/users`, user);
app.use(`${BASE_API_URL}/orders`, order);
app.use(`${BASE_API_URL}/contact`, contact);
app.use(`${BASE_API_URL}/address`, address);
app.use(`${BASE_API_URL}/products`, product);
app.use(`${BASE_API_URL}/categories`, category);

/* Start Application */
asyncHandler(() => {
  /* Serve static files */
  app.use(express.static(join(__dirname, "../uploads/categories")));
  app.use(express.static(join(__dirname, "../uploads/products")));
  app.use(express.static(join(__dirname, "../uploads/users")));

  // if development
  if (NODE_ENV !== "production") {
    const compiler = webpack(webpackConfig);

    app.use(
      historyApiFallback({
        verbose: false,
      })
    );
    app.use(logger("dev"));
    app.use(errorHandler);

    app.use(
      webpackMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        index: resolve(__dirname, "../client/public"),
        stats: {
          colors: true,
          hash: false,
          timings: true,
          chunks: false,
          chunkModules: false,
          modules: false,
        },
      })
    );

    app.use(webpackHotMiddleware(compiler));
    app.use(express.static(resolve(__dirname, "../dist")));
  } else {
    app.use(compression());
    app.disable("x-powered-by");
    app.use(express.static(resolve(__dirname, "../dist")));
    app.get("*", (req, res) => {
      res.sendFile(resolve(__dirname, "../dist/index.html"));
    });
  }

  /* Connect with the database */
  connectDB(MONGO_URI);

  /* Server */
  const server = app.listen(PORT, () => {
    console.log(
      `${chalk.green("✓")} ${chalk.blue(
        `Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`
      )}`
    );
  });

  process.on("unhandledRejection", (err, promise) => {
    console.error(`SERVER_ERROR:: `, err);
    server.close(() => process.exit(1));
  });
})();

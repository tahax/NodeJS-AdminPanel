const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");

const connectDB = require("./config/db");
const signinRoutes = require("./routes/signin");
const signupRoutes = require("./routes/signup");
const panelRoutes = require("./routes/panel");

/* load config */
dotEnv.config({ path: "./config/config.env" });
/* load config */

/* database connection */
connectDB();
/* /database connection */

/* passport configuration*/
require("./config/passport");
/* /passport configuration*/

const app = express();

/* view engine */
app.set("view engine", "ejs");
app.set("views", "views");
/* /view engine */

/* body parser */
app.use(bodyParser.urlencoded({ extended: false }));
/* /body parser */

/* session */
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    unset: "destroy",
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      autoRemove: "disabled",
    }),
  })
);
/* /session */

/* flash */
app.use(flash());
/* /flash */

/* passport */
app.use(passport.initialize());
app.use(passport.session());
/* /passport */

/* static folder */
app.use(express.static(path.join(__dirname, "public")));
/* /static folder */

/* routes */
app.use(signinRoutes);
app.use(signupRoutes);
app.use(panelRoutes);

/* 404 */
app.use("*", require("./controller/errorController").get404);
/* /404 */

/* /routes */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

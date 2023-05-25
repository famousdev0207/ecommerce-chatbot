require("rootpath")();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const uuidv4 = require("uuid").v4;
const bodyParser = require("body-parser");
const errorHandler = require("_middleware/error-handler");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//session
app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// api routes
app.use("/api", require("./_controllers/users.controller"));

// global error handler
app.use(errorHandler);

// start server
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
app.listen(port, () => console.log("Server listening on port " + port));

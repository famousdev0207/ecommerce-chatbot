const express = require("express");
const router = express.Router();
const Joi = require("joi");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const config = require("config.json");
const validateRequest = require("_middleware/validate-request");
const authorize = require("_middleware/authorize");
const userService = require("../_services/user.service");
const db = require("_helpers/db");

// routes
router.post("/login", authenticate);
router.post("/register", register);
router.get("/", authorize(), getAll);
router.get("/current", authorize(), getCurrent);
// router.get("/:id", authorize(), getById);
router.put("/:id", authorize(), updateSchema, update);
router.delete("/:id", authorize(), _delete);

module.exports = router;

function authenticate(req, res, next) {
  console.log("@auth", req.body);
  userService
    .authenticate(req.body)
    .then((user) => res.json(user))
    .catch((err) => console.log("error", err));
}

function register(req, res, next) {
  userService
    .create(req.body)
    .then((text) => res.json({ message: text }))
    .catch(console.log("errrrrororororo"));
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getCurrent(req, res, next) {
  res.json(req.user);
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => res.json(user))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    firstName: Joi.string().empty(""),
    lastName: Joi.string().empty(""),
    userId: Joi.string().empty(""),
    phoneNumber: Joi.string().empty(""),
    password: Joi.string().min(6).empty(""),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then((user) => res.json(user))
    .catch(next);
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({ message: "User deleted successfully" }))
    .catch(next);
}

/* =================== Handeling Infinite run: Start ===================  */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.User.findByPk(id).then((user) => {
    done(null, user);
  });
});

// For Google
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "630509970732-62t4k0kpmkm7hpd515u99fics5fhgo3r.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:4000/api/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      db.User.scope("withHash")
        .findOne({ where: { email: profile._json.email } })
        .then((existingUser) => {
          if (existingUser) {
            done(null, existingUser);
          } else {
            db.User.create({
              name: profile.displayName,
              email: profile._json.email,
              password: "",
            }).then((user) => {
              done(null, user);
            });
          }
        });
    }
  )
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  const token = jwt.sign({ id: req.user.id }, config.secret, {
    expiresIn: 86400,
  });
  res.redirect(`http://localhost:3001/?token=${token}`); // login case - redirect to profile page
});

module.exports = router;

const express = require("express");
//destructuring
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  check("email")
    .isEmail()
    .withMessage("Please enter a valid e-mail.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        //every then block returns a promise
        if (!userDoc) {
          //reject promise
          return Promise.reject("User doesn't exist!");
        }
        //promise fulfilled with nothing, treated as true;
      });
    }),
  body(
    "password",
    "Your password should be alphanumeric and at least 5 characters long."
  )
    .trim()
    .isLength({ min: 5 })
    .isAlphanumeric(),
  authController.postLogin
);

router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("Please enter a valid e-mail.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        //every then block returns a promise
        if (userDoc) {
          //reject promise
          return Promise.reject("User already exists.");
        }
        //promise fulfilled with nothing, treated as true;
      });
    }),
  body(
    "password",
    "Your password should be alphanumeric and at least 5 characters long."
  )
    .trim()
    .isLength({ min: 5 })
    .isAlphanumeric(),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      //custom comparator
      if (value != req.body.password) {
        throw new Error("Password and Confirm Password do NOT match!");
      }
      return true;
    }),
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;

const express = require("express");
//destructuring
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

router.post(
  "/signup",
  check("email").isEmail().withMessage("Please enter a valid e-mail."),
  body(
    "password",
    "Your password should be alphanumeric and at least 5 characters long."
  )
    .isLength({ min: 5 })
    .isAlphanumeric(),
  body("confirmPassword").custom((value, { req }) => {
    //custom comparator
    if (value != req.body.password) {
      throw new Error("Passwords and Confirm Password do NOT match!");
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

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  //triggered when we click Login from navbar
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  //when we click on LogIn button
  /*res.setHeader("Set-Cookie", "loggedIn=true");*/
  User.findById("649b01feb6afcd8748a52838")
    .then((user) => {
      console.log(user);
      //storing user in the session
      req.session.user = user;
      req.session.isLoggedIn = true;
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

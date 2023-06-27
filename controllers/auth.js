exports.getLogin = (req, res, next) => {
  //triggered when we click Login from navbar
  let isLoggedIn = false;
  let cookieString = req.get("Cookie");
  if (cookieString) {
    let cookieArray = cookieString.split(";");
    cookieArray.forEach((cookie) => {
      if (cookie.includes("loggedIn")) {
        isLoggedIn = cookie.split("=")[1] == "true";
      }
    });
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  //when we click on LogIn button
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};

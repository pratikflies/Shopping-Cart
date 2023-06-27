const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

//parses the incoming requests and exposes it on req.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//every incoming request goes through this middleware
app.use((req, res, next) => {
  User.findById("649b01feb6afcd8748a52838")
    .then((user) => {
      console.log(user);
      req.user = user;
      //send it to the next middleware
      next();
    })
    .catch((err) => console.log(err));
});

//middlewares
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://pratik16082001:PRAtim123@cluster0.8l9b2qc.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "pratik",
          email: "pratik@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    console.log("Connected!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

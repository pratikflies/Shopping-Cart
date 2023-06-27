const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  //cart is an object that holds an array of objects
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  //this.cart.items is an array of objects;
  console.log(this.cart.items);
  //creating the exact same replica of the array of objects;
  const updatedCartItems = [...this.cart.items];
  //if item already exists
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      //here itself we're creating productId,quantity field;
      productId: product._id,
      quantity: 1,
    });
    console.log("hello", this.cart);
  }

  //this is basically an entirely new cart object
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

/*const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;
const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart ? cart : {};
    this._id = id;
    this.cart.items = cart ? cart.items : [];
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    //this.cart.items is an array of objects;
    console.log(this.cart.items);
    //creating the exact same replica of the array of objects;
    const updatedCartItems = [...this.cart.items];
    //if item already exists
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        //here itself we're creating productId,quantity field;
        productId: new ObjectId(product._id),
        quantity: 1,
      });
    }

    //this is basically an entirely new cart object
    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    return db.collection("users").updateOne(
      //filter
      { _id: new ObjectId(this._id) },
      //update
      { $set: { cart: updatedCart } }
    );
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });

    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        console.log("here");
        console.log(products);
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        //this.cart = { //items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getCart() {
    const db = getDb();

    const productIds = [];
    const quantities = {};

    this.cart.items.forEach((ele) => {
      let prodId = ele.productId;

      productIds.push(prodId);
      quantities[prodId] = ele.quantity;
    });

    console.log(productIds);
    console.log(quantities);

    return (
      db
        .collection("products")
        .find({ _id: { $in: productIds } })
        //extract every product in productIds
        .toArray()
        .then((products) => {
          return products.map((p) => {
            return { ...p, quantity: quantities[p._id] };
            //{_id, title, price, description, imageUrl, userId, quantity}
          });
        })
    );
  }

  getOrders() {
    const db = getDb();
    return (
      db
        .collection("orders")
        //notice that "user._id" is in double quotes
        .find({ "user._id": new ObjectId(this._id) })
        .toArray()
    );
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;*/

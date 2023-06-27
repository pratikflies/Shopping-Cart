const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

//creates a mini-app linked to the larger file that helps in routing the incoming requests;
const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

//: for identifying dynamic route
router.get("/products/:productId", shopController.getProduct);

//enters this middleware when I click on cart from navbar
router.get("/cart", shopController.getCart);

//enters this middleware when I click on add to cart
router.post("/cart", shopController.postCart);

router.post("/cart-delete-item", shopController.postCartDeleteProduct);

/*
router.post("/create-order", shopController.postOrder);

router.get("/orders", shopController.getOrders);*/

module.exports = router;

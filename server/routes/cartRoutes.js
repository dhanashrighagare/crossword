const express = require("express");
const Cart = require("../models/cartModel");
const { getAllCartsController, addToCartController } = require("../controllers/cartController");
const router = express.Router();

router.post("/", getAllCartsController);

router.post("/addtocart", addToCartController);

router.delete("/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    console.log({userId, productId})

    const existingCart = await Cart.findOne({ userId });

    if (!existingCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = existingCart.products.findIndex(
      (item) => item.product.toString() == productId
    );

    console.log(existingCart)
    console.log(productIndex)

    if (productIndex === -1) {
      console.log("Product not found in cart")
      return res.status(404).json({ message: "Product not found in cart" });
    }

    existingCart.products.splice(productIndex, 1);

    await existingCart.save();

    console.log("Product removed from cart successfully")
    res.status(200).json({ message: "Product removed from cart successfully", carts: existingCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

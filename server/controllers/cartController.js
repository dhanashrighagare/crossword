const Cart = require('../models/cartModel');
const Wishlist = require('../models/wishlistModel');

const addToCartController = async (req, res) => {

  try {
    const { userId, productId, quantity = 1 } = req.body;

    const existingCart = await Cart.findOne({ userId });

    if (!existingCart) {
      const newCart = new Cart({ userId, products: [] });
      await newCart.save();
      
      return res.status(201).json({ message: "Cart created successfully" });
    }

    const productIndex = existingCart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex !== -1) {
      existingCart.products[productIndex].quantity += quantity;
    }    
    else {
      existingCart.products.push({ product: productId, quantity });
    }

    await existingCart.save();
    return res.status(200).json({ message: "Product added to cart successfully", success: true, carts: existingCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

  const myWishlistController =  async (req, res) => {

    const { userId } = req.body;

    console.log({userId})
  
    const wishlists = await Wishlist.find({ userId }).populate("products.product");

    console.log(wishlists);
  
    if (wishlists) {
      return res.json({
          success: true,
          message: "wishlist data",
          wishlists,
        })
        .status(200);
    }
  
    return res
      .json({
        success: false,
        message: "Your wishlist is empty",
      })
      .status(404);
  
  }

  const addProductWishlist = async (req, res) => {
    try {
      const { userId, productId } = req.body;

      console.log("Wishlist controller")
  
      const existingWishlist = await Wishlist.findOne({ userId });
  
      if (!existingWishlist) {
        const wishlist = new Wishlist({ userId, products: [] });
        await wishlist.save();
        
        res.status(201).json({ message: "Wishlist created successfully" });
      }
  
      const productIndex = existingWishlist.products.findIndex(
        (item) => item.product.toString() === productId
      );
  
      if (productIndex !== -1) {
        console.log("product already exist")
        return res.json({message: "product already exist", exist: true}).status(200);
      }    
      else {
        existingWishlist.products.push({ product: productId });
      }
  
      await existingWishlist.save();
      return res.status(200).json({ message: "Product added to wishlist successfully", wishlist: existingWishlist, exist: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }

  }

  const removeProductWishlist = async (req, res) => {
    const { userId, productId } = req.body;
  
    try {
      const wishlist = await Wishlist.findOne({ userId });
  
      if (!wishlist) {
        return res.status(404).json({ error: 'Wishlist not found' });
      }

      const productIndex = wishlist.products.findIndex(
        (item) => item.product.toString() === productId
      );
      if (productIndex !== -1) {
          wishlist.products.splice(productIndex, 1);
          await wishlist.save();
          return res.status(200).json({ message: 'Product removed from wishlist', wishlist, success: true });
      } else {
          return res.status(404).json({ error: 'Product not found in wishlist', success: false });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
  }
  }

  const getAllCartsController = async (req, res) => {
    const { userId } = req.body;
  
    const carts = await Cart.find({ userId }).populate("products.product");
  
    if (carts) {
      return res
        .json({
          success: true,
          message: "cart data",
          carts,
        })
        .status(200);
    }
  
    return res
      .json({
        success: false,
        message: "Your cart is empty",
      })
      .status(404);
  };

module.exports = {
    addToCartController,
    myWishlistController,
    getAllCartsController,
    addProductWishlist,
    removeProductWishlist
};

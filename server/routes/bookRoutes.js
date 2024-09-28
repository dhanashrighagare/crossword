const express = require("express");
const {
  reviewController,
  addbookController,
  removeBookController,
  getBooksByCategoryController,
  getReviewsByIdController,
  getBookById,
  getAllBooks,
} = require("../controllers/bookController");
const Book = require("../models/bookModel");
const Review = require("../models/reviewModel");

const router = express.Router();

router.post("/addbook", addbookController);

router.put("/update-book/:productId", async (req, res) => {
  const { productId } = req.params;
  const body = req.body;
  console.log("update book route");
  try {
    const book = await Book.findByIdAndUpdate({_id: productId}, body)
    console.log({book})
    if(book) {
      return res.json({success: true, message: "Book updated successfully"}).status(200)
    } else {
      return res.json({success: false, message: "Book could not update"})
    }
  } catch (error) {
    console.log(error.message);
    return res.json({success:false, message: "Error in Update book route"})
  }
})

router.get("/category/:category", getBooksByCategoryController);

router.get("/allbook", getAllBooks);

router.get("/:id", getBookById);

router.delete("/removebook", removeBookController);

router.get("/find/:query",async (req, res) => {

    const { query } = req.params;
    try {
      const books = await Book.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { author: { $regex: query, $options: "i" } },
        ],
      });
      return res.json({
        message: "found",
        success: true,
        books
      });
    } catch (error) {
      console.error("Error searching:", error);
      return res.json({
        success: false
      })
    }
  }
);

router.get("/reviews/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await Review.find({productId});
    res.json({
      success: true,
      message: `Reviews fetched of ${productId}`,
      reviews: reviews
    }).status(200)
  } catch(err) {
    console.log(err.message)
    return res.json({success: false, message: `error: ${err.message}`}).status(500)
  }
});

router.post("/review", reviewController);

module.exports = router;

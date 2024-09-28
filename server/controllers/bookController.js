const Book = require("../models/bookModel");
const Review = require("../models/reviewModel");

const addbookController = async (req, res) => {
  console.log(req.body);

  try {
    const book = new Book({
      id: req.body.id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      price: req.body.price,
      author: req.body.author,
      discount: req.body.discount,
      description: req.body.description,
    });

    await book.save();

    res.json({
      success: true,
      message: "Book added successfully",
      book: book,
    });
  } catch (error) {
    console.error("Error saving book:", error);

    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};

const getBooksByCategoryController = async (req, res) => {
  const category = req.params.category;

  try {
    const books = await Book.find({ category });

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No books found in this category",
      });
    }

    console.log(`${category} Books Fetched`);
    // Send the response with the fetched books
    return res.status(200).json({
      success: true,
      books,
    });
  } catch (error) {
    console.error("Error fetching books by category:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getBookById = async (req, res) => {
  const productId = req.params.id;

  try {
    const book = await Book.findById(productId);

    return res.json({
      message: "Fetched..",
      book,
    });
  } catch (err) {
    console.log(err.message);
    return res.json({
      message: err.message,
    });
  }
};

const getAllBooks = async (req, res) => {
  try {
    let books = await Book.find({});
    console.log("All Books Fetched");
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeBookController = async (req, res) => {
  try {
    // Find and delete the book by its ID
    const result = await Book.findOneAndDelete({ _id: req.body.productId });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    console.log("Removed");

    return res.status(200).json({
      success: true,
      name: result.name,
    });
  } catch (error) {
    console.error("Error removing book:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const reviewController = async (req, res) => {
  const { productId, title, content, rating, name, email } = req.body;

  try {
    await Review.create({
      productId,
      title,
      content,
      rating,
      displayName: name,
      emailId: email,
    });

    return res
      .json({
        success: true,
        message: `You reviewed ${productId}`,
      })
      .status(201);
  } catch (err) {
    console.log(err.message);

    return res
      .json({
        success: false,
        message: "Review error.",
      })
      .status(500);
  }
};

module.exports = {
  addbookController,
  getAllBooks,
  removeBookController,
  getBooksByCategoryController,
  getBookById,
  reviewController,
};

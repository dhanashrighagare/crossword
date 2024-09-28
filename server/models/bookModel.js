const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  }
}, {
  timestamps: {
    createdAt: true,
    updatedAt: true
  }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

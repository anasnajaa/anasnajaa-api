const bookModel = require("../models/book.m");
const { apiError } = require("../util/errorHandler");

exports.getBooks = async (req, res) => {
  try {
    const books = await bookModel.find({}).lean();
    res.status(200).json({ books });
  } catch (error) {
    apiError(error);
  }
};

exports.addBook = async (req, res) => {
  try {
    const { title, thumbnail_url, date_created } = req.body;

    const newBook = await new bookModel({
      title,
      thumbnail_url,
      date_created,
    });
    await newBook.save();
    res.status(200).json({ newBook });
  } catch (error) {
    apiError(error);
  }
};

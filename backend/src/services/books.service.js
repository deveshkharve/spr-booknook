import Author from "@models/authors.js";
import BookReview from "@models/bookReview.js";
import Book from "@models/books.js";
import sequelize from "@models/db/postgresProvider.js";
import { createErrorResponse } from "@utils/response.js";

const { Op } = sequelize.Sequelize;

const getBooks = async ({ page, pageSize, title, author, publishedDate, search }) => {
  const where = {};

  if (search) {
    console.log('searching........', search);
    const orConditions = [
      { title: { [Op.iLike]: `%${search}%` } }
    ];

    const authorObj = await Author.findOne({
      where: { name: { [Op.iLike]: `%${search}%` } }
    });
    console.log('authorObj>>>>',  authorObj)
    if (authorObj) {
      orConditions.push({ author_id: authorObj.id });
    }

    where[Op.or] = orConditions;
  }
  else {
    if (title) where.title = { [Op.iLike]: `%${title}%` };
    if (publishedDate) where.published_date = publishedDate;
    if (author) {
      const authorObj = await Author.findOne({ where: { name: { [Op.iLike]: `%${author}%` } } });
      if (authorObj) where.author_id = authorObj.id;
      else return { books: [], total: 0 };
    }
  }
  
  const { count, rows } = await Book.findAndCountAll({
    where,
    offset: (page - 1) * pageSize,
    limit: pageSize,
    order: [['title', 'ASC']],
  });
  return { books: rows, total: count };
};

const getBookById = async ({ id }) => Book.findByPk(id);

const createBook = async (context, { title, description, published_date, author_id, thumbnail, images }) => {
  // handle file uploads
  const { id, username } = context.user; 

  // Validate that author_id is provided and corresponds to an existing author
  const Author = sequelize.models.Author || (await import("@models/authors.js")).default;
  const author = await Author.findByPk(author_id);
  if (!author) {
    throw createErrorResponse(400, 'Author not found');
  }

  return Book.create({ title, description, published_date, author_id, thumbnail, images, created_by: { id, username } })
};

const updateBook = async ({ id, title, description, published_date }) => {
  const book = await Book.findByPk(id);
  if (!book) throw new Error('Book not found');
  await book.update({ title, description, published_date });
  return book;
};

const deleteBook = async ({ id }) => {
  const deleted = await Book.destroy({ where: { id } });
  return !!deleted;
};

const getBooksByAuthor = async (author) => Book.findAll({ where: { author_id: author.id } });

const getBookReviews = async ({ bookId, page = 1, pageSize = 10 }) => {
  const offset = (page - 1) * pageSize;
  // BookReview is in MongoDB, so use .find() and .countDocuments()
  const [count, rows] = await Promise.all([
    BookReview.countDocuments({ bookId }),
    BookReview.find({ bookId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(pageSize)
      .exec()
  ]);
  return { reviews: rows, total: count };
};

const createBookReview = async ({bookId, review, rating}) => {
  const reviewDoc = new BookReview({ bookId, review, rating });
  await reviewDoc.save();
  // Update total_rating_sum and total_rating_count in Books under a transaction

  await sequelize.transaction(async (t) => {
    const [updatedRows] = await Book.update(
      {
        total_rating_sum: sequelize.literal(`COALESCE(total_rating_sum, 0) + ${rating || 0}`),
        total_rating_count: sequelize.literal(`COALESCE(total_rating_count, 0) + 1`)
      },
      {
        where: { id: bookId },
        transaction: t
      }
    );
    if (updatedRows === 0) throw new Error('Book not found for updating ratings');
  });

  return reviewDoc;
}

const BookService = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBooksByAuthor,
  getBookReviews,
  createBookReview,
}

export default BookService;
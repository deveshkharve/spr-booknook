import mongoose from 'mongoose';

const bookReviewSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.String, required: true },
  // userId: { type: mongoose.Schema.Types.Mixed, required: true }, // can be ObjectId or string, depending on your user model
  review: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

const BookReview = mongoose.model('BookReview', bookReviewSchema);

export default BookReview; 
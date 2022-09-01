const mongoose = require('mongoose');
const Tour = require('./tourModel');
const User = require('./userModel.js')

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Please add a review'],
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Review', reviewSchema);

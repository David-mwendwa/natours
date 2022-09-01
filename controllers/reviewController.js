const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res
    .status(200)
    .json({ status: 'success', results: reviews.length, data: { reviews } });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(AppError('There is no review with that id', 404));
  }
  res.status(200).json({ status: 'success', data: { review } });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body);
  res.status(201).json({ status: 'success', data: { review } });
});

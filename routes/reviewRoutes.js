const express = require('express');

const router = express.Router({ mergeParams: true });
// POST /tours/234sdhs/reviews
// GET /tours/234sdhs/reviews
// POST /reviews

const {
  createReview,
  getReview,
  getAllReviews,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

router
  .route('/')
  .post(protect, restrictTo('user'), createReview)
  .get(getAllReviews);

router.route('/:id').get(getReview).delete(deleteReview);

module.exports = router;

const express = require('express');

const router = express.Router();
const {
  createReview,
  getReview,
  getAllReviews,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

router
  .route('/')
  .post(protect, restrictTo('user'), createReview)
  .get(getAllReviews);
  
router.route('/:id').get(getReview);

module.exports = router;

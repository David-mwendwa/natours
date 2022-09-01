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
  updateReview,
  setTourUserIds,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

router.use(protect);
router
  .route('/')
  .post(restrictTo('user'), setTourUserIds, createReview)
  .get(getAllReviews);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;

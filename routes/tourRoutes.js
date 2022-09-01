const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  aliasTopTours,
  getTourStats,
  getMontlyPlan,
  deleteTour,
} = require('./../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/monthly-plan/:year').get(getMontlyPlan);

router.route('/tour-stats').get(getTourStats);

router.route('/').get(protect, getAllTours).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;

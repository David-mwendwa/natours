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
  getToursWithin,
  getDistances,
} = require('./../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/monthly-plan/:year').get(getMontlyPlan);

router
  .route('/tour-stats')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getTourStats);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;

const { StatusCodes } = require('http-status-codes');
const Tour = require('../models/tourModel');

exports.checkBody = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Please add name and price' });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(StatusCodes.OK).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: tours.length,
    // data: { tours },
  });
};

exports.getTour = (req, res) => {
  const id = parseInt(req.params.id);
  // let tour = tours.find((tour) => tour.id === id);
  // res.status(StatusCodes.OK).json({ status: 'success', date: { tour } });
};

exports.createTour = (req, res) => {
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      // tour,
    },
  });
};

exports.updateTour = (req, res) => {
  let updatedTour = req.body;
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      tour: updatedTour,
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
};

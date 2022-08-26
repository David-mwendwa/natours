const { StatusCodes } = require('http-status-codes');
const Tour = require('../models/tourModel');

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

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
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

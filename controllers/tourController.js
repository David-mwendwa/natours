const { StatusCodes } = require('http-status-codes');
const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    const queryObj = { ...req.query };
    const excludedFilds = ['page', 'sort', 'limit', 'fields'];
    excludedFilds.forEach((el) => delete queryObj[el]);

    const query = Tour.find(queryObj);

    // EXECUTE QUERY
    const tours = await query;

    // SEND RESPONSE
    res.status(StatusCodes.OK).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(StatusCodes.OK).json({ status: 'success', data: { tour } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
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

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(StatusCodes.OK).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.deleteTour = async (req, res) => {
  await Tour.findByIdAndRemove(req.params.id);
  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
};

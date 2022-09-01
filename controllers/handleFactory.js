const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndRemove(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(StatusCodes.NO_CONTENT).json({
      status: 'success',
      data: null,
    });
  });

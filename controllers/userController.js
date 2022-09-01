const fs = require('fs');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(StatusCodes.OK).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // create an error if the user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for passsword update. Please use updateMyPassword',
        400
      )
    );
  }
  // filter out unawanted field names that should not be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res
    .status(StatusCodes.OK)
    .json({ status: 'success', data: { user: updatedUser } });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: 'success', data: null });
});

exports.getUser = (req, res) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.createUser = (req, res) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

// Do NOT update password with this
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);

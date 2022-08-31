const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user: user },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, passwordChangedAt, role } =
    req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt,
    role,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // check if user exits and password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // if everything is ok, send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // get token and check if it exists
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access', 401)
    );
  }
  // varify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no logger exists', 401)
    );
  }
  // check if the user changed password after the jwt was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Password was recently changed. Please log in again.', 401)
    );
  }
  // grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perfom this action', 403)
      );
    }
    next();
  };
};

// user sends a post request to a forgot password route with his email
// which therefore creates a reset token and sent to the email that was provided
// the user then sends that token from his email along with a new password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }
  // generate a random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({ status: 'success', message: 'Token sent to email' });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Please try again later.',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // if token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 404));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // update changedPasswordAt property for the current user

  // log the uer in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // get the user from collection
  const user = await User.findById(req.user.id).select('+password');
  // check if the posted passward is correct
  const { passwordCurrent, password, passwordConfirm } = req.body;
  const isCurrentPwdCorrect = await user.correctPassword(
    passwordCurrent,
    user.password
  );

  if (!isCurrentPwdCorrect) {
    return next(new AppError('Your current password is wrong', 401));
  }
  // if so, update the password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save(); //  User.findByIdAndUpdate will NOT work as intended!

  createSendToken(user, 200, res);
});

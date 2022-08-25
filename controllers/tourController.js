const fs = require('fs');
const { StatusCodes } = require('http-status-codes');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(StatusCodes.OK).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

exports.getTour = (req, res) => {
  const id = parseInt(req.params.id);
  let tour = tours.find((tour) => tour.id === id);
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(StatusCodes.OK).json({ status: 'success', date: { tour } });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) =>
      res.status(StatusCodes.CREATED).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      })
  );
};

exports.updateTour = (req, res) => {
  let id = +req.params.id;
  if (id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  let updatedTour = req.body;
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      tour: updatedTour,
    },
  });
};

exports.deleteTour = (req, res) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
};

const fs = require('fs');
const express = require('express');
const app = express();
const { StatusCodes } = require('http-status-codes');

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ status: 'success', results: tours.length, data: { tours } });
});

app.get('/api/v1/tours/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let tour = tours.find((tour) => tour.id === id);
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(StatusCodes.OK).json({ status: 'success', date: { tour } });
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
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
});

app.delete('/api/v1/tours/:id', (req, res) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

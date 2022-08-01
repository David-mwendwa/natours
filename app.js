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

const port = 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

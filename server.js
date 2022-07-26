const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

// handle error that occur in synchronous code but are no handled anywhere
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log(`UNCAUGHT EXCEPTION! Shutting down...`);
  process.exit(1);
});

dotenv.config({ path: './config.env' }); //specify where config.env is located

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => console.log('DB connection successfull'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// handle errors occuring outside express
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log(`UNHANDLED REJECTION! Shutting down...`);
  server.close(() => process.exit(1));
});

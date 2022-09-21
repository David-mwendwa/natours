const express = require('express');
const { getOverview, getTour } = require('../controllers/viewsController');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).render('base', { tour: 'The Forest Hiker', user: 'David' });
});

router.get('/overview', getOverview);

router.get('/tour', getTour);

module.exports = router;

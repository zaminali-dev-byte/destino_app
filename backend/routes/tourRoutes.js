const express = require('express');
const router = express.Router();
const { getTours, getTourById } = require('../controllers/tourController');

router.get('/', getTours);
router.get('/:id', getTourById);

module.exports = router;
